import React from "react";
import { Link } from "react-router-dom";
import { ComponentCard } from "../components/ComponentCard";
import { CodeBlock } from "../components/CodeBlock";
import { MatrixRain } from "../../components/MatrixRain";
import { ConstellationMap } from "../../components/ConstellationMap";
import { FluidSimulation } from "../../components/FluidSimulation";
import { FlowField } from "../../components/FlowField";
import { Boids } from "../../components/Boids";
import { GlitchOverlay } from "../../components/GlitchOverlay";
import { PixelDissolve } from "../../components/PixelDissolve";
import { Confetti } from "../../components/Confetti";
import { AudioVisualizer } from "../../components/AudioVisualizer";
import { Mandala } from "../../components/Mandala";
import { Spotlight } from "../../components/Spotlight";
import { Starfield } from "../../components/Starfield";
import { NoiseGradient } from "../../components/NoiseGradient";
import { RippleEffect } from "../../components/RippleEffect";
import { Shockwave } from "../../components/Shockwave";
import { Fireworks } from "../../components/Fireworks";
import { Wormhole } from "../../components/Wormhole";
import { ClothSimulation } from "../../components/ClothSimulation";
import { MagneticBlob } from "../../components/MagneticBlob";
import { GameOfLife } from "../../components/GameOfLife";
import { Rain } from "../../components/Rain";
import { Lightning } from "../../components/Lightning";
import { FireEffect } from "../../components/FireEffect";
import { LiveChart } from "../../components/LiveChart";
import { ParticleField } from "../../components/ParticleField";

const CSS = `
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px 80px;
}

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
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
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
  .home { padding: 0 20px 60px; }
  .home-topbar { padding: 0 20px; }
  .home-hero { padding: 48px 0 40px; }
  .home-grid { grid-template-columns: 1fr; }
  .home-stats { gap: 24px; }
}
`;

const COMPONENTS = [
  { name: "MatrixRain", path: "/components/matrix-rain", accent: "#00ff41", desc: "Falling character rain — Katakana, Latin, or binary", preview: <MatrixRain fontSize={14} speed={1} width="100%" height="100%" /> },
  { name: "ConstellationMap", path: "/components/constellation-map", accent: "#8888ff", desc: "Draggable star map with dynamic constellation lines", preview: <ConstellationMap starCount={60} width="100%" height="100%" /> },
  { name: "FluidSimulation", path: "/components/fluid-simulation", accent: "#06b6d4", desc: "Navier-Stokes ink fluid reacting to mouse movement", preview: <FluidSimulation width="100%" height="100%" /> },
  { name: "FlowField", path: "/components/flow-field", accent: "#9ca3af", desc: "Perlin noise vector field with particle streams", preview: <FlowField width="100%" height="100%" /> },
  { name: "Boids", path: "/components/boids", accent: "#f59e0b", desc: "Craig Reynolds' flocking — separation, alignment, cohesion", preview: <Boids width="100%" height="100%" /> },
  { name: "GlitchOverlay", path: "/components/glitch-overlay", accent: "#00ffff", desc: "CRT scanlines, RGB shift, and block glitch", preview: <GlitchOverlay width="100%" height="100%" /> },
  { name: "PixelDissolve", path: "/components/pixel-dissolve", accent: "#bf5fff", desc: "Pixelated dissolve transition overlay for any content", preview: <div style={{ background: "#111111", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><PixelDissolve trigger={false} width={200} height={120}><div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#111111,#555555)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--mono)", fontSize: 14 }}>DISSOLVE</div></PixelDissolve></div> },
  { name: "Confetti", path: "/components/confetti", accent: "#ffd700", desc: "Physics-based celebration burst or continuous rain", preview: <Confetti trigger={true} particleCount={60} width="100%" height="100%" /> },
  { name: "AudioVisualizer", path: "/components/audio-visualizer", accent: "#9ca3af", desc: "Real-time Web Audio API visualizer, 4 modes", preview: <AudioVisualizer mode="bars" width="100%" height="100%" /> },
  { name: "Mandala", path: "/components/mandala", accent: "#f43f5e", desc: "N-fold rotational symmetry with organic petal layers", preview: <Mandala width="100%" height="100%" /> },
  { name: "Spotlight", path: "/components/spotlight", accent: "#e0b0ff", desc: "Mouse-following light reveal over dark overlay", preview: <Spotlight width="100%" height="100%" /> },
  { name: "Starfield", path: "/components/starfield", accent: "#b8bfff", desc: "2D twinkle or 3D warp-speed star tunnel", preview: <Starfield starCount={150} width="100%" height="100%" /> },
  { name: "NoiseGradient", path: "/components/noise-gradient", accent: "#38ef7d", desc: "Animated Perlin noise color gradient", preview: <NoiseGradient colors={["#111111", "#6b7280", "#ffffff"]} width="100%" height="100%" /> },
  { name: "RippleEffect", path: "/components/ripple-effect", accent: "#9ca3af", desc: "Expanding ring animations — click or auto-trigger", preview: <RippleEffect interactive={false} width="100%" height="100%" /> },
  { name: "Shockwave", path: "/components/shockwave", accent: "#9ca3af", desc: "Click-triggered radial ring blast with glow", preview: <Shockwave width="100%" height="100%" /> },
  { name: "Fireworks", path: "/components/fireworks", accent: "#f59e0b", desc: "Physics shells, burst particles, and gravity trails", preview: <Fireworks width="100%" height="100%" /> },
  { name: "Wormhole", path: "/components/wormhole", accent: "#9ca3af", desc: "3D perspective tunnel with twisting rings and star field", preview: <Wormhole width="100%" height="100%" /> },
  { name: "ClothSimulation", path: "/components/cloth-simulation", accent: "#67e8f9", desc: "Verlet spring-mass fabric with wind and tearing", preview: <ClothSimulation width="100%" height="100%" /> },
  { name: "MagneticBlob", path: "/components/magnetic-blob", accent: "#a78bfa", desc: "Metaballs that merge and follow the cursor", preview: <MagneticBlob width="100%" height="100%" /> },
  { name: "GameOfLife", path: "/components/game-of-life", accent: "#00ff41", desc: "Conway's cellular automata — emergent life from simple rules", preview: <GameOfLife width="100%" height="100%" /> },
  { name: "Rain", path: "/components/rain", accent: "#9ca3af", desc: "Rainfall with wind drift, drop streaks, and splash particles", preview: <Rain width="100%" height="100%" /> },
  { name: "Lightning", path: "/components/lightning", accent: "#c084fc", desc: "Recursive fractal bolts with glow, flicker, and branches", preview: <Lightning width="100%" height="100%" /> },
  { name: "FireEffect", path: "/components/fire-effect", accent: "#ff6b35", desc: "Pixel-level fire simulation with 4 palettes", preview: <FireEffect width="100%" height="100%" /> },
  { name: "LiveChart", path: "/components/live-chart", accent: "#4ade80", desc: "Real-time animated line and area chart", preview: <LiveChart width="100%" height="100%" /> },
  { name: "ParticleField", path: "/components/particle-field", accent: "#9ca3af", desc: "Floating particles with interactive mouse connections", preview: <ParticleField particleCount={80} width="100%" height="100%" /> },
];

const INSTALL_CMD = "npm install own-the-canvas";

export function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="home">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-eyebrow">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <circle cx="6" cy="6" r="5" />
            </svg>
            20+ components · Zero dependencies · TypeScript
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
            { n: "20+", l: "Components" },
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
          <span>v1.0.0</span>
        </footer>
      </div>
    </>
  );
}
