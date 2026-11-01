import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { collide, anchorTo, followAnchor, type Anchor, type Solid } from "../../runtime/physics";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { sampleGradient } from "../../utils/color";

export type Season = "cycle" | "spring" | "summer" | "autumn" | "winter";

export interface UseSeasonsTreeOptions {
  season: Season;
  cycleSeconds: number;
  trunkColor: string;
  leafColor: string;
  blossomColor: string;
  autumnColor: string;
  backgroundColor: string;
  treeX: number;
  treeSize: number;
  wind: number;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

export interface Branch {
  parent: number;
  /** Angle relative to parent (rad); 0 = continue straight. */
  rel: number;
  len: number;
  width: number;
  depth: number;
  phase: number;
}

interface Leaf {
  branch: number;
  along: number;
  side: number;
  size: number;
  /** Fullness threshold: visible while fullness > thr. */
  thr: number;
  jitter: number;
  attached: boolean;
}

interface Falling {
  x: number; y: number; vx: number; vy: number;
  angle: number; spin: number; size: number;
  color: string; life: number; rest: Anchor | null; landed: boolean; phase: number;
}

const MAX_DEPTH = 8;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Deterministic recursive tree: each branch splits in two or three, shorter and thinner. */
export function buildTree(seed: number, trunkLen: number): { branches: Branch[]; leaves: Leaf[] } {
  const r = rng(seed);
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  const grow = (parent: number, rel: number, len: number, width: number, depth: number) => {
    const i = branches.length;
    branches.push({ parent, rel, len, width, depth, phase: r() * Math.PI * 2 });
    if (depth >= MAX_DEPTH - 4) {
      const n = depth >= MAX_DEPTH - 1 ? 5 : depth >= MAX_DEPTH - 3 ? 3 : 2;
      for (let l = 0; l < n; l++) {
        leaves.push({
          branch: i, along: 0.3 + r() * 0.7, side: r() < 0.5 ? -1 : 1,
          size: 0.75 + r() * 0.5, thr: r(), jitter: (r() * 6) | 0, attached: true,
        });
      }
    }
    if (depth >= MAX_DEPTH) return;
    const kids = depth < 2 ? 2 : r() < 0.35 ? 3 : 2;
    for (let c = 0; c < kids; c++) {
      const spread = 0.22 + r() * 0.24;
      const a = kids === 2 ? (c === 0 ? -spread : spread) : (c - 1) * spread * 1.1;
      grow(i, a + (r() - 0.5) * 0.15, len * (0.68 + r() * 0.14), width * 0.68, depth + 1);
    }
  };
  grow(-1, 0, trunkLen, Math.max(4, trunkLen * 0.09), 0);
  return { branches, leaves };
}

/** 0..4 → how much foliage is on the tree. Spring buds, summer full, autumn drops, winter bare. */
export function seasonFullness(s: number): number {
  const x = ((s % 4) + 4) % 4;
  if (x < 1) return 0.35 + 0.65 * x;       // spring: blossoms then leaves fill in
  if (x < 2) return 1;                      // summer
  if (x < 3) return 1 - (x - 2);            // autumn: leaves fall
  return 0;                                 // winter
}

const SEASON_AT: Record<Exclude<Season, "cycle">, number> = { spring: 0.35, summer: 1.5, autumn: 2.45, winter: 3.5 };

export function useSeasonsTree(options: UseSeasonsTreeOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const treeRef = useRef<{ branches: Branch[]; leaves: Leaf[] } | null>(null);
  const fallingRef = useRef<Falling[]>([]);
  const timeRef = useRef(0);
  const seasonRef = useRef(0.2);
  const gustRef = useRef(0);
  const keyRef = useRef("");
  const pointer = usePointer();
  const velocity = useRef(createVelocity()).current;
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function leafColor(o: UseSeasonsTreeOptions, s: number, jitter: number): string {
    const x = ((s % 4) + 4) % 4;
    // Season palette: blossom → green → autumn → (bare) → blossom
    const stops = [o.blossomColor, o.leafColor, o.leafColor, o.autumnColor, o.autumnColor];
    const t = Math.min(1, x / 3);
    const c = sampleGradient(stops, Math.min(0.999, t + (jitter - 2.5) * 0.025));
    const shade = 0.82 + jitter * 0.04;
    return `rgb(${(c[0] * shade) | 0},${(c[1] * shade) | 0},${(c[2] * shade) | 0})`;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    const key = `${w}|${h}|${o.treeSize}`;
    if (keyRef.current !== key || !treeRef.current) {
      keyRef.current = key;
      treeRef.current = buildTree(7, Math.min(h * 0.24, w * 0.3) * o.treeSize);
    }
    const tree = treeRef.current;

    // Season clock
    if (o.season === "cycle") seasonRef.current = (seasonRef.current + (dt * 0.001 * 4) / Math.max(4, o.cycleSeconds)) % 4;
    else seasonRef.current += (SEASON_AT[o.season] - seasonRef.current) * (1 - Math.pow(0.97, k));
    const s = seasonRef.current;
    const full = seasonFullness(s);
    const winter = s > 3 ? Math.min(1, (s - 3) * 3) * Math.min(1, (4 - s) * 4) : 0;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Wind: breeze + cursor gusts near the canopy
    const p = readPointer(pointer.current, canvasEl.current);
    const v = velocity(p, k);
    if (o.interactive && p.inside) gustRef.current += v.vx * 0.004 * k;
    gustRef.current *= Math.pow(0.97, k);
    gustRef.current = Math.max(-1.5, Math.min(1.5, gustRef.current));
    const wind = o.wind * (0.6 + 0.4 * Math.sin(t * 0.4)) + gustRef.current;

    // Forward kinematics: parents precede children in the array
    const n = tree.branches.length;
    const ax = new Float32Array(n), ay = new Float32Array(n), ex = new Float32Array(n), ey = new Float32Array(n), ang = new Float32Array(n);
    const rootX = w * o.treeX;
    for (let i = 0; i < n; i++) {
      const b = tree.branches[i];
      const flex = 0.012 * Math.pow(b.depth + 1, 1.35);
      const sway = (wind * 0.6 + Math.sin(t * (1.1 + b.depth * 0.25) + b.phase) * (0.25 + Math.abs(wind) * 0.35)) * flex;
      const base = b.parent < 0 ? -Math.PI / 2 : ang[b.parent];
      ang[i] = base + b.rel + sway;
      ax[i] = b.parent < 0 ? rootX : ex[b.parent];
      ay[i] = b.parent < 0 ? h + 2 : ey[b.parent];
      ex[i] = ax[i] + Math.cos(ang[i]) * b.len;
      ey[i] = ay[i] + Math.sin(ang[i]) * b.len;
    }

    // Branches, batched by width
    const buckets = new Map<number, Path2D>();
    for (let i = 0; i < n; i++) {
      const bw = Math.max(0.6, Math.round(tree.branches[i].width * 2) / 2);
      let path = buckets.get(bw);
      if (!path) buckets.set(bw, (path = new Path2D()));
      path.moveTo(ax[i], ay[i]);
      path.lineTo(ex[i], ey[i]);
    }
    ctx.strokeStyle = o.trunkColor;
    ctx.lineCap = "round";
    for (const [bw, path] of buckets) {
      ctx.lineWidth = bw;
      ctx.stroke(path);
    }
    // Snow caps in winter
    if (winter > 0.02) {
      ctx.strokeStyle = `rgba(255,255,255,${0.85 * winter})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (tree.branches[i].width < 1.2) continue;
        const nx = Math.sin(ang[i]) * -tree.branches[i].width * 0.45, ny = -Math.abs(Math.cos(ang[i])) * tree.branches[i].width * 0.45;
        ctx.moveTo(ax[i] + nx, ay[i] + ny);
        ctx.lineTo(ex[i] + nx, ey[i] + ny);
      }
      ctx.stroke();
    }

    // Leaves: shown while fullness exceeds each leaf's threshold; drop when it falls below
    const colors = Array.from({ length: 6 }, (_, j) => leafColor(o, s, j));
    const leafPaths = colors.map(() => new Path2D());
    const leafSize = Math.max(2.5, Math.min(w, h) * 0.008) * o.treeSize;
    const falling = fallingRef.current;
    const autumn = s >= 2 && s < 3;
    for (const lf of tree.leaves) {
      const shouldShow = full > lf.thr;
      const b = lf.branch;
      const lx = ax[b] + (ex[b] - ax[b]) * lf.along;
      const ly = ay[b] + (ey[b] - ay[b]) * lf.along;
      const la = ang[b] + lf.side * 0.9 + Math.sin(t * 2.2 + lf.thr * 20) * 0.15;
      if (lf.attached && !shouldShow) {
        lf.attached = false;
        if ((autumn || s < 1) && falling.length < 400 * frame.quality) {
          falling.push({
            x: lx, y: ly, vx: wind * 0.5, vy: 0.2, angle: la, spin: (Math.random() - 0.5) * 0.1,
            size: lf.size * leafSize, color: colors[lf.jitter], life: 0, rest: null, landed: false, phase: Math.random() * 6,
          });
        }
      } else if (!lf.attached && shouldShow) {
        lf.attached = true;
      }
      if (!lf.attached) continue;
      const sz = lf.size * leafSize * (s < 1 ? 0.55 + 0.45 * s : 1);
      const px = lx + Math.cos(la) * sz * 0.8;
      const py = ly + Math.sin(la) * sz * 0.8;
      leafPaths[lf.jitter].moveTo(px + Math.cos(la) * sz, py + Math.sin(la) * sz);
      leafPaths[lf.jitter].ellipse(px, py, sz, sz * 0.55, la, 0, Math.PI * 2);
    }
    for (let j = 0; j < 6; j++) {
      ctx.fillStyle = colors[j];
      ctx.fill(leafPaths[j]);
    }

    // Falling leaves: flutter down, rest on elements or the ground, fade
    const solids: readonly Solid[] = frame.solids;
    const byId = new Map(solids.map((q) => [q.id, q]));
    let alive = 0;
    for (const f of falling) {
      if (f.landed) {
        f.life += dt;
        if (f.rest && !followAnchor(f, f.rest, byId)) { f.rest = null; f.landed = false; f.vy = 0.3; }
      } else {
        const px = f.x, py = f.y;
        const relax = 1 - Math.pow(0.97, k);
        f.vx += (wind * 0.9 + Math.sin(t * 1.6 + f.phase) * 0.8 - f.vx) * relax;
        f.vy += (0.7 + Math.sin(t * 2.3 + f.phase) * 0.35 - f.vy) * relax;
        f.x += f.vx * k; f.y += f.vy * k;
        f.angle += f.spin * k + f.vx * 0.01 * k;
        if (solids.length) {
          const hit = collide(f, px, py, solids, 0);
          if (hit) { f.rest = anchorTo(f, hit, -1); f.landed = true; }
        }
        if (!f.landed && f.y > h - 2) { f.y = h - 2; f.landed = true; }
      }
      const fade = f.landed ? Math.max(0, 1 - f.life / 6000) : 1;
      if (fade <= 0 || f.x < -40 || f.x > w + 40) continue;
      falling[alive++] = f;
      ctx.globalAlpha = fade;
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.ellipse(f.x, f.y, f.size, f.size * 0.5 * Math.abs(Math.cos(f.angle * 2)) + 0.6, f.angle, 0, Math.PI * 2);
      ctx.fill();
    }
    falling.length = alive;
    ctx.globalAlpha = 1;
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: () => { keyRef.current = ""; },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
