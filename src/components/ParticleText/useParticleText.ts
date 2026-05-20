import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

export interface UseParticleTextOptions {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  particleSize: number;
  particleGap: number;
  repelRadius: number;
  repelForce: number;
  snapSpeed: number;
  friction: number;
  glowEffect: boolean;
  glowBlur: number;
  animated: boolean;
  interactive: boolean;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
}

export function useParticleText(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseParticleTextOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let cssW = 0;
    let cssH = 0;
    let rafId = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let particles: Particle[] = [];

    const prevTextRef = { text: "", fontSize: -1, cssW: -1, cssH: -1 };

    function sampleText(text: string, fontSize: number, w: number, h: number) {
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const offCtx = off.getContext("2d")!;
      offCtx.clearRect(0, 0, w, h);
      offCtx.fillStyle = "#ffffff";
      const effectiveFontSize = Math.min(fontSize, h * 0.85, w * 0.9);
      offCtx.font = `bold ${effectiveFontSize}px ${optionsRef.current.fontFamily}`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(text, w / 2, h / 2);

      const { particleGap } = optionsRef.current;
      const data = offCtx.getImageData(0, 0, w, h).data;
      const pts: Particle[] = [];
      for (let y = 0; y < h; y += particleGap) {
        for (let x = 0; x < w; x += particleGap) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            pts.push({ x, y, targetX: x, targetY: y, vx: 0, vy: 0 });
          }
        }
      }
      return pts;
    }

    function resize(w: number, h: number) {
      const dpr = window.devicePixelRatio || 1;
      cssW = w;
      cssH = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      prevTextRef.cssW = -1; // force resample
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    }
    function onMouseLeave() { mouseX = -9999; mouseY = -9999; }
    function onTouchMove(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      mouseX = e.touches[0].clientX - r.left;
      mouseY = e.touches[0].clientY - r.top;
    }
    function onTouchEnd() { mouseX = -9999; mouseY = -9999; }

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);
    parent.addEventListener("touchmove", onTouchMove, { passive: false });
    parent.addEventListener("touchend", onTouchEnd);

    function loop() {
      const { text, fontSize, color, backgroundColor, particleSize, repelRadius, repelForce, snapSpeed, friction, glowEffect, glowBlur, animated } = optionsRef.current;

      // Resample when text/fontSize/size changes
      if (
        cssW > 0 && cssH > 0 &&
        (text !== prevTextRef.text || fontSize !== prevTextRef.fontSize || cssW !== prevTextRef.cssW || cssH !== prevTextRef.cssH)
      ) {
        prevTextRef.text = text;
        prevTextRef.fontSize = fontSize;
        prevTextRef.cssW = cssW;
        prevTextRef.cssH = cssH;
        particles = sampleText(text, fontSize, cssW, cssH);
      }

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, cssW, cssH);

      if (!animated || particles.length === 0) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const repelSq = repelRadius * repelRadius;

      ctx.save();
      if (glowEffect) {
        ctx.shadowBlur = glowBlur;
        ctx.shadowColor = color;
      }
      ctx.fillStyle = hexToRgba(color, 1);

      for (const p of particles) {
        // Spring toward target
        p.vx += (p.targetX - p.x) * snapSpeed;
        p.vy += (p.targetY - p.y) * snapSpeed;

        // Mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < repelSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (repelRadius - dist) / repelRadius * repelForce;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
      parent.removeEventListener("touchmove", onTouchMove);
      parent.removeEventListener("touchend", onTouchEnd);
    };
  }, [canvasRef]);
}
