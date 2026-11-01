import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { sampleGradient } from "../../utils/color";

export interface Moth {
  x: number;
  y: number;
  heading: number;
  speed: number;
  /** Fixed angle (rad) the moth tries to keep between its heading and the light. */
  alpha: number;
  /** Which side the light is kept on: +1 / -1. */
  side: number;
  flap: number;
  size: number;
  /** ms left fleeing after bumping the light (ignores it meanwhile). */
  escape: number;
  seed: number;
}

export interface UseMothsOptions {
  count: number;
  color: string;
  lightColor: string;
  backgroundColor: string;
  angle: number;
  speed: number;
  size: number;
  glowRadius: number;
  lightX: number;
  lightY: number;
  showLight: boolean;
  followCursor: boolean;
  overlay: boolean;
}

const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/**
 * Transverse orientation: moths navigate by holding a light source at a fixed
 * angle. For the distant moon that's a straight line; for a nearby lamp it
 * bends the path into a spiral (alpha < 90°: in, = 90°: orbit, > 90°: out).
 * k = dt / 16.67.
 */
export function steerMoth(m: Moth, lx: number, ly: number, k: number, speedMul = 1, turnRate = 0.12): void {
  const bearing = Math.atan2(ly - m.y, lx - m.x);
  const desired = bearing - m.side * m.alpha;
  const diff = wrapAngle(desired - m.heading);
  const maxTurn = turnRate * k;
  m.heading += Math.max(-maxTurn, Math.min(maxTurn, diff));
  m.x += Math.cos(m.heading) * m.speed * speedMul * k;
  m.y += Math.sin(m.heading) * m.speed * speedMul * k;
}

export function useMoths(options: UseMothsOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const mothsRef = useRef<Moth[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const lightRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function makeMoth(): Moth {
    const { w, h } = sizeRef.current;
    const o = optionsRef.current;
    const a = Math.random() * Math.PI * 2;
    const r = Math.min(w, h) * (0.12 + Math.random() * 0.45);
    return {
      x: w * o.lightX + Math.cos(a) * r,
      y: h * o.lightY + Math.sin(a) * r,
      heading: Math.random() * Math.PI * 2,
      speed: 1.6 + Math.random() * 1.4,
      alpha: 0,
      side: Math.random() < 0.5 ? 1 : -1,
      flap: Math.random() * Math.PI * 2,
      size: 0.75 + Math.random() * 0.5,
      escape: 0,
      seed: Math.random() * 1000,
    };
  }

  function drawMoth(ctx: CanvasRenderingContext2D, m: Moth, fill: string, alpha: number, s: number) {
    const open = 0.35 + 0.65 * Math.abs(Math.sin(m.flap));
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.heading + Math.PI / 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    // Forewings + hindwings, top-down; flapping narrows the span
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.2);
      ctx.quadraticCurveTo(side * s * 1.6 * open, -s * 1.1, side * s * 1.5 * open, s * 0.1);
      ctx.quadraticCurveTo(side * s * 0.9 * open, s * 0.25, 0, s * 0.15);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, s * 0.1);
      ctx.quadraticCurveTo(side * s * 1.05 * open, s * 0.3, side * s * 0.75 * open, s * 0.95);
      ctx.quadraticCurveTo(side * s * 0.3 * open, s * 0.9, 0, s * 0.55);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(0, s * 0.2, s * 0.16, s * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Light: eases toward the cursor, rests at the lamp position otherwise
    const p = readPointer(pointer.current, canvasEl.current);
    const L = lightRef.current;
    const tx = o.followCursor && p.inside ? p.x : w * o.lightX;
    const ty = o.followCursor && p.inside ? p.y : h * o.lightY;
    const ease = 1 - Math.pow(0.82, k);
    L.x += (tx - L.x) * ease;
    L.y += (ty - L.y) * ease;
    const flicker = 0.92 + 0.05 * Math.sin(t * 11) + 0.03 * Math.sin(t * 23.7);

    if (spriteRef.current.color !== o.lightColor) {
      spriteRef.current = { color: o.lightColor, img: glowSprite(o.lightColor, 128) };
    }
    const sprite = spriteRef.current.img;
    if (o.showLight && sprite) {
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "lighter";
      const R = o.glowRadius * flicker;
      ctx.globalAlpha = 0.55;
      ctx.drawImage(sprite, L.x - R * 2, L.y - R * 2, R * 4, R * 4);
      ctx.globalAlpha = 0.9;
      ctx.drawImage(sprite, L.x - R * 0.35, L.y - R * 0.35, R * 0.7, R * 0.7);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = prev;
    }

    // Taps scatter everyone
    for (const tap of p.taps) {
      for (const m of mothsRef.current) {
        if (Math.hypot(m.x - tap.x, m.y - tap.y) < 220) {
          m.escape = 500 + Math.random() * 900;
          m.heading = Math.atan2(m.y - tap.y, m.x - tap.x) + (Math.random() - 0.5);
        }
      }
    }

    const target = o.count > 0 ? Math.max(1, Math.ceil(o.count * frame.quality)) : 0;
    const moths = mothsRef.current;
    while (moths.length < target) moths.push(makeMoth());
    if (moths.length > target) moths.length = target;

    const baseAlpha = (o.angle * Math.PI) / 180;
    const diag = Math.hypot(w, h);

    for (const m of moths) {
      // Each moth's angle wanders a little around the set angle: messy, lifelike orbits
      m.alpha = baseAlpha + Math.sin(t * 0.7 + m.seed) * 0.18;
      m.flap += (0.55 + m.speed * 0.12) * k;
      const sp = m.speed * o.speed;

      if (m.escape > 0) {
        m.escape -= dt;
        m.heading += (Math.random() - 0.5) * 0.3 * k;
        m.x += Math.cos(m.heading) * sp * 1.5 * k;
        m.y += Math.sin(m.heading) * sp * 1.5 * k;
      } else {
        steerMoth(m, L.x, L.y, k, o.speed);
        m.heading += (Math.random() - 0.5) * 0.35 * k; // flutter
        if (Math.hypot(m.x - L.x, m.y - L.y) < 10) {
          // Bump the bulb, bounce off
          m.escape = 250 + Math.random() * 700;
          m.heading += Math.PI + (Math.random() - 0.5) * 1.2;
        }
      }

      // Lost moths drift back in from the edge
      if (Math.hypot(m.x - L.x, m.y - L.y) > diag) Object.assign(m, makeMoth());
    }

    // Lit near the light, silhouettes far from it
    const bg = sampleGradient([o.backgroundColor], 0);
    for (const m of moths) {
      const d = Math.hypot(m.x - L.x, m.y - L.y);
      const lit = Math.max(0, 1 - d / (o.glowRadius * 3));
      const c = sampleGradient([o.color, o.lightColor], lit * 0.6);
      const tt = 0.35 + 0.65 * lit;
      const fill = `rgb(${(bg[0] + (c[0] - bg[0]) * tt) | 0},${(bg[1] + (c[1] - bg[1]) * tt) | 0},${(bg[2] + (c[2] - bg[2]) * tt) | 0})`;
      drawMoth(ctx, m, fill, 0.55 + 0.45 * lit, o.size * m.size);
    }
    ctx.globalAlpha = 1;
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onResize: (w, h) => {
      sizeRef.current = { w, h };
      const o = optionsRef.current;
      lightRef.current = { x: w * o.lightX, y: h * o.lightY };
      mothsRef.current = Array.from({ length: o.count }, makeMoth);
    },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
