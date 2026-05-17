import { useRef, useEffect, RefObject } from "react";

interface Wave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
  lineWidth: number;
  speed: number;
}

export interface UseShockwaveOptions {
  color: string;
  secondaryColor: string;
  ringCount: number;
  ringSpacing: number;
  speed: number;
  maxRadius: number;
  lineWidth: number;
  fadeSpeed: number;
  autoFire: boolean;
  autoInterval: number;
  glowEffect: boolean;
  glowBlur: number;
  backgroundColor: string;
}

export function useShockwave(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseShockwaveOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const wavesRef = useRef<Wave[]>([]);
  const rafRef = useRef<number>(0);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fire = (x: number, y: number) => {
    const { color, secondaryColor, ringCount, ringSpacing, speed, maxRadius, lineWidth } = optionsRef.current;
    for (let i = 0; i < ringCount; i++) {
      const isSecondary = i % 2 === 1;
      wavesRef.current.push({
        x, y,
        radius: i * ringSpacing,
        maxRadius: maxRadius + i * ringSpacing * 0.5,
        opacity: 1,
        color: isSecondary ? secondaryColor : color,
        lineWidth: lineWidth * (1 - i * 0.15),
        speed: speed * (1 + i * 0.05),
      });
    }
  };

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

    function onClick(e: MouseEvent) {
      const bounding = canvasRef.current!.getBoundingClientRect();
      fire(e.clientX - bounding.left, e.clientY - bounding.top);
    }
    parent.addEventListener("click", onClick);

    function scheduleAuto() {
      const { autoFire, autoInterval } = optionsRef.current;
      if (!autoFire) return;
      autoTimerRef.current = setTimeout(() => {
        fire(w * (0.3 + Math.random() * 0.4), h * (0.3 + Math.random() * 0.4));
        scheduleAuto();
      }, autoInterval);
    }
    scheduleAuto();

    function draw() {
      const { backgroundColor, glowEffect, glowBlur, fadeSpeed } = optionsRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const alive: Wave[] = [];
      for (const wave of wavesRef.current) {
        wave.radius += wave.speed;
        wave.opacity -= fadeSpeed;
        if (wave.opacity <= 0 || wave.radius > wave.maxRadius) continue;
        alive.push(wave);

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity;
        ctx.lineWidth = wave.lineWidth * wave.opacity;
        if (glowEffect) {
          ctx.shadowColor = wave.color;
          ctx.shadowBlur = glowBlur;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
      wavesRef.current = alive;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      parent.removeEventListener("click", onClick);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [canvasRef]);

  return { fire };
}
