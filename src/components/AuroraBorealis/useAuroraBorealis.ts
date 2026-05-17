import { useRef, useEffect, RefObject } from "react";

export interface UseAuroraBorealisOptions {
  colors: string[];
  speed: number;
  intensity: number;
  layers: number;
  backgroundColor: string;
  waveAmplitude: number;
  waveFrequency: number;
  starCount: number;
  animated: boolean;
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const n = parseInt(full, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
}

interface AuroraLayer {
  colorIndex: number;
  freqOffset: number;
  ampScale: number;
  speedScale: number;
  yCenter: number;
  thickness: number;
  phase: number;
}

export function useAuroraBorealis(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseAuroraBorealisOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const starsRef = useRef<Star[]>([]);
  const layersRef = useRef<AuroraLayer[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function initStars(width: number, height: number) {
      const { starCount } = optionsRef.current;
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
      }));
    }

    function initLayers(height: number) {
      const { layers } = optionsRef.current;
      layersRef.current = Array.from({ length: layers }, (_, i) => ({
        colorIndex: i % Math.max(1, optionsRef.current.colors.length),
        freqOffset: 0.5 + Math.random() * 1.5,
        ampScale: 0.4 + Math.random() * 0.6,
        speedScale: 0.3 + Math.random() * 0.7,
        yCenter: 0.15 + (i / Math.max(1, layers - 1)) * 0.45,
        thickness: 0.06 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      }));
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
      initStars(w, h);
      initLayers(h);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let prevLayers = options.layers;
    let prevStarCount = options.starCount;
    let lastTime = 0;

    function draw(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const { colors, speed, intensity, layers, waveAmplitude, waveFrequency, backgroundColor, animated, starCount } = optionsRef.current;

      // reinit if layer or star count changed
      if (layers !== prevLayers) {
        prevLayers = layers;
        initLayers(h);
      }
      if (starCount !== prevStarCount) {
        prevStarCount = starCount;
        initStars(w, h);
      }

      if (animated) timeRef.current += dt * 0.001 * speed;

      const t = timeRef.current;

      // background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // stars
      const stars = starsRef.current;
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity * 0.8})`;
        ctx.fill();
      }

      // aurora layers — additive blend
      const prevComp = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "screen";

      const steps = Math.max(4, Math.ceil(w / 4));
      const dx = w / steps;

      for (const layer of layersRef.current) {
        const color = colors[layer.colorIndex % colors.length] || "#ffffff";
        const [r, g, b] = parseHex(color);

        const yCenter = layer.yCenter * h;
        const amplitude = waveAmplitude * h * layer.ampScale;
        const freq = waveFrequency * layer.freqOffset;
        const thickness = layer.thickness * h;

        ctx.beginPath();

        // top edge of band (sine wave)
        for (let i = 0; i <= steps; i++) {
          const x = i * dx;
          const angle = (x / w) * Math.PI * 2 * freq + t * layer.speedScale + layer.phase;
          const y = yCenter - amplitude * Math.sin(angle) - thickness * 0.5;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // bottom edge (reverse)
        for (let i = steps; i >= 0; i--) {
          const x = i * dx;
          const angle = (x / w) * Math.PI * 2 * freq + t * layer.speedScale + layer.phase;
          const y = yCenter - amplitude * Math.sin(angle) + thickness * 0.5;
          ctx.lineTo(x, y);
        }

        ctx.closePath();

        // vertical gradient fade
        const grad = ctx.createLinearGradient(0, yCenter - amplitude - thickness, 0, yCenter + amplitude + thickness);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${intensity * 0.6})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${intensity})`);
        grad.addColorStop(0.7, `rgba(${r},${g},${b},${intensity * 0.6})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;
        ctx.fill();

        // vertical streaks
        const streakCount = Math.floor(w / 60);
        for (let s = 0; s < streakCount; s++) {
          const sx = ((s / streakCount + t * 0.02 * layer.speedScale) % 1) * w;
          const sy = yCenter - amplitude - thickness * 0.5;
          const sh = thickness * 2 + amplitude * 2;
          const streakGrad = ctx.createLinearGradient(0, sy, 0, sy + sh);
          streakGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
          streakGrad.addColorStop(0.5, `rgba(${r},${g},${b},${intensity * 0.3})`);
          streakGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = streakGrad;
          ctx.fillRect(sx - 1, sy, 2, sh);
        }
      }

      ctx.globalCompositeOperation = prevComp;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
