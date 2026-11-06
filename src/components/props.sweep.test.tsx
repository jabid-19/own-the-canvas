import { readdirSync, readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { createRef, type ComponentType } from "react";
import * as lib from "../index";

/**
 * Prop sweep: proves every public prop of every component actually does something,
 * and does it LIVE (changing it on a mounted component changes the output).
 *
 *   seeded Math.random + fixed clock ─> render(base) ─> N frames w/ pointer input
 *     ─> rerender(base + {prop: v}) ─> M frames ─> hash every ctx call/state write
 *   hash == baseline? ─> mount with v from the start: differs = MOUNT-ONLY, same = DEAD
 *
 * Also per component: presets render + differ, SSR, ref, wrapper props, unmount cleanup.
 * Opt-in (heavy): `npm run test:props` runs every component in batches of 5, one
 * process each (all 60 in one worker runs out of memory). SWEEP="Boids,Rain" for a subset.
 */

const W = 300, H = 200, N = 24, M = 24;
const dir = __dirname;
const ALL = readdirSync(dir).filter((d) => existsSync(join(dir, d, `${d}.tsx`)));
const ONLY = process.env.SWEEP?.split(",").map((s) => s.trim()).filter(Boolean);
const NAMES = ONLY?.length ? (ONLY[0] === "all" ? ALL : ALL.filter((n) => ONLY.includes(n))) : [];

// Props that legitimately only matter under another prop. Key "prop" or "Component.prop".
const NEEDS: Record<string, Record<string, unknown>> = {
  zIndex: { overlay: true },
  "GrassField.flowerColor": { flowers: 0.3 },         // flowers default 0
  "GalaxySpiral.tiltX": { interactive: false },       // cursor tilt wins while hovering
  "Fireflies.period": { interactive: false },         // test taps force-flash every fly
  "Fireflies.sync": { interactive: false },
  "FluidSimulation.glowEffect": { glowBlur: 12 },     // glow radius defaults to 0
  "Moths.lightX": { followCursor: false },           // light follows the cursor otherwise
  "Moths.lightY": { followCursor: false },
  "Moths.angle": { followCursor: false },
  "SakuraBlossom.restitution": { collide: true },
  "SeasonsTree.collide": {},
  "VoronoiCells.cellColor": { colorMode: "solid" },   // default preset cycles hues
  "WaveInterference.backgroundColor": { decay: 0.05 }, // small canvas: waves never die out at default decay
  "SeasonsTree.autumnColor": { season: "autumn" },    // cycle starts in spring
  "SandSimulation.waterColor": { material: "water" }, // default pours sand
  "SandSimulation.fireColor": { material: "fire" },
  "SandSimulation.wallColor": { material: "wall" },
  "Lightning.startX": { interactive: false },         // clicks strike at the cursor instead
  "Lightning.endY": { interactive: false },
  "Hummingbird.collide": { interactive: false },     // the fast test cursor keeps the bird fleeing
  "Snail.trail": { interactive: false },            // the fast test cursor keeps the snail in its shell
  "Snail.trailColor": { interactive: false },
  "Snail.speed": { interactive: false },
};
// Verified by reading the code; the random pointer can't exercise them. Reason required.
const VERIFIED: Record<string, string> = {
  "ParticleField.dragRadius": "read live in onMouseDown; test presses release the same frame, so nothing is dragged",
  "BubbleUniverse.popEffect": "read live in onClick; synthetic clicks miss every bubble",
  "Confetti.particleCount": "particles per burst; applies on the next trigger rising edge (by design)",
  "Fireflies.sync": "live: sync=0 desyncs (probed with a 400-frame live run); any coupling > 0 keeps a small canvas locked",
  "PendulaWave.autoReset": "read live (usePendulaWave.ts:157); triggers once the swing decays below 4%, past the window",
  "SnowDrift.interactive": "read live (useSnowDrift.ts:182); brushes only at the pile surface, test cursor stays mid-canvas",
  "SolarFlare.interactive": "read live (useSolarFlare.ts:183); flareCount cap is hit in the first 24 frames so later taps add nothing",
  "Spirograph.autoReset": "read live (useSpirograph.ts:253); fires when a layer completes its full period, past the window",
  "IvyGrowth.loop": "read live (useIvyGrowth.ts:470); fires 7s after the wall finishes growing",
  "CrystalGrowth.autoReset": "read live; fires 4s after a flake finishes, longer than the test window",
};
// Components that draw nothing until told to.
const BASE: Record<string, Record<string, unknown>> = {
  Confetti: { trigger: true },
};
// Timer-driven props need a long window to show their effect.
const LONG = /interval|^auto|reset|regrow|^loop$|shootingStar|lightning|flare|pulse|lifetime|^period$|^sync$/i;
const LONG_PROPS = new Set(["SakuraBlossom.maxAccumulation", "SnowDrift.maxDepth", "Moths.angle", "Lightning.startX", "Lightning.endY"]);
// Callbacks / props with no visual output, verified elsewhere.
// Presets that are intentional duplicates of default under a different name.
const PRESET_ALIAS = new Set(["KoiPond.koi", "SandSimulation.desert"]);
const SKIP = new Set(["preset", "onComplete", "width", "height", "className", "style"]);

// ---------- deterministic world ----------
let clock = 0;
let rafQueue = new Map<number, FrameRequestCallback>();
let rafId = 0;
let hash = 0;
let recording = false;

function mix(s: string) {
  if (!recording) return;
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
}
function fmt(v: unknown): string {
  if (typeof v === "number") return Number.isFinite(v) ? v.toFixed(2) : String(v);
  if (typeof v === "string" || typeof v === "boolean") return String(v);
  if (v instanceof Uint8ClampedArray || v instanceof Float32Array) {
    let s = 0;
    for (let i = 0; i < v.length; i += 7) s = (s * 31 + v[i]) | 0;
    return `buf${s}`;
  }
  if (v && typeof v === "object" && "data" in (v as object)) return fmt((v as ImageData).data);
  if (Array.isArray(v)) return `[${v.map(fmt).join(",")}]`;
  if (v && typeof v === "object" && "__grad" in (v as object)) return (v as { __grad: string }).__grad;
  return typeof v;
}

function fakeContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const state: Record<string | symbol, unknown> = { canvas, filter: "none" };
  let gid = 0;
  return new Proxy(state, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop !== "string") return undefined;
      if (prop.startsWith("create") && prop.endsWith("Gradient")) {
        return (...a: unknown[]) => {
          const g = { __grad: `g${gid++}:${a.map(fmt).join(",")}`, addColorStop: (o: number, c: string) => { mix(`stop${fmt(o)}${c}`); g.__grad += `|${fmt(o)}${c}`; } };
          return g;
        };
      }
      if (prop === "createPattern") return () => ({ __grad: "pattern", setTransform() {} });
      if (prop === "measureText") return (t: string) => ({ width: String(t).length * 6, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 });
      if (prop === "createImageData" || prop === "getImageData") {
        return (a: number | ImageData, b?: number, c?: number, d?: number) => {
          const w = typeof a === "object" ? a.width : prop === "getImageData" ? (c as number) : a;
          const h = typeof a === "object" ? a.height : prop === "getImageData" ? (d as number) : (b as number);
          return { data: new Uint8ClampedArray(Math.max(1, (w | 0) * (h | 0)) * 4), width: w | 0, height: h | 0, colorSpace: "srgb" };
        };
      }
      if (prop === "getTransform") return () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
      if (prop === "getLineDash") return () => [];
      if (prop === "isPointInPath" || prop === "isPointInStroke") return () => false;
      return (...a: unknown[]) => mix(`${prop}(${a.map(fmt).join(",")})`);
    },
    set(target, prop, value) {
      target[prop] = value;
      mix(`${String(prop)}=${fmt(value)}`);
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
}

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ctxByCanvas = new WeakMap<HTMLCanvasElement, CanvasRenderingContext2D>();
const listenerLog: { target: EventTarget; type: string; fn: unknown; add: boolean }[] = [];
const origAdd = EventTarget.prototype.addEventListener;
const origRemove = EventTarget.prototype.removeEventListener;

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { rafQueue.set(++rafId, cb); return rafId; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => rafQueue.delete(id));
  // Path2D geometry must reach the hash (fmt reads __grad) or path-drawn effects look dead.
  vi.stubGlobal("Path2D", new Proxy(class { __grad = "path"; constructor(d?: unknown) { if (typeof d === "string") this.__grad += d; } }, {
    construct(T, args) {
      const inst = new T(...(args as [unknown]));
      return new Proxy(inst, {
        get(t, prop) {
          if (prop in t) return (t as unknown as Record<string | symbol, unknown>)[prop];
          return (...a: unknown[]) => { t.__grad += `${String(prop)}(${a.map(fmt).join(",")})`; };
        },
      });
    },
  }));
  vi.stubGlobal("OffscreenCanvas", class { constructor(public width: number, public height: number) {} getContext() { return fakeContext(this as never); } });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (this: HTMLCanvasElement) {
    let c = ctxByCanvas.get(this);
    if (!c) { c = fakeContext(this); ctxByCanvas.set(this, c); }
    return c as never;
  });
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(() => "data:,");
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    if (this.hasAttribute("data-otc-solid")) return { left: 100, top: 80, width: 100, height: 40, right: 200, bottom: 120, x: 100, y: 80, toJSON() {} } as DOMRect;
    return { left: 0, top: 0, width: W, height: H, right: W, bottom: H, x: 0, y: 0, toJSON() {} } as DOMRect;
  });
  for (const k of ["clientWidth", "offsetWidth"]) Object.defineProperty(HTMLElement.prototype, k, { configurable: true, get: () => W });
  for (const k of ["clientHeight", "offsetHeight"]) Object.defineProperty(HTMLElement.prototype, k, { configurable: true, get: () => H });
  Object.defineProperty(window, "innerWidth", { value: W, configurable: true });
  Object.defineProperty(window, "innerHeight", { value: H, configurable: true });
  Object.defineProperty(window, "devicePixelRatio", { value: 1, configurable: true });
  vi.spyOn(performance, "now").mockImplementation(() => clock);
  vi.spyOn(Date, "now").mockImplementation(() => 1_700_000_000_000 + clock);
  listenerLog.length = 0;
  EventTarget.prototype.addEventListener = function (type: string, fn: unknown, o?: unknown) {
    listenerLog.push({ target: this, type, fn, add: true });
    return origAdd.call(this, type, fn as EventListener, o as AddEventListenerOptions);
  };
  EventTarget.prototype.removeEventListener = function (type: string, fn: unknown, o?: unknown) {
    listenerLog.push({ target: this, type, fn, add: false });
    return origRemove.call(this, type, fn as EventListener, o as EventListenerOptions);
  };
});

afterEach(() => {
  cleanup();
  EventTarget.prototype.addEventListener = origAdd;
  EventTarget.prototype.removeEventListener = origRemove;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

function pointer(type: string, x: number, y: number, target: EventTarget) {
  const Ctor = typeof PointerEvent !== "undefined" && type.startsWith("pointer") ? PointerEvent : MouseEvent;
  target.dispatchEvent(new Ctor(type, { clientX: x, clientY: y, bubbles: true, cancelable: true, button: 0, buttons: type.endsWith("down") || type.endsWith("move") ? 1 : 0 } as MouseEventInit));
}

function frames(count: number) {
  for (let i = 0; i < count; i++) {
    clock += 16;
    const f = clock / 16;
    const x = W * (0.3 + 0.4 * Math.abs(Math.sin(f * 0.37)));
    const y = H * (0.3 + 0.4 * Math.abs(Math.cos(f * 0.23)));
    const c = document.querySelector("canvas") ?? document.body;
    act(() => {
      pointer("pointermove", x, y, c);
      pointer("mousemove", x, y, c);
      if (f % 6 === 0) {
        pointer("pointerdown", x, y, c); pointer("mousedown", x, y, c);
        pointer("pointerup", x, y, c); pointer("mouseup", x, y, c); pointer("click", x, y, c);
      }
      const q = Array.from(rafQueue.values());
      rafQueue = new Map();
      q.forEach((cb) => cb(clock));
    });
  }
}

type C = ComponentType<Record<string, unknown>>;

/** Fingerprint of the last M frames (+ DOM) for: mount(a) → N frames → rerender(b) → M frames. */
function run(Comp: C, a: Record<string, unknown>, b: Record<string, unknown>, m = M): string {
  clock = 0; rafQueue = new Map(); hash = 2166136261; recording = false;
  const rnd = mulberry32(1234);
  const spy = vi.spyOn(Math, "random").mockImplementation(rnd);
  try {
    // a DOM solid so collide/restitution have something to hit
    const r = render(<div style={{ width: W, height: H }}><Comp {...a} /><span data-otc-solid /></div>);
    frames(N);
    r.rerender(<div style={{ width: W, height: H }}><Comp {...b} /><span data-otc-solid /></div>);
    recording = true;
    frames(m);
    mix(document.body.innerHTML);
    recording = false;
    r.unmount();
  } finally {
    spy.mockRestore();
    cleanup();
    document.body.innerHTML = "";
  }
  return (hash >>> 0).toString(16);
}

// ---------- source parsing ----------
type PropInfo = { name: string; type: string; def: unknown; hasDef: boolean };

function parse(name: string) {
  const src = readFileSync(join(dir, name, `${name}.tsx`), "utf8");
  const body = src.match(new RegExp(`export interface ${name}Props[^{]*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
  const props: PropInfo[] = [];
  for (const m of body.matchAll(/^\s+(\w+)\??:\s*([^;]+);/gm)) {
    const [, p, type] = m;
    let def: unknown, hasDef = false;
    const line = src.match(new RegExp(`^\\s*${p}\\s*:\\s*${p}\\s*\\?\\?(.*)$`, "m"))?.[1];
    if (line) {
      const lit = line.split("??").pop()!.trim().replace(/,\s*(\/\/.*)?$/, "").replace(/\s*\/\/.*$/, "");
      try { def = Function(`"use strict";return (${lit})`)(); hasDef = true; } catch { /* expression, unknown */ }
    }
    props.push({ name: p, type: type.trim(), def, hasDef });
  }
  const presetBlock = src.match(/const PRESETS[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? "";
  const bodies = new Map([...presetBlock.matchAll(/^\s{2}"?([\w-]+)"?\s*:\s*\{([\s\S]*?)\},?\s*$/gm)].map((m) => [m[1], m[2].replace(/\s+/g, "")]));
  const presets = [...presetBlock.matchAll(/^\s{2}"?([\w-]+)"?\s*:/gm)].map((m) => m[1])
    .filter((k) => k === "default" || bodies.get(k) === undefined || bodies.get(k) !== bodies.get("default")); // aliases of default are intentional
  const unions = (t: string): string[] => {
    const alias = src.match(new RegExp(`type ${t}\\s*=([^;]+);`))?.[1]
      ?? readHookSrc(name).match(new RegExp(`type ${t}\\s*=([^;]+);`))?.[1] ?? t;
    return [...alias.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  };
  return { src, props, presets, unions };
}
function readHookSrc(name: string) {
  try { return readdirSync(join(dir, name)).filter((f) => f.endsWith(".ts")).map((f) => readFileSync(join(dir, name, f), "utf8")).join("\n"); } catch { return ""; }
}

const isColorName = (p: string) => /colou?r|Color$|^color/i.test(p);

function candidates(p: PropInfo, unions: (t: string) => string[]): unknown[] {
  const t = p.type;
  if (t.includes("=>")) return [];
  if (t === "number") {
    if (!p.hasDef || typeof p.def !== "number") return [0.5, 3];
    const d = p.def;
    if (d === 0) return [1, 0.5];
    if (Number.isInteger(d) && Math.abs(d) >= 2) return [Math.round(d * 2.5), Math.max(1, Math.round(d * 0.4))];
    return [d * 2.5, d * 0.4];
  }
  if (t === "boolean") return p.hasDef ? [!p.def, p.def] : [true, false]; // preset may flip the default
  if (t === "string[]") return [["#ff2266", "#22ffaa", "#2266ff"], ["#ffffff"]];
  if (t.endsWith("[]")) {
    const u = unions(t.slice(0, -2));
    return u.length ? [[u[u.length - 1]], [u[0]]] : [];
  }
  if (t.startsWith("Record<")) return [{ F: "F[+F]F[-F]F" }];
  if (t.includes("GlobalCompositeOperation")) return ["multiply", "screen"];
  if (t === "string") {
    if (isColorName(p.name)) return ["#ff2266", "#22ffaa"];
    if (p.name === "axiom") return ["F+F+F+F", "X"];
    return ["multiply", "F"];
  }
  // union alias (possibly "| string")
  const u = t.split("|").flatMap((x) => { x = x.trim(); return x.startsWith('"') ? [x.slice(1, -1)] : unions(x); });
  return u.filter((v) => v !== p.def);
}

// ---------- the sweep ----------
const report: Record<string, unknown> = {};

if (!NAMES.length) it.skip("prop sweep is opt-in: npm run test:props", () => {});

describe.each(NAMES)("%s", (name) => {
  const Comp = (lib as unknown as Record<string, C>)[name];
  const { props, presets, unions } = parse(name);
  const B = BASE[name] ?? {};

  it("is exported from the package entry", () => {
    expect(Comp, `${name} not exported from src/index.ts`).toBeTruthy();
  });

  it("renders on the server (SSR) without touching window", () => {
    expect(() => renderToString(<Comp />)).not.toThrow();
  });

  it("forwards ref to the canvas and applies wrapper props", () => {
    const ref = createRef<HTMLCanvasElement>();
    const { container } = render(<Comp ref={ref} className="otc-x" style={{ opacity: 0.5 }} width={123} height="45px" />);
    // GameOfLife's ref is an imperative handle that also exposes the canvas.
    const el = name === "GameOfLife" ? (ref.current as unknown as { canvas: HTMLCanvasElement })?.canvas : ref.current;
    expect(el).toBeInstanceOf(HTMLCanvasElement);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("otc-x");
    expect(root.style.opacity).toBe("0.5");
    expect(root.style.width).toBe("123px");
    expect(root.style.height).toBe("45px");
  });

  it("cleans up rAF and every listener on unmount; two instances coexist", () => {
    const { unmount } = render(<div><Comp /><Comp /></div>);
    frames(5);
    unmount();
    expect(rafQueue.size, "rAF still scheduled after unmount").toBe(0);
    // ponytail: window/document only; element listeners die with the element.
    const live = new Map<unknown, Map<string, Set<unknown>>>();
    for (const l of listenerLog) {
      if (l.target !== window && l.target !== document) continue;
      const byType = live.get(l.target) ?? new Map<string, Set<unknown>>();
      live.set(l.target, byType);
      const fns = byType.get(l.type) ?? new Set();
      byType.set(l.type, fns);
      if (l.add) fns.add(l.fn); else fns.delete(l.fn);
    }
    const leaked = [...live].flatMap(([t, m]) => [...m].filter(([, s]) => s.size).map(([type]) => `${t === window ? "window" : "document"}:${type}`));
    expect(leaked, "listeners left on window/document").toEqual([]);
  });

  it("every preset renders and changes the output", () => {
    const base = run(Comp, B, B);
    const same: string[] = [];
    for (const p of presets) {
      if (p === "default" || PRESET_ALIAS.has(`${name}.${p}`)) continue;
      if (run(Comp, { ...B, preset: p }, { ...B, preset: p }) === base) same.push(p);
    }
    expect(same, "presets identical to default").toEqual([]);
  }, 300_000);

  it("every prop changes the output live", () => {
    const issues: string[] = [];
    const bools = Object.fromEntries(props.filter((p) => p.type === "boolean" && p.name !== "overlay").map((p) => [p.name, true]));
    const baseCache = new Map<string, string>();
    const baseline = (b: Record<string, unknown>, m: number) => {
      const k = JSON.stringify(b) + m;
      if (!baseCache.has(k)) baseCache.set(k, run(Comp, b, b, m));
      return baseCache.get(k)!;
    };
    if (baseline(B, M) !== run(Comp, B, B)) { issues.push("NONDETERMINISTIC: same props give different output"); }

    for (const p of props) {
      if (SKIP.has(p.name)) continue;
      const cands = candidates(p, unions);
      if (!cands.length) { issues.push(`${p.name}: no test value for type ${p.type}`); continue; }
      let verdict = "DEAD";
      if (VERIFIED[`${name}.${p.name}`]) continue;
      const m = LONG.test(p.name) || LONG_PROPS.has(`${name}.${p.name}`) ? 400 : M;
      const need = { ...NEEDS[p.name], ...NEEDS[`${name}.${p.name}`] };
      const ctxs = [{ ...B, ...need }, { ...B, ...bools, ...need }];
      outer: for (const ctx of ctxs) {
        const base = baseline(ctx, m);
        for (const v of cands.slice(0, 2)) {
          let live: string;
          try { live = run(Comp, ctx, { ...ctx, [p.name]: v }, m); } catch (e) { verdict = `THROWS with ${JSON.stringify(v)}: ${(e as Error).message}`; break outer; }
          if (live !== base) { verdict = "OK"; break outer; }
          const mounted = run(Comp, { ...ctx, [p.name]: v }, { ...ctx, [p.name]: v }, m);
          if (mounted !== base) verdict = "MOUNT-ONLY";
        }
      }
      if (verdict !== "OK") issues.push(`${p.name}: ${verdict}`);
    }
    report[name] = issues;
    mkdirSync(join(dir, "../../.gstack/qa-reports"), { recursive: true });
    const f = join(dir, "../../.gstack/qa-reports/prop-sweep.json");
    const prev = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : {};
    writeFileSync(f, JSON.stringify({ ...prev, [name]: issues }, null, 2));
    expect(issues).toEqual([]);
  }, 600_000);
});

