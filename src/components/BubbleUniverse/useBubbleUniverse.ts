import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

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
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
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
      const r = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
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

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
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

    function drawBubble(b: Bubble, t: number, shimmerColor: string, glowEffect: boolean) {
      const shimmer = Math.sin(t * 2 + b.shimmerOffset);
      const shimmerRgb = hexToRgbString(shimmerColor);

      // Iridescent body — radial gradient with hue shift
      const h1 = (b.hue + shimmer * 30) % 360;
      const h2 = (b.hue + 120 + shimmer * 20) % 360;
      const h3 = (b.hue + 240) % 360;

      const bodyGrad = ctx.createRadialGradient(
        b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.05,
        b.x, b.y, b.r
      );
      bodyGrad.addColorStop(0, `hsla(${h1},70%,90%,0.15)`);
      bodyGrad.addColorStop(0.4, `hsla(${h2},80%,60%,0.08)`);
      bodyGrad.addColorStop(0.7, `hsla(${h3},90%,50%,0.12)`);
      bodyGrad.addColorStop(1, `hsla(${h1},60%,30%,0.25)`);

      if (glowEffect) {
        ctx.shadowBlur = b.r * 0.4;
        ctx.shadowColor = `hsla(${h1},100%,70%,0.3)`;
      }

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Rim highlight
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${h2},80%,75%,0.4)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (glowEffect) ctx.shadowBlur = 0;

      // Specular highlight (top-left catch light)
      const hlX = b.x - b.r * 0.32;
      const hlY = b.y - b.r * 0.32;
      const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, b.r * 0.4);
      hlGrad.addColorStop(0, `rgba(${shimmerRgb},0.7)`);
      hlGrad.addColorStop(1, `rgba(${shimmerRgb},0)`);
      ctx.beginPath();
      ctx.ellipse(hlX, hlY, b.r * 0.22, b.r * 0.14, -0.5, 0, Math.PI * 2);
      ctx.fillStyle = hlGrad;
      ctx.fill();

      // Secondary smaller highlight
      ctx.beginPath();
      ctx.ellipse(b.x + b.r * 0.25, b.y + b.r * 0.28, b.r * 0.06, b.r * 0.04, 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${shimmerRgb},0.3)`;
      ctx.fill();
    }

    function draw(dt: number) {
      const {
        bubbleCount, backgroundColor, shimmerColor, gravity, friction,
        interactive, mergeOnCollide, glowEffect, popEffect,
      } = optionsRef.current;

      timeRef.current += dt * 0.001;
      const t = timeRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      const bubbles = bubblesRef.current;
      const mouse = mouseRef.current;

      // Spawn missing bubbles
      while (bubbles.filter(b => !b.popping).length < bubbleCount) {
        bubbles.push(makeBubble(
          Math.random() < 0.5 ? -20 : w + 20,
          h * 0.7 + Math.random() * h * 0.3
        ));
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

        b.vy += gravity;
        b.vx *= friction;
        b.vy *= friction;
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
        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.6; }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * 0.6; }
        if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.6; }
        if (b.y + b.r > h) { b.y = h - b.r; b.vy = -Math.abs(b.vy) * 0.8; }

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
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef]);
}
