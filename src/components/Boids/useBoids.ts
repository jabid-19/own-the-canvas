import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: Array<{ x: number; y: number }>;
}

export interface UseBoidsOptions {
  count: number;
  maxSpeed: number;
  separationRadius: number;
  alignmentRadius: number;
  cohesionRadius: number;
  separationForce: number;
  alignmentForce: number;
  cohesionForce: number;
  color: string;
  trailLength: number;
  trailOpacity: number;
  boidSize: number;
  backgroundColor: string;
  interactive: boolean;
  mouseRadius: number;
  mouseForce: number;
  wrapEdges: boolean;
}

export function useBoids(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseBoidsOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const boidsRef = useRef<Boid[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function makeBoid(): Boid {
      const speed = optionsRef.current.maxSpeed;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed * 0.5,
        vy: Math.sin(angle) * speed * 0.5,
        trail: [],
      };
    }

    function initBoids() {
      const { count } = optionsRef.current;
      boidsRef.current = Array.from({ length: count }, makeBoid);
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
      initBoids();
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const cvs = canvasRef.current!;
      const r = cvs.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onMouseLeave() { mouseRef.current = null; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Spatial grid for O(n) neighbor lookup
    function buildGrid(boids: Boid[], cellSize: number) {
      const grid = new Map<string, number[]>();
      for (let i = 0; i < boids.length; i++) {
        const cx = Math.floor(boids[i].x / cellSize);
        const cy = Math.floor(boids[i].y / cellSize);
        const key = `${cx},${cy}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(i);
      }
      return grid;
    }

    function getNeighbors(grid: Map<string, number[]>, boid: Boid, cellSize: number, radius: number) {
      const cx = Math.floor(boid.x / cellSize);
      const cy = Math.floor(boid.y / cellSize);
      const cells = Math.ceil(radius / cellSize);
      const result: number[] = [];
      for (let dx = -cells; dx <= cells; dx++) {
        for (let dy = -cells; dy <= cells; dy++) {
          const key = `${cx + dx},${cy + dy}`;
          const cell = grid.get(key);
          if (cell) result.push(...cell);
        }
      }
      return result;
    }

    function draw() {
      const {
        maxSpeed, separationRadius, alignmentRadius, cohesionRadius,
        separationForce, alignmentForce, cohesionForce,
        color, trailLength, trailOpacity, boidSize,
        backgroundColor, mouseRadius, mouseForce, wrapEdges,
      } = optionsRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      const boids = boidsRef.current;
      const cellSize = Math.max(separationRadius, alignmentRadius, cohesionRadius);
      const grid = buildGrid(boids, cellSize);
      const mouse = mouseRef.current;
      const colorRgb = hexToRgbString(color);

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];

        // Track trail
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > trailLength) b.trail.shift();

        const neighbors = getNeighbors(grid, b, cellSize, Math.max(separationRadius, alignmentRadius, cohesionRadius));

        let sepX = 0, sepY = 0, sepCount = 0;
        let aliVX = 0, aliVY = 0, aliCount = 0;
        let cohX = 0, cohY = 0, cohCount = 0;

        for (const j of neighbors) {
          if (j === i) continue;
          const o = boids[j];
          const dx = b.x - o.x;
          const dy = b.y - o.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

          if (dist < separationRadius) {
            sepX += dx / dist;
            sepY += dy / dist;
            sepCount++;
          }
          if (dist < alignmentRadius) {
            aliVX += o.vx;
            aliVY += o.vy;
            aliCount++;
          }
          if (dist < cohesionRadius) {
            cohX += o.x;
            cohY += o.y;
            cohCount++;
          }
        }

        let ax = 0, ay = 0;

        if (sepCount > 0) {
          ax += (sepX / sepCount) * separationForce * maxSpeed;
          ay += (sepY / sepCount) * separationForce * maxSpeed;
        }
        if (aliCount > 0) {
          ax += ((aliVX / aliCount) - b.vx) * alignmentForce;
          ay += ((aliVY / aliCount) - b.vy) * alignmentForce;
        }
        if (cohCount > 0) {
          ax += ((cohX / cohCount - b.x) / cohesionRadius) * cohesionForce * maxSpeed;
          ay += ((cohY / cohCount - b.y) / cohesionRadius) * cohesionForce * maxSpeed;
        }

        // Mouse avoidance
        if (mouse) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < mouseRadius) {
            ax += (dx / dist) * mouseForce * maxSpeed;
            ay += (dy / dist) * mouseForce * maxSpeed;
          }
        }

        b.vx += ax;
        b.vy += ay;

        // Clamp speed
        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy) || 0.001;
        if (spd > maxSpeed) {
          b.vx = (b.vx / spd) * maxSpeed;
          b.vy = (b.vy / spd) * maxSpeed;
        }

        b.x += b.vx;
        b.y += b.vy;

        // Edge behavior
        if (wrapEdges) {
          if (b.x < 0) { b.x += w; b.trail = []; }
          if (b.x > w) { b.x -= w; b.trail = []; }
          if (b.y < 0) { b.y += h; b.trail = []; }
          if (b.y > h) { b.y -= h; b.trail = []; }
        } else {
          if (b.x < 0 || b.x > w) b.vx *= -1;
          if (b.y < 0 || b.y > h) b.vy *= -1;
          b.x = Math.max(0, Math.min(w, b.x));
          b.y = Math.max(0, Math.min(h, b.y));
        }

        // Draw trail — break path on wrap-edge teleports to avoid cross-canvas lines
        if (b.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let t = 1; t < b.trail.length; t++) {
            const prev = b.trail[t - 1];
            const curr = b.trail[t];
            if (Math.abs(curr.x - prev.x) > w * 0.5 || Math.abs(curr.y - prev.y) > h * 0.5) {
              ctx.moveTo(curr.x, curr.y);
            } else {
              ctx.lineTo(curr.x, curr.y);
            }
          }
          ctx.strokeStyle = `rgba(${colorRgb},${trailOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw boid as triangle
        const angle = Math.atan2(b.vy, b.vx);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(boidSize, 0);
        ctx.lineTo(-boidSize * 0.6, boidSize * 0.5);
        ctx.lineTo(-boidSize * 0.6, -boidSize * 0.5);
        ctx.closePath();
        ctx.fillStyle = `rgba(${colorRgb},0.9)`;
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
