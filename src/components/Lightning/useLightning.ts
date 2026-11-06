import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface Pt { x: number; y: number }

interface Branch {
  points: Pt[];
  energy: number;
  /** fraction along the main channel where this branch forks off */
  at: number;
}

interface Strike {
  main: Pt[];
  branches: Branch[];
  /** seconds since the strike began */
  age: number;
  /** channel brightness, relit by each return stroke */
  alpha: number;
  /** branches die after the first stroke, like real forks */
  branchAlpha: number;
  strokes: number;
  nextStroke: number;
  sx: number;
  ex: number;
  ey: number;
}

export interface UseLightningOptions {
  segments: number;
  roughness: number;
  branchChance: number;
  branchDecay: number;
  flickerCount: number;
  glowBlur: number;
  color: string;
  coreColor: string;
  backgroundColor: string;
  autoInterval: number;
  interactive: boolean;
  startX: number;
  startY: number;
  endY: number;
}

const LEADER = 0.11; // s: stepped leader crawling down before the return stroke
const MAX_STRIKES = 4;
const MAX_BRANCHES = 48;

function generateBolt(x1: number, y1: number, x2: number, y2: number, depth: number, roughness: number, points: Pt[]): void {
  if (depth <= 0) {
    points.push({ x: x2, y: y2 });
    return;
  }
  const len = Math.hypot(x2 - x1, y2 - y1);
  // lateral displacement gives the zigzag; a little vertical jitter keeps the bolt trending down
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness * len * 0.5;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * len * 0.1;
  generateBolt(x1, y1, mx, my, depth - 1, roughness, points);
  generateBolt(mx, my, x2, y2, depth - 1, roughness, points);
}

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const toRgb = (c: string) => (c.startsWith("#") ? hexToRgbString(c) : "255,255,255");

/**
 * A night thunderstorm. A low cloud deck drifts over dark hills; each strike starts as a
 * faint stepped leader crawling down from the cloud base, then the return stroke slams the
 * channel white-hot and lights the clouds from inside. The same channel restrikes a few
 * times (flickerCount) before fading, while its forks die after the first stroke. Between
 * strikes, sheet lightning glows inside the clouds. Click to strike at the cursor.
 */
export function useLightning(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseLightningOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, t = 0;
    let strikes: Strike[] = [];
    let hills: number[] = [];
    let flash = 0, flashX = 0;
    let sheetIn = 3;
    let cloudDark: HTMLCanvasElement | null = null;
    let cloudLit: HTMLCanvasElement | null = null;
    let cloudKey = "";

    const groundY = () => h * 0.9;
    const cloudBase = () => h * 0.3;

    function bakeClouds(bg: string, glow: string) {
      cloudKey = `${w}|${h}|${bg}|${glow}`;
      // clouds are soft, so half resolution is plenty
      const cw = Math.max(1, Math.ceil(w / 2)), ch = Math.max(1, Math.ceil(h * 0.55 / 2));
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      // many small, flattened puffs overlap into a deck instead of reading as separate balls
      const puffs = Array.from({ length: Math.max(40, Math.round(w / 6)) }, () => {
        const y = Math.pow(rnd(), 0.7) * 0.26; // denser toward the cloud base
        return { x: rnd() * w, y: y * h, r: Math.min(w, h) * (0.04 + rnd() * 0.07) * (0.7 + y * 2), sx: 1.6 + rnd() * 1.4 };
      });
      const body = mix(mix(bg, "70,72,92", 0.4), "0,0,0", 0.1);
      const lit = mix(glow, "255,255,255", 0.45);
      const bake = (rgb: string, a: number, lift: number, band: number) => {
        const c = document.createElement("canvas");
        c.width = cw; c.height = ch;
        const g = c.getContext("2d");
        if (!g || typeof g.createRadialGradient !== "function") return null;
        g.scale(0.5, 0.5);
        if (band > 0) { // the overcast itself, thinning toward the cloud base
          const lg = g.createLinearGradient(0, 0, 0, h * 0.42);
          lg.addColorStop(0, `rgba(${rgb},${band})`);
          lg.addColorStop(0.55, `rgba(${rgb},${band * 0.5})`);
          lg.addColorStop(1, `rgba(${rgb},0)`);
          g.fillStyle = lg;
          g.fillRect(0, 0, w, h * 0.55);
        }
        for (const p of puffs) {
          for (const dx of [-w, 0, w]) { // tile horizontally so the drift wraps seamlessly
            const x = p.x + dx;
            if (x + p.r * p.sx < 0 || x - p.r * p.sx > w) continue;
            g.save();
            g.translate(x, p.y);
            g.scale(p.sx, 1);
            const gr = g.createRadialGradient(0, p.r * lift, 0, 0, 0, p.r);
            gr.addColorStop(0, `rgba(${rgb},${a})`);
            gr.addColorStop(0.5, `rgba(${rgb},${a * 0.5})`);
            gr.addColorStop(1, `rgba(${rgb},0)`);
            g.fillStyle = gr;
            g.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
            g.restore();
          }
        }
        return c;
      };
      cloudDark = bake(body, 0.3, 0, 0.7);
      cloudLit = bake(lit, 0.2, 0.5, 0); // lit from below: the undersides glow
    }

    function buildHills() {
      let seed = 3;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
      const p1 = rnd() * 6, p2 = rnd() * 6, p3 = rnd() * 6;
      hills = [];
      for (let x = 0; x <= w + 8; x += 8) {
        const u = x / Math.max(1, w);
        hills.push(groundY() - h * (0.035 * Math.sin(u * 3.1 + p1) + 0.02 * Math.sin(u * 7.3 + p2) + 0.008 * Math.sin(u * 19 + p3) + 0.03));
      }
    }

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      w = width; h = height;
      buildHills();
      cloudKey = "";
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    function channel(sx: number, sy: number, ex: number, ey: number, segments: number, roughness: number) {
      const pts: Pt[] = [{ x: sx, y: sy }];
      generateBolt(sx, sy, ex, ey, segments, roughness, pts);
      return pts;
    }

    function strike(targetX?: number, targetY?: number) {
      if (!w) return;
      const o = optionsRef.current;
      // segments is recursion depth (2^n points): clamp so a large value can't hang the tab
      const segments = Math.max(1, Math.min(12, Math.round(o.segments)));
      const sx = targetX ?? o.startX * w;
      const sy = o.startY * h;
      const ex = sx + (Math.random() - 0.5) * w * 0.2;
      const ey = targetY ?? o.endY * h;
      const main = channel(sx, sy, ex, ey, segments, o.roughness);

      // forks spread along the direction of travel; chance is per depth-8 segment so deep bolts don't sprout 2^n
      const branches: Branch[] = [];
      const perPoint = o.branchChance * Math.min(1, 256 / main.length);
      for (let i = 2; i < main.length - 1 && branches.length < MAX_BRANCHES; i++) {
        if (Math.random() >= perPoint) continue;
        const ang = (Math.random() - 0.5) * Math.PI * 0.65;
        const len = (ey - main[i].y) * (0.25 + Math.random() * 0.4);
        const b = channel(main[i].x, main[i].y, main[i].x + Math.sin(ang) * len, main[i].y + Math.cos(ang) * Math.abs(len), Math.max(2, segments - 2), o.roughness * 0.8);
        branches.push({ points: b, energy: o.branchDecay * (0.6 + Math.random() * 0.4), at: i / main.length });
        // a fork of the fork, now and then
        if (Math.random() < o.branchChance && b.length > 4 && branches.length < MAX_BRANCHES) {
          const j = Math.floor(b.length * (0.3 + Math.random() * 0.4));
          const a2 = ang + (Math.random() - 0.5) * 1.2;
          const l2 = Math.abs(len) * 0.45;
          branches.push({
            points: channel(b[j].x, b[j].y, b[j].x + Math.sin(a2) * l2, b[j].y + Math.cos(a2) * l2, Math.max(2, segments - 3), o.roughness * 0.7),
            energy: o.branchDecay * o.branchDecay * 0.8,
            at: (i + j * 0.5) / main.length,
          });
        }
      }

      strikes.push({ main, branches, age: 0, alpha: 0, branchAlpha: 0, strokes: 0, nextStroke: LEADER, sx, ex, ey });
      if (strikes.length > MAX_STRIKES) strikes.shift();
    }

    // auto strikes run on the frame clock: live autoInterval, pause with the loop
    let sinceStrike = 0;
    const gap = () => Math.max(0.05, optionsRef.current.autoInterval / 1000) * (0.5 + Math.random());
    let nextGap = gap();
    strike();

    function onClick(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      strike(e.clientX - r.left, e.clientY - r.top);
    }
    canvas.addEventListener("click", onClick);

    function path(pts: Pt[], upto: number) {
      const n = Math.min(pts.length, Math.max(0, Math.ceil(upto)));
      if (n < 2) return false;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < n; i++) ctx.lineTo(pts[i].x, pts[i].y);
      return true;
    }

    /** glow → halo → hot core, all additive so overlapping strokes bloom */
    function stroke(pts: Pt[], upto: number, a: number, energy: number, glow: string, core: string, glowBlur: number) {
      if (a <= 0.004 || !path(pts, upto)) return;
      const gb = Math.max(0, glowBlur);
      if (gb > 0) {
        ctx.strokeStyle = `rgba(${glow},${a * 0.07})`;
        ctx.lineWidth = gb * 1.1 * energy;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${glow},${a * 0.16})`;
        ctx.lineWidth = gb * 0.4 * energy;
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(${glow},${a * 0.65})`;
      ctx.lineWidth = 2.6 * energy;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${core},${Math.min(1, a * 1.1)})`;
      ctx.lineWidth = Math.max(0.6, 1.2 * energy);
      ctx.stroke();
    }

    let raf = 0, last = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.064, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      if (w === 0) return;
      const o = optionsRef.current;

      sinceStrike += dt;
      if (sinceStrike >= nextGap) { strike(); sinceStrike = 0; nextGap = gap(); }

      // advance strikes: leader → return stroke → restrikes along the same channel → fade
      for (const s of strikes) {
        s.age += dt;
        s.alpha *= Math.exp(-dt * 11);
        s.branchAlpha *= Math.exp(-dt * 16);
        const wanted = Math.max(1, Math.round(o.flickerCount));
        if (s.age >= s.nextStroke && s.strokes < wanted) {
          const first = s.strokes === 0;
          s.strokes++;
          s.alpha = first ? 1 : 0.65 + Math.random() * 0.35;
          if (first) s.branchAlpha = 1;
          else for (const p of s.main) p.x += (Math.random() - 0.5) * 1.5; // channel shifts slightly between strokes
          s.nextStroke = s.age + 0.045 + Math.random() * 0.09;
          if (s.alpha > flash) flashX = s.sx;
          flash = Math.max(flash, s.alpha);
        }
      }
      strikes = strikes.filter((s) => s.strokes === 0 || s.alpha > 0.01 || s.strokes < Math.max(1, Math.round(o.flickerCount)));

      const transparent = !o.backgroundColor || o.backgroundColor === "transparent";
      const glow = toRgb(o.color);
      const core = toRgb(o.coreColor);

      // sheet lightning: the clouds glow from a strike hidden inside them
      if (!transparent) {
        sheetIn -= dt;
        if (sheetIn <= 0) {
          sheetIn = Math.max(0.6, o.autoInterval / 1000) * (0.8 + Math.random() * 1.6);
          if (flash < 0.2) { flash = 0.25 + Math.random() * 0.2; flashX = w * (0.1 + Math.random() * 0.8); }
        }
      }
      flash *= Math.exp(-dt * 7);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      let bg = "0,0,0";
      if (!transparent) {
        bg = toRgb(o.backgroundColor);
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, `rgb(${mix(mix(bg, "0,0,0", 0.25), glow, flash * 0.18)})`);
        sky.addColorStop(0.65, `rgb(${mix(mix(bg, glow, 0.06), glow, flash * 0.28)})`);
        sky.addColorStop(1, `rgb(${mix(mix(bg, glow, 0.12), glow, flash * 0.35)})`);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        if (cloudKey !== `${w}|${h}|${bg}|${glow}`) bakeClouds(bg, glow);
        const drift = ((t * 6) % w + w) % w;
        if (cloudDark) {
          ctx.drawImage(cloudDark, drift - w, 0, w, h * 0.55);
          ctx.drawImage(cloudDark, drift, 0, w, h * 0.55);
        }
        // the flash lights the cloud deck from inside, brightest above the strike
        ctx.globalCompositeOperation = "lighter";
        if (flash > 0.01) {
          const R = Math.max(w, h) * 0.55;
          const lg = ctx.createRadialGradient(flashX, cloudBase() * 0.6, 0, flashX, cloudBase() * 0.6, R);
          lg.addColorStop(0, `rgba(${glow},${flash * 0.35})`);
          lg.addColorStop(0.4, `rgba(${glow},${flash * 0.1})`);
          lg.addColorStop(1, `rgba(${glow},0)`);
          ctx.fillStyle = lg;
          ctx.fillRect(0, 0, w, h);
          if (cloudLit) {
            ctx.globalAlpha = Math.min(1, flash * 1.2);
            ctx.drawImage(cloudLit, drift - w, 0, w, h * 0.55);
            ctx.drawImage(cloudLit, drift, 0, w, h * 0.55);
            ctx.globalAlpha = 1;
          }
        }
      }

      // bolts
      ctx.globalCompositeOperation = "lighter";
      for (const s of strikes) {
        const lead = Math.min(1, s.age / LEADER);
        if (s.strokes === 0) {
          // stepped leader: a dim, thin channel feeling its way down, forks and all
          const n = s.main.length * lead;
          stroke(s.main, n, 0.28, 0.45, glow, core, o.glowBlur * 0.3);
          for (const b of s.branches) {
            const k = (lead - b.at) / Math.max(0.05, 1 - b.at);
            if (k > 0) stroke(b.points, b.points.length * Math.min(1, k * 1.6), 0.2, b.energy * 0.45, glow, core, o.glowBlur * 0.3);
          }
          continue;
        }
        for (const b of s.branches) stroke(b.points, b.points.length, s.branchAlpha * Math.min(1, b.energy + 0.2), b.energy, glow, core, o.glowBlur);
        stroke(s.main, s.main.length, s.alpha, 1, glow, core, o.glowBlur);
        // afterglow: the ionised channel lingers faintly between strokes
        stroke(s.main, s.main.length, Math.min(0.12, s.alpha * 0.4 + 0.04), 0.6, glow, core, 0);

        // where it hits: a burst of light on the ground
        const gy = Math.min(s.ey, groundY());
        const R = (40 + o.glowBlur * 3) * s.alpha;
        if (!transparent && R > 1) {
          const gg = ctx.createRadialGradient(s.ex, gy, 0, s.ex, gy, R * 2);
          gg.addColorStop(0, `rgba(${mix(core, glow, 0.3)},${0.5 * s.alpha})`);
          gg.addColorStop(1, `rgba(${glow},0)`);
          ctx.fillStyle = gg;
          ctx.fillRect(s.ex - R * 2, gy - R * 2, R * 4, R * 4);
        }
      }
      ctx.globalCompositeOperation = "source-over";

      if (!transparent && hills.length) {
        // hills: black silhouettes whose ridge catches each flash
        ctx.beginPath();
        ctx.moveTo(0, h);
        hills.forEach((y, i) => ctx.lineTo(i * 8, y));
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = `rgb(${mix(mix(bg, "0,0,0", 0.7), glow, flash * 0.06)})`;
        ctx.fill();
        if (flash > 0.02) {
          ctx.beginPath();
          hills.forEach((y, i) => (i ? ctx.lineTo(i * 8, y) : ctx.moveTo(0, y)));
          ctx.strokeStyle = `rgba(${mix(glow, "255,255,255", 0.4)},${flash * 0.45})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      } else if (transparent && flash > 0.01) {
        ctx.fillStyle = `rgba(255,255,255,${flash * 0.3})`;
        ctx.fillRect(0, 0, w, h);
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef]);
}
