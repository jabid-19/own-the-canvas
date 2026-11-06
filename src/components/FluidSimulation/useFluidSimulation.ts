import { useRef } from "react";
import { useCanvasSetup } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer } from "../../runtime/fx";
import { rgbOf } from "../../utils/color";

// Stable fluids (Jos Stam, "Real-Time Fluid Dynamics for Games") on a rectangular grid of square
// cells, with vorticity confinement so the swirls stay crisp instead of smearing out.

export interface UseFluidSimulationOptions {
  resolution: number; // cells along the long side ≈ resolution * aspect^0.5
  viscosity: number;
  diffusion: number;
  dissipation: number;
  inkColors: string[];
  glowEffect: boolean;
  glowBlur: number;
  backgroundColor: string;
  autoInk: boolean;
  autoInkInterval: number;
  mouseForce: number;
  inkRadius: number;
}

interface Grid {
  W: number; H: number;
  u: Float32Array; v: Float32Array; u0: Float32Array; v0: Float32Array;
  r: Float32Array; g: Float32Array; b: Float32Array; tmp: Float32Array;
  p: Float32Array; div: Float32Array; curl: Float32Array;
  c: HTMLCanvasElement | null; ctx: CanvasRenderingContext2D | null; img: ImageData | null;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function bound(W: number, H: number, b: number, x: Float32Array) {
  for (let i = 1; i < W - 1; i++) {
    x[i] = b === 2 ? -x[i + W] : x[i + W];
    x[i + (H - 1) * W] = b === 2 ? -x[i + (H - 2) * W] : x[i + (H - 2) * W];
  }
  for (let j = 1; j < H - 1; j++) {
    x[j * W] = b === 1 ? -x[1 + j * W] : x[1 + j * W];
    x[W - 1 + j * W] = b === 1 ? -x[W - 2 + j * W] : x[W - 2 + j * W];
  }
  x[0] = 0.5 * (x[1] + x[W]);
  x[W - 1] = 0.5 * (x[W - 2] + x[2 * W - 1]);
  x[(H - 1) * W] = 0.5 * (x[1 + (H - 1) * W] + x[(H - 2) * W]);
  x[W * H - 1] = 0.5 * (x[W * H - 2] + x[W * (H - 1) - 1]);
}

function diffuse(W: number, H: number, b: number, x: Float32Array, x0: Float32Array, diff: number, dt: number) {
  const a = dt * diff * W * H;
  if (a <= 0) { x.set(x0); return; }
  const c = 1 + 4 * a;
  for (let k = 0; k < 4; k++) {
    for (let j = 1; j < H - 1; j++) {
      for (let i = 1; i < W - 1; i++) {
        const n = i + j * W;
        x[n] = (x0[n] + a * (x[n - 1] + x[n + 1] + x[n - W] + x[n + W])) / c;
      }
    }
    bound(W, H, b, x);
  }
}

/** Semi-Lagrangian advection; velocities are in cells per second. */
export function advect(W: number, H: number, b: number, d: Float32Array, d0: Float32Array, u: Float32Array, v: Float32Array, dt: number) {
  for (let j = 1; j < H - 1; j++) {
    for (let i = 1; i < W - 1; i++) {
      const n = i + j * W;
      const x = clamp(i - dt * u[n], 0.5, W - 1.5), y = clamp(j - dt * v[n], 0.5, H - 1.5);
      const i0 = Math.floor(x), j0 = Math.floor(y);
      const s1 = x - i0, t1 = y - j0, s0 = 1 - s1, t0 = 1 - t1;
      const m = i0 + j0 * W;
      d[n] = s0 * (t0 * d0[m] + t1 * d0[m + W]) + s1 * (t0 * d0[m + 1] + t1 * d0[m + 1 + W]);
    }
  }
  bound(W, H, b, d);
}

function project(G: Grid) {
  const { W, H, u, v, p, div } = G;
  for (let j = 1; j < H - 1; j++) {
    for (let i = 1; i < W - 1; i++) {
      const n = i + j * W;
      div[n] = -0.5 * (u[n + 1] - u[n - 1] + v[n + W] - v[n - W]);
      p[n] = 0;
    }
  }
  bound(W, H, 0, div); bound(W, H, 0, p);
  for (let k = 0; k < 12; k++) {
    for (let j = 1; j < H - 1; j++) {
      for (let i = 1; i < W - 1; i++) {
        const n = i + j * W;
        p[n] = (div[n] + p[n - 1] + p[n + 1] + p[n - W] + p[n + W]) / 4;
      }
    }
    bound(W, H, 0, p);
  }
  for (let j = 1; j < H - 1; j++) {
    for (let i = 1; i < W - 1; i++) {
      const n = i + j * W;
      u[n] -= 0.5 * (p[n + 1] - p[n - 1]);
      v[n] -= 0.5 * (p[n + W] - p[n - W]);
    }
  }
  bound(W, H, 1, u); bound(W, H, 2, v);
}

/** Vorticity confinement: push velocity around existing curls so small eddies survive. */
function confine(G: Grid, eps: number, dt: number) {
  const { W, H, u, v, curl } = G;
  for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
    const n = i + j * W;
    curl[n] = 0.5 * (v[n + 1] - v[n - 1] - (u[n + W] - u[n - W]));
  }
  for (let j = 2; j < H - 2; j++) for (let i = 2; i < W - 2; i++) {
    const n = i + j * W;
    let nx = 0.5 * (Math.abs(curl[n + 1]) - Math.abs(curl[n - 1]));
    let ny = 0.5 * (Math.abs(curl[n + W]) - Math.abs(curl[n - W]));
    const l = Math.hypot(nx, ny) + 1e-5;
    nx /= l; ny /= l;
    u[n] += eps * ny * curl[n] * dt;
    v[n] -= eps * nx * curl[n] * dt;
  }
}

function makeGrid(W: number, H: number): Grid {
  const n = W * H;
  const f = () => new Float32Array(n);
  let c: HTMLCanvasElement | null = null, ctx: CanvasRenderingContext2D | null = null, img: ImageData | null = null;
  if (typeof document !== "undefined") {
    c = document.createElement("canvas");
    c.width = W; c.height = H;
    ctx = c.getContext("2d");
    img = ctx ? ctx.createImageData(W, H) : null;
  }
  return { W, H, u: f(), v: f(), u0: f(), v0: f(), r: f(), g: f(), b: f(), tmp: f(), p: f(), div: f(), curl: f(), c, ctx, img };
}

/**
 * Ink in water. Three slow ink jets orbit the canvas and bursts bloom on a timer, all cycling
 * through the palette, so the field is always flowing and marbling even untouched. Moving the
 * cursor drags ink and current behind it; a tap blows a ring outward. Ink is tone-mapped so
 * overlapping colors mix rather than blow out, with a faint relief sheen on its folds.
 */
export function useFluidSimulation(options: UseFluidSimulationOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const s = useRef({ t: 0, key: "", grid: null as Grid | null, nextBurst: 0.4, ci: 0, lx: -1, ly: -1 });

  function splat(G: Grid, gx: number, gy: number, vx: number, vy: number, rgb: number[], amount: number, radius: number) {
    const R = Math.max(1, radius), R2 = R * R;
    const x0 = Math.max(1, Math.floor(gx - R * 2)), x1 = Math.min(G.W - 2, Math.ceil(gx + R * 2));
    const y0 = Math.max(1, Math.floor(gy - R * 2)), y1 = Math.min(G.H - 2, Math.ceil(gy + R * 2));
    for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) {
      const d2 = (i - gx) ** 2 + (j - gy) ** 2;
      const f = Math.exp(-d2 / R2);
      if (f < 0.01) continue;
      const n = i + j * G.W;
      G.r[n] += rgb[0] * amount * f; G.g[n] += rgb[1] * amount * f; G.b[n] += rgb[2] * amount * f;
      G.u[n] += vx * f; G.v[n] += vy * f;
    }
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = Math.min(0.033, dt / 1000);
    st.t += sec;
    const t = st.t;

    // grid: ~resolution² cells, square in screen space
    const N = clamp(Math.round(o.resolution), 32, 128);
    const aspect = Math.max(0.2, Math.min(5, w / Math.max(1, h)));
    const W = Math.max(8, Math.round(N * Math.sqrt(aspect))), H = Math.max(8, Math.round(N / Math.sqrt(aspect)));
    const key = `${W}x${H}`;
    if (st.key !== key || !st.grid) { st.key = key; st.grid = makeGrid(W, H); }
    const G = st.grid;
    const cell = w / W;
    const palette = (o.inkColors.length ? o.inkColors : ["#ffffff"]).map((c) => rgbOf(c).split(",").map((x) => Number(x) / 255));
    const colorAt = (k: number) => { // smooth walk through the palette
      const f = ((k % palette.length) + palette.length) % palette.length, i = Math.floor(f), m = f - i;
      const A = palette[i], B = palette[(i + 1) % palette.length];
      return [A[0] + (B[0] - A[0]) * m, A[1] + (B[1] - A[1]) * m, A[2] + (B[2] - A[2]) * m];
    };

    // ---- sources ----
    if (o.autoInk) {
      for (let e = 0; e < 3; e++) { // three jets on slow Lissajous orbits
        const a = t * 0.23 + e * Math.PI * 2 / 3;
        const ex = W * (0.5 + 0.3 * Math.cos(a)), ey = H * (0.5 + 0.28 * Math.sin(a * 1.6 + e));
        // aim toward the middle with a twist, so streams cross and roll up into eddies
        const aim = Math.atan2(H / 2 - ey, W / 2 - ex) + 0.7 * Math.sin(t * 0.4 + e * 2);
        splat(G, ex, ey, Math.cos(aim) * 55, Math.sin(aim) * 55, colorAt(t * 0.12 + e * 1.3), 6 * sec * 4, Math.max(1, o.inkRadius * 0.3));
      }
      st.nextBurst -= sec;
      if (st.nextBurst <= 0) {
        st.nextBurst = Math.max(0.05, o.autoInkInterval / 1000) * (0.6 + Math.random() * 0.8);
        const gx = W * (0.15 + Math.random() * 0.7), gy = H * (0.15 + Math.random() * 0.7), a = Math.random() * Math.PI * 2;
        splat(G, gx, gy, Math.cos(a) * 40, Math.sin(a) * 40, colorAt(st.ci++), 3, o.inkRadius);
      }
    }
    const p = readPointer(pointer.current, canvasEl.current);
    if (p.inside) {
      const gx = p.x / cell, gy = p.y / cell;
      if (st.lx >= 0) {
        const dx = gx - st.lx, dy = gy - st.ly;
        const moved = Math.hypot(dx, dy);
        if (moved > 0.05) {
          const steps = Math.min(8, Math.ceil(moved)); // stamp along the stroke so fast moves stay continuous
          for (let i = 1; i <= steps; i++) {
            splat(G, st.lx + dx * i / steps, st.ly + dy * i / steps, dx / sec * o.mouseForce * 0.08, dy / sec * o.mouseForce * 0.08, colorAt(st.ci * 0.15 + t * 0.2), 1.2 / steps, o.inkRadius * 0.7);
          }
          st.ci += moved * 0.02;
        }
      }
      st.lx = gx; st.ly = gy;
    } else st.lx = st.ly = -1;
    for (const tap of p.taps) { // a ring blown outward
      const gx = tap.x / cell, gy = tap.y / cell;
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        splat(G, gx + Math.cos(a) * 2, gy + Math.sin(a) * 2, Math.cos(a) * 60 * o.mouseForce * 0.2, Math.sin(a) * 60 * o.mouseForce * 0.2, colorAt(st.ci + k * 0.1), 0.35, o.inkRadius * 0.6);
      }
      st.ci++;
    }

    // ---- step ----
    const { u, v, u0, v0, tmp } = G;
    u0.set(u); v0.set(v);
    diffuse(W, H, 1, u, u0, o.viscosity, sec);
    diffuse(W, H, 2, v, v0, o.viscosity, sec);
    confine(G, 14, sec);
    project(G);
    u0.set(u); v0.set(v);
    advect(W, H, 1, u, u0, u0, v0, sec);
    advect(W, H, 2, v, v0, u0, v0, sec);
    project(G);
    const keep = Math.pow(clamp(o.dissipation, 0, 1), sec * 60);
    for (const d of [G.r, G.g, G.b]) {
      tmp.set(d);
      diffuse(W, H, 0, d, tmp, o.diffusion, sec);
      tmp.set(d);
      advect(W, H, 0, d, tmp, u, v, sec);
      for (let i = 0; i < d.length; i++) d[i] *= keep;
    }
    const vk = Math.pow(0.999, sec * 60);
    for (let i = 0; i < u.length; i++) { u[i] *= vk; v[i] *= vk; }

    // ---- render ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, w, h);
    if (o.backgroundColor && o.backgroundColor !== "transparent") { ctx.fillStyle = o.backgroundColor; ctx.fillRect(0, 0, w, h); }
    if (!G.img || !G.ctx || !G.c) return;
    const data = G.img.data;
    const { r, g, b } = G;
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const n = i + j * W;
        const L = r[n] + g[n] + b[n];
        // relief: light from the upper left across the ink's folds
        const lE = i < W - 1 ? r[n + 1] + g[n + 1] + b[n + 1] : L, lW = i > 0 ? r[n - 1] + g[n - 1] + b[n - 1] : L;
        const lS = j < H - 1 ? r[n + W] + g[n + W] + b[n + W] : L, lN = j > 0 ? r[n - W] + g[n - W] + b[n - W] : L;
        const shade = clamp(1 + ((lW - lE) + (lN - lS)) * 0.9, 0.6, 1.5);
        const q = n * 4;
        data[q] = 255 * (1 - Math.exp(-r[n] * 2.6)) * shade;
        data[q + 1] = 255 * (1 - Math.exp(-g[n] * 2.6)) * shade;
        data[q + 2] = 255 * (1 - Math.exp(-b[n] * 2.6)) * shade;
        data[q + 3] = 255 * (1 - Math.exp(-L * 2.2));
      }
    }
    G.ctx.putImageData(G.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(G.c, 0, 0, w, h);
    if (o.glowEffect && o.glowBlur > 0 && typeof ctx.filter === "string") { // glow: a blurred additive copy
      ctx.save();
      ctx.filter = `blur(${o.glowBlur}px)`;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.6;
      ctx.drawImage(G.c, 0, 0, w, h);
      ctx.restore();
    }
  }

  const setup = useCanvasSetup({ onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
