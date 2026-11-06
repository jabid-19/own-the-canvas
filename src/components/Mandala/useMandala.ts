import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";

export interface UseMandalaOptions {
  symmetry: number;
  colors: string[];
  lineWidth: number;
  speed: number;
  layers: number;
  radius: number;
  backgroundColor: string;
  animated: boolean;
  glowEffect: boolean;
  glowBlur: number;
  strokeOpacity: number;
  mirror: boolean;
  noiseAmount: number;
}

/** Glow is drawn at this fraction of canvas size, then upscaled. */
const GLOW_SCALE = 0.25;

/**
 * Every arm of a layer shares color, width and alpha, so all arms go into one
 * path and get one stroke. The old per-arm stroke paid for a shadowBlur pass
 * symmetry × mirror times per layer (80 blurs a frame at defaults).
 *
 * Glow: shadowBlur on thick, self-intersecting full-res paths is the expensive
 * part, so the glow pass is drawn on a quarter-res buffer (1/16 the pixels)
 * and upscaled under the sharp, shadowless strokes.
 */
export function useMandala(options: UseMandalaOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const timeRef = useRef(0);
  const glowRef = useRef<HTMLCanvasElement | null>(null);

  function onResize(w: number, h: number) {
    const g = (glowRef.current ??= document.createElement("canvas"));
    g.width = Math.max(1, Math.ceil(w * GLOW_SCALE));
    g.height = Math.max(1, Math.ceil(h * GLOW_SCALE));
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, _frame: FrameInfo) {
    const {
      colors, lineWidth, speed, radius,
      backgroundColor, animated, glowEffect, glowBlur,
      strokeOpacity, mirror, noiseAmount,
    } = optionsRef.current;
    const symmetry = Math.max(1, Math.round(optionsRef.current.symmetry));
    const layers = Math.max(1, Math.round(optionsRef.current.layers));

    if (animated) timeRef.current += speed * 0.005 * (dt / 16.67);
    const t = timeRef.current;

    ctx.clearRect(0, 0, w, h);
    if (backgroundColor && backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(w, h) * 0.45 * radius;
    const copies = mirror ? 2 : 1;

    // Sharp pass strokes arm by arm (cheaper for thick lines); the blurred glow
    // pass strokes one merged path per layer (one shadow pass per layer).
    const paths: Path2D[][] = [];
    const mergedPaths: Path2D[] = [];
    for (let l = 0; l < layers; l++) {
      const r = maxR * (1 - l * (0.85 / layers));
      const layerT = (t + l * 0.3) * (1 + l * 0.15);
      const layerPhase = (l / 8) * Math.PI * 2;
      const petals = 6 + l * 2;
      const steps = petals * 3;

      // Base arm shape, then rotated (and mirrored) copies into one path
      const xs = new Float32Array(steps + 1);
      const ys = new Float32Array(steps + 1);
      for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        const noise = noiseAmount * Math.sin(angle * 3 + layerT + layerPhase);
        const rr = r * (0.5 + 0.5 * Math.abs(Math.sin(angle * (petals / 2) + layerT * 0.5)));
        xs[i] = (rr + noise * r * 0.15) * Math.cos(angle);
        ys[i] = (rr + noise * r * 0.1) * Math.sin(angle);
      }

      const arms: Path2D[] = [];
      for (let s = 0; s < symmetry; s++) {
        const baseAngle = (s / symmetry) * Math.PI * 2;
        for (let m = 0; m < copies; m++) {
          const rot = baseAngle + (m === 1 ? Math.PI / symmetry : 0);
          const c = Math.cos(rot), sn = Math.sin(rot);
          const flip = m === 1 ? -1 : 1;
          const path = new Path2D();
          for (let i = 0; i <= steps; i++) {
            const x = xs[i], y = ys[i] * flip;
            const px = cx + x * c - y * sn;
            const py = cy + x * sn + y * c;
            if (i === 0) path.moveTo(px, py); else path.lineTo(px, py);
          }
          path.closePath();
          arms.push(path);
        }
      }
      paths.push(arms);
      const merged = new Path2D();
      for (const a of arms) merged.addPath(a);
      mergedPaths.push(merged);
    }

    const strokeLayers = (c: CanvasRenderingContext2D, shadow: number) => {
      for (let l = 0; l < layers; l++) {
        const color = colors[l % colors.length];
        if (shadow > 0) { c.shadowColor = color; c.shadowBlur = shadow; }
        c.strokeStyle = color;
        c.lineWidth = Math.max(0.1, lineWidth * (1 - l * 0.08));
        c.globalAlpha = Math.max(0, strokeOpacity * (1 - l * 0.1));
        if (shadow > 0) c.stroke(mergedPaths[l]);
        else for (const p of paths[l]) c.stroke(p);
      }
      c.shadowBlur = 0;
      c.globalAlpha = 1;
    };

    const g = glowRef.current;
    const gctx = glowEffect && glowBlur > 0 && g ? g.getContext("2d") : null;
    if (g && gctx) {
      gctx.setTransform(1, 0, 0, 1, 0, 0);
      gctx.clearRect(0, 0, g.width, g.height);
      gctx.setTransform(GLOW_SCALE, 0, 0, GLOW_SCALE, 0, 0);
      strokeLayers(gctx, glowBlur * GLOW_SCALE);
      ctx.drawImage(g, 0, 0, g.width / GLOW_SCALE, g.height / GLOW_SCALE);
    }
    strokeLayers(ctx, 0);
  }

  return useCanvasSetup({ onFrame: draw, onResize });
}
