# own-the-canvas — Project Overview

## Project Summary

**own-the-canvas** is a React component library of 53 canvas-based visual effects and animations, built entirely on the HTML Canvas 2D API with zero runtime dependencies. Every component is optimized for performance, highly customizable through props, and ships with full TypeScript support.

| Field | Value |
|---|---|
| **Version** | 1.0.9 |
| **Author** | Jabid Hasan |
| **License** | MIT |
| **npm** | `own-the-canvas` |
| **Docs** | https://own-the-canvas.vercel.app |
| **Repository** | https://github.com/jabid-19/own-the-canvas |
| **React peer dep** | `^18.0.0` |
| **Runtime dependencies** | None |

---

## Design Philosophy

### Colorful Defaults, Monochrome Opt-In
Every component ships in color: its `default` preset uses the component's signature palette (koi-orange fish, an aurora gradient, green matrix rain), so `<KoiPond />` looks right with zero props. Every preset-driven component also has a `monochrome` preset (`#111111` background, `#ffffff` primary, `#6b7280` secondary) for a neutral look that sits on any page.

### High Customizability
Every visual attribute is exposed as a typed prop — colors, sizes, speeds, physics parameters, opacity, blur, interaction radii. Nothing is hardcoded inside rendering logic. Users can control:
- Color of every element (backgrounds, lines, particles, glows, fills)
- Speed, intensity, and force of every animation
- Physics parameters for simulations (gravity, friction, stiffness, wind)
- Rendering quality tradeoffs (resolution scaling, particle counts)
- Interaction behavior (mouse tracking, click handling, drag)

### Preset System
Each component ships with 5–6 named presets that bundle a coherent visual style. Presets are applied first; explicit props override preset values. This pattern lets users drop in a themed variant with a single `preset="neon"` prop while retaining full per-prop override capability.

```tsx
// Quick themed default
<MatrixRain preset="cyberpunk" />

// Preset as a base, override specific props
<MatrixRain preset="cyberpunk" fontSize={18} speed={20} />

// Full manual control
<MatrixRain color="#ff0000" backgroundColor="rgba(0,0,0,0.05)" fontSize={12} />
```

### Performance Optimization
- **DPR-aware scaling**: Canvas buffer scaled by `window.devicePixelRatio` for crisp rendering on retina displays. The 2D context is pre-scaled so all drawing code works in CSS pixels.
- **ResizeObserver**: Components respond to container size changes via `ResizeObserver`, not window resize events — efficient and accurate.
- **requestAnimationFrame loop**: Shared `useCanvasSetup` hook manages the rAF loop with a `dt` (delta-time) parameter, preventing speed variation on different frame rates.
- **Low-resolution rendering**: Noise/fluid components render at a fraction of canvas size (default `resolution: 0.25`) then upscale with CSS smoothing — dramatically reduces computation for perceptually identical output.
- **LRU color cache**: Hex-to-RGB parsing is cached in a `Map`, eliminating redundant string parsing during animation loops.
- **External loop control**: Components expose `noLoop` option so consuming code can drive rendering manually.

### Zero Dependencies
All rendering uses the Canvas 2D API (`CanvasRenderingContext2D`). No Three.js, no D3, no p5.js, no external drawing libraries. The entire library ships as a ~100KB bundle with no transitive runtime deps.

### Accessibility
Every canvas element is marked `aria-hidden="true"` with `role="presentation"`. These are decorative visual effects — they carry no semantic information. Screen readers skip them entirely.

### Ref Forwarding
Every component uses `forwardRef`, exposing the underlying `HTMLCanvasElement` (or a handle object for `GameOfLife`). This allows consumers to:
- Read pixel data for custom effects
- Call imperative methods (e.g., `GameOfLifeHandle.reset()`)
- Integrate with animation libraries that need a DOM reference

---

## Architecture

### Directory Structure

```
own-the-canvas/
├── src/
│   ├── index.ts                      # Barrel export — all 53 components + types
│   ├── types/
│   │   └── index.ts                  # BaseCanvasProps, CanvasSetupOptions, CanvasSetupResult
│   ├── hooks/
│   │   └── useCanvasSetup.ts         # DPR scaling + ResizeObserver + rAF loop
│   ├── utils/
│   │   └── color.ts                  # hexToRgba, hexToRgbString, sampleGradient + LRU cache
│   ├── components/
│   │   ├── MatrixRain/               # Each component in its own directory
│   │   │   ├── index.ts              # Re-exports component + types
│   │   │   ├── MatrixRain.tsx        # React component (forwardRef, preset resolution, JSX)
│   │   │   └── useMatrixRain.ts      # Animation hook (all canvas drawing logic)
│   │   ├── ParticleField/
│   │   ├── Starfield/
│   │   ├── FireEffect/
│   │   ├── Confetti/
│   │   ├── NoiseGradient/
│   │   ├── FlowField/
│   │   ├── Fireworks/
│   │   ├── Mandala/
│   │   ├── FluidSimulation/
│   │   ├── Rain/
│   │   ├── Lightning/
│   │   ├── GameOfLife/
│   │   ├── Boids/
│   │   ├── ReactionDiffusion/
│   │   ├── AuroraBorealis/
│   │   ├── Spirograph/
│   │   ├── SandSimulation/
│   │   ├── WaveInterference/
│   │   ├── DiffusionAggregation/
│   │   ├── LSystem/
│   │   ├── Kaleidoscope/
│   │   ├── VoronoiCells/
│   │   ├── SlimeMold/
│   │   ├── WatercolorBloom/
│   │   ├── PendulaWave/
│   │   ├── CrystalGrowth/
│   │   ├── NeuralWeb/
│   │   ├── Metaballs/
│   │   ├── AntColony/
│   │   ├── MagneticField/
│   │   ├── DragonCursor/
│   │   ├── SakuraBlossom/
│   │   ├── KoiPond/
│   │   ├── BlackHole/
│   │   ├── GalaxySpiral/
│   │   ├── TornadoVortex/
│   │   ├── BubbleUniverse/
│   │   ├── SolarFlare/
│   │   ├── SpiderWeb/
│   │   ├── ButterflySwarm/
│   │   └── DeepSeaBioluminescence/
│   └── docs/                         # Documentation site (not in lib bundle)
│       ├── DocsApp.tsx
│       ├── main.tsx
│       ├── tokens.css                # Design tokens (CSS variables)
│       ├── pages/                    # Per-component documentation pages
│       │   ├── Home.tsx
│       │   ├── Overview.tsx
│       │   ├── Playground.tsx
│       │   └── components/           # 53 component playground pages
│       └── components/               # Docs UI building blocks
│           ├── CodeBlock.tsx         # Syntax-highlighted code
│           ├── PropsTable.tsx        # Props documentation table
│           ├── PlaygroundControls.tsx # Interactive sliders, pickers, toggles
│           ├── Sidebar.tsx           # Navigation sidebar
│           ├── Layout.tsx            # Main layout wrapper
│           └── LazyPreview.tsx       # Lazy-loaded canvas preview
├── dist/                             # Build output
│   ├── index.es.js                   # ESM bundle
│   ├── index.cjs.js                  # CommonJS bundle
│   └── index.d.ts                    # Type declarations
├── vite.config.ts                    # Dual build (demo app + library)
├── tsconfig.json                     # App TypeScript config
├── tsconfig.lib.json                 # Library-only TypeScript config
├── package.json
├── README.md
└── CHANGELOG.md
```

### Component Architecture Pattern

Every component follows an identical structure that cleanly separates React concerns from canvas logic:

**`ComponentName.tsx`** — React component only:
- `forwardRef` wrapping with `useImperativeHandle` for canvas ref exposure
- Preset resolution: `const p = (preset && PRESETS[preset]) || {}`
- Prop merging: `value ?? p.value ?? hardDefault`
- JSX: wrapper `<div>` with size styles + `<canvas aria-hidden role="presentation">`
- No canvas drawing code

**`useComponentName.ts`** — All animation logic:
- `useCanvasSetup` or direct `useRef` + `ResizeObserver`
- `useEffect` to start/restart animation when props change
- `requestAnimationFrame` loop
- Canvas 2D drawing operations
- Cleanup: `cancelAnimationFrame` + `ResizeObserver.disconnect()`

**`index.ts`** — Clean public API re-export

### Shared Infrastructure

#### `src/types/index.ts`
```typescript
interface BaseCanvasProps {
  width?: number | string;     // CSS width — number = px, string = any CSS unit
  height?: number | string;    // CSS height
  className?: string;          // Applied to wrapper div
  style?: React.CSSProperties; // Applied to wrapper div
  preset?: string;             // Named preset (each component defines its own union)
}

interface CanvasSetupOptions {
  onFrame?: (ctx: CanvasRenderingContext2D, width: number, height: number, dt: number) => void;
  noLoop?: boolean;            // Skip built-in rAF loop
}

interface CanvasSetupResult {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;               // Current logical width (CSS pixels)
  height: number;              // Current logical height (CSS pixels)
}
```

#### `src/hooks/useCanvasSetup.ts`
The central canvas lifecycle hook used by all components:
1. Creates a `canvasRef`
2. `ResizeObserver` watches the parent element for size changes
3. On resize: sets `canvas.width/height` to `cssSize × devicePixelRatio`, applies `ctx.scale(dpr, dpr)`, updates internal width/height refs
4. Starts `requestAnimationFrame` loop, passes `dt` (delta ms since last frame) to `onFrame`
5. Cleanup cancels rAF and disconnects observer

#### `src/utils/color.ts`
- **`hexToRgba(hex, alpha)`**: Parses `#rgb` or `#rrggbb` → `rgba(r,g,b,a)` string. Falls back to white on invalid input. Caches parsed values in a `Map` for O(1) repeat lookups.
- **`hexToRgbString(hex)`**: Parses hex → `"r,g,b"` string for embedding in template literals.
- **`sampleGradient(colors[], t)`**: Interpolates linearly between N color stops at position `t ∈ [0,1]`. Returns `[r, g, b]` tuple. Used by FireEffect, SlimeMold, Kaleidoscope, VoronoiCells, and NoiseGradient.

### Build System

```
npm run dev          → Vite dev server for the documentation/demo app
npm run build        → Build the documentation/demo app (static site)
npm run build:lib    → Build the npm library (ESM + CJS + .d.ts)
npm run test         → Vitest test suite (jsdom environment)
npm run test:watch   → Vitest watch mode
npm run storybook    → Storybook dev server on port 6006
npm run type-check   → TypeScript type check only
```

**Library build** (`npm run build:lib`):
- Runs `tsc -p tsconfig.lib.json` to emit `.d.ts` files
- Runs `vite build --mode lib` which:
  - Entry: `src/index.ts`
  - Output formats: `es` → `index.es.js`, `cjs` → `index.cjs.js`
  - Externals: `react`, `react-dom`, `react/jsx-runtime`
  - `vite-plugin-dts` generates type declarations alongside the bundle

**Package exports** (dual CJS/ESM with types):
```json
{
  "main": "./dist/index.cjs.js",
  "module": "./dist/index.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.es.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

---

## Base Props (All Components)

Every component extends `BaseCanvasProps`:

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | `number \| string` | `"100%"` | Canvas container width |
| `height` | `number \| string` | `"100%"` | Canvas container height |
| `className` | `string` | — | CSS class on wrapper div |
| `style` | `React.CSSProperties` | — | Inline styles on wrapper div |
| `preset` | `string` | `"default"` | Named preset — sets themed defaults |

---

## Components

### 1. MatrixRain

Falling character rain with customizable character sets, trail opacity, and speed. Simulates the iconic Matrix digital rain effect.

**Presets:** `default` · `cyberpunk` · `binary` · `minimal` · `blood` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `"#00ff41"` | Character color |
| `backgroundColor` | `string` | `"rgba(17,17,17,0.1)"` | Per-frame overlay — lower opacity = longer trails |
| `fontSize` | `number` | `14` | Font size in px; controls column density |
| `speed` | `number` | `33` | Ms per frame — lower = faster |
| `charset` | `"latin" \| "binary" \| "katakana" \| string` | `"latin"` | Characters to rain |
| `resetThreshold` | `number` | `0.95` | Probability a column resets after leaving bottom |

---

### 2. ParticleField

Floating particles with optional proximity-based connection lines, mouse repulsion, drag-to-reposition, twinkling, glow, and edge wrapping. Merges the former ConstellationMap component — use presets `cosmos`, `aurora`, or `gold` for a constellation-style star field.

**Presets:** `default` · `galaxy` · `snow` · `minimal` · `ocean` · `cosmos` · `aurora` · `gold` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `particleCount` | `number` | `120` | Number of particles |
| `particleColor` | `string` | `"#9be7ff"` | Particle fill color |
| `lineColor` | `string` | `"#9be7ff"` | Connection line color |
| `lineDistance` | `number` | `120` | Max px distance to draw lines |
| `particleSize` | `number` | `2.5` | Max particle radius in px |
| `speed` | `number` | `0.8` | Base movement speed |
| `connectParticles` | `boolean` | `true` | Draw lines between nearby particles |
| `interactive` | `boolean` | `true` | Repel particles from mouse cursor |
| `backgroundColor` | `string` | `"#040a18"` | Canvas background |
| `repelRadius` | `number` | `80` | Mouse repulsion radius in px |
| `repelStrength` | `number` | `0.3` | Mouse repulsion force |
| `friction` | `number` | `0.99` | Velocity friction per frame |
| `maxVelocityMultiplier` | `number` | `3` | Max velocity as multiple of speed |
| `lineWidth` | `number` | `0.8` | Connection line stroke width |
| `lineOpacity` | `number` | `0.6` | Max connection line opacity |
| `wrapEdges` | `boolean` | `false` | Wrap particles around edges instead of bouncing |
| `twinkle` | `boolean` | `false` | Enable twinkling opacity animation |
| `twinkleSpeed` | `number` | `0.03` | Twinkling animation speed |
| `twinkleAmplitude` | `number` | `0.4` | Twinkling opacity amplitude 0–1 |
| `glowParticles` | `boolean` | `false` | Enable glow shadow on particles |
| `glowBlur` | `number` | `15` | Glow shadow blur in px |
| `lineStyle` | `"solid" \| "dashed"` | `"solid"` | Connection line stroke style |
| `dragParticles` | `boolean` | `false` | Enable drag-to-reposition individual particles |
| `dragRadius` | `number` | `20` | Drag detection radius in px |
| `velocityMultiplier` | `number` | `2` | Initial velocity multiplier — set `0.3` for slow constellation drift |

---

### 3. Starfield

2D twinkling starfield or 3D perspective warp-tunnel. Supports shooting stars and configurable star size/opacity ranges.

**Presets:** `default` · `warp` · `peaceful` · `minimal` · `nebula` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `starCount` | `number` | `200` | Number of stars |
| `starColor` | `string` | `"#c4b5fd"` | Star color |
| `backgroundColor` | `string` | `"#0d0118"` | Background color |
| `speed` | `number` | `0.5` | Movement speed |
| `twinkle` | `boolean` | `true` | Enable star twinkling |
| `shootingStars` | `boolean` | `true` | Enable shooting stars |
| `shootingStarInterval` | `number` | `3000` | Ms between shooting stars |
| `perspective` | `"2D" \| "3D"` | `"2D"` | Flat field or warp tunnel |
| `starSizeMin` | `number` | `0.3` | Minimum star radius in px |
| `starSizeMax` | `number` | `2.8` | Maximum star radius in px |
| `starOpacityMin` | `number` | `0.3` | Minimum star opacity |
| `starOpacityMax` | `number` | `1.0` | Maximum star opacity |
| `twinkleSpeed` | `number` | `0.03` | Twinkle animation speed |
| `shootingStarLength` | `number` | `80` | Shooting star trail length in px |
| `shootingStarLifetime` | `number` | `60` | Shooting star lifetime in frames |
| `shootingStarColor` | `string` | `"#ffffff"` | Shooting star trail color |

---

### 4. FireEffect

Licking flame tongues from a smooth noise-driven heat field, with a soft glow and sparks rising off the top. Five colour palettes, wind, and flame height controls.

**Presets:** `default` · `inferno` · `toxic` · `ice` · `plasma` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `palette` | `"smoke" \| "inferno" \| "toxic" \| "ice" \| "plasma"` | `"inferno"` | Color theme |
| `customColors` | `string[]` | `undefined` | Custom gradient colors — overrides palette when ≥2 colors provided |
| `intensity` | `number` | `0.95` | Flame intensity 0–1 |
| `windStrength` | `number` | `0.3` | Horizontal wind strength -1 to 1 |
| `windDirection` | `number` | `1` | Wind direction: 1 = right, -1 = left |
| `spread` | `number` | `0.7` | Flame spread 0–1 |
| `cooling` | `number` | `0.3` | Cooling rate — higher = shorter flames |
| `noiseStrength` | `number` | `60` | Bottom-row seed noise magnitude |
| `coolingScale` | `number` | `3` | Cooling amount scaling factor |
| `resolution` | `number` | `1` | Fire buffer resolution 0.5 = half size |

---

### 5. Confetti

Physics-based confetti with burst and continuous emission modes. Supports multiple shapes, gravity, wind, and precise spawn control. Default palette is colorful; switch to `"monochrome"` for a neutral look.

**Presets:** `default` · `celebration` · `pastel` · `gold` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `palette` | `"monochrome" \| "colorful"` | `"colorful"` | Color variant |
| `trigger` | `boolean` | `false` | Rising edge fires a burst |
| `particleCount` | `number` | `150` | Pieces per burst |
| `spread` | `number` | `0.8` | Spread angle 0–1 (1 = full hemisphere) |
| `gravity` | `number` | `0.5` | Gravity strength |
| `colors` | `string[]` | *(palette)* | Override confetti colors |
| `shapes` | `ConfettiShape[]` | `["square","circle","triangle","strip"]` | Shapes to include |
| `duration` | `number` | `4000` | Duration of each piece in ms |
| `continuous` | `boolean` | `false` | Emit continuously while trigger is true |
| `wind` | `number` | `0.5` | Horizontal wind force |
| `spawnX` | `number` | `0.5` | Spawn X as fraction of canvas width |
| `spawnY` | `number` | `0.4` | Spawn Y as fraction of canvas height |
| `spawnSpread` | `number` | `60` | Spawn position random spread in px |
| `speedMin` | `number` | `4` | Minimum launch speed |
| `speedMax` | `number` | `16` | Maximum launch speed |
| `sizeMin` | `number` | `6` | Minimum piece size in px |
| `sizeMax` | `number` | `14` | Maximum piece size in px |
| `angularVelocity` | `number` | `0.3` | Max angular velocity per frame |
| `emissionRate` | `number` | `10` | Pieces per second in continuous mode |
| `onComplete` | `() => void` | — | Called when animation finishes |

---

### 6. NoiseGradient

Animated Perlin/Simplex noise-driven full-canvas color gradient. Renders at configurable resolution for performance and upscales smoothly.

**Presets:** `default` · `aurora` · `sunset` · `ocean` · `forest` · `neon` · `monochrome`

Default colors: `["#0d1117", "#0d4f3c", "#00ff87", "#00cfff", "#7C3AED"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | `["#0d1117", "#0d4f3c", "#00ff87", "#00cfff", "#7C3AED"]` | 2–5 hex color stops |
| `speed` | `number` | `0.25` | Animation speed multiplier |
| `scale` | `number` | `1` | Noise zoom — higher = more zoomed in |
| `octaves` | `number` | `3` | Fractal octaves 1–6 — more = more detail |
| `animated` | `boolean` | `true` | Enable animation |
| `blendMode` | `string` | `"source-over"` | Canvas composite blend mode |
| `timeOffsetY` | `number` | `0.5` | Y-axis time offset ratio |
| `persistence` | `number` | `0.5` | Octave amplitude persistence 0–1 |
| `resolution` | `number` | `0.25` | Render resolution fraction — lower = faster |

---

### 7. FlowField

Perlin noise vector field guiding particle streams with optional curl noise for more organic swirling motion.

**Presets:** `default` · `neon` · `ocean` · `lava` · `forest` · `monochrome`

Default colors: `["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9", "#e0f2fe"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `particleCount` | `number` | `800` | Number of flow particles |
| `colors` | `string[]` | `["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9", "#e0f2fe"]` | Stroke colors — one picked per particle |
| `speed` | `number` | `1` | Flow speed multiplier |
| `noiseScale` | `number` | `0.004` | Noise sampling scale — lower = larger structures |
| `trailLength` | `number` | `0.04` | Trail fade length |
| `fadeStrength` | `number` | `0.04` | Background fade opacity per frame |
| `lineWidth` | `number` | `1` | Stroke line width |
| `backgroundColor` | `string` | `"#020f1a"` | Canvas background |
| `animated` | `boolean` | `true` | Enable animation |
| `timeSpeed` | `number` | `1` | Noise field evolution speed |
| `curl` | `boolean` | `false` | Add curl noise for swirling flow |
| `interactive` | `boolean` | `false` | Mouse cursor attracts nearby particles |
| `attractRadius` | `number` | `100` | Radius in px around cursor that attracts particles |
| `attractStrength` | `number` | `3` | Attraction force strength |

---

### 8. Fireworks

Launching shells that explode into particle bursts. Shells arc upward and burst with physics-based particle trails and glow. Can auto-launch or be triggered by click.

**Presets:** `default` · `celebration` · `subtle` · `neon` · `golden` · `monochrome`

Default colors: `["#f43f5e", "#f59e0b", "#4ade80", "#06b6d4", "#ffd166", "#ffffff"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | `["#f43f5e", "#f59e0b", "#4ade80", "#06b6d4", "#ffd166", "#ffffff"]` | Particle burst colors |
| `particleCount` | `number` | `80` | Particles per explosion |
| `gravity` | `number` | `0.08` | Gravity pull per frame |
| `friction` | `number` | `0.97` | Velocity friction 0–1 |
| `fadeSpeed` | `number` | `0.015` | Alpha fade per frame |
| `particleSize` | `number` | `2` | Particle base size in px |
| `trailLength` | `number` | `6` | Trail history length |
| `spread` | `number` | `5` | Explosion spread speed |
| `autoLaunch` | `boolean` | `true` | Auto-launch shells |
| `autoInterval` | `number` | `1800` | Ms between auto-launches |
| `glowEffect` | `boolean` | `true` | Glow on particles |
| `glowBlur` | `number` | `8` | Shadow blur for glow |
| `backgroundColor` | `string` | `"#04060f"` | Canvas background |
| `shellSpeed` | `number` | `12` | Shell upward speed |
| `starCount` | `number` | `80` | Number of background stars |
| `starColor` | `string` | `"#ffffff"` | Star color |
| `glowingStars` | `boolean` | `false` | Enable layered halo glow on ~28% of stars |
| `starGlowBlur` | `number` | `8` | Shadow blur radius for glowing stars |

---

### 9. Mandala

Rotating symmetrical geometric mandala with configurable rotational arms, concentric layers, bilateral mirroring, and organic noise distortion.

**Presets:** `default` · `neon` · `lotus` · `cosmic` · `minimal` · `monochrome`

Default colors: `["#f43f5e", "#fb7185", "#fda4af", "#fbbf24"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `symmetry` | `number` | `8` | Number of rotational symmetry arms |
| `colors` | `string[]` | `["#f43f5e", "#fb7185", "#fda4af", "#fbbf24"]` | Stroke colors cycled per layer |
| `lineWidth` | `number` | `1.5` | Stroke line width |
| `speed` | `number` | `1` | Rotation animation speed |
| `layers` | `number` | `5` | Number of concentric petal layers |
| `radius` | `number` | `1` | Outer radius as fraction of canvas min dimension |
| `backgroundColor` | `string` | `"#0c0005"` | Canvas background |
| `animated` | `boolean` | `true` | Enable animation |
| `glowEffect` | `boolean` | `true` | Glow effect |
| `glowBlur` | `number` | `10` | Shadow blur for glow |
| `strokeOpacity` | `number` | `0.8` | Layer stroke opacity |
| `mirror` | `boolean` | `true` | Bilateral symmetry per arm |
| `noiseAmount` | `number` | `0.3` | Organic noise distortion 0–1 |

---

### 10. FluidSimulation

Navier-Stokes fluid solver on a grid. Mouse movement injects velocity and ink; auto-ink bursts fire at intervals for continuous motion without interaction.

**Presets:** `default` · `ink` · `neon` · `lava` · `ocean` · `smoke` · `monochrome`

Default colors: `["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `resolution` | `number` | `80` | Grid resolution 32–128 |
| `viscosity` | `number` | `0.0001` | Fluid viscosity |
| `diffusion` | `number` | `0.0001` | Ink diffusion rate |
| `dissipation` | `number` | `0.995` | Density fade per frame |
| `inkColors` | `string[]` | `["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9"]` | Ink colors |
| `glowEffect` | `boolean` | `true` | Glow on ink |
| `glowBlur` | `number` | `0` | Shadow blur for glow |
| `backgroundColor` | `string` | `"#020f1a"` | Canvas background |
| `autoInk` | `boolean` | `true` | Auto-inject ink bursts |
| `autoInkInterval` | `number` | `1500` | Ms between auto-ink bursts |
| `mouseForce` | `number` | `5` | Mouse velocity force multiplier |
| `inkRadius` | `number` | `4` | Ink splat radius in grid cells |

---

### 11. Rain

Falling rain drops with optional splash particles on impact. Wind drift oscillates sinusoidally.

**Presets:** `default` · `storm` · `drizzle` · `neon` · `golden` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `dropCount` | `number` | `200` | Number of rain drops |
| `speed` | `number` | `15` | Drop fall speed in px/frame |
| `wind` | `number` | `0.3` | Horizontal wind drift strength |
| `windSpeed` | `number` | `0.5` | Wind oscillation frequency |
| `dropLength` | `number` | `20` | Drop streak length in px |
| `dropWidth` | `number` | `1` | Drop stroke width in px |
| `dropOpacity` | `number` | `0.6` | Drop opacity 0–1 |
| `dropColor` | `string` | `"#a9c2e8"` | Drop color |
| `splashColor` | `string` | `"#dbe7ff"` | Splash particle color |
| `showSplashes` | `boolean` | `true` | Show splashes when drops hit bottom |
| `backgroundColor` | `string` | `"#0b1424"` | Canvas background |
| `starCount` | `number` | `60` | Number of background stars |
| `starColor` | `string` | `"#ffffff"` | Star color |
| `glowingStars` | `boolean` | `false` | Enable layered halo glow on ~28% of stars |
| `starGlowBlur` | `number` | `8` | Shadow blur radius for glowing stars |

---

### 12. Lightning

Fractal lightning bolts using midpoint displacement. Branching, flicker, and glow are all configurable. Click to trigger at cursor position.

**Presets:** `default` · `neon` · `storm` · `plasma` · `subtle` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `segments` | `number` | `8` | Recursion depth for bolt segments |
| `roughness` | `number` | `0.5` | Midpoint displacement roughness 0–1 |
| `branchChance` | `number` | `0.3` | Branch probability per segment |
| `branchDecay` | `number` | `0.6` | Energy multiplier for sub-branches |
| `flickerCount` | `number` | `3` | Rapid flicker strikes per event |
| `glowBlur` | `number` | `20` | Glow shadow blur radius |
| `color` | `string` | `"#c0c0ff"` | Bolt glow color |
| `coreColor` | `string` | `"#ffffff"` | Inner core color |
| `backgroundColor` | `string` | `"#050010"` | Canvas background |
| `autoInterval` | `number` | `2000` | Ms between auto strikes |
| `interactive` | `boolean` | `true` | Click to trigger at cursor |
| `startX` | `number` | `0.5` | Strike origin X as fraction of width |
| `startY` | `number` | `0` | Strike origin Y as fraction of height |
| `endY` | `number` | `1` | Strike end Y as fraction of height |

---

### 13. GameOfLife

Conway's Game of Life with age-based cell coloring, edge wrapping, and click-to-toggle interaction. Exposes an imperative handle for `reset()` and `randomize()`.

**Presets:** `default` · `neon` · `matrix` · `minimal` · `fire` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `cellSize` | `number` | `8` | Cell size in px |
| `speed` | `number` | `10` | Simulation updates per second |
| `initialDensity` | `number` | `0.3` | Initial alive cell density 0–1 |
| `aliveColor` | `string` | `"#00ff41"` | Color of newly born cells |
| `oldColor` | `string` | `"#004d14"` | Color of old cells |
| `deadColor` | `string` | `"#000000"` | Color of dead cells |
| `showAge` | `boolean` | `true` | Color cells by generation age |
| `wrapEdges` | `boolean` | `true` | Wrap cells at canvas edges |
| `interactive` | `boolean` | `true` | Click to toggle cells |
| `backgroundColor` | `string` | `"#000000"` | Canvas background |

**`GameOfLifeHandle`** (via ref): exposes `reset()` and `randomize()` methods.

---

### 14. Boids

Reynolds boids flocking simulation with separation, alignment, and cohesion rules. Triangular agents with trails flee from mouse cursor.

**Presets:** `default` · `birds` · `fish` · `swarm` · `neon` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | `80` | Number of boids |
| `maxSpeed` | `number` | `3` | Maximum speed in px/frame |
| `separationRadius` | `number` | `25` | Separation rule radius in px |
| `alignmentRadius` | `number` | `50` | Alignment rule radius in px |
| `cohesionRadius` | `number` | `60` | Cohesion rule radius in px |
| `separationForce` | `number` | `0.05` | Separation steering force |
| `alignmentForce` | `number` | `0.05` | Alignment steering force |
| `cohesionForce` | `number` | `0.03` | Cohesion steering force |
| `color` | `string` | `"#0891B2"` | Boid and trail color |
| `trailLength` | `number` | `8` | Trail history length in frames |
| `trailOpacity` | `number` | `0.4` | Trail line opacity 0–1 |
| `boidSize` | `number` | `6` | Boid triangle size in px |
| `backgroundColor` | `string` | `"#030d1a"` | Canvas background |
| `interactive` | `boolean` | `true` | Boids flee from mouse |
| `mouseRadius` | `number` | `80` | Mouse avoidance radius in px |
| `mouseForce` | `number` | `0.2` | Mouse avoidance force |
| `wrapEdges` | `boolean` | `true` | Wrap boids at canvas edges |

---

### 15. ReactionDiffusion

Gray-Scott reaction-diffusion simulation. Two virtual chemicals (U and V) interact via autocatalysis to spontaneously grow coral, spots, maze, and traveling-wave patterns from random seeds. Mouse click+drag disturbs the chemical field.

**Presets:** `default` · `coral` · `spots` · `maze` · `waves` · `neon` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `feedRate` | `number` | `0.055` | Feed rate f — controls pattern type |
| `killRate` | `number` | `0.062` | Kill rate k — controls pattern density |
| `diffusionU` | `number` | `0.2` | Diffusion rate for chemical U (keep dU/dV = 2) |
| `diffusionV` | `number` | `0.1` | Diffusion rate for chemical V |
| `resolution` | `number` | `0.5` | Render resolution fraction — lower = faster |
| `speed` | `number` | `8` | Simulation steps per frame |
| `colorA` | `string` | `"#04121f"` | Color at low V concentration |
| `colorB` | `string` | `"#5eead4"` | Color at high V concentration |
| `backgroundColor` | `string` | `"#04121f"` | Canvas background |
| `interactive` | `boolean` | `true` | Mouse click+drag disturbs the field |

---

### 16. AuroraBorealis

Animated northern lights with layered sine-wave curtains, vertical light streaks, and a star field. Uses additive screen blending to build luminous, overlapping color bands.

**Presets:** `default` · `arctic` · `solar` · `tropical` · `neon` · `midnight` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | `["#00ff88", "#00ccff", "#88ff00"]` | Aurora band colors |
| `speed` | `number` | `1` | Animation speed multiplier |
| `intensity` | `number` | `0.8` | Band brightness/opacity 0–1 |
| `layers` | `number` | `5` | Number of aurora layers |
| `backgroundColor` | `string` | `"#050a0f"` | Sky background color |
| `waveAmplitude` | `number` | `0.15` | Wave height as fraction of canvas height |
| `waveFrequency` | `number` | `2` | Wave oscillations across canvas width |
| `starCount` | `number` | `80` | Background star count |
| `animated` | `boolean` | `true` | Enable animation |

---

### 17. Spirograph

Hypotrochoid parametric curves drawn incrementally in real time. Supports multiple overlapping layers, rotational symmetry, and glow effects — produces petals, mandalas, stars, and fractal-like rosettes. Each layer cycles through the `colors` array.

**Presets:** `default` · `neon` · `prismatic` · `mandala` · `cosmic` · `minimal` · `monochrome`

Default colors: `["#ff2244", "#22aaff", "#44ff88"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `outerRadius` | `number` | `0.85` | Outer circle R as fraction of min(w,h)/2 |
| `innerRadius` | `number` | `0.4` | Inner circle r as fraction of outerRadius |
| `penDistance` | `number` | `0.9` | Pen arm d as fraction of innerRadius |
| `speed` | `number` | `2` | Degrees of angle drawn per frame |
| `colors` | `string[]` | `["#ff2244", "#22aaff", "#44ff88"]` | Stroke colors — each layer picks cyclically |
| `backgroundColor` | `string` | `"#050005"` | Canvas background fill color |
| `lineWidth` | `number` | `1` | Stroke line width |
| `trailFade` | `number` | `0.003` | Background fade opacity per frame — lower = longer trails |
| `animated` | `boolean` | `true` | Enable animation |
| `autoReset` | `boolean` | `true` | Randomize and restart after each full cycle |
| `layerCount` | `number` | `1` | Overlapping curve layers with slight radius offsets |
| `symmetry` | `number` | `1` | Draw N rotationally symmetric copies around center |
| `glowEffect` | `boolean` | `false` | Enable glow / shadow blur on strokes |
| `glowBlur` | `number` | `10` | Shadow blur radius when glowEffect is enabled |

---

### 18. SandSimulation

Falling-sand cellular automaton. Paint sand, water, fire, and walls with your mouse and watch physics unfold — sand piles, water flows laterally, fire rises and extinguishes on contact with water, sand sinks through water.

**Presets:** `default` · `desert` · `ocean` · `inferno` · `neon` · `monochrome`

**Materials:** `sand` · `water` · `fire` · `wall` · `erase`

| Prop | Type | Default | Description |
|---|---|---|---|
| `cellSize` | `number` | `4` | Cell size in pixels |
| `brushSize` | `number` | `3` | Paint brush radius in cells |
| `material` | `SandMaterial` | `"sand"` | Active material to paint |
| `sandColor` | `string` | `"#c8a85a"` | Sand cell color |
| `waterColor` | `string` | `"#0088cc"` | Water cell color |
| `fireColor` | `string` | `"#ff4400"` | Fire cell hot color |
| `wallColor` | `string` | `"#6b4c1a"` | Wall cell color |
| `backgroundColor` | `string` | `"#1a1200"` | Empty cell background color |
| `interactive` | `boolean` | `true` | Enable mouse painting |
| `gravity` | `number` | `1` | Gravity strength multiplier |

---

### 19. WaveInterference

Real-time wave superposition from multiple point sources. Click to add sources, click an existing source to remove it. Constructive and destructive interference fringes appear and animate instantly.

**Presets:** `default` · `ripple` · `plasma` · `neon` · `cosmic` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxSources` | `number` | `6` | Maximum number of wave sources |
| `wavelength` | `number` | `80` | Wave wavelength in pixels |
| `speed` | `number` | `1` | Wave propagation speed multiplier |
| `colorHigh` | `string` | `"#88ccff"` | Constructive interference color |
| `colorLow` | `string` | `"#001133"` | Destructive interference color |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `showSources` | `boolean` | `true` | Show source markers |
| `resolution` | `number` | `0.4` | Render resolution fraction — lower = faster |
| `animated` | `boolean` | `true` | Enable animation |
| `decay` | `number` | `0.003` | Amplitude decay rate with distance |

---

### 20. DiffusionAggregation

Diffusion-limited aggregation (DLA) — random walkers wander the canvas until they touch the growing cluster and freeze in place, producing fractal coral, snowflake, and lightning-strike structures.

**Presets:** `default` · `coral` · `snowflake` · `lightning` · `neon` · `frost` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `particleColor` | `string` | `"#ff7043"` | Color of aggregated cluster particles |
| `walkerColor` | `string` | `"#ff7043"` | Color of active random walkers (visible when showWalkers is true) |
| `backgroundColor` | `string` | `"#0a0500"` | Canvas background color |
| `particleSize` | `number` | `3` | Particle cell size in px — smaller = finer fractal detail, slower growth |
| `walkerCount` | `number` | `60` | Number of simultaneous random walkers |
| `stepsPerFrame` | `number` | `20` | Walker steps computed per animation frame — higher = faster growth |
| `seedMode` | `DLASeedMode` | `"center"` | `"center"` \| `"ring"` \| `"bottom"` — where the initial cluster seed is placed |
| `showWalkers` | `boolean` | `false` | Render active walkers as dimmed particles |
| `glowEffect` | `boolean` | `true` | Glow effect on cluster particles |
| `glowBlur` | `number` | `8` | Shadow blur radius for glow |
| `interactive` | `boolean` | `true` | Click to add extra seed points — new branches grow from them |

---

### 21. LSystem

Lindenmayer system fractals drawn incrementally — watch fractal trees, ferns, snowflakes, and dragon curves grow stroke by stroke. Each preset is a different grammar producing a completely different visual species.

**Presets:** `default` · `fern` · `dragon` · `sierpinski` · `bush` · `snowflake`

| Prop | Type | Default | Description |
|---|---|---|---|
| `axiom` | `string` | `"X"` | Starting L-system axiom string |
| `rules` | `Record<string,string>` | — | Production rules map — e.g. `{ F: "F+F-F" }` |
| `iterations` | `number` | `4` | Number of string rewriting iterations |
| `angle` | `number` | `25` | Turtle turning angle in degrees |
| `lineWidth` | `number` | `1` | Stroke line width |
| `color` | `string` | `"#86efac"` | Branch stroke color |
| `backgroundColor` | `string` | `"#06120a"` | Canvas background color |
| `speed` | `number` | `200` | Segments drawn per animation frame |
| `autoReset` | `boolean` | `true` | Restart animation after full draw |
| `trailFade` | `number` | `0` | Background fade opacity between cycles — 0 = hard clear |
| `glowEffect` | `boolean` | `false` | Enable glow shadow on branches |
| `glowBlur` | `number` | `8` | Shadow blur radius when glowEffect is enabled |

---

### 22. Kaleidoscope

Coloured glass shards and beads tumble inside a mirrored wedge, reflected around the centre into an ever-changing rosette that fills the whole canvas edge to edge.

**Presets:** `default` · `neon` · `crystal` · `void` · `fire` · `ice` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `segments` | `number` | `6` | Number of mirror segments / symmetry (2–16) |
| `speed` | `number` | `1` | Animation speed multiplier |
| `colorA` | `string` | `"#ffb84d"` | Color at noise peak |
| `colorB` | `string` | `"#1f9e8f"` | Color at noise trough |
| `backgroundColor` | `string` | `"#0a0710"` | Background color outside the pattern radius |
| `noiseScale` | `number` | `3` | Noise spatial frequency — higher = finer detail |
| `zoomSpeed` | `number` | `0.3` | Radial zoom/pulse animation speed |
| `rotation` | `number` | `0.2` | Whole-pattern rotation speed in degrees per frame |
| `resolution` | `number` | `0.5` | Render resolution fraction — lower is faster |
| `animated` | `boolean` | `true` | Enable animation |

---

### 23. VoronoiCells

Animated Voronoi diagram where seed points drift and self-organize via Lloyd relaxation. Click to add seeds, drag to reposition them — each cell continuously reshapes to fill its territory.

**Presets:** `default` · `stained-glass` · `neon` · `frost` · `ember` · `void` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `cellCount` | `number` | `20` | Number of Voronoi seed points |
| `speed` | `number` | `1` | Seed drift/animation speed |
| `colorMode` | `VoronoiColorMode` | `"cycle"` | `"solid"` \| `"gradient"` \| `"cycle"` — per-cell coloring |
| `cellColor` | `string` | `"#ffffff"` | Base cell color in solid/gradient mode |
| `backgroundColor` | `string` | `"#111111"` | Background / empty space color |
| `showEdges` | `boolean` | `true` | Draw 1px cell boundary lines |
| `edgeColor` | `string` | `"#111111"` | Edge line color |
| `resolution` | `number` | `0.25` | Render resolution fraction — lower is faster |
| `relaxation` | `number` | `0.05` | Lloyd centroid pull strength per frame |
| `interactive` | `boolean` | `true` | Click to add seed; drag to move nearest seed |
| `animated` | `boolean` | `true` | Enable continuous drift animation |

---

### 24. SlimeMold

Physarum polycephalum simulation — thousands of agents deposit pheromone trails, sense ahead, and turn toward stronger concentrations. The emergent result is a self-organizing network of branching veins that evolves in real time.

**Presets:** `default` · `neon` · `coral` · `vein` · `frost` · `gold` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `agentCount` | `number` | `1800` | Number of physarum agents |
| `sensorAngle` | `number` | `45` | Degrees between left/center/right sensors |
| `sensorDistance` | `number` | `9` | Grid pixels ahead each sensor samples |
| `stepSize` | `number` | `1.5` | Agent movement per frame in grid coords |
| `rotateSpeed` | `number` | `45` | Max rotation toward strongest sensor in degrees |
| `trailDecay` | `number` | `0.92` | Trail evaporation multiplier per frame — lower fades faster |
| `diffuseStrength` | `number` | `0.2` | 3×3 blur weight for trail diffusion |
| `trailColor` | `string` | `"#ffcc44"` | Color at max trail concentration |
| `backgroundColor` | `string` | `"#0a0800"` | Color at zero trail |
| `resolution` | `number` | `0.35` | Trail grid resolution fraction — lower is faster |
| `interactive` | `boolean` | `true` | Mouse deposits pheromone attracting agents |
| `mouseRadius` | `number` | `20` | Mouse pheromone deposit radius in px |
| `mouseStrength` | `number` | `3` | Pheromone deposit amount per frame |
| `animated` | `boolean` | `true` | Enable animation |

---

---

### 25. WatercolorBloom

Layered watercolor bloom effect — each bloom expands as concentric semi-transparent ellipses with wet-edge darkening and organic noise distortion. Click to spawn blooms; auto-spawn fires at intervals.

**Presets:** `default` · `sunset` · `ocean` · `spring` · `monochrome` · `neon`

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | `["#f97316", "#ec4899", "#8b5cf6", "#fbbf24"]` | Bloom color palette |
| `backgroundColor` | `string` | `"#0a0005"` | Canvas background |
| `bloomRadius` | `number` | `80` | Max bloom radius in px |
| `bloomSpeed` | `number` | `0.5` | Bloom expansion speed 0–2 |
| `opacity` | `number` | `0.15` | Per-layer opacity 0–1 |
| `wetEdge` | `number` | `0.4` | Wet-edge darkening strength 0–1 |
| `layerCount` | `number` | `6` | Concentric layers per bloom |
| `noiseAmount` | `number` | `0.5` | Edge noise/organic distortion 0–1 |
| `fadeSpeed` | `number` | `0.001` | Bloom fade rate per frame |
| `interactive` | `boolean` | `true` | Click to spawn blooms |
| `autoBloom` | `boolean` | `true` | Auto-spawn blooms at intervals |
| `autoBloomInterval` | `number` | `1500` | Ms between auto blooms |
| `resolution` | `number` | `0.5` | Render resolution fraction |
| `animated` | `boolean` | `true` | Enable animation |
| `maxBlooms` | `number` | `12` | Max concurrent blooms |

---

### 26. PendulaWave

Harmonograph — three coupled pendulums trace Lissajous-like closed curves. The phase-shift pendulum makes the curve rotate slowly and morph through families of patterns. Supports trail fading, damping, and gradient/hue-cycle color modes.

**Presets:** `default` · `neon` · `crystal` · `sand` · `minimal` · `cosmic` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `"#ffb347"` | Stroke color |
| `color2` | `string` | `"#2ec4b6"` | Secondary color used in gradient colorMode |
| `backgroundColor` | `string` | `"#06101a"` | Canvas background |
| `lineWidth` | `number` | `1` | Stroke line width |
| `trailFade` | `number` | `0.01` | Background fade per frame — lower = longer trails |
| `speed` | `number` | `1` | Animation speed multiplier |
| `damping` | `number` | `0.9995` | Energy decay per step 0.999–1 |
| `freq1` | `number` | `2` | Frequency of pendulum 1 (x-axis) |
| `freq2` | `number` | `3` | Frequency of pendulum 2 (y-axis) |
| `freq3` | `number` | `0.01` | Frequency of phase-shift pendulum |
| `amplitude` | `number` | `0.9` | Max swing as fraction of canvas half-size |
| `colorMode` | `PendulaWaveColorMode` | `"cycle"` | `"solid"` \| `"cycle"` \| `"gradient"` |
| `glowEffect` | `boolean` | `false` | Enable glow |
| `glowBlur` | `number` | `10` | Shadow blur for glow |
| `animated` | `boolean` | `true` | Enable animation |
| `autoReset` | `boolean` | `true` | Restart after damping decays to near-zero |

---

### 27. CrystalGrowth

Snowflakes that grow: ice arms reach outward and sprout mirrored side branches in faceted, glowing prisms, then melt away and regrow with a new design. Click to seed a flake of your own.

**Presets:** `default` · `snowflake` · `gem` · `neon` · `frost` · `gold` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `crystalColor` | `string` | `"#e0f2fe"` | Color of crystallized cells |
| `activeColor` | `string` | `"#7dd3fc"` | Color of actively growing frontier |
| `backgroundColor` | `string` | `"#0c1a2e"` | Canvas background |
| `growthSpeed` | `number` | `3` | Growth speed of the ice arms |
| `symmetry` | `number` | `6` | Rotational symmetry arms 2–12 |
| `branchProbability` | `number` | `0.3` | Probability a frontier cell spawns a branch |
| `noiseAmount` | `number` | `0.2` | Random variation in branch length 0–1 |
| `cellSize` | `number` | `3` | Thickness of the ice branches |
| `glowEffect` | `boolean` | `true` | Glow on crystal |
| `glowBlur` | `number` | `12` | Shadow blur for glow |
| `interactive` | `boolean` | `true` | Click to seed new growth |
| `autoReset` | `boolean` | `true` | Restart after growth completes |
| `colorMode` | `CrystalGrowthColorMode` | `"solid"` | `"solid"` \| `"age"` \| `"cycle"` |
| `animated` | `boolean` | `true` | Enable animation |

---

### 28. NeuralWeb

Animated neural network visualization — nodes drift slowly, connect to nearby neighbors, and fire traveling signal pulses that propagate hop-by-hop through the graph. Hover highlights connected edges; click fires a signal from that node.

**Presets:** `default` · `neon` · `brain` · `minimal` · `plasma` · `circuit` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `nodeCount` | `number` | `40` | Number of network nodes |
| `nodeColor` | `string` | `"#5ce1e6"` | Resting node color |
| `edgeColor` | `string` | `"#2a8c9e"` | Edge line color |
| `signalColor` | `string` | `"#ffc857"` | Traveling signal color |
| `backgroundColor` | `string` | `"#050b14"` | Canvas background |
| `connectionRadius` | `number` | `150` | Max px distance to draw edges |
| `nodeRadius` | `number` | `4` | Node circle radius in px |
| `lineWidth` | `number` | `1` | Edge stroke width |
| `speed` | `number` | `1` | Signal travel speed multiplier |
| `pulseInterval` | `number` | `2000` | Ms between auto-pulses |
| `pulseDecay` | `number` | `0.85` | Signal strength multiplier per hop |
| `glowEffect` | `boolean` | `true` | Glow on active nodes/signals |
| `glowBlur` | `number` | `15` | Shadow blur for glow |
| `interactive` | `boolean` | `true` | Hover to highlight; click to fire signal |
| `animated` | `boolean` | `true` | Enable animation |
| `wander` | `boolean` | `true` | Nodes drift slowly |
| `wanderSpeed` | `number` | `0.3` | Node drift speed |

---

---

### 29. Metaballs

Implicit-surface metaball renderer — blobs wander the canvas and merge smoothly when close, producing organic liquid-like unions. The field is evaluated per pixel via an offscreen ImageData grid. Click to add blobs; drag to reposition them.

**Presets:** `default` · `neon` · `plasma` · `lava` · `frost` · `minimal` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `blobCount` | `number` | `5` | Number of metaball blobs |
| `color` | `string` | `"#ff7a45"` | Blob fill color |
| `backgroundColor` | `string` | `"#14060a"` | Canvas background |
| `threshold` | `number` | `1` | Merge threshold — lower = blobs merge sooner |
| `speed` | `number` | `1` | Blob wander speed multiplier |
| `minRadius` | `number` | `40` | Minimum blob radius in px |
| `maxRadius` | `number` | `80` | Maximum blob radius in px |
| `glowEffect` | `boolean` | `false` | Glow on blobs |
| `glowBlur` | `number` | `20` | Shadow blur for glow |
| `resolution` | `number` | `0.25` | Field grid resolution fraction — lower = faster |
| `animated` | `boolean` | `true` | Enable animation |
| `interactive` | `boolean` | `true` | Click to add blobs; drag to move them |

---

### 30. AntColony

Ant Colony Optimization stigmergy simulation — ants deposit food and home pheromone trails on a grid; others sense ahead and follow the strongest trail. Click to place food sources; ants discover them and build highways back to the nest.

**Presets:** `default` · `neon` · `desert` · `midnight` · `tropical` · `minimal` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `antCount` | `number` | `150` | Number of ants |
| `evaporationRate` | `number` | `0.003` | Pheromone decay multiplier per frame |
| `diffusionRate` | `number` | `0.1` | Pheromone spatial blur per frame |
| `pheromoneStrength` | `number` | `5` | Pheromone deposited per ant per frame |
| `antSpeed` | `number` | `1.5` | Ant movement in px/frame |
| `sensorAngle` | `number` | `0.4` | Radians between left/center/right sensors |
| `sensorDistance` | `number` | `9` | Px ahead each sensor samples |
| `turnSpeed` | `number` | `0.4` | Max rotation toward strongest sensor |
| `antColor` | `string` | `"#d9693a"` | Ant dot color |
| `pheromoneColor` | `string` | `"#6fdc8c"` | Pheromone trail color |
| `foodColor` | `string` | `"#f5c242"` | Food source color |
| `nestColor` | `string` | `"#9a6a3a"` | Nest circle color |
| `backgroundColor` | `string` | `"#1a140d"` | Canvas background |
| `resolution` | `number` | `0.25` | Pheromone grid resolution fraction |
| `animated` | `boolean` | `true` | Enable animation |
| `interactive` | `boolean` | `true` | Click to place food sources |
| `maxFood` | `number` | `5` | Max simultaneous food sources |

---

### 31. MagneticField

Interactive 2D magnetic dipole field visualizer. Field lines are traced via Euler integration from each pole. Drag poles to reposition them; click empty space to add a new pole (up to `maxPoles`); right-click a pole to remove it.

**Presets:** `default` · `neon` · `warm` · `cool` · `minimal` · `aurora` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `fieldLineCount` | `number` | `16` | Lines seeded per pole |
| `stepSize` | `number` | `5` | Euler integration step in px |
| `maxSteps` | `number` | `300` | Max steps per field line |
| `positiveColor` | `string` | `"#ef5350"` | N pole fill color |
| `negativeColor` | `string` | `"#42a5f5"` | S pole fill color |
| `lineColor` | `string` | `"#e0f2fe"` | Field line stroke color |
| `backgroundColor` | `string` | `"#06101c"` | Canvas background |
| `lineWidth` | `number` | `1` | Field line stroke width |
| `lineOpacity` | `number` | `0.6` | Field line opacity 0–1 |
| `poleRadius` | `number` | `18` | Pole circle radius in px |
| `glowEffect` | `boolean` | `false` | Glow on poles |
| `glowBlur` | `number` | `15` | Shadow blur for glow |
| `animated` | `boolean` | `false` | Redraw every frame (for animated bg) |
| `interactive` | `boolean` | `true` | Drag/click/right-click poles |
| `maxPoles` | `number` | `6` | Maximum number of poles |

---

### 32. DragonCursor

Skeleton dragon that follows the cursor. Built from vertebra joints, curved ribs, bone wings with membrane arcs, and a skull with animated jaws and hollow eye sockets. Optional fire emission from the mouth. Background star field with optional per-star glow halos.

**Presets:** `default` · `emerald` · `inferno` · `void` · `ice` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `segmentCount` | `number` | `20` | Number of body segments |
| `segmentSize` | `number` | `18` | Segment joint radius in px |
| `bodyColor` | `string` | `"#35e0a1"` | Bone body color |
| `eyeColor` | `string` | `"#ffd24a"` | Eye socket fill color |
| `fireColor` | `string` | `"#ff9d3c"` | Fire particle color |
| `backgroundColor` | `string` | `"#07130f"` | Canvas background |
| `followSpeed` | `number` | `0.15` | Head tracking speed (0–1) |
| `wingSpan` | `number` | `80` | Wing extent in px |
| `showFire` | `boolean` | `false` | Enable fire emission from mouth |
| `interactive` | `boolean` | `true` | Dragon follows the cursor |
| `starCount` | `number` | `60` | Number of background stars |
| `starColor` | `string` | `"#ffffff"` | Star color |
| `glowingStars` | `boolean` | `false` | Enable layered halo glow on ~28% of stars |
| `starGlowBlur` | `number` | `8` | Shadow blur radius for glowing stars |

---

### 33. SakuraBlossom

Cherry blossom petals drifting in wind with optional ground accumulation. Petals rotate realistically, respond to wind gusts, and pile up along the bottom edge.

**Presets:** `default` · `sakura` · `autumn` · `snow` · `neon` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `petalCount` | `number` | `80` | Number of petals |
| `petalColor` | `string` | `"#ffb7c5"` | Petal fill color |
| `petalSize` | `number` | `8` | Petal size in px |
| `backgroundColor` | `string` | `"#1a0a10"` | Canvas background |
| `gravity` | `number` | `0.06` | Downward gravity force |
| `windStrength` | `number` | `0.8` | Horizontal wind force |
| `windGusts` | `boolean` | `true` | Random wind gusts |
| `showAccumulation` | `boolean` | `true` | Petals pile up at the bottom |
| `maxAccumulation` | `number` | `40` | Max petal pile height in px |

---

### 34. KoiPond

Animated koi fish swimming in a tranquil pond with water ripples, lily pads, and caustic light effects. Fish render beneath lily pads; draw order is caustics → fish → lilies. Fish respond to cursor proximity.

**Presets:** `default` · `koi` · `night` · `lotus` · `neon` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `fishCount` | `number` | `6` | Number of koi fish |
| `fishColor` | `string` | `"#ff6030"` | Fish body color |
| `scaleColor` | `string` | `"#ffffff"` | Scale pattern color |
| `waterColor` | `string` | `"#0a1520"` | Pond water color |
| `rippleColor` | `string` | `"#60a8d0"` | Water ripple color |
| `lilyColor` | `string` | `"#50aa50"` | Lily pad color |
| `speed` | `number` | `1` | Fish movement speed multiplier |
| `interactive` | `boolean` | `true` | Fish react to cursor |
| `showLilies` | `boolean` | `true` | Render lily pads |
| `caustics` | `boolean` | `true` | Caustic light shimmer on water |

---

### 35. BlackHole

Accretion disk with relativistic lensing distortion, polar jets, and orbiting particle stream. Cursor controls the viewing angle interactively. Background star field with optional per-star glow halos.

**Presets:** `default` · `cosmic` · `inferno` · `neon` · `void` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `diskColor` | `string` | `"#ff6600"` | Accretion disk particle color |
| `backgroundColor` | `string` | `"#0d0200"` | Canvas background |
| `particleCount` | `number` | `300` | Orbiting particle count |
| `gravity` | `number` | `200` | Gravitational pull strength |
| `eventHorizonRadius` | `number` | `30` | Event horizon radius in px |
| `diskWidth` | `number` | `120` | Accretion disk radial width in px |
| `jetColor` | `string` | `"#ff3300"` | Polar jet color |
| `showJets` | `boolean` | `true` | Render relativistic jets |
| `lensing` | `boolean` | `true` | Gravitational lensing distortion |
| `speed` | `number` | `1` | Animation speed multiplier |
| `interactive` | `boolean` | `true` | Cursor shifts the singularity position |
| `starCount` | `number` | `100` | Number of background stars |
| `starColor` | `string` | `"#ffffff"` | Star color |
| `glowingStars` | `boolean` | `false` | Enable layered halo glow on ~28% of stars |
| `starGlowBlur` | `number` | `8` | Shadow blur radius for glowing stars |

---

### 36. GalaxySpiral

Rotating spiral galaxy with logarithmic arms, a glowing core, depth-sorted halo stars, and interactive tilt. Move the cursor to orbit around the galactic disk.

**Presets:** `default` · `andromeda` · `neon` · `void` · `golden` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `starCount` | `number` | `3000` | Total star particle count |
| `armCount` | `number` | `2` | Number of spiral arms |
| `armTightness` | `number` | `0.5` | Arm winding tightness |
| `coreColor` | `string` | `"#ffd8a8"` | Galactic core color |
| `diskColor` | `string` | `"#a8c4ff"` | Outer disk star color |
| `backgroundColor` | `string` | `"#020408"` | Canvas background |
| `rotationSpeed` | `number` | `0.0003` | Rotation speed in radians/frame |
| `tiltX` | `number` | `0.3` | Initial disk tilt in radians |
| `interactive` | `boolean` | `true` | Cursor tilts the viewing angle |
| `coreGlow` | `boolean` | `true` | Core radial glow overlay |
| `glowBlur` | `number` | `30` | Core glow shadow blur radius |

---

### 37. TornadoVortex

Depth-sorted vortex funnel with rotating particles, ground dust, and lightning. All particles are always visible — depth cues are achieved via alpha and size rather than layer culling.

**Presets:** `default` · `storm` · `fire` · `neon` · `void` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `particleCount` | `number` | `600` | Vortex particle count |
| `funnelColor` | `string` | `"#c8d8e8"` | Funnel particle color |
| `debrisColor` | `string` | `"#8898a8"` | Debris particle color |
| `lightningColor` | `string` | `"#ffffff"` | Lightning bolt color |
| `backgroundColor` | `string` | `"#0a1018"` | Canvas background |
| `rotationSpeed` | `number` | `3` | Angular rotation speed |
| `funnelHeight` | `number` | `0.8` | Funnel height as fraction of canvas height |
| `showLightning` | `boolean` | `true` | Random lightning bolts inside funnel |
| `showGroundDust` | `boolean` | `true` | Ground dust cloud at base |
| `interactive` | `boolean` | `true` | Cursor sways the funnel |
| `speed` | `number` | `1` | Overall animation speed multiplier |

---

### 38. BubbleUniverse

Physics-based bubble simulation with collision detection, merge-on-contact, glow, and shimmer. Bubbles bounce off walls and each other; click to pop.

**Presets:** `default` · `soap` · `neon` · `deep` · `minimal` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `bubbleCount` | `number` | `15` | Initial bubble count |
| `minRadius` | `number` | `20` | Minimum bubble radius in px |
| `maxRadius` | `number` | `50` | Maximum bubble radius in px |
| `backgroundColor` | `string` | `"#050a12"` | Canvas background |
| `shimmerColor` | `string` | `"#ffffff"` | Bubble shimmer highlight color |
| `popEffect` | `boolean` | `true` | Pop animation on click |
| `gravity` | `number` | `0.02` | Downward gravity force |
| `friction` | `number` | `0.995` | Velocity friction per frame |
| `interactive` | `boolean` | `true` | Click to pop bubbles |
| `mergeOnCollide` | `boolean` | `true` | Bubbles merge when they overlap |
| `glowEffect` | `boolean` | `true` | Glow around bubble edges |

---

### 39. SolarFlare

Animated sun with convection cell surface, corona, and arcing solar flare particles. Click to trigger manual flares; auto-flare fires on a configurable interval.

**Presets:** `default` · `inferno` · `plasma` · `neon` · `white-dwarf` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `sunColor` | `string` | `"#ff6600"` | Sun disk color |
| `coronaColor` | `string` | `"#ff3300"` | Corona glow color |
| `flareColor` | `string` | `"#ffaa00"` | Flare particle color |
| `backgroundColor` | `string` | `"#0a0200"` | Canvas background |
| `sunRadius` | `number` | `0.35` | Sun radius as fraction of min(width, height) |
| `convectionCells` | `number` | `20` | Surface convection cell count |
| `flareCount` | `number` | `3` | Max simultaneous active flares |
| `autoFlare` | `boolean` | `true` | Automatically emit flares |
| `autoFlareInterval` | `number` | `3000` | Ms between auto flares |
| `interactive` | `boolean` | `true` | Click to trigger manual flares |
| `glowEffect` | `boolean` | `true` | Corona glow overlay |
| `glowBlur` | `number` | `40` | Corona glow shadow blur |
| `speed` | `number` | `1` | Animation speed multiplier |

---
---

### 40. SpiderWeb

Animated orb-weaver web with radial spokes, turns of the capture spiral, ring membrane fill, dew-drop glow points, and a jointed spider. Web strands sway continuously; cursor proximity creates disturbance waves that ripple outward from the point of contact.

**Presets:** `default` · `night` · `forest` · `neon` · `frost` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `spokeCount` | `number` | `12` | Number of radial spokes |
| `ringCount` | `number` | `10` | Turns of the capture spiral |
| `webColor` | `string` | `"#c0c8e0"` | Strand color |
| `backgroundColor` | `string` | `"#04081a"` | Canvas background |
| `spiderColor` | `string` | `"#404060"` | Spider body color |
| `dewDrops` | `boolean` | `true` | Show dew drop glow points |
| `glowColor` | `string` | `"#8899cc"` | Dew drop glow color |
| `swaySpeed` | `number` | `1` | Ambient sway speed multiplier |
| `disturbRadius` | `number` | `80` | Cursor disturbance radius in px |
| `interactive` | `boolean` | `true` | Enable cursor disturbance |
| `showSpider` | `boolean` | `true` | Show the spider |

---

### 41. ButterflySwarm

Swarm of animated butterflies with realistic flapping wings and vein patterns. Butterflies follow organic wandering paths with cohesion and separation forces; the cursor attracts or scatters the swarm.

**Presets:** `default` · `monarch` · `morpho` · `meadow` · `night` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `butterflyCount` | `number` | `12` | Number of butterflies |
| `wingColor` | `string` | `"#e06010"` | Primary wing color |
| `patternColor` | `string` | `"#111111"` | Wing pattern and body color |
| `backgroundColor` | `string` | `"#0a0800"` | Canvas background |
| `flapSpeed` | `number` | `1` | Wing flap speed multiplier |
| `speed` | `number` | `1` | Movement speed multiplier |
| `attractRadius` | `number` | `120` | Cursor attraction/scatter radius in px |
| `interactive` | `boolean` | `true` | Enable cursor interaction |
| `showTrails` | `boolean` | `false` | Show faint motion trails |

---

### 42. DeepSeaBioluminescence

Bioluminescent deep-sea scene with floating jellyfish and drifting plankton. Jellyfish pulse rhythmically with animated tentacles; cursor movement spawns ripple waves that excite nearby plankton into glowing bursts.

**Presets:** `default` · `abyssal` · `coral` · `aurora` · `crimson` · `monochrome`

| Prop | Type | Default | Description |
|---|---|---|---|
| `jellyfishCount` | `number` | `5` | Number of jellyfish |
| `planktonCount` | `number` | `200` | Number of plankton particles |
| `jellyfishColor` | `string` | `"#7fd8ff"` | Jellyfish bell color |
| `glowColor` | `string` | `"#3fe0d0"` | Bioluminescent glow color |
| `waterColor` | `string` | `"#020a16"` | Background water color |
| `interactive` | `boolean` | `true` | Cursor movement spawns ripples |
| `speed` | `number` | `1` | Overall animation speed multiplier |


## Documentation Site

The docs site lives in `src/docs/` and is built as a separate Vite app (not included in the library bundle). It is deployed to Vercel.

### Routing (`src/docs/DocsApp.tsx`)
```
/                              → Home page
/overview                      → Installation & getting started
/playground                    → Unified component playground
/components/matrix-rain        → MatrixRain docs + interactive playground
/components/particle-field
/components/starfield
... (one route per component, 53 total)
```

### Documentation Components (`src/docs/components/`)

| Component | Purpose |
|---|---|
| `Layout.tsx` | Main layout with sidebar + content area |
| `Sidebar.tsx` | Navigation sidebar listing all components |
| `CodeBlock.tsx` | Syntax-highlighted code display |
| `PropsTable.tsx` | Rendered props documentation table |
| `PlaygroundControls.tsx` | Control widgets: sliders, color pickers, toggles, selectors, color arrays (`PColorArray`) |
| `LazyPreview.tsx` | Lazy-loaded canvas preview with visibility toggling |

### Per-Component Playground Pages
Each page provides:
1. **Live canvas preview** — full-size rendering of the component
2. **Dynamic code block** — updates as controls change, shows exactly how to reproduce current state
3. **Control panel** — sliders for numeric props, color inputs, toggles for booleans, dropdowns for enums
4. **Props table** — complete prop documentation

### Storybook
Components with Storybook stories:
- `MatrixRain.stories.tsx` — Default, ToxicGreen, Binary, Katakana, Blood
- `Confetti.stories.tsx` — Default, Colorful, Celebration, Continuous

---

## Quick Start

```bash
npm install own-the-canvas
```

```tsx
import { MatrixRain, ParticleField } from 'own-the-canvas';

// Monochrome default — works on any background
<MatrixRain style={{ width: '100vw', height: '100vh' }} />

// Themed preset
<MatrixRain preset="cyberpunk" style={{ width: '100vw', height: '100vh' }} />

// Full custom
<MatrixRain
  color="#ff0000"
  backgroundColor="rgba(0,0,0,0.05)"
  fontSize={16}
  speed={20}
  charset="binary"
  style={{ width: '100vw', height: '100vh' }}
/>
```

All components are tree-shakeable. Importing only `MatrixRain` bundles only `MatrixRain`.

---

## TypeScript

Every component exports its props interface:

```ts
import type { MatrixRainProps, ParticleFieldProps } from 'own-the-canvas';
import type { ParticleLineStyle } from 'own-the-canvas';  // union: "solid" | "dashed"
import type { SandMaterial } from 'own-the-canvas'; // union: "sand" | "water" | "fire" | "wall" | "erase"
import type { DLASeedMode } from 'own-the-canvas';  // union: "center" | "ring" | "bottom"
import type { VoronoiColorMode } from 'own-the-canvas';   // union: "solid" | "gradient" | "cycle"
import type { PendulaWaveColorMode } from 'own-the-canvas'; // union: "solid" | "cycle" | "gradient"
import type { CrystalGrowthColorMode } from 'own-the-canvas'; // union: "solid" | "age" | "cycle"
```

Shared base types are also exported:

```ts
import type { BaseCanvasProps } from 'own-the-canvas';
```

---

## Component Category Reference

| Category | Components |
|---|---|
| **Character / Text** | MatrixRain |
| **Particles** | ParticleField, Confetti, Fireworks, Boids |
| **Space / Cosmic** | Starfield, AuroraBorealis, BlackHole, GalaxySpiral, SolarFlare |
| **Nature / Weather** | Rain, Lightning, FireEffect, SakuraBlossom, TornadoVortex, KoiPond, ButterflySwarm, SpiderWeb |
| **Physics Simulations** | FluidSimulation, FlowField, SandSimulation, BubbleUniverse |
| **Cellular / Algorithmic** | GameOfLife, NoiseGradient, ReactionDiffusion, DiffusionAggregation, Metaballs |
| **Geometric / Patterns** | Mandala, Spirograph, Kaleidoscope, VoronoiCells, PendulaWave |
| **Fractal / Generative** | LSystem, CrystalGrowth |
| **Biological Simulations** | SlimeMold, AntColony, DeepSeaBioluminescence |
| **Interactive** | DragonCursor |
| **Data Visualization** | WaveInterference, MagneticField |
| **Generative Art** | WatercolorBloom |
| **Neural / Network** | NeuralWeb |
