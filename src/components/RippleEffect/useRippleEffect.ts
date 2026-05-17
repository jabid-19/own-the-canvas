import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

export interface UseRippleEffectOptions {
  color: string;
  maxRadius: number;
  speed: number;
  lineWidth: number;
  decay: number;
  multiRipple: boolean;
  backgroundColor: string;
  interactive: boolean;
  autoInterval: number;
  radiusGrowthRate: number;
  opacityDecayRate: number;
  autoCenter: boolean;
}

export function useRippleEffect(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseRippleEffectOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width;
      h = height;
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function addRipple(x: number, y: number) {
      const { multiRipple } = optionsRef.current;
      if (!multiRipple) ripplesRef.current = [];
      ripplesRef.current.push({ x, y, radius: 0, opacity: 1 });
    }

    let autoTimer = 0;
    function triggerAutoRipple(timestamp: number) {
      const { interactive, autoInterval, autoCenter } = optionsRef.current;
      if (!interactive && timestamp - autoTimer > autoInterval) {
        autoTimer = timestamp;
        if (autoCenter) {
          addRipple(w / 2, h / 2);
        } else {
          addRipple(
            w * 0.2 + Math.random() * w * 0.6,
            h * 0.2 + Math.random() * h * 0.6
          );
        }
      }
    }

    function onClick(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const bounding = canvas.getBoundingClientRect();
      addRipple(e.clientX - bounding.left, e.clientY - bounding.top);
    }
    canvas.addEventListener("click", onClick);

    function draw(timestamp: number) {
      const { color, maxRadius, speed, lineWidth, decay, backgroundColor, radiusGrowthRate, opacityDecayRate } =
        optionsRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      triggerAutoRipple(timestamp);

      ripplesRef.current = ripplesRef.current.filter((r) => {
        r.radius += speed * radiusGrowthRate;
        r.opacity -= decay * opacityDecayRate;

        if (r.opacity <= 0 || r.radius > maxRadius) return false;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(color, r.opacity);
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef]);
}
