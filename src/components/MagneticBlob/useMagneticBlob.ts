import { useRef, useEffect, RefObject } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseX: number;
  baseY: number;
}

export interface UseMagneticBlobOptions {
  count: number;
  colors: string[];
  radius: number;
  speed: number;
  magnetStrength: number;
  magnetRadius: number;
  threshold: number;
  glowEffect: boolean;
  glowBlur: number;
  backgroundColor: string;
  animated: boolean;
  followMouse: boolean;
  wanderStrength: number;
}

export function useMagneticBlob(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseMagneticBlobOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const blobsRef = useRef<Blob[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function initBlobs() {
      const { count, radius } = optionsRef.current;
      blobsRef.current = Array.from({ length: count }, () => {
        const x = w * 0.2 + Math.random() * w * 0.6;
        const y = h * 0.2 + Math.random() * h * 0.6;
        return {
          x, y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: radius * (0.7 + Math.random() * 0.6),
          baseX: x, baseY: y,
        };
      });
    }

    function applyDpr(width: number, height: number) {
      const cvs = canvasRef.current!;
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.round(width * dpr);
      cvs.height = Math.round(height * dpr);
      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      initBlobs();
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      const bounding = canvasRef.current!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - bounding.left, y: e.clientY - bounding.top };
    }
    function onMouseLeave() { mouseRef.current = null; }
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    // Marching squares lookup — draw metaballs using canvas radial gradients composited
    function drawMetaballs(colors: string[], threshold: number, glowEffect: boolean, glowBlur: number) {
      const blobs = blobsRef.current;
      if (!blobs.length) return;

      // Use an offscreen approach: draw each blob as a radial gradient, then composite
      // For performance, draw additive glow circles using screen blend
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        const color = colors[i % colors.length];
        const r = blob.radius;

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r * threshold);
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, color + "88");
        grad.addColorStop(1, color + "00");

        if (glowEffect) { ctx.shadowColor = color; ctx.shadowBlur = glowBlur; }
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, r * threshold, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function draw() {
      const {
        speed, magnetStrength, magnetRadius, threshold, colors,
        glowEffect, glowBlur, backgroundColor, animated, followMouse, wanderStrength,
      } = optionsRef.current;

      if (animated) timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const blobs = blobsRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];

        // Organic wander
        const angle = Math.sin(t * speed * 0.5 + i * 1.3) * Math.PI * 2;
        b.vx += Math.cos(angle) * wanderStrength * 0.05;
        b.vy += Math.sin(angle) * wanderStrength * 0.05;

        // Mouse attraction/repulsion
        if (mouse && followMouse) {
          const dx = mouse.x - b.x;
          const dy = mouse.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < magnetRadius) {
            const force = (1 - dist / magnetRadius) * magnetStrength;
            b.vx += (dx / dist) * force;
            b.vy += (dy / dist) * force;
          }
        }

        // Inter-blob attraction
        for (let j = i + 1; j < blobs.length; j++) {
          const o = blobs[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = (b.radius + o.radius) * 0.8;
          if (dist < minDist * 2) {
            const force = 0.002 * (1 - dist / (minDist * 2));
            b.vx += (dx / dist) * force;
            b.vy += (dy / dist) * force;
            o.vx -= (dx / dist) * force;
            o.vy -= (dy / dist) * force;
          }
        }

        // Damping
        b.vx *= 0.92;
        b.vy *= 0.92;
        b.vx = Math.max(-4, Math.min(4, b.vx));
        b.vy = Math.max(-4, Math.min(4, b.vy));

        b.x += b.vx;
        b.y += b.vy;

        // Bounce off walls
        if (b.x < b.radius) { b.x = b.radius; b.vx *= -0.5; }
        if (b.x > w - b.radius) { b.x = w - b.radius; b.vx *= -0.5; }
        if (b.y < b.radius) { b.y = b.radius; b.vy *= -0.5; }
        if (b.y > h - b.radius) { b.y = h - b.radius; b.vy *= -0.5; }
      }

      drawMetaballs(colors, threshold, glowEffect, glowBlur);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
