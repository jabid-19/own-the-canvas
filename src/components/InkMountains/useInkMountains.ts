import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { fbm1, noise1 } from "../../runtime/noise";
import { sampleGradient, hexToRgba } from "../../utils/color";

export interface UseInkMountainsOptions {
  paperColor: string;
  inkColor: string;
  sunColor: string;
  layers: number;
  mist: number;
  drift: number;
  birds: number;
  pines: boolean;
  parallax: boolean;
  overlay: boolean;
}

export interface Layer {
  base: number;
  amp: number;
  freq: number;
  seed: number;
  depth: number;
}

/** Ridge height at world x: fBm sharpened into peaks. Always within [base - amp, base]. */
export function ridgeY(x: number, l: Layer): number {
  const n = fbm1(x * l.freq, 5, l.seed);
  const peaky = Math.pow(Math.min(1, Math.max(0, (n - 0.2) / 0.6)), 1.6);
  return l.base - l.amp * peaky;
}

export function makeLayers(h: number, count: number): Layer[] {
  const n = Math.max(1, count);
  return Array.from({ length: n }, (_, i) => {
    const d = n === 1 ? 1 : i / (n - 1); // 0 far .. 1 near
    return {
      base: h * (0.5 + 0.42 * d),
      amp: h * (0.3 - 0.1 * d),
      freq: 0.0032 + 0.0035 * d,
      seed: 11 + i * 7,
      depth: d,
    };
  });
}

const rgb = (c: number[]) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;

export function useInkMountains(options: UseInkMountainsOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const timeRef = useRef(0);
  const panRef = useRef({ x: 0, px: 0 });
  const spriteRef = useRef<{ color: string; img: HTMLCanvasElement | null }>({ color: "", img: null });
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    if (!frame.overlay) {
      ctx.fillStyle = o.paperColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Camera: slow drift + eased cursor parallax
    const p = readPointer(pointer.current, canvasEl.current);
    const pan = panRef.current;
    pan.x += o.drift * 0.35 * k;
    const want = o.parallax && p.inside ? (p.x / w - 0.5) * 2 : 0;
    pan.px += (want - pan.px) * (1 - Math.pow(0.95, k));

    const layers = makeLayers(h, o.layers);
    const paper = sampleGradient([o.paperColor], 0);
    const ink = sampleGradient([o.inkColor], 0);
    const tone = (d: number) => {
      const a = (0.18 + 0.82 * Math.pow(d, 1.25)) * 0.92;
      return [paper[0] + (ink[0] - paper[0]) * a, paper[1] + (ink[1] - paper[1]) * a, paper[2] + (ink[2] - paper[2]) * a];
    };

    // Sun, behind everything
    const R = Math.min(w, h) * 0.075;
    ctx.fillStyle = hexToRgba(o.sunColor, 0.85);
    ctx.beginPath();
    ctx.arc(w * 0.72 - pan.px * 6, h * 0.24, R, 0, Math.PI * 2);
    ctx.fill();

    if (spriteRef.current.color !== o.paperColor) spriteRef.current = { color: o.paperColor, img: glowSprite(o.paperColor, 64) };
    const fog = spriteRef.current.img;
    const step = Math.max(3, Math.round(w / 260));

    for (let li = 0; li < layers.length; li++) {
      const L = layers[li];
      const off = pan.x * (0.15 + 0.85 * L.depth) + pan.px * 40 * L.depth;
      const col = tone(L.depth);

      // Mountain body: ink at the ridge, dissolving into mist at its feet
      const top = L.base - L.amp;
      const g = ctx.createLinearGradient(0, top, 0, L.base + h * 0.06);
      g.addColorStop(0, rgb(col));
      g.addColorStop(0.5, rgb(col.map((c, i) => c + (paper[i] - c) * 0.25)));
      g.addColorStop(1, rgb(paper));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w + step; x += step) ctx.lineTo(x, ridgeY(x + off, L));
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Dry-brush ridge line + texture strokes (cun) on the nearer layers
      ctx.strokeStyle = rgb(col);
      ctx.lineWidth = 0.8 + L.depth * 1.2;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      for (let x = 0; x <= w + step; x += step) {
        const y = ridgeY(x + off, L);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (L.depth > 0.3) {
        ctx.lineWidth = 0.7;
        ctx.globalAlpha = 0.35 * L.depth;
        ctx.beginPath();
        const spacing = 9;
        const first = Math.floor(off / spacing) * spacing;
        for (let wx = first; wx < off + w; wx += spacing) {
          const r = noise1(wx * 0.37, L.seed);
          if (r < 0.45) continue;
          const sx = wx - off;
          const y = ridgeY(wx, L);
          const len = 6 + r * 18 * L.depth;
          ctx.moveTo(sx, y + 2);
          ctx.quadraticCurveTo(sx - 2, y + len * 0.5, sx - 4 + r * 3, y + len);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Pines on the two nearest ridges
      if (o.pines && L.depth > 0.6) {
        ctx.fillStyle = rgb(col);
        const spacing = 26;
        const first = Math.floor(off / spacing) * spacing;
        for (let wx = first; wx < off + w + spacing; wx += spacing) {
          const r = noise1(wx * 0.11, L.seed + 3);
          if (r < 0.62) continue;
          const sx = wx - off;
          const y = ridgeY(wx, L);
          const th = (10 + r * 22) * (0.6 + L.depth * 0.6);
          ctx.beginPath();
          for (let tier = 0; tier < 4; tier++) {
            const ty = y - th * (tier / 4);
            const tw = th * 0.28 * (1 - tier / 5);
            ctx.moveTo(sx - tw, ty);
            ctx.lineTo(sx, ty - th * 0.32);
            ctx.lineTo(sx + tw, ty);
          }
          ctx.fill();
          ctx.fillRect(sx - 0.6, y - th * 0.2, 1.2, th * 0.25);
        }
      }

      // Mist drifting between this layer and the next
      if (fog && o.mist > 0) {
        for (let m = 0; m < 6; m++) {
          const mw = w * (0.35 + 0.25 * noise1(m * 3.1, L.seed));
          const speed = 0.12 + 0.2 * L.depth;
          const mx = ((m / 6) * (w + mw) + t * 12 * speed + off * 0.3) % (w + mw) - mw / 2;
          const my = L.base - L.amp * 0.15 + Math.sin(t * 0.2 + m) * 6;
          ctx.globalAlpha = Math.min(1, 0.55 * o.mist);
          ctx.drawImage(fog, mx - mw / 2, my - h * 0.05, mw, h * 0.12);
        }
        ctx.globalAlpha = 1;
      }

      // Birds after the far layers
      if (li === 1 && o.birds > 0) {
        ctx.strokeStyle = rgb(tone(0.85));
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let b = 0; b < o.birds; b++) {
          const bx = ((b * 137.5 + t * (14 + b * 1.5)) % (w + 80)) - 40;
          const by = h * (0.18 + 0.12 * noise1(b * 5.3 + t * 0.05, 99));
          const s = 4 + (b % 3);
          const flap = Math.sin(t * 6 + b) * s * 0.5;
          ctx.moveTo(bx - s, by - flap);
          ctx.quadraticCurveTo(bx - s * 0.4, by - s * 0.3, bx, by);
          ctx.quadraticCurveTo(bx + s * 0.4, by - s * 0.3, bx + s, by - flap);
        }
        ctx.stroke();
      }
    }
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
