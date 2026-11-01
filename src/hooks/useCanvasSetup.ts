import { useRef, useEffect, useState } from "react";
import { createGovernor, stepGovernor, type Solid } from "../runtime/physics";
import { subscribe, solidsFor } from "../runtime/world";

export interface FrameInfo {
  /** 0.25..1 — lowered by the governor when frames run slow. Scale particle budgets by it. */
  quality: number;
  /** Overlay canvases are already cleared; effects must not paint a background. */
  overlay: boolean;
  /** DOM solids in canvas-local px. Empty unless `collide` is on. */
  solids: readonly Solid[];
}

export interface CanvasSetupOptions {
  onFrame?: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) => void;
  /** Called after the canvas buffer is (re)sized, before the next frame. Re-seed particles here. */
  onResize?: (w: number, h: number) => void;
  /** Skip the built-in rAF loop entirely. */
  noLoop?: boolean;
  /** Fixed full-viewport canvas: sized from the window, cleared each frame. */
  overlay?: boolean;
  /** Track [data-otc-solid] elements and pass them to onFrame. */
  collide?: boolean;
  /** "static" (default): one frame, no loop, when the OS asks for reduced motion. */
  reducedMotion?: "static" | "ignore";
  /** Cap on devicePixelRatio (default 2). */
  maxDpr?: number;
}

export interface CanvasSetupResult {
  /** Callback ref for the <canvas>. */
  canvasRef: (el: HTMLCanvasElement | null) => void;
  canvas: HTMLCanvasElement | null;
}

const NO_SOLIDS: readonly Solid[] = [];
const MAX_DT = 64;

/**
 * Shared canvas runtime: sizing, DPR, rAF loop, and production defaults.
 *
 *   size: overlay ? window resize : ResizeObserver(parent) ─> DPR (capped) ─> onResize
 *   loop runs only when: !noLoop && visible on screen && tab visible && !reduced motion
 *   each frame: dt = min(elapsed, 64) ─> governor ─> overlay ? clearRect : -
 *               ─> onFrame(ctx, w, h, dt, { quality, overlay, solids })
 *   resume after pause resets the clock, so dt never spikes.
 */
export function useCanvasSetup(options: CanvasSetupOptions = {}): CanvasSetupResult {
  const {
    noLoop = false,
    overlay = false,
    collide = false,
    reducedMotion = "static",
    maxDpr = 2,
  } = options;

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const onFrameRef = useRef(options.onFrame);
  const onResizeRef = useRef(options.onResize);
  onFrameRef.current = options.onFrame;
  onResizeRef.current = options.onResize;

  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let running = false;
    let offscreen = false;
    let hidden = document.hidden;
    const governor = createGovernor();

    const mq =
      reducedMotion === "static" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let reduced = mq?.matches ?? false;

    const unsubscribe = collide ? subscribe() : null;

    const render = (dt: number) => {
      if (w === 0 || h === 0) return;
      if (overlay) ctx.clearRect(0, 0, w, h);
      onFrameRef.current?.(ctx, w, h, dt, {
        quality: governor.quality,
        overlay,
        solids: collide ? solidsFor(canvas, overlay) : NO_SOLIDS,
      });
    };

    const loop = (t: number) => {
      const dt = last ? Math.min(t - last, MAX_DT) : 16;
      last = t;
      stepGovernor(governor, dt);
      render(dt);
      raf = requestAnimationFrame(loop);
    };

    const sync = () => {
      const should = !noLoop && !offscreen && !hidden && !reduced && w > 0;
      if (should && !running) {
        running = true;
        last = 0; // fresh clock on (re)start: no dt spike
        raf = requestAnimationFrame(loop);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const resize = (cw: number, ch: number) => {
      if (cw <= 0 || ch <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = cw;
      h = ch;
      onResizeRef.current?.(w, h);
      if (reduced) render(16); // static frame for reduced motion
      sync();
    };

    // Size source
    let ro: ResizeObserver | null = null;
    const onWindowResize = () => resize(window.innerWidth, window.innerHeight);
    if (overlay) {
      window.addEventListener("resize", onWindowResize);
      onWindowResize();
    } else {
      const parent = canvas.parentElement;
      if (parent) {
        ro = new ResizeObserver((entries) => {
          const r = entries[0]?.contentRect;
          if (r) resize(r.width, r.height);
        });
        ro.observe(parent);
        const r = parent.getBoundingClientRect();
        resize(r.width, r.height);
      }
    }

    // Pause when scrolled offscreen
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        if (!e) return;
        offscreen = !e.isIntersecting;
        sync();
      });
      io.observe(canvas);
    }

    // Pause when tab hidden
    const onVisibility = () => {
      hidden = document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Reduced motion, live
    const onMotionPref = () => {
      reduced = mq?.matches ?? false;
      if (reduced) render(16);
      sync();
    };
    mq?.addEventListener?.("change", onMotionPref);

    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("visibilitychange", onVisibility);
      mq?.removeEventListener?.("change", onMotionPref);
      unsubscribe?.();
    };
  }, [canvas, noLoop, overlay, collide, reducedMotion, maxDpr]);

  return { canvasRef: setCanvas, canvas };
}
