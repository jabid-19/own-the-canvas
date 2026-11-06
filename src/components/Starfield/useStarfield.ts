import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";
import { fbm2 } from "../../runtime/noise";

export type StarfieldPerspective = "2D" | "3D";

export interface UseStarfieldOptions {
  starCount: number;
  starColor: string;
  shootingStarColor: string;
  backgroundColor: string;
  speed: number;
  twinkle: boolean;
  shootingStars: boolean;
  shootingStarInterval: number;
  perspective: StarfieldPerspective;
  starSizeMin: number;
  starSizeMax: number;
  starOpacityMin: number;
  starOpacityMax: number;
  twinkleSpeed: number;
  shootingStarLength: number;
  shootingStarLifetime: number;
}

interface Star { x: number; y: number; z: number; size: number; alpha: number; tint: number; tw: number; px: number; py: number }
interface Shooter { x: number; y: number; vx: number; vy: number; age: number; life: number }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
// Stellar temperature tints, cool red dwarfs to hot blue giants.
const TEMPS = ["255,190,150", "255,225,190", "255,250,240", "220,232,255", "180,205,255"];

/** Pick a temperature tint 0..4: mostly sun-like, a few hot blue and cool orange stars. */
export function starTint(r: number): number {
  return r < 0.12 ? 0 : r < 0.32 ? 1 : r < 0.7 ? 2 : r < 0.92 ? 3 : 4;
}

function seedStar(w: number, h: number, o: UseStarfieldOptions, three: boolean): Star {
  const z = three ? Math.random() : Math.pow(Math.random(), 1.6) * 0.9 + 0.1; // 2D: depth layer 0.1..1, most stars far
  const span = Math.max(0, o.starSizeMax - o.starSizeMin);
  return {
    x: three ? (Math.random() - 0.5) * w * 2 : Math.random() * w,
    y: three ? (Math.random() - 0.5) * h * 2 : Math.random() * h,
    z, size: o.starSizeMin + span * Math.pow(Math.random(), 3) * (three ? 1 : 0.4 + 0.6 * z),
    alpha: o.starOpacityMin + (o.starOpacityMax - o.starOpacityMin) * Math.random(),
    tint: starTint(Math.random()), tw: Math.random() * Math.PI * 2, px: 0, py: 0,
  };
}

/**
 * A deep-sky vista. In 2D: a Milky Way band with glowing star clouds, dark dust lanes and faint
 * nebulae (painted once into a cached layer), under three parallax layers of temperature-tinted
 * stars that drift slowly and shift as the cursor looks around; the brightest carry diffraction
 * spikes, small ones scintillate, and tapered meteors streak across now and then. In 3D: a warp
 * tunnel with motion-streaked stars that the cursor steers.
 */
export function useStarfield(options: UseStarfieldOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const s = useRef({ t: 0, w: 0, h: 0, key: "", stars: [] as Star[], shooters: [] as Shooter[], nextShoot: 1.5, lookX: 0, lookY: 0, vpx: 0.5, vpy: 0.5 });
  const sky = useRef<{ key: string; c: HTMLCanvasElement | null }>({ key: "", c: null });
  const glow = useRef<{ key: string; c: HTMLCanvasElement | null }>({ key: "", c: null });

  /** Milky Way, dust lanes and nebulae at third resolution, rebuilt only when size or colors change. */
  function paintSky(w: number, h: number, base: string, bg: string) {
    if (typeof document === "undefined") return null;
    const sw = Math.max(1, Math.round(w / 3)), sh = Math.max(1, Math.round(h / 3));
    const c = document.createElement("canvas");
    c.width = sw; c.height = sh;
    const g = c.getContext("2d");
    if (!g || typeof g.createImageData !== "function") return c;
    const img = g.createImageData(sw, sh);
    const d = img.data;
    const [br, bgc, bb] = bg.split(",").map(Number);
    const warm = "255,214,170".split(",").map(Number), cool = mix(base, "120,150,255", 0.5).split(",").map(Number);
    const neb1 = mix(base, "255,70,150", 0.6).split(",").map(Number), neb2 = mix(base, "60,190,255", 0.6).split(",").map(Number);
    const ang = -0.42, ca = Math.cos(ang), sa = Math.sin(ang);
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const u = x / sw, v = y / sh;
        // distance across the band (rotated frame), with a wandering centerline
        const along = (u - 0.5) * ca - (v - 0.5) * sa * (sh / sw);
        const across = (u - 0.5) * sa + (v - 0.5) * ca * (sh / sw) + (fbm2(along * 3, 0.5, 3, 4) - 0.5) * 0.08;
        const band = Math.exp(-((across / 0.17) ** 2));
        const cloud = fbm2(u * 6, v * 6 * sh / sw, 5, 1);
        let L = band * Math.pow(cloud, 1.6) * 1.5;
        const lane = Math.exp(-((across / 0.022) ** 2)) * Math.pow(fbm2(u * 9 + 3, v * 9, 4, 2), 1.2) * 1.1; // dark dust
        L = Math.max(0, L - lane * band);
        const core = Math.exp(-((along / 0.25) ** 2)); // brighter, warmer toward the galactic core
        const n1 = Math.pow(Math.max(0, fbm2(u * 3 + 10, v * 3, 4, 5) - 0.5) * 2, 2.2) * Math.exp(-(((u - 0.22) / 0.25) ** 2 + ((v - 0.7) / 0.35) ** 2));
        const n2 = Math.pow(Math.max(0, fbm2(u * 3 - 10, v * 3, 4, 6) - 0.5) * 2, 2.2) * Math.exp(-(((u - 0.8) / 0.22) ** 2 + ((v - 0.25) / 0.3) ** 2));
        const i = (y * sw + x) * 4;
        const k = L * (0.35 + 0.65 * core);
        let r = br, gg = bgc, b2 = bb;
        r += (warm[0] * core + cool[0] * (1 - core)) * k * 0.55 + neb1[0] * n1 * 0.75 + neb2[0] * n2 * 0.6;
        gg += (warm[1] * core + cool[1] * (1 - core)) * k * 0.55 + neb1[1] * n1 * 0.75 + neb2[1] * n2 * 0.6;
        b2 += (warm[2] * core + cool[2] * (1 - core)) * k * 0.55 + neb1[2] * n1 * 0.75 + neb2[2] * n2 * 0.6;
        d[i] = Math.min(255, r); d[i + 1] = Math.min(255, gg); d[i + 2] = Math.min(255, b2); d[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    // upscale the clouds into a full-resolution layer so the star dust stays pin-sharp
    const full = document.createElement("canvas");
    full.width = Math.max(1, Math.round(w)); full.height = Math.max(1, Math.round(h));
    const fg = full.getContext("2d");
    if (!fg) return c;
    fg.imageSmoothingEnabled = true;
    fg.drawImage(c, 0, 0, full.width, full.height);
    // star dust: thousands of faint points, densest in the band
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < w * h * 0.012; i++) {
      const x = rnd() * w, y = rnd() * h;
      const along = (x / w - 0.5) * ca - (y / h - 0.5) * sa * (h / w);
      const across = (x / w - 0.5) * sa + (y / h - 0.5) * ca * (h / w);
      if (rnd() > 0.08 + 0.92 * Math.exp(-((across / 0.14) ** 2))) continue;
      fg.fillStyle = `rgba(255,248,240,${0.12 + rnd() * 0.5 * (0.5 + 0.5 * Math.exp(-((along / 0.4) ** 2)))})`;
      fg.fillRect(x, y, rnd() < 0.85 ? 1 : 1.5, 1);
    }
    return full;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    st.t += sec;
    const t = st.t;
    const three = o.perspective === "3D";
    const base = rgbOf(o.starColor), bg = rgbOf(o.backgroundColor, "0,0,0"), shootC = rgbOf(o.shootingStarColor);

    const n = clamp(Math.round(o.starCount * (0.6 + 0.4 * frame.quality)), 0, 5000);
    const key = `${w}x${h}|${o.perspective}|${o.starSizeMin}|${o.starSizeMax}|${o.starOpacityMin}|${o.starOpacityMax}`;
    if (st.key !== key) { st.key = key; st.stars = []; st.w = w; st.h = h; }
    while (st.stars.length < n) st.stars.push(seedStar(w, h, o, three));
    st.stars.length = n;
    if (glow.current.key !== o.starColor) glow.current = { key: o.starColor, c: glowSprite("#ffffff", 64) };

    // cursor: 2D looks around (parallax), 3D steers the vanishing point
    const p = readPointer(pointer.current, canvasEl.current);
    const lx = p.inside ? (p.x / w - 0.5) : 0, ly = p.inside ? (p.y / h - 0.5) : 0;
    st.lookX += (lx - st.lookX) * Math.min(1, sec * 2);
    st.lookY += (ly - st.lookY) * Math.min(1, sec * 2);
    st.vpx += ((p.inside ? p.x / w : 0.5) - st.vpx) * Math.min(1, sec * 1.5);
    st.vpy += ((p.inside ? p.y / h : 0.5) - st.vpy) * Math.min(1, sec * 1.5);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgb(${bg})`;
    ctx.fillRect(0, 0, w, h);

    // ---- the sky layer ----
    const skyKey = `${w}x${h}|${base}|${bg}`;
    if (sky.current.key !== skyKey) sky.current = { key: skyKey, c: paintSky(w, h, base, bg) };
    if (sky.current.c) {
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = three ? 0.35 : 1;
      const m = w * 0.03; // a little overscan so the parallax never shows an edge
      ctx.drawImage(sky.current.c, -m - st.lookX * m, -m - st.lookY * m, w + m * 2, h + m * 2);
      ctx.globalAlpha = 1;
    }

    const sprite = glow.current.c;
    const tw = o.twinkle ? o.twinkleSpeed * 60 : 0;
    const speed = o.speed;

    if (!three) {
      // ---- 2D: parallax layers drifting slowly ----
      ctx.globalCompositeOperation = "lighter";
      for (const s2 of st.stars) {
        s2.x -= speed * sec * 12 * s2.z;
        if (s2.x < -4) { s2.x += w + 8; s2.y = Math.random() * h; }
        const x = s2.x - st.lookX * w * 0.05 * s2.z, y = s2.y - st.lookY * h * 0.05 * s2.z;
        const sc = tw ? 0.7 + 0.3 * Math.sin(t * tw * (0.5 + s2.tw * 0.3) + s2.tw * 7) * (s2.size < 1.4 ? 1 : 0.3) : 1;
        const a = s2.alpha * sc * (0.45 + 0.55 * s2.z);
        const col = mix(TEMPS[s2.tint], base, 0.35);
        ctx.fillStyle = `rgba(${col},${a})`;
        const r = s2.size;
        if (r < 1.2) ctx.fillRect(x - r / 2, y - r / 2, Math.max(0.6, r), Math.max(0.6, r));
        else {
          ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, Math.PI * 2); ctx.fill();
          if (sprite) { ctx.globalAlpha = a * 0.6; ctx.drawImage(sprite, x - r * 4, y - r * 4, r * 8, r * 8); ctx.globalAlpha = 1; }
          if (r > o.starSizeMin + (o.starSizeMax - o.starSizeMin) * 0.6) { // diffraction spikes on the brightest
            ctx.strokeStyle = `rgba(${col},${a * 0.5})`;
            ctx.lineWidth = 0.6;
            const L = r * 6;
            ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
          }
        }
      }
    } else {
      // ---- 3D: warp tunnel ----
      const cx = w * st.vpx, cy = h * st.vpy;
      const fov = Math.min(w, h) * 0.5;
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (const s2 of st.stars) {
        const prevZ = s2.z;
        s2.z -= speed * sec * 0.35;
        if (s2.z <= 0.02) { Object.assign(s2, seedStar(w, h, o, true), { z: 1 }); continue; }
        const sx = cx + (s2.x / s2.z) * fov / Math.max(w, h) * 2, sy = cy + (s2.y / s2.z) * fov / Math.max(w, h) * 2;
        const px = cx + (s2.x / prevZ) * fov / Math.max(w, h) * 2, py = cy + (s2.y / prevZ) * fov / Math.max(w, h) * 2;
        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) { Object.assign(s2, seedStar(w, h, o, true), { z: 1 }); continue; }
        const near = 1 - s2.z;
        const a = s2.alpha * Math.min(1, near * 1.6);
        const col = mix(mix(TEMPS[s2.tint], base, 0.4), "190,215,255", near * 0.4);
        // streak from where the star was, stretched further at speed
        const stretch = 1 + speed * 2.5;
        const tx = sx - (sx - px) * stretch, ty = sy - (sy - py) * stretch;
        ctx.strokeStyle = `rgba(${col},${a})`;
        ctx.lineWidth = Math.max(0.5, s2.size * near * 1.6);
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sx, sy); ctx.stroke();
      }
      if (sprite) { // a soft glow at the vanishing point
        ctx.globalAlpha = 0.25 + 0.1 * Math.min(2, speed);
        const R = Math.min(w, h) * 0.5;
        ctx.drawImage(sprite, cx - R, cy - R, R * 2, R * 2);
        ctx.globalAlpha = 1;
      }
    }

    // ---- meteors ----
    if (o.shootingStars) {
      st.nextShoot -= sec;
      if (st.nextShoot <= 0) {
        const a = 0.35 + Math.random() * 0.5, dir = Math.random() < 0.5 ? 1 : -1;
        const v = Math.max(40, o.shootingStarLength) * 9;
        st.shooters.push({ x: Math.random() * w, y: Math.random() * h * 0.5, vx: Math.cos(a) * v * dir, vy: Math.sin(a) * v, age: 0, life: Math.max(10, o.shootingStarLifetime) / 60 });
        st.nextShoot = (o.shootingStarInterval / 1000) * (0.5 + Math.random());
      }
    }
    for (const m of st.shooters) {
      m.age += sec;
      m.x += m.vx * sec; m.y += m.vy * sec;
      const k = m.age / m.life;
      const fade = Math.sin(Math.PI * clamp(k, 0, 1));
      const sp = Math.hypot(m.vx, m.vy) || 1;
      const L = o.shootingStarLength * (0.4 + 0.6 * Math.min(1, k * 3));
      const tx = m.x - (m.vx / sp) * L, ty = m.y - (m.vy / sp) * L;
      const gr = ctx.createLinearGradient(m.x, m.y, tx, ty);
      gr.addColorStop(0, `rgba(${shootC},${fade})`);
      gr.addColorStop(0.3, `rgba(${shootC},${fade * 0.4})`);
      gr.addColorStop(1, `rgba(${shootC},0)`);
      ctx.strokeStyle = gr;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
      if (sprite) { ctx.globalAlpha = fade * 0.8; ctx.drawImage(sprite, m.x - 6, m.y - 6, 12, 12); ctx.globalAlpha = 1; }
    }
    st.shooters = st.shooters.filter((m) => m.age < m.life);
    ctx.globalCompositeOperation = "source-over";
  }

  const setup = useCanvasSetup({ onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
