import { useRef } from "react";
import { useCanvasSetup } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer } from "../../runtime/fx";
import { rgbOf } from "../../utils/color";

export interface UseReactionDiffusionOptions {
  feedRate: number;
  killRate: number;
  diffusionU: number;
  diffusionV: number;
  resolution: number;
  speed: number;
  colorA: string;
  colorB: string;
  backgroundColor: string;
  interactive: boolean;
}

interface Field {
  u: Float32Array; v: Float32Array; uNext: Float32Array; vNext: Float32Array;
  /** Per-cell feed/kill offsets: a slowly drifting map so several pattern types coexist. */
  df: Float32Array; dk: Float32Array;
  gw: number; gh: number;
  c: HTMLCanvasElement | null; g: CanvasRenderingContext2D | null; img: ImageData | null;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Seed a soft disc of V (the autocatalyst) at grid cell (cx, cy), wrapping at the edges. */
export function seedDisc(u: Float32Array, v: Float32Array, gw: number, gh: number, cx: number, cy: number, r: number): void {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > r * r) continue;
      const i = ((cy + dy + gh) % gh) * gw + ((cx + dx + gw) % gw);
      u[i] = 0.5; v[i] = 0.25;
    }
  }
}

/**
 * Gray-Scott reaction-diffusion, lit like a wet relief. Feed and kill rates drift slowly across
 * the canvas around the chosen values, so spots, stripes and mazes meet and keep morphing into
 * each other instead of freezing. Hovering seeds a trail of chemical, taps drop a blob, and an
 * exhausted field reseeds itself.
 */
export function useReactionDiffusion(options: UseReactionDiffusionOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const s = useRef({ t: 0, key: "", field: null as Field | null, check: 0, lastGX: -1, lastGY: -1 });

  function init(gw: number, gh: number): Field {
    const size = gw * gh;
    const u = new Float32Array(size).fill(1), v = new Float32Array(size);
    const blobs = Math.max(5, Math.floor(size / 1000));
    for (let b = 0; b < blobs; b++) seedDisc(u, v, gw, gh, Math.floor(Math.random() * gw), Math.floor(Math.random() * gh), Math.floor(2 + Math.random() * 5));
    let c: HTMLCanvasElement | null = null, g: CanvasRenderingContext2D | null = null, img: ImageData | null = null;
    if (typeof document !== "undefined") {
      c = document.createElement("canvas");
      c.width = gw; c.height = gh;
      g = c.getContext("2d");
      img = g ? g.createImageData(gw, gh) : null;
      if (img) for (let i = 0; i < size; i++) img.data[i * 4 + 3] = 255;
    }
    return { u, v, uNext: new Float32Array(size), vNext: new Float32Array(size), df: new Float32Array(size), dk: new Float32Array(size), gw, gh, c, g, img };
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) {
    const o = optionsRef.current;
    const st = s.current;
    st.t += dt / 1000;
    const res = clamp(o.resolution, 0.1, 1);
    const gw = Math.max(4, Math.round(w * res)), gh = Math.max(4, Math.round(h * res));
    const key = `${gw}x${gh}`;
    if (st.key !== key || !st.field) { st.key = key; st.field = init(gw, gh); }
    const F = st.field;
    const { u, v, uNext, vNext, df, dk } = F;

    // ---- the drifting parameter map: two slow waves, a fraction of the chosen f and k ----
    if (Math.floor(st.t * 4) !== Math.floor((st.t - dt / 1000) * 4)) { // refresh 4x a second
      const t = st.t * 0.05;
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          const a = Math.sin(x / gw * 4.2 + t) * Math.cos(y / gh * 3.1 - t * 0.7);
          const b = Math.sin((x + y) / (gw + gh) * 5.3 - t * 1.3);
          df[y * gw + x] = a * 0.0022;
          dk[y * gw + x] = b * 0.0011;
        }
      }
    }

    // ---- input: hover leaves a thin trail, a tap drops a blob ----
    const p = readPointer(pointer.current, canvasEl.current);
    if (o.interactive) {
      if (p.inside) {
        const gx = Math.floor(p.x / w * gw), gy = Math.floor(p.y / h * gh);
        if (gx !== st.lastGX || gy !== st.lastGY) {
          if (st.lastGX >= 0) { // fill the gap since last frame so fast strokes stay continuous
            const n = Math.ceil(Math.hypot(gx - st.lastGX, gy - st.lastGY));
            for (let i = 1; i <= n; i++) seedDisc(u, v, gw, gh, Math.round(st.lastGX + (gx - st.lastGX) * i / n), Math.round(st.lastGY + (gy - st.lastGY) * i / n), p.down ? 3 : 1);
          }
          st.lastGX = gx; st.lastGY = gy;
        }
      } else st.lastGX = st.lastGY = -1;
      for (const tap of p.taps) seedDisc(u, v, gw, gh, Math.floor(tap.x / w * gw), Math.floor(tap.y / h * gh), 5);
    }

    // ---- simulate ----
    const steps = clamp(Math.round(o.speed), 1, 40);
    const f0 = o.feedRate, k0 = o.killRate, dU = o.diffusionU, dV = o.diffusionV;
    for (let s2 = 0; s2 < steps; s2++) {
      for (let y = 0; y < gh; y++) {
        const yn = ((y - 1 + gh) % gh) * gw, ys = ((y + 1) % gh) * gw, yc = y * gw;
        for (let x = 0; x < gw; x++) {
          const i = yc + x;
          const xw = (x - 1 + gw) % gw, xe = (x + 1) % gw;
          const lapU = u[yc + xw] + u[yc + xe] + u[yn + x] + u[ys + x] - 4 * u[i];
          const lapV = v[yc + xw] + v[yc + xe] + v[yn + x] + v[ys + x] - 4 * v[i];
          const f = f0 + df[i], k = k0 + dk[i];
          const uvv = u[i] * v[i] * v[i];
          uNext[i] = clamp(u[i] + dU * lapU - uvv + f * (1 - u[i]), 0, 1);
          vNext[i] = clamp(v[i] + dV * lapV + uvv - (f + k) * v[i], 0, 1);
        }
      }
      u.set(uNext); v.set(vNext);
    }

    // an exhausted field (all V gone) reseeds itself
    st.check += dt;
    if (st.check > 2000) {
      st.check = 0;
      let sum = 0;
      for (let i = 0; i < v.length; i += 7) sum += v[i];
      if (sum / (v.length / 7) < 0.002) for (let b = 0; b < 6; b++) seedDisc(u, v, gw, gh, Math.floor(Math.random() * gw), Math.floor(Math.random() * gh), 4);
    }

    // ---- render: the slope of v is the surface normal, lit from the upper left ----
    if (!F.img || !F.g || !F.c) return;
    const [ar, ag, ab] = rgbOf(o.colorA, "0,0,0").split(",").map(Number);
    const [br, bgc, bb] = rgbOf(o.colorB).split(",").map(Number);
    const data = F.img.data;
    const lx = -0.6, ly = -0.8;
    for (let y = 0; y < gh; y++) {
      const ym = y > 0 ? -gw : 0, yp = y < gh - 1 ? gw : 0;
      for (let x = 0; x < gw; x++) {
        const i = y * gw + x;
        const t = clamp(v[i] * 3.5, 0, 1);
        const dx = (v[x < gw - 1 ? i + 1 : i] - v[x > 0 ? i - 1 : i]) * 3.5;
        const dy = (v[i + yp] - v[i + ym]) * 3.5;
        const ndl = dx * lx + dy * ly;
        const diff = clamp(0.95 - ndl * 2.2, 0.35, 1.35);
        const spec = Math.pow(Math.max(0, -ndl * 2.4 - 0.25), 3) * t * 0.75;
        const rim = t * (1 - t) * 0.5; // a soft translucent glow on the flanks
        const shade = (1 - u[i] * 0.12) * diff;
        const q = i * 4;
        data[q] = Math.min(255, (ar + (br - ar) * t) * shade + spec * 255 + br * rim);
        data[q + 1] = Math.min(255, (ag + (bgc - ag) * t) * shade + spec * 255 + bgc * rim);
        data[q + 2] = Math.min(255, (ab + (bb - ab) * t) * shade + spec * 255 + bb * rim);
      }
    }
    F.g.putImageData(F.img, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    if (o.backgroundColor && o.backgroundColor !== "transparent") {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(F.c, 0, 0, w, h);
  }

  const setup = useCanvasSetup({ onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
