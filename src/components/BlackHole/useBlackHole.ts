import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { hexToRgba, sampleGradient } from "../../utils/color";

export interface UseBlackHoleOptions {
  diskColor: string;
  backgroundColor: string;
  particleCount: number;
  gravity: number;
  eventHorizonRadius: number;
  diskWidth: number;
  jetColor: string;
  showJets: boolean;
  lensing: boolean;
  speed: number;
  interactive: boolean;
  starCount: number;
  starColor: string;
  glowingStars: boolean;
  starGlowBlur: number;
}

interface Orbiter { r: number; theta: number; heat: number; len: number }
interface Jet { d: number; side: number; life: number; wob: number }

/** Disk tilt: we see it nearly edge-on, like Gargantua. */
const TILT = 0.24;

/**
 * Relativistic beaming: gas moving toward the viewer is boosted, receding
 * gas dims. theta = orbital angle, 0 = the side swinging toward us.
 */
export function doppler(theta: number): number {
  return Math.max(0.25, 1 + 0.7 * Math.cos(theta));
}

/**
 * Point-lens deflection of a background point at distance d from the hole:
 * images are pushed outward by θE²/d. Returns null inside the shadow.
 */
export function lensOffset(d: number, einstein: number, shadow: number): number | null {
  if (d < shadow) return null;
  return d + (einstein * einstein) / Math.max(d, 1);
}

export function useBlackHole(options: UseBlackHoleOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const s = useRef({
    t: 0,
    cx: 0, cy: 0,
    orbiters: [] as Orbiter[],
    jets: [] as Jet[],
    stars: [] as { x: number; y: number; r: number; glow: boolean; tw: number }[],
    starKey: "",
    disk: { color: "", img: null as HTMLCanvasElement | null },
    jet: { color: "", img: null as HTMLCanvasElement | null },
    star: { color: "", img: null as HTMLCanvasElement | null },
  }).current;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function orbiter(o: UseBlackHoleOptions, rin: number, outer = false): Orbiter {
    const span = Math.max(20, o.diskWidth);
    const u = outer ? 0.85 + Math.random() * 0.15 : Math.pow(Math.random(), 1.4);
    return { r: rin + u * span, theta: Math.random() * Math.PI * 2, heat: Math.random(), len: 0.08 + Math.random() * 0.18 };
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = (dt / 16.67) * o.speed;
    s.t += dt * 0.001 * o.speed;

    // Singularity eases toward the cursor (only while it's over the canvas)
    const p = readPointer(pointer.current, canvasEl.current);
    const tx = o.interactive && p.inside ? p.x : w / 2;
    const ty = o.interactive && p.inside ? p.y : h / 2;
    if (s.cx === 0 && s.cy === 0) { s.cx = tx; s.cy = ty; }
    s.cx += (tx - s.cx) * (1 - Math.pow(0.94, k));
    s.cy += (ty - s.cy) * (1 - Math.pow(0.94, k));
    const cx = s.cx, cy = s.cy;

    const shadow = Math.max(6, o.eventHorizonRadius) * 1.6;   // photon-capture shadow
    const rin = shadow * 1.45;                                  // innermost stable orbit
    const einstein = shadow * 1.6;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Stars + optional lensing grid, deflected around the hole
    const sk = `${w}|${h}|${o.starCount}`;
    if (s.starKey !== sk) {
      s.starKey = sk;
      s.stars = Array.from({ length: o.starCount }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.4 + Math.random() * 1.1, glow: Math.random() < 0.15, tw: Math.random() * 6 }));
    }
    if (s.star.color !== o.starColor) s.star = { color: o.starColor, img: glowSprite(o.starColor, 32) };
    const lensPt = (x: number, y: number): [number, number] | null => {
      if (!o.lensing) return [x, y];
      const dx = x - cx, dy = y - cy;
      const d = Math.hypot(dx, dy);
      const nd = lensOffset(d, einstein, shadow);
      if (nd === null) return null;
      return [cx + (dx / (d || 1)) * nd, cy + (dy / (d || 1)) * nd];
    };
    ctx.fillStyle = o.starColor;
    for (const st of s.stars) {
      const q = lensPt(st.x, st.y);
      if (!q) continue;
      const a = 0.35 + 0.35 * Math.sin(s.t * 1.3 + st.tw);
      if (o.glowingStars && st.glow && s.star.img) {
        const g = o.starGlowBlur;
        ctx.globalAlpha = a;
        ctx.drawImage(s.star.img, q[0] - g, q[1] - g, g * 2, g * 2);
      }
      ctx.globalAlpha = a;
      ctx.fillRect(q[0] - st.r / 2, q[1] - st.r / 2, st.r, st.r);
    }
    if (o.lensing) {
      ctx.strokeStyle = hexToRgba(o.starColor, 0.05);
      ctx.lineWidth = 1;
      const step = 48;
      ctx.beginPath();
      for (let gx = 0; gx <= w; gx += step) {
        let started = false;
        for (let gy = 0; gy <= h; gy += 8) {
          const q = lensPt(gx, gy);
          if (!q) { started = false; continue; }
          if (started) ctx.lineTo(q[0], q[1]); else { ctx.moveTo(q[0], q[1]); started = true; }
        }
      }
      for (let gy = 0; gy <= h; gy += step) {
        let started = false;
        for (let gx = 0; gx <= w; gx += 8) {
          const q = lensPt(gx, gy);
          if (!q) { started = false; continue; }
          if (started) ctx.lineTo(q[0], q[1]); else { ctx.moveTo(q[0], q[1]); started = true; }
        }
      }
      ctx.globalAlpha = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Disk gas: Keplerian orbits (ω ∝ r^-1.5), slowly spiralling in
    const want = Math.ceil(o.particleCount * 2.2 * frame.quality);
    while (s.orbiters.length < want) s.orbiters.push(orbiter(o, rin));
    if (s.orbiters.length > want) s.orbiters.length = want;
    const omega0 = (o.gravity / 200) * 0.05;
    for (const ob of s.orbiters) {
      ob.theta += omega0 * Math.pow(rin / ob.r, 1.5) * k;
      ob.r -= 0.02 * (o.gravity / 200) * k;
      if (ob.r < rin) Object.assign(ob, orbiter(o, rin, true));
    }

    const hot = sampleGradient(["#ffffff", o.diskColor], 0.35);
    const disk = sampleGradient([o.diskColor], 0);
    const colorFor = (heat: number, beam: number, a: number) => {
      const c = [disk[0] + (hot[0] - disk[0]) * heat, disk[1] + (hot[1] - disk[1]) * heat, disk[2] + (hot[2] - disk[2]) * heat];
      return `rgba(${Math.min(255, c[0] * beam) | 0},${Math.min(255, c[1] * beam) | 0},${Math.min(255, c[2] * beam) | 0},${Math.min(1, a)})`;
    };
    const span = Math.max(20, o.diskWidth);
    // Streaks in 4 brightness buckets per layer: lensed halo, far half, near half
    const drawLayer = (which: "halo" | "back" | "front") => {
      const buckets: Path2D[] = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      for (const ob of s.orbiters) {
        const behind = Math.sin(ob.theta) < 0;
        if (which === "back" && !behind) continue;
        if (which === "front" && behind) continue;
        const heat = 1 - (ob.r - rin) / span;
        const beam = doppler(ob.theta);
        const b = Math.min(3, Math.floor(((heat * 0.6 + (beam - 0.25) * 0.4)) * 4));
        const path = buckets[Math.max(0, b)];
        const steps = 3;
        for (let j = 0; j <= steps; j++) {
          const a = ob.theta - ob.len * (j / steps);
          let x: number, y: number;
          if (which === "halo") {
            // Light from the far disk bent over and under the shadow: a near face-on ring
            const rl = shadow * 1.08 + (ob.r - rin) * 0.32;
            x = cx + Math.cos(a) * rl;
            y = cy + Math.sin(a) * rl;
          } else {
            x = cx + Math.cos(a) * ob.r;
            y = cy + Math.sin(a) * ob.r * TILT;
          }
          if (j === 0) path.moveTo(x, y); else path.lineTo(x, y);
        }
      }
      ctx.lineCap = "round";
      for (let b = 0; b < 4; b++) {
        const lvl = (b + 0.5) / 4;
        ctx.strokeStyle = colorFor(lvl, 0.6 + lvl * 0.9, which === "halo" ? 0.22 + lvl * 0.3 : 0.35 + lvl * 0.55);
        ctx.lineWidth = which === "halo" ? 1 : 1.1 + lvl * 0.9;
        ctx.stroke(buckets[b]);
      }
    };

    const prevOp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    if (s.disk.color !== o.diskColor) s.disk = { color: o.diskColor, img: glowSprite(o.diskColor, 128) };
    if (s.disk.img) {
      const gw = (rin + span) * 2.4;
      ctx.globalAlpha = 0.28;
      ctx.drawImage(s.disk.img, cx - gw / 2, cy - gw * TILT * 0.9, gw, gw * TILT * 1.8);
      ctx.globalAlpha = 1;
    }
    drawLayer("back");
    drawLayer("halo");
    ctx.globalCompositeOperation = prevOp;

    // Shadow + photon ring
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(cx, cy, shadow, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = colorFor(1, 1.4, 0.85);
    ctx.lineWidth = Math.max(1, shadow * 0.04);
    ctx.shadowColor = o.diskColor;
    ctx.shadowBlur = shadow * 0.3;
    ctx.beginPath();
    ctx.arc(cx, cy, shadow * 1.02, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    drawLayer("front");

    // Polar jets: helical streams along the spin axis
    if (o.showJets) {
      if (s.jet.color !== o.jetColor) s.jet = { color: o.jetColor, img: glowSprite(o.jetColor, 32) };
      if (Math.random() < 0.9 * k * frame.quality) {
        for (const side of [-1, 1]) s.jets.push({ d: shadow * 0.6, side, life: 1, wob: Math.random() * 6 });
      }
      let alive = 0;
      for (const j of s.jets) {
        j.d += (3 + j.d * 0.012) * k;
        j.life -= 0.008 * k;
        if (j.life <= 0 || j.d > Math.max(w, h)) continue;
        s.jets[alive++] = j;
        if (!s.jet.img) continue;
        const x = cx + Math.sin(j.d * 0.03 + j.wob) * (2 + j.d * 0.05);
        const y = cy + j.side * j.d;
        const sz = 3 + j.d * 0.05;
        ctx.globalAlpha = j.life * 0.5;
        ctx.drawImage(s.jet.img, x - sz, y - sz, sz * 2, sz * 2);
      }
      s.jets.length = alive;
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = prevOp;
  }

  const setup = useCanvasSetup({
    onResize: () => { s.cx = 0; s.cy = 0; s.starKey = ""; },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
