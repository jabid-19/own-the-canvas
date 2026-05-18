import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

export interface UseKaleidoscopeOptions {
  segments: number;
  speed: number;
  colorA: string;
  colorB: string;
  backgroundColor: string;
  noiseScale: number;
  zoomSpeed: number;
  rotation: number;
  resolution: number;
  animated: boolean;
}

// --- Simple 2D value noise ---
const PERM = new Uint8Array(512);
(function initPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // deterministic shuffle (fixed seed for reproducibility)
  let seed = 12345;
  for (let i = 255; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 256; i++) PERM[i] = PERM[i + 256] = p[i];
})();

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise2D(x: number, y: number): number {
  const ix = Math.floor(x) & 255;
  const iy = Math.floor(y) & 255;
  const fx = x - Math.floor(x);
  const fy = y - Math.floor(y);
  const ux = smoothstep(fx);
  const uy = smoothstep(fy);

  const r00 = PERM[(PERM[ix]     + iy)     & 255] / 255;
  const r10 = PERM[(PERM[ix + 1] + iy)     & 255] / 255;
  const r01 = PERM[(PERM[ix]     + iy + 1) & 255] / 255;
  const r11 = PERM[(PERM[ix + 1] + iy + 1) & 255] / 255;

  const a = r00 + (r10 - r00) * ux;
  const b = r01 + (r11 - r01) * ux;
  return a + (b - a) * uy; // [0, 1]
}

function fbm(x: number, y: number, octaves = 3): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += valueNoise2D(x * freq, y * freq) * amp;
    amp *= 0.5;
    freq *= 2;
  }
  return v; // ~[0, 1]
}

const TAU = Math.PI * 2;

interface KaleidoscopeState {
  gridW: number;
  gridH: number;
  imageData: ImageData | null;
  offscreen: OffscreenCanvas | null;
  offCtx: OffscreenCanvasRenderingContext2D | null;
  time: number;
  rotAngle: number;
  zoomPhase: number;
}

export function useKaleidoscope(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseKaleidoscopeOptions
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

    const stateRef: KaleidoscopeState = {
      gridW: 0, gridH: 0,
      imageData: null, offscreen: null, offCtx: null,
      time: 0, rotAngle: 0, zoomPhase: 0,
    };

    function initGrid(width: number, height: number) {
      const { resolution } = optionsRef.current;
      const gw = Math.max(1, Math.round(width * resolution));
      const gh = Math.max(1, Math.round(height * resolution));
      stateRef.gridW = gw;
      stateRef.gridH = gh;
      const off = new OffscreenCanvas(gw, gh);
      const offCtx = off.getContext("2d")!;
      stateRef.offscreen = off;
      stateRef.offCtx = offCtx;
      stateRef.imageData = offCtx.createImageData(gw, gh);
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
      initGrid(w, h);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let lastTime = 0;
    let prevResolution = -1;

    function draw(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const {
        segments, speed, colorA, colorB, backgroundColor,
        noiseScale, zoomSpeed, rotation, resolution, animated,
      } = optionsRef.current;

      // reinit if resolution changed
      if (resolution !== prevResolution) {
        initGrid(w, h);
        prevResolution = resolution;
      }

      if (!animated) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const { gridW, gridH, imageData, offscreen, offCtx } = stateRef;
      if (!imageData || !offscreen || !offCtx) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const data = imageData.data;
      const cx = gridW / 2;
      const cy = gridH / 2;
      const maxR = Math.min(cx, cy);
      const segs = Math.max(2, Math.round(segments));
      const wedgeAngle = TAU / segs;
      const halfWedge = wedgeAngle / 2;
      const rot = stateRef.rotAngle;
      const zoom = stateRef.zoomPhase;
      const t = stateRef.time;

      const [bgR, bgG, bgB] = sampleGradient([backgroundColor], 0);

      for (let py = 0; py < gridH; py++) {
        for (let px = 0; px < gridW; px++) {
          const dx = px - cx;
          const dy = py - cy;
          const r = Math.sqrt(dx * dx + dy * dy);

          if (r > maxR) {
            const off = (py * gridW + px) * 4;
            data[off] = bgR;
            data[off + 1] = bgG;
            data[off + 2] = bgB;
            data[off + 3] = 255;
            continue;
          }

          // polar angle, rotated
          let theta = Math.atan2(dy, dx) - rot;
          // normalize to [0, TAU)
          theta = ((theta % TAU) + TAU) % TAU;
          // fold into base wedge
          let tFolded = theta % wedgeAngle;
          if (tFolded > halfWedge) tFolded = wedgeAngle - tFolded;

          const rNorm = r / maxR;
          const nx = rNorm * noiseScale + zoom;
          const ny = tFolded * 8 + t * speed;
          const n = fbm(nx, ny) * 2 - 1; // [-1, 1] approx
          const tv = (n + 1) / 2;

          const [cr, cg, cb] = sampleGradient([colorB, colorA], tv);
          const off = (py * gridW + px) * 4;
          data[off] = cr;
          data[off + 1] = cg;
          data[off + 2] = cb;
          data[off + 3] = 255;
        }
      }

      offCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(offscreen, 0, 0, w, h);

      const dtNorm = dt / 16;
      stateRef.time += 0.02 * speed * dtNorm;
      stateRef.rotAngle += (rotation * Math.PI / 180) * dtNorm;
      stateRef.zoomPhase += zoomSpeed * 0.015 * dtNorm;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
