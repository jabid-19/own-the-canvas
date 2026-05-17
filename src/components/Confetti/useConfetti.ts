import { useRef, useEffect, RefObject } from "react";

export type ConfettiShape = "square" | "circle" | "triangle" | "strip";

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularV: number;
  color: string;
  shape: ConfettiShape;
  w: number;
  h: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export interface UseConfettiOptions {
  trigger: boolean;
  particleCount: number;
  spread: number;
  gravity: number;
  colors: string[];
  shapes: ConfettiShape[];
  duration: number;
  continuous: boolean;
  wind: number;
  spawnX: number;
  spawnY: number;
  spawnSpread: number;
  speedMin: number;
  speedMax: number;
  sizeMin: number;
  sizeMax: number;
  angularVelocity: number;
  emissionRate: number;
  onComplete?: () => void;
}

export function useConfetti(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseConfettiOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const piecesRef = useRef<Piece[]>([]);
  const rafRef = useRef<number>(0);
  const prevTriggerRef = useRef<boolean>(false);
  const completedRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);
  const continuousAccRef = useRef<number>(0);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width;
      h = height;
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function spawnBurst(count: number) {
      const { spread, colors, shapes, duration, spawnX, spawnY, spawnSpread, speedMin, speedMax, sizeMin, sizeMax, angularVelocity } = optionsRef.current;
      const cx = w * spawnX;
      const cy = h * spawnY;
      const frameTarget = Math.max(1, duration / 16.67);

      for (let i = 0; i < count; i++) {
        const angle = (Math.random() * 2 - 1) * spread * Math.PI;
        const speed = Math.random() * (speedMax - speedMin) + speedMin;
        piecesRef.current.push({
          x: cx + (Math.random() - 0.5) * spawnSpread,
          y: cy,
          vx: Math.sin(angle) * speed,
          vy: -Math.cos(angle) * speed,
          angle: Math.random() * Math.PI * 2,
          angularV: (Math.random() - 0.5) * angularVelocity,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          w: Math.random() * (sizeMax - sizeMin) + sizeMin,
          h: Math.random() * (sizeMax - sizeMin) * 0.75 + sizeMin * 0.5,
          opacity: 1,
          life: 0,
          maxLife: frameTarget,
        });
      }
    }

    function drawShape(piece: Piece) {
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.angle);
      ctx.globalAlpha = piece.opacity;
      ctx.fillStyle = piece.color;

      switch (piece.shape) {
        case "square":
          ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, piece.w / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -piece.h / 2);
          ctx.lineTo(piece.w / 2, piece.h / 2);
          ctx.lineTo(-piece.w / 2, piece.h / 2);
          ctx.closePath();
          ctx.fill();
          break;
        case "strip":
          ctx.fillRect(-piece.w, -piece.h / 4, piece.w * 2, piece.h / 2);
          break;
      }
      ctx.restore();
    }

    function draw(timestamp: number) {
      const dt = lastTimeRef.current ? Math.min(timestamp - lastTimeRef.current, 50) : 16.67;
      lastTimeRef.current = timestamp;

      const { trigger, particleCount, gravity, continuous, wind, emissionRate, onComplete } = optionsRef.current;

      // Trigger burst on rising edge
      if (trigger && !prevTriggerRef.current) {
        spawnBurst(particleCount);
        completedRef.current = false;
      }
      prevTriggerRef.current = trigger;

      // Continuous mode — emit at steady rate
      if (continuous && trigger) {
        continuousAccRef.current += emissionRate * dt / 1000;
        const toSpawn = Math.floor(continuousAccRef.current);
        if (toSpawn > 0) {
          spawnBurst(toSpawn);
          continuousAccRef.current -= toSpawn;
        }
      }

      ctx.clearRect(0, 0, w, h);

      const dtFactor = dt / 16.67;

      piecesRef.current = piecesRef.current.filter((p) => {
        p.vy += gravity * 0.3 * dtFactor;
        p.vx += wind * 0.05 * dtFactor;
        p.x += p.vx * dtFactor;
        p.y += p.vy * dtFactor;
        p.angle += p.angularV * dtFactor;
        p.life += dtFactor;
        p.opacity = Math.max(0, 1 - p.life / p.maxLife);

        if (p.opacity <= 0 || p.y > h + 50) return false;

        drawShape(p);
        return true;
      });

      ctx.globalAlpha = 1;

      // Fire onComplete exactly once when burst finishes
      if (
        !completedRef.current &&
        trigger &&
        !continuous &&
        piecesRef.current.length === 0 &&
        prevTriggerRef.current
      ) {
        completedRef.current = true;
        onComplete?.();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
