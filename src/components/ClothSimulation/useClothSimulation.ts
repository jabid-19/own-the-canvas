import { useRef, useEffect, RefObject } from "react";

interface Point {
  x: number;
  y: number;
  px: number; // previous x
  py: number; // previous y
  pinned: boolean;
}

interface Constraint {
  a: number;
  b: number;
  length: number;
}

export interface UseClothSimulationOptions {
  cols: number;
  rows: number;
  spacing: number;
  gravity: number;
  friction: number;
  stiffness: number;
  iterations: number;
  lineColor: string;
  pinColor: string;
  lineWidth: number;
  backgroundColor: string;
  wind: number;
  windSpeed: number;
  tearable: boolean;
  tearDistance: number;
  interactive: boolean;
  mouseRadius: number;
  mouseForce: number;
  showPins: boolean;
}

export function useClothSimulation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseClothSimulationOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointsRef = useRef<Point[]>([]);
  const constraintsRef = useRef<Constraint[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const mouseDownRef = useRef<boolean>(false);
  const timeRef = useRef<number>(0);
  const reinitRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    reinitRef.current?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.cols, options.rows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function buildCloth(width: number, height: number) {
      const { cols, rows, spacing } = optionsRef.current;
      const startX = (width - (cols - 1) * spacing) / 2;
      const startY = height * 0.08;

      const points: Point[] = [];
      const constraints: Constraint[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * spacing;
          const y = startY + r * spacing;
          points.push({
            x, y, px: x, py: y,
            pinned: r === 0 && (c % Math.ceil(cols / 5) === 0 || c === cols - 1),
          });

          const idx = r * cols + c;
          if (c > 0) {
            constraints.push({ a: idx - 1, b: idx, length: spacing });
          }
          if (r > 0) {
            constraints.push({ a: idx - cols, b: idx, length: spacing });
          }
        }
      }

      pointsRef.current = points;
      constraintsRef.current = constraints;
    }

    function applyDpr(width: number, height: number) {
      const cvs = canvasRef.current!;
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.round(width * dpr);
      cvs.height = Math.round(height * dpr);
      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      buildCloth(w, h);
    }

    reinitRef.current = () => { if (w > 0 && h > 0) buildCloth(w, h); };

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      const bounding = canvasRef.current!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - bounding.left, y: e.clientY - bounding.top };
    }
    function onMouseDown() { mouseDownRef.current = true; }
    function onMouseUp() { mouseDownRef.current = false; }
    function onMouseLeave() { mouseRef.current = null; mouseDownRef.current = false; }

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("mouseup", onMouseUp);
    parent.addEventListener("mouseleave", onMouseLeave);

    function draw() {
      const {
        gravity, friction, stiffness, iterations, lineColor, pinColor,
        lineWidth, backgroundColor, wind, windSpeed, tearable, tearDistance,
        interactive, mouseRadius, mouseForce, showPins,
      } = optionsRef.current;

      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const points = pointsRef.current;
      const mouse = mouseRef.current;

      const windForce = wind * Math.sin(t * windSpeed) * 0.1;

      // Verlet integration
      for (const p of points) {
        if (p.pinned) continue;
        const vx = (p.x - p.px) * friction;
        const vy = (p.y - p.py) * friction;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + windForce;
        p.y += vy + gravity;

        // Mouse interaction
        if (mouse && interactive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * mouseForce;
            if (mouseDownRef.current) {
              // Cut cloth on click
              if (tearable) {
                // Remove constraints involving this point
                for (let i = constraintsRef.current.length - 1; i >= 0; i--) {
                  const c = constraintsRef.current[i];
                  const pa = points[c.a];
                  const pb = points[c.b];
                  if (Math.sqrt((pa.x - mouse.x) ** 2 + (pa.y - mouse.y) ** 2) < mouseRadius * 0.5 ||
                      Math.sqrt((pb.x - mouse.x) ** 2 + (pb.y - mouse.y) ** 2) < mouseRadius * 0.5) {
                    constraintsRef.current.splice(i, 1);
                  }
                }
              } else {
                p.x += (dx / dist) * force * 2;
                p.y += (dy / dist) * force * 2;
              }
            } else {
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }
        }

        // Boundary
        if (p.y > h) { p.y = h; p.py = p.y + vy * 0.3; }
        if (p.x < 0) { p.x = 0; p.px = p.x - vx * 0.3; }
        if (p.x > w) { p.x = w; p.px = p.x - vx * 0.3; }
      }

      // Constraint relaxation
      for (let iter = 0; iter < iterations; iter++) {
        for (let i = constraintsRef.current.length - 1; i >= 0; i--) {
          const c = constraintsRef.current[i];
          const pa = points[c.a];
          const pb = points[c.b];
          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

          if (tearable && dist > tearDistance * c.length) {
            constraintsRef.current.splice(i, 1);
            continue;
          }

          const diff = (dist - c.length) / dist * stiffness * 0.5;
          const ox = dx * diff;
          const oy = dy * diff;

          if (!pa.pinned) { pa.x += ox; pa.y += oy; }
          if (!pb.pinned) { pb.x -= ox; pb.y -= oy; }
        }
      }

      // Draw constraints (cloth mesh)
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      for (const c of constraintsRef.current) {
        const pa = points[c.a];
        const pb = points[c.b];
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
      }
      ctx.stroke();

      // Draw pins
      if (showPins) {
        ctx.fillStyle = pinColor;
        for (const p of points) {
          if (!p.pinned) continue;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("mouseup", onMouseUp);
      parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
