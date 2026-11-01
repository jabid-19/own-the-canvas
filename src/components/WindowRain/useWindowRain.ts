import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer } from "../../runtime/fx";
import { hexToRgba, sampleGradient } from "../../utils/color";

export interface UseWindowRainOptions {
  lightColors: string[];
  backgroundColor: string;
  fogColor: string;
  rain: number;
  dropSize: number;
  fog: number;
  lights: number;
  interactive: boolean;
  overlay: boolean;
}

export interface Drop {
  x: number;
  y: number;
  r: number;
  vy: number;
  /** ms the drop stays pinned before trying to slide again. */
  pinned: number;
  traveled: number;
  seed: number;
}

interface Droplet { x: number; y: number; r: number }

/** Below this radius surface tension holds a drop in place. */
export const SLIDE_R = 4.5;

/** Two drops coalesce: volume (∝ r³ for a bead) is conserved, the lower one leads. */
export function mergeDrops(a: Drop, b: Drop): Drop {
  const r = Math.cbrt(a.r ** 3 + b.r ** 3);
  const lead = a.y > b.y ? a : b;
  return { ...lead, r, vy: Math.max(a.vy, b.vy), pinned: 0 };
}

/** One slide step. Heavier drops run faster; small ones stick and stutter. Returns distance moved. */
export function slideDrop(d: Drop, k: number, dt: number): number {
  if (d.r < SLIDE_R) return 0;
  if (d.pinned > 0) { d.pinned -= dt; return 0; }
  const terminal = (d.r - SLIDE_R + 0.6) * 0.9;
  d.vy += (terminal - d.vy) * (1 - Math.pow(0.9, k));
  if (Math.random() < 0.012 * k * (SLIDE_R * 2 / d.r)) d.pinned = 80 + Math.random() * 400;
  const dy = d.vy * k;
  d.y += dy;
  d.x += Math.sin(d.y * 0.05 + d.seed) * 0.25 * k;
  return dy;
}

export function useWindowRain(options: UseWindowRainOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const stateRef = useRef<{
    bg: HTMLCanvasElement | null;
    dpr: number;
    drops: Drop[];
    droplets: Droplet[];
    fog: Float32Array;
    fogW: number;
    fogH: number;
    fogImg: ImageData | null;
    fogCanvas: HTMLCanvasElement | null;
    key: string;
  } | null>(null);
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function paintBackground(w: number, h: number, dpr: number): HTMLCanvasElement | null {
    if (typeof document === "undefined") return null;
    const o = optionsRef.current;
    const c = document.createElement("canvas");
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const g = c.getContext("2d");
    if (!g) return c;
    g.setTransform?.(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = o.backgroundColor;
    g.fillRect(0, 0, w, h);
    // City at night through wet glass: soft out-of-focus lights
    if (typeof g.createRadialGradient === "function") {
      for (let i = 0; i < o.lights; i++) {
        const x = Math.random() * w;
        const y = h * (0.25 + Math.random() * 0.75);
        const r = 14 + Math.random() * 46;
        const col = o.lightColors[i % Math.max(1, o.lightColors.length)] ?? "#ffffff";
        const a = 0.2 + Math.random() * 0.4;
        const grad = g.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, hexToRgba(col, a));
        grad.addColorStop(0.6, hexToRgba(col, a * 0.7));
        grad.addColorStop(1, hexToRgba(col, 0));
        g.fillStyle = grad;
        g.beginPath();
        g.arc(x, y, r, 0, Math.PI * 2);
        g.fill();
      }
    }
    return c;
  }

  function init(w: number, h: number) {
    const o = optionsRef.current;
    const dpr = canvasEl.current && w > 0 ? canvasEl.current.width / w : 1;
    const fogW = Math.max(1, Math.ceil(w / 8));
    const fogH = Math.max(1, Math.ceil(h / 8));
    const fogCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (fogCanvas) { fogCanvas.width = fogW; fogCanvas.height = fogH; }
    stateRef.current = {
      bg: paintBackground(w, h, dpr),
      dpr,
      drops: [],
      droplets: Array.from({ length: Math.round((w * h) / 900) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.6 })),
      fog: new Float32Array(fogW * fogH).fill(1),
      fogW, fogH,
      fogImg: fogCanvas?.getContext("2d")?.createImageData?.(fogW, fogH) ?? null,
      fogCanvas,
      key: `${o.backgroundColor}|${o.lights}|${o.lightColors.join(",")}`,
    };
  }

  function clearFog(st: NonNullable<typeof stateRef.current>, x: number, y: number, r: number, to = 0) {
    const fx = x / 8, fy = y / 8, fr = r / 8;
    for (let gy = Math.max(0, Math.floor(fy - fr)); gy <= Math.min(st.fogH - 1, Math.ceil(fy + fr)); gy++) {
      for (let gx = Math.max(0, Math.floor(fx - fr)); gx <= Math.min(st.fogW - 1, Math.ceil(fx + fr)); gx++) {
        const d = Math.hypot(gx - fx, gy - fy) / Math.max(fr, 0.5);
        if (d < 1) {
          const i = gy * st.fogW + gx;
          st.fog[i] = Math.min(st.fog[i], to + (1 - to) * d * d);
        }
      }
    }
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    if (!stateRef.current) init(w, h);
    let st = stateRef.current!;
    if (st.key !== `${o.backgroundColor}|${o.lights}|${o.lightColors.join(",")}`) { init(w, h); st = stateRef.current!; }

    if (st.bg && !frame.overlay) ctx.drawImage(st.bg, 0, 0, w, h);

    // Rain hits: new beads, some big enough to run
    const hits = o.rain * 0.9 * k * frame.quality;
    for (let i = 0; i < Math.floor(hits) + (Math.random() < hits % 1 ? 1 : 0); i++) {
      if (Math.random() < 0.22) {
        st.drops.push({ x: Math.random() * w, y: Math.random() * h * 0.9, r: (1.8 + Math.random() * 3.6) * o.dropSize, vy: 0, pinned: 0, traveled: 0, seed: Math.random() * 10 });
      } else if (st.droplets.length < (w * h) / 500) {
        st.droplets.push({ x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.6 });
      }
    }
    const maxDrops = Math.ceil(90 * frame.quality);
    if (st.drops.length > maxDrops) st.drops.splice(0, st.drops.length - maxDrops);

    // Slide, shed trail droplets, clear a path through the fog
    for (const d of st.drops) {
      const moved = slideDrop(d, k, dt);
      if (moved > 0) {
        d.traveled += moved;
        clearFog(st, d.x, d.y, d.r * 1.3, 0.05);
        if (d.traveled > 7) {
          d.traveled = 0;
          if (Math.random() < 0.7) st.droplets.push({ x: d.x + (Math.random() - 0.5) * d.r, y: d.y - d.r * 1.5, r: 0.8 + Math.random() * d.r * 0.25 });
          d.r = Math.max(SLIDE_R * 0.92, d.r - 0.03);
        }
        // Sweep up droplets in the way
        for (let i = st.droplets.length - 1; i >= 0; i--) {
          const q = st.droplets[i];
          if (Math.abs(q.x - d.x) < d.r && q.y > d.y - d.r && q.y < d.y + d.r * 1.2) {
            d.r = Math.cbrt(d.r ** 3 + q.r ** 3);
            st.droplets[i] = st.droplets[st.droplets.length - 1];
            st.droplets.pop();
          }
        }
      }
    }
    // Coalesce overlapping drops
    st.drops.sort((a, b) => a.x - b.x);
    for (let i = 0; i < st.drops.length; i++) {
      const a = st.drops[i];
      if (a.r <= 0) continue;
      for (let j = i + 1; j < st.drops.length && st.drops[j].x - a.x < 14; j++) {
        const b = st.drops[j];
        if (b.r <= 0) continue;
        if (Math.hypot(a.x - b.x, a.y - b.y) < (a.r + b.r) * 0.8) {
          const m = mergeDrops(a, b);
          Object.assign(a, m);
          b.r = 0;
        }
      }
    }
    st.drops = st.drops.filter((d) => d.r > 0 && d.y < h + 20);

    // Wipe: the cursor clears a streak of glass
    const p = readPointer(pointer.current, canvasEl.current);
    if (o.interactive && p.inside) {
      const R = 26;
      clearFog(st, p.x, p.y, R * 1.6);
      st.droplets = st.droplets.filter((q) => Math.hypot(q.x - p.x, q.y - p.y) > R);
      st.drops = st.drops.filter((d) => Math.hypot(d.x - p.x, d.y - p.y) > R + d.r);
    }

    // Fog: relaxes back toward full condensation
    if (o.fog > 0 && st.fogImg && st.fogCanvas) {
      const back = 1 - Math.pow(0.9975, k);
      const [r, g, b] = sampleGradient([o.fogColor], 0);
      const data = st.fogImg.data;
      for (let i = 0; i < st.fog.length; i++) {
        st.fog[i] += (1 - st.fog[i]) * back;
        const j = i * 4;
        data[j] = r; data[j + 1] = g; data[j + 2] = b;
        data[j + 3] = st.fog[i] * o.fog * 255;
      }
      st.fogCanvas.getContext("2d")?.putImageData(st.fogImg, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(st.fogCanvas, 0, 0, w, h);
    }

    // Tiny droplets: dark body + glint
    const body = new Path2D();
    const glint = new Path2D();
    for (const q of st.droplets) {
      body.moveTo(q.x + q.r, q.y);
      body.arc(q.x, q.y, q.r, 0, Math.PI * 2);
      glint.moveTo(q.x - q.r * 0.3 + 0.5, q.y - q.r * 0.35);
      glint.arc(q.x - q.r * 0.3, q.y - q.r * 0.35, 0.5, 0, Math.PI * 2);
    }
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fill(body);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fill(glint);

    // Running drops: tiny upside-down lenses onto the scene behind the glass
    const dpr = st.dpr;
    for (const d of st.drops) {
      const rx = d.r, ry = d.r * (d.vy > 0.3 ? 1.18 : 1);
      if (st.bg) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.clip();
        const span = d.r * 5;
        const sx = Math.max(0, (d.x - span) * dpr), sy = Math.max(0, (d.y - span) * dpr);
        ctx.translate(d.x, d.y);
        ctx.scale(1, -1);
        ctx.drawImage(st.bg, sx, sy, span * 2 * dpr, span * 2 * dpr, -rx, -ry, rx * 2, ry * 2);
        ctx.restore();
      }
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      ctx.ellipse(d.x - rx * 0.35, d.y - ry * 0.45, rx * 0.22, ry * 0.14, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onResize: () => { stateRef.current = null; },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
