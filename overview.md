# own-the-canvas — Project Overview

## Project Summary

**own-the-canvas** is a React component library of 30 canvas-based visual effects and animations, built entirely on the HTML Canvas 2D API with zero runtime dependencies. Every component is optimized for performance, highly customizable through props, and ships with full TypeScript support.

| Field | Value |
|---|---|
| **Version** | 1.0.3 |
| **Author** | Jabid Hasan |
| **License** | MIT |
| **npm** | `own-the-canvas` |
| **Docs** | https://own-the-canvas.vercel.app |
| **Repository** | https://github.com/jabid-19/own-the-canvas |
| **React peer dep** | `^18.0.0` |
| **Runtime dependencies** | None |

---

## Design Philosophy

### Monochromatic Defaults
Every component defaults to a neutral, monochrome palette (`#111111` background, `#ffffff` primary, `#6b7280` secondary). This makes components immediately usable on any dark or light background without configuration. Color is an opt-in enhancement, not a requirement.

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
│   ├── index.ts                      # Barrel export — all 25 components + types
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
│   │   │   ├── useMatrixRain.ts      # Animation hook (all canvas drawing logic)
│   │   │   └── MatrixRain.stories.tsx # Storybook stories (optional)
│   │   ├── ParticleField/
│   │   ├── Starfield/
│   │   ├── FireEffect/
│   │   ├── AudioVisualizer/
│   │   ├── Confetti/
│   │   ├── RippleEffect/
│   │   ├── NoiseGradient/
│   │   ├── PixelDissolve/
│   │   ├── ConstellationMap/
│   │   ├── FlowField/
│   │   ├── Spotlight/
│   │   ├── Shockwave/
│   │   ├── Fireworks/
│   │   ├── GlitchOverlay/
│   │   ├── LiveChart/
│   │   ├── Mandala/
│   │   ├── MagneticBlob/
│   │   ├── ClothSimulation/
│   │   ├── FluidSimulation/
│   │   ├── Rain/
│   │   ├── Lightning/
│   │   ├── GameOfLife/
│   │   ├── Wormhole/
│   │   ├── Boids/
│   │   ├── ReactionDiffusion/
│   │   ├── AuroraBorealis/
│   │   ├── Spirograph/
│   │   ├── SandSimulation/
│   │   └── WaveInterference/
│   └── docs/                         # Documentation site (not in lib bundle)
│       ├── DocsApp.tsx
│       ├── main.tsx
│       ├── tokens.css                # Design tokens (CSS variables)
│       ├── pages/                    # Per-component documentation pages
│       │   ├── Home.tsx
│       │   ├── Overview.tsx
│       │   ├── Playground.tsx
│       │   └── components/           # 25 component playground pages
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
- **`sampleGradient(colors[], t)`**: Interpolates linearly between N color stops at position `t ∈ [0,1]`. Used by FireEffect palette mapping and NoiseGradient.

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

**Presets:** `default` · `cyberpunk` · `binary` · `minimal` · `blood`

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `"#ffffff"` | Character color |
| `backgroundColor` | `string` | `"rgba(17,17,17,0.1)"` | Per-frame overlay — lower opacity = longer trails |
| `fontSize` | `number` | `14` | Font size in px; controls column density |
| `speed` | `number` | `33` | Ms per frame — lower = faster |
| `charset` | `"latin" \| "binary" \| "katakana" \| string` | `"latin"` | Characters to rain |
| `resetThreshold` | `number` | `0.95` | Probability a column resets after leaving bottom |

---

### 2. ParticleField

Floating particles with optional proximity-based connection lines and mouse repulsion. Particles move with Brownian motion and bounce off invisible walls.

**Presets:** `default` · `galaxy` · `snow` · `minimal` · `ocean`

| Prop | Type | Default | Description |
|---|---|---|---|
| `particleCount` | `number` | `120` | Number of particles |
| `particleColor` | `string` | `"#ffffff"` | Particle fill color |
| `lineColor` | `string` | `"#6b7280"` | Connection line color |
| `lineDistance` | `number` | `120` | Max px distance to draw lines |
| `particleSize` | `number` | `2.5` | Max particle radius in px |
| `speed` | `number` | `0.8` | Base movement speed |
| `connectParticles` | `boolean` | `true` | Draw lines between nearby particles |
| `interactive` | `boolean` | `true` | Repel particles from mouse |
| `backgroundColor` | `string` | `"transparent"` | Canvas background |
| `repelRadius` | `number` | `80` | Mouse repulsion radius in px |
| `repelStrength` | `number` | `0.3` | Mouse repulsion force |
| `friction` | `number` | `0.99` | Velocity friction per frame |
| `maxVelocityMultiplier` | `number` | `3` | Max velocity as multiple of speed |
| `lineWidth` | `number` | `0.8` | Connection line stroke width |
| `lineOpacity` | `number` | `0.6` | Max connection line opacity |

---

### 3. Starfield

2D twinkling starfield or 3D perspective warp-tunnel. Supports shooting stars and configurable star size/opacity ranges.

**Presets:** `default` · `warp` · `peaceful` · `minimal` · `nebula`

| Prop | Type | Default | Description |
|---|---|---|---|
| `starCount` | `number` | `200` | Number of stars |
| `starColor` | `string` | `"#ffffff"` | Star color |
| `backgroundColor` | `string` | `"#111111"` | Background color |
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

---

### 4. FireEffect

Pixel-level fire simulation using a cellular automaton algorithm. Heat propagates upward from a seeded bottom row with cooling, wind drift, and palette-based color mapping.

**Presets:** `default` · `inferno` · `toxic` · `ice` · `plasma`

| Prop | Type | Default | Description |
|---|---|---|---|
| `palette` | `"smoke" \| "inferno" \| "toxic" \| "ice" \| "plasma"` | `"smoke"` | Color theme |
| `intensity` | `number` | `0.95` | Flame intensity 0–1 |
| `windStrength` | `number` | `0.3` | Horizontal wind strength -1 to 1 |
| `windDirection` | `number` | `1` | Wind direction: 1 = right, -1 = left |
| `spread` | `number` | `0.7` | Flame spread 0–1 |
| `cooling` | `number` | `0.3` | Cooling rate — higher = shorter flames |
| `noiseStrength` | `number` | `60` | Bottom-row seed noise magnitude |
| `coolingScale` | `number` | `3` | Cooling amount scaling factor |
| `resolution` | `number` | `1` | Fire buffer resolution 0.5 = half size |

---

### 5. AudioVisualizer

Web Audio API visualizer with multiple modes. Shows an idle animation when no audio source is connected. Supports bars, wave, circular, and mirror layouts.

**Presets:** `default` · `neon` · `minimal` · `fire` · `ocean`

| Prop | Type | Default | Description |
|---|---|---|---|
| `audioSource` | `MediaStream \| null` | `null` | MediaStream from getUserMedia |
| `barCount` | `number` | `64` | Number of frequency bars |
| `barColor` | `string` | `"#ffffff"` | Bar fill color |
| `waveColor` | `string` | `"#ffffff"` | Wave stroke color |
| `mode` | `"bars" \| "wave" \| "circular" \| "mirror"` | `"bars"` | Visualization mode |
| `sensitivity` | `number` | `1` | Amplitude sensitivity multiplier |
| `gapBetweenBars` | `number` | `2` | Gap between bars in px |
| `rounded` | `boolean` | `true` | Rounded bar caps |
| `gradient` | `boolean` | `true` | Color gradient on bars/wave |
| `gradientEndColor` | `string` | `"#ffffff"` | Gradient top/end color |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `glowEffect` | `boolean` | `true` | Enable glow |
| `glowColor` | `string` | *(barColor)* | Glow color |
| `glowBlur` | `number` | `12` | Glow blur radius in px |
| `fftSize` | `number` | `2048` | Web Audio FFT size (power of 2) |
| `smoothingTimeConstant` | `number` | `0.8` | Analyser smoothing 0–1 |
| `circularRadiusRatio` | `number` | `0.25` | Inner radius fraction for circular mode |
| `idleAmplitude` | `number` | `5` | Idle wave amplitude in px |
| `idleAnimationSpeed` | `number` | `1` | Idle animation speed multiplier |

---

### 6. Confetti

Physics-based confetti with burst and continuous emission modes. Supports multiple shapes, gravity, wind, and precise spawn control. Default palette is monochrome; switch to `"colorful"` for celebrations.

**Presets:** `default` · `celebration` · `pastel` · `gold`

| Prop | Type | Default | Description |
|---|---|---|---|
| `palette` | `"monochrome" \| "colorful"` | `"monochrome"` | Color variant |
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

### 7. RippleEffect

Expanding concentric ring ripples triggered by clicks or auto-fired at intervals. Multiple ripples can coexist simultaneously.

**Presets:** `default` · `neon` · `minimal` · `sunset` · `cosmic`

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `"#ffffff"` | Ripple stroke color |
| `maxRadius` | `number` | `150` | Maximum ripple radius |
| `speed` | `number` | `2` | Expansion speed |
| `lineWidth` | `number` | `1.5` | Stroke width |
| `decay` | `number` | `0.8` | Opacity decay rate |
| `multiRipple` | `boolean` | `true` | Allow simultaneous ripples |
| `backgroundColor` | `string` | `"transparent"` | Canvas background |
| `interactive` | `boolean` | `true` | Spawn ripple on click |
| `autoInterval` | `number` | `1500` | Ms between auto-ripples |
| `radiusGrowthRate` | `number` | `2` | Radius growth multiplier per frame |
| `opacityDecayRate` | `number` | `0.02` | Opacity decay per frame |
| `autoCenter` | `boolean` | `true` | Auto-ripples spawn from center |

---

### 8. NoiseGradient

Animated Perlin/Simplex noise-driven full-canvas color gradient. Renders at configurable resolution for performance and upscales smoothly.

**Presets:** `default` · `aurora` · `sunset` · `ocean` · `forest` · `neon`

Default colors (monochrome): `["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | *(monochrome)* | 2–5 hex color stops |
| `speed` | `number` | `0.25` | Animation speed multiplier |
| `scale` | `number` | `1` | Noise zoom — higher = more zoomed in |
| `octaves` | `number` | `3` | Fractal octaves 1–6 — more = more detail |
| `animated` | `boolean` | `true` | Enable animation |
| `blendMode` | `string` | `"source-over"` | Canvas composite blend mode |
| `timeOffsetY` | `number` | `0.5` | Y-axis time offset ratio |
| `persistence` | `number` | `0.5` | Octave amplitude persistence 0–1 |
| `resolution` | `number` | `0.25` | Render resolution fraction — lower = faster |

---

### 9. PixelDissolve

Pixel-block dissolve transition overlay that can reveal or hide content beneath it. Supports multiple reveal patterns and child content compositing.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Content to render beneath the overlay |
| `pixelSize` | `number` | `8` | Pixel block size |
| `speed` | `number` | `0.5` | Dissolve animation speed 0–2 |
| `direction` | `"in" \| "out" \| "both"` | `"out"` | Appear, disappear, or out-then-in |
| `trigger` | `boolean` | `false` | Rising edge triggers animation |
| `color` | `string` | `"#ffffff"` | Pixel color |
| `progressMultiplier` | `number` | `0.01` | Speed multiplier per frame |
| `dissolvePattern` | `"random" \| "center" \| "edges" \| "horizontal"` | `"random"` | Pixel reveal order |
| `onComplete` | `() => void` | — | Called when animation finishes |

---

### 10. ConstellationMap

Draggable star constellation with animated connections, twinkling, and smooth drift. Stars can be repositioned by dragging.

**Presets:** `default` · `cosmos` · `minimal` · `aurora` · `gold`

| Prop | Type | Default | Description |
|---|---|---|---|
| `starCount` | `number` | `80` | Number of stars |
| `starColor` | `string` | `"#ffffff"` | Star color |
| `lineColor` | `string` | `"#6b7280"` | Connection line color |
| `backgroundColor` | `string` | `"#111111"` | Background color |
| `speed` | `number` | `0.3` | Star drift speed |
| `interactive` | `boolean` | `true` | Enable drag-to-move stars |
| `lineStyle` | `"solid" \| "dashed"` | `"solid"` | Connection line style |
| `glowStars` | `boolean` | `true` | Glow effect on stars |
| `connectionDistance` | `number` | `100` | Max distance for connections |
| `velocityMultiplier` | `number` | `0.3` | Initial star speed multiplier |
| `dragRadius` | `number` | `20` | Drag detection radius in px |
| `twinkleSpeed` | `number` | `0.03` | Twinkle animation speed |
| `lineAlpha` | `number` | `0.5` | Max line opacity |
| `lineWidth` | `number` | `0.8` | Line stroke width |
| `glowMultiplier` | `number` | `4` | Glow blur as multiple of star size |
| `twinkleAmplitude` | `number` | `0.4` | Twinkle opacity amplitude |

---

### 11. FlowField

Perlin noise vector field guiding particle streams with optional curl noise for more organic swirling motion.

**Presets:** `default` · `neon` · `ocean` · `lava` · `forest` · `monochrome`

Default colors (monochrome): `["#ffffff", "#6b7280", "#9ca3af"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `particleCount` | `number` | `800` | Number of flow particles |
| `colors` | `string[]` | *(monochrome)* | Stroke colors — one picked per particle |
| `speed` | `number` | `1` | Flow speed multiplier |
| `noiseScale` | `number` | `0.004` | Noise sampling scale — lower = larger structures |
| `trailLength` | `number` | `0.04` | Trail fade length |
| `fadeStrength` | `number` | `0.04` | Background fade opacity per frame |
| `lineWidth` | `number` | `1` | Stroke line width |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `animated` | `boolean` | `true` | Enable animation |
| `timeSpeed` | `number` | `1` | Noise field evolution speed |
| `curl` | `boolean` | `false` | Add curl noise for swirling flow |

---

### 12. Spotlight

Mouse-following spotlight effect with soft-edged radial overlay, optional glow ring, and ellipse shape support. Canvas sits as an absolute overlay over its container.

**Presets:** `default` · `soft` · `dramatic` · `neon` · `ellipse`

| Prop | Type | Default | Description |
|---|---|---|---|
| `radius` | `number` | `120` | Spotlight radius in px |
| `color` | `string` | `"#ffffff"` | Inner tint color |
| `overlayColor` | `string` | `"#000000"` | Overlay fill color |
| `overlayOpacity` | `number` | `0.75` | Overlay opacity 0–1 |
| `edgeSoftness` | `number` | `0.4` | Edge softness 0–1 |
| `followSpeed` | `number` | `0.1` | Mouse follow lerp speed 0–1 |
| `glowColor` | `string` | `"#6b7280"` | Glow ring color |
| `glowSize` | `number` | `30` | Glow ring size in px |
| `showGlow` | `boolean` | `true` | Show glow ring |
| `shape` | `"circle" \| "ellipse"` | `"circle"` | Spotlight shape |
| `ellipseRatio` | `number` | `0.6` | Y/X ratio for ellipse shape |
| `interactive` | `boolean` | `true` | React to mouse movement |
| `defaultX` | `number` | `0.5` | Default X as fraction of width |
| `defaultY` | `number` | `0.5` | Default Y as fraction of height |

---

### 13. Shockwave

Expanding multi-ring shockwave effect, alternating between two colors per ring. Can auto-fire on interval or be triggered by click.

**Presets:** `default` · `neon` · `explosion` · `ripple` · `minimal`

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | `"#ffffff"` | Primary ring color |
| `secondaryColor` | `string` | `"#6b7280"` | Alternating ring color |
| `ringCount` | `number` | `3` | Rings per shockwave |
| `ringSpacing` | `number` | `20` | Px gap between rings at spawn |
| `speed` | `number` | `4` | Expansion speed px/frame |
| `maxRadius` | `number` | `200` | Max radius before ring fades |
| `lineWidth` | `number` | `2` | Stroke line width |
| `fadeSpeed` | `number` | `0.02` | Opacity decrease per frame |
| `autoFire` | `boolean` | `false` | Auto-fire shockwaves |
| `autoInterval` | `number` | `2000` | Ms between auto-fires |
| `glowEffect` | `boolean` | `true` | Glow effect on rings |
| `glowBlur` | `number` | `15` | Shadow blur for glow |
| `backgroundColor` | `string` | `"transparent"` | Canvas background |

---

### 14. Fireworks

Launching shells that explode into particle bursts. Shells arc upward and burst with physics-based particle trails and glow. Can auto-launch or be triggered by click.

**Presets:** `default` · `celebration` · `subtle` · `neon` · `golden`

Default colors (monochrome): `["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | *(monochrome)* | Particle burst colors |
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
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `shellSpeed` | `number` | `12` | Shell upward speed |

---

### 15. GlitchOverlay

Digital glitch effect with RGB channel separation, CRT scanlines, block-slice artifacts, and film noise. Designed as an absolute-positioned overlay.

**Presets:** `default` · `crt` · `cyberpunk` · `subtle` · `corrupt`

| Prop | Type | Default | Description |
|---|---|---|---|
| `intensity` | `number` | `0.6` | Glitch probability 0–1 |
| `speed` | `number` | `1` | Animation speed multiplier |
| `rgbShift` | `number` | `8` | RGB color shift in px |
| `scanlines` | `boolean` | `true` | Show CRT scanlines |
| `scanlineOpacity` | `number` | `0.08` | Scanline opacity |
| `scanlineSpacing` | `number` | `2` | Px between scanlines |
| `blockGlitch` | `boolean` | `true` | Enable block-slice glitch |
| `blockCount` | `number` | `4` | Number of glitch blocks |
| `noiseOpacity` | `number` | `0.02` | Film noise opacity |
| `flickerRate` | `number` | `0.02` | Screen flicker rate 0–1 |
| `color` | `string` | `"#ffffff"` | Glitch bar color |
| `animated` | `boolean` | `true` | Enable animation |
| `backgroundColor` | `string` | `"transparent"` | Canvas background |

---

### 16. LiveChart

Real-time animated multi-series line chart with auto-scrolling, smooth bezier curves, grid overlay, and optional fill areas.

**Presets:** `default` · `neon` · `minimal` · `ocean` · `fire`

| Prop | Type | Default | Description |
|---|---|---|---|
| `series` | `LiveChartSeries[]` | *(demo sine/cosine)* | Data series to render |
| `maxPoints` | `number` | `100` | Max data points per series |
| `animated` | `boolean` | `true` | Enable animation loop |
| `lineWidth` | `number` | `2` | Stroke width |
| `showGrid` | `boolean` | `true` | Horizontal grid lines |
| `gridColor` | `string` | `"#ffffff"` | Grid line color |
| `gridOpacity` | `number` | `0.08` | Grid opacity |
| `showDots` | `boolean` | `false` | Show data point dots |
| `dotRadius` | `number` | `3` | Dot radius when shown |
| `fillOpacity` | `number` | `1` | Fill area opacity multiplier |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `padding` | `number` | `20` | Inner padding in px |
| `yMin` | `number` | — | Fixed y minimum |
| `yMax` | `number` | — | Fixed y maximum |
| `smooth` | `boolean` | `true` | Smooth curves with quadratic bezier |
| `glowEffect` | `boolean` | `true` | Line glow effect |
| `glowBlur` | `number` | `8` | Shadow blur for glow |
| `scrollSpeed` | `number` | `1` | Scroll animation speed |

`LiveChartSeries`: `{ data: number[], color: string, filled?: boolean }`

---

### 17. Mandala

Rotating symmetrical geometric mandala with configurable rotational arms, concentric layers, bilateral mirroring, and organic noise distortion.

**Presets:** `default` · `neon` · `lotus` · `cosmic` · `minimal`

Default colors (monochrome): `["#ffffff", "#6b7280"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `symmetry` | `number` | `8` | Number of rotational symmetry arms |
| `colors` | `string[]` | *(monochrome)* | Stroke colors cycled per layer |
| `lineWidth` | `number` | `1.5` | Stroke line width |
| `speed` | `number` | `1` | Rotation animation speed |
| `layers` | `number` | `5` | Number of concentric petal layers |
| `radius` | `number` | `1` | Outer radius as fraction of canvas min dimension |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `animated` | `boolean` | `true` | Enable animation |
| `glowEffect` | `boolean` | `true` | Glow effect |
| `glowBlur` | `number` | `10` | Shadow blur for glow |
| `strokeOpacity` | `number` | `0.8` | Layer stroke opacity |
| `mirror` | `boolean` | `true` | Bilateral symmetry per arm |
| `noiseAmount` | `number` | `0.3` | Organic noise distortion 0–1 |

---

### 18. MagneticBlob

Metaball blobs that merge and separate organically. Mouse attracts blobs. Uses marching-squares-style implicit surface rendering.

**Presets:** `default` · `neon` · `plasma` · `ocean` · `lava` · `minimal`

Default colors (monochrome): `["#ffffff", "#6b7280"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | `5` | Number of blobs |
| `colors` | `string[]` | *(monochrome)* | Blob colors |
| `radius` | `number` | `80` | Base blob radius in px |
| `speed` | `number` | `1` | Wander animation speed |
| `magnetStrength` | `number` | `0.08` | Mouse attraction force |
| `magnetRadius` | `number` | `150` | Mouse influence radius in px |
| `threshold` | `number` | `1.8` | Metaball merge threshold |
| `glowEffect` | `boolean` | `true` | Glow effect |
| `glowBlur` | `number` | `20` | Shadow blur for glow |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `animated` | `boolean` | `true` | Enable animation |
| `followMouse` | `boolean` | `true` | Blobs follow cursor |
| `wanderStrength` | `number` | `0.4` | Organic wander amplitude |

---

### 19. ClothSimulation

Verlet integration physics cloth simulation with grid topology, configurable gravity, wind, friction, and optional cloth tearing on mouse drag.

**Presets:** `default` · `silk` · `net` · `heavy` · `spider`

| Prop | Type | Default | Description |
|---|---|---|---|
| `cols` | `number` | `25` | Grid columns |
| `rows` | `number` | `20` | Grid rows |
| `spacing` | `number` | `18` | Point spacing in px |
| `gravity` | `number` | `0.4` | Gravity per frame |
| `friction` | `number` | `0.99` | Velocity friction 0–1 |
| `stiffness` | `number` | `1` | Constraint stiffness 0–1 |
| `iterations` | `number` | `3` | Relaxation iterations per frame |
| `lineColor` | `string` | `"#6b7280"` | Cloth mesh color |
| `pinColor` | `string` | `"#ffffff"` | Pin point color |
| `lineWidth` | `number` | `1` | Mesh stroke width |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `wind` | `number` | `0.3` | Wind oscillation amplitude |
| `windSpeed` | `number` | `0.5` | Wind oscillation frequency |
| `tearable` | `boolean` | `false` | Enable cloth tearing on drag |
| `tearDistance` | `number` | `3` | Ratio above rest length that tears |
| `interactive` | `boolean` | `true` | Enable mouse interaction |
| `mouseRadius` | `number` | `30` | Mouse influence radius in px |
| `mouseForce` | `number` | `5` | Mouse push force |
| `showPins` | `boolean` | `true` | Show pin points at top |

---

### 20. FluidSimulation

Navier-Stokes fluid solver on a grid. Mouse movement injects velocity and ink; auto-ink bursts fire at intervals for continuous motion without interaction.

**Presets:** `default` · `ink` · `neon` · `lava` · `ocean` · `smoke`

Default colors (monochrome): `["#ffffff", "#6b7280", "#9ca3af"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `resolution` | `number` | `80` | Grid resolution 32–128 |
| `viscosity` | `number` | `0.0001` | Fluid viscosity |
| `diffusion` | `number` | `0.0001` | Ink diffusion rate |
| `dissipation` | `number` | `0.995` | Density fade per frame |
| `inkColors` | `string[]` | *(monochrome)* | Ink colors |
| `glowEffect` | `boolean` | `true` | Glow on ink |
| `glowBlur` | `number` | `0` | Shadow blur for glow |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `autoInk` | `boolean` | `true` | Auto-inject ink bursts |
| `autoInkInterval` | `number` | `1500` | Ms between auto-ink bursts |
| `mouseForce` | `number` | `5` | Mouse velocity force multiplier |
| `inkRadius` | `number` | `4` | Ink splat radius in grid cells |

---

### 21. Rain

Falling rain drops with optional splash particles on impact. Wind drift oscillates sinusoidally.

**Presets:** `default` · `storm` · `drizzle` · `neon` · `golden`

| Prop | Type | Default | Description |
|---|---|---|---|
| `dropCount` | `number` | `200` | Number of rain drops |
| `speed` | `number` | `15` | Drop fall speed in px/frame |
| `wind` | `number` | `0.3` | Horizontal wind drift strength |
| `windSpeed` | `number` | `0.5` | Wind oscillation frequency |
| `dropLength` | `number` | `20` | Drop streak length in px |
| `dropWidth` | `number` | `1` | Drop stroke width in px |
| `dropOpacity` | `number` | `0.6` | Drop opacity 0–1 |
| `dropColor` | `string` | `"#a8c8e8"` | Drop color |
| `splashColor` | `string` | `"#7aaec8"` | Splash particle color |
| `showSplashes` | `boolean` | `true` | Show splashes when drops hit bottom |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |

---

### 22. Lightning

Fractal lightning bolts using midpoint displacement. Branching, flicker, and glow are all configurable. Click to trigger at cursor position.

**Presets:** `default` · `neon` · `storm` · `plasma` · `subtle`

| Prop | Type | Default | Description |
|---|---|---|---|
| `segments` | `number` | `8` | Recursion depth for bolt segments |
| `roughness` | `number` | `0.5` | Midpoint displacement roughness 0–1 |
| `branchChance` | `number` | `0.3` | Branch probability per segment |
| `branchDecay` | `number` | `0.6` | Energy multiplier for sub-branches |
| `flickerCount` | `number` | `3` | Rapid flicker strikes per event |
| `glowBlur` | `number` | `20` | Glow shadow blur radius |
| `color` | `string` | `"#6b7280"` | Bolt glow color |
| `coreColor` | `string` | `"#ffffff"` | Inner core color |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `autoInterval` | `number` | `2000` | Ms between auto strikes |
| `interactive` | `boolean` | `true` | Click to trigger at cursor |
| `startX` | `number` | `0.5` | Strike origin X as fraction of width |
| `startY` | `number` | `0` | Strike origin Y as fraction of height |
| `endY` | `number` | `1` | Strike end Y as fraction of height |

---

### 23. GameOfLife

Conway's Game of Life with age-based cell coloring, edge wrapping, and click-to-toggle interaction. Exposes an imperative handle for `reset()` and `randomize()`.

**Presets:** `default` · `neon` · `matrix` · `minimal` · `fire`

| Prop | Type | Default | Description |
|---|---|---|---|
| `cellSize` | `number` | `8` | Cell size in px |
| `speed` | `number` | `10` | Simulation updates per second |
| `initialDensity` | `number` | `0.3` | Initial alive cell density 0–1 |
| `aliveColor` | `string` | `"#ffffff"` | Color of newly born cells |
| `oldColor` | `string` | `"#6b7280"` | Color of old cells |
| `deadColor` | `string` | `"#111111"` | Color of dead cells |
| `showAge` | `boolean` | `true` | Color cells by generation age |
| `wrapEdges` | `boolean` | `true` | Wrap cells at canvas edges |
| `interactive` | `boolean` | `true` | Click to toggle cells |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |

**`GameOfLifeHandle`** (via ref): exposes `reset()` and `randomize()` methods.

---

### 24. Wormhole

Perspective tunnel of rotating rings creating a wormhole/hyperspace effect. Mouse X position controls tunnel speed when interactive.

**Presets:** `default` · `hyperspace` · `neon` · `vortex` · `minimal`

Default colors (monochrome): `["#ffffff", "#6b7280"]`

| Prop | Type | Default | Description |
|---|---|---|---|
| `ringCount` | `number` | `30` | Number of tunnel rings |
| `speed` | `number` | `1` | Forward travel speed |
| `colors` | `string[]` | *(monochrome)* | Ring stroke colors — cycles through array |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `twist` | `number` | `0.3` | Rotation twist per unit depth |
| `fov` | `number` | `300` | Perspective field of view |
| `depth` | `number` | `400` | Perspective depth scale |
| `lineWidth` | `number` | `1.5` | Ring stroke width |
| `opacity` | `number` | `0.8` | Ring opacity 0–1 |
| `starCount` | `number` | `100` | Tunnel wall star count |
| `starColor` | `string` | `"#ffffff"` | Star dot color |
| `interactive` | `boolean` | `true` | Mouse X controls tunnel speed |

---

### 25. Boids

Reynolds boids flocking simulation with separation, alignment, and cohesion rules. Triangular agents with trails flee from mouse cursor.

**Presets:** `default` · `birds` · `fish` · `swarm` · `neon`

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
| `color` | `string` | `"#ffffff"` | Boid and trail color |
| `trailLength` | `number` | `8` | Trail history length in frames |
| `trailOpacity` | `number` | `0.4` | Trail line opacity 0–1 |
| `boidSize` | `number` | `6` | Boid triangle size in px |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `interactive` | `boolean` | `true` | Boids flee from mouse |
| `mouseRadius` | `number` | `80` | Mouse avoidance radius in px |
| `mouseForce` | `number` | `0.2` | Mouse avoidance force |
| `wrapEdges` | `boolean` | `true` | Wrap boids at canvas edges |

---

### 26. ReactionDiffusion

Gray-Scott reaction-diffusion simulation. Two virtual chemicals (U and V) interact via autocatalysis to spontaneously grow coral, spots, maze, and traveling-wave patterns from random seeds. Mouse click+drag disturbs the chemical field.

**Presets:** `default` · `coral` · `spots` · `maze` · `waves` · `neon`

| Prop | Type | Default | Description |
|---|---|---|---|
| `feedRate` | `number` | `0.055` | Feed rate f — controls pattern type |
| `killRate` | `number` | `0.062` | Kill rate k — controls pattern density |
| `diffusionU` | `number` | `0.2` | Diffusion rate for chemical U (keep dU/dV = 2) |
| `diffusionV` | `number` | `0.1` | Diffusion rate for chemical V |
| `resolution` | `number` | `0.5` | Render resolution fraction — lower = faster |
| `speed` | `number` | `8` | Simulation steps per frame |
| `colorA` | `string` | `"#111111"` | Color at low V concentration |
| `colorB` | `string` | `"#ffffff"` | Color at high V concentration |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `interactive` | `boolean` | `true` | Mouse click+drag disturbs the field |

---

### 27. AuroraBorealis

Animated northern lights with layered sine-wave curtains, vertical light streaks, and a star field. Uses additive screen blending to build luminous, overlapping color bands.

**Presets:** `default` · `arctic` · `solar` · `tropical` · `neon` · `midnight`

| Prop | Type | Default | Description |
|---|---|---|---|
| `colors` | `string[]` | `["#ffffff","#6b7280","#9ca3af"]` | Aurora band colors |
| `speed` | `number` | `1` | Animation speed multiplier |
| `intensity` | `number` | `0.8` | Band brightness/opacity 0–1 |
| `layers` | `number` | `5` | Number of aurora layers |
| `backgroundColor` | `string` | `"#111111"` | Sky background color |
| `waveAmplitude` | `number` | `0.15` | Wave height as fraction of canvas height |
| `waveFrequency` | `number` | `2` | Wave oscillations across canvas width |
| `starCount` | `number` | `80` | Background star count |
| `animated` | `boolean` | `true` | Enable animation |

---

### 28. Spirograph

Hypotrochoid parametric curves drawn incrementally in real time. Adjusting inner radius and pen distance produces an infinite variety of petal, star, and loop patterns — each cycle fades into the next with slight randomization.

**Presets:** `default` · `neon` · `minimal` · `cosmic` · `pastel`

| Prop | Type | Default | Description |
|---|---|---|---|
| `outerRadius` | `number` | `0.85` | Outer circle R as fraction of min(w,h)/2 |
| `innerRadius` | `number` | `0.4` | Inner circle r as fraction of outerRadius |
| `penDistance` | `number` | `0.9` | Pen arm d as fraction of innerRadius |
| `speed` | `number` | `2` | Degrees of angle drawn per frame |
| `color` | `string` | `"#ffffff"` | Curve stroke color |
| `backgroundColor` | `string` | `"#111111"` | Background fill color |
| `lineWidth` | `number` | `1` | Stroke line width |
| `trailFade` | `number` | `0.003` | Background fade opacity per frame — lower = longer trails |
| `animated` | `boolean` | `true` | Enable animation |
| `autoReset` | `boolean` | `true` | Randomize and restart after each full cycle |

---

### 29. SandSimulation

Falling-sand cellular automaton. Paint sand, water, fire, and walls with your mouse and watch physics unfold — sand piles, water flows laterally, fire rises and extinguishes on contact with water, sand sinks through water.

**Presets:** `default` · `desert` · `ocean` · `inferno` · `neon`

**Materials:** `sand` · `water` · `fire` · `wall` · `erase`

| Prop | Type | Default | Description |
|---|---|---|---|
| `cellSize` | `number` | `4` | Cell size in pixels |
| `brushSize` | `number` | `3` | Paint brush radius in cells |
| `material` | `SandMaterial` | `"sand"` | Active material to paint |
| `sandColor` | `string` | `"#ffffff"` | Sand cell color |
| `waterColor` | `string` | `"#6b7280"` | Water cell color |
| `fireColor` | `string` | `"#ffffff"` | Fire cell hot color |
| `wallColor` | `string` | `"#4b5563"` | Wall cell color |
| `backgroundColor` | `string` | `"#111111"` | Empty cell background color |
| `interactive` | `boolean` | `true` | Enable mouse painting |
| `gravity` | `number` | `1` | Gravity strength multiplier |

---

### 30. WaveInterference

Real-time wave superposition from multiple point sources. Click to add sources, click an existing source to remove it. Constructive and destructive interference fringes appear and animate instantly.

**Presets:** `default` · `ripple` · `plasma` · `neon` · `cosmic`

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxSources` | `number` | `6` | Maximum number of wave sources |
| `wavelength` | `number` | `80` | Wave wavelength in pixels |
| `speed` | `number` | `1` | Wave propagation speed multiplier |
| `colorHigh` | `string` | `"#ffffff"` | Constructive interference color |
| `colorLow` | `string` | `"#111111"` | Destructive interference color |
| `backgroundColor` | `string` | `"#111111"` | Canvas background |
| `showSources` | `boolean` | `true` | Show source markers |
| `resolution` | `number` | `0.4` | Render resolution fraction — lower = faster |
| `animated` | `boolean` | `true` | Enable animation |
| `decay` | `number` | `0.003` | Amplitude decay rate with distance |

---

## Documentation Site

The docs site lives in `src/docs/` and is built as a separate Vite app (not included in the library bundle). It is deployed to Vercel.

### Routing (`src/docs/DocsApp.tsx`)
```
/                        → Home page
/overview                → Installation & getting started
/playground              → Unified component playground
/components/matrix-rain  → MatrixRain docs + interactive playground
/components/particle-field
/components/starfield
... (one route per component)
```

### Documentation Components (`src/docs/components/`)

| Component | Purpose |
|---|---|
| `Layout.tsx` | Main layout with sidebar + content area |
| `Sidebar.tsx` | Navigation sidebar listing all components |
| `CodeBlock.tsx` | Syntax-highlighted code display |
| `PropsTable.tsx` | Rendered props documentation table |
| `PlaygroundControls.tsx` | Control widgets: sliders, color pickers, toggles, selectors |
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
- `AudioVisualizer.stories.tsx` — Bars, Wave, Circular, Mirror

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
import type { MatrixRainProps, ParticleFieldProps, LiveChartSeries } from 'own-the-canvas';
import type { SandMaterial } from 'own-the-canvas'; // union: "sand" | "water" | "fire" | "wall" | "erase"
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
| **Space / Cosmic** | Starfield, ConstellationMap, Wormhole, AuroraBorealis |
| **Nature / Weather** | Rain, Lightning, FireEffect |
| **Physics Simulations** | ClothSimulation, FluidSimulation, FlowField, MagneticBlob, SandSimulation |
| **Cellular / Algorithmic** | GameOfLife, NoiseGradient, ReactionDiffusion |
| **Geometric / Patterns** | Mandala, RippleEffect, Shockwave, Spirograph |
| **Interactive Overlays** | Spotlight, GlitchOverlay, PixelDissolve |
| **Data Visualization** | LiveChart, WaveInterference |
| **Audio** | AudioVisualizer |
