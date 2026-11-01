import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer } from "../../runtime/fx";
import { hexToRgba } from "../../utils/color";

export interface UseBoidsOptions {
  count: number;
  maxSpeed: number;
  separationRadius: number;
  alignmentRadius: number;
  cohesionRadius: number;
  separationForce: number;
  alignmentForce: number;
  cohesionForce: number;
  color: string;
  trailLength: number;
  trailOpacity: number;
  boidSize: number;
  backgroundColor: string;
  interactive: boolean;
  mouseRadius: number;
  mouseForce: number;
  wrapEdges: boolean;
}

export interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 0.6 (far) .. 1 (near): size, brightness. */
  z: number;
  flap: number;
  bank: number;
  /** Panic level 0..1; spreads to neighbours (murmuration ripple). */
  fear: number;
  wander: number;
  trail: number[];
}

/** Boids only see neighbours within ~270° ahead of them (blind spot behind). */
export function canSee(b: Boid, dx: number, dy: number): boolean {
  const sp = Math.hypot(b.vx, b.vy) || 1;
  const d = Math.hypot(dx, dy) || 1;
  return (b.vx * dx + b.vy * dy) / (sp * d) > -0.7;
}

/**
 * Reynolds' three rules over the neighbours in view, plus fear propagation.
 * Returns the steering acceleration. Pure: no canvas, testable.
 */
export function steer(b: Boid, neighbours: readonly Boid[], o: UseBoidsOptions): [number, number, number] {
  let sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0, na = 0, nc = 0, fear = 0;
  const sr2 = o.separationRadius ** 2, ar2 = o.alignmentRadius ** 2, cr2 = o.cohesionRadius ** 2;
  for (const q of neighbours) {
    if (q === b) continue;
    const dx = q.x - b.x, dy = q.y - b.y;
    const d2 = dx * dx + dy * dy;
    if (d2 > cr2 && d2 > ar2 && d2 > sr2) continue;
    if (!canSee(b, dx, dy)) continue;
    if (d2 < sr2 && d2 > 0) { sx -= dx / d2; sy -= dy / d2; }
    if (d2 < ar2) { ax += q.vx; ay += q.vy; na++; }
    if (d2 < cr2) { cx += q.x; cy += q.y; nc++; fear = Math.max(fear, q.fear); }
  }
  let fx = sx * o.separationForce * 25, fy = sy * o.separationForce * 25;
  if (na) { fx += (ax / na - b.vx) * o.alignmentForce; fy += (ay / na - b.vy) * o.alignmentForce; }
  if (nc) { fx += (cx / nc - b.x) * o.cohesionForce * 0.02; fy += (cy / nc - b.y) * o.cohesionForce * 0.02; }
  return [fx, fy, fear * 0.93];
}

export function useBoids(options: UseBoidsOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const s = useRef({ boids: [] as Boid[], t: 0, w: 0, h: 0 }).current;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function make(): Boid {
    const a = Math.random() * Math.PI * 2;
    const sp = optionsRef.current.maxSpeed * (0.6 + Math.random() * 0.4);
    return {
      x: Math.random() * s.w, y: Math.random() * s.h,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      z: 0.6 + Math.random() * 0.4,
      flap: Math.random() * Math.PI * 2, bank: 0, fear: 0,
      wander: Math.random() * 100, trail: [],
    };
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    s.t += dt * 0.001;
    const t = s.t;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    const want = o.count > 0 ? Math.max(1, Math.ceil(o.count * frame.quality)) : 0;
    const boids = s.boids;
    while (boids.length < want) boids.push(make());
    if (boids.length > want) boids.length = want;

    // Spatial hash: neighbours come from the 3×3 cells around each boid
    const cell = Math.max(20, o.separationRadius, o.alignmentRadius, o.cohesionRadius);
    const cols = Math.ceil(w / cell) + 1;
    const grid = new Map<number, Boid[]>();
    for (const b of boids) {
      const key = Math.floor(b.y / cell) * cols + Math.floor(b.x / cell);
      const list = grid.get(key);
      if (list) list.push(b); else grid.set(key, [b]);
    }

    const p = readPointer(pointer.current, canvasEl.current);
    const predator = o.interactive && p.inside;
    // Two slowly wandering goals give the flock somewhere to go (it turns and folds)
    const goals = [
      [w * (0.5 + 0.35 * Math.sin(t * 0.11)), h * (0.5 + 0.3 * Math.sin(t * 0.17 + 1))],
      [w * (0.5 + 0.35 * Math.sin(t * 0.13 + 2.5)), h * (0.5 + 0.3 * Math.cos(t * 0.09))],
    ];

    const near: Boid[] = [];
    for (const b of boids) {
      near.length = 0;
      const gx = Math.floor(b.x / cell), gy = Math.floor(b.y / cell);
      for (let yy = gy - 1; yy <= gy + 1; yy++) {
        for (let xx = gx - 1; xx <= gx + 1; xx++) {
          const list = grid.get(yy * cols + xx);
          if (list) for (const q of list) near.push(q);
        }
      }
      let [fx, fy, inherited] = steer(b, near, o);
      b.fear = Math.max(b.fear * Math.pow(0.97, k), inherited);

      // Wander + goal
      b.wander += 0.05 * k;
      fx += Math.cos(b.wander * 1.3) * 0.02;
      fy += Math.sin(b.wander) * 0.02;
      const g = goals[b.z > 0.8 ? 0 : 1]; // near and far birds form two flocks
      fx += (g[0] - b.x) * 0.00004 * o.maxSpeed;
      fy += (g[1] - b.y) * 0.00004 * o.maxSpeed;

      // Predator: flee, and panic spreads through the flock
      if (predator) {
        const dx = b.x - p.x, dy = b.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < o.mouseRadius) {
          const f = (1 - d / o.mouseRadius) * o.mouseForce;
          fx += (dx / (d || 1)) * f * 4;
          fy += (dy / (d || 1)) * f * 4;
          b.fear = 1;
        }
      }

      // Soft edges when not wrapping
      if (!o.wrapEdges) {
        const m = 60;
        if (b.x < m) fx += (m - b.x) * 0.002;
        if (b.x > w - m) fx -= (b.x - (w - m)) * 0.002;
        if (b.y < m) fy += (m - b.y) * 0.002;
        if (b.y > h - m) fy -= (b.y - (h - m)) * 0.002;
      }

      const prevA = Math.atan2(b.vy, b.vx);
      b.vx += fx * k;
      b.vy += fy * k;
      const max = o.maxSpeed * (1 + b.fear * 0.8);
      const min = o.maxSpeed * 0.45;
      const sp = Math.hypot(b.vx, b.vy) || 1;
      const clamped = Math.max(min, Math.min(max, sp));
      b.vx = (b.vx / sp) * clamped;
      b.vy = (b.vy / sp) * clamped;
      const turn = Math.atan2(Math.sin(Math.atan2(b.vy, b.vx) - prevA), Math.cos(Math.atan2(b.vy, b.vx) - prevA));
      b.bank += (Math.max(-1, Math.min(1, turn * 10)) - b.bank) * 0.15 * k;
      b.flap += (0.25 + b.fear * 0.35 + Math.max(0, clamped - o.maxSpeed * 0.7) * 0.1) * k;

      b.x += b.vx * k;
      b.y += b.vy * k;
      if (o.wrapEdges) {
        let wrapped = false;
        if (b.x < -10) { b.x += w + 20; wrapped = true; }
        if (b.x > w + 10) { b.x -= w + 20; wrapped = true; }
        if (b.y < -10) { b.y += h + 20; wrapped = true; }
        if (b.y > h + 10) { b.y -= h + 20; wrapped = true; }
        if (wrapped) b.trail.length = 0;
      }
      b.trail.push(b.x, b.y);
      while (b.trail.length > Math.max(0, o.trailLength) * 2) b.trail.splice(0, 2);
    }

    // Trails: tapered, fading toward the tail (3 opacity buckets)
    if (o.trailLength > 1 && o.trailOpacity > 0) {
      const paths = [new Path2D(), new Path2D(), new Path2D()];
      for (const b of boids) {
        const n = b.trail.length / 2;
        for (let i = 1; i < n; i++) {
          const bucket = Math.min(2, Math.floor((i / n) * 3));
          paths[bucket].moveTo(b.trail[(i - 1) * 2], b.trail[(i - 1) * 2 + 1]);
          paths[bucket].lineTo(b.trail[i * 2], b.trail[i * 2 + 1]);
        }
      }
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = hexToRgba(o.color, o.trailOpacity * (0.2 + i * 0.35));
        ctx.lineWidth = 0.6 + i * 0.5;
        ctx.stroke(paths[i]);
      }
    }

    // Birds: swept wings that beat and bank, far ones smaller and dimmer
    const bodies = [new Path2D(), new Path2D()];
    for (const b of boids) {
      const a = Math.atan2(b.vy, b.vx);
      const s2 = o.boidSize * b.z;
      const c = Math.cos(a), sn = Math.sin(a);
      const P = (lx: number, ly: number): [number, number] => [b.x + lx * c - ly * sn, b.y + lx * sn + ly * c];
      const beat = Math.sin(b.flap);
      const span = s2 * (1.1 + 0.5 * beat);
      const sweep = s2 * (0.35 - 0.25 * beat);
      const lw = span * (1 + b.bank * 0.35), rw = span * (1 - b.bank * 0.35);
      const path = bodies[b.z > 0.8 ? 1 : 0];
      const nose = P(s2 * 1.1, 0), tail = P(-s2 * 0.9, 0);
      const lt = P(-sweep, -lw), rt = P(-sweep, rw);
      const lm = P(s2 * 0.15, -s2 * 0.2), rm = P(s2 * 0.15, s2 * 0.2);
      path.moveTo(nose[0], nose[1]);
      path.lineTo(lm[0], lm[1]);
      path.lineTo(lt[0], lt[1]);
      path.lineTo(P(-s2 * 0.25, -s2 * 0.12)[0], P(-s2 * 0.25, -s2 * 0.12)[1]);
      path.lineTo(tail[0], tail[1]);
      path.lineTo(P(-s2 * 0.25, s2 * 0.12)[0], P(-s2 * 0.25, s2 * 0.12)[1]);
      path.lineTo(rt[0], rt[1]);
      path.lineTo(rm[0], rm[1]);
      path.closePath();
    }
    ctx.fillStyle = o.color;
    ctx.globalAlpha = 0.6;
    ctx.fill(bodies[0]);
    ctx.globalAlpha = 1;
    ctx.fill(bodies[1]);
  }

  const setup = useCanvasSetup({
    onResize: (w, h) => {
      s.w = w; s.h = h;
      s.boids = Array.from({ length: optionsRef.current.count }, make);
    },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
