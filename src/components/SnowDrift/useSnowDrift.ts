import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import type { Solid } from "../../runtime/physics";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { sampleGradient } from "../../utils/color";

export interface UseSnowDriftOptions {
  count: number;
  color: string;
  backgroundColor: string;
  flakeSize: number;
  wind: number;
  fallSpeed: number;
  maxDepth: number;
  floorDepth: number;
  slope: number;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

interface Flake {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number;
  phase: number;
  /** Snow volume carried (px of column height); > 0 for clumps sliding off edges. */
  load: number;
}

/** A heightfield of snow on a surface, in surface-local columns. */
export interface Pile {
  h: Float32Array;
  cell: number;
  width: number;
}

const CELL = 3;

/**
 * Angle-of-repose relaxation: wherever neighbouring columns differ by more
 * than `slope` (rise per px), half the excess slides downhill. With `open`
 * edges the pile sits on a ledge, so snow steeper than the slope at either
 * end spills off and is returned as [left, right] volumes.
 */
export function relaxPile(p: Pile, slope: number, open: boolean, passes = 2): [number, number] {
  const h = p.h;
  const n = h.length;
  const step = slope * p.cell;
  let spillL = 0, spillR = 0;
  for (let pass = 0; pass < passes; pass++) {
    for (let i = 0; i < n - 1; i++) {
      const d = h[i] - h[i + 1];
      if (d > step) { const m = (d - step) / 2; h[i] -= m; h[i + 1] += m; }
      else if (d < -step) { const m = (-d - step) / 2; h[i] += m; h[i + 1] -= m; }
    }
    if (open && n > 0) {
      if (h[0] > step) { spillL += h[0] - step; h[0] = step; }
      if (h[n - 1] > step) { spillR += h[n - 1] - step; h[n - 1] = step; }
    }
  }
  return [spillL, spillR];
}

export function makePile(width: number): Pile {
  return { h: new Float32Array(Math.max(1, Math.ceil(width / CELL))), cell: CELL, width };
}

export function useSnowDrift(options: UseSnowDriftOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const flakesRef = useRef<Flake[]>([]);
  /** -1 = floor; otherwise solid id. */
  const pilesRef = useRef(new Map<number, Pile>());
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);
  const pointer = usePointer();
  const velocity = useRef(createVelocity()).current;
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function makeFlake(top: boolean): Flake {
    const { w, h } = sizeRef.current;
    const o = optionsRef.current;
    const depth = 0.45 + Math.random() * 0.55;
    return {
      x: Math.random() * (w + 100) - 50,
      y: top ? -10 - Math.random() * 40 : Math.random() * h,
      vx: 0,
      vy: o.fallSpeed * depth,
      size: o.flakeSize * depth * (0.6 + Math.random() * 0.6),
      depth,
      phase: Math.random() * Math.PI * 2,
      load: 0,
    };
  }

  /** Drops `amount` of snow onto `pile` at local x, respecting the depth cap. */
  function deposit(pile: Pile, lx: number, amount: number, cap: number) {
    const c = Math.max(0, Math.min(pile.h.length - 1, Math.floor(lx / pile.cell)));
    pile.h[c] = Math.min(cap, pile.h[c] + amount);
  }

  function drawPile(ctx: CanvasRenderingContext2D, pile: Pile, x0: number, baseY: number, fill: CanvasGradient | string, rim: string) {
    const h = pile.h;
    const n = h.length;
    let any = false;
    for (let i = 0; i < n; i++) if (h[i] > 0.4) { any = true; break; }
    if (!any) return;
    ctx.beginPath();
    ctx.moveTo(x0, baseY);
    let px = x0, py = baseY - h[0];
    ctx.lineTo(px, py);
    for (let i = 1; i < n; i++) {
      const x = x0 + i * pile.cell + pile.cell / 2;
      const y = baseY - h[i];
      ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
      px = x; py = y;
    }
    ctx.lineTo(x0 + pile.width, baseY - h[n - 1]);
    ctx.lineTo(x0 + pile.width, baseY);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;
    const piles = pilesRef.current;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Sync piles with the floor and the page's solids
    const floor = piles.get(-1);
    if (!floor || Math.abs(floor.width - w) > 1) piles.set(-1, makePile(w));
    const solids: readonly Solid[] = frame.solids;
    const byId = new Map(solids.map((s) => [s.id, s]));
    for (const s of solids) {
      if (s.w < 12) continue;
      const pl = piles.get(s.id);
      if (!pl || Math.abs(pl.width - s.w) > 2) piles.set(s.id, makePile(s.w));
    }
    for (const id of piles.keys()) if (id !== -1 && !byId.has(id)) piles.delete(id);

    // Relax every pile; ledges spill clumps off their edges
    const flakes = flakesRef.current;
    for (const [id, pl] of piles) {
      const [l, r] = relaxPile(pl, o.slope, id !== -1);
      const s = byId.get(id);
      if (!s) continue;
      for (const [amt, side] of [[l, -1], [r, 1]] as const) {
        if (amt < 0.05) continue;
        flakes.push({
          x: side < 0 ? s.x - 2 : s.x + s.w + 2,
          y: s.y - 2,
          vx: side * (0.3 + Math.random() * 0.4),
          vy: 0.5,
          size: Math.min(6, 1.5 + amt * 1.5),
          depth: 1,
          phase: 0,
          load: amt,
        });
      }
    }

    // Cursor brushes snow off whatever it sweeps across
    const p = readPointer(pointer.current, canvasEl.current);
    const v = velocity(p, k);
    const speed = Math.hypot(v.vx, v.vy);
    if (o.interactive && p.inside && speed > 1.2) {
      for (const [id, pl] of piles) {
        const s = id === -1 ? null : byId.get(id);
        const x0 = s ? s.x : 0;
        const baseY = s ? s.y : h;
        const c0 = Math.floor((p.x - x0) / pl.cell);
        for (let c = c0 - 5; c <= c0 + 5; c++) {
          if (c < 0 || c >= pl.h.length || pl.h[c] < 0.5) continue;
          const top = baseY - pl.h[c];
          if (p.y < top - 12 || p.y > baseY + 4) continue;
          const take = Math.min(pl.h[c], (0.25 + speed * 0.06) * k);
          pl.h[c] -= take;
          if (Math.random() < take * 0.6 && flakes.length < 2000) {
            flakes.push({
              x: x0 + c * pl.cell, y: top,
              vx: v.vx * 0.35 + (Math.random() - 0.5), vy: v.vy * 0.35 - 1 - Math.random(),
              size: 1 + Math.random() * 1.6, depth: 1, phase: Math.random() * 6, load: take,
            });
          }
        }
      }
    }

    // Flakes
    const target = Math.ceil(o.count * frame.quality);
    let falling = 0;
    for (const f of flakes) if (f.load === 0) falling++;
    for (let i = falling; i < target; i++) flakes.push(makeFlake(true));

    const relax = 1 - Math.pow(0.96, k);
    const floorPile = piles.get(-1)!;
    const paths = [new Path2D(), new Path2D(), new Path2D()];
    let alive = 0;
    let kept = 0;
    for (const f of flakes) {
      const py = f.y;
      const heavy = f.load > 0;
      const sway = Math.sin(t * 1.3 + f.phase) * 0.35 * f.depth;
      const tvx = (o.wind * f.depth + sway) * (heavy ? 0.3 : 1);
      const tvy = o.fallSpeed * (heavy ? 2.2 : 0.55 + f.depth * 0.6);
      f.vx += (tvx - f.vx) * (heavy ? relax * 0.4 : relax);
      f.vy += (tvy - f.vy) * (heavy ? relax * 0.5 : relax);
      f.x += f.vx * k;
      f.y += f.vy * k;

      // Landing: segment test against snow surfaces (solid top minus its pile)
      let landed = false;
      if (f.vy > 0) {
        for (const s of solids) {
          if (f.x < s.x || f.x > s.x + s.w) continue;
          const pl = piles.get(s.id);
          if (!pl) continue;
          const c = Math.min(pl.h.length - 1, Math.floor((f.x - s.x) / pl.cell));
          const top = s.y - pl.h[c];
          if (py <= top && f.y >= top) {
            deposit(pl, f.x - s.x, heavy ? f.load : f.size * 0.5, o.maxDepth);
            landed = true;
            break;
          }
        }
        if (!landed) {
          const c = Math.max(0, Math.min(floorPile.h.length - 1, Math.floor(f.x / floorPile.cell)));
          if (f.y >= h - floorPile.h[c]) {
            if (f.x >= 0 && f.x <= w) deposit(floorPile, f.x, heavy ? f.load : f.size * 0.35, o.floorDepth);
            landed = true;
          }
        }
      }
      if (landed || f.y > h + 20 || f.x < -80 || f.x > w + 80) {
        if (heavy || kept >= target) continue; // clumps and extras vanish
        Object.assign(f, makeFlake(true));
      }
      flakes[alive++] = f;
      if (!heavy) kept++;
      const b = f.depth < 0.65 ? 0 : f.depth < 0.85 ? 1 : 2;
      paths[b].moveTo(f.x + f.size, f.y);
      paths[b].arc(f.x, f.y, f.size, 0, Math.PI * 2);
    }
    flakes.length = alive;

    ctx.fillStyle = o.color;
    const alphas = [0.45, 0.7, 0.95];
    for (let b = 0; b < 3; b++) {
      ctx.globalAlpha = alphas[b];
      ctx.fill(paths[b]);
    }
    ctx.globalAlpha = 1;

    // Piles: snow color fading to a cool shadow at the base
    const shade = sampleGradient([o.color, o.backgroundColor], 0.28);
    const shadeStr = `rgb(${shade[0] | 0},${shade[1] | 0},${shade[2] | 0})`;
    for (const [id, pl] of piles) {
      const s = id === -1 ? null : byId.get(id);
      if (id !== -1 && !s) continue;
      const x0 = s ? s.x : 0;
      const baseY = s ? s.y : h;
      const depth = id === -1 ? o.floorDepth : o.maxDepth;
      const g = ctx.createLinearGradient(0, baseY - depth, 0, baseY);
      g.addColorStop(0, o.color);
      g.addColorStop(1, shadeStr);
      drawPile(ctx, pl, x0, baseY, g, o.color);
    }
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: (w, h) => {
      sizeRef.current = { w, h };
      pilesRef.current.delete(-1);
      flakesRef.current = Array.from({ length: optionsRef.current.count }, () => makeFlake(false));
    },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
