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
  ringIdxA: number; // -1 = center
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
          nodes[s][r] = { baseX: bx, baseY: by, x: bx, y: by, vx: 0, vy: 0, phase: (s * 7.3 + r * 13.1) % (Math.PI * 2) };
        }
      }
      dews.length = 0;
      for (let i = 0; i < 24; i++) {
        const s = Math.floor(Math.random() * spokeCount);
        const r = Math.floor(Math.random() * ringCount);
        dews.push({ spokeIdx: s, ringIdxA: r - 1, ringIdxB: r, t: 0.2 + Math.random() * 0.6, size: 1.5 + Math.random() * 2, glowPhase: Math.random() * Math.PI * 2 });
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
      ctx.fillStyle = opts.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      if (nodes.length !== spokeCount || (nodes[0] && nodes[0].length !== ringCount)) {
        buildWeb();
      }
      const cx = w / 2, cy = h / 2;

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

      ctx.strokeStyle = hexToRgba(opts.webColor, 0.65);
      ctx.lineWidth = 0.7;
      for (let s = 0; s < spokeCount; s++) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (let r = 0; r < ringCount; r++) ctx.lineTo(nodes[s][r].x, nodes[s][r].y);
        ctx.stroke();
      }
      for (let r = 0; r < ringCount; r++) {
        ctx.beginPath();
        ctx.moveTo(nodes[0][r].x, nodes[0][r].y);
        for (let s = 1; s < spokeCount; s++) ctx.lineTo(nodes[s][r].x, nodes[s][r].y);
        ctx.closePath();
        ctx.stroke();
      }

      if (opts.dewDrops) {
        for (const dew of dews) {
          const s = dew.spokeIdx;
          const ax = dew.ringIdxA < 0 ? cx : nodes[s][dew.ringIdxA].x;
          const ay = dew.ringIdxA < 0 ? cy : nodes[s][dew.ringIdxA].y;
          const bx = nodes[s][dew.ringIdxB].x;
          const by = nodes[s][dew.ringIdxB].y;
          const px = ax + (bx - ax) * dew.t;
          const py = ay + (by - ay) * dew.t;
          const glow = Math.sin(t * 1.8 + dew.glowPhase) * 0.3 + 0.7;
          const r2 = dew.size * 2.5 * glow;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, r2);
          grad.addColorStop(0, hexToRgba(opts.glowColor, 0.9));
          grad.addColorStop(1, hexToRgba(opts.glowColor, 0));
          ctx.beginPath(); ctx.arc(px, py, r2, 0, Math.PI * 2);
          ctx.fillStyle = grad; ctx.fill();
        }
      }

      if (opts.showSpider) {
        if (mouse.x > -100) {
          spider.targetX += (mouse.x - spider.targetX) * 0.08;
          spider.targetY += (mouse.y - spider.targetY) * 0.08;
        }
        spider.x += (spider.targetX - spider.x) * 0.04;
        spider.y += (spider.targetY - spider.y) * 0.04;
        spider.legPhase += 0.08;
        const sx = spider.x, sy = spider.y;
        const fill = hexToRgba(opts.spiderColor, 1);
        ctx.fillStyle = fill; ctx.strokeStyle = fill; ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const baseA = (i / 4) * Math.PI * 0.8 + 0.1;
          const wiggle = Math.sin(spider.legPhase + i * 1.5) * 0.15;
          for (const side of [-1, 1]) {
            const a = baseA * side + wiggle;
            const midX = sx + Math.cos(a) * 9, midY = sy + Math.sin(a) * 6 + 2;
            const tipX = sx + Math.cos(a) * 16, tipY = sy + Math.sin(a) * 12 + 4;
            ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(midX, midY); ctx.lineTo(tipX, tipY); ctx.stroke();
          }
        }
        ctx.beginPath(); ctx.ellipse(sx, sy + 2, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(sx, sy - 5, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
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
