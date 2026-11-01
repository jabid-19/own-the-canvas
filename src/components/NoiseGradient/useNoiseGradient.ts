import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { fbm2 } from "../../runtime/noise";
import { sampleGradient } from "../../utils/color";

export interface UseNoiseGradientOptions {
  colors: string[];
  speed: number;
  scale: number;
  octaves: number;
  animated: boolean;
  blendMode: string;
  timeOffsetY: number;
  persistence: number;
  resolution: number;
}

/**
 * Domain-warped fBm (Quilez): noise sampled at coordinates displaced by
 * other noise, twice. Gives the folded, flowing silk look instead of blobs.
 * Returns [value, sheen] in [0, 1].
 */
export function warpedField(x: number, y: number, t: number, octaves: number, gain: number, dirY: number): [number, number] {
  // Warp layers only need the broad shapes; detail octaves go on the final pass
  const wo = Math.min(octaves, 2);
  const qx = fbm2(x + t * 0.6, y + t * 0.6 * dirY, wo, 1, gain);
  const qy = fbm2(x + 5.2 - t * 0.4, y + 1.3 + t * 0.3, wo, 2, gain);
  const rx = fbm2(x + 3.5 * qx + 1.7 + t * 0.25, y + 3.5 * qy + 9.2, wo, 3, gain);
  const ry = fbm2(x + 3.5 * qx + 8.3, y + 3.5 * qy + 2.8 - t * 0.2 * dirY, wo, 4, gain);
  const v = fbm2(x + 3 * rx, y + 3 * ry, octaves, 5, gain);
  const sheen = Math.min(1, Math.hypot(rx - 0.5, ry - 0.5) * 2.2);
  return [v, sheen];
}

export function useNoiseGradient(options: UseNoiseGradientOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const s = useRef({
    t: 0,
    buf: null as { c: HTMLCanvasElement; img: ImageData; bw: number; bh: number } | null,
    staticKey: "",
  }).current;

  function buffer(w: number, h: number, res: number) {
    const bw = Math.max(16, Math.round(w * res));
    const bh = Math.max(16, Math.round(h * res));
    if (s.buf && s.buf.bw === bw && s.buf.bh === bh) return s.buf;
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = bw;
    c.height = bh;
    const img = c.getContext("2d")?.createImageData?.(bw, bh);
    if (!img) return null;
    s.buf = { c, img, bw, bh };
    s.staticKey = "";
    return s.buf;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const colors = o.colors.length >= 2 ? o.colors : ["#000000", "#ffffff"];
    // ponytail: pixel budget cap (~40k) keeps a full-screen hero smooth; the field is
    // soft enough that upscaling hides it. Raise MAX_PX if a sharper look is ever needed.
    const MAX_PX = 40000 * (frame.quality < 0.75 ? 0.5 : 1);
    const res = Math.min(Math.min(1, Math.max(0.05, o.resolution)), Math.sqrt(MAX_PX / Math.max(1, w * h)));
    const b = buffer(w, h, res);
    if (!b) return;

    if (o.animated) s.t += dt * 0.001 * o.speed;
    const key = `${o.animated}|${colors.join()}|${o.scale}|${o.octaves}|${o.persistence}|${o.timeOffsetY}|${b.bw}x${b.bh}`;
    const needs = o.animated || key !== s.staticKey;

    if (needs) {
      s.staticKey = key;
      const t = s.t;
      // Uniform scale on both axes (by the shorter side) so nothing stretches
      const unit = (1.6 * Math.max(0.1, o.scale)) / Math.min(b.bw, b.bh);
      const oct = Math.max(1, Math.min(6, Math.round(o.octaves)));
      const gain = Math.min(0.9, Math.max(0.1, o.persistence));
      const lut = Array.from({ length: 256 }, (_, i) => sampleGradient(colors, i / 255));
      const d = b.img.data;
      for (let y = 0; y < b.bh; y++) {
        for (let x = 0; x < b.bw; x++) {
          const [v, sheen] = warpedField(x * unit, y * unit, t, oct, gain, o.timeOffsetY);
          // Stretch contrast around the mean so the full palette shows
          const c = lut[Math.max(0, Math.min(255, ((v - 0.5) * 1.9 + 0.5) * 255)) | 0];
          const lift = sheen * 18;
          const grain = (Math.random() - 0.5) * 3; // dither: no banding on smooth ramps
          const j = (y * b.bw + x) * 4;
          d[j] = c[0] + lift + grain;
          d[j + 1] = c[1] + lift + grain;
          d[j + 2] = c[2] + lift + grain;
          d[j + 3] = 255;
        }
      }
      b.c.getContext("2d")?.putImageData(b.img, 0, 0);
    }

    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = (o.blendMode as GlobalCompositeOperation) || "source-over";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(b.c, 0, 0, w, h);
    ctx.globalCompositeOperation = prev;
  }

  return useCanvasSetup({ onFrame: draw });
}
