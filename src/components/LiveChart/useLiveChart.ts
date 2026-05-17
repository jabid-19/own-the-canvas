import { useRef, useEffect, RefObject } from "react";

export interface LiveChartSeries {
  data: number[];
  color: string;
  label?: string;
  filled?: boolean;
}

export interface UseLiveChartOptions {
  series: LiveChartSeries[];
  maxPoints: number;
  animated: boolean;
  lineWidth: number;
  showGrid: boolean;
  gridColor: string;
  gridOpacity: number;
  showDots: boolean;
  dotRadius: number;
  fillOpacity: number;
  backgroundColor: string;
  padding: number;
  yMin?: number;
  yMax?: number;
  smooth: boolean;
  glowEffect: boolean;
  glowBlur: number;
  scrollSpeed: number;
}

export function useLiveChart(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseLiveChartOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const rafRef = useRef<number>(0);

  const push = (values: number | number[]) => {
    const arr = Array.isArray(values) ? values : [values];
    const { series, maxPoints } = optionsRef.current;
    arr.forEach((v, i) => {
      if (!series[i]) return;
      series[i].data.push(v);
      if (series[i].data.length > maxPoints) series[i].data.shift();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function applyDpr(width: number, height: number) {
      const cvs = canvasRef.current!;
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.round(width * dpr);
      cvs.height = Math.round(height * dpr);
      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function draw() {
      const {
        series, lineWidth, showGrid, gridColor, gridOpacity,
        showDots, dotRadius, fillOpacity, backgroundColor, padding,
        yMin, yMax, smooth, glowEffect, glowBlur,
      } = optionsRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const pad = padding;
      const chartW = w - pad * 2;
      const chartH = h - pad * 2;

      // Compute y range across all series
      let dataMin = yMin ?? Infinity;
      let dataMax = yMax ?? -Infinity;
      if (yMin === undefined || yMax === undefined) {
        for (const s of series) {
          for (const v of s.data) {
            if (yMin === undefined && v < dataMin) dataMin = v;
            if (yMax === undefined && v > dataMax) dataMax = v;
          }
        }
        if (dataMin === Infinity) dataMin = 0;
        if (dataMax === -Infinity) dataMax = 1;
        if (dataMin === dataMax) { dataMin -= 1; dataMax += 1; }
        const range = dataMax - dataMin;
        dataMin -= range * 0.1;
        dataMax += range * 0.1;
      }
      const range = dataMax - dataMin || 1;

      const toX = (i: number, total: number) => pad + (i / Math.max(total - 1, 1)) * chartW;
      const toY = (v: number) => pad + chartH - ((v - dataMin) / range) * chartH;

      // Grid
      if (showGrid) {
        const gridLines = 5;
        ctx.strokeStyle = gridColor;
        ctx.globalAlpha = gridOpacity;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        for (let i = 0; i <= gridLines; i++) {
          const gy = pad + (i / gridLines) * chartH;
          ctx.beginPath();
          ctx.moveTo(pad, gy);
          ctx.lineTo(w - pad, gy);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      // Series
      for (const s of series) {
        if (s.data.length < 2) continue;
        const n = s.data.length;

        ctx.beginPath();
        if (smooth) {
          ctx.moveTo(toX(0, n), toY(s.data[0]));
          for (let i = 1; i < n - 1; i++) {
            const cpx = (toX(i - 1, n) + toX(i, n)) / 2;
            const cpy = (toY(s.data[i - 1]) + toY(s.data[i])) / 2;
            ctx.quadraticCurveTo(toX(i - 1, n), toY(s.data[i - 1]), cpx, cpy);
          }
          ctx.lineTo(toX(n - 1, n), toY(s.data[n - 1]));
        } else {
          ctx.moveTo(toX(0, n), toY(s.data[0]));
          for (let i = 1; i < n; i++) ctx.lineTo(toX(i, n), toY(s.data[i]));
        }

        if (glowEffect) { ctx.shadowColor = s.color; ctx.shadowBlur = glowBlur; }
        ctx.strokeStyle = s.color;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Fill
        if (s.filled !== false) {
          ctx.lineTo(toX(n - 1, n), pad + chartH);
          ctx.lineTo(toX(0, n), pad + chartH);
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, pad, 0, pad + chartH);
          grad.addColorStop(0, s.color + "55");
          grad.addColorStop(1, s.color + "00");
          ctx.fillStyle = grad;
          ctx.globalAlpha = fillOpacity;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Dots
        if (showDots) {
          for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.arc(toX(i, n), toY(s.data[i]), dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = i === n - 1 ? 1 : 0.5;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [canvasRef]);

  return { push };
}
