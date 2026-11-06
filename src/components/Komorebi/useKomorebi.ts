import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";
import { noise1 } from "../../runtime/noise";

export interface UseKomorebiOptions {
  lightColor: string;
  shadowColor: string;
  backgroundColor: string;
  density: number;
  wind: number;
  sunHeight: number;
  interactive: boolean;
  overlay: boolean;
}

interface Spot { x: number; y: number; r: number; seed: number }
interface Leaf { x: number; y: number; s: number; a: number; seed: number }
interface Gust { x: number; y: number; r: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const smooth = (e0: number, e1: number, x: number) => { const k = clamp((x - e0) / (e1 - e0), 0, 1); return k * k * (3 - 2 * k); };

/**
 * Shape of each light spot: every gap in the canopy is a pinhole camera projecting the sun, so
 * spots are discs stretched along the light direction as the sun gets lower.
 */
export function spotStretch(sunHeight: number): number {
  return 1 / Math.max(0.25, Math.sin(clamp(sunHeight, 0.05, 1) * Math.PI / 2));
}

/** A pinhole sun image tinted `rgb`: white-hot center, colored body, soft rim. */
function spotSprite(rgb: string): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  if (!g || typeof g.createRadialGradient !== "function") return null;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  const core = mix(rgb, "255,255,255", 0.55);
  gr.addColorStop(0, `rgba(${core},1)`);
  gr.addColorStop(0.55, `rgba(${rgb},0.92)`);
  gr.addColorStop(0.8, `rgba(${rgb},0.4)`);
  gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return c;
}

/**
 * Komorebi: sunlight filtering through leaves onto a wall. Light spots (pinhole images of the
 * sun, stretched as it gets lower) open, close and drift as the unseen canopy sways, under the
 * soft moving shadows of nearer leaves. Your cursor is a breeze that stirs the leaves around it;
 * a tap sends a gust rippling outward. As an overlay it dapples the whole page.
 */
export function useKomorebi(options: UseKomorebiOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({ t: 0, pools: [] as Spot[], spots: [] as Spot[], leaves: [] as Leaf[], gusts: [] as Gust[], stir: 0, sx: -1, sy: -1, w: 0, h: 0, n: -1 });
  const sprite = useRef<{ key: string; img: HTMLCanvasElement | null }>({ key: "", img: null });

  function seed(w: number, h: number, density: number) {
    const st = s.current;
    st.w = w; st.h = h; st.n = density;
    const area = (w * h) / 10000;
    const n = clamp(Math.round(area * 7 * density), 16, 1200);
    st.spots = [];
    st.pools = [];
    // clustered: light comes through a few big gaps, as many small spots
    const clusters = Math.max(3, Math.round(n / 24));
    for (let c = 0; c < clusters; c++) {
      const cx = Math.random() * w, cy = Math.random() * h, cr = Math.min(w, h) * (0.14 + Math.random() * 0.2);
      st.pools.push({ x: cx, y: cy, r: cr, seed: Math.random() * 1000 });
      for (let i = 0; i < n / clusters; i++) {
        const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * cr;
        st.spots.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, r: Math.min(w, h) * (0.018 + Math.random() * 0.035), seed: Math.random() * 1000 });
      }
    }
    st.leaves = Array.from({ length: 9 }, () => ({ x: Math.random() * w, y: Math.random() * h, s: Math.min(w, h) * (0.12 + Math.random() * 0.14), a: Math.random() * Math.PI * 2, seed: Math.random() * 100 }));
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;
    if (st.w !== w || st.h !== h || st.n !== o.density) seed(w, h, o.density);
    const light = rgbOf(o.lightColor), shade = rgbOf(o.shadowColor);
    if (sprite.current.key !== light) sprite.current = { key: light, img: spotSprite(light) };
    const solid = rgbOf(o.backgroundColor, "0,0,0");
    const scene = !frame.overlay && o.backgroundColor !== "transparent";

    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, k);
    if (o.interactive && p.inside) {
      st.stir = Math.min(3, st.stir + Math.hypot(vx, vy) * 0.01 * k);
      st.sx = p.x; st.sy = p.y;
    }
    st.stir *= Math.exp(-sec * 0.9);
    if (o.interactive) for (const tap of p.taps) st.gusts.push({ x: tap.x, y: tap.y, r: 0 });
    const U = Math.min(w, h);
    for (const g of st.gusts) g.r += sec * U * 0.9;
    st.gusts = st.gusts.filter((g) => g.r < Math.hypot(w, h));

    // ---- the wall in shade ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    if (scene) {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, `rgb(${mix(solid, shade, 0.25)})`);
      g.addColorStop(1, `rgb(${mix(mix(solid, shade, 0.4), "0,0,0", 0.15)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // a broad warm wash where most of the light lands
      const wash = ctx.createRadialGradient(w * 0.6, h * 0.35, 0, w * 0.6, h * 0.35, Math.max(w, h) * 0.8);
      wash.addColorStop(0, `rgba(${light},0.16)`);
      wash.addColorStop(1, `rgba(${light},0)`);
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);
    }

    // ---- light spots ----
    const stretch = spotStretch(o.sunHeight);
    const sway = U * 0.025 * o.wind;
    const gustAt = (x: number, y: number) => {
      let gx = 0, gy = 0;
      for (const g of st.gusts) {
        const dx = x - g.x, dy = y - g.y, d = Math.hypot(dx, dy) || 1;
        const band = Math.exp(-(((d - g.r) / (U * 0.08)) ** 2));
        const fade = 1 - g.r / Math.hypot(w, h);
        gx += (dx / d) * band * fade * U * 0.03; gy += (dy / d) * band * fade * U * 0.03;
      }
      return [gx, gy];
    };
    ctx.globalCompositeOperation = scene ? "lighter" : "source-over";
    const img = sprite.current.img;
    // a broad glow under each cluster: where many gaps line up, the wall is washed with light
    if (img) {
      for (const pl of st.pools) {
        const breath = 0.6 + 0.4 * noise1(t * 0.15 + pl.seed, 6);
        ctx.globalAlpha = (scene ? 0.16 : 0.07) * breath;
        const R = pl.r * 1.5;
        ctx.drawImage(img, pl.x - R, pl.y - R * stretch, R * 2, R * 2 * stretch);
      }
    }
    const budget = Math.round(st.spots.length * (0.5 + 0.5 * frame.quality));
    for (let i = 0; i < budget; i++) {
      const sp = st.spots[i];
      // coherent canopy sway: nearby spots move together like one branch
      let ox = (noise1(t * 0.25 * (0.6 + o.wind * 0.4) + sp.y * 0.004, 1) - 0.5) * sway * 2;
      let oy = (noise1(t * 0.22 * (0.6 + o.wind * 0.4) + sp.x * 0.004, 2) - 0.5) * sway * 1.4;
      let local = 0;
      if (st.sx >= 0 && st.stir > 0.01) {
        const d = Math.hypot(sp.x - st.sx, sp.y - st.sy);
        local = st.stir * Math.max(0, 1 - d / (U * 0.4));
        ox += Math.sin(t * 9 + sp.seed) * local * U * 0.012;
        oy += Math.cos(t * 7 + sp.seed) * local * U * 0.012;
      }
      const [gx, gy] = gustAt(sp.x, sp.y);
      ox += gx; oy += gy;
      // leaves cover and uncover each gap: the spot breathes in and out
      const open = smooth(0.22, 0.52, noise1(t * (0.35 + 0.25 * o.wind + local * 1.5) + sp.seed, 5));
      if (open < 0.02) continue;
      const x = sp.x + ox, y = sp.y + oy, r = sp.r * (0.85 + 0.3 * open);
      const a = scene ? 0.7 * open : 0.25 * open;
      ctx.globalAlpha = a;
      if (img) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(0.35);
        ctx.drawImage(img, -r, -r * stretch, r * 2, r * 2 * stretch);
        ctx.restore();
      } else {
        ctx.fillStyle = `rgb(${light})`;
        ctx.beginPath(); ctx.ellipse(x, y, r, r * stretch, 0.35, 0, Math.PI * 2); ctx.fill();
      }
    }

    // ---- soft shadows of nearer leaves drifting over it all ----
    ctx.globalCompositeOperation = "source-over";
    for (const lf of st.leaves) {
      const lx = lf.x + (noise1(t * 0.18 + lf.seed, 7) - 0.5) * sway * 5;
      const ly = lf.y + (noise1(t * 0.15 + lf.seed, 8) - 0.5) * sway * 3;
      const la = lf.a + (noise1(t * 0.2 + lf.seed, 9) - 0.5) * 0.6 * o.wind;
      for (let pass = 0; pass < 2; pass++) { // umbra + wider penumbra
        const sc = pass ? 1.12 : 1;
        ctx.globalAlpha = scene ? (pass ? 0.08 : 0.14) : (pass ? 0.05 : 0.08);
        ctx.fillStyle = `rgb(${mix(shade, "0,0,0", 0.4)})`;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(la);
        ctx.scale(sc, sc);
        const L = lf.s;
        ctx.beginPath();
        ctx.moveTo(-L, 0);
        ctx.bezierCurveTo(-L * 0.4, -L * 0.42, L * 0.5, -L * 0.36, L, 0);
        ctx.bezierCurveTo(L * 0.5, L * 0.36, -L * 0.4, L * 0.42, -L, 0);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }

  const setup = useCanvasSetup({ overlay: options.overlay, onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
