import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";
import { pointerInCanvas } from "../../runtime/fx";
import { noise1 } from "../../runtime/noise";

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

interface Neuron {
  bx: number; by: number; x: number; y: number; seed: number;
  flash: number; ring: number; hover: number; refractory: number;
  dendrites: [number, number][][]; // polylines relative to the soma
}
interface Signal { a: number; b: number; prog: number; energy: number; trail: { x: number; y: number }[] }

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};
const hash = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * A living neural net. Neurons have a glowing body, a nucleus and branching dendrites,
 * and connect to their neighbours with gently curved axons. Signals race along the axons
 * as bright comets; each one makes the receiving neuron fire and passes on, weaker, to its
 * neighbours, so activity cascades through the web. Hover a neuron to light it and its
 * connections; click to fire it.
 */
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
    let w = 0, h = 0, dpr = 1, t = 0;
    let neurons: Neuron[] = [];
    let signals: Signal[] = [];
    let edges: [number, number][] = [];
    let adj: number[][] = [];
    let sinceFire = 0;
    const dust = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), p: Math.random() * 6 }));
    const mouse = { x: -9999, y: -9999, inside: false };

    function makeNeuron(): Neuron {
      const dendrites: [number, number][][] = [];
      const n = 4 + Math.floor(Math.random() * 3);
      for (let d = 0; d < n; d++) {
        let a = (d / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
        let x = 0, y = 0;
        const line: [number, number][] = [[0, 0]];
        const segs = 3;
        for (let s = 0; s < segs; s++) {
          const len = 4 + Math.random() * 6;
          a += (Math.random() - 0.5) * 0.9;
          x += Math.cos(a) * len;
          y += Math.sin(a) * len;
          line.push([x, y]);
        }
        dendrites.push(line);
      }
      return { bx: Math.random(), by: Math.random(), x: 0, y: 0, seed: Math.random() * 100, flash: 0, ring: 0, hover: 0, refractory: 0, dendrites };
    }

    function init() {
      const o = optionsRef.current;
      neurons = Array.from({ length: Math.max(2, o.nodeCount) }, makeNeuron);
      for (const n of neurons) {
        n.bx = 0.05 + n.bx * 0.9;
        n.by = 0.08 + n.by * 0.84;
        n.x = n.bx * w;
        n.y = n.by * h;
      }
      signals = [];
    }

    function applySize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = width; h = height;
      init();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    function fire(i: number, energy: number) {
      const n = neurons[i];
      if (!n || n.refractory > 0) return;
      n.flash = Math.max(n.flash, energy);
      n.ring = 1;
      n.refractory = 0.35;
      const decay = optionsRef.current.pulseDecay;
      const next = energy * decay;
      if (next < 0.12) return;
      for (const j of adj[i] ?? []) {
        if (Math.random() < 0.75 && signals.length < 160) signals.push({ a: i, b: j, prog: 0, energy: next, trail: [] });
      }
    }

    function nearest(x: number, y: number, within: number): number {
      let best = -1, bd = within;
      neurons.forEach((n, i) => {
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }

    function onMouseMove(e: MouseEvent) {
      const p = pointerInCanvas(e, canvas!);
      if (!p) return onMouseLeave();
      mouse.x = p.x; mouse.y = p.y; mouse.inside = true;
    }
    function onMouseLeave() { mouse.inside = false; mouse.x = mouse.y = -9999; }
    function fireAt(clientX: number, clientY: number) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      const i = nearest(clientX - r.left, clientY - r.top, 120);
      if (i >= 0) { neurons[i].refractory = 0; fire(i, 1); }
    }
    function onMouseDown(e: MouseEvent) { fireAt(e.clientX, e.clientY); }
    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      if (e.touches[0]) fireAt(e.touches[0].clientX, e.touches[0].clientY);
    }
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });

    /** Control point of the curved axon between neurons i and j. */
    function bend(i: number, j: number) {
      const a = neurons[i], b = neurons[j];
      const lo = Math.min(i, j), hi = Math.max(i, j);
      const k = (hash(lo, hi) - 0.5) * 0.45 * (i < j ? 1 : -1);
      return { x: (a.x + b.x) / 2 - (b.y - a.y) * k, y: (a.y + b.y) / 2 + (b.x - a.x) * k };
    }
    const at = (a: Neuron, c: { x: number; y: number }, b: Neuron, u: number) => ({
      x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * c.x + u * u * b.x,
      y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * c.y + u * u * b.y,
    });

    let raf = 0, last = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dtRaw = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      if (w === 0) return;
      const o = optionsRef.current;
      if (neurons.length !== Math.max(2, o.nodeCount)) init();
      const dt = o.animated ? dtRaw * o.speed : 0;
      t += dt;

      const node = hexToRgbString(o.nodeColor);
      const edge = hexToRgbString(o.edgeColor);
      const sig = hexToRgbString(o.signalColor);
      const bgc = hexToRgbString(o.backgroundColor);

      // drift
      for (const n of neurons) {
        const ws = o.wander ? o.wanderSpeed : 0;
        n.x = n.bx * w + (noise1(t * 0.15 * ws + n.seed) - 0.5) * 60 * ws * 2;
        n.y = n.by * h + (noise1(t * 0.15 * ws + n.seed + 50) - 0.5) * 60 * ws * 2;
        n.flash *= Math.exp(-dt * 2.4);
        n.ring = Math.max(0, n.ring - dt * 1.6);
        n.refractory = Math.max(0, n.refractory - dt);
        const hv = mouse.inside && o.interactive ? Math.max(0, 1 - Math.hypot(n.x - mouse.x, n.y - mouse.y) / 70) : 0;
        n.hover += (hv - n.hover) * Math.min(1, dtRaw * 10);
      }

      // wiring: neighbours within reach, at most a handful each
      edges = [];
      adj = neurons.map(() => []);
      const R = o.connectionRadius;
      for (let i = 0; i < neurons.length; i++) {
        const cands: [number, number][] = [];
        for (let j = 0; j < neurons.length; j++) {
          if (i === j) continue;
          const d = Math.hypot(neurons[i].x - neurons[j].x, neurons[i].y - neurons[j].y);
          if (d < R) cands.push([d, j]);
        }
        cands.sort((a, b) => a[0] - b[0]);
        for (const [, j] of cands.slice(0, 4)) {
          if (!adj[i].includes(j)) { adj[i].push(j); }
          if (!adj[j].includes(i)) { adj[j].push(i); }
          if (i < j) edges.push([i, j]);
          else if (!edges.some(([a, b]) => a === j && b === i)) edges.push([j, i]);
        }
      }

      // spontaneous firing
      sinceFire += dt * 1000;
      if (o.animated && sinceFire > o.pulseInterval) {
        sinceFire = 0;
        fire(Math.floor(Math.random() * neurons.length), 1);
      }

      // background: deep tissue and drifting dust
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.hypot(w, h) / 2);
      bg.addColorStop(0, `rgb(${mix(bgc, edge, 0.12)})`);
      bg.addColorStop(1, `rgb(${bgc})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      for (const d of dust) {
        ctx.fillStyle = `rgba(${node},${0.08 + 0.12 * d.z * (0.5 + 0.5 * Math.sin(t + d.p))})`;
        ctx.beginPath();
        ctx.arc(((d.x * w + t * 4 * d.z) % w + w) % w, d.y * h, 0.5 + d.z, 0, Math.PI * 2);
        ctx.fill();
      }

      // axons
      ctx.lineCap = "round";
      for (const [i, j] of edges) {
        const a = neurons[i], b = neurons[j];
        const c = bend(i, j);
        const lit = Math.max(a.hover, b.hover, a.flash * 0.6, b.flash * 0.6);
        ctx.strokeStyle = `rgba(${mix(edge, node, lit)},${0.34 + lit * 0.5})`;
        ctx.lineWidth = o.lineWidth * (0.8 + lit * 0.9);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(c.x, c.y, b.x, b.y);
        ctx.stroke();
      }

      // signals: comets running along the axons
      ctx.globalCompositeOperation = "lighter";
      for (let s = signals.length - 1; s >= 0; s--) {
        const sg = signals[s];
        const a = neurons[sg.a], b = neurons[sg.b];
        if (!a || !b) { signals.splice(s, 1); continue; }
        const c = bend(sg.a, sg.b);
        const len = Math.hypot(b.x - a.x, b.y - a.y) + 1;
        sg.prog += (dt * 260) / len;
        if (sg.prog >= 1) { signals.splice(s, 1); fire(sg.b, sg.energy); continue; }
        const p = at(a, c, b, sg.prog);
        sg.trail.push(p);
        if (sg.trail.length > 9) sg.trail.shift();
        ctx.strokeStyle = `rgba(${sig},${0.5 * sg.energy})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        sg.trail.forEach((q, k) => (k ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
        ctx.stroke();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9);
        g.addColorStop(0, `rgba(255,255,255,${sg.energy})`);
        g.addColorStop(0.3, `rgba(${sig},${0.8 * sg.energy})`);
        g.addColorStop(1, `rgba(${sig},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // neurons: dendrites, soma, nucleus, firing ring
      const r0 = o.nodeRadius;
      for (const n of neurons) {
        const act = Math.max(n.flash, n.hover);
        ctx.strokeStyle = `rgba(${mix(node, sig, n.flash * 0.6)},${0.35 + act * 0.45})`;
        ctx.lineWidth = 0.9;
        for (const line of n.dendrites) {
          ctx.beginPath();
          line.forEach(([x, y], k) => (k ? ctx.lineTo(n.x + x, n.y + y) : ctx.moveTo(n.x + x, n.y + y)));
          ctx.stroke();
        }
        if (o.glowEffect) {
          ctx.globalCompositeOperation = "lighter";
          const hr = r0 * (3 + act * 3) * (0.6 + o.glowBlur / 25);
          const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, hr);
          halo.addColorStop(0, `rgba(${mix(node, sig, n.flash)},${0.3 + act * 0.5})`);
          halo.addColorStop(1, `rgba(${node},0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(n.x, n.y, hr, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
        }
        const soma = ctx.createRadialGradient(n.x - r0 * 0.3, n.y - r0 * 0.3, 0, n.x, n.y, r0 * 1.4);
        soma.addColorStop(0, `rgb(${mix(node, "255,255,255", 0.55 + n.flash * 0.4)})`);
        soma.addColorStop(1, `rgb(${mix(node, sig, n.flash)})`);
        ctx.fillStyle = soma;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r0 * (1.2 + n.flash * 0.3), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${mix(bgc, node, 0.25)},0.85)`;
        ctx.beginPath();
        ctx.arc(n.x + r0 * 0.15, n.y + r0 * 0.1, r0 * 0.42, 0, Math.PI * 2);
        ctx.fill();
        if (n.ring > 0) {
          ctx.strokeStyle = `rgba(${sig},${n.ring * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r0 * 1.4 + (1 - n.ring) * 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("touchstart", onTouchStart);
    };
  }, [canvasRef]);
}
