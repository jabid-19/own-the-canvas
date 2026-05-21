import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

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

function buildCustomPalette(colors: string[]): Uint32Array {
  const palette = new Uint32Array(256);
  for (let i = 1; i < 256; i++) {
    const t = i / 255;
    const [r, g, b] = sampleGradient(colors, t);
    const ri = Math.round(r), gi = Math.round(g), bi = Math.round(b);
    const alpha = Math.min(255, i * 8);
    palette[i] = (alpha << 24) | (bi << 16) | (gi << 8) | ri;
  }
  palette[0] = 0;
  return palette;
}

function buildPalette(type: FirePalette): Uint32Array {
  const palette = new Uint32Array(256);

  for (let i = 1; i < 256; i++) {
    let r = 0, g = 0, b = 0;
    const t = i / 255;

    if (type === "inferno") {
      // black → dark red → red → orange → yellow → white
      if (t < 0.33) {
        r = Math.round((t / 0.33) * 200); g = 0; b = 0;
      } else if (t < 0.66) {
        const s = (t - 0.33) / 0.33;
        r = Math.round(200 + s * 55); g = Math.round(s * 165); b = 0;
      } else {
        const s = (t - 0.66) / 0.34;
        r = 255; g = Math.round(165 + s * 90); b = Math.round(s * 255);
      }
    } else if (type === "toxic") {
      // black → dark green → green → yellow-green
      if (t < 0.4) {
        r = 0; g = Math.round((t / 0.4) * 180); b = 0;
      } else if (t < 0.75) {
        const s = (t - 0.4) / 0.35;
        r = Math.round(s * 180); g = Math.round(180 + s * 75); b = 0;
      } else {
        const s = (t - 0.75) / 0.25;
        r = Math.round(180 + s * 75); g = 255; b = Math.round(s * 100);
      }
    } else if (type === "ice") {
      // black → deep blue → cyan → white
      if (t < 0.4) {
        r = 0; g = 0; b = Math.round((t / 0.4) * 200);
      } else if (t < 0.7) {
        const s = (t - 0.4) / 0.3;
        r = 0; g = Math.round(s * 200); b = Math.round(200 + s * 55);
      } else {
        const s = (t - 0.7) / 0.3;
        r = Math.round(s * 255); g = Math.round(200 + s * 55); b = 255;
      }
    } else if (type === "plasma") {
      // black → deep purple → magenta → pink → white
      if (t < 0.3) {
        const s = t / 0.3;
        r = Math.round(s * 150); g = 0; b = Math.round(s * 200);
      } else if (t < 0.6) {
        const s = (t - 0.3) / 0.3;
        r = Math.round(150 + s * 105); g = 0; b = Math.round(200 + s * 55);
      } else {
        const s = (t - 0.6) / 0.4;
        r = 255; g = Math.round(s * 200); b = 255;
      }
    } else {
      // smoke: dark gray → white (monochrome)
      const v = Math.round(t < 0.5 ? t * 2 * 180 : 180 + (t - 0.5) * 2 * 75);
      r = g = b = Math.min(255, v);
    }

    // Fade alpha for low-intensity pixels so weak fire is transparent, not black
    const alpha = Math.min(255, i * 8);
    palette[i] = (alpha << 24) | (b << 16) | (g << 8) | r;
  }
  palette[0] = 0;
  return palette;
}

export function useFireEffect(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseFireEffectOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const fireBufferRef = useRef<Uint8Array | null>(null);
  const paletteRef = useRef<Uint32Array>(
    options.customColors && options.customColors.length >= 2
      ? buildCustomPalette(options.customColors)
      : buildPalette(options.palette)
  );
  const lastPaletteRef = useRef<FirePalette>(options.palette);
  const lastCustomColorsRef = useRef<string>(JSON.stringify(options.customColors ?? []));

  // Cached offscreen canvas — reused every frame, rebuilt only on resize
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const pixelDataRef = useRef<Uint32Array | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let fw = 0;
    let fh = 0;

    if (!tempCanvasRef.current) {
      tempCanvasRef.current = document.createElement("canvas");
      tempCtxRef.current = tempCanvasRef.current.getContext("2d")!;
    }

    function applyDpr(width: number, height: number) {
      const { resolution } = optionsRef.current;
      const dpr = window.devicePixelRatio || 1;
      const res = Math.max(0.1, Math.min(1, resolution));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      fw = Math.max(1, Math.round(width * res));
      fh = Math.max(1, Math.round(height * res));
      fireBufferRef.current = new Uint8Array(fw * fh);

      const tc = tempCanvasRef.current!;
      tc.width = fw;
      tc.height = fh;
      imageDataRef.current = tempCtxRef.current!.createImageData(fw, fh);
      pixelDataRef.current = new Uint32Array(imageDataRef.current.data.buffer);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function draw() {
      const { palette, customColors, intensity, windStrength, windDirection, spread, cooling, noiseStrength, coolingScale } =
        optionsRef.current;

      const hasCustom = customColors && customColors.length >= 2;
      const customKey = JSON.stringify(customColors ?? []);
      if (hasCustom) {
        if (customKey !== lastCustomColorsRef.current) {
          lastCustomColorsRef.current = customKey;
          paletteRef.current = buildCustomPalette(customColors!);
        }
      } else if (palette !== lastPaletteRef.current || lastCustomColorsRef.current !== "[]") {
        lastPaletteRef.current = palette;
        lastCustomColorsRef.current = "[]";
        paletteRef.current = buildPalette(palette);
      }

      const fire = fireBufferRef.current;
      const pixelData = pixelDataRef.current;
      const imageData = imageDataRef.current;
      if (!fire || !pixelData || !imageData || fw === 0 || fh === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Seed bottom row at full intensity — always solid base
      const baseIntensity = Math.round(intensity * 255);
      for (let x = 0; x < fw; x++) {
        fire[(fh - 1) * fw + x] = 255;
      }
      // Seed second-to-bottom row with noise to create distinct flame column starts
      const halfNoise = noiseStrength / 2;
      for (let x = 0; x < fw; x++) {
        const noise = Math.random() * noiseStrength - halfNoise;
        fire[(fh - 2) * fw + x] = Math.max(80, Math.min(255, baseIntensity + noise));
      }

      const wind = Math.round(windStrength * windDirection);
      const coolBase = Math.max(1, Math.round(cooling * coolingScale));

      // Classic 3-neighbor propagation: no twoBelow, spread weights sides smoothly
      for (let y = 0; y < fh - 1; y++) {
        const rowBelow = (y + 1) * fw;
        for (let x = 0; x < fw; x++) {
          const center = fire[rowBelow + x];
          const left   = x > 0       ? fire[rowBelow + x - 1] : center;
          const right  = x < fw - 1  ? fire[rowBelow + x + 1] : center;

          // Weighted avg: spread=0 → pure vertical, spread=1 → equal 3-neighbor
          const avg = (left * spread + center * 2 + right * spread) / (2 + spread * 2);

          // Random per-pixel cooling variation creates organic flame texture
          const cool = coolBase + (Math.random() * coolBase | 0);

          // Height-weighted turbulence: kills some upper pixels suddenly → jagged tips
          const yRatio = 1 - y / fh;
          const turbulence = Math.random() < yRatio * yRatio ? avg * 0.25 * Math.random() : 0;

          const cooled = avg - cool - turbulence;

          const wx = x + wind;
          const targetX = wx >= 0 && wx < fw ? wx : x;
          fire[y * fw + targetX] = Math.max(0, Math.min(255, cooled));
        }
      }

      // Render to cached imageData
      const pal = paletteRef.current;
      for (let i = 0; i < fw * fh; i++) {
        pixelData[i] = pal[fire[i]];
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tempCtxRef.current!.putImageData(imageData, 0, 0);
      ctx.drawImage(tempCanvasRef.current!, 0, 0, canvas.width, canvas.height);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
