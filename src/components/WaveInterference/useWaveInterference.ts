import { useRef } from "react";
import { useCanvasSetup } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity, glowSprite } from "../../runtime/fx";
import { rgbOf } from "../../utils/color";

export interface UseWaveInterferenceOptions {
  maxSources: number;
  wavelength: number;
  speed: number;
  colorHigh: string;
  colorLow: string;
  backgroundColor: string;
  showSources: boolean;
  resolution: number;
  animated: boolean;
  decay: number;
  interactive: boolean;
}

interface WaveSource { x: number; y: number; amp: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const GRAB_R = 18;

/**
 * Height and slope of the summed waves at (x, y): sources radiate cos(k·r − ωt) damped by
 * exp(−decay·r). Returns [height, dh/dx, dh/dy, envelope], each averaged over the sources.
 */
export function waveAt(x: number, y: number, src: readonly WaveSource[], k: number, wt: number, decay: number): [number, number, number, number] {
  let hgt = 0, gx = 0, gy = 0, env = 0;
  for (const s of src) {
    const dx = x - s.x, dy = y - s.y;
    const r = Math.sqrt(dx * dx + dy * dy) + 1e-6;
    const a = Math.exp(-decay * r) * s.amp;
    const ph = k * r - wt;
    hgt += a * Math.cos(ph);
    const sl = -a * Math.sin(ph) * k / r;
    gx += sl * dx; gy += sl * dy;
    env += a;
  }
  const n = Math.max(1, src.length);
  return [hgt / n, gx / n, gy / n, env / n];
}

/**
 * Wave interference as a lit water surface. Each source sends out ripples; where they meet,
 * the summed height and slope are shaded with diffuse light and a glossy sky glint, so the
 * bright fringes and the calm nodal lines between them read crisply. Sources bob as glowing
 * points: click empty water to add one, click a source to remove it, drag it to move it, and
 * your hovering finger stirs its own ripples.
 */
export function useWaveInterference(options: UseWaveInterferenceOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({
    t: 0, w: 0, h: 0, key: "", sources: [] as WaveSource[], finger: { x: 0, y: 0, amp: 0 } as WaveSource,
    grab: -1, downX: 0, downY: 0, moved: false, wasDown: false,
  });
  const buf = useRef<{ c: HTMLCanvasElement; g: CanvasRenderingContext2D; img: ImageData } | null>(null);
  const sprite = useRef<{ key: string; c: HTMLCanvasElement | null }>({ key: "", c: null });

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    if (o.animated) st.t += sec * o.speed;
    if (st.w !== w || st.h !== h) {
      st.w = w; st.h = h;
      st.sources = [{ x: w * 0.35, y: h * 0.5, amp: 1 }, { x: w * 0.65, y: h * 0.5, amp: 1 }]; // two, to show interference at once
    }

    // ---- input: click adds/removes, drag moves, hover stirs ----
    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, dt / 16.67);
    const near = (x: number, y: number) => st.sources.findIndex((q) => Math.hypot(q.x - x, q.y - y) < GRAB_R);
    if (o.interactive) {
      if (p.down && !st.wasDown && p.inside) { st.grab = near(p.x, p.y); st.downX = p.x; st.downY = p.y; st.moved = false; }
      if (p.down && st.grab >= 0 && st.sources[st.grab]) {
        if (Math.hypot(p.x - st.downX, p.y - st.downY) > 4) st.moved = true;
        if (st.moved) { st.sources[st.grab].x = clamp(p.x, 0, w); st.sources[st.grab].y = clamp(p.y, 0, h); }
      }
      for (const tap of p.taps) {
        if (st.grab >= 0 && st.moved) continue; // that press was a drag
        const i = near(tap.x, tap.y);
        if (i >= 0) st.sources.splice(i, 1);
        else if (st.sources.length < o.maxSources) st.sources.push({ x: tap.x, y: tap.y, amp: 1 });
      }
      if (!p.down) st.grab = -1;
      st.wasDown = p.down;
      // the finger: a weak source that follows the cursor while it moves, fading when still
      const sp = Math.hypot(vx, vy);
      const target = p.inside && st.grab < 0 ? clamp(sp / 12, 0, 0.8) : 0;
      st.finger.amp += (target - st.finger.amp) * Math.min(1, sec * (target > st.finger.amp ? 6 : 1.5));
      if (p.inside) { st.finger.x = p.x; st.finger.y = p.y; }
    } else st.finger.amp = 0;
    while (st.sources.length > Math.max(0, Math.round(o.maxSources))) st.sources.pop();
    const all = st.finger.amp > 0.02 ? [...st.sources, st.finger] : st.sources;

    // ---- the surface ----
    const res = clamp(o.resolution, 0.1, 1);
    const gw = Math.max(4, Math.round(w * res)), gh = Math.max(4, Math.round(h * res));
    let b = buf.current;
    if (typeof document !== "undefined" && (!b || b.c.width !== gw || b.c.height !== gh)) {
      const c = document.createElement("canvas");
      c.width = gw; c.height = gh;
      const g = c.getContext("2d");
      b = g ? { c, g, img: g.createImageData(gw, gh) } : null;
      buf.current = b;
    }
    const lo = rgbOf(o.colorLow, "0,0,0").split(",").map(Number), hi = rgbOf(o.colorHigh).split(",").map(Number);
    const bg = rgbOf(o.backgroundColor, "0,0,0").split(",").map(Number);
    if (b) {
      const data = b.img.data;
      const k = (2 * Math.PI) / Math.max(4, o.wavelength);
      const wt = k * 60 * st.t;
      const sx = w / gw, sy = h / gh;
      const slopeScale = 0.85 / k; // a full-amplitude wave tilts the surface ~40°
      // light from the upper left, viewer straight above
      const Lx = -0.45, Ly = -0.55, Lz = 0.7;
      const Hl = Math.hypot(Lx, Ly, Lz + 1), Hx = Lx / Hl, Hy = Ly / Hl, Hz = (Lz + 1) / Hl;
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          // inlined waveAt (no per-pixel allocation)
          const px = (x + 0.5) * sx, py = (y + 0.5) * sy;
          let hgt = 0, gx = 0, gy = 0, env = 0;
          for (let j = 0; j < all.length; j++) {
            const src = all[j], dx = px - src.x, dy = py - src.y;
            const r = Math.sqrt(dx * dx + dy * dy) + 1e-6;
            const a = Math.exp(-o.decay * r) * src.amp, ph = k * r - wt;
            hgt += a * Math.cos(ph);
            const sl = -a * Math.sin(ph) * k / r;
            gx += sl * dx; gy += sl * dy; env += a;
          }
          const inv = 1 / Math.max(1, all.length);
          hgt *= inv; gx *= inv; gy *= inv; env *= inv;
          let nx = -gx * slopeScale, ny = -gy * slopeScale, nz = 1;
          const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
          const diff = clamp(nx * Lx + ny * Ly + nz * Lz, 0, 1);
          const spec = Math.pow(Math.max(0, nx * Hx + ny * Hy + nz * Hz), 100);
          const e = clamp(env / 0.15, 0, 1), show = e * e * (3 - 2 * e); // dead water settles to background
          const m = clamp(0.5 + hgt * 0.6, 0, 1);
          const lit = 0.3 + 0.9 * diff;
          const q = (y * gw + x) * 4;
          for (let c = 0; c < 3; c++) {
            const water = (lo[c] + (hi[c] - lo[c]) * m) * lit + spec * 255 * 0.85;
            data[q + c] = bg[c] + (water - bg[c]) * show;
          }
          data[q + 3] = 255;
        }
      }
      b.g.putImageData(b.img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(b.c, 0, 0, w, h);
    } else {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // ---- sources: glowing bobbing points ----
    if (o.showSources) {
      if (sprite.current.key !== o.colorHigh) sprite.current = { key: o.colorHigh, c: glowSprite(o.colorHigh.startsWith("#") ? o.colorHigh : "#ffffff", 64) };
      const bob = Math.sin(st.t * 60 * (2 * Math.PI) / Math.max(4, o.wavelength));
      for (const src of st.sources) {
        if (sprite.current.c) {
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = 0.6 + 0.3 * bob;
          ctx.drawImage(sprite.current.c, src.x - 22, src.y - 22, 44, 44);
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath(); ctx.arc(src.x, src.y, 3 + bob, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(${hi.join(",")},0.6)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(src.x, src.y, 9, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }

  const setup = useCanvasSetup({ onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
