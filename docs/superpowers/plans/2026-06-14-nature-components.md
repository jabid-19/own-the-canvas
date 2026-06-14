# Nature Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add SpiderWeb, ButterflySwarm, WillowTree, and DeepSeaBioluminescence canvas animation components to the own-the-canvas library.

**Architecture:** Each component = hook (all canvas logic) + forwardRef wrapper (presets + props) + index.ts + doc page. Build order: SpiderWeb → ButterflySwarm → WillowTree → DeepSeaBioluminescence. After each component: wire into src/index.ts, Home.tsx, DocsApp.tsx, Sidebar.tsx.

**Tech Stack:** React 18, TypeScript, Canvas 2D API. Utilities: `hexToRgba` from `../../utils/color`. Types: `BaseCanvasProps` from `../../types`. Pattern mirrors KoiPond/DragonCursor exactly (optionsRef, ResizeObserver, rAF, mouse events, DPR scaling).

---

## Task 1: SpiderWeb Hook

**Files:**
- Create: `src/components/SpiderWeb/useSpiderWeb.ts`

- [ ] **Step 1: Create the hook**

```typescript
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
      if (nodes.length !== spokeCount) { raf = requestAnimationFrame(loop); return; }
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
          spider.targetX += (mouse.x - spider.targetX) * 0.008;
          spider.targetY += (mouse.y - spider.targetY) * 0.008;
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
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep -i "SpiderWeb\|useSpiderWeb" | head -20
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/components/SpiderWeb/useSpiderWeb.ts
git commit -m "feat: add useSpiderWeb hook"
```

---

## Task 2: SpiderWeb Component + Index

**Files:**
- Create: `src/components/SpiderWeb/SpiderWeb.tsx`
- Create: `src/components/SpiderWeb/index.ts`

- [ ] **Step 1: Create SpiderWeb.tsx**

```typescript
// src/components/SpiderWeb/SpiderWeb.tsx
import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSpiderWeb } from "./useSpiderWeb";

type SpiderWebPreset = "default" | "night" | "forest" | "neon" | "frost";

interface SpiderWebPresetValues {
  webColor?: string;
  backgroundColor?: string;
  spiderColor?: string;
  glowColor?: string;
}

const PRESETS: Record<SpiderWebPreset, SpiderWebPresetValues> = {
  default: {},
  night:   { webColor: "#c0c8e0", backgroundColor: "#04081a", spiderColor: "#404060", glowColor: "#8899cc" },
  forest:  { webColor: "#90b890", backgroundColor: "#050f05", spiderColor: "#2a4a2a", glowColor: "#66aa66" },
  neon:    { webColor: "#00ffcc", backgroundColor: "#000000", spiderColor: "#003322", glowColor: "#00ffff" },
  frost:   { webColor: "#e0f0ff", backgroundColor: "#040810", spiderColor: "#203040", glowColor: "#aaddff" },
};

export interface SpiderWebProps extends BaseCanvasProps {
  /** Number of radial spokes (default: 12) */
  spokeCount?: number;
  /** Number of concentric rings (default: 10) */
  ringCount?: number;
  /** Strand color (default: "#c8c8c8") */
  webColor?: string;
  /** Canvas background color (default: "#111111") */
  backgroundColor?: string;
  /** Spider body color (default: "#333333") */
  spiderColor?: string;
  /** Show dew drop glow points (default: true) */
  dewDrops?: boolean;
  /** Dew drop glow color (default: "#aaddff") */
  glowColor?: string;
  /** Ambient sway speed multiplier (default: 1) */
  swaySpeed?: number;
  /** Cursor disturbance radius in px (default: 80) */
  disturbRadius?: number;
  /** Enable cursor disturbance (default: true) */
  interactive?: boolean;
  /** Show spider (default: true) */
  showSpider?: boolean;
  /** Named preset */
  preset?: SpiderWebPreset | string;
}

export const SpiderWeb = forwardRef<HTMLCanvasElement, SpiderWebProps>(
  (props, ref) => {
    const {
      preset, spokeCount, ringCount, webColor, backgroundColor, spiderColor,
      dewDrops, glowColor, swaySpeed, disturbRadius, interactive, showSpider,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as SpiderWebPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useSpiderWeb(internalRef, {
      spokeCount:    spokeCount    ?? 12,
      ringCount:     ringCount     ?? 10,
      webColor:      webColor      ?? p.webColor      ?? "#c8c8c8",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      spiderColor:   spiderColor   ?? p.spiderColor   ?? "#333333",
      dewDrops:      dewDrops      ?? true,
      glowColor:     glowColor     ?? p.glowColor     ?? "#aaddff",
      swaySpeed:     swaySpeed     ?? 1,
      disturbRadius: disturbRadius ?? 80,
      interactive:   interactive   ?? true,
      showSpider:    showSpider    ?? true,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

SpiderWeb.displayName = "SpiderWeb";
```

- [ ] **Step 2: Create index.ts**

```typescript
// src/components/SpiderWeb/index.ts
export { SpiderWeb } from "./SpiderWeb";
export type { SpiderWebProps } from "./SpiderWeb";
```

- [ ] **Step 3: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep -i "SpiderWeb" | head -20
```
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add src/components/SpiderWeb/SpiderWeb.tsx src/components/SpiderWeb/index.ts
git commit -m "feat: add SpiderWeb component with presets"
```

---

## Task 3: SpiderWeb Doc Page

**Files:**
- Create: `src/docs/pages/components/SpiderWebPage.tsx`

- [ ] **Step 1: Create the doc page**

```typescript
// src/docs/pages/components/SpiderWebPage.tsx
import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { SpiderWeb } from "../../../components/SpiderWeb";

const PROPS = [
  { name: "spokeCount",     type: "number",  default: "12",         description: "Number of radial spokes." },
  { name: "ringCount",      type: "number",  default: "10",         description: "Number of concentric rings." },
  { name: "webColor",       type: "string",  default: '"#c8c8c8"',  description: "Silk strand color." },
  { name: "backgroundColor",type: "string",  default: '"#111111"',  description: "Canvas background color." },
  { name: "spiderColor",    type: "string",  default: '"#333333"',  description: "Spider body and leg color." },
  { name: "dewDrops",       type: "boolean", default: "true",       description: "Show glowing dew drop points on strands." },
  { name: "glowColor",      type: "string",  default: '"#aaddff"',  description: "Dew drop glow color." },
  { name: "swaySpeed",      type: "number",  default: "1",          description: "Ambient sway speed multiplier." },
  { name: "disturbRadius",  type: "number",  default: "80",         description: "Cursor disturbance radius in px." },
  { name: "interactive",    type: "boolean", default: "true",       description: "Cursor pulls web strands." },
  { name: "showSpider",     type: "boolean", default: "true",       description: "Show the spider." },
  { name: "preset",         type: "string",  default: "—",          description: '"default" | "night" | "forest" | "neon" | "frost"' },
];

const PRESET_VALUES: Record<string, { webColor: string; backgroundColor: string; spiderColor: string; glowColor: string }> = {
  default: { webColor: "#c8c8c8", backgroundColor: "#111111", spiderColor: "#333333", glowColor: "#aaddff" },
  night:   { webColor: "#c0c8e0", backgroundColor: "#04081a", spiderColor: "#404060", glowColor: "#8899cc" },
  forest:  { webColor: "#90b890", backgroundColor: "#050f05", spiderColor: "#2a4a2a", glowColor: "#66aa66" },
  neon:    { webColor: "#00ffcc", backgroundColor: "#000000", spiderColor: "#003322", glowColor: "#00ffff" },
  frost:   { webColor: "#e0f0ff", backgroundColor: "#040810", spiderColor: "#203040", glowColor: "#aaddff" },
};

function SpiderWebPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]             = useState("default");
  const [webColor, setWebColor]         = useState("#c8c8c8");
  const [bg, setBg]                     = useState("#111111");
  const [spiderColor, setSpiderColor]   = useState("#333333");
  const [glowColor, setGlowColor]       = useState("#aaddff");
  const [spokeCount, setSpokeCount]     = useState(12);
  const [ringCount, setRingCount]       = useState(10);
  const [swaySpeed, setSwaySpeed]       = useState(1);
  const [disturbRadius, setDisturbRadius] = useState(80);
  const [dewDrops, setDewDrops]         = useState(true);
  const [interactive, setInteractive]   = useState(true);
  const [showSpider, setShowSpider]     = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setWebColor(v.webColor);
    setBg(v.backgroundColor);
    setSpiderColor(v.spiderColor);
    setGlowColor(v.glowColor);
  }

  const code = [
    `import { SpiderWeb } from 'own-the-canvas';`,
    ``,
    `<SpiderWeb`,
    `  preset="${preset}"`,
    `  webColor="${webColor}"`,
    `  backgroundColor="${bg}"`,
    `  spiderColor="${spiderColor}"`,
    `  glowColor="${glowColor}"`,
    `  spokeCount={${spokeCount}}`,
    `  ringCount={${ringCount}}`,
    `  swaySpeed={${swaySpeed}}`,
    `  disturbRadius={${disturbRadius}}`,
    `  dewDrops={${dewDrops}}`,
    `  interactive={${interactive}}`,
    `  showSpider={${showSpider}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <SpiderWeb
        preset={preset}
        webColor={webColor}
        backgroundColor={bg}
        spiderColor={spiderColor}
        glowColor={glowColor}
        spokeCount={spokeCount}
        ringCount={ringCount}
        swaySpeed={swaySpeed}
        disturbRadius={disturbRadius}
        dewDrops={dewDrops}
        interactive={interactive}
        showSpider={showSpider}
        width="100%"
        height="100%"
      />
      <PLiveLabel text={interactive ? "Move cursor to disturb the web" : "Web sways in ambient breeze"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "night", "forest", "neon", "frost"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Web color" value={webColor} onChange={setWebColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PColor label="Spider color" value={spiderColor} onChange={setSpiderColor} />
        <PColor label="Glow color" value={glowColor} onChange={setGlowColor} />
        <PToggle label="Dew drops" value={dewDrops} onChange={setDewDrops} />
        <PToggle label="Show spider" value={showSpider} onChange={setShowSpider} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Spokes" value={spokeCount} min={6} max={24} step={1} onChange={setSpokeCount} />
        <PSlider label="Rings" value={ringCount} min={4} max={20} step={1} onChange={setRingCount} />
        <PSlider label="Sway speed" value={swaySpeed} min={0.1} max={4} step={0.1} onChange={setSwaySpeed} />
        <PSlider label="Disturb radius" value={disturbRadius} min={20} max={200} step={5} onChange={setDisturbRadius} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SpiderWebPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="SpiderWeb"
      lead="An orb-weaver's silk web with spring-physics strands, glowing dew drops, and a spider that stalks your cursor. Move your mouse to pull the web."
    >
      <SpiderWebPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls.</p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/docs/pages/components/SpiderWebPage.tsx
git commit -m "feat: add SpiderWebPage doc page"
```

---

## Task 4: Wire SpiderWeb

**Files:**
- Modify: `src/index.ts`
- Modify: `src/docs/pages/Home.tsx`
- Modify: `src/docs/DocsApp.tsx`
- Modify: `src/docs/components/Sidebar.tsx`

- [ ] **Step 1: Add export to src/index.ts** — append after the last export block:

```typescript
export { SpiderWeb } from "./components/SpiderWeb";
export type { SpiderWebProps } from "./components/SpiderWeb";
```

- [ ] **Step 2: Add lazy import to src/docs/DocsApp.tsx** — add after the KoiPondPage import line:

```typescript
const SpiderWebPage     = lazy(() => import("./pages/components/SpiderWebPage").then((m) => ({ default: m.SpiderWebPage })));
```

- [ ] **Step 3: Add route to src/docs/DocsApp.tsx** — add after the KoiPond route:

```typescript
<Route path="/components/spider-web"          element={<SpiderWebPage />} />
```

- [ ] **Step 4: Add to src/docs/components/Sidebar.tsx** COMPONENT_LINKS array — add after KoiPond entry:

```typescript
{ name: "SpiderWeb", path: "/components/spider-web" },
```

- [ ] **Step 5: Add to src/docs/pages/Home.tsx** — add import at top with other component imports:

```typescript
import { SpiderWeb } from "../../components/SpiderWeb";
```

Then add to COMPONENTS array after KoiPond entry:

```typescript
{ name: "SpiderWeb", path: "/components/spider-web", accent: "#c8c8c8", desc: "Orb-weaver silk web with spring physics, dew drops, and a cursor-stalking spider", preview: <SpiderWeb spokeCount={10} ringCount={8} width="100%" height="100%" /> },
```

- [ ] **Step 6: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no output

- [ ] **Step 7: Commit**

```bash
git add src/index.ts src/docs/DocsApp.tsx src/docs/components/Sidebar.tsx src/docs/pages/Home.tsx
git commit -m "feat: wire SpiderWeb into docs app and library exports"
```

---

## Task 5: ButterflySwarm Hook

**Files:**
- Create: `src/components/ButterflySwarm/useButterflySwarm.ts`

- [ ] **Step 1: Create the hook**

```typescript
// src/components/ButterflySwarm/useButterflySwarm.ts
import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface Butterfly {
  x: number; y: number;
  vx: number; vy: number;
  angle: number;
  flapPhase: number;
  hueShift: number;
  size: number;
  wanderAngle: number;
  fleeing: boolean;
}

export interface UseButterflySwarmOptions {
  butterflyCount: number;
  wingColor: string;
  patternColor: string;
  backgroundColor: string;
  flapSpeed: number;
  speed: number;
  attractRadius: number;
  interactive: boolean;
  showTrails: boolean;
}

function hsl(h: number, s: number, l: number, a = 1) {
  return `hsla(${h},${s}%,${l}%,${a})`;
}

function drawWing(
  ctx: CanvasRenderingContext2D,
  size: number,
  flapX: number,
  side: 1 | -1,
  wingFill: string,
  patternFill: string
) {
  ctx.save();
  ctx.scale(side * flapX, 1);
  // upper lobe
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size * 0.9, -size * 0.6, size * 1.3, size * 0.2, 0, size * 0.45);
  ctx.fillStyle = wingFill;
  ctx.fill();
  // lower lobe
  ctx.beginPath();
  ctx.moveTo(0, size * 0.2);
  ctx.bezierCurveTo(size * 0.6, size * 0.5, size * 0.7, size * 1.1, 0, size * 0.85);
  ctx.fill();
  // spots
  ctx.fillStyle = patternFill;
  ctx.beginPath(); ctx.arc(size * 0.5, -size * 0.1, size * 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(size * 0.8, size * 0.3, size * 0.08, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function useButterflySwarm(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseButterflySwarmOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, t = 0;

    const butterflies: Butterfly[] = [];
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };

    function makeButterfly(): Butterfly {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * optionsRef.current.speed,
        vy: (Math.random() - 0.5) * optionsRef.current.speed,
        angle: Math.random() * Math.PI * 2,
        flapPhase: Math.random() * Math.PI * 2,
        hueShift: (Math.random() - 0.5) * 40,
        size: 10 + Math.random() * 10,
        wanderAngle: Math.random() * Math.PI * 2,
        fleeing: false,
      };
    }

    function init() {
      butterflies.length = 0;
      for (let i = 0; i < optionsRef.current.butterflyCount; i++) butterflies.push(makeButterfly());
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      init();
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
      mouse.prevX = mouse.x; mouse.prevY = mouse.y;
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

      if (opts.showTrails) {
        ctx.fillStyle = hexToRgba(opts.backgroundColor, 0.18);
      } else {
        ctx.fillStyle = opts.backgroundColor;
      }
      ctx.fillRect(0, 0, w, h);

      const mouseSpeed = mouse.x > -100
        ? Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY)
        : 0;
      const isMouseFast = mouseSpeed > 12;

      // sync count
      while (butterflies.length < opts.butterflyCount) butterflies.push(makeButterfly());
      butterflies.length = opts.butterflyCount;

      for (const b of butterflies) {
        // wander
        b.wanderAngle += (Math.random() - 0.5) * 0.3;
        const wanderX = Math.cos(b.wanderAngle) * 0.15 * opts.speed;
        const wanderY = Math.sin(b.wanderAngle) * 0.15 * opts.speed;

        if (opts.interactive && mouse.x > -100) {
          const dx = mouse.x - b.x, dy = mouse.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < opts.attractRadius && dist > 0) {
            if (isMouseFast) {
              // scatter
              b.vx += (-dx / dist) * 1.5;
              b.vy += (-dy / dist) * 1.5;
              b.fleeing = true;
            } else {
              // attract
              const pull = (1 - dist / opts.attractRadius) * 0.08 * opts.speed;
              b.vx += (dx / dist) * pull;
              b.vy += (dy / dist) * pull;
              b.fleeing = false;
            }
          } else {
            b.fleeing = false;
          }
        }

        b.vx = (b.vx + wanderX) * 0.94;
        b.vy = (b.vy + wanderY) * 0.94;
        const spd = Math.hypot(b.vx, b.vy);
        const maxSpd = opts.speed * (b.fleeing ? 3 : 1.2);
        if (spd > maxSpd) { b.vx = (b.vx / spd) * maxSpd; b.vy = (b.vy / spd) * maxSpd; }

        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.size * 2) b.x = w + b.size;
        if (b.x > w + b.size * 2) b.x = -b.size;
        if (b.y < -b.size * 2) b.y = h + b.size;
        if (b.y > h + b.size * 2) b.y = -b.size;

        if (spd > 0.05) b.angle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        b.flapPhase += opts.flapSpeed * 0.15 * (b.fleeing ? 2 : 1);

        // draw
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        const flapX = Math.cos(b.flapPhase);

        // parse wing color with hue shift — use the raw hex, shift via filter trick or just use hsl if color is hsl-parseable
        const wingFill = hexToRgba(opts.wingColor, 0.85);
        const patFill = hexToRgba(opts.patternColor, 0.7);

        drawWing(ctx, b.size, flapX, 1, wingFill, patFill);
        drawWing(ctx, b.size, flapX, -1, wingFill, patFill);

        // body
        ctx.fillStyle = hexToRgba(opts.patternColor, 0.9);
        ctx.beginPath(); ctx.ellipse(0, b.size * 0.4, 1.5, b.size * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        // antennae
        ctx.strokeStyle = hexToRgba(opts.patternColor, 0.6);
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-3, -b.size * 0.4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(3, -b.size * 0.4); ctx.stroke();

        ctx.restore();
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
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep -i "butterfly\|ButterflySwarm" | head -20
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/components/ButterflySwarm/useButterflySwarm.ts
git commit -m "feat: add useButterflySwarm hook"
```

---

## Task 6: ButterflySwarm Component + Index

**Files:**
- Create: `src/components/ButterflySwarm/ButterflySwarm.tsx`
- Create: `src/components/ButterflySwarm/index.ts`

- [ ] **Step 1: Create ButterflySwarm.tsx**

```typescript
// src/components/ButterflySwarm/ButterflySwarm.tsx
import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useButterflySwarm } from "./useButterflySwarm";

type ButterflySwarmPreset = "default" | "monarch" | "morpho" | "meadow" | "night";

interface ButterflySwarmPresetValues {
  wingColor?: string;
  patternColor?: string;
  backgroundColor?: string;
}

const PRESETS: Record<ButterflySwarmPreset, ButterflySwarmPresetValues> = {
  default:  {},
  monarch:  { wingColor: "#e06010", patternColor: "#111111", backgroundColor: "#0a0800" },
  morpho:   { wingColor: "#1060ff", patternColor: "#0030aa", backgroundColor: "#000508" },
  meadow:   { wingColor: "#f0c030", patternColor: "#804000", backgroundColor: "#0a1405" },
  night:    { wingColor: "#c0d0e0", patternColor: "#304050", backgroundColor: "#020408" },
};

export interface ButterflySwarmProps extends BaseCanvasProps {
  /** Number of butterflies (default: 12) */
  butterflyCount?: number;
  /** Primary wing color (default: "#f97316") */
  wingColor?: string;
  /** Wing pattern and body color (default: "#111111") */
  patternColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Wing flap speed multiplier (default: 1) */
  flapSpeed?: number;
  /** Movement speed multiplier (default: 1) */
  speed?: number;
  /** Cursor attraction/scatter radius in px (default: 120) */
  attractRadius?: number;
  /** Enable cursor interaction (default: true) */
  interactive?: boolean;
  /** Show faint motion trails (default: false) */
  showTrails?: boolean;
  /** Named preset */
  preset?: ButterflySwarmPreset | string;
}

export const ButterflySwarm = forwardRef<HTMLCanvasElement, ButterflySwarmProps>(
  (props, ref) => {
    const {
      preset, butterflyCount, wingColor, patternColor, backgroundColor,
      flapSpeed, speed, attractRadius, interactive, showTrails,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as ButterflySwarmPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useButterflySwarm(internalRef, {
      butterflyCount: butterflyCount ?? 12,
      wingColor:      wingColor      ?? p.wingColor      ?? "#f97316",
      patternColor:   patternColor   ?? p.patternColor   ?? "#111111",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      flapSpeed:      flapSpeed      ?? 1,
      speed:          speed          ?? 1,
      attractRadius:  attractRadius  ?? 120,
      interactive:    interactive    ?? true,
      showTrails:     showTrails     ?? false,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

ButterflySwarm.displayName = "ButterflySwarm";
```

- [ ] **Step 2: Create index.ts**

```typescript
// src/components/ButterflySwarm/index.ts
export { ButterflySwarm } from "./ButterflySwarm";
export type { ButterflySwarmProps } from "./ButterflySwarm";
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ButterflySwarm/ButterflySwarm.tsx src/components/ButterflySwarm/index.ts
git commit -m "feat: add ButterflySwarm component with presets"
```

---

## Task 7: ButterflySwarm Doc Page

**Files:**
- Create: `src/docs/pages/components/ButterflySwarmPage.tsx`

- [ ] **Step 1: Create the doc page**

```typescript
// src/docs/pages/components/ButterflySwarmPage.tsx
import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { ButterflySwarm } from "../../../components/ButterflySwarm";

const PROPS = [
  { name: "butterflyCount",  type: "number",  default: "12",        description: "Number of butterflies." },
  { name: "wingColor",       type: "string",  default: '"#f97316"', description: "Primary wing fill color." },
  { name: "patternColor",    type: "string",  default: '"#111111"', description: "Wing spot and body color." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "flapSpeed",       type: "number",  default: "1",         description: "Wing flap speed multiplier." },
  { name: "speed",           type: "number",  default: "1",         description: "Movement speed multiplier." },
  { name: "attractRadius",   type: "number",  default: "120",       description: "Cursor attraction/scatter radius in px." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Cursor slowly attracts butterflies; fast movement scatters them." },
  { name: "showTrails",      type: "boolean", default: "false",     description: "Show faint motion trails." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "monarch" | "morpho" | "meadow" | "night"' },
];

const PRESET_VALUES: Record<string, { wingColor: string; patternColor: string; bg: string }> = {
  default: { wingColor: "#f97316", patternColor: "#111111", bg: "#111111" },
  monarch: { wingColor: "#e06010", patternColor: "#111111", bg: "#0a0800" },
  morpho:  { wingColor: "#1060ff", patternColor: "#0030aa", bg: "#000508" },
  meadow:  { wingColor: "#f0c030", patternColor: "#804000", bg: "#0a1405" },
  night:   { wingColor: "#c0d0e0", patternColor: "#304050", bg: "#020408" },
};

function ButterflySwarmPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]               = useState("default");
  const [wingColor, setWingColor]         = useState("#f97316");
  const [patternColor, setPatternColor]   = useState("#111111");
  const [bg, setBg]                       = useState("#111111");
  const [butterflyCount, setButterflyCount] = useState(12);
  const [flapSpeed, setFlapSpeed]         = useState(1);
  const [speed, setSpeed]                 = useState(1);
  const [attractRadius, setAttractRadius] = useState(120);
  const [interactive, setInteractive]     = useState(true);
  const [showTrails, setShowTrails]       = useState(false);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setWingColor(v.wingColor);
    setPatternColor(v.patternColor);
    setBg(v.bg);
  }

  const code = [
    `import { ButterflySwarm } from 'own-the-canvas';`,
    ``,
    `<ButterflySwarm`,
    `  preset="${preset}"`,
    `  wingColor="${wingColor}"`,
    `  patternColor="${patternColor}"`,
    `  backgroundColor="${bg}"`,
    `  butterflyCount={${butterflyCount}}`,
    `  flapSpeed={${flapSpeed}}`,
    `  speed={${speed}}`,
    `  attractRadius={${attractRadius}}`,
    `  interactive={${interactive}}`,
    `  showTrails={${showTrails}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <ButterflySwarm
        preset={preset}
        wingColor={wingColor}
        patternColor={patternColor}
        backgroundColor={bg}
        butterflyCount={butterflyCount}
        flapSpeed={flapSpeed}
        speed={speed}
        attractRadius={attractRadius}
        interactive={interactive}
        showTrails={showTrails}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Hover to attract · move fast to scatter" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "monarch", "morpho", "meadow", "night"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Wing color" value={wingColor} onChange={setWingColor} />
        <PColor label="Pattern color" value={patternColor} onChange={setPatternColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Motion trails" value={showTrails} onChange={setShowTrails} />
      </div>
      <div>
        <PSlider label="Count" value={butterflyCount} min={2} max={40} step={1} onChange={setButterflyCount} />
        <PSlider label="Flap speed" value={flapSpeed} min={0.2} max={4} step={0.1} onChange={setFlapSpeed} />
        <PSlider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
        <PSlider label="Attract radius" value={attractRadius} min={30} max={300} step={10} onChange={setAttractRadius} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function ButterflySwarmPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="ButterflySwarm"
      lead="A flock of flapping butterflies that drift autonomously. Hover to slowly attract them — move fast to scatter the swarm."
    >
      <ButterflySwarmPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls.</p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/docs/pages/components/ButterflySwarmPage.tsx
git commit -m "feat: add ButterflySwarmPage doc page"
```

---

## Task 8: Wire ButterflySwarm

**Files:**
- Modify: `src/index.ts`
- Modify: `src/docs/pages/Home.tsx`
- Modify: `src/docs/DocsApp.tsx`
- Modify: `src/docs/components/Sidebar.tsx`

- [ ] **Step 1: Append export to src/index.ts**

```typescript
export { ButterflySwarm } from "./components/ButterflySwarm";
export type { ButterflySwarmProps } from "./components/ButterflySwarm";
```

- [ ] **Step 2: Add lazy import to DocsApp.tsx** (after SpiderWebPage import):

```typescript
const ButterflySwarmPage = lazy(() => import("./pages/components/ButterflySwarmPage").then((m) => ({ default: m.ButterflySwarmPage })));
```

- [ ] **Step 3: Add route to DocsApp.tsx** (after spider-web route):

```typescript
<Route path="/components/butterfly-swarm"     element={<ButterflySwarmPage />} />
```

- [ ] **Step 4: Add to Sidebar.tsx COMPONENT_LINKS** (after SpiderWeb):

```typescript
{ name: "ButterflySwarm", path: "/components/butterfly-swarm" },
```

- [ ] **Step 5: Add import + COMPONENTS entry to Home.tsx**

Import:
```typescript
import { ButterflySwarm } from "../../components/ButterflySwarm";
```

COMPONENTS entry (after SpiderWeb):
```typescript
{ name: "ButterflySwarm", path: "/components/butterfly-swarm", accent: "#f97316", desc: "Flapping butterflies that drift and flock — hover to attract, move fast to scatter", preview: <ButterflySwarm butterflyCount={8} width="100%" height="100%" /> },
```

- [ ] **Step 6: Verify + commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add src/index.ts src/docs/DocsApp.tsx src/docs/components/Sidebar.tsx src/docs/pages/Home.tsx
git commit -m "feat: wire ButterflySwarm into docs app and library exports"
```

---

## Task 9: WillowTree Hook

**Files:**
- Create: `src/components/WillowTree/useWillowTree.ts`

- [ ] **Step 1: Create the hook**

```typescript
// src/components/WillowTree/useWillowTree.ts
import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface StrandNode {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
}

interface Strand {
  nodes: StrandNode[];
  phase: number;
}

interface BranchPoint {
  x: number; y: number;
  strands: Strand[];
}

interface FallingLeaf {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  rotSpeed: number;
  alpha: number;
  size: number;
}

interface TrunkSegment {
  x1: number; y1: number;
  x2: number; y2: number;
  w: number;
}

export interface UseWillowTreeOptions {
  trunkColor: string;
  leafColor: string;
  skyColor: string;
  groundColor: string;
  branchCount: number;
  strandCount: number;
  interactive: boolean;
  showFallingLeaves: boolean;
}

const STRAND_SPRING = 0.04;
const STRAND_DAMPING = 0.82;
const NODES_PER_STRAND = 12;

export function useWillowTree(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseWillowTreeOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, t = 0;

    const trunk: TrunkSegment[] = [];
    const branches: BranchPoint[] = [];
    const fallingLeaves: FallingLeaf[] = [];
    const mouse = { x: -1, normalizedX: 0 }; // normalizedX: -1 to 1

    function buildTree() {
      const { branchCount, strandCount } = optionsRef.current;
      trunk.length = 0; branches.length = 0;

      const cx = w / 2;
      const trunkBaseY = h;
      const trunkTopY = h * 0.35;
      const trunkH = trunkBaseY - trunkTopY;

      // trunk segments with slight lean
      const segs = 6;
      for (let i = 0; i < segs; i++) {
        const t0 = i / segs, t1 = (i + 1) / segs;
        const lean = Math.sin(t0 * Math.PI) * w * 0.02;
        trunk.push({
          x1: cx + lean, y1: trunkBaseY - t0 * trunkH,
          x2: cx + lean * 1.1, y2: trunkBaseY - t1 * trunkH,
          w: 18 * (1 - t0 * 0.6),
        });
      }

      // branch attachment points along upper trunk
      for (let b = 0; b < branchCount; b++) {
        const frac = 0.1 + (b / branchCount) * 0.85;
        const seg = trunk[Math.min(Math.floor(frac * segs), segs - 1)];
        const bx = seg.x2 + (Math.random() - 0.5) * w * 0.08;
        const by = seg.y2 + (Math.random() - 0.5) * h * 0.04;
        const branchReach = w * (0.15 + Math.random() * 0.2) * (Math.random() < 0.5 ? 1 : -1);
        const hangX = bx + branchReach;
        const hangY = by - h * 0.02;

        const strands: Strand[] = [];
        for (let s = 0; s < strandCount; s++) {
          const startX = hangX + (s / strandCount - 0.5) * Math.abs(branchReach) * 0.8;
          const strandLen = h * (0.3 + Math.random() * 0.25);
          const nodes: StrandNode[] = [];
          for (let n = 0; n < NODES_PER_STRAND; n++) {
            const frac2 = n / (NODES_PER_STRAND - 1);
            const bx2 = startX, by2 = hangY + frac2 * strandLen;
            nodes.push({ x: bx2, y: by2, vx: 0, vy: 0, baseX: bx2, baseY: by2 });
          }
          strands.push({ nodes, phase: Math.random() * Math.PI * 2 });
        }
        branches.push({ x: bx, y: by, strands });
      }
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      buildTree();
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
      mouse.normalizedX = (mouse.x / w) * 2 - 1; // -1 left, +1 right
    }
    function onMouseLeave() { mouse.x = -1; mouse.normalizedX = 0; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let raf = 0;
    function loop() {
      t += 0.016;
      const opts = optionsRef.current;

      // background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, opts.skyColor);
      grad.addColorStop(1, opts.groundColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // wind: mouse drives direction, ambient sine fallback
      const windX = opts.interactive && mouse.x >= 0
        ? mouse.normalizedX * 1.8
        : Math.sin(t * 0.4) * 0.6;

      // update strand physics
      for (const branch of branches) {
        for (const strand of branch.strands) {
          const { nodes, phase } = strand;
          // pin first node to base
          nodes[0].x = nodes[0].baseX; nodes[0].y = nodes[0].baseY;
          for (let n = 1; n < nodes.length; n++) {
            const nd = nodes[n];
            const windForce = windX * (n / nodes.length) * 0.8;
            const sway = Math.sin(t * 0.9 + phase + n * 0.3) * 0.15;
            const fx = nd.baseX - nd.x + windForce + sway;
            const fy = nd.baseY - nd.y;
            nd.vx = (nd.vx + fx * STRAND_SPRING) * STRAND_DAMPING;
            nd.vy = (nd.vy + fy * STRAND_SPRING) * STRAND_DAMPING;
            nd.x += nd.vx; nd.y += nd.vy;
          }
        }
      }

      // draw trunk
      for (const seg of trunk) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.strokeStyle = opts.trunkColor;
        ctx.lineWidth = seg.w;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // draw branch lines + strands
      for (const branch of branches) {
        // find trunk connection
        const lastSeg = trunk[trunk.length - 1];
        ctx.beginPath();
        ctx.moveTo(lastSeg.x2, lastSeg.y2);
        ctx.quadraticCurveTo(branch.x, branch.y - h * 0.05, branch.x, branch.y);
        ctx.strokeStyle = opts.trunkColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        for (const strand of branch.strands) {
          const { nodes } = strand;
          ctx.beginPath();
          ctx.moveTo(nodes[0].x, nodes[0].y);
          for (let n = 1; n < nodes.length; n++) {
            ctx.lineTo(nodes[n].x, nodes[n].y);
          }
          ctx.strokeStyle = hexToRgba(opts.leafColor, 0.7);
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // leaf dots along strand
          for (let n = 0; n < nodes.length; n += 2) {
            ctx.beginPath();
            ctx.ellipse(nodes[n].x, nodes[n].y, 3, 2, Math.PI / 4, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(opts.leafColor, 0.8);
            ctx.fill();
          }
        }
      }

      // falling leaves
      if (opts.showFallingLeaves) {
        if (Math.random() < 0.03 && fallingLeaves.length < 30) {
          const branch = branches[Math.floor(Math.random() * branches.length)];
          if (branch) {
            const strand = branch.strands[Math.floor(Math.random() * branch.strands.length)];
            const n = strand.nodes[Math.floor(Math.random() * strand.nodes.length)];
            fallingLeaves.push({ x: n.x, y: n.y, vx: windX * 0.5 + (Math.random() - 0.5) * 0.5, vy: 0.5 + Math.random() * 0.8, rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.08, alpha: 0.9, size: 3 + Math.random() * 3 });
          }
        }
        for (let i = fallingLeaves.length - 1; i >= 0; i--) {
          const leaf = fallingLeaves[i];
          leaf.x += leaf.vx + windX * 0.3;
          leaf.y += leaf.vy;
          leaf.rotation += leaf.rotSpeed;
          leaf.alpha -= 0.003;
          if (leaf.alpha <= 0 || leaf.y > h + 10) { fallingLeaves.splice(i, 1); continue; }
          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(opts.leafColor, leaf.alpha);
          ctx.fill();
          ctx.restore();
        }
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
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep -i "willow\|WillowTree" | head -20
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/components/WillowTree/useWillowTree.ts
git commit -m "feat: add useWillowTree hook with strand physics and wind"
```

---

## Task 10: WillowTree Component + Index

**Files:**
- Create: `src/components/WillowTree/WillowTree.tsx`
- Create: `src/components/WillowTree/index.ts`

- [ ] **Step 1: Create WillowTree.tsx**

```typescript
// src/components/WillowTree/WillowTree.tsx
import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useWillowTree } from "./useWillowTree";

type WillowTreePreset = "default" | "spring" | "autumn" | "night" | "winter";

interface WillowTreePresetValues {
  trunkColor?: string;
  leafColor?: string;
  skyColor?: string;
  groundColor?: string;
}

const PRESETS: Record<WillowTreePreset, WillowTreePresetValues> = {
  default: {},
  spring:  { trunkColor: "#5a3a20", leafColor: "#66cc44", skyColor: "#1a2a3a", groundColor: "#0a1a08" },
  autumn:  { trunkColor: "#4a2a10", leafColor: "#cc6620", skyColor: "#1a0e08", groundColor: "#120800" },
  night:   { trunkColor: "#3a3040", leafColor: "#8898a8", skyColor: "#020412", groundColor: "#060412" },
  winter:  { trunkColor: "#5a5060", leafColor: "#c0c8d0", skyColor: "#080c14", groundColor: "#0a0c10" },
};

export interface WillowTreeProps extends BaseCanvasProps {
  /** Trunk and branch color (default: "#4a3728") */
  trunkColor?: string;
  /** Leaf and strand color (default: "#4a7c59") */
  leafColor?: string;
  /** Background gradient top color (default: "#111111") */
  skyColor?: string;
  /** Background gradient bottom color (default: "#1a1a1a") */
  groundColor?: string;
  /** Number of major branches (default: 8) */
  branchCount?: number;
  /** Hanging strands per branch (default: 6) */
  strandCount?: number;
  /** Mouse X controls wind direction (default: true) */
  interactive?: boolean;
  /** Enable falling leaf particles (default: true) */
  showFallingLeaves?: boolean;
  /** Named preset */
  preset?: WillowTreePreset | string;
}

export const WillowTree = forwardRef<HTMLCanvasElement, WillowTreeProps>(
  (props, ref) => {
    const {
      preset, trunkColor, leafColor, skyColor, groundColor,
      branchCount, strandCount, interactive, showFallingLeaves,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as WillowTreePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useWillowTree(internalRef, {
      trunkColor:       trunkColor       ?? p.trunkColor  ?? "#4a3728",
      leafColor:        leafColor        ?? p.leafColor   ?? "#4a7c59",
      skyColor:         skyColor         ?? p.skyColor    ?? "#111111",
      groundColor:      groundColor      ?? p.groundColor ?? "#1a1a1a",
      branchCount:      branchCount      ?? 8,
      strandCount:      strandCount      ?? 6,
      interactive:      interactive      ?? true,
      showFallingLeaves: showFallingLeaves ?? true,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

WillowTree.displayName = "WillowTree";
```

- [ ] **Step 2: Create index.ts**

```typescript
// src/components/WillowTree/index.ts
export { WillowTree } from "./WillowTree";
export type { WillowTreeProps } from "./WillowTree";
```

- [ ] **Step 3: Commit**

```bash
git add src/components/WillowTree/WillowTree.tsx src/components/WillowTree/index.ts
git commit -m "feat: add WillowTree component with presets"
```

---

## Task 11: WillowTree Doc Page

**Files:**
- Create: `src/docs/pages/components/WillowTreePage.tsx`

- [ ] **Step 1: Create the doc page**

```typescript
// src/docs/pages/components/WillowTreePage.tsx
import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { WillowTree } from "../../../components/WillowTree";

const PROPS = [
  { name: "trunkColor",       type: "string",  default: '"#4a3728"', description: "Trunk and branch color." },
  { name: "leafColor",        type: "string",  default: '"#4a7c59"', description: "Leaf strand and leaf color." },
  { name: "skyColor",         type: "string",  default: '"#111111"', description: "Background gradient top." },
  { name: "groundColor",      type: "string",  default: '"#1a1a1a"', description: "Background gradient bottom." },
  { name: "branchCount",      type: "number",  default: "8",         description: "Number of major branches." },
  { name: "strandCount",      type: "number",  default: "6",         description: "Hanging strand groups per branch." },
  { name: "interactive",      type: "boolean", default: "true",      description: "Mouse X position controls wind direction." },
  { name: "showFallingLeaves",type: "boolean", default: "true",      description: "Enable detaching falling leaf particles." },
  { name: "preset",           type: "string",  default: "—",         description: '"default" | "spring" | "autumn" | "night" | "winter"' },
];

const PRESET_VALUES: Record<string, { trunkColor: string; leafColor: string; skyColor: string; groundColor: string }> = {
  default: { trunkColor: "#4a3728", leafColor: "#4a7c59", skyColor: "#111111",  groundColor: "#1a1a1a" },
  spring:  { trunkColor: "#5a3a20", leafColor: "#66cc44", skyColor: "#1a2a3a",  groundColor: "#0a1a08" },
  autumn:  { trunkColor: "#4a2a10", leafColor: "#cc6620", skyColor: "#1a0e08",  groundColor: "#120800" },
  night:   { trunkColor: "#3a3040", leafColor: "#8898a8", skyColor: "#020412",  groundColor: "#060412" },
  winter:  { trunkColor: "#5a5060", leafColor: "#c0c8d0", skyColor: "#080c14",  groundColor: "#0a0c10" },
};

function WillowTreePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]               = useState("default");
  const [trunkColor, setTrunkColor]       = useState("#4a3728");
  const [leafColor, setLeafColor]         = useState("#4a7c59");
  const [skyColor, setSkyColor]           = useState("#111111");
  const [groundColor, setGroundColor]     = useState("#1a1a1a");
  const [branchCount, setBranchCount]     = useState(8);
  const [strandCount, setStrandCount]     = useState(6);
  const [interactive, setInteractive]     = useState(true);
  const [showFallingLeaves, setShowFallingLeaves] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setTrunkColor(v.trunkColor);
    setLeafColor(v.leafColor);
    setSkyColor(v.skyColor);
    setGroundColor(v.groundColor);
  }

  const code = [
    `import { WillowTree } from 'own-the-canvas';`,
    ``,
    `<WillowTree`,
    `  preset="${preset}"`,
    `  trunkColor="${trunkColor}"`,
    `  leafColor="${leafColor}"`,
    `  skyColor="${skyColor}"`,
    `  groundColor="${groundColor}"`,
    `  branchCount={${branchCount}}`,
    `  strandCount={${strandCount}}`,
    `  interactive={${interactive}}`,
    `  showFallingLeaves={${showFallingLeaves}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: skyColor }}>
      <WillowTree
        preset={preset}
        trunkColor={trunkColor}
        leafColor={leafColor}
        skyColor={skyColor}
        groundColor={groundColor}
        branchCount={branchCount}
        strandCount={strandCount}
        interactive={interactive}
        showFallingLeaves={showFallingLeaves}
        width="100%"
        height="100%"
      />
      <PLiveLabel text={interactive ? "Move cursor left/right to control wind" : "Gentle ambient breeze"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "spring", "autumn", "night", "winter"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Trunk color" value={trunkColor} onChange={setTrunkColor} />
        <PColor label="Leaf color" value={leafColor} onChange={setLeafColor} />
        <PColor label="Sky color" value={skyColor} onChange={setSkyColor} />
        <PColor label="Ground color" value={groundColor} onChange={setGroundColor} />
        <PToggle label="Interactive wind" value={interactive} onChange={setInteractive} />
        <PToggle label="Falling leaves" value={showFallingLeaves} onChange={setShowFallingLeaves} />
      </div>
      <div>
        <PSlider label="Branch count" value={branchCount} min={2} max={16} step={1} onChange={setBranchCount} />
        <PSlider label="Strands per branch" value={strandCount} min={2} max={12} step={1} onChange={setStrandCount} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function WillowTreePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="WillowTree"
      lead="A generative weeping willow with spring-physics strand simulation. Move your cursor left and right to control wind direction and watch the leaves cascade."
    >
      <WillowTreePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls.</p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/docs/pages/components/WillowTreePage.tsx
git commit -m "feat: add WillowTreePage doc page"
```

---

## Task 12: Wire WillowTree

- [ ] **Step 1: Append export to src/index.ts**

```typescript
export { WillowTree } from "./components/WillowTree";
export type { WillowTreeProps } from "./components/WillowTree";
```

- [ ] **Step 2: Add lazy import to DocsApp.tsx** (after ButterflySwarmPage):

```typescript
const WillowTreePage     = lazy(() => import("./pages/components/WillowTreePage").then((m) => ({ default: m.WillowTreePage })));
```

- [ ] **Step 3: Add route** (after butterfly-swarm):

```typescript
<Route path="/components/willow-tree"         element={<WillowTreePage />} />
```

- [ ] **Step 4: Add to Sidebar.tsx** (after ButterflySwarm):

```typescript
{ name: "WillowTree", path: "/components/willow-tree" },
```

- [ ] **Step 5: Add import + entry to Home.tsx**

```typescript
import { WillowTree } from "../../components/WillowTree";
```

```typescript
{ name: "WillowTree", path: "/components/willow-tree", accent: "#4a7c59", desc: "Generative weeping willow with spring strand physics — move cursor to direct the wind", preview: <WillowTree branchCount={6} strandCount={4} width="100%" height="100%" /> },
```

- [ ] **Step 6: Verify + commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add src/index.ts src/docs/DocsApp.tsx src/docs/components/Sidebar.tsx src/docs/pages/Home.tsx
git commit -m "feat: wire WillowTree into docs app and library exports"
```

---

## Task 13: DeepSeaBioluminescence Hook

**Files:**
- Create: `src/components/DeepSeaBioluminescence/useDeepSeaBioluminescence.ts`

- [ ] **Step 1: Create the hook**

```typescript
// src/components/DeepSeaBioluminescence/useDeepSeaBioluminescence.ts
import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface TentacleNode {
  x: number; y: number;
  vx: number; vy: number;
}

interface Jellyfish {
  x: number; y: number;
  vy: number;
  phase: number;
  size: number;
  tentacles: TentacleNode[][];
  drift: number;
}

interface Plankton {
  x: number; y: number;
  vx: number; vy: number;
  brightness: number;
  glowTimer: number;
  size: number;
}

interface GlowRipple {
  x: number; y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export interface UseDeepSeaBioluminescenceOptions {
  jellyfishCount: number;
  planktonCount: number;
  jellyfishColor: string;
  glowColor: string;
  waterColor: string;
  interactive: boolean;
  showAnglerfish: boolean;
  speed: number;
}

const TENTACLE_NODES = 8;
const TENTACLE_COUNT = 6;

export function useDeepSeaBioluminescence(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseDeepSeaBioluminescenceOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, t = 0;

    const jellyfish: Jellyfish[] = [];
    const plankton: Plankton[] = [];
    const ripples: GlowRipple[] = [];
    const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };
    const anglerfish = { phase: 0, lureX: 0, lureY: 0 };

    function makeTentacles(jx: number, jy: number, size: number): TentacleNode[][] {
      return Array.from({ length: TENTACLE_COUNT }, (_, i) => {
        const angle = (i / TENTACLE_COUNT) * Math.PI + Math.PI * 0.15;
        return Array.from({ length: TENTACLE_NODES }, (_, n) => ({
          x: jx + Math.cos(angle) * n * size * 0.15,
          y: jy + Math.sin(angle) * n * size * 0.2 + size,
          vx: 0, vy: 0,
        }));
      });
    }

    function makeJellyfish(): Jellyfish {
      const x = Math.random() * w;
      const y = h * 0.3 + Math.random() * h * 0.6;
      const size = 20 + Math.random() * 30;
      return { x, y, vy: -(0.2 + Math.random() * 0.3) * optionsRef.current.speed, phase: Math.random() * Math.PI * 2, size, tentacles: makeTentacles(x, y, size), drift: (Math.random() - 0.5) * 0.3 };
    }

    function makePlankton(): Plankton {
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15, vy: -(0.1 + Math.random() * 0.2) * optionsRef.current.speed,
        brightness: 0.2 + Math.random() * 0.4, glowTimer: 0,
        size: 0.8 + Math.random() * 1.5,
      };
    }

    function init() {
      jellyfish.length = 0;
      plankton.length = 0;
      for (let i = 0; i < optionsRef.current.jellyfishCount; i++) jellyfish.push(makeJellyfish());
      for (let i = 0; i < optionsRef.current.planktonCount; i++) plankton.push(makePlankton());
      anglerfish.lureX = w * 0.85; anglerfish.lureY = h * 0.75;
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      init();
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
      mouse.prevX = mouse.x; mouse.prevY = mouse.y;
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      const opts = optionsRef.current;
      if (!opts.interactive) return;
      const spd = Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY);
      if (spd > 5) ripples.push({ x: mouse.x, y: mouse.y, radius: 0, maxRadius: 80 + spd * 3, alpha: 0.6 });
    }
    function onMouseLeave() { mouse.x = -9999; mouse.y = -9999; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let raf = 0;
    function loop() {
      t += 0.016;
      const opts = optionsRef.current;

      ctx.fillStyle = opts.waterColor;
      ctx.fillRect(0, 0, w, h);

      // update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += 2.5;
        ripples[i].alpha -= 0.008;
        if (ripples[i].alpha <= 0) ripples.splice(i, 1);
      }

      // update plankton brightness from ripples
      for (const p of plankton) {
        for (const rip of ripples) {
          const dist = Math.hypot(p.x - rip.x, p.y - rip.y);
          if (Math.abs(dist - rip.radius) < 12) {
            p.glowTimer = Math.max(p.glowTimer, 60 * rip.alpha);
          }
        }
        if (p.glowTimer > 0) { p.glowTimer--; p.brightness = Math.min(1, p.brightness + 0.05); }
        else p.brightness = Math.max(0.15, p.brightness - 0.01);

        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;

        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(opts.glowColor, p.brightness * 0.7);
        ctx.fill();
      }

      // draw ripples
      for (const rip of ripples) {
        ctx.beginPath(); ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(opts.glowColor, rip.alpha * 0.3);
        ctx.lineWidth = 2; ctx.stroke();
      }

      // update + draw jellyfish
      while (jellyfish.length < opts.jellyfishCount) jellyfish.push(makeJellyfish());
      jellyfish.length = opts.jellyfishCount;

      for (const jf of jellyfish) {
        const pulse = Math.sin(t * 1.5 * opts.speed + jf.phase);
        const bellH = jf.size * (0.5 + pulse * 0.15);
        jf.vy = -(0.2 + pulse * 0.15) * opts.speed;
        jf.x += jf.drift;
        jf.y += jf.vy;
        if (jf.y < -jf.size * 3) { jf.y = h + jf.size; jf.x = Math.random() * w; }
        if (jf.x < -jf.size) jf.x = w + jf.size;
        if (jf.x > w + jf.size) jf.x = -jf.size;

        // bell
        const bellAlpha = 0.35 + pulse * 0.1;
        ctx.beginPath();
        ctx.ellipse(jf.x, jf.y, jf.size * 0.7, bellH, 0, Math.PI, Math.PI * 2);
        ctx.fillStyle = hexToRgba(opts.jellyfishColor, bellAlpha);
        ctx.fill();
        // glow rim
        const rimGrad = ctx.createRadialGradient(jf.x, jf.y, jf.size * 0.4, jf.x, jf.y, jf.size * 0.8);
        rimGrad.addColorStop(0, hexToRgba(opts.glowColor, 0));
        rimGrad.addColorStop(1, hexToRgba(opts.glowColor, 0.2));
        ctx.beginPath(); ctx.ellipse(jf.x, jf.y, jf.size * 0.8, bellH * 1.1, 0, Math.PI, Math.PI * 2);
        ctx.fillStyle = rimGrad; ctx.fill();

        // tentacles (simple chain)
        for (let ti = 0; ti < TENTACLE_COUNT; ti++) {
          const tAngle = (ti / TENTACLE_COUNT) * Math.PI + Math.PI * 0.15;
          const startX = jf.x + Math.cos(tAngle) * jf.size * 0.5;
          const startY = jf.y + bellH * 0.3;
          ctx.beginPath(); ctx.moveTo(startX, startY);
          for (let n = 1; n <= 6; n++) {
            const wave = Math.sin(t * 2 + jf.phase + n * 0.8 + ti) * jf.size * 0.15;
            ctx.lineTo(startX + wave, startY + n * jf.size * 0.22);
          }
          ctx.strokeStyle = hexToRgba(opts.jellyfishColor, 0.4);
          ctx.lineWidth = 1; ctx.stroke();
        }
      }

      // anglerfish lure
      if (opts.showAnglerfish) {
        anglerfish.phase += 0.04;
        const lx = w * 0.85 + Math.sin(anglerfish.phase * 0.7) * 20;
        const ly = h * 0.8 + Math.cos(anglerfish.phase * 0.5) * 15;
        const lureGlow = (Math.sin(anglerfish.phase * 2) * 0.3 + 0.7);
        // lure line
        ctx.beginPath(); ctx.moveTo(lx - 40, ly - 20); ctx.lineTo(lx, ly);
        ctx.strokeStyle = hexToRgba(opts.glowColor, 0.3); ctx.lineWidth = 1.5; ctx.stroke();
        // lure bulb glow
        const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 18 * lureGlow);
        lg.addColorStop(0, hexToRgba(opts.glowColor, 0.9 * lureGlow));
        lg.addColorStop(1, hexToRgba(opts.glowColor, 0));
        ctx.beginPath(); ctx.arc(lx, ly, 18 * lureGlow, 0, Math.PI * 2);
        ctx.fillStyle = lg; ctx.fill();
        // fish body silhouette (simple)
        ctx.beginPath();
        ctx.ellipse(lx - 50, ly - 10, 35, 18, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba("#000000", 0.6); ctx.fill();
        // tail
        ctx.beginPath(); ctx.moveTo(lx - 82, ly - 10);
        ctx.lineTo(lx - 100, ly - 25); ctx.lineTo(lx - 100, ly + 5);
        ctx.fillStyle = hexToRgba("#000000", 0.5); ctx.fill();
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
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx tsc --noEmit 2>&1 | grep -i "deepsea\|Bioluminescence" | head -20
```
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add src/components/DeepSeaBioluminescence/useDeepSeaBioluminescence.ts
git commit -m "feat: add useDeepSeaBioluminescence hook"
```

---

## Task 14: DeepSeaBioluminescence Component + Index

**Files:**
- Create: `src/components/DeepSeaBioluminescence/DeepSeaBioluminescence.tsx`
- Create: `src/components/DeepSeaBioluminescence/index.ts`

- [ ] **Step 1: Create DeepSeaBioluminescence.tsx**

```typescript
// src/components/DeepSeaBioluminescence/DeepSeaBioluminescence.tsx
import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useDeepSeaBioluminescence } from "./useDeepSeaBioluminescence";

type DeepSeaBioluminescencePreset = "default" | "abyssal" | "coral" | "aurora" | "crimson";

interface DeepSeaBioluminescencePresetValues {
  jellyfishColor?: string;
  glowColor?: string;
  waterColor?: string;
}

const PRESETS: Record<DeepSeaBioluminescencePreset, DeepSeaBioluminescencePresetValues> = {
  default:  {},
  abyssal:  { jellyfishColor: "#6050a0", glowColor: "#8060cc", waterColor: "#010208" },
  coral:    { jellyfishColor: "#ff8060", glowColor: "#ff6090", waterColor: "#02080e" },
  aurora:   { jellyfishColor: "#40cc80", glowColor: "#00ffaa", waterColor: "#010a05" },
  crimson:  { jellyfishColor: "#cc2020", glowColor: "#ff3030", waterColor: "#080000" },
};

export interface DeepSeaBioluminescenceProps extends BaseCanvasProps {
  /** Number of jellyfish (default: 5) */
  jellyfishCount?: number;
  /** Number of plankton particles (default: 200) */
  planktonCount?: number;
  /** Jellyfish bell color (default: "#88ccff") */
  jellyfishColor?: string;
  /** Bioluminescent glow color (default: "#00ffcc") */
  glowColor?: string;
  /** Water background color (default: "#020c14") */
  waterColor?: string;
  /** Cursor movement triggers glow ripples (default: true) */
  interactive?: boolean;
  /** Show anglerfish lure in corner (default: true) */
  showAnglerfish?: boolean;
  /** Overall drift speed multiplier (default: 1) */
  speed?: number;
  /** Named preset */
  preset?: DeepSeaBioluminescencePreset | string;
}

export const DeepSeaBioluminescence = forwardRef<HTMLCanvasElement, DeepSeaBioluminescenceProps>(
  (props, ref) => {
    const {
      preset, jellyfishCount, planktonCount, jellyfishColor, glowColor,
      waterColor, interactive, showAnglerfish, speed,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as DeepSeaBioluminescencePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useDeepSeaBioluminescence(internalRef, {
      jellyfishCount:  jellyfishCount  ?? 5,
      planktonCount:   planktonCount   ?? 200,
      jellyfishColor:  jellyfishColor  ?? p.jellyfishColor  ?? "#88ccff",
      glowColor:       glowColor       ?? p.glowColor       ?? "#00ffcc",
      waterColor:      waterColor      ?? p.waterColor      ?? "#020c14",
      interactive:     interactive     ?? true,
      showAnglerfish:  showAnglerfish  ?? true,
      speed:           speed           ?? 1,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

DeepSeaBioluminescence.displayName = "DeepSeaBioluminescence";
```

- [ ] **Step 2: Create index.ts**

```typescript
// src/components/DeepSeaBioluminescence/index.ts
export { DeepSeaBioluminescence } from "./DeepSeaBioluminescence";
export type { DeepSeaBioluminescenceProps } from "./DeepSeaBioluminescence";
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DeepSeaBioluminescence/DeepSeaBioluminescence.tsx src/components/DeepSeaBioluminescence/index.ts
git commit -m "feat: add DeepSeaBioluminescence component with presets"
```

---

## Task 15: DeepSeaBioluminescence Doc Page

**Files:**
- Create: `src/docs/pages/components/DeepSeaBioluminescencePage.tsx`

- [ ] **Step 1: Create the doc page**

```typescript
// src/docs/pages/components/DeepSeaBioluminescencePage.tsx
import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DeepSeaBioluminescence } from "../../../components/DeepSeaBioluminescence";

const PROPS = [
  { name: "jellyfishCount",  type: "number",  default: "5",          description: "Number of jellyfish." },
  { name: "planktonCount",   type: "number",  default: "200",        description: "Number of plankton particles." },
  { name: "jellyfishColor",  type: "string",  default: '"#88ccff"',  description: "Jellyfish bell color." },
  { name: "glowColor",       type: "string",  default: '"#00ffcc"',  description: "Bioluminescent glow color (plankton + ripples)." },
  { name: "waterColor",      type: "string",  default: '"#020c14"',  description: "Deep water background color." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Cursor movement triggers bioluminescent ripples." },
  { name: "showAnglerfish",  type: "boolean", default: "true",       description: "Show anglerfish with glowing lure." },
  { name: "speed",           type: "number",  default: "1",          description: "Overall drift speed multiplier." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "abyssal" | "coral" | "aurora" | "crimson"' },
];

const PRESET_VALUES: Record<string, { jellyfishColor: string; glowColor: string; waterColor: string }> = {
  default: { jellyfishColor: "#88ccff", glowColor: "#00ffcc", waterColor: "#020c14" },
  abyssal: { jellyfishColor: "#6050a0", glowColor: "#8060cc", waterColor: "#010208" },
  coral:   { jellyfishColor: "#ff8060", glowColor: "#ff6090", waterColor: "#02080e" },
  aurora:  { jellyfishColor: "#40cc80", glowColor: "#00ffaa", waterColor: "#010a05" },
  crimson: { jellyfishColor: "#cc2020", glowColor: "#ff3030", waterColor: "#080000" },
};

function DeepSeaBioluminescencePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]               = useState("default");
  const [jellyfishColor, setJellyfishColor] = useState("#88ccff");
  const [glowColor, setGlowColor]         = useState("#00ffcc");
  const [waterColor, setWaterColor]       = useState("#020c14");
  const [jellyfishCount, setJellyfishCount] = useState(5);
  const [planktonCount, setPlanktonCount] = useState(200);
  const [speed, setSpeed]                 = useState(1);
  const [interactive, setInteractive]     = useState(true);
  const [showAnglerfish, setShowAnglerfish] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setJellyfishColor(v.jellyfishColor);
    setGlowColor(v.glowColor);
    setWaterColor(v.waterColor);
  }

  const code = [
    `import { DeepSeaBioluminescence } from 'own-the-canvas';`,
    ``,
    `<DeepSeaBioluminescence`,
    `  preset="${preset}"`,
    `  jellyfishColor="${jellyfishColor}"`,
    `  glowColor="${glowColor}"`,
    `  waterColor="${waterColor}"`,
    `  jellyfishCount={${jellyfishCount}}`,
    `  planktonCount={${planktonCount}}`,
    `  speed={${speed}}`,
    `  interactive={${interactive}}`,
    `  showAnglerfish={${showAnglerfish}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: waterColor }}>
      <DeepSeaBioluminescence
        preset={preset}
        jellyfishColor={jellyfishColor}
        glowColor={glowColor}
        waterColor={waterColor}
        jellyfishCount={jellyfishCount}
        planktonCount={planktonCount}
        speed={speed}
        interactive={interactive}
        showAnglerfish={showAnglerfish}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Move cursor to trigger bioluminescent ripples" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "abyssal", "coral", "aurora", "crimson"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Jellyfish color" value={jellyfishColor} onChange={setJellyfishColor} />
        <PColor label="Glow color" value={glowColor} onChange={setGlowColor} />
        <PColor label="Water color" value={waterColor} onChange={setWaterColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Anglerfish" value={showAnglerfish} onChange={setShowAnglerfish} />
      </div>
      <div>
        <PSlider label="Jellyfish" value={jellyfishCount} min={1} max={15} step={1} onChange={setJellyfishCount} />
        <PSlider label="Plankton" value={planktonCount} min={50} max={500} step={25} onChange={setPlanktonCount} />
        <PSlider label="Speed" value={speed} min={0.2} max={3} step={0.1} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function DeepSeaBioluminescencePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="DeepSeaBioluminescence"
      lead="A dark ocean floor alive with drifting jellyfish, bioluminescent plankton, and a lurking anglerfish. Move your cursor to trigger rippling blue-green glow."
    >
      <DeepSeaBioluminescencePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls.</p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/docs/pages/components/DeepSeaBioluminescencePage.tsx
git commit -m "feat: add DeepSeaBioluminescencePage doc page"
```

---

## Task 16: Wire DeepSeaBioluminescence

- [ ] **Step 1: Append export to src/index.ts**

```typescript
export { DeepSeaBioluminescence } from "./components/DeepSeaBioluminescence";
export type { DeepSeaBioluminescenceProps } from "./components/DeepSeaBioluminescence";
```

- [ ] **Step 2: Add lazy import to DocsApp.tsx** (after WillowTreePage):

```typescript
const DeepSeaBioluminescencePage = lazy(() => import("./pages/components/DeepSeaBioluminescencePage").then((m) => ({ default: m.DeepSeaBioluminescencePage })));
```

- [ ] **Step 3: Add route** (after willow-tree):

```typescript
<Route path="/components/deep-sea-bioluminescence" element={<DeepSeaBioluminescencePage />} />
```

- [ ] **Step 4: Add to Sidebar.tsx** (after WillowTree):

```typescript
{ name: "DeepSeaBioluminescence", path: "/components/deep-sea-bioluminescence" },
```

- [ ] **Step 5: Add import + entry to Home.tsx**

```typescript
import { DeepSeaBioluminescence } from "../../components/DeepSeaBioluminescence";
```

```typescript
{ name: "DeepSeaBioluminescence", path: "/components/deep-sea-bioluminescence", accent: "#00ffcc", desc: "Glowing jellyfish, plankton, and anglerfish in the deep ocean — cursor triggers bioluminescent ripples", preview: <DeepSeaBioluminescence jellyfishCount={3} planktonCount={120} width="100%" height="100%" /> },
```

- [ ] **Step 6: Final verify + commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add src/index.ts src/docs/DocsApp.tsx src/docs/components/Sidebar.tsx src/docs/pages/Home.tsx
git commit -m "feat: wire DeepSeaBioluminescence into docs app and library exports"
```
