import { useRef, useEffect, RefObject } from "react";

export type VisualizerMode = "bars" | "wave" | "circular" | "mirror";

export interface UseAudioVisualizerOptions {
  audioSource: MediaStream | null;
  barCount: number;
  barColor: string;
  waveColor: string;
  mode: VisualizerMode;
  sensitivity: number;
  gapBetweenBars: number;
  rounded: boolean;
  gradient: boolean;
  gradientEndColor: string;
  backgroundColor: string;
  glowEffect: boolean;
  glowColor: string;
  glowBlur: number;
  fftSize: number;
  smoothingTimeConstant: number;
  circularRadiusRatio: number;
  idleAmplitude: number;
  idleAnimationSpeed: number;
}

export function useAudioVisualizer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseAudioVisualizerOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const timeDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  useEffect(() => {
    const stream = options.audioSource;
    if (!stream) {
      if (analyserRef.current) {
        sourceRef.current?.disconnect();
        audioCtxRef.current?.close();
        analyserRef.current = null;
        sourceRef.current = null;
        audioCtxRef.current = null;
      }
      return;
    }

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = options.fftSize;
    analyser.smoothingTimeConstant = options.smoothingTimeConstant;
    analyserRef.current = analyser;

    const source = audioCtx.createMediaStreamSource(stream);
    sourceRef.current = source;
    source.connect(analyser);

    dataArrayRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    timeDataRef.current = new Uint8Array(new ArrayBuffer(analyser.fftSize));

    return () => {
      source.disconnect();
      audioCtx.close();
      analyserRef.current = null;
      sourceRef.current = null;
      audioCtxRef.current = null;
    };
  }, [options.audioSource, options.fftSize, options.smoothingTimeConstant]);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
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

    function applyGlow() {
      const { glowEffect, glowColor, glowBlur, barColor } = optionsRef.current;
      if (glowEffect) {
        ctx.shadowColor = glowColor || barColor;
        ctx.shadowBlur = glowBlur;
      } else {
        ctx.shadowBlur = 0;
      }
    }

    function clearGlow() {
      ctx.shadowBlur = 0;
    }

    function drawBackground() {
      const { backgroundColor } = optionsRef.current;
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }

    function makeBarGradient(x: number, barH: number, barW: number, barColor: string, gradientEndColor: string): CanvasGradient {
      const grad = ctx.createLinearGradient(x, h, x, h - barH);
      grad.addColorStop(0, barColor);
      grad.addColorStop(1, gradientEndColor);
      return grad;
    }

    function drawBar(x: number, y: number, barW: number, barH: number, fillStyle: string | CanvasGradient, rounded: boolean) {
      if (barH < 1) return;
      ctx.fillStyle = fillStyle;
      if (rounded && barH > 4) {
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, Math.min(barW / 2, 4));
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barW, barH);
      }
    }

    function drawFallback() {
      const { barCount, barColor, waveColor, gapBetweenBars, rounded, mode, gradient,
              gradientEndColor, idleAmplitude, idleAnimationSpeed } = optionsRef.current;

      drawBackground();
      applyGlow();

      const t = performance.now() / 1000 * idleAnimationSpeed;

      if (mode === "wave") {
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin((x / w) * Math.PI * 4 + t * 2) * idleAmplitude;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        clearGlow();
        return;
      }

      if (mode === "circular") {
        const { circularRadiusRatio } = optionsRef.current;
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) * circularRadiusRatio;
        const barLineW = Math.max(1, (2 * Math.PI * radius) / barCount * 0.6);
        for (let i = 0; i < barCount; i++) {
          const idleH = (Math.sin((i / barCount) * Math.PI * 2 + t * 2) * 0.5 + 0.5) * radius * 0.15 + 2;
          const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + Math.cos(angle) * radius;
          const y1 = cy + Math.sin(angle) * radius;
          const x2 = cx + Math.cos(angle) * (radius + idleH);
          const y2 = cy + Math.sin(angle) * (radius + idleH);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = gradient ? `hsl(${(i / barCount) * 360},70%,60%)` : barColor;
          ctx.lineWidth = barLineW;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        clearGlow();
        return;
      }

      if (mode === "mirror") {
        const totalGap = gapBetweenBars * (barCount - 1);
        const barW = (w - totalGap) / barCount;
        for (let i = 0; i < barCount; i++) {
          const barH = (Math.sin((i / barCount) * Math.PI * 2 + t * 3) * 0.5 + 0.5) * h * 0.15 + 2;
          const x = i * (barW + gapBetweenBars);
          const fill = gradient ? makeBarGradient(x, barH, barW, barColor, gradientEndColor) : barColor;
          drawBar(x, h / 2 - barH / 2, barW, barH, fill, rounded);
        }
        clearGlow();
        return;
      }

      // Bars (default)
      const totalGap = gapBetweenBars * (barCount - 1);
      const barW = (w - totalGap) / barCount;
      for (let i = 0; i < barCount; i++) {
        const barH = (Math.sin((i / barCount) * Math.PI * 2 + t * 3) * 0.5 + 0.5) * h * 0.3 + 4;
        const x = i * (barW + gapBetweenBars);
        const y = h - barH;
        const fill = gradient ? makeBarGradient(x, barH, barW, barColor, gradientEndColor) : barColor;
        drawBar(x, y, barW, barH, fill, rounded);
      }
      clearGlow();
    }

    function draw() {
      const {
        barCount, barColor, waveColor, mode, sensitivity, gapBetweenBars, rounded,
        gradient, gradientEndColor,
      } = optionsRef.current;

      drawBackground();

      const analyser = analyserRef.current;
      if (!analyser) {
        drawFallback();
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const freqData = dataArrayRef.current!;
      const timeData = timeDataRef.current!;
      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);

      applyGlow();

      if (mode === "bars") {
        const totalGap = gapBetweenBars * (barCount - 1);
        const barW = (w - totalGap) / barCount;
        const step = Math.max(1, Math.floor(freqData.length / barCount));
        for (let i = 0; i < barCount; i++) {
          const value = freqData[i * step] / 255;
          const barH = value * h * sensitivity;
          const x = i * (barW + gapBetweenBars);
          const fill = gradient ? makeBarGradient(x, barH, barW, barColor, gradientEndColor) : barColor;
          drawBar(x, h - barH, barW, barH, fill, rounded);
        }
      } else if (mode === "mirror") {
        const totalGap = gapBetweenBars * (barCount - 1);
        const barW = (w - totalGap) / barCount;
        const step = Math.max(1, Math.floor(freqData.length / barCount));
        for (let i = 0; i < barCount; i++) {
          const value = freqData[i * step] / 255;
          const barH = value * h * sensitivity;
          const x = i * (barW + gapBetweenBars);
          const fill = gradient ? makeBarGradient(x, barH, barW, barColor, gradientEndColor) : barColor;
          drawBar(x, h / 2 - barH / 2, barW, barH, fill, rounded);
        }
      } else if (mode === "wave") {
        ctx.beginPath();
        const step = Math.max(1, Math.floor(timeData.length / w));
        for (let i = 0; i < w; i++) {
          const dataIdx = Math.min(Math.floor((i / w) * timeData.length), timeData.length - 1);
          const x = i;
          const y = (timeData[dataIdx] / 128 - 1) * (h / 2) * sensitivity + h / 2;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        if (gradient) {
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, waveColor);
          grad.addColorStop(0.5, gradientEndColor);
          grad.addColorStop(1, waveColor);
          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle = waveColor;
        }
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (mode === "circular") {
        const { circularRadiusRatio } = optionsRef.current;
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) * circularRadiusRatio;
        const step = Math.max(1, Math.floor(freqData.length / barCount));
        const barLineW = Math.max(1, (2 * Math.PI * radius) / barCount * 0.6);

        for (let i = 0; i < barCount; i++) {
          const value = freqData[i * step] / 255;
          const barH = value * radius * sensitivity;
          const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + Math.cos(angle) * radius;
          const y1 = cy + Math.sin(angle) * radius;
          const x2 = cx + Math.cos(angle) * (radius + barH);
          const y2 = cy + Math.sin(angle) * (radius + barH);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = gradient ? `hsl(${(i / barCount) * 360},80%,60%)` : barColor;
          ctx.lineWidth = barLineW;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = barColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      clearGlow();
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
