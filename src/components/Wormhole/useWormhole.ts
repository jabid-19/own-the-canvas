import { useRef, useEffect, RefObject } from "react";

interface Ring {
  z: number;
  colorIndex: number;
  rotation: number;
}

interface Star {
  angle: number;
  ringZ: number;
  offset: number;
}

export interface UseWormholeOptions {
  ringCount: number;
  speed: number;
  colors: string[];
  backgroundColor: string;
  twist: number;
  fov: number;
  depth: number;
  lineWidth: number;
  opacity: number;
  starCount: number;
  starColor: string;
  interactive: boolean;
}

export function useWormhole(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseWormholeOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const ringsRef = useRef<Ring[]>([]);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const mouseSpeedRef = useRef<number>(1);
  const reinitRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    reinitRef.current?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.ringCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function initRings() {
      const { ringCount, starCount } = optionsRef.current;
      ringsRef.current = Array.from({ length: ringCount }, (_, i) => ({
        z: i / ringCount,
        colorIndex: i % Math.max(1, optionsRef.current.colors.length),
        rotation: (i / ringCount) * Math.PI * 2,
      }));
      starsRef.current = Array.from({ length: starCount }, () => ({
        angle: Math.random() * Math.PI * 2,
        ringZ: Math.random(),
        offset: (Math.random() - 0.5) * 0.08,
      }));
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
      initRings();
    }

    reinitRef.current = () => { if (w > 0 && h > 0) initRings(); };

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
      const mx = (e.clientX - r.left) / r.width;
      // Mouse X controls speed: left = slow, right = fast
      mouseSpeedRef.current = 0.2 + mx * 2.8;
    }
    canvas.addEventListener("mousemove", onMouseMove);

    function project(angle: number, z: number, rotation: number) {
      const { fov, depth, twist } = optionsRef.current;
      const r = Math.min(w, h) * 0.45;
      const scale = fov / (fov + z * depth);
      const rot = rotation + z * twist * Math.PI * 2;
      const px = w / 2 + Math.cos(angle + rot) * r * scale;
      const py = h / 2 + Math.sin(angle + rot) * r * scale;
      return { px, py, scale };
    }

    function draw() {
      const { speed, colors, backgroundColor, lineWidth, opacity, starColor } = optionsRef.current;
      const rings = ringsRef.current;
      const stars = starsRef.current;
      const effectiveSpeed = (speed * mouseSpeedRef.current * 0.008);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // Draw rings back to front (low z = far away)
      const sorted = [...rings].sort((a, b) => a.z - b.z);

      for (const ring of sorted) {
        ring.z += effectiveSpeed;
        if (ring.z >= 1) {
          ring.z -= 1;
          ring.colorIndex = (ring.colorIndex + 1) % Math.max(1, colors.length);
        }
        ring.rotation += effectiveSpeed * 0.1;

        const segments = 64;
        const alpha = (1 - ring.z) * opacity;
        if (alpha <= 0.01) continue;

        const color = colors[ring.colorIndex % colors.length] ?? "#7C3AED";
        const { scale } = project(0, ring.z, ring.rotation);

        ctx.beginPath();
        for (let s = 0; s <= segments; s++) {
          const angle = (s / segments) * Math.PI * 2;
          const { px, py } = project(angle, ring.z, ring.rotation);
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = lineWidth * scale;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw stars
      for (const star of stars) {
        star.ringZ += effectiveSpeed;
        if (star.ringZ >= 1) star.ringZ -= 1;

        const { px, py, scale } = project(star.angle + star.offset * Math.PI * 2, star.ringZ, 0);
        const alpha = (1 - star.ringZ) * 0.8;
        if (alpha <= 0) continue;

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, 1.5 * scale), 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [canvasRef]);
}
