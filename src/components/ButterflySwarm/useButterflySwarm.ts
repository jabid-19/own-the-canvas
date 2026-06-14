// src/components/ButterflySwarm/useButterflySwarm.ts
import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface Butterfly {
  x: number; y: number;
  vx: number; vy: number;
  angle: number;
  flapPhase: number;
  hueShift: number;
  size: number;
  wanderAngle: number;
  fleeing: boolean;
}

export interface UseButterflySwarmOptions {
  butterflyCount: number;
  wingColor: string;
  patternColor: string;
  backgroundColor: string;
  flapSpeed: number;
  speed: number;
  attractRadius: number;
  interactive: boolean;
  showTrails: boolean;
}

function drawWing(
  ctx: CanvasRenderingContext2D,
  size: number,
  flapX: number,
  side: 1 | -1,
  wingFill: string,
  patFill: string
) {
  ctx.save();
  ctx.scale(side * flapX, 1);
  // upper lobe
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size * 0.9, -size * 0.6, size * 1.3, size * 0.2, 0, size * 0.45);
  ctx.fillStyle = wingFill;
  ctx.fill();
  // lower lobe
  ctx.beginPath();
  ctx.moveTo(0, size * 0.2);
  ctx.bezierCurveTo(size * 0.6, size * 0.5, size * 0.7, size * 1.1, 0, size * 0.85);
  ctx.fill();
  // spots
  ctx.fillStyle = patFill;
  ctx.beginPath(); ctx.arc(size * 0.5, -size * 0.1, size * 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(size * 0.8, size * 0.3, size * 0.08, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function useButterflySwarm(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseButterflySwarmOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, t = 0;

    const butterflies: Butterfly[] = [];
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };

    function makeButterfly(): Butterfly {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * optionsRef.current.speed,
        vy: (Math.random() - 0.5) * optionsRef.current.speed,
        angle: Math.random() * Math.PI * 2,
        flapPhase: Math.random() * Math.PI * 2,
        hueShift: (Math.random() - 0.5) * 40,
        size: 10 + Math.random() * 10,
        wanderAngle: Math.random() * Math.PI * 2,
        fleeing: false,
      };
    }

    function init() {
      butterflies.length = 0;
      for (let i = 0; i < optionsRef.current.butterflyCount; i++) butterflies.push(makeButterfly());
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
      mouse.prevX = mouse.x; mouse.prevY = mouse.y;
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onMouseLeave() { mouse.x = -9999; mouse.y = -9999; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let raf = 0;
    function loop() {
      t += 0.016;
      const opts = optionsRef.current;

      if (opts.showTrails) {
        ctx.fillStyle = hexToRgba(opts.backgroundColor, 0.18);
      } else {
        ctx.fillStyle = opts.backgroundColor;
      }
      ctx.fillRect(0, 0, w, h);

      const mouseSpeed = mouse.x > -100
        ? Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY)
        : 0;
      const isMouseFast = mouseSpeed > 12;

      // sync count with option
      while (butterflies.length < opts.butterflyCount) butterflies.push(makeButterfly());
      butterflies.length = opts.butterflyCount;

      for (const b of butterflies) {
        b.wanderAngle += (Math.random() - 0.5) * 0.3;
        const wanderX = Math.cos(b.wanderAngle) * 0.15 * opts.speed;
        const wanderY = Math.sin(b.wanderAngle) * 0.15 * opts.speed;

        if (opts.interactive && mouse.x > -100) {
          const dx = mouse.x - b.x, dy = mouse.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < opts.attractRadius && dist > 0) {
            if (isMouseFast) {
              b.vx += (-dx / dist) * 1.5;
              b.vy += (-dy / dist) * 1.5;
              b.fleeing = true;
            } else {
              const pull = (1 - dist / opts.attractRadius) * 0.08 * opts.speed;
              b.vx += (dx / dist) * pull;
              b.vy += (dy / dist) * pull;
              b.fleeing = false;
            }
          } else {
            b.fleeing = false;
          }
        }

        b.vx = (b.vx + wanderX) * 0.94;
        b.vy = (b.vy + wanderY) * 0.94;
        const spd = Math.hypot(b.vx, b.vy);
        const maxSpd = opts.speed * (b.fleeing ? 3 : 1.2);
        if (spd > maxSpd) { b.vx = (b.vx / spd) * maxSpd; b.vy = (b.vy / spd) * maxSpd; }

        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.size * 2) b.x = w + b.size;
        if (b.x > w + b.size * 2) b.x = -b.size;
        if (b.y < -b.size * 2) b.y = h + b.size;
        if (b.y > h + b.size * 2) b.y = -b.size;

        if (spd > 0.05) b.angle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        b.flapPhase += opts.flapSpeed * 0.15 * (b.fleeing ? 2 : 1);

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        const flapX = Math.cos(b.flapPhase);
        const wingFill = hexToRgba(opts.wingColor, 0.85);
        const patFill = hexToRgba(opts.patternColor, 0.7);

        drawWing(ctx, b.size, flapX, 1, wingFill, patFill);
        drawWing(ctx, b.size, flapX, -1, wingFill, patFill);

        ctx.fillStyle = hexToRgba(opts.patternColor, 0.9);
        ctx.beginPath(); ctx.ellipse(0, b.size * 0.4, 1.5, b.size * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = hexToRgba(opts.patternColor, 0.6);
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-3, -b.size * 0.4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(3, -b.size * 0.4); ctx.stroke();

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
