import { useRef, useEffect, RefObject } from "react";

interface FlareParticle {
  t: number;        // 0-1 along arc
  speed: number;
  alpha: number;
  size: number;
  hue: number;
}

interface Flare {
  angle: number;    // surface angle (radians)
  // Quadratic bezier control point (relative to sun center)
  cpX: number;
  cpY: number;
  endX: number;
  endY: number;
  particles: FlareParticle[];
  age: number;
  duration: number;
  escaped: boolean;
  color: string;
}

interface ConvectionCell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  temp: number;     // 0-1 hot-cold
  phase: number;
}

interface CoronaRing {
  baseRadius: number;
  phase: number;
  speed: number;
  alpha: number;
  width: number;
}

export interface UseSolarFlareOptions {
  sunColor: string;
  coronaColor: string;
  flareColor: string;
  backgroundColor: string;
  sunRadius: number;
  convectionCells: number;
  flareCount: number;
  autoFlare: boolean;
  autoFlareInterval: number;
  interactive: boolean;
  glowEffect: boolean;
  glowBlur: number;
  speed: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpColor(
  [r1, g1, b1]: [number, number, number],
  [r2, g2, b2]: [number, number, number],
  t: number
): string {
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

function bezierPoint(
  p0x: number, p0y: number,
  p1x: number, p1y: number,
  p2x: number, p2y: number,
  t: number
): [number, number] {
  const mt = 1 - t;
  return [
    mt * mt * p0x + 2 * mt * t * p1x + t * t * p2x,
    mt * mt * p0y + 2 * mt * t * p1y + t * t * p2y,
  ];
}

// Simple value noise
function noise2(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const h = (n: number) => {
    let s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const a = h(ix + iy * 57);
  const b = h(ix + 1 + iy * 57);
  const c = h(ix + (iy + 1) * 57);
  const d = h(ix + 1 + (iy + 1) * 57);
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

export function useSolarFlare(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseSolarFlareOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const flaresRef = useRef<Flare[]>([]);
  const cellsRef = useRef<ConvectionCell[]>([]);
  const coronaRingsRef = useRef<CoronaRing[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const lastFlareTimeRef = useRef(0);
  const clickAngleRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function sunR() {
      return Math.min(w, h) * 0.5 * optionsRef.current.sunRadius;
    }
    function cx() { return w / 2; }
    function cy() { return h / 2; }

    function initCells() {
      const { convectionCells } = optionsRef.current;
      const sr = sunR();
      cellsRef.current = Array.from({ length: convectionCells }, () => {
        const a = Math.random() * Math.PI * 2;
        const rd = Math.random() * sr * 0.85;
        return {
          x: cx() + Math.cos(a) * rd,
          y: cy() + Math.sin(a) * rd,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          temp: Math.random(),
          phase: Math.random() * Math.PI * 2,
        };
      });
    }

    function initCorona() {
      coronaRingsRef.current = Array.from({ length: 7 }, (_, i) => ({
        baseRadius: 1.1 + i * 0.15,
        phase: (i / 7) * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        alpha: 0.25 - i * 0.025,
        width: 15 + i * 5,
      }));
    }

    function spawnFlare(angle: number, isCME = false) {
      const { flareColor } = optionsRef.current;
      const sr = sunR();
      const sx = cx() + Math.cos(angle) * sr;
      const sy = cy() + Math.sin(angle) * sr;

      // Control point: shoot outward with arc; CME goes much higher
      const perpAngle = angle + (Math.random() - 0.5) * 1.2;
      const arcHeight = isCME ? sr * (3 + Math.random() * 2) : sr * (1.2 + Math.random() * 2.0);
      const cpX = cx() + Math.cos(perpAngle) * (sr + arcHeight);
      const cpY = cy() + Math.sin(perpAngle) * (sr + arcHeight);

      const escaped = isCME || Math.random() < 0.15;
      const endAngle = escaped
        ? angle + (Math.random() - 0.5) * 0.8
        : angle + (Math.random() - 0.5) * 2.5;
      const endDist = escaped ? sr * (2.5 + Math.random() * 2.5) : sr * (0.8 + Math.random() * 0.4);
      const endX = cx() + Math.cos(endAngle) * endDist;
      const endY = cy() + Math.sin(endAngle) * endDist;

      const particleCount = 60 + Math.floor(sr * 0.8);
      const particles: FlareParticle[] = Array.from({ length: particleCount }, (_, i) => ({
        t: (i / particleCount) * 0.2,
        speed: 0.003 + Math.random() * 0.005,
        alpha: 0.7 + Math.random() * 0.3,
        size: 2.5 + Math.random() * 6,
        hue: 0,
      }));

      flaresRef.current.push({
        angle,
        cpX,
        cpY,
        endX,
        endY,
        particles,
        age: 0,
        duration: escaped ? 280 : 240 + Math.random() * 80,
        escaped,
        color: flareColor,
      });
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
      initCells();
      initCorona();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onClick(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const angle = Math.atan2(my - cy(), mx - cx());
      clickAngleRef.current = angle;
    }

    function onMouseMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onMouseMove);

    function drawSun(t: number) {
      const { sunColor, glowEffect, glowBlur, coronaColor } = optionsRef.current;
      const sr = sunR();
      const scx = cx();
      const scy = cy();
      const sunRgb = hexToRgb(sunColor);
      const bgRgb = hexToRgb(optionsRef.current.backgroundColor);

      // Corona rings
      const coronaRgb = hexToRgb(coronaColor);
      for (const ring of coronaRingsRef.current) {
        const rr = sr * (ring.baseRadius + Math.sin(t * ring.speed + ring.phase) * 0.05);
        const grad = ctx.createRadialGradient(scx, scy, rr * 0.85, scx, scy, rr + ring.width);
        grad.addColorStop(0, `rgba(${coronaRgb[0]},${coronaRgb[1]},${coronaRgb[2]},${ring.alpha})`);
        grad.addColorStop(1, `rgba(${coronaRgb[0]},${coronaRgb[1]},${coronaRgb[2]},0)`);
        ctx.beginPath();
        ctx.arc(scx, scy, rr + ring.width, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Sun body
      if (glowEffect) {
        ctx.shadowBlur = glowBlur;
        ctx.shadowColor = `rgba(${sunRgb[0]},${sunRgb[1]},${sunRgb[2]},0.6)`;
      }
      const bodyGrad = ctx.createRadialGradient(scx - sr * 0.2, scy - sr * 0.2, sr * 0.05, scx, scy, sr);
      bodyGrad.addColorStop(0, `rgba(${sunRgb[0]},${sunRgb[1]},${sunRgb[2]},1)`);
      bodyGrad.addColorStop(0.5, lerpColor(sunRgb, bgRgb, 0.1));
      bodyGrad.addColorStop(0.85, lerpColor(sunRgb, bgRgb, 0.35));
      bodyGrad.addColorStop(1, lerpColor(sunRgb, bgRgb, 0.6));
      ctx.beginPath();
      ctx.arc(scx, scy, sr, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      if (glowEffect) ctx.shadowBlur = 0;

      // Convection cells
      const cells = cellsRef.current;
      const { speed } = optionsRef.current;
      for (const cell of cells) {
        cell.x += cell.vx * speed;
        cell.y += cell.vy * speed;
        cell.phase += 0.02 * speed;

        // Bounce inside sun disk
        const dx = cell.x - scx;
        const dy = cell.y - scy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > sr * 0.88) {
          cell.vx -= dx / dist * 0.05;
          cell.vy -= dy / dist * 0.05;
        }

        const n = noise2(cell.x * 0.02 + t * 0.1, cell.y * 0.02);
        const temp = (cell.temp * 0.7 + n * 0.3 + Math.sin(cell.phase) * 0.15 + 0.5) % 1;
        const alpha = 0.06 + temp * 0.08;
        const cellR = sr * 0.08 + temp * sr * 0.06;

        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cellR, 0, Math.PI * 2);
        // Hot = bright sun color, cool = slightly dimmer
        const cr = Math.round(sunRgb[0] * (0.6 + temp * 0.4));
        const cg = Math.round(sunRgb[1] * (0.6 + temp * 0.4));
        const cb = Math.round(sunRgb[2] * (0.6 + temp * 0.4));
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fill();
      }
    }

    function drawFlares() {
      const { flareColor, speed } = optionsRef.current;
      const flareRgb = hexToRgb(flareColor);
      const bgRgb = hexToRgb(optionsRef.current.backgroundColor);
      const sr = sunR();
      const scx = cx();
      const scy = cy();

      for (let fi = flaresRef.current.length - 1; fi >= 0; fi--) {
        const flare = flaresRef.current[fi];
        flare.age += speed;

        const progress = flare.age / flare.duration;
        const startX = scx + Math.cos(flare.angle) * sr;
        const startY = scy + Math.sin(flare.angle) * sr;

        for (const pp of flare.particles) {
          pp.t = Math.min(1, pp.t + pp.speed * speed);

          const [px, py] = bezierPoint(startX, startY, flare.cpX, flare.cpY, flare.endX, flare.endY, pp.t);

          // Fade in, then fade out near end
          const fade = Math.min(pp.t * 4, (1 - progress) * 3, 1);
          const alpha = pp.alpha * fade;
          if (alpha <= 0) continue;

          const tempT = 1 - pp.t * 0.5; // head is hotter
          const col = lerpColor(flareRgb, bgRgb, 1 - tempT);
          ctx.beginPath();
          ctx.arc(px, py, pp.size * (0.7 + 0.3 * (1 - pp.t)), 0, Math.PI * 2);
          ctx.fillStyle = col.replace("rgb", "rgba").replace(")", `,${alpha})`);
          ctx.fill();
        }

        if (flare.age >= flare.duration) {
          flaresRef.current.splice(fi, 1);
        }
      }
    }

    function draw(dt: number) {
      const { backgroundColor, autoFlare, autoFlareInterval, flareCount, speed } = optionsRef.current;

      timeRef.current += dt * 0.001 * speed;
      const t = timeRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      drawSun(t);
      drawFlares();

      // Auto-spawn flares
      const now = performance.now();
      if (autoFlare && flaresRef.current.length < flareCount && now - lastFlareTimeRef.current > autoFlareInterval / speed) {
        const angle = Math.random() * Math.PI * 2;
        const isCME = Math.random() < 0.1;
        spawnFlare(angle, isCME);
        lastFlareTimeRef.current = now;
      }

      // Click-triggered flare
      if (clickAngleRef.current !== null) {
        spawnFlare(clickAngleRef.current);
        clickAngleRef.current = null;
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
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [canvasRef]);
}
