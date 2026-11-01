import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity, glowSprite } from "../../runtime/fx";
import { hexToRgba } from "../../utils/color";

export interface Beam {
  /** Entry point on the top edge (left edge of the shaft). */
  ax: number;
  ay: number;
  /** Unit direction down the shaft. */
  dx: number;
  dy: number;
  /** Unit lateral axis (across the shaft). */
  nx: number;
  ny: number;
  width: number;
  length: number;
  /** Widening along the length (light spreads). */
  spread: number;
}

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  tw: number;
  twSpeed: number;
}

export interface UseSunbeamDustOptions {
  color: string;
  backgroundColor: string;
  beams: number;
  angle: number;
  intensity: number;
  dustCount: number;
  dustSize: number;
  speed: number;
  windowX: number;
  windowWidth: number;
  interactive: boolean;
  overlay: boolean;
}

/** Window panes as light shafts slanting down from the top edge. */
export function makeBeams(w: number, h: number, count: number, angleDeg: number, windowX: number, windowWidth: number): Beam[] {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(a), dy = Math.cos(a);
  const nx = Math.cos(a), ny = -Math.sin(a);
  const span = w * windowWidth;
  const start = w * windowX - span / 2;
  const n = Math.max(1, count);
  const pane = span / n;
  const gap = pane * 0.14; // mullion shadow between panes
  const length = (h / Math.max(0.2, dy)) * 1.15;
  return Array.from({ length: n }, (_, i) => ({
    ax: start + i * pane + gap / 2,
    ay: 0,
    dx, dy, nx, ny,
    width: (pane - gap) * Math.cos(a),
    length,
    spread: 0.35,
  }));
}

/** Light reaching (x, y): soft-edged shafts that fade with distance. 0..~1. */
export function beamIntensity(x: number, y: number, beams: Beam[]): number {
  let total = 0;
  for (const b of beams) {
    const px = x - b.ax, py = y - b.ay;
    const along = px * b.dx + py * b.dy;
    if (along < 0 || along > b.length) continue;
    const lat = px * b.nx + py * b.ny;
    const width = b.width * (1 + b.spread * (along / b.length));
    if (lat < 0 || lat > width) continue;
    const u = lat / width; // 0..1 across
    const edge = Math.min(1, Math.min(u, 1 - u) / 0.18); // feathered edges
    total += edge * (1 - 0.65 * (along / b.length));
  }
  return Math.min(1, total);
}

export function useSunbeamDust(options: UseSunbeamDustOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const motesRef = useRef<Mote[]>([]);
  const beamsRef = useRef<Beam[]>([]);
  const keyRef = useRef("");
  const timeRef = useRef(0);
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const velocity = useRef(createVelocity()).current;
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function makeMote(w: number, h: number): Mote {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      size: 0.5 + Math.random() * Math.random() * 1.6,
      tw: Math.random() * Math.PI * 2,
      twSpeed: 0.6 + Math.random() * 2.2,
    };
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    const bk = `${w}|${h}|${o.beams}|${o.angle}|${o.windowX}|${o.windowWidth}`;
    if (keyRef.current !== bk) {
      keyRef.current = bk;
      beamsRef.current = makeBeams(w, h, o.beams, o.angle, o.windowX, o.windowWidth);
    }
    const beams = beamsRef.current;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Clouds drifting past the sun: slow, layered breathing
    const sun = (0.78 + 0.22 * Math.sin(t * 0.13) * Math.sin(t * 0.071 + 1.3)) * o.intensity;

    // Shafts: three nested passes give a soft falloff without blur filters
    const prevOp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    for (const b of beams) {
      for (const [scale, a] of [[1, 0.05], [0.78, 0.06], [0.52, 0.07]] as const) {
        const inset = (1 - scale) / 2;
        const w0 = b.width, w1 = b.width * (1 + b.spread);
        const l0 = w0 * inset, l1 = w1 * inset;
        const ex = b.ax + b.dx * b.length, ey = b.ay + b.dy * b.length;
        const g = ctx.createLinearGradient(b.ax, b.ay, ex, ey);
        g.addColorStop(0, hexToRgba(o.color, a * sun));
        g.addColorStop(0.6, hexToRgba(o.color, a * sun * 0.45));
        g.addColorStop(1, hexToRgba(o.color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(b.ax + b.nx * l0, b.ay + b.ny * l0);
        ctx.lineTo(b.ax + b.nx * (l0 + w0 * scale), b.ay + b.ny * (l0 + w0 * scale));
        ctx.lineTo(ex + b.nx * (l1 + w1 * scale), ey + b.ny * (l1 + w1 * scale));
        ctx.lineTo(ex + b.nx * l1, ey + b.ny * l1);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Dust
    const target = Math.max(0, Math.ceil(o.dustCount * frame.quality));
    const motes = motesRef.current;
    while (motes.length < target) motes.push(makeMote(w, h));
    if (motes.length > target) motes.length = target;

    const p = readPointer(pointer.current, canvasEl.current);
    const v = velocity(p, k);
    const stir = o.interactive && p.inside;
    const R = 140;

    if (spriteRef.current.color !== o.color) {
      spriteRef.current = { color: o.color, img: glowSprite(o.color, 32) };
    }
    const sprite = spriteRef.current.img;
    const relax = 1 - Math.pow(0.97, k);

    for (const m of motes) {
      // Slow convection: divergence-free swirl from a stream function
      const a1 = m.x * 0.004 + t * 0.09;
      const b1 = m.y * 0.005 - t * 0.06;
      const fx = -Math.sin(a1) * Math.sin(b1) * 0.6;
      const fy = -Math.cos(a1) * Math.cos(b1) * 0.5 - 0.04;
      m.vx += (fx * o.speed * 0.35 - m.vx) * relax + (Math.random() - 0.5) * 0.02 * k;
      m.vy += (fy * o.speed * 0.35 - m.vy) * relax + (Math.random() - 0.5) * 0.02 * k;

      if (stir) {
        const dx = m.x - p.x, dy = m.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < R) {
          const f = (1 - d / R) * (1 - d / R);
          // Wake: drag along the cursor's motion, plus a curl around it
          m.vx += (v.vx * 0.05 - (dy / (d || 1)) * Math.hypot(v.vx, v.vy) * 0.03) * f * k;
          m.vy += (v.vy * 0.05 + (dx / (d || 1)) * Math.hypot(v.vx, v.vy) * 0.03) * f * k;
        }
      }

      m.x += m.vx * k;
      m.y += m.vy * k;
      if (m.x < -5) m.x += w + 10;
      if (m.x > w + 5) m.x -= w + 10;
      if (m.y < -5) m.y += h + 10;
      if (m.y > h + 5) m.y -= h + 10;

      // Tyndall effect: dust only shows where the light hits it
      const lit = beamIntensity(m.x, m.y, beams);
      m.tw += m.twSpeed * dt * 0.001;
      const b = lit * sun * (0.55 + 0.45 * Math.sin(m.tw)) + 0.03;
      if (b < 0.04) continue;
      const s = o.dustSize * m.size * (1.6 + lit);
      if (sprite) {
        ctx.globalAlpha = Math.min(1, b);
        ctx.drawImage(sprite, m.x - s * 2, m.y - s * 2, s * 4, s * 4);
      } else {
        ctx.globalAlpha = Math.min(1, b);
        ctx.fillStyle = o.color;
        ctx.fillRect(m.x - s / 2, m.y - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = prevOp;
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onResize: (w, h) => {
      motesRef.current = Array.from({ length: optionsRef.current.dustCount }, () => makeMote(w, h));
    },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
