import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  twinklePhase?: number;
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
  wrapEdges: boolean;
  twinkle: boolean;
  twinkleSpeed: number;
  twinkleAmplitude: number;
  glowParticles: boolean;
  glowBlur: number;
  lineStyle: "solid" | "dashed";
  dragParticles: boolean;
  dragRadius: number;
  velocityMultiplier: number;
}

export function useParticleField(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseParticleFieldOptions
) {
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ particleIndex: number; offsetX: number; offsetY: number } | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);

  const particleRgbRef = useRef<string>("");
  const lineRgbRef = useRef<string>("");
  const lastParticleColorRef = useRef<string>("");
  const lastLineColorRef = useRef<string>("");
  const reinitRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    reinitRef.current?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.particleCount, options.particleSize]);

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
      const { particleCount, particleSize, speed, velocityMultiplier, twinkle } = optionsRef.current;
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * velocityMultiplier,
        vy: (Math.random() - 0.5) * speed * velocityMultiplier,
        size: Math.random() * particleSize + particleSize * 0.4,
        opacity: Math.random() * 0.5 + 0.5,
        twinklePhase: twinkle ? Math.random() * Math.PI * 2 : undefined,
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

    reinitRef.current = () => { if (w > 0 && h > 0) initParticles(w, h); };

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function getPos(e: MouseEvent) {
      const bounding = canvas.getBoundingClientRect();
      return { x: e.clientX - bounding.left, y: e.clientY - bounding.top };
    }

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.dragParticles) return;
      const { x, y } = getPos(e);
      const particles = particlesRef.current;
      const { dragRadius } = optionsRef.current;
      let closest = -1;
      let minDist = dragRadius;
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - x;
        const dy = particles[i].y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) { minDist = dist; closest = i; }
      }
      if (closest !== -1) {
        dragRef.current = { particleIndex: closest, offsetX: particles[closest].x - x, offsetY: particles[closest].y - y };
      }
    }

    function onMouseMove(e: MouseEvent) {
      const { x, y } = getPos(e);
      if (dragRef.current) {
        const p = particlesRef.current[dragRef.current.particleIndex];
        p.x = x + dragRef.current.offsetX;
        p.y = y + dragRef.current.offsetY;
        p.vx = 0;
        p.vy = 0;
      }
      if (optionsRef.current.interactive) {
        mouseRef.current = { x, y };
      }
    }

    function onMouseUp() { dragRef.current = null; }

    function onMouseLeave() {
      mouseRef.current = null;
      dragRef.current = null;
    }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function draw() {
      const {
        particleColor, lineColor, lineDistance, connectParticles, backgroundColor,
        speed, repelRadius, repelStrength, friction, maxVelocityMultiplier, lineWidth, lineOpacity,
        wrapEdges, twinkle, twinkleSpeed, twinkleAmplitude, glowParticles, glowBlur, lineStyle,
      } = optionsRef.current;

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

      // Physics update
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Skip physics for actively dragged particle
        if (dragRef.current && dragRef.current.particleIndex === i) continue;

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

        if (wrapEdges) {
          if (p.x < 0) p.x += w;
          else if (p.x > w) p.x -= w;
          if (p.y < 0) p.y += h;
          else if (p.y > h) p.y -= h;
        } else {
          if (p.x < 0) { p.x = 0; p.vx *= -1; }
          if (p.x > w) { p.x = w; p.vx *= -1; }
          if (p.y < 0) { p.y = 0; p.vy *= -1; }
          if (p.y > h) { p.y = h; p.vy *= -1; }
        }

        if (twinkle) {
          if (p.twinklePhase === undefined) p.twinklePhase = Math.random() * Math.PI * 2;
          p.twinklePhase += twinkleSpeed;
        }
      }

      // Draw connection lines
      if (connectParticles) {
        if (lineStyle === "dashed") ctx.setLineDash([4, 6]);
        else ctx.setLineDash([]);

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < lineDistance) {
              const alpha = (1 - dist / lineDistance) * lineOpacity;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(${lineRgb},${alpha})`;
              ctx.lineWidth = lineWidth;
              ctx.stroke();
            }
          }
        }
        ctx.setLineDash([]);
      }

      // Draw particles on top of lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const alpha = twinkle && p.twinklePhase !== undefined
          ? (1 - twinkleAmplitude) + twinkleAmplitude * Math.sin(p.twinklePhase)
          : p.opacity;

        if (glowParticles) {
          ctx.shadowColor = particleColor;
          ctx.shadowBlur = glowBlur;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleRgb},${alpha})`;
        ctx.fill();

        if (glowParticles) ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
