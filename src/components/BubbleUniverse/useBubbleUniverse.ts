import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";
import { pointerInCanvas } from "../../runtime/fx";

interface Bubble {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  hue: number;         // 0-360 for iridescent shimmer
  shimmerOffset: number;
  popping: boolean;
  popProgress: number; // 0-1
  popParticles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number }>;
}

export interface UseBubbleUniverseOptions {
  bubbleCount: number;
  minRadius: number;
  maxRadius: number;
  backgroundColor: string;
  shimmerColor: string;
  popEffect: boolean;
  gravity: number;
  friction: number;
  interactive: boolean;
  mergeOnCollide: boolean;
  glowEffect: boolean;
}

export function useBubbleUniverse(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseBubbleUniverseOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const bubblesRef = useRef<Bubble[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;
    const bokeh = Array.from({ length: 14 }, () => ({ x: Math.random(), y: Math.random(), r: 20 + Math.random() * 60, a: 0.03 + Math.random() * 0.05, hue: Math.random() * 360 }));

    function makeBubble(rx?: number, ry?: number): Bubble {
      const { minRadius, maxRadius } = optionsRef.current;
      const r = minRadius + Math.random() * (maxRadius - minRadius);
      return {
        x: rx ?? r + Math.random() * (w - r * 2),
        y: ry ?? r + Math.random() * (h - r * 2),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(0.2 + Math.random() * 0.6),
        r,
        hue: Math.random() * 360,
        shimmerOffset: Math.random() * Math.PI * 2,
        popping: false,
        popProgress: 0,
        popParticles: [],
      };
    }

    function initBubbles() {
      const { bubbleCount } = optionsRef.current;
      bubblesRef.current = Array.from({ length: bubbleCount }, () => makeBubble());
    }

    function applyDpr(width: number, height: number) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(Math.min(2, dpr), 0, 0, Math.min(2, dpr), 0, 0);
      w = width;
      h = height;
      initBubbles();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const p = pointerInCanvas(e, canvas!);
      if (!p) return onMouseLeave();
      mouseRef.current = p;
    }
    function onMouseLeave() { mouseRef.current = null; }

    function onClick(e: MouseEvent) {
      if (!optionsRef.current.popEffect) return;
      const r = canvas!.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      for (const b of bubblesRef.current) {
        if (b.popping) continue;
        const dx = mx - b.x;
        const dy = my - b.y;
        if (dx * dx + dy * dy < b.r * b.r) {
          popBubble(b);
          break;
        }
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click", onClick);

    function popBubble(b: Bubble) {
      b.popping = true;
      b.popProgress = 0;
      // Spawn pop particles
      const count = 8 + Math.floor(b.r / 8);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        b.popParticles.push({
          x: b.x + Math.cos(a) * b.r,
          y: b.y + Math.sin(a) * b.r,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          alpha: 0.8,
        });
      }
    }

    /**
     * A soap bubble: almost clear, with the thin-film rainbow swirling around its rim, a
     * curved window reflection, a bright glint and a faint glow.
     */
    function drawBubble(b: Bubble, t: number, shimmerColor: string, glowEffect: boolean) {
      const { x, y, r } = b;
      const shimmerRgb = hexToRgbString(shimmerColor);
      const hue = b.hue;

      if (glowEffect) {
        ctx.globalCompositeOperation = "lighter";
        const halo = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 1.45);
        halo.addColorStop(0, `hsla(${hue},90%,70%,0.1)`);
        halo.addColorStop(1, `hsla(${hue},90%,70%,0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, r * 1.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      // the film is clear in the middle and thickens toward the edge
      const body = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
      body.addColorStop(0, "rgba(255,255,255,0.025)");
      body.addColorStop(0.72, `rgba(${shimmerRgb},0.035)`);
      body.addColorStop(1, `rgba(${shimmerRgb},0.14)`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // thin-film interference: bands of colour swirling around the rim
      const swirl = t * 0.6 + b.shimmerOffset;
      let film: CanvasGradient | string = `hsla(${hue},85%,68%,0.5)`;
      if (typeof ctx.createConicGradient === "function") {
        const g = ctx.createConicGradient(swirl, x, y);
        if (g) {
          const stops: [number, number, number][] = [[0, 0, 0.6], [0.18, 60, 0.15], [0.38, 150, 0.55], [0.58, 220, 0.12], [0.8, 300, 0.5], [1, 360, 0.6]];
          for (const [o, dh, a] of stops) g.addColorStop(o, `hsla(${hue + dh},90%,66%,${a})`);
          film = g;
        }
      }
      const lw = Math.max(1.5, r * 0.09);
      ctx.strokeStyle = film;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.arc(x, y, r - lw / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.28;
      ctx.lineWidth = r * 0.2;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.84, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.32)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      // reflections: a curved window on the upper left, a glint, a faint one lower right
      ctx.lineCap = "round";
      ctx.strokeStyle = `rgba(${shimmerRgb},0.75)`;
      ctx.lineWidth = Math.max(1.2, r * 0.07);
      ctx.beginPath();
      ctx.arc(x, y, r * 0.72, Math.PI * 1.06, Math.PI * 1.38);
      ctx.stroke();
      ctx.fillStyle = `rgba(${shimmerRgb},0.9)`;
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y - r * 0.6, Math.max(1, r * 0.055), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(${shimmerRgb},0.22)`;
      ctx.lineWidth = Math.max(1, r * 0.05);
      ctx.beginPath();
      ctx.arc(x, y, r * 0.78, Math.PI * 0.12, Math.PI * 0.36);
      ctx.stroke();
    }

    function draw(dt: number) {
      const {
        bubbleCount, backgroundColor, shimmerColor, gravity, friction,
        interactive, mergeOnCollide, glowEffect, popEffect,
      } = optionsRef.current;

      timeRef.current += dt * 0.001;
      const t = timeRef.current;

      const bgRgb = hexToRgbString(backgroundColor);
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, `rgb(${bgRgb.split(",").map((v) => Math.min(255, +v + 14)).join(",")})`);
      bg.addColorStop(1, `rgb(${bgRgb})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      // out-of-focus lights behind, so the bubbles read as transparent
      ctx.globalCompositeOperation = "lighter";
      for (const k of bokeh) {
        const bx = k.x * w + Math.sin(t * 0.1 + k.hue) * 12, by = k.y * h;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, k.r);
        g.addColorStop(0, `hsla(${k.hue},70%,65%,${k.a})`);
        g.addColorStop(0.7, `hsla(${k.hue},70%,65%,${k.a * 0.6})`);
        g.addColorStop(1, `hsla(${k.hue},70%,65%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(bx, by, k.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      const bubbles = bubblesRef.current;
      const mouse = mouseRef.current;

      // Spawn missing bubbles
      while (bubbles.filter(b => !b.popping).length < bubbleCount) {
        const nb = makeBubble();
        nb.y = h + nb.r + Math.random() * 30;
        bubbles.push(nb);
      }

      // Update physics
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        if (b.popping) {
          b.popProgress += 0.08;
          for (const pp of b.popParticles) {
            pp.x += pp.vx;
            pp.y += pp.vy;
            pp.alpha -= 0.05;
          }
          b.popParticles = b.popParticles.filter(pp => pp.alpha > 0);
          continue;
        }

        // buoyancy against the gravity setting, plus a gentle breeze
        b.vy += gravity - 0.03;
        b.vx += Math.sin(t * 0.5 + b.shimmerOffset) * 0.012;
        b.vx *= friction;
        b.vy *= friction;
        b.vy = Math.max(-1.1, Math.min(1.1, b.vy));
        b.x += b.vx;
        b.y += b.vy;
        b.hue = (b.hue + 0.3) % 360;

        // Mouse repulsion
        if (interactive && mouse) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < b.r + 60) {
            const force = (b.r + 60 - dist) * 0.015;
            b.vx += (dx / dist) * force;
            b.vy += (dy / dist) * force;
          }
        }

        // Wall bounce
        // drift off one edge, come back in from the other
        if (b.x + b.r < -4) b.x = w + b.r;
        else if (b.x - b.r > w + 4) b.x = -b.r;
        if (b.y + b.r < -4) { b.y = h + b.r + 2; b.x = Math.random() * w; }
        else if (b.y - b.r > h + 4) { b.y = -b.r - 2; b.x = Math.random() * w; }

        // Bubble-bubble collision / merge
        for (let j = i + 1; j < bubbles.length; j++) {
          const o = bubbles[j];
          if (o.popping) continue;
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const minDist = b.r + o.r;

          if (dist < minDist) {
            if (mergeOnCollide && dist < minDist * 0.6) {
              // Merge: conserve area
              const newR = Math.min(optionsRef.current.maxRadius,
                Math.sqrt(b.r * b.r + o.r * o.r));
              b.r = newR;
              b.x = (b.x + o.x) / 2;
              b.y = (b.y + o.y) / 2;
              b.vx = (b.vx + o.vx) * 0.5;
              b.vy = (b.vy + o.vy) * 0.5;
              o.popping = true; // absorb
              o.popProgress = 1; // instant
            } else {
              // Elastic bounce
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = minDist - dist;
              b.x -= nx * overlap * 0.5;
              b.y -= ny * overlap * 0.5;
              o.x += nx * overlap * 0.5;
              o.y += ny * overlap * 0.5;
              const dvx = b.vx - o.vx;
              const dvy = b.vy - o.vy;
              const dot = dvx * nx + dvy * ny;
              if (dot > 0) {
                b.vx -= dot * nx * 0.7;
                b.vy -= dot * ny * 0.7;
                o.vx += dot * nx * 0.7;
                o.vy += dot * ny * 0.7;
              }
            }
          }
        }
      }

      // Draw live bubbles
      for (const b of bubbles) {
        if (b.popping && b.popProgress >= 1) continue;
        if (!b.popping) {
          drawBubble(b, t, shimmerColor, glowEffect);
        } else {
          // Pop ring expanding
          const ring = b.r * (1 + b.popProgress * 1.5);
          ctx.beginPath();
          ctx.arc(b.x, b.y, ring, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${b.hue},80%,70%,${0.6 * (1 - b.popProgress)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          // Pop particles
          for (const pp of b.popParticles) {
            ctx.beginPath();
            ctx.arc(pp.x, pp.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${b.hue},80%,75%,${pp.alpha})`;
            ctx.fill();
          }
        }
      }

      // Remove fully popped
      bubblesRef.current = bubbles.filter(b => !b.popping || b.popProgress < 1.5);
    }

    let lastTime = 0;
    function loop(timestamp: number) {
      const dt = lastTime ? timestamp - lastTime : 16;
      lastTime = timestamp;
      draw(dt);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef]);
}
