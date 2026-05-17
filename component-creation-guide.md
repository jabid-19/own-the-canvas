# Component Creation Guide

Step-by-step reference for adding a new canvas component to own-the-canvas. Follow every step in order — the checklist at the bottom tracks progress.

---

## Overview: Files to Create/Edit

For a component named `MyEffect`:

**Create (4 new files):**
1. `src/components/MyEffect/useMyEffect.ts` — all canvas drawing logic
2. `src/components/MyEffect/MyEffect.tsx` — React component (forwardRef + preset resolution)
3. `src/components/MyEffect/index.ts` — barrel re-export
4. `src/docs/pages/components/MyEffectPage.tsx` — docs playground page

**Edit (3 existing files):**
5. `src/index.ts` — add export
6. `src/docs/DocsApp.tsx` — add lazy import + route
7. `src/docs/components/Sidebar.tsx` — add nav link

---

## Step 1 — Design the Props

Before writing any code, decide:
- What does each prop visually control?
- What is the sensible default for someone who just drops in `<MyEffect />`?
- **Defaults must be monochrome**: use `"#111111"` (background), `"#ffffff"` (primary), `"#6b7280"` (secondary)
- What 5 named presets cover the most useful visual styles?

Write down your props interface and preset map before opening any files.

---

## Step 2 — Create `useMyEffect.ts`

**File:** `src/components/MyEffect/useMyEffect.ts`

This hook contains 100% of the canvas drawing logic. The React component never touches `ctx`.

### Template

```ts
import { useRef, useEffect, RefObject } from "react";

// Export any union types that consumers may want
export type MyEffectMode = "mode-a" | "mode-b";

export interface UseMyEffectOptions {
  // All props, fully resolved (no optionals — defaults applied in the component)
  color: string;
  backgroundColor: string;
  speed: number;
  // ...
}

export function useMyEffect(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseMyEffectOptions
) {
  // 1. Keep options in a ref so the rAF loop always reads latest values
  //    without needing to re-run the effect when props change.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // 2. Keep any mutable animation state in refs (never in component state)
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    // 3. DPR-aware resize — always do this, never skip
    function resize(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      w = width;
      h = height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      // Re-initialize state that depends on canvas size
      particlesRef.current = initParticles(w, h);
    }

    // 4. ResizeObserver watches the parent div, not the canvas or window
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    // 5. Mouse interaction (if needed)
    let mouseX = -9999;
    let mouseY = -9999;
    function onMouseMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    }
    function onMouseLeave() { mouseX = -9999; mouseY = -9999; }
    // Add listeners only if interactive
    // parent.addEventListener("mousemove", onMouseMove);
    // parent.addEventListener("mouseleave", onMouseLeave);

    // 6. The draw function reads from optionsRef, not closed-over vars
    function draw(dt: number) {
      const { color, backgroundColor, speed } = optionsRef.current;

      // Clear / fade background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // Draw your effect here
    }

    // 7. rAF loop with delta time
    let lastTime = 0;
    function loop(timestamp: number) {
      const dt = lastTime ? timestamp - lastTime : 16;
      lastTime = timestamp;
      draw(dt);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    // 8. Cleanup — always cancel rAF and disconnect observer
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      // parent.removeEventListener("mousemove", onMouseMove);
      // parent.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]); // Only canvasRef — options flow through optionsRef
}
```

### Key Rules for the Hook

- **`optionsRef` pattern**: assign `optionsRef.current = options` at top of hook body (outside `useEffect`). This keeps the rAF loop always reading the latest prop values without re-running the effect every render.
- **`useEffect` dep array**: only `[canvasRef]`. Never include `options` — changes flow through `optionsRef`.
- **DPR scaling**: always multiply `canvas.width/height` by `devicePixelRatio`, then `ctx.scale(dpr, dpr)`. Skipping this causes blurry rendering on retina screens.
- **ResizeObserver on parent**: the canvas fills its parent div — observe `parent`, not `canvas` itself.
- **No React state**: use `useRef` for all mutable animation state (particles, drops, velocity, etc). React state triggers re-renders and breaks animation loops.
- **Clean up everything**: `cancelAnimationFrame`, `ro.disconnect()`, all event listeners.

### Throttled loops (e.g., MatrixRain pattern)

If your effect runs slower than 60fps by design (e.g., `speed` is ms-per-frame):

```ts
let elapsed = 0;
function loop(timestamp: number) {
  const dt = lastTime ? timestamp - lastTime : 0;
  lastTime = timestamp;
  elapsed += dt;
  if (elapsed >= optionsRef.current.speed) {
    elapsed = elapsed % optionsRef.current.speed;
    draw();
  }
  rafRef.current = requestAnimationFrame(loop);
}
```

### Using color utilities

```ts
import { hexToRgba, hexToRgbString, sampleGradient } from "../../utils/color";

// Hex → rgba string
ctx.fillStyle = hexToRgba("#ff0000", 0.5); // "rgba(255,0,0,0.5)"

// Multi-stop gradient at position t (0–1)
const [r, g, b] = sampleGradient(["#000000", "#ff0000", "#ffffff"], t);
ctx.fillStyle = `rgb(${r},${g},${b})`;
```

---

## Step 3 — Create `MyEffect.tsx`

**File:** `src/components/MyEffect/MyEffect.tsx`

This file only handles React concerns: preset resolution, prop merging, and JSX.

### Template

```tsx
import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useMyEffect, MyEffectMode } from "./useMyEffect";

// 1. Preset union type
type MyEffectPreset = "default" | "neon" | "minimal" | "dark" | "vivid";

// 2. Preset values — only props that differ from component defaults
interface MyEffectPresetValues {
  color?: string;
  backgroundColor?: string;
  speed?: number;
  // Only include props the preset actually changes
}

// 3. Preset map — "default" preset is always empty {}
const PRESETS: Record<MyEffectPreset, MyEffectPresetValues> = {
  default: {},
  neon: {
    color: "#00ffff",
    backgroundColor: "#000000",
    speed: 1.5,
  },
  minimal: {
    color: "#94a3b8",
    backgroundColor: "transparent",
    speed: 0.5,
  },
  dark: {
    color: "#6b7280",
    backgroundColor: "#0a0a0a",
  },
  vivid: {
    color: "#f43f5e",
    backgroundColor: "#050010",
    speed: 2,
  },
};

// 4. Props interface — extends BaseCanvasProps
export interface MyEffectProps extends BaseCanvasProps {
  /** Primary color (default: "#ffffff") */
  color?: string;
  /** Background color (default: "#111111") */
  backgroundColor?: string;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Visualization mode (default: "mode-a") */
  mode?: MyEffectMode;
  /** Named preset: "default" | "neon" | "minimal" | "dark" | "vivid" */
  preset?: MyEffectPreset | string;
}

// 5. Component — always forwardRef to HTMLCanvasElement
export const MyEffect = forwardRef<HTMLCanvasElement, MyEffectProps>(
  (props, ref) => {
    const {
      preset,
      color,
      backgroundColor,
      speed,
      mode,
      width,
      height,
      className,
      style,
    } = props;

    // 6. Preset resolution — always this pattern
    const p = (preset && PRESETS[preset as MyEffectPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    // 7. Prop merging: explicit prop ?? preset value ?? hard default
    useMyEffect(internalRef, {
      color:           color           ?? p.color           ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      speed:           speed           ?? p.speed           ?? 1,
      mode:            mode            ?? "mode-a",
    });

    // 8. Wrapper div carries sizing; canvas is display:block inside it
    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
          ...style,
        }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block" }}
        />
      </div>
    );
  }
);

MyEffect.displayName = "MyEffect";
```

### Wrapper div variants

**Standard (most components):**
```tsx
<div style={{ width, height, display: "block", overflow: "hidden", ...style }}>
  <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
</div>
```

**Overlay (Spotlight, GlitchOverlay — canvas floats over children):**
```tsx
<div style={{ position: "relative", width, height, display: "block", overflow: "hidden", ...style }}>
  <canvas
    ref={internalRef}
    aria-hidden="true"
    role="presentation"
    style={{ display: "block", position: "absolute", inset: 0, pointerEvents: "none" }}
  />
</div>
```

**With children (PixelDissolve pattern — content under the canvas):**
```tsx
<div style={{ position: "relative", width, height, overflow: "hidden", ...style }}>
  {children && (
    <div ref={sourceRef} style={{ position: "absolute", inset: 0 }}>
      {children}
    </div>
  )}
  <canvas
    ref={internalRef}
    aria-hidden="true"
    role="presentation"
    style={{ position: "absolute", inset: 0, display: "block", pointerEvents: "none" }}
  />
</div>
```

**With cursor style (interactive components):**
```tsx
<div style={{ ..., cursor: interactive ? "pointer" : "default" }}>
```

---

## Step 4 — Create `index.ts`

**File:** `src/components/MyEffect/index.ts`

```ts
export { MyEffect } from "./MyEffect";
export type { MyEffectProps } from "./MyEffect";
export type { MyEffectMode } from "./useMyEffect"; // export any extra union types
```

---

## Step 5 — Register in `src/index.ts`

**File:** `src/index.ts`

Add at the end:

```ts
export { MyEffect } from "./components/MyEffect";
export type { MyEffectProps, MyEffectMode } from "./components/MyEffect";
```

---

## Step 6 — Create `MyEffectPage.tsx`

**File:** `src/docs/pages/components/MyEffectPage.tsx`

The playground page drives the live demo, controls, dynamic code block, and props table.

### Template

```tsx
import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import {
  PlaygroundShell,
  PSel,
  PSlider,
  PColor,
  PToggle,
  PDivider,
  PLiveLabel,
} from "../../components/PlaygroundControls";
import { MyEffect } from "../../../components/MyEffect";

// 1. Props table data — one entry per public prop
const PROPS = [
  { name: "color",           type: "string",              default: '"#ffffff"',  description: "Primary color." },
  { name: "backgroundColor", type: "string",              default: '"#111111"',  description: "Canvas background color." },
  { name: "speed",           type: "number",              default: "1",          description: "Animation speed multiplier." },
  { name: "mode",            type: '"mode-a" | "mode-b"', default: '"mode-a"',   description: "Visualization mode." },
  { name: "preset",          type: '"default" | "neon" | "minimal" | "dark" | "vivid"', default: '"default"', description: "Named preset shorthand." },
];

// 2. Playground component — all state lives here
function MyEffectPlayground() {
  const [preset, setPreset]   = useState("default");
  const [color, setColor]     = useState("#ffffff");
  const [bg, setBg]           = useState("#111111");
  const [speed, setSpeed]     = useState(1);
  const [mode, setMode]       = useState<"mode-a" | "mode-b">("mode-a");

  // 3. Dynamic code block — updates as controls change
  const code = [
    `import { MyEffect } from 'own-the-canvas';`,
    ``,
    `<MyEffect`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  speed={${speed}}`,
    `  mode="${mode}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  // 4. Preview — the live canvas
  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <MyEffect
        preset={preset}
        color={color}
        backgroundColor={bg}
        speed={speed}
        mode={mode}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  // 5. Controls — two-column layout
  const controls = (
    <>
      <div>
        <PSel
          label="Preset"
          value={preset}
          options={["default", "neon", "minimal", "dark", "vivid"]}
          onChange={setPreset}
        />
        <PDivider />
        <PColor label="Color"      value={color} onChange={setColor} />
        <PColor label="Background" value={bg}    onChange={setBg} />
        <PSel
          label="Mode"
          value={mode}
          options={["mode-a", "mode-b"]}
          onChange={setMode}
        />
      </div>
      <div>
        <PSlider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

// 6. Page component
export function MyEffectPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="MyEffect"
      lead="One sentence description of the effect and what makes it interesting."
    >
      <MyEffectPlayground />

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

### Available control widgets

| Widget | Usage | When to use |
|---|---|---|
| `<PSel>` | `label, value, options[], onChange` | Enum / preset selector |
| `<PSlider>` | `label, value, min, max, step, onChange` | Numeric values |
| `<PColor>` | `label, value, onChange` | Color pickers |
| `<PToggle>` | `label, value, onChange` | Boolean props |
| `<PDivider>` | No props | Visual separator between control groups |
| `<PLiveLabel>` | No props | "LIVE" badge overlaid on preview |

---

## Step 7 — Register in `DocsApp.tsx`

**File:** `src/docs/DocsApp.tsx`

**Add a lazy import** (with all the others, in alphabetical order or grouped):
```tsx
const MyEffectPage = lazy(() =>
  import("./pages/components/MyEffectPage").then((m) => ({ default: m.MyEffectPage }))
);
```

**Add a route** (inside `<Routes>`, alongside the other component routes):
```tsx
<Route path="/components/my-effect" element={<MyEffectPage />} />
```

Route path format: `kebab-case` of the component name.

---

## Step 8 — Register in `Sidebar.tsx`

**File:** `src/docs/components/Sidebar.tsx`

Add to the `COMPONENT_LINKS` array:
```ts
{ name: "MyEffect", path: "/components/my-effect" },
```

The array is displayed as-is — put your component where it makes sense alphabetically or by category.

---

## Checklist

Copy this into a scratch note and check off as you go:

```
[ ] Props designed — monochrome defaults, 5 presets planned
[ ] src/components/MyEffect/useMyEffect.ts — hook created
    [ ] optionsRef pattern used
    [ ] DPR-aware resize (canvas.width = size * dpr, ctx.scale(dpr, dpr))
    [ ] ResizeObserver on parent element
    [ ] useEffect dep array is only [canvasRef]
    [ ] cleanup: cancelAnimationFrame + ro.disconnect()
[ ] src/components/MyEffect/MyEffect.tsx — component created
    [ ] forwardRef + useImperativeHandle
    [ ] PRESETS map with "default": {}
    [ ] prop merging: explicit ?? p.value ?? hardDefault
    [ ] wrapper div: width/height/overflow:hidden + aria-hidden canvas
    [ ] displayName set
[ ] src/components/MyEffect/index.ts — barrel export created
[ ] src/index.ts — export added
[ ] src/docs/pages/components/MyEffectPage.tsx — playground page created
    [ ] PROPS array with all public props
    [ ] dynamic code string updates with state
    [ ] two-column controls layout
[ ] src/docs/DocsApp.tsx — lazy import + route added
[ ] src/docs/components/Sidebar.tsx — nav link added
[ ] npm run dev — smoke test: page loads, canvas renders, controls work
[ ] npm run type-check — no TypeScript errors
```

---

## Common Mistakes

**Wrong: options in useEffect dep array**
```ts
useEffect(() => { ... }, [canvasRef, options]); // re-runs on every render
```
**Right: optionsRef pattern**
```ts
const optionsRef = useRef(options);
optionsRef.current = options;
useEffect(() => { ... }, [canvasRef]);
```

**Wrong: forgetting DPR scaling**
```ts
canvas.width = w; // blurry on retina
```
**Right:**
```ts
const dpr = window.devicePixelRatio || 1;
canvas.width = Math.round(w * dpr);
canvas.height = Math.round(h * dpr);
canvas.style.width = `${w}px`;
canvas.style.height = `${h}px`;
ctx.scale(dpr, dpr);
```

**Wrong: observing canvas for resize**
```ts
ro.observe(canvas); // canvas has no natural size
```
**Right:**
```ts
ro.observe(parent); // parent div drives the size
```

**Wrong: colorful defaults**
```ts
color: "#7C3AED" // jarring on unknown backgrounds
```
**Right:**
```ts
color: "#ffffff" // neutral — works anywhere
```

**Wrong: missing cleanup**
```ts
return () => {
  ro.disconnect(); // forgot cancelAnimationFrame — loop runs after unmount
};
```
**Right:**
```ts
return () => {
  ro.disconnect();
  cancelAnimationFrame(rafRef.current);
  // + any event listeners
};
```

**Wrong: not exporting in `src/index.ts`**
```
// Component exists but not importable by consumers
```
**Right:** always add to `src/index.ts` AND `src/components/MyEffect/index.ts`.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Component name | PascalCase | `MyEffect` |
| Directory | Same as component | `src/components/MyEffect/` |
| Hook file | `use` + component name | `useMyEffect.ts` |
| Props interface | Component name + `Props` | `MyEffectProps` |
| Hook options interface | `Use` + component name + `Options` | `UseMyEffectOptions` |
| Preset type | Component name + `Preset` | `MyEffectPreset` |
| Route path | kebab-case | `/components/my-effect` |
| Exported union types | PascalCase | `MyEffectMode`, `MyEffectShape` |
