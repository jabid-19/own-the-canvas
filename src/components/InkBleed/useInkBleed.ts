import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

export interface UseInkBleedOptions {
  inkColor: string;
  paperColor: string;
  diffusionRate: number;
  viscosity: number;
  evaporationRate: number;
  inkRadius: number;
  inkStrength: number;
  interactive: boolean;
  autoInk: boolean;
  autoInkInterval: number;
  resolution: number;
  glowEffect: boolean;
  glowBlur: number;
  animated: boolean;
}

export function useInkBleed(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseInkBleedOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let cssW = 0;
    let cssH = 0;
    let gridW = 0;
    let gridH = 0;
    let grid = new Float32Array(0);
    let next = new Float32Array(0);
    let imgData: ImageData | null = null;
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d")!;
    let rafId = 0;
    let lastAutoInk = 0;
    let currentResolution = -1;

    function initGrid() {
      const { resolution } = optionsRef.current;
      if (resolution === currentResolution && gridW > 0) return;
      currentResolution = resolution;
      gridW = Math.max(1, Math.round(cssW * resolution));
      gridH = Math.max(1, Math.round(cssH * resolution));
      grid = new Float32Array(gridW * gridH);
      next = new Float32Array(gridW * gridH);
      offscreen.width = gridW;
      offscreen.height = gridH;
      imgData = offCtx.createImageData(gridW, gridH);
    }

    function resize(w: number, h: number) {
      const dpr = window.devicePixelRatio || 1;
      cssW = w;
      cssH = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      currentResolution = -1;
      initGrid();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function addInk(cx: number, cy: number) {
      if (gridW === 0 || gridH === 0) return;
      const { inkRadius, inkStrength, resolution } = optionsRef.current;
      const gx = Math.round(cx * resolution);
      const gy = Math.round(cy * resolution);
      const gr = Math.max(1, Math.round(inkRadius * resolution));
      const grSq = gr * gr;
      for (let dy = -gr; dy <= gr; dy++) {
        for (let dx = -gr; dx <= gr; dx++) {
          const distSq = dx * dx + dy * dy;
          if (distSq > grSq) continue;
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 0 || nx >= gridW || ny < 0 || ny >= gridH) continue;
          const falloff = Math.exp(-distSq / (grSq * 0.5));
          const idx = ny * gridW + nx;
          grid[idx] = Math.min(1, grid[idx] + inkStrength * falloff);
        }
      }
    }

    let isMouseDown = false;

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      isMouseDown = true;
      const r = canvas!.getBoundingClientRect();
      addInk(e.clientX - r.left, e.clientY - r.top);
    }
    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive || !isMouseDown) return;
      const r = canvas!.getBoundingClientRect();
      addInk(e.clientX - r.left, e.clientY - r.top);
    }
    function onMouseUp() { isMouseDown = false; }

    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      addInk(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    }
    function onTouchMove(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      addInk(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    }

    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });
    parent.addEventListener("touchmove", onTouchMove, { passive: false });

    function loop(timestamp: number) {
      const { diffusionRate, viscosity, evaporationRate, inkColor, paperColor, glowEffect, glowBlur, autoInk, autoInkInterval, animated } = optionsRef.current;

      initGrid();

      if (autoInk && cssW > 0 && timestamp - lastAutoInk > autoInkInterval) {
        lastAutoInk = timestamp;
        addInk(Math.random() * cssW, Math.random() * cssH);
      }

      if (animated && imgData && gridW > 0) {
        const spread = diffusionRate * (1 - viscosity * 0.4);

        for (let y = 0; y < gridH; y++) {
          for (let x = 0; x < gridW; x++) {
            const idx = y * gridW + x;
            let sum = 0;
            let weight = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || nx >= gridW || ny < 0 || ny >= gridH) continue;
                const w = (dx === 0 && dy === 0) ? 4 : (dx !== 0 && dy !== 0) ? 0.7 : 1;
                sum += grid[ny * gridW + nx] * w;
                weight += w;
              }
            }
            next[idx] = grid[idx] + (sum / weight - grid[idx]) * spread;
            next[idx] *= (1 - evaporationRate);
            if (next[idx] < 0) next[idx] = 0;
            else if (next[idx] > 1) next[idx] = 1;
          }
        }

        const tmp = grid; grid = next; next = tmp;

        // Pre-parse endpoints once; lerp inline avoids per-pixel parseHex
        const [pR, pG, pB] = sampleGradient([paperColor], 0);
        const [iR, iG, iB] = sampleGradient([inkColor], 0);
        const dR = iR - pR, dG = iG - pG, dB = iB - pB;

        const data = imgData.data;
        const total = gridW * gridH;
        for (let i = 0; i < total; i++) {
          const t = grid[i];
          const i4 = i * 4;
          data[i4]     = (pR + dR * t) | 0;
          data[i4 + 1] = (pG + dG * t) | 0;
          data[i4 + 2] = (pB + dB * t) | 0;
          data[i4 + 3] = 255;
        }
        offCtx.putImageData(imgData, 0, 0);

        ctx.save();
        if (glowEffect) {
          ctx.shadowBlur = glowBlur;
          ctx.shadowColor = inkColor;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
        ctx.drawImage(offscreen, 0, 0, cssW, cssH);
        ctx.restore();
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      parent.removeEventListener("touchstart", onTouchStart);
      parent.removeEventListener("touchmove", onTouchMove);
    };
  }, [canvasRef]);
}
