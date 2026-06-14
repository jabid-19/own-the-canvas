import { useRef, useEffect, RefObject } from "react";

// ---------------------------------------------------------------------------
// Value noise + fBm
// ---------------------------------------------------------------------------

function smoothstep(t: number) { return t * t * (3 - 2 * t); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function hash(x: number, y: number): number {
  let h = (x * 1619 + y * 31337 + 1013904223) | 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) / 2147483648.0 * 0.5 + 0.5;
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const xt = smoothstep(xf), yt = smoothstep(yf);
  const v00 = hash(xi, yi),     v10 = hash(xi + 1, yi);
  const v01 = hash(xi, yi + 1), v11 = hash(xi + 1, yi + 1);
  return lerp(lerp(v00, v10, xt), lerp(v01, v11, xt), yt);
}

function fbm(x: number, y: number, octaves: number): number {
  let val = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    val += valueNoise(x * freq, y * freq) * amp;
    max += amp;
    amp  *= 0.5;
    freq *= 2;
  }
  return val / max;
}

// ---------------------------------------------------------------------------
// Marching squares lookup table
// Each entry: list of [edge1, edge2] pairs to draw a line segment between.
// Edges: 0=top, 1=right, 2=bottom, 3=left
// Index bits: v00*8 + v10*4 + v11*2 + v01*1  (1=above threshold)
// ---------------------------------------------------------------------------
const MS_EDGES: Array<Array<[number, number]>> = [
  [],               // 0000
  [[2, 3]],         // 0001
  [[1, 2]],         // 0010
  [[1, 3]],         // 0011
  [[0, 1]],         // 0100
  [[0, 1], [2, 3]], // 0101 (saddle)
  [[0, 2]],         // 0110
  [[0, 3]],         // 0111
  [[0, 3]],         // 1000
  [[0, 2]],         // 1001
  [[0, 3], [1, 2]], // 1010 (saddle)
  [[0, 1]],         // 1011
  [[1, 3]],         // 1100
  [[1, 2]],         // 1101
  [[2, 3]],         // 1110
  [],               // 1111
];

// For each edge (0=top,1=right,2=bottom,3=left), the two corner indices
// that form that edge in (col, row) fraction space.
// Corners: 0=TL, 1=TR, 2=BR, 3=BL
const EDGE_CORNERS: Array<[number, number]> = [
  [0, 1], // top:    TL -> TR
  [1, 2], // right:  TR -> BR
  [3, 2], // bottom: BL -> BR
  [0, 3], // left:   TL -> BL
];

// Corner positions in cell-local [0,1] space: [cx, cy]
const CORNER_POS: Array<[number, number]> = [
  [0, 0], // TL
  [1, 0], // TR
  [1, 1], // BR
  [0, 1], // BL
];

// Corner value indices matching the index bits: v00(TL), v10(TR), v11(BR), v01(BL)
const CORNER_VALUES = [0, 1, 3, 2]; // maps corner index -> grid value array index

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const full = c.length === 3
    ? c.split("").map(x => x + x).join("")
    : c;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbLerp(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function sampleColorRamp(colors: string[], t: number): string {
  if (colors.length === 0) return "#ffffff";
  if (colors.length === 1) return colors[0];
  const clampedT = Math.max(0, Math.min(1, t));
  const scaled = clampedT * (colors.length - 1);
  const lo = Math.floor(scaled);
  const hi = Math.min(lo + 1, colors.length - 1);
  const frac = scaled - lo;
  const rA = hexToRgb(colors[lo]);
  const rB = hexToRgb(colors[hi]);
  const [r, g, b] = rgbLerp(rA, rB, frac);
  return `rgb(${r},${g},${b})`;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseTopographicContoursOptions {
  resolution: number;
  contourLevels: number;
  speed: number;
  noiseScale: number;
  octaves: number;
  lineColor: string;
  lineWidth: number;
  lineOpacity: number;
  backgroundColor: string;
  filled: boolean;
  fillColors: string[];
  animated: boolean;
  glowEffect: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTopographicContours(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseTopographicContoursOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width  = Math.round(width  * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width  = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width;
      h = height;
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    // Mouse interaction
    canvas.style.cursor = "crosshair";

    function onMouseMove(e: MouseEvent) {
      const bounds = canvas!.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
    }
    function onMouseLeave() {
      mousePosRef.current = null;
    }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Time offset for animation
    let offsetX = 0;
    let offsetY = 0;

    let rafId = 0;
    let lastTime = 0;

    function draw(dt: number) {
      const {
        resolution,
        contourLevels,
        speed,
        noiseScale,
        octaves,
        lineColor,
        lineWidth,
        lineOpacity,
        backgroundColor,
        filled,
        fillColors,
        animated,
        glowEffect,
      } = optionsRef.current;

      if (w === 0 || h === 0) return;

      const cellSize = Math.max(2, resolution);
      const effectiveOctaves = cellSize < 4 ? Math.min(octaves, 3) : octaves;

      // Advance time offset
      if (animated) {
        const dtSec = dt / 1000;
        offsetX += dtSec * speed * 0.4;
        offsetY += dtSec * speed * 0.15;
      }

      // Columns and rows of grid cells
      const cols = Math.ceil(w / cellSize) + 1;
      const rows = Math.ceil(h / cellSize) + 1;

      // Build noise grid: grid[row][col]
      const grid: Float32Array[] = [];
      for (let r = 0; r < rows; r++) {
        const row = new Float32Array(cols);
        for (let c = 0; c < cols; c++) {
          const nx = (c / (cols - 1)) * noiseScale + offsetX;
          const ny = (r / (rows - 1)) * noiseScale + offsetY;
          let noiseVal = fbm(nx, ny, effectiveOctaves);
          if (mousePosRef.current) {
            const mouseX = mousePosRef.current.x;
            const mouseY = mousePosRef.current.y;
            const sampleX = c * cellSize;
            const sampleY = r * cellSize;
            const dx = sampleX - mouseX;
            const dy = sampleY - mouseY;
            const dist2 = dx * dx + dy * dy;
            const sigma = Math.min(w, h) * 0.18;
            const bumpStrength = 0.35;
            noiseVal = Math.min(1, noiseVal + bumpStrength * Math.exp(-dist2 / (2 * sigma * sigma)));
          }
          row[c] = noiseVal;
        }
        grid[r] = row;
      }

      // Clear background
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // ---- Filled elevation bands ----------------------------------------
      if (filled && fillColors.length > 0) {
        // For each cell, color by noise value
        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const x = c * cellSize;
            const y = r * cellSize;
            const val = (grid[r][c] + grid[r][c + 1] + grid[r + 1][c] + grid[r + 1][c + 1]) / 4;
            ctx.fillStyle = sampleColorRamp(fillColors, val);
            ctx.fillRect(x, y, cellSize + 1, cellSize + 1);
          }
        }
      }

      // ---- Contour lines via marching squares -----------------------------
      const levels = contourLevels;

      // Setup glow if needed
      if (glowEffect) {
        ctx.shadowColor = lineColor;
        ctx.shadowBlur  = 6;
      } else {
        ctx.shadowBlur = 0;
      }

      // Parse lineColor once to apply per-level opacity
      let lcR = 255, lcG = 255, lcB = 255;
      try {
        [lcR, lcG, lcB] = hexToRgb(lineColor);
      } catch {
        // fallback white
      }

      for (let li = 0; li < levels; li++) {
        const threshold = (li + 1) / (levels + 1);

        // Every 5th line is an index contour (thicker)
        const isIndex = (li + 1) % 5 === 0;
        const lw = isIndex ? lineWidth * 2.5 : lineWidth;

        // Vary opacity slightly by elevation — higher lines slightly more opaque
        const opacityMod = 0.7 + 0.3 * threshold;
        const alpha = lineOpacity * opacityMod;

        ctx.strokeStyle = `rgba(${lcR},${lcG},${lcB},${alpha})`;
        ctx.lineWidth   = lw;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";

        ctx.beginPath();

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const v00 = grid[r][c];
            const v10 = grid[r][c + 1];
            const v11 = grid[r + 1][c + 1];
            const v01 = grid[r + 1][c];
            const T   = threshold;

            // Grid corner values in order: TL, TR, BR, BL
            const vals = [v00, v10, v11, v01];

            const above = [
              v00 > T ? 1 : 0,
              v10 > T ? 1 : 0,
              v11 > T ? 1 : 0,
              v01 > T ? 1 : 0,
            ] as const;

            // Index: v00*8 + v10*4 + v11*2 + v01*1
            const idx = above[0] * 8 + above[1] * 4 + above[2] * 2 + above[3];

            const segments = MS_EDGES[idx];
            if (segments.length === 0) continue;

            const cellX = c * cellSize;
            const cellY = r * cellSize;

            for (const [edgeA, edgeB] of segments) {
              const ptA = edgePoint(edgeA, vals, CORNER_VALUES, T, cellX, cellY, cellSize);
              const ptB = edgePoint(edgeB, vals, CORNER_VALUES, T, cellX, cellY, cellSize);

              ctx.moveTo(ptA[0], ptA[1]);
              ctx.lineTo(ptB[0], ptB[1]);
            }
          }
        }

        ctx.stroke();
      }

      // Reset shadow
      ctx.shadowBlur = 0;
    }

    function loop(ts: number) {
      const dt = lastTime ? ts - lastTime : 16;
      lastTime = ts;
      draw(dt);
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}

// ---------------------------------------------------------------------------
// Edge interpolation helper
// ---------------------------------------------------------------------------

function edgePoint(
  edge: number,
  vals: number[],
  cornerValues: number[],
  T: number,
  cellX: number,
  cellY: number,
  cellSize: number
): [number, number] {
  const [cA, cB] = EDGE_CORNERS[edge];
  const vA = vals[cornerValues[cA]];
  const vB = vals[cornerValues[cB]];
  const [pAx, pAy] = CORNER_POS[cA];
  const [pBx, pBy] = CORNER_POS[cB];

  // Interpolate along edge to find threshold crossing
  const denom = vB - vA;
  const t = Math.abs(denom) < 1e-10 ? 0.5 : (T - vA) / denom;
  const tc = Math.max(0, Math.min(1, t));

  const lx = pAx + (pBx - pAx) * tc;
  const ly = pAy + (pBy - pAy) * tc;

  return [cellX + lx * cellSize, cellY + ly * cellSize];
}
