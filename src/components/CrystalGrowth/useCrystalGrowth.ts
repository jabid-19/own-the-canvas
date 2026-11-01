import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

export type CrystalGrowthColorMode = "solid" | "age" | "cycle";

export interface UseCrystalGrowthOptions {
  crystalColor: string;
  activeColor: string;
  backgroundColor: string;
  growthSpeed: number;
  symmetry: number;
  branchProbability: number;
  noiseAmount: number;
  cellSize: number;
  glowEffect: boolean;
  glowBlur: number;
  interactive: boolean;
  autoReset: boolean;
  colorMode: CrystalGrowthColorMode;
  animated: boolean;
}

/** One branch of a single arm, in arm-local coordinates (the arm grows along +x). */
interface Branch {
  x0: number; y0: number; ang: number;
  len: number; maxLen: number; w: number; depth: number;
  nextSpawn: number; dist: number; // distance of its root from the flake centre
}

interface Flake {
  x: number; y: number; R: number; rot: number;
  branches: Branch[];
  born: number; doneAt: number; fade: number; auto: boolean;
}

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};

/**
 * Snowflakes that grow. Each flake is one arm of branching ice prisms, repeated around the
 * centre `symmetry` times: the main spine reaches outward and sprouts mirrored side
 * branches, which sprout their own. Branches are drawn as faceted, tapered prisms that
 * glow at the growing tips. Finished flakes melt away and regrow with a new design.
 */
export function useCrystalGrowth(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseCrystalGrowthOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    const glow = document.createElement("canvas");
    const gctx = glow.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, t = 0;
    let flakes: Flake[] = [];
    const motes = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), r: 0.4 + Math.random() * 1.2, s: 4 + Math.random() * 10, p: Math.random() * 6 }));

    function newFlake(x: number, y: number, R: number, auto: boolean, delay = 0): Flake {
      const o = optionsRef.current;
      const sym = Math.max(2, Math.min(12, Math.round(o.symmetry)));
      const spine: Branch = {
        x0: 0, y0: 0, ang: 0, len: 0, maxLen: R,
        w: Math.max(2, R * 0.045 + o.cellSize * 0.5), depth: 0,
        nextSpawn: R * (0.14 + Math.random() * 0.06), dist: 0,
      };
      return { x, y, R, rot: -Math.PI / 2 + (sym % 2 ? 0 : Math.PI / sym) * 0, branches: [spine], born: t + delay, doneAt: -1, fade: 1, auto };
    }

    function seedScene() {
      const m = Math.min(w, h);
      flakes = [newFlake(w / 2, h / 2, m * 0.44, true)];
      if (w / h > 1.6) {
        flakes.push(newFlake(w * 0.16, h * 0.34, m * 0.2, true, 1.5));
        flakes.push(newFlake(w * 0.84, h * 0.68, m * 0.24, true, 3));
      }
    }

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      w = width; h = height;
      glow.width = Math.max(1, Math.round(width / 4));
      glow.height = Math.max(1, Math.round(height / 4));
      seedScene();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    function seedAt(clientX: number, clientY: number) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      const x = clientX - r.left, y = clientY - r.top;
      if (flakes.length > 8) flakes.shift();
      flakes.push(newFlake(x, y, Math.min(w, h) * (0.16 + Math.random() * 0.1), false));
    }
    function onMouseDown(e: MouseEvent) { seedAt(e.clientX, e.clientY); }
    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const tt = e.touches[0];
      if (tt) seedAt(tt.clientX, tt.clientY);
    }
    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });

    function grow(f: Flake, dt: number) {
      const o = optionsRef.current;
      const sym = Math.max(2, Math.min(12, Math.round(o.symmetry)));
      const side = sym === 6 || sym === 12 || sym === 3 ? Math.PI / 3 : Math.min(1.2, Math.max(0.55, (2 * Math.PI) / sym));
      const speed = o.animated ? Math.max(0.2, o.growthSpeed) * 28 : 1e6;
      const noise = Math.max(0, Math.min(1, o.noiseAmount));
      let growing = false;
      const born: Branch[] = [];
      for (const b of f.branches) {
        if (b.len >= b.maxLen) continue;
        growing = true;
        b.len = Math.min(b.maxLen, b.len + speed * dt * (1 - b.depth * 0.22));
        while (b.depth < 2 && b.len >= b.nextSpawn && b.nextSpawn < b.maxLen * 0.92) {
          const s = b.nextSpawn;
          const remain = b.maxLen - s;
          const spawn = b.depth === 0 || Math.random() < o.branchProbability + 0.25;
          if (spawn) {
            const L = remain * (b.depth === 0 ? 0.5 + Math.random() * 0.12 : 0.55 + Math.random() * 0.2) * (1 + (Math.random() - 0.5) * noise);
            const rx = b.x0 + Math.cos(b.ang) * s, ry = b.y0 + Math.sin(b.ang) * s;
            for (const sgn of [1, -1]) {
              born.push({
                x0: rx, y0: ry, ang: b.ang + sgn * side,
                len: 0, maxLen: Math.max(4, L), w: Math.max(1.2, b.w * 0.6), depth: b.depth + 1,
                nextSpawn: L * (0.25 + Math.random() * 0.1), dist: b.dist + s,
              });
            }
          }
          b.nextSpawn += b.maxLen * (b.depth === 0 ? 0.11 + Math.random() * 0.05 : 0.22 + Math.random() * 0.08);
        }
      }
      f.branches.push(...born);
      if (!growing && f.doneAt < 0) f.doneAt = t;
    }

    function colorFor(b: Branch, f: Flake, crystal: string, active: string, mode: CrystalGrowthColorMode): [string, string] {
      const growing = b.len < b.maxLen;
      if (mode === "cycle") {
        const hue = ((b.dist + b.len) / f.R) * 200 + t * 25;
        return [`hsla(${hue},85%,70%,1)`, `hsla(${hue + 40},90%,82%,1)`];
      }
      if (mode === "age") {
        const k = Math.min(1, (b.dist / f.R) * 1.2);
        const c = mix(crystal, active, k);
        return [`rgb(${c})`, `rgb(${mix(c, "255,255,255", 0.45)})`];
      }
      return [`rgb(${crystal})`, growing ? `rgb(${active})` : `rgb(${mix(crystal, "255,255,255", 0.5)})`];
    }

    function drawFlake(target: CanvasRenderingContext2D, f: Flake, crystal: string, active: string, mode: CrystalGrowthColorMode, sym: number) {
      const step = (Math.PI * 2) / sym;
      target.save();
      target.translate(f.x, f.y);
      target.globalAlpha = f.fade;
      for (let k = 0; k < sym; k++) {
        target.save();
        target.rotate(f.rot + k * step);
        for (const b of f.branches) {
          if (b.len <= 0.5) continue;
          const c = Math.cos(b.ang), s = Math.sin(b.ang);
          const ex = b.x0 + c * b.len, ey = b.y0 + s * b.len;
          const hw = b.w * 0.5;
          // a tapered prism: wide shoulder near the root, sharp at the tip
          const sx = b.x0 + c * b.len * 0.18, sy = b.y0 + s * b.len * 0.18;
          const [base, tip] = colorFor(b, f, crystal, active, mode);
          const g = target.createLinearGradient(b.x0, b.y0, ex, ey);
          g.addColorStop(0, base);
          g.addColorStop(1, tip);
          target.fillStyle = g;
          target.globalAlpha = f.fade * (0.85 - b.depth * 0.12);
          target.beginPath();
          target.moveTo(b.x0, b.y0);
          target.lineTo(sx - s * hw, sy + c * hw);
          target.lineTo(ex, ey);
          target.lineTo(sx + s * hw, sy - c * hw);
          target.closePath();
          target.fill();
          // facet: the bright ridge down the middle
          target.globalAlpha = f.fade * 0.75;
          target.strokeStyle = "rgba(255,255,255,0.85)";
          target.lineWidth = Math.max(0.5, hw * 0.35);
          target.beginPath();
          target.moveTo(b.x0, b.y0);
          target.lineTo(ex, ey);
          target.stroke();
        }
        target.restore();
      }
      // sectored centre plate
      const pr = f.R * 0.1 * Math.min(1, (t - f.born) * 2 + 0.2);
      target.globalAlpha = f.fade * 0.8;
      target.beginPath();
      for (let k = 0; k <= sym; k++) {
        const a = f.rot + k * step;
        if (k) target.lineTo(Math.cos(a) * pr, Math.sin(a) * pr); else target.moveTo(Math.cos(a) * pr, Math.sin(a) * pr);
      }
      target.fillStyle = `rgba(${mix(crystal, "255,255,255", 0.3)},0.55)`;
      target.fill();
      target.strokeStyle = "rgba(255,255,255,0.8)";
      target.lineWidth = 1;
      target.stroke();
      target.restore();
      target.globalAlpha = 1;
    }

    let raf = 0, last = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      if (w === 0) return;
      const o = optionsRef.current;
      const sym = Math.max(2, Math.min(12, Math.round(o.symmetry)));
      const crystal = hexToRgbString(o.crystalColor);
      const active = hexToRgbString(o.activeColor);
      const bgc = hexToRgbString(o.backgroundColor);

      // grow, then melt and regrow
      for (const f of flakes) if (t >= f.born) grow(f, dt);
      for (const f of flakes) {
        if (f.doneAt > 0 && o.autoReset && t - f.doneAt > 4) f.fade -= dt / 1.5;
      }
      const melted = flakes.filter((f) => f.fade <= 0);
      if (melted.length) {
        flakes = flakes.filter((f) => f.fade > 0);
        for (const m of melted) if (m.auto) flakes.push(newFlake(m.x, m.y, m.R, true, 0.6));
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
      bg.addColorStop(0, `rgb(${mix(bgc, active, 0.14)})`);
      bg.addColorStop(1, `rgb(${bgc})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // drifting frost motes
      for (const m of motes) {
        const y = ((m.y * h + t * m.s) % (h + 10)) - 5;
        const x = m.x * w + Math.sin(t * 0.5 + m.p) * 8;
        ctx.fillStyle = `rgba(${mix(crystal, "255,255,255", 0.5)},${0.25 + 0.25 * Math.sin(t * 2 + m.p)})`;
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const f of flakes) if (t >= f.born) drawFlake(ctx, f, crystal, active, o.colorMode, sym);

      // glow: a quarter-size copy upscaled is naturally soft
      if (o.glowEffect) {
        gctx.setTransform(0.25, 0, 0, 0.25, 0, 0);
        gctx.clearRect(0, 0, w, h);
        for (const f of flakes) if (t >= f.born) drawFlake(gctx, f, active, active, o.colorMode, sym);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = Math.min(0.9, 0.3 + o.glowBlur / 30);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(glow, 0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      // twinkle on a few growing tips
      ctx.globalCompositeOperation = "lighter";
      for (const f of flakes) {
        if (t < f.born) continue;
        const spine = f.branches[0];
        const tipR = spine.len;
        for (let k = 0; k < sym; k++) {
          const a = f.rot + k * ((Math.PI * 2) / sym);
          const x = f.x + Math.cos(a) * tipR, y = f.y + Math.sin(a) * tipR;
          const tw = (0.5 + 0.5 * Math.sin(t * 5 + k * 1.3)) * f.fade;
          const s = 3 + f.R * 0.02;
          ctx.strokeStyle = `rgba(255,255,255,${0.7 * tw})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - s, y); ctx.lineTo(x + s, y);
          ctx.moveTo(x, y - s); ctx.lineTo(x, y + s);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("touchstart", onTouchStart);
    };
  }, [canvasRef]);
}
