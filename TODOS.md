# TODOS

## Runtime

### Migrate Rain + Confetti onto the canvas runtime (PR2)

**What:** Move Rain and Confetti onto `useCanvasSetup` + `src/runtime/world.ts` with `overlay`, `collide`, `restitution` props.

**Why:** PR1 ships SakuraBlossom alone to prove the runtime/world API before the pattern is copied. These two complete the 1.1.0 "DOM-aware" set.

**Context:** Follow the rules PR1 settles: physics scaled by `k = dt / 16.67`, resting particles anchored to their solid `{solid, offsetX}`, overlay forces `clearRect`, `onResize` re-seeds. Rain should spawn its existing splash/ripple at the collision point (restitution 0). Confetti bounces (restitution 0.4). Each gets a pure `step*()` regression test like Sakura's `stepPetal`. Design: `docs/designs/canvas-runtime-dom-aware.md`.

**Effort:** M
**Priority:** P1
**Depends on:** PR1 (runtime + world + Sakura) merged

### Export the runtime publicly for creative coders

**What:** Export `useCanvasSetup`, `world.solidsFor`, and `collide` (plus their types) from `src/index.ts`.

**Why:** Creative coders are a target audience, but today they can only use prebuilt effects. A public runtime lets them build their own effects that get pause/reduced-motion/governor/DOM collisions for free.

**Context:** Currently nothing runtime-related is exported (`src/index.ts` exports components only). Once exported, the hook contract (`onFrame(ctx, w, h, dt, { quality, world })`, `onResize`, `overlay`, `reducedMotion`, `maxDpr`) is semver-stable. Wait until two migrations (PR1 Sakura, PR2 Rain + Confetti) used it without changes. Add a docs page "Write your own effect".

**Effort:** S
**Priority:** P2
**Depends on:** PR2 merged with no hook contract changes

## QA (prop sweep, 2026-11-01)

### Cap devicePixelRatio in the legacy hooks

**What:** GameOfLife, FlowField and Lightning use `window.devicePixelRatio` uncapped (others cap at 2).

**Why:** On 3x phones the buffer is 2.25x bigger than needed, costing fill rate for no visible gain.

**Effort:** S
**Priority:** P3

### Unknown preset names fall back to the monochrome look

**What:** `PRESETS[preset] || {}` resolves a typo like `preset="neno"` to the plain fallbacks (white on #111), not to `default`.

**Why:** Silent; users think the component is broken. Falling back to `PRESETS.default` would match intent, but `presets.test.ts` pins the current expression, so it is a deliberate convention change.

**Effort:** S
**Priority:** P3

## Completed

### Solids inside nested scroll containers

Pulled into PR1: the docs site itself scrolls `#main-content` (Lenis wrapper), not the window, so the hero demo hit this. `world.ts` now marks its cache dirty on any element scroll (one capture-phase listener); window scroll stays arithmetic. Known ceiling: inner-scroller pages re-measure solids once per frame while scrolling. **Completed:** PR1 (2026-10-31)
