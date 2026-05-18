import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  width: number;
  windJitter: number; // per-drop horizontal drift so drops don't all move in sync
  layer: number;      // 0=bg, 1=mid, 2=fg — depth layering
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  maxLife: number;
}

export interface UseRainOptions {
  dropCount: number;
  speed: number;
  wind: number;
  windSpeed: number;
  dropLength: number;
  dropWidth: number;
  dropOpacity: number;
  dropColor: string;
  splashColor: string;
  showSplashes: boolean;
  backgroundColor: string;
}

// Per-layer [speedMul, opacityMul, sizeMul]
const LAYERS: [number, number, number][] = [
  [0.35, 0.25, 0.5],  // background — slow, dim, thin
  [0.65, 0.55, 0.75], // midground
  [1.0,  1.0,  1.0],  // foreground — fast, bright, full
];

export function useRain(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseRainOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const dropsRef = useRef<Drop[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function makeDrop(startVisible = false): Drop {
      const { speed, dropLength, dropOpacity, dropWidth } = optionsRef.current;
      const layer = Math.floor(Math.random() * 3);
      const [sm, om, wm] = LAYERS[layer];
      return {
        x: Math.random() * (w + 100) - 50,
        y: startVisible ? Math.random() * h : -dropLength * 2 - Math.random() * h * 0.5,
        speed:   speed * sm * (0.7 + Math.random() * 0.6),
        length:  dropLength * wm * (0.6 + Math.random() * 0.8),
        opacity: dropOpacity * om * (0.5 + Math.random() * 0.5),
        width:   dropWidth * wm * (0.5 + Math.random() * 0.8),
        windJitter: (Math.random() - 0.5) * 0.6,
        layer,
      };
    }

    function initDrops() {
      dropsRef.current = Array.from({ length: optionsRef.current.dropCount }, () => makeDrop(true));
      ripplesRef.current = [];
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      initDrops();
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function draw() {
      const { wind, windSpeed, dropColor, splashColor, showSplashes, backgroundColor } = optionsRef.current;

      timeRef.current += 0.016;
      const t = timeRef.current;
      // Two-frequency wind so gusts feel natural, not mechanical
      const windBase = wind * (Math.sin(t * windSpeed) * 0.7 + Math.sin(t * windSpeed * 0.37) * 0.3);

      if (!backgroundColor || backgroundColor === "transparent") {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const dropRgb = hexToRgbString(dropColor);
      const splashRgb = hexToRgbString(splashColor);

      // Render layers back-to-front for depth
      const drops = dropsRef.current;
      for (let layer = 0; layer < 3; layer++) {
        for (let i = 0; i < drops.length; i++) {
          const d = drops[i];
          if (d.layer !== layer) continue;

          const wOff = windBase + d.windJitter;
          d.x += wOff;
          d.y += d.speed;

          // Gradient streak: transparent tail → opaque head
          // Velocity vector is (wOff, d.speed) in canvas coords (y-down)
          const vLen = Math.sqrt(wOff * wOff + d.speed * d.speed) || 1;
          const tailX = d.x - (wOff / vLen) * d.length;
          const tailY = d.y - (d.speed / vLen) * d.length;

          const grad = ctx.createLinearGradient(tailX, tailY, d.x, d.y);
          grad.addColorStop(0, `rgba(${dropRgb},0)`);
          grad.addColorStop(1, `rgba(${dropRgb},${d.opacity})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(d.x, d.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = d.width;
          ctx.lineCap = "round";
          ctx.stroke();

          // Drop hit bottom → spawn ripple + recycle
          if (d.y > h + d.length) {
            if (showSplashes) {
              ripplesRef.current.push({
                x: d.x, y: h,
                r: 0,
                maxR: 8 + Math.random() * 12,
                life: 0,
                maxLife: 25 + Math.floor(Math.random() * 25),
              });
            }
            drops[i] = makeDrop();
          }

          if (d.x > w + 60) d.x -= w + 120;
          if (d.x < -60) d.x += w + 120;
        }
      }

      // Ellipse ripples — squashed for ground-plane perspective
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.life++;
        rip.r = (rip.life / rip.maxLife) * rip.maxR;
        const alpha = (1 - rip.life / rip.maxLife) * 0.75;
        if (alpha <= 0 || rip.life >= rip.maxLife) { ripples.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(rip.x, rip.y);
        ctx.scale(1.6, 0.35);
        ctx.beginPath();
        ctx.arc(0, 0, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${splashRgb},${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [canvasRef]);
}
