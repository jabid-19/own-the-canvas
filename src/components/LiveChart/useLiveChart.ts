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
  const pulseRef = useRef<number>(0);

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

      pulseRef.current += 0.06;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      // Extra padding on left for axis labels
      const labelW = 36;
      const pad = padding;
      const chartX = pad + labelW;
      const chartW = w - chartX - pad;
      const chartH = h - pad * 2 - 20; // bottom room for axis labels
      const chartY = pad;

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

      const toX = (i: number, total: number) => chartX + (i / Math.max(total - 1, 1)) * chartW;
      const toY = (v: number) => chartY + chartH - ((v - dataMin) / range) * chartH;

      // Grid with labels
      if (showGrid) {
        const gridLines = 5;
        ctx.setLineDash([3, 5]);
        ctx.lineWidth = 1;

        for (let i = 0; i <= gridLines; i++) {
          const gy = chartY + (i / gridLines) * chartH;
          const val = dataMax - (i / gridLines) * range;

          ctx.strokeStyle = gridColor;
          ctx.globalAlpha = gridOpacity;
          ctx.beginPath();
          ctx.moveTo(chartX, gy);
          ctx.lineTo(chartX + chartW, gy);
          ctx.stroke();

          // Y-axis labels
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = gridColor;
          ctx.font = `10px system-ui, sans-serif`;
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          const label = Math.abs(val) >= 1000
            ? (val / 1000).toFixed(1) + "k"
            : val.toFixed(Math.abs(val) < 10 ? 1 : 0);
          ctx.fillText(label, chartX - 4, gy);
        }
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;

        // Axis border line
        ctx.strokeStyle = gridColor;
        ctx.globalAlpha = gridOpacity * 1.5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartX, chartY);
        ctx.lineTo(chartX, chartY + chartH);
        ctx.lineTo(chartX + chartW, chartY + chartH);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Series
      for (const s of series) {
        if (s.data.length < 2) continue;
        const n = s.data.length;

        // Build path
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
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Gradient area fill — more pronounced with multi-stop gradient
        if (s.filled !== false) {
          const fillPath = new Path2D();
          if (smooth) {
            fillPath.moveTo(toX(0, n), toY(s.data[0]));
            for (let i = 1; i < n - 1; i++) {
              const cpx = (toX(i - 1, n) + toX(i, n)) / 2;
              const cpy = (toY(s.data[i - 1]) + toY(s.data[i])) / 2;
              fillPath.quadraticCurveTo(toX(i - 1, n), toY(s.data[i - 1]), cpx, cpy);
            }
            fillPath.lineTo(toX(n - 1, n), toY(s.data[n - 1]));
          } else {
            fillPath.moveTo(toX(0, n), toY(s.data[0]));
            for (let i = 1; i < n; i++) fillPath.lineTo(toX(i, n), toY(s.data[i]));
          }
          fillPath.lineTo(toX(n - 1, n), chartY + chartH);
          fillPath.lineTo(toX(0, n), chartY + chartH);
          fillPath.closePath();

          // Clip fill to chart area
          ctx.save();
          ctx.beginPath();
          ctx.rect(chartX, chartY, chartW, chartH);
          ctx.clip();

          const grad = ctx.createLinearGradient(0, chartY, 0, chartY + chartH);
          grad.addColorStop(0,   s.color + "88");
          grad.addColorStop(0.5, s.color + "33");
          grad.addColorStop(1,   s.color + "00");
          ctx.fillStyle = grad;
          ctx.globalAlpha = fillOpacity;
          ctx.fill(fillPath);
          ctx.globalAlpha = 1;
          ctx.restore();
        }

        // Regular dots
        if (showDots && n > 1) {
          for (let i = 0; i < n - 1; i++) {
            ctx.beginPath();
            ctx.arc(toX(i, n), toY(s.data[i]), dotRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = 0.4;
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }

        // Animated pulsing dot on latest point
        const lx = toX(n - 1, n);
        const ly = toY(s.data[n - 1]);
        const pulse = Math.sin(pulseRef.current) * 0.5 + 0.5; // 0..1

        // Outer ring pulse
        if (glowEffect) { ctx.shadowColor = s.color; ctx.shadowBlur = glowBlur * 0.8; }
        ctx.beginPath();
        ctx.arc(lx, ly, dotRadius * (1.5 + pulse * 1.5), 0, Math.PI * 2);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6 * (1 - pulse);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Solid core dot
        ctx.beginPath();
        ctx.arc(lx, ly, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lx, ly, dotRadius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 1;
        ctx.fill();

        // Series label at latest point
        if (s.label) {
          ctx.font = `bold 11px system-ui, sans-serif`;
          ctx.fillStyle = s.color;
          ctx.textAlign = "left";
          ctx.textBaseline = "bottom";
          ctx.globalAlpha = 0.85;
          ctx.fillText(s.label, lx + dotRadius + 3, ly - 2);
          ctx.globalAlpha = 1;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [canvasRef]);

  return { push };
}
