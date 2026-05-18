import { useRef, useEffect, RefObject } from "react";

export type DLASeedMode = "center" | "ring" | "bottom";

export interface UseDiffusionAggregationOptions {
  particleColor: string;
  walkerColor: string;
  backgroundColor: string;
  particleSize: number;
  walkerCount: number;
  stepsPerFrame: number;
  seedMode: DLASeedMode;
  showWalkers: boolean;
  glowEffect: boolean;
  glowBlur: number;
  interactive: boolean;
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const n = parseInt(full, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

interface Walker {
  x: number;
  y: number;
}

// Neighbor offsets for adjacency check (4-connected + diagonals = 8-connected)
const NEIGHBORS = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

// Random step directions (excluding (0,0))
const STEPS = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

export function useDiffusionAggregation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseDiffusionAggregationOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;
    // grid in logical pixels / particleSize
    let cols = 0;
    let rows = 0;
    let grid: Uint8Array | null = null;
    let walkers: Walker[] = [];
    // max spawn radius (for ring/center modes)
    let maxRadius = 0;

    function gridIdx(gx: number, gy: number) {
      return gy * cols + gx;
    }

    function isOccupied(gx: number, gy: number): boolean {
      if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) return false;
      return grid![gridIdx(gx, gy)] === 1;
    }

    function hasOccupiedNeighbor(gx: number, gy: number): boolean {
      for (const [dx, dy] of NEIGHBORS) {
        if (isOccupied(gx + dx, gy + dy)) return true;
      }
      return false;
    }

    function occupyCell(gx: number, gy: number) {
      if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) return;
      grid![gridIdx(gx, gy)] = 1;
    }

    function toGrid(px: number, py: number): [number, number] {
      const { particleSize } = optionsRef.current;
      return [Math.floor(px / particleSize), Math.floor(py / particleSize)];
    }

    function toCanvas(gx: number, gy: number): [number, number] {
      const { particleSize } = optionsRef.current;
      return [gx * particleSize + particleSize * 0.5, gy * particleSize + particleSize * 0.5];
    }

    function spawnWalkerOnEdge(): Walker {
      const { seedMode } = optionsRef.current;
      if (seedMode === "bottom") {
        // spawn along the top edge, walk downward
        return { x: Math.floor(Math.random() * cols), y: 0 };
      }
      // for center and ring: spawn on a circle slightly outside maxRadius
      const angle = Math.random() * Math.PI * 2;
      const spawnR = Math.min(maxRadius, Math.floor(Math.min(cols, rows) * 0.48));
      const cx = cols / 2;
      const cy = rows / 2;
      return {
        x: Math.max(0, Math.min(cols - 1, Math.round(cx + Math.cos(angle) * spawnR))),
        y: Math.max(0, Math.min(rows - 1, Math.round(cy + Math.sin(angle) * spawnR))),
      };
    }

    function drawParticle(gx: number, gy: number, isCluster: boolean) {
      const [cx, cy] = toCanvas(gx, gy);
      const { particleColor, walkerColor, particleSize, glowEffect, glowBlur } = optionsRef.current;

      if (glowEffect && isCluster) {
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = glowBlur;
      } else {
        ctx.shadowBlur = 0;
      }

      const r = particleSize * 0.5;
      ctx.fillStyle = isCluster ? particleColor : walkerColor;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function eraseWalker(gx: number, gy: number) {
      const [cx, cy] = toCanvas(gx, gy);
      const { particleSize, backgroundColor } = optionsRef.current;
      const r = particleSize * 0.5 + 1;
      ctx.fillStyle = backgroundColor;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function seedCluster() {
      const { seedMode } = optionsRef.current;
      if (!grid) return;

      if (seedMode === "bottom") {
        // seed the entire bottom row
        for (let x = 0; x < cols; x++) {
          occupyCell(x, rows - 1);
          drawParticle(x, rows - 1, true);
        }
      } else if (seedMode === "ring") {
        // seed a small ring at center
        const cx = Math.floor(cols / 2);
        const cy = Math.floor(rows / 2);
        const sr = Math.max(2, Math.floor(Math.min(cols, rows) * 0.04));
        for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
          const gx = Math.round(cx + Math.cos(angle) * sr);
          const gy = Math.round(cy + Math.sin(angle) * sr);
          if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
            occupyCell(gx, gy);
            drawParticle(gx, gy, true);
          }
        }
      } else {
        // single center seed
        const cx = Math.floor(cols / 2);
        const cy = Math.floor(rows / 2);
        occupyCell(cx, cy);
        drawParticle(cx, cy, true);
      }
    }

    function reset(width: number, height: number) {
      const { particleSize, walkerCount } = optionsRef.current;
      cols = Math.max(4, Math.floor(width / particleSize));
      rows = Math.max(4, Math.floor(height / particleSize));
      grid = new Uint8Array(cols * rows);
      maxRadius = Math.floor(Math.min(cols, rows) * 0.05); // grows as cluster grows

      // clear canvas
      ctx.fillStyle = optionsRef.current.backgroundColor;
      ctx.fillRect(0, 0, w, h);

      seedCluster();

      // spawn initial walkers
      walkers = [];
      for (let i = 0; i < walkerCount; i++) {
        walkers.push(spawnWalkerOnEdge());
      }
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
      reset(w, h);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    // click to add extra seed
    function onClick(e: MouseEvent) {
      if (!optionsRef.current.interactive || !grid) return;
      const r = canvas!.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const [gx, gy] = toGrid(px, py);
      if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
        occupyCell(gx, gy);
        drawParticle(gx, gy, true);
      }
    }
    canvas.addEventListener("click", onClick);

    function loop() {
      if (!grid) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const { stepsPerFrame, walkerCount, showWalkers, seedMode } = optionsRef.current;

      for (let step = 0; step < stepsPerFrame; step++) {
        for (let wi = 0; wi < walkers.length; wi++) {
          const walker = walkers[wi];
          const prevX = walker.x;
          const prevY = walker.y;

          // erase walker from canvas if showing
          if (showWalkers) eraseWalker(prevX, prevY);

          // random step
          const move = STEPS[Math.floor(Math.random() * STEPS.length)];
          let nx = walker.x + move[0];
          let ny = walker.y + move[1];

          // wrap / bounce at boundary
          nx = Math.max(0, Math.min(cols - 1, nx));
          ny = seedMode === "bottom"
            ? Math.max(0, Math.min(rows - 2, ny)) // don't walk into seeded bottom row
            : Math.max(0, Math.min(rows - 1, ny));

          walker.x = nx;
          walker.y = ny;

          if (hasOccupiedNeighbor(nx, ny) && !isOccupied(nx, ny)) {
            // stick — draw as cluster particle
            occupyCell(nx, ny);
            drawParticle(nx, ny, true);

            // update maxRadius so walkers can reach further
            if (seedMode !== "bottom") {
              const cx = cols / 2;
              const cy = rows / 2;
              const dist = Math.sqrt((nx - cx) ** 2 + (ny - cy) ** 2);
              maxRadius = Math.min(
                Math.floor(Math.min(cols, rows) * 0.48),
                Math.max(maxRadius, Math.ceil(dist) + 3)
              );
            }

            // spawn replacement walker
            if (walkers.length <= walkerCount) {
              walkers[wi] = spawnWalkerOnEdge();
            }
          } else {
            if (showWalkers) drawParticle(nx, ny, false);
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef, options.particleSize, options.seedMode]);
}
