import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

export type StarfieldPerspective = "2D" | "3D";

interface Star2D {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface Star3D {
  x: number;
  y: number;
  z: number;
  pz: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export interface UseStarfieldOptions {
  starCount: number;
  starColor: string;
  shootingStarColor: string;
  backgroundColor: string;
  speed: number;
  twinkle: boolean;
  shootingStars: boolean;
  shootingStarInterval: number;
  perspective: StarfieldPerspective;
  starSizeMin: number;
  starSizeMax: number;
  starOpacityMin: number;
  starOpacityMax: number;
  twinkleSpeed: number;
  shootingStarLength: number;
  shootingStarLifetime: number;
}

export function useStarfield(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseStarfieldOptions
) {
  const stars2DRef = useRef<Star2D[]>([]);
  const stars3DRef = useRef<Star3D[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const lastShootingRef = useRef<number>(0);
  const reinitRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    reinitRef.current?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.starCount]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function init2D(width: number, height: number) {
      const { starCount, starSizeMin, starSizeMax, starOpacityMin, starOpacityMax, twinkleSpeed } = optionsRef.current;
      stars2DRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (starSizeMax - starSizeMin) + starSizeMin,
        opacity: Math.random() * (starOpacityMax - starOpacityMin) + starOpacityMin,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * twinkleSpeed + twinkleSpeed * 0.3,
      }));
    }

    function init3D(width: number, height: number) {
      const { starCount } = optionsRef.current;
      const depth = Math.max(width, height);
      stars3DRef.current = Array.from({ length: starCount }, () => ({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * depth,
        pz: 0,
      }));
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width;
      h = height;
      init2D(width, height);
      init3D(width, height);
    }

    reinitRef.current = () => { if (w > 0 && h > 0) { init2D(w, h); init3D(w, h); } };

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function draw(timestamp: number) {
      const {
        starColor, shootingStarColor, backgroundColor, speed, twinkle, shootingStars,
        shootingStarInterval, perspective, shootingStarLength, shootingStarLifetime,
      } = optionsRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      if (perspective === "3D") {
        const cx = w / 2;
        const cy = h / 2;
        const depth = Math.max(w, h);
        const stars = stars3DRef.current;

        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          star.pz = star.z;
          star.z -= speed * 4;
          if (star.z <= 0) {
            star.x = (Math.random() - 0.5) * w * 2;
            star.y = (Math.random() - 0.5) * h * 2;
            star.z = depth;
            star.pz = star.z;
          }

          // Correct: use w for x-projection, h for y-projection
          const sx = (star.x / star.z) * w + cx;
          const sy = (star.y / star.z) * h + cy;
          const px = (star.x / star.pz) * w + cx;
          const py = (star.y / star.pz) * h + cy;

          const size = Math.max((1 - star.z / depth) * 3, 0.1);
          const opacity = 1 - star.z / depth;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = hexToRgba(starColor, opacity);
          ctx.lineWidth = size;
          ctx.stroke();
        }
      } else {
        const stars = stars2DRef.current;
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          star.y += speed * (star.size / 2);
          if (star.y > h) { star.y = 0; star.x = Math.random() * w; }

          let alpha = star.opacity;
          if (twinkle) {
            star.twinklePhase += star.twinkleSpeed;
            alpha = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase));
          }

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(starColor, alpha);
          ctx.fill();
        }

        if (shootingStars) {
          if (timestamp - lastShootingRef.current > shootingStarInterval) {
            lastShootingRef.current = timestamp;
            const vx = Math.random() * 8 + 4;
            const vy = Math.random() * 4 + 2;
            shootingStarsRef.current.push({
              x: Math.random() * w * 0.7,
              y: Math.random() * h * 0.3,
              vx,
              vy,
              length: Math.random() * (shootingStarLength * 0.5) + shootingStarLength * 0.5,
              opacity: 1,
              life: 0,
              maxLife: shootingStarLifetime,
            });
          }

          shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
            s.x += s.vx;
            s.y += s.vy;
            s.life++;
            s.opacity = 1 - s.life / s.maxLife;

            if (s.opacity <= 0) return false;

            const tailLen = s.length / Math.sqrt(s.vx * s.vx + s.vy * s.vy);
            const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tailLen, s.y - s.vy * tailLen);
            gradient.addColorStop(0, hexToRgba(shootingStarColor, s.opacity));
            gradient.addColorStop(1, hexToRgba(shootingStarColor, 0));

            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x - s.vx * tailLen, s.y - s.vy * tailLen);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            return true;
          });
        }
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
