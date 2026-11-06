import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";
import { pickPerch } from "../Owl/useOwl";

export interface UseCatOptions {
  furColor: string;
  stripeColor: string;
  bellyColor: string;
  eyeColor: string;
  cushionColor: string;
  backgroundColor: string;
  size: number;
  followCursor: boolean;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

interface Zee { x: number; y: number; age: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Is (x, y) on the curled body? Body-local units of S, origin at the cat's feet. */
export function onCat(x: number, y: number): boolean {
  const b = ((x - 0.05) / 0.55) ** 2 + ((y + 0.27) / 0.3) ** 2 < 1;
  const head = (x + 0.4) ** 2 + (y + 0.36) ** 2 < 0.24 ** 2;
  return b || head;
}

/**
 * A cat asleep, curled nose-to-tail on a cushion. It breathes, dreams (tail tip and whiskers
 * twitch), flicks an ear at nearby movement and cracks one eye open to watch the cursor. Hover
 * slowly over it to pet it: it purrs and kneads. Tap it and it startles awake, then settles
 * back to sleep. With `collide` it naps on top of a `data-otc-solid` element instead.
 */
export function useCat(options: UseCatOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({
    t: 0, x: -1, y: -1,
    peek: 0, wake: 0, startle: 0, purr: 0, knead: 0,
    earL: 0, earR: 0, earCool: 0, nextFlick: 3,
    look: 0, lookY: 0, tail: 0, dream: 0, nextDream: 6,
    zees: [] as Zee[], zeeGap: 1.5,
  });

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;

    const fur = rgbOf(o.furColor), stripe = rgbOf(o.stripeColor), belly = rgbOf(o.bellyColor);
    const eye = rgbOf(o.eyeColor), cushion = rgbOf(o.cushionColor);
    const solid = rgbOf(o.backgroundColor, "0,0,0");

    // ---- size and bed ----
    let S = (frame.overlay ? 150 : Math.min(w * 0.7, h)) * 0.55 * clamp(o.size, 0.2, 2);
    const bed = o.collide ? pickPerch(frame.solids, w, h, S * 0.6) : null;
    let px: number, py: number;
    if (bed) {
      S = Math.min(S, bed.y / 0.7, bed.w / 1.0);
      px = clamp(bed.x + bed.w / 2, S * 0.7, w - S * 0.7);
      py = bed.y;
    } else {
      px = w / 2;
      py = h * 0.8;
      S = Math.min(S, w / 1.8, py / 0.75);
    }
    if (st.x < 0 || Math.hypot(px - st.x, py - st.y) > S * 3) { st.x = px; st.y = py; }
    st.x += (px - st.x) * Math.min(1, sec * 6);
    st.y += (py - st.y) * Math.min(1, sec * 6);
    const ox = st.x, oy = st.y;

    // ---- behaviour ----
    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, k);
    const speed = Math.hypot(vx, vy);
    const lx = (p.x - ox) / S, ly = (p.y - oy) / S; // cursor in cat units
    const hx = -0.4, hy = -0.36;
    const dHead = p.inside ? Math.hypot(lx - hx, ly - hy) : 99;
    const watching = o.followCursor && p.inside && dHead < 2.2;

    let peekT = watching ? (dHead < 1.2 ? 1 : 0.55) : 0;
    let wakeT = st.startle > 0.05 ? 1 : watching && speed > 16 && dHead < 1.3 ? 0.6 : 0;
    const petting = o.interactive && p.inside && speed < 7 && onCat(lx, ly) && st.startle < 0.2;
    st.purr += ((petting ? 1 : 0) - st.purr) * Math.min(1, sec * (petting ? 1.2 : 0.6));
    if (st.purr > 0.4) { peekT = Math.min(peekT, 0.15); wakeT = Math.min(wakeT, 0.2); } // content, eyes squeezed

    for (const tap of p.taps) {
      if (!o.interactive) break;
      const tx = (tap.x - ox) / S, ty = (tap.y - oy) / S;
      if (onCat(tx, ty)) { st.startle = 1; st.purr = 0; st.earL = st.earR = 1; }
      else if (Math.hypot(tx - hx, ty - hy) < 2.5) { if (tx < hx) st.earL = 1; else st.earR = 1; }
    }
    st.startle *= Math.exp(-sec * 0.5);

    st.peek += (peekT - st.peek) * Math.min(1, sec * (peekT > st.peek ? 3 : 1.5));
    st.wake += (wakeT - st.wake) * Math.min(1, sec * (wakeT > st.wake ? 6 : 0.8));

    // ear flicks: at nearby movement, and now and then in its sleep
    st.earCool -= sec;
    st.nextFlick -= sec;
    if (o.followCursor && p.inside && speed > 4 && dHead < 2.4 && st.earCool <= 0) {
      if (lx < hx) st.earL = 1; else st.earR = 1;
      st.earCool = 1.1;
    }
    if (st.nextFlick <= 0) { if (Math.random() < 0.5) st.earL = 1; else st.earR = 1; st.nextFlick = 3 + Math.random() * 5; }
    st.earL *= Math.exp(-sec * 5);
    st.earR *= Math.exp(-sec * 5);

    // dreams: a few seconds of twitching tail tip and whiskers
    st.nextDream -= sec;
    if (st.nextDream <= 0) { st.dream = 1; st.nextDream = 8 + Math.random() * 8; }
    st.dream *= Math.exp(-sec * 0.7);

    if (watching) { st.look += (clamp(lx - hx, -1, 1) - st.look) * Math.min(1, sec * 5); st.lookY += (clamp(ly - hy, -1, 1) - st.lookY) * Math.min(1, sec * 5); }
    else { st.look *= Math.exp(-sec * 2); st.lookY *= Math.exp(-sec * 2); }
    st.knead += sec * (st.purr > 0.5 ? 3.2 : 0);

    // zzz while deeply asleep
    const deep = st.peek < 0.1 && st.wake < 0.1 && st.purr < 0.2;
    st.zeeGap -= sec;
    if (deep && st.zeeGap <= 0) { st.zees.push({ x: -0.5, y: -0.48, age: 0 }); st.zeeGap = 2.2; }
    for (const z of st.zees) { z.age += sec; z.x -= sec * 0.05; z.y -= sec * 0.09; }
    st.zees = st.zees.filter((z) => z.age < 3.2);

    // ---- scene ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const scene = !frame.overlay && o.backgroundColor !== "transparent";
    if (scene) {
      const room = ctx.createLinearGradient(0, 0, 0, h);
      room.addColorStop(0, `rgb(${mix(solid, "0,0,0", 0.25)})`);
      room.addColorStop(0.78, `rgb(${solid})`);
      room.addColorStop(0.78, `rgb(${mix(solid, "0,0,0", 0.35)})`);
      room.addColorStop(1, `rgb(${mix(solid, "0,0,0", 0.5)})`);
      ctx.fillStyle = room;
      ctx.fillRect(0, 0, w, h);
      // moonlit window with rain on the glass
      const ww = Math.min(w, h) * 0.34, wx = w * 0.78 - ww / 2, wy = h * 0.12, wh = ww * 1.2;
      const glass = ctx.createLinearGradient(0, wy, 0, wy + wh);
      glass.addColorStop(0, "rgb(24,36,64)");
      glass.addColorStop(1, "rgb(46,62,96)");
      ctx.fillStyle = glass;
      ctx.fillRect(wx, wy, ww, wh);
      ctx.fillStyle = "rgba(230,236,255,0.85)";
      ctx.beginPath(); ctx.arc(wx + ww * 0.7, wy + wh * 0.25, ww * 0.09, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(200,215,255,0.25)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 14; i++) {
        const rx = wx + ((i * 0.618 + 0.1) % 1) * ww;
        const ry = wy + ((t * 0.15 + i * 0.37) % 1) * wh;
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx, Math.min(wy + wh, ry + 6)); ctx.stroke();
      }
      ctx.strokeStyle = `rgb(${mix(solid, "0,0,0", 0.5)})`;
      ctx.lineWidth = Math.max(2, ww * 0.04);
      ctx.strokeRect(wx, wy, ww, wh);
      ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
      // the window's light on the floor, and a warm lamp from the left
      ctx.fillStyle = "rgba(150,170,230,0.06)";
      ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx + ww * 0.6, h); ctx.lineTo(wx - ww * 0.9, h); ctx.closePath(); ctx.fill();
      const lamp = ctx.createRadialGradient(0, h * 0.35, 0, 0, h * 0.35, Math.max(w, h) * 0.7);
      lamp.addColorStop(0, "rgba(255,190,120,0.18)");
      lamp.addColorStop(1, "rgba(255,190,120,0)");
      ctx.fillStyle = lamp;
      ctx.fillRect(0, 0, w, h);
    }

    // ---- the cat, in units of S, origin under its belly ----
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(S, S);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const breathe = Math.sin(t * (st.purr > 0.3 ? 2.2 : 1.4));
    const vib = Math.sin(t * 70) * 0.003 * st.purr;

    if (!bed) { // cushion
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath(); ctx.ellipse(0, 0.1, 0.82, 0.08, 0, 0, Math.PI * 2); ctx.fill();
      const cg = ctx.createLinearGradient(0, -0.06, 0, 0.12);
      cg.addColorStop(0, `rgb(${mix(cushion, "255,255,255", 0.18)})`);
      cg.addColorStop(1, `rgb(${mix(cushion, "0,0,0", 0.45)})`);
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.ellipse(0, 0.03, 0.78, 0.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(${mix(cushion, "0,0,0", 0.4)},0.6)`; // piping and a tuft button
      ctx.lineWidth = 0.008;
      ctx.beginPath(); ctx.ellipse(0, 0.03, 0.74, 0.085, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
      ctx.fillStyle = `rgb(${mix(cushion, "0,0,0", 0.3)})`;
      ctx.beginPath(); ctx.arc(0.62, 0.05, 0.015, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath(); ctx.ellipse(0, 0.005, 0.62, 0.03, 0, 0, Math.PI * 2); ctx.fill();
    }

    ctx.translate(vib, 0);
    // body + haunch, breathing from the floor up
    ctx.save();
    ctx.scale(1, 1 + breathe * 0.025);
    const bodyPath = () => {
      ctx.beginPath();
      ctx.ellipse(0.05, -0.25, 0.53, 0.25, 0, 0, Math.PI * 2);
      ctx.moveTo(0.58, -0.33);
      ctx.arc(0.3, -0.31, 0.28, 0, Math.PI * 2);
    };
    const bg = ctx.createRadialGradient(-0.15, -0.5, 0.05, 0.1, -0.2, 0.75);
    bg.addColorStop(0, `rgb(${mix(fur, "255,230,200", 0.18)})`);
    bg.addColorStop(0.6, `rgb(${fur})`);
    bg.addColorStop(1, `rgb(${mix(fur, "0,0,0", 0.45)})`);
    ctx.fillStyle = bg;
    bodyPath(); ctx.fill();
    ctx.save();
    bodyPath(); ctx.clip();
    ctx.strokeStyle = `rgba(${stripe},0.6)`; // tabby stripes, radiating from the spine
    for (let i = 0; i < 9; i++) {
      const x = -0.34 + i * 0.105;
      ctx.lineWidth = 0.032 - (i % 2) * 0.01;
      ctx.beginPath(); ctx.moveTo(x - 0.02, -0.56); ctx.quadraticCurveTo(x + 0.06, -0.4, x - 0.01, -0.22 + Math.abs(x) * 0.15); ctx.stroke();
    }
    ctx.lineWidth = 0.03; // haunch swirl
    ctx.beginPath(); ctx.arc(0.32, -0.3, 0.14, -2.6, 0.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(0.32, -0.3, 0.06, -2.2, 1.2); ctx.stroke();
    ctx.fillStyle = `rgba(${belly},0.85)`; // pale chest under the chin
    ctx.beginPath(); ctx.ellipse(-0.3, -0.06, 0.2, 0.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.restore();

    // front paws the head rests on, kneading when purring
    for (let i = 0; i < 2; i++) {
      const kp = st.purr > 0.5 ? Math.max(0, Math.sin(st.knead * Math.PI + i * Math.PI)) * 0.025 : 0;
      const pxx = -0.5 + i * 0.13, pyy = -0.045 - kp;
      ctx.fillStyle = `rgb(${mix(belly, fur, 0.15)})`;
      ctx.beginPath(); ctx.ellipse(pxx, pyy, 0.085, 0.045, -0.1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(${mix(fur, "0,0,0", 0.4)},0.5)`;
      ctx.lineWidth = 0.006;
      for (const d of [-0.025, 0.005, 0.035]) { ctx.beginPath(); ctx.moveTo(pxx - 0.07, pyy + d * 0.6); ctx.lineTo(pxx - 0.085, pyy + d * 0.6); ctx.stroke(); }
    }

    // ---- head: tucked on the paws asleep, lifted and turned when awake ----
    const lift = st.wake * 0.13 + st.peek * 0.02;
    ctx.save();
    ctx.translate(-0.4, -0.3 - lift);
    ctx.rotate(-0.22 * (1 - st.wake) + st.look * 0.18 * st.wake + st.lookY * 0.08 * st.peek);
    const hg = ctx.createRadialGradient(-0.06, -0.12, 0.02, 0, -0.04, 0.26);
    hg.addColorStop(0, `rgb(${mix(fur, "255,230,200", 0.2)})`);
    hg.addColorStop(1, `rgb(${mix(fur, "0,0,0", 0.3)})`);

    // ears, each flicking about its base
    const back = st.startle * 0.5;
    for (const [side, flick] of [[-1, st.earL], [1, st.earR]] as const) {
      ctx.save();
      const bx = side * 0.1, by = -0.13;
      ctx.translate(bx, by);
      ctx.rotate(side * (0.15 + back) + Math.sin(flick * 18) * flick * 0.5 * side);
      ctx.fillStyle = `rgb(${mix(fur, "0,0,0", 0.12)})`;
      ctx.beginPath(); ctx.moveTo(-0.075, 0.03); ctx.lineTo(side * 0.02, -0.15); ctx.lineTo(0.075, 0.03); ctx.closePath(); ctx.fill();
      ctx.fillStyle = `rgba(${mix(belly, "220,120,130", 0.4)},0.8)`;
      ctx.beginPath(); ctx.moveTo(-0.045, 0.02); ctx.lineTo(side * 0.015, -0.11); ctx.lineTo(0.045, 0.02); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.ellipse(0, -0.02, 0.2, 0.17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(${stripe},0.55)`; // forehead "M"
    ctx.lineWidth = 0.014;
    ctx.beginPath(); ctx.moveTo(-0.05, -0.15); ctx.lineTo(-0.03, -0.09); ctx.lineTo(0, -0.13); ctx.lineTo(0.03, -0.09); ctx.lineTo(0.05, -0.15); ctx.stroke();
    ctx.fillStyle = `rgba(${belly},0.95)`; // muzzle
    ctx.beginPath(); ctx.ellipse(-0.035, 0.06, 0.055, 0.04, 0, 0, Math.PI * 2); ctx.ellipse(0.035, 0.06, 0.055, 0.04, 0, 0, Math.PI * 2); ctx.fill();

    // eyes: closed crescents asleep; the near one cracks open to watch, both open when awake
    const open = [Math.max(st.peek * 0.6, st.wake), Math.max(st.peek > 0.8 ? (st.peek - 0.8) * 2 : 0, st.wake)];
    const pupilW = 0.006 + 0.016 * (1 - Math.min(1, st.startle + st.wake * 0.5)) + (st.peek > 0 ? 0.004 : 0);
    for (let i = 0; i < 2; i++) {
      const ex = i === 0 ? -0.075 : 0.075, ey = -0.005;
      const op = clamp(open[i], 0, 1);
      if (op < 0.08) {
        ctx.strokeStyle = `rgba(${mix(fur, "0,0,0", 0.7)},0.9)`;
        ctx.lineWidth = 0.011;
        ctx.beginPath(); ctx.moveTo(ex - 0.04, ey - 0.005); ctx.quadraticCurveTo(ex, ey + 0.022, ex + 0.04, ey - 0.005); ctx.stroke();
        continue;
      }
      const eh = 0.032 * op;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(ex - 0.042, ey);
      ctx.quadraticCurveTo(ex, ey - eh * 1.6, ex + 0.042, ey);
      ctx.quadraticCurveTo(ex, ey + eh * 1.2, ex - 0.042, ey);
      ctx.closePath();
      ctx.fillStyle = `rgb(${eye})`;
      ctx.fill();
      ctx.clip();
      const ig = ctx.createRadialGradient(ex, ey, 0.004, ex, ey, 0.04);
      ig.addColorStop(0, `rgba(${mix(eye, "255,255,200", 0.4)},1)`);
      ig.addColorStop(1, `rgba(${mix(eye, "0,0,0", 0.4)},1)`);
      ctx.fillStyle = ig;
      ctx.fillRect(ex - 0.05, ey - 0.05, 0.1, 0.1);
      const pxo = ex + clamp(st.look, -1, 1) * 0.014;
      ctx.fillStyle = "rgb(8,6,6)";
      ctx.beginPath(); ctx.ellipse(pxo, ey, pupilW, 0.04, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath(); ctx.arc(pxo - 0.012, ey - 0.012, 0.006, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(20,12,10,0.8)";
      ctx.lineWidth = 0.008;
      ctx.beginPath(); ctx.moveTo(ex - 0.042, ey); ctx.quadraticCurveTo(ex, ey - eh * 1.6, ex + 0.042, ey); ctx.stroke();
    }
    // nose, mouth, whiskers
    ctx.fillStyle = "rgb(214,128,134)";
    ctx.beginPath(); ctx.moveTo(-0.018, 0.03); ctx.lineTo(0.018, 0.03); ctx.lineTo(0, 0.05); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = `rgba(${mix(fur, "0,0,0", 0.6)},0.7)`;
    ctx.lineWidth = 0.007;
    ctx.beginPath(); ctx.moveTo(0, 0.05); ctx.lineTo(0, 0.065); ctx.quadraticCurveTo(-0.02, 0.08, -0.035, 0.068); ctx.moveTo(0, 0.065); ctx.quadraticCurveTo(0.02, 0.08, 0.035, 0.068); ctx.stroke();
    const twitch = Math.sin(t * 22) * 0.04 * st.dream;
    ctx.strokeStyle = "rgba(255,250,240,0.55)";
    ctx.lineWidth = 0.004;
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const a = (i - 1) * 0.16 + twitch;
        ctx.beginPath(); ctx.moveTo(side * 0.06, 0.06); ctx.quadraticCurveTo(side * 0.17, 0.05 + a * 0.3, side * 0.26, 0.04 + a * 0.6 + i * 0.012); ctx.stroke();
      }
    }
    ctx.restore();

    // ---- tail, wrapped around the front; tip sways, twitches in dreams, flicks when watching ----
    const sway = Math.sin(t * 0.9) * 0.03 + Math.sin(t * 13) * 0.025 * st.dream + Math.sin(t * 7) * 0.03 * (st.peek * 0.5 + st.wake);
    const tailPath = () => {
      ctx.beginPath();
      ctx.moveTo(0.55, -0.12);
      ctx.bezierCurveTo(0.6, 0.02, 0.2, 0.03, -0.05, 0.0);
      ctx.quadraticCurveTo(-0.25, -0.02, -0.33 + sway * 0.4, -0.08 + sway);
    };
    ctx.strokeStyle = `rgb(${mix(fur, "0,0,0", 0.15)})`;
    ctx.lineWidth = 0.1;
    tailPath(); ctx.stroke();
    ctx.strokeStyle = `rgba(${stripe},0.65)`;
    ctx.setLineDash([0.035, 0.06]);
    ctx.lineWidth = 0.098;
    tailPath(); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = `rgb(${mix(stripe, "0,0,0", 0.2)})`;
    ctx.beginPath(); ctx.arc(-0.33 + sway * 0.4, -0.08 + sway, 0.05, 0, Math.PI * 2); ctx.fill();

    // purr: soft rings off the chest
    if (st.purr > 0.05) {
      ctx.strokeStyle = `rgba(255,236,210,${0.35 * st.purr})`;
      ctx.lineWidth = 0.008;
      for (let i = 0; i < 3; i++) {
        const ph = (t * 1.2 + i / 3) % 1;
        ctx.globalAlpha = 1 - ph;
        ctx.beginPath(); ctx.arc(-0.35, -0.2, 0.3 + ph * 0.25, -2.4, -1.6); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // zzz, drawn as strokes so they scale with the cat
    ctx.strokeStyle = "rgba(235,235,255,0.7)";
    ctx.lineWidth = 0.012;
    for (const z of st.zees) {
      const a = Math.min(1, z.age * 2) * (1 - z.age / 3.2);
      const zs = 0.035 + z.age * 0.012;
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.moveTo(z.x - zs, z.y - zs); ctx.lineTo(z.x + zs, z.y - zs); ctx.lineTo(z.x - zs, z.y + zs); ctx.lineTo(z.x + zs, z.y + zs); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  const setup = useCanvasSetup({ overlay: options.overlay, collide: options.collide, onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
