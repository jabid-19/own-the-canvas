import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export interface UseParticleFieldOptions {
  particleCount: number;
  particleColor: string;
  lineColor: string;
  lineDistance: number;
  particleSize: number;
  speed: number;
  connectParticles: boolean;
  interactive: boolean;
  backgroundColor: string;
  repelRadius: number;
  repelStrength: number;
  friction: number;
  maxVelocityMultiplier: number;
  lineWidth: number;
  lineOpacity: number;
}

export function useParticleField(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseParticleFieldOptions
) {
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);

  // Cache RGB strings so we don't recompute every frame
  const particleRgbRef = useRef<string>("");
  const lineRgbRef = useRef<string>("");
  const lastParticleColorRef = useRef<string>("");
  const lastLineColorRef = useRef<string>("");

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function initParticles(width: number, height: number) {
      const { particleCount, particleSize, speed } = optionsRef.current;
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        size: Math.random() * particleSize + particleSize * 0.4,
        opacity: Math.random() * 0.5 + 0.5,
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
      initParticles(width, height);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const bounding = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - bounding.left, y: e.clientY - bounding.top };
    }
    function onMouseLeave() {
      mouseRef.current = null;
    }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function draw() {
      const {
        particleColor, lineColor, lineDistance, connectParticles, backgroundColor,
        speed, repelRadius, repelStrength, friction, maxVelocityMultiplier, lineWidth, lineOpacity,
      } = optionsRef.current;

      // Recompute color strings only when color props change
      if (particleColor !== lastParticleColorRef.current) {
        particleRgbRef.current = hexToRgbString(particleColor);
        lastParticleColorRef.current = particleColor;
      }
      if (lineColor !== lastLineColorRef.current) {
        lineRgbRef.current = hexToRgbString(lineColor);
        lastLineColorRef.current = lineColor;
      }

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const particleRgb = particleRgbRef.current;
      const lineRgb = lineRgbRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repelRadius && dist > 0) {
            const force = ((repelRadius - dist) / repelRadius) * 2;
            p.vx += (dx / dist) * force * repelStrength;
            p.vy += (dy / dist) * force * repelStrength;
          }
        }

        p.vx *= friction;
        p.vy *= friction;

        const maxV = speed * maxVelocityMultiplier;
        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (vel > maxV) {
          p.vx = (p.vx / vel) * maxV;
          p.vy = (p.vy / vel) * maxV;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleRgb},${p.opacity})`;
        ctx.fill();

        if (connectParticles) {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < lineDistance) {
              const alpha = (1 - dist / lineDistance) * lineOpacity;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(${lineRgb},${alpha})`;
              ctx.lineWidth = lineWidth;
              ctx.stroke();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
