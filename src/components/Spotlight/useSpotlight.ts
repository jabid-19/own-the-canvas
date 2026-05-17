import { useRef, useEffect, RefObject } from "react";

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
      const { radius, overlayColor, overlayOpacity, edgeSoftness, followSpeed,
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
        const glow = ctx.createRadialGradient(cx, cy, rx * 0.8, cx, cy, rx + glowSize);
        glow.addColorStop(0, `${glowColor}40`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx + glowSize, ry + glowSize, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cut the spotlight hole using destination-out
      ctx.globalCompositeOperation = "destination-out";

      const outerR = rx + rx * edgeSoftness;
      const outerRy = ry + ry * edgeSoftness;
      const radialX = shape === "ellipse"
        ? ctx.createRadialGradient(cx, cy, rx * (1 - edgeSoftness * 0.5), cx, cy, outerR)
        : ctx.createRadialGradient(cx, cy, rx * (1 - edgeSoftness * 0.5), cx, cy, outerR);

      radialX.addColorStop(0, "rgba(0,0,0,1)");
      radialX.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = radialX;
      ctx.beginPath();
      ctx.ellipse(cx, cy, outerR, outerRy, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";

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
