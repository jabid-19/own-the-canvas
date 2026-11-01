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
    let cacheKey = "";
    let needsRedraw = true; // poles moved: re-trace lines and repaint filings
    let lines: { pts: number[]; from: number }[] = [];
    let dpr = 1;
    let t = 0;
    const filings = document.createElement("canvas");
    const fctx = filings.getContext("2d")!;
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
      cssW = w;
      cssH = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    /** Trace field lines from every pole (N outward along B, S against it) and cache them. */
    function trace() {
      const { fieldLineCount, stepSize, maxSteps, poleRadius } = optionsRef.current;
      const poleSq = poleRadius * poleRadius;
      lines = [];
      poles.forEach((startPole, pi) => {
        const dir = startPole.charge;
        for (let li = 0; li < fieldLineCount; li++) {
          const angle = (li / fieldLineCount) * Math.PI * 2 + (pi % 2) * (Math.PI / fieldLineCount);
          let px = startPole.x + Math.cos(angle) * (poleRadius + 2);
          let py = startPole.y + Math.sin(angle) * (poleRadius + 2);
          const pts = [px, py];
          for (let s = 0; s < maxSteps; s++) {
            const [bx, by] = fieldAt(px, py);
            const len = Math.sqrt(bx * bx + by * by);
            if (len < 1e-10) break;
            const nx = px + (bx / len) * stepSize * dir;
            const ny = py + (by / len) * stepSize * dir;
            if (nx < -20 || nx > cssW + 20 || ny < -20 || ny > cssH + 20) break;
            let hit = false;
            for (const p of poles) if ((nx - p.x) ** 2 + (ny - p.y) ** 2 < poleSq) { hit = true; break; }
            pts.push(nx, ny);
            px = nx; py = ny;
            if (hit) break;
          }
          if (pts.length > 4) lines.push({ pts, from: dir });
        }
      });
    }

    /** Iron filings: short dashes aligned with the field, denser and darker where it's strong. */
    function paintFilings() {
      const { lineColor, backgroundColor } = optionsRef.current;
      filings.width = Math.max(1, Math.round(cssW * dpr));
      filings.height = Math.max(1, Math.round(cssH * dpr));
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = hexToRgba(backgroundColor, 1);
      fctx.fillStyle = bg;
      fctx.fillRect(0, 0, cssW, cssH);
      const n = Math.round((cssW * cssH) / 140);
      fctx.lineCap = "round";
      for (let i = 0; i < n; i++) {
        const x = Math.random() * cssW, y = Math.random() * cssH;
        const [bx, by] = fieldAt(x, y);
        const m = Math.sqrt(bx * bx + by * by);
        if (m < 1e-12) continue;
        const strength = Math.min(1, Math.sqrt(m) * 40);
        const len = 2.5 + strength * 3.5;
        const ux = bx / m, uy = by / m;
        fctx.strokeStyle = hexToRgba(lineColor, 0.05 + strength * 0.22);
        fctx.lineWidth = 0.8;
        fctx.beginPath();
        fctx.moveTo(x - ux * len, y - uy * len);
        fctx.lineTo(x + ux * len, y + uy * len);
        fctx.stroke();
      }
      const vg = fctx.createRadialGradient(cssW / 2, cssH / 2, Math.min(cssW, cssH) * 0.3, cssW / 2, cssH / 2, Math.hypot(cssW, cssH) / 2);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.45)");
      fctx.fillStyle = vg;
      fctx.fillRect(0, 0, cssW, cssH);
    }

    function drawFieldLines(dt: number) {
      const { lineWidth, lineOpacity, poleRadius, glowEffect, glowBlur, positiveColor, negativeColor, animated, lineColor } = optionsRef.current;
      // cached lines + filings depend on these too, not just pole positions
      const o = optionsRef.current;
      const key = `${o.fieldLineCount}|${o.stepSize}|${o.maxSteps}|${poleRadius}|${lineColor}|${o.backgroundColor}`;
      if (key !== cacheKey) { cacheKey = key; needsRedraw = true; }
      if (needsRedraw) { trace(); paintFilings(); needsRedraw = false; }
      if (animated) t += dt;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(filings, 0, 0, cssW, cssH);

      // field lines, shading from the N colour to the S colour along their length
      ctx.lineWidth = lineWidth * 1.2;
      ctx.lineJoin = "round";
      for (const L of lines) {
        const n = L.pts.length;
        const g = ctx.createLinearGradient(L.pts[0], L.pts[1], L.pts[n - 2], L.pts[n - 1]);
        const a = L.from === 1 ? positiveColor : negativeColor;
        const b = L.from === 1 ? negativeColor : positiveColor;
        g.addColorStop(0, hexToRgba(a, lineOpacity));
        g.addColorStop(0.5, hexToRgba(lineColor, lineOpacity * 0.85));
        g.addColorStop(1, hexToRgba(b, lineOpacity));
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(L.pts[0], L.pts[1]);
        for (let i = 2; i < n; i += 2) ctx.lineTo(L.pts[i], L.pts[i + 1]);
        ctx.stroke();
      }

      // current: bright beads running from N to S along every line
      ctx.globalCompositeOperation = "lighter";
      lines.forEach((L, li) => {
        const n = L.pts.length / 2;
        for (let k = 0; k < 3; k++) {
          let u = ((t * 0.18 + k / 3 + li * 0.137) % 1);
          if (L.from !== 1) u = 1 - u; // lines traced from S run backwards
          const idx = Math.min(n - 1, Math.floor(u * (n - 1)));
          const x = L.pts[idx * 2], y = L.pts[idx * 2 + 1];
          const r = 6;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, "rgba(255,255,255,0.85)");
          g.addColorStop(0.35, hexToRgba(lineColor, 0.5));
          g.addColorStop(1, hexToRgba(lineColor, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalCompositeOperation = "source-over";

      // poles: shaded metal spheres with a breathing glow
      for (const p of poles) {
        const color = p.charge === 1 ? positiveColor : negativeColor;
        if (glowEffect) {
          ctx.globalCompositeOperation = "lighter";
          const gr = poleRadius * (2.2 + glowBlur / 12) * (1 + 0.08 * Math.sin(t * 2.5 + p.x));
          const halo = ctx.createRadialGradient(p.x, p.y, poleRadius * 0.6, p.x, p.y, gr);
          halo.addColorStop(0, hexToRgba(color, 0.55));
          halo.addColorStop(1, hexToRgba(color, 0));
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, gr, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
        }
        const sphere = ctx.createRadialGradient(p.x - poleRadius * 0.35, p.y - poleRadius * 0.4, poleRadius * 0.1, p.x, p.y, poleRadius);
        sphere.addColorStop(0, "rgba(255,255,255,0.95)");
        sphere.addColorStop(0.3, color);
        sphere.addColorStop(1, hexToRgba(color, 1));
        ctx.fillStyle = sphere;
        ctx.beginPath();
        ctx.arc(p.x, p.y, poleRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.round(poleRadius * 0.95)}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 3;
        ctx.fillText(p.charge === 1 ? "N" : "S", p.x, p.y + 0.5);
        ctx.shadowBlur = 0;
      }
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

    let last = 0;
    function loop(now: number) {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (cssW > 0) drawFieldLines(dt);
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
