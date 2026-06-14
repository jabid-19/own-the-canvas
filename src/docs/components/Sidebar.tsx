import React from "react";
import { Link, NavLink, useMatch } from "react-router-dom";

const COMPONENT_LINKS = [
  { name: "DragonCursor", path: "/components/dragon-cursor" },
  { name: "KoiPond", path: "/components/koi-pond" },
  { name: "SpiderWeb", path: "/components/spider-web" },
  { name: "ButterflySwarm", path: "/components/butterfly-swarm" },
  { name: "DeepSeaBioluminescence", path: "/components/deep-sea-bioluminescence" },
  { name: "MatrixRain", path: "/components/matrix-rain" },
  { name: "FluidSimulation", path: "/components/fluid-simulation" },
  { name: "FlowField", path: "/components/flow-field" },
  { name: "Boids", path: "/components/boids" },
  { name: "GlitchOverlay", path: "/components/glitch-overlay" },
  { name: "PixelDissolve", path: "/components/pixel-dissolve" },
  { name: "Confetti", path: "/components/confetti" },
  { name: "AudioVisualizer", path: "/components/audio-visualizer" },
  { name: "Mandala", path: "/components/mandala" },
  { name: "Starfield", path: "/components/starfield" },
  { name: "NoiseGradient", path: "/components/noise-gradient" },
  { name: "Shockwave", path: "/components/shockwave" },
  { name: "Fireworks", path: "/components/fireworks" },
  { name: "Wormhole", path: "/components/wormhole" },
  { name: "BubbleUniverse", path: "/components/bubble-universe" },
  { name: "SakuraBlossom", path: "/components/sakura-blossom" },
  { name: "ClothSimulation", path: "/components/cloth-simulation" },
  { name: "MagneticBlob", path: "/components/magnetic-blob" },
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
  { name: "Lissajous", path: "/components/lissajous" },
  { name: "LSystem", path: "/components/l-system" },
  { name: "Kaleidoscope", path: "/components/kaleidoscope" },
  { name: "VoronoiCells", path: "/components/voronoi-cells" },
  { name: "SlimeMold", path: "/components/slime-mold" },
  { name: "InkBleed", path: "/components/ink-bleed" },
  { name: "WatercolorBloom", path: "/components/watercolor-bloom" },
  { name: "PendulaWave", path: "/components/pendula-wave" },
  { name: "CrystalGrowth", path: "/components/crystal-growth" },
  { name: "NeuralWeb", path: "/components/neural-web" },
  { name: "ParticleText", path: "/components/particle-text" },
  { name: "Metaballs", path: "/components/metaballs" },
  { name: "AntColony", path: "/components/ant-colony" },
  { name: "MagneticField", path: "/components/magnetic-field" },
  { name: "TerrainMesh", path: "/components/terrain-mesh" },
  { name: "BlackHole", path: "/components/black-hole" },
  { name: "GalaxySpiral", path: "/components/galaxy-spiral" },
  { name: "TornadoVortex", path: "/components/tornado-vortex" },
  { name: "SolarFlare", path: "/components/solar-flare" },
];

const CSS = `
.sidebar {
  width: var(--sidebar-w);
  height: 100%;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  padding: 0 0 32px;
}

.sidebar-logo-area {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.sidebar-logo:hover { opacity: 0.85; }
.sidebar-logo img {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: contain;
}
.sidebar-logo-name {
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: var(--text-1);
}

.sidebar-components-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.sidebar-section { padding: 0 12px; margin-bottom: 8px; }

.sidebar-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  padding: 0 8px;
  margin-bottom: 4px;
  margin-top: 20px;
}
.sidebar-label:first-child { margin-top: 8px; }

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 7px 12px;
  margin: 2px 0;
  border-radius: var(--r-sm);
  font-size: 13.5px;
  font-weight: 450;
  color: var(--text-2);
  text-decoration: none;
  position: relative;
  transition: all 250ms var(--ease);
  line-height: 1.4;
}
.sidebar-link:hover {
  background: var(--accent-soft);
  color: var(--text-1);
  padding-left: 16px;
}
.sidebar-link.active {
  background: linear-gradient(90deg, var(--accent-soft) 0%, rgba(244, 244, 244, 0.1) 100%);
  color: var(--accent);
  font-weight: 600;
  padding-left: 18px;
}
.sidebar-link::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  height: 14px;
  width: 3px;
  background: var(--accent);
  border-radius: 99px;
  opacity: 0;
  transition: transform 250ms var(--ease), opacity 200ms ease;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
.sidebar-link.active::before {
  transform: translateY(-50%) scaleY(1);
  opacity: 1;
}
.sidebar-link::after {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  opacity: 0;
  transform: scale(0);
  transition: transform 250ms var(--ease), opacity 200ms ease;
}
.sidebar-link.active::after {
  opacity: 0.6;
  transform: scale(1);
}

.sidebar-divider {
  height: 1px;
  background: var(--border);
  margin: 12px 20px;
}

.sidebar-playground-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: var(--r-sm);
  font-size: 13.5px;
  font-weight: 450;
  color: var(--text-2);
  text-decoration: none;
  position: relative;
  transition: all 250ms var(--ease);
}
.sidebar-playground-link:hover {
  background: var(--accent-soft);
  color: var(--text-1);
  padding-left: 16px;
}
.sidebar-playground-link.active {
  background: linear-gradient(90deg, var(--accent-soft) 0%, rgba(244, 244, 244, 0.1) 100%);
  color: var(--accent);
  font-weight: 600;
  padding-left: 18px;
}
.sidebar-playground-link::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  height: 14px;
  width: 3px;
  background: var(--accent);
  border-radius: 99px;
  opacity: 0;
  transition: transform 250ms var(--ease), opacity 200ms ease;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
.sidebar-playground-link.active::before {
  transform: translateY(-50%) scaleY(1);
  opacity: 1;
}
.sidebar-playground-link::after {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  opacity: 0;
  transform: scale(0);
  transition: transform 250ms var(--ease), opacity 200ms ease;
}
.sidebar-playground-link.active::after {
  opacity: 0.6;
  transform: scale(1);
}

.sidebar-close {
  display: none;
  margin-left: auto;
  width: 30px;
  height: 30px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--text-2);
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1;
  transition: background 150ms var(--ease), color 150ms var(--ease);
}
.sidebar-close:hover { background: var(--accent-soft); color: var(--text-1); }

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 40;
}

.sidebar-logo-img {
  width: 48px !important;
  height: 48px !important;
  border-radius: 6px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: min(var(--sidebar-w), 85vw);
    height: 100%;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 200ms var(--ease);
    box-shadow: 4px 0 24px rgba(0,0,0,0.08);
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
            <img className="sidebar-logo-img" src="/logo.png" alt="own-the-canvas logo" />
            <span className="sidebar-logo-name">own-the-canvas</span>
          </Link>
          {onClose && (
            <button className="sidebar-close" onClick={onClose} aria-label="Close navigation">
              ✕
            </button>
          )}
        </div>

        <div className="sidebar-section">
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

