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

    function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
      const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
    }

    function drawMetaballs(colors: string[], threshold: number, glowEffect: boolean, glowBlur: number) {
      const blobs = blobsRef.current;
      if (!blobs.length) return;

      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        const color = colors[i % colors.length];
        const r = blob.radius * threshold;
        const rgb = hexToRgb(color);

        if (glowEffect) { ctx.shadowColor = color; ctx.shadowBlur = glowBlur; }
        ctx.globalCompositeOperation = "screen";

        // Outer soft halo
        const outerGrad = ctx.createRadialGradient(blob.x, blob.y, r * 0.5, blob.x, blob.y, r * 1.4);
        outerGrad.addColorStop(0, rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.18)` : color + "30");
        outerGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, r * 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Main blob body — rich radial gradient with 4 stops
        const bodyGrad = ctx.createRadialGradient(
          blob.x - r * 0.25, blob.y - r * 0.25, 0,  // offset center for 3D feel
          blob.x, blob.y, r
        );
        bodyGrad.addColorStop(0,   rgb ? `rgba(${Math.min(255, rgb.r + 80)},${Math.min(255, rgb.g + 80)},${Math.min(255, rgb.b + 80)},0.95)` : color);
        bodyGrad.addColorStop(0.35, rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)` : color + "d9");
        bodyGrad.addColorStop(0.7,  rgb ? `rgba(${Math.max(0,rgb.r-40)},${Math.max(0,rgb.g-40)},${Math.max(0,rgb.b-40)},0.6)` : color + "99");
        bodyGrad.addColorStop(1,    "rgba(0,0,0,0)");
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Specular highlight — small bright spot
        const specX = blob.x - r * 0.28;
        const specY = blob.y - r * 0.28;
        const specR = r * 0.35;
        const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specR);
        specGrad.addColorStop(0, "rgba(255,255,255,0.45)");
        specGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.arc(specX, specY, specR, 0, Math.PI * 2);
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
