import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";
import { noise1, fbm1, fbm2 } from "../../runtime/noise";

export type FirePalette = "inferno" | "toxic" | "ice" | "plasma" | "smoke";

export interface UseFireEffectOptions {
  palette: FirePalette;
  customColors?: string[];
  intensity: number;
  windStrength: number;
  windDirection: number;
  spread: number;
  cooling: number;
  noiseStrength: number;
  coolingScale: number;
  resolution: number;
}

/** Colour stops per palette, coolest → hottest. Index 0 is always transparent. */
const STOPS: Record<FirePalette, string[]> = {
  inferno: ["#1a0200", "#7a0d02", "#c92a06", "#f26b0f", "#ffb02e", "#ffe28a", "#fffbe8"],
  toxic:   ["#001a05", "#06520f", "#13a017", "#58d61a", "#c4f53a", "#f2ffb0", "#ffffff"],
  ice:     ["#000b1f", "#032a66", "#0b5fb8", "#1fa8e6", "#79e2ff", "#d4f8ff", "#ffffff"],
  plasma:  ["#12001f", "#4a0570", "#9c13a8", "#e0388f", "#ff7f8f", "#ffd0c4", "#ffffff"],
  smoke:   ["#0d0d0d", "#2b2b2b", "#555555", "#808080", "#b0b0b0", "#dcdcdc", "#ffffff"],
};

/** 256-entry ABGR lookup. Alpha ramps up over the cool end so faint flame edges fade out. */
function buildLut(colors: string[]): Uint32Array {
  const lut = new Uint32Array(256);
  for (let i = 1; i < 256; i++) {
    const t = i / 255;
    const [r, g, b] = sampleGradient(colors, t);
    const a = Math.min(255, Math.round(Math.pow(t, 0.55) * 255 * 1.35));
    lut[i] = (a << 24) | (Math.round(b) << 16) | (Math.round(g) << 8) | Math.round(r);
  }
  return lut;
}

interface Ember { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; seed: number }

/**
 * Flames as a smooth heat field: each cell's heat falls off with height, broken up by
 * rising fractal noise and a per-column flame envelope, so tongues lick and split
 * instead of fizzing per pixel. The field is computed on a coarse grid and upscaled
 * with smoothing, then a blurry copy is added on top for glow, with sparks rising
 * above.
 */
export function useFireEffect(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseFireEffectOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    const field = document.createElement("canvas");
    const fctx = field.getContext("2d")!;
    const glow = document.createElement("canvas");
    const gctx = glow.getContext("2d")!;

    let w = 0, h = 0, cols = 0, rows = 0, cell = 5;
    let image: ImageData | null = null;
    let pixels: Uint32Array<ArrayBufferLike> | null = null;
    let lut: Uint32Array = new Uint32Array(256);
    let lutKey = "";
    let emberRgb = "255,200,120";
    const embers: Ember[] = [];

    let appliedRes = NaN;
    function applySize(width: number, height: number) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = width;
      h = height;
      appliedRes = optionsRef.current.resolution;
      const res = Math.max(0.2, Math.min(1, appliedRes));
      // ponytail: ~16k cells max, so full-screen fire costs the same as a small one; smoothing hides the coarser grid
      cell = Math.max(3, Math.round(5 / res), Math.ceil(Math.sqrt((width * height) / 16000)));
      cols = Math.max(2, Math.ceil(w / cell) + 1);
      rows = Math.max(2, Math.ceil(h / cell) + 1);
      field.width = cols;
      field.height = rows;
      glow.width = Math.max(1, Math.ceil(cols / 4));
      glow.height = Math.max(1, Math.ceil(rows / 4));
      image = fctx.createImageData(cols, rows);
      pixels = new Uint32Array(image.data.buffer);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    let raf = 0;
    let last = 0;
    let t = 0;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      if (!image || !pixels || w === 0) return;

      const o = optionsRef.current;
      if (o.resolution !== appliedRes) applySize(w, h); // live resolution
      const colors = o.customColors && o.customColors.length >= 2 ? o.customColors : STOPS[o.palette] ?? STOPS.inferno;
      const key = colors.join(",");
      if (key !== lutKey) {
        lutKey = key;
        lut = buildLut(colors);
        const [r, g, b] = sampleGradient(colors, 0.66);
        emberRgb = `${Math.round(r)},${Math.round(g)},${Math.round(b)}`;
      }

      const wind = Math.max(-1, Math.min(1, o.windStrength * o.windDirection));
      const spread = Math.max(0, Math.min(1, o.spread));
      const coolF = Math.min(0.9, o.cooling * (o.coolingScale / 3));
      const reach = Math.max(0.08, o.intensity) * (1 - coolF * 0.85) * 1.3; // tallest tongue, as a fraction of height
      const rough = 0.8 + Math.max(0, o.noiseStrength) / 110;
      const xs = 0.0105 * (1.35 - spread * 0.6); // horizontal noise frequency: wider tongues when spread is high
      const rise = t * 1.7;

      for (let j = 0; j < rows; j++) {
        const yPx = j * cell;
        const up = 1 - yPx / h; // 0 at the bottom, 1 at the top
        const sway = (noise1(t * 0.45 + up * 1.8, 3) - 0.5) * up * 34;
        const lean = wind * up * up * h * 0.32;
        const ny = yPx * 0.0125 + rise;
        const rowOff = j * cols;
        for (let i = 0; i < cols; i++) {
          const sx = i * cell - lean - sway;
          const env = 0.38 + 0.62 * fbm1(sx * 0.0042 + t * 0.12, 3, 5);
          const top = reach * env;
          const k = up / top;
          if (k > 1.6) { pixels[rowOff + i] = 0; continue; }
          const n = fbm2(sx * xs, ny, 3, 1);
          let heat = 1 - k + (n - 0.5) * rough * (0.3 + k) - Math.max(0, k - 0.85) * 0.9;
          if (up < 0.035) heat = Math.max(heat, 0.88 - up * 4);
          heat = heat < 0 ? 0 : heat > 1 ? 1 : heat;
          pixels[rowOff + i] = lut[(Math.pow(heat, 1.75) * 255) | 0];
        }
      }

      fctx.putImageData(image, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(field, 0, 0, cols * cell, rows * cell);

      // glow: a quarter-size copy upscaled is naturally soft
      gctx.clearRect(0, 0, glow.width, glow.height);
      gctx.imageSmoothingEnabled = true;
      gctx.drawImage(field, 0, 0, glow.width, glow.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.36;
      ctx.drawImage(glow, -cell * 2, -cell * 3, cols * cell + cell * 4, rows * cell + cell * 3);
      ctx.globalAlpha = 1;

      // sparks
      const spawn = o.intensity * 28 * dt;
      for (let s = 0; s < spawn || Math.random() < spawn - s; s++) {
        if (embers.length > 90) break;
        const max = 1.2 + Math.random() * 1.8;
        embers.push({
          x: Math.random() * w,
          y: h * (1 - Math.random() * reach * 0.5),
          vx: wind * 30 + (Math.random() - 0.5) * 20,
          vy: -(45 + Math.random() * 85),
          life: max, max, size: 1 + Math.random() * 1.6, seed: Math.random() * 100,
        });
      }
      for (let e = embers.length - 1; e >= 0; e--) {
        const p = embers[e];
        p.life -= dt;
        if (p.life <= 0 || p.y < -10) { embers.splice(e, 1); continue; }
        p.x += (p.vx + (noise1(t * 1.4 + p.seed) - 0.5) * 60) * dt;
        p.y += p.vy * dt;
        const a = Math.min(1, p.life / p.max * 1.4) * (0.65 + 0.35 * Math.sin(t * 18 + p.seed));
        ctx.fillStyle = `rgba(${emberRgb},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [canvasRef]);
}
