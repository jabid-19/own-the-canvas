import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

const PERM = new Uint8Array(256);
for (let i = 0; i < 256; i++) PERM[i] = i;
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [PERM[i], PERM[j]] = [PERM[j], PERM[i]];
}
const P = new Uint8Array(512);
for (let i = 0; i < 512; i++) P[i] = PERM[i & 255];

function noise2d(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = P[P[xi] + yi];
  const ab = P[P[xi] + yi + 1];
  const ba = P[P[xi + 1] + yi];
  const bb = P[P[xi + 1] + yi + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

function octaveNoise(x: number, y: number, octaves: number, persistence: number): number {
  let val = 0, amp = 1, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    val += noise2d(x * freq, y * freq) * amp;
    max += amp;
    amp *= persistence;
    freq *= 2;
  }
  return val / max;
}

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

export function useNoiseGradient(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseNoiseGradientOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const imageDataRef = useRef<ImageData | null>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const bufferWRef = useRef<number>(0);
  const bufferHRef = useRef<number>(0);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let cw = 0, ch = 0;

    function applyDpr(width: number, height: number) {
      const { resolution } = optionsRef.current;
      const dpr = window.devicePixelRatio || 1;
      const res = Math.max(0.05, Math.min(1, resolution));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cw = canvas.width;
      ch = canvas.height;
      const bw = Math.max(1, Math.round(cw * res));
      const bh = Math.max(1, Math.round(ch * res));
      if (bw !== bufferWRef.current || bh !== bufferHRef.current) {
        bufferWRef.current = bw;
        bufferHRef.current = bh;
        imageDataRef.current = new ImageData(bw, bh);
        // Cache buffer canvas — reuse every frame instead of creating per frame
        const bc = document.createElement("canvas");
        bc.width = bw;
        bc.height = bh;
        const bctx = bc.getContext("2d")!;
        bufferCanvasRef.current = bc;
        bufferCtxRef.current = bctx;
      }
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function renderFrame(timestamp: number) {
      const { colors, speed, scale, octaves, animated, blendMode, timeOffsetY, persistence } =
        optionsRef.current;

      if (colors.length < 2) {
        rafRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      if (animated) timeRef.current = timestamp * 0.001 * speed;

      const t = timeRef.current;
      const imageData = imageDataRef.current;
      const bufferCanvas = bufferCanvasRef.current;
      const bufferCtx = bufferCtxRef.current;
      if (!imageData || !bufferCanvas || !bufferCtx) {
        rafRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const bw = bufferWRef.current;
      const bh = bufferHRef.current;
      const data = imageData.data;

      // Normalize coords by buffer dims so scale is canvas-size independent
      const sx = scale * 3 / bw;
      const sy = scale * 3 / bh;

      for (let y = 0; y < bh; y++) {
        const ny = y * sy;
        for (let x = 0; x < bw; x++) {
          const n = octaveNoise(x * sx + t, ny + t * timeOffsetY, octaves, persistence);
          // Bias toward mid-range for richer gradient sampling
          const v = Math.max(0, Math.min(1, (n + 1) / 2));
          const [r, g, b] = sampleGradient(colors, v);
          const idx = (y * bw + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }

      bufferCtx.putImageData(imageData, 0, 0);

      ctx.globalCompositeOperation = (blendMode as GlobalCompositeOperation) || "source-over";
      // Smooth bilinear upscale from low-res buffer to full canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bufferCanvas, 0, 0, cw, ch);

      if (animated) {
        rafRef.current = requestAnimationFrame(renderFrame);
      }
    }

    rafRef.current = requestAnimationFrame(renderFrame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
