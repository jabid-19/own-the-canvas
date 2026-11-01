import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { hexToRgba, sampleGradient } from "../../utils/color";

export interface Chain {
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  seg: number;
}

interface Kelp {
  chain: Chain;
  z: number;
  phase: number;
  frond: number;
}

interface Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  school: number;
  tail: number;
}

interface Bubble { x: number; y: number; r: number; seed: number }

export interface UseKelpForestOptions {
  kelpCount: number;
  fishCount: number;
  kelpColor: string;
  fishColor: string;
  backgroundColor: string;
  current: number;
  bubbles: boolean;
  lightRays: boolean;
  interactive: boolean;
  overlay: boolean;
}

export function makeChain(rootX: number, rootY: number, nodes: number, seg: number): Chain {
  const c: Chain = {
    x: new Float32Array(nodes),
    y: new Float32Array(nodes),
    vx: new Float32Array(nodes),
    vy: new Float32Array(nodes),
    seg,
  };
  for (let i = 0; i < nodes; i++) {
    c.x[i] = rootX;
    c.y[i] = rootY - i * seg;
  }
  return c;
}

/**
 * Position-based dynamics for a rope anchored at node 0:
 *   integrate forces → enforce segment lengths (root pinned) → velocity from
 *   the corrected positions. Stable at any dt the runtime hands us.
 */
export function stepChain(
  c: Chain,
  force: (i: number) => [number, number],
  k: number,
  iterations = 4,
  damping = 0.94,
): void {
  const n = c.x.length;
  const ox = new Float32Array(n);
  const oy = new Float32Array(n);
  const damp = Math.pow(damping, k);
  for (let i = 1; i < n; i++) {
    const [fx, fy] = force(i);
    c.vx[i] = (c.vx[i] + fx * k) * damp;
    c.vy[i] = (c.vy[i] + fy * k) * damp;
    ox[i] = c.x[i];
    oy[i] = c.y[i];
    c.x[i] += c.vx[i] * k;
    c.y[i] += c.vy[i] * k;
  }
  for (let it = 0; it < iterations; it++) {
    for (let i = 1; i < n; i++) {
      const dx = c.x[i] - c.x[i - 1];
      const dy = c.y[i] - c.y[i - 1];
      const d = Math.hypot(dx, dy) || 1e-6;
      const diff = (d - c.seg) / d;
      if (i === 1) {
        c.x[i] -= dx * diff;
        c.y[i] -= dy * diff;
      } else {
        c.x[i] -= dx * diff * 0.5;
        c.y[i] -= dy * diff * 0.5;
        c.x[i - 1] += dx * diff * 0.5;
        c.y[i - 1] += dy * diff * 0.5;
      }
    }
  }
  for (let i = 1; i < n; i++) {
    c.vx[i] = (c.x[i] - ox[i]) / k;
    c.vy[i] = (c.y[i] - oy[i]) / k;
  }
}

const rgb = (c: [number, number, number]) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;

export function useKelpForest(options: UseKelpForestOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const kelpRef = useRef<Kelp[]>([]);
  const fishRef = useRef<Fish[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const timeRef = useRef(0);
  const keyRef = useRef("");
  const pointer = usePointer();
  const velocity = useRef(createVelocity()).current;
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function seed(w: number, h: number) {
    const o = optionsRef.current;
    keyRef.current = `${o.kelpCount}|${o.fishCount}`;
    kelpRef.current = Array.from({ length: o.kelpCount }, (_, i) => {
      const z = 0.45 + Math.random() * 0.55;
      const height = h * (0.55 + Math.random() * 0.4) * (0.7 + 0.3 * z);
      const nodes = 16;
      const x = ((i + 0.5) / o.kelpCount) * w + (Math.random() - 0.5) * (w / o.kelpCount) * 0.8;
      return { chain: makeChain(x, h + 6, nodes, height / (nodes - 1)), z, phase: Math.random() * 10, frond: 12 + Math.random() * 8 };
    }).sort((a, b) => a.z - b.z);
    fishRef.current = Array.from({ length: o.fishCount }, (_, i) => ({
      x: Math.random() * w,
      y: h * (0.2 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 0.5,
      size: 5 + Math.random() * 4,
      school: i % 2,
      tail: Math.random() * 6,
    }));
    bubblesRef.current = [];
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    if (keyRef.current !== `${o.kelpCount}|${o.fishCount}`) seed(w, h);

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      const surface = ctx.createLinearGradient(0, 0, 0, h);
      surface.addColorStop(0, "rgba(255,255,255,0.07)");
      surface.addColorStop(0.45, "rgba(255,255,255,0)");
      surface.addColorStop(1, "rgba(0,0,0,0.38)");
      ctx.fillStyle = surface;
      ctx.fillRect(0, 0, w, h);
    }

    // God rays from the surface
    if (o.lightRays) {
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "lighter";
      for (let r = 0; r < 5; r++) {
        const cx = w * (0.1 + r * 0.2) + Math.sin(t * 0.17 + r * 1.9) * w * 0.05;
        const lean = w * 0.12;
        const top = 14 + r * 9;
        const g = ctx.createLinearGradient(0, 0, 0, h * 0.85);
        const a = 0.035 + 0.02 * Math.sin(t * 0.4 + r * 2.3);
        g.addColorStop(0, `rgba(255,255,255,${a})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(cx - top, 0);
        ctx.lineTo(cx + top, 0);
        ctx.lineTo(cx + lean + top * 3.2, h * 0.85);
        ctx.lineTo(cx + lean - top * 3.2, h * 0.85);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalCompositeOperation = prev;
    }

    const p = readPointer(pointer.current, canvasEl.current);
    const v = velocity(p, k);
    const push = o.interactive && p.inside;
    const R = 120;
    const pushAt = (x: number, y: number, gain: number): [number, number] => {
      if (!push) return [0, 0];
      const d = Math.hypot(x - p.x, y - p.y);
      if (d > R) return [0, 0];
      const f = (1 - d / R) * gain;
      return [v.vx * f, v.vy * f];
    };

    // Kelp
    const bg = sampleGradient([o.backgroundColor], 0);
    for (const kp of kelpRef.current) {
      const c = kp.chain;
      const n = c.x.length;
      stepChain(c, (i) => {
        const along = i / (n - 1);
        const sway = Math.sin(t * 0.55 + kp.phase + i * 0.22) + 0.35;
        const [px, py] = pushAt(c.x[i], c.y[i], 0.06);
        return [o.current * 0.016 * sway * along + px, -0.045 + py];
      }, k);

      const col = sampleGradient([o.kelpColor], 0);
      const haze = 0.35 + 0.65 * kp.z;
      const tint = rgb([bg[0] + (col[0] - bg[0]) * haze, bg[1] + (col[1] - bg[1]) * haze, bg[2] + (col[2] - bg[2]) * haze]);

      // Fronds
      const fr = new Path2D();
      for (let i = 2; i < n; i++) {
        const segA = Math.atan2(c.y[i] - c.y[i - 1], c.x[i] - c.x[i - 1]);
        const side = i % 2 ? 1 : -1;
        const a = segA + side * (0.75 + 0.25 * Math.sin(t * 1.6 + i + kp.phase));
        const L = kp.frond * kp.z * (1 - (i / n) * 0.35);
        const wv = L * 0.28;
        const tx = c.x[i] + Math.cos(a) * L, ty = c.y[i] + Math.sin(a) * L;
        const mx = c.x[i] + Math.cos(a) * L * 0.5, my = c.y[i] + Math.sin(a) * L * 0.5;
        const nx = -Math.sin(a) * wv, ny = Math.cos(a) * wv;
        fr.moveTo(c.x[i], c.y[i]);
        fr.quadraticCurveTo(mx + nx, my + ny, tx, ty);
        fr.quadraticCurveTo(mx - nx, my - ny, c.x[i], c.y[i]);
      }
      ctx.fillStyle = tint;
      ctx.globalAlpha = 0.9;
      ctx.fill(fr);
      ctx.globalAlpha = 1;

      // Stalk, tapering in three passes
      ctx.strokeStyle = tint;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const thirds = [0, Math.floor(n / 3), Math.floor((2 * n) / 3), n - 1];
      for (let s = 0; s < 3; s++) {
        ctx.lineWidth = (3.4 - s * 1) * kp.z;
        ctx.beginPath();
        ctx.moveTo(c.x[thirds[s]], c.y[thirds[s]]);
        for (let i = thirds[s] + 1; i <= thirds[s + 1]; i++) ctx.lineTo(c.x[i], c.y[i]);
        ctx.stroke();
      }
      // Float bulb at the tip
      ctx.fillStyle = tint;
      ctx.beginPath();
      ctx.arc(c.x[n - 1], c.y[n - 1], 2.6 * kp.z, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fish: two loose schools wandering between the kelp, darting from the cursor
    const fish = fishRef.current;
    const centers = [[0, 0, 0], [0, 0, 0]];
    for (const f of fish) { centers[f.school][0] += f.x; centers[f.school][1] += f.y; centers[f.school][2]++; }
    for (let s = 0; s < 2; s++) {
      const goalX = w * (0.5 + 0.38 * Math.sin(t * 0.07 + s * 2.5));
      const goalY = h * (0.42 + 0.18 * Math.sin(t * 0.11 + s * 1.3));
      const cnt = centers[s][2] || 1;
      for (const f of fish) {
        if (f.school !== s) continue;
        let ax = (centers[s][0] / cnt - f.x) * 0.0004 + (goalX - f.x) * 0.00012;
        let ay = (centers[s][1] / cnt - f.y) * 0.0004 + (goalY - f.y) * 0.00012;
        for (const q of fish) {
          if (q === f) continue;
          const dx = f.x - q.x, dy = f.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 196 && d2 > 0) { ax += dx / d2 * 0.4; ay += dy / d2 * 0.4; }
          else if (q.school === s && d2 < 3600) { ax += (q.vx - f.vx) * 0.004; ay += (q.vy - f.vy) * 0.004; }
        }
        let maxS = 2.2;
        if (push) {
          const dx = f.x - p.x, dy = f.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            const s2 = (1 - d / 130) * (0.25 + Math.hypot(v.vx, v.vy) * 0.03);
            ax += (dx / (d || 1)) * s2;
            ay += (dy / (d || 1)) * s2;
            maxS = 5;
          }
        }
        if (f.y < h * 0.08) ay += 0.05;
        if (f.y > h * 0.85) ay -= 0.05;
        f.vx += ax * k;
        f.vy += ay * k;
        const sp = Math.hypot(f.vx, f.vy);
        const clamped = Math.max(0.7, Math.min(maxS, sp));
        f.vx = (f.vx / (sp || 1)) * clamped;
        f.vy = (f.vy / (sp || 1)) * clamped * 0.8;
        f.x += f.vx * k;
        f.y += f.vy * k;
        if (f.x < -30) f.x = w + 30;
        if (f.x > w + 30) f.x = -30;
        f.tail += (0.25 + sp * 0.12) * k;
      }
    }
    ctx.fillStyle = o.fishColor;
    for (const f of fish) {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(Math.atan2(f.vy, f.vx));
      ctx.globalAlpha = 0.9;
      const s = f.size;
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      const wag = Math.sin(f.tail) * 0.4;
      ctx.beginPath();
      ctx.moveTo(-s * 0.8, 0);
      ctx.lineTo(-s * 1.55, -s * 0.45 + wag * s * 0.5);
      ctx.lineTo(-s * 1.55, s * 0.45 + wag * s * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    // Bubbles
    if (o.bubbles) {
      const bubbles = bubblesRef.current;
      if (Math.random() < 0.025 * k * frame.quality && kelpRef.current.length) {
        const kp = kelpRef.current[(Math.random() * kelpRef.current.length) | 0];
        bubbles.push({ x: kp.chain.x[2], y: kp.chain.y[2], r: 1.2 + Math.random() * 2.6, seed: Math.random() * 10 });
      }
      ctx.strokeStyle = hexToRgba(o.fishColor, 0.45);
      ctx.lineWidth = 0.8;
      let alive = 0;
      for (const b of bubbles) {
        const [px, py] = pushAt(b.x, b.y, 0.08);
        b.x += (Math.sin(t * 3 + b.seed) * 0.35 + px) * k;
        b.y += (-0.55 - b.r * 0.12 + py) * k;
        b.r += 0.002 * k;
        if (b.y < -8) continue;
        bubbles[alive++] = b;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      bubbles.length = alive;
    }
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onResize: seed,
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
