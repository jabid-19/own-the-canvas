import { useRef, useEffect, RefObject } from "react";

export interface UseMandalaOptions {
  symmetry: number;
  colors: string[];
  lineWidth: number;
  speed: number;
  layers: number;
  radius: number;
  backgroundColor: string;
  animated: boolean;
  glowEffect: boolean;
  glowBlur: number;
  strokeOpacity: number;
  mirror: boolean;
  noiseAmount: number;
}

// Simple deterministic noise for mandala arms
function hash(n: number): number {
  let x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

export function useMandala(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseMandalaOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

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

    function drawPetal(
      cx: number, cy: number,
      r: number, layerIndex: number,
      t: number, color: string,
      symmetry: number, mirror: boolean,
      lineWidth: number, glowEffect: boolean, glowBlur: number,
      strokeOpacity: number, noiseAmount: number
    ) {
      const petals = 6 + layerIndex * 2;
      const layerPhase = (layerIndex / 8) * Math.PI * 2;
      const layerT = t * (1 + layerIndex * 0.15);

      for (let s = 0; s < symmetry; s++) {
        const baseAngle = (s / symmetry) * Math.PI * 2;

        for (let m = 0; m < (mirror ? 2 : 1); m++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(baseAngle + (m === 1 ? Math.PI / symmetry : 0));
          if (m === 1) ctx.scale(1, -1);

          ctx.beginPath();
          for (let i = 0; i <= petals * 3; i++) {
            const angle = (i / (petals * 3)) * Math.PI * 2;
            const noise = noiseAmount * Math.sin(angle * 3 + layerT + layerPhase);
            const rr = r * (0.5 + 0.5 * Math.abs(Math.sin(angle * (petals / 2) + layerT * 0.5)));
            const x = (rr + noise * r * 0.15) * Math.cos(angle);
            const y = (rr + noise * r * 0.1) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath();

          if (glowEffect) { ctx.shadowColor = color; ctx.shadowBlur = glowBlur; }
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth * (1 - layerIndex * 0.08);
          ctx.globalAlpha = strokeOpacity * (1 - layerIndex * 0.1);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          ctx.restore();
        }
      }
    }

    function draw() {
      const {
        symmetry, colors, lineWidth, speed, layers, radius,
        backgroundColor, animated, glowEffect, glowBlur,
        strokeOpacity, mirror, noiseAmount,
      } = optionsRef.current;

      if (animated) timeRef.current += speed * 0.005;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.45 * radius;

      for (let l = 0; l < layers; l++) {
        const r = maxR * (1 - l * (0.85 / layers));
        const color = colors[l % colors.length];
        drawPetal(cx, cy, r, l, t + l * 0.3, color, symmetry, mirror, lineWidth, glowEffect, glowBlur, strokeOpacity, noiseAmount);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [canvasRef]);
}
