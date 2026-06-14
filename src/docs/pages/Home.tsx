import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ComponentCard } from "../components/ComponentCard";
import { CodeBlock } from "../components/CodeBlock";
import { DragonCursor } from "../../components/DragonCursor";
import { KoiPond } from "../../components/KoiPond";
import { SpiderWeb } from "../../components/SpiderWeb";
import { MatrixRain } from "../../components/MatrixRain";
import { FluidSimulation } from "../../components/FluidSimulation";
import { FlowField } from "../../components/FlowField";
import { Boids } from "../../components/Boids";
import { Confetti } from "../../components/Confetti";
import { AudioVisualizer } from "../../components/AudioVisualizer";
import { Mandala } from "../../components/Mandala";
import { Starfield } from "../../components/Starfield";
import { NoiseGradient } from "../../components/NoiseGradient";
import { Shockwave } from "../../components/Shockwave";
import { Fireworks } from "../../components/Fireworks";
import { Wormhole } from "../../components/Wormhole";
import { BubbleUniverse } from "../../components/BubbleUniverse";
import { SakuraBlossom } from "../../components/SakuraBlossom";
import { ClothSimulation } from "../../components/ClothSimulation";
import { MagneticBlob } from "../../components/MagneticBlob";
import { GameOfLife } from "../../components/GameOfLife";
import { Rain } from "../../components/Rain";
import { Lightning } from "../../components/Lightning";
import { FireEffect } from "../../components/FireEffect";
import { LiveChart } from "../../components/LiveChart";
import { ParticleField } from "../../components/ParticleField";
import { ReactionDiffusion } from "../../components/ReactionDiffusion";
import { AuroraBorealis } from "../../components/AuroraBorealis";
import { Spirograph } from "../../components/Spirograph";
import { SandSimulation } from "../../components/SandSimulation";
import { WaveInterference } from "../../components/WaveInterference";
import { DiffusionAggregation } from "../../components/DiffusionAggregation";
import { Lissajous } from "../../components/Lissajous";
import { LSystem } from "../../components/LSystem";
import { Kaleidoscope } from "../../components/Kaleidoscope";
import { VoronoiCells } from "../../components/VoronoiCells";
import { SlimeMold } from "../../components/SlimeMold";
import { WatercolorBloom } from "../../components/WatercolorBloom";
import { PendulaWave } from "../../components/PendulaWave";
import { CrystalGrowth } from "../../components/CrystalGrowth";
import { NeuralWeb } from "../../components/NeuralWeb";
import { ParticleText } from "../../components/ParticleText";
import { Metaballs } from "../../components/Metaballs";
import { AntColony } from "../../components/AntColony";
import { MagneticField } from "../../components/MagneticField";
import { TerrainMesh } from "../../components/TerrainMesh";
import { BlackHole } from "../../components/BlackHole";
import { GalaxySpiral } from "../../components/GalaxySpiral";
import { TornadoVortex } from "../../components/TornadoVortex";
import { SolarFlare } from "../../components/SolarFlare";
import { LorenzAttractor } from "../../components/LorenzAttractor";
import { ButterflySwarm } from "../../components/ButterflySwarm";
import { WillowTree } from "../../components/WillowTree";

const CSS = `
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px 80px;
}

/* Topbar */
.home-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 32px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 20;
}

.home-topbar-version {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-3);
  letter-spacing: 0.04em;
  font-family: var(--mono);
}

.home-topbar-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
  text-decoration: none;
  padding: 5px 12px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  transition: all 150ms var(--ease);
}
.home-topbar-link:hover { color: var(--text-1); border-color: var(--border-mid); background: var(--bg-subtle); }

/* Hero */
.home-hero {
  padding: 80px 0 64px;
  text-align: center;
}

.home-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid var(--accent-mid);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  max-width: 100%;
}

.home-hero-title {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 750;
  letter-spacing: -0.04em;
  color: #727272ff;
  line-height: 1.1;
  margin-bottom: 20px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.home-hero-title span {
  color: var(--accent);
}

.home-hero-sub {
  font-size: 18px;
  color: var(--text-2);
  line-height: 1.65;
  max-width: 520px;
  margin: 0 auto 36px;
}

.home-hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 44px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 22px;
  border-radius: var(--r);
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 150ms var(--ease), transform 150ms var(--ease), box-shadow 150ms var(--ease);
}
.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.22);
}
.btn-primary:active { transform: scale(0.97); }
.btn-primary:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 22px;
  border-radius: var(--r);
  background: var(--bg);
  color: var(--text-1);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--border);
  transition: all 150ms var(--ease);
}
.btn-secondary:hover { background: var(--bg-subtle); border-color: var(--border-mid); }
.btn-secondary:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.home-install {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.home-install-block {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: var(--r);
  padding: 10px 16px;
  font-family: var(--mono);
  font-size: 14px;
  color: var(--text-1);
}

.home-install-prefix {
  color: var(--text-3);
  user-select: none;
}

/* Stats strip */
.home-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 28px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin: 0 0 64px;
  flex-wrap: wrap;
}

.home-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.home-stat-n {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-1);
}

.home-stat-l {
  font-size: 13px;
  color: var(--text-3);
  font-weight: 450;
}

/* Grid */
.home-grid-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-1);
  margin-bottom: 8px;
}

.home-grid-sub {
  font-size: 15px;
  color: var(--text-2);
  margin-bottom: 32px;
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Footer */
.home-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 80px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-3);
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 600px) {
  .home { padding: 0 16px 60px; }
  .home-topbar { padding: 10px 16px; height: auto; }
  .home-hero { padding: 48px 0 40px; }
  .home-hero-sub { font-size: 16px; }
  .home-install-block { font-size: 13px; padding: 8px 14px; }
  .home-grid { grid-template-columns: 1fr; }
  .home-stats { gap: 20px; }
  .home-footer { flex-direction: column; align-items: flex-start; gap: 4px; }
  .home-hero-eyebrow { font-size: 10px; padding: 4px 10px; gap: 4px; letter-spacing: 0.05em; }
}
`;

const COMPONENTS = [
  { name: "DragonCursor", path: "/components/dragon-cursor", accent: "#ff007f", desc: "Interactive skeleton dragon that follows the cursor and breathes fire", preview: <DragonCursor segmentCount={16} segmentSize={14} backgroundColor="#000000" width="100%" height="100%" /> },
  { name: "KoiPond", path: "/components/koi-pond", accent: "#f97316", desc: "Tranquil pond with swimming koi fish, interactive water ripples, and lilies", preview: <KoiPond fishCount={5} width="100%" height="100%" /> },
  { name: "SpiderWeb", path: "/components/spider-web", accent: "#c8c8c8", desc: "Orb-weaver silk web with spring-physics strands, glowing dew drops, and a cursor-stalking spider", preview: <SpiderWeb spokeCount={10} ringCount={8} width="100%" height="100%" /> },
  { name: "ButterflySwarm", path: "/components/butterfly-swarm", accent: "#f97316", desc: "Flapping butterflies that drift and flock — hover to attract, move fast to scatter", preview: <ButterflySwarm butterflyCount={8} width="100%" height="100%" /> },
  { name: "WillowTree", path: "/components/willow-tree", accent: "#4a7c59", desc: "Generative weeping willow with spring strand physics — move cursor to direct the wind", preview: <WillowTree branchCount={6} strandCount={4} width="100%" height="100%" /> },
  { name: "MatrixRain", path: "/components/matrix-rain", accent: "#00ff41", desc: "Falling digital character rain with trails, speed control, and custom charsets", preview: <MatrixRain fontSize={14} speed={1} width="100%" height="100%" /> },
  { name: "FluidSimulation", path: "/components/fluid-simulation", accent: "#06b6d4", desc: "Navier-Stokes grid fluid simulation reacting dynamically to mouse movement", preview: <FluidSimulation resolution={64} width="100%" height="100%" /> },
  { name: "FlowField", path: "/components/flow-field", accent: "#9ca3af", desc: "Perlin noise-guided particle vector streams with swirling curl noise", preview: <FlowField width="100%" height="100%" /> },
  { name: "Boids", path: "/components/boids", accent: "#f59e0b", desc: "Autonomous flocking simulation demonstrating separation, alignment, and cohesion physics", preview: <Boids width="100%" height="100%" /> },
  { name: "Confetti", path: "/components/confetti", accent: "#ffd700", desc: "Physics-based celebration particle bursts and continuous streams", preview: <Confetti trigger={true} particleCount={60} width="100%" height="100%" /> },
  { name: "AudioVisualizer", path: "/components/audio-visualizer", accent: "#9ca3af", desc: "Real-time frequency and waveform visualizer with multiple modes", preview: <AudioVisualizer mode="bars" width="100%" height="100%" /> },
  { name: "Mandala", path: "/components/mandala", accent: "#f43f5e", desc: "Hypnotic rotational symmetry pattern with configurable layers and noise distortion", preview: <Mandala width="100%" height="100%" /> },
  { name: "Starfield", path: "/components/starfield", accent: "#b8bfff", desc: "Twinkling 2D star field or high-speed 3D warp tunnel with shooting stars", preview: <Starfield starCount={150} width="100%" height="100%" /> },
  { name: "NoiseGradient", path: "/components/noise-gradient", accent: "#38ef7d", desc: "Smoothed multi-color Perlin noise color gradients with adjustable scaling", preview: <NoiseGradient colors={["#111111", "#6b7280", "#ffffff"]} width="100%" height="100%" /> },
  { name: "Shockwave", path: "/components/shockwave", accent: "#9ca3af", desc: "Click-triggered radial shockwave ring expansions with blur and glow", preview: <Shockwave width="100%" height="100%" /> },
  { name: "Fireworks", path: "/components/fireworks", accent: "#f59e0b", desc: "Shell launches exploding into colorful gravity-affected trails", preview: <Fireworks width="100%" height="100%" /> },
  { name: "Wormhole", path: "/components/wormhole", accent: "#9ca3af", desc: "Hypnotic 3D perspective tunnel with rotating ellipse rings and star backgrounds", preview: <Wormhole width="100%" height="100%" /> },
  { name: "BubbleUniverse", path: "/components/bubble-universe", accent: "#67e8f9", desc: "Physics-based bubble system with merge-on-contact and click-to-pop", preview: <BubbleUniverse bubbleCount={12} width="100%" height="100%" /> },
  { name: "SakuraBlossom", path: "/components/sakura-blossom", accent: "#fda4af", desc: "Falling cherry blossom petals with wind drift, gusts, and floor accumulation", preview: <SakuraBlossom petalCount={60} width="100%" height="100%" /> },
  { name: "ClothSimulation", path: "/components/cloth-simulation", accent: "#67e8f9", desc: "Verlet integration spring-mass fabric mesh supporting tearing and wind", preview: <ClothSimulation width="100%" height="100%" /> },
  { name: "MagneticBlob", path: "/components/magnetic-blob", accent: "#a78bfa", desc: "Wandering metaball liquid blobs that merge and attract to mouse", preview: <MagneticBlob width="100%" height="100%" /> },
  { name: "GameOfLife", path: "/components/game-of-life", accent: "#00ff41", desc: "Conway's cellular automata displaying emergent life based on simple rules", preview: <GameOfLife width="100%" height="100%" /> },
  { name: "Rain", path: "/components/rain", accent: "#9ca3af", desc: "Rainfall with wind drift, drop streaks, and splash particles", preview: <Rain width="100%" height="100%" /> },
  { name: "Lightning", path: "/components/lightning", accent: "#c084fc", desc: "Recursive fractal bolts with glow, flicker, and branching paths", preview: <Lightning width="100%" height="100%" /> },
  { name: "FireEffect", path: "/components/fire-effect", accent: "#ff6b35", desc: "Pixel-level cellular automata heat simulation with wind drift and cooling", preview: <FireEffect width="100%" height="100%" /> },
  { name: "LiveChart", path: "/components/live-chart", accent: "#4ade80", desc: "Real-time scrolling multi-series data graph with bezier curves and fill options", preview: <LiveChart width="100%" height="100%" /> },
  { name: "ParticleField", path: "/components/particle-field", accent: "#8888ff", desc: "Twinkling particle network with interactive proximity lines and mouse repulsion", preview: <ParticleField preset="cosmos" particleCount={60} width="100%" height="100%" /> },
  { name: "ReactionDiffusion", path: "/components/reaction-diffusion", accent: "#a3e635", desc: "Gray-Scott model simulating chemical reaction-diffusion and labyrinthine Turing structures", preview: <ReactionDiffusion width="100%" height="100%" /> },
  { name: "AuroraBorealis", path: "/components/aurora-borealis", accent: "#88ccff", desc: "Layered northern light curtain ribbons moving across a starry backdrop", preview: <AuroraBorealis width="100%" height="100%" /> },
  { name: "Spirograph", path: "/components/spirograph", accent: "#f0abfc", desc: "Hypotrochoid geometric curves traced by planetary gear rolling circles", preview: <Spirograph width="100%" height="100%" /> },
  { name: "SandSimulation", path: "/components/sand-simulation", accent: "#fbbf24", desc: "Falling sand cellular automata with sand, water, wall, and fire logic", preview: <SandSimulation width="100%" height="100%" /> },
  { name: "WaveInterference", path: "/components/wave-interference", accent: "#7dd3fc", desc: "Concentric waves radiating from multiple sources forming interference patterns", preview: <WaveInterference width="100%" height="100%" /> },
  { name: "DiffusionAggregation", path: "/components/diffusion-aggregation", accent: "#9ca3af", desc: "Diffusion-limited aggregation showing organic tree-like branch crystallization", preview: <DiffusionAggregation width="100%" height="100%" /> },
  { name: "Lissajous", path: "/components/lissajous", accent: "#67e8f9", desc: "Parametric curves generated by phase-shifting coupled harmonic oscillators", preview: <Lissajous width="100%" height="100%" /> },
  { name: "LSystem", path: "/components/l-system", accent: "#86efac", desc: "Lindenmayer system grammar tree rendering fractal ferns and plants", preview: <LSystem width="100%" height="100%" /> },
  { name: "Kaleidoscope", path: "/components/kaleidoscope", accent: "#c084fc", desc: "Reflective mirror wedge kaleidoscope morphing with noise-sampled color cycles", preview: <Kaleidoscope width="100%" height="100%" /> },
  { name: "VoronoiCells", path: "/components/voronoi-cells", accent: "#94a3b8", desc: "Dynamic Voronoi tessellation diagram with moving cell seeds and distance shading", preview: <VoronoiCells width="100%" height="100%" /> },
  { name: "SlimeMold", path: "/components/slime-mold", accent: "#86efac", desc: "Physarum polycephalum biological mould trail simulation spreading on grid", preview: <SlimeMold width="100%" height="100%" /> },
  { name: "WatercolorBloom", path: "/components/watercolor-bloom", accent: "#ec4899", desc: "Spreading concentric watercolor rings with wet-edge shading and noise borders", preview: <WatercolorBloom bloomRadius={60} width="100%" height="100%" /> },
  { name: "PendulaWave", path: "/components/pendula-wave", accent: "#6366f1", desc: "Harmonograph using coupled pendulums to trace rotating parametric curves", preview: <PendulaWave width="100%" height="100%" /> },
  { name: "CrystalGrowth", path: "/components/crystal-growth", accent: "#38bdf8", desc: "BFS frontier crystal growth simulation with user-defined rotational symmetry", preview: <CrystalGrowth growthSpeed={2} width="100%" height="100%" /> },
  { name: "NeuralWeb", path: "/components/neural-web", accent: "#10b981", desc: "Interconnected neural nodes firing signal pulses that propagate along edges", preview: <NeuralWeb nodeCount={30} width="100%" height="100%" /> },
  { name: "ParticleText", path: "/components/particle-text", accent: "#f43f5e", desc: "Spring-connected particles forming custom letterforms that scatter on hover", preview: <ParticleText text="CANVAS" fontSize={90} width="100%" height="100%" /> },
  { name: "Metaballs", path: "/components/metaballs", accent: "#a855f7", desc: "Implicit surface liquid metaballs melting and splitting organically", preview: <Metaballs blobCount={4} width="100%" height="100%" /> },
  { name: "AntColony", path: "/components/ant-colony", accent: "#d97706", desc: "Ant colony pathfinder optimizing food trails with pheromone evaporation", preview: <AntColony antCount={100} width="100%" height="100%" /> },
  { name: "MagneticField", path: "/components/magnetic-field", accent: "#ef4444", desc: "Euler integration tracer visualising forces around movable magnetic dipoles", preview: <MagneticField fieldLineCount={12} width="100%" height="100%" /> },
  { name: "TerrainMesh", path: "/components/terrain-mesh", accent: "#14b8a6", desc: "3D wireframe mountains rendering Perlin noise displacement with height coloring", preview: <TerrainMesh width="100%" height="100%" /> },
  { name: "BlackHole", path: "/components/black-hole", accent: "#f43f5e", desc: "Gravitational lensing and accretion disk simulation around event horizon", preview: <BlackHole eventHorizonRadius={25} width="100%" height="100%" /> },
  { name: "GalaxySpiral", path: "/components/galaxy-spiral", accent: "#818cf8", desc: "Spiral galaxy with depth-sorted stellar particles and logarithmic arm math", preview: <GalaxySpiral armCount={2} starCount={1500} width="100%" height="100%" /> },
  { name: "TornadoVortex", path: "/components/tornado-vortex", accent: "#6b7280", desc: "Winding funnel vortex of debris particles with random internal lightning", preview: <TornadoVortex particleCount={400} width="100%" height="100%" /> },
  { name: "SolarFlare", path: "/components/solar-flare", accent: "#f97316", desc: "Glow-enhanced solar mass with convection cells and arcing flare loops", preview: <SolarFlare sunRadius={0.3} width="100%" height="100%" /> },
  { name: "LorenzAttractor", path: "/components/lorenz-attractor", accent: "#00ffcc", desc: "Chaotic strange attractor integrated with RK4, projected into 3D with mouse-drag orbit", preview: <LorenzAttractor preset="neon" width="100%" height="100%" /> },
];


const INSTALL_CMD = "npm install own-the-canvas";

export function Home() {
  return (
    <>
      <Helmet>
        <title>Own The Canvas — React Canvas Component Library</title>
        <meta name="description" content="50+ beautiful, responsive canvas-based React components. MatrixRain, FluidSimulation, Boids, Fireworks, and more. Zero dependencies, TypeScript, MIT license." />
      </Helmet>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="home-topbar">
        <span className="home-topbar-version">v1.0.9</span>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href="https://github.com/jabid-19/own-the-canvas"
            className="home-topbar-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/own-the-canvas"
            className="home-topbar-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.331h-2.669zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
            </svg>
            npm
          </a>
        </div>
      </div>

      <div className="home">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-eyebrow">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <circle cx="6" cy="6" r="5" />
            </svg>
            50+ components · Zero dependencies · TypeScript
          </div>
          <h1 className="home-hero-title">
            Canvas arts <span>for React</span>
          </h1>
          <p className="home-hero-sub">
            Beautiful, responsive, fully customizable canvas-based visual components.
            Drop them in anywhere — no canvas knowledge required.
          </p>

          <div className="home-hero-actions">
            <Link to="/overview" className="btn-primary">
              Get Started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/playground" className="btn-secondary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <polygon points="2,1 13,7 2,13" fill="currentColor" opacity="0.8" />
              </svg>
              View Playground
            </Link>
          </div>

          <div className="home-install">
            <div className="home-install-block" aria-label={`Install command: ${INSTALL_CMD}`}>
              <span className="home-install-prefix">$</span>
              <span>{INSTALL_CMD}</span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="home-stats" role="list" aria-label="Library stats">
          {[
            { n: "50+", l: "Components" },
            { n: "0", l: "Dependencies" },
            { n: "TS", l: "TypeScript" },
            { n: "MIT", l: "License" },
          ].map((s) => (
            <div key={s.l} className="home-stat" role="listitem">
              <span className="home-stat-n">{s.n}</span>
              <span className="home-stat-l">{s.l}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <section aria-labelledby="components-heading">
          <h2 className="home-grid-title" id="components-heading">Components</h2>
          <p className="home-grid-sub">Click any component to see the full documentation and live props playground.</p>
          <div className="home-grid">
            {COMPONENTS.map((c) => (
              <ComponentCard
                key={c.name}
                name={c.name}
                description={c.desc}
                path={c.path}
                accent={c.accent}
                preview={c.preview}
              />
            ))}
          </div>
        </section>

        {/* Quick install section */}
        <section aria-labelledby="install-heading" style={{ marginTop: 80 }}>
          <h2 className="home-grid-title" id="install-heading">Quick install</h2>
          <p className="home-grid-sub" style={{ marginBottom: 20 }}>Install from npm and start using immediately.</p>
          <CodeBlock code={INSTALL_CMD} language="bash" />
          <div style={{ marginTop: 16 }}>
            <CodeBlock
              code={`import { MatrixRain } from 'own-the-canvas';

export default function App() {
  return <MatrixRain width="100%" height="100%" />;
}`}
              language="tsx"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          <span>own-the-canvas · MIT License</span>
          <span>v1.0.9</span>
        </footer>
      </div>
    </>
  );
}
