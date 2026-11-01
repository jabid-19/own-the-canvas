import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity, glowSprite } from "../../runtime/fx";
import { hexToRgba } from "../../utils/color";

export interface UseIncenseSmokeOptions {
  sticks: number;
  color: string;
  emberColor: string;
  stickColor: string;
  backgroundColor: string;
  turbulence: number;
  rise: number;
  thickness: number;
  interactive: boolean;
  overlay: boolean;
}

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
}

interface Stream {
  stick: number;
  offset: number;
  puffs: Puff[];
  acc: number;
}

/**
 * Divergence-free swirl from a stream function ψ: u = ∂ψ/∂y, v = -∂ψ/∂x.
 * Incompressible like real air, so smoke curls instead of bunching up.
 */
export function curl(x: number, y: number, t: number): [number, number] {
  const k1 = 0.011, k2 = 0.017, k3 = 0.023, k4 = 0.009;
  const a = k1 * x + t * 0.4, b = k2 * y - t * 0.55;
  const c = k3 * x - t * 0.3 + 1.3, d = k4 * y + t * 0.35;
  // ψ = sin(a)cos(b) + 0.6 sin(c)sin(d)
  const u = -k2 * Math.sin(a) * Math.sin(b) + 0.6 * k4 * Math.sin(c) * Math.cos(d);
  const v = -(k1 * Math.cos(a) * Math.cos(b) + 0.6 * k3 * Math.cos(c) * Math.sin(d));
  return [u * 85, v * 85];
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const LIFE = 7000;
const EMIT_PER_SEC = 45;

export function useIncenseSmoke(options: UseIncenseSmokeOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const streamsRef = useRef<Stream[]>([]);
  const timeRef = useRef(0);
  const keyRef = useRef(-1);
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const velocity = useRef(createVelocity()).current;
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function stickTip(i: number, n: number, w: number, h: number) {
    const x = n === 1 ? w * 0.5 : w * (0.3 + (0.4 * i) / (n - 1));
    const len = Math.min(h * 0.32, 220);
    return { x, y: h - len, base: h };
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    if (keyRef.current !== o.sticks) {
      keyRef.current = o.sticks;
      streamsRef.current = [];
      for (let s = 0; s < o.sticks; s++) {
        for (const offset of [-1.5, 0, 1.6]) streamsRef.current.push({ stick: s, offset, puffs: [], acc: 0 });
      }
    }

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    const p = readPointer(pointer.current, canvasEl.current);
    const v = velocity(p, k);
    const stir = o.interactive && p.inside;
    const R = 110;
    const relax = 1 - Math.pow(0.92, k);

    for (const st of streamsRef.current) {
      const tip = stickTip(st.stick, o.sticks, w, h);
      // Emit: a continuous filament, one puff at a time
      st.acc += dt * 0.001 * EMIT_PER_SEC * (0.5 + 0.5 * frame.quality);
      while (st.acc >= 1) {
        st.acc -= 1;
        st.puffs.push({ x: tip.x + st.offset, y: tip.y - 2, vx: 0, vy: -0.6, age: 0 });
      }
      let alive = 0;
      for (const q of st.puffs) {
        q.age += dt;
        // Laminar near the ember, turbulent higher up: the classic plume transition
        const height = tip.y - q.y;
        const turb = o.turbulence * (0.06 + 1.3 * smooth(15, Math.max(80, tip.y * 0.5), height));
        const [cu, cv] = curl(q.x + st.stick * 300 + st.offset * 90, q.y, t);
        const tx = cu * turb;
        const ty = -o.rise * (0.5 + 0.25 * smooth(0, 120, height)) + cv * turb * 0.6;
        q.vx += (tx - q.vx) * relax;
        q.vy += (ty - q.vy) * relax;
        if (stir) {
          const dx = q.x - p.x, dy = q.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < R) {
            const f = (1 - d / R) ** 2;
            q.vx += (v.vx * 0.12 - (dy / (d || 1)) * Math.abs(v.vx + v.vy) * 0.04) * f * k;
            q.vy += (v.vy * 0.12 + (dx / (d || 1)) * Math.abs(v.vx + v.vy) * 0.04) * f * k;
          }
        }
        q.x += q.vx * k;
        q.y += q.vy * k;
        if (q.age > LIFE || q.y < -30) continue;
        st.puffs[alive++] = q;
      }
      st.puffs.length = alive;
    }

    // Filaments: segments bucketed by age; older smoke is wider and fainter (it diffuses)
    const BUCKETS = 6;
    const prevJoin = ctx.lineJoin;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (const st of streamsRef.current) {
      const paths: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D());
      const puffs = st.puffs;
      for (let i = 1; i < puffs.length; i++) {
        const a = puffs[i - 1], b = puffs[i];
        if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) > 60) continue; // torn filament
        const bucket = Math.min(BUCKETS - 1, Math.floor((b.age / LIFE) * BUCKETS));
        paths[bucket].moveTo(a.x, a.y);
        paths[bucket].lineTo(b.x, b.y);
      }
      for (let bk = 0; bk < BUCKETS; bk++) {
        const age = (bk + 0.5) / BUCKETS;
        ctx.strokeStyle = hexToRgba(o.color, (0.42 * (1 - age) ** 1.6 + 0.02) * (st.offset === 0 ? 1 : 0.6));
        ctx.lineWidth = (0.7 + age * 9) * o.thickness * (st.offset === 0 ? 1 : 0.7);
        ctx.stroke(paths[bk]);
      }
    }
    ctx.lineJoin = prevJoin;

    // Sticks + glowing embers
    if (spriteRef.current.color !== o.emberColor) spriteRef.current = { color: o.emberColor, img: glowSprite(o.emberColor, 48) };
    const sprite = spriteRef.current.img;
    for (let s = 0; s < o.sticks; s++) {
      const tip = stickTip(s, o.sticks, w, h);
      ctx.strokeStyle = o.stickColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.base);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();
      const flick = 0.75 + 0.15 * Math.sin(t * 9 + s) + 0.1 * Math.sin(t * 23 + s * 2);
      if (sprite) {
        const prev = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = flick;
        ctx.drawImage(sprite, tip.x - 12, tip.y - 12, 24, 24);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = prev;
      }
      ctx.fillStyle = o.emberColor;
      ctx.fillRect(tip.x - 1.2, tip.y - 1, 2.4, 3);
    }
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
