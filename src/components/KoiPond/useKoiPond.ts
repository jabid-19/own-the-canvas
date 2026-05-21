import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString, hexToRgba } from "../../utils/color";

interface KoiFish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  length: number;
  // Body segments for smooth shape
  segments: Array<{ x: number; y: number }>;
  tailPhase: number;
  color: string;
  accentColor: string;
  wanderAngle: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface LilyPad {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  gapAngle: number;
}

export interface UseKoiPondOptions {
  fishCount: number;
  fishColor: string;
  scaleColor: string;
  waterColor: string;
  rippleColor: string;
  lilyColor: string;
  speed: number;
  interactive: boolean;
  showLilies: boolean;
  caustics: boolean;
}

// Simple value noise for caustics
function valueNoise(x: number, y: number, t: number): number {
  const n = Math.sin(x * 1.3 + t) * Math.cos(y * 1.1 - t * 0.7) +
            Math.sin(x * 2.7 - t * 1.3) * Math.cos(y * 2.1 + t * 0.9) * 0.5;
  return (n + 1.5) / 3;
}

export function useKoiPond(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseKoiPondOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const fishRef = useRef<KoiFish[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const liliesRef = useRef<LilyPad[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function makeFish(fishColor: string, scaleColor: string): KoiFish {
      const angle = Math.random() * Math.PI * 2;
      const baseSpeed = (0.5 + Math.random() * 0.8) * optionsRef.current.speed;
      const length = 40 + Math.random() * 30;
      const x = Math.random() * w;
      const y = Math.random() * h;
      // alternating monochrome/color pairs
      const isAccent = Math.random() < 0.4;
      return {
        x, y,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        angle,
        speed: baseSpeed,
        length,
        segments: Array.from({ length: 8 }, (_, i) => ({
          x: x - Math.cos(angle) * i * (length / 8),
          y: y - Math.sin(angle) * i * (length / 8),
        })),
        tailPhase: Math.random() * Math.PI * 2,
        color: isAccent ? scaleColor : fishColor,
        accentColor: isAccent ? fishColor : scaleColor,
        wanderAngle: angle,
      };
    }

    function makeLilies() {
      liliesRef.current = Array.from({ length: 5 }, () => ({
        x: w * 0.1 + Math.random() * w * 0.8,
        y: h * 0.1 + Math.random() * h * 0.8,
        radius: 18 + Math.random() * 22,
        rotation: Math.random() * Math.PI * 2,
        gapAngle: 0.3 + Math.random() * 0.4,
      }));
    }

    function initPond() {
      const { fishCount, fishColor, scaleColor } = optionsRef.current;
      fishRef.current = Array.from({ length: fishCount }, () => makeFish(fishColor, scaleColor));
      makeLilies();
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
      initPond();
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
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      const prev = mouseRef.current;
      if (prev) {
        const dx = nx - prev.x;
        const dy = ny - prev.y;
        if (dx * dx + dy * dy > 400) {
          ripplesRef.current.push({ x: nx, y: ny, radius: 0, maxRadius: 60, alpha: 0.6 });
        }
      }
      mouseRef.current = { x: nx, y: ny };
      lastMouseRef.current = { x: nx, y: ny };
    }
    function onMouseLeave() { mouseRef.current = null; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function drawFish(fish: KoiFish, t: number) {
      const segs = fish.segments;
      if (segs.length < 2) return;

      const fishRgb = hexToRgbString(fish.color);
      const accentRgb = hexToRgbString(fish.accentColor);

      // Body as tapered path through segments
      ctx.save();
      const bodyWidths = segs.map((_, i) => {
        const t0 = i / (segs.length - 1);
        // wide in middle, tapers at head and tail
        return fish.length * 0.18 * Math.sin(Math.PI * (1 - t0));
      });

      // Upper body path
      ctx.beginPath();
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        const nextSeg = segs[Math.min(i + 1, segs.length - 1)];
        const dx = nextSeg.x - seg.x;
        const dy = nextSeg.y - seg.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const px = -dy / len * bodyWidths[i];
        const py = dx / len * bodyWidths[i];
        if (i === 0) ctx.moveTo(seg.x + px, seg.y + py);
        else ctx.lineTo(seg.x + px, seg.y + py);
      }
      for (let i = segs.length - 1; i >= 0; i--) {
        const seg = segs[i];
        const nextSeg = segs[Math.min(i + 1, segs.length - 1)];
        const dx = nextSeg.x - seg.x;
        const dy = nextSeg.y - seg.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const px = -dy / len * bodyWidths[i];
        const py = dx / len * bodyWidths[i];
        ctx.lineTo(seg.x - px, seg.y - py);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${fishRgb},0.85)`;
      ctx.fill();

      // Scale patches (accent color spots)
      for (let i = 1; i < segs.length - 2; i += 2) {
        const seg = segs[i];
        const r = bodyWidths[i] * 0.7;
        if (r > 1) {
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRgb},0.5)`;
          ctx.fill();
        }
      }

      // Tail fin
      const tail = segs[segs.length - 1];
      const tailPrev = segs[segs.length - 2];
      const tailAngle = Math.atan2(tail.y - tailPrev.y, tail.x - tailPrev.x);
      const tailWave = Math.sin(fish.tailPhase + t * 5) * 0.6;
      const tailSize = fish.length * 0.35;

      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(
        tail.x + Math.cos(tailAngle + Math.PI / 2 + tailWave) * tailSize,
        tail.y + Math.sin(tailAngle + Math.PI / 2 + tailWave) * tailSize
      );
      ctx.lineTo(
        tail.x + Math.cos(tailAngle - Math.PI / 2 - tailWave) * tailSize,
        tail.y + Math.sin(tailAngle - Math.PI / 2 - tailWave) * tailSize
      );
      ctx.closePath();
      ctx.fillStyle = `rgba(${fishRgb},0.6)`;
      ctx.fill();

      // Eye
      const head = segs[0];
      const headNext = segs[1];
      const headAngle = Math.atan2(head.y - headNext.y, head.x - headNext.x);
      const eyeR = bodyWidths[0] * 0.4;
      const ex = head.x + Math.cos(headAngle + Math.PI / 3) * eyeR;
      const ey = head.y + Math.sin(headAngle + Math.PI / 3) * eyeR;
      ctx.beginPath();
      ctx.arc(ex, ey, Math.max(1.5, eyeR * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = "#111111";
      ctx.fill();

      ctx.restore();
    }

    function draw(dt: number) {
      const {
        fishCount, fishColor, scaleColor, waterColor, rippleColor,
        lilyColor, speed, showLilies, caustics,
      } = optionsRef.current;

      timeRef.current += dt * 0.001;
      const t = timeRef.current;

      ctx.fillStyle = waterColor;
      ctx.fillRect(0, 0, w, h);

      // Caustic light patches (low-res noise overlay)
      if (caustics) {
        const cellSize = 40;
        const cols = Math.ceil(w / cellSize);
        const rows = Math.ceil(h / cellSize);
        const waterRgb = hexToRgbString(waterColor);
        for (let cy = 0; cy < rows; cy++) {
          for (let cx = 0; cx < cols; cx++) {
            const n = valueNoise(cx * 0.4, cy * 0.4, t * 0.8);
            if (n > 0.6) {
              const alpha = (n - 0.6) * 0.25;
              ctx.fillStyle = `rgba(255,255,255,${alpha})`;
              ctx.fillRect(cx * cellSize, cy * cellSize, cellSize, cellSize);
            }
          }
        }
      }

      // Update fish
      while (fishRef.current.length < fishCount) fishRef.current.push(makeFish(fishColor, scaleColor));
      if (fishRef.current.length > fishCount) fishRef.current.length = fishCount;

      const mouse = mouseRef.current;

      for (const fish of fishRef.current) {
        // Gentle wander steering
        fish.wanderAngle += (Math.random() - 0.5) * 0.05;
        const targetVx = Math.cos(fish.wanderAngle) * fish.speed;
        const targetVy = Math.sin(fish.wanderAngle) * fish.speed;
        fish.vx += (targetVx - fish.vx) * 0.02;
        fish.vy += (targetVy - fish.vy) * 0.02;

        // Avoid other fish (soft separation)
        for (const other of fishRef.current) {
          if (other === fish) continue;
          const dx = fish.x - other.x;
          const dy = fish.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < fish.length * 1.5) {
            fish.vx += (dx / dist) * 0.05;
            fish.vy += (dy / dist) * 0.05;
          }
        }

        // Avoid cursor (gentle)
        if (mouse) {
          const dx = fish.x - mouse.x;
          const dy = fish.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < 80) {
            fish.vx += (dx / dist) * 0.3;
            fish.vy += (dy / dist) * 0.3;
            fish.wanderAngle = Math.atan2(fish.vy, fish.vx);
          }
        }

        // Steer away from edges
        const margin = 60;
        if (fish.x < margin) fish.vx += 0.1;
        if (fish.x > w - margin) fish.vx -= 0.1;
        if (fish.y < margin) fish.vy += 0.1;
        if (fish.y > h - margin) fish.vy -= 0.1;

        // Clamp speed
        const spd = Math.sqrt(fish.vx * fish.vx + fish.vy * fish.vy) || 0.001;
        const maxSpd = fish.speed * 1.8;
        if (spd > maxSpd) { fish.vx = (fish.vx / spd) * maxSpd; fish.vy = (fish.vy / spd) * maxSpd; }

        fish.angle = Math.atan2(fish.vy, fish.vx);
        fish.x += fish.vx;
        fish.y += fish.vy;
        fish.tailPhase += 0.05;

        // Update body segments
        const segs = fish.segments;
        segs[0].x += (fish.x - segs[0].x) * 0.4;
        segs[0].y += (fish.y - segs[0].y) * 0.4;
        const spacing = fish.length / segs.length;
        for (let i = 1; i < segs.length; i++) {
          const prev = segs[i - 1];
          const seg = segs[i];
          const dx = prev.x - seg.x;
          const dy = prev.y - seg.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist > spacing) {
            seg.x = prev.x - (dx / dist) * spacing;
            seg.y = prev.y - (dy / dist) * spacing;
          }
        }

        drawFish(fish, t);
      }

      // Lily pads (drawn on top of fish)
      if (showLilies) {
        const lilyRgb = hexToRgbString(lilyColor);
        for (const lily of liliesRef.current) {
          ctx.save();
          ctx.translate(lily.x, lily.y);
          ctx.rotate(lily.rotation + t * 0.05);
          ctx.beginPath();
          ctx.arc(0, 0, lily.radius, lily.gapAngle, Math.PI * 2 - lily.gapAngle);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fillStyle = `rgba(${lilyRgb},0.55)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${lilyRgb},0.3)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Flower dot
          ctx.beginPath();
          ctx.arc(0, 0, lily.radius * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${lilyRgb},0.8)`;
          ctx.fill();
          ctx.restore();
        }
      }

      // Ripples
      const rippleRgb = hexToRgbString(rippleColor);
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += 1.2;
        r.alpha -= 0.012;
        if (r.alpha <= 0) { ripplesRef.current.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rippleRgb},${r.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        // second ring
        if (r.radius > 10) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rippleRgb},${r.alpha * 0.5})`;
          ctx.stroke();
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
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
