import { useRef, useEffect, RefObject } from "react";

interface Bolt {
  points: Array<{ x: number; y: number }>;
  energy: number;
  alpha: number;
}

export interface UseLightningOptions {
  segments: number;
  roughness: number;
  branchChance: number;
  branchDecay: number;
  flickerCount: number;
  glowBlur: number;
  color: string;
  coreColor: string;
  backgroundColor: string;
  autoInterval: number;
  interactive: boolean;
  startX: number;
  startY: number;
  endY: number;
}

function generateBolt(
  x1: number, y1: number,
  x2: number, y2: number,
  depth: number,
  roughness: number,
  points: Array<{ x: number; y: number }>
): void {
  if (depth <= 0) {
    points.push({ x: x2, y: y2 });
    return;
  }
  const len = Math.hypot(x2 - x1, y2 - y1);
  // X: significant lateral displacement for zigzag
  // Y: small vertical jitter so bolt trends downward
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness * len * 0.5;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * len * 0.1;
  generateBolt(x1, y1, mx, my, depth - 1, roughness, points);
  generateBolt(mx, my, x2, y2, depth - 1, roughness, points);
}

export function useLightning(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseLightningOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const boltsRef = useRef<Bolt[]>([]);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashRef = useRef(0); // 0–1 screen flash that decays each frame

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
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

    function drawBolt(bolt: Bolt) {
      const { glowBlur, color, coreColor } = optionsRef.current;
      const pts = bolt.points;
      if (pts.length < 2 || bolt.alpha <= 0) return;
      const a = bolt.alpha * bolt.energy;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Pass 1 — wide outer glow
      ctx.shadowBlur = 0;
      ctx.globalAlpha = a * 0.3;
      ctx.strokeStyle = color;
      ctx.lineWidth = 6 * bolt.energy;
      ctx.filter = `blur(${Math.round(glowBlur * 0.6)}px)`;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.filter = "none";

      // Pass 2 — medium glow
      ctx.globalAlpha = a * 0.6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5 * bolt.energy;
      ctx.shadowColor = color;
      ctx.shadowBlur = glowBlur * bolt.energy;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      // Pass 3 — bright core
      ctx.globalAlpha = a * 0.9;
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 0.8 * bolt.energy;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    function strike(targetX?: number, targetY?: number) {
      const { segments, roughness, branchChance, branchDecay, flickerCount } = optionsRef.current;
      const { startX, startY, endY } = optionsRef.current;

      const sx = targetX !== undefined ? targetX : startX * w;
      const sy = startY * h;
      const ex = sx + (Math.random() - 0.5) * w * 0.2;
      const ey = targetY !== undefined ? targetY : endY * h;

      const newBolts: Bolt[] = [];

      function buildBolt(x1: number, y1: number, x2: number, y2: number, energy: number) {
        const pts: Array<{ x: number; y: number }> = [{ x: x1, y: y1 }];
        generateBolt(x1, y1, x2, y2, segments, roughness, pts);
        newBolts.push({ points: pts, energy, alpha: 1 });

        // Branches: spread in the direction of travel, not random ±40px
        for (let i = 2; i < pts.length - 1; i++) {
          if (Math.random() >= branchChance) continue;
          // Direction bias: follow the main bolt direction + fan out
          const bAngle = (Math.random() - 0.5) * Math.PI * 0.65;
          const bLen = (ey - pts[i].y) * (0.25 + Math.random() * 0.4);
          const bx = pts[i].x + Math.sin(bAngle) * bLen;
          const by = pts[i].y + Math.cos(bAngle) * Math.abs(bLen);
          const bPts: Array<{ x: number; y: number }> = [{ x: pts[i].x, y: pts[i].y }];
          generateBolt(pts[i].x, pts[i].y, bx, by, Math.max(2, segments - 2), roughness * 0.8, bPts);
          newBolts.push({ points: bPts, energy: energy * branchDecay, alpha: 1 });
        }
      }

      for (let f = 0; f < flickerCount; f++) {
        buildBolt(
          sx + (Math.random() - 0.5) * 4,
          sy,
          ex + (Math.random() - 0.5) * 8,
          ey,
          1
        );
      }

      boltsRef.current = newBolts;
      flashRef.current = 0.35; // trigger screen flash
    }

    function scheduleAuto() {
      const { autoInterval } = optionsRef.current;
      timerRef.current = setTimeout(() => {
        strike();
        scheduleAuto();
      }, autoInterval * (0.5 + Math.random()));
    }

    scheduleAuto();
    strike();

    function onClick(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas.getBoundingClientRect();
      strike(e.clientX - r.left, e.clientY - r.top);
    }
    canvas.addEventListener("click", onClick);

    function draw() {
      const { backgroundColor } = optionsRef.current;

      // Full clear each frame — no accumulated overlay drift
      if (!backgroundColor || backgroundColor === "transparent") {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      // Fade bolts and draw
      const bolts = boltsRef.current;
      let anyAlive = false;
      for (const bolt of bolts) {
        bolt.alpha *= 0.82;
        if (bolt.alpha > 0.01) {
          anyAlive = true;
          drawBolt(bolt);
        }
      }
      if (!anyAlive) boltsRef.current = [];

      // Screen flash overlay — decays quickly after strike
      if (flashRef.current > 0.005) {
        ctx.globalAlpha = flashRef.current;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        flashRef.current *= 0.55;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef]);
}
