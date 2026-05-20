import { useRef, useEffect, RefObject } from "react";

export interface UseReactionDiffusionOptions {
  feedRate: number;
  killRate: number;
  diffusionU: number;
  diffusionV: number;
  resolution: number;
  speed: number;
  colorA: string;
  colorB: string;
  backgroundColor: string;
  interactive: boolean;
}

function parseHexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const n = parseInt(full, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function useReactionDiffusion(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseReactionDiffusionOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const rafRef = useRef<number>(0);
  const stateRef = useRef<{
    u: Float32Array;
    v: Float32Array;
    uNext: Float32Array;
    vNext: Float32Array;
    gw: number;
    gh: number;
    imageData: ImageData;
    offscreen: OffscreenCanvas;
    offCtx: OffscreenCanvasRenderingContext2D;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function initGrid(gw: number, gh: number) {
      const size = gw * gh;
      const u = new Float32Array(size).fill(1);
      const v = new Float32Array(size).fill(0);

      // Seed with random blobs — high V concentration to kickstart autocatalysis
      const numBlobs = Math.max(5, Math.floor((gw * gh) / 1000));
      for (let b = 0; b < numBlobs; b++) {
        const bx = Math.floor(Math.random() * gw);
        const by = Math.floor(Math.random() * gh);
        const br = Math.floor(2 + Math.random() * 5);
        for (let dy = -br; dy <= br; dy++) {
          for (let dx = -br; dx <= br; dx++) {
            if (dx * dx + dy * dy <= br * br) {
              const nx = (bx + dx + gw) % gw;
              const ny = (by + dy + gh) % gh;
              const idx = ny * gw + nx;
              u[idx] = 0.5 + (Math.random() - 0.5) * 0.1;
              v[idx] = 0.25 + Math.random() * 0.1;
            }
          }
        }
      }

      const offscreen = new OffscreenCanvas(gw, gh);
      const offCtx = offscreen.getContext("2d") as OffscreenCanvasRenderingContext2D;
      const imageData = offCtx.createImageData(gw, gh);
      // pre-fill alpha channel once
      for (let i = 0; i < size; i++) imageData.data[i * 4 + 3] = 255;

      stateRef.current = {
        u,
        v,
        uNext: new Float32Array(size),
        vNext: new Float32Array(size),
        gw,
        gh,
        imageData,
        offscreen,
        offCtx,
      };
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

      const { resolution } = optionsRef.current;
      const gw = Math.max(4, Math.round(w * resolution));
      const gh = Math.max(4, Math.round(h * resolution));
      initGrid(gw, gh);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    // mouse disturbance
    let isMouseDown = false;
    let mouseGX = -1;
    let mouseGY = -1;

    function updateMouseGrid(clientX: number, clientY: number) {
      const state = stateRef.current;
      if (!state) return;
      const r = canvas!.getBoundingClientRect();
      const mx = clientX - r.left;
      const my = clientY - r.top;
      mouseGX = Math.floor((mx / w) * state.gw);
      mouseGY = Math.floor((my / h) * state.gh);
    }

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      updateMouseGrid(e.clientX, e.clientY);
    }

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      isMouseDown = true;
      updateMouseGrid(e.clientX, e.clientY);
    }

    function onMouseUp() { isMouseDown = false; mouseGX = -1; mouseGY = -1; }
    function onMouseLeave() { isMouseDown = false; mouseGX = -1; mouseGY = -1; }

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("mouseup", onMouseUp);
    parent.addEventListener("mouseleave", onMouseLeave);

    function step() {
      const state = stateRef.current;
      if (!state) return;
      const { u, v, uNext, vNext, gw, gh } = state;
      const { feedRate: f, killRate: k, diffusionU: dU, diffusionV: dV } = optionsRef.current;

      // disturb with mouse
      if (isMouseDown && mouseGX >= 0 && mouseGY >= 0) {
        const br = 3;
        for (let dy = -br; dy <= br; dy++) {
          for (let dx = -br; dx <= br; dx++) {
            if (dx * dx + dy * dy <= br * br) {
              const nx = (mouseGX + dx + gw) % gw;
              const ny = (mouseGY + dy + gh) % gh;
              const idx = ny * gw + nx;
              u[idx] = 0.5;
              v[idx] = 0.25;
            }
          }
        }
      }

      for (let y = 0; y < gh; y++) {
        const yn = ((y - 1 + gh) % gh) * gw;
        const ys = ((y + 1) % gh) * gw;
        const yc = y * gw;
        for (let x = 0; x < gw; x++) {
          const i = yc + x;
          const xw = (x - 1 + gw) % gw;
          const xe = (x + 1) % gw;

          const lapU = u[yc + xw] + u[yc + xe] + u[yn + x] + u[ys + x] - 4 * u[i];
          const lapV = v[yc + xw] + v[yc + xe] + v[yn + x] + v[ys + x] - 4 * v[i];

          const uvv = u[i] * v[i] * v[i];
          uNext[i] = Math.max(0, Math.min(1, u[i] + dU * lapU - uvv + f * (1 - u[i])));
          vNext[i] = Math.max(0, Math.min(1, v[i] + dV * lapV + uvv - (f + k) * v[i]));
        }
      }

      state.u.set(uNext);
      state.v.set(vNext);
    }

    function render() {
      const state = stateRef.current;
      if (!state) return;
      const { u, v, gw, gh, imageData, offscreen, offCtx } = state;
      const { colorA, colorB, backgroundColor } = optionsRef.current;

      const [ar, ag, ab] = parseHexToRgb(colorA);
      const [br, bg, bb] = parseHexToRgb(colorB);

      const data = imageData.data;
      for (let i = 0; i < gw * gh; i++) {
        // map v concentration to color; clamp generously
        const t = Math.max(0, Math.min(1, v[i] * 3.5));
        // subtle u-based shading for depth
        const shade = 1 - u[i] * 0.15;
        const p = i * 4;
        data[p]     = Math.round((ar + (br - ar) * t) * shade);
        data[p + 1] = Math.round((ag + (bg - ag) * t) * shade);
        data[p + 2] = Math.round((ab + (bb - ab) * t) * shade);
      }

      offCtx.putImageData(imageData, 0, 0);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "low";
      ctx.drawImage(offscreen, 0, 0, w, h);
    }

    function loop() {
      const { speed } = optionsRef.current;
      const steps = Math.max(1, Math.round(speed));
      for (let s = 0; s < steps; s++) step();
      render();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("mouseup", onMouseUp);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef, options.resolution]);
}
