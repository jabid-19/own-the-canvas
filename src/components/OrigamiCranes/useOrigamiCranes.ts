import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { anchorTo, followAnchor, type Anchor, type Solid } from "../../runtime/physics";
import { usePointer, readPointer } from "../../runtime/fx";
import { sampleGradient } from "../../utils/color";

export interface UseOrigamiCranesOptions {
  count: number;
  colors: string[];
  backgroundColor: string;
  size: number;
  speed: number;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

type V3 = [number, number, number];

interface Crane {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  flap: number;
  flapSpeed: number;
  bank: number;
  color: number;
  tx: number; ty: number; tz: number;
  perch: { solidId: number; offsetX: number } | null;
  rest: Anchor | null;
  restLeft: number;
}

/**
 * Crane model in local space: +x forward, +y up, +z right. Each face is a
 * flat paper facet; wings fold along a crease and hinge on the back.
 * `flap` in radians: 0 = wings level, + = up.
 */
export function craneFaces(flap: number): V3[][] {
  const tipY = 2 + Math.sin(flap) * 15;
  const tipZ = Math.cos(flap) * 15;
  const crease = (side: number): V3 => [0.5, 2 + Math.sin(flap) * 5, side * Math.cos(flap) * 5];
  const faces: V3[][] = [
    // Body: tall diamond, two halves for the center fold
    [[-7, 1, 0], [7, 1, 0], [0, -5, 0.8]],
    [[-7, 1, 0], [7, 1, 0], [0, -5, -0.8]],
    // Neck, head, tail
    [[4, -1, 0.3], [7, 1, 0], [16, 11, 0]],
    [[15, 10, 0], [16.5, 11.5, 0.3], [20.5, 8, 0]],
    [[-4, -1, 0.3], [-7, 1, 0], [-17, 10, 0]],
  ];
  for (const side of [1, -1]) {
    const tip: V3 = [-1.5, tipY, side * tipZ];
    const c = crease(side);
    faces.push([[5, 2, 0], c, tip]);
    faces.push([c, [-5, 2, 0], tip]);
  }
  return faces;
}

const LIGHT: V3 = (() => {
  const l: V3 = [-0.35, 0.8, -0.5];
  const n = Math.hypot(...l);
  return [l[0] / n, l[1] / n, l[2] / n];
})();

/** Two-sided Lambert for paper: ambient + |n·L|. */
export function shadeFace(a: V3, b: V3, c: V3): number {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  const len = Math.hypot(nx, ny, nz) || 1;
  nx /= len; ny /= len; nz /= len;
  return 0.42 + 0.58 * Math.abs(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
}

const FOCAL = 700;
/** Shows the flock slightly from above: wings face the viewer instead of edge-on. */
const VIEW_TILT = 0.6;

export function useOrigamiCranes(options: UseOrigamiCranesOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const cranesRef = useRef<Crane[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function pickTarget(c: Crane) {
    const { w, h } = sizeRef.current;
    c.tx = w * (0.1 + Math.random() * 0.8);
    c.ty = h * (0.12 + Math.random() * 0.6);
    c.tz = -150 + Math.random() * 400;
  }

  function makeCrane(i: number): Crane {
    const { w, h } = sizeRef.current;
    const c: Crane = {
      x: Math.random() * w, y: h * (0.15 + Math.random() * 0.6), z: -100 + Math.random() * 300,
      vx: (Math.random() < 0.5 ? -1 : 1) * 1.5, vy: 0, vz: 0,
      flap: Math.random() * Math.PI * 2,
      flapSpeed: 0.09 + Math.random() * 0.05,
      bank: 0,
      color: i,
      tx: 0, ty: 0, tz: 0,
      perch: null, rest: null, restLeft: 0,
    };
    pickTarget(c);
    return c;
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    timeRef.current += dt * 0.001;
    const t = timeRef.current;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    const target = o.count > 0 ? Math.max(1, Math.ceil(o.count * frame.quality)) : 0;
    const cranes = cranesRef.current;
    while (cranes.length < target) cranes.push(makeCrane(cranes.length));
    if (cranes.length > target) cranes.length = target;

    const p = readPointer(pointer.current, canvasEl.current);
    const solids: readonly Solid[] = frame.solids;
    const byId = new Map(solids.map((s) => [s.id, s]));
    const cx = w / 2, cy = h / 2;

    for (const c of cranes) {
      if (c.rest) {
        c.restLeft -= dt;
        if (c.restLeft <= 0 || !followAnchor(c, c.rest, byId)) {
          c.rest = null;
          c.vy = -2;
          c.vx = (Math.random() < 0.5 ? -1 : 1) * 1.2;
          pickTarget(c);
        }
        c.flap = 1.25; // wings folded up while perched
        continue;
      }

      // Goal: perch target > cursor orbit > wander point
      let gx = c.tx, gy = c.ty, gz = c.tz;
      if (c.perch) {
        const s = byId.get(c.perch.solidId);
        if (!s) c.perch = null;
        else {
          gx = s.x + c.perch.offsetX; gy = s.y - 6; gz = 0;
          if (Math.hypot(gx - c.x, gy - c.y, c.z) < 6) {
            c.x = gx; c.y = gy; c.z = 0; c.vx = c.vy = c.vz = 0;
            c.rest = anchorTo(c, s, -6);
            c.restLeft = 3000 + Math.random() * 4000;
            c.perch = null;
            continue;
          }
        }
      } else if (o.interactive && p.inside) {
        const a = t * 0.6 + c.color * 1.7;
        gx = p.x + Math.cos(a) * 110; gy = p.y + Math.sin(a) * 50; gz = Math.sin(a * 0.7) * 120;
      } else if (Math.hypot(c.tx - c.x, c.ty - c.y) < 60) {
        pickTarget(c);
      }
      if (!c.perch && solids.length && Math.random() < 0.0012 * k) {
        const s = solids[(Math.random() * solids.length) | 0];
        if (s.w > 30 && s.y > 20 && s.y < h) c.perch = { solidId: s.id, offsetX: 12 + Math.random() * (s.w - 24) };
      }

      // Steering: seek goal, keep apart, cruise speed
      let ax = (gx - c.x) * 0.0009, ay = (gy - c.y) * 0.0009, az = (gz - c.z) * 0.0006;
      for (const q of cranes) {
        if (q === c || q.rest) continue;
        const dx = c.x - q.x, dy = c.y - q.y, dz = c.z - q.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 2500 && d2 > 0) { ax += dx / d2 * 0.6; ay += dy / d2 * 0.6; az += dz / d2 * 0.6; }
      }
      const prevHeading = Math.atan2(c.vz, c.vx);
      c.vx += ax * k; c.vy += ay * k; c.vz += az * k;
      const sp = Math.hypot(c.vx, c.vy, c.vz) || 1;
      const cruise = (c.perch ? 1.4 : 1.9) * o.speed;
      const ns = sp + (cruise - sp) * 0.05;
      c.vx = (c.vx / sp) * ns; c.vy = (c.vy / sp) * ns; c.vz = (c.vz / sp) * ns;
      c.x += c.vx * k; c.y += c.vy * k; c.z += c.vz * k;
      c.z = Math.max(-300, Math.min(500, c.z));
      const turn = Math.atan2(Math.sin(Math.atan2(c.vz, c.vx) - prevHeading), Math.cos(Math.atan2(c.vz, c.vx) - prevHeading));
      c.bank += (Math.max(-0.7, Math.min(0.7, turn * 12)) - c.bank) * 0.08 * k;
      // Glide when descending, beat harder when climbing
      c.flap += c.flapSpeed * o.speed * (c.vy > 0.6 ? 0.35 : 1 + Math.max(0, -c.vy) * 0.3) * k * 2;
    }

    // Project every face, painter's sort across all cranes (far first)
    const polys: { pts: number[]; z: number; fill: string }[] = [];
    const scale = o.size * 1.15;
    for (const c of cranes) {
      // Basis: forward from velocity (perched cranes face sideways), up = screen up, banked
      let fx = c.vx, fy = c.vy, fz = c.vz;
      if (c.rest) { fx = 1; fy = 0; fz = 0.3; }
      const fl = Math.hypot(fx, fy, fz) || 1;
      fx /= fl; fy /= fl; fz /= fl;
      // right = forward × worldUp (worldUp = (0,-1,0) in screen coords)
      let rx = fz, ry = 0, rz = -fx;
      const rl = Math.hypot(rx, rz) || 1;
      rx /= rl; rz /= rl;
      // up = right × forward
      let ux = ry * fz - rz * fy, uy = rz * fx - rx * fz, uz = rx * fy - ry * fx;
      const roll = c.bank + VIEW_TILT;
      const cb = Math.cos(roll), sb = Math.sin(roll);
      const rx2 = rx * cb + ux * sb, ry2 = ry * cb + uy * sb, rz2 = rz * cb + uz * sb;
      ux = ux * cb - rx * sb; uy = uy * cb - ry * sb; uz = uz * cb - rz * sb;
      rx = rx2; ry = ry2; rz = rz2;

      const flap = c.rest ? 1.25 : Math.sin(c.flap) * 0.75;
      const base = sampleGradient([o.colors[c.color % o.colors.length] ?? "#ffffff"], 0);
      for (const face of craneFaces(flap)) {
        const pts: number[] = [];
        let zs = 0;
        const world: V3[] = [];
        for (const [lx, ly, lz] of face) {
          const X = c.x + (fx * lx + ux * ly + rx * lz) * scale;
          const Y = c.y + (fy * lx + uy * ly + ry * lz) * scale;
          const Z = c.z + (fz * lx + uz * ly + rz * lz) * scale;
          world.push([X, -Y, Z]);
          const s = FOCAL / (FOCAL + Z);
          pts.push(cx + (X - cx) * s, cy + (Y - cy) * s);
          zs += Z;
        }
        const sh = shadeFace(world[0], world[1], world[2]);
        const depthFade = Math.max(0.55, Math.min(1, 1 - c.z / 1400));
        polys.push({
          pts,
          z: zs / 3,
          fill: `rgb(${(base[0] * sh * depthFade) | 0},${(base[1] * sh * depthFade) | 0},${(base[2] * sh * depthFade) | 0})`,
        });
      }
    }
    polys.sort((a, b) => b.z - a.z);
    ctx.lineJoin = "round";
    ctx.lineWidth = 0.5;
    for (const poly of polys) {
      ctx.beginPath();
      ctx.moveTo(poly.pts[0], poly.pts[1]);
      ctx.lineTo(poly.pts[2], poly.pts[3]);
      ctx.lineTo(poly.pts[4], poly.pts[5]);
      ctx.closePath();
      ctx.fillStyle = poly.fill;
      ctx.strokeStyle = poly.fill;
      ctx.fill();
      ctx.stroke(); // seals hairline gaps between facets
    }
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: (w, h) => {
      sizeRef.current = { w, h };
      cranesRef.current = Array.from({ length: optionsRef.current.count }, (_, i) => makeCrane(i));
    },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
