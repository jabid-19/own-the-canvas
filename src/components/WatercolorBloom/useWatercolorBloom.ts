import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface Bloom {
  x: number;
  y: number;
  colorIdx: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  noiseRadii: number[];
  born: boolean;
}

export interface UseWatercolorBloomOptions {
  colors: string[];
  backgroundColor: string;
  bloomRadius: number;
  bloomSpeed: number;
  opacity: number;
  wetEdge: number;
  layerCount: number;
  noiseAmount: number;
  fadeSpeed: number;
  interactive: boolean;
  autoBloom: boolean;
  autoBloomInterval: number;
  resolution: number;
  animated: boolean;
  maxBlooms: number;
}

const NOISE_POINTS = 24;

function makeNoiseRadii(noiseAmount: number): number[] {
  return Array.from({ length: NOISE_POINTS }, () => 1 + (Math.random() * 2 - 1) * noiseAmount);
}

function drawBlob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  noiseRadii: number[]
) {
  const n = NOISE_POINTS;
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const angle = (idx / n) * Math.PI * 2;
    const r = radius * noiseRadii[idx];
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export function useWatercolorBloom(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseWatercolorBloomOptions
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
    let lastAutoBloom = 0;
    const blooms: Bloom[] = [];

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

    function spawnBloom(x: number, y: number) {
      const { colors, bloomRadius, noiseAmount, maxBlooms } = optionsRef.current;
      if (blooms.length >= maxBlooms) blooms.splice(0, 1);
      blooms.push({
        x,
        y,
        colorIdx: Math.floor(Math.random() * colors.length),
        radius: 0,
        maxRadius: bloomRadius * (0.7 + Math.random() * 0.6),
        opacity: optionsRef.current.opacity,
        noiseRadii: makeNoiseRadii(noiseAmount),
        born: false,
      });
    }

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      spawnBloom(e.clientX - r.left, e.clientY - r.top);
    }
    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      spawnBloom(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    }

    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });

    function loop(timestamp: number) {
      const { colors, backgroundColor, bloomSpeed, opacity, wetEdge, layerCount, fadeSpeed, autoBloom, autoBloomInterval, animated } = optionsRef.current;

      if (autoBloom && cssW > 0 && timestamp - lastAutoBloom > autoBloomInterval) {
        lastAutoBloom = timestamp;
        spawnBloom(Math.random() * cssW, Math.random() * cssH);
      }

      if (!animated) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, cssW, cssH);

      ctx.save();

      for (let bi = blooms.length - 1; bi >= 0; bi--) {
        const bloom = blooms[bi];
        const color = colors[bloom.colorIdx] ?? colors[0];

        if (bloom.radius < bloom.maxRadius) {
          bloom.radius = Math.min(bloom.maxRadius, bloom.radius + bloomSpeed * 0.8);
        } else {
          bloom.opacity = Math.max(0, bloom.opacity - fadeSpeed);
        }

        if (bloom.opacity <= 0) {
          blooms.splice(bi, 1);
          continue;
        }

        // Draw layers from inside out
        for (let li = 0; li < layerCount; li++) {
          const t = (li + 1) / layerCount;
          const layerRadius = bloom.radius * t;
          const isEdge = li === layerCount - 1;
          const layerAlpha = bloom.opacity * (isEdge ? (0.3 + wetEdge * 0.7) : 0.08);

          ctx.fillStyle = hexToRgba(color, layerAlpha);
          drawBlob(ctx, bloom.x, bloom.y, layerRadius, bloom.noiseRadii);
          ctx.fill();
        }

        // Extra wet-edge ring just outside current radius
        if (wetEdge > 0.05) {
          ctx.strokeStyle = hexToRgba(color, bloom.opacity * wetEdge * 0.4);
          ctx.lineWidth = 2 + wetEdge * 3;
          drawBlob(ctx, bloom.x, bloom.y, bloom.radius * 1.02, bloom.noiseRadii);
          ctx.stroke();
        }
      }

      ctx.restore();
      rafId = requestAnimationFrame(loop);
    }

    // Seed a few initial blooms
    const seedTimer = setTimeout(() => {
      if (cssW > 0 && cssH > 0) {
        spawnBloom(cssW * 0.3, cssH * 0.4);
        spawnBloom(cssW * 0.7, cssH * 0.6);
      }
    }, 100);

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      clearTimeout(seedTimer);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("touchstart", onTouchStart);
    };
  }, [canvasRef]);
}
