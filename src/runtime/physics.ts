/**
 * Pure runtime helpers: frame governor, DOM-solid collision, anchored rest.
 * No DOM access here, so everything is unit-testable.
 */

/** A DOM solid in canvas-local CSS pixels. `id` is stable per element. */
export interface Solid {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

// ─── Frame governor ──────────────────────────────────────────────────────────
//
//   dt ─> EMA(avg, ~60 frames) ─┬─ avg > SLOW_MS for 2s ─> quality -= 0.25 (floor 0.25)
//                               └─ avg < FAST_MS for 5s ─> quality += 0.25 (cap 1)
//
// Asymmetric windows so quality drops fast under load and recovers slowly
// (no oscillation).

export interface Governor {
  quality: number;
  avg: number;
  slowMs: number;
  fastMs: number;
}

const SLOW_MS = 22;
const FAST_MS = 17;
const STEP_DOWN_AFTER = 2000;
const STEP_UP_AFTER = 5000;
const QUALITY_STEP = 0.25;
const QUALITY_FLOOR = 0.25;

export function createGovernor(): Governor {
  return { quality: 1, avg: 16.67, slowMs: 0, fastMs: 0 };
}

export function stepGovernor(g: Governor, dt: number): void {
  g.avg += (dt - g.avg) / 60;

  if (g.avg > SLOW_MS) {
    g.slowMs += dt;
    g.fastMs = 0;
    if (g.slowMs >= STEP_DOWN_AFTER) {
      g.quality = Math.max(QUALITY_FLOOR, g.quality - QUALITY_STEP);
      g.slowMs = 0;
    }
  } else if (g.avg < FAST_MS) {
    g.fastMs += dt;
    g.slowMs = 0;
    if (g.fastMs >= STEP_UP_AFTER) {
      g.quality = Math.min(1, g.quality + QUALITY_STEP);
      g.fastMs = 0;
    }
  } else {
    g.slowMs = 0;
    g.fastMs = 0;
  }
}

// ─── Collision ───────────────────────────────────────────────────────────────

export interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Collide a point body against solids, given its position last step.
 * Segment test (prev -> now), so a fast body can't tunnel through a top edge.
 *
 * - Falling across a top edge: snaps to the edge. restitution 0 => vy = 0
 *   (caller decides to rest); > 0 => bounces.
 * - Moving sideways into a solid's side (below its top edge): reflects vx.
 * - Moving up: passes through (no ceilings in v1).
 *
 * Returns the solid hit on top, or null.
 */
export function collide(
  p: Body,
  prevX: number,
  prevY: number,
  solids: readonly Solid[],
  restitution: number,
): Solid | null {
  let top: Solid | null = null;

  for (const s of solids) {
    // Top edge: crossed downward this step, within horizontal span.
    if (p.vy > 0 && prevY <= s.y && p.y >= s.y && p.x >= s.x && p.x <= s.x + s.w) {
      if (!top || s.y < top.y) top = s;
      continue;
    }
    // Sides: entered horizontally while vertically inside the solid.
    if (p.y > s.y && p.y < s.y + s.h) {
      const enteredLeft = prevX < s.x && p.x >= s.x;
      const enteredRight = prevX > s.x + s.w && p.x <= s.x + s.w;
      if (enteredLeft || enteredRight) {
        p.x = enteredLeft ? s.x : s.x + s.w;
        p.vx = -p.vx;
      }
    }
  }

  if (top) {
    p.y = top.y;
    p.vy = restitution > 0 ? -p.vy * restitution : 0;
  }
  return top;
}

// ─── Anchored rest ───────────────────────────────────────────────────────────
//
//   resting { solidId, offsetX, dy } ──each frame──> solid exists && 0 <= offsetX <= w
//        ├─ yes: x = solid.x + offsetX, y = solid.y + dy   (rides scroll/sticky/animation)
//        └─ no:  released -> caller makes it fall again
//
// Storing position relative to the solid (not absolute) is what keeps resting
// particles glued to an element while the page scrolls under a fixed overlay.

export interface Anchor {
  solidId: number;
  offsetX: number;
  /** Vertical offset from the solid's top edge (negative = above it). */
  dy: number;
}

export function anchorTo(p: { x: number }, s: Solid, dy: number): Anchor {
  return { solidId: s.id, offsetX: p.x - s.x, dy };
}

/** Moves `p` onto its solid. Returns false when the anchor should be released. */
export function followAnchor(
  p: { x: number; y: number },
  a: Anchor,
  solidsById: ReadonlyMap<number, Solid>,
): boolean {
  const s = solidsById.get(a.solidId);
  if (!s || a.offsetX < 0 || a.offsetX > s.w) return false;
  p.x = s.x + a.offsetX;
  p.y = s.y + a.dy;
  return true;
}
