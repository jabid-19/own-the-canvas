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
  autoPour: boolean;
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
  const toneRef = useRef<Uint8Array | null>(null); // per-grain colour: band (high bits) + speckle (low bits), fixed at creation
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
      toneRef.current = new Uint8Array(cols * rows);
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cellSize = Math.max(1, optionsRef.current.cellSize || 0); // 0 would mean infinite cells
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
            toneRef.current![idx] = ((band & 3) << 6) | ((Math.random() * 63) | 0);
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

    let band = 0;
    function simulate() {
      const grid = gridRef.current;
      const heat = heatRef.current;
      const tone = toneRef.current;
      if (!grid || !heat || !tone) return;
      // carry each grain's colour along when it moves (a swap keeps water/sand tones consistent)
      const move = (from: number, to: number) => { const tt = tone[to]; tone[to] = tone[from]; tone[from] = tt; };
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
              move(i, (y + 1) * cols + x);
            } else if (hasBelow && grid[(y + 1) * cols + x] === WATER) {
              grid[(y + 1) * cols + x] = SAND;
              grid[i] = WATER;
              move(i, (y + 1) * cols + x);
            } else {
              const goLeft = Math.random() < 0.5;
              const dx1 = goLeft ? -1 : 1;
              const dx2 = goLeft ? 1 : -1;
              const valid1 = goLeft ? hasLeft : hasRight;
              const valid2 = goLeft ? hasRight : hasLeft;
              if (hasBelow && valid1 && grid[(y + 1) * cols + (x + dx1)] === EMPTY) {
                grid[(y + 1) * cols + (x + dx1)] = SAND;
                grid[i] = EMPTY;
                move(i, (y + 1) * cols + (x + dx1));
              } else if (hasBelow && valid2 && grid[(y + 1) * cols + (x + dx2)] === EMPTY) {
                grid[(y + 1) * cols + (x + dx2)] = SAND;
                grid[i] = EMPTY;
                move(i, (y + 1) * cols + (x + dx2));
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

    // Auto-pour: three drifting streams lay down colour bands; when the pile gets high the
    // floor drains a little each frame so the scene keeps flowing instead of filling up.
    let frameNo = 0;
    let draining = false;
    function autoPour() {
      const grid = gridRef.current;
      const tone = toneRef.current;
      if (!grid || !tone) return;
      const cols = colsRef.current;
      const rows = rowsRef.current;
      frameNo++;
      if (frameNo % 240 === 0) band = (band + 1) & 3;
      for (let e = 0; e < 3; e++) {
        const cx = Math.round(cols * (0.2 + e * 0.3 + Math.sin(frameNo * 0.004 + e * 2.1) * 0.12));
        const eb = (band + e) & 3;
        for (let k = 0; k < 3; k++) {
          const x = cx + ((Math.random() * 4) | 0) - 1;
          if (x < 0 || x >= cols) continue;
          const i = x; // row 0
          if (grid[i] === EMPTY) { grid[i] = SAND; tone[i] = (eb << 6) | ((Math.random() * 63) | 0); }
        }
      }
      if (frameNo % 20 === 0) {
        // height of the settled pile: solid sand counted up from the floor (falling streams don't count)
        let top = rows;
        for (let x = 0; x < cols; x += 3) {
          let y = rows - 1;
          while (y >= 0 && grid[y * cols + x] !== EMPTY) y--;
          top = Math.min(top, y + 1);
        }
        if (top < rows * 0.38) draining = true;
        else if (top > rows * 0.62) draining = false;
      }
      if (draining) {
        const base = (rows - 1) * cols;
        for (let x = 0; x < cols; x++) if (grid[base + x] === SAND && Math.random() < 0.35) grid[base + x] = EMPTY;
      }
    }

    function render() {
      const grid = gridRef.current;
      const heat = heatRef.current;
      const tone = toneRef.current;
      if (!grid || !heat || !tone || !imageData || !offscreen || !offCtx) return;
      const cols = colsRef.current;
      const rows = rowsRef.current;
      const { sandColor, waterColor, fireColor, wallColor, backgroundColor } = optionsRef.current;

      const bg = parseHex(backgroundColor);
      const sand = parseHex(sandColor);
      const mixc = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k);
      // four bands of sand: the base, a pale cream, a deep ochre, and a rust
      const bands = [sand, mixc(sand, [246, 232, 196], 0.45), mixc(sand, [150, 96, 30], 0.4), mixc(sand, [176, 74, 38], 0.45)];
      const [wR, wG, wB] = parseHex(waterColor);
      const [fR, fG, fB] = parseHex(fireColor);
      const [wallR, wallG, wallB] = parseHex(wallColor);
      const data = imageData.data;
      const tt = frameNo * 0.06;

      for (let x = 0; x < cols; x++) {
        let depth = 0; // grains stacked above this one, for soft shading inside the pile
        for (let y = 0; y < rows; y++) {
          const i = y * cols + x;
          const p = i * 4;
          const cell = grid[i];
          const above = y > 0 ? grid[i - cols] : EMPTY;
          if (cell === EMPTY) { data[p + 3] = 0; depth = 0; continue; }
          data[p + 3] = 255;
          if (cell === SAND) {
            const c = bands[tone[i] >> 6];
            const speck = 0.88 + ((tone[i] & 63) / 63) * 0.22;
            const lit = above === EMPTY ? 1.16 : Math.max(0.72, 1 - depth * 0.006);
            const k = speck * lit;
            data[p] = Math.min(255, c[0] * k); data[p + 1] = Math.min(255, c[1] * k); data[p + 2] = Math.min(255, c[2] * k);
            depth++;
          } else if (cell === WATER) {
            const surf = above === EMPTY ? 0.35 : 0;
            const sh = 0.08 * Math.sin(tt + x * 0.35 + y * 0.2);
            data[p] = Math.min(255, wR * (0.85 + sh) + 255 * surf * 0.5);
            data[p + 1] = Math.min(255, wG * (0.85 + sh) + 255 * surf * 0.5);
            data[p + 2] = Math.min(255, wB * (0.9 + sh) + 255 * surf * 0.5);
            data[p + 3] = 225;
          } else if (cell === FIRE) {
            const t = Math.max(0, Math.min(1, heat[i]));
            data[p] = Math.min(255, fR * (0.6 + t * 0.6) + 80 * t);
            data[p + 1] = Math.min(255, fG * t + 120 * t * t);
            data[p + 2] = Math.min(255, fB * t * 0.4 + 60 * t * t * t);
          } else if (cell === WALL) {
            const ws = above === WALL ? 1 : 1.2;
            data[p] = Math.min(255, wallR * ws); data[p + 1] = Math.min(255, wallG * ws); data[p + 2] = Math.min(255, wallB * ws);
          }
        }
      }

      offCtx.putImageData(imageData, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgb(${mixc(bg, [255, 236, 200], 0.08).map(Math.round).join(",")})`);
      g.addColorStop(1, `rgb(${bg.join(",")})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, w, h);
    }

    let gravityAcc = 0;
    function loop() {
      if (optionsRef.current.autoPour) autoPour();
      // gravity = simulation steps per frame (fractional accumulates, capped)
      gravityAcc = Math.min(8, gravityAcc + Math.max(0, optionsRef.current.gravity));
      while (gravityAcc >= 1) { simulate(); gravityAcc -= 1; }
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
