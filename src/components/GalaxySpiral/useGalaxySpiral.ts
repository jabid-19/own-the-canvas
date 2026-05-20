import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

interface Star {
  r: number;       // radial distance from center (galaxy plane)
  baseAngle: number; // base angle (arm position)
  armIndex: number;
  isHalo: boolean;
  size: number;
  brightness: number;
  twinkle: number;
}

export interface UseGalaxySpiralOptions {
  starCount: number;
  armCount: number;
  armTightness: number;
  coreColor: string;
  diskColor: string;
  backgroundColor: string;
  rotationSpeed: number;
  tiltX: number;
  interactive: boolean;
  coreGlow: boolean;
  glowBlur: number;
}

export function useGalaxySpiral(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseGalaxySpiralOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const lastStarConfigRef = useRef({ starCount: -1, armCount: -1, armTightness: -1 });
  const viewRef = useRef({ tiltX: options.tiltX, tiltY: 0, targetTX: options.tiltX, targetTY: 0 });
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;
    let galaxyRot = 0;

    // Simple value noise for arm scatter
    function noise(x: number): number {
      return Math.sin(x * 127.1) * 0.5 + Math.sin(x * 311.7) * 0.3 + Math.sin(x * 74.3) * 0.2;
    }

    function initStars() {
      const { starCount, armCount, armTightness } = optionsRef.current;
      starsRef.current = [];

      const haloCount = Math.floor(starCount * 0.15);
      const coreCount = Math.floor(starCount * 0.2);
      const armStars = starCount - haloCount - coreCount;

      // Arm stars
      for (let i = 0; i < armStars; i++) {
        const armIdx = i % armCount;
        const r = 0.05 + Math.random() * 0.95; // normalized 0-1
        const armAngle = (armIdx / armCount) * Math.PI * 2;
        // Logarithmic spiral: angle offset increases with radius
        const spiralAngle = armAngle + r * armTightness * Math.PI * 4;
        const scatter = (noise(r * armIdx + i) * 0.15 + (Math.random() - 0.5) * 0.1) * (1 - r * 0.5);
        starsRef.current.push({
          r,
          baseAngle: spiralAngle + scatter,
          armIndex: armIdx,
          isHalo: false,
          size: Math.max(0.3, (1 - r * 0.7) * 2.5 + Math.random() * 0.8),
          brightness: 0.4 + (1 - r) * 0.6 + Math.random() * 0.2,
          twinkle: Math.random() * Math.PI * 2,
        });
      }

      // Core stars — dense bright cluster
      for (let i = 0; i < coreCount; i++) {
        const r = Math.random() * Math.random() * 0.18; // squared = denser at center
        starsRef.current.push({
          r,
          baseAngle: Math.random() * Math.PI * 2,
          armIndex: 0,
          isHalo: false,
          size: 0.5 + Math.random() * 1.5,
          brightness: 0.7 + Math.random() * 0.3,
          twinkle: Math.random() * Math.PI * 2,
        });
      }

      // Halo stars — scattered dimly
      for (let i = 0; i < haloCount; i++) {
        starsRef.current.push({
          r: 0.6 + Math.random() * 0.5,
          baseAngle: Math.random() * Math.PI * 2,
          armIndex: -1,
          isHalo: true,
          size: 0.3 + Math.random() * 0.6,
          brightness: 0.1 + Math.random() * 0.25,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width;
      h = height;
      initStars();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onMouseLeave() { mouseRef.current = null; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function draw(dt: number) {
      const {
        starCount, armCount, armTightness,
        coreColor, diskColor, backgroundColor, rotationSpeed,
        coreGlow, glowBlur,
      } = optionsRef.current;

      // Re-initialize stars when structural params change
      const last = lastStarConfigRef.current;
      if (last.starCount !== starCount || last.armCount !== armCount || last.armTightness !== armTightness) {
        initStars();
        lastStarConfigRef.current = { starCount, armCount, armTightness };
      }

      timeRef.current += dt * 0.001;
      galaxyRot += rotationSpeed * dt * 0.001 * 300;

      // Update view tilt from mouse
      const view = viewRef.current;
      const mouse = mouseRef.current;
      if (mouse) {
        view.targetTX = 0.1 + (mouse.y / h) * 0.7;
        view.targetTY = ((mouse.x / w) - 0.5) * 1.2;
      } else {
        view.targetTX = optionsRef.current.tiltX;
        view.targetTY = 0;
      }
      view.tiltX += (view.targetTX - view.tiltX) * 0.04;
      view.tiltY += (view.targetTY - view.tiltY) * 0.04;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const galaxyRadius = Math.min(w, h) * 0.45;

      const cosTX = Math.cos(view.tiltX);
      const sinTY = Math.sin(view.tiltY);
      const cosTY = Math.cos(view.tiltY);

      const coreRgb = hexToRgbString(coreColor);
      const diskRgb = hexToRgbString(diskColor);

      // Sort stars by projected Z for correct depth layering
      const stars = starsRef.current;
      const projected: Array<{ sx: number; sy: number; sz: number; star: Star }> = [];

      for (const star of stars) {
        star.twinkle += 0.02;
        const angle = star.baseAngle + galaxyRot * (1 - star.r * 0.3);
        const rPx = star.r * galaxyRadius;

        // Galaxy plane coordinates
        const gx = Math.cos(angle) * rPx;
        const gz = Math.sin(angle) * rPx;
        const gy = star.isHalo ? (Math.random() - 0.5) * rPx * 0.3 : 0;

        // Apply tiltY rotation (around Y axis)
        const rx = gx * cosTY - gz * sinTY;
        const rz = gx * sinTY + gz * cosTY;

        // Apply tiltX rotation (around X axis, flattens disk)
        const sx = cx + rx;
        const sy = cy + gy * 1 + rz * cosTX;
        const sz = rz; // depth

        projected.push({ sx, sy, sz, star });
      }

      // Sort back-to-front
      projected.sort((a, b) => a.sz - b.sz);

      // Core glow
      if (coreGlow) {
        const coreR = galaxyRadius * 0.12;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3);
        grad.addColorStop(0, `rgba(${coreRgb},0.35)`);
        grad.addColorStop(0.3, `rgba(${coreRgb},0.12)`);
        grad.addColorStop(1, `rgba(${coreRgb},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.shadowBlur = glowBlur;
        ctx.shadowColor = `rgb(${coreRgb})`;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${coreRgb})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw stars
      for (const { sx, sy, sz, star } of projected) {
        const twinkle = 0.8 + 0.2 * Math.sin(star.twinkle);
        const brightness = star.brightness * twinkle;

        // Depth fade for stars on far side
        const depthFade = sz < 0 ? 0.5 + 0.5 * (1 + sz / galaxyRadius) : 1;

        const alpha = brightness * depthFade;
        const rgb = star.isHalo || star.r > 0.4 ? diskRgb : coreRgb;

        // Slight size reduction for far stars
        const size = star.size * (0.7 + 0.3 * depthFade);

        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.2, size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${Math.min(1, alpha)})`;
        ctx.fill();
      }
    }

    let lastTime = 0;
    function loop(timestamp: number) {
      const dt = lastTime ? timestamp - lastTime : 16;
      lastTime = timestamp;
      draw(dt);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
