/** Shared helpers for runtime-based effects: window-level pointer, pointer velocity, glow sprites, reduced-motion check. */
import { useEffect, useRef } from "react";
import { hexToRgba } from "../utils/color";

/** Window-level pointer state in client (viewport) px. */
export interface RawPointer {
  cx: number;
  cy: number;
  /** Pointer is inside the browser window. */
  over: boolean;
  down: boolean;
  taps: { cx: number; cy: number }[];
}

export interface PointerSample {
  /** Canvas-local CSS px. */
  x: number;
  y: number;
  /** Pointer is over the canvas rect (even with other content stacked on top). */
  inside: boolean;
  down: boolean;
  /** Taps since the last read that landed on the canvas rect, canvas-local. */
  taps: { x: number; y: number }[];
}

const MAX_TAPS = 16;

/**
 * Pointer tracking bound to window, not the canvas, so effects used as a
 * background or as a click-through overlay still see the cursor through
 * foreground content. Read it once per frame with readPointer().
 */
export function usePointer() {
  const ref = useRef<RawPointer>({ cx: 0, cy: 0, over: false, down: false, taps: [] });

  useEffect(() => {
    const s = ref.current;
    const move = (e: PointerEvent) => {
      s.cx = e.clientX;
      s.cy = e.clientY;
      s.over = true;
    };
    const down = (e: PointerEvent) => {
      move(e);
      s.down = true;
      if (s.taps.length < MAX_TAPS) s.taps.push({ cx: e.clientX, cy: e.clientY });
    };
    const up = () => { s.down = false; };
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) { s.over = false; s.down = false; }
    };
    const blur = () => { s.over = false; s.down = false; };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointerout", out, { passive: true });
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("blur", blur);
    };
  }, []);

  return ref;
}

/**
 * Canvas-local position of a window-level mouse event, or null when the
 * pointer is outside the canvas rect. Window listeners let effects see the
 * cursor through foreground content; this keeps them from chasing it
 * anywhere else on the page.
 */
export function pointerInCanvas(
  e: { clientX: number; clientY: number },
  canvas: HTMLElement,
): { x: number; y: number } | null {
  const r = canvas.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  return x >= 0 && y >= 0 && x <= r.width && y <= r.height ? { x, y } : null;
}

/** Converts to canvas-local coords and drains pending taps. One rect read per call. */
export function readPointer(s: RawPointer, canvas: HTMLCanvasElement | null | undefined): PointerSample {
  if (!canvas) {
    s.taps.length = 0;
    return { x: -9999, y: -9999, inside: false, down: false, taps: [] };
  }
  const r = canvas.getBoundingClientRect();
  const inRect = (x: number, y: number) => x >= 0 && y >= 0 && x <= r.width && y <= r.height;
  const x = s.cx - r.left;
  const y = s.cy - r.top;
  const taps: { x: number; y: number }[] = [];
  for (const t of s.taps) {
    const tx = t.cx - r.left;
    const ty = t.cy - r.top;
    if (inRect(tx, ty)) taps.push({ x: tx, y: ty });
  }
  s.taps.length = 0;
  return { x, y, inside: s.over && inRect(x, y), down: s.down, taps };
}

/**
 * Tracks pointer velocity between frames, in px per 60Hz frame.
 * Zero while the pointer is outside, so effects don't get a jump on re-entry.
 */
export function createVelocity() {
  let px = 0, py = 0, had = false;
  return (p: PointerSample, k: number) => {
    if (!p.inside) { had = false; return { vx: 0, vy: 0 }; }
    const vx = had ? (p.x - px) / Math.max(k, 0.01) : 0;
    const vy = had ? (p.y - py) / Math.max(k, 0.01) : 0;
    px = p.x; py = p.y; had = true;
    return { vx, vy };
  };
}

/**
 * Soft radial glow sprite tinted with a hex color. Build once per color and
 * draw with drawImage + globalAlpha: far cheaper than a gradient per particle.
 */
export function glowSprite(hex: string, size = 64): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (!g || typeof g.createRadialGradient !== "function") return null;
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, hexToRgba(hex, 1));
  grad.addColorStop(0.18, hexToRgba(hex, 0.75));
  grad.addColorStop(0.45, hexToRgba(hex, 0.18));
  grad.addColorStop(1, hexToRgba(hex, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && !!window.matchMedia("(prefers-reduced-motion: reduce)")?.matches;
}
