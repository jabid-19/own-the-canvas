import { useRef, useEffect, useCallback, RefObject } from "react";

export interface CanvasSetupOptions {
  onFrame?: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void;
  noLoop?: boolean;
}

export interface CanvasSetupResult {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
}

export function useCanvasSetup(options: CanvasSetupOptions = {}): CanvasSetupResult {
  const { onFrame, noLoop = false } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const widthRef = useRef<number>(0);
  const heightRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  const applyDpr = useCallback((canvas: HTMLCanvasElement, w: number, h: number) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    widthRef.current = w;
    heightRef.current = h;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      applyDpr(canvas, width, height);
    });
    ro.observe(parent);

    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      applyDpr(canvas, rect.width, rect.height);
    }

    if (!noLoop) {
      const loop = (timestamp: number) => {
        const dt = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
        lastTimeRef.current = timestamp;
        const cb = onFrameRef.current;
        if (cb) {
          const ctx = canvas.getContext("2d");
          if (ctx) cb(ctx, widthRef.current, heightRef.current, dt);
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyDpr, noLoop]);

  return {
    canvasRef,
    get width() { return widthRef.current; },
    get height() { return heightRef.current; },
  };
}
