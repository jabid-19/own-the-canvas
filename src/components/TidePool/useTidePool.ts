import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, createVelocity } from "../../runtime/fx";
import { mixRgb as mix, rgbOf } from "../../utils/color";
import { noise2 } from "../../runtime/noise";
import { drawCaustics, type CausticCache } from "../../runtime/caustics";

export interface UseTidePoolOptions {
  waterColor: string;
  rockColor: string;
  anemoneColor: string;
  starfishColor: string;
  fishCount: number;
  anemoneCount: number;
  causticIntensity: number;
  interactive: boolean;
}

interface Anemone { x: number; y: number; r: number; open: number; seed: number; shut: boolean }
interface Star { x: number; y: number; r: number; a: number; seed: number }
interface Fish { x: number; y: number; a: number; v: number; s: number; seed: number; tail: number }
interface Ring { x: number; y: number; age: number; big: boolean }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Anemone hysteresis: shut when something comes within 1.4 radii, reopen only once it is
 * past 2.2 radii, so a cursor resting on the edge doesn't make it flutter.
 */
export function anemoneShut(d: number, r: number, shut: boolean): boolean {
  return shut ? d < r * 2.2 : d < r * 1.4;
}

/**
 * A rock pool seen from above: sunlight caustics ripple over pebbles, sea anemones sway their
 * tentacles and snap shut when the cursor comes close, starfish slowly curl their arms and
 * little fish dart away from your hand. Moving the cursor stirs ripples; tapping splashes.
 */
export function useTidePool(options: UseTidePoolOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const velocity = useRef(createVelocity());
  const s = useRef({
    t: 0, w: 0, h: 0, rockKey: "",
    anemones: [] as Anemone[], stars: [] as Star[], fish: [] as Fish[], rings: [] as Ring[], wake: 0,
  });
  const floor = useRef<HTMLCanvasElement | null>(null);
  const caustic = useRef<CausticCache | null>(null);

  function layout(w: number, h: number) {
    const st = s.current;
    st.w = w; st.h = h; st.rockKey = "";
    const U = Math.min(w, h);
    st.stars = Array.from({ length: 2 }, (_, i) => ({ x: w * (0.25 + i * 0.5) + (Math.random() - 0.5) * w * 0.1, y: h * (0.3 + i * 0.4), r: U * (0.09 + Math.random() * 0.03), a: Math.random() * Math.PI, seed: Math.random() * 100 }));
    st.anemones = [];
    st.fish = [];
  }

  /** Pebbles, sand and crevices, painted once per size or rock color. */
  function paintFloor(w: number, h: number, rock: string) {
    if (typeof document === "undefined") return;
    const c = floor.current ?? document.createElement("canvas");
    floor.current = c;
    c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h));
    const g = c.getContext("2d");
    if (!g) return;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    g.fillStyle = `rgb(${mix(rock, "210,190,150", 0.35)})`; // sand
    g.fillRect(0, 0, w, h);
    const U = Math.min(w, h);
    for (let i = 0; i < 14; i++) { // boulders
      const x = rnd() * w, y = rnd() * h, r = U * (0.06 + rnd() * 0.12);
      const shade = 0.1 + rnd() * 0.2;
      const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      gr.addColorStop(0, `rgb(${mix(rock, "255,255,255", shade * 0.5)})`);
      gr.addColorStop(1, `rgb(${mix(rock, "0,0,0", shade)})`);
      g.fillStyle = gr;
      g.beginPath(); g.ellipse(x, y, r, r * (0.6 + rnd() * 0.4), rnd() * Math.PI, 0, Math.PI * 2); g.fill();
      g.fillStyle = `rgba(${mix(rock, "60,120,60", 0.6)},0.35)`; // algae film
      g.beginPath(); g.ellipse(x + r * 0.2, y + r * 0.1, r * 0.5, r * 0.3, rnd() * Math.PI, 0, Math.PI * 2); g.fill();
    }
    for (let i = 0; i < 260; i++) { // pebbles
      const x = rnd() * w, y = rnd() * h, r = U * (0.004 + rnd() * 0.014);
      g.fillStyle = `rgb(${mix(mix(rock, "230,220,200", rnd() * 0.6), "0,0,0", rnd() * 0.3)})`;
      g.beginPath(); g.ellipse(x, y, r, r * (0.6 + rnd() * 0.4), rnd() * Math.PI, 0, Math.PI * 2); g.fill();
    }
    for (let i = 0; i < 6; i++) { // shells
      const x = rnd() * w, y = rnd() * h, r = U * 0.012;
      g.strokeStyle = "rgba(255,245,230,0.6)";
      g.lineWidth = 1;
      g.beginPath(); g.arc(x, y, r, Math.PI, 0); for (let j = -2; j <= 2; j++) { g.moveTo(x, y); g.lineTo(x + j * r * 0.45, y - r); } g.stroke();
    }
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const st = s.current;
    const sec = dt / 1000;
    const k = dt / 16.67;
    st.t += sec;
    const t = st.t;
    if (st.w !== w || st.h !== h) layout(w, h);
    const U = Math.min(w, h);

    const water = rgbOf(o.waterColor), rock = rgbOf(o.rockColor);
    const anem = rgbOf(o.anemoneColor), starC = rgbOf(o.starfishColor);
    if (st.rockKey !== rock) { st.rockKey = rock; paintFloor(w, h, rock); }

    const na = clamp(Math.round(o.anemoneCount), 0, 20), nf = clamp(Math.round(o.fishCount), 0, 40);
    while (st.anemones.length < na) {
      const i = st.anemones.length;
      st.anemones.push({ x: w * (((i * 0.618) + 0.15) % 1), y: h * (((i * 0.382) + 0.2) % 1) * 0.8 + h * 0.1, r: U * (0.06 + Math.random() * 0.035), open: 1, seed: Math.random() * 100, shut: false });
    }
    st.anemones.length = na;
    while (st.fish.length < nf) st.fish.push({ x: Math.random() * w, y: Math.random() * h, a: Math.random() * Math.PI * 2, v: 0, s: U * (0.04 + Math.random() * 0.02), seed: Math.random() * 100, tail: 0 });
    st.fish.length = nf;

    const p = readPointer(pointer.current, canvasEl.current);
    const { vx, vy } = velocity.current(p, k);
    const speed = Math.hypot(vx, vy);
    const hand = o.interactive && p.inside;

    // ripples: a wake behind a moving cursor, a splash for a tap
    if (hand && speed > 3) { st.wake -= sec; if (st.wake <= 0) { st.rings.push({ x: p.x, y: p.y, age: 0, big: false }); st.wake = 0.12; } }
    if (o.interactive) {
      for (const tap of p.taps) {
        st.rings.push({ x: tap.x, y: tap.y, age: 0, big: true });
        for (const a of st.anemones) if (Math.hypot(a.x - tap.x, a.y - tap.y) < a.r * 4) a.shut = true;
        for (const f of st.fish) { const d = Math.hypot(f.x - tap.x, f.y - tap.y); if (d < U * 0.4) { f.a = Math.atan2(f.y - tap.y, f.x - tap.x); f.v = U * 1.4; } }
      }
    }
    for (const r of st.rings) r.age += sec;
    st.rings = st.rings.filter((r) => r.age < (r.big ? 2.4 : 1.2));

    // ---- floor, seen through the water ----
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    // refraction: the floor wobbles a little under the waves
    const wob = U * 0.004;
    if (floor.current) ctx.drawImage(floor.current, Math.sin(t * 0.7) * wob, Math.cos(t * 0.6) * wob, w, h);
    else { ctx.fillStyle = `rgb(${rock})`; ctx.fillRect(0, 0, w, h); }

    // ---- starfish, arms slowly curling ----
    for (const sf of st.stars) {
      ctx.save();
      ctx.translate(sf.x, sf.y);
      ctx.rotate(sf.a + Math.sin(t * 0.05 + sf.seed) * 0.1);
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      const arm = (dx: number, dy: number) => {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2, curl = Math.sin(t * 0.4 + sf.seed + i * 1.3) * 0.25;
          const tip = a + curl;
          const r = sf.r, rin = sf.r * 0.32;
          const a0 = a - Math.PI / 5, a1 = a + Math.PI / 5;
          if (i === 0) ctx.moveTo(dx + Math.cos(a0) * rin, dy + Math.sin(a0) * rin);
          ctx.quadraticCurveTo(dx + Math.cos(a - 0.15) * r * 0.6, dy + Math.sin(a - 0.15) * r * 0.6, dx + Math.cos(tip) * r, dy + Math.sin(tip) * r);
          ctx.quadraticCurveTo(dx + Math.cos(a + 0.15) * r * 0.6, dy + Math.sin(a + 0.15) * r * 0.6, dx + Math.cos(a1) * rin, dy + Math.sin(a1) * rin);
        }
        ctx.closePath();
      };
      arm(sf.r * 0.08, sf.r * 0.1); ctx.fill();
      const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, sf.r);
      sg.addColorStop(0, `rgb(${mix(starC, "255,240,220", 0.25)})`);
      sg.addColorStop(1, `rgb(${mix(starC, "0,0,0", 0.25)})`);
      ctx.fillStyle = sg;
      arm(0, 0); ctx.fill();
      ctx.fillStyle = `rgba(${mix(starC, "255,255,255", 0.5)},0.7)`; // nubbly texture along the arms
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + Math.sin(t * 0.4 + sf.seed + i * 1.3) * 0.12;
        for (let j = 1; j < 6; j++) { const d = sf.r * j * 0.15; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, sf.r * 0.025, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
    }

    // ---- anemones ----
    for (const a of st.anemones) {
      const d = hand ? Math.hypot(p.x - a.x, p.y - a.y) : 1e9;
      a.shut = anemoneShut(d, a.r, a.shut) || (a.shut && a.open > 0.6);
      a.open += ((a.shut ? 0 : 1) - a.open) * Math.min(1, sec * (a.shut ? 7 : 0.6));
      const n = 28;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath(); ctx.arc(a.x + a.r * 0.15, a.y + a.r * 0.2, a.r * (0.45 + 0.6 * a.open), 0, Math.PI * 2); ctx.fill();
      ctx.lineCap = "round";
      for (let ring = 0; ring < 2; ring++) {
        for (let i = 0; i < n; i++) {
          const ang = ((i + ring * 0.5) / n) * Math.PI * 2;
          const sway = (noise2(a.x * 0.01 + t * 0.4, a.y * 0.01 + i * 0.1, 3) - 0.5) * 0.9;
          const len = a.r * (ring ? 0.75 : 1) * (0.25 + 0.75 * a.open);
          const bend = ang + sway * a.open;
          const bx = a.x + Math.cos(ang) * a.r * 0.25, by = a.y + Math.sin(ang) * a.r * 0.25;
          const tx = a.x + Math.cos(bend) * (a.r * 0.25 + len), ty = a.y + Math.sin(bend) * (a.r * 0.25 + len);
          ctx.strokeStyle = `rgb(${mix(anem, ring ? "255,255,255" : "0,0,0", ring ? 0.15 : 0.2)})`;
          ctx.lineWidth = a.r * 0.11;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + Math.cos(ang) * len * 0.6, by + Math.sin(ang) * len * 0.6, tx, ty); ctx.stroke();
          ctx.fillStyle = `rgb(${mix(anem, "255,250,240", 0.55)})`; // pale tips
          ctx.beginPath(); ctx.arc(tx, ty, a.r * 0.06, 0, Math.PI * 2); ctx.fill();
        }
      }
      // the oral disc, a dimple when shut
      const og = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r * 0.35);
      og.addColorStop(0, `rgb(${mix(anem, "0,0,0", 0.5)})`);
      og.addColorStop(0.5, `rgb(${mix(anem, "255,220,180", 0.3)})`);
      og.addColorStop(1, `rgb(${mix(anem, "0,0,0", 0.2)})`);
      ctx.fillStyle = og;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r * (0.3 + 0.08 * (1 - a.open)), 0, Math.PI * 2); ctx.fill();
    }

    // ---- fish: wander, school loosely, flee the hand ----
    for (const f of st.fish) {
      let turn = (noise2(f.seed, t * 0.3, 9) - 0.5) * 3;
      let thrust = U * 0.12;
      if (hand) {
        const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy);
        if (d < U * 0.25) {
          const away = Math.atan2(dy, dx);
          turn += Math.atan2(Math.sin(away - f.a), Math.cos(away - f.a)) * 6;
          thrust = U * (0.6 + speed * 0.02);
        }
      }
      // stay in the pool: turn back from the edges
      const m = U * 0.08;
      if (f.x < m || f.x > w - m || f.y < m || f.y > h - m) {
        const home = Math.atan2(h / 2 - f.y, w / 2 - f.x);
        turn += Math.atan2(Math.sin(home - f.a), Math.cos(home - f.a)) * 3;
      }
      f.a += turn * sec;
      f.v += (thrust - f.v) * Math.min(1, sec * 2.5);
      f.x += Math.cos(f.a) * f.v * sec;
      f.y += Math.sin(f.a) * f.v * sec;
      f.x = clamp(f.x, 0, w); f.y = clamp(f.y, 0, h);
      f.tail += sec * (6 + f.v / U * 30);
    }
    for (const pass of [0, 1]) { // shadows on the floor first, then the fish above them
      for (const f of st.fish) {
        ctx.save();
        ctx.translate(f.x + (pass ? 0 : f.s * 0.9), f.y + (pass ? 0 : f.s * 1.2));
        ctx.rotate(f.a);
        const wag = Math.sin(f.tail) * 0.35;
        const L = f.s;
        ctx.fillStyle = pass ? `rgb(${mix(rock, "200,200,180", 0.4)})` : "rgba(0,0,0,0.28)";
        ctx.beginPath();
        ctx.moveTo(L, 0);
        ctx.quadraticCurveTo(L * 0.4, -L * 0.32, -L * 0.6, Math.sin(wag) * L * 0.15);
        ctx.quadraticCurveTo(L * 0.4, L * 0.32, L, 0);
        ctx.fill();
        ctx.save(); ctx.translate(-L * 0.6, Math.sin(wag) * L * 0.15); ctx.rotate(wag);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-L * 0.4, -L * 0.25); ctx.lineTo(-L * 0.4, L * 0.25); ctx.closePath(); ctx.fill();
        ctx.restore();
        if (pass) {
          ctx.fillStyle = `rgba(${mix(rock, "0,0,0", 0.5)},0.6)`; // dorsal stripe and eyes
          ctx.beginPath(); ctx.ellipse(L * 0.1, 0, L * 0.45, L * 0.05, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgb(20,20,20)";
          for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(L * 0.7, side * L * 0.13, L * 0.06, 0, Math.PI * 2); ctx.fill(); }
        }
        ctx.restore();
      }
    }

    // ---- the water: tint, depth vignette, caustics, ripples ----
    const tint = ctx.createRadialGradient(w / 2, h / 2, U * 0.1, w / 2, h / 2, Math.hypot(w, h) * 0.6);
    tint.addColorStop(0, `rgba(${water},0.16)`);
    tint.addColorStop(1, `rgba(${mix(water, "0,0,0", 0.5)},0.6)`);
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, w, h);

    drawCaustics(ctx, caustic, w, h, t, mix(water, "255,255,240", 0.75), o.causticIntensity, frame.quality, 11, hand ? p : null);

    ctx.lineWidth = 1.5;
    for (const r of st.rings) {
      const life = r.big ? 2.4 : 1.2;
      const rad = r.age * U * (r.big ? 0.35 : 0.15);
      const a = (1 - r.age / life) * (r.big ? 0.6 : 0.3);
      ctx.strokeStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.arc(r.x, r.y, rad, 0, Math.PI * 2); ctx.stroke();
      if (r.big) {
        ctx.strokeStyle = `rgba(${mix(water, "0,0,0", 0.4)},${a * 0.6})`;
        ctx.beginPath(); ctx.arc(r.x, r.y, rad * 0.8, 0, Math.PI * 2); ctx.stroke();
      }
    }
    // surface glints
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 12; i++) {
      const gx = ((i * 0.618 + t * 0.01) % 1) * w, gy = ((i * 0.382 + Math.sin(t * 0.3 + i) * 0.01) % 1) * h;
      const tw = Math.max(0, Math.sin(t * 2.3 + i * 2.1));
      ctx.globalAlpha = tw * tw * 0.6;
      ctx.beginPath(); ctx.ellipse(gx, gy, U * 0.012, U * 0.003, 0.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const setup = useCanvasSetup({ onFrame: draw });
  canvasEl.current = setup.canvas;
  return setup;
}
