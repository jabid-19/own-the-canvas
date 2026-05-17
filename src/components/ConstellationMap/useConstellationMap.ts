import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

export type ConstellationLineStyle = "solid" | "dashed";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  twinkle: number;
  twinklePhase: number;
}

export interface UseConstellationMapOptions {
  starCount: number;
  starColor: string;
  lineColor: string;
  backgroundColor: string;
  speed: number;
  interactive: boolean;
  lineStyle: ConstellationLineStyle;
  glowStars: boolean;
  connectionDistance: number;
  velocityMultiplier: number;
  dragRadius: number;
  twinkleSpeed: number;
  lineAlpha: number;
  lineWidth: number;
  glowMultiplier: number;
  twinkleAmplitude: number;
}

export function useConstellationMap(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseConstellationMapOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const dragRef = useRef<{ starIndex: number; offsetX: number; offsetY: number } | null>(null);

  // Cache color RGB strings
  const lineRgbRef = useRef<string>("");
  const starRgbRef = useRef<string>("");
  const lastLineColorRef = useRef<string>("");
  const lastStarColorRef = useRef<string>("");

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function initStars(width: number, height: number) {
      const { starCount, speed, velocityMultiplier } = optionsRef.current;
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * velocityMultiplier,
        vy: (Math.random() - 0.5) * speed * velocityMultiplier,
        size: Math.random() * 2.5 + 1,
        twinkle: Math.random() * 0.4 + 0.6,
        twinklePhase: Math.random() * Math.PI * 2,
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
      initStars(width, height);
    }

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
      if (!optionsRef.current.interactive) return;
      const { x, y } = getPos(e);
      const stars = starsRef.current;
      const { dragRadius } = optionsRef.current;
      let closest = -1;
      let minDist = dragRadius;
      for (let i = 0; i < stars.length; i++) {
        const dx = stars[i].x - x;
        const dy = stars[i].y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) { minDist = dist; closest = i; }
      }
      if (closest !== -1) {
        dragRef.current = { starIndex: closest, offsetX: stars[closest].x - x, offsetY: stars[closest].y - y };
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current) return;
      const { x, y } = getPos(e);
      const star = starsRef.current[dragRef.current.starIndex];
      star.x = x + dragRef.current.offsetX;
      star.y = y + dragRef.current.offsetY;
      star.vx = 0;
      star.vy = 0;
    }

    function onMouseUp() { dragRef.current = null; }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);

    function draw() {
      const {
        starColor, lineColor, backgroundColor, lineStyle, glowStars, connectionDistance,
        twinkleSpeed, lineAlpha, lineWidth, glowMultiplier, twinkleAmplitude,
      } = optionsRef.current;

      // Update color caches only when colors change
      if (lineColor !== lastLineColorRef.current) {
        lineRgbRef.current = hexToRgbString(lineColor);
        lastLineColorRef.current = lineColor;
      }
      if (starColor !== lastStarColorRef.current) {
        starRgbRef.current = hexToRgbString(starColor);
        lastStarColorRef.current = starColor;
      }

      const lineRgb = lineRgbRef.current;
      const starRgb = starRgbRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const stars = starsRef.current;

      // Update positions
      for (const star of stars) {
        if (dragRef.current && starsRef.current[dragRef.current.starIndex] === star) continue;
        star.x += star.vx;
        star.y += star.vy;
        star.twinklePhase += twinkleSpeed;

        // Wrap — preserve velocity direction at boundary
        if (star.x < 0) star.x += w;
        else if (star.x > w) star.x -= w;
        if (star.y < 0) star.y += h;
        else if (star.y > h) star.y -= h;
      }

      // Draw connections
      if (lineStyle === "dashed") ctx.setLineDash([4, 6]);
      else ctx.setLineDash([]);

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * lineAlpha;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(${lineRgb},${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
        }
      }

      ctx.setLineDash([]);

      // Draw stars
      for (const star of stars) {
        const twinkleAlpha = (1 - twinkleAmplitude) + twinkleAmplitude * Math.sin(star.twinklePhase);

        if (glowStars) {
          ctx.shadowColor = starColor;
          ctx.shadowBlur = star.size * glowMultiplier;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starRgb},${twinkleAlpha})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
  }, [canvasRef]);
}
