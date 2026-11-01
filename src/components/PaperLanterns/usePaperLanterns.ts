import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { hexToRgba } from "../../utils/color";

export interface Lantern {
  x: number;
  y: number;
  /** Depth 0.3 (far) .. 1 (near): size, speed, brightness. */
  z: number;
  vx: number;
  vy: number;
  sway: number;
  swayVel: number;
  phase: number;
  seed: number;
  /** 0..1 fade-in after release. */
  born: number;
}

export interface UsePaperLanternsOptions {
  count: number;
  color: string;
  glowColor: string;
  backgroundColor: string;
  size: number;
  riseSpeed: number;
  wind: number;
  autoRelease: boolean;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

export interface LanternEnv {
  t: number;
  wind: number;
  rise: number;
}

/**
 * Buoyancy against drag: vertical velocity relaxes to a depth-scaled terminal
 * rise speed, horizontal velocity to the drifting wind. The paper body swings
 * on a damped spring driven by the horizontal drift. k = dt / 16.67.
 */
export function stepLantern(l: Lantern, env: LanternEnv, k: number): void {
  const ay = 1 - Math.pow(0.985, k);
  const ax = 1 - Math.pow(0.98, k);
  const terminal = -env.rise * (0.35 + 0.65 * l.z);
  l.vy += (terminal - l.vy) * ay;
  const drift = env.wind * (0.4 + 0.6 * l.z) + Math.sin(env.t * 0.45 + l.phase) * 0.28 * l.z;
  l.vx += (drift - l.vx) * ax;
  l.x += l.vx * k;
  l.y += l.vy * k;
  const target = l.vx * 0.12 + Math.sin(env.t * 1.3 + l.seed) * 0.03;
  l.swayVel += (-0.03 * (l.sway - target) - 0.06 * l.swayVel) * k;
  l.sway += l.swayVel * k;
  // Receding into the sky: far lanterns slowly shrink
  l.z = Math.max(0.18, l.z - 0.00012 * k);
}

export function usePaperLanterns(options: UsePaperLanternsOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const lanternsRef = useRef<Lantern[]>([]);
  const timeRef = useRef(0);
  const releaseAccRef = useRef(0);
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function make(x: number, y: number, z: number): Lantern {
    return {
      x, y, z,
      vx: 0,
      vy: -0.1,
      sway: (Math.random() - 0.5) * 0.2,
      swayVel: 0,
      phase: Math.random() * Math.PI * 2,
      seed: Math.random() * 1000,
      born: 0,
    };
  }

  function drawLantern(ctx: CanvasRenderingContext2D, l: Lantern, o: UsePaperLanternsOptions, t: number, sprite: HTMLCanvasElement | null, fade: number) {
    const s = o.size * l.z;
    const flick = 0.82 + 0.1 * Math.sin(t * 13 + l.seed) + 0.08 * Math.sin(t * 7.3 + l.seed * 2.1);
    const a = fade * (0.35 + 0.65 * l.z);

    // Halo (additive)
    if (sprite) {
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "lighter";
      const R = s * 3.2 * flick;
      ctx.globalAlpha = 0.42 * a;
      ctx.drawImage(sprite, l.x - R, l.y - R * 0.85, R * 2, R * 2);
      ctx.globalCompositeOperation = prev;
    }

    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.sway);
    ctx.globalAlpha = a;

    const top = -s * 0.7, bot = s * 0.62;
    const wt = s * 0.5, wb = s * 0.4;
    // Paper body: lit from the flame at the bottom
    const g = ctx.createLinearGradient(0, bot, 0, top);
    g.addColorStop(0, hexToRgba(o.glowColor, 1));
    g.addColorStop(0.45, hexToRgba(o.color, 0.95));
    g.addColorStop(1, hexToRgba(o.color, 0.7));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-wt, top);
    ctx.quadraticCurveTo(0, top - s * 0.12, wt, top);
    ctx.quadraticCurveTo(wt * 1.12, (top + bot) / 2, wb, bot);
    ctx.quadraticCurveTo(0, bot + s * 0.08, -wb, bot);
    ctx.quadraticCurveTo(-wt * 1.12, (top + bot) / 2, -wt, top);
    ctx.fill();

    if (s > 9) {
      // Bamboo ribs
      ctx.strokeStyle = hexToRgba(o.color, 0.35);
      ctx.lineWidth = Math.max(0.5, s * 0.03);
      ctx.beginPath();
      for (const f of [-0.5, 0, 0.5]) {
        ctx.moveTo(wt * f, top);
        ctx.lineTo(wb * f, bot);
      }
      ctx.stroke();
      // Glowing opening
      ctx.fillStyle = hexToRgba(o.glowColor, 0.9 * flick);
      ctx.beginPath();
      ctx.ellipse(0, bot, wb * 0.85, s * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
    }
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

    if (spriteRef.current.color !== o.glowColor) {
      spriteRef.current = { color: o.glowColor, img: glowSprite(o.glowColor, 96) };
    }
    const sprite = spriteRef.current.img;
    const lanterns = lanternsRef.current;
    const cap = Math.max(0, Math.ceil(o.count * frame.quality));

    // Auto release from below the frame, most of them far away
    if (o.autoRelease && cap > 0) {
      releaseAccRef.current += (dt * 0.001 * cap) / 14;
      while (releaseAccRef.current >= 1) {
        releaseAccRef.current -= 1;
        if (lanterns.length < cap) {
          const z = 0.3 + Math.pow(Math.random(), 1.8) * 0.7;
          lanterns.push(make(Math.random() * w, h + o.size * 2, z));
        }
      }
    }

    // Taps release a lantern; on a [data-otc-solid] element, from its top edge
    const p = readPointer(pointer.current, canvasEl.current);
    if (o.interactive) {
      for (const tap of p.taps) {
        const s = frame.solids.find((q) => tap.x >= q.x && tap.x <= q.x + q.w && tap.y >= q.y && tap.y <= q.y + q.h);
        const l = s ? make(s.x + s.w / 2, s.y - o.size * 0.4, 1) : make(tap.x, tap.y, 1);
        l.vy = -0.6;
        lanterns.push(l);
      }
    }

    const env = { t, wind: o.wind, rise: o.riseSpeed };
    let alive = 0;
    for (const l of lanterns) {
      stepLantern(l, env, k);
      l.born = Math.min(1, l.born + dt / 900);
      const margin = o.size * 3;
      if (l.y < -margin || l.x < -margin * 3 || l.x > w + margin * 3) continue;
      lanterns[alive++] = l;
    }
    lanterns.length = alive;

    // Far first
    lanterns.sort((a, b) => a.z - b.z);
    for (const l of lanterns) {
      const topFade = Math.min(1, (l.y + o.size * 3) / (h * 0.25));
      drawLantern(ctx, l, o, t, sprite, l.born * Math.max(0, topFade));
    }
    ctx.globalAlpha = 1;
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: (w, h) => {
      // Start mid-flight so the first frame isn't empty
      const o = optionsRef.current;
      lanternsRef.current = o.autoRelease
        ? Array.from({ length: Math.ceil(o.count * 0.6) }, () => {
            const l = make(Math.random() * w, h * (0.2 + Math.random() * 0.8), 0.3 + Math.pow(Math.random(), 1.8) * 0.7);
            l.born = 1;
            l.vy = -o.riseSpeed * (0.35 + 0.65 * l.z);
            return l;
          })
        : [];
    },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
