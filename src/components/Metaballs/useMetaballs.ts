import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

export interface UseMetaballsOptions {
  blobCount: number;
  color: string;
  backgroundColor: string;
  threshold: number;
  speed: number;
  minRadius: number;
  maxRadius: number;
  glowEffect: boolean;
  glowBlur: number;
  resolution: number;
  animated: boolean;
  interactive: boolean;
}

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function useMetaballs(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseMetaballsOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let cssW = 0;
    let cssH = 0;
    let rafId = 0;
    let blobs: Blob[] = [];
    let dragIdx = -1;
    let dragOffX = 0;
    let dragOffY = 0;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d")!;
    let imgData: ImageData | null = null;
    let gridW = 0;
    let gridH = 0;
    let currentResolution = -1;

    function initBlobs(w: number, h: number) {
      const { blobCount, minRadius, maxRadius, speed } = optionsRef.current;
      blobs = Array.from({ length: blobCount }, () => {
        const r = minRadius + Math.random() * (maxRadius - minRadius);
        return {
          x: r + Math.random() * (w - r * 2),
          y: r + Math.random() * (h - r * 2),
          vx: (Math.random() - 0.5) * speed * 2,
          vy: (Math.random() - 0.5) * speed * 2,
          radius: r,
        };
      });
    }

    function initGrid(w: number, h: number) {
      const { resolution } = optionsRef.current;
      if (resolution === currentResolution && gridW > 0) return;
      currentResolution = resolution;
      gridW = Math.max(1, Math.round(w * resolution));
      gridH = Math.max(1, Math.round(h * resolution));
      offscreen.width = gridW;
      offscreen.height = gridH;
      imgData = offCtx.createImageData(gridW, gridH);
    }

    function resize(w: number, h: number) {
      const dpr = window.devicePixelRatio || 1;
      cssW = w;
      cssH = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      currentResolution = -1;
      initGrid(w, h);
      initBlobs(w, h);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function findBlob(x: number, y: number): number {
      for (let i = 0; i < blobs.length; i++) {
        const dx = blobs[i].x - x;
        const dy = blobs[i].y - y;
        if (dx * dx + dy * dy < blobs[i].radius * blobs[i].radius) return i;
      }
      return -1;
    }

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const idx = findBlob(mx, my);
      if (idx >= 0) {
        dragIdx = idx;
        dragOffX = mx - blobs[idx].x;
        dragOffY = my - blobs[idx].y;
      } else {
        // Add new blob
        const { minRadius, maxRadius } = optionsRef.current;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        blobs.push({ x: mx, y: my, vx: 0, vy: 0, radius });
      }
    }
    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive || dragIdx < 0) return;
      const r = canvas!.getBoundingClientRect();
      blobs[dragIdx].x = e.clientX - r.left - dragOffX;
      blobs[dragIdx].y = e.clientY - r.top - dragOffY;
      blobs[dragIdx].vx = 0;
      blobs[dragIdx].vy = 0;
    }
    function onMouseUp() { dragIdx = -1; }

    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      const mx = e.touches[0].clientX - r.left;
      const my = e.touches[0].clientY - r.top;
      const idx = findBlob(mx, my);
      if (idx >= 0) {
        dragIdx = idx;
        dragOffX = mx - blobs[idx].x;
        dragOffY = my - blobs[idx].y;
      }
    }
    function onTouchMove(e: TouchEvent) {
      if (!optionsRef.current.interactive || dragIdx < 0) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      blobs[dragIdx].x = e.touches[0].clientX - r.left - dragOffX;
      blobs[dragIdx].y = e.touches[0].clientY - r.top - dragOffY;
      blobs[dragIdx].vx = 0;
      blobs[dragIdx].vy = 0;
    }
    function onTouchEnd() { dragIdx = -1; }

    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });
    parent.addEventListener("touchmove", onTouchMove, { passive: false });
    parent.addEventListener("touchend", onTouchEnd);

    function loop() {
      const { blobCount, color, backgroundColor, threshold, speed, glowEffect, glowBlur, animated, resolution } = optionsRef.current;

      if (resolution !== currentResolution) {
        currentResolution = -1;
        initGrid(cssW, cssH);
      }

      // Sync blob count when prop changes (without resetting existing blobs)
      if (blobCount !== blobs.length && dragIdx < 0 && cssW > 0) {
        while (blobs.length < blobCount) {
          const { minRadius, maxRadius } = optionsRef.current;
          const r = minRadius + Math.random() * (maxRadius - minRadius);
          blobs.push({
            x: r + Math.random() * Math.max(1, cssW - r * 2),
            y: r + Math.random() * Math.max(1, cssH - r * 2),
            vx: (Math.random() - 0.5) * speed * 2,
            vy: (Math.random() - 0.5) * speed * 2,
            radius: r,
          });
        }
        while (blobs.length > blobCount) blobs.pop();
      }

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, cssW, cssH);

      if (!animated || !imgData || gridW === 0) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      // Update blob positions
      const scaleX = cssW / gridW;
      const scaleY = cssH / gridH;

      for (let i = 0; i < blobs.length; i++) {
        if (i === dragIdx) continue;
        const b = blobs[i];
        b.vx += (Math.random() - 0.5) * 0.1 * speed;
        b.vy += (Math.random() - 0.5) * 0.1 * speed;
        const maxV = speed * 2;
        if (b.vx > maxV) b.vx = maxV; else if (b.vx < -maxV) b.vx = -maxV;
        if (b.vy > maxV) b.vy = maxV; else if (b.vy < -maxV) b.vy = -maxV;
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < b.radius) { b.x = b.radius; b.vx = Math.abs(b.vx); }
        else if (b.x > cssW - b.radius) { b.x = cssW - b.radius; b.vx = -Math.abs(b.vx); }
        if (b.y < b.radius) { b.y = b.radius; b.vy = Math.abs(b.vy); }
        else if (b.y > cssH - b.radius) { b.y = cssH - b.radius; b.vy = -Math.abs(b.vy); }
      }

      // Pre-parse colors once
      const [bgR, bgG, bgB] = sampleGradient([backgroundColor], 0);
      const [fgR, fgG, fgB] = sampleGradient([color], 0);

      const data = imgData.data;
      const tLow = threshold * 0.8;
      const tRange = threshold * 0.2;

      for (let py = 0; py < gridH; py++) {
        const cy = py * scaleY;
        for (let px = 0; px < gridW; px++) {
          const cx = px * scaleX;
          let field = 0;
          for (const b of blobs) {
            const dx = cx - b.x;
            const dy = cy - b.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 1) { field = 99; break; }
            field += (b.radius * b.radius) / distSq;
          }
          const alpha = Math.min(1, Math.max(0, (field - tLow) / tRange));
          const i4 = (py * gridW + px) * 4;
          data[i4]     = (bgR + (fgR - bgR) * alpha) | 0;
          data[i4 + 1] = (bgG + (fgG - bgG) * alpha) | 0;
          data[i4 + 2] = (bgB + (fgB - bgB) * alpha) | 0;
          data[i4 + 3] = 255;
        }
      }

      offCtx.putImageData(imgData, 0, 0);

      ctx.save();
      if (glowEffect) {
        ctx.shadowBlur = glowBlur;
        ctx.shadowColor = color;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(offscreen, 0, 0, cssW, cssH);
      ctx.restore();

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      parent.removeEventListener("touchstart", onTouchStart);
      parent.removeEventListener("touchmove", onTouchMove);
      parent.removeEventListener("touchend", onTouchEnd);
    };
  }, [canvasRef]);
}
