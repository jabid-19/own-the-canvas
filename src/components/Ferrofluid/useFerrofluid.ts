import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { hexToRgba } from "../../utils/color";

export interface UseFerrofluidOptions {
  fluidColor: string;
  highlightColor: string;
  backgroundColor: string;
  spikes: number;
  spikeHeight: number;
  poolWidth: number;
  strength: number;
  reflection: boolean;
  interactive: boolean;
  overlay: boolean;
}

interface Spike {
  /** Offset from pool center, px. */
  x: number;
  row: number;
  h: number;
  v: number;
  lean: number;
  width: number;
  seed: number;
}

/** Dipole-like falloff: ~1 right under the magnet, dropping with distance (in units of `scale`). */
export function fieldAt(dx: number, dy: number, scale: number): number {
  return 1 / Math.pow(1 + (dx * dx + dy * dy) / (scale * scale), 1.5);
}

/** Rosensweig instability: the surface stays flat until the field passes a critical value. */
export const CRITICAL = 0.12;
export function spikeTarget(field: number, maxH: number): number {
  return field <= CRITICAL ? 0 : maxH * Math.min(1, (field - CRITICAL) / (1 - CRITICAL)) ** 0.8;
}

export function useFerrofluid(options: UseFerrofluidOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const spikesRef = useRef<Spike[]>([]);
  const keyRef = useRef("");
  const timeRef = useRef(0);
  const magRef = useRef({ x: 0, y: 0, pulse: 0 });
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function seed(W: number) {
    const o = optionsRef.current;
    const spikes: Spike[] = [];
    // Three staggered rows (back → front): a hexagonal crown seen from the side
    for (let row = 0; row < 3; row++) {
      const n = Math.max(3, Math.round(o.spikes * (0.7 + row * 0.15)));
      for (let i = 0; i < n; i++) {
        const u = (i + (row % 2 ? 0.5 : 0) + 0.5) / (n + 0.5) - 0.5;
        spikes.push({ x: u * W * (0.75 + row * 0.08), row, h: 0, v: 0, lean: 0, width: (W / n) * (0.42 + row * 0.06), seed: Math.random() * 10 });
      }
    }
    spikesRef.current = spikes;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;
    const cx = w / 2;
    const y0 = h * 0.74;
    const W = Math.min(w * 0.82, Math.max(160, w * o.poolWidth));
    const key = `${W}|${o.spikes}`;
    if (keyRef.current !== key) { keyRef.current = key; seed(W); }

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      // Studio light falling on the table
      if (spriteRef.current.color !== o.highlightColor) spriteRef.current = { color: o.highlightColor, img: glowSprite(o.highlightColor, 128) };
      if (spriteRef.current.img) {
        ctx.globalAlpha = 0.09;
        ctx.drawImage(spriteRef.current.img, cx - W, y0 - W * 0.5, W * 2, W);
        ctx.globalAlpha = 1;
      }
    }

    // Magnet: the cursor, or an idle magnet slowly breathing above the pool
    const p = readPointer(pointer.current, canvasEl.current);
    const M = magRef.current;
    const active = o.interactive && p.inside;
    const tx = active ? p.x : cx + Math.sin(t * 0.5) * W * 0.18;
    const ty = active ? p.y : y0 - h * (0.22 + 0.07 * Math.sin(t * 0.8));
    const ease = 1 - Math.pow(0.8, k);
    M.x += (tx - M.x) * ease;
    M.y += (ty - M.y) * ease;
    if (p.taps.length) M.pulse = 1;
    M.pulse *= Math.pow(0.96, k);
    const strength = o.strength * (active ? 1 : 0.75) * (1 + M.pulse * 0.9);
    const scale = h * 0.32;
    const maxH = h * 0.34 * o.spikeHeight;

    // Dome bulges toward the magnet as a whole
    const centerField = fieldAt(M.x - cx, M.y - y0, scale) * strength;
    const domeH = h * 0.055 + Math.min(h * 0.06, centerField * h * 0.07);
    const domeShift = Math.max(-W * 0.12, Math.min(W * 0.12, (M.x - cx) * 0.08 * Math.min(1, centerField * 2)));

    for (const s of spikesRef.current) {
      const sx = cx + domeShift + s.x;
      const f = fieldAt(M.x - sx, M.y - y0, scale) * strength;
      const target = spikeTarget(f, maxH) * (0.55 + s.row * 0.22) * (1 + 0.05 * Math.sin(t * 7 + s.seed));
      // Springy, slightly underdamped: spikes overshoot and settle like liquid
      s.v += ((target - s.h) * 0.12 - s.v * 0.22) * k;
      s.h = Math.max(0, s.h + s.v * k);
      const lean = Math.atan2(M.x - sx, Math.max(20, y0 - M.y)) * 0.55 * Math.min(1, f * 2);
      s.lean += (lean - s.lean) * ease;
    }

    const dome = (x: number) => {
      const u = (x - cx - domeShift) / (W / 2);
      return Math.abs(u) >= 1 ? 0 : domeH * Math.pow(1 - u * u, 0.6);
    };

    // One silhouette per row (back rows behind), each = dome + its spikes
    const rowPath = (row: number) => {
      const path = new Path2D();
      const x0 = cx + domeShift - W / 2 - 6, x1 = cx + domeShift + W / 2 + 6;
      const step = 1.5;
      path.moveTo(x0, y0);
      const spikes = spikesRef.current.filter((s) => s.row === row && s.h > 0.5);
      for (let x = x0; x <= x1; x += step) {
        let y = dome(x) * (0.85 + row * 0.08);
        for (const s of spikes) {
          const sx = cx + domeShift + s.x;
          // Lean shifts the spike's upper part toward the magnet
          const rel = (x - sx);
          const hh = s.h;
          const shifted = rel - s.lean * hh * 0.9 * Math.max(0, 1 - Math.abs(rel) / s.width);
          const q = 1 - Math.abs(shifted) / s.width;
          if (q > 0) y = Math.max(y, dome(sx) + hh * Math.pow(q, 2.4));
        }
        path.lineTo(x, y0 - y);
      }
      path.lineTo(x1, y0);
      path.closePath();
      return path;
    };

    const fluid = o.fluidColor;
    const reflectionPaths: Path2D[] = [];
    for (let row = 0; row < 3; row++) {
      const path = rowPath(row);
      reflectionPaths.push(path);
      ctx.fillStyle = fluid;
      ctx.fill(path);
      // Specular rim along the silhouette: glossy liquid catching the key light
      ctx.strokeStyle = hexToRgba(o.highlightColor, 0.18 + row * 0.12);
      ctx.lineWidth = 0.8 + row * 0.3;
      ctx.stroke(path);
    }
    // Glossy streaks on the front spikes' lit flanks
    ctx.strokeStyle = hexToRgba(o.highlightColor, 0.55);
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (const s of spikesRef.current) {
      if (s.row !== 2 || s.h < 6) continue;
      const sx = cx + domeShift + s.x;
      const baseY = y0 - dome(sx);
      ctx.moveTo(sx - s.width * 0.35, baseY - s.h * 0.08);
      ctx.quadraticCurveTo(sx - s.width * 0.18 + s.lean * s.h * 0.3, baseY - s.h * 0.5, sx + s.lean * s.h * 0.85 - 1, y0 - dome(sx) - s.h * 0.92);
    }
    ctx.stroke();
    // Soft highlight on the dome
    ctx.fillStyle = hexToRgba(o.highlightColor, 0.1);
    ctx.beginPath();
    ctx.ellipse(cx + domeShift - W * 0.15, y0 - domeH * 0.55, W * 0.22, Math.max(2, domeH * 0.22), 0, 0, Math.PI * 2);
    ctx.fill();

    // Mirror on the polished table
    if (o.reflection) {
      ctx.save();
      ctx.translate(0, y0 * 2);
      ctx.scale(1, -1);
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = fluid;
      for (const rp of reflectionPaths) ctx.fill(rp);
      ctx.restore();
      if (!frame.overlay) {
        const fade = ctx.createLinearGradient(0, y0, 0, Math.min(h, y0 + maxH));
        fade.addColorStop(0, hexToRgba(o.backgroundColor, 0));
        fade.addColorStop(1, hexToRgba(o.backgroundColor, 1));
        ctx.fillStyle = fade;
        ctx.fillRect(0, y0, w, h - y0);
      }
      ctx.globalAlpha = 1;
    }
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
