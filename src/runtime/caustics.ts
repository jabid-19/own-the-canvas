/** Sunlight caustics: a low-res ridged-noise web, scaled up and added onto the frame. */
import { noise2 } from "./noise";

export interface CausticCache { c: HTMLCanvasElement; g: CanvasRenderingContext2D; img: ImageData }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Draws caustics over (0, 0, w, h) with "lighter". `rgb` is "r,g,b"; `intensity` 0..2;
 * `scale` = cells across the width; `ripple` (canvas px) bends the web around a point.
 * ponytail: CPU per-pixel at ~192 px wide; move to a shader if it ever needs full resolution.
 */
export function drawCaustics(
  ctx: CanvasRenderingContext2D, cache: { current: CausticCache | null },
  w: number, h: number, t: number, rgb: string, intensity: number, quality: number,
  scale = 11, ripple?: { x: number; y: number } | null,
): void {
  if (intensity <= 0 || typeof document === "undefined") return;
  const cw = Math.round(96 + 96 * quality), ch = Math.max(8, Math.round(cw * h / Math.max(1, w)));
  let c = cache.current;
  if (!c || c.c.width !== cw || c.c.height !== ch) {
    const el = document.createElement("canvas");
    el.width = cw; el.height = ch;
    const g = el.getContext("2d");
    c = g ? { c: el, g, img: g.createImageData(cw, ch) } : null;
    cache.current = c;
  }
  if (!c) return;
  const [lr, lg, lb] = rgb.split(",").map(Number);
  const data = c.img.data;
  const f = scale / cw;
  const rx = ripple ? ripple.x / w * cw : -1, ry = ripple ? ripple.y / h * ch : -1;
  const k = clamp(intensity, 0, 2) * 0.5;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      let u = x * f, v = y * f;
      if (rx >= 0) { const d = Math.hypot(x - rx, y - ry); if (d < 20) { const q = Math.sin(d * 0.5 - t * 8) * 0.15 * (1 - d / 20); u += q; v += q; } }
      const n = noise2(u + t * 0.35, v - t * 0.2, 1) + noise2(u * 1.6 - t * 0.3, v * 1.6 + t * 0.25, 2);
      const ridge = clamp(1 - Math.abs(n - 1) * 5, 0, 1);
      const i = (y * cw + x) * 4;
      data[i] = lr; data[i + 1] = lg; data[i + 2] = lb;
      data[i + 3] = Math.round(255 * ridge * ridge * ridge * k);
    }
  }
  c.g.putImageData(c.img, 0, 0);
  const op = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(c.c, 0, 0, w, h);
  ctx.globalCompositeOperation = op;
}
