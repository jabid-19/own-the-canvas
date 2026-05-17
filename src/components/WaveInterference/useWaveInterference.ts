import { useRef, useEffect, RefObject } from "react";

export interface UseWaveInterferenceOptions {
  maxSources: number;
  wavelength: number;
  speed: number;
  colorHigh: string;
  colorLow: string;
  backgroundColor: string;
  showSources: boolean;
  resolution: number;
  animated: boolean;
  decay: number;
}

interface WaveSource {
  x: number;
  y: number;
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const n = parseInt(full, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function useWaveInterference(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseWaveInterferenceOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const sourcesRef = useRef<WaveSource[]>([]);

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
    let gw = 0;
    let gh = 0;

    // start with two sources to show interference immediately
    function initSources() {
      sourcesRef.current = [
        { x: w * 0.35, y: h * 0.5 },
        { x: w * 0.65, y: h * 0.5 },
      ];
    }

    function resize(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      w = width;
      h = height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      const { resolution } = optionsRef.current;
      gw = Math.max(4, Math.round(w * resolution));
      gh = Math.max(4, Math.round(h * resolution));
      offscreen = new OffscreenCanvas(gw, gh);
      offCtx = offscreen.getContext("2d") as OffscreenCanvasRenderingContext2D;
      imageData = offCtx.createImageData(gw, gh);
      initSources();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    const SOURCE_CLICK_RADIUS = 16;

    function onClick(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;

      const sources = sourcesRef.current;
      const { maxSources } = optionsRef.current;

      // check if clicking near an existing source to remove it
      for (let i = 0; i < sources.length; i++) {
        const dx = sources[i].x - mx;
        const dy = sources[i].y - my;
        if (dx * dx + dy * dy < SOURCE_CLICK_RADIUS * SOURCE_CLICK_RADIUS) {
          sources.splice(i, 1);
          return;
        }
      }

      // add new source if under limit
      if (sources.length < maxSources) {
        sources.push({ x: mx, y: my });
      }
    }

    canvas.addEventListener("click", onClick);

    let lastTime = 0;

    function draw(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const { wavelength, speed, colorHigh, colorLow, showSources, animated, decay } = optionsRef.current;
      const sources = sourcesRef.current;

      if (animated) timeRef.current += dt * 0.001 * speed;
      const t = timeRef.current;

      const [loR, loG, loB] = parseHex(colorLow);
      const [hiR, hiG, hiB] = parseHex(colorHigh);

      const data = imageData!.data;
      const k = (2 * Math.PI) / wavelength;
      const omega = k * (speed * 60); // angular frequency
      const n = Math.max(1, sources.length);

      // scale grid coords to canvas coords
      const scaleX = w / gw;
      const scaleY = h / gh;

      for (let py = 0; py < gh; py++) {
        for (let px = 0; px < gw; px++) {
          const cx = (px + 0.5) * scaleX;
          const cy = (py + 0.5) * scaleY;

          let sum = 0;
          for (const src of sources) {
            const dx = cx - src.x;
            const dy = cy - src.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const amp = Math.exp(-decay * dist);
            sum += amp * Math.cos(k * dist - omega * t);
          }

          // normalize to [0, 1]
          const normalized = (sum / n + 1) * 0.5;
          const val = Math.max(0, Math.min(1, normalized));

          const p = (py * gw + px) * 4;
          data[p]     = Math.round(loR + (hiR - loR) * val);
          data[p + 1] = Math.round(loG + (hiG - loG) * val);
          data[p + 2] = Math.round(loB + (hiB - loB) * val);
          data[p + 3] = 255;
        }
      }

      offCtx!.putImageData(imageData!, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "low";
      ctx.drawImage(offscreen!, 0, 0, w, h);

      // draw source markers
      if (showSources) {
        for (const src of sources) {
          ctx.beginPath();
          ctx.arc(src.x, src.y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = colorHigh;
          ctx.lineWidth = 2;
          ctx.stroke();
          // crosshair
          ctx.beginPath();
          ctx.moveTo(src.x - 5, src.y);
          ctx.lineTo(src.x + 5, src.y);
          ctx.moveTo(src.x, src.y - 5);
          ctx.lineTo(src.x, src.y + 5);
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef, options.resolution]);
}
