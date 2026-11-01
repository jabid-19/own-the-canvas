import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

const MAX_PARTICLES = 1600;

type BurstKind = "peony" | "chrysanthemum" | "willow" | "ring" | "palm" | "crossette";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; rgb: string; size: number;
  trail: number[]; // recent positions, x,y pairs
  drag: number; glitter: boolean; split: boolean;
}

interface Shell {
  x: number; y: number; vx: number; vy: number;
  targetY: number; rgb: string; kind: BurstKind; trail: number[];
}

interface Star { x: number; y: number; r: number; opacity: number; isGlowing: boolean; tw: number }
interface Flash { x: number; y: number; rgb: string; life: number }

export interface UseFireworksOptions {
  colors: string[];
  particleCount: number;
  gravity: number;
  friction: number;
  fadeSpeed: number;
  particleSize: number;
  trailLength: number;
  spread: number;
  autoLaunch: boolean;
  autoInterval: number;
  glowEffect: boolean;
  glowBlur: number;
  backgroundColor: string;
  shellSpeed: number;
  starCount: number;
  starColor: string;
  glowingStars: boolean;
  starGlowBlur: number;
}

const KINDS: BurstKind[] = ["peony", "chrysanthemum", "willow", "ring", "palm", "crossette", "peony", "chrysanthemum"];

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const toRgb = (c: string) => (c.startsWith("#") ? hexToRgbString(c) : "255,255,255");

/**
 * A fireworks show over a sleeping city. Rockets climb trailing sparks and burst into one of
 * several shell types (peony, chrysanthemum, willow, ring, palm, crossette), each star leaving
 * a glowing streak; gold willows droop and glitter as they die. Every burst lights the sky and
 * the skyline for a moment. Auto-launches on a timer; click to send a shell to that spot.
 */
export function useFireworks(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseFireworksOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const shellsRef = useRef<Shell[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const launch = (x?: number, targetY?: number) => {
    const { colors, shellSpeed } = optionsRef.current;
    const { w, h } = sizeRef.current;
    if (!w || !h) return;
    const sx = x ?? w * (0.15 + Math.random() * 0.7);
    const ty = targetY ?? h * (0.12 + Math.random() * 0.33);
    // pick a launch speed that reaches the target height under gravity (in px/s units)
    const g = Math.max(20, optionsRef.current.gravity * 3600 * 0.3);
    const rise = Math.max(40, h - ty);
    const vy = -Math.sqrt(2 * g * rise) * (0.98 + Math.random() * 0.04);
    shellsRef.current.push({
      x: sx, y: h, vx: (Math.random() - 0.5) * 30, vy: Math.min(vy, -shellSpeed * 40),
      targetY: ty,
      rgb: toRgb(colors[Math.floor(Math.random() * colors.length)] ?? "#ffffff"),
      kind: KINDS[Math.floor(Math.random() * KINDS.length)],
      trail: [],
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, t = 0;
    let particles: Particle[] = [];
    let stars: Star[] = [];
    let flashes: Flash[] = [];
    let skyline: { x: number; w: number; h: number; windows: [number, number][] }[] = [];
    let nextAuto = 0.6;
    // soft glow sprites, one per colour, so halos are smooth light rather than flat discs
    const sprites = new Map<string, HTMLCanvasElement>();
    function sprite(rgb: string): HTMLCanvasElement | null {
      let c = sprites.get(rgb);
      if (c) return c;
      c = document.createElement("canvas");
      c.width = c.height = 32;
      const g = c.getContext("2d");
      if (!g || typeof g.createRadialGradient !== "function") return null;
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, `rgba(${rgb},0.9)`);
      grad.addColorStop(0.25, `rgba(${rgb},0.35)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, 32, 32);
      sprites.set(rgb, c);
      return c;
    }

    const makeStar = (): Star => ({
      x: Math.random() * w, y: Math.random() * h * 0.8,
      r: 0.3 + Math.random() * 1.1, opacity: 0.35 + Math.random() * 0.6,
      isGlowing: Math.random() < 0.25, tw: Math.random() * 6,
    });

    function initScene() {
      const { starCount } = optionsRef.current;
      stars = Array.from({ length: starCount }, makeStar);
      skyline = [];
      let x = -10;
      while (x < w + 10) {
        const bw = 18 + Math.random() * 46;
        const bh = h * (0.05 + Math.random() * 0.13) * (Math.random() < 0.12 ? 1.7 : 1);
        const windows: [number, number][] = [];
        for (let wy = 6; wy < bh - 6; wy += 7) {
          for (let wx = 4; wx < bw - 4; wx += 6) if (Math.random() < 0.18) windows.push([wx, wy]);
        }
        skyline.push({ x, w: bw, h: bh, windows });
        x += bw + Math.random() * 4;
      }
    }

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      w = width; h = height;
      sizeRef.current = { w, h };
      initScene();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    function onClick(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      launch(e.clientX - r.left, Math.min(h * 0.75, e.clientY - r.top));
    }
    parent.addEventListener("click", onClick);

    function addParticle(p: Omit<Particle, "trail">) {
      if (particles.length < MAX_PARTICLES) particles.push({ ...p, trail: [] });
    }

    function explode(s: Shell) {
      const o = optionsRef.current;
      const n = Math.max(12, o.particleCount);
      const v = o.spread * 68;
      const size = o.particleSize;
      const life = Math.max(0.6, 1.4 / Math.max(0.2, o.fadeSpeed / 0.015));
      const second = toRgb(o.colors[Math.floor(Math.random() * o.colors.length)] ?? "#ffffff");
      const gold = "255,196,92";
      flashes.push({ x: s.x, y: s.y, rgb: s.rgb, life: 1 });

      const ring = (count: number, speed: number, rgb: string, extra: Partial<Particle> = {}) => {
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + Math.random() * 0.08;
          const sp = speed * (0.92 + Math.random() * 0.12);
          addParticle({ x: s.x, y: s.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: life * (0.85 + Math.random() * 0.3), max: life, rgb, size, drag: 1.2, glitter: false, split: false, ...extra });
        }
      };

      switch (s.kind) {
        case "willow":
          for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2, sp = v * Math.sqrt(Math.random()) * 0.85;
            addParticle({ x: s.x, y: s.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: life * 2.2, max: life * 2.2, rgb: gold, size: size * 0.9, drag: 2.2, glitter: true, split: false });
          }
          break;
        case "ring":
          ring(Math.round(n * 0.7), v, s.rgb);
          ring(Math.round(n * 0.3), v * 0.45, second);
          break;
        case "palm":
          for (let k = 0; k < 7; k++) {
            const a = -Math.PI / 2 + (k - 3) * 0.42;
            for (let j = 0; j < 6; j++) {
              const sp = v * (0.6 + j * 0.08);
              addParticle({ x: s.x, y: s.y, vx: Math.cos(a) * sp + (Math.random() - 0.5) * 8, vy: Math.sin(a) * sp, life: life * 1.4, max: life * 1.4, rgb: j % 2 ? gold : s.rgb, size: size * 1.2, drag: 1.4, glitter: j % 2 === 1, split: false });
            }
          }
          break;
        case "crossette":
          ring(Math.max(10, Math.round(n * 0.18)), v * 0.75, s.rgb, { split: true, life: life * 0.55, max: life * 0.55 });
          break;
        case "chrysanthemum":
          for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2, sp = v * (0.55 + Math.random() * 0.5);
            addParticle({ x: s.x, y: s.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life, max: life, rgb: Math.random() < 0.25 ? second : s.rgb, size, drag: 1.3, glitter: Math.random() < 0.3, split: false });
          }
          break;
        default: { // peony: a full sphere of stars
          for (let i = 0; i < n; i++) {
            const u = Math.random() * 2 - 1, phi = Math.random() * Math.PI * 2;
            const r = Math.sqrt(1 - u * u);
            const sp = v * (0.9 + Math.random() * 0.15);
            addParticle({ x: s.x, y: s.y, vx: Math.cos(phi) * r * sp, vy: u * sp, life, max: life, rgb: Math.random() < 0.15 ? second : s.rgb, size, drag: 1.3, glitter: false, split: false });
          }
        }
      }
    }

    let raf = 0, last = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      if (w === 0) return;
      const o = optionsRef.current;
      const G = o.gravity * 3600 * 0.3; // the old per-frame gravity, as px/s²
      const trailLen = Math.max(2, Math.min(24, Math.round(o.trailLength * 1.6)));

      if (o.autoLaunch) {
        nextAuto -= dt;
        if (nextAuto <= 0) {
          const salvo = Math.random() < 0.18 ? 3 : 1;
          for (let i = 0; i < salvo; i++) launch();
          nextAuto = (o.autoInterval / 1000) * (0.6 + Math.random() * 0.7);
        }
      }

      // sky
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const transparent = !o.backgroundColor || o.backgroundColor === "transparent";
      ctx.clearRect(0, 0, w, h);
      if (!transparent) {
        const bg = toRgb(o.backgroundColor);
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, `rgb(${bg})`);
        sky.addColorStop(1, `rgb(${mix(bg, "70,60,110", 0.35)})`);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);
      }

      // stars (live starCount)
      if (stars.length > o.starCount) stars.length = Math.max(0, o.starCount);
      while (stars.length < o.starCount) stars.push(makeStar());
      const starRgb = toRgb(o.starColor);
      for (const s of stars) {
        const a = s.opacity * (0.7 + 0.3 * Math.sin(t * 2 + s.tw));
        if (o.glowingStars && s.isGlowing) {
          ctx.fillStyle = `rgba(${starRgb},${a * 0.15})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * (2 + o.starGlowBlur / 3), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${starRgb},${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // burst light washing over the sky
      ctx.globalCompositeOperation = "lighter";
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= dt * 1.6;
        if (f.life <= 0) { flashes.splice(i, 1); continue; }
        const R = Math.max(w, h) * 0.6;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R);
        g.addColorStop(0, `rgba(${f.rgb},${0.22 * f.life * f.life})`);
        g.addColorStop(1, `rgba(${f.rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // rockets climbing with a spark tail
      for (let i = shellsRef.current.length - 1; i >= 0; i--) {
        const s = shellsRef.current[i];
        s.vy += G * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.trail.push(s.x, s.y);
        if (s.trail.length > 16) s.trail.splice(0, 2);
        if (Math.random() < 0.6) {
          addParticle({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 30, vy: 20 + Math.random() * 30, life: 0.35, max: 0.35, rgb: "255,210,150", size: 0.8, drag: 3, glitter: false, split: false });
        }
        if (s.y <= s.targetY || s.vy >= 0) {
          shellsRef.current.splice(i, 1);
          explode(s);
          continue;
        }
        ctx.strokeStyle = `rgba(${mix(s.rgb, "255,255,255", 0.6)},0.8)`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let k = 0; k < s.trail.length; k += 2) (k ? ctx.lineTo(s.trail[k], s.trail[k + 1]) : ctx.moveTo(s.trail[k], s.trail[k + 1]));
        ctx.stroke();
        ctx.fillStyle = "rgba(255,240,210,1)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // stars of each burst, streaking
      const fr = Math.pow(o.friction, dt * 60);
      const born: Particle[] = [];
      ctx.lineCap = "round";
      let write = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          if (p.split) { // crossette: each star breaks into four
            for (let k = 0; k < 4; k++) {
              const a = (k / 4) * Math.PI * 2 + Math.random() * 0.3;
              born.push({ x: p.x, y: p.y, vx: Math.cos(a) * 90, vy: Math.sin(a) * 90, life: 0.8, max: 0.8, rgb: mix(p.rgb, "255,255,255", 0.3), size: p.size * 0.9, drag: 1.4, glitter: true, split: false, trail: [] });
            }
          }
          continue;
        }
        const drag = Math.pow(fr, p.drag);
        p.vx *= drag;
        p.vy = p.vy * drag + G * dt * (p.drag > 2 ? 0.55 : 1);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.trail.push(p.x, p.y);
        if (p.trail.length > trailLen * 2) p.trail.splice(0, 2);
        particles[write++] = p;

        const k = p.life / p.max;
        let a = Math.min(1, k * 1.6);
        if (p.glitter && k < 0.45) a *= Math.random() < 0.5 ? 1 : 0.1;
        if (p.trail.length >= 4) {
          ctx.strokeStyle = `rgba(${p.rgb},${a * 0.45})`;
          ctx.lineWidth = Math.max(0.6, p.size * 0.9);
          ctx.beginPath();
          ctx.moveTo(p.trail[0], p.trail[1]);
          for (let q = 2; q < p.trail.length; q += 2) ctx.lineTo(p.trail[q], p.trail[q + 1]);
          ctx.stroke();
        }
        if (o.glowEffect) {
          const sp = sprite(p.rgb);
          if (sp) {
            const r = p.size * (3 + o.glowBlur / 2.5);
            ctx.globalAlpha = a * 0.7;
            ctx.drawImage(sp, p.x - r, p.y - r, r * 2, r * 2);
            ctx.globalAlpha = 1;
          }
        }
        ctx.fillStyle = `rgba(${mix(p.rgb, "255,255,255", 0.45)},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size * (0.6 + k * 0.5)), 0, Math.PI * 2);
        ctx.fill();
      }
      particles.length = write;
      for (const b of born) if (particles.length < MAX_PARTICLES) particles.push(b);
      ctx.globalCompositeOperation = "source-over";

      // skyline: dark silhouettes whose edges and windows catch the burst light
      if (!transparent) {
        const bg = toRgb(o.backgroundColor);
        const lit = flashes.reduce((m, f) => Math.max(m, f.life), 0);
        const tint = flashes.length ? flashes[flashes.length - 1].rgb : "255,255,255";
        ctx.fillStyle = `rgb(${mix(mix(bg, "0,0,0", 0.55), tint, lit * 0.12)})`;
        for (const b of skyline) ctx.fillRect(b.x, h - b.h, b.w, b.h);
        ctx.fillStyle = "rgba(255,206,120,0.75)";
        for (const b of skyline) for (const [wx, wy] of b.windows) ctx.fillRect(b.x + wx, h - b.h + wy, 2.2, 3);
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      parent.removeEventListener("click", onClick);
    };
  }, [canvasRef]);

  return { launch };
}
