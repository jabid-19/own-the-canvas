import { useRef, useEffect, RefObject } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  hue: number;
  trail: { x: number; y: number }[];
  id: number;
}

interface Flash {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  hue: number;
}

export interface UseNBodyGravityOptions {
  bodyCount: number;
  G: number;
  trailLength: number;
  speed: number;
  bodyColor: string;
  backgroundColor: string;
  trailOpacity: number;
  glowEffect: boolean;
  glowBlur: number;
  interactive: boolean;
  softening: number;
  mergeOnCollide: boolean;
  newBodyMass: number;
  colorMode: "solid" | "hue";
  showTrails: boolean;
  preset: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RADIUS_SCALE = 3;
let _nextId = 1;
function nextId() { return _nextId++; }
function bodyRadius(mass: number) { return Math.sqrt(mass) * RADIUS_SCALE; }

// ─── Colour helpers ───────────────────────────────────────────────────────────

function hslBody(hue: number, alpha: number) {
  return `hsla(${hue},90%,65%,${alpha})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function bgOverlay(bg: string, alpha: number): string {
  const m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return `rgba(${m[1]},${m[2]},${m[3]},${alpha})`;
  if (bg.startsWith("#")) {
    const [r, g, b] = hexToRgb(bg);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return `rgba(0,0,0,${alpha})`;
}

// ─── Initial condition factories ──────────────────────────────────────────────

function makeFigureEight(w: number, h: number): Body[] {
  // Chenciner–Montgomery figure-8 (normalised coordinates → canvas)
  const scale = Math.min(w, h) * 0.22;
  const cx = w / 2;
  const cy = h / 2;
  const vScale = scale * 0.55;

  const positions = [
    [-0.97000436, 0.24308753],
    [0, 0],
    [0.97000436, -0.24308753],
  ];
  const velocities = [
    [0.93240737 / 2, 0.86473146 / 2],
    [-0.93240737, -0.86473146],
    [0.93240737 / 2, 0.86473146 / 2],
  ];
  const hues = [200, 50, 320];

  return positions.map(([px, py], i) => {
    const mass = 30;
    return {
      x: cx + px * scale,
      y: cy + py * scale,
      vx: velocities[i][0] * vScale,
      vy: velocities[i][1] * vScale,
      mass,
      radius: bodyRadius(mass),
      hue: hues[i],
      trail: [],
      id: nextId(),
    };
  });
}

function makeSolar(w: number, h: number): Body[] {
  const cx = w / 2;
  const cy = h / 2;
  const centralMass = 200;
  const central: Body = {
    x: cx, y: cy, vx: 0, vy: 0,
    mass: centralMass, radius: bodyRadius(centralMass),
    hue: 45, trail: [], id: nextId(),
  };

  const orbitCount = 5;
  const bodies: Body[] = [central];
  for (let i = 0; i < orbitCount; i++) {
    const angle = (Math.PI * 2 * i) / orbitCount + Math.random() * 0.3;
    const dist = 80 + i * 55 + Math.random() * 20;
    const mass = 2 + Math.random() * 6;
    // Circular orbit speed: v = sqrt(G * M / r)
    const orbitSpeed = Math.sqrt(0.8 * centralMass / dist);
    bodies.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: -Math.sin(angle) * orbitSpeed,
      vy: Math.cos(angle) * orbitSpeed,
      mass,
      radius: bodyRadius(mass),
      hue: (i * 60 + 180) % 360,
      trail: [],
      id: nextId(),
    });
  }
  return bodies;
}

function makeChaos(w: number, h: number, count: number): Body[] {
  const bodies: Body[] = [];
  for (let i = 0; i < count; i++) {
    const mass = 5 + Math.random() * 25;
    bodies.push({
      x: w * 0.15 + Math.random() * w * 0.7,
      y: h * 0.15 + Math.random() * h * 0.7,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      mass,
      radius: bodyRadius(mass),
      hue: Math.random() * 360,
      trail: [],
      id: nextId(),
    });
  }
  return bodies;
}

function makeBinary(w: number, h: number): Body[] {
  const cx = w / 2;
  const cy = h / 2;
  const mass = 40;
  const sep = Math.min(w, h) * 0.18;
  const orbitSpeed = Math.sqrt(0.5 * mass / (sep));
  const bodies: Body[] = [
    {
      x: cx - sep, y: cy, vx: 0, vy: -orbitSpeed,
      mass, radius: bodyRadius(mass), hue: 200, trail: [], id: nextId(),
    },
    {
      x: cx + sep, y: cy, vx: 0, vy: orbitSpeed,
      mass, radius: bodyRadius(mass), hue: 30, trail: [], id: nextId(),
    },
    // test particle in a wider orbit
    {
      x: cx, y: cy - sep * 2.4, vx: Math.sqrt(0.5 * mass * 2 / (sep * 2.4)), vy: 0,
      mass: 1, radius: bodyRadius(1), hue: 130, trail: [], id: nextId(),
    },
  ];
  return bodies;
}

function makeSwarm(w: number, h: number): Body[] {
  const bodies: Body[] = [];
  const cx = w / 2;
  const cy = h / 2;
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const dist = 60 + Math.random() * 80;
    const mass = 4 + Math.random() * 8;
    bodies.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      mass,
      radius: bodyRadius(mass),
      hue: (i * 45) % 360,
      trail: [],
      id: nextId(),
    });
  }
  return bodies;
}

export function initBodies(preset: string, w: number, h: number, count: number): Body[] {
  switch (preset) {
    case "solar":   return makeSolar(w, h);
    case "chaos":   return makeChaos(w, h, count);
    case "binary":  return makeBinary(w, h);
    case "swarm":   return makeSwarm(w, h);
    case "minimal": return makeFigureEight(w, h);
    case "neon":    return makeChaos(w, h, 4);
    default:        return makeFigureEight(w, h);
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNBodyGravity(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseNBodyGravityOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Keep bodies and flashes in refs so the animation loop always sees latest
  const bodiesRef = useRef<Body[]>([]);
  const flashesRef = useRef<Flash[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = width;
      h = height;

      if (!initializedRef.current) {
        const { bodyCount, preset } = optionsRef.current;
        bodiesRef.current = initBodies(preset, w, h, bodyCount);
        flashesRef.current = [];
        initializedRef.current = true;
      }
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    // ── Click handler ──────────────────────────────────────────────────────────
    function onClick(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const { newBodyMass } = optionsRef.current;
      const bounds = canvas!.getBoundingClientRect();
      const px = e.clientX - bounds.left;
      const py = e.clientY - bounds.top;
      const mass = newBodyMass;
      bodiesRef.current.push({
        x: px, y: py, vx: 0, vy: 0,
        mass, radius: bodyRadius(mass),
        hue: Math.random() * 360,
        trail: [],
        id: nextId(),
      });
    }
    canvas.addEventListener("click", onClick);

    // ── Physics ────────────────────────────────────────────────────────────────
    function stepPhysics(dtSec: number) {
      const { G, softening, mergeOnCollide, trailLength } = optionsRef.current;
      const bodies = bodiesRef.current;
      const n = bodies.length;
      const eps2 = softening * softening;

      // Record trail position
      for (let i = 0; i < n; i++) {
        const b = bodies[i];
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > trailLength) b.trail.shift();
      }

      // Accumulate accelerations
      const ax = new Float64Array(n);
      const ay = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = bodies[j].x - bodies[i].x;
          const dy = bodies[j].y - bodies[i].y;
          const r2 = dx * dx + dy * dy + eps2;
          const r = Math.sqrt(r2);
          const f = G / r2;
          ax[i] += f * bodies[j].mass * dx / r;
          ay[i] += f * bodies[j].mass * dy / r;
          ax[j] -= f * bodies[i].mass * dx / r;
          ay[j] -= f * bodies[i].mass * dy / r;
        }
      }

      // Integrate (Euler)
      for (let i = 0; i < n; i++) {
        const b = bodies[i];
        b.vx += ax[i] * dtSec;
        b.vy += ay[i] * dtSec;
        b.x += b.vx * dtSec;
        b.y += b.vy * dtSec;
      }

      // Merging
      if (mergeOnCollide && n > 1) {
        const toRemove = new Set<number>();
        for (let i = 0; i < n; i++) {
          if (toRemove.has(i)) continue;
          for (let j = i + 1; j < n; j++) {
            if (toRemove.has(j)) continue;
            const dx = bodies[j].x - bodies[i].x;
            const dy = bodies[j].y - bodies[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mergeThresh = (bodies[i].radius + bodies[j].radius) * 0.8;
            if (dist < mergeThresh) {
              // Larger survives
              const [survivor, absorbed] =
                bodies[i].mass >= bodies[j].mass
                  ? [bodies[i], bodies[j]]
                  : [bodies[j], bodies[i]];
              const totalMass = survivor.mass + absorbed.mass;
              // Weighted position
              survivor.x = (survivor.x * survivor.mass + absorbed.x * absorbed.mass) / totalMass;
              survivor.y = (survivor.y * survivor.mass + absorbed.y * absorbed.mass) / totalMass;
              // Momentum-conserving velocity
              survivor.vx = (survivor.vx * survivor.mass + absorbed.vx * absorbed.mass) / totalMass;
              survivor.vy = (survivor.vy * survivor.mass + absorbed.vy * absorbed.mass) / totalMass;
              survivor.mass = totalMass;
              survivor.radius = bodyRadius(totalMass);
              // Flash
              flashesRef.current.push({
                x: survivor.x,
                y: survivor.y,
                radius: 2,
                maxRadius: survivor.radius * 4 + 20,
                alpha: 1,
                hue: survivor.hue,
              });
              toRemove.add(bodies.indexOf(absorbed));
            }
          }
        }
        if (toRemove.size > 0) {
          bodiesRef.current = bodies.filter((_, i) => !toRemove.has(i));
        }
      }

      // Cull escaped bodies (> 2× canvas dimension from centre)
      const limit = Math.max(w, h) * 2;
      bodiesRef.current = bodiesRef.current.filter(
        (b) => Math.abs(b.x - w / 2) < limit && Math.abs(b.y - h / 2) < limit
      );
    }

    // ── Draw ───────────────────────────────────────────────────────────────────
    function draw() {
      const {
        backgroundColor, colorMode, bodyColor,
        showTrails, trailOpacity, glowEffect, glowBlur,
        G, softening,
      } = optionsRef.current;

      // Background fade (motion blur / trail persistence)
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.fillStyle = bgOverlay(backgroundColor, 0.18);
      ctx.fillRect(0, 0, w, h);

      const bodies = bodiesRef.current;

      // ── Gravitational field lines ──────────────────────────────────────────
      if (bodies.length >= 1) {
        const COLS = 20;
        const ROWS = 16;
        const cellW = w / COLS;
        const cellH = h / ROWS;
        const arrowLen = Math.min(cellW, cellH) / 3;
        const eps2 = softening * softening;

        ctx.shadowBlur = 0;

        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const px = (col + 0.5) * cellW;
            const py = (row + 0.5) * cellH;

            // Net gravitational acceleration at this sample point
            let ax = 0;
            let ay = 0;
            for (const body of bodies) {
              const dx = body.x - px;
              const dy = body.y - py;
              const r2 = dx * dx + dy * dy;
              const denom = Math.pow(r2 + eps2, 1.5);
              const strength = G * body.mass / denom;
              ax += strength * dx;
              ay += strength * dy;
            }

            const mag = Math.sqrt(ax * ax + ay * ay);
            if (mag < 1e-10) continue;

            // Normalise and scale to arrow length
            const nx = (ax / mag) * arrowLen;
            const ny = (ay / mag) * arrowLen;

            // Opacity shifts subtly with magnitude (stronger field = slightly brighter)
            const normalizedMag = Math.min(1, mag / 0.5);
            const alpha = 0.08 + normalizedMag * 0.1;

            ctx.globalAlpha = alpha;
            ctx.strokeStyle =
              colorMode === "hue"
                ? `hsla(${Math.round(180 + normalizedMag * 120)},80%,70%,1)`
                : bodyColor;
            ctx.lineWidth = 0.8;

            const x1 = px - nx * 0.5;
            const y1 = py - ny * 0.5;
            const x2 = px + nx * 0.5;
            const y2 = py + ny * 0.5;

            // Line segment
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Small arrowhead at tip
            const headLen = arrowLen * 0.28;
            const angle = Math.atan2(ny, nx);
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(
              x2 - headLen * Math.cos(angle - 0.4),
              y2 - headLen * Math.sin(angle - 0.4)
            );
            ctx.moveTo(x2, y2);
            ctx.lineTo(
              x2 - headLen * Math.cos(angle + 0.4),
              y2 - headLen * Math.sin(angle + 0.4)
            );
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 1;
      }

      // ── Trails ────────────────────────────────────────────────────────────
      if (showTrails) {
        ctx.shadowBlur = 0;
        for (const body of bodies) {
          const trail = body.trail;
          const len = trail.length;
          if (len < 2) continue;

          for (let t = 1; t < len; t++) {
            const frac = t / len; // 0 = oldest, 1 = newest

            const isTip    = frac >= 0.85;           // newest 15%
            const isMid    = frac >= 0.45 && !isTip; // middle 40%
            // oldest 45%: frac < 0.45

            let alpha: number;
            let lineWidth: number;
            let strokeStyle: string;

            if (isTip) {
              // Bright, extra-wide, slightly glowing tip
              alpha = 0.9;
              lineWidth = Math.max(1, body.radius * 0.18 * frac * 1.5);
              ctx.shadowBlur = 4;
              ctx.shadowColor =
                colorMode === "hue" ? hslBody(body.hue + 20, 0.9) : bodyColor;
              strokeStyle =
                colorMode === "hue" ? hslBody(body.hue + 20, 1) : bodyColor;
            } else if (isMid) {
              // Current behaviour, slightly more saturated in hue mode
              alpha = Math.pow(frac, 1.5) * trailOpacity;
              lineWidth = Math.max(0.5, body.radius * 0.18 * frac);
              ctx.shadowBlur = 0;
              strokeStyle =
                colorMode === "hue"
                  ? `hsla(${body.hue},100%,65%,1)`
                  : bodyColor;
            } else {
              // Oldest segment — fade faster
              alpha = Math.pow(frac, 2.5) * trailOpacity;
              lineWidth = Math.max(0.5, body.radius * 0.18 * frac);
              ctx.shadowBlur = 0;
              strokeStyle =
                colorMode === "hue" ? hslBody(body.hue, 1) : bodyColor;
            }

            ctx.globalAlpha = alpha;
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(trail[t - 1].x, trail[t - 1].y);
            ctx.lineTo(trail[t].x, trail[t].y);
            ctx.stroke();
          }
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      // Flashes (merge effect)
      const flashes = flashesRef.current;
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        ctx.globalAlpha = f.alpha * 0.85;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        grad.addColorStop(0, `hsla(${f.hue},100%,95%,1)`);
        grad.addColorStop(0.5, `hsla(${f.hue},100%,70%,0.6)`);
        grad.addColorStop(1, `hsla(${f.hue},100%,60%,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();

        f.radius += (f.maxRadius - f.radius) * 0.15;
        f.alpha *= 0.88;
        if (f.alpha < 0.01) flashes.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      // Bodies
      for (const body of bodies) {
        const r = body.radius;
        const color = colorMode === "hue" ? hslBody(body.hue, 1) : bodyColor;

        if (glowEffect) {
          ctx.shadowBlur = glowBlur + r;
          ctx.shadowColor = colorMode === "hue" ? hslBody(body.hue, 0.9) : bodyColor;
        } else {
          ctx.shadowBlur = 0;
        }

        // Radial gradient fill
        const grad = ctx.createRadialGradient(body.x, body.y, 0, body.x, body.y, r);
        if (colorMode === "hue") {
          grad.addColorStop(0, hslBody(body.hue, 0.95));
          grad.addColorStop(0.6, hslBody(body.hue, 0.75));
          grad.addColorStop(1, hslBody(body.hue, 0));
        } else {
          grad.addColorStop(0, bodyColor);
          grad.addColorStop(0.6, bodyColor);
          grad.addColorStop(1, "transparent");
        }

        ctx.beginPath();
        ctx.arc(body.x, body.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bright core highlight
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(body.x, body.y, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = colorMode === "hue" ? `hsla(${body.hue},100%,92%,0.9)` : "#ffffff";
        ctx.fill();

        // Rotate hue slowly for living colour
        if (colorMode === "hue") {
          body.hue = (body.hue + 0.08) % 360;
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // ── Animation loop ─────────────────────────────────────────────────────────
    let rafId = 0;
    let lastTs = 0;

    function loop(ts: number) {
      const rawDt = lastTs ? ts - lastTs : 16;
      lastTs = ts;
      const { speed } = optionsRef.current;
      // clamp dt to avoid spiral-of-death on tab resume
      const dt = Math.min(rawDt, 50);
      const dtSec = (dt / 1000) * 60; // normalise to 60fps units

      // Sub-steps for higher speed settings
      const steps = Math.max(1, Math.round(speed));
      const subDt = (dtSec * speed) / steps;
      if (w > 0 && h > 0) {
        for (let s = 0; s < steps; s++) stepPhysics(subDt);
        draw();
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef]);
}
