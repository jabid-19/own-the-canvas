import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface DiskParticle {
  angle: number;
  radius: number;
  speed: number; // angular velocity rad/frame
  alpha: number;
  size: number;
  trail: Array<{ x: number; y: number }>;
}

interface JetParticle {
  y: number;
  side: 1 | -1; // north or south jet
  alpha: number;
  vx: number;
  x: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  isGlowing: boolean;
}

export interface UseBlackHoleOptions {
  diskColor: string;
  backgroundColor: string;
  particleCount: number;
  gravity: number;
  eventHorizonRadius: number;
  diskWidth: number;
  jetColor: string;
  showJets: boolean;
  lensing: boolean;
  speed: number;
  interactive: boolean;
  starCount: number;
  starColor: string;
  glowingStars: boolean;
  starGlowBlur: number;
}

export function useBlackHole(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseBlackHoleOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const diskRef = useRef<DiskParticle[]>([]);
  const jetsRef = useRef<JetParticle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const singularityRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function makeDiskParticle(eventHorizonRadius: number, diskWidth: number): DiskParticle {
      const r = eventHorizonRadius + Math.random() * diskWidth;
      const angularSpeed = (Math.sqrt(200 / r)) * 0.02 * (Math.random() < 0.5 ? 1 : -1);
      return {
        angle: Math.random() * Math.PI * 2,
        radius: r,
        speed: angularSpeed,
        alpha: 0.3 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
        trail: [],
      };
    }

    function initParticles() {
      const { particleCount, eventHorizonRadius, diskWidth } = optionsRef.current;
      diskRef.current = Array.from({ length: particleCount }, () =>
        makeDiskParticle(eventHorizonRadius, diskWidth)
      );
      jetsRef.current = Array.from({ length: 40 }, (_, i) => ({
        y: -20 - i * 8,
        side: (i % 2 === 0 ? 1 : -1) as 1 | -1,
        alpha: 0.3 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 1.5,
        x: (Math.random() - 0.5) * 20,
      }));
    }

    function initStars(width: number, height: number) {
      const { starCount } = optionsRef.current;
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28,
      }));
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
      singularityRef.current = { x: w / 2, y: h / 2, tx: w / 2, ty: h / 2 };
      initParticles();
      initStars(width, height);
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
      singularityRef.current.tx = e.clientX - r.left;
      singularityRef.current.ty = e.clientY - r.top;
    }
    canvas.addEventListener("mousemove", onMouseMove);

    function drawLensing(cx: number, cy: number, ehRadius: number) {
      const gridStep = 30;
      const dotR = 1;
      const strength = ehRadius * ehRadius * 2;

      ctx.fillStyle = "rgba(255,255,255,0.12)";
      for (let gx = 0; gx < w; gx += gridStep) {
        for (let gy = 0; gy < h; gy += gridStep) {
          const dx = gx - cx;
          const dy = gy - cy;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq) || 0.001;

          // Skip inside event horizon
          if (dist < ehRadius * 1.2) continue;

          const displacement = strength / distSq;
          const nx = gx + (dx / dist) * displacement;
          const ny = gy + (dy / dist) * displacement;

          ctx.beginPath();
          ctx.arc(nx, ny, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    let prevStarCount = options.starCount;

    function drawStars() {
      const { starCount, starColor, glowingStars, starGlowBlur } = optionsRef.current;
      if (starCount !== prevStarCount) {
        prevStarCount = starCount;
        initStars(w, h);
      }
      const stars = starsRef.current;
      if (stars.length === 0) return;
      ctx.fillStyle = starColor;
      for (const star of stars) {
        if (glowingStars && star.isGlowing) continue;
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (glowingStars) {
        ctx.shadowColor = starColor;
        ctx.shadowBlur = starGlowBlur;
        for (const star of stars) {
          if (!star.isGlowing) continue;
          ctx.globalAlpha = star.opacity * 0.12;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = star.opacity * 0.35;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = star.opacity;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgba(0,0,0,0)";
      }
      ctx.globalAlpha = 1;
    }

    function draw(dt: number) {
      const {
        diskColor, backgroundColor, particleCount, gravity,
        eventHorizonRadius, diskWidth, jetColor, showJets, lensing, speed,
      } = optionsRef.current;

      timeRef.current += dt * 0.001;
      const t = timeRef.current;

      // Lerp singularity toward target
      const sg = singularityRef.current;
      sg.x += (sg.tx - sg.x) * 0.06;
      sg.y += (sg.ty - sg.y) * 0.06;
      const cx = sg.x;
      const cy = sg.y;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      drawStars();

      // Lensing grid
      if (lensing) drawLensing(cx, cy, eventHorizonRadius);

      // Event horizon (black circle with subtle glow)
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eventHorizonRadius * 2.5);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.4, "rgba(0,0,0,0.9)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, eventHorizonRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Accretion disk particles
      const diskRgb = hexToRgbString(diskColor);

      // Ensure count matches
      while (diskRef.current.length < particleCount) diskRef.current.push(makeDiskParticle(eventHorizonRadius, diskWidth));
      if (diskRef.current.length > particleCount) diskRef.current.length = particleCount;

      for (const p of diskRef.current) {
        p.angle += p.speed * speed;

        // Slowly spiral inward
        p.radius -= 0.015 * speed;

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius * 0.35; // flatten disk

        // Track trail
        p.trail.push({ x, y });
        if (p.trail.length > 5) p.trail.shift();

        // Reset when too close to event horizon
        if (p.radius < eventHorizonRadius) {
          p.radius = eventHorizonRadius + Math.random() * diskWidth;
          p.angle = Math.random() * Math.PI * 2;
          p.trail = [];
          p.alpha = 0.3 + Math.random() * 0.6;
        }

        // Brightness by orbital speed
        const brightness = Math.min(1, (eventHorizonRadius + diskWidth - p.radius) / diskWidth + 0.3);
        const alpha = p.alpha * brightness;

        // Draw trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) ctx.lineTo(p.trail[i].x, p.trail[i].y);
          ctx.strokeStyle = `rgba(${diskRgb},${alpha * 0.4})`;
          ctx.lineWidth = p.size * 0.8;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${diskRgb},${alpha})`;
        ctx.fill();
      }

      // Event horizon void — radial gradient fade so it blends naturally into the disk
      const voidGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eventHorizonRadius * 1.5);
      voidGrad.addColorStop(0, "rgba(0,0,0,1)");
      voidGrad.addColorStop(0.6, "rgba(0,0,0,0.95)");
      voidGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, eventHorizonRadius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = voidGrad;
      ctx.fill();

      // Jet particles
      if (showJets) {
        const jetRgb = hexToRgbString(jetColor);
        for (const jp of jetsRef.current) {
          jp.y -= 1.5 * speed;
          jp.x += jp.vx * 0.3;
          jp.alpha -= 0.006 * speed;

          if (jp.alpha <= 0) {
            // Respawn at singularity
            jp.y = -(Math.random() * 20);
            jp.x = (Math.random() - 0.5) * 15;
            jp.alpha = 0.2 + Math.random() * 0.4;
            jp.vx = (Math.random() - 0.5) * 1.5;
          }

          // North jet
          ctx.beginPath();
          ctx.arc(cx + jp.x, cy + jp.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${jetRgb},${jp.alpha})`;
          ctx.fill();

          // South jet (mirror)
          ctx.beginPath();
          ctx.arc(cx + jp.x, cy - jp.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${jetRgb},${jp.alpha})`;
          ctx.fill();
        }
      }
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
    };
  }, [canvasRef]);
}
