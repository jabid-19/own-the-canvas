import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

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

function rgbToHue(rgb: string): number {
  const [r, g, b] = rgb.split(",").map((v) => Number(v) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d === 0) return 0;
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return h * 60;
}

/**
 * A harmonograph: a pen moved by two pendulums on each axis, slightly out of tune with each
 * other, while friction slowly bleeds their swing. The pen draws onto a persistent ink layer,
 * so the figure builds up into a dense spiralling rosette, then fades and starts over with
 * new phases.
 */
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
    const ink = document.createElement("canvas");
    const ictx = ink.getContext("2d")!;
    const glow = document.createElement("canvas");
    const gctx = glow.getContext("2d")!;
    let w = 0, h = 0, dpr = 1;

    // pendulum state
    let tau = 0, k = 1, fade = 1, resetting = false;
    let p = [0, 0, 0, 0];
    let detune = [0, 0];
    let prev: { x: number; y: number } | null = null;

    function restart() {
      tau = 0;
      k = 1;
      p = [Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28];
      detune = [(Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02];
      prev = null;
      ictx.setTransform(1, 0, 0, 1, 0, 0);
      ictx.clearRect(0, 0, ink.width, ink.height);
    }

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ink.width = canvas!.width;
      ink.height = canvas!.height;
      glow.width = Math.max(1, Math.round(width / 3));
      glow.height = Math.max(1, Math.round(height / 3));
      w = width; h = height;
      restart();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    function penAt(o: UsePendulaWaveOptions): { x: number; y: number } {
      const ax = (w / 2) * o.amplitude * 0.92;
      const ay = (h / 2) * o.amplitude * 0.9;
      const f1 = o.freq1, f2 = o.freq2;
      const f3 = f2 + o.freq3 + detune[0];
      const f4 = f1 + o.freq3 * 1.3 + detune[1];
      return {
        x: w / 2 + ax * k * (0.62 * Math.sin(f1 * tau + p[0]) + 0.38 * Math.sin(f3 * tau + p[1])),
        y: h / 2 + ay * k * (0.62 * Math.sin(f2 * tau + p[2]) + 0.38 * Math.sin(f4 * tau + p[3])),
      };
    }

    let raf = 0, last = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (w === 0) return;
      const o = optionsRef.current;
      const c1 = hexToRgbString(o.color);
      const c2 = hexToRgbString(o.color2);
      const bgc = hexToRgbString(o.backgroundColor);
      const hue0 = rgbToHue(c1);

      ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // a gentle fade on the ink, so very old strokes recede
      if (o.trailFade > 0) {
        ictx.globalCompositeOperation = "destination-out";
        ictx.fillStyle = `rgba(0,0,0,${Math.min(0.2, o.trailFade * 0.18)})`;
        ictx.fillRect(0, 0, w, h);
        ictx.globalCompositeOperation = "source-over";
      }

      if (o.animated && !resetting) {
        const steps = Math.round(70 * o.speed * dt * 60 / 60) + 1;
        ictx.lineCap = "round";
        ictx.lineJoin = "round";
        ictx.lineWidth = Math.max(0.5, o.lineWidth) * 1.1;
        for (let s = 0; s < steps; s++) {
          tau += 0.011;
          k *= Math.pow(o.damping, 0.6);
          const pt = penAt(o);
          if (prev) {
            let stroke: string;
            if (o.colorMode === "cycle") {
              stroke = `hsla(${hue0 + Math.sin(tau * 0.05) * 70 + tau * 0.6},85%,64%,0.7)`;
            } else if (o.colorMode === "gradient") {
              const m = 1 - k;
              const c = c1.split(",").map((v, i) => Math.round(+v + (+c2.split(",")[i] - +v) * m)).join(",");
              stroke = `rgba(${c},0.72)`;
            } else {
              stroke = `rgba(${c1},0.7)`;
            }
            ictx.strokeStyle = stroke;
            ictx.beginPath();
            ictx.moveTo(prev.x, prev.y);
            ictx.lineTo(pt.x, pt.y);
            ictx.stroke();
          }
          prev = pt;
        }
        if (k < 0.04 && o.autoReset) resetting = true;
      }
      if (resetting) {
        fade -= dt / 1.4;
        if (fade <= 0) { restart(); fade = 1; resetting = false; }
      }

      // compose: background, ink, glow, pen
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
      bg.addColorStop(0, `rgb(${bgc.split(",").map((v, i) => Math.round(+v + (+c1.split(",")[i] - +v) * 0.06)).join(",")})`);
      bg.addColorStop(1, `rgb(${bgc})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = fade;
      ctx.drawImage(ink, 0, 0, w, h);
      if (o.glowEffect) {
        gctx.setTransform(1, 0, 0, 1, 0, 0);
        gctx.clearRect(0, 0, glow.width, glow.height);
        gctx.drawImage(ink, 0, 0, glow.width, glow.height);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = fade * Math.min(0.85, 0.25 + o.glowBlur / 30);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(glow, 0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.globalAlpha = 1;

      if (prev && !resetting) {
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(prev.x, prev.y, 0, prev.x, prev.y, 14);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.3, `rgba(${c1},0.6)`);
        g.addColorStop(1, `rgba(${c1},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(prev.x, prev.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [canvasRef]);
}
