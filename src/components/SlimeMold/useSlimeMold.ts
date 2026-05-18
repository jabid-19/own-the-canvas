import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

export interface UseSlimeMoldOptions {
  agentCount: number;
  sensorAngle: number;
  sensorDistance: number;
  stepSize: number;
  rotateSpeed: number;
  trailDecay: number;
  diffuseStrength: number;
  trailColor: string;
  backgroundColor: string;
  resolution: number;
  interactive: boolean;
  mouseRadius: number;
  mouseStrength: number;
  animated: boolean;
}

const TAU = Math.PI * 2;

interface SlimeMoldState {
  agents: Float32Array;  // packed x, y, angle per agent
  trail: Float32Array;
  nextTrail: Float32Array;
  gridW: number;
  gridH: number;
  imageData: ImageData | null;
  offscreen: OffscreenCanvas | null;
  offCtx: OffscreenCanvasRenderingContext2D | null;
  mouseGX: number;
  mouseGY: number;
  mouseActive: boolean;
}

export function useSlimeMold(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseSlimeMoldOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    const stateRef: SlimeMoldState = {
      agents: new Float32Array(0),
      trail: new Float32Array(0),
      nextTrail: new Float32Array(0),
      gridW: 0,
      gridH: 0,
      imageData: null,
      offscreen: null,
      offCtx: null,
      mouseGX: 0,
      mouseGY: 0,
      mouseActive: false,
    };

    function sampleTrail(trail: Float32Array, gw: number, gh: number, x: number, y: number): number {
      const ix = Math.round(x);
      const iy = Math.round(y);
      if (ix < 0 || ix >= gw || iy < 0 || iy >= gh) return 0;
      return trail[iy * gw + ix];
    }

    function initState(width: number, height: number) {
      const { resolution, agentCount } = optionsRef.current;
      const gw = Math.max(1, Math.round(width * resolution));
      const gh = Math.max(1, Math.round(height * resolution));
      stateRef.gridW = gw;
      stateRef.gridH = gh;

      stateRef.trail = new Float32Array(gw * gh);
      stateRef.nextTrail = new Float32Array(gw * gh);

      // init agents in a circle in the center
      const n = agentCount;
      stateRef.agents = new Float32Array(n * 3);
      const cx = gw / 2;
      const cy = gh / 2;
      const r = Math.min(gw, gh) * 0.25;
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * TAU;
        const rad = Math.random() * r;
        stateRef.agents[i * 3]     = cx + Math.cos(angle) * rad;
        stateRef.agents[i * 3 + 1] = cy + Math.sin(angle) * rad;
        stateRef.agents[i * 3 + 2] = Math.random() * TAU; // heading
      }

      const off = new OffscreenCanvas(gw, gh);
      const offCtx = off.getContext("2d")!;
      stateRef.offscreen = off;
      stateRef.offCtx = offCtx;
      stateRef.imageData = offCtx.createImageData(gw, gh);
    }

    function resize(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      w = width;
      h = height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initState(w, h);
    }

    // Mouse
    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const rect = canvas!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const { resolution } = optionsRef.current;
      stateRef.mouseGX = cx * resolution;
      stateRef.mouseGY = cy * resolution;
      stateRef.mouseActive = true;
    }

    function onMouseLeave() {
      stateRef.mouseActive = false;
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let lastTime = 0;
    let prevResolution = -1;
    let prevAgentCount = -1;

    function draw(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const {
        agentCount, sensorAngle, sensorDistance, stepSize,
        rotateSpeed, trailDecay, diffuseStrength,
        trailColor, backgroundColor, resolution,
        interactive, mouseRadius, mouseStrength, animated,
      } = optionsRef.current;

      if (resolution !== prevResolution) {
        initState(w, h);
        prevResolution = resolution;
        prevAgentCount = agentCount;
      } else if (agentCount !== prevAgentCount) {
        // resize agents array
        const n = agentCount;
        const old = stateRef.agents;
        const next = new Float32Array(n * 3);
        const gw = stateRef.gridW;
        const gh = stateRef.gridH;
        if (n > old.length / 3) {
          next.set(old);
          for (let i = old.length / 3; i < n; i++) {
            const angle = Math.random() * TAU;
            const rad = Math.random() * Math.min(gw, gh) * 0.25;
            next[i * 3]     = gw / 2 + Math.cos(angle) * rad;
            next[i * 3 + 1] = gh / 2 + Math.sin(angle) * rad;
            next[i * 3 + 2] = Math.random() * TAU;
          }
        } else {
          next.set(old.subarray(0, n * 3));
        }
        stateRef.agents = next;
        prevAgentCount = agentCount;
      }

      if (!animated) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const { agents, trail, nextTrail, gridW, gridH, imageData, offscreen, offCtx } = stateRef;
      if (!imageData || !offscreen || !offCtx) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const sensorAngleRad = sensorAngle * Math.PI / 180;
      const rotSpeedRad = rotateSpeed * Math.PI / 180;

      const n = agentCount;

      // 1. Deposit
      for (let i = 0; i < n; i++) {
        const ax = agents[i * 3];
        const ay = agents[i * 3 + 1];
        const gx = Math.round(ax);
        const gy = Math.round(ay);
        if (gx >= 0 && gx < gridW && gy >= 0 && gy < gridH) {
          trail[gy * gridW + gx] += 1;
        }
      }

      // 2. Mouse pheromone deposit
      if (interactive && stateRef.mouseActive) {
        const mr = mouseRadius * resolution;
        const mrSq = mr * mr;
        const mgx = stateRef.mouseGX;
        const mgy = stateRef.mouseGY;
        const minX = Math.max(0, Math.floor(mgx - mr));
        const maxX = Math.min(gridW - 1, Math.ceil(mgx + mr));
        const minY = Math.max(0, Math.floor(mgy - mr));
        const maxY = Math.min(gridH - 1, Math.ceil(mgy + mr));
        for (let gy = minY; gy <= maxY; gy++) {
          for (let gx = minX; gx <= maxX; gx++) {
            const dx = gx - mgx;
            const dy = gy - mgy;
            if (dx * dx + dy * dy <= mrSq) {
              trail[gy * gridW + gx] += mouseStrength;
            }
          }
        }
      }

      // 3. Diffuse + decay
      const ds = diffuseStrength;
      const oneMinusDs = 1 - ds;
      for (let py = 0; py < gridH; py++) {
        for (let px = 0; px < gridW; px++) {
          let sum = 0;
          let count = 0;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = px + dx;
              const ny = py + dy;
              if (nx >= 0 && nx < gridW && ny >= 0 && ny < gridH) {
                sum += trail[ny * gridW + nx];
                count++;
              }
            }
          }
          nextTrail[py * gridW + px] = (trail[py * gridW + px] * oneMinusDs + (sum / count) * ds) * trailDecay;
        }
      }
      // swap buffers
      const tmp = stateRef.trail;
      stateRef.trail = stateRef.nextTrail;
      stateRef.nextTrail = tmp;
      // update local refs after swap
      const trailCurrent = stateRef.trail;

      // 4. Sense + rotate + move
      for (let i = 0; i < n; i++) {
        const ax = agents[i * 3];
        const ay = agents[i * 3 + 1];
        const angle = agents[i * 3 + 2];

        const sFL = sampleTrail(trailCurrent, gridW, gridH,
          ax + Math.cos(angle - sensorAngleRad) * sensorDistance,
          ay + Math.sin(angle - sensorAngleRad) * sensorDistance);
        const sF  = sampleTrail(trailCurrent, gridW, gridH,
          ax + Math.cos(angle) * sensorDistance,
          ay + Math.sin(angle) * sensorDistance);
        const sFR = sampleTrail(trailCurrent, gridW, gridH,
          ax + Math.cos(angle + sensorAngleRad) * sensorDistance,
          ay + Math.sin(angle + sensorAngleRad) * sensorDistance);

        let newAngle = angle;
        if (sF > sFL && sF > sFR) {
          // keep heading
        } else if (sFL > sFR) {
          newAngle -= rotSpeedRad;
        } else if (sFR > sFL) {
          newAngle += rotSpeedRad;
        } else {
          newAngle += (Math.random() - 0.5) * rotSpeedRad;
        }
        // random jitter
        newAngle += (Math.random() - 0.5) * 0.1;

        // move
        let nx = ax + Math.cos(newAngle) * stepSize;
        let ny = ay + Math.sin(newAngle) * stepSize;

        // wrap at edges
        if (nx < 0) nx += gridW;
        if (nx >= gridW) nx -= gridW;
        if (ny < 0) ny += gridH;
        if (ny >= gridH) ny -= gridH;

        agents[i * 3]     = nx;
        agents[i * 3 + 1] = ny;
        agents[i * 3 + 2] = newAngle;
      }

      // 5. Render
      const data = imageData.data;
      const maxTrail = 5;
      for (let py = 0; py < gridH; py++) {
        for (let px = 0; px < gridW; px++) {
          const v = Math.min(trailCurrent[py * gridW + px] / maxTrail, 1);
          const [cr, cg, cb] = sampleGradient([backgroundColor, trailColor], v);
          const off = (py * gridW + px) * 4;
          data[off] = cr;
          data[off + 1] = cg;
          data[off + 2] = cb;
          data[off + 3] = 255;
        }
      }

      offCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(offscreen, 0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
