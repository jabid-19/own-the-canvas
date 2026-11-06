import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity, glowSprite } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";

export interface UseJellyfishOptions {
  count: number;
  bellColor: string;
  glowColor: string;
  backgroundColor: string;
  tentacleLength: number;
  pulseRate: number;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

/** A verlet chain: current and previous positions, interleaved x,y. */
interface Chain { p: Float32Array; q: Float32Array; n: number; anchor: number; arm: boolean }

interface Jelly {
  x: number; y: number; vx: number; vy: number;
  a: number; // heading, 0 = swimming straight up
  r: number; z: number; phase: number; rate: number; flash: number; seed: number;
  chains: Chain[];
}

const TENTACLES = 12, ARMS = 4, T_PTS = 16, A_PTS = 9;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Bell contraction 0..1 over one pulse cycle: a quick squeeze, then a slow relax. */
export function pulse(phase: number): number {
  const f = phase - Math.floor(phase);
  if (f < 0.22) return Math.sin((f / 0.22) * Math.PI * 0.5);
  return Math.pow(1 - (f - 0.22) / 0.78, 2.2);
}

function makeChain(n: number, anchor: number, arm: boolean, x: number, y: number): Chain {
  const p = new Float32Array(n * 2), q = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) { p[i * 2] = q[i * 2] = x; p[i * 2 + 1] = q[i * 2 + 1] = y + i; }
  return { p, q, n, anchor, arm };
}

function spawn(w: number, h: number, fromBelow: boolean): Jelly {
  const z = 0.45 + Math.random() * 0.55;
  const r = Math.min(w, h) * (0.1 + Math.random() * 0.05) * z;
  const x = Math.random() * w, y = fromBelow ? h + r * 2 : r + Math.random() * (h - r);
  const chains: Chain[] = [];
  for (let i = 0; i < TENTACLES; i++) chains.push(makeChain(T_PTS, (i + 0.5) / TENTACLES * 2 - 1, false, x, y));
  for (let i = 0; i < ARMS; i++) chains.push(makeChain(A_PTS, (i - 1.5) * 0.14, true, x, y));
  return {
    x, y, vx: 0, vy: 0, a: (Math.random() - 0.5) * 0.6, r, z,
    phase: Math.random(), rate: 0.8 + Math.random() * 0.4, flash: 0, seed: Math.random() * 100, chains,
  };
}

/**
 * Moon jellies in open water. Each bell pulses by jet propulsion (a quick squeeze that drives it
 * forward, a slow relax), steering gently back upward, with verlet tentacles and frilled oral arms
 * that trail and swirl in the wake. The cursor stirs the water and they turn away from it; a tap
 * makes nearby bells flash. With `collide` they nudge off `data-otc-solid` elements.
 */
export function useJellyfish(options: UseJellyfishOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({ t: 0, jellies: [] as Jelly[], snow: [] as { x: number; y: number; r: number }[], w: 0, h: 0 });
  const sprite = useRef<{ key: string; img: HTMLCanvasElement | null }>({ key: "", img: null });

  function onResize(w: number, h: number) {
    const st = s.current;
    st.w = w; st.h = h;
    st.jellies = [];
    st.snow = Array.from({ length: 70 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.4 + Math.random() * 1.2 }));
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;
    if (st.w !== w || st.h !== h) onResize(w, h);

    const bell = rgbOf(o.bellColor), glow = rgbOf(o.glowColor);
    const solid = rgbOf(o.backgroundColor, "0,0,0");
    if (sprite.current.key !== o.glowColor) sprite.current = { key: o.glowColor, img: glowSprite(o.glowColor.startsWith("#") ? o.glowColor : "#ffffff", 96) };

    const want = clamp(Math.round(o.count * (0.5 + 0.5 * frame.quality)), 0, 30);
    while (st.jellies.length < want) st.jellies.push(spawn(w, h, false));
    if (st.jellies.length > want) st.jellies.length = want;

    const p = readPointer(pointer.current, canvasEl.current);
    const { vx: pvx, vy: pvy } = velocity.current(p, k);

    // ---- background ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const scene = !frame.overlay && o.backgroundColor !== "transparent";
    if (scene) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgb(${mix(solid, "120,170,210", 0.18)})`);
      g.addColorStop(0.5, `rgb(${solid})`);
      g.addColorStop(1, `rgb(${mix(solid, "0,0,0", 0.55)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 5; i++) { // light shafts from the surface
        const x = w * (0.15 + i * 0.19) + Math.sin(t * 0.2 + i * 2) * w * 0.04;
        const sw = w * (0.05 + (i % 2) * 0.04);
        const rg = ctx.createLinearGradient(0, 0, 0, h * 0.8);
        rg.addColorStop(0, `rgba(${mix(glow, "200,230,255", 0.6)},${0.06 + 0.03 * Math.sin(t * 0.5 + i)})`);
        rg.addColorStop(1, `rgba(${mix(glow, "200,230,255", 0.6)},0)`);
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.moveTo(x - sw * 0.4, 0); ctx.lineTo(x + sw * 0.4, 0); ctx.lineTo(x + sw * 2.2, h * 0.8); ctx.lineTo(x - sw * 0.6, h * 0.8); ctx.closePath(); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }
    // marine snow drifting down, stirred by the cursor
    ctx.fillStyle = `rgba(${mix(glow, "255,255,255", 0.7)},0.35)`;
    for (const m of st.snow) {
      m.y += sec * 6 * m.r;
      m.x += Math.sin(t * 0.3 + m.y * 0.01) * sec * 3;
      if (p.inside) {
        const d = Math.hypot(m.x - p.x, m.y - p.y);
        if (d < 80) { m.x += pvx * 0.05 * k; m.y += pvy * 0.05 * k; }
      }
      if (m.y > h + 2) { m.y = -2; m.x = Math.random() * w; }
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
    }

    // ---- simulate ----
    for (const tap of p.taps) {
      if (!o.interactive) break;
      for (const j of st.jellies) {
        const d = Math.hypot(j.x - tap.x, j.y - tap.y);
        if (d < j.r * 5) { j.flash = 1; j.rate = 2; }
      }
    }
    for (const j of st.jellies) {
      const rate = o.pulseRate * j.rate * 0.55;
      const before = pulse(j.phase);
      j.phase += sec * rate;
      const c = pulse(j.phase);
      j.rate += (1 - j.rate) * Math.min(1, sec * 0.5);
      j.flash *= Math.exp(-sec * 1.6);

      // thrust only while squeezing, along the heading
      if (c > before) {
        const thrust = (c - before) * j.r * 2.6;
        j.vx += Math.sin(j.a) * thrust;
        j.vy -= Math.cos(j.a) * thrust;
      }
      // steer: back toward upright, wander, away from the cursor
      let steer = -j.a * 0.25 + Math.sin(t * 0.3 + j.seed) * 0.15;
      if (o.interactive && p.inside) {
        const dx = j.x - p.x, dy = j.y - p.y, d = Math.hypot(dx, dy);
        if (d < j.r * 5) {
          const away = Math.atan2(dx, -dy);
          let da = away - j.a;
          da = Math.atan2(Math.sin(da), Math.cos(da));
          steer += da * 1.5 * (1 - d / (j.r * 5));
          j.rate = Math.max(j.rate, 1.6);
          const push = (1 - d / (j.r * 5)) * 0.04;
          j.vx += pvx * push * k; j.vy += pvy * push * k;
        }
      }
      if (o.collide) {
        for (const so of frame.solids) {
          const pad = j.r * 1.1;
          if (j.x > so.x - pad && j.x < so.x + so.w + pad && j.y > so.y - pad && j.y < so.y + so.h + pad) {
            const cx = clamp(j.x, so.x, so.x + so.w), cy = clamp(j.y, so.y, so.y + so.h);
            let nx = j.x - cx, ny = j.y - cy, nd = Math.hypot(nx, ny);
            if (nd < 0.001) { nx = 0; ny = 1; nd = 1; }
            j.vx += (nx / nd) * j.r * sec * 6;
            j.vy += (ny / nd) * j.r * sec * 6;
            steer += (Math.atan2(nx, -ny) - j.a) * 0.8;
          }
        }
      }
      j.a += clamp(steer, -2, 2) * sec;
      j.a = clamp(j.a, -1.3, 1.3);
      const drag = Math.exp(-sec * 1.4);
      j.vx *= drag; j.vy = j.vy * drag + j.r * 0.05 * sec; // a slow sink between beats
      j.x += j.vx * sec; j.y += j.vy * sec;
      if (j.y < -j.r * 6) Object.assign(j, spawn(w, h, true));
      if (j.x < -j.r * 3) j.x += w + j.r * 6; else if (j.x > w + j.r * 3) j.x -= w + j.r * 6;

      // tentacles: pin to the rim, verlet the rest
      const ca = Math.cos(j.a), sa = Math.sin(j.a);
      const bw = j.r * (1 - 0.22 * c);
      for (const ch of j.chains) {
        const lx = ch.anchor * bw * (ch.arm ? 1 : 0.95), ly = ch.arm ? -j.r * 0.05 : 0;
        const ax = j.x + lx * ca - ly * sa, ay = j.y + lx * sa + ly * ca;
        const seg = j.r * (ch.arm ? 0.16 : 0.22) * o.tentacleLength;
        const P = ch.p, Q = ch.q;
        P[0] = Q[0] = ax; P[1] = Q[1] = ay;
        const damp = Math.pow(0.9, k);
        for (let i = 1; i < ch.n; i++) {
          const ix = i * 2, iy = ix + 1;
          const nx = P[ix] + (P[ix] - Q[ix]) * damp, ny = P[iy] + (P[iy] - Q[iy]) * damp;
          Q[ix] = P[ix]; Q[iy] = P[iy];
          P[ix] = nx + Math.sin(t * 1.3 + i * 0.5 + j.seed + ch.anchor * 3) * 0.04 * k;
          P[iy] = ny + 0.05 * k;
          if (p.inside && o.interactive) {
            const d = Math.hypot(P[ix] - p.x, P[iy] - p.y);
            if (d < 60) { const f = (1 - d / 60) * 0.25; P[ix] += pvx * f * k; P[iy] += pvy * f * k; }
          }
        }
        for (let pass = 0; pass < 2; pass++) {
          for (let i = 1; i < ch.n; i++) {
            const ax2 = (i - 1) * 2, bx = i * 2;
            const dx = P[bx] - P[ax2], dy = P[bx + 1] - P[ax2 + 1];
            const d = Math.hypot(dx, dy) || 1;
            const m = (d - seg) / d;
            if (i === 1) { P[bx] -= dx * m; P[bx + 1] -= dy * m; }
            else { P[ax2] += dx * m * 0.5; P[ax2 + 1] += dy * m * 0.5; P[bx] -= dx * m * 0.5; P[bx + 1] -= dy * m * 0.5; }
          }
        }
      }
    }

    // ---- draw, far ones first ----
    const order = st.jellies.slice().sort((a, b) => a.z - b.z);
    for (const j of order) {
      const c = pulse(j.phase);
      const fade = 0.45 + 0.55 * j.z;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // trailing tentacles and oral arms
      for (const ch of j.chains) {
        const P = ch.p;
        ctx.beginPath();
        ctx.moveTo(P[0], P[1]);
        for (let i = 1; i < ch.n - 1; i++) {
          const mx = (P[i * 2] + P[i * 2 + 2]) / 2, my = (P[i * 2 + 1] + P[i * 2 + 3]) / 2;
          ctx.quadraticCurveTo(P[i * 2], P[i * 2 + 1], mx, my);
        }
        ctx.lineTo(P[(ch.n - 1) * 2], P[(ch.n - 1) * 2 + 1]);
        if (ch.arm) {
          ctx.strokeStyle = `rgba(${mix(bell, glow, 0.3)},${0.28 * fade})`;
          ctx.lineWidth = j.r * 0.12;
          ctx.stroke();
          ctx.strokeStyle = `rgba(${mix(bell, "255,255,255", 0.4)},${0.22 * fade})`;
          ctx.lineWidth = j.r * 0.03;
          ctx.stroke();
        } else {
          ctx.strokeStyle = `rgba(${mix(glow, bell, 0.4)},${(0.35 + 0.4 * j.flash) * fade})`;
          ctx.lineWidth = Math.max(0.5, j.r * 0.018);
          ctx.stroke();
        }
      }

      ctx.save();
      ctx.translate(j.x, j.y);
      ctx.rotate(j.a);
      const bw = j.r * (1 - 0.22 * c), bh = j.r * (0.78 + 0.22 * c);
      // halo
      if (sprite.current.img) {
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = (0.12 + 0.6 * j.flash) * fade;
        const gs = j.r * (3 + j.flash * 2);
        ctx.drawImage(sprite.current.img, -gs / 2, -bh * 0.5 - gs / 2, gs, gs);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      // the bell: a translucent dome with a scalloped margin
      const bellPath = () => {
        ctx.beginPath();
        ctx.moveTo(-bw, 0);
        ctx.bezierCurveTo(-bw * 1.02, -bh * 0.9, -bw * 0.5, -bh * 1.08, 0, -bh);
        ctx.bezierCurveTo(bw * 0.5, -bh * 1.08, bw * 1.02, -bh * 0.9, bw, 0);
        const lobes = 8;
        for (let i = lobes - 1; i >= 0; i--) {
          const x0 = -bw + (2 * bw * i) / lobes;
          ctx.quadraticCurveTo(x0 + bw / lobes, bh * 0.07 * (1 - c * 0.5), x0, 0);
        }
        ctx.closePath();
      };
      const bg = ctx.createRadialGradient(0, -bh * 0.55, bw * 0.1, 0, -bh * 0.3, bw * 1.1);
      bg.addColorStop(0, `rgba(${mix(bell, "255,255,255", 0.35)},${0.42 * fade})`);
      bg.addColorStop(0.7, `rgba(${bell},${0.2 * fade})`);
      bg.addColorStop(1, `rgba(${mix(bell, glow, 0.5)},${0.34 * fade})`);
      ctx.fillStyle = bg;
      bellPath(); ctx.fill();
      ctx.save();
      bellPath(); ctx.clip();
      // radial canals
      ctx.strokeStyle = `rgba(${mix(bell, "255,255,255", 0.5)},${0.18 * fade})`;
      ctx.lineWidth = Math.max(0.4, j.r * 0.012);
      for (let i = 0; i < 9; i++) {
        const u = i / 8 * 2 - 1;
        ctx.beginPath(); ctx.moveTo(0, -bh * 0.75); ctx.quadraticCurveTo(u * bw * 0.6, -bh * 0.6, u * bw * 0.98, 0); ctx.stroke();
      }
      // four horseshoe gonads, the moon jelly's signature
      ctx.strokeStyle = `rgba(${mix(glow, bell, 0.25)},${(0.45 + 0.4 * j.flash) * fade})`;
      ctx.lineWidth = j.r * 0.07;
      for (let i = 0; i < 4; i++) {
        const gx = (i - 1.5) * bw * 0.3, gy = -bh * (0.42 + (i === 1 || i === 2 ? 0.06 : 0));
        ctx.beginPath(); ctx.ellipse(gx, gy, bw * 0.11, bh * 0.08, 0, 0.3, Math.PI * 2 - 0.3); ctx.stroke();
      }
      ctx.restore();
      // rim light
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(${glow},${(0.4 + 0.5 * j.flash) * fade})`;
      ctx.lineWidth = Math.max(0.8, j.r * 0.03);
      ctx.beginPath();
      ctx.moveTo(-bw, 0);
      ctx.bezierCurveTo(-bw * 1.02, -bh * 0.9, -bw * 0.5, -bh * 1.08, 0, -bh);
      ctx.bezierCurveTo(bw * 0.5, -bh * 1.08, bw * 1.02, -bh * 0.9, bw, 0);
      ctx.stroke();
      ctx.fillStyle = `rgba(${mix(glow, "255,255,255", 0.5)},${(0.5 + 0.5 * j.flash) * fade})`;
      for (let i = 0; i <= 8; i++) { // rim sense organs
        ctx.beginPath(); ctx.arc(-bw + (2 * bw * i) / 8, 0, Math.max(0.6, j.r * 0.02), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    }
  }

  const setup = useCanvasSetup({ overlay: options.overlay, collide: options.collide, onFrame: draw, onResize });
  canvasEl.current = setup.canvas;
  return setup;
}
