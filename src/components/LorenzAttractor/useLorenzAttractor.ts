import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

export type ColorMode = "solid" | "age" | "cycle";

export interface UseLorenzAttractorOptions {
  sigma: number;
  rho: number;
  beta: number;
  traceColor: string;
  backgroundColor: string;
  trailLength: number;
  speed: number;
  rotationSpeed: number;
  lineWidth: number;
  glowEffect: boolean;
  glowBlur: number;
  interactive: boolean;
  scale: number;
  colorMode: ColorMode;
  animated: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function rk4Step(
  x: number,
  y: number,
  z: number,
  dt: number,
  sigma: number,
  rho: number,
  beta: number
): Point3D {
  const dxf = (x2: number, y2: number) => sigma * (y2 - x2);
  const dyf = (x2: number, y2: number, z2: number) => x2 * (rho - z2) - y2;
  const dzf = (x2: number, y2: number, z2: number) => x2 * y2 - beta * z2;

  const k1x = dxf(x, y);
  const k1y = dyf(x, y, z);
  const k1z = dzf(x, y, z);

  const k2x = dxf(x + (dt / 2) * k1x, y + (dt / 2) * k1y);
  const k2y = dyf(x + (dt / 2) * k1x, y + (dt / 2) * k1y, z + (dt / 2) * k1z);
  const k2z = dzf(x + (dt / 2) * k1x, y + (dt / 2) * k1y, z + (dt / 2) * k1z);

  const k3x = dxf(x + (dt / 2) * k2x, y + (dt / 2) * k2y);
  const k3y = dyf(x + (dt / 2) * k2x, y + (dt / 2) * k2y, z + (dt / 2) * k2z);
  const k3z = dzf(x + (dt / 2) * k2x, y + (dt / 2) * k2y, z + (dt / 2) * k2z);

  const k4x = dxf(x + dt * k3x, y + dt * k3y);
  const k4y = dyf(x + dt * k3x, y + dt * k3y, z + dt * k3z);
  const k4z = dzf(x + dt * k3x, y + dt * k3y, z + dt * k3z);

  return {
    x: x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    y: y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y),
    z: z + (dt / 6) * (k1z + 2 * k2z + 2 * k3z + k4z),
  };
}

function project(
  p: Point3D,
  rotX: number,
  rotY: number,
  scale: number,
  cx: number,
  cy: number
): [number, number] {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);

  const rx = p.x * cosY - p.z * sinY;
  const ry = p.x * sinX * sinY + p.y * cosX + p.z * sinX * cosY;

  return [cx + rx * scale, cy - ry * scale];
}

export function useLorenzAttractor(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseLorenzAttractorOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // trail ring buffer (attractor A)
  const trailRef = useRef<Point3D[]>([]);
  const headRef = useRef(0); // next write index
  const countRef = useRef(0); // filled count

  // integrator state (attractor A)
  const posRef = useRef<Point3D>({ x: 0.1, y: 0, z: 0 });

  // trail ring buffer (attractor B — diverging twin)
  const trailBRef = useRef<Point3D[]>([]);
  const headBRef = useRef(0);
  const countBRef = useRef(0);

  // integrator state (attractor B)
  const posBRef = useRef<Point3D>({ x: 0.1 + 1e-7, y: 1e-7 * 0.5, z: 1e-7 * 0.7 });

  // rotation state
  const rotXRef = useRef(0.3);
  const rotYRef = useRef(0);
  const autoRotatingRef = useRef(true);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // drag state
  const draggingRef = useRef(false);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  // cycle hue state
  const cycleHueRef = useRef(0);

  // reset seed counter
  const seedOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;

    function resetTrail() {
      const { trailLength } = optionsRef.current;
      // Reset attractor A
      trailRef.current = new Array(trailLength);
      headRef.current = 0;
      countRef.current = 0;
      seedOffsetRef.current += 1;
      const off = seedOffsetRef.current * 0.03;
      posRef.current = { x: 0.1 + off, y: off * 0.5, z: off * 0.7 };
      // Reset attractor B with the same seed plus a tiny epsilon
      const eps = 1e-7;
      trailBRef.current = new Array(trailLength);
      headBRef.current = 0;
      countBRef.current = 0;
      posBRef.current = { x: 0.1 + off + eps, y: off * 0.5 + eps * 0.5, z: off * 0.7 + eps * 0.7 };
    }

    resetTrail();

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = width;
      h = height;
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    // Mouse interaction
    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      draggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      canvas!.style.cursor = "grabbing";
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      autoRotatingRef.current = false;
    }

    function onMouseMove(e: MouseEvent) {
      if (!draggingRef.current || !lastMouseRef.current) return;
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      rotYRef.current += dx * 0.005;
      rotXRef.current += dy * 0.005;
      rotXRef.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotXRef.current));
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      lastMouseRef.current = null;
      canvas!.style.cursor = "grab";
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        autoRotatingRef.current = true;
        resumeTimerRef.current = null;
      }, 2000);
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);

    let rafId = 0;

    function drawFrame() {
      const {
        sigma,
        rho,
        beta,
        traceColor,
        backgroundColor,
        trailLength,
        speed,
        rotationSpeed,
        lineWidth,
        glowEffect,
        glowBlur,
        scale: scaleMultiplier,
        colorMode,
      } = optionsRef.current;

      // ---- resize trail buffer if trailLength changed ----
      if (trailRef.current.length !== trailLength) {
        resetTrail();
      }

      // ---- integrate new points ----
      const stepsPerFrame = Math.max(1, Math.round(10 * speed));
      const dt = 0.005;
      const buf = trailRef.current;
      const maxPoints = trailLength;

      for (let s = 0; s < stepsPerFrame; s++) {
        const next = rk4Step(
          posRef.current.x,
          posRef.current.y,
          posRef.current.z,
          dt,
          sigma,
          rho,
          beta
        );
        posRef.current = next;
        buf[headRef.current] = { ...next };
        headRef.current = (headRef.current + 1) % maxPoints;
        if (countRef.current < maxPoints) countRef.current++;
      }

      // ---- integrate attractor B ----
      const bufB = trailBRef.current;
      for (let s = 0; s < stepsPerFrame; s++) {
        const next = rk4Step(
          posBRef.current.x,
          posBRef.current.y,
          posBRef.current.z,
          dt,
          sigma,
          rho,
          beta
        );
        posBRef.current = next;
        bufB[headBRef.current] = { ...next };
        headBRef.current = (headBRef.current + 1) % maxPoints;
        if (countBRef.current < maxPoints) countBRef.current++;
      }

      // ---- check for reset ----
      if (countRef.current >= maxPoints) {
        resetTrail();
      }

      // ---- rotation ----
      if (autoRotatingRef.current) {
        rotYRef.current += rotationSpeed;
      }

      // ---- cycle hue ----
      cycleHueRef.current = (cycleHueRef.current + 0.3) % 360;

      // ---- clear ----
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      if (countRef.current < 2) return;

      // ---- compute adaptive scale ----
      const baseScale = (Math.min(w, h) * 0.75) / 40;
      const finalScale = baseScale * scaleMultiplier;
      const cx = w / 2;
      // Center the attractor: z ranges ~[0,50], center around z=25
      // shift cy up a bit to better center the butterfly visually
      const cy = h * 0.5;

      // Shift attractor center: offset y to compensate for z=25 avg
      // We use a virtual center point at (0, 0, 25) projected to 2D
      const [offsetX, offsetY] = project({ x: 0, y: 0, z: 25 }, rotXRef.current, rotYRef.current, finalScale, cx, cy);
      const drawCx = cx + (cx - offsetX);
      const drawCy = cy + (cy - offsetY);

      // ---- glow setup ----
      if (glowEffect) {
        ctx.shadowBlur = glowBlur;
        ctx.shadowColor = traceColor;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // ---- build ordered trail (oldest → newest) ----
      const n = countRef.current;
      const tail = (headRef.current - n + maxPoints) % maxPoints;

      // Draw in segments of ~50 for opacity gradation
      const segSize = 50;
      const rgb = hexToRgbString(traceColor);

      for (let start = 0; start < n - 1; start += segSize) {
        const end = Math.min(start + segSize, n - 1);
        const segMid = (start + end) / 2;
        const ageFrac = segMid / (n - 1); // 0 = oldest, 1 = newest

        let strokeStyle: string;
        if (colorMode === "solid") {
          strokeStyle = `rgba(${rgb},${0.15 + ageFrac * 0.85})`;
        } else if (colorMode === "age") {
          // oldest points almost invisible, newest fully opaque
          const opacity = Math.pow(ageFrac, 1.5) * 0.95 + 0.03;
          strokeStyle = `rgba(${rgb},${opacity})`;
        } else {
          // cycle: hue shifts along the trail + global rotation
          const hue = (cycleHueRef.current + ageFrac * 180) % 360;
          const opacity = Math.pow(ageFrac, 1.2) * 0.95 + 0.05;
          strokeStyle = `hsla(${hue},100%,65%,${opacity})`;
        }

        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;

        for (let i = start; i <= end; i++) {
          const idx = (tail + i) % maxPoints;
          const pt = buf[idx];
          if (!pt) continue;
          const [sx, sy] = project(pt, rotXRef.current, rotYRef.current, finalScale, drawCx, drawCy);
          if (i === start) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.stroke();
      }

      // ---- draw a bright dot at the current tip (A) ----
      const tipIdx = (headRef.current - 1 + maxPoints) % maxPoints;
      const tip = buf[tipIdx];
      if (tip) {
        const [tx, ty] = project(tip, rotXRef.current, rotYRef.current, finalScale, drawCx, drawCy);
        ctx.beginPath();
        ctx.arc(tx, ty, lineWidth * 1.8, 0, Math.PI * 2);
        if (colorMode === "cycle") {
          ctx.fillStyle = `hsla(${cycleHueRef.current},100%,80%,1)`;
        } else {
          ctx.fillStyle = `rgba(${rgb},1)`;
        }
        ctx.fill();
      }

      // ---- draw trail B (diverging twin) ----
      if (countBRef.current < 2) return;

      const nB = countBRef.current;
      const tailB = (headBRef.current - nB + maxPoints) % maxPoints;

      for (let start = 0; start < nB - 1; start += segSize) {
        const end = Math.min(start + segSize, nB - 1);
        const segMid = (start + end) / 2;
        const ageFrac = segMid / (nB - 1);

        let strokeStyleB: string;
        if (colorMode === "solid") {
          // Contrasting accent: fixed cyan-teal hue
          const opacity = 0.15 + ageFrac * 0.85;
          strokeStyleB = `hsla(180,80%,60%,${opacity})`;
        } else if (colorMode === "age") {
          const opacity = Math.pow(ageFrac, 1.5) * 0.95 + 0.03;
          strokeStyleB = `hsla(180,80%,60%,${opacity})`;
        } else {
          // cycle: shift hue by 180 relative to trail A
          const hue = (cycleHueRef.current + 180 + ageFrac * 180) % 360;
          const opacity = Math.pow(ageFrac, 1.2) * 0.95 + 0.05;
          strokeStyleB = `hsla(${hue},100%,65%,${opacity})`;
        }

        ctx.beginPath();
        ctx.strokeStyle = strokeStyleB;

        for (let i = start; i <= end; i++) {
          const idx = (tailB + i) % maxPoints;
          const pt = bufB[idx];
          if (!pt) continue;
          const [sx, sy] = project(pt, rotXRef.current, rotYRef.current, finalScale, drawCx, drawCy);
          if (i === start) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.stroke();
      }

      // ---- draw a bright dot at the current tip (B) ----
      const tipBIdx = (headBRef.current - 1 + maxPoints) % maxPoints;
      const tipB = bufB[tipBIdx];
      if (tipB) {
        const [tx, ty] = project(tipB, rotXRef.current, rotYRef.current, finalScale, drawCx, drawCy);
        ctx.beginPath();
        ctx.arc(tx, ty, lineWidth * 1.8, 0, Math.PI * 2);
        if (colorMode === "cycle") {
          ctx.fillStyle = `hsla(${(cycleHueRef.current + 180) % 360},100%,80%,1)`;
        } else {
          ctx.fillStyle = `hsla(180,80%,70%,1)`;
        }
        ctx.fill();
      }
    }

    function loop() {
      if (optionsRef.current.animated) drawFrame();
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
  }, [canvasRef]);
}
