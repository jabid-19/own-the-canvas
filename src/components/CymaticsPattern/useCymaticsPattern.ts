import { useRef, useEffect, RefObject } from "react";

export interface UseCymaticsPatternOptions {
  particleCount: number;
  particleColor: string;
  backgroundColor: string;
  particleSize: number;
  forceStrength: number;
  friction: number;
  jitterAmount: number;
  modeDuration: number;
  speed: number;
  glowEffect: boolean;
  glowBlur: number;
  showPlate: boolean;
  plateColor: string;
  animated: boolean;
}

// Interesting Chladni mode pairs (m, n) that produce beautiful figures
const MODE_PAIRS: [number, number][] = [
  [1, 2], [2, 3], [1, 3], [3, 4], [2, 5],
  [1, 4], [3, 5], [4, 5], [2, 4], [1, 5],
  [3, 6], [2, 6], [4, 6], [5, 6], [1, 6],
];

function chladniValue(x: number, y: number, m: number, n: number): number {
  const px = Math.PI * x;
  const py = Math.PI * y;
  return Math.cos(m * px) * Math.cos(n * py) + Math.cos(n * px) * Math.cos(m * py);
}

const GRID_SIZE = 128;

function buildNodalGrid(m: number, n: number): Float32Array {
  const grid = new Float32Array(GRID_SIZE * GRID_SIZE);
  const inv = 1 / (GRID_SIZE - 1);
  for (let iy = 0; iy < GRID_SIZE; iy++) {
    for (let ix = 0; ix < GRID_SIZE; ix++) {
      const x = ix * inv;
      const y = iy * inv;
      grid[iy * GRID_SIZE + ix] = chladniValue(x, y, m, n);
    }
  }
  return grid;
}

function sampleGrid(grid: Float32Array, nx: number, ny: number): number {
  // nx, ny in [0,1] → bilinear sample
  const gx = nx * (GRID_SIZE - 1);
  const gy = ny * (GRID_SIZE - 1);
  const ix = Math.floor(gx);
  const iy = Math.floor(gy);
  const fx = gx - ix;
  const fy = gy - iy;

  const x0 = Math.min(ix, GRID_SIZE - 2);
  const y0 = Math.min(iy, GRID_SIZE - 2);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const v00 = grid[y0 * GRID_SIZE + x0];
  const v10 = grid[y0 * GRID_SIZE + x1];
  const v01 = grid[y1 * GRID_SIZE + x0];
  const v11 = grid[y1 * GRID_SIZE + x1];

  return v00 * (1 - fx) * (1 - fy)
       + v10 * fx * (1 - fy)
       + v01 * (1 - fx) * fy
       + v11 * fx * fy;
}

function getGradient(grid: Float32Array, nx: number, ny: number): [number, number] {
  const eps = 1 / (GRID_SIZE - 1);
  const nxL = Math.max(0, nx - eps);
  const nxR = Math.min(1, nx + eps);
  const nyD = Math.max(0, ny - eps);
  const nyU = Math.min(1, ny + eps);

  const fxL = Math.abs(sampleGrid(grid, nxL, ny));
  const fxR = Math.abs(sampleGrid(grid, nxR, ny));
  const fyD = Math.abs(sampleGrid(grid, nx, nyD));
  const fyU = Math.abs(sampleGrid(grid, nx, nyU));

  const gx = (fxR - fxL) / (nxR - nxL);
  const gy = (fyU - fyD) / (nyU - nyD);
  return [gx, gy];
}

export function useCymaticsPattern(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseCymaticsPatternOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0;
    let h = 0;

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
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

    // ── Mode state ────────────────────────────────────────────────────────────
    let modeIdx = 0;
    let nextModeIdx = 1;
    let [mOld, nOld] = MODE_PAIRS[modeIdx];
    let [mNew, nNew] = MODE_PAIRS[nextModeIdx];
    let modeT = 0; // 0→1 crossfade progress
    let modeAccumMs = 0;

    // Blended grids — we interpolate between two for smooth morphing
    let gridOld = buildNodalGrid(mOld, nOld);
    let gridNew = buildNodalGrid(mNew, nNew);

    function blendedSample(nx: number, ny: number): number {
      const a = sampleGrid(gridOld, nx, ny);
      const b = sampleGrid(gridNew, nx, ny);
      return a * (1 - modeT) + b * modeT;
    }

    function blendedGradient(nx: number, ny: number): [number, number] {
      const eps = 1 / (GRID_SIZE - 1);
      const nxL = Math.max(0, nx - eps);
      const nxR = Math.min(1, nx + eps);
      const nyD = Math.max(0, ny - eps);
      const nyU = Math.min(1, ny + eps);

      const fA = (nxi: number, nyi: number) => Math.abs(blendedSample(nxi, nyi));
      const gx = (fA(nxR, ny) - fA(nxL, ny)) / (nxR - nxL);
      const gy = (fA(nx, nyU) - fA(nx, nyD)) / (nyU - nyD);
      return [gx, gy];
    }

    // ── Particles ─────────────────────────────────────────────────────────────
    const MAX_PARTICLES = 3000;
    const px = new Float32Array(MAX_PARTICLES);
    const py = new Float32Array(MAX_PARTICLES);
    const vx = new Float32Array(MAX_PARTICLES);
    const vy = new Float32Array(MAX_PARTICLES);

    function scatterParticles(count: number) {
      for (let i = 0; i < count; i++) {
        px[i] = Math.random();
        py[i] = Math.random();
        vx[i] = (Math.random() - 0.5) * 0.002;
        vy[i] = (Math.random() - 0.5) * 0.002;
      }
    }

    scatterParticles(MAX_PARTICLES);

    // ── Animation ─────────────────────────────────────────────────────────────
    let rafId = 0;
    let lastTime = 0;

    function loop(ts: number) {
      const rawDt = lastTime ? ts - lastTime : 16;
      lastTime = ts;

      const opts = optionsRef.current;
      if (!opts.animated) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min(rawDt, 50) * opts.speed;
      const dtSec = dt / 1000;

      // ── Mode crossfade ──────────────────────────────────────────────────────
      modeAccumMs += dt;
      const { modeDuration } = opts;

      if (modeAccumMs >= modeDuration) {
        // Snap: old ← new, start fresh crossfade
        modeIdx = nextModeIdx;
        nextModeIdx = (nextModeIdx + 1) % MODE_PAIRS.length;
        [mOld, nOld] = MODE_PAIRS[modeIdx];
        [mNew, nNew] = MODE_PAIRS[nextModeIdx];
        gridOld = gridNew;
        gridNew = buildNodalGrid(mNew, nNew);
        modeT = 0;
        modeAccumMs = 0;
        // Violent scatter on mode transition — plate struck, all sand flies up
        const count0 = Math.min(optionsRef.current.particleCount, MAX_PARTICLES);
        for (let i = 0; i < count0; i++) {
          vx[i] = (Math.random() - 0.5) * 0.04;
          vy[i] = (Math.random() - 0.5) * 0.04;
        }
      } else {
        // Ease-in-out crossfade over first 15% of modeDuration (faster blend)
        const crossfadeDur = modeDuration * 0.15;
        modeT = Math.min(1, modeAccumMs / crossfadeDur);
        // Smooth step
        modeT = modeT * modeT * (3 - 2 * modeT);
      }

      // ── Physics ─────────────────────────────────────────────────────────────
      const { particleCount, forceStrength, friction, jitterAmount } = opts;
      const count = Math.min(particleCount, MAX_PARTICLES);
      const nodalThreshold = 0.04;
      const settledThreshold = 0.025;

      for (let i = 0; i < count; i++) {
        const nx = px[i];
        const ny = py[i];

        // Sample blended field
        const fval = Math.abs(blendedSample(nx, ny));
        const [gx, gy] = blendedGradient(nx, ny);

        if (fval < settledThreshold) {
          // Completely settled — gentle brownian jitter only
          vx[i] += (Math.random() - 0.5) * jitterAmount * 0.0004;
          vy[i] += (Math.random() - 0.5) * jitterAmount * 0.0004;
          vx[i] *= 0.7;
          vy[i] *= 0.7;
        } else if (fval < nodalThreshold) {
          // Near nodal line — light jitter + mild restoring
          vx[i] -= gx * forceStrength * 0.003 * dtSec * 60;
          vy[i] -= gy * forceStrength * 0.003 * dtSec * 60;
          vx[i] += (Math.random() - 0.5) * jitterAmount * 0.0006;
          vy[i] += (Math.random() - 0.5) * jitterAmount * 0.0006;
          vx[i] *= friction;
          vy[i] *= friction;
        } else {
          // Antinode — strong restoring force toward nodal line
          const mag = Math.sqrt(gx * gx + gy * gy) + 1e-9;
          const nx2 = gx / mag;
          const ny2 = gy / mag;
          // Scale force with distance from nodal line (boosted multiplier for faster convergence)
          let strength = forceStrength * fval * 0.028 * dtSec * 60;
          // Turbo kick for particles far from nodal lines — extra push to converge in 1-2 s
          if (fval > 0.4) {
            strength *= 2;
          }
          vx[i] -= nx2 * strength;
          vy[i] -= ny2 * strength;
          vx[i] *= friction;
          vy[i] *= friction;
        }

        // Integrate
        px[i] += vx[i];
        py[i] += vy[i];

        // Bounce off plate walls
        if (px[i] < 0) { px[i] = 0; vx[i] = Math.abs(vx[i]) * 0.3; }
        if (px[i] > 1) { px[i] = 1; vx[i] = -Math.abs(vx[i]) * 0.3; }
        if (py[i] < 0) { py[i] = 0; vy[i] = Math.abs(vy[i]) * 0.3; }
        if (py[i] > 1) { py[i] = 1; vy[i] = -Math.abs(vy[i]) * 0.3; }
      }

      // ── Draw ─────────────────────────────────────────────────────────────────
      const {
        backgroundColor, particleColor, particleSize,
        glowEffect, glowBlur, showPlate, plateColor,
      } = opts;

      // Background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // Plate bounds (square centered in canvas)
      const plateSize = 0.85 * Math.min(w, h);
      const plateX = (w - plateSize) / 2;
      const plateY = (h - plateSize) / 2;

      // Draw plate border
      if (showPlate) {
        ctx.strokeStyle = plateColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(plateX, plateY, plateSize, plateSize);
      }

      // Particles
      if (glowEffect) {
        ctx.shadowBlur = glowBlur;
        ctx.shadowColor = particleColor;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = particleColor;

      const count2 = Math.min(particleCount, MAX_PARTICLES);
      for (let i = 0; i < count2; i++) {
        const wx = plateX + px[i] * plateSize;
        const wy = plateY + py[i] * plateSize;
        ctx.beginPath();
        ctx.arc(wx, wy, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [canvasRef]);
}
