import { useRef, useEffect, RefObject } from "react";

export interface UseLSystemOptions {
  axiom: string;
  rules: Record<string, string>;
  iterations: number;
  angle: number;
  lineWidth: number;
  color: string;
  backgroundColor: string;
  speed: number;
  autoReset: boolean;
  trailFade: number;
  glowEffect: boolean;
  glowBlur: number;
}

const MAX_STRING_LENGTH = 250_000;

function expandLSystem(axiom: string, rules: Record<string, string>, iterations: number): string {
  let str = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const ch of str) {
      const replacement = rules[ch];
      if (replacement) {
        next += replacement;
      } else {
        next += ch;
      }
      if (next.length >= MAX_STRING_LENGTH) {
        next = next.slice(0, MAX_STRING_LENGTH);
        break;
      }
    }
    str = next;
    if (str.length >= MAX_STRING_LENGTH) break;
  }
  return str;
}

interface Built {
  segs: Float32Array;   // x1,y1,x2,y2 per segment, in canvas px
  depth: Uint8Array;    // branch depth (bracket nesting) per segment
  tip: Uint8Array;      // 1 where a segment ends a branch: that's where leaves go
  maxDepth: number;
  upright: boolean;     // a plant growing up from the ground, vs a flat fractal
  baseY: number;
}

function buildSegments(str: string, angleRad: number, w: number, h: number): Built {
  let x = 0, y = 0, a = -Math.PI / 2;
  const stack: { x: number; y: number; a: number }[] = [];
  const raw: number[] = [];
  const dep: number[] = [];
  const tip: number[] = [];
  let lastSeg = -1;
  for (const ch of str) {
    switch (ch) {
      case "F":
      case "G": {
        const nx = x + Math.cos(a), ny = y + Math.sin(a);
        raw.push(x, y, nx, ny);
        dep.push(stack.length);
        tip.push(0);
        lastSeg = dep.length - 1;
        x = nx; y = ny;
        break;
      }
      case "f": x += Math.cos(a); y += Math.sin(a); break;
      case "+": a += angleRad; break;
      case "-": a -= angleRad; break;
      case "[": stack.push({ x, y, a }); break;
      case "]": {
        if (lastSeg >= 0) tip[lastSeg] = 1;
        lastSeg = -1;
        const s = stack.pop();
        if (s) { x = s.x; y = s.y; a = s.a; }
        break;
      }
    }
  }
  if (lastSeg >= 0) tip[lastSeg] = 1;
  const empty = { segs: new Float32Array(0), depth: new Uint8Array(0), tip: new Uint8Array(0), maxDepth: 0, upright: false, baseY: h };
  if (raw.length === 0) return empty;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < raw.length; i += 4) {
    minX = Math.min(minX, raw[i], raw[i + 2]); maxX = Math.max(maxX, raw[i], raw[i + 2]);
    minY = Math.min(minY, raw[i + 1], raw[i + 3]); maxY = Math.max(maxY, raw[i + 1], raw[i + 3]);
  }
  const bbW = maxX - minX || 1, bbH = maxY - minY || 1;
  const upright = minY < 0 && maxY >= -0.1 && stack.length === 0 && dep.some((d) => d > 0);
  const scale = Math.min((w * 0.88) / bbW, (h * (upright ? 0.82 : 0.88)) / bbH);
  const offsetX = w / 2 - ((minX + maxX) / 2) * scale;
  const offsetY = upright ? h * 0.9 - maxY * scale : h / 2 - ((minY + maxY) / 2) * scale;
  const segs = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i += 4) {
    segs[i] = raw[i] * scale + offsetX; segs[i + 1] = raw[i + 1] * scale + offsetY;
    segs[i + 2] = raw[i + 2] * scale + offsetX; segs[i + 3] = raw[i + 3] * scale + offsetY;
  }
  let maxDepth = 0;
  for (const d of dep) maxDepth = Math.max(maxDepth, d);
  return { segs, depth: Uint8Array.from(dep), tip: Uint8Array.from(tip), maxDepth, upright, baseY: maxY * scale + offsetY };
}

const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",");
function hexRgb(hex: string): number[] {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const n = parseInt(c.slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Grows an L-system as a living plant. Branches remember how deep they sit, so trunks are
 * thick bark and twigs are thin and bright; leaves (and the odd blossom) sit at branch tips;
 * an upright plant sways in the wind on a mound of grass while petals drift past. Flat
 * fractals (dragon curve, snowflake) are drawn with a colour gradient along the curve.
 */
export function useLSystem(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseLSystemOptions
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
    let built: Built | null = null;
    let hash = "";
    let drawn = 0, wait = -1, fade = 1, cycles = 0;
    const petals = Array.from({ length: 18 }, () => ({ x: Math.random(), y: Math.random(), s: 0.6 + Math.random(), p: Math.random() * 6 }));

    const computeHash = () => {
      const { axiom, rules, iterations, angle } = optionsRef.current;
      return `${axiom}|${JSON.stringify(rules)}|${iterations}|${angle}|${w}|${h}`;
    };
    function rebuild() {
      const { axiom, rules, iterations, angle } = optionsRef.current;
      built = buildSegments(expandLSystem(axiom, rules, iterations), (angle * Math.PI) / 180, w, h);
      hash = computeHash();
      drawn = 0; wait = -1; fade = 1; cycles = 0; // new shape: no ghost of the old one
    }
    function resize(width: number, height: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = width; h = height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      rebuild();
    }
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let raf = 0, last = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dtMs = last ? Math.min(now - last, 50) : 16;
      last = now;
      t += dtMs / 1000;
      if (w === 0) return;
      const o = optionsRef.current;
      if (computeHash() !== hash) rebuild();
      const b = built!;
      const n = b.segs.length / 4;

      // grow, hold, fade, regrow
      if (wait < 0) {
        drawn = Math.min(n, drawn + Math.max(1, o.speed * 3 * (dtMs / 16)));
        if (drawn >= n && o.autoReset) wait = 3500;
      } else if (!o.autoReset) {
        wait = -1; fade = 1; // switched off mid-hold: stay finished
      } else {
        wait -= dtMs;
        if (wait < 1200) fade = Math.max(o.trailFade, wait / 1200);
        if (wait <= 0) { drawn = 0; wait = -1; fade = 1; cycles++; }
      }

      const leafC = hexRgb(o.color);
      const bark = mix(leafC, [74, 50, 32], 0.78).split(",").map(Number);
      const bgC = hexRgb(o.backgroundColor);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, `rgb(${mix(bgC, leafC, 0.1)})`);
      bg.addColorStop(1, `rgb(${o.backgroundColor === "transparent" ? "0,0,0" : bgC.join(",")})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      if (b.upright) {
        // a mound of grass under the trunk
        const g = ctx.createRadialGradient(w / 2, b.baseY + h * 0.06, 0, w / 2, b.baseY + h * 0.06, w * 0.45);
        g.addColorStop(0, `rgba(${mix(leafC, [20, 30, 15], 0.6)},0.9)`);
        g.addColorStop(1, `rgba(${mix(leafC, [20, 30, 15], 0.6)},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(w / 2, b.baseY + h * 0.06, w * 0.45, h * 0.09, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // wind sway: higher and deeper branches move more
      const sway = (x: number, y: number, d: number) => {
        if (!b.upright) return x;
        const height = Math.max(0, (b.baseY - y) / h);
        return x + Math.sin(t * 1.1 + y * 0.012) * height * height * 14 * (0.4 + d / (b.maxDepth + 1));
      };

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const end = Math.floor(drawn);
      // trailFade: the previous cycle stays as a ghost while the next one regrows
      if (o.trailFade > 0 && cycles > 0 && end < n) paint(end, n, Math.min(1, o.trailFade));
      paint(0, end, fade);
      ctx.globalAlpha = 1;

      function paint(from: number, end: number, alpha: number) {
      ctx.globalAlpha = alpha;
      if (b.upright) {
        // one path per depth level, thick bark at the trunk to thin green twigs
        for (let d = 0; d <= b.maxDepth; d++) {
          const k = b.maxDepth ? d / b.maxDepth : 1;
          ctx.beginPath();
          for (let i = from; i < end; i++) {
            if (b.depth[i] !== d) continue;
            const j = i * 4;
            ctx.moveTo(sway(b.segs[j], b.segs[j + 1], d), b.segs[j + 1]);
            ctx.lineTo(sway(b.segs[j + 2], b.segs[j + 3], d), b.segs[j + 3]);
          }
          ctx.strokeStyle = `rgb(${mix(bark, leafC, Math.pow(k, 1.4))})`;
          ctx.lineWidth = o.lineWidth * Math.max(0.7, (b.maxDepth - d + 1) * 1.05);
          ctx.stroke();
        }
        // leaves and the odd blossom at branch tips
        const blossom = [242, 181, 166];
        for (let i = from; i < end; i++) {
          if (!b.tip[i]) continue;
          const j = i * 4;
          const d = b.depth[i];
          const x = sway(b.segs[j + 2], b.segs[j + 3], d), y = b.segs[j + 3];
          const ang = Math.atan2(b.segs[j + 3] - b.segs[j + 1], b.segs[j + 2] - b.segs[j]);
          const isBloom = (i * 2654435761) % 11 === 0;
          const sz = 2.2 + o.lineWidth * 1.2 + ((i * 7) % 5) * 0.35;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(ang + Math.sin(t * 2 + i) * 0.15);
          ctx.fillStyle = isBloom ? `rgb(${blossom.join(",")})` : `rgb(${mix(leafC, [255, 255, 200], ((i * 13) % 7) / 20)})`;
          ctx.beginPath();
          if (isBloom) {
            for (let p = 0; p < 5; p++) {
              ctx.ellipse(Math.cos((p * Math.PI * 2) / 5) * sz * 0.55, Math.sin((p * Math.PI * 2) / 5) * sz * 0.55, sz * 0.5, sz * 0.32, (p * Math.PI * 2) / 5, 0, Math.PI * 2);
            }
          } else {
            ctx.ellipse(sz * 0.6, 0, sz, sz * 0.42, 0, 0, Math.PI * 2);
          }
          ctx.fill();
          ctx.restore();
          if (o.glowEffect) {
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = `rgba(${leafC.join(",")},${0.12 * alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, sz + o.glowBlur * 0.6, 0, Math.PI * 2); // ≈ sz*2.2 at the default blur
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
          }
        }
      } else {
        // flat fractal: colour shifts along the curve, in a handful of batched strokes
        const bands = 24;
        const per = Math.max(1, Math.ceil(n / bands));
        for (let s = Math.floor(from / per); s * per < end; s++) {
          ctx.beginPath();
          for (let i = Math.max(from, s * per); i < Math.min(end, (s + 1) * per); i++) {
            const j = i * 4;
            ctx.moveTo(b.segs[j], b.segs[j + 1]);
            ctx.lineTo(b.segs[j + 2], b.segs[j + 3]);
          }
          const k = s / bands;
          ctx.strokeStyle = `rgb(${mix(leafC, [255, 214, 120], Math.sin(k * Math.PI) * 0.6)})`;
          ctx.lineWidth = o.lineWidth * 1.3;
          if (o.glowEffect) { ctx.shadowColor = o.color; ctx.shadowBlur = o.glowBlur; }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
      }

      if (b.upright) {
        for (const p of petals) {
          const x = ((p.x * w + t * 18 * p.s) % (w + 20)) - 10;
          const y = ((p.y * h + t * 10 * p.s + Math.sin(t + p.p) * 8) % (h + 20)) - 10;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(t * p.s + p.p);
          ctx.fillStyle = `rgba(242,181,166,${0.55 * fade})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, 3 * p.s, 1.6 * p.s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [canvasRef]);
}
