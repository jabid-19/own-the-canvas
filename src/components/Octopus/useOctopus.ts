import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer } from "../../runtime/fx";
import { hexToRgbString } from "../../utils/color";
import type { Solid } from "../../runtime/physics";

export interface UseOctopusOptions {
  skinColor: string;
  spotColor: string;
  suckerColor: string;
  eyeColor: string;
  inkColor: string;
  backgroundColor: string;
  size: number;
  tentacleLength: number;
  followCursor: boolean;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

interface Pt { x: number; y: number }
interface Arm {
  spread: number;   // -1..1 across the body
  phase: number;
  curl: number;     // current tip curl, signed; eases toward curlTo
  curlTo: number;
  lift: number;     // extra angle when an arm wanders off to explore
  liftTo: number;
  nextMood: number; // seconds until it picks a new curl / lift
  pts: Pt[];        // current shape
  pose: Pt[];       // scratch: wave pose
  tmp: Pt[];        // scratch: IK
  anchor: (Pt & { id: number }) | null;
  reach: number;    // 0..1 blend toward an IK target
}
interface Ink { x: number; y: number; vx: number; vy: number; r: number; life: number; dark: number }

const N = 24;
const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const toRgb = (c: string) => (c.startsWith("#") ? hexToRgbString(c) : "255,255,255");
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** FABRIK: bends a chain of `seg`-long links rooted at `root` so its tip reaches toward `target`. */
export function fabrik(P: Pt[], root: Pt, target: Pt, seg: number, iterations = 2): void {
  const n = P.length - 1;
  for (let it = 0; it < iterations; it++) {
    P[n].x = target.x; P[n].y = target.y;
    for (let j = n - 1; j >= 0; j--) {
      const dx = P[j].x - P[j + 1].x, dy = P[j].y - P[j + 1].y, d = Math.hypot(dx, dy) || 1;
      P[j].x = P[j + 1].x + (dx / d) * seg; P[j].y = P[j + 1].y + (dy / d) * seg;
    }
    P[0].x = root.x; P[0].y = root.y;
    for (let j = 1; j <= n; j++) {
      const dx = P[j].x - P[j - 1].x, dy = P[j].y - P[j - 1].y, d = Math.hypot(dx, dy) || 1;
      P[j].x = P[j - 1].x + (dx / d) * seg; P[j].y = P[j - 1].y + (dy / d) * seg;
    }
  }
}

/** Closest point on a solid's outline to `p`. */
export function edgePoint(s: Solid, p: Pt): Pt {
  const x = clamp(p.x, s.x, s.x + s.w), y = clamp(p.y, s.y, s.y + s.h);
  if (x > s.x && x < s.x + s.w && y > s.y && y < s.y + s.h) { // inside: push to the nearest edge
    const dl = x - s.x, dr = s.x + s.w - x, dt = y - s.y, db = s.y + s.h - y;
    const m = Math.min(dl, dr, dt, db);
    return m === dl ? { x: s.x, y } : m === dr ? { x: s.x + s.w, y } : m === dt ? { x, y: s.y } : { x, y: s.y + s.h };
  }
  return { x, y };
}

/** Arm half-thickness at link `j`: thick at the web, tapering to a fine curling tip. */
const armR = (S: number, j: number) => S * 0.16 * Math.pow(1 - j / N, 1.1) + S * 0.006;

/** Traces a smooth curve through `P` (midpoint quadratics), continuing the current path. */
function smooth(ctx: CanvasRenderingContext2D, P: Pt[], move: boolean) {
  if (move) ctx.moveTo(P[0].x, P[0].y); else ctx.lineTo(P[0].x, P[0].y);
  for (let j = 1; j < P.length - 1; j++) ctx.quadraticCurveTo(P[j].x, P[j].y, (P[j].x + P[j + 1].x) / 2, (P[j].y + P[j + 1].y) / 2);
  ctx.lineTo(P[P.length - 1].x, P[P.length - 1].y);
}

/**
 * An octopus drifting in deep water. Eight tapered arms, webbed at the base, ripple and
 * coil and uncoil on their own, now and then one wandering off to explore; the nearest
 * ones reach out and wrap the cursor, and with `collide` arm tips latch onto the edges of
 * `data-otc-solid` elements and pull the body along. It breathes through its siphon and
 * swims in jet pulses, mantle first. Its pupils stay level whichever way it turns, dark
 * "passing cloud" waves ripple over its skin when it is excited, and a tap makes it blanch,
 * shoot a stream of ink from the siphon and jet away.
 */
export function useOctopus(options: UseOctopusOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const s = useRef({
    t: 0, x: -1, y: -1, vx: 0, vy: 0, ang: -Math.PI / 2, pulse: 0, jetIn: 0.5, pale: 0, excite: 0,
    inkFor: 0, inkDir: 0, blinkAt: -9, nextBlink: 3,
    arms: [] as Arm[], ink: [] as Ink[],
    spots: [] as { a: number; r: number; size: number; ph: number }[],
    bumps: [] as { a: number; r: number; size: number }[],
    snow: [] as { x: number; y: number; r: number; v: number }[], w: 0, h: 0,
  });

  function init(w: number, h: number) {
    const st = s.current;
    st.w = w; st.h = h;
    let seed = 21;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    if (!st.arms.length) {
      const pt = () => Array.from({ length: N + 1 }, () => ({ x: 0, y: 0 }));
      st.arms = Array.from({ length: 8 }, (_, i) => {
        const curl = (i < 4 ? -1 : 1) * (1.2 + rnd() * 1.6);
        return { spread: (i / 7 - 0.5) * 2, phase: rnd() * 6, curl, curlTo: curl, lift: 0, liftTo: 0, nextMood: 1 + rnd() * 4, pts: pt(), pose: pt(), tmp: pt(), anchor: null, reach: 0 };
      });
      st.spots = Array.from({ length: 22 }, () => ({ a: rnd() * Math.PI * 2, r: Math.sqrt(rnd()) * 0.85, size: 0.02 + rnd() * 0.035, ph: rnd() * 6 }));
      st.bumps = Array.from({ length: 46 }, () => ({ a: rnd() * Math.PI * 2, r: Math.sqrt(rnd()) * 0.9, size: 0.01 + rnd() * 0.022 }));
    }
    st.snow = Array.from({ length: 45 }, () => ({ x: rnd() * w, y: rnd() * h, r: 0.4 + rnd() * 1.3, v: 4 + rnd() * 10 }));
    if (st.x < 0) { st.x = w / 2; st.y = h * 0.42; }
    for (const a of st.arms) for (const p of a.pts) { p.x = st.x; p.y = st.y; }
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    st.t += sec;
    const t = st.t;
    if (st.w !== w || st.h !== h) init(w, h);

    const skin0 = toRgb(o.skinColor), spotC = toRgb(o.spotColor), sucker = toRgb(o.suckerColor);
    const eyeC = toRgb(o.eyeColor), inkC = toRgb(o.inkColor);
    const bgc = toRgb(o.backgroundColor === "transparent" ? "#000000" : o.backgroundColor);
    const S = Math.max(12, (frame.overlay ? 70 : Math.min(w, h) * 0.17) * clamp(o.size, 0.2, 2.5));
    const Lt = S * 2.5 * clamp(o.tentacleLength, 0.3, 2);
    const seg = Lt / N;

    // ---- behaviour ----
    const p = readPointer(pointer.current, canvasEl.current);
    const cur = p.inside && o.followCursor;
    const dCur = Math.hypot(p.x - st.x, p.y - st.y);
    st.excite += ((cur && dCur < Lt * 1.3 ? 1 : 0) - st.excite) * Math.min(1, sec * 2);

    if (o.interactive && p.taps.length) {
      const tp = p.taps[p.taps.length - 1];
      const ax = st.x - tp.x, ay = st.y - tp.y, ad = Math.hypot(ax, ay) || 1;
      st.vx += (ax / ad) * 650; st.vy += (ay / ad) * 650;
      st.pulse = 1; st.pale = 1; st.jetIn = 1.2;
      st.inkFor = 0.4; st.inkDir = Math.atan2(-ay, -ax); // ink streams back toward the threat
      for (const a of st.arms) a.anchor = null;
    }
    st.pale *= Math.exp(-sec * 1.3);

    // where to be: a little way off the cursor so the arms can reach it, else a slow drift
    let gx: number, gy: number;
    if (cur) {
      const d = dCur || 1;
      gx = p.x + ((st.x - p.x) / d) * Lt * 0.75; gy = p.y + ((st.y - p.y) / d) * Lt * 0.75;
    } else {
      gx = w * (0.5 + 0.18 * Math.sin(t * 0.13)); gy = h * (0.42 + 0.1 * Math.sin(t * 0.21 + 1));
    }
    gx = clamp(gx, S, w - S); gy = clamp(gy, S * 1.2, h - S * 0.5);
    st.jetIn -= sec;
    const far = Math.hypot(gx - st.x, gy - st.y);
    if (far > S * 1.1 && st.jetIn <= 0) { // jet pulse
      const imp = Math.min(far * 2.4, 520);
      st.vx += ((gx - st.x) / far) * imp; st.vy += ((gy - st.y) / far) * imp;
      st.pulse = 1; st.jetIn = 0.8 + Math.random() * 0.4;
    }
    st.vx += (gx - st.x) * 0.4 * sec; st.vy += (gy - st.y) * 0.4 * sec;
    for (const a of st.arms) if (a.anchor) { // anchored arms pull the body toward their grip
      const ax = a.anchor.x - st.x, ay = a.anchor.y - st.y, ad = Math.hypot(ax, ay);
      if (ad > Lt * 0.6) { st.vx += (ax / ad) * (ad - Lt * 0.6) * 2 * sec; st.vy += (ay / ad) * (ad - Lt * 0.6) * 2 * sec; }
    }
    const drag = Math.exp(-sec * 1.8);
    st.vx *= drag; st.vy *= drag;
    st.x += st.vx * sec; st.y += st.vy * sec + Math.sin(t * 0.9) * 4 * sec;
    // the walls of the tank: stay on screen, bleeding off speed at the edges
    const lo = { x: S * 0.7, y: S * 1.3 }, hi = { x: w - S * 0.7, y: h - S * 0.4 };
    if (st.x < lo.x || st.x > hi.x) { st.x = clamp(st.x, lo.x, hi.x); st.vx *= -0.3; }
    if (st.y < lo.y || st.y > hi.y) { st.y = clamp(st.y, lo.y, hi.y); st.vy *= -0.3; }
    st.pulse *= Math.exp(-sec * 2.5);

    // mantle leads when swimming fast, floats upright otherwise
    const v = Math.hypot(st.vx, st.vy);
    const angT = v > 70 ? Math.atan2(st.vy, st.vx) : -Math.PI / 2 + Math.sin(t * 0.5) * 0.12;
    let da = angT - st.ang;
    da = Math.atan2(Math.sin(da), Math.cos(da));
    st.ang += da * Math.min(1, sec * 3);
    const ux = Math.cos(st.ang), uy = Math.sin(st.ang); // toward the mantle tip
    const qx = -uy, qy = ux;                              // across the body
    const stream = clamp((v - 60) / 300, 0, 1);
    const breath = Math.sin(t * 1.3);

    // ---- arms ----
    const tips: { i: number; d: number }[] = [];
    if (cur && dCur < Lt * 1.1) {
      st.arms.forEach((a, i) => tips.push({ i, d: Math.hypot(a.pts[N].x - p.x, a.pts[N].y - p.y) }));
      tips.sort((a, b) => a.d - b.d);
    }
    const reachers = new Set(tips.slice(0, 2).map((q) => q.i));
    const follow = 1 - Math.exp(-sec * 12);

    st.arms.forEach((a, i) => {
      // each arm has moods of its own: coil, uncoil, wander up to explore
      a.nextMood -= sec;
      if (a.nextMood <= 0) {
        a.curlTo = Math.sign(a.spread || 1) * (0.4 + Math.random() * 3) * (Math.random() < 0.2 ? -1 : 1);
        a.liftTo = Math.random() < 0.18 ? -Math.sign(a.spread || 1) * (0.6 + Math.random() * 0.8) : 0;
        a.nextMood = 2 + Math.random() * 4;
      }
      a.curl += (a.curlTo - a.curl) * Math.min(1, sec * 0.7);
      a.lift += (a.liftTo - a.lift) * Math.min(1, sec * 0.9);

      const root = { x: st.x - ux * S * 0.15 + qx * a.spread * S * 0.3, y: st.y - uy * S * 0.15 + qy * a.spread * S * 0.3 };
      // wave pose: fanned out from the web, rippling, tips curled; streamlined while jetting
      let ang = Math.atan2(-uy, -ux) + a.spread * (1.4 - stream * 1.2) + a.lift * (1 - stream);
      const P = a.pose;
      P[0].x = root.x; P[0].y = root.y;
      for (let j = 0; j < N; j++) {
        const f = j / N;
        ang += (Math.sin(t * 1.5 + a.phase - j * 0.32) * 0.12 * (1 - stream * 0.7) + a.curl * Math.pow(f, 2.6) * 0.2 * (1 - stream)) * (0.3 + f);
        P[j + 1].x = P[j].x + Math.cos(ang) * seg;
        P[j + 1].y = P[j].y + Math.sin(ang) * seg;
      }

      // grab: a tip near a solid's edge latches on; stretched too far, it lets go
      if (o.collide) {
        if (a.anchor) {
          const still = frame.solids.find((q) => q.id === a.anchor!.id);
          if (!still || Math.hypot(a.anchor.x - root.x, a.anchor.y - root.y) > Lt * 1.02 || Math.random() < 0.06 * sec) a.anchor = null;
        } else if (!reachers.has(i) && Math.random() < 1.5 * sec) {
          let best: (Pt & { id: number }) | null = null, bd = Lt * 0.9;
          for (const q of frame.solids) {
            const e = edgePoint(q, P[N]);
            const d = Math.hypot(e.x - root.x, e.y - root.y);
            if (d < bd) { bd = d; best = { ...e, id: q.id }; }
          }
          a.anchor = best;
        }
      } else a.anchor = null;

      let target: Pt | null = null;
      if (reachers.has(i)) { // coil around the cursor
        const r = S * 0.18;
        target = { x: p.x + Math.cos(t * 3 + i) * r, y: p.y + Math.sin(t * 3 + i) * r };
      } else if (a.anchor) target = a.anchor;
      a.reach += ((target ? 1 : 0) - a.reach) * Math.min(1, sec * 4);
      if (target) {
        for (let j = 0; j <= N; j++) { a.tmp[j].x = P[j].x; a.tmp[j].y = P[j].y; }
        fabrik(a.tmp, root, target, seg, 3);
        for (let j = 0; j <= N; j++) {
          P[j].x += (a.tmp[j].x - P[j].x) * a.reach;
          P[j].y += (a.tmp[j].y - P[j].y) * a.reach;
        }
      }
      // soft flesh: ease toward the new shape, root pinned
      a.pts[0].x = root.x; a.pts[0].y = root.y;
      for (let j = 1; j <= N; j++) {
        a.pts[j].x += (P[j].x - a.pts[j].x) * follow;
        a.pts[j].y += (P[j].y - a.pts[j].y) * follow;
      }
    });

    // ---- scene ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const scene = !frame.overlay && o.backgroundColor !== "transparent";
    if (scene) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgb(${mix(bgc, "60,150,180", 0.16)})`);
      g.addColorStop(1, `rgb(${mix(bgc, "0,0,0", 0.35)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 5; i++) { // light shafts from the surface
        const x = w * (0.1 + i * 0.2) + Math.sin(t * 0.25 + i * 1.7) * w * 0.04;
        const bw = w * (0.05 + (i % 2) * 0.04);
        const rg = ctx.createLinearGradient(0, 0, 0, h * 0.85);
        rg.addColorStop(0, `rgba(160,220,240,${0.06 + 0.02 * Math.sin(t * 0.8 + i)})`);
        rg.addColorStop(1, "rgba(160,220,240,0)");
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.moveTo(x - bw * 0.3, 0); ctx.lineTo(x + bw * 0.3, 0); ctx.lineTo(x + bw * 1.6, h * 0.85); ctx.lineTo(x - bw * 0.4, h * 0.85); ctx.closePath(); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(210,230,240,0.35)"; // marine snow
      for (const q of st.snow) {
        q.y += q.v * sec; q.x += Math.sin(t * 0.5 + q.r * 9) * 3 * sec;
        if (q.y > h + 2) { q.y = -2; q.x = Math.random() * w; }
        ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    // skin: excitement flushes it, a scare blanches it
    const skin = mix(mix(skin0, mix(skin0, "60,10,10", 0.35), st.excite * 0.5), "245,240,235", st.pale * 0.7);
    const shade = mix(skin, "0,0,0", 0.38);
    const belly = mix(skin, sucker, 0.45);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // ---- webbing between neighbouring arms, under everything ----
    const bySpread = st.arms.map((_, i) => i).sort((a, b) => st.arms[a].spread - st.arms[b].spread);
    const kw = Math.round(N * 0.26);
    ctx.fillStyle = `rgb(${mix(skin, shade, 0.45)})`;
    for (let n = 0; n < bySpread.length - 1; n++) {
      const A = st.arms[bySpread[n]].pts, B = st.arms[bySpread[n + 1]].pts;
      const c = { x: (A[kw >> 1].x + B[kw >> 1].x) / 2, y: (A[kw >> 1].y + B[kw >> 1].y) / 2 };
      ctx.beginPath();
      smooth(ctx, A.slice(0, kw + 1), true);
      ctx.quadraticCurveTo(c.x, c.y, B[kw].x, B[kw].y); // scalloped web edge
      smooth(ctx, B.slice(0, kw + 1).reverse(), false);
      ctx.closePath();
      ctx.fill();
    }

    // ---- arms, back ones first ----
    const order = st.arms.map((_, i) => i).sort((a, b) => (a % 2) - (b % 2) || a - b).reverse();
    for (const i of order) {
      const P = st.arms[i].pts;
      const back = i % 2 === 1;
      const L: Pt[] = [], R: Pt[] = [], Mid: Pt[] = [], nrm: Pt[] = [];
      for (let j = 0; j <= N; j++) {
        const pa = P[Math.max(0, j - 1)], pb = P[Math.min(N, j + 1)];
        const tx = pb.x - pa.x, ty = pb.y - pa.y, tl = Math.hypot(tx, ty) || 1;
        const nx = -ty / tl, ny = tx / tl, r = armR(S, j);
        nrm.push({ x: nx, y: ny });
        L.push({ x: P[j].x + nx * r, y: P[j].y + ny * r });
        R.push({ x: P[j].x - nx * r, y: P[j].y - ny * r });
        Mid.push({ x: P[j].x - nx * r * 0.1, y: P[j].y - ny * r * 0.1 });
      }
      const top = back ? mix(skin, "0,0,0", 0.3) : skin;
      const ag = ctx.createLinearGradient(P[0].x, P[0].y, P[N].x, P[N].y);
      ag.addColorStop(0, `rgb(${mix(top, shade, 0.4)})`);
      ag.addColorStop(0.45, `rgb(${top})`);
      ag.addColorStop(1, `rgb(${mix(top, "255,225,215", 0.18)})`);
      ctx.fillStyle = ag;
      ctx.beginPath();
      smooth(ctx, L, true);
      smooth(ctx, R.slice().reverse(), false);
      ctx.closePath();
      ctx.fill();
      // pale oral surface along the underside
      ctx.fillStyle = `rgba(${back ? mix(belly, "0,0,0", 0.3) : belly},0.75)`;
      ctx.beginPath();
      smooth(ctx, Mid.slice(0, N - 1), true);
      smooth(ctx, R.slice(0, N - 1).reverse(), false);
      ctx.closePath();
      ctx.fill();
      // sheen riding the top of the arm
      for (let j = 1; j < N - 2; j++) {
        const r = armR(S, j);
        const a0 = { x: P[j].x + nrm[j].x * r * 0.55, y: P[j].y + nrm[j].y * r * 0.55 };
        const a1 = { x: P[j + 1].x + nrm[j + 1].x * r * 0.55, y: P[j + 1].y + nrm[j + 1].y * r * 0.55 };
        ctx.strokeStyle = `rgba(${mix(top, "255,255,255", 0.45)},${0.22 * (1 - j / N)})`;
        ctx.lineWidth = Math.max(0.5, r * 0.28);
        ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(a1.x, a1.y); ctx.stroke();
      }
      // two staggered rows of cupped suckers
      const sk = back ? mix(sucker, "0,0,0", 0.3) : sucker;
      for (let j = 2; j < N - 1; j++) {
        const r = armR(S, j);
        const row = j % 2 ? 0.6 : 0.3;
        const sr = r * (j % 2 ? 0.34 : 0.28);
        if (sr < 0.6) continue;
        const cx = P[j].x - nrm[j].x * r * row, cy = P[j].y - nrm[j].y * r * row;
        ctx.fillStyle = `rgb(${sk})`;
        ctx.beginPath(); ctx.arc(cx, cy, sr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${mix(sk, shade, 0.55)},0.85)`;
        ctx.beginPath(); ctx.arc(cx - nrm[j].x * sr * 0.12, cy - nrm[j].y * sr * 0.12, sr * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath(); ctx.arc(cx + nrm[j].x * sr * 0.4, cy + nrm[j].y * sr * 0.4, sr * 0.22, 0, Math.PI * 2); ctx.fill();
      }
    }

    // ---- head and mantle ----
    const pulse = st.pulse;
    const R0 = st.ang + Math.PI / 2;
    const lxl = -Math.sin(R0), lyl = -Math.cos(R0); // world "up" (toward the surface light) in local coords
    ctx.save();
    ctx.translate(st.x, st.y);
    ctx.rotate(R0); // local -y = toward the mantle tip
    const wf = (1 - 0.16 * pulse) * (1 + 0.035 * breath), lf = 1 + 0.1 * pulse;
    const mantle = () => {
      ctx.beginPath();
      ctx.moveTo(-S * 0.3, -S * 0.16);
      ctx.bezierCurveTo(-S * 0.6 * wf, -S * 0.36, -S * 0.56 * wf, -S * 1.24 * lf, 0, -S * 1.22 * lf);
      ctx.bezierCurveTo(S * 0.56 * wf, -S * 1.24 * lf, S * 0.6 * wf, -S * 0.36, S * 0.3, -S * 0.16);
      ctx.closePath();
    };
    // head
    const hg = ctx.createRadialGradient(lxl * S * 0.2, -S * 0.05 + lyl * S * 0.15, S * 0.04, 0, 0, S * 0.5);
    hg.addColorStop(0, `rgb(${mix(skin, "255,255,255", 0.15)})`);
    hg.addColorStop(1, `rgb(${shade})`);
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.ellipse(0, -S * 0.02, S * 0.42, S * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    // siphon: a short funnel on the side of the head that breathes and swells on every jet
    const sl = S * 0.1 * (1 + 0.6 * pulse + 0.12 * breath);
    ctx.save();
    ctx.translate(S * 0.34, S * 0.06);
    ctx.rotate(0.5);
    ctx.fillStyle = `rgb(${mix(skin, shade, 0.45)})`;
    ctx.beginPath(); ctx.ellipse(sl * 0.5, 0, sl * 0.75, S * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgb(${mix(shade, "0,0,0", 0.5)})`;
    ctx.beginPath(); ctx.ellipse(sl * 1.15, 0, S * 0.015, S * 0.035, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // mantle
    mantle();
    const mg = ctx.createRadialGradient(lxl * S * 0.32, -S * 0.66 + lyl * S * 0.32, S * 0.05, 0, -S * 0.6, S * 0.85);
    mg.addColorStop(0, `rgb(${mix(skin, "255,255,255", 0.25)})`);
    mg.addColorStop(0.55, `rgb(${skin})`);
    mg.addColorStop(1, `rgb(${shade})`);
    ctx.fillStyle = mg;
    ctx.fill();
    ctx.save();
    ctx.clip();
    // papillae: little bumps catching the light
    for (const b of st.bumps) {
      const cx = Math.cos(b.a) * b.r * S * 0.48 * wf, cy = -S * 0.66 * lf + Math.sin(b.a) * b.r * S * 0.52 * lf;
      const r = S * b.size;
      ctx.fillStyle = `rgba(${shade},0.35)`;
      ctx.beginPath(); ctx.arc(cx - lxl * r * 0.4, cy - lyl * r * 0.4, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${mix(skin, "255,255,255", 0.35)},0.5)`;
      ctx.beginPath(); ctx.arc(cx + lxl * r * 0.3, cy + lyl * r * 0.3, r * 0.7, 0, Math.PI * 2); ctx.fill();
    }
    // chromatophore rings, flaring with excitement
    const flare = 0.3 + 0.7 * Math.max(st.excite, st.pale * 0.5);
    for (const sp of st.spots) {
      const cx = Math.cos(sp.a) * sp.r * S * 0.46 * wf, cy = -S * 0.66 * lf + Math.sin(sp.a) * sp.r * S * 0.5 * lf;
      const a = flare * (0.55 + 0.45 * Math.sin(t * 2.2 + sp.ph));
      ctx.strokeStyle = `rgba(${spotC},${a})`;
      ctx.lineWidth = Math.max(0.5, S * sp.size * 0.4);
      ctx.fillStyle = `rgba(${mix(spotC, skin, 0.55)},${a * 0.4})`;
      ctx.beginPath(); ctx.arc(cx, cy, S * sp.size, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    // "passing clouds": dark bands that sweep down the mantle when excited
    if (st.excite > 0.05) {
      for (let k = 0; k < 2; k++) {
        const ph = ((t * 0.9 + k * 0.5) % 1);
        const y = -S * 1.25 * lf + ph * S * 1.15;
        const cg = ctx.createLinearGradient(0, y - S * 0.16, 0, y + S * 0.16);
        cg.addColorStop(0, `rgba(${shade},0)`);
        cg.addColorStop(0.5, `rgba(${mix(shade, "20,0,0", 0.4)},${0.38 * st.excite})`);
        cg.addColorStop(1, `rgba(${shade},0)`);
        ctx.fillStyle = cg;
        ctx.fillRect(-S, y - S * 0.16, S * 2, S * 0.32);
      }
    }
    ctx.restore();
    // folds where the mantle meets the head
    ctx.strokeStyle = `rgba(${shade},0.55)`;
    ctx.lineWidth = S * 0.022;
    ctx.beginPath(); ctx.ellipse(0, -S * 0.14, S * 0.34, S * 0.09, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();

    // eyes on raised turrets with a ridged lid; the bar pupil stays level in the world
    st.nextBlink -= sec;
    if (st.nextBlink <= 0) { st.blinkAt = t; st.nextBlink = 4 + Math.random() * 5; }
    const bt = t - st.blinkAt;
    const lid = bt < 0.12 ? bt / 0.12 : bt < 0.32 ? 1 - (bt - 0.12) / 0.2 : 0;
    for (const side of [-1, 1]) {
      const ex = side * S * 0.33, ey = -S * 0.1, er = S * 0.13;
      const tg = ctx.createRadialGradient(ex + lxl * er * 0.5, ey + lyl * er * 0.5, er * 0.3, ex, ey, er * 1.5);
      tg.addColorStop(0, `rgb(${mix(skin, "255,255,255", 0.15)})`);
      tg.addColorStop(1, `rgb(${mix(skin, shade, 0.4)})`);
      ctx.fillStyle = tg;
      ctx.beginPath(); ctx.arc(ex, ey, er * 1.45, 0, Math.PI * 2); ctx.fill();
      // a small horn papilla above the eye
      ctx.fillStyle = `rgb(${mix(skin, shade, 0.2)})`;
      ctx.beginPath(); ctx.moveTo(ex - side * er * 0.5, ey - er * 1.25); ctx.lineTo(ex + side * er * 0.15, ey - er * 2); ctx.lineTo(ex + side * er * 0.55, ey - er * 1.2); ctx.closePath(); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.clip();
      const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, er);
      eg.addColorStop(0, `rgb(${mix(eyeC, "255,255,255", 0.4)})`);
      eg.addColorStop(0.75, `rgb(${eyeC})`);
      eg.addColorStop(1, `rgb(${mix(eyeC, "0,0,0", 0.4)})`);
      ctx.fillStyle = eg;
      ctx.fillRect(ex - er, ey - er, er * 2, er * 2);
      ctx.strokeStyle = `rgba(${mix(eyeC, "0,0,0", 0.4)},0.35)`; // iris flecks
      ctx.lineWidth = Math.max(0.4, er * 0.04);
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(ex + Math.cos(a) * er * 0.45, ey + Math.sin(a) * er * 0.45); ctx.lineTo(ex + Math.cos(a) * er * 0.92, ey + Math.sin(a) * er * 0.92); ctx.stroke();
      }
      // dumbbell bar pupil, held level against gravity; it opens wide when excited or scared
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(-R0);
      const ph = er * (0.3 + 0.4 * Math.max(st.excite * 0.6, st.pale));
      ctx.fillStyle = "rgb(8,6,8)";
      ctx.beginPath(); ctx.ellipse(0, 0, er * 0.42, ph * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      for (const e of [-1, 1]) { ctx.beginPath(); ctx.arc(e * er * 0.36, 0, ph * 0.6, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.beginPath(); ctx.arc(ex + lxl * er * 0.4 - side * er * 0.15, ey + lyl * er * 0.4, er * 0.16, 0, Math.PI * 2); ctx.fill();
      if (lid > 0) { // the lid closes from above
        ctx.fillStyle = `rgb(${mix(skin, shade, 0.3)})`;
        ctx.fillRect(ex - er, ey - er, er * 2, er * 2 * lid);
      }
      ctx.restore();
      ctx.strokeStyle = `rgba(${shade},0.7)`; // ridged lid
      ctx.lineWidth = Math.max(0.6, er * 0.1);
      ctx.beginPath(); ctx.arc(ex, ey, er * 1.12, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    }
    ctx.restore();

    // ---- ink: a stream from the siphon that billows into a drifting cloud ----
    const sx = st.x + Math.cos(R0) * S * 0.45 - Math.sin(R0) * S * 0.14, sy = st.y + Math.sin(R0) * S * 0.45 + Math.cos(R0) * S * 0.14;
    if (st.inkFor > 0) {
      st.inkFor -= sec;
      for (let k = 0; k < 3 && st.ink.length < 140; k++) {
        const sp = 140 + Math.random() * 160, a = st.inkDir + (Math.random() - 0.5) * 0.7;
        st.ink.push({ x: sx, y: sy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: S * (0.06 + Math.random() * 0.08), life: 1, dark: 0.6 + Math.random() * 0.4 });
      }
    }
    for (let i = st.ink.length - 1; i >= 0; i--) {
      const q = st.ink[i];
      q.life -= sec / 5;
      if (q.life <= 0) { st.ink.splice(i, 1); continue; }
      const d = Math.exp(-sec * 2.6);
      q.vx *= d; q.vy *= d;
      q.x += q.vx * sec + Math.sin(t * 0.7 + i) * 4 * sec; q.y += q.vy * sec - 4 * sec;
      q.r += S * (0.05 + 0.25 * (1 - q.life)) * sec * 2;
      const ig = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r);
      ig.addColorStop(0, `rgba(${inkC},${0.6 * q.life * q.dark})`);
      ig.addColorStop(0.55, `rgba(${inkC},${0.32 * q.life * q.dark})`);
      ig.addColorStop(1, `rgba(${inkC},0)`);
      ctx.fillStyle = ig;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  const setup = useCanvasSetup({ overlay: options.overlay, collide: options.collide, onResize: init, onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
