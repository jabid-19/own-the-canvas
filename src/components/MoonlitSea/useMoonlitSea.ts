import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { sampleGradient, hexToRgba } from "../../utils/color";

export interface UseMoonlitSeaOptions {
  seaColor: string;
  skyColor: string;
  moonColor: string;
  horizon: number;
  moonX: number;
  waveHeight: number;
  speed: number;
  stars: number;
  interactive: boolean;
  overlay: boolean;
}

interface Ripple { x: number; z: number; born: number }

const ROWS = 72;

/** Row r (0 = horizon .. ROWS-1 = nearest) → normalized screen depth 0..1, denser near the horizon. */
export const rowT = (r: number) => Math.pow(r / (ROWS - 1), 1.9);

/** World depth for a row: far rows map to large z. */
export const rowZ = (r: number) => 1 / (rowT(r) * 0.97 + 0.03);

/** Sum of travelling swells. Bounded to [-1.75, 1.75]. */
export function swell(x: number, z: number, t: number): number {
  return Math.sin(x * 0.9 + z * 1.3 - t * 1.1)
    + 0.5 * Math.sin(x * 2.1 - z * 0.7 - t * 1.7 + 1.3)
    + 0.25 * Math.sin(x * 4.3 + z * 2.9 - t * 2.6 + 0.4);
}

/**
 * Moon glitter: a wave facet flashes when its slope tilts the moon's
 * reflection into the eye. Peaks at the ideal slope, directly under the moon.
 */
export function glint(slope: number, idealSlope: number, lateral: number): number {
  const s = (slope - idealSlope) / 0.07;
  return Math.exp(-s * s) * Math.max(0, 1 - lateral * lateral);
}

export function useMoonlitSea(options: UseMoonlitSeaOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const timeRef = useRef(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastRippleRef = useRef(0);
  const starsRef = useRef<{ x: number; y: number; r: number; ph: number }[]>([]);
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    timeRef.current += dt * 0.001 * o.speed;
    const t = timeRef.current;
    const hy = h * o.horizon;
    const cx = w / 2;
    const mx = w * o.moonX;
    const sky = sampleGradient([o.skyColor], 0);
    const sea = sampleGradient([o.seaColor], 0);
    const moon = sampleGradient([o.moonColor], 0);
    const rgb = (c: number[]) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
    const mix = (a: number[], b: number[], m: number) => a.map((v, i) => v + (b[i] - v) * m);

    // Sky
    if (!frame.overlay) {
      const g = ctx.createLinearGradient(0, 0, 0, hy);
      g.addColorStop(0, rgb(sky));
      g.addColorStop(1, rgb(mix(sky, moon, 0.12)));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, hy + 1);
    }
    if (starsRef.current.length !== o.stars) {
      starsRef.current = Array.from({ length: o.stars }, () => ({ x: Math.random(), y: Math.random() * 0.95, r: 0.3 + Math.random() * 0.9, ph: Math.random() * 6 }));
    }
    ctx.fillStyle = o.moonColor;
    for (const s of starsRef.current) {
      ctx.globalAlpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.5 + s.ph));
      ctx.fillRect(s.x * w, s.y * hy, s.r, s.r);
    }
    ctx.globalAlpha = 1;

    // Moon + halo
    if (spriteRef.current.color !== o.moonColor) spriteRef.current = { color: o.moonColor, img: glowSprite(o.moonColor, 96) };
    const R = Math.min(w, h) * 0.05;
    const my = hy * 0.42;
    if (spriteRef.current.img) {
      ctx.globalAlpha = 0.35;
      ctx.drawImage(spriteRef.current.img, mx - R * 6, my - R * 6, R * 12, R * 12);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = o.moonColor;
    ctx.beginPath();
    ctx.arc(mx, my, R, 0, Math.PI * 2);
    ctx.fill();

    // Sea body: lighter at the horizon (reflected sky), deep in front
    const sg = ctx.createLinearGradient(0, hy, 0, h);
    sg.addColorStop(0, rgb(mix(sea, moon, 0.18)));
    sg.addColorStop(0.35, rgb(sea));
    sg.addColorStop(1, rgb(mix(sea, [0, 0, 0], 0.45)));
    ctx.fillStyle = sg;
    ctx.fillRect(0, hy, w, h - hy);

    // Ripples from the cursor gliding over the water
    const p = readPointer(pointer.current, canvasEl.current);
    if (o.interactive && p.inside && p.y > hy + 4 && t - lastRippleRef.current > 0.12) {
      lastRippleRef.current = t;
      const rt = Math.pow((p.y - hy) / (h - hy), 1 / 1.9);
      const r = rt * (ROWS - 1);
      const z = rowZ(r);
      ripplesRef.current.push({ x: (p.x - cx) * z / w, z, born: t });
      if (ripplesRef.current.length > 10) ripplesRef.current.shift();
    }
    for (const tap of p.taps) {
      if (tap.y <= hy) continue;
      const z = rowZ(Math.pow((tap.y - hy) / (h - hy), 1 / 1.9) * (ROWS - 1));
      ripplesRef.current.push({ x: (tap.x - cx) * z / w, z, born: t - 0.01 });
    }
    ripplesRef.current = ripplesRef.current.filter((rp) => t - rp.born < 4);

    // Rows: displaced crest lines + glitter facets
    const step = Math.max(3, Math.round(w / 280));
    const crest = rgb(mix(sea, moon, 0.35));
    const glitAlpha: number[] = [];
    const glitRects: number[] = [];
    for (let r = 1; r < ROWS; r++) {
      const tt = rowT(r);
      const sy = hy + (h - hy) * tt;
      const z = rowZ(r);
      const amp = o.waveHeight * (0.6 + 9 * Math.pow(tt, 1.4));
      const heightAt = (x: number) => {
        const wx = (x - cx) * z / w;
        let hgt = swell(wx * 4, z * 0.35, t);
        for (const rp of ripplesRef.current) {
          const age = t - rp.born;
          const d = Math.hypot((wx - rp.x) * 6, (z - rp.z) * 1.2);
          const front = age * 3.2;
          const env = Math.exp(-((d - front) ** 2) * 2.2) * Math.max(0, 1 - age / 4);
          hgt += Math.sin((d - front) * 9) * env * 1.8;
        }
        return hgt;
      };
      ctx.beginPath();
      let prev = heightAt(0);
      ctx.moveTo(0, sy - prev * amp);
      const half = (0.06 + 0.32 * tt) * w; // moon path widens toward the viewer
      for (let x = step; x <= w + step; x += step) {
        const hv = heightAt(x);
        ctx.lineTo(x, sy - hv * amp);
        const slope = (hv - prev) / step * amp;
        const lateral = (x - mx) / half;
        if (Math.abs(lateral) < 1) {
          // Facets flicker as waves move: only some catch the moon at any instant
          const flick = Math.sin(x * 1.37 + r * 2.1 + t * 5.3) * Math.sin(x * 0.71 - t * 3.1 + r);
          const g = glint(slope, 0.08 * (1 - tt), lateral) * (0.35 + 0.65 * tt) * (flick > 0.3 ? 1 : 0.15);
          if (g > 0.08) {
            glitRects.push(x - step * (0.5 + tt), sy - hv * amp - 0.6, step * (1 + 2 * tt), 1 + tt * 1.6);
            glitAlpha.push(g);
          }
        }
        prev = hv;
      }
      ctx.strokeStyle = crest;
      ctx.globalAlpha = 0.08 + 0.2 * tt;
      ctx.lineWidth = 0.6 + tt;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Glitter, additive, in three brightness buckets
    const prevOp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = o.moonColor;
    for (const [lo, hi, a] of [[0.08, 0.35, 0.35], [0.35, 0.7, 0.65], [0.7, 2, 1]] as const) {
      ctx.globalAlpha = a;
      ctx.beginPath();
      for (let i = 0; i < glitAlpha.length; i++) {
        if (glitAlpha[i] < lo || glitAlpha[i] >= hi) continue;
        ctx.rect(glitRects[i * 4], glitRects[i * 4 + 1], glitRects[i * 4 + 2], glitRects[i * 4 + 3]);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = prevOp;

    // Horizon haze line
    ctx.fillStyle = hexToRgba(o.moonColor, 0.08);
    ctx.fillRect(0, hy - 1, w, 2);
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
