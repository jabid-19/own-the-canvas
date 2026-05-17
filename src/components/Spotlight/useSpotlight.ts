import { useRef, useEffect, RefObject } from "react";

function toRgba(color: string, alpha: number): string {
  const h = color.replace("#", "");
  if (h.length === 3) {
    return `rgba(${parseInt(h[0]+h[0],16)},${parseInt(h[1]+h[1],16)},${parseInt(h[2]+h[2],16)},${alpha})`;
  }
  if (h.length === 6) {
    return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${alpha})`;
  }
  return color;
}

export interface UseSpotlightOptions {
  radius: number;
  color: string;
  overlayColor: string;
  overlayOpacity: number;
  edgeSoftness: number;
  followSpeed: number;
  glowColor: string;
  glowSize: number;
  showGlow: boolean;
  shape: "circle" | "ellipse";
  ellipseRatio: number;
  interactive: boolean;
  defaultX: number;
  defaultY: number;
}

export function useSpotlight(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseSpotlightOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const currentRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });

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

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const bounding = canvasRef.current!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - bounding.left, y: e.clientY - bounding.top };
    }
    function onMouseLeave() {
      mouseRef.current = null;
    }

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    function draw() {
      const { radius, color, overlayColor, overlayOpacity, edgeSoftness, followSpeed,
              glowColor, glowSize, showGlow, shape, ellipseRatio, defaultX, defaultY } = optionsRef.current;

      // Smooth follow
      const targetX = mouseRef.current ? mouseRef.current.x : w * defaultX;
      const targetY = mouseRef.current ? mouseRef.current.y : h * defaultY;

      if (currentRef.current.x < 0) {
        currentRef.current = { x: targetX, y: targetY };
      } else {
        currentRef.current.x += (targetX - currentRef.current.x) * followSpeed;
        currentRef.current.y += (targetY - currentRef.current.y) * followSpeed;
      }

      const cx = currentRef.current.x;
      const cy = currentRef.current.y;
      const rx = radius;
      const ry = shape === "ellipse" ? radius * ellipseRatio : radius;

      ctx.clearRect(0, 0, w, h);

      // Draw dark overlay
      ctx.fillStyle = overlayColor;
      ctx.globalAlpha = overlayOpacity;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      // Glow ring
      if (showGlow) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, ry / rx);
        const glow = ctx.createRadialGradient(0, 0, rx * 0.8, 0, 0, rx + glowSize);
        glow.addColorStop(0, toRgba(glowColor, 0.25));
        glow.addColorStop(1, toRgba(glowColor, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, rx + glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Cut the spotlight hole using destination-out with proper elliptical gradient
      ctx.globalCompositeOperation = "destination-out";
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, ry / rx);
      const innerR = rx * (1 - edgeSoftness * 0.5);
      const outerR = rx + rx * edgeSoftness;
      const grad = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";

      // Spotlight color tint drawn into the transparent hole area
      if (color && color !== "#ffffff") {
        ctx.save();
        ctx.globalAlpha = 0.15;
        const tint = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        tint.addColorStop(0, color);
        tint.addColorStop(1, toRgba(color, 0));
        ctx.fillStyle = tint;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

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
