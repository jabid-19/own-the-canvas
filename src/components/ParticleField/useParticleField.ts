import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";
import { pointerInCanvas, glowSprite } from "../../runtime/fx";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  twinklePhase?: number;
  tint?: number; // 0 = particle colour, 1 = line colour, so the field isn't one flat hue
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

function mixRgb(a: string, b: string, k: number): string {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  if (A.length < 3 || B.length < 3) return a;
  return A.slice(0, 3).map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
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
  const glowRef = useRef<{ sprite: HTMLCanvasElement | null; color: string }>({ sprite: null, color: "" }).current;

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

    let appliedVm = optionsRef.current.velocityMultiplier;
    function initParticles(width: number, height: number) {
      const { particleCount, particleSize, speed, velocityMultiplier, twinkle } = optionsRef.current;
      appliedVm = velocityMultiplier;
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * velocityMultiplier,
        vy: (Math.random() - 0.5) * speed * velocityMultiplier,
        size: Math.random() * particleSize + particleSize * 0.4,
        opacity: Math.random() * 0.5 + 0.5,
        tint: Math.random() < 0.7 ? Math.random() * 0.25 : 0.5 + Math.random() * 0.5,
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
      const p = pointerInCanvas(e, canvas);
      if (!p) return onMouseLeave(); // also ends a drag that left the canvas
      const { x, y } = p;
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
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);

    function draw() {
      const {
        particleColor, lineColor, lineDistance, connectParticles, backgroundColor,
        speed, repelRadius, repelStrength, friction, maxVelocityMultiplier, lineWidth, lineOpacity,
        wrapEdges, twinkle, twinkleSpeed, twinkleAmplitude, glowParticles, glowBlur, lineStyle, interactive,
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
        const bgRgb = hexToRgbString(backgroundColor);
        const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
        bg.addColorStop(0, `rgb(${mixRgb(bgRgb, lineRgb, 0.1)})`);
        bg.addColorStop(1, `rgb(${bgRgb})`);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
      }

      // live velocityMultiplier: rescale current velocities by the change
      const vm = optionsRef.current.velocityMultiplier;
      if (vm !== appliedVm) {
        const r = appliedVm ? vm / appliedVm : 1;
        if (Number.isFinite(r)) for (const p of particles) { p.vx *= r; p.vy *= r; }
        appliedVm = vm;
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

      // Connection lines: close pairs are brighter, thicker and shift toward the particle colour
      if (connectParticles) {
        if (lineStyle === "dashed") ctx.setLineDash([4, 6]);
        else ctx.setLineDash([]);
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < lineDistance) {
              const k = 1 - dist / lineDistance;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(${mixRgb(lineRgb, particleRgb, k * 0.6)},${k * k * lineOpacity * 1.2})`;
              ctx.lineWidth = lineWidth * (0.6 + k * 0.9);
              ctx.stroke();
            }
          }
        }
        // the cursor joins the constellation
        if (mouse && interactive) {
          for (const p of particles) {
            const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (d < lineDistance * 1.3) {
              const k = 1 - d / (lineDistance * 1.3);
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(p.x, p.y);
              ctx.strokeStyle = `rgba(${particleRgb},${k * lineOpacity})`;
              ctx.lineWidth = lineWidth * (0.6 + k);
              ctx.stroke();
            }
          }
        }
        ctx.setLineDash([]);
      }

      // Particles: a soft halo (always on, stronger with glowParticles) and a bright core
      if (!glowRef.sprite || glowRef.color !== particleColor) {
        glowRef.sprite = glowSprite(particleColor.startsWith("#") ? particleColor : "#ffffff", 64);
        glowRef.color = particleColor;
      }
      const maxSize = Math.max(0.01, optionsRef.current.particleSize * 1.4);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const alpha = twinkle && p.twinklePhase !== undefined
          ? (1 - twinkleAmplitude) + twinkleAmplitude * Math.sin(p.twinklePhase)
          : p.opacity;
        const depth = Math.min(1, p.size / maxSize);
        const rgb = mixRgb(particleRgb, lineRgb, p.tint ?? 0);
        if (glowRef.sprite) {
          const hs = p.size * (glowParticles ? 5 + glowBlur / 6 : 5) * (0.6 + depth * 0.6);
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = alpha * (glowParticles ? 0.75 : 0.4) * (0.5 + depth * 0.5);
          ctx.drawImage(glowRef.sprite, p.x - hs, p.y - hs, hs * 2, hs * 2);
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.7 + depth * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${mixRgb(rgb, "255,255,255", 0.35 * depth)},${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
