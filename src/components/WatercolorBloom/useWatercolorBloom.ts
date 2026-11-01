import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer } from "../../runtime/fx";
import { hexToRgba } from "../../utils/color";

export interface UseWatercolorBloomOptions {
  colors: string[];
  backgroundColor: string;
  bloomRadius: number;
  bloomSpeed: number;
  opacity: number;
  wetEdge: number;
  layerCount: number;
  noiseAmount: number;
  fadeSpeed: number;
  interactive: boolean;
  autoBloom: boolean;
  autoBloomInterval: number;
  resolution: number;
  animated: boolean;
  maxBlooms: number;
}

interface Bloom {
  x: number;
  y: number;
  color: string;
  /** Base shape (unit radius), flat [x0, y0, x1, y1, ...] with per-vertex variance. */
  base: number[];
  vari: number[];
  drawn: number;
  total: number;
  radius: number;
}

function gauss(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Recursive midpoint displacement (the generative watercolor technique):
 * every edge gets a new midpoint pushed by a gaussian scaled to the edge
 * length and that region's variance. Each pass doubles the vertex count.
 */
export function deform(pts: number[], vari: number[], amount: number, depth: number): { pts: number[]; vari: number[] } {
  let p = pts, v = vari;
  for (let d = 0; d < depth; d++) {
    const np: number[] = [], nv: number[] = [];
    const n = p.length / 2;
    for (let i = 0; i < n; i++) {
      const ax = p[i * 2], ay = p[i * 2 + 1];
      const j = (i + 1) % n;
      const bx = p[j * 2], by = p[j * 2 + 1];
      const len = Math.hypot(bx - ax, by - ay);
      const va = (v[i] + v[j]) / 2;
      np.push(ax, ay);
      nv.push(v[i]);
      np.push((ax + bx) / 2 + gauss() * len * amount * va, (ay + by) / 2 + gauss() * len * amount * va);
      nv.push(va * (0.8 + Math.random() * 0.4));
    }
    p = np;
    v = nv;
  }
  return { pts: p, vari: v };
}

function makeBase(noise: number): { pts: number[]; vari: number[] } {
  const n = 10;
  const pts: number[] = [], vari: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push(Math.cos(a), Math.sin(a));
    vari.push(0.4 + Math.random() * 0.8);
  }
  return deform(pts, vari, 0.25 + noise * 0.35, 3);
}

export function useWatercolorBloom(options: UseWatercolorBloomOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const s = useRef({
    paper: null as HTMLCanvasElement | null,
    pctx: null as CanvasRenderingContext2D | null,
    grain: null as HTMLCanvasElement | null,
    scale: 1,
    blooms: [] as Bloom[],
    nextAuto: 0.3,
    t: 0,
    key: "",
  }).current;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function setupPaper(w: number, h: number) {
    const o = optionsRef.current;
    s.key = `${w}|${h}|${o.resolution}|${o.backgroundColor}`;
    s.blooms = [];
    if (typeof document === "undefined") return;
    const res = Math.min(1, Math.max(0.2, o.resolution));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w * res));
    c.height = Math.max(1, Math.round(h * res));
    s.paper = c;
    s.scale = res;
    s.pctx = c.getContext("2d");
    if (s.pctx) {
      s.pctx.fillStyle = o.backgroundColor;
      s.pctx.fillRect(0, 0, c.width, c.height);
    }
    // Cold-press paper grain, rendered once
    const g = document.createElement("canvas");
    g.width = 128; g.height = 128;
    const gx = g.getContext("2d");
    const img = gx?.createImageData?.(128, 128);
    if (gx && img) {
      for (let i = 0; i < 128 * 128; i++) {
        const v = 128 + (Math.random() - 0.5) * 90;
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
        img.data[i * 4 + 3] = 255;
      }
      gx.putImageData(img, 0, 0);
      s.grain = g;
    }
  }

  function spawn(x: number, y: number) {
    const o = optionsRef.current;
    if (s.blooms.length >= Math.max(1, o.maxBlooms)) return;
    const palette = o.colors.length ? o.colors : ["#ffffff"];
    const { pts, vari } = makeBase(o.noiseAmount);
    s.blooms.push({
      x: x * s.scale, y: y * s.scale,
      color: palette[(Math.random() * palette.length) | 0],
      base: pts, vari,
      drawn: 0,
      total: Math.max(12, Math.round(o.layerCount * 7)),
      radius: o.bloomRadius * s.scale * (0.6 + Math.random() * 0.6),
    });
  }

  /** One translucent wash: the bloom's base shape, deformed again so every layer differs. */
  function paintLayer(b: Bloom, o: UseWatercolorBloomOptions) {
    const pc = s.pctx;
    if (!pc) return;
    const prog = b.drawn / b.total;
    const spread = b.radius * (0.35 + 0.65 * (1 - Math.pow(1 - prog, 2)));
    const { pts } = deform(b.base, b.vari, 0.18 + o.noiseAmount * 0.2, 2);
    pc.beginPath();
    for (let i = 0; i < pts.length; i += 2) {
      const x = b.x + pts[i] * spread, y = b.y + pts[i + 1] * spread;
      if (i === 0) pc.moveTo(x, y); else pc.lineTo(x, y);
    }
    pc.closePath();
    pc.fillStyle = hexToRgba(b.color, Math.min(1, o.opacity * 0.28));
    pc.fill();
    // Wet edge: pigment collects where the wash dries
    if (o.wetEdge > 0) {
      pc.strokeStyle = hexToRgba(b.color, Math.min(1, o.wetEdge * 0.05));
      pc.lineWidth = Math.max(0.8, 1.6 * s.scale);
      pc.stroke();
    }
    b.drawn++;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    s.t += dt * 0.001;
    if (s.key !== `${w}|${h}|${o.resolution}|${o.backgroundColor}`) setupPaper(w, h);

    const p = readPointer(pointer.current, canvasEl.current);
    if (o.interactive) for (const tap of p.taps) spawn(tap.x, tap.y);
    if (o.animated && o.autoBloom && s.t > s.nextAuto) {
      s.nextAuto = s.t + Math.max(0.15, o.autoBloomInterval / 1000);
      spawn(w * (0.1 + Math.random() * 0.8), h * (0.1 + Math.random() * 0.8));
    }

    // Paint: a few layers per frame while a bloom spreads; instant when not animated
    const perFrame = o.animated ? Math.max(1, Math.round(o.bloomSpeed * 2.5 * k * (frame.quality < 0.75 ? 0.6 : 1))) : Infinity;
    for (const b of s.blooms) {
      for (let i = 0; i < perFrame && b.drawn < b.total; i++) paintLayer(b, o);
    }
    s.blooms = s.blooms.filter((b) => b.drawn < b.total);

    // Old washes slowly fade back into the paper
    if (o.animated && o.fadeSpeed > 0 && s.pctx && s.paper) {
      s.pctx.fillStyle = hexToRgba(o.backgroundColor, Math.min(1, o.fadeSpeed * 3 * k));
      s.pctx.fillRect(0, 0, s.paper.width, s.paper.height);
    }

    if (s.paper) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(s.paper, 0, 0, w, h);
    } else if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }
    if (s.grain) {
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.06;
      for (let y = 0; y < h; y += 128) for (let x = 0; x < w; x += 128) ctx.drawImage(s.grain, x, y);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = prev;
    }
  }

  const setup = useCanvasSetup({
    onResize: (w, h) => setupPaper(w, h),
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
