import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import type { Solid } from "../../runtime/physics";
import { usePointer, readPointer } from "../../runtime/fx";
import { hexToRgba, sampleGradient } from "../../utils/color";

export interface UseFrostGlassOptions {
  color: string;
  fogColor: string;
  backgroundColor: string;
  coverage: number;
  growthSpeed: number;
  branching: number;
  breathRadius: number;
  fog: number;
  interactive: boolean;
  overlay: boolean;
  collide: boolean;
}

export interface Tip {
  x: number;
  y: number;
  angle: number;
  /** Remaining length in px. */
  left: number;
  width: number;
  gen: number;
}

export interface FrostGrid {
  cols: number;
  rows: number;
  cell: number;
  /** 1 = frosted. */
  cells: Uint8Array;
}

const SEG = 2.4;
const HEX = Math.PI / 3;

export function makeGrid(w: number, h: number, cell = 3): FrostGrid {
  const cols = Math.max(1, Math.ceil(w / cell));
  const rows = Math.max(1, Math.ceil(h / cell));
  return { cols, rows, cell, cells: new Uint8Array(cols * rows) };
}

/**
 * Advance one crystal tip by a segment. Ice branches at 60°: side branches
 * split off at ±60° (with slight jitter) and get shorter each generation.
 * A tip dies when it leaves the glass, runs out of length, or would cross
 * existing frost (crystals never overlap). Returns the segment drawn, or null.
 */
export function stepTip(
  tip: Tip,
  grid: FrostGrid,
  branching: number,
  spawn: (t: Tip) => void,
): [number, number, number, number] | null {
  if (tip.left <= 0) return null;
  tip.angle += (Math.random() - 0.5) * 0.09; // slow random walk: stems curl
  const a = tip.angle + (Math.random() - 0.5) * 0.18;
  const nx = tip.x + Math.cos(a) * SEG;
  const ny = tip.y + Math.sin(a) * SEG;
  const cx = Math.floor(nx / grid.cell);
  const cy = Math.floor(ny / grid.cell);
  if (cx < 0 || cy < 0 || cx >= grid.cols || cy >= grid.rows) { tip.left = 0; return null; }
  const idx = cy * grid.cols + cx;
  const own = Math.floor(tip.x / grid.cell) === cx && Math.floor(tip.y / grid.cell) === cy;
  if (grid.cells[idx] && !own) { tip.left = 0; return null; }
  grid.cells[idx] = 1;
  const seg: [number, number, number, number] = [tip.x, tip.y, nx, ny];
  tip.x = nx;
  tip.y = ny;
  tip.left -= SEG;
  if (tip.gen < 4 && Math.random() < branching) {
    const side = Math.random() < 0.5 ? -1 : 1;
    spawn({
      x: nx, y: ny,
      angle: tip.angle + side * (HEX + (Math.random() - 0.5) * 0.25),
      left: tip.left * (0.2 + Math.random() * 0.3),
      width: tip.width * 0.72,
      gen: tip.gen + 1,
    });
  }
  return seg;
}

export function useFrostGlass(options: UseFrostGlassOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const stateRef = useRef<{
    grid: FrostGrid;
    tips: Tip[];
    frost: HTMLCanvasElement | null;
    fctx: CanvasRenderingContext2D | null;
    fog: Float32Array;
    fogW: number;
    fogH: number;
    fogImg: ImageData | null;
    fogCanvas: HTMLCanvasElement | null;
    frosted: number;
    acc: number;
    seededSolids: Set<number>;
  } | null>(null);
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function init(w: number, h: number) {
    const dpr = canvasEl.current && w > 0 ? canvasEl.current.width / w : 1;
    const frost = typeof document !== "undefined" ? document.createElement("canvas") : null;
    let fctx: CanvasRenderingContext2D | null = null;
    if (frost) {
      frost.width = Math.round(w * dpr);
      frost.height = Math.round(h * dpr);
      fctx = frost.getContext("2d");
      fctx?.setTransform?.(dpr, 0, 0, dpr, 0, 0);
    }
    const fogW = Math.max(1, Math.ceil(w / 10));
    const fogH = Math.max(1, Math.ceil(h / 10));
    const fogCanvas = frost ? document.createElement("canvas") : null;
    if (fogCanvas) { fogCanvas.width = fogW; fogCanvas.height = fogH; }
    const fogImg = fogCanvas?.getContext("2d")?.createImageData?.(fogW, fogH) ?? null;
    stateRef.current = {
      grid: makeGrid(w, h),
      tips: [],
      frost, fctx,
      fog: new Float32Array(fogW * fogH).fill(1),
      fogW, fogH, fogImg, fogCanvas,
      frosted: 0,
      acc: 0,
      seededSolids: new Set(),
    };
  }

  function edgeSeed(w: number, h: number): Tip {
    const side = (Math.random() * 4) | 0;
    const u = Math.random();
    const x = side === 0 ? u * w : side === 1 ? w - 1 : side === 2 ? u * w : 1;
    const y = side === 0 ? 1 : side === 1 ? u * h : side === 2 ? h - 1 : u * h;
    const inward = side === 0 ? Math.PI / 2 : side === 1 ? Math.PI : side === 2 ? -Math.PI / 2 : 0;
    return { x, y, angle: inward + (Math.random() - 0.5) * 1.1, left: 40 + Math.random() * Math.min(w, h) * 0.3, width: 1.1 + Math.random() * 0.5, gen: 0 };
  }

  function solidSeeds(s: Solid, n: number): Tip[] {
    return Array.from({ length: n }, () => {
      const P = 2 * (s.w + s.h);
      let u = Math.random() * P;
      let x: number, y: number, a: number;
      if (u < s.w) { x = s.x + u; y = s.y - 1; a = -Math.PI / 2; }
      else if ((u -= s.w) < s.h) { x = s.x + s.w + 1; y = s.y + u; a = 0; }
      else if ((u -= s.h) < s.w) { x = s.x + s.w - u; y = s.y + s.h + 1; a = Math.PI / 2; }
      else { u -= s.w; x = s.x - 1; y = s.y + s.h - u; a = Math.PI; }
      return { x, y, angle: a + (Math.random() - 0.5) * 1.2, left: 40 + Math.random() * 90, width: 1.2 + Math.random() * 0.6, gen: 0 };
    });
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = dt / 16.67;
    if (!stateRef.current) init(w, h);
    const st = stateRef.current!;
    const g = st.grid;
    const total = g.cols * g.rows;

    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Seeds: page elements nucleate first (collide), then the window edges,
    // then the frost front creeps back into melted patches.
    const maxTips = Math.ceil(90 * frame.quality);
    for (const s of frame.solids) {
      if (st.seededSolids.has(s.id) || s.w < 10) continue;
      st.seededSolids.add(s.id);
      st.tips.push(...solidSeeds(s, Math.ceil((s.w + s.h) / 40)));
    }
    const covered = st.frosted / total;
    if (covered < o.coverage && st.tips.length < maxTips && Math.random() < 0.25 * k) st.tips.push(edgeSeed(w, h));
    if (covered < o.coverage && st.tips.length < maxTips) {
      for (let tries = 0; tries < 6; tries++) {
        const i = (Math.random() * total) | 0;
        if (!g.cells[i]) continue;
        const cx = i % g.cols, cy = (i / g.cols) | 0;
        const a = Math.random() * Math.PI * 2;
        const tx = Math.floor(cx + Math.cos(a) * 2), ty = Math.floor(cy + Math.sin(a) * 2);
        if (tx < 0 || ty < 0 || tx >= g.cols || ty >= g.rows || g.cells[ty * g.cols + tx]) continue;
        st.tips.push({ x: (cx + 0.5) * g.cell, y: (cy + 0.5) * g.cell, angle: a, left: 15 + Math.random() * 45, width: 0.9, gen: 1 });
        break;
      }
    }

    // Grow: a fixed number of segments per second, drawn once into the frost layer
    st.acc += dt * 0.001 * 30 * o.growthSpeed;
    const steps = Math.min(4, Math.floor(st.acc));
    st.acc -= steps;
    const fc = st.fctx;
    if (fc) {
      fc.lineCap = "round";
      fc.strokeStyle = o.color;
    }
    for (let s = 0; s < steps; s++) {
      const born: Tip[] = [];
      for (const tip of st.tips) {
        const seg = stepTip(tip, g, o.branching, (t) => born.push(t));
        if (!seg) continue;
        st.frosted++;
        if (fc) {
          fc.globalAlpha = (0.35 + 0.5 * Math.min(1, tip.width)) * (1 - tip.gen * 0.12);
          fc.lineWidth = tip.width;
          fc.beginPath();
          fc.moveTo(seg[0], seg[1]);
          fc.lineTo(seg[2], seg[3]);
          // Feathery needles at ±60°: the fern texture of window frost (cosmetic, not in the grid)
          if (Math.random() < 0.6) {
            const a = Math.atan2(seg[3] - seg[1], seg[2] - seg[0]);
            const len = (2 + Math.random() * 5) * (1 - tip.gen * 0.15);
            for (const side of [-1, 1]) {
              if (Math.random() < 0.3) continue;
              const na = a + side * Math.PI / 3;
              fc.moveTo(seg[2], seg[3]);
              fc.lineTo(seg[2] + Math.cos(na) * len, seg[3] + Math.sin(na) * len);
            }
          }
          fc.stroke();
        }
      }
      st.tips = st.tips.filter((t) => t.left > 0).concat(born);
      if (st.tips.length > maxTips * 3) st.tips.length = maxTips * 3;
    }

    // Breath: melt frost and clear fog around the cursor
    const p = readPointer(pointer.current, canvasEl.current);
    if (o.interactive && p.inside) {
      const R = o.breathRadius;
      const c0x = Math.floor((p.x - R) / g.cell), c1x = Math.floor((p.x + R) / g.cell);
      const c0y = Math.floor((p.y - R) / g.cell), c1y = Math.floor((p.y + R) / g.cell);
      for (let cy = Math.max(0, c0y); cy <= Math.min(g.rows - 1, c1y); cy++) {
        for (let cx = Math.max(0, c0x); cx <= Math.min(g.cols - 1, c1x); cx++) {
          const dx = (cx + 0.5) * g.cell - p.x, dy = (cy + 0.5) * g.cell - p.y;
          if (dx * dx + dy * dy > R * R) continue;
          const i = cy * g.cols + cx;
          if (g.cells[i]) { g.cells[i] = 0; st.frosted--; }
        }
      }
      st.tips = st.tips.filter((t) => Math.hypot(t.x - p.x, t.y - p.y) > R);
      if (fc) {
        fc.save();
        fc.globalCompositeOperation = "destination-out";
        fc.globalAlpha = 1;
        const grad = fc.createRadialGradient(p.x, p.y, R * 0.55, p.x, p.y, R);
        grad.addColorStop(0, "rgba(0,0,0,1)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        fc.fillStyle = grad;
        fc.beginPath();
        fc.arc(p.x, p.y, R, 0, Math.PI * 2);
        fc.fill();
        fc.restore();
      }
      const fr = R * 1.25 / 10;
      const fx = p.x / 10, fy = p.y / 10;
      for (let y = Math.max(0, Math.floor(fy - fr)); y <= Math.min(st.fogH - 1, Math.ceil(fy + fr)); y++) {
        for (let x = Math.max(0, Math.floor(fx - fr)); x <= Math.min(st.fogW - 1, Math.ceil(fx + fr)); x++) {
          const d = Math.hypot(x - fx, y - fy) / fr;
          if (d < 1) st.fog[y * st.fogW + x] = Math.min(st.fog[y * st.fogW + x], d * d);
        }
      }
    }

    // Fog: relaxes back toward full haze; drawn from a tiny buffer, upscaled soft
    if (o.fog > 0 && st.fogImg && st.fogCanvas) {
      const back = 1 - Math.pow(0.996, k);
      const [r, gg, b] = sampleGradient([o.fogColor], 0);
      const data = st.fogImg.data;
      for (let i = 0; i < st.fog.length; i++) {
        st.fog[i] += (1 - st.fog[i]) * back;
        const j = i * 4;
        data[j] = r; data[j + 1] = gg; data[j + 2] = b;
        data[j + 3] = st.fog[i] * o.fog * 255;
      }
      st.fogCanvas.getContext("2d")?.putImageData(st.fogImg, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(st.fogCanvas, 0, 0, w, h);
    } else if (o.fog > 0) {
      ctx.fillStyle = hexToRgba(o.fogColor, o.fog);
      ctx.fillRect(0, 0, w, h);
    }

    if (st.frost) ctx.drawImage(st.frost, 0, 0, w, h);
  }

  const setup = useCanvasSetup({
    overlay: options.overlay,
    collide: options.collide,
    onResize: () => { stateRef.current = null; },
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}
