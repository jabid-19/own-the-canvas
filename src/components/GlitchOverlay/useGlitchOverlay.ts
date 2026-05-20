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

  // Burst glitch state
  const burstTimerRef    = useRef<number>(0);
  const burstActiveRef   = useRef<boolean>(false);
  const burstLengthRef   = useRef<number>(0);
  const microGlitchRef   = useRef<number>(0);
  const invertFlashRef   = useRef<number>(0);
  const chromaPhaseRef   = useRef<number>(0);

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

      // Scanlines — draw vertical grid with variable shimmer
      if (scanlines) {
        for (let y = 0; y < h; y += scanlineSpacing) {
          // Even lines slightly different opacity for CRT feel
          const lineAlpha = scanlineOpacity * (y % (scanlineSpacing * 2) === 0 ? 1.2 : 0.7);
          ctx.fillStyle = "rgba(0,0,0,1)";
          ctx.globalAlpha = Math.min(1, lineAlpha);
          ctx.fillRect(0, y, w, 1);
        }
        ctx.globalAlpha = 1;
      }

      if (!animated) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const dt = 16;
      timeRef.current += speed * 0.016;
      chromaPhaseRef.current += speed * 0.02;

      // Burst timing — calm periods punctuated by glitch storms
      burstTimerRef.current -= dt;
      if (burstTimerRef.current <= 0) {
        if (burstActiveRef.current) {
          // End burst, start calm
          burstActiveRef.current = false;
          burstTimerRef.current = (800 + Math.random() * 2000) / speed;
        } else {
          // Start burst
          burstActiveRef.current = Math.random() < intensity;
          burstLengthRef.current = 80 + Math.random() * 300;
          burstTimerRef.current = burstLengthRef.current;
        }
      }

      // Micro-glitches even outside bursts (low probability)
      microGlitchRef.current -= dt;
      if (microGlitchRef.current <= 0) {
        microGlitchRef.current = 100 + Math.random() * 300 / speed;
      }
      const microActive = microGlitchRef.current < 40 && Math.random() < intensity * 0.4;
      const isGlitching = burstActiveRef.current || microActive;

      // Invert flash — rare, dramatic
      if (invertFlashRef.current > 0) {
        invertFlashRef.current -= dt;
        ctx.globalCompositeOperation = "difference";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.globalAlpha = Math.min(1, invertFlashRef.current / 30);
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      } else if (isGlitching && Math.random() < 0.005 * intensity) {
        invertFlashRef.current = 30 + Math.random() * 60;
      }

      // Flicker — screen brightness pulse
      if (Math.random() < flickerRate * (isGlitching ? 4 : 1)) {
        const flickAmt = isGlitching ? 0.08 : 0.02;
        ctx.fillStyle = `rgba(255,255,255,${flickAmt})`;
        ctx.fillRect(0, 0, w, h);
      }
      // Occasional dark frame dip
      if (isGlitching && Math.random() < 0.03 * intensity) {
        ctx.fillStyle = `rgba(0,0,0,0.4)`;
        ctx.fillRect(0, 0, w, h);
      }

      // Noise — static grain
      if (noiseOpacity > 0) {
        const noiseData = ctx.createImageData(w, h);
        const noiseBoost = isGlitching ? 1.8 : 1;
        for (let i = 0; i < noiseData.data.length; i += 4) {
          const v = Math.random() * 255 | 0;
          noiseData.data[i]     = v;
          noiseData.data[i + 1] = v;
          noiseData.data[i + 2] = v;
          noiseData.data[i + 3] = Math.random() < noiseOpacity * noiseBoost ? 60 : 0;
        }
        ctx.putImageData(noiseData, 0, 0);
      }

      if (isGlitching) {
        const glitchPower = burstActiveRef.current
          ? 1 - burstTimerRef.current / burstLengthRef.current  // ramp intensity within burst
          : 0.4;

        // Chromatic aberration — proper RGB separation via canvas self-copy
        if (rgbShift > 0) {
          const shift = rgbShift * intensity * glitchPower * (0.5 + Math.random() * 1.5);
          const waveShift = Math.sin(chromaPhaseRef.current * 3) * shift * 0.3;

          ctx.globalCompositeOperation = "screen";

          // Red channel — shift right
          ctx.fillStyle = `rgba(255,0,0,0.06)`;
          ctx.globalAlpha = 0.5 + glitchPower * 0.4;
          ctx.fillRect(shift + waveShift, 0, w, h);

          // Cyan (green+blue) channel — shift left
          ctx.fillStyle = `rgba(0,255,255,0.06)`;
          ctx.fillRect(-(shift + waveShift), 0, w, h);

          // Additional horizontal band with stronger shift
          const bandY = Math.random() * h;
          const bandH = 5 + Math.random() * 40;
          const bandShift = shift * (1 + Math.random() * 3);
          ctx.fillStyle = `rgba(255,0,0,0.12)`;
          ctx.globalAlpha = 0.7;
          ctx.fillRect(bandShift, bandY, w, bandH);
          ctx.fillStyle = `rgba(0,255,255,0.12)`;
          ctx.fillRect(-bandShift, bandY + 1, w, bandH);

          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
        }

        // Block glitch — horizontal slice displacement
        if (blockGlitch) {
          const bCount = Math.ceil(blockCount * glitchPower * (1 + Math.random() * 2));
          for (let b = 0; b < bCount; b++) {
            const blockY = Math.random() * h;
            const blockH = 1 + Math.random() * (isGlitching ? 30 : 12);
            // More dramatic displacement than before
            const maxDisplace = Math.max(rgbShift * 2, 20) * intensity * glitchPower;
            const blockX = (Math.random() - 0.5) * maxDisplace * 2;
            try {
              const imgData = ctx.getImageData(0, blockY, w, blockH);
              ctx.putImageData(imgData, blockX, blockY);
            } catch { /* cross-origin or zero-size */ }
          }
        }

        // Digital corruption bands — full-width tinted slices
        const corrBands = Math.floor(Math.random() * 4 * glitchPower);
        for (let c = 0; c < corrBands; c++) {
          const cy = Math.random() * h;
          const ch = 1 + Math.random() * 3;
          // Random color tint — monochrome green/amber CRT feel or full-color
          const tintHue = Math.random() < 0.5 ? `0,255,0` : `255,140,0`;
          ctx.fillStyle = `rgba(${tintHue},0.15)`;
          ctx.globalAlpha = 0.4 + Math.random() * 0.4;
          ctx.fillRect(0, cy, w, ch);
        }
        ctx.globalAlpha = 1;

        // Vertical displacement artifacts — column tears
        if (Math.random() < 0.15 * intensity * glitchPower) {
          const colX = Math.random() * w;
          const colW = 1 + Math.random() * 4;
          const colShift = (Math.random() - 0.5) * 20 * intensity;
          try {
            const colData = ctx.getImageData(colX, 0, colW, h);
            ctx.putImageData(colData, colX, colShift);
          } catch { /* ignore */ }
        }

        // Glitch bar overlay — bright line artifact
        const barY = Math.floor(Math.random() * h);
        const barH = 1 + Math.random() * 3;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2 * intensity * glitchPower;
        ctx.fillRect(0, barY, w, barH);
        ctx.globalAlpha = 1;

        // Occasional data-corruption block — rectangular region of noise
        if (Math.random() < 0.04 * intensity) {
          const rx = Math.random() * w * 0.7;
          const ry = Math.random() * h;
          const rw = 20 + Math.random() * w * 0.3;
          const rh = 2 + Math.random() * 20;
          const corruptData = ctx.createImageData(rw, rh);
          for (let i = 0; i < corruptData.data.length; i += 4) {
            corruptData.data[i]     = Math.random() * 255 | 0;
            corruptData.data[i + 1] = Math.random() * 255 | 0;
            corruptData.data[i + 2] = Math.random() * 255 | 0;
            corruptData.data[i + 3] = 180;
          }
          ctx.putImageData(corruptData, rx, ry);
        }
      }

      // Vignette — always present, stronger during glitch
      const vigRadius = Math.max(w, h) * (isGlitching ? 0.65 : 0.75);
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, vigRadius);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, `rgba(0,0,0,${isGlitching ? 0.5 : 0.35})`);
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
