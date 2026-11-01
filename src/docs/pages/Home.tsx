import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ComponentCard } from "../components/ComponentCard";
import { CodeBlock } from "../components/CodeBlock";
import { PaperScene } from "../components/PaperScene";
import { DragonCursor } from "../../components/DragonCursor";
import { KoiPond } from "../../components/KoiPond";
import { SpiderWeb } from "../../components/SpiderWeb";
import { MatrixRain } from "../../components/MatrixRain";
import { FluidSimulation } from "../../components/FluidSimulation";
import { FlowField } from "../../components/FlowField";
import { Boids } from "../../components/Boids";
import { Confetti } from "../../components/Confetti";
import { Mandala } from "../../components/Mandala";
import { Starfield } from "../../components/Starfield";
import { NoiseGradient } from "../../components/NoiseGradient";
import { Fireworks } from "../../components/Fireworks";
import { BubbleUniverse } from "../../components/BubbleUniverse";
import { SakuraBlossom } from "../../components/SakuraBlossom";
import { IvyGrowth } from "../../components/IvyGrowth";
import { Fireflies } from "../../components/Fireflies";
import { Dandelion } from "../../components/Dandelion";
import { GrassField } from "../../components/GrassField";
import { Moths } from "../../components/Moths";
import { SunbeamDust } from "../../components/SunbeamDust";
import { PaperLanterns } from "../../components/PaperLanterns";
import { KelpForest } from "../../components/KelpForest";
import { SnowDrift } from "../../components/SnowDrift";
import { FrostGlass } from "../../components/FrostGlass";
import { OrigamiCranes } from "../../components/OrigamiCranes";
import { SeasonsTree } from "../../components/SeasonsTree";
import { InkMountains } from "../../components/InkMountains";
import { WindowRain } from "../../components/WindowRain";
import { IncenseSmoke } from "../../components/IncenseSmoke";
import { MoonlitSea } from "../../components/MoonlitSea";
import { CloudSea } from "../../components/CloudSea";
import { Ferrofluid } from "../../components/Ferrofluid";
import { GameOfLife } from "../../components/GameOfLife";
import { Rain } from "../../components/Rain";
import { Lightning } from "../../components/Lightning";
import { FireEffect } from "../../components/FireEffect";
import { ParticleField } from "../../components/ParticleField";
import { ReactionDiffusion } from "../../components/ReactionDiffusion";
import { AuroraBorealis } from "../../components/AuroraBorealis";
import { Spirograph } from "../../components/Spirograph";
import { SandSimulation } from "../../components/SandSimulation";
import { WaveInterference } from "../../components/WaveInterference";
import { DiffusionAggregation } from "../../components/DiffusionAggregation";
import { LSystem } from "../../components/LSystem";
import { Kaleidoscope } from "../../components/Kaleidoscope";
import { VoronoiCells } from "../../components/VoronoiCells";
import { SlimeMold } from "../../components/SlimeMold";
import { WatercolorBloom } from "../../components/WatercolorBloom";
import { PendulaWave } from "../../components/PendulaWave";
import { CrystalGrowth } from "../../components/CrystalGrowth";
import { NeuralWeb } from "../../components/NeuralWeb";
import { Metaballs } from "../../components/Metaballs";
import { AntColony } from "../../components/AntColony";
import { MagneticField } from "../../components/MagneticField";
import { BlackHole } from "../../components/BlackHole";
import { GalaxySpiral } from "../../components/GalaxySpiral";
import { TornadoVortex } from "../../components/TornadoVortex";
import { SolarFlare } from "../../components/SolarFlare";
import { ButterflySwarm } from "../../components/ButterflySwarm";
import { DeepSeaBioluminescence } from "../../components/DeepSeaBioluminescence";

const CSS = `
.home {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 36px 80px;
}

/* Topbar: a cream strip with a mustard edge */
.home-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 36px;
  position: sticky;
  top: 0;
  background: var(--grain), var(--bg);
  box-shadow: 0 3px 0 var(--mustard), 0 6px 0 rgba(var(--shadow-ink), .14), 0 10px 14px -6px rgba(var(--shadow-ink), .3);
  z-index: 20;
}

.home-topbar-version {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: 0.06em;
  font-family: var(--mono);
  background: var(--blush);
  padding: 3px 12px 3px 9px;
  clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 50%, 100% 100%, 0 100%);
}

.home-topbar-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-1);
  text-decoration: none;
  padding: 6px 14px;
  background: var(--bg-subtle);
  border-radius: 3px;
  box-shadow: 0 2px 0 var(--border-mid), 0 4px 6px -2px rgba(var(--shadow-ink), .25);
  transition: transform 150ms var(--ease), box-shadow 150ms var(--ease), background 150ms var(--ease);
}
.home-topbar-link:hover { background: var(--mustard); transform: translateY(-1px); }
.home-topbar-link:active { transform: translateY(2px); box-shadow: none; }

/* Hero */
.home-hero {
  position: relative;
  padding: 72px 0 44px;
  text-align: center;
}

.home-hero-eyebrow {
  display: inline-block;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-1);
  padding: 7px 22px;
  margin-bottom: 30px;
  background: repeating-linear-gradient(-45deg, rgba(143,191,159,.95) 0 8px, rgba(165,205,178,.95) 8px 16px);
  clip-path: polygon(0 0, 100% 0, calc(100% - 7px) 25%, 100% 50%, calc(100% - 7px) 75%, 100% 100%, 0 100%, 7px 75%, 0 50%, 7px 25%);
  transform: rotate(-1.6deg);
  max-width: 100%;
}

.home-hero-title {
  font-family: var(--font-display);
  font-size: clamp(46px, 8vw, 92px);
  font-weight: 800;
  font-variation-settings: "opsz" 144;
  letter-spacing: -0.03em;
  color: var(--text-1);
  line-height: 1.02;
  margin: 0 auto 26px;
  max-width: 860px;
}
/* "Canvas arts" is painted on with one fat stroke */
.home-hero-brush {
  display: inline-block;
  padding: 0 .1em;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 60' preserveAspectRatio='none'%3E%3Cpath d='M4 40 C60 14 130 46 200 28 C270 12 340 40 396 18 L390 50 C330 60 270 36 200 52 C130 62 60 42 8 56Z' fill='%23f2b5a6' fill-opacity='.85'/%3E%3C/svg%3E") left bottom / 100% 48% no-repeat;
}

/* "for React" is its own strip of terracotta paper, glued on at a tilt */
.home-hero-strip {
  display: inline-block;
  position: relative;
  padding: 0 .22em .06em;
  margin-top: .06em;
  color: #fff8ec;
  text-shadow: none;
  background: var(--grain), var(--accent);
  transform: rotate(-2.2deg);
  box-shadow: .06em .07em 0 var(--accent-deep), .12em .16em 0 rgba(var(--shadow-ink), .22), .1em .3em .4em -.1em rgba(var(--shadow-ink), .4);
  clip-path: polygon(0 3%, 99% 0, 100% 97%, 1% 100%);
}

.home-hero-sub {
  font-size: 19px;
  color: var(--text-2);
  line-height: 1.6;
  max-width: 540px;
  margin: 0 auto 36px;
}

.home-hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 34px;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 12px 26px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 160ms var(--ease), box-shadow 160ms var(--ease), background 160ms var(--ease);
}
.btn-primary {
  background: var(--grain), var(--accent);
  color: #fff;
  box-shadow: 0 4px 0 var(--accent-deep), 0 8px 0 rgba(var(--shadow-ink), .18), 0 14px 16px -6px rgba(var(--shadow-ink), .35);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 0 var(--accent-deep), 0 11px 0 rgba(var(--shadow-ink), .16), 0 18px 20px -6px rgba(var(--shadow-ink), .35); }
.btn-primary:active { transform: translateY(4px); box-shadow: 0 0 0 var(--accent-deep), 0 2px 4px rgba(var(--shadow-ink), .35); }
.btn-secondary {
  background: var(--grain), var(--bg);
  color: var(--text-1);
  box-shadow: 0 4px 0 var(--border-mid), 0 8px 0 rgba(var(--shadow-ink), .12), 0 14px 16px -6px rgba(var(--shadow-ink), .28);
}
.btn-secondary:hover { transform: translateY(-2px); background: #fff; }
.btn-secondary:active { transform: translateY(4px); box-shadow: 0 0 0 var(--border-mid), 0 2px 4px rgba(var(--shadow-ink), .3); }

/* Install command: a ticket with half-circle punches in its ends */
.home-install {
  display: flex;
  justify-content: center;
  filter: drop-shadow(0 2px 0 rgba(var(--shadow-ink), .25)) drop-shadow(0 8px 7px rgba(var(--shadow-ink), .2));
}
.home-install-block {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--grain), var(--bg);
  padding: 13px 34px;
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 500;
  color: var(--text-1);
  -webkit-mask: radial-gradient(circle at 0 50%, #0000 9px, #000 9.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, #0000 9px, #000 9.5px) right / 51% 100% no-repeat;
          mask: radial-gradient(circle at 0 50%, #0000 9px, #000 9.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, #0000 9px, #000 9.5px) right / 51% 100% no-repeat;
}
.home-install-prefix { color: var(--accent); font-weight: 700; user-select: none; }

/* Diorama: layered paper hills with a live canvas punched through them */
.home-diorama-wrap {
  position: relative;
  margin: 12px 0 56px;
}
.home-diorama-wrap::before {
  content: "";
  position: absolute;
  inset: 10px 8px 0;
  box-shadow: 0 3px 2px rgba(var(--shadow-ink), .22), 0 16px 28px -6px rgba(var(--shadow-ink), .32), 0 36px 60px -22px rgba(var(--shadow-ink), .3);
}
.home-diorama-wrap::after {
  content: "";
  position: absolute;
  inset: 12px -9px -9px 10px;
  background: var(--grain), var(--mustard);
  clip-path: var(--cut-sheet);
  transform: rotate(.4deg);
}
.home-diorama {
  position: relative;
  z-index: 1;
  height: 400px;
  background: var(--grain), #f3dcb6;
  clip-path: var(--cut-sheet);
  overflow: hidden;
}
.home-diorama-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.home-window {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 54px;
  width: min(78%, 660px);
  height: 240px;
  transform: translateX(-50%) rotate(-.5deg);
  background: #17110c;
  border-radius: 3px;
  overflow: hidden;
  box-shadow:
    0 0 0 9px #f4ecd8,
    0 0 0 10px rgba(43,33,24,.5),
    0 0 0 12px #d8a959,
    0 0 0 13px #8a5a1d,
    0 0 0 23px #8c5a2e,
    0 0 0 24px #4b2d14,
    0 16px 24px 20px rgba(var(--shadow-ink), .3);
}
.home-window::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 7px 12px rgba(0,0,0,.55), inset 6px 0 10px -4px rgba(0,0,0,.4);
}

/* Stats as hang tags */
.home-stats {
  display: flex;
  justify-content: center;
  gap: 26px;
  margin: 0 0 76px;
  flex-wrap: wrap;
  filter: drop-shadow(0 2px 0 rgba(var(--shadow-ink), .22)) drop-shadow(0 9px 7px rgba(var(--shadow-ink), .2));
}
.home-stat {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 138px;
  padding: 34px 10px 16px;
  clip-path: polygon(20% 0, 80% 0, 100% 16%, 100% 100%, 0 100%, 0 16%);
  background: var(--grain), var(--mustard);
}
.home-stat:nth-child(2) { background: var(--grain), var(--sage); transform: rotate(2deg) translateY(6px); }
.home-stat:nth-child(3) { background: var(--grain), var(--blush); transform: rotate(-1.6deg); }
.home-stat:nth-child(4) { background: var(--grain), #9fc9d3; transform: rotate(2.4deg) translateY(4px); }
.home-stat:nth-child(1) { transform: rotate(-2.6deg) translateY(2px); }
.home-stat::before {
  content: "";
  position: absolute;
  top: 10px;
  left: 50%;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  border-radius: 50%;
  background: var(--desk);
  box-shadow: inset 0 2px 3px rgba(var(--shadow-ink), .5);
}

.home-stat-n {
  font-family: var(--font-display);
  font-size: 38px;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-1);
}
.home-stat-l {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--text-1);
}

/* Grid */
.home-grid-title {
  font-family: var(--font-display);
  font-size: clamp(34px, 5vw, 46px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-1);
  margin-bottom: 10px;
  display: inline-block;
  background: linear-gradient(transparent 62%, rgba(242,177,52,.8) 62% 92%, transparent 92%);
  padding: 0 6px;
  margin-left: -6px;
}

.home-grid-sub {
  font-size: 16.5px;
  color: var(--text-2);
  margin-bottom: 46px;
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 52px 40px;
  padding: 0 14px 18px 0;
}

/* Quick install lives on its own sheet */
.home-sheet-wrap {
  margin-top: 90px;
  filter: drop-shadow(0 2px 1px rgba(var(--shadow-ink), .25)) drop-shadow(0 14px 16px rgba(var(--shadow-ink), .22));
}
.home-sheet {
  background: var(--grain), var(--bg);
  clip-path: var(--cut-sheet);
  padding: 44px 44px 48px;
}
.home-sheet .home-grid-sub { margin-bottom: 22px; }

/* Footer */
.home-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 80px;
  padding-top: 26px;
  background: repeating-linear-gradient(90deg, var(--border-mid) 0 9px, transparent 9px 16px) top / 100% 3px no-repeat;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-2);
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .home { padding: 0 16px 60px; }
  .home-topbar { padding: 8px 14px; }
  .home-hero { padding: 44px 0 32px; }
  .home-hero-sub { font-size: 17px; }
  .home-install-block { font-size: 13px; padding: 11px 26px; }
  .home-diorama { height: 330px; }
  .home-window { top: 44px; height: 190px; width: 78%; }
  .home-grid { grid-template-columns: 1fr; padding-right: 12px; }
  .home-stats { gap: 16px; }
  .home-stat { width: 128px; }
  .home-sheet { padding: 30px 20px 34px; }
  .home-footer { flex-direction: column; align-items: flex-start; gap: 4px; }
  .home-hero-eyebrow { font-size: 10px; padding: 6px 16px; letter-spacing: 0.06em; }
}
`;

const COMPONENTS = [
  {
    name: "DragonCursor",
    path: "/components/dragon-cursor",
    accent: "#ff007f",
    desc: "Scaled, winged dragon that follows the cursor and breathes fire",
    preview: (
      <DragonCursor
        segmentCount={16}
        segmentSize={14}
        backgroundColor="#000000"
        width="100%"
        height="100%"
      />
    ),
  },
  {
    name: "KoiPond",
    path: "/components/koi-pond",
    accent: "#f97316",
    desc: "Tranquil pond with swimming koi fish, interactive water ripples, and lilies",
    preview: <KoiPond fishCount={5} width="100%" height="100%" />,
  },
  {
    name: "IvyGrowth",
    path: "/components/ivy-growth",
    accent: "#5f9e3a",
    desc: "Ivy that grows in real time, climbing the edges of your page's elements",
    preview: <IvyGrowth preset="english-ivy" loop growthSpeed={2} width="100%" height="100%" />,
  },
  {
    name: "Fireflies",
    path: "/components/fireflies",
    accent: "#d9f99d",
    desc: "Fireflies whose flashing slowly falls into sync, perching on page elements",
    preview: <Fireflies preset="summer" count={40} width="100%" height="100%" />,
  },
  {
    name: "Dandelion",
    path: "/components/dandelion",
    accent: "#dbeafe",
    desc: "Dandelion clocks you blow apart with the cursor; seeds parachute on the wind",
    preview: <Dandelion preset="moonlit" headCount={2} width="100%" height="100%" />,
  },
  {
    name: "GrassField",
    path: "/components/grass-field",
    accent: "#8fd16a",
    desc: "Wind-swept grass on springs that parts as the cursor moves through it",
    preview: <GrassField preset="meadow" width="100%" height="100%" />,
  },
  {
    name: "Moths",
    path: "/components/moths",
    accent: "#ffd27a",
    desc: "Moths spiraling a lamp by transverse orientation; your cursor is the light",
    preview: <Moths preset="porch-lamp" count={18} width="100%" height="100%" />,
  },
  {
    name: "SunbeamDust",
    path: "/components/sunbeam-dust",
    accent: "#ffcf87",
    desc: "Window light shafts where dust only glitters inside the beams",
    preview: <SunbeamDust preset="golden-hour" width="100%" height="100%" />,
  },
  {
    name: "PaperLanterns",
    path: "/components/paper-lanterns",
    accent: "#ff8a3d",
    desc: "Sky lanterns rising with depth and flicker; tap a button to release one",
    preview: <PaperLanterns preset="festival" count={14} width="100%" height="100%" />,
  },
  {
    name: "KelpForest",
    path: "/components/kelp-forest",
    accent: "#2fa36b",
    desc: "Swaying kelp, schooling fish, and surface light; the cursor pushes the water",
    preview: <KelpForest preset="pacific" kelpCount={7} fishCount={10} width="100%" height="100%" />,
  },
  {
    name: "SnowDrift",
    path: "/components/snow-drift",
    accent: "#e2e8f0",
    desc: "Snow that piles up on your headline and buttons, then slides off the edges",
    preview: <SnowDrift preset="winter-night" width="100%" height="100%" />,
  },
  {
    name: "FrostGlass",
    path: "/components/frost-glass",
    accent: "#a5f3fc",
    desc: "Ice crystals creep across the glass; your cursor is warm breath that melts them",
    preview: <FrostGlass preset="winter-window" growthSpeed={2.5} width="100%" height="100%" />,
  },
  {
    name: "OrigamiCranes",
    path: "/components/origami-cranes",
    accent: "#ef4444",
    desc: "Faceted paper cranes in 3D that bank, flap, and land on your elements",
    preview: <OrigamiCranes preset="senbazuru" count={10} width="100%" height="100%" />,
  },
  {
    name: "SeasonsTree",
    path: "/components/seasons-tree",
    accent: "#ffb7c5",
    desc: "A swaying tree living through spring, summer, autumn, and winter",
    preview: <SeasonsTree preset="japanese" cycleSeconds={24} width="100%" height="100%" />,
  },
  {
    name: "InkMountains",
    path: "/components/ink-mountains",
    accent: "#b91c1c",
    desc: "Ink-wash ridgelines dissolving into drifting mist, with parallax",
    preview: <InkMountains preset="sumi" width="100%" height="100%" />,
  },
  {
    name: "WindowRain",
    path: "/components/window-rain",
    accent: "#fbbf24",
    desc: "Rain running down a fogged window over blurred city lights",
    preview: <WindowRain preset="city-night" width="100%" height="100%" />,
  },
  {
    name: "IncenseSmoke",
    path: "/components/incense-smoke",
    accent: "#ff6a2b",
    desc: "A thread of incense smoke that breaks into curls as it rises",
    preview: <IncenseSmoke preset="temple" width="100%" height="100%" />,
  },
  {
    name: "MoonlitSea",
    path: "/components/moonlit-sea",
    accent: "#f8fafc",
    desc: "Night swells with a glittering moon path and cursor ripples",
    preview: <MoonlitSea preset="midnight" width="100%" height="100%" />,
  },
  {
    name: "CloudSea",
    path: "/components/cloud-sea",
    accent: "#fb923c",
    desc: "A sunset cloud deck seen from above that parts under the cursor",
    preview: <CloudSea preset="sunset" width="100%" height="100%" />,
  },
  {
    name: "Ferrofluid",
    path: "/components/ferrofluid",
    accent: "#a3a3a3",
    desc: "Glossy ferrofluid that spikes toward your cursor like a magnet",
    preview: <Ferrofluid preset="studio" width="100%" height="100%" />,
  },
  {
    name: "ButterflySwarm",
    path: "/components/butterfly-swarm",
    accent: "#f97316",
    desc: "Flapping butterflies that drift and flock — hover to attract, move fast to scatter",
    preview: <ButterflySwarm butterflyCount={8} width="100%" height="100%" />,
  },
  {
    name: "DeepSeaBioluminescence",
    path: "/components/deep-sea-bioluminescence",
    accent: "#00ffcc",
    desc: "Dark ocean environment with pulsing jellyfish, bioluminescent plankton, and cursor-triggered glow ripples",
    preview: (
      <DeepSeaBioluminescence
        jellyfishCount={3}
        planktonCount={120}
        width="100%"
        height="100%"
      />
    ),
  },
  {
    name: "MatrixRain",
    path: "/components/matrix-rain",
    accent: "#00ff41",
    desc: "Falling digital character rain with trails, speed control, and custom charsets",
    preview: <MatrixRain fontSize={14} speed={1} width="100%" height="100%" />,
  },
  {
    name: "FluidSimulation",
    path: "/components/fluid-simulation",
    accent: "#06b6d4",
    desc: "Navier-Stokes grid fluid simulation reacting dynamically to mouse movement",
    preview: <FluidSimulation resolution={64} width="100%" height="100%" />,
  },
  {
    name: "FlowField",
    path: "/components/flow-field",
    accent: "#06b6d4",
    desc: "Perlin noise-guided particle vector streams with swirling curl noise",
    preview: <FlowField width="100%" height="100%" />,
  },
  {
    name: "Boids",
    path: "/components/boids",
    accent: "#f59e0b",
    desc: "Autonomous flocking simulation demonstrating separation, alignment, and cohesion physics",
    preview: <Boids width="100%" height="100%" />,
  },
  {
    name: "SpiderWeb",
    path: "/components/spider-web",
    accent: "#8899cc",
    desc: "Orb-weaver silk web with spring-physics strands, glowing dew drops, and a cursor-stalking spider",
    preview: (
      <SpiderWeb spokeCount={10} ringCount={8} width="100%" height="100%" />
    ),
  },
  {
    name: "Confetti",
    path: "/components/confetti",
    accent: "#ffd700",
    desc: "Physics-based celebration particle bursts and continuous streams",
    preview: (
      <Confetti trigger={true} particleCount={60} width="100%" height="100%" />
    ),
  },
  {
    name: "Mandala",
    path: "/components/mandala",
    accent: "#f43f5e",
    desc: "Hypnotic rotational symmetry pattern with configurable layers and noise distortion",
    preview: <Mandala width="100%" height="100%" />,
  },
  {
    name: "Starfield",
    path: "/components/starfield",
    accent: "#b8bfff",
    desc: "Twinkling 2D star field or high-speed 3D warp tunnel with shooting stars",
    preview: <Starfield starCount={150} width="100%" height="100%" />,
  },
  {
    name: "NoiseGradient",
    path: "/components/noise-gradient",
    accent: "#38ef7d",
    desc: "Smoothed multi-color Perlin noise color gradients with adjustable scaling",
    preview: (
      <NoiseGradient
        width="100%"
        height="100%"
      />
    ),
  },
  {
    name: "Fireworks",
    path: "/components/fireworks",
    accent: "#f59e0b",
    desc: "Six shell types bursting over a city skyline",
    preview: <Fireworks width="100%" height="100%" />,
  },
  {
    name: "BubbleUniverse",
    path: "/components/bubble-universe",
    accent: "#67e8f9",
    desc: "Rainbow soap bubbles drifting up, merging and popping",
    preview: <BubbleUniverse bubbleCount={12} width="100%" height="100%" />,
  },
  {
    name: "SakuraBlossom",
    path: "/components/sakura-blossom",
    accent: "#fda4af",
    desc: "Falling cherry blossom petals with wind drift, gusts, and floor accumulation",
    preview: <SakuraBlossom petalCount={60} width="100%" height="100%" />,
  },
  {
    name: "GameOfLife",
    path: "/components/game-of-life",
    accent: "#00ff41",
    desc: "Conway's cellular automata displaying emergent life based on simple rules",
    preview: <GameOfLife width="100%" height="100%" />,
  },
  {
    name: "Rain",
    path: "/components/rain",
    accent: "#94a3b8",
    desc: "Rainy night street with mist, lamps and wet reflections",
    preview: <Rain width="100%" height="100%" />,
  },
  {
    name: "Lightning",
    path: "/components/lightning",
    accent: "#c084fc",
    desc: "Recursive fractal bolts with glow, flicker, and branching paths",
    preview: <Lightning width="100%" height="100%" />,
  },
  {
    name: "FireEffect",
    path: "/components/fire-effect",
    accent: "#ff6b35",
    desc: "Licking flame tongues with a soft glow and sparks, bending in the wind",
    preview: <FireEffect width="100%" height="100%" />,
  },
  {
    name: "ParticleField",
    path: "/components/particle-field",
    accent: "#8888ff",
    desc: "Twinkling particle network with interactive proximity lines and mouse repulsion",
    preview: (
      <ParticleField
        preset="cosmos"
        particleCount={60}
        width="100%"
        height="100%"
      />
    ),
  },
  {
    name: "ReactionDiffusion",
    path: "/components/reaction-diffusion",
    accent: "#a3e635",
    desc: "Gray-Scott model simulating chemical reaction-diffusion and labyrinthine Turing structures",
    preview: <ReactionDiffusion width="100%" height="100%" />,
  },
  {
    name: "AuroraBorealis",
    path: "/components/aurora-borealis",
    accent: "#88ccff",
    desc: "Layered northern light curtain ribbons moving across a starry backdrop",
    preview: <AuroraBorealis width="100%" height="100%" />,
  },
  {
    name: "Spirograph",
    path: "/components/spirograph",
    accent: "#f0abfc",
    desc: "Hypotrochoid geometric curves traced by planetary gear rolling circles",
    preview: <Spirograph width="100%" height="100%" />,
  },
  {
    name: "SandSimulation",
    path: "/components/sand-simulation",
    accent: "#fbbf24",
    desc: "Self-pouring sand art: banded dunes, plus water, fire and walls to paint",
    preview: <SandSimulation width="100%" height="100%" />,
  },
  {
    name: "WaveInterference",
    path: "/components/wave-interference",
    accent: "#7dd3fc",
    desc: "Concentric waves radiating from multiple sources forming interference patterns",
    preview: <WaveInterference width="100%" height="100%" />,
  },
  {
    name: "DiffusionAggregation",
    path: "/components/diffusion-aggregation",
    accent: "#ff7043",
    desc: "Diffusion-limited aggregation showing organic tree-like branch crystallization",
    preview: <DiffusionAggregation width="100%" height="100%" />,
  },
  {
    name: "LSystem",
    path: "/components/l-system",
    accent: "#86efac",
    desc: "Lindenmayer system grammar tree rendering fractal ferns and plants",
    preview: <LSystem width="100%" height="100%" />,
  },
  {
    name: "Kaleidoscope",
    path: "/components/kaleidoscope",
    accent: "#c084fc",
    desc: "Coloured glass shards and beads mirrored into an ever-changing rosette",
    preview: <Kaleidoscope width="100%" height="100%" />,
  },
  {
    name: "VoronoiCells",
    path: "/components/voronoi-cells",
    accent: "#94a3b8",
    desc: "Dynamic Voronoi tessellation diagram with moving cell seeds and distance shading",
    preview: <VoronoiCells width="100%" height="100%" />,
  },
  {
    name: "SlimeMold",
    path: "/components/slime-mold",
    accent: "#86efac",
    desc: "Physarum polycephalum biological mould trail simulation spreading on grid",
    preview: <SlimeMold width="100%" height="100%" />,
  },
  {
    name: "WatercolorBloom",
    path: "/components/watercolor-bloom",
    accent: "#ec4899",
    desc: "Spreading concentric watercolor rings with wet-edge shading and noise borders",
    preview: <WatercolorBloom bloomRadius={60} width="100%" height="100%" />,
  },
  {
    name: "PendulaWave",
    path: "/components/pendula-wave",
    accent: "#6366f1",
    desc: "Harmonograph using coupled pendulums to trace rotating parametric curves",
    preview: <PendulaWave width="100%" height="100%" />,
  },
  {
    name: "CrystalGrowth",
    path: "/components/crystal-growth",
    accent: "#38bdf8",
    desc: "Snowflakes that grow faceted, glowing ice arms, then melt and regrow",
    preview: <CrystalGrowth growthSpeed={2} width="100%" height="100%" />,
  },
  {
    name: "NeuralWeb",
    path: "/components/neural-web",
    accent: "#10b981",
    desc: "Interconnected neural nodes firing signal pulses that propagate along edges",
    preview: <NeuralWeb nodeCount={30} width="100%" height="100%" />,
  },
  {
    name: "Metaballs",
    path: "/components/metaballs",
    accent: "#a855f7",
    desc: "Glossy lava-lamp blobs that rise, sink and merge",
    preview: <Metaballs blobCount={4} width="100%" height="100%" />,
  },
  {
    name: "AntColony",
    path: "/components/ant-colony",
    accent: "#d97706",
    desc: "Ant colony pathfinder optimizing food trails with pheromone evaporation",
    preview: <AntColony antCount={100} width="100%" height="100%" />,
  },
  {
    name: "MagneticField",
    path: "/components/magnetic-field",
    accent: "#ef4444",
    desc: "Euler integration tracer visualising forces around movable magnetic dipoles",
    preview: <MagneticField fieldLineCount={12} width="100%" height="100%" />,
  },
  {
    name: "BlackHole",
    path: "/components/black-hole",
    accent: "#f43f5e",
    desc: "Gravitational lensing and accretion disk simulation around event horizon",
    preview: <BlackHole eventHorizonRadius={25} width="100%" height="100%" />,
  },
  {
    name: "GalaxySpiral",
    path: "/components/galaxy-spiral",
    accent: "#818cf8",
    desc: "Spiral galaxy with depth-sorted stellar particles and logarithmic arm math",
    preview: (
      <GalaxySpiral armCount={2} starCount={1500} width="100%" height="100%" />
    ),
  },
  {
    name: "TornadoVortex",
    path: "/components/tornado-vortex",
    accent: "#c8d8e8",
    desc: "Winding funnel vortex of debris particles with random internal lightning",
    preview: <TornadoVortex particleCount={400} width="100%" height="100%" />,
  },
  {
    name: "SolarFlare",
    path: "/components/solar-flare",
    accent: "#f97316",
    desc: "Glow-enhanced solar mass with convection cells and arcing flare loops",
    preview: <SolarFlare sunRadius={0.3} width="100%" height="100%" />,
  },
];

const INSTALL_CMD = "npm install own-the-canvas";

export function Home() {
  return (
    <>
      <Helmet>
        <title>Own The Canvas — React Canvas Component Library</title>
        <meta
          name="description"
          content="50+ beautiful, responsive canvas-based React components. MatrixRain, FluidSimulation, Boids, Fireworks, and more. Zero dependencies, TypeScript, MIT license."
        />
      </Helmet>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="home-topbar">
        <span className="home-topbar-version">v2.0.0</span>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href="https://github.com/jabid-19/own-the-canvas"
            className="home-topbar-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
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
            50+ components · Zero dependencies · TypeScript
          </div>
          <h1 className="home-hero-title">
            <span className="home-hero-brush">Canvas arts</span> <span className="home-hero-strip">for React</span>
          </h1>
          <p className="home-hero-sub">
            Beautiful, responsive, fully customizable canvas-based visual
            components. Drop them in anywhere — no canvas knowledge required.
          </p>

          <div className="home-hero-actions">
            <Link to="/overview" className="btn-primary">
              Get Started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/playground" className="btn-secondary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <polygon points="2,1 13,7 2,13" fill="currentColor" opacity="0.85" />
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

        {/* Diorama */}
        <div className="home-diorama-wrap">
          <div className="home-diorama">
            <PaperScene seed="home" className="home-diorama-scene" cream />
            <div className="home-window">
              <KoiPond width="100%" height="100%" />
            </div>
          </div>
        </div>

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
          <h2 className="home-grid-title" id="components-heading">
            Components
          </h2>
          <p className="home-grid-sub">
            Click any component to see the full documentation and live props
            playground.
          </p>
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
        <div className="home-sheet-wrap">
        <section className="home-sheet" aria-labelledby="install-heading">
          <h2 className="home-grid-title" id="install-heading">
            Quick install
          </h2>
          <p className="home-grid-sub" style={{ marginBottom: 20 }}>
            Install from npm and start using immediately.
          </p>
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
        </div>

        {/* Footer */}
        <footer className="home-footer">
          <span>own-the-canvas · MIT License</span>
          <span>v2.0.0</span>
        </footer>
      </div>
    </>
  );
}
