import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";
import { noise1, fbm1 } from "../../runtime/noise";

export interface UseAuroraBorealisOptions {
  colors: string[];
  speed: number;
  intensity: number;
  layers: number;
  backgroundColor: string;
  waveAmplitude: number;
  waveFrequency: number;
  starCount: number;
  animated: boolean;
  interactive: boolean;
}

interface Star { x: number; y: number; r: number; tw: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Curtain light at height `d` above the curtain's lower hem (d < 0 is below it), for a curtain of
 * ray height `hgt`: a razor-sharp lower edge and a long exponential glow upward, as in real aurora.
 */
export function curtainProfile(d: number, hgt: number): number {
  if (d < 0) return Math.exp(d * 22);
  return Math.exp(-d / Math.max(0.01, hgt)) * (1 - Math.exp(-d * 45));
}

/**
 * Northern lights over a mountain lake. Each layer is a folding curtain of vertical rays: a
 * sharp bright hem that fades upward into a second color, brighter where the curtain folds back
 * on itself, rippling slowly along its length. Built in a small light buffer, added onto a
 * starry sky and mirrored in the lake below. The cursor brightens the curtains near it; a tap
 * sets off a substorm surge.
 */
export function useAuroraBorealis(options: UseAuroraBorealisOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({ t: 0, w: 0, h: 0, stars: [] as Star[], nStars: -1, surge: 0, stir: 0, sx: -1, shoot: null as null | { x: number; y: number; vx: number; vy: number; age: number } });
  const buf = useRef<{ c: HTMLCanvasElement; g: CanvasRenderingContext2D; img: ImageData; acc: Float32Array } | null>(null);

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    if (o.animated) st.t += sec * o.speed;
    const t = st.t;
    const horizon = h * 0.74;

    if (st.w !== w || st.h !== h || st.nStars !== o.starCount) {
      st.w = w; st.h = h; st.nStars = o.starCount;
      const n = clamp(Math.round(o.starCount), 0, 2000);
      st.stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.pow(Math.random(), 1.3) * horizon, r: 0.3 + Math.pow(Math.random(), 3) * 1.4, tw: Math.random() * 10 }));
    }
    const sky = rgbOf(o.backgroundColor, "0,0,0");
    const palette = (o.colors.length ? o.colors : ["#ffffff"]).map((c) => rgbOf(c));

    // ---- input ----
    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, k);
    if (o.interactive && p.inside && p.y < horizon) { st.stir = Math.min(1.5, st.stir + Math.hypot(vx, vy) * 0.006 * k); st.sx = p.x / w; }
    if (o.interactive && p.taps.length) st.surge = 1;
    st.stir *= Math.exp(-sec * 0.8);
    st.surge *= Math.exp(-sec * 0.6);

    // ---- sky and stars ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, 0, 0, horizon);
    g.addColorStop(0, `rgb(${mix(sky, "0,0,0", 0.4)})`);
    g.addColorStop(1, `rgb(${mix(sky, mix(palette[0], "40,60,80", 0.6), 0.12)})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, horizon + 1);
    for (const s2 of st.stars) {
      const a = 0.55 + 0.45 * Math.sin(st.t * 0.8 * (o.animated ? 1 : 0) + s2.tw * 3 + s2.tw);
      ctx.fillStyle = `rgba(235,240,255,${a * (0.4 + 0.6 * (1 - s2.y / horizon))})`;
      ctx.fillRect(s2.x, s2.y, s2.r * 1.4, s2.r * 1.4);
    }
    // a rare shooting star
    if (o.animated) {
      if (!st.shoot && Math.random() < sec * 0.05) st.shoot = { x: Math.random() * w, y: Math.random() * horizon * 0.4, vx: (Math.random() < 0.5 ? -1 : 1) * w * 0.6, vy: horizon * 0.25, age: 0 };
      if (st.shoot) {
        const sh = st.shoot;
        sh.age += sec; sh.x += sh.vx * sec; sh.y += sh.vy * sec;
        const a = Math.max(0, 1 - sh.age / 0.8);
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.8})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 0.08, sh.y - sh.vy * 0.08); ctx.stroke();
        if (sh.age > 0.8) st.shoot = null;
      }
    }

    // ---- the curtains, into a small light buffer ----
    const cols = Math.round(110 + 110 * frame.quality);
    const rows = Math.max(32, Math.round(cols * horizon / Math.max(1, w) * 2.2)); // finer vertically: the hem is sharp
    let b = buf.current;
    if (typeof document !== "undefined" && (!b || b.c.width !== cols || b.c.height !== rows)) {
      const c = document.createElement("canvas");
      c.width = cols; c.height = rows;
      const g2 = c.getContext("2d");
      b = g2 ? { c, g: g2, img: g2.createImageData(cols, rows), acc: new Float32Array(cols * rows * 3) } : null;
      buf.current = b;
    }
    if (b) {
      const acc = b.acc;
      acc.fill(0);
      const nL = clamp(Math.round(o.layers), 1, 12);
      const amp = clamp(o.waveAmplitude, 0, 1);
      const freq = Math.max(0.1, o.waveFrequency);
      const gain = clamp(o.intensity, 0, 2) * (1 + st.surge * 1.4);
      for (let L = 0; L < nL; L++) {
        const cr = palette[L % palette.length].split(",").map(Number);
        const ct = mix(palette[(L + 1) % palette.length], "255,70,170", 0.35).split(",").map(Number);
        const seed = L * 13.7;
        const hemY = 0.36 + (L / Math.max(1, nL - 1 || 1)) * 0.36 + (L % 2) * 0.04; // stacked bands, near ones lower
        const depthDim = 0.55 + 0.45 * (L / Math.max(1, nL - 1 || 1));
        const hgt = 0.22 + (L % 3) * 0.08;
        let prev = 0;
        for (let c = 0; c < cols; c++) {
          const u = c / cols;
          // the hem folds: slow large waves plus finer drifting folds
          const fold = (fbm1(u * freq * 1.3 + t * 0.05 + seed, 3, seed) - 0.5) * amp * 3.2
            + Math.sin(u * freq * Math.PI * 2 + t * 0.25 + seed) * amp * 0.5;
          const yb = (hemY + fold) * rows;
          const slope = c ? Math.abs(yb - prev) / rows * cols * 0.04 : 0;
          prev = yb;
          // rays: fine vertical striations that shimmer and travel along the curtain
          const ray = 0.15 + 0.85 * Math.pow(noise1(u * 70 + t * 0.9 + seed, seed + 3), 3) * (0.5 + 0.5 * noise1(u * 9 - t * 0.4, seed + 5));
          const presence = clamp(noise1(u * 2.2 + t * 0.03 + seed, seed + 7) * 2 - 0.6, 0, 1); // curtains come and go
          let bright = ray * presence * depthDim * gain * 1.3 * (1 + Math.min(1.5, slope));
          if (st.stir > 0.01 && st.sx >= 0) bright *= 1 + st.stir * Math.exp(-(((u - st.sx) / 0.12) ** 2)) * 1.5;
          if (bright < 0.01) continue;
          const ray2 = hgt * (0.7 + 0.6 * noise1(u * 25 + seed, seed + 9));
          const y0 = Math.max(0, Math.floor(yb - ray2 * rows * 4)), y1 = Math.min(rows - 1, Math.ceil(yb + 6));
          for (let y = y0; y <= y1; y++) {
            const d = (yb - y) / rows;
            const I = curtainProfile(d, ray2) * bright;
            if (I < 0.003) continue;
            const kTop = clamp(d / (ray2 * 1.6), 0, 1);
            const i = (y * cols + c) * 3;
            acc[i] += (cr[0] + (ct[0] - cr[0]) * kTop) * I;
            acc[i + 1] += (cr[1] + (ct[1] - cr[1]) * kTop) * I;
            acc[i + 2] += (cr[2] + (ct[2] - cr[2]) * kTop) * I;
          }
        }
      }
      const data = b.img.data;
      for (let i = 0, j = 0; i < acc.length; i += 3, j += 4) {
        const r = acc[i], gg = acc[i + 1], bb = acc[i + 2];
        const m = Math.max(r, gg, bb);
        if (m < 1) { data[j + 3] = 0; continue; }
        // additive light -> straight alpha: hue from the ratio, alpha from the peak channel
        data[j] = r / m * 255; data[j + 1] = gg / m * 255; data[j + 2] = bb / m * 255;
        data[j + 3] = Math.min(255, m);
      }
      b.g.putImageData(b.img, 0, 0);
      ctx.globalCompositeOperation = "lighter";
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(b.c, 0, 0, w, horizon);
      // a soft bloom: the same light, larger and fainter
      ctx.globalAlpha = 0.35;
      ctx.drawImage(b.c, -w * 0.02, -horizon * 0.03, w * 1.04, horizon * 1.06);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    // ---- mountains, pines and the lake ----
    const rim = mix(palette[0], "255,255,255", 0.2);
    for (let r = 0; r < 2; r++) {
      const peak = h * (r ? 0.1 : 0.2), base = horizon;
      ctx.fillStyle = `rgb(${r ? mix(sky, "0,0,0", 0.6) : mix(mix(sky, palette[0], 0.07), "40,50,70", 0.12)})`;
      ctx.beginPath();
      ctx.moveTo(0, base + 1);
      for (let i = 0; i <= 64; i++) {
        const x = (i / 64) * w;
        ctx.lineTo(x, base - fbm1(x / w * (r ? 5 : 2.5) + r * 9, 4, 21 + r) * peak);
      }
      ctx.lineTo(w, base + 1);
      ctx.closePath();
      ctx.fill();
      if (!r) { // aurora light catching the far snow
        ctx.strokeStyle = `rgba(${rim},0.18)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    ctx.fillStyle = `rgb(${mix(sky, "0,0,0", 0.85)})`; // a ragged line of pines on the near shore
    for (let i = 0; i < 70; i++) {
      const x = ((i * 0.618) % 1) * w, th = h * (0.03 + ((i * 0.37) % 1) * 0.05), tw = th * 0.32;
      ctx.beginPath(); ctx.moveTo(x, horizon - th); ctx.lineTo(x - tw, horizon + 1); ctx.lineTo(x + tw, horizon + 1); ctx.closePath(); ctx.fill();
    }
    // lake: a darker mirror of the sky with the aurora rippling in it
    const lake = ctx.createLinearGradient(0, horizon, 0, h);
    lake.addColorStop(0, `rgb(${mix(sky, "0,0,0", 0.3)})`);
    lake.addColorStop(1, `rgb(${mix(sky, "0,0,0", 0.6)})`);
    ctx.fillStyle = lake;
    ctx.fillRect(0, horizon, w, h - horizon);
    if (b) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, horizon, w, h - horizon); ctx.clip();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.3;
      ctx.translate(0, horizon * 2);
      ctx.scale(1, -1);
      ctx.drawImage(b.c, Math.sin(t * 0.7) * 3, 0, w, horizon);
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; // still-water shimmer lines
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const y = horizon + (h - horizon) * (0.1 + i * 0.09);
      const x = ((i * 0.37 + t * 0.01) % 1) * w;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * 0.15, y); ctx.stroke();
    }
  }

  const setup = useCanvasSetup({ onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
