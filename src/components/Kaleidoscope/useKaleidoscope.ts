import { useRef, useEffect, RefObject } from "react";

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

// ── colour helpers ────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const hue = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [hue * 60, s, l];
}
function hsl(h: number, s: number, l: number) {
  return `hsl(${((h % 360) + 360) % 360}, ${Math.round(Math.max(0, Math.min(1, s)) * 100)}%, ${Math.round(Math.max(0, Math.min(1, l)) * 100)}%)`;
}

/** Jewel palette spun out of the two input colours: each, its neighbours on the wheel, and a pale tint. */
function buildPalette(a: string, b: string): string[] {
  const [ha, sa, la] = rgbToHsl(hexToRgb(a));
  const [hb, sb, lb] = rgbToHsl(hexToRgb(b));
  const sA = Math.max(0.55, sa), sB = Math.max(0.55, sb);
  const lA = Math.min(0.68, Math.max(0.45, la)), lB = Math.min(0.62, Math.max(0.4, lb));
  return [
    hsl(ha, sA, lA), hsl(hb, sB, lB), hsl(ha + 38, sA, lA), hsl(ha - 32, sA, lA - 0.04),
    hsl(hb + 42, sB, lB + 0.04), hsl(hb - 30, sB, lB), hsl(ha + 180, sA * 0.8, 0.6),
  ];
}

interface Shard {
  kind: 0 | 1 | 2; // polygon, bead, sliver
  r0: number; a0: number; drift: number; wobble: number; phase: number;
  rot: number; spin: number; size: number; color: number;
  verts: [number, number][];
}

function makeShards(count: number, sizeScale: number, rand: () => number): Shard[] {
  return Array.from({ length: count }, () => {
    const kind = (rand() < 0.55 ? 0 : rand() < 0.6 ? 1 : 2) as 0 | 1 | 2;
    const nv = 3 + Math.floor(rand() * 3);
    const verts: [number, number][] = [];
    for (let v = 0; v < nv; v++) {
      const ang = (v / nv) * Math.PI * 2 + (rand() - 0.5) * 0.9;
      const rr = 0.6 + rand() * 0.5;
      verts.push([Math.cos(ang) * rr, Math.sin(ang) * rr]);
    }
    return {
      kind,
      r0: 0.02 + Math.pow(rand(), 0.75) * 1.0, // slightly thinner toward the hub so it doesn't pile up
      a0: rand(),
      drift: (rand() - 0.5) * 0.12,
      wobble: 0.04 + rand() * 0.1,
      phase: rand() * Math.PI * 2,
      rot: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 0.9,
      size: (kind === 1 ? 0.025 + rand() * 0.035 : 0.05 + rand() * 0.11) * sizeScale,
      color: Math.floor(rand() * 7),
      verts,
    };
  });
}

/**
 * A real kaleidoscope: coloured glass shards and beads tumble inside one wedge, and that
 * wedge is mirrored around the centre `segments` times. The mirror image always reaches
 * past the corners, so the pattern fills the whole canvas edge to edge.
 */
export function useKaleidoscope(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseKaleidoscopeOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    const cell = document.createElement("canvas");
    const cctx = cell.getContext("2d")!;

    let w = 0, h = 0, dpr = 1;
    let shards: Shard[] = [];
    let shardKey = "";
    let palette: string[] = [];
    let paletteKey = "";
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      w = width;
      h = height;
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    let raf = 0, last = 0, t = 0, spinAngle = 0;

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (w === 0) return;
      const o = optionsRef.current;
      if (o.animated) {
        t += dt * o.speed * 0.6;
        spinAngle += (o.rotation * Math.PI / 180) * dt * 60 * 0.5;
      }

      const n = Math.max(2, Math.round(o.segments));
      const theta = Math.PI / n; // each mirror pair spans 2θ
      const R = Math.hypot(w, h) / 2 * (1.04 + 0.06 * Math.sin(t * o.zoomSpeed * 3));

      const pk = `${o.colorA}|${o.colorB}`;
      if (pk !== paletteKey) { paletteKey = pk; palette = buildPalette(o.colorA, o.colorB); }
      const count = Math.round(26 + Math.max(0.5, o.noiseScale) * 10);
      const sk = `${count}|${o.noiseScale}`;
      if (sk !== shardKey) {
        shardKey = sk;
        seed = 7;
        shards = makeShards(count, 1.6 / Math.sqrt(Math.max(0.5, o.noiseScale) / 2.5 + 0.6), rand);
      }

      // ── paint one wedge into the cell (wedge spans angles 0..θ, hub at the cell origin)
      const scale = dpr * Math.min(1, 0.5 + o.resolution);
      const cw = Math.ceil(R * scale);
      const ch = Math.ceil(R * Math.sin(Math.min(Math.PI / 2, theta * 1.02)) * scale) + 2;
      if (cell.width !== cw || cell.height !== ch) { cell.width = cw; cell.height = ch; }
      cctx.setTransform(scale, 0, 0, scale, 0, 0);
      cctx.globalCompositeOperation = "source-over";
      const bg = cctx.createRadialGradient(0, 0, 0, 0, 0, R);
      bg.addColorStop(0, o.backgroundColor);
      bg.addColorStop(1, o.backgroundColor);
      cctx.fillStyle = bg;
      cctx.fillRect(0, 0, R, ch / scale);

      cctx.globalCompositeOperation = "source-over";
      const span = theta * 1.9; // shards roam a band wider than the wedge so they slide across the mirrors
      for (const s of shards) {
        let a = ((s.a0 + s.drift * t) % 1 + 1) % 1;
        a = -theta * 0.45 + a * span;
        const r = (s.r0 + Math.sin(t * 0.7 + s.phase) * s.wobble) * R * 0.92;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        const size = s.size * R;
        const color = palette[s.color % palette.length];
        cctx.save();
        cctx.translate(x, y);
        cctx.rotate(s.rot + t * s.spin);
        if (s.kind === 1) {
          const g = cctx.createRadialGradient(-size * 0.35, -size * 0.35, size * 0.05, 0, 0, size);
          g.addColorStop(0, "rgba(255,255,255,0.95)");
          g.addColorStop(0.35, color);
          g.addColorStop(1, "rgba(0,0,0,0.2)");
          cctx.fillStyle = g;
          cctx.beginPath();
          cctx.arc(0, 0, size, 0, Math.PI * 2);
          cctx.fill();
        } else {
          const sx = s.kind === 2 ? size * 2.4 : size;
          const sy = s.kind === 2 ? size * 0.32 : size;
          cctx.beginPath();
          s.verts.forEach(([vx, vy], i) => (i ? cctx.lineTo(vx * sx, vy * sy) : cctx.moveTo(vx * sx, vy * sy)));
          cctx.closePath();
          cctx.globalAlpha = 0.78;
          cctx.fillStyle = color;
          cctx.fill();
          cctx.globalAlpha = 0.55;
          cctx.strokeStyle = "rgba(255,255,255,0.6)";
          cctx.lineWidth = 1.1;
          cctx.stroke();
          cctx.globalAlpha = 1;
        }
        cctx.restore();
      }

      // ── mirror the wedge around the centre
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      for (let k = 0; k < 2 * n; k++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(spinAngle);
        if (k % 2 === 0) {
          ctx.rotate(k * theta);
        } else {
          ctx.rotate((k + 1) * theta);
          ctx.scale(1, -1);
        }
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, R, -0.012, theta + 0.012);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(cell, 0, 0, cw / scale, ch / scale);
        ctx.restore();
      }

      // jewel at the hub and a soft vignette toward the corners
      const hub = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.12);
      hub.addColorStop(0, "rgba(255,255,255,0.28)");
      hub.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = hub;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      const vig = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.35, cx, cy, Math.hypot(w, h) / 2);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [canvasRef]);
}
