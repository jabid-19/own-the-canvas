import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

export type VoronoiColorMode = "solid" | "gradient" | "cycle";

export interface UseVoronoiCellsOptions {
  cellCount: number;
  speed: number;
  colorMode: VoronoiColorMode;
  cellColor: string;
  backgroundColor: string;
  showEdges: boolean;
  edgeColor: string;
  resolution: number;
  relaxation: number;
  interactive: boolean;
  animated: boolean;
}

interface Seed {
  gx: number; // grid coordinates
  gy: number;
  vx: number;
  vy: number;
  hue: number;
}

interface VoronoiState {
  seeds: Seed[];
  gridW: number;
  gridH: number;
  cellIds: Int16Array;
  imageData: ImageData | null;
  offscreen: OffscreenCanvas | null;
  offCtx: OffscreenCanvasRenderingContext2D | null;
  dragIdx: number;
  isDragging: boolean;
  mouseGX: number;
  mouseGY: number;
}

function buildSeedColors(seeds: Seed[], colorMode: VoronoiColorMode, cellColor: string): [number, number, number][] {
  return seeds.map((s, i) => {
    if (colorMode === "cycle") {
      const h = s.hue;
      // hsl to rgb approximation
      const hue6 = (h / 60) % 6;
      const f = hue6 - Math.floor(hue6);
      const p = 0, q = Math.round(255 * (1 - f) * 0.75), t2 = Math.round(255 * f * 0.75);
      const v = 192;
      const sector = Math.floor(hue6);
      const rgb: [number, number, number] = (() => {
        switch (sector) {
          case 0: return [v, t2, p];
          case 1: return [q, v, p];
          case 2: return [p, v, t2];
          case 3: return [p, q, v];
          case 4: return [t2, p, v];
          default: return [v, p, q];
        }
      })();
      return rgb;
    }
    if (colorMode === "gradient") {
      const t = i / Math.max(1, seeds.length - 1);
      return sampleGradient([cellColor, "#6b7280"], t);
    }
    return sampleGradient([cellColor], 0);
  });
}

export function useVoronoiCells(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseVoronoiCellsOptions
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

    const stateRef: VoronoiState = {
      seeds: [],
      gridW: 0,
      gridH: 0,
      cellIds: new Int16Array(0),
      imageData: null,
      offscreen: null,
      offCtx: null,
      dragIdx: -1,
      isDragging: false,
      mouseGX: 0,
      mouseGY: 0,
    };

    function initSeeds(gw: number, gh: number, count: number) {
      const seeds: Seed[] = [];
      for (let i = 0; i < count; i++) {
        seeds.push({
          gx: Math.random() * gw,
          gy: Math.random() * gh,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          hue: (i / count) * 360,
        });
      }
      return seeds;
    }

    function initGrid(width: number, height: number) {
      const { resolution, cellCount } = optionsRef.current;
      const gw = Math.max(1, Math.round(width * resolution));
      const gh = Math.max(1, Math.round(height * resolution));
      stateRef.gridW = gw;
      stateRef.gridH = gh;
      stateRef.cellIds = new Int16Array(gw * gh);
      const off = new OffscreenCanvas(gw, gh);
      const offCtx = off.getContext("2d")!;
      stateRef.offscreen = off;
      stateRef.offCtx = offCtx;
      stateRef.imageData = offCtx.createImageData(gw, gh);
      if (stateRef.seeds.length === 0) {
        stateRef.seeds = initSeeds(gw, gh, cellCount);
      } else {
        // rescale existing seeds
        const oldGW = stateRef.gridW || gw;
        const oldGH = stateRef.gridH || gh;
        for (const s of stateRef.seeds) {
          s.gx = (s.gx / oldGW) * gw;
          s.gy = (s.gy / oldGH) * gh;
        }
      }
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
      initGrid(w, h);
    }

    // Mouse events
    let isMouseDown = false;
    let mouseDownGX = 0;
    let mouseDownGY = 0;

    function canvasToGrid(cx: number, cy: number): [number, number] {
      const { resolution } = optionsRef.current;
      return [cx * resolution, cy * resolution];
    }

    function findNearestSeed(gx: number, gy: number): number {
      let best = -1;
      let bestDist = Infinity;
      for (let i = 0; i < stateRef.seeds.length; i++) {
        const s = stateRef.seeds[i];
        const dx = gx - s.gx;
        const dy = gy - s.gy;
        const d = dx * dx + dy * dy;
        if (d < bestDist) { bestDist = d; best = i; }
      }
      return best;
    }

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const rect = canvas!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const [gx, gy] = canvasToGrid(cx, cy);
      mouseDownGX = gx;
      mouseDownGY = gy;
      isMouseDown = true;

      const nearest = findNearestSeed(gx, gy);
      if (nearest >= 0) {
        const s = stateRef.seeds[nearest];
        const dx = gx - s.gx;
        const dy = gy - s.gy;
        const thresholdSq = (stateRef.gridW * 0.15) ** 2;
        if (dx * dx + dy * dy < thresholdSq) {
          stateRef.dragIdx = nearest;
          stateRef.isDragging = true;
        }
      }
      stateRef.mouseGX = gx;
      stateRef.mouseGY = gy;
    }

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const rect = canvas!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const [gx, gy] = canvasToGrid(cx, cy);
      stateRef.mouseGX = gx;
      stateRef.mouseGY = gy;

      if (isMouseDown && stateRef.isDragging && stateRef.dragIdx >= 0) {
        stateRef.seeds[stateRef.dragIdx].gx = Math.max(0, Math.min(stateRef.gridW - 1, gx));
        stateRef.seeds[stateRef.dragIdx].gy = Math.max(0, Math.min(stateRef.gridH - 1, gy));
      }
    }

    function onMouseUp(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const rect = canvas!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const [gx, gy] = canvasToGrid(cx, cy);

      const moved = Math.abs(gx - mouseDownGX) + Math.abs(gy - mouseDownGY);
      if (!stateRef.isDragging && moved < 2) {
        // add new seed on click (if not at drag distance of existing seed)
        const { cellCount } = optionsRef.current;
        if (stateRef.seeds.length < cellCount * 2) {
          const newHue = (stateRef.seeds.length / (cellCount || 1)) * 360;
          stateRef.seeds.push({
            gx: Math.max(0, Math.min(stateRef.gridW - 1, gx)),
            gy: Math.max(0, Math.min(stateRef.gridH - 1, gy)),
            vx: 0, vy: 0, hue: newHue,
          });
        }
      }

      isMouseDown = false;
      stateRef.isDragging = false;
      stateRef.dragIdx = -1;
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let lastTime = 0;
    let prevResolution = -1;
    let prevCellCount = -1;

    function draw(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const {
        cellCount, speed, colorMode, cellColor, backgroundColor,
        showEdges, edgeColor, resolution, relaxation, animated,
      } = optionsRef.current;

      if (resolution !== prevResolution) {
        stateRef.seeds = [];
        initGrid(w, h);
        prevResolution = resolution;
        prevCellCount = cellCount;
      } else if (cellCount !== prevCellCount) {
        if (cellCount > stateRef.seeds.length) {
          const { gridW, gridH } = stateRef;
          while (stateRef.seeds.length < cellCount) {
            const i = stateRef.seeds.length;
            stateRef.seeds.push({
              gx: Math.random() * gridW,
              gy: Math.random() * gridH,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              hue: (i / cellCount) * 360,
            });
          }
        } else {
          stateRef.seeds.length = cellCount;
        }
        prevCellCount = cellCount;
      }

      const { seeds, gridW, gridH, imageData, offscreen, offCtx, cellIds } = stateRef;
      if (!imageData || !offscreen || !offCtx || seeds.length === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // drift seeds
      if (animated) {
        const dtNorm = dt / 16;
        for (const s of seeds) {
          if (stateRef.isDragging && seeds.indexOf(s) === stateRef.dragIdx) continue;
          s.vx += (Math.random() - 0.5) * 0.05 * speed;
          s.vy += (Math.random() - 0.5) * 0.05 * speed;
          s.vx = Math.max(-0.5 * speed, Math.min(0.5 * speed, s.vx));
          s.vy = Math.max(-0.5 * speed, Math.min(0.5 * speed, s.vy));
          s.gx += s.vx * dtNorm;
          s.gy += s.vy * dtNorm;
          // bounce
          if (s.gx < 0) { s.gx = 0; s.vx = Math.abs(s.vx); }
          if (s.gx >= gridW) { s.gx = gridW - 1; s.vx = -Math.abs(s.vx); }
          if (s.gy < 0) { s.gy = 0; s.vy = Math.abs(s.vy); }
          if (s.gy >= gridH) { s.gy = gridH - 1; s.vy = -Math.abs(s.vy); }
        }
      }

      // build colors per seed
      const colors = buildSeedColors(seeds, colorMode, cellColor);
      const [bgR, bgG, bgB] = sampleGradient([backgroundColor], 0);
      const [edR, edG, edB] = sampleGradient([edgeColor], 0);

      const data = imageData.data;

      // nearest-seed pixel loop
      for (let py = 0; py < gridH; py++) {
        for (let px = 0; px < gridW; px++) {
          let minDist = Infinity;
          let minIdx = 0;
          for (let si = 0; si < seeds.length; si++) {
            const dx = px - seeds[si].gx;
            const dy = py - seeds[si].gy;
            const d = dx * dx + dy * dy;
            if (d < minDist) { minDist = d; minIdx = si; }
          }
          cellIds[py * gridW + px] = minIdx;
          const [cr, cg, cb] = colors[minIdx];
          const off = (py * gridW + px) * 4;
          data[off] = cr;
          data[off + 1] = cg;
          data[off + 2] = cb;
          data[off + 3] = 255;
        }
      }

      // Lloyd relaxation
      if (animated && relaxation > 0) {
        const cxSum = new Float32Array(seeds.length);
        const cySum = new Float32Array(seeds.length);
        const counts = new Uint32Array(seeds.length);
        for (let py = 0; py < gridH; py++) {
          for (let px = 0; px < gridW; px++) {
            const ci = cellIds[py * gridW + px];
            cxSum[ci] += px;
            cySum[ci] += py;
            counts[ci]++;
          }
        }
        for (let si = 0; si < seeds.length; si++) {
          if (stateRef.isDragging && si === stateRef.dragIdx) continue;
          if (counts[si] > 0) {
            seeds[si].gx += (cxSum[si] / counts[si] - seeds[si].gx) * relaxation;
            seeds[si].gy += (cySum[si] / counts[si] - seeds[si].gy) * relaxation;
          }
        }
      }

      // edge detection pass
      if (showEdges) {
        for (let py = 0; py < gridH; py++) {
          for (let px = 0; px < gridW; px++) {
            const id = cellIds[py * gridW + px];
            const isEdge =
              (px > 0 && cellIds[py * gridW + px - 1] !== id) ||
              (py > 0 && cellIds[(py - 1) * gridW + px] !== id);
            if (isEdge) {
              const off = (py * gridW + px) * 4;
              data[off] = edR;
              data[off + 1] = edG;
              data[off + 2] = edB;
              data[off + 3] = 255;
            }
          }
        }
      }

      offCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(offscreen, 0, 0, w, h);

      // draw seed markers
      if (optionsRef.current.interactive) {
        ctx.save();
        for (let si = 0; si < seeds.length; si++) {
          const sx = (seeds[si].gx / gridW) * w;
          const sy = (seeds[si].gy / gridH) * h;
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.fill();
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
  }, [canvasRef]);
}
