# Changelog

All notable changes to this project will be documented in this file.

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
