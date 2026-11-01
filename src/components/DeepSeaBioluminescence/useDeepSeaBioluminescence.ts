import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";
import { pointerInCanvas } from "../../runtime/fx";

export interface UseDeepSeaBioluminescenceOptions {
  jellyfishCount: number;
  planktonCount: number;
  jellyfishColor: string;
  glowColor: string;
  waterColor: string;
  interactive: boolean;
  speed: number;
}

interface Jelly {
  x: number; y: number; z: number; R: number;
  vx: number; vy: number; phase: number; rate: number;
  seed: number; flash: number; tentacles: number;
}

interface Mote { x: number; y: number; z: number; r: number; lit: boolean; tw: number; flash: number }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number }

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};

function makeJelly(w: number, h: number, y?: number): Jelly {
  const z = 0.45 + Math.random() * 0.55;
  return {
    x: w * (0.08 + Math.random() * 0.84),
    y: y ?? h + 60 + Math.random() * h * 0.4,
    z,
    R: (22 + Math.random() * 18) * (0.6 + z * 0.55),
    vx: 0, vy: -10,
    phase: Math.random() * Math.PI * 2,
    rate: (2 * Math.PI) / (1.9 + Math.random() * 1.2),
    seed: Math.random() * 100,
    flash: 0,
    tentacles: 8 + Math.floor(Math.random() * 5),
  };
}

function makeMote(w: number, h: number): Mote {
  const z = 0.25 + Math.random() * 0.75;
  return { x: Math.random() * w, y: Math.random() * h, z, r: 0.4 + z * 1.3, lit: Math.random() < 0.28, tw: Math.random() * 10, flash: 0 };
}

/**
 * The deep sea at night: translucent jellyfish at different depths pulse their bells to swim,
 * trailing frilly oral arms and long tentacles; rim lights chase around each bell. Marine
 * snow drifts down, faint light shafts sway from above, and moving the cursor stirs the
 * water into luminous sparks that make nearby plankton and jellyfish flash.
 */
export function useDeepSeaBioluminescence(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseDeepSeaBioluminescenceOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    let jellies: Jelly[] = [];
    let motes: Mote[] = [];
    const sparks: Spark[] = [];
    const mouse = { x: -1, y: -1, px: -1, py: -1, inside: false };

    function init() {
      const o = optionsRef.current;
      jellies = Array.from({ length: o.jellyfishCount }, () => makeJelly(w, h, Math.random() * h));
      motes = Array.from({ length: o.planktonCount }, () => makeMote(w, h));
    }

    function applySize(width: number, height: number) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = width; h = height;
      init();
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
      mouse.px = mouse.inside ? mouse.x : p.x;
      mouse.py = mouse.inside ? mouse.y : p.y;
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.inside = true;
      if (!optionsRef.current.interactive) return;
      const moved = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
      const n = Math.min(6, Math.floor(moved / 4) + 1);
      for (let i = 0; i < n && sparks.length < 260; i++) {
        const max = 0.8 + Math.random() * 1.1;
        const k = Math.random();
        sparks.push({
          x: mouse.px + (mouse.x - mouse.px) * k + (Math.random() - 0.5) * 18,
          y: mouse.py + (mouse.y - mouse.py) * k + (Math.random() - 0.5) * 18,
          vx: (Math.random() - 0.5) * 24, vy: (Math.random() - 0.5) * 24 - 6,
          life: max, max, size: 0.8 + Math.random() * 1.8,
        });
      }
    }
    function onMouseLeave() { mouse.inside = false; mouse.x = -1; mouse.y = -1; }
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    function drawMote(m: Mote, glow: string, t: number) {
      const tw = 0.55 + 0.45 * Math.sin(t * 1.7 + m.tw);
      if (m.lit) {
        const a = (0.25 + 0.5 * tw) * m.z + m.flash;
        ctx.fillStyle = `rgba(${glow},${Math.min(1, a * 0.22)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${mix(glow, "255,255,255", 0.5)},${Math.min(1, a)})`;
      } else {
        ctx.fillStyle = `rgba(205,225,240,${0.18 * m.z * tw})`;
      }
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawJelly(j: Jelly, body: string, glow: string, t: number) {
      const c = Math.pow(Math.max(0, Math.sin(j.phase)), 1.4); // bell contraction 0..1
      const a = 0.35 + 0.65 * j.z;
      const R = j.R;
      const W = R * (1 - 0.17 * c);
      const H = R * 0.9 * (1 + 0.12 * c);
      const tilt = Math.atan2(j.vx, -j.vy) * 0.8;
      const pale = mix(glow, "255,255,255", 0.55);

      // absolute positions of things drawn as circles, so arc() sees canvas coordinates
      const cos = Math.cos(tilt), sin = Math.sin(tilt);
      const toWorld = (lx: number, ly: number) => ({ x: j.x + lx * cos - ly * sin, y: j.y + lx * sin + ly * cos });

      // halo
      ctx.globalCompositeOperation = "lighter";
      const hc = toWorld(0, -H * 0.3);
      const halo = ctx.createRadialGradient(hc.x, hc.y, 0, hc.x, hc.y, R * 2.8);
      halo.addColorStop(0, `rgba(${glow},${(0.17 + j.flash * 0.35) * a})`);
      halo.addColorStop(1, `rgba(${glow},0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(hc.x, hc.y, R * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      ctx.save();
      ctx.translate(j.x, j.y);
      ctx.rotate(tilt);

      // tentacles: long, thin, trailing and curling
      const marginY = (u: number) => H * 0.14 * (1 - u * u);
      ctx.lineCap = "round";
      for (let i = 0; i < j.tentacles; i++) {
        const u = -0.9 + (1.8 * i) / (j.tentacles - 1);
        const bx = W * u;
        const by = marginY(u);
        const L = R * (3 + ((i * 7) % 3) * 0.55) * (1 - 0.14 * c);
        const steps = 16;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        for (let k = 1; k <= steps; k++) {
          const f = k / steps;
          const x = bx * (1 + f * 0.25) + Math.sin(t * 1.5 + f * 5 + i * 1.3 + j.seed) * R * 0.28 * Math.pow(f, 1.2) - j.vx * 0.05 * f * R * 0.1;
          const y = by + f * L;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${pale},${0.32 * a})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // oral arms: four ruffled ribbons hanging from the centre
      for (let i = 0; i < 4; i++) {
        const base = (i - 1.5) * W * 0.1;
        const L = R * (1.7 + (i % 2) * 0.35);
        const steps = 14;
        const left: [number, number][] = [];
        const right: [number, number][] = [];
        for (let k = 0; k <= steps; k++) {
          const f = k / steps;
          const cx = base + Math.sin(t * 2 + f * 4 + i * 1.7 + j.seed) * R * 0.14 * f;
          const cy = H * 0.08 + f * L;
          const hw = (R * 0.1 * (1 - f) + 1) * (1 + 0.45 * Math.sin(f * 14 + t * 3 + i));
          left.push([cx - hw, cy]);
          right.push([cx + hw, cy]);
        }
        ctx.beginPath();
        left.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        for (let k = right.length - 1; k >= 0; k--) ctx.lineTo(right[k][0], right[k][1]);
        ctx.closePath();
        ctx.fillStyle = `rgba(${body},${0.24 * a})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${glow},${0.3 * a})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // bell: a translucent dome with a concave margin
      ctx.beginPath();
      ctx.moveTo(-W, 0);
      ctx.bezierCurveTo(-W * 1.02, -H * 1.3, W * 1.02, -H * 1.3, W, 0);
      ctx.quadraticCurveTo(0, H * 0.28, -W, 0);
      ctx.closePath();
      const bell = ctx.createRadialGradient(0, -H * 0.5, R * 0.05, 0, -H * 0.2, W * 1.25);
      bell.addColorStop(0, `rgba(${pale},${0.55 * a})`);
      bell.addColorStop(0.45, `rgba(${body},${0.3 * a})`);
      bell.addColorStop(1, `rgba(${body},${0.12 * a})`);
      ctx.fillStyle = bell;
      ctx.fill();
      ctx.strokeStyle = `rgba(${pale},${0.6 * a})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // radial canals and the four gonad loops, lit from inside
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(${glow},${0.22 * a})`;
      ctx.lineWidth = 0.8;
      for (let k = 0; k < 8; k++) {
        const u = -0.85 + (1.7 * k) / 7;
        ctx.beginPath();
        ctx.moveTo(0, -H * 0.82);
        ctx.quadraticCurveTo(W * u * 0.7, -H * 0.7, W * u, marginY(u) - 1);
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(${glow},${(0.55 + j.flash * 0.4) * a})`;
      ctx.lineWidth = 1.6;
      for (let k = 0; k < 4; k++) {
        const ang = Math.PI / 4 + (k * Math.PI) / 2;
        ctx.beginPath();
        ctx.ellipse(Math.cos(ang) * W * 0.26, -H * 0.42 + Math.sin(ang) * H * 0.16, W * 0.13, H * 0.09, ang, 0, Math.PI * 2);
        ctx.stroke();
      }
      // specular sheen
      ctx.beginPath();
      ctx.ellipse(-W * 0.3, -H * 0.72, W * 0.3, H * 0.1, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.1 * a})`;
      ctx.fill();
      ctx.restore();

      // rim lights chasing around the margin
      for (let k = 0; k < 12; k++) {
        const u = -0.95 + (1.9 * k) / 11;
        const p = toWorld(W * u, H * 0.14 * (1 - u * u));
        const on = (0.5 + 0.5 * Math.sin(t * 4 - k * 0.65 + j.seed)) * (0.55 + j.flash) * a;
        ctx.fillStyle = `rgba(${glow},${Math.min(1, on * 0.35)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.4 * j.z + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${pale},${Math.min(1, on)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1 * j.z + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    let raf = 0, last = 0, t = 0;
    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      const dtRaw = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (w === 0) return;
      const o = optionsRef.current;
      const dt = dtRaw * o.speed;
      t += dt;

      if (jellies.length !== o.jellyfishCount || motes.length !== o.planktonCount) init();

      const body = hexToRgbString(o.jellyfishColor);
      const glow = hexToRgbString(o.glowColor);
      const water = hexToRgbString(o.waterColor);

      // water: a touch lighter toward the surface
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, `rgb(${mix(water, glow, 0.1)})`);
      bg.addColorStop(1, `rgb(${water})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // faint light shafts from above
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const x0 = w * (0.15 + i * 0.24) + Math.sin(t * 0.15 + i * 2) * w * 0.05;
        const shaft = ctx.createLinearGradient(0, 0, 0, h * 0.9);
        shaft.addColorStop(0, `rgba(${glow},0.055)`);
        shaft.addColorStop(1, `rgba(${glow},0)`);
        ctx.fillStyle = shaft;
        ctx.beginPath();
        ctx.moveTo(x0 - 14, 0);
        ctx.lineTo(x0 + 14, 0);
        ctx.lineTo(x0 + 120 + w * 0.05, h * 0.9);
        ctx.lineTo(x0 - 40 + w * 0.05, h * 0.9);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      const near = o.interactive && mouse.inside;

      // marine snow
      for (const m of motes) {
        m.y += (4 + m.z * 6) * dt;
        m.x += Math.sin(t * 0.4 + m.tw) * 3 * dt;
        if (m.y > h + 4) { m.y = -4; m.x = Math.random() * w; }
        if (near) {
          const d = Math.hypot(m.x - mouse.x, m.y - mouse.y);
          if (d < 90) m.flash = Math.max(m.flash, (1 - d / 90) * 0.9);
        }
        m.flash *= Math.exp(-dt * 1.6);
      }
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) if (m.z < 0.6) drawMote(m, glow, t);
      ctx.globalCompositeOperation = "source-over";

      // jellyfish: swim by pulsing, drift, wrap around from below
      for (const j of jellies) {
        j.phase += j.rate * dt;
        const c = Math.pow(Math.max(0, Math.sin(j.phase)), 1.4);
        const heading = Math.sin(t * 0.2 + j.seed) * 0.35;
        const thrust = 70 * c * (0.6 + j.z * 0.6);
        j.vx += Math.sin(heading) * thrust * dt;
        j.vy -= Math.cos(heading) * thrust * dt;
        if (near) {
          const dx = j.x - mouse.x, dy = j.y - mouse.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 150) {
            j.flash = Math.max(j.flash, 1 - d / 150);
            j.vx += (dx / d) * 40 * dt;
            j.vy += (dy / d) * 40 * dt;
          }
        }
        j.flash *= Math.exp(-dt * 1.4);
        const drag = Math.exp(-dt * 1.3);
        j.vx *= drag;
        j.vy = j.vy * drag + 3 * dt; // slight sink between pulses
        j.x += j.vx * dt;
        j.y += j.vy * dt;
        if (j.x < -j.R * 2) j.x = w + j.R * 2;
        if (j.x > w + j.R * 2) j.x = -j.R * 2;
        if (j.y < -j.R * 5) Object.assign(j, makeJelly(w, h));
      }
      [...jellies].sort((a, b) => a.z - b.z).forEach((j) => drawJelly(j, body, glow, t));

      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) if (m.z >= 0.6) drawMote(m, glow, t);

      // cursor sparks
      const pale = mix(glow, "255,255,255", 0.5);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dtRaw;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        s.x += s.vx * dtRaw;
        s.y += s.vy * dtRaw;
        s.vx *= 0.97; s.vy *= 0.97;
        const k = s.life / s.max;
        ctx.fillStyle = `rgba(${glow},${0.25 * k})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${pale},${k})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }
    raf = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
