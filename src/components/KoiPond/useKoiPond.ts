import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";
import { noise1 } from "../../runtime/noise";
import { drawCaustics, type CausticCache } from "../../runtime/caustics";

export interface UseKoiPondOptions {
  fishCount: number;
  fishColor: string;
  scaleColor: string;
  waterColor: string;
  rippleColor: string;
  lilyColor: string;
  speed: number;
  interactive: boolean;
  showLilies: boolean;
  caustics: boolean;
}

const SEG = 12;

interface Koi {
  x: number; y: number; a: number; v: number;
  len: number; z: number; seed: number; tail: number; turn: number;
  /** Spine points, head first, interleaved x,y. */
  sp: Float32Array;
  /** Pattern patches in body space: u along the spine 0..1, v across -1..1, r radius (body widths). */
  spots: { u: number; v: number; r: number }[];
  accent: boolean;
}
interface Ripple { x: number; y: number; age: number; life: number; size: number }
interface Pad { x: number; y: number; r: number; rot: number; notch: number; flower: boolean; seed: number; vx: number; vy: number }
interface Pellet { x: number; y: number; age: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Koi body half-width at u (0 = nose, 1 = tail root), as a fraction of body length. */
export function koiWidth(u: number): number {
  if (u < 0 || u > 1) return 0;
  return 0.16 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.55)), 0.8) * (1 - 0.6 * u) + 0.014;
}

function makeKoi(w: number, h: number, i: number): Koi {
  const len = Math.min(w, h) * (0.16 + Math.random() * 0.08);
  const x = Math.random() * w, y = Math.random() * h, a = Math.random() * Math.PI * 2;
  const sp = new Float32Array(SEG * 2);
  for (let k = 0; k < SEG; k++) { sp[k * 2] = x - Math.cos(a) * len * k / SEG; sp[k * 2 + 1] = y - Math.sin(a) * len * k / SEG; }
  const spots: Koi["spots"] = [];
  const n = 2 + Math.floor(Math.random() * 3);
  for (let k = 0; k < n; k++) spots.push({ u: 0.1 + Math.random() * 0.75, v: (Math.random() - 0.5) * 1.2, r: 0.5 + Math.random() * 0.7 });
  return { x, y, a, v: 0, len, z: 0.55 + Math.random() * 0.45, seed: Math.random() * 100, tail: Math.random() * 6, turn: 0, sp, spots, accent: i % 3 === 2 };
}

/**
 * A koi pond from above. Koi swim on a flexible 12-point spine with a full silhouette, painted
 * patches, flapping pectoral fins and a trailing butterfly tail, each casting a soft shadow on the
 * pond floor below. Sunlight caustics wash over the bottom, lily pads (some flowering) float
 * above the fish and drift on the ripples. The cursor leaves ripples; tap to drop a food pellet
 * and the koi race up to eat it.
 */
export function useKoiPond(options: UseKoiPondOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const caustic = useRef<CausticCache | null>(null);
  const s = useRef({ t: 0, w: 0, h: 0, koi: [] as Koi[], ripples: [] as Ripple[], pads: [] as Pad[], food: [] as Pellet[], wake: 0 });

  function layout(w: number, h: number) {
    const st = s.current;
    st.w = w; st.h = h;
    st.koi = [];
    const U = Math.min(w, h);
    st.pads = [];
    const n = Math.max(3, Math.round((w * h) / (U * U) * 3));
    for (let i = 0; i < n; i++) {
      st.pads.push({
        x: Math.random() * w, y: Math.random() * h, r: U * (0.06 + Math.random() * 0.06),
        rot: Math.random() * Math.PI * 2, notch: 0.22 + Math.random() * 0.12, flower: i % 3 === 0, seed: Math.random() * 100, vx: 0, vy: 0,
      });
    }
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;
    if (st.w !== w || st.h !== h) layout(w, h);
    const U = Math.min(w, h);

    const fishC = rgbOf(o.fishColor), patchC = rgbOf(o.scaleColor), water = rgbOf(o.waterColor, "0,0,0");
    const ripC = rgbOf(o.rippleColor), lily = rgbOf(o.lilyColor);
    const n = clamp(Math.round(o.fishCount), 0, 40);
    while (st.koi.length < n) st.koi.push(makeKoi(w, h, st.koi.length));
    st.koi.length = n;

    // ---- input: ripples behind the cursor, food where you tap ----
    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, k);
    const speed = Math.hypot(vx, vy);
    if (o.interactive && p.inside && speed > 2) {
      st.wake -= sec;
      if (st.wake <= 0) { st.ripples.push({ x: p.x, y: p.y, age: 0, life: 1.6, size: U * 0.12 }); st.wake = 0.14; }
    }
    if (o.interactive) {
      for (const tap of p.taps) {
        st.food.push({ x: tap.x, y: tap.y, age: 0 });
        st.ripples.push({ x: tap.x, y: tap.y, age: 0, life: 2.4, size: U * 0.3 });
        if (st.food.length > 12) st.food.shift();
      }
    }
    if (Math.random() < sec * 0.25) st.ripples.push({ x: Math.random() * w, y: Math.random() * h, age: 0, life: 2, size: U * 0.08 }); // a drop from a leaf
    for (const r of st.ripples) r.age += sec;
    st.ripples = st.ripples.filter((r) => r.age < r.life);
    for (const f of st.food) f.age += sec;
    st.food = st.food.filter((f) => f.age < 25);

    // ---- koi ----
    for (const f of st.koi) {
      const cruise = U * 0.11 * o.speed * (0.7 + 0.3 * f.z);
      let target = f.a + (noise1(t * 0.15 + f.seed, 4) - 0.5) * 2.4;
      let want = cruise;
      // the nearest pellet pulls hard
      let best: Pellet | null = null, bd = U * 0.9;
      for (const pe of st.food) { const d = Math.hypot(pe.x - f.x, pe.y - f.y); if (d < bd) { bd = d; best = pe; } }
      if (best) {
        target = Math.atan2(best.y - f.y, best.x - f.x);
        want = cruise * 2.6;
        if (bd < f.len * 0.12) { // gulp
          st.food.splice(st.food.indexOf(best), 1);
          st.ripples.push({ x: best.x, y: best.y, age: 0, life: 1.2, size: U * 0.07 });
        }
      } else if (o.interactive && p.inside && speed > 25 && Math.hypot(p.x - f.x, p.y - f.y) < U * 0.25) {
        target = Math.atan2(f.y - p.y, f.x - p.x); // a splashy hand startles them
        want = cruise * 3;
      }
      // keep to the pond, and give each other room
      const m = f.len * 0.6;
      if (f.x < m || f.x > w - m || f.y < m || f.y > h - m) target = Math.atan2(h / 2 - f.y, w / 2 - f.x);
      for (const g of st.koi) {
        if (g === f) continue;
        const dx = f.x - g.x, dy = f.y - g.y, d = Math.hypot(dx, dy);
        if (d < f.len * 0.5 && d > 0) target += wrapAngle(Math.atan2(dy, dx) - f.a) * 0.15;
      }
      const da = wrapAngle(target - f.a);
      const turnRate = 1.6 * (0.5 + f.v / Math.max(1, cruise));
      f.turn += (clamp(da * 2, -turnRate, turnRate) - f.turn) * Math.min(1, sec * 3);
      f.a += f.turn * sec;
      f.v += (want - f.v) * Math.min(1, sec * 1.5);
      f.x += Math.cos(f.a) * f.v * sec;
      f.y += Math.sin(f.a) * f.v * sec;
      f.x = clamp(f.x, 0, w); f.y = clamp(f.y, 0, h);
      f.tail += sec * (2.2 + 5 * f.v / Math.max(1, U * 0.11));
      // spine: head leads, each joint follows at fixed spacing, a travelling wave adds the swim
      const sp = f.sp, seg = f.len / (SEG - 1);
      sp[0] = f.x; sp[1] = f.y;
      for (let i = 1; i < SEG; i++) {
        const ax = sp[(i - 1) * 2], ay = sp[(i - 1) * 2 + 1];
        let dx = sp[i * 2] - ax, dy = sp[i * 2 + 1] - ay;
        const d = Math.hypot(dx, dy) || 1;
        dx /= d; dy /= d;
        const u = i / SEG;
        const wave = Math.sin(f.tail - u * 5) * 0.06 * u * u;
        const nx = -dy, ny = dx;
        sp[i * 2] = ax + (dx + nx * wave) * seg;
        sp[i * 2 + 1] = ay + (dy + ny * wave) * seg;
      }
    }

    // ---- pond floor ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const floor = ctx.createRadialGradient(w * 0.45, h * 0.4, U * 0.1, w / 2, h / 2, Math.hypot(w, h) * 0.65);
    floor.addColorStop(0, `rgb(${mix(water, "120,140,110", 0.22)})`);
    floor.addColorStop(0.6, `rgb(${water})`);
    floor.addColorStop(1, `rgb(${mix(water, "0,0,0", 0.55)})`);
    ctx.fillStyle = floor;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = `rgba(${mix(water, "160,170,140", 0.25)},0.35)`; // smooth stones, very deep
    for (let i = 0; i < 16; i++) {
      const sx = ((i * 0.618 + 0.13) % 1) * w, sy = ((i * 0.382 + 0.29) % 1) * h, sr = U * (0.03 + (i % 4) * 0.015);
      ctx.beginPath(); ctx.ellipse(sx, sy, sr, sr * 0.7, i, 0, Math.PI * 2); ctx.fill();
    }
    if (o.caustics) drawCaustics(ctx, caustic, w, h, t * 0.8, mix(ripC, "255,255,230", 0.5), 0.35, frame.quality, 12);

    // ---- koi: shadows on the floor, then the fish ----
    const order = st.koi.slice().sort((a, b) => a.z - b.z);
    const outline = (f: Koi, dx: number, dy: number) => {
      const sp = f.sp;
      const L: [number, number][] = [], R: [number, number][] = [];
      for (let i = 0; i < SEG; i++) {
        const j = Math.min(SEG - 1, i + 1), q = Math.max(0, i - 1);
        let tx = sp[q * 2] - sp[j * 2], ty = sp[q * 2 + 1] - sp[j * 2 + 1];
        const d = Math.hypot(tx, ty) || 1; tx /= d; ty /= d;
        const hw = koiWidth(i / (SEG - 1)) * f.len;
        L.push([sp[i * 2] - ty * hw + dx, sp[i * 2 + 1] + tx * hw + dy]);
        R.push([sp[i * 2] + ty * hw + dx, sp[i * 2 + 1] - tx * hw + dy]);
      }
      ctx.beginPath();
      ctx.moveTo(sp[0] + Math.cos(f.a) * f.len * 0.03 + dx, sp[1] + Math.sin(f.a) * f.len * 0.03 + dy);
      for (const [x, y] of L) ctx.lineTo(x, y);
      for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
      ctx.closePath();
    };
    const tailFin = (f: Koi, dx: number, dy: number) => {
      const sp = f.sp, e = (SEG - 1) * 2;
      const ta = Math.atan2(sp[e + 1] - sp[e - 1], sp[e] - sp[e - 2]);
      const sw = Math.sin(f.tail - 5) * 0.5;
      const Lf = f.len * 0.36;
      const bx = sp[e] + dx, by = sp[e + 1] + dy;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      for (const side of [1, -1]) {
        const a1 = ta + side * 0.75 + sw;
        ctx.quadraticCurveTo(bx + Math.cos(ta + side * 0.7 + sw * 0.6) * Lf * 0.55, by + Math.sin(ta + side * 0.7 + sw * 0.6) * Lf * 0.55, bx + Math.cos(a1) * Lf, by + Math.sin(a1) * Lf);
        ctx.quadraticCurveTo(bx + Math.cos(ta + sw) * Lf * 0.7, by + Math.sin(ta + sw) * Lf * 0.7, bx, by);
      }
      ctx.closePath();
    };
    for (const f of order) {
      const off = f.len * (0.18 + 0.25 * (1 - f.z));
      ctx.fillStyle = `rgba(0,0,0,${0.22 + 0.1 * f.z})`;
      outline(f, off * 0.6, off); ctx.fill();
      tailFin(f, off * 0.6, off); ctx.fill();
    }
    for (const f of order) {
      const body = f.accent ? patchC : fishC, patch = f.accent ? fishC : patchC;
      const depth = 0.35 * (1 - f.z); // deeper fish fade into the water
      const bodyC = mix(body, water, depth), patchCol = mix(patch, water, depth);
      const sp = f.sp;
      // pectoral fins, flapping
      const flap = Math.sin(f.tail * 0.6) * 0.35;
      for (const side of [1, -1]) {
        const i = 3, px = sp[i * 2], py = sp[i * 2 + 1];
        const fa = f.a + Math.PI + side * (1.0 + flap * side);
        ctx.fillStyle = `rgba(${mix(bodyC, "255,255,255", 0.3)},0.55)`;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(px + Math.cos(fa - side * 0.4) * f.len * 0.2, py + Math.sin(fa - side * 0.4) * f.len * 0.2, px + Math.cos(fa) * f.len * 0.2, py + Math.sin(fa) * f.len * 0.2);
        ctx.quadraticCurveTo(px + Math.cos(fa + side * 0.3) * f.len * 0.1, py + Math.sin(fa + side * 0.3) * f.len * 0.1, px, py);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${mix(bodyC, "255,255,255", 0.15)},0.75)`;
      tailFin(f, 0, 0); ctx.fill();
      ctx.strokeStyle = `rgba(${mix(bodyC, "255,255,255", 0.4)},0.35)`; // fin rays
      ctx.lineWidth = Math.max(0.5, f.len * 0.006);
      ctx.stroke();
      // body with patches clipped to it
      const bg = ctx.createLinearGradient(sp[0], sp[1], sp[(SEG - 1) * 2], sp[(SEG - 1) * 2 + 1]);
      bg.addColorStop(0, `rgb(${mix(bodyC, "255,255,255", 0.12)})`);
      bg.addColorStop(1, `rgb(${mix(bodyC, "0,0,0", 0.12)})`);
      ctx.fillStyle = bg;
      outline(f, 0, 0); ctx.fill();
      ctx.save();
      outline(f, 0, 0); ctx.clip();
      ctx.fillStyle = `rgb(${patchCol})`;
      for (const sp2 of f.spots) {
        const i = Math.min(SEG - 1, Math.round(sp2.u * (SEG - 1)));
        const j = Math.min(SEG - 1, i + 1), q = Math.max(0, i - 1);
        let tx = sp[q * 2] - sp[j * 2], ty = sp[q * 2 + 1] - sp[j * 2 + 1];
        const d = Math.hypot(tx, ty) || 1; tx /= d; ty /= d;
        const hw = koiWidth(sp2.u) * f.len;
        const cx = sp[i * 2] - ty * hw * sp2.v, cy = sp[i * 2 + 1] + tx * hw * sp2.v;
        ctx.beginPath(); ctx.ellipse(cx, cy, hw * sp2.r * 1.4, hw * sp2.r, Math.atan2(ty, tx), 0, Math.PI * 2); ctx.fill();
      }
      // dorsal sheen along the spine, catching the light
      ctx.strokeStyle = `rgba(255,255,255,${0.18 * f.z})`;
      ctx.lineWidth = f.len * 0.03;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(sp[2], sp[3]);
      for (let i = 2; i < SEG - 2; i++) ctx.lineTo(sp[i * 2], sp[i * 2 + 1]);
      ctx.stroke();
      ctx.restore();
      // eyes
      const ex = sp[0] + Math.cos(f.a) * f.len * -0.05, ey = sp[1] + Math.sin(f.a) * f.len * -0.05;
      ctx.fillStyle = "rgba(10,10,10,0.8)";
      for (const side of [1, -1]) {
        const nx = -Math.sin(f.a) * side, ny = Math.cos(f.a) * side;
        ctx.beginPath(); ctx.arc(ex + nx * f.len * 0.055, ey + ny * f.len * 0.055, Math.max(0.8, f.len * 0.012), 0, Math.PI * 2); ctx.fill();
      }
    }

    // food pellets on the surface
    ctx.fillStyle = "rgb(190,140,80)";
    for (const pe of st.food) {
      const bob = Math.sin(pe.age * 3) * 0.5;
      ctx.beginPath(); ctx.arc(pe.x, pe.y + bob, Math.max(1.5, U * 0.006), 0, Math.PI * 2); ctx.fill();
    }

    // ---- ripples: a bright crest with a dark trough behind it ----
    ctx.lineWidth = 1.4;
    for (const r of st.ripples) {
      const k2 = r.age / r.life;
      const rad = r.size * (0.1 + k2);
      const a = (1 - k2) * (1 - k2);
      ctx.strokeStyle = `rgba(${mix(ripC, "255,255,255", 0.4)},${0.5 * a})`;
      ctx.beginPath(); ctx.arc(r.x, r.y, rad, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = `rgba(${mix(water, "0,0,0", 0.4)},${0.35 * a})`;
      ctx.beginPath(); ctx.arc(r.x, r.y, rad * 0.88, 0, Math.PI * 2); ctx.stroke();
      if (r.size > U * 0.2) { ctx.strokeStyle = `rgba(${ripC},${0.3 * a})`; ctx.beginPath(); ctx.arc(r.x, r.y, rad * 0.6, 0, Math.PI * 2); ctx.stroke(); }
    }

    // ---- lily pads, floating above it all ----
    if (o.showLilies) {
      for (const pad of st.pads) {
        for (const r of st.ripples) { // ripples nudge the pads
          const dx = pad.x - r.x, dy = pad.y - r.y, d = Math.hypot(dx, dy) || 1;
          const front = r.size * (0.1 + r.age / r.life);
          if (Math.abs(d - front) < pad.r) { const f = (1 - r.age / r.life) * 6 * sec; pad.vx += (dx / d) * f * U * 0.02; pad.vy += (dy / d) * f * U * 0.02; }
        }
        pad.vx *= Math.exp(-sec * 0.8); pad.vy *= Math.exp(-sec * 0.8);
        pad.x += pad.vx * sec + Math.sin(t * 0.1 + pad.seed) * sec * 2;
        pad.y += pad.vy * sec + Math.cos(t * 0.08 + pad.seed) * sec * 2;
        if (pad.x < -pad.r) pad.x = w + pad.r; else if (pad.x > w + pad.r) pad.x = -pad.r;
        if (pad.y < -pad.r) pad.y = h + pad.r; else if (pad.y > h + pad.r) pad.y = -pad.r;
        pad.rot += Math.sin(t * 0.2 + pad.seed) * sec * 0.05;
        const padPath = (dx: number, dy: number) => {
          ctx.beginPath();
          ctx.moveTo(pad.x + dx, pad.y + dy);
          ctx.arc(pad.x + dx, pad.y + dy, pad.r, pad.rot + pad.notch / 2, pad.rot + Math.PI * 2 - pad.notch / 2);
          ctx.closePath();
        };
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        padPath(pad.r * 0.12, pad.r * 0.18); ctx.fill();
        const pg = ctx.createRadialGradient(pad.x - pad.r * 0.3, pad.y - pad.r * 0.3, pad.r * 0.1, pad.x, pad.y, pad.r);
        pg.addColorStop(0, `rgb(${mix(lily, "255,255,200", 0.18)})`);
        pg.addColorStop(0.85, `rgb(${lily})`);
        pg.addColorStop(1, `rgb(${mix(lily, "0,0,0", 0.35)})`);
        ctx.fillStyle = pg;
        padPath(0, 0); ctx.fill();
        ctx.strokeStyle = `rgba(${mix(lily, "0,0,0", 0.3)},0.5)`; // veins from the notch
        ctx.lineWidth = Math.max(0.6, pad.r * 0.025);
        for (let i = 1; i < 10; i++) {
          const a = pad.rot + pad.notch / 2 + (i / 10) * (Math.PI * 2 - pad.notch);
          ctx.beginPath(); ctx.moveTo(pad.x, pad.y); ctx.lineTo(pad.x + Math.cos(a) * pad.r * 0.92, pad.y + Math.sin(a) * pad.r * 0.92); ctx.stroke();
        }
        ctx.strokeStyle = `rgba(${mix(lily, "255,255,220", 0.4)},0.45)`; // wet rim
        ctx.beginPath(); ctx.arc(pad.x, pad.y, pad.r * 0.97, pad.rot + Math.PI + 0.4, pad.rot + Math.PI * 1.6); ctx.stroke();
        if (pad.flower) { // a waterlily: two rings of pointed petals
          const fx = pad.x + Math.cos(pad.rot + Math.PI) * pad.r * 0.25, fy = pad.y + Math.sin(pad.rot + Math.PI) * pad.r * 0.25;
          const petal = mix(lily, "255,190,215", 0.75);
          for (let ring = 0; ring < 2; ring++) {
            const np = 8, pr = pad.r * (ring ? 0.32 : 0.48);
            for (let i = 0; i < np; i++) {
              const a = (i + ring * 0.5) / np * Math.PI * 2 + pad.seed;
              ctx.fillStyle = `rgb(${ring ? mix(petal, "255,255,255", 0.45) : petal})`;
              ctx.beginPath();
              ctx.moveTo(fx, fy);
              ctx.quadraticCurveTo(fx + Math.cos(a - 0.35) * pr * 0.7, fy + Math.sin(a - 0.35) * pr * 0.7, fx + Math.cos(a) * pr, fy + Math.sin(a) * pr);
              ctx.quadraticCurveTo(fx + Math.cos(a + 0.35) * pr * 0.7, fy + Math.sin(a + 0.35) * pr * 0.7, fx, fy);
              ctx.fill();
            }
          }
          ctx.fillStyle = "rgb(250,210,90)";
          ctx.beginPath(); ctx.arc(fx, fy, pad.r * 0.09, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // surface sheen: the sky's reflection
    const sheen = ctx.createLinearGradient(0, 0, w, h);
    sheen.addColorStop(0, "rgba(255,255,255,0.06)");
    sheen.addColorStop(0.4, "rgba(255,255,255,0)");
    sheen.addColorStop(1, "rgba(255,255,255,0.03)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);
  }

  const setup = useCanvasSetup({ onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
