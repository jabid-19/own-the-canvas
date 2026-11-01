import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { fbm2 } from "../../runtime/noise";
import { hexToRgba, sampleGradient } from "../../utils/color";

export interface UseSolarFlareOptions {
  sunColor: string;
  coronaColor: string;
  flareColor: string;
  backgroundColor: string;
  sunRadius: number;
  convectionCells: number;
  flareCount: number;
  autoFlare: boolean;
  autoFlareInterval: number;
  interactive: boolean;
  glowEffect: boolean;
  glowBlur: number;
  speed: number;
}

interface Loop { angle: number; span: number; height: number; phase: number; flow: number[] }
interface Flare { angle: number; age: number; life: number }
interface Plasma { x: number; y: number; vx: number; vy: number; life: number; size: number }

/** Limb darkening (Eddington approx): the disc dims toward the edge, I(μ) ∝ 0.4 + 0.6μ. */
export function limb(r: number): number {
  const mu = Math.sqrt(Math.max(0, 1 - r * r));
  return 0.4 + 0.6 * mu;
}

/** Point on a magnetic loop arching off the limb. s: 0..1 from one footpoint to the other. */
export function loopPoint(cx: number, cy: number, R: number, l: Loop, s: number, lift: number): [number, number] {
  const a = l.angle + (s - 0.5) * l.span;
  const r = R * (1 + Math.sin(s * Math.PI) * l.height * lift);
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

export function useSolarFlare(options: UseSolarFlareOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const s = useRef({
    t: 0,
    loops: [] as Loop[],
    flares: [] as Flare[],
    plasma: [] as Plasma[],
    nextAuto: 1.5,
    tex: null as { c: HTMLCanvasElement; img: ImageData; n: number } | null,
    spots: [] as { lat: number; lon: number; r: number }[],
    stars: [] as { x: number; y: number; a: number }[],
    corona: { color: "", img: null as HTMLCanvasElement | null },
    flareSprite: { color: "", img: null as HTMLCanvasElement | null },
  }).current;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function seed(w: number, h: number) {
    s.loops = Array.from({ length: 4 }, () => ({
      angle: Math.random() * Math.PI * 2,
      span: 0.18 + Math.random() * 0.22,
      height: 0.18 + Math.random() * 0.22,
      phase: Math.random() * 10,
      flow: Array.from({ length: 26 }, () => Math.random()),
    }));
    s.spots = Array.from({ length: 3 }, () => ({ lat: (Math.random() - 0.5) * 0.8, lon: Math.random() * Math.PI * 2, r: 0.05 + Math.random() * 0.05 }));
    s.stars = Array.from({ length: Math.round((w * h) / 4000) }, () => ({ x: Math.random() * w, y: Math.random() * h, a: 0.1 + Math.random() * 0.4 }));
  }

  function texture(n: number) {
    if (s.tex && s.tex.n === n) return s.tex;
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = n;
    const img = c.getContext("2d")?.createImageData?.(n, n);
    if (!img) return null;
    s.tex = { c, img, n };
    return s.tex;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = (dt / 16.67) * o.speed;
    s.t += dt * 0.001 * o.speed;
    const t = s.t;
    const cx = w / 2, cy = h / 2;
    const R = Math.max(10, (Math.min(w, h) / 2) * o.sunRadius);

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      for (const st of s.stars) {
        ctx.globalAlpha = st.a;
        ctx.fillRect(st.x, st.y, 1, 1);
      }
      ctx.globalAlpha = 1;
    }

    if (s.corona.color !== o.coronaColor) s.corona = { color: o.coronaColor, img: glowSprite(o.coronaColor, 128) };
    if (s.flareSprite.color !== o.flareColor) s.flareSprite = { color: o.flareColor, img: glowSprite(o.flareColor, 32) };
    const prevOp = ctx.globalCompositeOperation;

    // Corona: soft halo + slowly turning streamers
    ctx.globalCompositeOperation = "lighter";
    if (o.glowEffect && s.corona.img) {
      const halo = R * 2.2 + o.glowBlur * 2;
      ctx.globalAlpha = 0.55;
      ctx.drawImage(s.corona.img, cx - halo, cy - halo, halo * 2, halo * 2);
    }
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2 + t * 0.02 + Math.sin(i * 7.3) * 0.1;
      const len = R * (0.5 + 0.9 * fbm2(i * 0.7, t * 0.15, 3, 2));
      const wid = 0.06 + 0.05 * Math.sin(i * 3.1);
      const g = ctx.createLinearGradient(cx + Math.cos(a) * R * 0.95, cy + Math.sin(a) * R * 0.95, cx + Math.cos(a) * (R + len), cy + Math.sin(a) * (R + len));
      g.addColorStop(0, hexToRgba(o.coronaColor, 0.22));
      g.addColorStop(1, hexToRgba(o.coronaColor, 0));
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a - wid) * R * 0.95, cy + Math.sin(a - wid) * R * 0.95);
      ctx.lineTo(cx + Math.cos(a) * (R + len), cy + Math.sin(a) * (R + len));
      ctx.lineTo(cx + Math.cos(a + wid) * R * 0.95, cy + Math.sin(a + wid) * R * 0.95);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalCompositeOperation = prevOp;
    ctx.globalAlpha = 1;

    // Photosphere: granulation from animated noise, limb darkening, sunspots (low-res, upscaled)
    const n = Math.round(Math.min(140, Math.max(64, R * 0.9)) * (frame.quality < 0.75 ? 0.6 : 1));
    const tex = texture(n);
    if (tex) {
      const sun = sampleGradient([o.sunColor], 0);
      const edge = sampleGradient([o.sunColor, o.coronaColor], 0.55);
      const freq = 2 + o.convectionCells * 0.22;
      const d = tex.img.data;
      const rot = t * 0.03;
      for (let y = 0; y < n; y++) {
        const ny = (y + 0.5) / n * 2 - 1;
        for (let x = 0; x < n; x++) {
          const nx = (x + 0.5) / n * 2 - 1;
          const r2 = nx * nx + ny * ny;
          const j = (y * n + x) * 4;
          if (r2 > 1) { d[j + 3] = 0; continue; }
          const r = Math.sqrt(r2);
          // Sphere coords so cells foreshorten toward the limb and drift with rotation
          const z = Math.sqrt(1 - r2);
          const lon = Math.atan2(nx, z) + rot, lat = Math.asin(ny);
          const g1 = fbm2(lon * freq, lat * freq + t * 0.05, 3, 9);
          const g2 = fbm2(lon * freq * 3.1 - t * 0.2, lat * freq * 3.1, 2, 4);
          let b = limb(r) * (0.72 + 0.4 * g1 + 0.18 * (g2 - 0.5));
          for (const sp of s.spots) {
            const dl = Math.atan2(Math.sin(lon - sp.lon), Math.cos(lon - sp.lon));
            const dd = Math.hypot(dl * Math.cos(lat), lat - sp.lat) / sp.r;
            if (dd < 1.6) b *= dd < 1 ? 0.25 + 0.2 * dd : 0.55 + 0.45 * ((dd - 1) / 0.6);
          }
          const e = 1 - z; // warm toward the limb
          d[j] = Math.min(255, (sun[0] + (edge[0] - sun[0]) * e) * b * 1.1);
          d[j + 1] = Math.min(255, (sun[1] + (edge[1] - sun[1]) * e) * b * 1.1);
          d[j + 2] = Math.min(255, (sun[2] + (edge[2] - sun[2]) * e) * b * 1.1);
          d[j + 3] = 255;
        }
      }
      tex.c.getContext("2d")?.putImageData(tex.img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(tex.c, cx - R, cy - R, R * 2, R * 2);
    }

    // Flares: auto + click at the cursor's angle
    const p = readPointer(pointer.current, canvasEl.current);
    const spawn = (angle: number) => {
      if (s.flares.length >= Math.max(1, o.flareCount)) return;
      s.flares.push({ angle, age: 0, life: 2.8 + Math.random() * 1.5 });
      const fx = cx + Math.cos(angle) * R, fy = cy + Math.sin(angle) * R;
      for (let i = 0; i < 70; i++) {
        const a = angle + (Math.random() - 0.5) * 0.9;
        const sp = 1.5 + Math.random() * 4.5;
        s.plasma.push({ x: fx, y: fy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, size: 0.8 + Math.random() * 2 });
      }
    };
    if (o.interactive) for (const tap of p.taps) spawn(Math.atan2(tap.y - cy, tap.x - cx));
    if (o.autoFlare && t > s.nextAuto) {
      s.nextAuto = t + Math.max(0.3, o.autoFlareInterval / 1000) * (0.7 + Math.random() * 0.6);
      spawn(Math.random() * Math.PI * 2);
    }

    ctx.globalCompositeOperation = "lighter";
    const sprite = s.flareSprite.img;

    // Prominences: plasma streaming along magnetic loops, breathing slowly
    for (const l of s.loops) {
      l.angle += 0.0004 * k;
      const lift = 0.75 + 0.25 * Math.sin(t * 0.4 + l.phase);
      ctx.strokeStyle = hexToRgba(o.flareColor, 0.18);
      ctx.lineWidth = R * 0.03;
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const [x, y] = loopPoint(cx, cy, R, l, i / 24, lift);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
      if (sprite) {
        for (let i = 0; i < l.flow.length; i++) {
          l.flow[i] = (l.flow[i] + 0.004 * k * (i % 2 ? 1 : -1) + 1) % 1;
          const [x, y] = loopPoint(cx, cy, R, l, l.flow[i], lift);
          const sz = R * 0.07;
          ctx.globalAlpha = 0.5;
          ctx.drawImage(sprite, x - sz, y - sz, sz * 2, sz * 2);
        }
      }
    }

    // Eruptions: an expanding arc + ejected plasma that falls back under gravity
    let fa = 0;
    for (const f of s.flares) {
      f.age += dt * 0.001 * o.speed;
      if (f.age > f.life) continue;
      s.flares[fa++] = f;
      const prog = f.age / f.life;
      const loop: Loop = { angle: f.angle, span: 0.32, height: 0.25 + prog * 1.4, phase: 0, flow: [] };
      ctx.globalAlpha = Math.max(0, 1 - prog) * 0.9;
      ctx.strokeStyle = o.flareColor;
      ctx.lineWidth = R * 0.035 * (1 - prog * 0.6);
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) {
        const [x, y] = loopPoint(cx, cy, R, loop, i / 30, 1);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
      if (sprite && prog < 0.35) {
        const sz = R * (0.5 - prog);
        ctx.globalAlpha = 1 - prog / 0.35;
        ctx.drawImage(sprite, cx + Math.cos(f.angle) * R - sz, cy + Math.sin(f.angle) * R - sz, sz * 2, sz * 2);
      }
    }
    s.flares.length = fa;

    let pa = 0;
    for (const q of s.plasma) {
      const dx = q.x - cx, dy = q.y - cy;
      const d2 = dx * dx + dy * dy;
      const g = (R * R * 0.12) / Math.max(d2, R * R);
      q.vx -= (dx / Math.sqrt(d2)) * g * k;
      q.vy -= (dy / Math.sqrt(d2)) * g * k;
      q.x += q.vx * k;
      q.y += q.vy * k;
      q.life -= 0.006 * k;
      if (q.life <= 0 || d2 < R * R * 0.9) continue;
      s.plasma[pa++] = q;
      if (sprite) {
        const sz = q.size * 3;
        ctx.globalAlpha = q.life;
        ctx.drawImage(sprite, q.x - sz, q.y - sz, sz * 2, sz * 2);
      }
    }
    s.plasma.length = pa;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = prevOp;
  }

  const setup = useCanvasSetup({
    onResize: seed,
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
