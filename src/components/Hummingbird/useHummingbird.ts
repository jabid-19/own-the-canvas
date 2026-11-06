import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { hexToRgbString } from "../../utils/color";
import type { Solid } from "../../runtime/physics";

export interface UseHummingbirdOptions {
  bodyColor: string;
  throatColor: string;
  bellyColor: string;
  flowerColor: string;
  backgroundColor: string;
  birdCount: number;
  size: number;
  speed: number;
  interactive: boolean;
  showFlowers: boolean;
  overlay: boolean;
  collide: boolean;
}

/** Somewhere a bird can feed: the beak tip goes to (x, y) while the bird faces `face`. */
export interface Nectar { x: number; y: number; face: 1 | -1; key: string }

interface Blossom { t: number; dir: 1 | -1; droop: number; bud: boolean }
interface Flower { bx: number; nx: number; ny: number; dir: 1 | -1; phase: number; bob: number; blooms: Blossom[] }
interface Bird {
  x: number; y: number; vx: number; vy: number;
  facing: number; tilt: number; seed: number;
  mode: "dart" | "hover" | "flee" | "chase";
  timer: number;
  aim: Nectar | null;
  tx: number; ty: number;
  settled: boolean;
  backout: number;   // seconds of flying backwards out of a flower
  tailSpread: number;
  rival: number;     // index of the bird being chased
}
interface Pollen { x: number; y: number; vx: number; vy: number; life: number }

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const toRgb = (c: string) => (c.startsWith("#") ? hexToRgbString(c) : "255,255,255");
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Feeding spots beside each solid's left and right edge, beak touching the edge. */
export function solidNectar(solids: readonly Solid[]): Nectar[] {
  const out: Nectar[] = [];
  for (const s of solids) {
    out.push({ x: s.x - 2, y: s.y + s.h / 2, face: 1, key: `s${s.id}L` });
    out.push({ x: s.x + s.w + 2, y: s.y + s.h / 2, face: -1, key: `s${s.id}R` });
  }
  return out;
}

const FEED_TILT = -0.28; // nearly level while the beak is in a flower
const BEAK = 1.0;        // beak tip, in body lengths ahead of the body centre

/** One wing in wing space: root at the origin, a long swept blade along +x. */
function wingPath(ctx: CanvasRenderingContext2D, len: number) {
  ctx.beginPath();
  ctx.moveTo(0, -0.03);
  ctx.bezierCurveTo(0.2 * len, -0.075, 0.5 * len, -0.08, 0.66 * len, -0.03);
  ctx.quadraticCurveTo(0.7 * len, 0.01, 0.62 * len, 0.04);
  for (let k = 0; k < 4; k++) { // trailing edge: the tips of the primaries
    const x = 0.62 * len - (k + 1) * 0.12 * len;
    ctx.quadraticCurveTo(x + 0.06 * len, 0.07, x, 0.05 + k * 0.004);
  }
  ctx.lineTo(0, 0.035);
  ctx.closePath();
}

/**
 * Hummingbirds in a dusk garden. Wings beat too fast to see, so each stroke is drawn as a
 * motion blur, densest at the ends where the wing turns, with a faint strobe of the wing
 * itself. A bird darts between trumpet flowers, stops dead, fans its tail to brake, sips
 * with a pumping motion and backs straight out before darting away; pollen puffs where it
 * feeds and its gorget flashes as it turns. A slow cursor draws one over to inspect it, a
 * fast one scares it off, and rival birds chase each other away from the flowers. With
 * `collide`, `data-otc-solid` elements become flowers, and the hovered one is visited now.
 */
export function useHummingbird(options: UseHummingbirdOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({
    t: 0, birds: [] as Bird[], flowers: [] as Flower[], pollen: [] as Pollen[],
    bokeh: [] as { x: number; y: number; r: number; a: number; warm: boolean }[], w: 0, h: 0,
  });

  function onResize(w: number, h: number) {
    const st = s.current;
    st.w = w; st.h = h;
    let seed = 13;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const n = clamp(Math.round(w / 190), 2, 6);
    st.flowers = Array.from({ length: n }, (_, i) => {
      const bx = ((i + 0.5) / n) * w + (rnd() - 0.5) * (w / n) * 0.4;
      const dir: 1 | -1 = i % 2 ? -1 : 1;
      const blooms: Blossom[] = [{ t: 1, dir, droop: 0.25, bud: false }];
      if (rnd() < 0.7) blooms.push({ t: 0.72, dir: (-dir) as 1 | -1, droop: 0.5, bud: rnd() < 0.5 });
      if (rnd() < 0.5) blooms.push({ t: 0.86, dir, droop: 0.9, bud: true });
      return { bx, nx: bx - dir * w * 0.02, ny: h * (0.3 + rnd() * 0.32), dir, phase: rnd() * 6, bob: 0, blooms };
    });
    st.bokeh = Array.from({ length: 18 }, () => ({ x: rnd() * w, y: rnd() * h, r: (14 + rnd() * 50) * Math.max(0.6, Math.min(w, h) / 420), a: 0.03 + rnd() * 0.06, warm: rnd() < 0.45 }));
    for (const b of st.birds) { b.x = clamp(b.x, 0, w); b.y = clamp(b.y, 0, h); }
  }

  function makeBird(w: number, h: number): Bird {
    return {
      x: w * (0.2 + Math.random() * 0.6), y: h * (0.25 + Math.random() * 0.4), vx: 0, vy: 0, facing: 1, tilt: -0.9,
      seed: Math.random() * 10, mode: "hover", timer: 0.4 + Math.random(), aim: null, tx: 0, ty: 0,
      settled: false, backout: 0, tailSpread: 0.5, rival: -1,
    };
  }

  function drawFlowers(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, sec: number, S: number, flowerC: string, bgc: string, nectar: Nectar[]) {
    const st = s.current;
    const F = S * 0.85; // trumpet length
    const leaf = mix("58,112,64", bgc, 0.25);
    st.flowers.forEach((f, fi) => {
      f.bob *= Math.exp(-sec * 3);
      const sway = Math.sin(t * 0.7 + f.phase) * 0.05 + f.bob * Math.sin(t * 9) * 0.05;
      const nx = f.nx + sway * h * 0.15, ny = f.ny;
      const c1 = { x: f.bx + f.dir * w * 0.03, y: (h + ny) / 2 };
      const stemAt = (k: number) => ({ // point on the quadratic stem
        x: (1 - k) * (1 - k) * f.bx + 2 * (1 - k) * k * c1.x + k * k * nx,
        y: (1 - k) * (1 - k) * (h + 4) + 2 * (1 - k) * k * c1.y + k * k * ny,
      });
      // stem, thicker at the base
      ctx.lineCap = "round";
      for (const [lw, a] of [[S * 0.07, 1], [S * 0.03, 0.5]] as const) {
        ctx.strokeStyle = a === 1 ? `rgb(${leaf})` : `rgba(${mix(leaf, "255,255,210", 0.35)},0.5)`;
        ctx.lineWidth = Math.max(1, lw);
        ctx.beginPath(); ctx.moveTo(f.bx, h + 4); ctx.quadraticCurveTo(c1.x, c1.y, nx, ny); ctx.stroke();
      }
      // leaves: pointed, with a midrib
      for (const [k, side] of [[0.3, 1], [0.5, -1], [0.68, 1]] as const) {
        const p = stemAt(k);
        const la = (side * 0.9 - 0.5 + sway) * (f.dir > 0 ? 1 : -1) - Math.PI / 2 + side * 1.2;
        const ll = S * 0.55;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(la);
        const lg = ctx.createLinearGradient(0, -ll * 0.15, 0, ll * 0.15);
        lg.addColorStop(0, `rgb(${mix(leaf, "200,230,150", 0.2)})`);
        lg.addColorStop(1, `rgb(${mix(leaf, "0,0,0", 0.3)})`);
        ctx.fillStyle = lg;
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(ll * 0.45, -ll * 0.24, ll, 0);
        ctx.quadraticCurveTo(ll * 0.45, ll * 0.22, 0, 0);
        ctx.fill();
        ctx.strokeStyle = `rgba(${mix(leaf, "255,255,210", 0.4)},0.45)`;
        ctx.lineWidth = Math.max(0.5, S * 0.012);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ll * 0.9, 0); ctx.stroke();
        ctx.restore();
      }
      // blossoms hang off short pedicels near the top of the stem
      f.blooms.forEach((bl, bi) => {
        const base = bl.t >= 1 ? { x: nx, y: ny } : stemAt(bl.t);
        const a = (bl.dir > 0 ? 0 : Math.PI) + bl.dir * bl.droop * 0.6 + sway;
        const ux = Math.cos(a), uy = Math.sin(a), vx = -uy, vy = ux;
        const len = bl.bud ? F * 0.45 : F;
        const mx = base.x + ux * len, my = base.y + uy * len;
        const bend = bl.dir * len * 0.08; // tube curves gently
        // tube: narrow at the calyx, flaring toward the mouth, lighter on top
        if (bl.bud) {
          const bg2 = ctx.createLinearGradient(base.x - vx * len * 0.2, base.y - vy * len * 0.2, base.x + vx * len * 0.2, base.y + vy * len * 0.2);
          bg2.addColorStop(0, `rgb(${mix(flowerC, "0,0,0", 0.3)})`);
          bg2.addColorStop(0.5, `rgb(${mix(flowerC, "255,210,120", 0.2)})`);
          bg2.addColorStop(1, `rgb(${mix(flowerC, "0,0,0", 0.2)})`);
          ctx.fillStyle = bg2;
          ctx.save(); ctx.translate(base.x + ux * len * 0.55, base.y + uy * len * 0.55); ctx.rotate(a);
          ctx.beginPath(); ctx.moveTo(-len * 0.55, 0);
          ctx.bezierCurveTo(-len * 0.2, -len * 0.2, len * 0.35, -len * 0.18, len * 0.5, 0);
          ctx.bezierCurveTo(len * 0.35, len * 0.18, -len * 0.2, len * 0.2, -len * 0.55, 0);
          ctx.fill(); ctx.restore();
          ctx.fillStyle = `rgb(${mix(leaf, "0,0,0", 0.1)})`;
          ctx.beginPath(); ctx.ellipse(base.x + ux * len * 0.08, base.y + uy * len * 0.08, len * 0.14, len * 0.09, a, 0, Math.PI * 2); ctx.fill();
          return;
        }
        const tg = ctx.createLinearGradient(base.x - vx * len * 0.15, base.y - vy * len * 0.15, base.x + vx * len * 0.15, base.y + vy * len * 0.15);
        tg.addColorStop(0, `rgb(${mix(flowerC, "0,0,0", 0.3)})`);
        tg.addColorStop(0.5, `rgb(${mix(flowerC, "255,210,120", bl.bud ? 0.1 : 0.25)})`);
        tg.addColorStop(1, `rgb(${mix(flowerC, "0,0,0", 0.15)})`);
        ctx.fillStyle = tg;
        const mw = bl.bud ? 0.07 : 0.15;
        ctx.beginPath();
        ctx.moveTo(base.x + vx * len * 0.04, base.y + vy * len * 0.04);
        ctx.quadraticCurveTo(base.x + ux * len * 0.6 + vx * (len * 0.05 + bend), base.y + uy * len * 0.6 + vy * (len * 0.05 + bend), mx + vx * len * mw, my + vy * len * mw);
        ctx.lineTo(mx - vx * len * mw, my - vy * len * mw);
        ctx.quadraticCurveTo(base.x + ux * len * 0.6 - vx * (len * 0.05 - bend), base.y + uy * len * 0.6 - vy * (len * 0.05 - bend), base.x - vx * len * 0.04, base.y - vy * len * 0.04);
        ctx.closePath();
        ctx.fill();
        // green calyx
        ctx.fillStyle = `rgb(${mix(leaf, "0,0,0", 0.1)})`;
        ctx.beginPath(); ctx.ellipse(base.x + ux * len * 0.06, base.y + uy * len * 0.06, len * 0.09, len * 0.05, a, 0, Math.PI * 2); ctx.fill();
        if (bl.bud) return;
        // veins along the tube
        ctx.strokeStyle = `rgba(${mix(flowerC, "60,0,10", 0.5)},0.35)`;
        ctx.lineWidth = Math.max(0.4, S * 0.008);
        for (const off of [-0.05, 0, 0.05]) {
          ctx.beginPath();
          ctx.moveTo(base.x + ux * len * 0.15 + vx * len * off * 0.5, base.y + uy * len * 0.15 + vy * len * off * 0.5);
          ctx.lineTo(mx - ux * len * 0.05 + vx * len * off * 1.6, my - uy * len * 0.05 + vy * len * off * 1.6);
          ctx.stroke();
        }
        // five flared lobes around a dark throat
        for (let k = 0; k < 5; k++) {
          const pa = (k / 4 - 0.5) * 2.4;
          const px = mx + vx * Math.sin(pa) * len * 0.2 + ux * Math.cos(pa) * len * 0.04;
          const py = my + vy * Math.sin(pa) * len * 0.2 + uy * Math.cos(pa) * len * 0.04;
          const pg = ctx.createRadialGradient(mx, my, 0, px, py, len * 0.14);
          pg.addColorStop(0, `rgb(${mix(flowerC, "255,220,140", 0.3)})`);
          pg.addColorStop(1, `rgb(${mix(flowerC, "255,255,255", 0.05 + (k % 2) * 0.06)})`);
          ctx.fillStyle = pg;
          ctx.save(); ctx.translate(px, py); ctx.rotate(a + pa * 0.65);
          ctx.beginPath(); ctx.ellipse(0, 0, len * 0.085, len * 0.125, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = `rgba(${mix(flowerC, "40,0,10", 0.65)},0.85)`;
        ctx.beginPath(); ctx.ellipse(mx, my, len * 0.05, len * 0.1, a, 0, Math.PI * 2); ctx.fill();
        // stamens tipped with pollen
        for (const off of [-0.03, 0.03]) {
          const ex = mx + ux * len * 0.24 + vx * len * off, ey = my + uy * len * 0.24 + vy * len * off;
          ctx.strokeStyle = "rgba(255,236,190,0.85)";
          ctx.lineWidth = Math.max(0.5, S * 0.012);
          ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.fillStyle = "rgb(255,214,90)";
          ctx.beginPath(); ctx.arc(ex, ey, Math.max(0.8, S * 0.018), 0, Math.PI * 2); ctx.fill();
        }
        nectar.push({ x: mx + ux * len * 0.02, y: my + uy * len * 0.02, face: bl.dir > 0 ? -1 : 1, key: `f${fi}.${bi}` });
      });
    });
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;
    if (st.w !== w || st.h !== h) onResize(w, h);

    const body = toRgb(o.bodyColor), throat = toRgb(o.throatColor), bellyC = toRgb(o.bellyColor), flowerC = toRgb(o.flowerColor);
    const bgc = toRgb(o.backgroundColor === "transparent" ? "#000000" : o.backgroundColor);
    const S = Math.max(16, (frame.overlay ? 50 : Math.min(w, h) * 0.2) * clamp(o.size, 0.3, 2.5));

    // ---- scene ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    if (!frame.overlay && o.backgroundColor !== "transparent") {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgb(${mix(bgc, "255,190,120", 0.1)})`);
      g.addColorStop(0.6, `rgb(${bgc})`);
      g.addColorStop(1, `rgb(${mix(bgc, "0,0,0", 0.3)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const b of st.bokeh) {
        const bg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const c = b.warm ? "255,200,130" : "170,230,150";
        bg.addColorStop(0, `rgba(${c},${b.a})`);
        bg.addColorStop(0.7, `rgba(${c},${b.a * 0.6})`);
        bg.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(b.x + Math.sin(t * 0.2 + b.r) * 6, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    const nectar: Nectar[] = [];
    if (o.showFlowers) drawFlowers(ctx, w, h, t, sec, S, flowerC, bgc, nectar);
    if (o.collide) nectar.push(...solidNectar(frame.solids));

    // ---- birds ----
    const n = clamp(Math.round(o.birdCount), 0, 8);
    while (st.birds.length < n) st.birds.push(makeBird(w, h));
    st.birds.length = n;

    const p = readPointer(pointer.current, canvasEl.current);
    const { vx: pvx, vy: pvy } = velocity.current(p, k);
    const pspeed = Math.hypot(pvx, pvy);
    const hovered = o.collide && p.inside ? frame.solids.find((q) => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h) : undefined;
    const beak = S * BEAK;
    const sp = clamp(o.speed, 0.1, 4);

    st.birds.forEach((b, bi) => {
      const wasAim = b.aim, wasSettled = b.settled;
      const curious = o.interactive && p.inside && !hovered && pspeed < 4 && Math.hypot(p.x - b.x, p.y - b.y) < S * 7;
      if (o.interactive && p.inside && pspeed > 14 && Math.hypot(p.x - b.x, p.y - b.y) < S * 4 && b.mode !== "flee") {
        b.mode = "flee"; b.timer = 0.6; b.aim = null;
        const ang = Math.atan2(b.y - p.y, b.x - p.x) + (Math.random() - 0.5);
        b.tx = clamp(b.x + Math.cos(ang) * S * 6, S, w - S); b.ty = clamp(b.y + Math.sin(ang) * S * 6, S, h - S);
      }
      // rivals: now and then one bird drives another off
      if (st.birds.length > 1 && b.mode !== "flee" && b.mode !== "chase" && !curious && Math.random() < 0.06 * sec) {
        const r = st.birds.findIndex((q, qi) => qi !== bi && q.mode !== "flee" && Math.hypot(q.x - b.x, q.y - b.y) < S * 8);
        if (r >= 0) {
          const q = st.birds[r];
          b.mode = "chase"; b.timer = 1.3; b.rival = r; b.aim = null;
          q.mode = "flee"; q.timer = 1.1; q.aim = null;
          const ang = Math.atan2(q.y - b.y, q.x - b.x) + (Math.random() - 0.5) * 0.8;
          q.tx = clamp(q.x + Math.cos(ang) * S * 7, S, w - S); q.ty = clamp(q.y + Math.sin(ang) * S * 5, S, h - S);
        }
      }
      b.timer -= sec;
      if (b.mode === "flee") {
        if (b.timer <= 0) { b.mode = "hover"; b.timer = 0.5; }
      } else if (b.mode === "chase") {
        const q = st.birds[b.rival];
        if (!q || b.timer <= 0) { b.mode = "hover"; b.timer = 0.4; }
        else { b.tx = q.x - Math.sign(q.x - b.x || 1) * S * 0.8; b.ty = q.y; }
      } else if (curious) {
        // hang in the air a little way off the cursor, looking at it
        const side = b.x < p.x ? -1 : 1;
        b.tx = p.x + side * S * 2.2; b.ty = p.y - S * 0.3; b.aim = null; b.mode = "dart";
      } else if (
        b.timer <= 0 ||
        (b.aim && !nectar.some((q) => q.key === b.aim!.key)) ||
        (hovered && !b.aim?.key.startsWith(`s${hovered.id}`)) // hovering an element calls the bird over now
      ) {
        // next flower: the hovered element first, otherwise any spot no other bird is using
        const taken = new Set(st.birds.filter((q) => q !== b && q.aim).map((q) => q.aim!.key));
        const pool = hovered ? solidNectar([hovered]) : nectar.filter((q) => !taken.has(q.key) && q.key !== b.aim?.key);
        const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
        if (pick) { b.aim = pick; b.mode = "dart"; b.timer = 1.4 + Math.random() * 1.6; }
        else { b.aim = null; b.tx = w * (0.2 + Math.random() * 0.6); b.ty = h * (0.2 + Math.random() * 0.5); b.mode = "dart"; b.timer = 1.5 + Math.random(); }
      }
      // leaving a flower: back straight out first, beak clear, then dart
      if (wasAim && wasSettled && b.aim !== wasAim) b.backout = 0.32;
      if (b.backout > 0) {
        b.backout -= sec;
        b.tx = b.x - Math.sign(b.facing || 1) * S * 0.9; b.ty = b.y - S * 0.05;
      } else if (b.aim) { // body centre so the beak tip lands in the flower
        b.tx = b.aim.x - b.aim.face * Math.cos(FEED_TILT) * beak;
        b.ty = b.aim.y - Math.sin(FEED_TILT) * beak;
      }

      // fast darts that stop dead: a stiff, near-critically damped spring with a speed cap
      const kk = 140 * sp, cc = 2 * Math.sqrt(kk) * 0.95;
      b.vx += ((b.tx - b.x) * kk - b.vx * cc) * sec;
      b.vy += ((b.ty - b.y) * kk - b.vy * cc) * sec;
      const vmax = 1100 * sp * Math.max(0.6, S / 50) * (b.mode === "chase" || b.mode === "flee" ? 1.2 : 1);
      const v = Math.hypot(b.vx, b.vy);
      if (v > vmax) { b.vx *= vmax / v; b.vy *= vmax / v; }
      b.x += b.vx * sec; b.y += b.vy * sec;

      b.settled = !!b.aim && b.backout <= 0 && v < 40 && Math.hypot(b.tx - b.x, b.ty - b.y) < 6;
      if (b.settled && !wasSettled && b.aim) { // arriving: the flower bobs and puffs pollen
        const m = /^f(\d+)\./.exec(b.aim.key);
        if (m) st.flowers[Number(m[1])].bob = 1;
        for (let q = 0; q < 8 && st.pollen.length < 80; q++) {
          const a = Math.random() * Math.PI * 2, spd = 10 + Math.random() * 30;
          st.pollen.push({ x: b.aim.x, y: b.aim.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 10, life: 1 });
        }
      }
      const faceT = b.backout > 0 ? Math.sign(b.facing || 1)
        : b.aim && b.settled ? b.aim.face
        : Math.abs(b.vx) > 60 ? Math.sign(b.vx)
        : curious ? Math.sign(p.x - b.x) || 1
        : b.facing > 0 ? 1 : -1;
      b.facing += (faceT - b.facing) * Math.min(1, sec * 12);
      const vNorm = clamp(v / vmax, 0, 1);
      const tiltT = b.aim && b.settled ? FEED_TILT : b.backout > 0 ? -0.6 : -0.95 + vNorm * 0.75 + clamp(b.vy / vmax, -0.5, 0.5) * 0.4;
      b.tilt += (tiltT - b.tilt) * Math.min(1, sec * 10);
      // the tail fans open to brake and hover, folds shut at speed
      b.tailSpread += ((vNorm > 0.35 ? 0.15 : 0.75) - b.tailSpread) * Math.min(1, sec * 8);

      // hovering jitter, and the sip: the body pumps forward and back
      const sip = b.settled ? Math.sin(t * 6 + b.seed) * S * 0.05 : 0;
      const jx = (Math.sin(t * 3.1 + b.seed) * 1.2 + Math.sin(t * 11 + b.seed) * 0.4) * S * 0.03;
      const jy = (Math.sin(t * 4.3 + b.seed * 2) * 1.2 + Math.sin(t * 13 + b.seed) * 0.4) * S * 0.03;
      const dx = b.x + jx + Math.cos(b.tilt) * Math.sign(b.facing || 1) * sip, dy = b.y + jy + Math.sin(b.tilt) * sip;

      drawBird(ctx, dx, dy, S, b, t, vNorm, body, throat, bellyC);
    });

    // pollen drifting down
    for (let i = st.pollen.length - 1; i >= 0; i--) {
      const q = st.pollen[i];
      q.life -= sec * 0.8;
      if (q.life <= 0) { st.pollen.splice(i, 1); continue; }
      q.vx *= Math.exp(-sec * 2); q.vy = q.vy * Math.exp(-sec * 2) + 12 * sec;
      q.x += q.vx * sec; q.y += q.vy * sec;
      ctx.fillStyle = `rgba(255,220,110,${q.life * 0.9})`;
      ctx.beginPath(); ctx.arc(q.x, q.y, Math.max(0.6, S * 0.012), 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, S: number, b: Bird, t: number, vNorm: number, body: string, throat: string, bellyC: string) {
    const f = b.facing;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(Math.sign(f || 1) * Math.max(0.25, Math.abs(f)), 1);
    ctx.rotate(b.tilt);
    ctx.scale(S, S);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const dark = mix(body, "0,0,0", 0.55);
    const wingC = mix(dark, "190,200,210", 0.6);
    const sheen = 0.5 + 0.5 * Math.sin(t * 1.3 + b.seed + b.tilt * 2 + b.x * 0.004);

    // far wing: the stroke as motion blur, dense where the wing turns at each end
    const root = { x: 0.03, y: -0.1 };
    const mid = -Math.PI * 0.56 - vNorm * 0.25, amp = 1.15 - vNorm * 0.35;
    const strokeWings = (alpha: number, lenK: number) => {
      ctx.fillStyle = `rgba(${wingC},${alpha})`;
      for (let i = 0; i < 9; i++) {
        const u = Math.cos(Math.PI * (i + 0.5) / 9);
        ctx.save(); ctx.translate(root.x, root.y); ctx.rotate(mid + amp * u);
        wingPath(ctx, lenK * (0.85 + 0.15 * Math.abs(u)));
        ctx.fill(); ctx.restore();
      }
    };
    strokeWings(0.045, 0.92);

    // tail: five feathers that fan to brake, pumping as it hovers
    const pump = Math.sin(t * 5 + b.seed) * 0.12 * (1 - vNorm);
    for (let i = -2; i <= 2; i++) {
      const a = Math.PI + pump + i * b.tailSpread * 0.28;
      ctx.save(); ctx.translate(-0.26, 0.0); ctx.rotate(a);
      ctx.fillStyle = `rgb(${mix(dark, body, Math.abs(i) === 2 ? 0.1 : 0.4)})`;
      ctx.beginPath(); ctx.ellipse(0.17, 0, 0.18, 0.045, 0, 0, Math.PI * 2); ctx.fill();
      if (Math.abs(i) >= 1) { // white tips on the outer feathers
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath(); ctx.ellipse(0.32, 0, 0.035, 0.03, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    // body: one silhouette, iridescent back shading into the pale belly
    ctx.beginPath();
    ctx.moveTo(0.43, -0.075);
    ctx.bezierCurveTo(0.42, -0.17, 0.26, -0.2, 0.19, -0.13);
    ctx.bezierCurveTo(0.08, -0.15, -0.14, -0.12, -0.3, -0.035);
    ctx.lineTo(-0.3, 0.035);
    ctx.bezierCurveTo(-0.12, 0.15, 0.14, 0.16, 0.3, 0.075);
    ctx.bezierCurveTo(0.37, 0.04, 0.42, 0.0, 0.44, -0.02);
    ctx.closePath();
    const bg = ctx.createLinearGradient(0, -0.18, 0, 0.15);
    bg.addColorStop(0, `rgb(${mix(body, "255,255,210", 0.3 * sheen)})`);
    bg.addColorStop(0.42, `rgb(${body})`);
    bg.addColorStop(0.62, `rgb(${mix(body, bellyC, 0.55)})`);
    bg.addColorStop(0.8, `rgb(${bellyC})`);
    bg.addColorStop(1, `rgb(${mix(bellyC, "0,0,0", 0.2)})`);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.save();
    ctx.clip();
    // scale-like feathers glinting on the back
    ctx.strokeStyle = `rgba(${mix(body, "255,255,220", 0.5)},${0.15 + 0.3 * sheen})`;
    ctx.lineWidth = 0.008;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 7; c++) {
        const fx = -0.22 + c * 0.075 + (r % 2) * 0.035, fy = -0.12 + r * 0.035;
        ctx.beginPath(); ctx.arc(fx, fy, 0.03, 0.3, Math.PI - 0.3); ctx.stroke();
      }
    }
    // gorget: dark until it catches the light, then it flares
    const flash = 0.15 + 0.85 * Math.pow(Math.max(0, Math.sin(t * 1.7 + b.x * 0.012 + b.tilt * 3 + b.seed)), 2) * (b.settled ? 1.1 : 1);
    ctx.beginPath();
    ctx.moveTo(0.44, -0.03);
    ctx.quadraticCurveTo(0.38, 0.07, 0.2, 0.1);
    ctx.quadraticCurveTo(0.2, 0.0, 0.3, -0.04);
    ctx.closePath();
    const gg = ctx.createRadialGradient(0.33, 0.03, 0, 0.33, 0.03, 0.15);
    gg.addColorStop(0, `rgb(${mix(mix(throat, "0,0,0", 0.75), mix(throat, "255,255,255", 0.3), clamp(flash, 0, 1))})`);
    gg.addColorStop(1, `rgb(${mix(throat, "0,0,0", 0.8 - flash * 0.4)})`);
    ctx.fillStyle = gg;
    ctx.fill();
    ctx.strokeStyle = `rgba(${mix(throat, "255,255,255", 0.6)},${0.35 * flash})`; // gorget scales
    ctx.lineWidth = 0.006;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      ctx.beginPath(); ctx.arc(0.25 + c * 0.045 + (r % 2) * 0.02, -0.01 + r * 0.03, 0.018, 0.3, Math.PI - 0.3); ctx.stroke();
    }
    // white collar below the gorget
    ctx.strokeStyle = `rgba(${mix(bellyC, "255,255,255", 0.5)},0.85)`;
    ctx.lineWidth = 0.022;
    ctx.beginPath(); ctx.moveTo(0.36, 0.075); ctx.quadraticCurveTo(0.26, 0.12, 0.17, 0.11); ctx.stroke();
    ctx.restore();

    // eye and the white spot behind it
    ctx.fillStyle = "rgb(8,8,10)";
    ctx.beginPath(); ctx.arc(0.355, -0.085, 0.032, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath(); ctx.arc(0.364, -0.094, 0.01, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0.29, -0.085, 0.018, 0.01, 0, 0, Math.PI * 2); ctx.fill();
    // long, faintly decurved beak, upper mandible catching light
    ctx.fillStyle = "rgb(22,20,20)";
    ctx.beginPath();
    ctx.moveTo(0.42, -0.07);
    ctx.quadraticCurveTo(0.7, -0.05, BEAK, 0.012);
    ctx.quadraticCurveTo(0.7, -0.015, 0.43, -0.025);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 0.006;
    ctx.beginPath(); ctx.moveTo(0.45, -0.062); ctx.quadraticCurveTo(0.7, -0.045, 0.95, 0.0); ctx.stroke();
    // tucked feet
    ctx.strokeStyle = "rgba(20,18,16,0.85)";
    ctx.lineWidth = 0.018;
    ctx.beginPath(); ctx.moveTo(0.04, 0.13); ctx.lineTo(-0.02, 0.16); ctx.stroke();

    // near wing: the same blur in front, plus a faint strobe of the wing itself
    strokeWings(0.06, 1);
    const u = Math.sin(t * 9 + b.seed);
    ctx.save(); ctx.translate(root.x, root.y); ctx.rotate(mid + amp * u);
    wingPath(ctx, 0.95);
    ctx.fillStyle = `rgba(${wingC},0.32)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${mix(wingC, "255,255,255", 0.3)},0.3)`;
    ctx.lineWidth = 0.006;
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  const setup = useCanvasSetup({ overlay: options.overlay, collide: options.collide, onResize, onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
