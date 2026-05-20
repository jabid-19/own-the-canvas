import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

export interface UseMagneticFieldOptions {
  fieldLineCount: number;
  stepSize: number;
  maxSteps: number;
  positiveColor: string;
  negativeColor: string;
  lineColor: string;
  backgroundColor: string;
  lineWidth: number;
  lineOpacity: number;
  poleRadius: number;
  glowEffect: boolean;
  glowBlur: number;
  animated: boolean;
  interactive: boolean;
  maxPoles: number;
}

interface Pole {
  x: number;
  y: number;
  charge: 1 | -1;
}

export function useMagneticField(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseMagneticFieldOptions
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
    let needsRedraw = true;
    let poles: Pole[] = [];
    let dragIdx = -1;
    let dragOffX = 0;
    let dragOffY = 0;

    function initPoles(w: number, h: number) {
      poles = [
        { x: w * 0.35, y: h * 0.5, charge: 1 },
        { x: w * 0.65, y: h * 0.5, charge: -1 },
      ];
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
      initPoles(w, h);
      needsRedraw = true;
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function fieldAt(px: number, py: number): [number, number] {
      let bx = 0;
      let by = 0;
      for (const p of poles) {
        const dx = px - p.x;
        const dy = py - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 1) continue;
        const dist = Math.sqrt(distSq);
        const strength = p.charge / (distSq);
        bx += (dx / dist) * strength;
        by += (dy / dist) * strength;
      }
      return [bx, by];
    }

    function drawFieldLines() {
      const { fieldLineCount, stepSize, maxSteps, lineColor, lineWidth, lineOpacity, poleRadius, glowEffect, glowBlur, positiveColor, negativeColor, backgroundColor } = optionsRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, cssW, cssH);

      const poleSq = poleRadius * poleRadius;

      ctx.save();
      ctx.lineWidth = lineWidth;

      for (const startPole of poles) {
        // Seed from every pole: positive poles trace along field direction,
        // negative poles trace against it — lines emerge from N, terminate at S.
        const dir = startPole.charge;

        for (let li = 0; li < fieldLineCount; li++) {
          const angle = (li / fieldLineCount) * Math.PI * 2;
          let px = startPole.x + Math.cos(angle) * (poleRadius + 2);
          let py = startPole.y + Math.sin(angle) * (poleRadius + 2);

          ctx.beginPath();
          ctx.moveTo(px, py);
          let stepped = 0;

          for (let s = 0; s < maxSteps; s++) {
            const [bx, by] = fieldAt(px, py);
            const len = Math.sqrt(bx * bx + by * by);
            if (len < 1e-10) break;
            const nx = px + (bx / len) * stepSize * dir;
            const ny = py + (by / len) * stepSize * dir;

            if (nx < 0 || nx > cssW || ny < 0 || ny > cssH) break;

            let hitPole = false;
            for (const p of poles) {
              const ddx = nx - p.x;
              const ddy = ny - p.y;
              if (ddx * ddx + ddy * ddy < poleSq) { hitPole = true; break; }
            }
            if (hitPole) break;

            ctx.lineTo(nx, ny);
            px = nx;
            py = ny;
            stepped++;
          }

          if (stepped === 0) continue;
          if (glowEffect) {
            ctx.shadowBlur = glowBlur * 0.5;
            ctx.shadowColor = lineColor;
          }
          ctx.strokeStyle = hexToRgba(lineColor, lineOpacity);
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0;
      ctx.restore();

      // Draw poles
      ctx.save();
      for (const p of poles) {
        const color = p.charge === 1 ? positiveColor : negativeColor;
        if (glowEffect) {
          ctx.shadowBlur = glowBlur;
          ctx.shadowColor = color;
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, poleRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${poleRadius}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.charge === 1 ? "N" : "S", p.x, p.y);
      }
      ctx.restore();
    }

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const { poleRadius, maxPoles } = optionsRef.current;
      const hitRadius = poleRadius * 2;

      let found = -1;
      for (let i = 0; i < poles.length; i++) {
        const dx = poles[i].x - mx;
        const dy = poles[i].y - my;
        if (dx * dx + dy * dy < hitRadius * hitRadius) { found = i; break; }
      }

      if (found >= 0) {
        dragIdx = found;
        dragOffX = mx - poles[found].x;
        dragOffY = my - poles[found].y;
      } else if (poles.length < maxPoles) {
        const nextCharge: 1 | -1 = poles.length % 2 === 0 ? 1 : -1;
        poles.push({ x: mx, y: my, charge: nextCharge });
        needsRedraw = true;
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive || dragIdx < 0) return;
      const r = canvas!.getBoundingClientRect();
      poles[dragIdx].x = e.clientX - r.left - dragOffX;
      poles[dragIdx].y = e.clientY - r.top - dragOffY;
      needsRedraw = true;
    }

    function onMouseUp() { dragIdx = -1; }

    function onContextMenu(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      if (poles.length <= 2) return;
      const r = canvas!.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const { poleRadius } = optionsRef.current;
      const hitRadius = poleRadius * 2;
      for (let i = 0; i < poles.length; i++) {
        const dx = poles[i].x - mx;
        const dy = poles[i].y - my;
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          poles.splice(i, 1);
          needsRedraw = true;
          break;
        }
      }
    }

    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      const mx = e.touches[0].clientX - r.left;
      const my = e.touches[0].clientY - r.top;
      const { poleRadius } = optionsRef.current;
      const hitRadius = poleRadius * 2;
      for (let i = 0; i < poles.length; i++) {
        const dx = poles[i].x - mx;
        const dy = poles[i].y - my;
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          dragIdx = i;
          dragOffX = mx - poles[i].x;
          dragOffY = my - poles[i].y;
          return;
        }
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!optionsRef.current.interactive || dragIdx < 0) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      poles[dragIdx].x = e.touches[0].clientX - r.left - dragOffX;
      poles[dragIdx].y = e.touches[0].clientY - r.top - dragOffY;
      needsRedraw = true;
    }
    function onTouchEnd() { dragIdx = -1; }

    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    parent.addEventListener("contextmenu", onContextMenu);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });
    parent.addEventListener("touchmove", onTouchMove, { passive: false });
    parent.addEventListener("touchend", onTouchEnd);

    function loop() {
      const { animated } = optionsRef.current;

      if (animated || needsRedraw) {
        drawFieldLines();
        needsRedraw = false;
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      parent.removeEventListener("contextmenu", onContextMenu);
      parent.removeEventListener("touchstart", onTouchStart);
      parent.removeEventListener("touchmove", onTouchMove);
      parent.removeEventListener("touchend", onTouchEnd);
    };
  }, [canvasRef]);
}
