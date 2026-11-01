import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import type { Solid } from "../../runtime/physics";
import { usePointer, readPointer, prefersReducedMotion } from "../../runtime/fx";

export interface IvyNode {
  x: number;
  y: number;
  parent: number;
  dx: number;
  dy: number;
  /** Descendant count; drives stem thickness (pipe model). */
  weight: number;
}

interface Leaf { x: number; y: number; angle: number; size: number; born: number; shade: number }
interface Tendril { x: number; y: number; angle: number; dir: number; size: number; born: number }

export interface Plant {
  nodes: IvyNode[];
  ax: number[];
  ay: number[];
  alive: Uint8Array;
  live: number;
  grid: Map<number, number[]>;
  cell: number;
  leaves: Leaf[];
  tendrils: Tendril[];
  done: boolean;
  /** Solid size the plant was built for (collide mode). */
  sw: number;
  sh: number;
  stuck: number;
  /** Node index -> consecutive steps its growth was blocked by an existing node. */
  blocked: Map<number, number>;
}

export interface GrowParams {
  influence: number;
  kill: number;
  segLen: number;
  maxNodes: number;
  /** Phototropism: plant-local light position and pull 0..1. */
  sunX?: number;
  sunY?: number;
  sun?: number;
  leafChance?: number;
  tendrilChance?: number;
  leafSize?: number;
  t?: number;
}

export interface UseIvyGrowthOptions {
  color: string;
  leafColor: string;
  backgroundColor: string;
  vines: number;
  growthSpeed: number;
  density: number;
  leafSize: number;
  leafDensity: number;
  followCursor: boolean;
  hug: number;
  loop: boolean;
  overlay: boolean;
  collide: boolean;
}

const key = (cx: number, cy: number) => (cx + 4096) * 16384 + (cy + 4096);

function gridAdd(pl: Plant, i: number) {
  const n = pl.nodes[i];
  const k = key(Math.floor(n.x / pl.cell), Math.floor(n.y / pl.cell));
  const list = pl.grid.get(k);
  if (list) list.push(i);
  else pl.grid.set(k, [i]);
}

function nearestNode(pl: Plant, x: number, y: number, maxD: number): number {
  const cx = Math.floor(x / pl.cell);
  const cy = Math.floor(y / pl.cell);
  const reach = Math.ceil(maxD / pl.cell);
  let best = -1;
  let bd = maxD * maxD;
  for (let gx = cx - reach; gx <= cx + reach; gx++) {
    for (let gy = cy - reach; gy <= cy + reach; gy++) {
      const list = pl.grid.get(key(gx, gy));
      if (!list) continue;
      for (const i of list) {
        const n = pl.nodes[i];
        const d = (n.x - x) ** 2 + (n.y - y) ** 2;
        if (d < bd) { bd = d; best = i; }
      }
    }
  }
  return best;
}

export function createPlant(
  roots: { x: number; y: number; dx: number; dy: number }[],
  ax: number[],
  ay: number[],
  cell: number,
): Plant {
  const pl: Plant = {
    nodes: [],
    ax, ay,
    alive: new Uint8Array(ax.length).fill(1),
    live: ax.length,
    grid: new Map(),
    cell,
    leaves: [],
    tendrils: [],
    done: ax.length === 0,
    sw: 0, sh: 0,
    stuck: 0,
    blocked: new Map(),
  };
  for (const r of roots) {
    pl.nodes.push({ x: r.x, y: r.y, parent: -1, dx: r.dx, dy: r.dy, weight: 0 });
    gridAdd(pl, pl.nodes.length - 1);
  }
  return pl;
}

function addNode(pl: Plant, parent: number, x: number, y: number, dx: number, dy: number, gp: GrowParams) {
  pl.nodes.push({ x, y, parent, dx, dy, weight: 0 });
  const i = pl.nodes.length - 1;
  gridAdd(pl, i);
  for (let j = parent; j >= 0; j = pl.nodes[j].parent) pl.nodes[j].weight++;
  const t = gp.t ?? 0;
  if (Math.random() < (gp.leafChance ?? 0)) {
    const side = Math.random() < 0.5 ? -1 : 1;
    pl.leaves.push({
      x, y,
      angle: Math.atan2(dy, dx) + side * (0.6 + Math.random() * 0.7),
      size: (gp.leafSize ?? 8) * (0.7 + Math.random() * 0.6),
      born: t,
      shade: (Math.random() * 3) | 0,
    });
  }
  if (Math.random() < (gp.tendrilChance ?? 0)) {
    const side = Math.random() < 0.5 ? -1 : 1;
    pl.tendrils.push({ x, y, angle: Math.atan2(dy, dx) + side * 0.9, dir: side, size: 5 + Math.random() * 5, born: t });
  }
  return i;
}

/**
 * One step of space colonization (Runions et al., 2007):
 *   each live attractor pulls its nearest node (within `influence`) →
 *   each pulled node grows one segment toward the mean pull →
 *   attractors within `kill` of a new node die.
 * Falls back to growing toward the nearest attractor when none are in range,
 * so roots can reach a distant field. Returns nodes added.
 */
export function growStep(pl: Plant, gp: GrowParams): number {
  if (pl.done) return 0;
  const acc = new Map<number, { gx: number; gy: number; attrs: number[] }>();
  for (let a = 0; a < pl.ax.length; a++) {
    if (!pl.alive[a]) continue;
    const ni = nearestNode(pl, pl.ax[a], pl.ay[a], gp.influence);
    if (ni < 0) continue;
    const n = pl.nodes[ni];
    const dx = pl.ax[a] - n.x;
    const dy = pl.ay[a] - n.y;
    const d = Math.hypot(dx, dy) || 1;
    const v = acc.get(ni);
    if (v) { v.gx += dx / d; v.gy += dy / d; v.attrs.push(a); }
    else acc.set(ni, { gx: dx / d, gy: dy / d, attrs: [a] });
  }

  const added: number[] = [];
  const grow = (ni: number, gx: number, gy: number) => {
    const n = pl.nodes[ni];
    let dx = gx * 0.75 + n.dx * 0.25;
    let dy = gy * 0.75 + n.dy * 0.25;
    if (gp.sun && gp.sunX !== undefined && gp.sunY !== undefined) {
      const sx = gp.sunX - n.x;
      const sy = gp.sunY - n.y;
      const sd = Math.hypot(sx, sy) || 1;
      dx += (sx / sd) * gp.sun;
      dy += (sy / sd) * gp.sun;
    }
    let len = Math.hypot(dx, dy);
    if (len < 1e-3) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; len = Math.hypot(dx, dy); }
    dx /= len; dy /= len;
    const nx = n.x + dx * gp.segLen;
    const ny = n.y + dy * gp.segLen;
    if (nearestNode(pl, nx, ny, gp.segLen * 0.45) >= 0) return false;
    added.push(addNode(pl, ni, nx, ny, dx, dy, gp));
    return true;
  };

  for (const [ni, { gx, gy, attrs }] of acc) {
    if (pl.nodes.length >= gp.maxNodes) break;
    const len = Math.hypot(gx, gy) || 1;
    if (grow(ni, gx / len, gy / len)) {
      pl.blocked.delete(ni);
      continue;
    }
    // Pull cancels out or points into existing growth: after a few tries the
    // attractors feeding this node are unreachable, so retire them.
    const b = (pl.blocked.get(ni) ?? 0) + 1;
    pl.blocked.set(ni, b);
    if (b >= 3) {
      for (const a of attrs) if (pl.alive[a]) { pl.alive[a] = 0; pl.live--; }
      pl.blocked.delete(ni);
    }
  }

  // Nothing in range: reach for the closest attractor
  if (acc.size === 0 && pl.live > 0) {
    let best = -1, bestA = -1, bd = Infinity;
    const stride = Math.max(1, Math.floor((pl.nodes.length * pl.live) / 60000));
    for (let a = 0; a < pl.ax.length; a++) {
      if (!pl.alive[a]) continue;
      for (let i = 0; i < pl.nodes.length; i += stride) {
        const d = (pl.nodes[i].x - pl.ax[a]) ** 2 + (pl.nodes[i].y - pl.ay[a]) ** 2;
        if (d < bd) { bd = d; best = i; bestA = a; }
      }
    }
    if (best >= 0) {
      const n = pl.nodes[best];
      const d = Math.sqrt(bd) || 1;
      if (!grow(best, (pl.ax[bestA] - n.x) / d, (pl.ay[bestA] - n.y) / d) && ++pl.stuck > 4) {
        pl.alive[bestA] = 0;
        pl.live--;
        pl.stuck = 0;
      }
    }
  }

  // Kill reached attractors
  if (added.length) {
    const k2 = gp.kill * gp.kill;
    for (let a = 0; a < pl.ax.length; a++) {
      if (!pl.alive[a]) continue;
      for (const i of added) {
        const n = pl.nodes[i];
        if ((n.x - pl.ax[a]) ** 2 + (n.y - pl.ay[a]) ** 2 < k2) {
          pl.alive[a] = 0;
          pl.live--;
          break;
        }
      }
    }
  }

  if (pl.live <= 0 || pl.nodes.length >= gp.maxNodes) pl.done = true;
  return added.length;
}

// ─── Plant layouts ───────────────────────────────────────────────────────────

/** Whole canvas: vines climb from the bottom, densest along the edges (content stays clear). */
function canvasPlant(w: number, h: number, vines: number, density: number): Plant {
  const ax: number[] = [];
  const ay: number[] = [];
  const want = Math.round((w * h) / 650 * density);
  const edge = Math.min(w, h) * 0.3;
  for (let tries = 0; ax.length < want && tries < want * 12; tries++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const ed = Math.min(x, w - x, h - y, y * 1.6);
    const p = 0.08 + 0.92 * Math.max(0, 1 - ed / edge);
    if (Math.random() < p) { ax.push(x); ay.push(y); }
  }
  const roots = Array.from({ length: Math.max(1, vines) }, (_, i) => {
    const n = Math.max(1, vines);
    const x = n === 1 ? w * 0.1 : (i / (n - 1)) * w * 0.9 + w * 0.05 + (Math.random() - 0.5) * 30;
    return { x, y: h + 2, dx: 0, dy: -1 };
  });
  return createPlant(roots, ax, ay, 70);
}

/** Around a DOM solid, in solid-local coords: climbs both sides and across the top. */
function solidPlant(s: Solid, hug: number, density: number): Plant {
  const P = s.h * 2 + s.w;
  const want = Math.round((P / 3.2) * density);
  const ax: number[] = [];
  const ay: number[] = [];
  for (let i = 0; i < want; i++) {
    const u = Math.random() * P;
    const off = -3 + Math.random() * (hug + 3);
    if (u < s.h) { ax.push(-off); ay.push(s.h - u); }
    else if (u < s.h + s.w) { ax.push(u - s.h); ay.push(-off); }
    else { ax.push(s.w + off); ay.push(u - s.h - s.w); }
  }
  const roots = [
    { x: -hug * 0.4, y: s.h + 2, dx: 0, dy: -1 },
    { x: s.w + hug * 0.4, y: s.h + 2, dx: 0, dy: -1 },
  ];
  const pl = createPlant(roots, ax, ay, Math.max(24, hug * 2.2));
  pl.sw = s.w;
  pl.sh = s.h;
  return pl;
}

const easeOutBack = (x: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export function useIvyGrowth(options: UseIvyGrowthOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  /** Key -1 = whole-canvas plant; otherwise the solid id. */
  const plantsRef = useRef(new Map<number, Plant>());
  const timeRef = useRef(0);
  const accRef = useRef(0);
  const doneAtRef = useRef(-1);
  const keyRef = useRef("");
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function paramsFor(id: number, o: UseIvyGrowthOptions, t: number): GrowParams {
    const canvasMode = id === -1;
    return {
      influence: canvasMode ? 70 : Math.max(24, o.hug * 2.2),
      kill: canvasMode ? 11 : 7,
      segLen: canvasMode ? 4.5 : 3.2,
      maxNodes: canvasMode ? 3500 : 1600,
      leafChance: o.leafDensity * (canvasMode ? 0.5 : 0.85),
      tendrilChance: 0.025,
      leafSize: o.leafSize * (canvasMode ? 1 : 0.9),
      t,
    };
  }

  function drawPlant(ctx: CanvasRenderingContext2D, pl: Plant, o: UseIvyGrowthOptions, t: number, fade: number) {
    // Stems: one stroke per thickness bucket
    const buckets: Path2D[] = Array.from({ length: 6 }, () => new Path2D());
    for (let i = 0; i < pl.nodes.length; i++) {
      const n = pl.nodes[i];
      if (n.parent < 0) continue;
      const p = pl.nodes[n.parent];
      const wv = 0.7 + Math.sqrt(n.weight) * 0.3;
      const b = Math.min(5, Math.floor(wv));
      buckets[b].moveTo(p.x, p.y);
      buckets[b].lineTo(n.x, n.y);
    }
    ctx.globalAlpha = fade;
    ctx.strokeStyle = o.color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let b = 0; b < 6; b++) {
      ctx.lineWidth = 0.8 + b * 0.85;
      ctx.stroke(buckets[b]);
    }

    // Tendrils: inward spirals that uncoil as they appear
    ctx.lineWidth = 0.7;
    const tp = new Path2D();
    for (const td of pl.tendrils) {
      const age = Math.min(1, (t - td.born) / 1.4);
      if (age <= 0) continue;
      const steps = Math.ceil(18 * age);
      let x = td.x, y = td.y, a = td.angle;
      tp.moveTo(x, y);
      for (let s = 0; s < steps; s++) {
        const seg = td.size * 0.22 * (1 - s / 22);
        a += td.dir * (0.18 + s * 0.035);
        x += Math.cos(a) * seg;
        y += Math.sin(a) * seg;
        tp.lineTo(x, y);
      }
    }
    ctx.stroke(tp);

    // Leaves: heart-ish, unfurl with a little overshoot, batched per shade
    const shades: Path2D[] = [new Path2D(), new Path2D(), new Path2D()];
    const veins = new Path2D();
    for (const lf of pl.leaves) {
      const age = Math.min(1, (t - lf.born) / 0.9);
      if (age <= 0) continue;
      const s = lf.size * Math.max(0, easeOutBack(age));
      const c = Math.cos(lf.angle), sn = Math.sin(lf.angle);
      const bx = lf.x + c * 1.5, by = lf.y + sn * 1.5;
      const P = (lx: number, ly: number): [number, number] => [bx + lx * c - ly * sn, by + lx * sn + ly * c];
      const path = shades[lf.shade];
      const p0 = P(0, 0);
      path.moveTo(p0[0], p0[1]);
      path.bezierCurveTo(...P(s * 0.15, -s * 0.62), ...P(s * 0.95, -s * 0.55), ...P(s, 0));
      path.bezierCurveTo(...P(s * 0.95, s * 0.55), ...P(s * 0.15, s * 0.62), p0[0], p0[1]);
      path.closePath();
      const v = P(s * 0.85, 0);
      veins.moveTo(p0[0], p0[1]);
      veins.lineTo(v[0], v[1]);
    }
    ctx.fillStyle = o.leafColor;
    const alphas = [0.62, 0.8, 1];
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = alphas[i] * fade;
      ctx.fill(shades[i]);
    }
    ctx.globalAlpha = 0.45 * fade;
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = o.color;
    ctx.stroke(veins);
    ctx.globalAlpha = 1;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;
    const plants = plantsRef.current;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    const k = `${o.collide}|${o.vines}|${o.density}|${o.hug}`;
    if (keyRef.current !== k) {
      keyRef.current = k;
      plants.clear();
      doneAtRef.current = -1;
    }

    // Keep plants in step with the page's solids (or one canvas-wide plant)
    const solids: readonly Solid[] = frame.solids;
    const byId = new Map(solids.map((s) => [s.id, s]));
    const instant = prefersReducedMotion();
    const ensure = (id: number, make: () => Plant) => {
      const pl = make();
      if (instant) {
        const gp = paramsFor(id, o, t - 10);
        for (let i = 0; i < 6000 && !pl.done; i++) growStep(pl, gp);
      }
      plants.set(id, pl);
    };
    if (o.collide) {
      for (const s of solids) {
        if (s.w < 40 || s.h < 12) continue;
        const pl = plants.get(s.id);
        if (!pl || Math.abs(pl.sw - s.w) > s.w * 0.2 || Math.abs(pl.sh - s.h) > s.h * 0.3) {
          ensure(s.id, () => solidPlant(s, o.hug, o.density));
        }
      }
      for (const id of plants.keys()) if (!byId.has(id)) plants.delete(id);
    } else if (!plants.has(-1)) {
      ensure(-1, () => canvasPlant(w, h, o.vines, o.density));
    }

    // Grow: fixed steps per second, independent of frame rate
    const ptr = readPointer(pointer.current, canvasEl.current);
    accRef.current += dt * 0.001 * 15 * o.growthSpeed;
    const steps = Math.min(6, Math.floor(accRef.current));
    accRef.current -= steps;
    let allDone = plants.size > 0;
    for (const [id, pl] of plants) {
      const s = id === -1 ? null : byId.get(id);
      const ox = s ? s.x : 0;
      const oy = s ? s.y : 0;
      const gp = paramsFor(id, o, t);
      if (o.followCursor && ptr.inside) {
        gp.sunX = ptr.x - ox;
        gp.sunY = ptr.y - oy;
        gp.sun = 0.35;
      }
      for (let i = 0; i < steps; i++) growStep(pl, gp);
      if (!pl.done) allDone = false;
    }

    // Loop: hold the finished wall, fade it, regrow
    let fade = 1;
    if (o.loop && allDone) {
      if (doneAtRef.current < 0) doneAtRef.current = t;
      const since = t - doneAtRef.current;
      if (since > 7) fade = Math.max(0, 1 - (since - 7) / 1.8);
      if (fade <= 0) {
        plants.clear();
        doneAtRef.current = -1;
      }
    } else {
      doneAtRef.current = -1;
    }

    for (const [id, pl] of plants) {
      const s = id === -1 ? null : byId.get(id);
      ctx.save();
      if (s) ctx.translate(s.x, s.y);
      drawPlant(ctx, pl, o, t, fade);
      ctx.restore();
    }
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: () => {
      plantsRef.current.delete(-1);
    },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
