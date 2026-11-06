// src/components/ButterflySwarm/useButterflySwarm.ts
import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";
import { pointerInCanvas } from "../../runtime/fx";

interface Butterfly {
  x: number; y: number;
  vx: number; vy: number;
  angle: number;
  flapPhase: number;
  /** -1..1: per-butterfly lightness shift so the swarm isn't identical */
  tint: number;
  /** depth 0.55 (far, small, dim) .. 1 (near) */
  z: number;
  size: number;
  wanderAngle: number;
  fleeing: boolean;
  /** seconds left in a glide with wings held open */
  glide: number;
  trail: number[];
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

const TRAIL = 26;

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const toRgb = (c: string) => (c.startsWith("#") ? hexToRgbString(c) : "255,255,255");

// Right-hand wings in unit space: +x away from the body, -y toward the head.
function forewing(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0.04, -0.12);
  ctx.bezierCurveTo(0.28, -0.5, 0.7, -0.88, 1.08, -0.88);  // costa to a pointed apex
  ctx.bezierCurveTo(1.0, -0.6, 0.92, -0.25, 0.76, 0.02);   // outer margin to tornus
  ctx.bezierCurveTo(0.5, 0.07, 0.25, 0.05, 0.05, 0.02);    // inner margin home
  ctx.closePath();
}
function hindwing(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0.05, -0.01);
  ctx.bezierCurveTo(0.45, -0.06, 0.86, 0.12, 0.8, 0.42);
  ctx.bezierCurveTo(0.76, 0.7, 0.45, 0.94, 0.22, 0.88);
  ctx.bezierCurveTo(0.1, 0.72, 0.04, 0.45, 0.03, 0.2);
  ctx.closePath();
}
const FORE_VEINS: [number, number][] = [[1.0, -0.82], [0.95, -0.55], [0.86, -0.22], [0.62, 0.03], [0.6, -0.66]];
const HIND_VEINS: [number, number][] = [[0.76, 0.3], [0.7, 0.58], [0.48, 0.84], [0.26, 0.84]];
const FORE_SPOTS: [number, number][] = [[1.0, -0.8], [0.97, -0.66], [0.93, -0.5], [0.88, -0.34], [0.81, -0.17], [0.88, -0.76], [0.92, -0.69]];
const HIND_SPOTS: [number, number][] = [[0.78, 0.33], [0.76, 0.5], [0.66, 0.7], [0.48, 0.83], [0.31, 0.83]];

function drawWing(
  ctx: CanvasRenderingContext2D,
  shape: (c: CanvasRenderingContext2D) => void,
  veins: [number, number][],
  spots: [number, number][],
  wing: string, pat: string, open: number,
) {
  shape(ctx);
  const g = ctx.createRadialGradient(0.05, 0, 0, 0.05, 0, 1.05);
  g.addColorStop(0, `rgb(${mix(wing, pat, 0.55)})`); // dusky scales at the wing root
  g.addColorStop(0.3, `rgb(${wing})`);
  g.addColorStop(0.8, `rgb(${mix(wing, "255,255,255", 0.14)})`);
  g.addColorStop(1, `rgb(${wing})`);
  ctx.fillStyle = g;
  ctx.fill();

  ctx.save();
  ctx.clip();
  // veins radiating from the root
  ctx.strokeStyle = `rgba(${pat},0.6)`;
  ctx.lineWidth = 0.026;
  ctx.beginPath();
  for (const [x, y] of veins) { ctx.moveTo(0.05, 0); ctx.quadraticCurveTo(x * 0.5, y * 0.4, x, y); }
  ctx.stroke();
  // dark margin band with a row of pale spots
  shape(ctx);
  ctx.strokeStyle = `rgb(${pat})`;
  ctx.lineWidth = 0.2;
  ctx.stroke();
  ctx.fillStyle = `rgba(${mix(wing, "255,255,255", 0.85)},0.9)`;
  for (const [x, y] of spots) { ctx.beginPath(); ctx.arc(x, y, 0.032, 0, Math.PI * 2); ctx.fill(); }
  // nearly folded wings show their duller undersides
  if (open < 0.4) {
    ctx.fillStyle = `rgba(0,0,0,${(0.4 - open) * 1.1})`;
    ctx.fillRect(-0.1, -1, 1.3, 2);
  }
  ctx.restore();
}

/**
 * A drifting swarm of butterflies. Each one has a forewing and hindwing with dusky roots,
 * veins, a dark margin and a row of pale spots; the wings fold in perspective as they beat
 * (fast downstroke, the odd open-winged glide), and the flutter makes the flight bob and
 * wander. Near butterflies are larger and brighter than far ones. They drift toward a slow
 * cursor and scatter from a fast one. Soft out-of-focus light fills the background.
 */
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
    let w = 0, h = 0, dpr = 1, t = 0;

    let butterflies: Butterfly[] = [];
    let bokeh: { x: number; y: number; r: number; a: number; s: number }[] = [];
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };

    function makeButterfly(): Butterfly {
      const z = 0.55 + Math.random() * 0.45;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * optionsRef.current.speed,
        vy: (Math.random() - 0.5) * optionsRef.current.speed,
        angle: Math.random() * Math.PI * 2,
        flapPhase: Math.random() * Math.PI * 2,
        tint: Math.random() * 2 - 1,
        z,
        size: (16 + Math.random() * 8) * z,
        wanderAngle: Math.random() * Math.PI * 2,
        fleeing: false,
        glide: 0,
        trail: [],
      };
    }

    function sync(n: number) {
      n = Math.max(0, Math.round(n));
      if (butterflies.length === n) return;
      while (butterflies.length < n) butterflies.push(makeButterfly());
      butterflies.length = n;
      butterflies.sort((a, b) => a.z - b.z); // far ones first
    }

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      w = width; h = height;
      butterflies = [];
      sync(optionsRef.current.butterflyCount);
      bokeh = Array.from({ length: 14 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: (20 + Math.random() * 60) * Math.max(0.6, Math.min(w, h) / 420),
        a: 0.03 + Math.random() * 0.06, s: Math.random() * 6,
      }));
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      const p = pointerInCanvas(e, canvas!);
      if (!p) return onMouseLeave();
      mouse.prevX = mouse.x; mouse.prevY = mouse.y;
      mouse.x = p.x;
      mouse.y = p.y;
    }
    function onMouseLeave() { mouse.x = -9999; mouse.y = -9999; }
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    function drawBody(b: Butterfly, body: string, rim: string) {
      const s = b.size;
      ctx.fillStyle = `rgb(${body})`;
      ctx.beginPath(); ctx.ellipse(0, 0.38 * s, 0.06 * s, 0.36 * s, 0, 0, Math.PI * 2); ctx.fill(); // abdomen
      ctx.beginPath(); ctx.ellipse(0, -0.02 * s, 0.085 * s, 0.14 * s, 0, 0, Math.PI * 2); ctx.fill(); // thorax
      ctx.beginPath(); ctx.arc(0, -0.19 * s, 0.065 * s, 0, Math.PI * 2); ctx.fill(); // head
      ctx.strokeStyle = `rgba(${rim},0.35)`; // fuzz catching the light
      ctx.lineWidth = Math.max(0.5, 0.025 * s);
      ctx.beginPath(); ctx.ellipse(0, -0.02 * s, 0.085 * s, 0.14 * s, 0, 0, Math.PI * 2); ctx.stroke();
      // clubbed antennae
      ctx.strokeStyle = `rgb(${body})`;
      ctx.lineWidth = Math.max(0.5, 0.022 * s);
      ctx.fillStyle = `rgb(${body})`;
      for (const side of [-1, 1]) {
        const tx = side * 0.21 * s, ty = -0.62 * s;
        ctx.beginPath();
        ctx.moveTo(side * 0.03 * s, -0.24 * s);
        ctx.quadraticCurveTo(side * 0.06 * s, -0.5 * s, tx, ty);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(tx, ty, Math.max(0.6, 0.03 * s), 0, Math.PI * 2); ctx.fill();
      }
    }

    let raf = 0, last = 0;
    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      if (w === 0) return;
      const k = dt * 60; // the motion model was tuned per 60fps frame
      const o = optionsRef.current;
      sync(o.butterflyCount);

      const wingC = toRgb(o.wingColor);
      const patC = toRgb(o.patternColor);
      const transparent = !o.backgroundColor || o.backgroundColor === "transparent";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!transparent) {
        const bg = toRgb(o.backgroundColor);
        const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.hypot(w, h) * 0.65);
        g.addColorStop(0, `rgb(${mix(bg, wingC, 0.1)})`);
        g.addColorStop(1, `rgb(${bg})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        // out-of-focus sunlight through leaves
        ctx.globalCompositeOperation = "lighter";
        const lc = mix(wingC, "255,240,200", 0.6);
        for (const p of bokeh) {
          const x = p.x + Math.sin(t * 0.15 + p.s) * 14, y = p.y + Math.cos(t * 0.11 + p.s) * 8;
          const a = p.a * (0.7 + 0.3 * Math.sin(t * 0.6 + p.s));
          const bg2 = ctx.createRadialGradient(x, y, 0, x, y, p.r);
          bg2.addColorStop(0, `rgba(${lc},${a})`);
          bg2.addColorStop(0.7, `rgba(${lc},${a * 0.6})`);
          bg2.addColorStop(1, `rgba(${lc},0)`);
          ctx.fillStyle = bg2;
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      const mouseSpeed = mouse.x > -100 ? Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY) : 0;
      const isMouseFast = mouseSpeed > 12;
      const dust = mix(wingC, "255,255,255", 0.5);

      for (const b of butterflies) {
        const sp = o.speed * (0.6 + b.z * 0.4);
        b.wanderAngle += (Math.random() - 0.5) * 0.3 * k;
        let ax = Math.cos(b.wanderAngle) * 0.15 * sp;
        let ay = Math.sin(b.wanderAngle) * 0.15 * sp;

        b.fleeing = false;
        if (o.interactive && mouse.x > -100) {
          const dx = mouse.x - b.x, dy = mouse.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < o.attractRadius && dist > 0) {
            if (isMouseFast) {
              ax -= (dx / dist) * 1.5;
              ay -= (dy / dist) * 1.5;
              b.fleeing = true;
              b.glide = 0;
            } else {
              const pull = (1 - dist / o.attractRadius) * 0.08 * sp;
              ax += (dx / dist) * pull;
              ay += (dy / dist) * pull;
            }
          }
        }

        const damp = Math.pow(0.94, k);
        b.vx = (b.vx + ax * k) * damp;
        b.vy = (b.vy + ay * k) * damp;
        const spd = Math.hypot(b.vx, b.vy);
        const maxSpd = sp * (b.fleeing ? 3 : 1.2);
        if (spd > maxSpd) { b.vx = (b.vx / spd) * maxSpd; b.vy = (b.vy / spd) * maxSpd; }

        b.x += b.vx * k; b.y += b.vy * k;
        const m = b.size * 2;
        let wrapped = false;
        if (b.x < -m) { b.x = w + b.size; wrapped = true; }
        if (b.x > w + m) { b.x = -b.size; wrapped = true; }
        if (b.y < -m) { b.y = h + b.size; wrapped = true; }
        if (b.y > h + m) { b.y = -b.size; wrapped = true; }
        if (wrapped) b.trail.length = 0;

        // turn smoothly toward the direction of travel
        if (spd > 0.05) {
          let diff = Math.atan2(b.vy, b.vx) + Math.PI / 2 - b.angle;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          b.angle += diff * Math.min(1, 0.18 * k);
        }

        // wingbeat: brief open-winged glides between bursts of flapping
        if (b.glide > 0) b.glide -= dt;
        else if (!b.fleeing && Math.random() < 0.004 * k) b.glide = 0.3 + Math.random() * 0.6;
        const gliding = b.glide > 0;
        if (!gliding) b.flapPhase += o.flapSpeed * Math.PI * 2 * 2.4 * dt * (b.fleeing ? 1.8 : 1);
        const beat = gliding ? 0.82 + 0.06 * Math.sin(t * 20 + b.tint * 9) : Math.pow(0.5 + 0.5 * Math.sin(b.flapPhase), 0.8);
        const open = 0.12 + 0.86 * beat;
        const openHind = gliding ? open : 0.12 + 0.86 * Math.pow(0.5 + 0.5 * Math.sin(b.flapPhase - 0.35), 0.8);

        // each wingbeat jolts the body: the familiar bobbing flight
        const bob = gliding ? 0 : Math.sin(b.flapPhase) * 0.12 * b.size;
        const px = b.x + Math.cos(b.angle) * bob, py = b.y + Math.sin(b.angle) * bob;

        if (o.showTrails) {
          b.trail.push(px, py);
          if (b.trail.length > TRAIL * 2) b.trail.splice(0, 2);
          ctx.lineCap = "round";
          ctx.lineWidth = Math.max(0.6, b.z * 1.4);
          for (let i = 2; i < b.trail.length; i += 2) {
            ctx.strokeStyle = `rgba(${dust},${(i / b.trail.length) * 0.22 * b.z})`;
            ctx.beginPath();
            ctx.moveTo(b.trail[i - 2], b.trail[i - 1]);
            ctx.lineTo(b.trail[i], b.trail[i + 1]);
            ctx.stroke();
          }
        } else if (b.trail.length) b.trail.length = 0;

        const shade = b.tint * 0.12;
        const wing = mix(wingC, shade > 0 ? "255,255,255" : "0,0,0", Math.abs(shade));
        const pat = patC;
        const body = mix(patC, "0,0,0", 0.35);

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(b.angle);
        ctx.globalAlpha = 0.6 + 0.4 * b.z;
        const pulse = 1 + 0.05 * (beat - 0.5); // wings up = body lifts toward the viewer
        for (const side of [-1, 1]) {
          ctx.save();
          ctx.scale(side * openHind * b.size * pulse, b.size * pulse);
          drawWing(ctx, hindwing, HIND_VEINS, HIND_SPOTS, wing, pat, openHind);
          ctx.restore();
          ctx.save();
          ctx.scale(side * open * b.size * pulse, b.size * pulse);
          drawWing(ctx, forewing, FORE_VEINS, FORE_SPOTS, wing, pat, open);
          ctx.restore();
        }
        drawBody(b, body, mix(wingC, "255,255,255", 0.5));
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
