import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Overview } from "./pages/Overview";

const Playground = lazy(() => import("./pages/Playground").then((m) => ({ default: m.Playground })));
const MatrixRainPage     = lazy(() => import("./pages/components/MatrixRainPage").then((m) => ({ default: m.MatrixRainPage })));
const ParticleFieldPage  = lazy(() => import("./pages/components/ParticleFieldPage").then((m) => ({ default: m.ParticleFieldPage })));
const StarfieldPage      = lazy(() => import("./pages/components/StarfieldPage").then((m) => ({ default: m.StarfieldPage })));
const FireEffectPage     = lazy(() => import("./pages/components/FireEffectPage").then((m) => ({ default: m.FireEffectPage })));
const AudioVisualizerPage = lazy(() => import("./pages/components/AudioVisualizerPage").then((m) => ({ default: m.AudioVisualizerPage })));
const ConfettiPage       = lazy(() => import("./pages/components/ConfettiPage").then((m) => ({ default: m.ConfettiPage })));
const RippleEffectPage   = lazy(() => import("./pages/components/RippleEffectPage").then((m) => ({ default: m.RippleEffectPage })));
const NoiseGradientPage  = lazy(() => import("./pages/components/NoiseGradientPage").then((m) => ({ default: m.NoiseGradientPage })));
const PixelDissolvePage  = lazy(() => import("./pages/components/PixelDissolvePage").then((m) => ({ default: m.PixelDissolvePage })));
const ConstellationMapPage = lazy(() => import("./pages/components/ConstellationMapPage").then((m) => ({ default: m.ConstellationMapPage })));
const FlowFieldPage        = lazy(() => import("./pages/components/FlowFieldPage").then((m) => ({ default: m.FlowFieldPage })));
const SpotlightPage        = lazy(() => import("./pages/components/SpotlightPage").then((m) => ({ default: m.SpotlightPage })));
const ShockwavePage        = lazy(() => import("./pages/components/ShockwavePage").then((m) => ({ default: m.ShockwavePage })));
const FireworksPage        = lazy(() => import("./pages/components/FireworksPage").then((m) => ({ default: m.FireworksPage })));
const GlitchOverlayPage    = lazy(() => import("./pages/components/GlitchOverlayPage").then((m) => ({ default: m.GlitchOverlayPage })));
const LiveChartPage        = lazy(() => import("./pages/components/LiveChartPage").then((m) => ({ default: m.LiveChartPage })));
const MandalaPage          = lazy(() => import("./pages/components/MandalaPage").then((m) => ({ default: m.MandalaPage })));
const MagneticBlobPage     = lazy(() => import("./pages/components/MagneticBlobPage").then((m) => ({ default: m.MagneticBlobPage })));
const ClothSimulationPage  = lazy(() => import("./pages/components/ClothSimulationPage").then((m) => ({ default: m.ClothSimulationPage })));
const FluidSimulationPage  = lazy(() => import("./pages/components/FluidSimulationPage").then((m) => ({ default: m.FluidSimulationPage })));
const RainPage             = lazy(() => import("./pages/components/RainPage").then((m) => ({ default: m.RainPage })));
const LightningPage        = lazy(() => import("./pages/components/LightningPage").then((m) => ({ default: m.LightningPage })));
const GameOfLifePage       = lazy(() => import("./pages/components/GameOfLifePage").then((m) => ({ default: m.GameOfLifePage })));
const WormholePage         = lazy(() => import("./pages/components/WormholePage").then((m) => ({ default: m.WormholePage })));
const BoidsPage            = lazy(() => import("./pages/components/BoidsPage").then((m) => ({ default: m.BoidsPage })));
const ReactionDiffusionPage = lazy(() => import("./pages/components/ReactionDiffusionPage").then((m) => ({ default: m.ReactionDiffusionPage })));
const AuroraBorealisPage   = lazy(() => import("./pages/components/AuroraBorealisPage").then((m) => ({ default: m.AuroraBorealisPage })));
const SpirographPage       = lazy(() => import("./pages/components/SpirographPage").then((m) => ({ default: m.SpirographPage })));
const SandSimulationPage   = lazy(() => import("./pages/components/SandSimulationPage").then((m) => ({ default: m.SandSimulationPage })));
const WaveInterferencePage = lazy(() => import("./pages/components/WaveInterferencePage").then((m) => ({ default: m.WaveInterferencePage })));

function Loading() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      color: "var(--text-3)",
      fontSize: 14,
      fontFamily: "var(--font)",
    }}>
      Loading…
    </div>
  );
}

export function DocsApp() {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/components/matrix-rain" element={<MatrixRainPage />} />
          <Route path="/components/particle-field" element={<ParticleFieldPage />} />
          <Route path="/components/starfield" element={<StarfieldPage />} />
          <Route path="/components/fire-effect" element={<FireEffectPage />} />
          <Route path="/components/audio-visualizer" element={<AudioVisualizerPage />} />
          <Route path="/components/confetti" element={<ConfettiPage />} />
          <Route path="/components/ripple-effect" element={<RippleEffectPage />} />
          <Route path="/components/noise-gradient" element={<NoiseGradientPage />} />
          <Route path="/components/pixel-dissolve" element={<PixelDissolvePage />} />
          <Route path="/components/constellation-map" element={<ConstellationMapPage />} />
          <Route path="/components/flow-field"        element={<FlowFieldPage />} />
          <Route path="/components/spotlight"         element={<SpotlightPage />} />
          <Route path="/components/shockwave"         element={<ShockwavePage />} />
          <Route path="/components/fireworks"         element={<FireworksPage />} />
          <Route path="/components/glitch-overlay"    element={<GlitchOverlayPage />} />
          <Route path="/components/live-chart"        element={<LiveChartPage />} />
          <Route path="/components/mandala"           element={<MandalaPage />} />
          <Route path="/components/magnetic-blob"     element={<MagneticBlobPage />} />
          <Route path="/components/cloth-simulation"  element={<ClothSimulationPage />} />
          <Route path="/components/fluid-simulation"  element={<FluidSimulationPage />} />
          <Route path="/components/rain"             element={<RainPage />} />
          <Route path="/components/lightning"        element={<LightningPage />} />
          <Route path="/components/game-of-life"     element={<GameOfLifePage />} />
          <Route path="/components/wormhole"         element={<WormholePage />} />
          <Route path="/components/boids"            element={<BoidsPage />} />
          <Route path="/components/reaction-diffusion" element={<ReactionDiffusionPage />} />
          <Route path="/components/aurora-borealis"    element={<AuroraBorealisPage />} />
          <Route path="/components/spirograph"         element={<SpirographPage />} />
          <Route path="/components/sand-simulation"    element={<SandSimulationPage />} />
          <Route path="/components/wave-interference"  element={<WaveInterferencePage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
