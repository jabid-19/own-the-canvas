import { useRef, useEffect, RefObject } from "react";

export type LissajousColorMode = "solid" | "cycle";

export interface UseLissajousOptions {
  freqX: number;
  freqY: number;
  phaseShift: number;
  phaseSpeed: number;
  amplitude: number;
  color: string;
  backgroundColor: string;
  lineWidth: number;
  trailFade: number;
  glowEffect: boolean;
  glowBlur: number;
  colorMode: LissajousColorMode;
  curvePoints: number;
  animated: boolean;
  speed: number;
}

export function useLissajous(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseLissajousOptions
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
    let phase = 0;

    let prevFreqX = -1;
    let prevFreqY = -1;
    let prevAmplitude = -1;
    let isFirstDraw = true;

    function clearCanvas() {
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.fillStyle = optionsRef.current.backgroundColor;
      ctx.fillRect(0, 0, w, h);
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
      clearCanvas();
      isFirstDraw = true;
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let lastTime = 0;

    function draw(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const {
        freqX, freqY, phaseShift, phaseSpeed, amplitude,
        color, backgroundColor, lineWidth, trailFade,
        glowEffect, glowBlur, colorMode, curvePoints,
        animated, speed,
      } = optionsRef.current;

      if (isFirstDraw) {
        phase = phaseShift * Math.PI / 180;
        prevFreqX = freqX;
        prevFreqY = freqY;
        prevAmplitude = amplitude;
        isFirstDraw = false;
      } else if (freqX !== prevFreqX || freqY !== prevFreqY || amplitude !== prevAmplitude) {
        clearCanvas();
        phase = phaseShift * Math.PI / 180;
        prevFreqX = freqX;
        prevFreqY = freqY;
        prevAmplitude = amplitude;
      }

      if (!animated) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // trail fade
      if (trailFade > 0) {
        ctx.globalAlpha = Math.min(1, trailFade * (dt / 16));
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      const cx = w / 2;
      const cy = h / 2;
      const Ax = cx * amplitude;
      const Ay = cy * amplitude;

      const strokeColor = colorMode === "cycle"
        ? `hsl(${(phase * 360 / Math.PI) % 360}, 100%, 65%)`
        : color;

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (glowEffect) {
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = glowBlur;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      for (let i = 0; i <= curvePoints; i++) {
        const t = (i / curvePoints) * 2 * Math.PI;
        const x = cx + Ax * Math.sin(freqX * t + phase);
        const y = cy + Ay * Math.sin(freqY * t);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.shadowBlur = 0;

      phase += (phaseSpeed * speed * Math.PI / 180) * (dt / 16);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
