import { useRef, useEffect, RefObject } from "react";

export interface UseSpirographOptions {
  outerRadius: number;
  innerRadius: number;
  penDistance: number;
  speed: number;
  color: string;
  backgroundColor: string;
  lineWidth: number;
  trailFade: number;
  animated: boolean;
  autoReset: boolean;
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function period(R: number, r: number): number {
  const g = gcd(R, r);
  return 2 * Math.PI * (r / g);
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

    // curve state — recalculated whenever params change
    let t = 0;
    let prevX = 0;
    let prevY = 0;
    let R = 0;
    let r = 0;
    let d = 0;
    let fullPeriod = 0;

    // track prev params to detect changes in draw loop
    let prevOuter = -1;
    let prevInner = -1;
    let prevPen = -1;
    let isFirstDraw = true;

    function computePoint(angle: number): [number, number] {
      const cx = w / 2;
      const cy = h / 2;
      const x = cx + (R - r) * Math.cos(angle) + d * Math.cos(((R - r) / r) * angle);
      const y = cy + (R - r) * Math.sin(angle) - d * Math.sin(((R - r) / r) * angle);
      return [x, y];
    }

    function applyParams(randomize: boolean) {
      const { outerRadius, innerRadius, penDistance } = optionsRef.current;
      const minDim = Math.min(w, h);
      R = (minDim / 2) * outerRadius;

      if (randomize) {
        r = R * (innerRadius * (0.85 + Math.random() * 0.3));
        d = r * (penDistance * (0.8 + Math.random() * 0.4));
      } else {
        r = R * innerRadius;
        d = r * penDistance;
      }
      r = Math.max(1, r);
      d = Math.max(0.1, d);
      fullPeriod = period(R, r);
      t = 0;

      prevOuter = outerRadius;
      prevInner = innerRadius;
      prevPen = penDistance;

      const [px, py] = computePoint(0);
      prevX = px;
      prevY = py;
    }

    function clearCanvas() {
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

    function draw(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const { outerRadius, innerRadius, penDistance, speed, color, backgroundColor, lineWidth, trailFade, animated, autoReset } = optionsRef.current;

      // detect curve param changes → reset drawing with new shape
      if (!isFirstDraw && (outerRadius !== prevOuter || innerRadius !== prevInner || penDistance !== prevPen)) {
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
        ctx.fillStyle = backgroundColor;
        ctx.globalAlpha = Math.min(1, trailFade * (dt / 16));
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      // advance angle
      const step = (speed * Math.PI / 180) * (dt / 16);
      const subSteps = Math.max(1, Math.ceil(step / 0.02));
      const subStep = step / subSteps;

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";

      for (let s = 0; s < subSteps; s++) {
        t += subStep;
        const [x, y] = computePoint(t);
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        prevX = x;
        prevY = y;
      }

      if (t >= fullPeriod && autoReset) {
        applyParams(true); // slight randomization on cycle end
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
