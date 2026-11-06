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
const ConfettiPage       = lazy(() => import("./pages/components/ConfettiPage").then((m) => ({ default: m.ConfettiPage })));
const NoiseGradientPage  = lazy(() => import("./pages/components/NoiseGradientPage").then((m) => ({ default: m.NoiseGradientPage })));
const FlowFieldPage        = lazy(() => import("./pages/components/FlowFieldPage").then((m) => ({ default: m.FlowFieldPage })));
const FireworksPage        = lazy(() => import("./pages/components/FireworksPage").then((m) => ({ default: m.FireworksPage })));
const MandalaPage          = lazy(() => import("./pages/components/MandalaPage").then((m) => ({ default: m.MandalaPage })));
const FluidSimulationPage  = lazy(() => import("./pages/components/FluidSimulationPage").then((m) => ({ default: m.FluidSimulationPage })));
const RainPage             = lazy(() => import("./pages/components/RainPage").then((m) => ({ default: m.RainPage })));
const LightningPage        = lazy(() => import("./pages/components/LightningPage").then((m) => ({ default: m.LightningPage })));
const GameOfLifePage       = lazy(() => import("./pages/components/GameOfLifePage").then((m) => ({ default: m.GameOfLifePage })));
const BoidsPage            = lazy(() => import("./pages/components/BoidsPage").then((m) => ({ default: m.BoidsPage })));
const ReactionDiffusionPage = lazy(() => import("./pages/components/ReactionDiffusionPage").then((m) => ({ default: m.ReactionDiffusionPage })));
const AuroraBorealisPage   = lazy(() => import("./pages/components/AuroraBorealisPage").then((m) => ({ default: m.AuroraBorealisPage })));
const SpirographPage       = lazy(() => import("./pages/components/SpirographPage").then((m) => ({ default: m.SpirographPage })));
const SandSimulationPage   = lazy(() => import("./pages/components/SandSimulationPage").then((m) => ({ default: m.SandSimulationPage })));
const WaveInterferencePage = lazy(() => import("./pages/components/WaveInterferencePage").then((m) => ({ default: m.WaveInterferencePage })));
const DiffusionAggregationPage = lazy(() => import("./pages/components/DiffusionAggregationPage").then((m) => ({ default: m.DiffusionAggregationPage })));
const KaleidoscopePage   = lazy(() => import("./pages/components/KaleidoscopePage").then((m) => ({ default: m.KaleidoscopePage })));
const VoronoiCellsPage   = lazy(() => import("./pages/components/VoronoiCellsPage").then((m) => ({ default: m.VoronoiCellsPage })));
const SlimeMoldPage      = lazy(() => import("./pages/components/SlimeMoldPage").then((m) => ({ default: m.SlimeMoldPage })));
const WatercolorBloomPage = lazy(() => import("./pages/components/WatercolorBloomPage").then((m) => ({ default: m.WatercolorBloomPage })));
const PendulaWavePage    = lazy(() => import("./pages/components/PendulaWavePage").then((m) => ({ default: m.PendulaWavePage })));
const CrystalGrowthPage  = lazy(() => import("./pages/components/CrystalGrowthPage").then((m) => ({ default: m.CrystalGrowthPage })));
const NeuralWebPage      = lazy(() => import("./pages/components/NeuralWebPage").then((m) => ({ default: m.NeuralWebPage })));
const MetaballsPage      = lazy(() => import("./pages/components/MetaballsPage").then((m) => ({ default: m.MetaballsPage })));
const AntColonyPage      = lazy(() => import("./pages/components/AntColonyPage").then((m) => ({ default: m.AntColonyPage })));
const MagneticFieldPage  = lazy(() => import("./pages/components/MagneticFieldPage").then((m) => ({ default: m.MagneticFieldPage })));
const DragonCursorPage   = lazy(() => import("./pages/components/DragonCursorPage").then((m) => ({ default: m.DragonCursorPage })));
const SakuraBlossomPage  = lazy(() => import("./pages/components/SakuraBlossomPage").then((m) => ({ default: m.SakuraBlossomPage })));
const KoiPondPage        = lazy(() => import("./pages/components/KoiPondPage").then((m) => ({ default: m.KoiPondPage })));
const SpiderWebPage     = lazy(() => import("./pages/components/SpiderWebPage").then((m) => ({ default: m.SpiderWebPage })));
const ButterflySwarmPage = lazy(() => import("./pages/components/ButterflySwarmPage").then((m) => ({ default: m.ButterflySwarmPage })));
const BlackHolePage      = lazy(() => import("./pages/components/BlackHolePage").then((m) => ({ default: m.BlackHolePage })));
const GalaxySpiralPage   = lazy(() => import("./pages/components/GalaxySpiralPage").then((m) => ({ default: m.GalaxySpiralPage })));
const TornadoVortexPage  = lazy(() => import("./pages/components/TornadoVortexPage").then((m) => ({ default: m.TornadoVortexPage })));
const BubbleUniversePage = lazy(() => import("./pages/components/BubbleUniversePage").then((m) => ({ default: m.BubbleUniversePage })));
const SolarFlarePage     = lazy(() => import("./pages/components/SolarFlarePage").then((m) => ({ default: m.SolarFlarePage })));
const IvyGrowthPage = lazy(() => import("./pages/components/IvyGrowthPage").then((m) => ({ default: m.IvyGrowthPage })));
const FirefliesPage = lazy(() => import("./pages/components/FirefliesPage").then((m) => ({ default: m.FirefliesPage })));
const DandelionPage = lazy(() => import("./pages/components/DandelionPage").then((m) => ({ default: m.DandelionPage })));
const GrassFieldPage = lazy(() => import("./pages/components/GrassFieldPage").then((m) => ({ default: m.GrassFieldPage })));
const OwlPage = lazy(() => import("./pages/components/OwlPage").then((m) => ({ default: m.OwlPage })));
const OctopusPage = lazy(() => import("./pages/components/OctopusPage").then((m) => ({ default: m.OctopusPage })));
const HummingbirdPage = lazy(() => import("./pages/components/HummingbirdPage").then((m) => ({ default: m.HummingbirdPage })));
const CandlePage = lazy(() => import("./pages/components/CandlePage").then((m) => ({ default: m.CandlePage })));
const CatPage = lazy(() => import("./pages/components/CatPage").then((m) => ({ default: m.CatPage })));
const JellyfishPage = lazy(() => import("./pages/components/JellyfishPage").then((m) => ({ default: m.JellyfishPage })));
const SnailPage = lazy(() => import("./pages/components/SnailPage").then((m) => ({ default: m.SnailPage })));
const SunflowersPage = lazy(() => import("./pages/components/SunflowersPage").then((m) => ({ default: m.SunflowersPage })));
const KomorebiPage = lazy(() => import("./pages/components/KomorebiPage").then((m) => ({ default: m.KomorebiPage })));
const TidePoolPage = lazy(() => import("./pages/components/TidePoolPage").then((m) => ({ default: m.TidePoolPage })));
const EyePage = lazy(() => import("./pages/components/EyePage").then((m) => ({ default: m.EyePage })));
const MothsPage = lazy(() => import("./pages/components/MothsPage").then((m) => ({ default: m.MothsPage })));
const SunbeamDustPage = lazy(() => import("./pages/components/SunbeamDustPage").then((m) => ({ default: m.SunbeamDustPage })));
const PaperLanternsPage = lazy(() => import("./pages/components/PaperLanternsPage").then((m) => ({ default: m.PaperLanternsPage })));
const KelpForestPage = lazy(() => import("./pages/components/KelpForestPage").then((m) => ({ default: m.KelpForestPage })));
const SnowDriftPage = lazy(() => import("./pages/components/SnowDriftPage").then((m) => ({ default: m.SnowDriftPage })));
const OrigamiCranesPage = lazy(() => import("./pages/components/OrigamiCranesPage").then((m) => ({ default: m.OrigamiCranesPage })));
const SeasonsTreePage = lazy(() => import("./pages/components/SeasonsTreePage").then((m) => ({ default: m.SeasonsTreePage })));
const InkMountainsPage = lazy(() => import("./pages/components/InkMountainsPage").then((m) => ({ default: m.InkMountainsPage })));
const WindowRainPage = lazy(() => import("./pages/components/WindowRainPage").then((m) => ({ default: m.WindowRainPage })));
const IncenseSmokePage = lazy(() => import("./pages/components/IncenseSmokePage").then((m) => ({ default: m.IncenseSmokePage })));
const MoonlitSeaPage = lazy(() => import("./pages/components/MoonlitSeaPage").then((m) => ({ default: m.MoonlitSeaPage })));
const CloudSeaPage = lazy(() => import("./pages/components/CloudSeaPage").then((m) => ({ default: m.CloudSeaPage })));
const FerrofluidPage = lazy(() => import("./pages/components/FerrofluidPage").then((m) => ({ default: m.FerrofluidPage })));

const LOADING_LINES = ["Cutting paper…", "Mixing ink…", "Priming the canvas…", "Connecting the stars…"];
const STARS: [number, number][] = [[33.5, 17.7], [23.3, 33.8], [14.6, 57.2], [17.7, 73.3], [27.1, 102.7]];

// The logo's enso, cut in paper strips that draw themselves while a page chunk loads.
function Loading() {
  const [line, setLine] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setLine((l) => (l + 1) % LOADING_LINES.length), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="otc-loader" role="status" aria-label="Loading">
      <svg className="otc-loader-mark" viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r="58" fill="#fbf5e8" />
        <g className="otc-loader-stars">
          <path d={"M" + STARS.map(([x, y]) => `${x} ${y}`).join("L")} stroke="#4f4136" strokeWidth=".5" fill="none" />
          {STARS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 2 : 1.4} fill="#2b2118" style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </g>
        <g className="otc-loader-spin">
          <circle className="otc-loader-arc" cx="64" cy="64" r="38" stroke="#74493a" transform="translate(-1.2 1.4)" />
          <circle className="otc-loader-arc" cx="64" cy="64" r="38" stroke="#b17962" />
        </g>
        <g className="otc-loader-spin otc-loader-spin--rev">
          <circle className="otc-loader-ink" cx="66" cy="65" r="27" stroke="#2b2118" />
        </g>
      </svg>
      <span className="otc-loader-caption" aria-hidden="true">{LOADING_LINES[line]}</span>
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
          <Route path="/components/confetti" element={<ConfettiPage />} />
          <Route path="/components/noise-gradient" element={<NoiseGradientPage />} />
<Route path="/components/flow-field"        element={<FlowFieldPage />} />
          <Route path="/components/fireworks"         element={<FireworksPage />} />
          <Route path="/components/mandala"           element={<MandalaPage />} />
          <Route path="/components/fluid-simulation"  element={<FluidSimulationPage />} />
          <Route path="/components/rain"             element={<RainPage />} />
          <Route path="/components/lightning"        element={<LightningPage />} />
          <Route path="/components/game-of-life"     element={<GameOfLifePage />} />
          <Route path="/components/boids"            element={<BoidsPage />} />
          <Route path="/components/reaction-diffusion" element={<ReactionDiffusionPage />} />
          <Route path="/components/aurora-borealis"    element={<AuroraBorealisPage />} />
          <Route path="/components/spirograph"         element={<SpirographPage />} />
          <Route path="/components/sand-simulation"    element={<SandSimulationPage />} />
          <Route path="/components/wave-interference"  element={<WaveInterferencePage />} />
          <Route path="/components/diffusion-aggregation" element={<DiffusionAggregationPage />} />
          <Route path="/components/kaleidoscope"         element={<KaleidoscopePage />} />
          <Route path="/components/voronoi-cells"        element={<VoronoiCellsPage />} />
          <Route path="/components/slime-mold"           element={<SlimeMoldPage />} />
          <Route path="/components/watercolor-bloom"     element={<WatercolorBloomPage />} />
          <Route path="/components/pendula-wave"         element={<PendulaWavePage />} />
          <Route path="/components/crystal-growth"       element={<CrystalGrowthPage />} />
          <Route path="/components/neural-web"           element={<NeuralWebPage />} />
          <Route path="/components/metaballs"            element={<MetaballsPage />} />
          <Route path="/components/ant-colony"           element={<AntColonyPage />} />
          <Route path="/components/magnetic-field"       element={<MagneticFieldPage />} />
          <Route path="/components/dragon-cursor"        element={<DragonCursorPage />} />
          <Route path="/components/sakura-blossom"       element={<SakuraBlossomPage />} />
          <Route path="/components/koi-pond"             element={<KoiPondPage />} />
          <Route path="/components/spider-web"          element={<SpiderWebPage />} />
          <Route path="/components/butterfly-swarm"     element={<ButterflySwarmPage />} />
          <Route path="/components/black-hole"           element={<BlackHolePage />} />
          <Route path="/components/galaxy-spiral"        element={<GalaxySpiralPage />} />
          <Route path="/components/tornado-vortex"       element={<TornadoVortexPage />} />
          <Route path="/components/bubble-universe"      element={<BubbleUniversePage />} />
          <Route path="/components/solar-flare"          element={<SolarFlarePage />} />
          <Route path="/components/ivy-growth" element={<IvyGrowthPage />} />
          <Route path="/components/fireflies" element={<FirefliesPage />} />
          <Route path="/components/dandelion" element={<DandelionPage />} />
          <Route path="/components/grass-field" element={<GrassFieldPage />} />
          <Route path="/components/moths" element={<MothsPage />} />
          <Route path="/components/eye" element={<EyePage />} />
          <Route path="/components/owl" element={<OwlPage />} />
          <Route path="/components/octopus" element={<OctopusPage />} />
          <Route path="/components/hummingbird" element={<HummingbirdPage />} />
          <Route path="/components/candle" element={<CandlePage />} />
          <Route path="/components/cat" element={<CatPage />} />
          <Route path="/components/jellyfish" element={<JellyfishPage />} />
          <Route path="/components/snail" element={<SnailPage />} />
          <Route path="/components/sunflowers" element={<SunflowersPage />} />
          <Route path="/components/komorebi" element={<KomorebiPage />} />
          <Route path="/components/tide-pool" element={<TidePoolPage />} />
          <Route path="/components/sunbeam-dust" element={<SunbeamDustPage />} />
          <Route path="/components/paper-lanterns" element={<PaperLanternsPage />} />
          <Route path="/components/kelp-forest" element={<KelpForestPage />} />
          <Route path="/components/snow-drift" element={<SnowDriftPage />} />
          <Route path="/components/origami-cranes" element={<OrigamiCranesPage />} />
          <Route path="/components/seasons-tree" element={<SeasonsTreePage />} />
          <Route path="/components/ink-mountains" element={<InkMountainsPage />} />
          <Route path="/components/window-rain" element={<WindowRainPage />} />
          <Route path="/components/incense-smoke" element={<IncenseSmokePage />} />
          <Route path="/components/moonlit-sea" element={<MoonlitSeaPage />} />
          <Route path="/components/cloud-sea" element={<CloudSeaPage />} />
          <Route path="/components/ferrofluid" element={<FerrofluidPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
