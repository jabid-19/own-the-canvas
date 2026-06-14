// src/components/DeepSeaBioluminescence/useDeepSeaBioluminescence.ts
import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface Jellyfish {
  x: number; y: number; vy: number;
  phase: number; size: number;
  tentacles: Array<{ offX: number; len: number; wobble: number }>;
}

interface Plankton {
  x: number; y: number;
  vx: number; vy: number;
  brightness: number;
  glowTimer: number;
  baseAlpha: number;
}

interface Ripple {
  x: number; y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface DeepFish {
  x: number; y: number;
  vx: number; size: number;
  alpha: number;
}

export interface UseDeepSeaBioluminescenceOptions {
  jellyfishCount: number;
  planktonCount: number;
  jellyfishColor: string;
  glowColor: string;
  waterColor: string;
  interactive: boolean;
  showAnglerfish: boolean;
  speed: number;
}

function makeJellyfish(w: number, h: number, size?: number): Jellyfish {
  const s = size ?? (20 + Math.random() * 30);
  const tc = 6 + Math.floor(Math.random() * 5);
  return {
    x: Math.random() * w,
    y: h + s + Math.random() * h,
    vy: -(0.2 + Math.random() * 0.4),
    phase: Math.random() * Math.PI * 2,
    size: s,
    tentacles: Array.from({ length: tc }, () => ({
      offX: (Math.random() - 0.5) * s * 1.2,
      len: s * (0.8 + Math.random() * 1.2),
      wobble: Math.random() * Math.PI * 2,
    })),
  };
}

function makePlankton(w: number, h: number): Plankton {
  const a = 0.1 + Math.random() * 0.4;
  return {
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -(0.05 + Math.random() * 0.15),
    brightness: a, baseAlpha: a, glowTimer: 0,
  };
}

export function useDeepSeaBioluminescence(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseDeepSeaBioluminescenceOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, t = 0;

    let jellyfish: Jellyfish[] = [];
    let plankton: Plankton[] = [];
    const ripples: Ripple[] = [];
    const fish: DeepFish[] = [];
    let anglerPhase = 0;
    const mouse = { x: -1, y: -1, px: -1, py: -1 };

    function init() {
      const opts = optionsRef.current;
      jellyfish = Array.from({ length: opts.jellyfishCount }, () => {
        const j = makeJellyfish(w, h);
        j.y = Math.random() * h;
        return j;
      });
      plankton = Array.from({ length: opts.planktonCount }, () => makePlankton(w, h));
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      init();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.px = mouse.x; mouse.py = mouse.y;
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      const opts = optionsRef.current;
      if (opts.interactive && mouse.px >= 0) {
        const dx = mouse.x - mouse.px, dy = mouse.y - mouse.py;
        const speed = Math.sqrt(dx * dx + dy * dy);
        if (speed > 3) {
          ripples.push({ x: mouse.x, y: mouse.y, radius: 0, maxRadius: 80 + speed * 3, alpha: 0.7 });
        }
      }
    }
    function onMouseLeave() { mouse.x = -1; mouse.y = -1; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let raf = 0;
    function loop() {
      t += 0.016;
      const opts = optionsRef.current;
      anglerPhase += 0.03;

      ctx.fillStyle = opts.waterColor;
      ctx.fillRect(0, 0, w, h);

      // sync jellyfish count
      while (jellyfish.length < opts.jellyfishCount) jellyfish.push(makeJellyfish(w, h));
      jellyfish.length = opts.jellyfishCount;

      // sync plankton count
      while (plankton.length < opts.planktonCount) plankton.push(makePlankton(w, h));
      plankton.length = opts.planktonCount;

      // update + draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += 2.5;
        rp.alpha -= 0.012;
        if (rp.alpha <= 0 || rp.radius > rp.maxRadius) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(opts.glowColor, rp.alpha * 0.5);
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // update plankton brightness from ripples
      for (const p of plankton) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;

        p.glowTimer = Math.max(0, p.glowTimer - 0.02);
        for (const rp of ripples) {
          const dx = p.x - rp.x, dy = p.y - rp.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(d - rp.radius) < 15) p.glowTimer = Math.min(1, p.glowTimer + 0.4);
        }
        p.brightness = p.baseAlpha + p.glowTimer * 0.6 + Math.sin(t * 2 + p.x) * 0.05;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(opts.glowColor, Math.min(1, p.brightness));
        ctx.fill();

        if (p.glowTimer > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(opts.glowColor, p.glowTimer * 0.25);
          ctx.fill();
        }
      }

      // jellyfish
      for (const jf of jellyfish) {
        jf.phase += 0.04 * opts.speed;
        const pulse = Math.sin(jf.phase);
        jf.y += jf.vy * opts.speed;
        jf.x += Math.sin(jf.phase * 0.3) * 0.3;
        if (jf.y < -jf.size * 3) {
          jf.y = h + jf.size;
          jf.x = Math.random() * w;
        }

        const bellScaleX = 1 + pulse * 0.15;
        const bellScaleY = 1 - pulse * 0.1;
        const alpha = 0.55 + pulse * 0.1;

        // bell glow
        const grad = ctx.createRadialGradient(jf.x, jf.y, 0, jf.x, jf.y, jf.size * 1.5);
        grad.addColorStop(0, hexToRgba(opts.jellyfishColor, alpha * 0.4));
        grad.addColorStop(1, hexToRgba(opts.jellyfishColor, 0));
        ctx.beginPath();
        ctx.arc(jf.x, jf.y, jf.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // bell
        ctx.save();
        ctx.translate(jf.x, jf.y);
        ctx.scale(bellScaleX, bellScaleY);
        ctx.beginPath();
        ctx.ellipse(0, 0, jf.size, jf.size * 0.6, 0, Math.PI, 0);
        ctx.fillStyle = hexToRgba(opts.jellyfishColor, alpha);
        ctx.fill();
        ctx.strokeStyle = hexToRgba(opts.jellyfishColor, alpha * 0.6);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // tentacles
        for (const tc of jf.tentacles) {
          tc.wobble += 0.04;
          const tx = jf.x + tc.offX * bellScaleX + Math.sin(tc.wobble) * 4;
          ctx.beginPath();
          ctx.moveTo(tx, jf.y + jf.size * 0.5);
          ctx.bezierCurveTo(
            tx + Math.sin(tc.wobble * 0.7) * 6, jf.y + jf.size * 0.5 + tc.len * 0.33,
            tx + Math.sin(tc.wobble * 0.5 + 1) * 6, jf.y + jf.size * 0.5 + tc.len * 0.67,
            tx + Math.sin(tc.wobble * 0.3 + 2) * 4, jf.y + jf.size * 0.5 + tc.len
          );
          ctx.strokeStyle = hexToRgba(opts.jellyfishColor, alpha * 0.4);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // anglerfish
      if (opts.showAnglerfish) {
        const ax = w * 0.88, ay = h * 0.82;
        const lureX = ax - 30 + Math.sin(anglerPhase) * 8;
        const lureY = ay - 50 + Math.cos(anglerPhase * 0.7) * 6;

        // rod
        ctx.beginPath();
        ctx.moveTo(ax - 10, ay - 20);
        ctx.quadraticCurveTo(ax - 25, ay - 45, lureX, lureY);
        ctx.strokeStyle = hexToRgba(opts.glowColor, 0.4);
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // lure glow
        const lureGrad = ctx.createRadialGradient(lureX, lureY, 0, lureX, lureY, 12);
        lureGrad.addColorStop(0, hexToRgba(opts.glowColor, 0.9));
        lureGrad.addColorStop(1, hexToRgba(opts.glowColor, 0));
        ctx.beginPath();
        ctx.arc(lureX, lureY, 12, 0, Math.PI * 2);
        ctx.fillStyle = lureGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(lureX, lureY, 3, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(opts.glowColor, 1);
        ctx.fill();

        // body silhouette
        ctx.beginPath();
        ctx.ellipse(ax, ay, 28, 18, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba("#000010", 0.85);
        ctx.fill();

        // eye
        ctx.beginPath();
        ctx.arc(ax - 12, ay - 5, 5, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(opts.glowColor, 0.5);
        ctx.fill();

        // teeth
        ctx.beginPath();
        for (let ti = 0; ti < 5; ti++) {
          ctx.moveTo(ax - 20 + ti * 8, ay + 10);
          ctx.lineTo(ax - 16 + ti * 8, ay + 18);
        }
        ctx.strokeStyle = hexToRgba("#aaccdd", 0.4);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // deep fish
      if (Math.random() < 0.003 && fish.length < 3) {
        const goRight = Math.random() < 0.5;
        fish.push({ x: goRight ? -80 : w + 80, y: h * (0.1 + Math.random() * 0.7), vx: goRight ? (0.4 + Math.random() * 0.5) : -(0.4 + Math.random() * 0.5), size: 30 + Math.random() * 40, alpha: 0 });
      }
      for (let i = fish.length - 1; i >= 0; i--) {
        const f = fish[i];
        f.x += f.vx * opts.speed;
        f.alpha = Math.min(0.35, f.alpha + 0.005);
        if ((f.vx > 0 && f.x > w + 100) || (f.vx < 0 && f.x < -100)) { fish.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(f.x, f.y);
        if (f.vx < 0) ctx.scale(-1, 1);
        ctx.beginPath();
        ctx.ellipse(0, 0, f.size, f.size * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(opts.jellyfishColor, f.alpha);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-f.size, 0);
        ctx.lineTo(-f.size - f.size * 0.4, -f.size * 0.2);
        ctx.lineTo(-f.size - f.size * 0.4, f.size * 0.2);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(opts.jellyfishColor, f.alpha);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
