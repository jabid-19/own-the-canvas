import { useRef, useEffect, RefObject } from "react";

// Permutation table for Perlin noise
const PERM = new Uint8Array(512);
const P = new Uint8Array(256);
for (let i = 0; i < 256; i++) P[i] = i;
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [P[i], P[j]] = [P[j], P[i]];
}
for (let i = 0; i < 512; i++) PERM[i] = P[i & 255];

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad(h: number, x: number, y: number) {
  const g = h & 3;
  const u = g < 2 ? x : y;
  const v = g < 2 ? y : x;
  return ((g & 1) ? -u : u) + ((g & 2) ? -v : v);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf), v = fade(yf);
  const aa = PERM[PERM[xi] + yi];
  const ab = PERM[PERM[xi] + yi + 1];
  const ba = PERM[PERM[xi + 1] + yi];
  const bb = PERM[PERM[xi + 1] + yi + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  color: string;
}

export interface UseFlowFieldOptions {
  particleCount: number;
  colors: string[];
  speed: number;
  noiseScale: number;
  trailLength: number;
  fadeStrength: number;
  lineWidth: number;
  backgroundColor: string;
  animated: boolean;
  timeSpeed: number;
  curl: boolean;
  interactive: boolean;
  attractRadius: number;
  attractStrength: number;
}

export function useFlowField(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseFlowFieldOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const reinitRef = useRef<(() => void) | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    reinitRef.current?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function makeParticle(): Particle {
      const { colors } = optionsRef.current;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0, vy: 0,
        age: 0,
        maxAge: Math.random() * 120 + 60,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    function initParticles() {
      const { particleCount } = optionsRef.current;
      particlesRef.current = Array.from({ length: particleCount }, makeParticle);
    }

    function applyDpr(width: number, height: number) {
      const cvs = canvasRef.current!;
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.round(width * dpr);
      cvs.height = Math.round(height * dpr);
      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      initParticles();
    }

    reinitRef.current = () => { if (w > 0 && h > 0) initParticles(); };

    function getPos(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseMove(e: MouseEvent) {
      if (optionsRef.current.interactive) mouseRef.current = getPos(e);
    }
    function onMouseLeave() { mouseRef.current = null; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function draw() {
      const { speed, noiseScale, fadeStrength, lineWidth, backgroundColor, timeSpeed, curl, attractRadius, attractStrength } = optionsRef.current;

      timeRef.current += timeSpeed * 0.001;
      const t = timeRef.current;

      // Fade trail
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.globalAlpha = fadeStrength;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = `rgba(0,0,0,${fadeStrength})`;
        ctx.fillRect(0, 0, w, h);
      }

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const nx = p.x * noiseScale;
        const ny = p.y * noiseScale;
        const angle = noise(nx + t, ny + t * 0.7) * Math.PI * 4;

        let dx = Math.cos(angle);
        let dy = Math.sin(angle);

        if (curl) {
          // Curl noise: perpendicular component
          const n2 = noise(nx + 100 + t, ny + t * 0.7);
          dx += -Math.sin(n2 * Math.PI * 2) * 0.5;
          dy += Math.cos(n2 * Math.PI * 2) * 0.5;
        }

        const px = p.x;
        const py = p.y;

        p.vx = p.vx * 0.9 + dx * speed * 0.1;
        p.vy = p.vy * 0.9 + dy * speed * 0.1;

        if (mouse) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < attractRadius && dist > 0) {
            const force = ((attractRadius - dist) / attractRadius) * attractStrength * 0.1;
            p.vx += (mdx / dist) * force;
            p.vy += (mdy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        const alpha = Math.max(0, 1 - p.age / p.maxAge) * 0.7;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Reset if off-screen or aged out
        if (p.age > p.maxAge || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          particlesRef.current[i] = makeParticle();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
