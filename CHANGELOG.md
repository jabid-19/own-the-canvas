# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-11-01

The big one: 18 new Living Scenes, effects that react to your page's elements, a production-safe runtime, color by default, and a redrawn catalog. 11 components are removed; see the README's "Upgrading from 1.x" for replacements.

### Added

- 10 more scene components: `SnowDrift`, `FrostGlass`, `OrigamiCranes`, `SeasonsTree`, `InkMountains`, `WindowRain`, `IncenseSmoke`, `MoonlitSea`, `CloudSea`, `Ferrofluid`. `SnowDrift`, `FrostGlass`, `OrigamiCranes`, and `SeasonsTree` support `collide`.
- 8 new nature components, all on the shared runtime: `IvyGrowth`, `Fireflies`, `Dandelion`, `GrassField`, `Moths`, `SunbeamDust`, `PaperLanterns`, `KelpForest`. Each tracks the cursor at window level, so it reacts even when used as a background under other content. `IvyGrowth`, `Fireflies`, `Dandelion`, and `PaperLanterns` support `collide` with `data-otc-solid` elements.
- DOM-aware effects: `SakuraBlossom` gains `overlay`, `collide`, `restitution`, and `zIndex`. With `collide`, petals land on elements marked `data-otc-solid`, rest there (following the element on scroll), and slide off with the wind. `data-otc-solid="live"` re-reads sticky/animated elements every frame.
- Shared canvas runtime under `SakuraBlossom`: pauses offscreen and in background tabs, honors `prefers-reduced-motion` (one static frame), adapts particle budget to frame rate, caps DPR at 2.

### Improved

- `Fireworks` is a full show over a city skyline: rockets climb on spark trails and burst as one of six shell types (peony, chrysanthemum, willow, ring, palm, crossette), stars leave glowing streaks, gold willows glitter, and each burst lights the sky. Clicking now sends the shell to the clicked height. Motion is frame-rate independent. New default palette swaps violet for gold.
- `BubbleUniverse` bubbles look like soap film (clear centres, swirling rainbow rims, window reflections and glints) over a soft bokeh background, and drift upward instead of piling on the floor. `gravity` is now a pull against buoyancy: below 0.03 bubbles rise.
- `Rain` is a rainy night street: three depth layers of rain in a gusting wind, mist, street lamps mirrored on wet asphalt, ripples and spray, and lightning flashes when the rain is heavy. New default palette (blue night).
- `Metaballs` are lit as glossy 3D lava-lamp wax with a hot core, highlights and rim glow, and move with a rising and sinking convection drift. New default colour (orange).
- `SandSimulation` pours itself (new `autoPour`, default true): three drifting streams build banded dunes, and the floor drains when the pile gets high. Grains keep a stable colour with lit surfaces and depth shading instead of re-randomising every frame.
- `CrystalGrowth` grows vector snowflakes (faceted ice prisms with mirrored dendrites, a sectored centre plate, glow and twinkling tips) instead of a pixel blob; finished flakes melt and regrow. `cellSize` now sets branch thickness.
- `PendulaWave` draws a real harmonograph onto a persistent ink layer that fills the canvas, with a glowing pen and soft glow. New default palette (amber shading into teal).
- `AntColony` places food at the start so trails form right away, draws real ants (with walking legs and carried crumbs), an anthill, berry piles and a soil floor; food trails glow. New default palette (fire ants on soil, green trails).
- `NeuralWeb` draws neurons (glowing body, nucleus, dendrites) joined by curved axons; signals run as comets and set off cascades of firing. New default palette (cyan and amber).
- `ParticleField` gets soft glowing particles with depth, two-tone colour, lines that brighten as particles close in, and the cursor joining the constellation. New default palette (ice blue).
- `LSystem` grows plants with tapered bark-to-green branches, leaves and blossoms at the tips, wind sway, a grassy mound and drifting petals; flat fractals get a colour gradient.
- `MagneticField` adds an iron-filings texture, red-to-blue field lines, glowing current flowing from N to S, and shaded metal poles. `animated` now defaults to true (it drives the current). Default poles are red N and blue S.
- `ReactionDiffusion` is lit as a glossy relief, with shaded slopes and specular ridges.
- `FireEffect` renders smooth licking flames instead of per-pixel static: a noise-driven heat field on a coarse grid, upscaled with smoothing, plus a glow layer and rising sparks. Same props; `resolution` now sets the grid cell size.
- `Kaleidoscope` is a real kaleidoscope: coloured glass shards and beads tumble in one wedge that is mirrored around the centre and fills the canvas edge to edge, instead of blurry noise inside a disc. New default palette (amber and teal). `noiseScale` now sets how many shards there are.
- `DeepSeaBioluminescence` draws translucent pulsing jellyfish at different depths (glowing bells, rim lights, ruffled oral arms, trailing tentacles) with marine snow and light shafts; moving the cursor stirs up luminous sparks and makes nearby plankton and jellyfish flash. New default palette (cyan and teal).
- `SpiderWeb` is a real orb web: an irregular frame bridged to the edges, radii, and one continuous scalloped capture spiral that shimmers in the moonlight, with dew beads and an orb-weaver spider that walks to where you disturb the web. `ringCount` is now the number of spiral turns.
- `DragonCursor` is redrawn as a solid, glowing dragon instead of a wireframe skeleton: tapered scaled body with a glowing rim, dorsal spines, legs, membrane wings with veins, a horned head with glowing slit-pupil eyes and whiskers, and additive fire. New default palette (emerald body, amber eyes, orange flame) and `wingSpan` default 80. Props and presets are unchanged.
- `TornadoVortex`, `SolarFlare`, `BlackHole`, `NoiseGradient`, `Boids`, and `WatercolorBloom` are rebuilt for much better visuals and moved onto the shared runtime (pause offscreen, reduced motion, frame-rate independent, adaptive quality). Props and presets are unchanged.
  - TornadoVortex: curved rope funnel of orbiting condensation streaks under a rotating wall cloud; dust skirt, flung debris, lightning that lights the cloud.
  - SolarFlare: granulated photosphere with limb darkening and sunspots, corona streamers, plasma flowing along magnetic loops, eruptions whose plasma falls back.
  - BlackHole: Interstellar-style shadow, photon ring, Doppler-beamed disk, lensed far side of the disk, gravitationally lensed stars and grid.
  - NoiseGradient: domain-warped flowing gradient (no more stretched streaks), dithered against banding, pixel budget capped for full-screen use.
  - Boids: field of view, variable speed, panic that ripples through the flock, flapping/banking bird silhouettes with depth; spatial grid for large flocks.
  - WatercolorBloom: layered translucent washes from recursive polygon deformation, wet-edge pigment, paper grain.

### Fixed

- Docs site: smooth scrolling kept the first page's height as its scroll limit, so Introduction and Installation couldn't be scrolled to the bottom after navigating from another page.
- Cursor-following effects no longer chase the cursor outside their canvas (regression from 1.0.12, which moved their `mousemove` listener to `window`). They still react through foreground content stacked on the canvas; anywhere else on the page they behave as if the cursor left. `DragonCursor` wanders autonomously, `BlackHole` drifts back to center, `TornadoVortex` wanders, the rest drop their cursor interaction, and a `ParticleField` drag ends when it leaves the canvas.

- npm package: published type declarations no longer include test and Storybook files, and now include the shared runtime types that component declarations import (strict `skipLibCheck: false` setups resolved them as missing).

### Removed (breaking)

- `Shockwave`, `Lissajous`, `MagneticBlob`, `Wormhole`, `ClothSimulation`, `GlitchOverlay`, `PixelDissolve`, `AudioVisualizer`, `TerrainMesh`, `ParticleText`, and `InkBleed` are removed, along with their exported types (`LissajousColorMode`, `VisualizerMode`, `DissolveDirection`, and so on). Closest replacements: `PendulaWave` for Lissajous curves (its harmonograph draws the same figures), `Metaballs` for MagneticBlob, `Starfield` with `perspective="3D"` for Wormhole.

### Changed

- **Components default to color instead of monochrome (visual breaking change).** With no `preset`, each component now renders in its signature palette: the colors of a natural preset (`KoiPond` uses `koi`, `FlowField` uses `ocean`, `Fireworks` uses `celebration`, `FireEffect` uses `inferno`, and so on). Only colors change; counts, speeds, and physics are untouched. `MatrixRain` defaults to classic `#00ff41`, `Confetti` to the `colorful` palette, `LSystem` to green branches. To keep the old look, pass `preset="monochrome"`, which every preset-driven component now accepts. Explicit color props still win over any preset.
- Docs site: playgrounds open on the colorful default and list `monochrome` as a preset; the site is redesigned as a paper-cut diorama: cream sheets with hand-cut edges on a kraft desk, stacked colored under-sheets, washi-tape labels, layered-hill banners, and a terracotta accent instead of black.
- React 19 is now a supported peer dependency (`^18.0.0 || ^19.0.0`).
- `SakuraBlossom` motion is time-based. It looks identical at 60Hz and no longer runs 2x fast on 120Hz displays.

## [1.0.12] - 2026-09-16

### Fixed

- 19 components with ambient (non-click-gated) cursor-follow effects — BlackHole, Boids, BubbleUniverse, ButterflySwarm, ClothSimulation, DeepSeaBioluminescence, DragonCursor, FlowField, FluidSimulation, GalaxySpiral, KoiPond, MagneticBlob, NeuralWeb, ParticleField, ParticleText, SlimeMold, SpiderWeb, TornadoVortex, Wormhole — now respond to the cursor when used as a background layer with foreground content stacked on top. Previously the `mousemove` listener was bound to the canvas itself, which browsers never dispatch to when something else is on top; it's now bound to `window`.

## [1.0.0] - 2026-05-17

### Added

Initial release with 26 canvas-based React components:

- AudioVisualizer, Boids, ClothSimulation, Confetti, ConstellationMap
- FireEffect, Fireworks, FlowField, FluidSimulation, GameOfLife
- GlitchOverlay, Lightning, LiveChart, MagneticBlob, Mandala
- MatrixRain, NoiseGradient, ParticleField, PixelDissolve, Rain
- RippleEffect, Shockwave, Spotlight, Starfield, Wormhole
