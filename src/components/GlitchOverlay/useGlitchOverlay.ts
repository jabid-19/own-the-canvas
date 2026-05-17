import { useRef, useEffect, RefObject } from "react";

export interface UseGlitchOverlayOptions {
  intensity: number;
  speed: number;
  rgbShift: number;
  scanlines: boolean;
  scanlineOpacity: number;
  scanlineSpacing: number;
  blockGlitch: boolean;
  blockCount: number;
  noiseOpacity: number;
  flickerRate: number;
  color: string;
  animated: boolean;
  backgroundColor: string;
}

export function useGlitchOverlay(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseGlitchOverlayOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const glitchTimerRef = useRef<number>(0);
  const glitchActiveRef = useRef<boolean>(false);
  const glitchDurationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function applyDpr(width: number, height: number) {
      const cvs = canvasRef.current!;
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.round(width * dpr);
      cvs.height = Math.round(height * dpr);
      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function draw() {
      const {
        animated, intensity, speed, rgbShift, scanlines, scanlineOpacity, scanlineSpacing,
        blockGlitch, blockCount, noiseOpacity, flickerRate, color, backgroundColor,
      } = optionsRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      // Scanlines — always drawn regardless of animated state
      if (scanlines) {
        ctx.fillStyle = "rgba(0,0,0,1)";
        for (let y = 0; y < h; y += scanlineSpacing) {
          ctx.globalAlpha = scanlineOpacity;
          ctx.fillRect(0, y, w, 1);
        }
        ctx.globalAlpha = 1;
      }

      if (!animated) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      timeRef.current += speed * 0.016;

      // Glitch timing — random bursts
      glitchTimerRef.current -= 16;
      if (glitchTimerRef.current <= 0) {
        glitchActiveRef.current = Math.random() < intensity;
        glitchDurationRef.current = 50 + Math.random() * 150;
        glitchTimerRef.current = glitchDurationRef.current + 200 / speed + Math.random() * 400 / speed;
      }
      if (glitchDurationRef.current > 0) glitchDurationRef.current -= 16;
      else glitchActiveRef.current = false;

      const isGlitching = glitchActiveRef.current;

      // Flicker
      if (Math.random() < flickerRate * (isGlitching ? 3 : 1)) {
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.fillRect(0, 0, w, h);
      }

      // Noise
      if (noiseOpacity > 0) {
        const noiseData = ctx.createImageData(w, h);
        for (let i = 0; i < noiseData.data.length; i += 4) {
          const v = Math.random() * 255 | 0;
          noiseData.data[i] = v;
          noiseData.data[i + 1] = v;
          noiseData.data[i + 2] = v;
          noiseData.data[i + 3] = Math.random() < noiseOpacity ? 60 : 0;
        }
        ctx.putImageData(noiseData, 0, 0);
      }

      if (isGlitching) {
        // RGB shift bands
        if (rgbShift > 0) {
          const shift = rgbShift * intensity * (Math.random() * 2 - 1);
          const bandHeight = 10 + Math.random() * 60;
          const bandY = Math.random() * h;

          ctx.globalCompositeOperation = "screen";

          ctx.fillStyle = `rgba(255,0,0,0.08)`;
          ctx.globalAlpha = 0.6;
          ctx.fillRect(shift, bandY, w, bandHeight);

          ctx.fillStyle = `rgba(0,255,255,0.08)`;
          ctx.fillRect(-shift, bandY + 2, w, bandHeight);

          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
        }

        // Block glitch — misaligned horizontal slices
        if (blockGlitch) {
          for (let b = 0; b < blockCount; b++) {
            const blockY = Math.random() * h;
            const blockH = 2 + Math.random() * 20;
            const blockX = (Math.random() - 0.5) * rgbShift * 2;
            try {
              const imgData = ctx.getImageData(0, blockY, w, blockH);
              ctx.putImageData(imgData, blockX, blockY);
            } catch {}
          }
        }

        // Glitch bar overlay
        const barY = Math.floor(Math.random() * h);
        const barH = 1 + Math.random() * 4;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.15 * intensity;
        ctx.fillRect(0, barY, w, barH);
        ctx.globalAlpha = 1;
      }

      // Vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
