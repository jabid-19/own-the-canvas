import { useRef, type RefObject, type MutableRefObject } from "react";
import { useCanvasSetup } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";

export interface GameOfLifeHandle {
  randomize: () => void;
  clear: () => void;
  pause: () => void;
  resume: () => void;
  /** The underlying <canvas> (every other component's ref is the canvas itself). */
  canvas: HTMLCanvasElement | null;
}

export interface UseGameOfLifeOptions {
  cellSize: number;
  speed: number;
  initialDensity: number;
  aliveColor: string;
  oldColor: string;
  deadColor: string;
  showAge: boolean;
  wrapEdges: boolean;
  interactive: boolean;
  backgroundColor: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** One Conway generation. Cells hold their age (0 = dead, 1 = newborn, capped at 255). */
export function stepLife(grid: Uint8Array, next: Uint8Array, cols: number, rows: number, wrap: boolean): number {
  let alive = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        let rr = r + dr;
        if (wrap) rr = (rr + rows) % rows; else if (rr < 0 || rr >= rows) continue;
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          let cc = c + dc;
          if (wrap) cc = (cc + cols) % cols; else if (cc < 0 || cc >= cols) continue;
          if (grid[rr * cols + cc]) n++;
        }
      }
      const i = r * cols + c, a = grid[i];
      const v = a ? (n === 2 || n === 3 ? Math.min(255, a + 1) : 0) : n === 3 ? 1 : 0;
      next[i] = v;
      if (v) alive++;
    }
  }
  return alive;
}

const GLIDER = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];

/**
 * Conway's Game of Life as living light. Cells are soft glowing dots that swell in when born,
 * cool from the newborn color to the old color as they age, and leave embers that fade when
 * they die; generations cross-fade instead of snapping, under a bloom made from the board
 * itself. Click toggles a cell, dragging paints life. When the board settles into still lifes
 * and blinkers, a few gliders drift in to stir it up again.
 */
export function useGameOfLife(options: UseGameOfLifeOptions, handleRef: RefObject<GameOfLifeHandle | null>) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const s = useRef({
    cols: 0, rows: 0, key: "", grid: new Uint8Array(0), next: new Uint8Array(0), prev: new Uint8Array(0),
    heat: new Float32Array(0), acc: 0, paused: false, history: [] as number[], lastPaint: -1,
  });
  const glow = useRef<{ c: HTMLCanvasElement; g: CanvasRenderingContext2D; img: ImageData } | null>(null);

  function init(cols: number, rows: number, randomize: boolean) {
    const st = s.current;
    st.cols = cols; st.rows = rows;
    st.grid = new Uint8Array(cols * rows);
    st.next = new Uint8Array(cols * rows);
    st.prev = new Uint8Array(cols * rows);
    st.heat = new Float32Array(cols * rows);
    st.history = [];
    if (randomize) for (let i = 0; i < st.grid.length; i++) st.grid[i] = Math.random() < optionsRef.current.initialDensity ? 1 : 0;
  }

  function stir() {
    const st = s.current;
    for (let k = 0; k < 3; k++) {
      const c0 = Math.floor(Math.random() * Math.max(1, st.cols - 3)), r0 = Math.floor(Math.random() * Math.max(1, st.rows - 3));
      const fx = Math.random() < 0.5, fy = Math.random() < 0.5;
      for (const [x, y] of GLIDER) {
        const c = c0 + (fx ? 2 - x : x), r = r0 + (fy ? 2 - y : y);
        if (c < st.cols && r < st.rows) st.grid[r * st.cols + c] = 1;
      }
    }
  }

  (handleRef as MutableRefObject<GameOfLifeHandle | null>).current = {
    randomize: () => init(s.current.cols, s.current.rows, true),
    clear: () => init(s.current.cols, s.current.rows, false),
    pause: () => { s.current.paused = true; },
    resume: () => { s.current.paused = false; },
    get canvas() { return canvasEl.current; },
  };

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const cs = clamp(o.cellSize, 2, 64);
    const cols = Math.max(1, Math.floor(w / cs)), rows = Math.max(1, Math.floor(h / cs));
    const key = `${cols}x${rows}|${o.initialDensity}`;
    if (st.key !== key) { st.key = key; init(cols, rows, true); }

    // ---- input: tap toggles, drag paints ----
    const p = readPointer(pointer.current, canvasEl.current);
    if (o.interactive) {
      const cellAt = (x: number, y: number) => {
        const c = Math.floor(x / cs), r = Math.floor(y / cs);
        return c >= 0 && r >= 0 && c < cols && r < rows ? r * cols + c : -1;
      };
      for (const tap of p.taps) { const i = cellAt(tap.x, tap.y); if (i >= 0) { st.grid[i] = st.grid[i] ? 0 : 1; st.lastPaint = i; } }
      if (p.down && p.inside) {
        const i = cellAt(p.x, p.y);
        if (i >= 0 && i !== st.lastPaint) { st.grid[i] = 1; st.lastPaint = i; }
      } else st.lastPaint = -1;
    }

    // ---- simulate at `speed` generations per second ----
    if (!st.paused && o.speed > 0) {
      st.acc += sec * o.speed;
      let steps = 0;
      while (st.acc >= 1 && steps < 4) {
        st.acc -= 1; steps++;
        st.prev.set(st.grid);
        const alive = stepLife(st.grid, st.next, cols, rows, o.wrapEdges);
        for (let i = 0; i < st.grid.length; i++) if (st.prev[i] && !st.next[i]) st.heat[i] = 1;
        [st.grid, st.next] = [st.next, st.grid];
        st.history.push(alive);
        if (st.history.length > 24) st.history.shift();
        // settled: population barely moving for a while (still lifes, blinkers) or nearly empty
        if (st.history.length === 24) {
          const lo = Math.min(...st.history), hi = Math.max(...st.history);
          if (hi - lo <= Math.max(3, hi * 0.02) || alive < cols * rows * 0.01) { stir(); st.history = []; }
        }
      }
      if (st.acc > 1) st.acc = 0;
    }
    const fade = st.paused ? 1 : clamp(st.acc * 1.6, 0, 1); // cross-fade into the new generation
    for (let i = 0; i < st.heat.length; i++) if (st.heat[i] > 0) st.heat[i] = Math.max(0, st.heat[i] - sec * 1.1);

    const young = rgbOf(o.aliveColor), old = rgbOf(o.oldColor), dead = rgbOf(o.deadColor, "0,0,0");
    const bg = rgbOf(o.backgroundColor, "0,0,0");
    const colorOf = (age: number) => (o.showAge ? mix(young, old, clamp((age - 1) / 24, 0, 1)) : young);

    // ---- background, with a faint dead-cell lattice ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = `rgb(${bg})`;
    ctx.fillRect(0, 0, w, h);
    const ox = (w - cols * cs) / 2, oy = (h - rows * cs) / 2;
    if (cs >= 5) {
      ctx.fillStyle = `rgba(${mix(dead, "255,255,255", 0.08)},0.6)`;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (!st.grid[r * cols + c]) ctx.fillRect(ox + c * cs + cs / 2 - 0.5, oy + r * cs + cs / 2 - 0.5, 1, 1);
    }

    // ---- bloom: the board at one pixel per cell, scaled up soft ----
    if (typeof document !== "undefined") {
      let gl = glow.current;
      if (!gl || gl.c.width !== cols || gl.c.height !== rows) {
        const c = document.createElement("canvas");
        c.width = cols; c.height = rows;
        const g = c.getContext("2d");
        gl = g ? { c, g, img: g.createImageData(cols, rows) } : null;
        glow.current = gl;
      }
      if (gl) {
        const d = gl.img.data;
        const yr = young.split(",").map(Number), olr = old.split(",").map(Number);
        for (let i = 0; i < st.grid.length; i++) {
          const a = st.grid[i];
          const j = i * 4;
          if (a) {
            const k2 = o.showAge ? clamp((a - 1) / 24, 0, 1) : 0;
            d[j] = yr[0] + (olr[0] - yr[0]) * k2; d[j + 1] = yr[1] + (olr[1] - yr[1]) * k2; d[j + 2] = yr[2] + (olr[2] - yr[2]) * k2;
            d[j + 3] = (a === 1 ? fade : 1) * 200;
          } else if (st.heat[i] > 0) {
            d[j] = olr[0]; d[j + 1] = olr[1]; d[j + 2] = olr[2]; d[j + 3] = st.heat[i] * 110;
          } else d[j + 3] = 0;
        }
        gl.g.putImageData(gl.img, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.55;
        ctx.drawImage(gl.c, ox - cs * 1.5, oy - cs * 1.5, cols * cs + cs * 3, rows * cs + cs * 3);
        ctx.globalAlpha = 0.9;
        ctx.drawImage(gl.c, ox, oy, cols * cs, rows * cs);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // ---- crisp cells: dots that swell in at birth, embers shrinking out after death ----
    const R = cs * 0.38;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c, a = st.grid[i];
        const x = ox + c * cs + cs / 2, y = oy + r * cs + cs / 2;
        if (a) {
          const grow = a === 1 ? 0.35 + 0.65 * fade : 1;
          ctx.fillStyle = `rgb(${colorOf(a)})`;
          if (cs < 5) ctx.fillRect(x - cs / 2, y - cs / 2, cs, cs);
          else { ctx.beginPath(); ctx.arc(x, y, R * grow, 0, Math.PI * 2); ctx.fill(); }
          if (a === 1 && cs >= 5) { // a hot white core on the newborn
            ctx.fillStyle = `rgba(255,255,255,${0.55 * (1 - fade * 0.6)})`;
            ctx.beginPath(); ctx.arc(x, y, R * 0.45 * grow, 0, Math.PI * 2); ctx.fill();
          }
        } else if (st.heat[i] > 0.02 && cs >= 5) {
          ctx.fillStyle = `rgba(${old},${st.heat[i] * 0.7})`;
          ctx.beginPath(); ctx.arc(x, y, R * st.heat[i] * 0.8, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
  }

  const setup = useCanvasSetup({ onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
