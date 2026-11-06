import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { hexToRgbString } from "../../utils/color";

export interface UseCandleOptions {
  flameColor: string;
  coreColor: string;
  waxColor: string;
  backgroundColor: string;
  size: number;
  candleHeight: number;
  flicker: number;
  glowIntensity: number;
  interactive: boolean;
}

interface Puff { x: number; y: number; age: number; seed: number }

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const toRgb = (c: string) => (c.startsWith("#") ? hexToRgbString(c) : "255,255,255");
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Teardrop flame outline: base at (x0, y0), tip `H` above, leaning `dx` at the tip. */
function flamePath(ctx: CanvasRenderingContext2D, x0: number, y0: number, H: number, W: number, dx: number) {
  const tx = x0 + dx, ty = y0 - H;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.bezierCurveTo(tx + W * 0.25, ty + H * 0.35, x0 + W + dx * 0.3, y0 - H * 0.42, x0 + W * 0.9 + dx * 0.12, y0 - H * 0.12);
  ctx.bezierCurveTo(x0 + W * 0.75, y0 + W * 0.4, x0 - W * 0.75, y0 + W * 0.4, x0 - W * 0.9 + dx * 0.12, y0 - H * 0.12);
  ctx.bezierCurveTo(x0 - W + dx * 0.3, y0 - H * 0.42, tx - W * 0.25, ty + H * 0.35, tx, ty);
  ctx.closePath();
}

/**
 * A single pillar candle in a dark room. The flame is layered light (halo, body, white-hot
 * core, blue base) that breathes and flickers, leans into drafts from the cursor with a
 * springy wobble, and lights the molten pool, the translucent wax and the table around it.
 * Click to snuff it: the wick smoulders and a thread of smoke curls up, then it relights.
 */
export function useCandle(options: UseCandleOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({
    t: 0, lit: true, ignite: 1, outFor: 0, ember: 0,
    lean: 0, leanVel: 0, gust: 0, nextGust: 3,
    smoke: [] as Puff[], smoking: 0, drips: [] as { x: number; len: number; w: number }[],
  });

  function onResize() {
    let seed = 4;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    s.current.drips = Array.from({ length: 5 }, () => ({ x: (rnd() - 0.5) * 0.8, len: 0.15 + rnd() * 0.55, w: 0.05 + rnd() * 0.05 }));
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;

    const flame = toRgb(o.flameColor), core = toRgb(o.coreColor), wax = toRgb(o.waxColor);

    // geometry
    const U = Math.min(w, h);
    const cw = U * 0.17 * clamp(o.size, 0.3, 2);
    const ch = cw * (1 + 2.2 * clamp(o.candleHeight, 0.1, 1.2));
    const tableY = h * 0.84;
    const cx = w / 2;
    const top = Math.max(cw * 2.4, tableY - ch);
    const wickX = cx, wickY = top + cw * 0.02;
    const baseY = wickY - cw * 0.12; // flame base sits on the wick tip

    // draft: the flame leans the way the cursor moves past it, on a spring
    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, k);
    let push = 0;
    if (p.inside) {
      const near = clamp(1 - Math.hypot(p.x - wickX, p.y - (baseY - cw * 0.5)) / (U * 0.6), 0, 1);
      push = clamp(vx * near * 0.035, -1.2, 1.2);
      st.gust = Math.max(st.gust, clamp((Math.hypot(vx, vy) * near) / 40, 0, 0.7));
    }
    st.leanVel += ((push - st.lean) * 60 - st.leanVel * 7) * sec;
    st.lean += st.leanVel * sec;
    st.nextGust -= sec;
    if (st.nextGust <= 0) { st.gust = Math.max(st.gust, (0.15 + Math.random() * 0.25) * o.flicker); st.nextGust = 2 + Math.random() * 5; }
    st.gust *= Math.exp(-sec * 3);

    // click snuffs; it relights by itself, or on the next click
    if (o.interactive && p.taps.length) {
      if (st.lit && st.ignite > 0.5) { st.lit = false; st.outFor = 0; st.smoking = 3; st.ember = 1; }
      else if (!st.lit) st.lit = true;
    }
    if (!st.lit) {
      st.outFor += sec;
      if (st.outFor > 2.6) st.lit = true;
    }
    st.ignite = st.lit ? Math.min(1, st.ignite + sec * 2) : Math.max(0, st.ignite - sec * 9);
    st.ember = Math.max(0, st.ember - sec * 0.5);
    st.smoking = Math.max(0, st.smoking - sec);

    const fl = clamp(o.flicker, 0, 3);
    const breath = 0.035 * Math.sin(t * 7.3) + 0.025 * Math.sin(t * 13.1 + 1) + 0.018 * Math.sin(t * 23.7 + 2);
    const ig = st.ignite;
    const flare = ig < 1 && st.lit ? Math.sin(ig * Math.PI) * 0.25 : 0; // a little flare as it catches
    const H = cw * 0.95 * (1 + breath * fl - st.gust * 0.35 + flare) * ig;
    const W = H * 0.26;
    const dx = H * (st.lean * 0.6 + (0.04 * Math.sin(t * 9.1) + 0.025 * Math.sin(t * 17.3)) * fl * (1 + st.gust * 3));
    const I = ig * (0.85 + breath * 2 * fl - st.gust * 0.3) * clamp(o.glowIntensity, 0, 3); // light output

    // room
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    if (!frame.overlay && o.backgroundColor !== "transparent") {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }
    const bg = toRgb(o.backgroundColor === "transparent" ? "#000000" : o.backgroundColor);
    const lx = wickX + dx * 0.4, ly = baseY - H * 0.45;
    if (I > 0.01) {
      ctx.globalCompositeOperation = "lighter";
      const room = ctx.createRadialGradient(lx, ly, 0, lx, ly, U * 1.25);
      room.addColorStop(0, `rgba(${flame},${0.3 * I})`);
      room.addColorStop(0.35, `rgba(${flame},${0.1 * I})`);
      room.addColorStop(1, `rgba(${flame},0)`);
      ctx.fillStyle = room;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }

    // table
    if (!frame.overlay) {
      const tg = ctx.createLinearGradient(0, tableY, 0, h);
      tg.addColorStop(0, `rgb(${mix(mix(bg, "40,28,20", 0.6), flame, 0.12 * Math.min(1, I))})`);
      tg.addColorStop(1, `rgb(${mix(bg, "0,0,0", 0.4)})`);
      ctx.fillStyle = tg;
      ctx.fillRect(0, tableY, w, h - tableY);
    }
    if (I > 0.01) {
      ctx.globalCompositeOperation = "lighter";
      const pool = ctx.createRadialGradient(cx, tableY + cw * 0.15, 0, cx, tableY + cw * 0.15, cw * 3);
      pool.addColorStop(0, `rgba(${flame},${0.22 * I})`);
      pool.addColorStop(1, `rgba(${flame},0)`);
      ctx.fillStyle = pool;
      ctx.save();
      ctx.translate(cx, tableY + cw * 0.15);
      ctx.scale(1, 0.28);
      ctx.translate(-cx, -(tableY + cw * 0.15));
      ctx.fillRect(cx - cw * 3, tableY + cw * 0.15 - cw * 3, cw * 6, cw * 6);
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    }
    // contact shadow
    const sh = ctx.createRadialGradient(cx, tableY, 0, cx, tableY, cw * 0.9);
    sh.addColorStop(0, "rgba(0,0,0,0.55)");
    sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(cx, tableY); ctx.scale(1, 0.22); ctx.translate(-cx, -tableY);
    ctx.fillStyle = sh;
    ctx.fillRect(cx - cw, tableY - cw, cw * 2, cw * 2);
    ctx.restore();

    // wax body: a cylinder, lit warm and translucent near the flame
    const L = cx - cw / 2, Rx = cx + cw / 2, capR = cw * 0.13;
    const body = ctx.createLinearGradient(L, 0, Rx, 0);
    body.addColorStop(0, `rgb(${mix(wax, "0,0,0", 0.5)})`);
    body.addColorStop(0.28, `rgb(${mix(wax, flame, 0.08 * Math.min(1, I))})`);
    body.addColorStop(0.62, `rgb(${mix(wax, "0,0,0", 0.18)})`);
    body.addColorStop(1, `rgb(${mix(wax, "0,0,0", 0.62)})`);
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(L, top);
    ctx.lineTo(L, tableY);
    ctx.ellipse(cx, tableY, cw / 2, capR * 0.8, 0, Math.PI, 0, true);
    ctx.lineTo(Rx, top);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.clip();
    if (I > 0.01) { // subsurface glow under the flame
      const ss = ctx.createLinearGradient(0, top, 0, top + cw * 1.6);
      ss.addColorStop(0, `rgba(${mix(wax, flame, 0.6)},${0.55 * Math.min(1, I)})`);
      ss.addColorStop(1, `rgba(${mix(wax, flame, 0.6)},0)`);
      ctx.fillStyle = ss;
      ctx.fillRect(L, top, cw, cw * 1.6);
    }
    // drips down the front
    for (const d of st.drips) {
      const x = cx + d.x * cw * 0.5, len = d.len * ch * 0.6, dw = d.w * cw;
      const edge = Math.abs(d.x);
      ctx.fillStyle = `rgba(${mix(wax, "255,255,255", 0.08 - edge * 0.1)},${0.9 - edge * 0.4})`;
      ctx.beginPath();
      ctx.moveTo(x - dw, top);
      ctx.lineTo(x - dw * 0.8, top + len);
      ctx.arc(x, top + len, dw * 0.9, Math.PI, 0, true);
      ctx.lineTo(x + dw, top);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${0.14 * (1 - edge)})`;
      ctx.lineWidth = Math.max(0.5, dw * 0.35);
      ctx.beginPath(); ctx.moveTo(x - dw * 0.35, top + cw * 0.05); ctx.lineTo(x - dw * 0.35, top + len); ctx.stroke();
    }
    ctx.restore();

    // top: rim and molten pool
    ctx.fillStyle = `rgb(${mix(wax, "255,255,255", 0.06)})`;
    ctx.beginPath(); ctx.ellipse(cx, top, cw / 2, capR, 0, 0, Math.PI * 2); ctx.fill();
    const pg = ctx.createRadialGradient(cx, top, 0, cx, top, cw * 0.44);
    pg.addColorStop(0, `rgba(${mix(wax, flame, 0.55)},${0.35 + 0.6 * Math.min(1, I)})`);
    pg.addColorStop(1, `rgba(${mix(wax, "0,0,0", 0.2)},0.9)`);
    ctx.fillStyle = pg;
    ctx.beginPath(); ctx.ellipse(cx, top + capR * 0.12, cw * 0.42, capR * 0.72, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${0.18 + 0.2 * Math.min(1, I)})`;
    ctx.lineWidth = Math.max(0.6, cw * 0.012);
    ctx.beginPath(); ctx.ellipse(cx, top, cw / 2, capR, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();

    // wick, bending with the flame
    const wtx = wickX + dx * 0.05 + cw * 0.015, wty = baseY;
    ctx.strokeStyle = "rgb(30,22,18)";
    ctx.lineWidth = Math.max(1, cw * 0.022);
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(wickX, wickY); ctx.quadraticCurveTo(wickX, (wickY + wty) / 2, wtx, wty); ctx.stroke();
    const glowTip = Math.max(st.ember, ig);
    if (glowTip > 0.01) {
      ctx.globalCompositeOperation = "lighter";
      const eg = ctx.createRadialGradient(wtx, wty, 0, wtx, wty, cw * 0.06);
      eg.addColorStop(0, `rgba(255,140,60,${0.9 * glowTip})`);
      eg.addColorStop(1, "rgba(255,80,20,0)");
      ctx.fillStyle = eg;
      ctx.fillRect(wtx - cw * 0.06, wty - cw * 0.06, cw * 0.12, cw * 0.12);
      ctx.globalCompositeOperation = "source-over";
    }

    // flame
    if (H > 0.5) {
      ctx.globalCompositeOperation = "lighter";
      const halo = ctx.createRadialGradient(lx, ly, 0, lx, ly, H * 1.4);
      halo.addColorStop(0, `rgba(${flame},${0.35 * ig})`);
      halo.addColorStop(1, `rgba(${flame},0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(lx - H * 1.4, ly - H * 1.4, H * 2.8, H * 2.8);

      flamePath(ctx, wickX, baseY, H, W, dx);
      const fg = ctx.createLinearGradient(0, baseY - H, 0, baseY + W * 0.4);
      fg.addColorStop(0, `rgba(${flame},0)`);
      fg.addColorStop(0.25, `rgba(${flame},0.55)`);
      fg.addColorStop(0.7, `rgba(${mix(flame, core, 0.4)},0.85)`);
      fg.addColorStop(1, `rgba(${flame},0.35)`);
      ctx.fillStyle = fg;
      ctx.fill();

      flamePath(ctx, wickX, baseY - H * 0.04, H * 0.62, W * 0.52, dx * 0.55);
      const cg = ctx.createLinearGradient(0, baseY - H * 0.66, 0, baseY);
      cg.addColorStop(0, `rgba(${core},0.25)`);
      cg.addColorStop(0.45, `rgba(${core},0.95)`);
      cg.addColorStop(1, `rgba(${core},0.55)`);
      ctx.fillStyle = cg;
      ctx.fill();

      const bb = ctx.createRadialGradient(wickX, baseY - W * 0.05, 0, wickX, baseY - W * 0.05, W * 0.8);
      bb.addColorStop(0, `rgba(90,130,255,${0.45 * ig})`);
      bb.addColorStop(1, "rgba(90,130,255,0)");
      ctx.fillStyle = bb;
      ctx.save();
      ctx.translate(wickX, baseY); ctx.scale(1, 0.7); ctx.translate(-wickX, -baseY);
      ctx.fillRect(wickX - W, baseY - W, W * 2, W * 2);
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    }

    // smoke: one thread from the wick, curling as it rises and spreads
    if (st.smoking > 0) st.smoke.push({ x: wtx, y: wty, age: 0, seed: t });
    const sm = st.smoke;
    for (const q of sm) {
      q.age += sec;
      q.y -= (U * 0.07 + q.age * U * 0.03) * sec;
      q.x += (Math.sin(q.age * 2.3 + q.seed * 0.7) * U * 0.03 + st.lean * U * 0.05) * sec;
    }
    while (sm.length && sm[0].age > 4) sm.shift();
    if (sm.length > 1) {
      ctx.lineCap = "round";
      for (let i = 1; i < sm.length; i++) {
        const a = sm[i - 1], b = sm[i];
        const fade = Math.min(1, st.smoking + 0.2) * (1 - b.age / 4);
        ctx.strokeStyle = `rgba(190,184,178,${0.3 * fade * Math.min(1, b.age * 4)})`;
        ctx.lineWidth = 1 + b.age * cw * 0.06;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }

  const setup = useCanvasSetup({ onResize, onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
