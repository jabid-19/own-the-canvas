import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";
import { pointerInCanvas } from "../../runtime/fx";

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

interface Node { bx: number; by: number; ox: number; oy: number; vx: number; vy: number; f: number }
interface Dew { seg: number; u: number; r: number }
interface Pt { x: number; y: number }

const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};

/** Ray from `o` along `d` against segment p→q; returns t along the ray or Infinity. */
function raySeg(o: Pt, d: Pt, p: Pt, q: Pt): number {
  const ex = q.x - p.x, ey = q.y - p.y;
  const den = d.x * ey - d.y * ex;
  if (Math.abs(den) < 1e-9) return Infinity;
  const t = ((p.x - o.x) * ey - (p.y - o.y) * ex) / den;
  const s = ((p.x - o.x) * d.y - (p.y - o.y) * d.x) / den;
  return t > 0 && s >= 0 && s <= 1 ? t : Infinity;
}

/**
 * An orb weaver's web at night. Irregular frame silk is bridged to the edges, radii run
 * from the hub to the frame, and one continuous capture spiral sags between them in the
 * familiar scallops. Every junction is a spring, so wind sways the web and the cursor
 * plucks it; strands shimmer as their angle to the moonlight changes, dew beads catch the
 * light, and the spider walks over to whatever disturbed the web, then back to the hub.
 */
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
    let w = 0, h = 0, scale = 1;

    let hub: Pt = { x: 0, y: 0 };
    let frame: Pt[] = [];
    let bridges: [Pt, Pt][] = [];
    let spokeEnds: Pt[] = [];
    let nodes: Node[] = [];
    let dews: Dew[] = [];
    let bokeh: { x: number; y: number; r: number; a: number }[] = [];
    let S = 0, T = 0, key = "";
    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999 };
    const spider = { x: 0, y: 0, tx: 0, ty: 0, heading: Math.PI / 2, walk: 0, lastActive: -99 };

    function build() {
      const o = optionsRef.current;
      S = Math.max(5, Math.round(o.spokeCount));
      T = Math.max(3, Math.round(o.ringCount));
      key = `${S}|${T}|${w}|${h}`;
      let seed = 11;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

      scale = Math.min(w, h) / 420;
      hub = { x: w * 0.5, y: h * 0.48 };
      const rx = Math.min(w * 0.44, h * 0.8), ry = h * 0.44;

      // frame: an uneven polygon of silk around the orb
      const m = 7;
      frame = Array.from({ length: m }, (_, k) => {
        const a = (k / m) * Math.PI * 2 + (rnd() - 0.5) * 0.35;
        const j = 0.95 + rnd() * 0.12;
        return { x: hub.x + Math.cos(a) * rx * j, y: hub.y + Math.sin(a) * ry * j };
      });
      // bridge lines from each frame corner out to the canvas edge
      bridges = frame.map((f) => {
        const d = { x: f.x - hub.x, y: f.y - hub.y };
        let t = Infinity;
        if (d.x > 0) t = Math.min(t, (w - f.x) / d.x);
        if (d.x < 0) t = Math.min(t, -f.x / d.x);
        if (d.y > 0) t = Math.min(t, (h - f.y) / d.y);
        if (d.y < 0) t = Math.min(t, -f.y / d.y);
        return [f, { x: f.x + d.x * t, y: f.y + d.y * t }];
      });

      // radii: from the hub to where they meet the frame
      spokeEnds = [];
      const lens: number[] = [];
      const dirs: Pt[] = [];
      for (let i = 0; i < S; i++) {
        const a = (i / S) * Math.PI * 2 + (rnd() - 0.5) * 0.12;
        const d = { x: Math.cos(a), y: Math.sin(a) };
        let best = Infinity;
        for (let k = 0; k < m; k++) best = Math.min(best, raySeg(hub, d, frame[k], frame[(k + 1) % m]));
        if (!isFinite(best)) best = Math.min(rx, ry);
        dirs.push(d);
        lens.push(best);
        spokeEnds.push({ x: hub.x + d.x * best, y: hub.y + d.y * best });
      }

      // capture spiral nodes, one per (turn, radius), climbing outward
      nodes = [];
      for (let k = 0; k < T; k++) {
        for (let i = 0; i < S; i++) {
          const f = (k + i / S) / T;
          const r = lens[i] * (0.17 + 0.77 * f);
          nodes.push({ bx: hub.x + dirs[i].x * r, by: hub.y + dirs[i].y * r, ox: 0, oy: 0, vx: 0, vy: 0, f: 0.17 + 0.77 * f });
        }
      }

      dews = [];
      for (let s = 0; s < nodes.length - 1; s++) {
        if (rnd() < 0.45) {
          const n = 1 + Math.floor(rnd() * 3);
          for (let q = 0; q < n; q++) dews.push({ seg: s, u: 0.15 + rnd() * 0.7, r: (0.9 + rnd() * 1.6) * Math.max(0.7, scale) });
        }
      }

      bokeh = Array.from({ length: 12 }, () => ({ x: rnd() * w, y: rnd() * h, r: (18 + rnd() * 50) * Math.max(0.6, scale), a: 0.03 + rnd() * 0.05 }));
      spider.x = spider.tx = hub.x;
      spider.y = spider.ty = hub.y;
    }

    function applySize(width: number, height: number) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = width; h = height;
      build();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applySize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applySize(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      const p = pointerInCanvas(e, canvas!);
      if (!p) return onMouseLeave();
      mouse.px = mouse.x < -9000 ? p.x : mouse.x;
      mouse.py = mouse.y < -9000 ? p.y : mouse.y;
      mouse.x = p.x;
      mouse.y = p.y;
    }
    function onMouseLeave() { mouse.x = mouse.y = mouse.px = mouse.py = -9999; }
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    const pos = (n: Node): Pt => ({ x: n.bx + n.ox, y: n.by + n.oy });
    // the spiral sags slightly toward the hub between radii
    const ctrl = (a: Pt, b: Pt, hb: Pt): Pt => {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      return { x: mx + (hb.x - mx) * 0.07, y: my + (hb.y - my) * 0.07 };
    };
    const quadAt = (a: Pt, c: Pt, b: Pt, u: number): Pt => ({
      x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * c.x + u * u * b.x,
      y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * c.y + u * u * b.y,
    });

    function drawSpider(sp: typeof spider, body: string, glow: string, t: number, moving: boolean) {
      const s = 2 * Math.max(0.65, scale);
      const hx = Math.cos(sp.heading), hy = Math.sin(sp.heading);
      const px = -hy, py = hx;
      const at = (f: number, side: number) => ({ x: sp.x + hx * f * s + px * side * s, y: sp.y + hy * f * s + py * side * s });

      // eight long legs splayed from the cephalothorax: two pairs reach forward, two back
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const legs: [number, number, number][] = [[0.5, 16, -0.55], [1.05, 13, -0.35], [2.05, 11, 0.4], [2.6, 14, 0.5]];
      const root = at(1.8, 0);
      for (const side of [-1, 1]) {
        legs.forEach(([a, len, bend], i) => {
          const gait = moving ? Math.sin(sp.walk + i * 1.6 + (side > 0 ? Math.PI : 0)) * 0.18 : 0;
          const ang = sp.heading + side * (a + gait);
          const knee = { x: root.x + Math.cos(ang) * len * 0.55 * s, y: root.y + Math.sin(ang) * len * 0.55 * s };
          const ang2 = ang + side * bend;
          const tip = { x: knee.x + Math.cos(ang2) * len * 0.7 * s, y: knee.y + Math.sin(ang2) * len * 0.7 * s };
          ctx.beginPath();
          ctx.moveTo(root.x, root.y);
          ctx.lineTo(knee.x, knee.y);
          ctx.lineTo(tip.x, tip.y);
          ctx.strokeStyle = `rgba(${mix(body, glow, 0.2)},1)`;
          ctx.lineWidth = 1.1 * s;
          ctx.stroke();
          ctx.strokeStyle = `rgba(${mix(body, glow, 0.6)},0.55)`;
          ctx.lineWidth = 0.4 * s;
          ctx.stroke();
        });
      }

      // abdomen behind, cephalothorax ahead
      const ab = at(-8.5, 0);
      ctx.save();
      ctx.translate(ab.x, ab.y);
      ctx.rotate(sp.heading);
      const g = ctx.createRadialGradient(-2 * s, -3 * s, 0.5 * s, 0, 0, 9 * s);
      g.addColorStop(0, `rgba(${mix(body, glow, 0.55)},1)`);
      g.addColorStop(1, `rgba(${body},1)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, 8.5 * s, 6.5 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(${glow},0.7)`; // moonlit rim
      ctx.lineWidth = 0.6 * s;
      ctx.stroke();
      // folium: the chevron markings on an orb weaver's back
      ctx.strokeStyle = `rgba(${glow},0.65)`;
      ctx.lineWidth = 0.9 * s;
      for (let k = 0; k < 3; k++) {
        const x = -4.5 * s + k * 3 * s;
        ctx.beginPath();
        ctx.moveTo(x - 1.6 * s, -2.6 * s);
        ctx.lineTo(x + 0.8 * s, 0);
        ctx.lineTo(x - 1.6 * s, 2.6 * s);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.ellipse(-1.5 * s, -2.8 * s, 3.5 * s, 1.4 * s, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const ce = at(1.8, 0);
      ctx.save();
      ctx.translate(ce.x, ce.y);
      ctx.rotate(sp.heading);
      ctx.fillStyle = `rgba(${mix(body, "0,0,0", 0.15)},1)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.2 * s, 3.4 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(${glow},0.6)`;
      ctx.lineWidth = 0.5 * s;
      ctx.stroke();
      ctx.fillStyle = `rgba(${glow},0.95)`;
      for (const e of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(3 * s, e * 1.1 * s, 0.7 * s, 0.7 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    let raf = 0, last = 0, t = 0;
    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      if (w === 0) return;
      const o = optionsRef.current;
      if (`${Math.max(5, Math.round(o.spokeCount))}|${Math.max(3, Math.round(o.ringCount))}|${w}|${h}` !== key) build();

      const web = hexToRgbString(o.webColor);
      const glow = hexToRgbString(o.glowColor);
      const bgc = hexToRgbString(o.backgroundColor);
      const body = hexToRgbString(o.spiderColor);

      // sky
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, Math.hypot(w, h) * 0.6);
      bg.addColorStop(0, `rgb(${mix(bgc, glow, 0.12)})`);
      bg.addColorStop(1, `rgb(${bgc})`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      const moon = { x: w * 0.86, y: h * 0.17 };
      ctx.globalCompositeOperation = "lighter";
      const mg = ctx.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, h * 0.55);
      mg.addColorStop(0, `rgba(${glow},0.22)`);
      mg.addColorStop(1, `rgba(${glow},0)`);
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, w, h);
      for (const b of bokeh) {
        const bg2 = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        bg2.addColorStop(0, `rgba(${glow},${b.a})`);
        bg2.addColorStop(0.75, `rgba(${glow},${b.a * 0.6})`);
        bg2.addColorStop(1, `rgba(${glow},0)`);
        ctx.fillStyle = bg2;
        ctx.beginPath();
        ctx.arc(b.x + Math.sin(t * 0.1 + b.r) * 6, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${mix(glow, "255,255,255", 0.7)},0.55)`;
      ctx.beginPath();
      ctx.arc(moon.x, moon.y, 14 * Math.max(0.7, scale), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // physics: each junction springs toward a wind-swayed rest position
      const sway = o.swaySpeed;
      const windX = (Math.sin(t * 0.55 * sway) * 0.7 + Math.sin(t * 1.6 * sway + 1) * 0.3) * 6 * scale;
      const windY = Math.sin(t * 0.8 * sway + 2) * 2.5 * scale;
      const active = o.interactive && mouse.x > -9000;
      const R = o.disturbRadius;
      const flick = active ? Math.min(40, Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py)) : 0;
      for (const n of nodes) {
        const belly = Math.sin(Math.PI * Math.min(1, n.f));
        let tx = windX * belly, ty = windY * belly;
        if (active) {
          const dx = n.bx + n.ox - mouse.x, dy = n.by + n.oy - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < R && d > 0.01) {
            const k = (1 - d / R) ** 2;
            tx += (dx / d) * k * 16;
            ty += (dy / d) * k * 16;
            n.vx += (dx / d) * k * flick * 6;
            n.vy += (dy / d) * k * flick * 6;
          }
        }
        n.vx += (-(n.ox - tx) * 70 - n.vx * 5) * dt;
        n.vy += (-(n.oy - ty) * 70 - n.vy * 5) * dt;
        n.ox += n.vx * dt;
        n.oy += n.vy * dt;
      }
      mouse.px = mouse.x; mouse.py = mouse.y;
      const hubP = { x: hub.x + windX * 0.15, y: hub.y + windY * 0.15 };

      // strands
      const lightAng = Math.atan2(moon.y - hub.y, moon.x - hub.x);
      ctx.lineCap = "round";
      ctx.strokeStyle = `rgba(${web},0.5)`;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (const [a, b] of bridges) { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
      frame.forEach((f, k) => {
        const n = frame[(k + 1) % frame.length];
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(n.x, n.y);
      });
      ctx.stroke();

      ctx.strokeStyle = `rgba(${web},0.62)`;
      ctx.lineWidth = 0.85;
      for (let i = 0; i < S; i++) {
        ctx.beginPath();
        ctx.moveTo(hubP.x, hubP.y);
        for (let k = 0; k < T; k++) {
          const p = pos(nodes[k * S + i]);
          ctx.lineTo(p.x, p.y);
        }
        ctx.lineTo(spokeEnds[i].x, spokeEnds[i].y);
        ctx.stroke();
      }

      // hub: a little tangle of tight loops
      ctx.strokeStyle = `rgba(${web},0.55)`;
      ctx.lineWidth = 0.7;
      for (const rr of [0.035, 0.065, 0.095]) {
        ctx.beginPath();
        for (let i = 0; i <= S; i++) {
          const e = spokeEnds[i % S];
          const x = hubP.x + (e.x - hub.x) * rr, y = hubP.y + (e.y - hub.y) * rr;
          if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }

      // capture spiral, shimmering with its angle to the moonlight
      const tint = mix(web, glow, 0.6);
      for (let s = 0; s < nodes.length - 1; s++) {
        const a = pos(nodes[s]), b = pos(nodes[s + 1]);
        const c = ctrl(a, b, hubP);
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const sh = Math.abs(Math.cos(ang - lightAng + t * 0.25));
        ctx.strokeStyle = `rgba(${sh > 0.75 ? mix(tint, "255,255,255", 0.35) : web},${0.32 + sh * 0.45})`;
        ctx.lineWidth = 0.7 + sh * 0.35;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(c.x, c.y, b.x, b.y);
        ctx.stroke();
      }

      // dew beads: dark lens, lit rim, bright highlight
      if (o.dewDrops) {
        const hi = mix(glow, "255,255,255", 0.75);
        for (const d of dews) {
          const a = pos(nodes[d.seg]), b = pos(nodes[d.seg + 1]);
          const p = quadAt(a, ctrl(a, b, hubP), b, d.u);
          const tw = 0.6 + 0.4 * Math.sin(t * 2 + d.seg * 1.7 + d.u * 9);
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = `rgba(${glow},${0.12 * tw})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, d.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = `rgba(${mix(bgc, glow, 0.35)},0.85)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, d.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(${glow},0.75)`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.fillStyle = `rgba(${hi},${0.6 + 0.4 * tw})`;
          ctx.beginPath();
          ctx.arc(p.x - d.r * 0.35, p.y - d.r * 0.35, Math.max(0.4, d.r * 0.38), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // the spider walks to a disturbance, then back to the hub
      if (o.showSpider) {
        const inWeb = active && Math.hypot((mouse.x - hub.x) / (w * 0.44), (mouse.y - hub.y) / (h * 0.44)) < 1;
        if (inWeb) {
          spider.tx = hub.x + (mouse.x - hub.x) * 0.85;
          spider.ty = hub.y + (mouse.y - hub.y) * 0.85;
          spider.lastActive = t;
        } else if (t - spider.lastActive > 2.5) {
          spider.tx = hubP.x;
          spider.ty = hubP.y;
        }
        const dx = spider.tx - spider.x, dy = spider.ty - spider.y;
        const d = Math.hypot(dx, dy);
        const moving = d > 2;
        if (moving) {
          const step = Math.min(d, 75 * Math.max(0.7, scale) * dt);
          spider.x += (dx / d) * step;
          spider.y += (dy / d) * step;
          spider.walk += step * 0.35;
          const want = Math.atan2(dy, dx);
          let diff = want - spider.heading;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          spider.heading += diff * Math.min(1, dt * 6);
        } else {
          let diff = Math.PI / 2 - spider.heading; // resting head-down at the hub
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          spider.heading += diff * Math.min(1, dt * 2);
        }
        drawSpider(spider, body, glow, t, moving);
      }
    }
    raf = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
