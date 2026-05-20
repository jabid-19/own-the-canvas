import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

export type PendulaWaveColorMode = "solid" | "cycle" | "gradient";

export interface UsePendulaWaveOptions {
  color: string;
  color2: string;
  backgroundColor: string;
  lineWidth: number;
  trailFade: number;
  speed: number;
  damping: number;
  freq1: number;
  freq2: number;
  freq3: number;
  amplitude: number;
  colorMode: PendulaWaveColorMode;
  glowEffect: boolean;
  glowBlur: number;
  animated: boolean;
  autoReset: boolean;
}

function parseHexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  return [r, g, b];
}

function lerpColor(c1: [number,number,number], c2: [number,number,number], t: number): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export function usePendulaWave(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UsePendulaWaveOptions
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
    let rafId = 0;

    // Harmonograph state
    let t = 0;
    let stepCount = 0;
    let prevX = 0;
    let prevY = 0;
    let initialized = false;

    function initState() {
      t = 0;
      stepCount = 0;
      initialized = false;
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
      ctx.fillStyle = optionsRef.current.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      initState();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function getColor(hue: number, t01: number): string {
      const { color, color2, colorMode } = optionsRef.current;
      if (colorMode === "cycle") {
        return `hsl(${(hue * 360) % 360},80%,65%)`;
      }
      if (colorMode === "gradient") {
        const c1 = parseHexRgb(color);
        const c2 = parseHexRgb(color2);
        return lerpColor(c1, c2, (Math.sin(t01 * Math.PI * 2) + 1) * 0.5);
      }
      return color;
    }

    let lastTime = 0;

    function loop(timestamp: number) {
      const dt = lastTime ? timestamp - lastTime : 16;
      lastTime = timestamp;

      const { backgroundColor, lineWidth, trailFade, speed, damping, freq1, freq2, freq3, amplitude, glowEffect, glowBlur, animated, autoReset } = optionsRef.current;

      if (!animated) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      // Fade background
      ctx.fillStyle = hexToRgba(backgroundColor, trailFade);
      ctx.fillRect(0, 0, cssW, cssH);

      const stepsPerFrame = Math.max(1, Math.round(speed * dt * 0.5));
      const cx = cssW / 2;
      const cy = cssH / 2;
      const A = Math.min(cx, cy) * amplitude;

      for (let s = 0; s < stepsPerFrame; s++) {
        const decay = Math.pow(damping, stepCount);
        const phase = Math.sin(freq3 * t) * Math.PI;
        const x = cx + A * Math.sin(freq1 * t + phase) * decay;
        const y = cy + A * Math.sin(freq2 * t) * decay;

        if (!initialized) {
          prevX = x;
          prevY = y;
          initialized = true;
        } else {
          const hue = (t * 0.01) % 1;
          const t01 = (t * 0.005) % 1;
          ctx.strokeStyle = getColor(hue, t01);
          ctx.lineWidth = lineWidth;
          ctx.lineCap = "round";

          if (glowEffect) {
            ctx.shadowBlur = glowBlur;
            ctx.shadowColor = optionsRef.current.color;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        prevX = x;
        prevY = y;
        t += 0.02;
        stepCount++;

        // Reset when energy too low
        if (autoReset && stepCount > 100 && decay < 0.01) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, cssW, cssH);
          initState();
          break;
        }
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [canvasRef]);
}
