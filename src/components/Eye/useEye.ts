import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

export type EyePupilShape = "round" | "slit";

export interface UseEyeOptions {
  irisColor: string;
  irisInnerColor: string;
  scleraColor: string;
  skinColor: string;
  lashColor: string;
  backgroundColor: string;
  pupilShape: EyePupilShape;
  pupilSize: number;
  eyeSize: number;
  followCursor: boolean;
  blinkInterval: number;
  showLashes: boolean;
}

interface Pt { x: number; y: number }
type Bez = [Pt, Pt, Pt, Pt];

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const toRgb = (c: string) => (c.startsWith("#") ? hexToRgbString(c) : "255,255,255");
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ease = (k: number) => k * k * (3 - 2 * k);

function bezAt([p0, p1, p2, p3]: Bez, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}
function bezTan([p0, p1, p2, p3]: Bez, t: number): Pt {
  const u = 1 - t;
  return {
    x: 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
    y: 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y),
  };
}

/** Blink closure 0..1 at `s` seconds into a blink: fast close, brief hold, slower open. */
export function blinkClosure(s: number): number {
  if (s < 0) return 0;
  if (s < 0.07) return ease(s / 0.07);
  if (s < 0.1) return 1;
  if (s < 0.27) return 1 - ease((s - 0.1) / 0.17);
  return 0;
}

/**
 * A single living eye, painted like a chiaroscuro portrait: skin falls away into darkness
 * around an almond-shaped opening. The iris is a baked texture of radial stroma fibres,
 * a pale collarette, crypts and a dark limbal ring; the pupil breathes (hippus), narrows
 * as the cursor (the light) approaches and widens when startled. The gaze moves in
 * saccades with tiny microsaccades, the upper lid rides with it, the lashes follow the
 * lid through each blink, and the wet cornea holds a fixed window reflection.
 * Click to make it blink.
 */
export function useEye(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseEyeOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, t = 0;

    // per-lash and per-vein randomness, stable across frames
    let seed = 9;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const upperLashes = Array.from({ length: 38 }, (_, i) => ({ t: 0.08 + (i / 37) * 0.88 + (rnd() - 0.5) * 0.02, len: 0.85 + rnd() * 0.3, curl: 0.7 + rnd() * 0.6, tilt: (rnd() - 0.5) * 0.18 }));
    const lowerLashes = Array.from({ length: 24 }, (_, i) => ({ t: 0.22 + (i / 23) * 0.72 + (rnd() - 0.5) * 0.02, len: 0.7 + rnd() * 0.5, tilt: (rnd() - 0.5) * 0.2 }));
    const veins = Array.from({ length: 12 }, () => {
      const inner = rnd() < 0.5;
      const y0 = (rnd() - 0.5) * 0.7;
      const pts: Pt[] = [];
      let x = inner ? -1 : 1, y = y0;
      const n = 5 + Math.floor(rnd() * 4);
      for (let k = 0; k < n; k++) {
        pts.push({ x, y });
        x += (inner ? 1 : -1) * (0.05 + rnd() * 0.06);
        y += (rnd() - 0.5) * 0.18;
      }
      return { pts, a: 0.06 + rnd() * 0.09, w: 0.5 + rnd() * 0.6 };
    });

    // live state
    const mouse = { x: 0, y: 0, active: false };
    const gaze = { x: 0, y: 0, fx: 0, fy: 0, since: 0, nextIdle: 0.8, nextMicro: 0.6 };
    let pupil = optionsRef.current.pupilSize;
    let startle = 0;
    let blinkAt = -1, blinkGap = 2, doubleQueued = false;

    // iris texture, rebaked when its size or colours change
    let irisTex: HTMLCanvasElement | null = null;
    let irisKey = "";

    function bakeIris(R: number, iris: string, inner: string) {
      irisKey = `${R}|${dpr}|${iris}|${inner}`;
      const S = Math.max(2, Math.ceil(R * 2 * dpr));
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const g = c.getContext("2d");
      if (!g || typeof g.createRadialGradient !== "function") { irisTex = null; return; }
      let s = 5;
      const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
      g.scale(S / (2 * R), S / (2 * R));
      g.translate(R, R);

      const base = g.createRadialGradient(0, 0, 0, 0, 0, R);
      base.addColorStop(0, `rgb(${mix(inner, "0,0,0", 0.35)})`);
      base.addColorStop(0.3, `rgb(${inner})`);
      base.addColorStop(0.48, `rgb(${mix(inner, iris, 0.55)})`);
      base.addColorStop(0.62, `rgb(${iris})`);
      base.addColorStop(0.86, `rgb(${mix(iris, "0,0,0", 0.28)})`);
      base.addColorStop(0.96, `rgb(${mix(iris, "0,0,0", 0.72)})`);
      base.addColorStop(1, `rgba(${mix(iris, "0,0,0", 0.8)},0)`);
      g.fillStyle = base;
      g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
      g.save();
      g.beginPath(); g.arc(0, 0, R * 0.97, 0, Math.PI * 2); g.clip();

      // stroma: radial fibres, pale and dark, gently wavy
      g.lineCap = "round";
      for (let i = 0; i < 360; i++) {
        const a = r() * Math.PI * 2;
        const r0 = R * (0.16 + r() * 0.16), r1 = R * (0.72 + r() * 0.26);
        const bend = (r() - 0.5) * 0.12;
        const pale = r() < 0.55;
        const col = pale ? mix(r() < 0.5 ? inner : iris, "255,255,255", 0.15 + r() * 0.2) : mix(iris, "0,0,0", 0.5);
        g.strokeStyle = `rgba(${col},${pale ? 0.08 + r() * 0.14 : 0.16 + r() * 0.2})`;
        g.lineWidth = R * (0.004 + r() * 0.01);
        const am = a + bend, rm = (r0 + r1) / 2;
        g.beginPath();
        g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
        g.quadraticCurveTo(Math.cos(am) * rm, Math.sin(am) * rm, Math.cos(a) * r1, Math.sin(a) * r1);
        g.stroke();
      }
      // collarette: the pale zig-zag ring around the pupil zone
      g.beginPath();
      for (let i = 0; i <= 56; i++) {
        const a = (i / 56) * Math.PI * 2;
        const rr = R * (0.42 + (i % 2 ? 0.035 : -0.02) + (r() - 0.5) * 0.03);
        if (i) g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      g.closePath();
      g.fillStyle = `rgba(${mix(inner, "255,255,255", 0.15)},0.18)`;
      g.fill();
      g.strokeStyle = `rgba(${mix(inner, "255,255,255", 0.3)},0.55)`;
      g.lineWidth = R * 0.022;
      g.stroke();
      // crypts: small dark hollows, radially stretched
      for (let i = 0; i < 26; i++) {
        const a = r() * Math.PI * 2, rr = R * (0.47 + r() * 0.34);
        g.save();
        g.translate(Math.cos(a) * rr, Math.sin(a) * rr);
        g.rotate(a);
        g.fillStyle = `rgba(${mix(iris, "0,0,0", 0.65)},${0.25 + r() * 0.2})`;
        g.beginPath();
        g.ellipse(0, 0, R * (0.025 + r() * 0.035), R * (0.012 + r() * 0.016), 0, 0, Math.PI * 2);
        g.fill();
        g.restore();
      }
      // contraction furrows near the rim
      g.strokeStyle = `rgba(${mix(iris, "0,0,0", 0.6)},0.16)`;
      g.lineWidth = R * 0.008;
      for (const k of [0.7, 0.79, 0.87]) {
        const a0 = r() * Math.PI * 2;
        g.beginPath();
        g.arc(0, 0, R * k, a0, a0 + Math.PI * (0.8 + r() * 0.9));
        g.stroke();
      }
      // a few freckles of pigment
      for (let i = 0; i < 4; i++) {
        const a = r() * Math.PI * 2, rr = R * (0.5 + r() * 0.3);
        g.fillStyle = `rgba(${mix(inner, "110,55,20", 0.5)},0.45)`;
        g.beginPath(); g.arc(Math.cos(a) * rr, Math.sin(a) * rr, R * (0.015 + r() * 0.02), 0, Math.PI * 2); g.fill();
      }
      g.restore();
      // limbal ring
      g.strokeStyle = `rgba(${mix(iris, "0,0,0", 0.82)},0.55)`;
      g.lineWidth = R * 0.07;
      g.beginPath(); g.arc(0, 0, R * 0.955, 0, Math.PI * 2); g.stroke();
      irisTex = c;
    }

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      w = width; h = height;
      irisKey = "";
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    // the eye watches the cursor anywhere on the page, not only over the canvas
    function onMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    }
    function onLeave() { mouse.active = false; }
    function onClick() {
      blinkAt = t;
      startle = 1;
    }
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);

    let raf = 0, last = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      if (w === 0) return;
      const o = optionsRef.current;

      const iris = toRgb(o.irisColor), inner = toRgb(o.irisInnerColor);
      const sclera = toRgb(o.scleraColor), skin = toRgb(o.skinColor), lash = toRgb(o.lashColor);

      // geometry: an almond opening, inner corner (left) a touch lower than the outer
      const cx = w / 2, cy = h * 0.52;
      const a = Math.max(10, Math.min(w * 0.4, h * 0.62) * clamp(o.eyeSize, 0.2, 1.5));
      const b = a * 0.46;
      const R = a * 0.43;
      const maxGx = a * 0.48, maxGy = b * 0.38;

      // gaze: hold a fixation, jump (saccade) when the target moves away from it
      const tracking = o.followCursor && mouse.active;
      gaze.since += dt;
      if (tracking) {
        const tx = maxGx * Math.tanh((mouse.x - cx) / (a * 1.2));
        const ty = maxGy * Math.tanh((mouse.y - cy) / (a * 0.9));
        if (Math.hypot(tx - gaze.fx, ty - gaze.fy) > R * 0.1 && gaze.since > 0.12) {
          gaze.fx = tx; gaze.fy = ty; gaze.since = 0;
        }
      } else {
        gaze.nextIdle -= dt;
        if (gaze.nextIdle <= 0) {
          const centre = Math.random() < 0.35;
          gaze.fx = centre ? 0 : (Math.random() * 2 - 1) * maxGx * 0.75;
          gaze.fy = centre ? 0 : (Math.random() * 2 - 1) * maxGy * 0.6;
          gaze.nextIdle = 1.2 + Math.random() * 2.3;
          gaze.since = 0;
        }
      }
      gaze.nextMicro -= dt;
      if (gaze.nextMicro <= 0) { // microsaccade: a tiny involuntary hop
        gaze.fx += (Math.random() - 0.5) * R * 0.05;
        gaze.fy += (Math.random() - 0.5) * R * 0.05;
        gaze.nextMicro = 0.4 + Math.random() * 0.9;
      }
      gaze.fx = clamp(gaze.fx, -maxGx, maxGx);
      gaze.fy = clamp(gaze.fy, -maxGy, maxGy);
      const k = 1 - Math.exp(-dt * 30);
      gaze.x += (gaze.fx - gaze.x) * k;
      gaze.y += (gaze.fy - gaze.y) * k;

      // blinks: random interval, sometimes a double blink
      if (o.blinkInterval > 0) {
        blinkGap -= dt;
        if (blinkGap <= 0) {
          blinkAt = t;
          if (!doubleQueued && Math.random() < 0.15) { blinkGap = 0.32; doubleQueued = true; }
          else { blinkGap = (o.blinkInterval / 1000) * (0.4 + Math.random() * 1.2); doubleQueued = false; }
        }
      }
      const closed = blinkAt >= 0 ? blinkClosure(t - blinkAt) : 0;

      // pupil: breathes, narrows toward the light (cursor), widens when startled
      startle *= Math.exp(-dt * 1.6);
      const ix = cx + gaze.x, iy = cy + gaze.y;
      const near = tracking ? clamp(1 - Math.hypot(mouse.x - ix, mouse.y - iy) / (a * 1.6), 0, 1) : 0;
      const hippus = 1 + 0.03 * Math.sin(t * 1.3) + 0.015 * Math.sin(t * 3.7);
      const target = clamp(o.pupilSize, 0.08, 0.85) * (1 - 0.38 * near) * (1 + 0.4 * startle) * hippus;
      pupil += (target - pupil) * Math.min(1, dt * 3.5);
      const pr = R * clamp(pupil, 0.06, 0.88);

      // lids: the upper lid rides with the vertical gaze and drops in a blink
      const uOpen = 1 - (gaze.y / maxGy) * 0.16;
      const u = uOpen + (-0.5 - uOpen) * closed; // -0.5: shut lid rests just on the lower lid
      const v = 1 - 0.22 * closed + (gaze.y / maxGy) * 0.06;
      const L = { x: cx - a, y: cy + b * 0.08 }, Rr = { x: cx + a, y: cy - b * 0.05 };
      const upper: Bez = [L, { x: cx - a * 0.45, y: cy - b * u * 1.25 }, { x: cx + a * 0.35, y: cy - b * u * 1.3 }, Rr];
      const lower: Bez = [L, { x: cx - a * 0.35, y: cy + b * v * 0.95 }, { x: cx + a * 0.45, y: cy + b * v * 0.8 }, Rr];
      const crease: Bez = [
        { x: L.x + a * 0.06, y: L.y - b * 0.25 },
        { x: cx - a * 0.4, y: cy - b * (1.7 - closed * 0.3) },
        { x: cx + a * 0.4, y: cy - b * (1.75 - closed * 0.3) },
        { x: Rr.x + a * 0.02, y: Rr.y - b * 0.3 },
      ];
      const curve = (z: Bez, move = true) => {
        if (move) ctx.moveTo(z[0].x, z[0].y);
        ctx.bezierCurveTo(z[1].x, z[1].y, z[2].x, z[2].y, z[3].x, z[3].y);
      };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      if (o.backgroundColor && o.backgroundColor !== "transparent") {
        ctx.fillStyle = o.backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      // skin: lit from the upper left, falling away into the dark
      const face = ctx.createRadialGradient(cx - a * 0.25, cy - b * 0.9, 0, cx, cy, a * 2.2);
      face.addColorStop(0, `rgba(${mix(skin, "255,255,255", 0.1)},1)`);
      face.addColorStop(0.4, `rgba(${skin},0.95)`);
      face.addColorStop(0.75, `rgba(${mix(skin, "0,0,0", 0.45)},0.55)`);
      face.addColorStop(1, `rgba(${mix(skin, "0,0,0", 0.6)},0)`);
      ctx.fillStyle = face;
      ctx.fillRect(0, 0, w, h);
      // eye socket shadow
      const socket = ctx.createRadialGradient(cx, cy, a * 0.5, cx, cy, a * 1.35);
      socket.addColorStop(0, "rgba(0,0,0,0.28)");
      socket.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = socket;
      ctx.fillRect(0, 0, w, h);
      // upper lid: a soft sheen on the lid
      const shx = cx - a * 0.1, shy = cy - b * (1.25 - closed * 0.6), shr = a * 0.45;
      const sheen = ctx.createRadialGradient(shx, shy, 0, shx, shy, shr);
      sheen.addColorStop(0, "rgba(255,255,255,0.09)");
      sheen.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(shx - shr, shy - shr, shr * 2, shr * 2);
      // crease line and under-eye shadow
      ctx.lineCap = "round";
      for (const [lw, al] of [[0.22, 0.05], [0.1, 0.08], [0.035, 0.16]]) { // soft-edged fold
        ctx.strokeStyle = `rgba(${mix(skin, "40,10,10", 0.7)},${al})`;
        ctx.lineWidth = b * lw;
        ctx.beginPath(); curve(crease); ctx.stroke();
      }
      ctx.strokeStyle = `rgba(${mix(skin, "40,10,30", 0.6)},0.035)`;
      ctx.lineWidth = b * 0.5;
      ctx.beginPath(); ctx.moveTo(L.x + a * 0.1, L.y + b * 0.35); ctx.bezierCurveTo(cx - a * 0.3, cy + b * 1.25, cx + a * 0.4, cy + b * 1.1, Rr.x - a * 0.1, Rr.y + b * 0.35); ctx.stroke();

      // ---- the eyeball, clipped to the space between the lids ----
      ctx.save();
      ctx.beginPath(); curve(upper); ctx.lineTo(Rr.x, cy + b * 3); ctx.lineTo(L.x, cy + b * 3); ctx.closePath(); ctx.clip();
      ctx.beginPath(); curve(lower); ctx.lineTo(Rr.x, cy - b * 3); ctx.lineTo(L.x, cy - b * 3); ctx.closePath(); ctx.clip();

      const ball = ctx.createRadialGradient(cx + gaze.x * 0.3, cy + gaze.y * 0.3 - b * 0.2, 0, cx, cy, a * 1.05);
      ball.addColorStop(0, `rgb(${sclera})`);
      ball.addColorStop(0.55, `rgb(${mix(sclera, "215,170,165", 0.18)})`);
      ball.addColorStop(0.85, `rgb(${mix(mix(sclera, "200,140,135", 0.3), "0,0,0", 0.25)})`);
      ball.addColorStop(1, `rgb(${mix(sclera, "60,30,30", 0.6)})`);
      ctx.fillStyle = ball;
      ctx.fillRect(cx - a, cy - b * 1.5, a * 2, b * 3);
      // caruncle at the inner corner
      const car = ctx.createRadialGradient(L.x + a * 0.05, L.y, 0, L.x + a * 0.05, L.y, a * 0.12);
      car.addColorStop(0, "rgba(205,110,110,0.85)");
      car.addColorStop(1, "rgba(205,110,110,0)");
      ctx.fillStyle = car;
      ctx.fillRect(L.x - a * 0.1, L.y - a * 0.15, a * 0.3, a * 0.3);
      // faint veins, moving with the eyeball
      ctx.lineJoin = "round";
      for (const vn of veins) {
        ctx.strokeStyle = `rgba(175,45,45,${vn.a})`;
        ctx.lineWidth = vn.w * Math.max(0.6, a / 220);
        ctx.beginPath();
        vn.pts.forEach((p, i) => {
          const x = cx + p.x * a * 0.97 + gaze.x * 0.6, y = cy + p.y * b + gaze.y * 0.5;
          if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        });
        ctx.stroke();
      }

      // iris, foreshortened as it turns away from us
      const sx = 1 - Math.min(0.2, (Math.abs(gaze.x) / a) * 0.35);
      const sy = 1 - Math.min(0.12, (Math.abs(gaze.y) / a) * 0.35);
      ctx.save();
      ctx.translate(ix, iy);
      ctx.scale(sx, sy);
      const halo = ctx.createRadialGradient(0, 0, R * 0.9, 0, 0, R * 1.18); // shadow where the iris meets the white
      halo.addColorStop(0, "rgba(0,0,0,0.25)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(0, 0, R * 1.2, 0, Math.PI * 2); ctx.fill();
      if (irisKey !== `${R}|${dpr}|${iris}|${inner}`) bakeIris(R, iris, inner);
      if (irisTex) ctx.drawImage(irisTex, -R, -R, R * 2, R * 2);
      else {
        const ig = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
        ig.addColorStop(0, `rgb(${inner})`);
        ig.addColorStop(1, `rgb(${iris})`);
        ctx.fillStyle = ig;
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      }
      // pupillary ruff and pupil
      const slit = o.pupilShape === "slit";
      const prx = slit ? pr * 0.32 : pr, pry = slit ? R * 0.9 : pr;
      ctx.strokeStyle = `rgba(${mix(inner, "60,30,10", 0.6)},0.55)`;
      ctx.lineWidth = Math.max(0.6, pr * 0.14);
      ctx.beginPath(); ctx.ellipse(0, 0, prx * 1.05, pry * (slit ? 1 : 1.05), 0, 0, Math.PI * 2); ctx.stroke();
      ctx.save();
      ctx.scale(1, pry / prx);
      const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, prx);
      pg.addColorStop(0, "rgb(2,2,3)");
      pg.addColorStop(0.82, "rgb(6,5,6)");
      pg.addColorStop(1, "rgba(6,5,6,0)");
      ctx.fillStyle = pg;
      ctx.beginPath(); ctx.arc(0, 0, prx, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // the cornea bulges over the iris: a faint dome of light
      const dome = ctx.createRadialGradient(-R * 0.3, -R * 0.35, 0, 0, 0, R);
      dome.addColorStop(0, "rgba(255,255,255,0.1)");
      dome.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = dome;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // reflections: a window over the upper left, a small catchlight opposite
      const hx = cx + gaze.x * 0.75 - R * 0.34, hy = cy + gaze.y * 0.75 - R * 0.36;
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(-0.18);
      const win = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.26);
      win.addColorStop(0, "rgba(255,255,255,0.85)");
      win.addColorStop(0.5, "rgba(255,255,255,0.45)");
      win.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = win;
      ctx.scale(1.25, 0.9);
      ctx.beginPath(); ctx.arc(0, 0, R * 0.26, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath(); ctx.arc(cx + gaze.x * 0.75 + R * 0.3, cy + gaze.y * 0.75 + R * 0.32, Math.max(0.8, R * 0.04), 0, Math.PI * 2); ctx.fill();

      // shadow cast by the upper lid and lashes onto the eyeball
      // drawn off-canvas so only its blurred shadow lands on the eyeball (shadow units are device px)
      ctx.save();
      const off = 10000;
      ctx.translate(-off, 0);
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = b * 0.35 * dpr;
      ctx.shadowOffsetX = off * dpr;
      ctx.shadowOffsetY = b * 0.1 * dpr;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = b * 0.22;
      ctx.beginPath(); curve(upper); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = b * 0.14;
      ctx.beginPath(); curve(lower); ctx.stroke();
      // tear film along the lower lid
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = Math.max(0.6, b * 0.02);
      ctx.save();
      ctx.translate(0, -b * 0.05);
      ctx.beginPath(); curve(lower); ctx.stroke();
      ctx.restore();
      ctx.restore();

      // ---- lid margins and lashes ----
      ctx.strokeStyle = `rgba(${mix(skin, "205,120,115", 0.5)},${0.9 * (1 - closed * 0.85)})`; // lower waterline, hidden under a shut lid
      ctx.lineWidth = b * 0.035;
      ctx.beginPath(); curve(lower); ctx.stroke();
      ctx.strokeStyle = `rgba(${mix(lash, skin, 0.25)},0.95)`; // upper lash line
      ctx.lineWidth = b * 0.055;
      ctx.beginPath(); curve(upper); ctx.stroke();

      if (o.showLashes) {
        ctx.strokeStyle = `rgba(${lash},0.85)`;
        for (const l of upperLashes) {
          const p = bezAt(upper, l.t), d = bezTan(upper, l.t);
          const n = Math.atan2(-d.x, d.y); // outward (up) normal
          // lashes sweep toward the outer corner; in a blink they swing down and out
          let ang = n + (l.t - 0.35) * 0.9 + l.tilt;
          ang += (Math.PI / 2 - 0.5 - ang) * Math.pow(closed, 1.5) * 0.9;
          const len = b * (0.22 + 0.28 * Math.pow(Math.sin(Math.PI * l.t), 0.7)) * (0.75 + 0.5 * l.t) * l.len;
          const ex = p.x + Math.cos(ang) * len, ey = p.y + Math.sin(ang) * len;
          const curlA = ang - 0.6 * l.curl * (1 - closed * 0.6);
          ctx.lineWidth = Math.max(0.5, b * 0.014);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.quadraticCurveTo(p.x + Math.cos(ang + 0.25) * len * 0.6, p.y + Math.sin(ang + 0.25) * len * 0.6, ex + Math.cos(curlA) * len * 0.15, ey + Math.sin(curlA) * len * 0.15);
          ctx.stroke();
        }
        ctx.strokeStyle = `rgba(${lash},0.45)`;
        for (const l of lowerLashes) {
          const p = bezAt(lower, l.t), d = bezTan(lower, l.t);
          const ang = Math.atan2(d.x, -d.y) - (l.t - 0.4) * 0.7 + l.tilt; // outward (down) normal, leaning to the outer corner
          const len = b * 0.14 * l.len * (0.6 + 0.6 * l.t);
          ctx.lineWidth = Math.max(0.4, b * 0.013);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y + b * 0.02);
          ctx.quadraticCurveTo(p.x + Math.cos(ang) * len * 0.6, p.y + Math.sin(ang) * len * 0.6, p.x + Math.cos(ang + 0.2) * len, p.y + Math.sin(ang + 0.2) * len);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef]);
}
