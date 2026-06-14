// src/components/SpiderWeb/useSpiderWeb.ts
import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface WebNode {
  baseX: number; baseY: number;
  x: number; y: number;
  vx: number; vy: number;
  phase: number;
}

interface DewDrop {
  spokeIdx: number;
  ringIdxA: number;
  ringIdxB: number;
  t: number;
  size: number;
  glowPhase: number;
}

interface SpiderState {
  x: number; y: number;
  targetX: number; targetY: number;
  legPhase: number;
}

export interface UseSpiderWebOptions {
  spokeCount: number;
  ringCount: number;
  webColor: string;
  backgroundColor: string;
  spiderColor: string;
  dewDrops: boolean;
  glowColor: string;
  swaySpeed: number;
  disturbRadius: number;
  interactive: boolean;
  showSpider: boolean;
}

const SPRING = 0.06;
const DAMPING = 0.78;

export function useSpiderWeb(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseSpiderWebOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, t = 0;

    const nodes: WebNode[][] = [];
    const dews: DewDrop[] = [];
    const spider: SpiderState = { x: 0, y: 0, targetX: 0, targetY: 0, legPhase: 0 };
    const mouse = { x: -9999, y: -9999 };

    function buildWeb() {
      const { spokeCount, ringCount } = optionsRef.current;
      const cx = w / 2, cy = h / 2;
      const maxR = Math.min(w, h) * 0.44;
      nodes.length = 0;
      for (let s = 0; s < spokeCount; s++) {
        const angle = (s / spokeCount) * Math.PI * 2 - Math.PI / 2;
        nodes[s] = [];
        for (let r = 0; r < ringCount; r++) {
          const radius = ((r + 1) / ringCount) * maxR;
          const bx = cx + Math.cos(angle) * radius;
          const by = cy + Math.sin(angle) * radius;
          nodes[s][r] = {
            baseX: bx, baseY: by, x: bx, y: by,
            vx: 0, vy: 0,
            phase: (s * 7.3 + r * 13.1) % (Math.PI * 2),
          };
        }
      }
      dews.length = 0;
      for (let i = 0; i < 32; i++) {
        const s = Math.floor(Math.random() * spokeCount);
        const r = Math.floor(Math.random() * ringCount);
        dews.push({
          spokeIdx: s, ringIdxA: r - 1, ringIdxB: r,
          t: 0.15 + Math.random() * 0.7,
          size: 2 + Math.random() * 2.5,
          glowPhase: Math.random() * Math.PI * 2,
        });
      }
      spider.x = cx; spider.y = cy;
      spider.targetX = cx; spider.targetY = cy;
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      buildWeb();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onMouseLeave() { mouse.x = -9999; mouse.y = -9999; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let raf = 0;
    function loop() {
      t += 0.016;
      const opts = optionsRef.current;
      const { spokeCount, ringCount } = opts;
      const cx = w / 2, cy = h / 2;
      const maxR = Math.min(w, h) * 0.44;

      // Radial gradient background — subtle depth
      ctx.fillStyle = opts.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      // overlay a slight lighter center
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.1);
      centerGlow.addColorStop(0, hexToRgba(opts.webColor, 0.04));
      centerGlow.addColorStop(1, hexToRgba(opts.webColor, 0));
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, w, h);

      if (nodes.length !== spokeCount || (nodes[0] && nodes[0].length !== ringCount)) {
        buildWeb();
      }

      // Physics
      for (let s = 0; s < spokeCount; s++) {
        for (let r = 0; r < ringCount; r++) {
          const nd = nodes[s][r];
          const sway = Math.sin(t * opts.swaySpeed * 0.8 + nd.phase) * 1.2;
          let fx = nd.baseX - nd.x + sway;
          let fy = nd.baseY - nd.y + sway * 0.6;
          if (opts.interactive && mouse.x > -100) {
            const dx = mouse.x - nd.x, dy = mouse.y - nd.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < opts.disturbRadius && dist > 0) {
              const force = (1 - dist / opts.disturbRadius) * 4;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }
          }
          nd.vx = (nd.vx + fx * SPRING) * DAMPING;
          nd.vy = (nd.vy + fy * SPRING) * DAMPING;
          nd.x += nd.vx; nd.y += nd.vy;
        }
      }

      // Draw ring "membrane" fill — very subtle
      for (let r = 0; r < ringCount; r++) {
        const alpha = 0.03 * (1 - r / ringCount);
        if (alpha < 0.005) continue;
        ctx.beginPath();
        ctx.moveTo(nodes[0][r].x, nodes[0][r].y);
        for (let s = 1; s < spokeCount; s++) ctx.lineTo(nodes[s][r].x, nodes[s][r].y);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(opts.webColor, alpha);
        ctx.fill();
      }

      // Draw spokes — brighter near center
      ctx.lineCap = "round";
      for (let s = 0; s < spokeCount; s++) {
        for (let r = 0; r < ringCount; r++) {
          const alpha = 0.75 - (r / ringCount) * 0.45;
          const x0 = r === 0 ? cx : nodes[s][r - 1].x;
          const y0 = r === 0 ? cy : nodes[s][r - 1].y;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(nodes[s][r].x, nodes[s][r].y);
          ctx.strokeStyle = hexToRgba(opts.webColor, alpha);
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw rings — brighter inner
      for (let r = 0; r < ringCount; r++) {
        const alpha = 0.7 - (r / ringCount) * 0.4;
        ctx.beginPath();
        ctx.moveTo(nodes[0][r].x, nodes[0][r].y);
        for (let s = 1; s < spokeCount; s++) ctx.lineTo(nodes[s][r].x, nodes[s][r].y);
        ctx.closePath();
        ctx.strokeStyle = hexToRgba(opts.webColor, alpha);
        ctx.lineWidth = r < 2 ? 1.1 : 0.7;
        ctx.stroke();
      }

      // Hub glow
      const hubPulse = Math.sin(t * 1.5) * 0.15 + 0.55;
      const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.08);
      hubGrad.addColorStop(0, hexToRgba(opts.glowColor, hubPulse));
      hubGrad.addColorStop(1, hexToRgba(opts.glowColor, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = hubGrad;
      ctx.fill();

      // Dew drops — 3-layer glow
      if (opts.dewDrops) {
        for (const dew of dews) {
          const s = dew.spokeIdx;
          if (s >= spokeCount || dew.ringIdxB >= ringCount) continue;
          const ax = dew.ringIdxA < 0 ? cx : nodes[s][dew.ringIdxA].x;
          const ay = dew.ringIdxA < 0 ? cy : nodes[s][dew.ringIdxA].y;
          const bx = nodes[s][dew.ringIdxB].x;
          const by = nodes[s][dew.ringIdxB].y;
          const px = ax + (bx - ax) * dew.t;
          const py = ay + (by - ay) * dew.t;
          const glow = Math.sin(t * 1.8 + dew.glowPhase) * 0.35 + 0.65;

          // Outer glow
          const r3 = dew.size * 5 * glow;
          const g3 = ctx.createRadialGradient(px, py, 0, px, py, r3);
          g3.addColorStop(0, hexToRgba(opts.glowColor, 0.25 * glow));
          g3.addColorStop(1, hexToRgba(opts.glowColor, 0));
          ctx.beginPath(); ctx.arc(px, py, r3, 0, Math.PI * 2);
          ctx.fillStyle = g3; ctx.fill();

          // Mid glow
          const r2 = dew.size * 2.8 * glow;
          const g2 = ctx.createRadialGradient(px, py, 0, px, py, r2);
          g2.addColorStop(0, hexToRgba(opts.glowColor, 0.6 * glow));
          g2.addColorStop(1, hexToRgba(opts.glowColor, 0));
          ctx.beginPath(); ctx.arc(px, py, r2, 0, Math.PI * 2);
          ctx.fillStyle = g2; ctx.fill();

          // Bright core
          ctx.beginPath(); ctx.arc(px, py, dew.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(opts.glowColor, 0.95);
          ctx.fill();
        }
      }

      // Spider — detailed version
      if (opts.showSpider) {
        if (mouse.x > -100) {
          spider.targetX += (mouse.x - spider.targetX) * 0.08;
          spider.targetY += (mouse.y - spider.targetY) * 0.08;
        }
        spider.x += (spider.targetX - spider.x) * 0.04;
        spider.y += (spider.targetY - spider.y) * 0.04;
        spider.legPhase += 0.1;

        const sx = spider.x, sy = spider.y;
        ctx.fillStyle = opts.spiderColor;
        ctx.strokeStyle = opts.spiderColor;
        ctx.lineWidth = 1.2;

        // 8 legs with 2 joints each
        for (let i = 0; i < 4; i++) {
          const baseAngle = (i / 4) * Math.PI * 0.85 + 0.05;
          const wiggle = Math.sin(spider.legPhase + i * 1.6) * 0.18;
          for (const side of [-1, 1]) {
            const a = baseAngle * side + wiggle * side;
            const elbow = { x: sx + Math.cos(a) * 10, y: sy + Math.sin(a) * 7 + 1 };
            const tip   = { x: sx + Math.cos(a + 0.3 * side) * 18, y: sy + Math.sin(a + 0.3 * side) * 14 + 3 };
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(elbow.x, elbow.y);
            ctx.lineTo(tip.x, tip.y);
            ctx.stroke();
          }
        }

        // Abdomen (larger teardrop)
        ctx.beginPath();
        ctx.ellipse(sx, sy + 5, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cephalothorax (head)
        ctx.beginPath();
        ctx.ellipse(sx, sy - 4, 3.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes — two tiny bright dots
        ctx.fillStyle = hexToRgba(opts.glowColor, 0.8);
        ctx.beginPath(); ctx.arc(sx - 1.5, sy - 6, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx + 1.5, sy - 6, 1, 0, Math.PI * 2); ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
