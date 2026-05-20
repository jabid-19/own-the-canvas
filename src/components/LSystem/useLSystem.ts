import { useRef, useEffect, RefObject } from "react";

export interface UseLSystemOptions {
  axiom: string;
  rules: Record<string, string>;
  iterations: number;
  angle: number;
  lineWidth: number;
  color: string;
  backgroundColor: string;
  speed: number;
  autoReset: boolean;
  trailFade: number;
  glowEffect: boolean;
  glowBlur: number;
}

interface LSystemState {
  segments: Float32Array;
  totalSegments: number;
  drawnSegments: number;
  paramHash: string;
  waitTimer: number;
}

const MAX_STRING_LENGTH = 250_000;

function expandLSystem(axiom: string, rules: Record<string, string>, iterations: number): string {
  let str = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const ch of str) {
      const replacement = rules[ch];
      if (replacement) {
        next += replacement;
      } else {
        next += ch;
      }
      if (next.length >= MAX_STRING_LENGTH) {
        next = next.slice(0, MAX_STRING_LENGTH);
        break;
      }
    }
    str = next;
    if (str.length >= MAX_STRING_LENGTH) break;
  }
  return str;
}

function buildSegments(
  str: string,
  angleRad: number,
  w: number,
  h: number
): Float32Array {
  // First pass: run turtle at lineLength=1, collect raw segments, compute bounding box
  let x = 0, y = 0, a = -Math.PI / 2;
  const stack: { x: number; y: number; a: number }[] = [];
  const rawSegs: number[] = [];

  for (const ch of str) {
    switch (ch) {
      case "F":
      case "G": {
        const nx = x + Math.cos(a);
        const ny = y + Math.sin(a);
        rawSegs.push(x, y, nx, ny);
        x = nx;
        y = ny;
        break;
      }
      case "f": {
        x += Math.cos(a);
        y += Math.sin(a);
        break;
      }
      case "+":
        a += angleRad;
        break;
      case "-":
        a -= angleRad;
        break;
      case "[":
        stack.push({ x, y, a });
        break;
      case "]": {
        const s = stack.pop();
        if (s) { x = s.x; y = s.y; a = s.a; }
        break;
      }
    }
  }

  if (rawSegs.length === 0) return new Float32Array(0);

  // Compute bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < rawSegs.length; i += 4) {
    minX = Math.min(minX, rawSegs[i], rawSegs[i + 2]);
    maxX = Math.max(maxX, rawSegs[i], rawSegs[i + 2]);
    minY = Math.min(minY, rawSegs[i + 1], rawSegs[i + 3]);
    maxY = Math.max(maxY, rawSegs[i + 1], rawSegs[i + 3]);
  }

  const bbW = maxX - minX || 1;
  const bbH = maxY - minY || 1;
  const scale = Math.min((w * 0.88) / bbW, (h * 0.88) / bbH);

  // Anchor bottom-center for upward-growing trees; center for everything else
  const isUpright = minY < 0 && maxY >= -0.1;
  const cx = w / 2;
  let offsetX: number;
  let offsetY: number;
  if (isUpright) {
    offsetX = cx - ((minX + maxX) / 2) * scale;
    offsetY = h * 0.93 - maxY * scale;
  } else {
    offsetX = cx - ((minX + maxX) / 2) * scale;
    offsetY = h / 2 - ((minY + maxY) / 2) * scale;
  }

  // Build final scaled segment array
  const out = new Float32Array(rawSegs.length);
  for (let i = 0; i < rawSegs.length; i += 4) {
    out[i]     = rawSegs[i]     * scale + offsetX;
    out[i + 1] = rawSegs[i + 1] * scale + offsetY;
    out[i + 2] = rawSegs[i + 2] * scale + offsetX;
    out[i + 3] = rawSegs[i + 3] * scale + offsetY;
  }
  return out;
}

export function useLSystem(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseLSystemOptions
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

    const stateRef: LSystemState = {
      segments: new Float32Array(0),
      totalSegments: 0,
      drawnSegments: 0,
      paramHash: "",
      waitTimer: -1,
    };

    function computeHash(): string {
      const { axiom, rules, iterations, angle } = optionsRef.current;
      return `${axiom}|${JSON.stringify(rules)}|${iterations}|${angle}`;
    }

    function buildState() {
      const { axiom, rules, iterations, angle } = optionsRef.current;
      const str = expandLSystem(axiom, rules, iterations);
      const angleRad = angle * Math.PI / 180;
      stateRef.segments = buildSegments(str, angleRad, w, h);
      stateRef.totalSegments = stateRef.segments.length / 4;
      stateRef.drawnSegments = 0;
      stateRef.waitTimer = -1;
      stateRef.paramHash = computeHash();
    }

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
      buildState();
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
        color, backgroundColor, lineWidth, speed,
        autoReset, trailFade, glowEffect, glowBlur,
      } = optionsRef.current;

      // detect param changes
      const hash = computeHash();
      if (hash !== stateRef.paramHash) {
        clearCanvas();
        buildState();
      }

      const { segments, totalSegments } = stateRef;

      // waiting between cycles
      if (stateRef.waitTimer > 0) {
        stateRef.waitTimer -= dt;
        if (trailFade > 0) {
          // fade every frame during the wait so old drawing ghosts out smoothly
          ctx.globalAlpha = Math.min(1, trailFade * (dt / 16));
          ctx.shadowBlur = 0;
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, w, h);
          ctx.globalAlpha = 1;
        }
        if (stateRef.waitTimer <= 0) {
          stateRef.waitTimer = -1;
          if (trailFade === 0) clearCanvas();
          stateRef.drawnSegments = 0;
        }
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // draw batch of segments
      const batchSize = Math.max(1, Math.round(speed * (dt / 16)));
      const end = Math.min(stateRef.drawnSegments + batchSize, totalSegments);

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";

      if (glowEffect) {
        ctx.shadowColor = color;
        ctx.shadowBlur = glowBlur;
      } else {
        ctx.shadowBlur = 0;
      }

      for (let i = stateRef.drawnSegments; i < end; i++) {
        const x1 = segments[i * 4];
        const y1 = segments[i * 4 + 1];
        const x2 = segments[i * 4 + 2];
        const y2 = segments[i * 4 + 3];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      stateRef.drawnSegments = end;

      if (stateRef.drawnSegments >= totalSegments && autoReset) {
        stateRef.waitTimer = 1200;
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
