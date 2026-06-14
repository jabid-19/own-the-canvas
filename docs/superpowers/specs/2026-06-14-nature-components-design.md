# Nature Components Design — SpiderWeb, ButterflySwarm, WillowTree, DeepSeaBioluminescence

Date: 2026-06-14
Build order: SpiderWeb → ButterflySwarm → WillowTree → DeepSeaBioluminescence

## Project Pattern

Each component follows the existing pattern:
- `src/components/Name/Name.tsx` — forwardRef wrapper, presets, props
- `src/components/Name/useName.ts` — all animation logic via canvas ref
- `src/components/Name/index.ts` — re-exports
- `src/docs/pages/components/NamePage.tsx` — playground doc page
- `src/index.ts` — library export
- `src/docs/pages/Home.tsx` — COMPONENTS array entry + import

---

## 1. SpiderWeb

### Concept
Pre-built orb-weaver spider web fills canvas. Web sways gently (ambient wind simulation). Cursor movement disturbs nearby strands — they stretch/vibrate toward cursor. A spider sits at center and crawls along strands when disturbed.

### Ambient behavior
- Sinusoidal sway on each spoke/ring intersection point with slight phase offset per node
- Dew drops on strands catch light (small glowing circles)

### Interactive behavior
- Mouse proximity within `disturbRadius` pulls nearest web nodes toward cursor
- Nodes spring back (Hooke's law with damping)
- Spider moves toward disturbance source along strands

### Props
```ts
interface SpiderWebProps extends BaseCanvasProps {
  spokeCount?: number;        // radial spokes (default: 12)
  ringCount?: number;         // concentric rings (default: 10)
  webColor?: string;          // strand color (default: "#c8c8c8")
  backgroundColor?: string;   // background (default: "#111111")
  spiderColor?: string;       // spider body color (default: "#333333")
  dewDrops?: boolean;         // show dew drops (default: true)
  glowColor?: string;         // dew glow color (default: "#aaddff")
  swaySpeed?: number;         // ambient sway speed (default: 1)
  disturbRadius?: number;     // px radius cursor disturbs (default: 80)
  interactive?: boolean;      // cursor disturbance (default: true)
  showSpider?: boolean;       // show spider (default: true)
  preset?: string;            // "default" | "night" | "forest" | "neon" | "frost"
}
```

### Presets
- `default`: gray web, dark bg
- `night`: silver web, deep blue bg, pale glow
- `forest`: green-tinted strands, dark green bg
- `neon`: cyan web, black bg, bright glow
- `frost`: white web, near-black bg, ice blue glow

### Hook internals
- Build web geometry once on mount (spoke angles, ring radii → node positions)
- Each node has `{ baseX, baseY, x, y, vx, vy }` — spring physics each frame
- Draw spokes then rings as bezier curves through nodes
- Spider: interpolates along strands; `angle`, `legPhase` for leg animation

---

## 2. ButterflySwarm

### Concept
Butterflies drift autonomously across canvas with flapping wing animation. Cursor attracts nearby butterflies slowly; fast cursor movement scatters them. Each butterfly has distinct wing pattern drawn procedurally.

### Ambient behavior
- Butterflies wander with Perlin-like noise steering (same as Boids-lite but gentler)
- Wings flap: sine-wave scale on X axis per wing, phase offset L/R
- Soft color variation per butterfly (hue shift from base color)
- Occasional gentle spiral drift

### Interactive behavior
- Cursor within `attractRadius`: butterfly steers toward cursor (gentle pull)
- Fast cursor velocity (delta > threshold): nearby butterflies scatter (flee)

### Props
```ts
interface ButterflySwarmProps extends BaseCanvasProps {
  butterflyCount?: number;    // (default: 12)
  wingColor?: string;         // primary wing color (default: "#f97316")
  patternColor?: string;      // wing pattern accent (default: "#111111")
  backgroundColor?: string;   // (default: "#111111")
  flapSpeed?: number;         // wing flap speed multiplier (default: 1)
  speed?: number;             // movement speed (default: 1)
  attractRadius?: number;     // cursor attraction radius px (default: 120)
  interactive?: boolean;      // (default: true)
  showTrails?: boolean;       // faint motion trails (default: false)
  preset?: string;            // "default" | "monarch" | "morpho" | "meadow" | "night"
}
```

### Presets
- `default`: orange wings, dark bg
- `monarch`: orange/black monarch pattern, dark bg
- `morpho`: iridescent blue, dark bg
- `meadow`: multi-color mix, light sky bg
- `night`: pale/ghostly wings, very dark bg

### Hook internals
- Each butterfly: `{ x, y, vx, vy, angle, flapPhase, hue, size, wanderAngle }`
- Wings drawn as two mirrored bezier curves (upper + lower lobe) scaled by `cos(flapPhase)`
- Spot patterns: small ellipses at fixed wing coordinates, transformed with wing
- Wander: accumulate angle noise each frame; cursor pull overrides

---

## 3. WillowTree

### Concept
Generative weeping willow tree centered at bottom of canvas. Trunk and branches use recursive L-system-lite generation. Branches hang with trailing leaf strands. Mouse X axis = wind direction and strength; wind makes strands sway.

### Ambient behavior
- Random gentle breeze cycles (sin wave on wind strength)
- Leaves on strands have slight individual phase delay (cascade effect)
- Occasional leaf detaches and floats down

### Interactive behavior
- Mouse X position maps to wind angle (-30° to +30° from center)
- Mouse velocity amplifies wind strength
- Fallen leaves drift toward mouse X bias

### Props
```ts
interface WillowTreeProps extends BaseCanvasProps {
  trunkColor?: string;        // (default: "#4a3728")
  leafColor?: string;         // (default: "#4a7c59")
  skyColor?: string;          // background gradient top (default: "#111111")
  groundColor?: string;       // background gradient bottom (default: "#1a1a1a")
  branchCount?: number;       // major branches off trunk (default: 8)
  strandCount?: number;       // hanging strands per branch (default: 6)
  interactive?: boolean;      // mouse controls wind (default: true)
  showFallingLeaves?: boolean;// detaching leaf particles (default: true)
  preset?: string;            // "default" | "spring" | "autumn" | "night" | "winter"
}
```

### Presets
- `default`: dark bg, green leaves
- `spring`: light sky, bright green leaves, pink blossom touches
- `autumn`: warm bg, orange/red/yellow leaves
- `night`: deep blue bg, silver-tinted leaves
- `winter`: gray bg, bare branches, light snow falling

### Hook internals
- Tree generated once: trunk segments, branch forks (2-level), hang points
- Strands: array of `{ points[], phase, length }` — each point is a spring node
- Wind vector applied to each strand point with damping
- Falling leaves: pool of `{ x, y, vx, vy, rotation, alpha }` particles

---

## 4. DeepSeaBioluminescence

### Concept
Dark ocean floor environment. Jellyfish drift upward slowly with pulsing bells. Bioluminescent plankton float everywhere. Anglerfish lure bobs in corner. Cursor sweep through water triggers rippling blue-green glow that spreads and fades.

### Ambient behavior
- Jellyfish pulse (bell contracts/expands on sine, tentacles trail)
- Plankton: hundreds of tiny particles drifting upward slowly, twinkling
- Anglerfish lure: small glow bob on a curved line, swaying
- Occasional deep sea fish silhouette drifts past edge-to-edge

### Interactive behavior
- Cursor movement spawns bioluminescent ripple at cursor position
- Ripple spreads outward, lighting up plankton it passes through
- Plankton near ripple brighten and briefly glow stronger

### Props
```ts
interface DeepSeaBioluminescenceProps extends BaseCanvasProps {
  jellyfishCount?: number;    // (default: 5)
  planktonCount?: number;     // (default: 200)
  jellyfishColor?: string;    // bell color (default: "#88ccff")
  glowColor?: string;         // bioluminescent glow (default: "#00ffcc")
  waterColor?: string;        // bg color (default: "#020c14")
  interactive?: boolean;      // cursor triggers glow ripples (default: true)
  showAnglerfish?: boolean;   // (default: true)
  speed?: number;             // overall drift speed (default: 1)
  preset?: string;            // "default" | "abyssal" | "coral" | "aurora" | "crimson"
}
```

### Presets
- `default`: teal glow, deep blue water
- `abyssal`: near-black water, minimal purple glow
- `coral`: warmer water, pink/orange bioluminescence
- `aurora`: green glow mimicking northern lights underwater
- `crimson`: deep red glow, near-black water

### Hook internals
- Jellyfish: `{ x, y, vy, phase, tentacles[], size }` — bell drawn as ellipse with arc, tentacles as bezier chains
- Plankton: flat array of `{ x, y, vx, vy, brightness, glowTimer }`
- Ripples: pool of `{ x, y, radius, maxRadius, alpha }` from cursor
- Each frame: check plankton vs ripple radius, boost brightness if inside

---

## Files to create per component (×4)

1. `src/components/Name/Name.tsx`
2. `src/components/Name/useName.ts`
3. `src/components/Name/index.ts`
4. `src/docs/pages/components/NamePage.tsx`

## Files to modify (×4 components, but batched)

5. `src/index.ts` — add exports
6. `src/docs/pages/Home.tsx` — add to COMPONENTS array + import
7. `src/docs/DocsApp.tsx` — add Route per component
8. `src/docs/components/Sidebar.tsx` — add sidebar nav entry per component
