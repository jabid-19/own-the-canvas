import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

export type CrystalGrowthColorMode = "solid" | "age" | "cycle";

export interface UseCrystalGrowthOptions {
  crystalColor: string;
  activeColor: string;
  backgroundColor: string;
  growthSpeed: number;
  symmetry: number;
  branchProbability: number;
  noiseAmount: number;
  cellSize: number;
  glowEffect: boolean;
  glowBlur: number;
  interactive: boolean;
  autoReset: boolean;
  colorMode: CrystalGrowthColorMode;
  animated: boolean;
}

const EMPTY = 0;
const FRONTIER = 1;
const CRYSTAL = 2;

interface State {
  grid: Uint8Array;
  age: Uint32Array;
  frontier: Set<number>;
  frontierArr: number[];      // cached array view, rebuilt when Set changes
  frontierDirty: boolean;
  maxAge: number;
  gridW: number;
  gridH: number;
}

function makeState(gw: number, gh: number): State {
  return {
    grid: new Uint8Array(gw * gh),
    age: new Uint32Array(gw * gh),
    frontier: new Set(),
    frontierArr: [],
    frontierDirty: false,
    maxAge: 1,
    gridW: gw,
    gridH: gh,
  };
}

function addNeighbors(s: State, idx: number) {
  const { grid, frontier, gridW, gridH } = s;
  const gx = idx % gridW;
  const gy = (idx / gridW) | 0;
  if (gx > 0       && grid[idx - 1]     === EMPTY) { grid[idx - 1]     = FRONTIER; frontier.add(idx - 1);     s.frontierDirty = true; }
  if (gx < gridW-1 && grid[idx + 1]     === EMPTY) { grid[idx + 1]     = FRONTIER; frontier.add(idx + 1);     s.frontierDirty = true; }
  if (gy > 0       && grid[idx - gridW] === EMPTY) { grid[idx - gridW] = FRONTIER; frontier.add(idx - gridW); s.frontierDirty = true; }
  if (gy < gridH-1 && grid[idx + gridW] === EMPTY) { grid[idx + gridW] = FRONTIER; frontier.add(idx + gridW); s.frontierDirty = true; }
}

function crystallizeWithSymmetry(s: State, gx: number, gy: number, symmetry: number, ageVal: number) {
  const cx = s.gridW / 2;
  const cy = s.gridH / 2;
  const step = (Math.PI * 2) / symmetry;
  const dx = gx - cx;
  const dy = gy - cy;

  for (let k = 0; k < symmetry; k++) {
    const angle = k * step;
    const rx = Math.round(cx + dx * Math.cos(angle) - dy * Math.sin(angle));
    const ry = Math.round(cy + dx * Math.sin(angle) + dy * Math.cos(angle));
    if (rx < 0 || rx >= s.gridW || ry < 0 || ry >= s.gridH) continue;
    const idx = ry * s.gridW + rx;
    if (s.grid[idx] === CRYSTAL) continue;
    s.grid[idx] = CRYSTAL;
    s.age[idx] = ageVal;
    if (ageVal > s.maxAge) s.maxAge = ageVal;
    s.frontier.delete(idx);
    s.frontierDirty = true;
    addNeighbors(s, idx);
  }
}

function seedCenter(s: State, symmetry: number) {
  crystallizeWithSymmetry(s, (s.gridW / 2) | 0, (s.gridH / 2) | 0, symmetry, 0);
}

export function useCrystalGrowth(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseCrystalGrowthOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let cssW = 0;
    let cssH = 0;
    let rafId = 0;
    let ageCounter = 0;

    let state: State | null = null;
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d")!;
    let imgData: ImageData | null = null;

    function initState(w: number, h: number) {
      const { cellSize, symmetry } = optionsRef.current;
      // Cap grid size to avoid huge ImageData allocations
      const maxCells = 300;
      const gw = Math.max(1, Math.min(maxCells, Math.floor(w / cellSize)));
      const gh = Math.max(1, Math.min(maxCells, Math.floor(h / cellSize)));
      state = makeState(gw, gh);
      offscreen.width = gw;
      offscreen.height = gh;
      imgData = offCtx.createImageData(gw, gh);
      ageCounter = 0;
      seedCenter(state, symmetry);
    }

    function resize(w: number, h: number) {
      const dpr = window.devicePixelRatio || 1;
      cssW = w;
      cssH = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      initState(w, h);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive || !state) return;
      const r = canvas!.getBoundingClientRect();
      const { cellSize, symmetry } = optionsRef.current;
      const gx = Math.floor((e.clientX - r.left) / cellSize);
      const gy = Math.floor((e.clientY - r.top) / cellSize);
      crystallizeWithSymmetry(state, gx, gy, symmetry, ++ageCounter);
    }
    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive || !state) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      const { cellSize, symmetry } = optionsRef.current;
      const gx = Math.floor((e.touches[0].clientX - r.left) / cellSize);
      const gy = Math.floor((e.touches[0].clientY - r.top) / cellSize);
      crystallizeWithSymmetry(state, gx, gy, symmetry, ++ageCounter);
    }

    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });

    function loop() {
      if (!state || !imgData) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const { crystalColor, activeColor, backgroundColor, growthSpeed, symmetry, branchProbability, noiseAmount, colorMode, glowEffect, glowBlur, animated, autoReset } = optionsRef.current;
      const { grid, age, frontier, gridW, gridH } = state;

      if (animated && frontier.size > 0) {
        // Rebuild cached array only when Set changed
        if (state.frontierDirty) {
          state.frontierArr = Array.from(frontier);
          state.frontierDirty = false;
        }

        const arr = state.frontierArr;
        // Cap growth to avoid per-frame stalls
        const count = Math.min(Math.round(growthSpeed), 50, arr.length);

        for (let i = 0; i < count; i++) {
          if (arr.length === 0) break;
          // Pick random index from cached array
          const fi = (Math.random() * arr.length) | 0;
          const idx = arr[fi];

          // Skip stale entries (already crystallized by symmetry)
          if (grid[idx] !== FRONTIER) {
            frontier.delete(idx);
            arr.splice(fi, 1);
            i--;
            continue;
          }

          let gx = idx % gridW;
          let gy = (idx / gridW) | 0;

          // Noise: jump to a nearby empty cell
          if (noiseAmount > 0 && Math.random() < noiseAmount) {
            const nx = Math.max(0, Math.min(gridW - 1, gx + Math.round((Math.random() * 2 - 1) * 2)));
            const ny = Math.max(0, Math.min(gridH - 1, gy + Math.round((Math.random() * 2 - 1) * 2)));
            if (grid[ny * gridW + nx] !== CRYSTAL) { gx = nx; gy = ny; }
          }

          ageCounter++;
          crystallizeWithSymmetry(state!, gx, gy, symmetry, ageCounter);

          // Remove the processed cell from cached array
          arr.splice(fi, 1);

          // Branch: add a random nearby empty cell to frontier
          if (Math.random() < branchProbability) {
            const dirs = [[-2, 0], [2, 0], [0, -2], [0, 2]];
            const [ddx, ddy] = dirs[(Math.random() * 4) | 0];
            const bx = Math.max(0, Math.min(gridW - 1, gx + ddx));
            const by = Math.max(0, Math.min(gridH - 1, gy + ddy));
            const bidx = by * gridW + bx;
            if (grid[bidx] === EMPTY) {
              grid[bidx] = FRONTIER;
              frontier.add(bidx);
              arr.push(bidx);
            }
          }
        }

        if (autoReset && frontier.size === 0) {
          initState(cssW, cssH);
          rafId = requestAnimationFrame(loop);
          return;
        }
      }

      // Pre-parse colors once per frame
      const [bgR, bgG, bgB] = sampleGradient([backgroundColor], 0);
      const [crR, crG, crB] = sampleGradient([crystalColor], 0);
      const [acR, acG, acB] = sampleGradient([activeColor], 0);

      // Render
      const data = imgData.data;
      const total = gridW * gridH;
      const maxAge = state.maxAge || 1;

      for (let i = 0; i < total; i++) {
        const cell = grid[i];
        let r: number, g: number, b: number;

        if (cell === CRYSTAL) {
          if (colorMode === "age") {
            const t = age[i] / maxAge;
            [r, g, b] = sampleGradient([crystalColor, activeColor, backgroundColor], t);
          } else if (colorMode === "cycle") {
            const t = age[i] / maxAge;
            r = (128 + 127 * Math.cos(t * Math.PI * 2)) | 0;
            g = (128 + 127 * Math.cos(t * Math.PI * 2 + 2.094)) | 0;
            b = (128 + 127 * Math.cos(t * Math.PI * 2 + 4.189)) | 0;
          } else {
            r = crR; g = crG; b = crB;
          }
        } else if (cell === FRONTIER) {
          r = acR; g = acG; b = acB;
        } else {
          r = bgR; g = bgG; b = bgB;
        }

        const i4 = i * 4;
        data[i4]     = r;
        data[i4 + 1] = g;
        data[i4 + 2] = b;
        data[i4 + 3] = 255;
      }

      offCtx.putImageData(imgData, 0, 0);

      ctx.save();
      if (glowEffect) {
        ctx.shadowBlur = glowBlur;
        ctx.shadowColor = crystalColor;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, cssW, cssH);
      ctx.restore();

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("touchstart", onTouchStart);
    };
  }, [canvasRef]);
}
