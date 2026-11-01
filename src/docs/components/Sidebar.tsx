import React from "react";
import { Link, NavLink, useMatch } from "react-router-dom";

const COMPONENT_LINKS = [
  { name: "DragonCursor", path: "/components/dragon-cursor" },
  { name: "KoiPond", path: "/components/koi-pond" },
  { name: "ButterflySwarm", path: "/components/butterfly-swarm" },
  { name: "DeepSeaBioluminescence", path: "/components/deep-sea-bioluminescence" },
  { name: "IvyGrowth", path: "/components/ivy-growth" },
  { name: "Fireflies", path: "/components/fireflies" },
  { name: "Dandelion", path: "/components/dandelion" },
  { name: "GrassField", path: "/components/grass-field" },
  { name: "Moths", path: "/components/moths" },
  { name: "SunbeamDust", path: "/components/sunbeam-dust" },
  { name: "PaperLanterns", path: "/components/paper-lanterns" },
  { name: "KelpForest", path: "/components/kelp-forest" },
  { name: "SnowDrift", path: "/components/snow-drift" },
  { name: "FrostGlass", path: "/components/frost-glass" },
  { name: "OrigamiCranes", path: "/components/origami-cranes" },
  { name: "SeasonsTree", path: "/components/seasons-tree" },
  { name: "InkMountains", path: "/components/ink-mountains" },
  { name: "WindowRain", path: "/components/window-rain" },
  { name: "IncenseSmoke", path: "/components/incense-smoke" },
  { name: "MoonlitSea", path: "/components/moonlit-sea" },
  { name: "CloudSea", path: "/components/cloud-sea" },
  { name: "Ferrofluid", path: "/components/ferrofluid" },
  { name: "MatrixRain", path: "/components/matrix-rain" },
  { name: "FluidSimulation", path: "/components/fluid-simulation" },
  { name: "FlowField", path: "/components/flow-field" },
  { name: "Boids", path: "/components/boids" },
  { name: "SpiderWeb", path: "/components/spider-web" },
  { name: "Confetti", path: "/components/confetti" },
  { name: "Mandala", path: "/components/mandala" },
  { name: "Starfield", path: "/components/starfield" },
  { name: "NoiseGradient", path: "/components/noise-gradient" },
  { name: "Fireworks", path: "/components/fireworks" },
  { name: "BubbleUniverse", path: "/components/bubble-universe" },
  { name: "SakuraBlossom", path: "/components/sakura-blossom" },
  { name: "GameOfLife", path: "/components/game-of-life" },
  { name: "Rain", path: "/components/rain" },
  { name: "Lightning", path: "/components/lightning" },
  { name: "FireEffect", path: "/components/fire-effect" },
  { name: "ParticleField", path: "/components/particle-field" },
  { name: "ReactionDiffusion", path: "/components/reaction-diffusion" },
  { name: "AuroraBorealis", path: "/components/aurora-borealis" },
  { name: "Spirograph", path: "/components/spirograph" },
  { name: "SandSimulation", path: "/components/sand-simulation" },
  { name: "WaveInterference", path: "/components/wave-interference" },
  { name: "DiffusionAggregation", path: "/components/diffusion-aggregation" },
  { name: "LSystem", path: "/components/l-system" },
  { name: "Kaleidoscope", path: "/components/kaleidoscope" },
  { name: "VoronoiCells", path: "/components/voronoi-cells" },
  { name: "SlimeMold", path: "/components/slime-mold" },
  { name: "WatercolorBloom", path: "/components/watercolor-bloom" },
  { name: "PendulaWave", path: "/components/pendula-wave" },
  { name: "CrystalGrowth", path: "/components/crystal-growth" },
  { name: "NeuralWeb", path: "/components/neural-web" },
  { name: "Metaballs", path: "/components/metaballs" },
  { name: "AntColony", path: "/components/ant-colony" },
  { name: "MagneticField", path: "/components/magnetic-field" },
  { name: "BlackHole", path: "/components/black-hole" },
  { name: "GalaxySpiral", path: "/components/galaxy-spiral" },
  { name: "TornadoVortex", path: "/components/tornado-vortex" },
  { name: "SolarFlare", path: "/components/solar-flare" },
];

const CSS = `
.sidebar {
  position: relative;
  z-index: 5;
  width: var(--sidebar-w);
  height: 100%;
  background: var(--grain), var(--sidebar-bg);
  box-shadow: 3px 0 0 var(--border-mid), 5px 0 14px rgba(var(--shadow-ink), .2);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 0 0 24px;
}
/* torn zig-zag right edge, shadowed on its own so the teeth cast shadows too */
.sidebar::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100%;
  width: 12px;
  pointer-events: none;
  background: conic-gradient(from 0deg at 100% 50%, transparent 243.43deg, var(--bg) 243.43deg 296.57deg, transparent 296.57deg) 0 0 / 12px 12px repeat-y;
  filter: drop-shadow(2px 0 1.5px rgba(var(--shadow-ink), .28));
}

.sidebar-logo-area {
  display: flex;
  align-items: center;
  padding: 20px 20px 16px;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.sidebar-logo-img {
  width: 52px !important;
  height: 52px !important;
  object-fit: contain;
  transform: rotate(-7deg);
  transition: transform 300ms var(--ease);
}
.sidebar-logo:hover .sidebar-logo-img { transform: rotate(8deg) scale(1.06); }
.sidebar-logo-name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--text-1);
}

.sidebar-components-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.sidebar-section { padding: 0 14px; margin-bottom: 8px; }

/* washi-tape labels */
.sidebar-label {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-1);
  padding: 4px 14px 4px 10px;
  margin: 18px 0 8px -4px;
  background: repeating-linear-gradient(-45deg, rgba(143,191,159,.95) 0 6px, rgba(165,205,178,.95) 6px 12px);
  clip-path: polygon(0 0, 100% 0, calc(100% - 4px) 25%, 100% 50%, calc(100% - 4px) 75%, 100% 100%, 0 100%, 4px 75%, 0 50%, 4px 25%);
  transform: rotate(-1.2deg);
}
.sidebar-section:first-of-type .sidebar-label { margin-top: 8px; }
.sidebar-section-start {
  position: relative;
  padding-bottom: 14px;
  margin-bottom: 4px;
}
.sidebar-section-start::after {
  content: "";
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--border-mid) 0 8px, transparent 8px 14px);
}
.sidebar-components-scroll .sidebar-label { background: repeating-linear-gradient(-45deg, rgba(232,121,90,.92) 0 6px, rgba(240,140,108,.92) 6px 12px); }

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 3px 0;
  border-radius: var(--r-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-2);
  text-decoration: none;
  position: relative;
  transition: background 160ms var(--ease), color 160ms var(--ease), transform 220ms var(--ease), box-shadow 220ms var(--ease);
  line-height: 1.35;
}
/* each link starts with a dab of paint from the palette */
.sidebar-link::before {
  content: "";
  flex: none;
  width: 9px;
  height: 8px;
  margin-right: 10px;
  border-radius: 55% 45% 50% 50% / 45% 55% 45% 55%;
  background: var(--dab, #e8795a);
  transform: rotate(-14deg);
}
.sidebar-link:nth-of-type(5n+1) { --dab: #e8795a; }
.sidebar-link:nth-of-type(5n+2) { --dab: #f2b134; }
.sidebar-link:nth-of-type(5n+3) { --dab: #2f6f73; }
.sidebar-link:nth-of-type(5n+4) { --dab: #8fbf9f; }
.sidebar-link:nth-of-type(5n+5) { --dab: #27406b; }
.sidebar-link.active::before { --dab: var(--accent); }
.sidebar-link:hover {
  background: var(--bg-subtle);
  color: var(--text-1);
  transform: translateX(3px);
}
/* the page you're on is a mustard paper tab pulled out of the stack */
.sidebar-link.active {
  background: var(--grain), var(--mustard);
  color: var(--text-1);
  font-weight: 700;
  transform: translateX(6px) rotate(-.6deg);
  box-shadow: 0 2px 0 #c98f12, 0 4px 0 rgba(var(--shadow-ink), .18), 0 8px 10px -3px rgba(var(--shadow-ink), .3);
  clip-path: none;
}
.sidebar-link.active::after {
  content: "";
  margin-left: auto;
  width: 8px;
  height: 8px;
  background: var(--accent);
  transform: rotate(45deg);
}

.sidebar-divider {
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--border-mid) 0 8px, transparent 8px 14px);
  margin: 10px 20px 14px;
}

.sidebar-playground-link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: var(--grain), var(--accent);
  text-decoration: none;
  position: relative;
  box-shadow: 0 3px 0 var(--accent-deep), 0 6px 0 rgba(var(--shadow-ink), .16), 0 9px 12px -4px rgba(var(--shadow-ink), .3);
  transition: transform 160ms var(--ease), box-shadow 160ms var(--ease);
}
.sidebar-playground-link:hover { transform: translateY(-2px); }
.sidebar-playground-link:active, .sidebar-playground-link.active {
  transform: translateY(3px);
  box-shadow: 0 0 0 var(--accent-deep), 0 2px 3px rgba(var(--shadow-ink), .3);
}

.sidebar-close {
  display: none;
  margin-left: auto;
  width: 44px;
  height: 44px;
  border-radius: var(--r);
  border: none;
  background: var(--bg-subtle);
  box-shadow: 0 2px 0 var(--border-mid);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--text-1);
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(43,33,24,0.5);
  z-index: 40;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: min(var(--sidebar-w), 85vw);
    height: 100%;
    z-index: 50;
    transform: translateX(calc(-100% - 16px));
    transition: transform 240ms var(--ease);
  }
  .sidebar.open { transform: translateX(0); }
  .sidebar-close { display: flex; }
  .sidebar-overlay.open { display: block; }
}
`;

function NavItem({ to, children, end }: { to: string; children: React.ReactNode; end?: boolean }) {
  const match = useMatch({ path: to, end: end ?? true });
  const isActive = Boolean(match);
  return (
    <NavLink
      to={to}
      end={end}
      className={`sidebar-link${isActive ? " active" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </NavLink>
  );
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const playgroundMatch = useMatch("/playground");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {open !== undefined && (
        <div
          className={`sidebar-overlay${open ? " open" : ""}`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <nav
        className={`sidebar${open ? " open" : ""}`}
        aria-label="Docs navigation"
      >
        <div className="sidebar-logo-area">
          <Link to="/" className="sidebar-logo" onClick={onClose}>
            <img className="sidebar-logo-img" src="/logo.svg" alt="own-the-canvas logo" />
            <span className="sidebar-logo-name">own-the-canvas</span>
          </Link>
          {onClose && (
            <button className="sidebar-close" onClick={onClose} aria-label="Close navigation">
              ✕
            </button>
          )}
        </div>

        <div className="sidebar-section sidebar-section-start">
          <div className="sidebar-label">Getting Started</div>
          <NavItem to="/" end>Introduction</NavItem>
          <NavItem to="/overview">Installation</NavItem>
        </div>

        <div className="sidebar-components-scroll">
          <div className="sidebar-section">
            <div className="sidebar-label">Components</div>
            {COMPONENT_LINKS.map((c) => (
              <NavItem key={c.path} to={c.path}>{c.name}</NavItem>
            ))}
          </div>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          <NavLink
            to="/playground"
            className={`sidebar-playground-link${playgroundMatch ? " active" : ""}`}
            aria-current={playgroundMatch ? "page" : undefined}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <polygon points="2,1 13,7 2,13" fill="currentColor" opacity="0.8" />
            </svg>
            Playground
          </NavLink>
        </div>
      </nav>
    </>
  );
}

