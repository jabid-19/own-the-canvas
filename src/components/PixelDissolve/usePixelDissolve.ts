import { useRef, useEffect, RefObject } from "react";

export type DissolveDirection = "in" | "out" | "both";
export type DissolvePattern = "random" | "center" | "edges" | "horizontal";

export interface UsePixelDissolveOptions {
  pixelSize: number;
  speed: number;
  direction: DissolveDirection;
  trigger: boolean;
  color: string;
  onComplete?: () => void;
  progressMultiplier: number;
  dissolvePattern: DissolvePattern;
}

export function usePixelDissolve(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  _sourceRef: RefObject<HTMLDivElement | null>,
  options: UsePixelDissolveOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const prevTriggerRef = useRef<boolean>(options.trigger);
  const progressRef = useRef<number>(0);
  const phaseRef = useRef<"idle" | "dissolving" | "appearing">("idle");
  const pixelsRef = useRef<{ x: number; y: number; delay: number }[]>([]);
  const completedRef = useRef<boolean>(false);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function buildPixelGrid(width: number, height: number) {
      const { pixelSize, dissolvePattern } = optionsRef.current;
      const cols = Math.ceil(width / pixelSize);
      const rows = Math.ceil(height / pixelSize);
      const cx = cols / 2;
      const cy = rows / 2;
      const grid: { x: number; y: number; delay: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let delay: number;
          if (dissolvePattern === "center") {
            const dist = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
            delay = dist / Math.sqrt(cx ** 2 + cy ** 2);
          } else if (dissolvePattern === "edges") {
            const dist = Math.sqrt((c - cx) ** 2 + (r - cy) ** 2);
            delay = 1 - dist / Math.sqrt(cx ** 2 + cy ** 2);
          } else if (dissolvePattern === "horizontal") {
            delay = c / cols;
          } else {
            delay = Math.random();
          }
          grid.push({ x: c * pixelSize, y: r * pixelSize, delay });
        }
      }
      grid.sort((a, b) => a.delay - b.delay);
      pixelsRef.current = grid;
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
      buildPixelGrid(width, height);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function draw() {
      const { trigger, speed, color, direction, pixelSize, onComplete, progressMultiplier } = optionsRef.current;

      // Detect trigger rising edge
      if (trigger !== prevTriggerRef.current) {
        prevTriggerRef.current = trigger;
        if (trigger) {
          phaseRef.current = direction === "in" ? "appearing" : "dissolving";
          progressRef.current = 0;
          completedRef.current = false;
        }
      }

      ctx.clearRect(0, 0, w, h);

      const pixels = pixelsRef.current;
      const phase = phaseRef.current;

      if (phase === "idle") {
        // "out" direction shows fully solid when idle+not triggered — screen is covered
        // "in" direction is transparent when idle — content shows through
        if (direction === "out" && !trigger) {
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, w, h);
        }
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      progressRef.current = Math.min(progressRef.current + speed * progressMultiplier, 1);
      const prog = progressRef.current;
      const threshold = prog;

      ctx.fillStyle = color;

      if (phase === "dissolving") {
        // Start fully covered, clear pixels progressively
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < pixels.length; i++) {
          const p = pixels[i];
          if (i / pixels.length < threshold) {
            ctx.clearRect(p.x, p.y, pixelSize, pixelSize);
          }
        }
      } else if (phase === "appearing") {
        // Start transparent, add pixels progressively
        for (let i = 0; i < pixels.length; i++) {
          const p = pixels[i];
          if (i / pixels.length < threshold) {
            ctx.fillRect(p.x, p.y, pixelSize, pixelSize);
          }
        }
      }

      if (prog >= 1) {
        if (direction === "both" && phase === "dissolving") {
          phaseRef.current = "appearing";
          progressRef.current = 0;
        } else {
          phaseRef.current = "idle";
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete?.();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
