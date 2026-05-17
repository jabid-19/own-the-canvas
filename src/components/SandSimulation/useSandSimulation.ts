import { useRef, useEffect, RefObject } from "react";

export type SandMaterial = "sand" | "water" | "fire" | "wall" | "erase";

export interface UseSandSimulationOptions {
  cellSize: number;
  brushSize: number;
  material: SandMaterial;
  sandColor: string;
  waterColor: string;
  fireColor: string;
  wallColor: string;
  backgroundColor: string;
  interactive: boolean;
  gravity: number;
}

const EMPTY = 0;
const SAND = 1;
const WATER = 2;
const FIRE = 3;
const WALL = 4;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const n = parseInt(full, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function useSandSimulation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseSandSimulationOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const rafRef = useRef<number>(0);
  const gridRef = useRef<Uint8Array | null>(null);
  const heatRef = useRef<Float32Array | null>(null);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;
    let offscreen: OffscreenCanvas | null = null;
    let offCtx: OffscreenCanvasRenderingContext2D | null = null;
    let imageData: ImageData | null = null;

    function initGrid(cols: number, rows: number) {
      colsRef.current = cols;
      rowsRef.current = rows;
      gridRef.current = new Uint8Array(cols * rows);
      heatRef.current = new Float32Array(cols * rows);
      offscreen = new OffscreenCanvas(cols, rows);
      offCtx = offscreen.getContext("2d") as OffscreenCanvasRenderingContext2D;
      imageData = offCtx.createImageData(cols, rows);
    }

    function resize(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      w = width;
      h = height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      const { cellSize } = optionsRef.current;
      const cols = Math.max(4, Math.floor(w / cellSize));
      const rows = Math.max(4, Math.floor(h / cellSize));
      initGrid(cols, rows);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let isMouseDown = false;

    function getGridPos(clientX: number, clientY: number): [number, number] {
      const r = canvas!.getBoundingClientRect();
      const px = clientX - r.left;
      const py = clientY - r.top;
      const cols = colsRef.current;
      const rows = rowsRef.current;
      return [
        Math.floor((px / w) * cols),
        Math.floor((py / h) * rows),
      ];
    }

    function paint(gx: number, gy: number) {
      const grid = gridRef.current;
      const heat = heatRef.current;
      if (!grid || !heat) return;
      const cols = colsRef.current;
      const rows = rowsRef.current;
      const { brushSize, material } = optionsRef.current;

      for (let dy = -brushSize; dy <= brushSize; dy++) {
        for (let dx = -brushSize; dx <= brushSize; dx++) {
          if (dx * dx + dy * dy > brushSize * brushSize) continue;
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
          const idx = ny * cols + nx;
          if (material === "erase") {
            grid[idx] = EMPTY;
            heat[idx] = 0;
          } else if (material === "sand") {
            grid[idx] = SAND;
          } else if (material === "water") {
            grid[idx] = WATER;
          } else if (material === "fire") {
            grid[idx] = FIRE;
            heat[idx] = 1;
          } else if (material === "wall") {
            grid[idx] = WALL;
          }
        }
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      isMouseDown = true;
      paint(...getGridPos(e.clientX, e.clientY));
    }

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive || !isMouseDown) return;
      paint(...getGridPos(e.clientX, e.clientY));
    }

    function onMouseUp() { isMouseDown = false; }
    function onMouseLeave() { isMouseDown = false; }

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function simulate() {
      const grid = gridRef.current;
      const heat = heatRef.current;
      if (!grid || !heat) return;
      const cols = colsRef.current;
      const rows = rowsRef.current;

      for (let y = rows - 1; y >= 0; y--) {
        // randomize column scan direction each row to avoid directional bias
        const leftToRight = Math.random() < 0.5;
        for (let xi = 0; xi < cols; xi++) {
          const x = leftToRight ? xi : cols - 1 - xi;
          const i = y * cols + x;
          const cell = grid[i];
          if (cell === EMPTY || cell === WALL) continue;

          const hasBelow = y + 1 < rows;
          const hasAbove = y - 1 >= 0;
          const hasLeft = x - 1 >= 0;
          const hasRight = x + 1 < cols;

          if (cell === SAND) {
            if (hasBelow && grid[(y + 1) * cols + x] === EMPTY) {
              grid[(y + 1) * cols + x] = SAND;
              grid[i] = EMPTY;
            } else if (hasBelow && grid[(y + 1) * cols + x] === WATER) {
              grid[(y + 1) * cols + x] = SAND;
              grid[i] = WATER;
            } else {
              const goLeft = Math.random() < 0.5;
              const dx1 = goLeft ? -1 : 1;
              const dx2 = goLeft ? 1 : -1;
              const valid1 = goLeft ? hasLeft : hasRight;
              const valid2 = goLeft ? hasRight : hasLeft;
              if (hasBelow && valid1 && grid[(y + 1) * cols + (x + dx1)] === EMPTY) {
                grid[(y + 1) * cols + (x + dx1)] = SAND;
                grid[i] = EMPTY;
              } else if (hasBelow && valid2 && grid[(y + 1) * cols + (x + dx2)] === EMPTY) {
                grid[(y + 1) * cols + (x + dx2)] = SAND;
                grid[i] = EMPTY;
              }
            }
          } else if (cell === WATER) {
            if (hasBelow && grid[(y + 1) * cols + x] === EMPTY) {
              grid[(y + 1) * cols + x] = WATER;
              grid[i] = EMPTY;
            } else {
              const goLeft = Math.random() < 0.5;
              const dx1 = goLeft ? -1 : 1;
              const dx2 = goLeft ? 1 : -1;
              const valid1 = goLeft ? hasLeft : hasRight;
              const valid2 = goLeft ? hasRight : hasLeft;
              if (valid1 && grid[y * cols + (x + dx1)] === EMPTY) {
                grid[y * cols + (x + dx1)] = WATER;
                grid[i] = EMPTY;
              } else if (valid2 && grid[y * cols + (x + dx2)] === EMPTY) {
                grid[y * cols + (x + dx2)] = WATER;
                grid[i] = EMPTY;
              }
            }
          } else if (cell === FIRE) {
            heat[i] -= 0.005 + Math.random() * 0.01;
            if (heat[i] <= 0) {
              grid[i] = EMPTY;
              heat[i] = 0;
              continue;
            }

            if (hasAbove && grid[(y - 1) * cols + x] === EMPTY && Math.random() < 0.4) {
              grid[(y - 1) * cols + x] = FIRE;
              heat[(y - 1) * cols + x] = heat[i] * (0.7 + Math.random() * 0.3);
            }

            if (hasAbove && grid[(y - 1) * cols + x] === SAND && Math.random() < 0.02) {
              grid[(y - 1) * cols + x] = FIRE;
              heat[(y - 1) * cols + x] = 1;
            }

            const fdx = Math.random() < 0.5 ? -1 : 1;
            const fValid = fdx === -1 ? hasLeft : hasRight;
            if (hasAbove && fValid && grid[(y - 1) * cols + (x + fdx)] === EMPTY && Math.random() < 0.15) {
              grid[(y - 1) * cols + (x + fdx)] = FIRE;
              heat[(y - 1) * cols + (x + fdx)] = heat[i] * 0.6;
            }

            if (hasBelow && grid[(y + 1) * cols + x] === WATER) {
              grid[i] = EMPTY;
              grid[(y + 1) * cols + x] = EMPTY;
              heat[i] = 0;
            }
          }
        }
      }
    }

    function render() {
      const grid = gridRef.current;
      const heat = heatRef.current;
      if (!grid || !heat || !imageData || !offscreen || !offCtx) return;
      const cols = colsRef.current;
      const rows = rowsRef.current;
      const { sandColor, waterColor, fireColor, wallColor, backgroundColor } = optionsRef.current;

      const [bgR, bgG, bgB] = parseHex(backgroundColor);
      const [sR, sG, sB] = parseHex(sandColor);
      const [wR, wG, wB] = parseHex(waterColor);
      const [fR, fG, fB] = parseHex(fireColor);
      const [wallR, wallG, wallB] = parseHex(wallColor);

      const data = imageData.data;
      for (let i = 0; i < cols * rows; i++) {
        const p = i * 4;
        const cell = grid[i];
        data[p + 3] = 255;
        if (cell === EMPTY) {
          data[p] = bgR; data[p + 1] = bgG; data[p + 2] = bgB;
        } else if (cell === SAND) {
          const n = ((Math.random() * 20) | 0) - 10;
          data[p] = Math.max(0, Math.min(255, sR + n));
          data[p + 1] = Math.max(0, Math.min(255, sG + n));
          data[p + 2] = Math.max(0, Math.min(255, sB + n));
        } else if (cell === WATER) {
          const a = 0.6 + Math.random() * 0.3;
          data[p] = Math.round(bgR * (1 - a) + wR * a);
          data[p + 1] = Math.round(bgG * (1 - a) + wG * a);
          data[p + 2] = Math.round(bgB * (1 - a) + wB * a);
        } else if (cell === FIRE) {
          const t = Math.max(0, Math.min(1, heat[i]));
          data[p] = Math.min(255, Math.round(fR * t + 60 * t));
          data[p + 1] = Math.round(fG * t * 0.4);
          data[p + 2] = Math.round(fB * t * 0.1);
        } else if (cell === WALL) {
          data[p] = wallR; data[p + 1] = wallG; data[p + 2] = wallB;
        }
      }

      offCtx.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, w, h);
    }

    function loop() {
      simulate();
      render();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef, options.cellSize]);
}
