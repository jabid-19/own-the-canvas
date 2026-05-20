import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface VortexParticle {
  angle: number;      // current rotation angle
  normY: number;      // 0=base, 1=top of funnel
  speed: number;      // angular speed multiplier
  alpha: number;
  size: number;
}

interface Debris {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number; life: number;
}

interface LightningBolt {
  points: Array<{ x: number; y: number }>;
  alpha: number;
  life: number;
}

interface DustParticle {
  angle: number;
  radius: number;
  speed: number;
  alpha: number;
  size: number;
}

export interface UseTornadoVortexOptions {
  particleCount: number;
  funnelColor: string;
  debrisColor: string;
  lightningColor: string;
  backgroundColor: string;
  rotationSpeed: number;
  funnelHeight: number;
  vortexStrength: number;
  showLightning: boolean;
  showGroundDust: boolean;
  interactive: boolean;
  speed: number;
}

function midpointDisplace(
  x1: number, y1: number, x2: number, y2: number,
  roughness: number, depth: number
): Array<{ x: number; y: number }> {
  if (depth === 0) return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * 0.3;
  const half = roughness / 2;
  return [
    ...midpointDisplace(x1, y1, mx, my, half, depth - 1),
    ...midpointDisplace(mx, my, x2, y2, half, depth - 1).slice(1),
  ];
}

export function useTornadoVortex(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseTornadoVortexOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const particlesRef = useRef<VortexParticle[]>([]);
  const debrisRef = useRef<Debris[]>([]);
  const lightningRef = useRef<LightningBolt[]>([]);
  const dustRef = useRef<DustParticle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const funnelXRef = useRef(0);
  const targetXRef = useRef(0);
  const lightningTimerRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function initParticles() {
      const { particleCount } = optionsRef.current;
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        angle: Math.random() * Math.PI * 2,
        normY: Math.random(),
        speed: 0.7 + Math.random() * 0.6,
        alpha: 0.3 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 3,
      }));
      dustRef.current = Array.from({ length: 80 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 10 + Math.random() * 80,
        speed: 0.02 + Math.random() * 0.04,
        alpha: 0.2 + Math.random() * 0.4,
        size: 1.5 + Math.random() * 3,
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
      funnelXRef.current = w / 2;
      targetXRef.current = w / 2;
      initParticles();
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
      targetXRef.current = e.clientX - r.left;
    }
    canvas.addEventListener("mousemove", onMouseMove);

    function spawnLightning(cx: number, funnelTop: number, funnelBase: number) {
      const startY = funnelTop + Math.random() * (funnelBase - funnelTop) * 0.3;
      const endY = startY + (funnelBase - funnelTop) * (0.3 + Math.random() * 0.4);
      const pts = midpointDisplace(cx, startY, cx + (Math.random() - 0.5) * 20, endY, 30, 4);
      lightningRef.current.push({ points: pts, alpha: 0.9, life: 8 + Math.random() * 8 });
      if (lightningRef.current.length > 5) lightningRef.current.shift();
    }

    function funnelRadius(normY: number, maxR: number): number {
      // Narrow at top (normY=1), wide at base (normY=0)
      return maxR * Math.pow(1 - normY, 1.4) * 0.9 + maxR * 0.02;
    }

    function draw(dt: number) {
      const {
        funnelColor, debrisColor, lightningColor, backgroundColor,
        rotationSpeed, funnelHeight, showLightning, showGroundDust, speed,
      } = optionsRef.current;

      timeRef.current += dt * 0.001;
      const t = timeRef.current;

      // Lerp funnel X
      funnelXRef.current += (targetXRef.current - funnelXRef.current) * 0.05;
      const cx = funnelXRef.current;

      // Funnel sway
      const sway = Math.sin(t * 0.8) * 15;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      const funnelTopY = h * (1 - funnelHeight);
      const funnelBaseY = h - 20;
      const maxRadius = Math.min(w * 0.35, 180);

      const funnelRgb = hexToRgbString(funnelColor);
      const debrisRgb = hexToRgbString(debrisColor);
      const lightningRgb = hexToRgbString(lightningColor);

      // Draw funnel silhouette — wide at top (cloud), narrow tip at bottom (ground)
      const midY = (funnelTopY + funnelBaseY) * 0.5;
      const funnelGrad = ctx.createLinearGradient(cx - maxRadius, funnelTopY, cx + maxRadius, funnelBaseY);
      funnelGrad.addColorStop(0, `rgba(0,0,0,0)`);
      funnelGrad.addColorStop(0.5, `rgba(0,0,0,0.35)`);
      funnelGrad.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.beginPath();
      ctx.moveTo(cx + sway, funnelBaseY);
      ctx.quadraticCurveTo(cx + maxRadius * 0.5 + sway, midY, cx + maxRadius + sway * 0.3, funnelTopY);
      ctx.lineTo(cx - maxRadius + sway * 0.3, funnelTopY);
      ctx.quadraticCurveTo(cx - maxRadius * 0.5 + sway, midY, cx + sway, funnelBaseY);
      ctx.closePath();
      ctx.fillStyle = funnelGrad;
      ctx.fill();

      // Physics update — single pass
      const particles = particlesRef.current;
      for (const p of particles) {
        p.angle += (rotationSpeed / (funnelRadius(p.normY, maxRadius) * 0.01 + 0.5)) * speed * dt * 0.001;
        p.normY += 0.0004 * speed;
        if (p.normY > 1) { p.normY = 0; p.angle = Math.random() * Math.PI * 2; }
      }

      // Back pass — particles behind funnel center (pz <= 0), dimmed
      for (const p of particles) {
        const pz = Math.sin(p.angle);
        if (pz > 0) continue;
        const r = funnelRadius(p.normY, maxRadius);
        const py = funnelTopY + p.normY * (funnelBaseY - funnelTopY);
        const px = cx + sway * p.normY + Math.cos(p.angle) * r;
        const alpha = p.alpha * (0.3 + 0.3 * (-pz));
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.5 + 0.5 * (1 - p.normY)), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${funnelRgb},${alpha})`;
        ctx.fill();
      }

      // Lightning inside funnel (middle layer)
      if (showLightning) {
        lightningTimerRef.current += dt;
        if (lightningTimerRef.current > 800 + Math.random() * 1200) {
          lightningTimerRef.current = 0;
          spawnLightning(cx + sway * 0.5, funnelTopY, funnelBaseY);
        }
        for (let i = lightningRef.current.length - 1; i >= 0; i--) {
          const bolt = lightningRef.current[i];
          bolt.life -= 1;
          bolt.alpha *= 0.85;
          if (bolt.life <= 0) { lightningRef.current.splice(i, 1); continue; }
          ctx.beginPath();
          ctx.moveTo(bolt.points[0].x, bolt.points[0].y);
          for (let j = 1; j < bolt.points.length; j++) {
            ctx.lineTo(bolt.points[j].x, bolt.points[j].y);
          }
          ctx.strokeStyle = `rgba(${lightningRgb},${bolt.alpha})`;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgb(${lightningRgb})`;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Front pass — particles in front of funnel center (pz > 0), brighter
      for (const p of particles) {
        const pz = Math.sin(p.angle);
        if (pz <= 0) continue;
        const r = funnelRadius(p.normY, maxRadius);
        const py = funnelTopY + p.normY * (funnelBaseY - funnelTopY);
        const px = cx + sway * p.normY + Math.cos(p.angle) * r;
        const alpha = p.alpha * (0.5 + 0.5 * pz);
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.5 + 0.5 * (1 - p.normY)), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${funnelRgb},${alpha})`;
        ctx.fill();
      }

      // Ground dust cloud
      if (showGroundDust) {
        for (const d of dustRef.current) {
          d.angle += d.speed * speed;
          const dx = cx + sway * 0.3 + Math.cos(d.angle) * d.radius;
          const dy = funnelBaseY + Math.sin(d.angle * 0.5) * 6;
          ctx.beginPath();
          ctx.arc(dx, dy, d.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${debrisRgb},${d.alpha})`;
          ctx.fill();
        }
      }

      // Flying debris
      if (Math.random() < 0.05 * speed) {
        const r = funnelRadius(Math.random() * 0.3, maxRadius);
        const a = Math.random() * Math.PI * 2;
        const py = funnelBaseY - Math.random() * (funnelBaseY - funnelTopY) * 0.3;
        debrisRef.current.push({
          x: cx + Math.cos(a) * r,
          y: py,
          vx: (Math.random() - 0.5) * 4 * speed,
          vy: -(1 + Math.random() * 2) * speed,
          size: 1 + Math.random() * 3,
          alpha: 0.5 + Math.random() * 0.4,
          life: 40 + Math.random() * 40,
        });
      }
      for (let i = debrisRef.current.length - 1; i >= 0; i--) {
        const d = debrisRef.current[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.05; // gravity
        d.alpha -= 0.008;
        d.life -= 1;
        if (d.alpha <= 0 || d.life <= 0) { debrisRef.current.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${debrisRgb},${d.alpha})`;
        ctx.fill();
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
