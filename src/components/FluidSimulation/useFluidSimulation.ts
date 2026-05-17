import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

// Simplified 2D fluid simulation (Jos Stam "Real-Time Fluid Dynamics for Games")
// Grid-based Eulerian approach with velocity diffusion, advection, and pressure projection

export interface UseFluidSimulationOptions {
  resolution: number; // grid cells (lower = faster)
  viscosity: number;
  diffusion: number;
  dissipation: number;
  inkColors: string[];
  glowEffect: boolean;
  glowBlur: number;
  backgroundColor: string;
  autoInk: boolean;
  autoInkInterval: number;
  mouseForce: number;
  inkRadius: number;
}

function idx(x: number, y: number, N: number) {
  return Math.min(x, N - 1) + Math.min(y, N - 1) * N;
}

function diffuse(N: number, b: number, x: Float32Array, x0: Float32Array, diff: number, dt: number) {
  const a = dt * diff * N * N;
  const c = 1 + 4 * a;
  for (let k = 0; k < 4; k++) {
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        x[idx(i, j, N)] = (x0[idx(i, j, N)] + a * (
          x[idx(i - 1, j, N)] + x[idx(i + 1, j, N)] +
          x[idx(i, j - 1, N)] + x[idx(i, j + 1, N)]
        )) / c;
      }
    }
    setBoundary(N, b, x);
  }
}

function advect(N: number, b: number, d: Float32Array, d0: Float32Array, u: Float32Array, v: Float32Array, dt: number) {
  const dt0 = dt * N;
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      let x = i - dt0 * u[idx(i, j, N)];
      let y = j - dt0 * v[idx(i, j, N)];
      x = Math.max(0.5, Math.min(N - 1.5, x));
      y = Math.max(0.5, Math.min(N - 1.5, y));
      const i0 = Math.floor(x); const i1 = i0 + 1;
      const j0 = Math.floor(y); const j1 = j0 + 1;
      const s1 = x - i0; const s0 = 1 - s1;
      const t1 = y - j0; const t0 = 1 - t1;
      d[idx(i, j, N)] =
        s0 * (t0 * d0[idx(i0, j0, N)] + t1 * d0[idx(i0, j1, N)]) +
        s1 * (t0 * d0[idx(i1, j0, N)] + t1 * d0[idx(i1, j1, N)]);
    }
  }
  setBoundary(N, b, d);
}

function project(N: number, u: Float32Array, v: Float32Array, p: Float32Array, div: Float32Array) {
  const h = 1.0 / N;
  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      div[idx(i, j, N)] = -0.5 * h * (
        u[idx(i + 1, j, N)] - u[idx(i - 1, j, N)] +
        v[idx(i, j + 1, N)] - v[idx(i, j - 1, N)]
      );
      p[idx(i, j, N)] = 0;
    }
  }
  setBoundary(N, 0, div);
  setBoundary(N, 0, p);

  for (let k = 0; k < 4; k++) {
    for (let j = 1; j < N - 1; j++) {
      for (let i = 1; i < N - 1; i++) {
        p[idx(i, j, N)] = (div[idx(i, j, N)] +
          p[idx(i - 1, j, N)] + p[idx(i + 1, j, N)] +
          p[idx(i, j - 1, N)] + p[idx(i, j + 1, N)]) / 4;
      }
    }
    setBoundary(N, 0, p);
  }

  for (let j = 1; j < N - 1; j++) {
    for (let i = 1; i < N - 1; i++) {
      u[idx(i, j, N)] -= 0.5 * (p[idx(i + 1, j, N)] - p[idx(i - 1, j, N)]) / h;
      v[idx(i, j, N)] -= 0.5 * (p[idx(i, j + 1, N)] - p[idx(i, j - 1, N)]) / h;
    }
  }
  setBoundary(N, 1, u);
  setBoundary(N, 2, v);
}

function setBoundary(N: number, b: number, x: Float32Array) {
  for (let i = 1; i < N - 1; i++) {
    x[idx(0, i, N)] = b === 1 ? -x[idx(1, i, N)] : x[idx(1, i, N)];
    x[idx(N - 1, i, N)] = b === 1 ? -x[idx(N - 2, i, N)] : x[idx(N - 2, i, N)];
    x[idx(i, 0, N)] = b === 2 ? -x[idx(i, 1, N)] : x[idx(i, 1, N)];
    x[idx(i, N - 1, N)] = b === 2 ? -x[idx(i, N - 2, N)] : x[idx(i, N - 2, N)];
  }
  x[idx(0, 0, N)] = 0.5 * (x[idx(1, 0, N)] + x[idx(0, 1, N)]);
  x[idx(N - 1, 0, N)] = 0.5 * (x[idx(N - 2, 0, N)] + x[idx(N - 1, 1, N)]);
  x[idx(0, N - 1, N)] = 0.5 * (x[idx(1, N - 1, N)] + x[idx(0, N - 2, N)]);
  x[idx(N - 1, N - 1, N)] = 0.5 * (x[idx(N - 2, N - 1, N)] + x[idx(N - 1, N - 2, N)]);
}

export function useFluidSimulation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseFluidSimulationOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorIndexRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    const N = Math.max(32, Math.min(128, options.resolution));
    const size = N * N;

    // Fluid state arrays
    let u = new Float32Array(size);
    let v = new Float32Array(size);
    let u0 = new Float32Array(size);
    let v0 = new Float32Array(size);
    // Per-channel density for RGB ink
    let dR = new Float32Array(size);
    let dG = new Float32Array(size);
    let dB = new Float32Array(size);
    let dR0 = new Float32Array(size);
    let dG0 = new Float32Array(size);
    let dB0 = new Float32Array(size);
    let p = new Float32Array(size);
    let divArr = new Float32Array(size);
    let imageData: ImageData | null = null;
    // Synchronous offscreen canvas — avoids async createImageBitmap
    const offscreen = document.createElement("canvas");
    offscreen.width = N;
    offscreen.height = N;
    const offCtx = offscreen.getContext("2d")!;

    function applyDpr(width: number, height: number) {
      const cvs = canvasRef.current!;
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.round(width * dpr);
      cvs.height = Math.round(height * dpr);
      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      w = width; h = height;
      imageData = offCtx.createImageData(N, N);
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function addInkAt(gx: number, gy: number, vx: number, vy: number, r: number, g: number, b: number, force: number, radius: number) {
      const ir = Math.max(1, Math.floor(radius));
      for (let dy = -ir; dy <= ir; dy++) {
        for (let dx = -ir; dx <= ir; dx++) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 1 || nx >= N - 1 || ny < 1 || ny >= N - 1) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > ir) continue;
          const falloff = 1 - dist / ir;
          const i = idx(nx, ny, N);
          // Inject directly into current arrays — source arrays (d0/u0/v0)
          // are overwritten by d0.set(d) at the start of each step, so
          // writing to them here would be wiped before use.
          dR[i] += r * falloff;
          dG[i] += g * falloff;
          dB[i] += b * falloff;
          u[i] += vx * force * falloff;
          v[i] += vy * force * falloff;
        }
      }
    }

    function onMouseMove(e: MouseEvent) {
      const bounding = canvasRef.current!.getBoundingClientRect();
      const mx = e.clientX - bounding.left;
      const my = e.clientY - bounding.top;
      const prev = mouseRef.current;
      mouseRef.current = {
        x: mx, y: my,
        px: prev ? prev.x : mx,
        py: prev ? prev.y : my,
      };
    }
    function onMouseLeave() { mouseRef.current = null; }
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    function scheduleAuto() {
      const { autoInk, autoInkInterval } = optionsRef.current;
      if (!autoInk) return;
      autoTimerRef.current = setTimeout(() => {
        const { inkColors } = optionsRef.current;
        const color = inkColors[colorIndexRef.current % inkColors.length];
        colorIndexRef.current++;
        const rgb = hexToRgbString(color).split(",").map(Number);
        const gx = Math.floor(N * 0.2 + Math.random() * N * 0.6);
        const gy = Math.floor(N * 0.2 + Math.random() * N * 0.6);
        const angle = Math.random() * Math.PI * 2;
        addInkAt(gx, gy, Math.cos(angle) * 2, Math.sin(angle) * 2, rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 3, 3);
        scheduleAuto();
      }, autoInkInterval * (0.6 + Math.random() * 0.8));
    }
    scheduleAuto();

    function draw() {
      const { viscosity, diffusion, dissipation, inkColors, backgroundColor, mouseForce, inkRadius } = optionsRef.current;
      const dt = 0.016;

      // Mouse → inject velocity + ink
      const mouse = mouseRef.current;
      if (mouse) {
        const gx = Math.floor((mouse.x / w) * N);
        const gy = Math.floor((mouse.y / h) * N);
        const dvx = (mouse.x - mouse.px) * 0.5;
        const dvy = (mouse.y - mouse.py) * 0.5;

        const color = inkColors[colorIndexRef.current % inkColors.length];
        const rgb = hexToRgbString(color).split(",").map(Number);
        addInkAt(gx, gy, dvx, dvy, rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, mouseForce, inkRadius);

        if (Math.abs(dvx) + Math.abs(dvy) > 0.5) colorIndexRef.current++;
        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }

      // Velocity step
      u0.set(u); v0.set(v);
      diffuse(N, 1, u, u0, viscosity, dt);
      diffuse(N, 2, v, v0, viscosity, dt);
      project(N, u, v, p, divArr);
      u0.set(u); v0.set(v);
      advect(N, 1, u, u0, u0, v0, dt);
      advect(N, 2, v, v0, u0, v0, dt);
      project(N, u, v, p, divArr);

      // Density step — RGB channels
      for (const [d, d0] of [[dR, dR0], [dG, dG0], [dB, dB0]] as [Float32Array, Float32Array][]) {
        d0.set(d);
        diffuse(N, 0, d, d0, diffusion, dt);
        d0.set(d);
        advect(N, 0, d, d0, u, v, dt);
        for (let i = 0; i < size; i++) {
          d[i] = Math.max(0, d[i] * dissipation);
          d0[i] = 0;
        }
      }
      for (let i = 0; i < size; i++) {
        u0[i] = 0; v0[i] = 0;
      }

      // Render to canvas via ImageData
      if (!imageData) { rafRef.current = requestAnimationFrame(draw); return; }

      const data = imageData.data;
      for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
          const ci = idx(i, j, N);
          const base = (j * N + i) * 4;
          data[base] = Math.min(255, dR[ci] * 255);
          data[base + 1] = Math.min(255, dG[ci] * 255);
          data[base + 2] = Math.min(255, dB[ci] * 255);
          data[base + 3] = Math.min(255, (dR[ci] + dG[ci] + dB[ci]) * 200);
        }
      }

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      // Synchronous: write pixels to offscreen canvas then scale to main canvas
      offCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(offscreen, 0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [canvasRef, options.resolution]);
}
