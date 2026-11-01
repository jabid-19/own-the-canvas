import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { collide, anchorTo, followAnchor, type Anchor, type Solid } from "../../runtime/physics";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";

export interface Seed {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  /** ms left lying on the ground / a solid before fading. */
  life: number;
  alpha: number;
  rest: Anchor | null;
  landed: boolean;
}

interface Head {
  x: number;
  stemH: number;
  r: number;
  sway: number;
  swayVel: number;
  /** Seeds still attached (indices into the golden-spiral sphere). */
  attached: boolean[];
  /** 0..1 regrowth fade-in. */
  grow: number;
  emptySince: number;
}

export interface UseDandelionOptions {
  headCount: number;
  seedsPerHead: number;
  color: string;
  stemColor: string;
  backgroundColor: string;
  wind: number;
  blowStrength: number;
  autoBlow: boolean;
  regrow: boolean;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

export interface SeedEnv {
  t: number;
  wind: number;
}

const SINK = 0.32; // terminal fall speed, px per 60Hz frame
const DRAG = 0.025; // per-frame velocity relaxation (pappus drag)
const MAX_FREE = 700;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/**
 * Drag-dominated flight: the pappus (parachute) makes velocity relax toward
 * the local wind plus a small sink, so seeds hang and drift instead of
 * falling. Exact-exponential relaxation keeps it frame-rate independent.
 */
export function stepSeed(s: Seed, env: SeedEnv, k: number): void {
  const windX = env.wind * (0.55 + 0.45 * Math.sin(env.t * 0.31 + s.y * 0.008))
    + Math.sin(env.t * 1.7 + s.x * 0.02 + s.phase) * 0.25;
  const lift = Math.sin(env.t * 1.1 + s.x * 0.015 + s.phase * 2) * 0.28;
  const a = 1 - Math.pow(1 - DRAG, k);
  s.vx += (windX - s.vx) * a;
  s.vy += (SINK + lift - s.vy) * a;
  s.x += s.vx * k;
  s.y += s.vy * k;
}

/** Unit-sphere point for seed i of n (golden spiral), as [x, y, z]. */
function spherePoint(i: number, n: number): [number, number, number] {
  const y = 1 - (2 * (i + 0.5)) / n;
  const r = Math.sqrt(1 - y * y);
  const th = i * GOLDEN;
  return [Math.cos(th) * r, y, Math.sin(th) * r];
}

export function useDandelion(options: UseDandelionOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const headsRef = useRef<Head[]>([]);
  const seedsRef = useRef<Seed[]>([]);
  const timeRef = useRef(0);
  const nextAutoRef = useRef(2);
  const keyRef = useRef("");
  const pointer = usePointer();
  const velocity = useRef(createVelocity()).current;
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function seedHeads(w: number, h: number) {
    const o = optionsRef.current;
    keyRef.current = `${o.headCount}|${o.seedsPerHead}`;
    const n = Math.max(0, o.headCount);
    headsRef.current = Array.from({ length: n }, (_, i) => ({
      x: w * ((i + 0.5) / n) + (Math.random() - 0.5) * (w / n) * 0.4,
      stemH: h * (0.32 + Math.random() * 0.3),
      r: Math.min(46, Math.max(22, Math.min(w, h) * 0.06)) * (0.85 + Math.random() * 0.3),
      sway: 0,
      swayVel: 0,
      attached: Array(o.seedsPerHead).fill(true),
      grow: 1,
      emptySince: -1,
    }));
    seedsRef.current = [];
  }

  /** Head center after sway (stem pivots at its root). */
  function headCenter(hd: Head, h: number) {
    return { x: hd.x + Math.sin(hd.sway) * hd.stemH, y: h - Math.cos(hd.sway) * hd.stemH };
  }

  function release(hd: Head, i: number, h: number, vx: number, vy: number) {
    if (!hd.attached[i] || seedsRef.current.length >= MAX_FREE) return;
    hd.attached[i] = false;
    const c = headCenter(hd, h);
    const [px, py] = spherePoint(i, hd.attached.length);
    seedsRef.current.push({
      x: c.x + px * hd.r,
      y: c.y + py * hd.r,
      vx: vx + px * 0.8,
      vy: vy + py * 0.8 - 0.4,
      phase: Math.random() * Math.PI * 2,
      life: 0,
      alpha: 1,
      rest: null,
      landed: false,
    });
  }

  function drawFreeSeed(ctx: CanvasRenderingContext2D, s: Seed) {
    const tilt = Math.max(-0.7, Math.min(0.7, s.vx * 0.25));
    const ux = Math.sin(tilt), uy = -Math.cos(tilt); // "up" along the beak
    const topX = s.x + ux * 9, topY = s.y + uy * 9;
    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(topX, topY);
    // Pappus umbrella: filaments fanning above the beak
    for (let f = 0; f < 9; f++) {
      const a = tilt - Math.PI / 2 + ((f / 8) - 0.5) * 2.3;
      ctx.moveTo(topX, topY);
      ctx.lineTo(topX + Math.cos(a) * 6, topY + Math.sin(a) * 6);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, 0.9, 1.8, tilt, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    if (keyRef.current !== `${o.headCount}|${o.seedsPerHead}`) seedHeads(w, h);

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    const p = readPointer(pointer.current, canvasEl.current);
    const v = velocity(p, k);
    const speed = Math.hypot(v.vx, v.vy);
    const heads = headsRef.current;

    // Auto gusts strip a few seeds from the windward side
    if (o.autoBlow && t > nextAutoRef.current && heads.length) {
      nextAutoRef.current = t + 2.5 + Math.random() * 4;
      const hd = heads[(Math.random() * heads.length) | 0];
      const n = 3 + ((Math.random() * 6) | 0);
      for (let c = 0; c < n; c++) {
        const i = (Math.random() * hd.attached.length) | 0;
        release(hd, i, h, o.wind * 1.5, -0.6);
      }
    }

    // Heads: sway spring, blowing, regrowth
    ctx.lineCap = "round";
    for (const hd of heads) {
      let target = o.wind * 0.06 + Math.sin(t * 0.9 + hd.x * 0.01) * 0.03;
      const c = headCenter(hd, h);

      if (o.interactive && p.inside && speed > 1.5) {
        const d = Math.hypot(p.x - c.x, p.y - c.y);
        const reach = hd.r * 1.9;
        if (d < reach) {
          target += (v.vx / 40) * (1 - d / reach);
          const chance = Math.min(1, speed * 0.02 * o.blowStrength) * (1 - d / reach);
          for (let i = 0; i < hd.attached.length; i++) {
            if (hd.attached[i] && Math.random() < chance * 0.35 * k) {
              release(hd, i, h, v.vx * 0.22, v.vy * 0.22);
            }
          }
        }
      }
      hd.swayVel += (-0.035 * (hd.sway - target) - 0.08 * hd.swayVel) * k;
      hd.sway += hd.swayVel * k;

      const left = hd.attached.reduce((n, a) => n + (a ? 1 : 0), 0);
      if (o.regrow && left === 0) {
        if (hd.emptySince < 0) hd.emptySince = t;
        else if (t - hd.emptySince > 3.5) {
          hd.attached.fill(true);
          hd.grow = 0;
          hd.emptySince = -1;
        }
      }
      hd.grow = Math.min(1, hd.grow + dt / 1600);

      // Stem
      const cc = headCenter(hd, h);
      ctx.strokeStyle = o.stemColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(hd.x, h + 2);
      ctx.quadraticCurveTo(hd.x + Math.sin(hd.sway) * hd.stemH * 0.35, h - hd.stemH * 0.55, cc.x, cc.y);
      ctx.stroke();

      // Seed head: beaks from the receptacle, a tuft at each tip (back half dimmer)
      const n = hd.attached.length;
      const R = hd.r * (0.35 + 0.65 * hd.grow);
      ctx.strokeStyle = o.color;
      ctx.lineWidth = 0.6;
      for (const back of [true, false]) {
        ctx.globalAlpha = (back ? 0.28 : 0.8) * hd.grow;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          if (!hd.attached[i]) continue;
          const [px, py, pz] = spherePoint(i, n);
          if ((pz < 0) !== back) continue;
          const ex = cc.x + px * R;
          const ey = cc.y + py * R;
          ctx.moveTo(cc.x + px * R * 0.18, cc.y + py * R * 0.18);
          ctx.lineTo(ex, ey);
          for (let f = 0; f < 5; f++) {
            const a = Math.atan2(py, px) + (f - 2) * 0.45;
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex + Math.cos(a) * 3.2, ey + Math.sin(a) * 3.2);
          }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = o.stemColor;
      ctx.beginPath();
      ctx.arc(cc.x, cc.y, Math.max(2, hd.r * 0.12), 0, Math.PI * 2);
      ctx.fill();
    }

    // Free seeds
    const solids: readonly Solid[] = frame.solids;
    const byId = new Map(solids.map((s) => [s.id, s]));
    const env: SeedEnv = { t, wind: o.wind };
    const seeds = seedsRef.current;
    const cap = Math.ceil(MAX_FREE * frame.quality);
    if (seeds.length > cap) seeds.splice(0, seeds.length - cap);

    ctx.strokeStyle = o.color;
    ctx.fillStyle = o.stemColor;
    ctx.lineWidth = 0.6;
    let alive = 0;
    for (const s of seeds) {
      if (s.landed) {
        s.life -= dt;
        if (s.rest && !followAnchor(s, s.rest, byId)) {
          s.rest = null;
          s.landed = false;
          s.vy = 0.2;
        }
        if (s.life < 1200) s.alpha = Math.max(0, s.life / 1200);
      } else {
        const px = s.x, py = s.y;
        stepSeed(s, env, k);
        if (solids.length) {
          const hit = collide(s, px, py, solids, 0);
          if (hit) {
            s.rest = anchorTo(s, hit, -1);
            s.landed = true;
            s.life = 3000 + Math.random() * 5000;
          }
        }
        if (!s.landed && s.y > h - 2) {
          s.y = h - 2;
          s.landed = true;
          s.life = 2000 + Math.random() * 3000;
        }
      }
      if (s.alpha <= 0 || s.x < -60 || s.x > w + 60 || s.y < -120) continue;
      seeds[alive++] = s;
      drawFreeSeed(ctx, s);
    }
    seeds.length = alive;
    ctx.globalAlpha = 1;
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: seedHeads,
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
