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
  /** 0–1 position between minRadius and maxRadius; radius re-resolves live from it. */
  rt: number;
  phase: number;
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
    let t = 0;
    let fieldBuf = new Float32Array(0);
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
          rt: (r - minRadius) / Math.max(1e-6, maxRadius - minRadius),
          phase: Math.random() * Math.PI * 2,
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
        blobs.push({ x: mx, y: my, vx: 0, vy: 0, radius, rt: (radius - minRadius) / Math.max(1e-6, maxRadius - minRadius), phase: Math.random() * Math.PI * 2 });
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
            rt: (r - minRadius) / Math.max(1e-6, maxRadius - minRadius),
            phase: Math.random() * Math.PI * 2,
          });
        }
        while (blobs.length > blobCount) blobs.pop();
      }
      { // live minRadius / maxRadius
        const { minRadius, maxRadius } = optionsRef.current;
        for (const b of blobs) b.radius = minRadius + b.rt * (maxRadius - minRadius);
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

      t += 1 / 60;
      for (let i = 0; i < blobs.length; i++) {
        if (i === dragIdx) continue;
        const b = blobs[i];
        // lava-lamp convection: each blob slowly rises and sinks, drifting sideways
        const targetVy = Math.sin(t * 0.35 * speed + b.phase) * speed * 1.1;
        b.vy += (targetVy - b.vy) * 0.02;
        b.vx += ((Math.sin(t * 0.21 + b.phase * 1.7) * 0.6) * speed - b.vx) * 0.02;
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < b.radius * 0.6) { b.x = b.radius * 0.6; b.vx = Math.abs(b.vx); }
        else if (b.x > cssW - b.radius * 0.6) { b.x = cssW - b.radius * 0.6; b.vx = -Math.abs(b.vx); }
        if (b.y < b.radius * 0.4) { b.y = b.radius * 0.4; b.vy = Math.abs(b.vy); }
        else if (b.y > cssH - b.radius * 0.4) { b.y = cssH - b.radius * 0.4; b.vy = -Math.abs(b.vy); }
      }

      // Colour: the field's gradient is the surface normal, so each blob is lit like a glossy
      // drop of wax: hot bright core, cooler deep edge, specular highlight, soft rim glow.
      const [bgR, bgG, bgB] = sampleGradient([backgroundColor], 0);
      const [fgR, fgG, fgB] = sampleGradient([color], 0);
      // saturated core (pushed toward yellow-white), dark rich edge (pushed toward the
      // colour's own shadow) so the blobs glow from inside like lamp wax
      const hot = [Math.min(255, fgR + (255 - fgR) * 0.6), Math.min(255, fgG + (255 - fgG) * 0.55), Math.min(255, fgB + (255 - fgB) * 0.35)];
      const deep = [fgR * 0.6, fgG * 0.3, fgB * 0.45];
      const data = imgData.data;
      const tLow = threshold * 0.82;
      const tRange = threshold * 0.18;
      const avgR = blobs.reduce((m, bb) => m + bb.radius, 0) / Math.max(1, blobs.length);
      const field = fieldBuf.length === gridW * gridH ? fieldBuf : (fieldBuf = new Float32Array(gridW * gridH));

      for (let py = 0; py < gridH; py++) {
        const cy = py * scaleY;
        for (let px = 0; px < gridW; px++) {
          const cx = px * scaleX;
          let f = 0;
          for (const bb of blobs) {
            const dx = cx - bb.x, dy = cy - bb.y;
            f += (bb.radius * bb.radius) / Math.max(1, dx * dx + dy * dy);
          }
          field[py * gridW + px] = f;
        }
      }
      for (let py = 0; py < gridH; py++) {
        for (let px = 0; px < gridW; px++) {
          const i = py * gridW + px;
          const f = field[i];
          const i4 = i * 4;
          const inside = Math.min(1, Math.max(0, (f - tLow) / tRange));
          // halo outside the surface
          const halo = glowEffect ? Math.max(0, Math.min(1, f / threshold)) ** 3 * 0.35 * (glowBlur / 20) : 0;
          let r = bgR + (fgR - bgR) * halo, g = bgG + (fgG - bgG) * halo, bl = bgB + (fgB - bgB) * halo;
          if (inside > 0) {
            // height map: 0 at the surface, rising smoothly toward each blob's centre
            const hgt = Math.max(0, 1 - threshold / f);
            const fx1 = field[px < gridW - 1 ? i + 1 : i], fx0 = field[px > 0 ? i - 1 : i];
            const fy1 = field[py < gridH - 1 ? i + gridW : i], fy0 = field[py > 0 ? i - gridW : i];
            // d(height)/dx in css px, scaled by a typical blob radius so it's a dome, not a plateau
            const hx = (threshold * (fx1 - fx0)) / (2 * scaleX * f * f) * avgR;
            const hy = (threshold * (fy1 - fy0)) / (2 * scaleY * f * f) * avgR;
            const nl = Math.sqrt(hx * hx + hy * hy + 1);
            const nx = -hx / nl, ny = -hy / nl, nz = 1 / nl;
            const diff = Math.max(0, nx * -0.5 + ny * -0.6 + nz * 0.62);
            // highlight: reflect the light toward the viewer
            const rz = 2 * (nx * -0.5 + ny * -0.6 + nz * 0.62) * nz - 0.62;
            const spec = Math.pow(Math.max(0, rz), 18) * 0.8 * Math.min(1, hgt * 5);
            const k = Math.pow(hgt, 0.55);
            const lit = 0.35 + diff * 0.85;
            const sr = (deep[0] + (hot[0] - deep[0]) * k) * lit + spec * 255;
            const sg = (deep[1] + (hot[1] - deep[1]) * k) * lit + spec * 255;
            const sb = (deep[2] + (hot[2] - deep[2]) * k) * lit + spec * 255;
            r = r + (Math.min(255, sr) - r) * inside;
            g = g + (Math.min(255, sg) - g) * inside;
            bl = bl + (Math.min(255, sb) - bl) * inside;
          }
          data[i4] = r | 0;
          data[i4 + 1] = g | 0;
          data[i4 + 2] = bl | 0;
          data[i4 + 3] = 255;
        }
      }

      offCtx.putImageData(imgData, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(offscreen, 0, 0, cssW, cssH);

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
