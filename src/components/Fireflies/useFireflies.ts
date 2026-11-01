import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { anchorTo, followAnchor, type Anchor, type Solid } from "../../runtime/physics";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";

export interface Firefly {
  x: number;
  y: number;
  heading: number;
  speed: number;
  /** Oscillator phase 0..1; flashes on reaching 1. */
  phase: number;
  /** Natural flash-rate multiplier (~1). */
  rate: number;
  /** Flash brightness 0..1, decays after a flash. */
  flash: number;
  depth: number;
  seed: number;
  /** Perch target on a DOM solid (flying toward it). */
  target: { solidId: number; offsetX: number } | null;
  rest: Anchor | null;
  restLeft: number;
}

export interface UseFirefliesOptions {
  count: number;
  color: string;
  backgroundColor: string;
  size: number;
  glow: number;
  period: number;
  sync: number;
  syncRadius: number;
  speed: number;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

// ─── Pulse-coupled oscillators (Mirollo & Strogatz, 1990) ────────────────────
//
//   phase φ rises 0→1 at 1/period; at 1 the firefly flashes and resets.
//   A flash nudges neighbours' *state* x = f(φ) up by ε, where f is concave.
//   Concavity is what makes a population converge to flashing in unison,
//   the same way real Pteroptyx fireflies sync along a riverbank.

const B = 3;
const EB = Math.exp(B) - 1;
const stateOf = (phi: number) => Math.log(1 + EB * phi) / B;
const phaseOf = (x: number) => (Math.exp(B * x) - 1) / EB;

/** Advances phases by dtSec and propagates flashes. Returns how many fired. */
export function stepPhases(
  flies: { x: number; y: number; phase: number; flash: number; rate?: number }[],
  dtSec: number,
  period: number,
  coupling: number,
  radius: number,
): number {
  const queue: number[] = [];
  for (let i = 0; i < flies.length; i++) {
    flies[i].phase += (dtSec / period) * (flies[i].rate ?? 1);
    if (flies[i].phase >= 1) queue.push(i);
  }
  const fired = new Set<number>();
  const r2 = radius * radius;
  while (queue.length) {
    const i = queue.pop()!;
    if (fired.has(i)) continue;
    fired.add(i);
    const a = flies[i];
    a.phase = 0;
    a.flash = 1;
    if (coupling <= 0) continue;
    for (let j = 0; j < flies.length; j++) {
      if (j === i || fired.has(j)) continue;
      const b = flies[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      if (dx * dx + dy * dy > r2) continue;
      const x = stateOf(Math.min(b.phase, 1)) + coupling;
      if (x >= 1) {
        b.phase = 1;
        queue.push(j);
      } else {
        b.phase = phaseOf(x);
      }
    }
  }
  return fired.size;
}

/** Kuramoto order parameter: 1 = perfectly in sync, ~0 = scattered. */
export function syncOrder(flies: { phase: number }[]): number {
  let c = 0, s = 0;
  for (const f of flies) {
    c += Math.cos(f.phase * Math.PI * 2);
    s += Math.sin(f.phase * Math.PI * 2);
  }
  return flies.length ? Math.hypot(c, s) / flies.length : 0;
}

const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export function useFireflies(options: UseFirefliesOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fliesRef = useRef<Firefly[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function makeFly(): Firefly {
    const { w, h } = sizeRef.current;
    return {
      x: Math.random() * w,
      y: h * 0.15 + Math.random() * h * 0.85,
      heading: Math.random() * Math.PI * 2,
      speed: 0.25 + Math.random() * 0.45,
      phase: Math.random(),
      rate: 0.95 + Math.random() * 0.1, // natural-frequency spread: without coupling they drift apart
      flash: 0,
      depth: 0.55 + Math.random() * 0.45,
      seed: Math.random() * 1000,
      target: null,
      rest: null,
      restLeft: 0,
    };
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    if (spriteRef.current.color !== o.color) {
      spriteRef.current = { color: o.color, img: glowSprite(o.color, 64) };
    }
    const sprite = spriteRef.current.img;

    const target = o.count > 0 ? Math.max(1, Math.ceil(o.count * frame.quality)) : 0;
    const flies = fliesRef.current;
    while (flies.length < target) flies.push(makeFly());
    if (flies.length > target) flies.length = target;

    const p = readPointer(pointer.current, canvasEl.current);
    const ptrOn = o.interactive && p.inside;

    // Tap: everyone nearby flashes at once, seeding a sync wave
    if (o.interactive) {
      for (const tap of p.taps) {
        for (const f of flies) {
          if (Math.hypot(f.x - tap.x, f.y - tap.y) < 160) f.phase = 1;
        }
      }
    }

    const solids: readonly Solid[] = frame.solids;
    const byId = new Map(solids.map((s) => [s.id, s]));

    for (const f of flies) {
      // Perched: ride the solid, blink, then lift off
      if (f.rest) {
        f.restLeft -= dt;
        if (f.restLeft <= 0 || !followAnchor(f, f.rest, byId)) {
          f.rest = null;
          f.heading = -Math.PI / 2 + (Math.random() - 0.5);
        }
        continue;
      }

      // Wander: smooth meander from layered sines + a little noise
      let turn = Math.sin(t * 0.9 + f.seed) * 0.025 + Math.sin(t * 2.3 + f.seed * 1.7) * 0.015;
      turn += (Math.random() - 0.5) * 0.04;

      let steerX = 0, steerY = 0, steerW = 0;

      // Head for a perch
      if (f.target) {
        const s = byId.get(f.target.solidId);
        if (!s) f.target = null;
        else {
          const tx = s.x + f.target.offsetX;
          const ty = s.y - 2;
          const d = Math.hypot(tx - f.x, ty - f.y);
          if (d < 4) {
            f.x = tx;
            f.y = ty;
            f.rest = anchorTo(f, s, -2);
            f.restLeft = 3000 + Math.random() * 6000;
            f.target = null;
            continue;
          }
          steerX = tx - f.x; steerY = ty - f.y; steerW = 0.08;
        }
      } else if (solids.length && Math.random() < 0.0006 * k) {
        const s = solids[(Math.random() * solids.length) | 0];
        if (s.w > 8 && s.y > 0 && s.y < h) f.target = { solidId: s.id, offsetX: 4 + Math.random() * (s.w - 8) };
      }

      // Cursor: gather into a loose cloud around it (no collapse to a point)
      if (ptrOn && !f.target) {
        const dx = p.x - f.x;
        const dy = p.y - f.y;
        const d = Math.hypot(dx, dy);
        if (d < 240) {
          const ring = d < 45 ? -1 : 1;
          steerX = dx * ring; steerY = dy * ring; steerW = 0.05 * (1 - d / 240) + 0.01;
        }
      }

      // Stay in view: steer back from the margins
      const m = 30;
      if (f.x < m) { steerX += 1; steerW = Math.max(steerW, 0.04); }
      if (f.x > w - m) { steerX -= 1; steerW = Math.max(steerW, 0.04); }
      if (f.y < m) { steerY += 1; steerW = Math.max(steerW, 0.04); }
      if (f.y > h - m) { steerY -= 1; steerW = Math.max(steerW, 0.04); }

      if (steerW > 0) {
        const want = Math.atan2(steerY, steerX);
        turn += wrapAngle(want - f.heading) * steerW;
      }

      f.heading += turn * k;
      const sp = f.speed * o.speed * (f.target ? 1.8 : 1);
      f.x += Math.cos(f.heading) * sp * k;
      f.y += (Math.sin(f.heading) * sp + Math.sin(t * 1.4 + f.seed) * 0.08) * k;
      if (f.x < -40 || f.x > w + 40 || f.y < -40 || f.y > h + 40) {
        f.x = Math.min(w, Math.max(0, f.x));
        f.y = Math.min(h, Math.max(0, f.y));
      }
    }

    stepPhases(flies, dt * 0.001, Math.max(0.2, o.period), o.sync, o.syncRadius);

    // Render: additive glow sprite + hot core
    const prevOp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    for (const f of flies) {
      f.flash *= Math.exp(-dt / 380);
      const b = 0.16 + 0.84 * f.flash;
      const halo = o.glow * f.depth * (0.6 + 0.6 * b);
      if (sprite) {
        ctx.globalAlpha = Math.min(1, b * f.depth);
        ctx.drawImage(sprite, f.x - halo, f.y - halo, halo * 2, halo * 2);
      }
      ctx.globalAlpha = Math.min(1, 0.25 + b);
      ctx.fillStyle = o.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, o.size * f.depth * (0.6 + 0.4 * b), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = prevOp;
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: (w, h) => {
      sizeRef.current = { w, h };
      fliesRef.current = Array.from({ length: optionsRef.current.count }, makeFly);
    },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
