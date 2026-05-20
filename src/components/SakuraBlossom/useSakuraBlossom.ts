import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVel: number;
  size: number;
  alpha: number;
  settled: boolean;
  settleY: number;
  phase: number; // individual wind phase offset
  scaleY: number; // tumble flattening
}

export interface UseSakuraBlossomOptions {
  petalCount: number;
  petalColor: string;
  backgroundColor: string;
  gravity: number;
  windStrength: number;
  windGusts: boolean;
  showAccumulation: boolean;
  maxAccumulation: number;
  petalSize: number;
}

export function useSakuraBlossom(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseSakuraBlossomOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const petalsRef = useRef<Petal[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const gustRef = useRef({ strength: 0, dir: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function makePetal(atTop = false): Petal {
      const { petalSize } = optionsRef.current;
      return {
        x: Math.random() * w,
        y: atTop ? -petalSize - Math.random() * 80 : Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 0.06,
        size: petalSize * (0.7 + Math.random() * 0.6),
        alpha: 0.6 + Math.random() * 0.4,
        settled: false,
        settleY: 0,
        phase: Math.random() * Math.PI * 2,
        scaleY: 1,
      };
    }

    function initPetals() {
      const { petalCount } = optionsRef.current;
      petalsRef.current = Array.from({ length: petalCount }, () => makePetal(false));
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width;
      h = height;
      initPetals();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function drawPetal(p: Petal, color: string) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(1, p.scaleY);
      ctx.globalAlpha = p.alpha;

      const s = p.size;
      ctx.beginPath();
      // Teardrop / petal shape with quadratic curves
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.8, -s * 0.3, 0, s * 0.6);
      ctx.quadraticCurveTo(-s * 0.8, -s * 0.3, 0, -s);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function draw(dt: number) {
      const {
        petalCount, petalColor, backgroundColor, gravity,
        windStrength, windGusts, showAccumulation, maxAccumulation,
      } = optionsRef.current;

      timeRef.current += dt * 0.001;
      const t = timeRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // Gust logic
      const gust = gustRef.current;
      if (windGusts) {
        if (Math.random() < 0.003) {
          gust.strength = 2 + Math.random() * 3;
          gust.dir = Math.random() < 0.5 ? 1 : -1;
        }
        gust.strength *= 0.985;
      }

      const effectiveWind = windStrength + gust.strength * gust.dir;

      // Ensure petal count matches
      while (petalsRef.current.length < petalCount) petalsRef.current.push(makePetal(true));
      if (petalsRef.current.length > petalCount) petalsRef.current.length = petalCount;

      const petalRgb = hexToRgbString(petalColor);
      const colorStr = `rgb(${petalRgb})`;

      // Count settled petals for accumulation height
      const settled = petalsRef.current.filter((p) => p.settled);
      const accumulationH = showAccumulation
        ? Math.min(maxAccumulation, settled.length * 0.6)
        : 0;
      const floorY = h - accumulationH;

      // Draw settled petal pile
      if (showAccumulation && settled.length > 0) {
        for (const p of settled) {
          drawPetal(p, colorStr);
        }
      }

      // Update + draw falling petals
      for (const p of petalsRef.current) {
        if (p.settled) continue;

        // Wind oscillation per petal (unique phase)
        const windOsc = Math.sin(t * 1.5 + p.phase) * effectiveWind * 0.5;
        p.vx += windOsc * 0.01;
        p.vy += gravity * 0.016;
        p.x += p.vx + effectiveWind * 0.02;
        p.y += p.vy;
        p.angle += p.angularVel + Math.sin(t * 2 + p.phase) * 0.002;
        p.scaleY = 0.6 + Math.abs(Math.sin(p.angle * 1.5)) * 0.4;

        // Wrap horizontal
        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;

        // Settle when hitting floor
        if (p.y >= floorY - p.size * 0.5) {
          if (showAccumulation) {
            p.settled = true;
            p.x = Math.max(p.size, Math.min(w - p.size, p.x));
            p.y = floorY - p.size * 0.3;
            p.settleY = p.y;
            p.angle = (Math.random() - 0.5) * 0.6;
            p.alpha *= 0.8;

            // Recycle if too many settled
            if (settled.length > petalCount * 0.6) {
              const oldest = petalsRef.current.find((q) => q.settled);
              if (oldest) Object.assign(oldest, makePetal(true));
            }
          } else {
            Object.assign(p, makePetal(true));
          }
        }

        drawPetal(p, colorStr);
      }
    }

    let lastTime = 0;
    function loop(timestamp: number) {
      const dt = lastTime ? timestamp - lastTime : 16;
      lastTime = timestamp;
      draw(dt);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
