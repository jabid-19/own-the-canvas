import { useRef, useEffect, RefObject, MutableRefObject } from "react";
import { sampleGradient } from "../../utils/color";

export interface GameOfLifeHandle {
  randomize: () => void;
  clear: () => void;
  pause: () => void;
  resume: () => void;
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

export function useGameOfLife(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseGameOfLifeOptions,
  handleRef: RefObject<GameOfLifeHandle | null>
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const gridRef = useRef<Uint16Array>(new Uint16Array(0));
  const nextRef = useRef<Uint16Array>(new Uint16Array(0));
  const colsRef = useRef(0);
  const rowsRef = useRef(0);
  const pausedRef = useRef(false);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function initGrid(randomize = true) {
      const { cellSize, initialDensity } = optionsRef.current;
      const cols = Math.floor(w / cellSize);
      const rows = Math.floor(h / cellSize);
      colsRef.current = cols;
      rowsRef.current = rows;
      gridRef.current = new Uint16Array(cols * rows);
      nextRef.current = new Uint16Array(cols * rows);
      if (randomize) {
        for (let i = 0; i < gridRef.current.length; i++) {
          gridRef.current[i] = Math.random() < initialDensity ? 1 : 0;
        }
      }
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
      initGrid(true);
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    // Expose imperative handle
    if (handleRef) {
      (handleRef as MutableRefObject<GameOfLifeHandle>).current = {
        randomize: () => initGrid(true),
        clear: () => {
          gridRef.current.fill(0);
        },
        pause: () => { pausedRef.current = true; },
        resume: () => { pausedRef.current = false; },
      };
    }

    function stepGrid() {
      const cols = colsRef.current;
      const rows = rowsRef.current;
      const grid = gridRef.current;
      const next = nextRef.current;
      const { wrapEdges } = optionsRef.current;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let neighbors = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              let nr = r + dr;
              let nc = c + dc;
              if (wrapEdges) {
                nr = (nr + rows) % rows;
                nc = (nc + cols) % cols;
              } else {
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
              }
              if (grid[nr * cols + nc] > 0) neighbors++;
            }
          }
          const idx = r * cols + c;
          const alive = grid[idx] > 0;
          if (alive && (neighbors === 2 || neighbors === 3)) {
            next[idx] = Math.min(grid[idx] + 1, 255);
          } else if (!alive && neighbors === 3) {
            next[idx] = 1;
          } else {
            next[idx] = 0;
          }
        }
      }
      gridRef.current = next.slice();
    }

    function draw(ts: number) {
      const { cellSize, speed, aliveColor, oldColor, deadColor, showAge, backgroundColor } = optionsRef.current;

      if (!pausedRef.current) {
        const interval = 1000 / speed;
        if (ts - lastUpdateRef.current >= interval) {
          stepGrid();
          lastUpdateRef.current = ts;
        }
      }

      // Clear
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      const cols = colsRef.current;
      const rows = rowsRef.current;
      const grid = gridRef.current;
      const maxAge = 60;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const age = grid[r * cols + c];
          if (age === 0) continue;
          const t = showAge ? Math.min(age / maxAge, 1) : 0;
          const [ri, gi, bi] = sampleGradient([aliveColor, oldColor], t);
          ctx.fillStyle = `rgb(${ri},${gi},${bi})`;
          ctx.fillRect(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    function onClick(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const cvs = canvasRef.current!;
      const r = cvs.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const { cellSize } = optionsRef.current;
      const col = Math.floor(mx / cellSize);
      const row = Math.floor(my / cellSize);
      const cols = colsRef.current;
      const rows = rowsRef.current;
      if (col < 0 || col >= cols || row < 0 || row >= rows) return;
      const idx = row * cols + col;
      gridRef.current[idx] = gridRef.current[idx] > 0 ? 0 : 1;
    }

    canvas.addEventListener("click", onClick);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef, handleRef]);
}
