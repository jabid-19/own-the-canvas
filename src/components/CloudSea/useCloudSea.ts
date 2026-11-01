import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { fbm2 } from "../../runtime/noise";
import { sampleGradient } from "../../utils/color";

export interface UseCloudSeaOptions {
  skyColor: string;
  sunColor: string;
  cloudColor: string;
  shadowColor: string;
  horizon: number;
  coverage: number;
  speed: number;
  interactive: boolean;
  overlay: boolean;
}

/**
 * Cloud density at a world point, 0..1 after the coverage threshold.
 * Coverage 0 = clear sky below, 1 = solid overcast.
 */
export function cloudDensity(wx: number, wy: number, coverage: number): number {
  const n = fbm2(wx, wy, 5, 5);
  return Math.max(0, Math.min(1, (n - (1 - coverage) * 0.75) * 4.2));
}

export function useCloudSea(options: UseCloudSeaOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const timeRef = useRef(0);
  const bufRef = useRef<{ c: HTMLCanvasElement; img: ImageData; bw: number; bh: number; clear: Float32Array } | null>(null);
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function buffer(w: number, h: number, quality: number) {
    const o = optionsRef.current;
    const bw = Math.round(Math.max(120, Math.min(320, w / 3.5)) * (quality < 0.75 ? 0.65 : 1));
    const bh = Math.max(8, Math.round(bw * (h * (1 - o.horizon)) / w));
    const b = bufRef.current;
    if (b && b.bw === bw && b.bh === bh) return b;
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = bw;
    c.height = bh;
    const img = c.getContext("2d")?.createImageData?.(bw, bh);
    if (!img) return null;
    bufRef.current = { c, img, bw, bh, clear: new Float32Array(bw * bh) };
    return bufRef.current;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001 * o.speed;
    const t = timeRef.current;
    const hy = h * o.horizon;
    const sky = sampleGradient([o.skyColor], 0);
    const sun = sampleGradient([o.sunColor], 0);
    const cloud = sampleGradient([o.cloudColor], 0);
    const shadow = sampleGradient([o.shadowColor], 0);
    const rgb = (c: number[]) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
    const mix = (a: number[], b: number[], m: number) => a.map((v, i) => v + (b[i] - v) * m);
    const sunX = w * 0.5;

    // Sky: deep at the top, burning near the horizon
    if (!frame.overlay) {
      const g = ctx.createLinearGradient(0, 0, 0, hy);
      g.addColorStop(0, rgb(sky));
      g.addColorStop(0.7, rgb(mix(sky, sun, 0.35)));
      g.addColorStop(1, rgb(mix(sky, sun, 0.85)));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, hy + 1);
    }
    if (spriteRef.current.color !== o.sunColor) spriteRef.current = { color: o.sunColor, img: glowSprite(o.sunColor, 128) };
    const sr = Math.min(w, h) * 0.06;
    if (spriteRef.current.img) {
      ctx.globalAlpha = 0.6;
      ctx.drawImage(spriteRef.current.img, sunX - sr * 7, hy - sr * 4, sr * 14, sr * 8);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = o.sunColor;
    ctx.beginPath();
    ctx.arc(sunX, hy, sr, Math.PI, 0);
    ctx.fill();

    // Cloud deck below the horizon: perspective-projected fBm, lit from the sun side
    const b = buffer(w, h, frame.quality);
    if (!b) return;
    const p = readPointer(pointer.current, canvasEl.current);
    if (o.interactive && p.inside && p.y > hy) {
      const px = (p.x / w) * b.bw, py = ((p.y - hy) / (h - hy)) * b.bh;
      const r = b.bw * 0.09;
      for (let y = Math.max(0, Math.floor(py - r)); y < Math.min(b.bh, py + r); y++) {
        for (let x = Math.max(0, Math.floor(px - r)); x < Math.min(b.bw, px + r); x++) {
          const d = Math.hypot(x - px, y - py) / r;
          if (d < 1) b.clear[y * b.bw + x] = Math.max(b.clear[y * b.bw + x], 1 - d * d);
        }
      }
    }
    const heal = Math.pow(0.985, k);
    const data = b.img.data;
    const below = mix(shadow, [0, 0, 0], 0.35);
    for (let y = 0; y < b.bh; y++) {
      const v = (y + 0.5) / b.bh;               // 0 at horizon .. 1 at bottom
      const z = 1 / (v * 0.96 + 0.04);          // world depth
      const haze = Math.min(1, Math.max(0, (z - 2) / 20));
      for (let x = 0; x < b.bw; x++) {
        const u = (x + 0.5) / b.bw - 0.5;
        const wx = u * z * 1.6;
        const wy = z * 0.55 + t * 0.12;
        const i = y * b.bw + x;
        b.clear[i] *= heal;
        const d = Math.max(0, cloudDensity(wx, wy, o.coverage) - b.clear[i] * 0.9);
        // Back-lit rims: brighter where density drops toward the sun (horizon side)
        const d2 = cloudDensity(wx, wy + 0.06, o.coverage);
        const light = Math.max(0, Math.min(1, 0.55 + (d - d2) * 2.5 + (1 - v) * 0.25));
        const rim = Math.pow(light, 2.2) * (0.5 + 0.5 * (1 - Math.abs(u) * 1.4));
        let c = mix(shadow, cloud, light);
        c = mix(c, sun, rim * 0.55);
        const a = d * d * (3 - 2 * d);
        c = mix(below, c, a);
        c = mix(c, mix(sky, sun, 0.8), haze);  // distant deck melts into the glow
        const j = i * 4;
        data[j] = c[0]; data[j + 1] = c[1]; data[j + 2] = c[2]; data[j + 3] = 255;
      }
    }
    b.c.getContext("2d")?.putImageData(b.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(b.c, 0, hy, w, h - hy);
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onResize: () => { bufRef.current = null; },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
