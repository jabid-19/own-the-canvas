import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  flash: number;
}

interface Signal {
  fromIdx: number;
  toIdx: number;
  progress: number;
  strength: number;
}

export interface UseNeuralWebOptions {
  nodeCount: number;
  nodeColor: string;
  edgeColor: string;
  signalColor: string;
  backgroundColor: string;
  connectionRadius: number;
  nodeRadius: number;
  lineWidth: number;
  speed: number;
  pulseInterval: number;
  pulseDecay: number;
  glowEffect: boolean;
  glowBlur: number;
  interactive: boolean;
  animated: boolean;
  wander: boolean;
  wanderSpeed: number;
}

const MAX_SIGNALS = 300;

export function useNeuralWeb(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseNeuralWebOptions
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
    let lastPulse = 0;
    let hoveredIdx = -1;

    let nodes: Node[] = [];
    let signals: Signal[] = [];
    // O(1) duplicate detection: "fromIdx:toIdx"
    const activeEdges = new Set<number>();

    function edgeKey(from: number, to: number) { return from * 10000 + to; }

    function initNodes(w: number, h: number) {
      const { nodeCount, wanderSpeed } = optionsRef.current;
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * wanderSpeed,
        vy: (Math.random() - 0.5) * wanderSpeed,
        flash: 0,
      }));
      signals = [];
      activeEdges.clear();
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
      initNodes(w, h);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function firePulse(fromIdx: number, strength: number) {
      const { connectionRadius, pulseDecay } = optionsRef.current;
      if (strength < 0.05 || signals.length >= MAX_SIGNALS) return;
      nodes[fromIdx].flash = Math.max(nodes[fromIdx].flash, strength);
      const crSq = connectionRadius * connectionRadius;
      const newStrength = strength * pulseDecay;
      if (newStrength < 0.05) return;

      for (let i = 0; i < nodes.length; i++) {
        if (i === fromIdx) continue;
        if (signals.length >= MAX_SIGNALS) break;
        const dx = nodes[i].x - nodes[fromIdx].x;
        const dy = nodes[i].y - nodes[fromIdx].y;
        if (dx * dx + dy * dy > crSq) continue;
        const key = edgeKey(fromIdx, i);
        if (activeEdges.has(key)) continue;
        activeEdges.add(key);
        signals.push({ fromIdx, toIdx: i, progress: 0, strength: newStrength });
      }
    }

    function nearestNode(x: number, y: number): number {
      let best = -1;
      let bestDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - x;
        const dy = nodes[i].y - y;
        const d = dx * dx + dy * dy;
        if (d < bestDist) { bestDist = d; best = i; }
      }
      return best;
    }

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      hoveredIdx = nearestNode(e.clientX - r.left, e.clientY - r.top);
    }
    function onMouseLeave() { hoveredIdx = -1; }
    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      const idx = nearestNode(e.clientX - r.left, e.clientY - r.top);
      if (idx >= 0) firePulse(idx, 1);
    }
    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      const idx = nearestNode(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
      if (idx >= 0) firePulse(idx, 1);
    }

    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);
    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });

    let lastTime = 0;

    function loop(timestamp: number) {
      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;

      const { nodeColor, edgeColor, signalColor, backgroundColor, connectionRadius, nodeRadius, lineWidth, speed, pulseInterval, glowEffect, glowBlur, animated, wander, wanderSpeed } = optionsRef.current;

      // Auto-pulse
      if (nodes.length > 0 && timestamp - lastPulse > pulseInterval) {
        lastPulse = timestamp;
        firePulse((Math.random() * nodes.length) | 0, 1);
      }

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, cssW, cssH);

      if (!animated) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      // Update node positions
      if (wander) {
        const maxV = wanderSpeed * 2;
        for (const node of nodes) {
          node.vx += (Math.random() - 0.5) * 0.05 * wanderSpeed;
          node.vy += (Math.random() - 0.5) * 0.05 * wanderSpeed;
          if (node.vx > maxV) node.vx = maxV; else if (node.vx < -maxV) node.vx = -maxV;
          if (node.vy > maxV) node.vy = maxV; else if (node.vy < -maxV) node.vy = -maxV;
          node.x += node.vx * dt * 0.016;
          node.y += node.vy * dt * 0.016;
          if (node.x < 0) { node.x = 0; node.vx = Math.abs(node.vx); }
          else if (node.x > cssW) { node.x = cssW; node.vx = -Math.abs(node.vx); }
          if (node.y < 0) { node.y = 0; node.vy = Math.abs(node.vy); }
          else if (node.y > cssH) { node.y = cssH; node.vy = -Math.abs(node.vy); }
        }
      }

      // Draw edges
      ctx.save();
      ctx.lineWidth = lineWidth;
      const crSq = connectionRadius * connectionRadius;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distSq = dx * dx + dy * dy;
          if (distSq > crSq) continue;
          const alpha = (1 - Math.sqrt(distSq) / connectionRadius) * 0.4;
          ctx.strokeStyle = hexToRgba(edgeColor, alpha);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Update and draw signals
      ctx.save();
      if (glowEffect) { ctx.shadowBlur = glowBlur; ctx.shadowColor = signalColor; }
      const signalStep = speed * dt * 0.0008;

      for (let si = signals.length - 1; si >= 0; si--) {
        const sig = signals[si];
        sig.progress += signalStep;

        if (sig.progress >= 1) {
          activeEdges.delete(edgeKey(sig.fromIdx, sig.toIdx));
          signals.splice(si, 1);
          firePulse(sig.toIdx, sig.strength);
          continue;
        }

        const from = nodes[sig.fromIdx];
        const to = nodes[sig.toIdx];
        const sx = from.x + (to.x - from.x) * sig.progress;
        const sy = from.y + (to.y - from.y) * sig.progress;
        ctx.fillStyle = hexToRgba(signalColor, sig.strength * 0.9);
        ctx.beginPath();
        ctx.arc(sx, sy, nodeRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      // Draw nodes
      ctx.save();
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isHovered = i === hoveredIdx;
        const flash = node.flash;
        node.flash = Math.max(0, flash - 0.03);

        const alpha = 0.4 + flash * 0.6;
        const r = nodeRadius * (isHovered ? 1.5 : 1) * (1 + flash * 0.4);

        if (glowEffect && (isHovered || flash > 0.1)) {
          ctx.shadowBlur = glowBlur * (0.5 + flash * 0.5);
          ctx.shadowColor = nodeColor;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = hexToRgba(nodeColor, alpha);
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("touchstart", onTouchStart);
    };
  }, [canvasRef]);
}
