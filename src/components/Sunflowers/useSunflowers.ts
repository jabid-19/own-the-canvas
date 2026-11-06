import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";
import { noise1 } from "../../runtime/noise";

export interface UseSunflowersOptions {
  count: number;
  petalColor: string;
  centerColor: string;
  stemColor: string;
  backgroundColor: string;
  wind: number;
  followCursor: boolean;
  interactive: boolean;
  overlay: boolean;
}

interface Flower {
  u: number; z: number; tall: number; seed: number;
  yaw: number; pitch: number; vyaw: number; vpitch: number; shake: number; bend: number; bendV: number;
}
interface Petal { x: number; y: number; vx: number; vy: number; a: number; va: number; age: number; s: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Head orientation that faces a sun at (sx, sy) from a head at (hx, hy): yaw right +, pitch down +. */
export function faceToward(hx: number, hy: number, sx: number, sy: number, w: number, h: number): { yaw: number; pitch: number } {
  return {
    yaw: Math.tanh((sx - hx) / Math.max(1, w * 0.35)) * 0.95,
    pitch: clamp(Math.tanh((sy - hy) / Math.max(1, h * 0.45)) * 0.8 + 0.12, -0.7, 0.9),
  };
}

/**
 * A row of sunflowers at golden hour. Each heavy head turns to face the sun (your cursor, or
 * the sun arcing across the sky on its own) with a lagging, springy follow, foreshortened in
 * 3D, seeds packed in a golden-angle Fibonacci spiral. Stems sway in gusts and in the cursor's
 * wake; tap a head to shake loose a few petals.
 */
export function useSunflowers(options: UseSunflowersOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({ t: 0, flowers: [] as Flower[], petals: [] as Petal[], sunX: -1, sunY: -1, gust: 0 });

  function build(n: number) {
    const fl: Flower[] = [];
    for (let i = 0; i < n; i++) {
      const back = i % 2 === 1 && n > 3;
      fl.push({
        u: (i + 0.5) / n + (Math.random() - 0.5) * 0.4 / n,
        z: back ? 0.72 + Math.random() * 0.1 : 0.92 + Math.random() * 0.08,
        tall: 0.55 + Math.random() * 0.15, seed: Math.random() * 100,
        yaw: 0, pitch: 0.2, vyaw: 0, vpitch: 0, shake: 0, bend: 0, bendV: 0,
      });
    }
    return fl.sort((a, b) => a.z - b.z);
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;

    const petal = rgbOf(o.petalColor), center = rgbOf(o.centerColor), stem = rgbOf(o.stemColor);
    const solid = rgbOf(o.backgroundColor, "0,0,0");
    const n = clamp(Math.round(o.count), 0, 24);
    if (st.flowers.length !== n) st.flowers = build(n);

    const p = readPointer(pointer.current, canvasEl.current);
    const { vx: pvx } = velocity.current(p, k);
    const userSun = o.followCursor && p.inside;
    const arc = (t / 40) % 1; // the sun's own day, left to right
    const ax = w * (0.1 + 0.8 * arc), ay = h * (0.42 - Math.sin(arc * Math.PI) * 0.3);
    const tx = userSun ? p.x : ax, ty = userSun ? p.y : ay;
    if (st.sunX < 0) { st.sunX = tx; st.sunY = ty; }
    st.sunX += (tx - st.sunX) * Math.min(1, sec * (userSun ? 10 : 2));
    st.sunY += (ty - st.sunY) * Math.min(1, sec * (userSun ? 10 : 2));
    const sx = st.sunX, sy = st.sunY;

    // ---- sky ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const scene = !frame.overlay && o.backgroundColor !== "transparent";
    const horizon = h * 0.62;
    if (scene) {
      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, `rgb(${mix(solid, "40,50,110", 0.45)})`);
      sky.addColorStop(0.7, `rgb(${solid})`);
      sky.addColorStop(1, `rgb(${mix(solid, "255,220,150", 0.45)})`);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, horizon + 1);
      const U = Math.min(w, h);
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, U * 0.7);
      glow.addColorStop(0, "rgba(255,236,180,0.55)");
      glow.addColorStop(0.15, "rgba(255,200,120,0.25)");
      glow.addColorStop(1, "rgba(255,180,100,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,248,225,0.95)";
      ctx.beginPath(); ctx.arc(sx, sy, U * 0.045, 0, Math.PI * 2); ctx.fill();
      // rolling field rows to the horizon
      for (let r = 0; r < 3; r++) {
        const yy = horizon + r * h * 0.06;
        ctx.fillStyle = `rgb(${mix(mix(stem, solid, 0.55 - r * 0.15), "0,0,0", 0.2 + r * 0.1)})`;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let i = 0; i <= 24; i++) { const x = (i / 24) * w; ctx.lineTo(x, yy - noise1(x / w * 3 + r * 7, 3) * h * 0.05); }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
        // distant flower dots along the row
        ctx.fillStyle = `rgba(${mix(petal, solid, 0.3 + r * 0.1)},${0.5 + r * 0.15})`;
        for (let x = (r * 7) % 11; x < w; x += 9 + r * 4) {
          const yy2 = yy - noise1(x / w * 3 + r * 7, 3) * h * 0.05 + 2;
          ctx.beginPath(); ctx.arc(x, yy2, 1.2 + r * 0.8, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // ---- wind ----
    st.gust *= Math.exp(-sec * 0.8);
    const windAt = (u: number) => o.wind * ((noise1(t * 0.35 + u * 2, 11) - 0.5) * 0.9 + Math.sin(t * 1.3 + u * 6) * 0.08) + st.gust;
    for (const tap of p.taps) if (o.interactive) st.gust += (tap.x < w / 2 ? 1 : -1) * 0.2;

    // ---- flowers ----
    const U = Math.min(w, h);
    for (const f of st.flowers) {
      const R = U * 0.12 * f.z;
      const bx = f.u * w, by = h + 4;
      const H = h * f.tall * f.z;
      // stem bend: springy, pushed by wind and the cursor's wake
      let push = windAt(f.u) * 0.5;
      if (o.interactive && p.inside && Math.abs(p.x - bx) < R * 2 && p.y > by - H - R) push += pvx * 0.01;
      f.bendV += ((push - f.bend) * 30 - f.bendV * 5) * sec;
      f.bend += f.bendV * sec;
      const hx = bx + f.bend * H * 0.35, hy = by - H + Math.abs(f.bend) * H * 0.05;

      // heavy heads follow the sun on a lagging spring
      const aim = faceToward(hx, hy, sx, sy, w, h);
      f.vyaw += ((aim.yaw - f.yaw) * 9 - f.vyaw * 4) * sec;
      f.vpitch += ((aim.pitch - f.pitch) * 9 - f.vpitch * 4) * sec;
      f.yaw += f.vyaw * sec;
      f.pitch += f.vpitch * sec;
      for (const tap of p.taps) {
        if (!o.interactive) break;
        if (Math.hypot(tap.x - hx, tap.y - hy) < R * 1.2) {
          f.shake = 1;
          for (let i = 0; i < 4; i++) {
            const a = Math.random() * Math.PI * 2;
            st.petals.push({ x: hx + Math.cos(a) * R * 0.8, y: hy + Math.sin(a) * R * 0.8, vx: (Math.random() - 0.5) * 40, vy: -20 - Math.random() * 30, a, va: (Math.random() - 0.5) * 6, age: 0, s: R * 0.4 });
          }
        }
      }
      f.shake *= Math.exp(-sec * 3);
      const yaw = f.yaw + Math.sin(t * 25 + f.seed) * 0.12 * f.shake;
      const pitch = f.pitch;

      // stem and leaves
      ctx.lineCap = "round";
      const sg = ctx.createLinearGradient(bx - R * 0.1, 0, bx + R * 0.1, 0);
      sg.addColorStop(0, `rgb(${mix(stem, "0,0,0", 0.35)})`);
      sg.addColorStop(1, `rgb(${mix(stem, "255,240,180", 0.15)})`);
      ctx.strokeStyle = sg;
      ctx.lineWidth = R * 0.13;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + f.bend * H * 0.05, by - H * 0.5, hx, hy + R * 0.2); ctx.stroke();
      for (const [lu, side] of [[0.35, -1], [0.6, 1]] as const) {
        const lx = bx + f.bend * H * 0.35 * lu * lu, ly = by - H * lu;
        const la = side * (0.9 + Math.sin(t * 1.4 + f.seed + lu * 5) * 0.08 * o.wind) - f.bend * 0.6;
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(-Math.PI / 2 + la);
        const L = R * 1.1;
        ctx.fillStyle = `rgb(${mix(stem, "0,0,0", 0.12)})`;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(L * 0.3, -L * 0.45, L * 0.95, -L * 0.3, L, 0); ctx.bezierCurveTo(L * 0.95, L * 0.3, L * 0.3, L * 0.45, 0, 0); ctx.fill();
        ctx.strokeStyle = `rgba(${mix(stem, "255,255,200", 0.3)},0.5)`;
        ctx.lineWidth = R * 0.02;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L * 0.95, 0); ctx.stroke();
        ctx.restore();
      }

      // the head: a disc whose normal faces (yaw, pitch); foreshorten along the tilt direction
      const nx = Math.sin(yaw) * Math.cos(pitch), ny = Math.sin(pitch), nz = Math.cos(yaw) * Math.cos(pitch);
      const tilt = Math.atan2(ny, nx);
      const fore = Math.max(0.12, Math.abs(nz));
      const depth = R * 0.22;
      const cxh = hx + nx * depth, cyh = hy + ny * depth;
      // the green back of the head and its sepals, seen behind the face
      ctx.save();
      ctx.translate(hx - nx * depth * 0.4, hy - ny * depth * 0.4);
      ctx.rotate(tilt); ctx.scale(fore, 1); ctx.rotate(-tilt);
      ctx.fillStyle = `rgb(${mix(stem, "0,0,0", 0.25)})`;
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + 0.1;
        ctx.save(); ctx.rotate(a);
        ctx.beginPath(); ctx.moveTo(R * 0.4, -R * 0.08); ctx.quadraticCurveTo(R * 0.75, 0, R * 0.4, R * 0.08); ctx.fill();
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(0, 0, R * 0.48, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(cxh, cyh);
      ctx.rotate(tilt); ctx.scale(fore, 1); ctx.rotate(-tilt);
      const lit = 0.75 + 0.25 * nz; // faces turned to the sun glow brighter
      for (let ring = 0; ring < 2; ring++) {
        const np = 21;
        for (let i = 0; i < np; i++) {
          const a = (i + ring * 0.5) / np * Math.PI * 2;
          const wob = Math.sin(t * 2 + i * 1.7 + f.seed) * 0.04 * o.wind;
          const len = R * (ring ? 0.92 : 1) * (0.92 + 0.08 * Math.sin(i * 2.3 + f.seed));
          ctx.save();
          ctx.rotate(a + wob);
          const pg = ctx.createLinearGradient(R * 0.4, 0, len, 0);
          pg.addColorStop(0, `rgb(${mix(petal, "120,60,0", ring ? 0.2 : 0.4)})`);
          pg.addColorStop(1, `rgb(${mix(petal, "255,250,210", (ring ? 0.25 : 0.05) * lit)})`);
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.moveTo(R * 0.38, -R * 0.07);
          ctx.quadraticCurveTo(len * 0.8, -R * 0.13, len, 0);
          ctx.quadraticCurveTo(len * 0.8, R * 0.13, R * 0.38, R * 0.07);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `rgba(${mix(petal, "120,60,0", 0.5)},0.25)`;
          ctx.lineWidth = R * 0.008;
          ctx.beginPath(); ctx.moveTo(R * 0.45, 0); ctx.lineTo(len * 0.9, 0); ctx.stroke();
          ctx.restore();
        }
      }
      // seed disc: golden-angle phyllotaxis, green at the heart, dark at the rim
      const r = R * 0.44;
      ctx.fillStyle = `rgb(${mix(center, "0,0,0", 0.3)})`;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      const N = Math.round(150 + 100 * frame.quality);
      const c = r / Math.sqrt(N);
      for (let i = 1; i < N; i++) {
        const rr = c * Math.sqrt(i), a = i * GOLDEN;
        const q = rr / r;
        ctx.fillStyle = `rgb(${q < 0.3 ? mix(center, "120,140,40", 0.5 * (1 - q / 0.3)) : mix(center, "255,190,90", (q - 0.3) * 0.25)})`;
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, c * 0.48, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      // sunlight catching the rim on the sun side
      ctx.strokeStyle = `rgba(255,236,170,${0.25 * lit})`;
      ctx.lineWidth = R * 0.03;
      ctx.beginPath(); ctx.arc(cxh, cyh, R * 0.45, Math.atan2(sy - cyh, sx - cxh) - 0.8, Math.atan2(sy - cyh, sx - cxh) + 0.8); ctx.stroke();
    }

    // falling petals
    for (const pt of st.petals) {
      pt.age += sec;
      pt.vy += 30 * sec;
      pt.vx += (windAt(pt.x / w) * 40 - pt.vx) * sec;
      pt.vx *= 0.99; pt.vy *= 0.97;
      pt.x += pt.vx * sec + Math.sin(pt.age * 4 + pt.a) * 0.4 * k;
      pt.y += pt.vy * sec;
      pt.a += pt.va * sec;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - pt.age / 5);
      ctx.translate(pt.x, pt.y); ctx.rotate(pt.a); ctx.scale(1, Math.abs(Math.sin(pt.age * 3 + pt.a)) * 0.8 + 0.2);
      ctx.fillStyle = `rgb(${petal})`;
      ctx.beginPath(); ctx.ellipse(0, 0, pt.s, pt.s * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    st.petals = st.petals.filter((pt) => pt.age < 5 && pt.y < h + 20);
    ctx.globalAlpha = 1;
  }

  const setup = useCanvasSetup({ overlay: options.overlay, onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
