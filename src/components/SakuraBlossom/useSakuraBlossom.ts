import { useRef } from "react";
import { hexToRgbString } from "../../utils/color";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { collide, anchorTo, followAnchor, type Anchor, type Solid } from "../../runtime/physics";

export interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVel: number;
  size: number;
  /** size / petalSize at spawn; size re-resolves live from it. */
  sizeMul?: number;
  alpha: number;
  settled: boolean;
  settleY: number;
  phase: number; // individual wind phase offset
  scaleY: number; // tumble flattening
  /** Set while resting on a DOM solid (position relative to the solid). */
  rest: Anchor | null;
}

export interface UseSakuraBlossomOptions {
  petalCount: number;
  petalColor: string;
  backgroundColor: string;
  gravity: number;
  windStrength: number;
  windGusts: boolean;
  showAccumulation: boolean;
  maxAccumulation: number;
  petalSize: number;
  overlay: boolean;
  collide: boolean;
  restitution: number;
}

export interface PetalEnv {
  t: number;
  wind: number;
  gravity: number;
}

/**
 * One physics step. k = dt / 16.67, so k = 1 at 60Hz.
 * At k = 1 this is exactly the pre-runtime per-frame math (tuned presets
 * unchanged); other k keeps speed constant on 120Hz / 30Hz displays.
 */
export function stepPetal(p: Petal, env: PetalEnv, k: number): void {
  const windOsc = Math.sin(env.t * 1.5 + p.phase) * env.wind * 0.5;
  p.vx += windOsc * 0.01 * k;
  p.vy += env.gravity * 0.016 * k;
  p.x += (p.vx + env.wind * 0.02) * k;
  p.y += p.vy * k;
  p.angle += (p.angularVel + Math.sin(env.t * 2 + p.phase) * 0.002) * k;
  p.scaleY = 0.6 + Math.abs(Math.sin(p.angle * 1.5)) * 0.4;
}

export function useSakuraBlossom(options: UseSakuraBlossomOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const petalsRef = useRef<Petal[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);
  const gustRef = useRef({ strength: 0, dir: 1 });

  function makePetal(atTop: boolean): Petal {
    const { petalSize } = optionsRef.current;
    const { w, h } = sizeRef.current;
    const petal: Petal = {
      x: Math.random() * w,
      y: atTop ? -petalSize - Math.random() * 80 : Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.2 + Math.random() * 0.5,
      angle: Math.random() * Math.PI * 2,
      angularVel: (Math.random() - 0.5) * 0.06,
      sizeMul: 0.7 + Math.random() * 0.6,
      size: 0, // = petalSize * sizeMul, resolved every frame
      alpha: 0.6 + Math.random() * 0.4,
      settled: false,
      settleY: 0,
      phase: Math.random() * Math.PI * 2,
      scaleY: 1,
      rest: null,
    };
    petal.size = petalSize * petal.sizeMul!;
    return petal;
  }

  function drawPetal(ctx: CanvasRenderingContext2D, p: Petal, color: string) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(1, p.scaleY);
    ctx.globalAlpha = p.alpha;

    const s = p.size;
    ctx.beginPath();
    // Teardrop / petal shape with quadratic curves
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.8, -s * 0.3, 0, s * 0.6);
    ctx.quadraticCurveTo(-s * 0.8, -s * 0.3, 0, -s);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const {
      petalCount, petalColor, backgroundColor, gravity, windStrength, windGusts,
      showAccumulation, maxAccumulation, restitution,
    } = optionsRef.current;
    const k = dt / 16.67;

    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    if (!frame.overlay) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Gust logic (per-frame odds and decay scaled by k)
    const gust = gustRef.current;
    if (windGusts) {
      if (Math.random() < 0.003 * k) {
        gust.strength = 2 + Math.random() * 3;
        gust.dir = Math.random() < 0.5 ? 1 : -1;
      }
      gust.strength *= Math.pow(0.985, k);
    }
    const wind = windStrength + gust.strength * gust.dir;
    const env: PetalEnv = { t, wind, gravity };

    // Petal budget follows the governor's quality
    const target = petalCount > 0 ? Math.max(1, Math.ceil(petalCount * frame.quality)) : 0;
    const petals = petalsRef.current;
    while (petals.length < target) petals.push(makePetal(true));
    if (petals.length > target) petals.length = target;
    for (const p of petals) if (p.sizeMul !== undefined) p.size = optionsRef.current.petalSize * p.sizeMul; // live petalSize

    const colorStr = `rgb(${hexToRgbString(petalColor)})`;

    const settled = petals.filter((p) => p.settled);
    const floorCount = settled.reduce((n, p) => n + (p.rest ? 0 : 1), 0);
    const accumulationH = showAccumulation ? Math.min(maxAccumulation, floorCount * 0.6) : 0;
    const floorY = h - accumulationH;

    const solids: readonly Solid[] = frame.solids;
    const byId = new Map(solids.map((s) => [s.id, s]));

    const recycleIfCrowded = () => {
      if (settled.length > target * 0.6) {
        const oldest = petals.find((q) => q.settled);
        if (oldest) Object.assign(oldest, makePetal(true));
      }
    };

    // Settled petals: floor pile stays put; solid-resting petals ride their solid
    // and slowly slide with the wind until they fall off an edge.
    for (const p of settled) {
      if (p.rest) {
        p.rest.offsetX += wind * 0.006 * k;
        if (!followAnchor(p, p.rest, byId)) {
          p.settled = false;
          p.rest = null;
          p.vy = 0.3;
          continue; // falls from here on, handled below
        }
      }
      drawPetal(ctx, p, colorStr);
    }

    // Falling petals
    for (const p of petals) {
      if (p.settled) continue;

      const prevX = p.x;
      const prevY = p.y;
      stepPetal(p, env, k);

      if (solids.length > 0) {
        const s = collide(p, prevX, prevY, solids, restitution);
        if (s && restitution === 0) {
          let onSolid = 0;
          for (const q of petals) if (q.rest?.solidId === s.id) onSolid++;
          const pile = showAccumulation ? Math.min(maxAccumulation, onSolid * 0.6) : 0;
          p.settled = true;
          p.rest = anchorTo(p, s, -pile - p.size * 0.3);
          p.y = s.y + p.rest.dy;
          p.settleY = p.y;
          p.angle = (Math.random() - 0.5) * 0.6;
          p.alpha *= 0.8;
          recycleIfCrowded();
          drawPetal(ctx, p, colorStr);
          continue;
        }
      }

      // Wrap horizontal
      if (p.x < -p.size) p.x = w + p.size;
      if (p.x > w + p.size) p.x = -p.size;

      // Settle when hitting floor
      if (p.y >= floorY - p.size * 0.5) {
        if (showAccumulation) {
          p.settled = true;
          p.x = Math.max(p.size, Math.min(w - p.size, p.x));
          p.y = floorY - p.size * 0.3;
          p.settleY = p.y;
          p.angle = (Math.random() - 0.5) * 0.6;
          p.alpha *= 0.8;
          recycleIfCrowded();
        } else {
          Object.assign(p, makePetal(true));
        }
      }

      drawPetal(ctx, p, colorStr);
    }
  }

  return useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: (w, h) => {
      sizeRef.current = { w, h };
      petalsRef.current = Array.from({ length: optionsRef.current.petalCount }, () => makePetal(false));
    },
    onFrame: draw,
  });
}
