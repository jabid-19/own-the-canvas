import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { sampleGradient } from "../../utils/color";

export interface Blade {
  x: number;
  row: number;
  h: number;
  w: number;
  /** Bend angle (rad), 0 = upright, + leans right. */
  angle: number;
  vel: number;
  lean: number;
  stiffness: number;
  shade: number;
  flower: boolean;
}

export interface UseGrassFieldOptions {
  density: number;
  height: number;
  baseColor: string;
  tipColor: string;
  backgroundColor: string;
  flowerColor: string;
  flowers: number;
  wind: number;
  gusts: number;
  rows: number;
  interactive: boolean;
  overlay: boolean;
}

const SHADES = 4;
const DAMPING = 0.11;

/**
 * Damped spring toward `target` (semi-implicit Euler). k = dt / 16.67.
 * Stable up to the runtime's 64ms dt clamp (k ≈ 3.84) for stiffness ≤ 0.2.
 */
export function stepBlade(b: Blade, target: number, k: number): void {
  b.vel += (-b.stiffness * (b.angle - target) - DAMPING * b.vel) * k;
  b.angle += b.vel * k;
}

export function useGrassField(options: UseGrassFieldOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const bladesRef = useRef<Blade[][]>([]);
  const seedKeyRef = useRef("");
  const timeRef = useRef(0);
  const pointer = usePointer();
  const velocity = useRef(createVelocity()).current;
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function seed(w: number, h: number) {
    const o = optionsRef.current;
    seedKeyRef.current = `${o.density}|${o.rows}|${o.height}|${o.flowers}`;
    const rows: Blade[][] = [];
    const maxH = h * o.height;
    for (let r = 0; r < o.rows; r++) {
      const depth = (r + 1) / o.rows; // back rows shorter, darker
      const n = Math.round((w / 100) * o.density * (0.6 + 0.4 * depth));
      const row: Blade[] = [];
      for (let i = 0; i < n; i++) {
        row.push({
          x: Math.random() * w,
          row: r,
          h: maxH * (0.45 + Math.random() * 0.55) * (0.55 + 0.45 * depth),
          w: (2.2 + Math.random() * 2.6) * (0.6 + 0.4 * depth),
          angle: 0,
          vel: 0,
          lean: (Math.random() - 0.5) * 0.35,
          stiffness: 0.05 + Math.random() * 0.05,
          shade: Math.floor(Math.random() * SHADES),
          flower: Math.random() < o.flowers * depth,
        });
      }
      row.sort((a, b) => a.x - b.x);
      rows.push(row);
    }
    bladesRef.current = rows;
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

    if (seedKeyRef.current !== `${o.density}|${o.rows}|${o.height}|${o.flowers}`) seed(w, h);

    const p = readPointer(pointer.current, canvasEl.current);
    const v = velocity(p, k);
    const ptr = o.interactive && p.inside;
    const R = 80;

    // Governor: thin every row when frames run slow
    const stride = frame.quality >= 1 ? 1 : frame.quality >= 0.5 ? 2 : 3;
    const baseY = h + 2;
    const rows = bladesRef.current;

    for (let r = 0; r < rows.length; r++) {
      const depth = (r + 1) / rows.length;
      const row = rows[r];
      const paths: Path2D[] = Array.from({ length: SHADES }, () => new Path2D());
      const flowerPath = new Path2D();

      for (let i = 0; i < row.length; i += stride) {
        const b = row[i];
        // Wind: steady breeze + gust bands rolling across the field
        const breeze = 0.18 * Math.sin(t * 0.8 + b.x * 0.006) + 0.08 * Math.sin(t * 2.1 + b.x * 0.03);
        const band = Math.sin(b.x * 0.0025 - t * 1.1);
        const gust = Math.pow(Math.max(0, band), 6) * 0.55 * o.gusts;
        let target = b.lean + o.wind * (0.12 + breeze + gust) * (0.7 + 0.3 * depth);

        // Cursor parts the grass, then the spring brings it back
        if (ptr) {
          const dx = b.x - p.x;
          const tipY = baseY - b.h;
          if (Math.abs(dx) < R && p.y > tipY - 20) {
            const f = 1 - Math.abs(dx) / R;
            target += Math.sign(dx || 1) * f * f * 1.1 + v.vx * 0.03 * f;
          }
        }
        stepBlade(b, target, k);

        // Tapered blade: curvature grows toward the tip
        const a = b.angle;
        const tipX = b.x + Math.sin(a) * b.h;
        const tipY = baseY - Math.cos(a) * b.h * (1 - 0.08 * Math.abs(a));
        const cx = b.x + Math.sin(a * 0.45) * b.h * 0.5;
        const cy = baseY - Math.cos(a * 0.45) * b.h * 0.55;
        const path = paths[b.shade];
        path.moveTo(b.x - b.w / 2, baseY);
        path.quadraticCurveTo(cx - b.w * 0.3, cy, tipX, tipY);
        path.quadraticCurveTo(cx + b.w * 0.3, cy, b.x + b.w / 2, baseY);
        path.closePath();
        if (b.flower) {
          const fr = 1.6 + b.w * 0.45;
          flowerPath.moveTo(tipX + fr, tipY);
          flowerPath.arc(tipX, tipY, fr, 0, Math.PI * 2);
        }
      }

      // One fill per shade bucket per row (vertical gradient base → tip)
      const topY = baseY - h * o.height;
      const haze = 0.45 + 0.55 * depth; // back rows fade toward the background
      for (let s = 0; s < SHADES; s++) {
        const lift = (s / (SHADES - 1)) * 0.35;
        const base = sampleGradient([o.backgroundColor, o.baseColor], haze);
        const tip = sampleGradient([o.backgroundColor, o.tipColor], haze * (0.65 + lift));
        const g = ctx.createLinearGradient(0, baseY, 0, topY);
        g.addColorStop(0, `rgb(${base[0] | 0},${base[1] | 0},${base[2] | 0})`);
        g.addColorStop(1, `rgb(${tip[0] | 0},${tip[1] | 0},${tip[2] | 0})`);
        ctx.fillStyle = g;
        ctx.fill(paths[s]);
      }
      if (o.flowers > 0) {
        const fc = sampleGradient([o.backgroundColor, o.flowerColor], haze);
        ctx.fillStyle = `rgb(${fc[0] | 0},${fc[1] | 0},${fc[2] | 0})`;
        ctx.fill(flowerPath);
      }
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
