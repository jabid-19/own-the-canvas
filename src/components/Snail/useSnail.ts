import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";
import { pickPerch } from "../Owl/useOwl";

export interface UseSnailOptions {
  shellColor: string;
  bodyColor: string;
  trailColor: string;
  backgroundColor: string;
  size: number;
  speed: number;
  trail: boolean;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

interface Slime { x: number; y: number; age: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const TRAIL_LIFE = 40;

/** Direction after a step: turns around at either end of the surface [lo, hi]. */
export function turnAt(x: number, dir: number, lo: number, hi: number): number {
  if (x >= hi && dir > 0) return -1;
  if (x <= lo && dir < 0) return 1;
  return dir;
}

/**
 * A garden snail gliding along the ground (or the top of a `data-otc-solid` element with
 * `collide`) on rippling pedal waves, leaving a glistening slime trail that slowly dries. Its eye
 * stalks lean toward the cursor out of curiosity; poke an eye, move fast nearby or tap it and it
 * pulls everything into its shell, then cautiously comes back out.
 */
export function useSnail(options: UseSnailOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({
    t: 0, u: 0.35, dir: 1, face: 1, hide: 0, calm: 9, eyeL: 1, eyeR: 1, lean: 0, wave: 0,
    trail: [] as Slime[], lastX: -1, lastY: -1, surf: -1,
  });

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;

    const shell = rgbOf(o.shellColor), body = rgbOf(o.bodyColor), slime = rgbOf(o.trailColor);
    const solid = rgbOf(o.backgroundColor, "0,0,0");

    // ---- the surface it crawls on ----
    let S = (frame.overlay ? 120 : Math.min(w, h) * 0.42) * clamp(o.size, 0.2, 2);
    const ledge = o.collide ? pickPerch(frame.solids, w, h, S * 0.6) : null;
    let lo: number, hi: number, gy: number;
    if (ledge) { S = Math.min(S, ledge.w / 1.6); lo = ledge.x + S * 0.6; hi = ledge.x + ledge.w - S * 0.6; gy = ledge.y; }
    else { lo = S * 0.8; hi = w - S * 0.8; gy = h * 0.8; }
    if (hi < lo) hi = lo = (lo + hi) / 2;
    const surfId = ledge ? ledge.id : -1;
    if (surfId !== st.surf) { st.surf = surfId; st.trail = []; st.lastX = -1; } // a new ledge: start a fresh trail

    // ---- behaviour ----
    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, k);
    const speed = Math.hypot(vx, vy);
    let x = lo + (hi - lo) * st.u;
    const headX = x + st.face * S * 0.75, headY = gy - S * 0.35;
    const dHead = p.inside ? Math.hypot(p.x - headX, p.y - headY) : 1e9;
    const dShell = p.inside ? Math.hypot(p.x - x, p.y - (gy - S * 0.33)) : 1e9;

    let scare = false;
    if (o.interactive) {
      if (p.inside && speed > 12 && Math.min(dHead, dShell) < S * 1.4) scare = true;
      for (const tap of p.taps) if (Math.hypot(tap.x - x, tap.y - (gy - S * 0.3)) < S * 0.9) scare = true;
    }
    if (scare) st.calm = 0;
    else st.calm = o.interactive ? st.calm + sec : Math.max(st.calm + sec, 1.6); // nothing to fear: come out now
    const hideT = st.calm < 1.6 ? 1 : 0;
    st.hide += (hideT - st.hide) * Math.min(1, sec * (hideT > st.hide ? 9 : 0.9));

    // eye stalks shrink back individually when the cursor touches them
    for (const side of ["eyeL", "eyeR"] as const) {
      const ex = headX + st.face * S * (side === "eyeL" ? 0.08 : 0.16), ey = headY - S * 0.18;
      const poked = o.interactive && p.inside && Math.hypot(p.x - ex, p.y - ey) < S * 0.18;
      st[side] += ((poked ? 0.15 : 1) - st[side]) * Math.min(1, sec * (poked ? 12 : 1.2));
    }
    // curious lean toward a calm cursor in front of it
    const ahead = p.inside && st.hide < 0.3 && dHead < S * 3 ? clamp(Math.atan2(p.y - headY, (p.x - headX) * st.face) + 1.1, -0.8, 0.8) : 0;
    st.lean += (ahead - st.lean) * Math.min(1, sec * 2);

    // crawl, turning at the ends
    const out = 1 - st.hide;
    if (out > 0.9 && hi > lo) {
      const v = S * 0.09 * o.speed * (0.8 + 0.2 * Math.sin(st.wave * 2));
      st.u = clamp(st.u + (st.dir * v * sec) / (hi - lo), 0, 1);
      st.dir = turnAt(st.u, st.dir, 0, 1);
      st.wave += sec * o.speed * 3;
    }
    st.face += (st.dir - st.face) * Math.min(1, sec * 1.5);
    x = lo + (hi - lo) * st.u;

    // slime trail
    const tailX = x - st.face * S * 0.4;
    if (o.trail && out > 0.9) {
      if (st.lastX < 0 || Math.hypot(tailX - st.lastX, gy - st.lastY) > S * 0.05) {
        st.trail.push({ x: tailX, y: gy, age: 0 });
        st.lastX = tailX; st.lastY = gy;
        if (st.trail.length > 600) st.trail.shift();
      }
    }
    for (const sl of st.trail) sl.age += sec;
    while (st.trail.length && st.trail[0].age > TRAIL_LIFE) st.trail.shift();
    if (!o.trail) st.trail.length = 0;

    // ---- scene ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const scene = !frame.overlay && o.backgroundColor !== "transparent";
    if (scene) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgb(${mix(solid, "0,0,0", 0.3)})`);
      g.addColorStop(0.8, `rgb(${solid})`);
      g.addColorStop(1, `rgb(${mix(solid, "0,0,0", 0.4)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // out-of-focus leaves and bokeh behind
      for (let i = 0; i < 9; i++) {
        const bx = ((i * 0.37 + 0.11) % 1) * w, by = h * (0.12 + ((i * 0.53) % 1) * 0.5), br = Math.min(w, h) * (0.03 + (i % 3) * 0.025);
        ctx.fillStyle = `rgba(${mix(solid, "200,255,190", 0.25)},${0.05 + (i % 2) * 0.04})`;
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 4; i++) {
        const lx = w * (0.1 + i * 0.28), ly = h * (0.3 + (i % 2) * 0.2);
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(-0.6 + i * 0.45 + Math.sin(t * 0.4 + i) * 0.03);
        ctx.fillStyle = `rgba(${mix(solid, "90,150,80", 0.35)},0.35)`;
        ctx.beginPath(); ctx.ellipse(0, 0, Math.min(w, h) * 0.2, Math.min(w, h) * 0.07, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    if (!ledge) { // the mossy stone it crawls on
      const ground = ctx.createLinearGradient(0, gy, 0, h);
      ground.addColorStop(0, `rgb(${mix(solid, "120,140,90", 0.3)})`);
      ground.addColorStop(1, `rgb(${mix(solid, "0,0,0", 0.5)})`);
      ctx.fillStyle = ground;
      ctx.fillRect(0, gy, w, h - gy);
      ctx.fillStyle = `rgba(${mix(solid, "150,190,90", 0.4)},0.7)`;
      for (let i = 0; i < 60; i++) {
        const mx = ((i * 0.618) % 1) * w, mr = 1.5 + (i % 4);
        ctx.beginPath(); ctx.arc(mx, gy + (i % 3), mr, Math.PI, 0); ctx.fill();
      }
      ctx.strokeStyle = `rgba(${mix(solid, "150,200,100", 0.45)},0.8)`; // grass at the far edge
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 40; i++) {
        const bx = ((i * 0.381 + 0.05) % 1) * w, bh = S * (0.25 + (i % 5) * 0.12);
        const sway = Math.sin(t * 0.8 + i) * bh * 0.1;
        ctx.beginPath(); ctx.moveTo(bx, gy + 2); ctx.quadraticCurveTo(bx + sway * 0.5, gy - bh * 0.5, bx + sway + (i % 2 ? 4 : -4), gy - bh); ctx.stroke();
      }
    }

    // trail: a wet glint that dries to a faint silver
    if (st.trail.length > 1) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < st.trail.length; i++) {
        const a = st.trail[i - 1], b = st.trail[i];
        if (Math.abs(a.x - b.x) > S) continue; // a turn-around gap
        const life = 1 - b.age / TRAIL_LIFE;
        const wet = Math.max(0, 1 - b.age / 8);
        ctx.strokeStyle = `rgba(${slime},${0.12 + 0.3 * wet * life})`;
        ctx.lineWidth = S * 0.11;
        ctx.beginPath(); ctx.moveTo(a.x, a.y - S * 0.01); ctx.lineTo(b.x, b.y - S * 0.01); ctx.stroke();
        const glint = 0.5 + 0.5 * Math.sin(b.x * 0.15 - t * 2);
        ctx.strokeStyle = `rgba(${mix(slime, "255,255,255", 0.6)},${(0.15 + 0.5 * wet * glint) * life})`;
        ctx.lineWidth = Math.max(0.6, S * 0.012);
        ctx.beginPath(); ctx.moveTo(a.x, a.y - S * 0.04); ctx.lineTo(b.x, b.y - S * 0.04); ctx.stroke();
      }
    }

    // ---- the snail, in units of S, facing +x, origin on the surface under the shell ----
    ctx.save();
    ctx.translate(x, gy);
    ctx.scale(S * (Math.abs(st.face) < 0.15 ? 0.15 * Math.sign(st.face || 1) : st.face), S);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath(); ctx.ellipse(0.05, 0.01, 0.55 * (0.5 + 0.5 * out), 0.035, 0, 0, Math.PI * 2); ctx.fill();

    const front = 0.2 + 0.6 * out, tail = -0.2 - 0.25 * out;
    const footPath = () => {
      ctx.beginPath();
      ctx.moveTo(tail, 0);
      ctx.quadraticCurveTo(tail + 0.06, -0.07, tail + 0.18, -0.08);
      ctx.lineTo(front - 0.25, -0.1);
      ctx.bezierCurveTo(front - 0.12, -0.1 - 0.15 * out, front + 0.02, -0.18 * out - 0.05, front + 0.04, -0.06);
      ctx.quadraticCurveTo(front + 0.05, 0, front - 0.02, 0);
      ctx.closePath();
    };
    const bg = ctx.createLinearGradient(0, -0.25, 0, 0);
    bg.addColorStop(0, `rgb(${mix(body, "255,255,255", 0.15)})`);
    bg.addColorStop(1, `rgb(${mix(body, "0,0,0", 0.35)})`);
    ctx.fillStyle = bg;
    footPath(); ctx.fill();
    ctx.save();
    footPath(); ctx.clip();
    // skin: wrinkled grooves and the pedal waves rippling forward
    ctx.strokeStyle = `rgba(${mix(body, "0,0,0", 0.4)},0.35)`;
    ctx.lineWidth = 0.008;
    for (let gx = tail; gx < front; gx += 0.045) { ctx.beginPath(); ctx.moveTo(gx, -0.25); ctx.lineTo(gx + 0.03, 0); ctx.stroke(); }
    ctx.fillStyle = `rgba(${mix(body, "0,0,0", 0.5)},0.35)`;
    for (let i = 0; i < 8; i++) {
      const wx = tail + (((i / 8 + st.wave * 0.12) % 1) * (front - tail));
      ctx.beginPath(); ctx.ellipse(wx, -0.015, 0.025, 0.02, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = `rgba(255,255,255,${0.12 + 0.08 * Math.sin(t * 1.5)})`; // wet sheen
    ctx.beginPath(); ctx.ellipse((front + tail) / 2 + 0.1, -0.09, (front - tail) * 0.35, 0.012, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // tentacles: two short feelers below, two eye stalks above
    if (out > 0.05) {
      const hx = front - 0.06, hy = -0.12 * out - 0.05;
      ctx.strokeStyle = `rgb(${mix(body, "0,0,0", 0.15)})`;
      ctx.lineWidth = 0.022;
      for (const d of [0, 0.03]) {
        const a = 0.35 + d * 4 + Math.sin(t * 2 + d * 30) * 0.08;
        ctx.beginPath(); ctx.moveTo(hx + d, hy + 0.04); ctx.lineTo(hx + d + Math.cos(a) * 0.1 * out, hy + 0.04 + Math.sin(a) * 0.1 * out); ctx.stroke();
      }
      const stalks: [number, number][] = [[-0.03, st.eyeL], [0.03, st.eyeR]];
      for (const [d, ext] of stalks) {
        const len = 0.34 * out * ext;
        const a = -1.15 + d * 4 + st.lean * 0.6 + Math.sin(t * 1.1 + d * 50) * 0.08;
        const bx = hx + d, by = hy;
        const tx = bx + Math.cos(a) * len, ty = by + Math.sin(a) * len;
        ctx.strokeStyle = `rgb(${mix(body, "0,0,0", 0.1)})`;
        ctx.lineWidth = 0.028 - 0.01 * (len / 0.34);
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + Math.cos(a - 0.3) * len * 0.5, by + Math.sin(a - 0.3) * len * 0.5, tx, ty); ctx.stroke();
        ctx.fillStyle = `rgb(${mix(body, "0,0,0", 0.25)})`;
        ctx.beginPath(); ctx.arc(tx, ty, 0.022, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgb(12,10,10)";
        ctx.beginPath(); ctx.arc(tx + 0.006, ty, 0.012, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath(); ctx.arc(tx, ty - 0.008, 0.005, 0, Math.PI * 2); ctx.fill();
      }
    }

    // shell: a logarithmic spiral with growth bands, lit from above
    const R = 0.3, scx = -0.05, scy = -0.31 + st.hide * 0.04;
    const sg = ctx.createRadialGradient(scx - R * 0.35, scy - R * 0.4, R * 0.05, scx, scy, R * 1.05);
    sg.addColorStop(0, `rgb(${mix(shell, "255,250,230", 0.35)})`);
    sg.addColorStop(0.65, `rgb(${shell})`);
    sg.addColorStop(1, `rgb(${mix(shell, "0,0,0", 0.5)})`);
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.ellipse(scx, scy, R, R * 0.95, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.ellipse(scx, scy, R, R * 0.95, 0, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = `rgba(${mix(shell, "0,0,0", 0.45)},0.35)`; // growth lines across the whorl
    ctx.lineWidth = 0.006;
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(scx + Math.cos(a) * R * 0.35, scy + Math.sin(a) * R * 0.35); ctx.lineTo(scx + Math.cos(a + 0.2) * R, scy + Math.sin(a + 0.2) * R); ctx.stroke();
    }
    ctx.restore();
    const spiral = (r0: number, turns: number) => {
      ctx.beginPath();
      const b = Math.log(r0 / 0.02) / (turns * Math.PI * 2);
      for (let i = 0; i <= 80; i++) {
        const th = (i / 80) * turns * Math.PI * 2;
        const r = r0 * Math.exp(-b * th);
        const sx = scx + 0.02 + Math.cos(th + 0.6) * r, sy = scy - 0.01 + Math.sin(th + 0.6) * r * 0.95;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
    };
    ctx.strokeStyle = `rgba(${mix(shell, "40,20,10", 0.6)},0.8)`;
    ctx.lineWidth = 0.03;
    spiral(R * 0.96, 2.6); ctx.stroke();
    ctx.strokeStyle = `rgba(${mix(shell, "255,240,210", 0.5)},0.5)`; // pale band beside the suture
    ctx.lineWidth = 0.012;
    spiral(R * 0.86, 2.6); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath(); ctx.ellipse(scx - R * 0.35, scy - R * 0.5, R * 0.18, R * 0.07, -0.5, 0, Math.PI * 2); ctx.fill();
    // aperture lip at the front
    ctx.strokeStyle = `rgb(${mix(shell, "255,245,225", 0.55)})`;
    ctx.lineWidth = 0.025;
    ctx.beginPath(); ctx.ellipse(scx + R * 0.55, scy + R * 0.6, R * 0.32, R * 0.18, -0.4, Math.PI * 0.9, Math.PI * 2.05); ctx.stroke();
    ctx.restore();
  }

  const setup = useCanvasSetup({ overlay: options.overlay, collide: options.collide, onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
