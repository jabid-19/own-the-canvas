import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { hexToRgbString } from "../../utils/color";
import type { Solid } from "../../runtime/physics";

export interface UseOwlOptions {
  featherColor: string;
  bellyColor: string;
  faceColor: string;
  eyeColor: string;
  beakColor: string;
  branchColor: string;
  backgroundColor: string;
  earTufts: boolean;
  size: number;
  followCursor: boolean;
  blinkInterval: number;
  overlay: boolean;
  collide: boolean;
}

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const toRgb = (c: string) => (c.startsWith("#") ? hexToRgbString(c) : "255,255,255");
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ease = (k: number) => k * k * (3 - 2 * k);

/** Owl blink closure 0..1, `s` seconds in: slower and heavier-lidded than a human blink. */
export function owlBlink(s: number): number {
  if (s < 0) return 0;
  if (s < 0.12) return ease(s / 0.12);
  if (s < 0.2) return 1;
  if (s < 0.45) return 1 - ease((s - 0.2) / 0.25);
  return 0;
}

/** The solid an owl of height `need` can perch on: top edge inside the canvas, nearest the middle. */
export function pickPerch(solids: readonly Solid[], w: number, h: number, need: number): Solid | null {
  let best: Solid | null = null, bd = Infinity;
  for (const s of solids) {
    if (s.y < need * 0.5 || s.y > h || s.x + s.w < 0 || s.x > w) continue;
    const d = Math.abs(s.x + s.w / 2 - w / 2);
    if (d < bd) { bd = d; best = s; }
  }
  return best;
}

/**
 * An owl on its perch. Owls can't move their eyes, so the whole head snaps to follow the
 * cursor (a held fixation, then a quick turn); it cocks its head when the cursor goes still,
 * bobs to judge distance when something moves fast nearby, blinks slowly, grows drowsy when
 * ignored and fluffs up when tapped. Pupils narrow as the cursor comes close. With `collide`
 * it perches on top of a `data-otc-solid` element instead of a branch.
 */
export function useOwl(options: UseOwlOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({
    t: 0, x: -1, y: -1,
    yaw: 0, pitch: 0, roll: 0, fy: 0, fp: 0, since: 0, nextIdle: 1,
    still: 0, tiltSign: 1, bob: 0, puff: 0, alarm: 0, drowsy: 0, idle: 0,
    pupil: 0.5, blinkAt: -1, blinkGap: 2,
  });

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;

    const feather = toRgb(o.featherColor), belly = toRgb(o.bellyColor), face = toRgb(o.faceColor);
    const eye = toRgb(o.eyeColor), beak = toRgb(o.beakColor), branch = toRgb(o.branchColor);
    const solid = toRgb(o.backgroundColor === "transparent" ? "#000000" : o.backgroundColor);

    // size and perch
    let S = (frame.overlay ? 130 : Math.min(w, h) * 0.6) * clamp(o.size, 0.2, 2);
    const perchSolid = o.collide ? pickPerch(frame.solids, w, h, S) : null;
    let px: number, py: number;
    if (perchSolid) {
      S = Math.min(S, perchSolid.y / 1.2);
      px = clamp(perchSolid.x + perchSolid.w / 2, S * 0.4, w - S * 0.4);
      py = perchSolid.y;
    } else {
      px = w / 2;
      py = h * 0.84;
      S = Math.min(S, py / 1.25);
    }
    if (st.x < 0 || Math.hypot(px - st.x, py - st.y) > S * 3) { st.x = px; st.y = py; } // hop straight there
    st.x += (px - st.x) * Math.min(1, sec * 8);
    st.y += (py - st.y) * Math.min(1, sec * 8);
    const ox = st.x, oy = st.y;

    // ---- behaviour ----
    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, k);
    const speed = Math.hypot(vx, vy);
    const hx = ox, hy = oy - S * 0.88;
    const tracking = o.followCursor && p.inside;
    if (p.inside && speed > 0.5) st.idle = 0; else st.idle += sec;
    st.drowsy += ((st.idle > 6 ? 1 : 0) - st.drowsy) * Math.min(1, sec * (st.idle > 6 ? 0.4 : 4));

    st.since += sec;
    if (tracking) {
      const ty = Math.tanh((p.x - hx) / (S * 1.3));
      const tp = Math.tanh((p.y - hy) / (S * 1.6));
      if (Math.hypot(ty - st.fy, tp - st.fp) > 0.08 && st.since > 0.15) { st.fy = ty; st.fp = tp; st.since = 0; }
      st.still = speed < 0.6 ? st.still + sec : 0;
      if (speed > 18 && Math.hypot(p.x - hx, p.y - hy) < S * 2.5) { st.alarm = Math.max(st.alarm, 0.7); st.bob = Math.max(st.bob, 0.7); }
    } else {
      st.still = 0;
      st.nextIdle -= sec;
      if (st.nextIdle <= 0) {
        st.fy = Math.random() < 0.3 ? 0 : (Math.random() * 2 - 1) * 0.9;
        st.fp = (Math.random() * 2 - 1) * 0.3;
        st.nextIdle = 1.5 + Math.random() * 2.5;
      }
    }
    const turn = 1 - Math.exp(-sec * 14);
    st.yaw += (st.fy - st.yaw) * turn;
    st.pitch += (st.fp - st.pitch) * turn;
    if (st.still > 0.9 && st.still - sec <= 0.9) st.tiltSign = -st.tiltSign; // a fresh tilt each time it settles
    const rollT = st.still > 0.9 ? 0.3 * st.tiltSign : 0;
    st.roll += (rollT - st.roll) * Math.min(1, sec * 5);

    if (p.taps.length) { st.puff = 1; st.alarm = 1; st.bob = 1; st.idle = 0; }
    st.puff *= Math.exp(-sec * 1.4);
    st.alarm *= Math.exp(-sec * 1.2);
    st.bob *= Math.exp(-sec * 2.2);

    if (o.blinkInterval > 0) {
      st.blinkGap -= sec;
      if (st.blinkGap <= 0) { st.blinkAt = t; st.blinkGap = (o.blinkInterval / 1000) * (0.5 + Math.random()); }
    }
    const blink = st.blinkAt >= 0 ? owlBlink(t - st.blinkAt) : 0;
    const lid = Math.max(blink, st.drowsy * 0.55 * (1 - st.alarm));
    const near = tracking ? clamp(1 - Math.hypot(p.x - hx, p.y - hy) / (S * 2.2), 0, 1) : 0;
    const pupilT = 0.52 * (1 - 0.4 * near) * (1 + 0.45 * st.alarm) * (1 + 0.15 * st.drowsy);
    st.pupil += (pupilT - st.pupil) * Math.min(1, sec * 4);

    // ---- scene ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const scene = !frame.overlay && o.backgroundColor !== "transparent";
    if (scene) {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, `rgb(${mix(solid, "0,0,0", 0.2)})`);
      sky.addColorStop(1, `rgb(${mix(solid, "60,70,100", 0.18)})`);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
      // far trunks in the mist
      for (let i = 0; i < 7; i++) {
        const x = ((i * 0.153 + 0.07) % 1) * w;
        if (Math.abs(x - w * 0.82) < Math.min(w, h) * 0.12) continue; // leave the moon a gap
        const tw = w * (0.012 + (i % 3) * 0.008);
        ctx.fillStyle = `rgba(${mix(solid, "0,0,0", 0.35)},${0.35 + (i % 2) * 0.25})`;
        ctx.fillRect(x, 0, tw, h);
      }
      const mx = w * 0.82, my = h * 0.2, mr = Math.min(w, h) * 0.07;
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 7);
      mg.addColorStop(0, "rgba(220,228,255,0.22)");
      mg.addColorStop(1, "rgba(220,228,255,0)");
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(236,240,255,0.85)";
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
      const mist = ctx.createLinearGradient(0, h * 0.5, 0, h);
      mist.addColorStop(0, `rgba(${mix(solid, "150,160,190", 0.4)},0)`);
      mist.addColorStop(1, `rgba(${mix(solid, "150,160,190", 0.4)},0.35)`);
      ctx.fillStyle = mist;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);
    }
    if (!perchSolid) { // the branch
      const bw = S * 0.09;
      ctx.lineCap = "round";
      ctx.strokeStyle = `rgb(${mix(branch, "0,0,0", 0.35)})`;
      ctx.lineWidth = bw * 1.15;
      ctx.beginPath(); ctx.moveTo(-10, oy + bw * 0.9); ctx.quadraticCurveTo(ox, oy + bw * 0.2, w + 10, oy + bw * 0.1); ctx.stroke();
      ctx.strokeStyle = `rgb(${branch})`;
      ctx.lineWidth = bw;
      ctx.beginPath(); ctx.moveTo(-10, oy + bw * 0.75); ctx.quadraticCurveTo(ox, oy + bw * 0.05, w + 10, oy); ctx.stroke();
      ctx.strokeStyle = `rgba(${mix(branch, "255,255,255", 0.25)},0.35)`; // bark grain catching the moon
      ctx.lineWidth = Math.max(0.6, bw * 0.08);
      for (let i = 0; i < 9; i++) {
        const x0 = (i / 9) * w + 7;
        ctx.beginPath(); ctx.moveTo(x0, oy + bw * 0.2); ctx.lineTo(x0 + bw * 1.6, oy + bw * 0.05); ctx.stroke();
      }
      ctx.strokeStyle = `rgb(${branch})`; // a twig
      ctx.lineWidth = bw * 0.35;
      ctx.beginPath(); ctx.moveTo(ox + S * 0.75, oy + bw * 0.1); ctx.quadraticCurveTo(ox + S * 0.9, oy - S * 0.2, ox + S * 1.1, oy - S * 0.32); ctx.stroke();
      ctx.fillStyle = `rgb(${mix(branch, "60,90,50", 0.6)})`;
      for (const [lx, ly, a] of [[1.08, -0.33, -0.6], [0.95, -0.22, 0.5], [1.15, -0.25, 0.9]] as const) {
        ctx.save(); ctx.translate(ox + S * lx, oy + S * ly); ctx.rotate(a);
        ctx.beginPath(); ctx.ellipse(0, 0, S * 0.07, S * 0.028, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    // ---- the owl, in units of S with feet at the origin ----
    const shake = Math.sin(t * 38) * 0.012 * st.puff;
    const breathe = 1 + Math.sin(t * 1.6) * 0.012;
    const fluff = 1 + 0.12 * st.puff + 0.05 * st.drowsy;
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(S, S);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const markings = mix(feather, "0,0,0", 0.32);

    // tail, hanging behind the perch
    ctx.fillStyle = `rgb(${mix(feather, "0,0,0", 0.25)})`;
    ctx.beginPath(); ctx.moveTo(-0.09, -0.1); ctx.lineTo(0.09, -0.1); ctx.quadraticCurveTo(0.07, 0.08, 0.035, 0.16); ctx.lineTo(0, 0.13); ctx.lineTo(-0.035, 0.16); ctx.quadraticCurveTo(-0.07, 0.08, -0.09, -0.1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = `rgba(${mix(feather, "255,255,255", 0.2)},0.3)`; // tail bars
    ctx.lineWidth = 0.008;
    for (const y of [0.0, 0.05, 0.1]) { ctx.beginPath(); ctx.moveTo(-0.06 + y * 0.2, y); ctx.lineTo(0.06 - y * 0.2, y); ctx.stroke(); }

    // body
    ctx.save();
    ctx.translate(shake, -0.36);
    ctx.scale(fluff, breathe);
    const bg = ctx.createRadialGradient(-0.1, -0.15, 0.02, 0, 0, 0.42);
    bg.addColorStop(0, `rgb(${mix(feather, "255,255,255", 0.12)})`);
    bg.addColorStop(1, `rgb(${mix(feather, "0,0,0", 0.3)})`);
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.ellipse(0, 0, 0.3, 0.38, 0, 0, Math.PI * 2); ctx.fill();
    // belly with barring
    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, 0.06, 0.2, 0.28, 0, 0, Math.PI * 2);
    const bl = ctx.createRadialGradient(0, -0.05, 0, 0, 0.06, 0.3);
    bl.addColorStop(0, `rgb(${mix(belly, "255,255,255", 0.1)})`);
    bl.addColorStop(1, `rgb(${mix(belly, feather, 0.45)})`);
    ctx.fillStyle = bl;
    ctx.fill();
    ctx.clip();
    ctx.strokeStyle = `rgba(${markings},0.55)`;
    ctx.lineWidth = 0.014;
    for (let row = 0, y = -0.18; y < 0.34; y += 0.052, row++) {
      for (let x = -0.2 + (row % 2) * 0.035; x < 0.21; x += 0.07) {
        ctx.beginPath(); ctx.moveTo(x - 0.022, y - 0.012); ctx.lineTo(x, y + 0.008); ctx.lineTo(x + 0.022, y - 0.012); ctx.stroke();
      }
    }
    ctx.restore();
    // folded wings
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.scale(side, 1);
      ctx.translate(0.03 * st.puff, 0);
      ctx.rotate(-0.08 * st.puff);
      const wg = ctx.createLinearGradient(0.16, -0.3, 0.32, 0.3);
      wg.addColorStop(0, `rgb(${mix(feather, "0,0,0", 0.1)})`);
      wg.addColorStop(1, `rgb(${mix(feather, "0,0,0", 0.4)})`);
      ctx.fillStyle = wg;
      ctx.beginPath();
      ctx.moveTo(0.17, -0.27);
      ctx.bezierCurveTo(0.36, -0.15, 0.36, 0.12, 0.21, 0.36);
      ctx.bezierCurveTo(0.17, 0.2, 0.15, -0.02, 0.17, -0.27);
      ctx.fill();
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = `rgba(${mix(feather, "255,255,255", 0.3)},0.35)`; // scalloped feather edges
      ctx.lineWidth = 0.01;
      for (let y = -0.2; y < 0.34; y += 0.07) {
        ctx.beginPath(); ctx.arc(0.25, y, 0.06, 0.2, Math.PI - 0.2); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${mix(belly, "255,255,255", 0.4)},0.6)`;
      for (const [x, y] of [[0.27, -0.12], [0.3, 0.02], [0.26, 0.16], [0.24, -0.02]] as const) {
        ctx.beginPath(); ctx.arc(x, y, 0.012, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      ctx.restore();
    }
    ctx.restore();

    // feet gripping the perch, feathered legs
    const foot = mix(beak, "150,140,120", 0.5);
    for (const fx of [-0.08, 0.08]) {
      ctx.fillStyle = `rgb(${mix(belly, feather, 0.25)})`;
      ctx.beginPath(); ctx.ellipse(fx, -0.045, 0.06, 0.05, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgb(${foot})`;
      ctx.lineWidth = 0.022;
      for (const d of [-0.03, 0, 0.03]) {
        ctx.beginPath(); ctx.moveTo(fx + d * 0.5, -0.02); ctx.quadraticCurveTo(fx + d, 0.01, fx + d * 1.3, 0.04); ctx.stroke();
      }
      ctx.strokeStyle = "rgb(25,22,20)";
      ctx.lineWidth = 0.012;
      for (const d of [-0.03, 0, 0.03]) {
        ctx.beginPath(); ctx.moveTo(fx + d * 1.3, 0.04); ctx.lineTo(fx + d * 1.2, 0.06); ctx.stroke();
      }
    }

    // ---- head ----
    const yaw = st.yaw, pitch = st.pitch;
    const bob = Math.sin(t * 16) * 0.025 * st.bob;
    ctx.save();
    ctx.translate(shake, -0.66 + bob);
    ctx.rotate(st.roll);
    ctx.translate(0, 0.66);
    const fx = yaw * 0.11, fyy = pitch * 0.05;
    const hg = ctx.createRadialGradient(-0.08, -0.98, 0.02, 0, -0.88, 0.32);
    hg.addColorStop(0, `rgb(${mix(feather, "255,255,255", 0.1)})`);
    hg.addColorStop(1, `rgb(${mix(feather, "0,0,0", 0.28)})`);
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.ellipse(0, -0.88, 0.29 * fluff * (1 - Math.abs(yaw) * 0.04), 0.245 * fluff, 0, 0, Math.PI * 2); ctx.fill();

    if (o.earTufts) {
      for (const side of [-1, 1]) {
        const bx = side * 0.17 + fx * 0.45, by = -1.03;
        const lift = 0.04 * st.alarm;
        ctx.fillStyle = `rgb(${mix(feather, "0,0,0", 0.2)})`;
        ctx.beginPath();
        ctx.moveTo(bx - side * 0.07, by + 0.04);
        ctx.quadraticCurveTo(bx + side * 0.02, by - 0.06, bx + side * 0.09, by - 0.15 - lift);
        ctx.quadraticCurveTo(bx + side * 0.06, by - 0.03, bx + side * 0.08, by + 0.05);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = `rgba(${markings},0.6)`;
        ctx.lineWidth = 0.008;
        ctx.beginPath(); ctx.moveTo(bx, by + 0.02); ctx.lineTo(bx + side * 0.075, by - 0.12 - lift); ctx.stroke();
      }
    }

    // facial disc: two overlapping rings of fine feathers with a dark ruff around them
    const ex = 0.112, ey = -0.875 + fyy;
    ctx.fillStyle = `rgb(${mix(face, feather, 0.7)})`;
    for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(side * ex + fx, ey + 0.005, 0.148, 0, Math.PI * 2); ctx.fill(); }
    for (const side of [-1, 1]) {
      const dg = ctx.createRadialGradient(side * ex + fx, ey, 0.05, side * ex + fx, ey, 0.135);
      dg.addColorStop(0, `rgb(${mix(face, "0,0,0", 0.25)})`);
      dg.addColorStop(1, `rgb(${face})`);
      ctx.fillStyle = dg;
      ctx.beginPath(); ctx.arc(side * ex + fx, ey, 0.133, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = `rgba(${mix(face, "0,0,0", 0.35)},0.35)`;
    ctx.lineWidth = 0.006;
    for (const side of [-1, 1]) {
      const cx = side * ex + fx;
      for (let i = 0; i < 22; i++) {
        const a = (i / 22) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 0.085, ey + Math.sin(a) * 0.085); ctx.lineTo(cx + Math.cos(a) * 0.128, ey + Math.sin(a) * 0.128); ctx.stroke();
      }
    }
    // brows: pale V of feathers over the beak, raised when alarmed
    ctx.strokeStyle = `rgba(${mix(belly, "255,255,255", 0.3)},0.75)`;
    ctx.lineWidth = 0.028;
    ctx.beginPath();
    ctx.moveTo(fx - 0.2, ey - 0.12 - st.alarm * 0.025);
    ctx.quadraticCurveTo(fx - 0.06, ey - 0.08, fx, ey + 0.03);
    ctx.quadraticCurveTo(fx + 0.06, ey - 0.08, fx + 0.2, ey - 0.12 - st.alarm * 0.025);
    ctx.stroke();

    // eyes, fixed in their sockets
    const er = 0.068 * (1 + st.alarm * 0.08);
    for (const side of [-1, 1]) {
      const cx = side * ex + fx * 1.05, cy = ey;
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.beginPath(); ctx.arc(cx, cy, er * 1.14, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, er, 0, Math.PI * 2); ctx.clip();
      const ig = ctx.createRadialGradient(cx, cy, er * 0.2, cx, cy, er);
      ig.addColorStop(0, `rgb(${mix(eye, "255,255,255", 0.25)})`);
      ig.addColorStop(0.75, `rgb(${eye})`);
      ig.addColorStop(1, `rgb(${mix(eye, "0,0,0", 0.45)})`);
      ctx.fillStyle = ig;
      ctx.fillRect(cx - er, cy - er, er * 2, er * 2);
      ctx.strokeStyle = `rgba(${mix(eye, "0,0,0", 0.4)},0.4)`;
      ctx.lineWidth = 0.004;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * er * 0.4, cy + Math.sin(a) * er * 0.4); ctx.lineTo(cx + Math.cos(a) * er * 0.95, cy + Math.sin(a) * er * 0.95); ctx.stroke();
      }
      ctx.fillStyle = "rgb(6,5,6)";
      ctx.beginPath(); ctx.arc(cx, cy, er * clamp(st.pupil, 0.15, 0.85), 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath(); ctx.arc(cx - er * 0.32, cy - er * 0.36, er * 0.18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath(); ctx.arc(cx + er * 0.3, cy + er * 0.32, er * 0.07, 0, Math.PI * 2); ctx.fill();
      // feathered upper lid
      if (lid > 0.01) {
        const ly = cy - er + er * 2 * lid;
        ctx.fillStyle = `rgb(${mix(face, feather, 0.55)})`;
        ctx.fillRect(cx - er, cy - er, er * 2, er * 2 * lid);
        ctx.strokeStyle = "rgba(20,14,10,0.7)";
        ctx.lineWidth = 0.008;
        ctx.beginPath(); ctx.moveTo(cx - er, ly); ctx.quadraticCurveTo(cx, ly + er * 0.12, cx + er, ly); ctx.stroke();
      }
      ctx.restore();
    }

    // beak, half buried in facial feathers
    const bx = fx * 1.1, by = ey + 0.06;
    const bkg = ctx.createLinearGradient(bx - 0.03, by, bx + 0.03, by);
    bkg.addColorStop(0, `rgb(${mix(beak, "255,255,255", 0.25)})`);
    bkg.addColorStop(1, `rgb(${mix(beak, "0,0,0", 0.3)})`);
    ctx.fillStyle = bkg;
    ctx.beginPath();
    ctx.moveTo(bx - 0.032, by - 0.035);
    ctx.quadraticCurveTo(bx - 0.02, by + 0.04, bx + 0.004, by + 0.075);
    ctx.quadraticCurveTo(bx + 0.02, by + 0.03, bx + 0.032, by - 0.035);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgb(${mix(face, "255,255,255", 0.15)})`;
    ctx.beginPath(); ctx.ellipse(bx, by - 0.04, 0.045, 0.025, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  const setup = useCanvasSetup({ overlay: options.overlay, collide: options.collide, onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
