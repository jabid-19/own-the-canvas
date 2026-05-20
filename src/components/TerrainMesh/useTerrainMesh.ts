import { useRef, useEffect, RefObject } from "react";

// Perlin noise — copy of NoiseGradient pattern, inline per project convention
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function nlerp(a: number, b: number, t: number) { return a + t * (b - a); }

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

const PERM = new Uint8Array(256);
for (let i = 0; i < 256; i++) PERM[i] = i;
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [PERM[i], PERM[j]] = [PERM[j], PERM[i]];
}
const P = new Uint8Array(512);
for (let i = 0; i < 512; i++) P[i] = PERM[i & 255];

function noise2d(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = P[P[xi] + yi];
  const ab = P[P[xi] + yi + 1];
  const ba = P[P[xi + 1] + yi];
  const bb = P[P[xi + 1] + yi + 1];
  return nlerp(
    nlerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    nlerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

function octaveNoise(x: number, y: number, octaves: number, persistence: number): number {
  let val = 0, amp = 1, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    val += noise2d(x * freq, y * freq) * amp;
    max += amp;
    amp *= persistence;
    freq *= 2;
  }
  return val / max;
}

function parseHexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0,
  ];
}

export interface UseTerrainMeshOptions {
  gridCols: number;
  gridRows: number;
  noiseScale: number;
  heightScale: number;
  wireColor: string;
  backgroundColor: string;
  fov: number;
  rotateX: number;
  rotateY: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  glowEffect: boolean;
  glowBlur: number;
  interactive: boolean;
  animated: boolean;
  lineWidth: number;
  colorByHeight: boolean;
}

export function useTerrainMesh(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseTerrainMeshOptions
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

    // Runtime rotation angles (modified by drag / autoRotate)
    let rotY = options.rotateY;
    let rotX = options.rotateX;

    // Height cache — avoids recomputing octaveNoise every frame
    let heightCache: Float32Array | null = null;
    let heightCacheKey = "";

    // Pre-parsed wire color to avoid string allocation per segment
    let wireR = 255, wireG = 255, wireB = 255;
    let prevWireColor = "";

    let isDragging = false;
    let lastDragX = 0;
    let lastDragY = 0;

    function resize(w: number, h: number) {
      const dpr = window.devicePixelRatio || 1;
      cssW = w;
      cssH = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      isDragging = true;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
    }
    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive || !isDragging) return;
      rotY += (e.clientX - lastDragX) * 0.005;
      rotX += (e.clientY - lastDragY) * 0.005;
      rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
      lastDragX = e.clientX;
      lastDragY = e.clientY;
    }
    function onMouseUp() { isDragging = false; }

    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      isDragging = true;
      lastDragX = e.touches[0].clientX;
      lastDragY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      if (!optionsRef.current.interactive || !isDragging) return;
      e.preventDefault();
      rotY += (e.touches[0].clientX - lastDragX) * 0.005;
      rotX += (e.touches[0].clientY - lastDragY) * 0.005;
      rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
      lastDragX = e.touches[0].clientX;
      lastDragY = e.touches[0].clientY;
    }
    function onTouchEnd() { isDragging = false; }

    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });
    parent.addEventListener("touchmove", onTouchMove, { passive: false });
    parent.addEventListener("touchend", onTouchEnd);

    // Project a 3D point to screen coords; returns [sx, sy, z2] (z2 for depth/alpha)
    function project(vx: number, vy: number, vz: number, fov: number, cx: number, cy: number): [number, number, number] {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const x1 = vx * cosY - vz * sinY;
      const z1 = vx * sinY + vz * cosY;
      const y2 = vy * cosX - z1 * sinX;
      const z2 = vy * sinX + z1 * cosX;
      const depth = fov + z2 + 600;
      return [cx + (x1 * fov) / depth, cy + (y2 * fov) / depth, z2];
    }

    function loop() {
      const {
        gridCols, gridRows, noiseScale, heightScale, wireColor, backgroundColor,
        fov, autoRotate, autoRotateSpeed, glowEffect, glowBlur,
        animated, lineWidth, colorByHeight,
      } = optionsRef.current;

      if (autoRotate && !isDragging) rotY += autoRotateSpeed;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, cssW, cssH);

      if (!animated || cssW === 0) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      // Rebuild height cache when grid params change — O(1) amortized per frame
      const cacheKey = `${gridCols},${gridRows},${noiseScale}`;
      if (cacheKey !== heightCacheKey) {
        const stride = gridCols + 1;
        heightCache = new Float32Array(stride * (gridRows + 1));
        for (let row = 0; row <= gridRows; row++) {
          for (let col = 0; col <= gridCols; col++) {
            heightCache[row * stride + col] = octaveNoise(col * noiseScale, row * noiseScale, 4, 0.5);
          }
        }
        heightCacheKey = cacheKey;
      }
      const heights = heightCache!;
      const stride = gridCols + 1;

      // Update parsed wire color only when it changes
      if (wireColor !== prevWireColor) {
        [wireR, wireG, wireB] = parseHexRgb(wireColor);
        prevWireColor = wireColor;
      }

      const cx = cssW / 2;
      const cy = cssH / 2;
      const totalW = cssW * 0.9;
      const totalD = cssH * 0.9;
      const cellW = totalW / gridCols;
      const cellD = totalD / gridRows;

      ctx.save();
      if (glowEffect) {
        ctx.shadowBlur = glowBlur;
        ctx.shadowColor = wireColor;
      }
      ctx.lineWidth = lineWidth;

      // Pre-project all vertices once — O(vertices) not O(segments)
      const px = new Float32Array(stride * (gridRows + 1));
      const py = new Float32Array(stride * (gridRows + 1));
      const pz = new Float32Array(stride * (gridRows + 1));
      for (let row = 0; row <= gridRows; row++) {
        for (let col = 0; col <= gridCols; col++) {
          const h = heights[row * stride + col];
          const vx = -totalW / 2 + col * cellW;
          const vy = -totalD / 2 + row * cellD;
          const [sx, sy, sz] = project(vx, vy, h * heightScale, fov, cx, cy);
          const idx = row * stride + col;
          px[idx] = sx;
          py[idx] = sy;
          pz[idx] = sz;
        }
      }

      // Draw row polylines — 1 stroke per row (not per segment)
      for (let row = 0; row <= gridRows; row++) {
        // Compute average row height for alpha
        let avgH = 0;
        const base = row * stride;
        for (let col = 0; col <= gridCols; col++) avgH += heights[base + col];
        avgH /= stride;
        const normalH = colorByHeight ? Math.max(0, Math.min(1, (avgH + 1) * 0.5)) : 1;
        const alpha = colorByHeight ? 0.2 + normalH * 0.8 : 0.6;
        ctx.strokeStyle = `rgba(${wireR},${wireG},${wireB},${alpha.toFixed(2)})`;

        ctx.beginPath();
        ctx.moveTo(px[base], py[base]);
        for (let col = 1; col <= gridCols; col++) {
          ctx.lineTo(px[base + col], py[base + col]);
        }
        ctx.stroke();
      }

      // Draw column polylines — 1 stroke per column
      for (let col = 0; col <= gridCols; col++) {
        let avgH = 0;
        for (let row = 0; row <= gridRows; row++) avgH += heights[row * stride + col];
        avgH /= (gridRows + 1);
        const normalH = colorByHeight ? Math.max(0, Math.min(1, (avgH + 1) * 0.5)) : 1;
        const alpha = colorByHeight ? 0.2 + normalH * 0.8 : 0.6;
        ctx.strokeStyle = `rgba(${wireR},${wireG},${wireB},${alpha.toFixed(2)})`;

        ctx.beginPath();
        ctx.moveTo(px[col], py[col]);
        for (let row = 1; row <= gridRows; row++) {
          ctx.lineTo(px[row * stride + col], py[row * stride + col]);
        }
        ctx.stroke();
      }

      ctx.restore();

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      parent.removeEventListener("touchstart", onTouchStart);
      parent.removeEventListener("touchmove", onTouchMove);
      parent.removeEventListener("touchend", onTouchEnd);
    };
  }, [canvasRef]); // eslint-disable-line react-hooks/exhaustive-deps
}
