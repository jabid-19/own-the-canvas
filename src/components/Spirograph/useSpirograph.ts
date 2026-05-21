import { useRef, useEffect, RefObject } from "react";

export interface UseSpirographOptions {
  outerRadius: number;
  innerRadius: number;
  penDistance: number;
  speed: number;
  colors: string[];
  backgroundColor: string;
  lineWidth: number;
  trailFade: number;
  animated: boolean;
  autoReset: boolean;
  layerCount: number;
  symmetry: number;
  glowEffect: boolean;
  glowBlur: number;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b > 0) [a, b] = [b, a % b];
  return a || 1;
}

function period(R: number, r: number): number {
  const g = gcd(R, r);
  return 2 * Math.PI * (r / g);
}

interface SpiroLayer {
  t: number;
  prevX: number;
  prevY: number;
  R: number;
  r: number;
  d: number;
  fullPeriod: number;
}

export function useSpirograph(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseSpirographOptions
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

    let layers: SpiroLayer[] = [];

    let prevOuter = -1;
    let prevInner = -1;
    let prevPen = -1;
    let prevLayerCount = -1;
    let isFirstDraw = true;

    function computePoint(layer: SpiroLayer, angle: number): [number, number] {
      const cx = w / 2;
      const cy = h / 2;
      const x = cx + (layer.R - layer.r) * Math.cos(angle) + layer.d * Math.cos(((layer.R - layer.r) / layer.r) * angle);
      const y = cy + (layer.R - layer.r) * Math.sin(angle) - layer.d * Math.sin(((layer.R - layer.r) / layer.r) * angle);
      return [x, y];
    }

    function buildLayer(index: number, total: number, randomize: boolean): SpiroLayer {
      const { outerRadius, innerRadius, penDistance } = optionsRef.current;
      const minDim = Math.min(w, h);
      const R = (minDim / 2) * outerRadius;

      const spread = 0.12;
      const offset = total > 1 ? (index / (total - 1) - 0.5) * spread : 0;

      let r: number;
      let d: number;
      if (randomize) {
        r = R * Math.max(0.05, innerRadius + offset + (Math.random() - 0.5) * 0.08);
        d = r * Math.max(0.05, penDistance * (0.85 + Math.random() * 0.3));
      } else {
        r = R * Math.max(0.05, innerRadius + offset);
        d = r * Math.max(0.05, penDistance);
      }

      r = Math.max(1, r);
      d = Math.max(0.1, d);

      const fp = period(R, r);
      const layer: SpiroLayer = { t: 0, prevX: 0, prevY: 0, R, r, d, fullPeriod: fp };
      const [px, py] = computePoint(layer, 0);
      layer.prevX = px;
      layer.prevY = py;
      return layer;
    }

    function applyParams(randomize: boolean) {
      const { outerRadius, innerRadius, penDistance, layerCount } = optionsRef.current;
      layers = [];
      for (let i = 0; i < layerCount; i++) {
        layers.push(buildLayer(i, layerCount, randomize));
      }
      prevOuter = outerRadius;
      prevInner = innerRadius;
      prevPen = penDistance;
      prevLayerCount = layerCount;
    }

    function clearCanvas() {
      const { backgroundColor } = optionsRef.current;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = backgroundColor;
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
      applyParams(false);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let lastTime = 0;

    function strokeSegment(
      x1: number, y1: number,
      x2: number, y2: number,
      strokeColor: string,
      lw: number,
      glow: boolean,
      blur: number,
    ) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      if (glow) {
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = blur;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function rotateAround(cx: number, cy: number, x: number, y: number, angle: number): [number, number] {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dx = x - cx;
      const dy = y - cy;
      return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
    }

    function getLayerColor(_layer: SpiroLayer, layerIdx: number): string {
      const { colors } = optionsRef.current;
      const palette = colors.length > 0 ? colors : ["#ffffff"];
      return palette[layerIdx % palette.length];
    }

    function draw(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const {
        outerRadius, innerRadius, penDistance, layerCount,
        speed, backgroundColor, lineWidth, trailFade,
        animated, autoReset, symmetry, glowEffect, glowBlur,
      } = optionsRef.current;

      // detect curve param changes → rebuild layers
      if (
        !isFirstDraw &&
        (outerRadius !== prevOuter || innerRadius !== prevInner ||
          penDistance !== prevPen || layerCount !== prevLayerCount)
      ) {
        applyParams(false);
        clearCanvas();
      }
      isFirstDraw = false;

      if (!animated) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // fade trail
      if (trailFade > 0) {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = Math.min(1, trailFade * (dt / 16));
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = "source-over";

      const step = (speed * Math.PI / 180) * (dt / 16);
      const subSteps = Math.max(1, Math.ceil(step / 0.02));
      const subStep = step / subSteps;

      const cx = w / 2;
      const cy = h / 2;
      const symAngle = (2 * Math.PI) / symmetry;

      let anyComplete = false;

      for (let li = 0; li < layers.length; li++) {
        const layer = layers[li];
        const strokeColor = getLayerColor(layer, li);

        for (let s = 0; s < subSteps; s++) {
          layer.t += subStep;
          const [nx, ny] = computePoint(layer, layer.t);

          for (let sym = 0; sym < symmetry; sym++) {
            const angle = sym * symAngle;
            const [rx1, ry1] = rotateAround(cx, cy, layer.prevX, layer.prevY, angle);
            const [rx2, ry2] = rotateAround(cx, cy, nx, ny, angle);
            strokeSegment(rx1, ry1, rx2, ry2, strokeColor, lineWidth, glowEffect, glowBlur);
          }

          layer.prevX = nx;
          layer.prevY = ny;
        }

        if (layer.t >= layer.fullPeriod && autoReset) {
          anyComplete = true;
        }
      }

      // reset glow for non-glow frames
      if (!glowEffect) ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";

      if (anyComplete) {
        applyParams(true);
        clearCanvas();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
