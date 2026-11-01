import { useEffect, useRef, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

export interface UseRainOptions {
  dropCount: number;
  speed: number;
  wind: number;
  windSpeed: number;
  dropLength: number;
  dropWidth: number;
  dropOpacity: number;
  dropColor: string;
  splashColor: string;
  showSplashes: boolean;
  backgroundColor: string;
  starCount: number;
  starColor: string;
  glowingStars: boolean;
  starGlowBlur: number;
}

interface Drop { x: number; y: number; z: number; len: number; v: number }
interface Ripple { x: number; y: number; life: number; size: number }
interface Splash { x: number; y: number; vx: number; vy: number; life: number }
interface Lamp { x: number; h: number; rgb: string }

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};

/**
 * A rainy night. Rain falls in three depth layers (faint and slow far away, bright streaks up
 * close), slanted by a gusting wind. The ground is wet asphalt that mirrors the street lamps
 * and the city glow; every drop that lands sets off a ripple and a few spray droplets. Mist
 * hangs in the distance, and the sky lights up with an occasional flash when the rain is heavy.
 */
export function useRain(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseRainOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, t = 0;
    let drops: Drop[] = [];
    let ripples: Ripple[] = [];
    let splashes: Splash[] = [];
    let stars: { x: number; y: number; r: number; o: number; g: boolean }[] = [];
    let lamps: Lamp[] = [];
    let skyline: { x: number; w: number; h: number }[] = [];
    let flash = 0, nextFlash = 6;

    const horizon = () => h * 0.72;

    function spawn(d: Drop, top: boolean) {
      d.z = Math.random();
      d.x = Math.random() * (w + 200) - 100;
      d.y = top ? -Math.random() * h * 0.3 : Math.random() * h;
      d.len = 0.4 + d.z * 0.8;
      d.v = 0.55 + d.z * 0.65 + Math.random() * 0.1;
    }

    function init() {
      const o = optionsRef.current;
      drops = Array.from({ length: Math.max(0, o.dropCount) }, () => {
        const d = { x: 0, y: 0, z: 0, len: 0, v: 0 };
        spawn(d, false);
        return d;
      });
      stars = Array.from({ length: o.starCount }, () => ({ x: Math.random() * w, y: Math.random() * h * 0.45, r: 0.3 + Math.random(), o: 0.2 + Math.random() * 0.5, g: Math.random() < 0.25 }));
      lamps = [];
      const n = Math.max(2, Math.round(w / 260));
      for (let i = 0; i < n; i++) lamps.push({ x: ((i + 0.5) / n) * w + (Math.random() - 0.5) * 60, h: h * (0.2 + Math.random() * 0.08), rgb: Math.random() < 0.7 ? "255,196,120" : "150,210,255" });
      skyline = [];
      let x = -10;
      while (x < w + 10) {
        const bw = 26 + Math.random() * 60;
        skyline.push({ x, w: bw, h: h * (0.08 + Math.random() * 0.17) });
        x += bw + Math.random() * 6;
      }
    }

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      w = width; h = height;
      init();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    let raf = 0, last = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      if (w === 0) return;
      const o = optionsRef.current;
      if (drops.length !== Math.max(0, o.dropCount) || stars.length !== o.starCount) init();

      const bg = hexToRgbString(o.backgroundColor === "transparent" ? "#000000" : o.backgroundColor);
      const drop = hexToRgbString(o.dropColor);
      const spl = hexToRgbString(o.splashColor);
      const H = horizon();
      const gust = o.wind * (1 + 0.45 * Math.sin(t * o.windSpeed * 0.9) + 0.2 * Math.sin(t * o.windSpeed * 2.3));
      const heavy = o.dropCount > 350 || o.speed > 20;

      if (heavy) {
        nextFlash -= dt;
        if (nextFlash <= 0) { flash = 1; nextFlash = 5 + Math.random() * 9; }
      }
      flash = Math.max(0, flash - dt * 2.6);
      const flick = flash > 0 ? flash * (0.6 + 0.4 * Math.sin(t * 60)) : 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (o.backgroundColor !== "transparent") {
        // sky, with the city's glow low on the horizon
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, `rgb(${mix(bg, "210,225,255", flick * 0.35)})`);
        sky.addColorStop(1, `rgb(${mix(mix(bg, "120,110,140", 0.28), "210,225,255", flick * 0.4)})`);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, H);

        const starRgb = hexToRgbString(o.starColor);
        for (const s of stars) {
          const glowing = o.glowingStars && s.g;
          if (glowing && o.starGlowBlur > 0) { // soft halo, radius from starGlowBlur
            ctx.fillStyle = `rgba(${starRgb},${s.o * 0.18})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r + o.starGlowBlur * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = `rgba(${starRgb},${s.o * (glowing ? 1 : 0.6)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // distant city, softened by rain
        ctx.fillStyle = `rgba(${mix(bg, "40,46,70", 0.5)},0.95)`;
        for (const b of skyline) ctx.fillRect(b.x, H - b.h, b.w, b.h);
        const mist = ctx.createLinearGradient(0, H - h * 0.22, 0, H);
        mist.addColorStop(0, `rgba(${mix(bg, "150,160,190", 0.5)},0)`);
        mist.addColorStop(1, `rgba(${mix(bg, "150,160,190", 0.5)},0.45)`);
        ctx.fillStyle = mist;
        ctx.fillRect(0, H - h * 0.22, w, h * 0.22);

        // wet ground: dark, picking up the sky, with lamp reflections streaking toward us
        const ground = ctx.createLinearGradient(0, H, 0, h);
        ground.addColorStop(0, `rgb(${mix(bg, "90,96,120", 0.32)})`);
        ground.addColorStop(1, `rgb(${mix(bg, "0,0,0", 0.25)})`);
        ctx.fillStyle = ground;
        ctx.fillRect(0, H, w, h - H);

        ctx.globalCompositeOperation = "lighter";
        for (const l of lamps) {
          // lamp post and its glow in the rain
          ctx.fillStyle = `rgba(${mix(bg, "20,20,26", 0.6)},1)`;
          ctx.fillRect(l.x - 1.5, H - l.h, 3, l.h);
          const gy = H - l.h;
          const g = ctx.createRadialGradient(l.x, gy, 0, l.x, gy, h * 0.22);
          g.addColorStop(0, `rgba(${l.rgb},0.5)`);
          g.addColorStop(0.25, `rgba(${l.rgb},0.14)`);
          g.addColorStop(1, `rgba(${l.rgb},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(l.x - h * 0.22, gy - h * 0.22, h * 0.44, h * 0.44);
          ctx.fillStyle = `rgba(${l.rgb},1)`;
          ctx.beginPath();
          ctx.arc(l.x, gy, 3, 0, Math.PI * 2);
          ctx.fill();
          // reflection: a wobbling column of light on the wet road
          const refl = ctx.createLinearGradient(0, H, 0, h);
          refl.addColorStop(0, `rgba(${l.rgb},0.38)`);
          refl.addColorStop(1, `rgba(${l.rgb},0.04)`);
          ctx.fillStyle = refl;
          for (let y = H; y < h; y += 3) {
            const k = (y - H) / (h - H);
            const wob = Math.sin(y * 0.35 + t * 3 + l.x) * (2 + k * 6);
            const ww = 3 + k * 16;
            ctx.fillRect(l.x - ww / 2 + wob, y, ww, 2);
          }
        }
        ctx.globalCompositeOperation = "source-over";
      }

      // rain
      const fall = o.speed * 60;
      ctx.lineCap = "round";
      for (const d of drops) {
        const sp = fall * d.v;
        d.y += sp * dt;
        d.x += gust * 60 * d.v * dt;
        const floor = H + d.z * (h - H) * 0.95;
        if (d.y > floor) {
          if (o.showSplashes) {
            if (ripples.length < 160 && Math.random() < 0.6) ripples.push({ x: d.x, y: floor, life: 1, size: 0.5 + d.z });
            if (d.z > 0.6 && splashes.length < 200) {
              for (let k = 0; k < 2; k++) splashes.push({ x: d.x, y: floor, vx: (Math.random() - 0.5) * 60 + gust * 20, vy: -(40 + Math.random() * 60), life: 0.35 });
            }
          }
          spawn(d, true);
          continue;
        }
        if (d.x > w + 100) d.x -= w + 200;
        if (d.x < -100) d.x += w + 200;
        const L = o.dropLength * d.len;
        const ang = Math.atan2(sp, gust * 60 * d.v);
        const a = o.dropOpacity * (0.15 + d.z * 0.7);
        ctx.strokeStyle = `rgba(${mix(drop, "255,255,255", d.z * 0.25 + flick * 0.5)},${a})`;
        ctx.lineWidth = o.dropWidth * (0.4 + d.z * 0.8);
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - Math.cos(ang) * L, d.y - Math.sin(ang) * L);
        ctx.stroke();
      }

      // ripples on the wet ground (flattened rings) and spray
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.life -= dt * 1.8;
        if (r.life <= 0) { ripples.splice(i, 1); continue; }
        const rad = (1 - r.life) * 14 * r.size + 1;
        ctx.strokeStyle = `rgba(${spl},${r.life * 0.45})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, rad, rad * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(${spl},0.7)`;
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.life -= dt;
        if (s.life <= 0) { splashes.splice(i, 1); continue; }
        s.vy += 400 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.globalAlpha = s.life / 0.35;
        ctx.fillRect(s.x, s.y, 1.2, 1.2);
      }
      ctx.globalAlpha = 1;

      if (flick > 0) {
        ctx.fillStyle = `rgba(220,230,255,${flick * 0.12})`;
        ctx.fillRect(0, 0, w, h);
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [canvasRef]);
}
