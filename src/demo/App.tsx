import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MatrixRain } from "../components/MatrixRain";
import { ParticleField } from "../components/ParticleField";
import { Starfield } from "../components/Starfield";
import { FireEffect } from "../components/FireEffect";
import { AudioVisualizer } from "../components/AudioVisualizer";
import { Confetti } from "../components/Confetti";
import { NoiseGradient } from "../components/NoiseGradient";
import { PixelDissolve } from "../components/PixelDissolve";
import { FlowField } from "../components/FlowField";
import { Spotlight } from "../components/Spotlight";
import { Shockwave } from "../components/Shockwave";
import { Fireworks } from "../components/Fireworks";
import { GlitchOverlay } from "../components/GlitchOverlay";
import { LiveChart } from "../components/LiveChart";
import type { LiveChartSeries } from "../components/LiveChart";
import { Mandala } from "../components/Mandala";
import { MagneticBlob } from "../components/MagneticBlob";
import { ClothSimulation } from "../components/ClothSimulation";
import { FluidSimulation } from "../components/FluidSimulation";
import { Rain } from "../components/Rain";
import { Lightning } from "../components/Lightning";
import { GameOfLife } from "../components/GameOfLife";
import { Wormhole } from "../components/Wormhole";
import { Boids } from "../components/Boids";
import type { FirePalette } from "../components/FireEffect";
import type { ConfettiPalette } from "../components/Confetti";
import type { VisualizerMode } from "../components/AudioVisualizer";
import type { StarfieldPerspective } from "../components/Starfield";
import type { ParticleLineStyle } from "../components/ParticleField";
import type { DissolveDirection, DissolvePattern } from "../components/PixelDissolve";
import { DragonCursor } from "../components/DragonCursor";
import { KoiPond } from "../components/KoiPond";
import { BubbleUniverse } from "../components/BubbleUniverse";
import { SakuraBlossom } from "../components/SakuraBlossom";
import { ReactionDiffusion } from "../components/ReactionDiffusion";
import { AuroraBorealis } from "../components/AuroraBorealis";
import { Spirograph } from "../components/Spirograph";
import { SandSimulation } from "../components/SandSimulation";
import type { SandMaterial } from "../components/SandSimulation";
import { WaveInterference } from "../components/WaveInterference";
import { DiffusionAggregation } from "../components/DiffusionAggregation";
import type { DLASeedMode } from "../components/DiffusionAggregation";
import { Lissajous } from "../components/Lissajous";
import type { LissajousColorMode } from "../components/Lissajous";
import { LSystem } from "../components/LSystem";
import { Kaleidoscope } from "../components/Kaleidoscope";
import { VoronoiCells } from "../components/VoronoiCells";
import type { VoronoiColorMode } from "../components/VoronoiCells";
import { SlimeMold } from "../components/SlimeMold";
import { InkBleed } from "../components/InkBleed";
import { WatercolorBloom } from "../components/WatercolorBloom";
import { PendulaWave } from "../components/PendulaWave";
import type { PendulaWaveColorMode } from "../components/PendulaWave";
import { CrystalGrowth } from "../components/CrystalGrowth";
import type { CrystalGrowthColorMode } from "../components/CrystalGrowth";
import { NeuralWeb } from "../components/NeuralWeb";
import { ParticleText } from "../components/ParticleText";
import { Metaballs } from "../components/Metaballs";
import { AntColony } from "../components/AntColony";
import { MagneticField } from "../components/MagneticField";
import { TerrainMesh } from "../components/TerrainMesh";
import { BlackHole } from "../components/BlackHole";
import { GalaxySpiral } from "../components/GalaxySpiral";
import { TornadoVortex } from "../components/TornadoVortex";
import { SolarFlare } from "../components/SolarFlare";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-base:      #ffffff;
    --bg-elevated:  #f8fafc;
    --bg-overlay:   #f1f5f9;
    --surface:      rgba(0,0,0,0.04);
    --surface-hov:  rgba(0,0,0,0.07);
    --border:       #e2e8f0;
    --border-mid:   #cbd5e1;
    --text-1:       #0f172a;
    --text-2:       #475569;
    --text-3:       #94a3b8;
    --purple:       #6b7280;
    --purple-light: #9ca3af;
    --cyan:         #4b5563;
    --cyan-light:   #d1d5db;
    --gradient:     linear-gradient(135deg, #374151 0%, #6b7280 100%);
    --glow-purple:  rgba(107,114,128,0.3);
    --glow-cyan:    rgba(107,114,128,0.2);
    --r-sm:         8px;
    --r:            12px;
    --r-lg:         16px;
    --ease:         cubic-bezier(0.16,1,0.3,1);
    --font:         'Inter', system-ui, -apple-system, sans-serif;
    --mono:         'JetBrains Mono', 'Fira Code', monospace;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg-base);
    color: var(--text-1);
    font-family: var(--font);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection { background: rgba(107,114,128,0.35); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }

  /* ── App shell ── */
  .app { display: flex; flex-direction: column; height: 100%; overflow: hidden; }

  /* ── Header ── */
  .header {
    display: flex; align-items: center; gap: 16px;
    padding: 0 24px; height: 52px; flex-shrink: 0;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position: relative; z-index: 10;
  }
  .header-logo {
    display: flex; align-items: center; gap: 10px;
    font-size: 15px; font-weight: 600; letter-spacing: -0.3px; color: var(--text-1);
    text-decoration: none;
  }
  .header-logo-icon {
    width: 28px; height: 28px; border-radius: 7px;
    background: var(--gradient);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .header-divider { width: 1px; height: 20px; background: var(--border); margin: 0 4px; }
  .header-tag {
    font-size: 11px; font-weight: 500; letter-spacing: 0.5px;
    color: var(--text-3); text-transform: uppercase;
  }
  .header-spacer { flex: 1; }
  .header-badge {
    font-size: 11px; font-weight: 500; font-family: var(--mono);
    padding: 3px 10px; border-radius: 20px;
    background: rgba(107,114,128,0.12); border: 1px solid rgba(107,114,128,0.25);
    color: var(--purple-light);
  }

  /* ── Tab row ── */
  .tab-row {
    display: flex; gap: 2px; padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    overflow-x: auto; flex-shrink: 0;
    background: var(--bg-elevated);
    scrollbar-width: none;
  }
  .tab-row::-webkit-scrollbar { display: none; }
  .tab-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: var(--r-sm);
    border: none; background: transparent; cursor: pointer;
    color: var(--text-2); font-family: var(--font); font-size: 13px; font-weight: 500;
    transition: all 200ms var(--ease); white-space: nowrap; flex-shrink: 0;
  }
  .tab-btn:hover { background: var(--surface-hov); color: var(--text-1); }
  .tab-btn.active {
    background: rgba(107,114,128,0.14);
    border: 1px solid rgba(107,114,128,0.28) !important;
    color: var(--purple-light);
  }
  .tab-btn svg { opacity: 0.7; flex-shrink: 0; }
  .tab-btn.active svg { opacity: 1; }

  /* ── Main workspace ── */
  .workspace {
    flex: 1; display: flex; overflow: hidden;
  }

  /* ── Canvas area ── */
  .canvas-wrap {
    flex: 1; position: relative; overflow: hidden;
    background: var(--bg-base);
  }
  .canvas-wrap-inner {
    position: absolute; inset: 0;
  }
  /* Dot pattern overlay */
  .canvas-wrap::before {
    content: '';
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image: radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  .canvas-label {
    position: absolute; bottom: 16px; left: 16px; z-index: 2;
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 500; color: var(--text-3);
    pointer-events: none;
  }
  .canvas-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 6px #22c55e;
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }

  /* ── Controls panel ── */
  .controls {
    width: 320px; flex-shrink: 0;
    border-left: 1px solid var(--border);
    background: var(--bg-elevated);
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .ctrl-head {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .ctrl-head-top {
    display: flex; align-items: center; gap: 10px; margin-bottom: 6px;
  }
  .ctrl-component-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ctrl-name {
    font-size: 16px; font-weight: 600; letter-spacing: -0.3px; color: var(--text-1);
  }
  .ctrl-desc {
    font-size: 12px; color: var(--text-3); line-height: 1.5; padding-left: 42px;
  }
  .ctrl-body {
    flex: 1; overflow-y: auto; padding: 16px 20px;
    display: flex; flex-direction: column; gap: 12px;
    min-height: 0;
  }

  /* ── Control widgets ── */
  .ctl-section { display: flex; flex-direction: column; gap: 10px; }
  .ctl-row { display: flex; flex-direction: column; gap: 5px; }
  .ctl-label {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11px; font-weight: 500; color: var(--text-2);
    text-transform: uppercase; letter-spacing: 0.6px;
  }
  .ctl-value {
    font-family: var(--mono); font-size: 11px; font-weight: 500;
    color: var(--purple-light); background: rgba(107,114,128,0.1);
    padding: 1px 7px; border-radius: 4px;
  }

  /* Range slider */
  input[type=range] {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 3px; border-radius: 3px;
    background: var(--border-mid); outline: none; cursor: pointer;
    transition: background 150ms;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--purple-light);
    box-shadow: 0 0 0 3px rgba(107,114,128,0.2);
    cursor: pointer; transition: all 150ms var(--ease);
  }
  input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 0 0 5px rgba(107,114,128,0.25);
  }
  input[type=range]::-moz-range-thumb {
    width: 14px; height: 14px; border-radius: 50%; border: none;
    background: var(--purple-light); cursor: pointer;
  }

  /* Color picker */
  .ctl-color-wrap {
    display: flex; align-items: center; gap: 8px;
  }
  .ctl-color-btn {
    width: 32px; height: 32px; border-radius: var(--r-sm);
    border: 1px solid var(--border-mid); cursor: pointer;
    flex-shrink: 0; overflow: hidden; padding: 3px;
    background: var(--bg-overlay);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 150ms;
  }
  .ctl-color-btn:hover { border-color: var(--border-mid); }
  .ctl-color-btn input[type=color] {
    width: 22px; height: 22px; border: none; border-radius: 4px;
    padding: 0; cursor: pointer; background: transparent;
  }
  .ctl-color-hex {
    font-family: var(--mono); font-size: 12px; color: var(--text-2);
    background: var(--bg-overlay); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 5px 10px; flex: 1;
  }

  /* Toggle */
  .ctl-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 0;
  }
  .ctl-toggle-label {
    font-size: 13px; color: var(--text-1); font-weight: 400;
  }
  .toggle-track {
    width: 36px; height: 20px; border-radius: 20px;
    border: none; cursor: pointer; flex-shrink: 0;
    position: relative; transition: background 200ms var(--ease);
  }
  .toggle-track.on { background: var(--purple); }
  .toggle-track.off { background: rgba(0,0,0,0.15); }
  .toggle-thumb {
    position: absolute; top: 3px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #fff;
    transition: left 200ms var(--ease);
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }
  .toggle-track.on .toggle-thumb { left: 19px; }
  .toggle-track.off .toggle-thumb { left: 3px; }

  /* Select */
  .ctl-select {
    width: 100%; padding: 8px 12px;
    background: var(--bg-overlay); border: 1px solid var(--border);
    color: var(--text-1); font-family: var(--font); font-size: 13px;
    border-radius: var(--r-sm); cursor: pointer; outline: none;
    transition: border-color 150ms;
    -webkit-appearance: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239096a5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }
  .ctl-select:hover { border-color: var(--border-mid); }
  .ctl-select:focus { border-color: rgba(107,114,128,0.5); box-shadow: 0 0 0 3px rgba(107,114,128,0.1); }

  /* Text input */
  .ctrl-row { display: flex; flex-direction: column; gap: 5px; }
  .ctrl-label {
    font-size: 11px; font-weight: 500; color: var(--text-2);
    text-transform: uppercase; letter-spacing: 0.6px;
  }
  .ctrl-text-input {
    width: 100%; padding: 8px 12px; box-sizing: border-box;
    background: var(--bg-overlay); border: 1px solid var(--border);
    color: var(--text-1); font-family: var(--mono); font-size: 13px;
    border-radius: var(--r-sm); outline: none; transition: border-color 150ms;
  }
  .ctrl-text-input:hover { border-color: var(--border-mid); }
  .ctrl-text-input:focus { border-color: rgba(107,114,128,0.5); box-shadow: 0 0 0 3px rgba(107,114,128,0.1); }

  /* Divider */
  .ctl-divider { height: 1px; background: var(--border); margin: 4px 0; }

  /* Action button */
  .ctl-action-btn {
    padding: 9px 16px; border-radius: var(--r-sm);
    font-family: var(--font); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 150ms var(--ease);
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .ctl-action-btn.primary {
    background: var(--gradient); border: none; color: #fff;
    box-shadow: 0 0 20px var(--glow-purple);
  }
  .ctl-action-btn.primary:hover {
    opacity: 0.9; transform: translateY(-1px);
    box-shadow: 0 4px 24px var(--glow-purple);
  }
  .ctl-action-btn.primary:active { transform: scale(0.97); }
  .ctl-action-btn.secondary {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text-1);
  }
  .ctl-action-btn.secondary:hover {
    background: var(--surface-hov); border-color: var(--border-mid);
  }

  /* ── Code snippet ── */
  .code-block {
    margin-top: 4px;
    background: var(--bg-base);
    border: 1px solid var(--border);
    border-radius: var(--r);
    overflow: hidden;
  }
  /* ── Code modal ── */
  .code-modal-backdrop {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.5); display: flex;
    align-items: center; justify-content: center;
    padding: 16px;
  }
  .code-modal-card {
    background: var(--bg-base); border: 1px solid var(--border-mid);
    border-radius: var(--r-lg); overflow: hidden;
    width: min(680px, 95vw); max-height: 90vh;
    display: flex; flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  }
  .code-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-bottom: 1px solid var(--border);
    background: rgba(0,0,0,0.02); flex-shrink: 0;
  }
  .code-modal-close {
    background: none; border: none; cursor: pointer;
    color: var(--text-2); font-size: 20px; line-height: 1;
    padding: 2px 6px; border-radius: 4px; transition: all 150ms;
  }
  .code-modal-close:hover { color: var(--text-1); background: var(--surface); }
  .code-view-btn {
    margin-left: auto; padding: 3px 10px; flex-shrink: 0;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; cursor: pointer; font-size: 11px;
    font-family: var(--mono); color: var(--text-2);
    transition: all 150ms; white-space: nowrap;
  }
  .code-view-btn:hover { border-color: var(--border-mid); color: var(--text-1); background: var(--surface-hov); }
  .code-block-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 14px;
    border-bottom: 1px solid var(--border);
    background: rgba(0,0,0,0.02);
  }
  .code-block-title {
    font-size: 11px; font-weight: 500; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.6px;
  }
  .code-copy-btn {
    font-size: 11px; font-weight: 500; color: var(--text-2);
    background: none; border: 1px solid var(--border);
    border-radius: 5px; padding: 2px 8px; cursor: pointer;
    font-family: var(--font); transition: all 150ms;
  }
  .code-copy-btn:hover { color: var(--text-1); border-color: var(--border-mid); }
  .code-copy-btn.copied { color: #22c55e; border-color: rgba(34,197,94,0.3); }
  .code-pre {
    padding: 14px; overflow-x: auto; overflow-y: auto;
    font-family: var(--mono); font-size: 12px; line-height: 1.7;
    scrollbar-width: thin;
    max-height: 160px;
  }
  /* Syntax colors */
  .tok-kw { color: #bf5fff; }
  .tok-fn { color: #9ca3af; }
  .tok-str { color: #f1a966; }
  .tok-tag { color: #9ca3af; }
  .tok-attr { color: #9fe8b0; }
  .tok-val { color: #f1a966; }
  .tok-dim { color: var(--text-3); }
  .tok-cmt { color: var(--text-3); font-style: italic; }

  /* ── Mic active badge ── */
  .mic-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 500; color: #22c55e;
    background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
    padding: 3px 10px; border-radius: 20px;
  }
  .mic-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
    animation: pulse-dot 1.5s ease-in-out infinite;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .controls { width: 280px; }
  }
  @media (max-width: 768px) {
    .controls { width: 260px; }
    .header { padding: 0 16px; gap: 12px; }
    .tab-row { padding: 6px 8px; }
  }
  @media (max-width: 680px) {
    .workspace { flex-direction: column; }
    .controls {
      width: 100%; border-left: none; border-top: 1px solid var(--border);
      flex: none; height: 45vh; min-height: 200px;
    }
    .canvas-wrap { flex: none; height: 55vh; min-height: 180px; }
    .tab-row { gap: 1px; padding: 4px 6px; }
    .tab-btn { padding: 5px 10px; font-size: 12px; min-height: 34px; }
    .header-tag { display: none; }
    .header-badge { display: none; }
    .ctrl-body { padding: 12px 14px; gap: 10px; }
    .ctrl-head { padding: 14px 14px 12px; }
    .ctrl-desc { padding-left: 0; }
  }
  @media (max-width: 400px) {
    .header-logo { font-size: 13px; gap: 7px; }
    .header-divider { display: none; }
    .canvas-wrap { height: 50vh; }
    .controls { height: 50vh; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const icons: Record<string, React.ReactNode> = {
  MatrixRain: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="2" height="2" rx="0.5" fill="currentColor" opacity=".8" />
      <rect x="7" y="2" width="2" height="2" rx="0.5" fill="currentColor" opacity=".5" />
      <rect x="12" y="2" width="2" height="2" rx="0.5" fill="currentColor" />
      <rect x="2" y="7" width="2" height="2" rx="0.5" fill="currentColor" opacity=".4" />
      <rect x="7" y="7" width="2" height="2" rx="0.5" fill="currentColor" />
      <rect x="12" y="7" width="2" height="2" rx="0.5" fill="currentColor" opacity=".6" />
      <rect x="2" y="12" width="2" height="2" rx="0.5" fill="currentColor" opacity=".9" />
      <rect x="7" y="12" width="2" height="2" rx="0.5" fill="currentColor" opacity=".3" />
      <rect x="12" y="12" width="2" height="2" rx="0.5" fill="currentColor" opacity=".7" />
    </svg>
  ),
  ParticleField: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="3" cy="4" r="1.5" fill="currentColor" />
      <circle cx="13" cy="3" r="1" fill="currentColor" opacity=".7" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="13" cy="12" r="1.5" fill="currentColor" opacity=".8" />
      <circle cx="3" cy="12" r="1" fill="currentColor" opacity=".6" />
      <line x1="3" y1="4" x2="8" y2="8" stroke="currentColor" strokeWidth="0.8" opacity=".4" />
      <line x1="13" y1="3" x2="8" y2="8" stroke="currentColor" strokeWidth="0.8" opacity=".4" />
      <line x1="8" y1="8" x2="13" y2="12" stroke="currentColor" strokeWidth="0.8" opacity=".4" />
    </svg>
  ),
  Starfield: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1l1.5 4.5H14l-3.8 2.8 1.5 4.7L8 10.3 4.3 13l1.5-4.7L2 5.5h4.5z" fill="currentColor" />
    </svg>
  ),
  FireEffect: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2c0 2-3 3-3 6a3 3 0 006 0c0-1-.5-1.5-1-2 0 1-.5 1.5-1 1.5C8.5 6 10 4.5 8 2z" fill="currentColor" />
      <path d="M6 9c0 1.1.9 2 2 2s2-.9 2-2c0-.5-.2-1-.5-1.3C9.3 8.7 9 9.3 9 10c-.3-.3-.5-.9-.5-1.5C7.5 8.7 7 8 7 8c-.6.2-1 .6-1 1z" fill="currentColor" opacity=".6" />
    </svg>
  ),
  AudioVisualizer: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="8" width="2" height="6" rx="1" fill="currentColor" opacity=".5" />
      <rect x="4.5" y="5" width="2" height="9" rx="1" fill="currentColor" opacity=".7" />
      <rect x="8" y="2" width="2" height="12" rx="1" fill="currentColor" />
      <rect x="11.5" y="5" width="2" height="9" rx="1" fill="currentColor" opacity=".7" />
    </svg>
  ),
  Confetti: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="6" width="3" height="2" rx="0.5" fill="currentColor" transform="rotate(-30 2 6)" />
      <rect x="7" y="2" width="2" height="3" rx="0.5" fill="currentColor" opacity=".8" />
      <rect x="11" y="4" width="3" height="2" rx="0.5" fill="currentColor" opacity=".6" transform="rotate(20 11 4)" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" opacity=".7" />
      <circle cx="13" cy="10" r="1" fill="currentColor" opacity=".5" />
      <rect x="8" y="10" width="2" height="3" rx="0.5" fill="currentColor" opacity=".6" transform="rotate(15 8 10)" />
    </svg>
  ),
  NoiseGradient: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="url(#ng-grad)" />
      <defs>
        <linearGradient id="ng-grad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#374151" />
          <stop offset=".5" stopColor="#6b7280" />
          <stop offset="1" stopColor="#9ca3af" />
        </linearGradient>
      </defs>
    </svg>
  ),
  PixelDissolve: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="5.5" y="1" width="3" height="3" rx="0.5" fill="currentColor" opacity=".6" />
      <rect x="10" y="1" width="3" height="3" rx="0.5" fill="currentColor" opacity=".2" />
      <rect x="1" y="5.5" width="3" height="3" rx="0.5" fill="currentColor" opacity=".8" />
      <rect x="5.5" y="5.5" width="3" height="3" rx="0.5" fill="currentColor" opacity=".4" />
      <rect x="1" y="10" width="3" height="3" rx="0.5" fill="currentColor" opacity=".3" />
      <rect x="10" y="10" width="3" height="3" rx="0.5" fill="currentColor" opacity=".1" />
    </svg>
  ),
  FlowField: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8c2-3 4-3 6 0s4 3 6 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M2 11c2-3 4-3 6 0s4 3 6 0" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity=".5" />
      <path d="M2 5c2-3 4-3 6 0s4 3 6 0" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity=".5" />
    </svg>
  ),
  Spotlight: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" fill="currentColor" opacity=".9" />
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1" opacity=".3" />
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="0.5" opacity=".1" />
    </svg>
  ),
  Shockwave: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="4.5" stroke="currentColor" strokeWidth="1" opacity=".6" />
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="0.75" opacity=".3" />
    </svg>
  ),
  Fireworks: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="1.5" fill="currentColor" />
      <line x1="8" y1="3" x2="8" y2="1" stroke="currentColor" strokeWidth="1" opacity=".8" />
      <line x1="8" y1="3" x2="10.5" y2="1" stroke="currentColor" strokeWidth="1" opacity=".6" />
      <line x1="8" y1="3" x2="5.5" y2="1" stroke="currentColor" strokeWidth="1" opacity=".6" />
      <line x1="8" y1="3" x2="11" y2="3.5" stroke="currentColor" strokeWidth="1" opacity=".5" />
      <line x1="8" y1="3" x2="5" y2="3.5" stroke="currentColor" strokeWidth="1" opacity=".5" />
      <line x1="8" y1="3" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1" opacity=".4" />
      <line x1="8" y1="3" x2="6" y2="5.5" stroke="currentColor" strokeWidth="1" opacity=".4" />
      <circle cx="4" cy="12" r="1" fill="currentColor" opacity=".6" />
      <circle cx="12" cy="11" r="1" fill="currentColor" opacity=".5" />
    </svg>
  ),
  GlitchOverlay: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="2" rx="0.5" fill="currentColor" opacity=".8" />
      <rect x="1" y="7" width="10" height="2" rx="0.5" fill="currentColor" opacity=".5" transform="translate(2 0)" />
      <rect x="1" y="11" width="14" height="2" rx="0.5" fill="currentColor" opacity=".7" />
      <rect x="3" y="5" width="6" height="1" fill="currentColor" opacity=".3" />
      <rect x="8" y="9" width="5" height="1" fill="currentColor" opacity=".3" />
    </svg>
  ),
  LiveChart: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polyline points="1,13 4,8 7,10 10,5 13,7 15,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="1" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="0.75" opacity=".3" />
    </svg>
  ),
  Mandala: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="0.75" opacity=".4" />
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1" opacity=".7" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity=".9" />
      <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="0.5" opacity=".3" />
      <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="0.5" opacity=".3" />
      <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="0.5" opacity=".3" />
      <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" stroke="currentColor" strokeWidth="0.5" opacity=".3" />
    </svg>
  ),
  MagneticBlob: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="7" r="3.5" fill="currentColor" opacity=".7" />
      <circle cx="10.5" cy="9" r="3" fill="currentColor" opacity=".6" />
      <circle cx="8" cy="6" r="2" fill="currentColor" opacity=".5" />
    </svg>
  ),
  ClothSimulation: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="3" x2="7" y2="3" stroke="currentColor" strokeWidth="1" opacity=".8" />
      <line x1="9" y1="3" x2="14" y2="3" stroke="currentColor" strokeWidth="1" opacity=".8" />
      <path d="M2 3 C3 7, 4 9, 4 13" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <path d="M7 3 C7.5 7, 8 9, 8 13" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <path d="M14 3 C13 7, 12 9, 12 13" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <path d="M2 7 C5 7.5, 11 7.5, 14 7" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".4" />
    </svg>
  ),
  FluidSimulation: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 10 C4 6, 6 12, 8 8 S12 4, 14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".8" />
      <path d="M2 13 C5 9, 7 14, 10 11 S13 8, 14 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity=".4" />
    </svg>
  ),
  Rain: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="4" y1="2" x2="3" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".9" />
      <line x1="8" y1="1" x2="7" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
      <line x1="12" y1="2" x2="11" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
      <line x1="6" y1="5" x2="5" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".4" />
      <line x1="10" y1="4" x2="9" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
    </svg>
  ),
  Lightning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 2L5 9h5l-4 5 9-8H9z" fill="currentColor" opacity=".9" />
    </svg>
  ),
  GameOfLife: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="3" height="3" rx="0.5" fill="currentColor" opacity=".9" />
      <rect x="6" y="2" width="3" height="3" rx="0.5" fill="currentColor" opacity=".4" />
      <rect x="11" y="2" width="3" height="3" rx="0.5" fill="currentColor" opacity=".8" />
      <rect x="2" y="6" width="3" height="3" rx="0.5" fill="currentColor" opacity=".3" />
      <rect x="6" y="6" width="3" height="3" rx="0.5" fill="currentColor" opacity=".9" />
      <rect x="11" y="6" width="3" height="3" rx="0.5" fill="currentColor" opacity=".5" />
      <rect x="2" y="11" width="3" height="3" rx="0.5" fill="currentColor" opacity=".7" />
      <rect x="6" y="11" width="3" height="3" rx="0.5" fill="currentColor" opacity=".2" />
      <rect x="11" y="11" width="3" height="3" rx="0.5" fill="currentColor" opacity=".9" />
    </svg>
  ),
  Wormhole: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="8" rx="6" ry="6" stroke="currentColor" strokeWidth="1" opacity=".8" fill="none" />
      <ellipse cx="8" cy="8" rx="4" ry="3.5" stroke="currentColor" strokeWidth="0.9" opacity=".6" fill="none" />
      <ellipse cx="8" cy="8" rx="2" ry="1.8" stroke="currentColor" strokeWidth="0.8" opacity=".4" fill="none" />
      <circle cx="8" cy="8" r="0.8" fill="currentColor" opacity=".9" />
    </svg>
  ),
  Boids: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polygon points="4,3 7,7 4,6" fill="currentColor" opacity=".9" />
      <polygon points="9,5 12,9 9,8" fill="currentColor" opacity=".7" />
      <polygon points="6,9 9,13 6,12" fill="currentColor" opacity=".8" />
      <polygon points="11,2 14,5 11,4.5" fill="currentColor" opacity=".5" />
    </svg>
  ),
  DragonCursor: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2 C6 3, 4 5, 4 8 C4 11, 6 13, 8 14 C10 13, 12 11, 12 8 C12 5, 10 3, 8 2Z" fill="currentColor" opacity=".7" />
      <circle cx="6.5" cy="7" r="1" fill="currentColor" opacity=".9" />
      <circle cx="9.5" cy="7" r="1" fill="currentColor" opacity=".9" />
      <path d="M4 6 L2 4 M12 6 L14 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".5" />
    </svg>
  ),
  KoiPond: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="8" rx="5" ry="3" fill="currentColor" opacity=".6" />
      <path d="M3 8 C4 6, 6 5, 8 6 C10 7, 12 6, 13 8" stroke="currentColor" strokeWidth="1" fill="none" opacity=".8" />
      <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".3" />
      <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".3" />
    </svg>
  ),
  BubbleUniverse: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="5" cy="9" r="3.5" stroke="currentColor" strokeWidth="1" fill="none" opacity=".7" />
      <circle cx="11" cy="7" r="2.5" stroke="currentColor" strokeWidth="1" fill="none" opacity=".6" />
      <circle cx="8" cy="12" r="1.5" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".5" />
      <circle cx="11" cy="3" r="1" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".4" />
    </svg>
  ),
  SakuraBlossom: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="5" rx="1.5" ry="2.5" fill="currentColor" opacity=".7" transform="rotate(0 8 5)" />
      <ellipse cx="8" cy="5" rx="1.5" ry="2.5" fill="currentColor" opacity=".7" transform="rotate(72 8 8)" />
      <ellipse cx="8" cy="5" rx="1.5" ry="2.5" fill="currentColor" opacity=".7" transform="rotate(144 8 8)" />
      <ellipse cx="8" cy="5" rx="1.5" ry="2.5" fill="currentColor" opacity=".7" transform="rotate(216 8 8)" />
      <ellipse cx="8" cy="5" rx="1.5" ry="2.5" fill="currentColor" opacity=".7" transform="rotate(288 8 8)" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity=".9" />
    </svg>
  ),
  ReactionDiffusion: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".3" />
      <circle cx="8" cy="8" r="3.5" fill="currentColor" opacity=".6" />
      <circle cx="5" cy="5" r="1.5" fill="currentColor" opacity=".8" />
      <circle cx="11" cy="11" r="1.5" fill="currentColor" opacity=".8" />
      <circle cx="11" cy="5" r="1" fill="currentColor" opacity=".5" />
    </svg>
  ),
  AuroraBorealis: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 10 C4 6, 7 8, 10 5 S14 7, 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".8" />
      <path d="M1 12 C4 9, 7 11, 10 8 S14 10, 15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".5" />
      <path d="M1 14 C4 11, 7 13, 10 10 S14 12, 15 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity=".3" />
    </svg>
  ),
  Spirograph: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2 C12 2, 14 6, 12 10 C10 14, 5 14, 3 10 C1 6, 4 2, 8 2 C8 6, 10 8, 8 10 C6 12, 4 10, 4 8 C4 6, 6 4, 8 4" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".8" />
    </svg>
  ),
  SandSimulation: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="2" rx="0.5" fill="currentColor" opacity=".3" />
      <rect x="3" y="4" width="10" height="2" rx="0.5" fill="currentColor" opacity=".5" />
      <rect x="5" y="7" width="6" height="2" rx="0.5" fill="currentColor" opacity=".7" />
      <rect x="6" y="10" width="4" height="2" rx="0.5" fill="currentColor" opacity=".9" />
      <rect x="4" y="13" width="8" height="2" rx="0.5" fill="currentColor" opacity=".6" />
    </svg>
  ),
  WaveInterference: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="5" cy="8" r="3" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <circle cx="5" cy="8" r="5.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity=".3" />
      <circle cx="11" cy="8" r="3" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <circle cx="11" cy="8" r="5.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity=".3" />
    </svg>
  ),
  DiffusionAggregation: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="6" cy="6" r="1" fill="currentColor" opacity=".8" />
      <circle cx="10" cy="6" r="1" fill="currentColor" opacity=".8" />
      <circle cx="6" cy="10" r="1" fill="currentColor" opacity=".8" />
      <circle cx="10" cy="10" r="1" fill="currentColor" opacity=".8" />
      <circle cx="4" cy="8" r="0.75" fill="currentColor" opacity=".5" />
      <circle cx="12" cy="8" r="0.75" fill="currentColor" opacity=".5" />
      <circle cx="8" cy="4" r="0.75" fill="currentColor" opacity=".5" />
      <circle cx="8" cy="12" r="0.75" fill="currentColor" opacity=".5" />
    </svg>
  ),
  Lissajous: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 8 C8 4, 12 4, 12 8 C12 12, 8 12, 8 8 C8 4, 4 4, 4 8 C4 12, 8 12, 8 8" stroke="currentColor" strokeWidth="1" fill="none" opacity=".8" />
    </svg>
  ),
  LSystem: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="8" y1="14" x2="8" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="8" x2="4" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
      <line x1="8" y1="8" x2="12" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
      <line x1="4" y1="4" x2="2" y2="1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity=".6" />
      <line x1="4" y1="4" x2="6" y2="1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity=".6" />
      <line x1="12" y1="4" x2="10" y2="1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity=".6" />
      <line x1="12" y1="4" x2="14" y2="1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity=".6" />
    </svg>
  ),
  Kaleidoscope: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polygon points="8,2 14,14 2,14" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".7" />
      <polygon points="8,14 14,2 2,2" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".5" />
      <circle cx="8" cy="8" r="2" fill="currentColor" opacity=".8" />
    </svg>
  ),
  VoronoiCells: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1 L15 6 L15 14 L1 14 L1 6 Z" stroke="currentColor" strokeWidth="0.5" fill="none" opacity=".2" />
      <path d="M1 6 L8 1 L15 6 M8 14 L8 1 M1 6 L8 10 L15 6 M8 10 L8 14" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".7" />
      <circle cx="8" cy="1" r="1" fill="currentColor" opacity=".8" />
      <circle cx="1" cy="6" r="1" fill="currentColor" opacity=".8" />
      <circle cx="15" cy="6" r="1" fill="currentColor" opacity=".8" />
      <circle cx="8" cy="14" r="1" fill="currentColor" opacity=".8" />
    </svg>
  ),
  SlimeMold: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8 C3 5, 5 3, 8 3 C11 3, 13 5, 13 8" stroke="currentColor" strokeWidth="1" fill="none" opacity=".4" />
      <path d="M4 10 C5 7, 8 6, 11 7 C13 8, 13 11, 11 12 C9 13, 6 13, 4 12" stroke="currentColor" strokeWidth="1" fill="none" opacity=".6" />
      <path d="M6 8 C7 6, 9 6, 10 8 C11 10, 9 12, 7 11 C5 10, 5 9, 6 8" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".9" />
    </svg>
  ),
  InkBleed: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" fill="currentColor" />
      <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".5" />
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity=".25" />
      <path d="M8 6 C9 5, 11 5, 11 7" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
    </svg>
  ),
  WatercolorBloom: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="8" rx="5" ry="4" fill="currentColor" opacity=".2" />
      <ellipse cx="8" cy="8" rx="3.5" ry="3" fill="currentColor" opacity=".3" />
      <ellipse cx="7" cy="7" rx="2.5" ry="2" fill="currentColor" opacity=".5" />
      <ellipse cx="9" cy="9" rx="2" ry="1.5" fill="currentColor" opacity=".4" />
      <ellipse cx="8" cy="8" rx="1" ry="1" fill="currentColor" opacity=".8" />
    </svg>
  ),
  PendulaWave: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="3" y1="1" x2="3" y2="1" stroke="currentColor" strokeWidth="1" />
      <line x1="6" y1="1" x2="6" y2="1" stroke="currentColor" strokeWidth="1" />
      <path d="M3 1 L3 10" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".6" />
      <path d="M6 1 L7 8" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".6" />
      <path d="M9 1 L11 9" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".6" />
      <path d="M12 1 L14 11" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".6" />
      <circle cx="3" cy="10" r="1.5" fill="currentColor" opacity=".8" />
      <circle cx="7" cy="8" r="1.5" fill="currentColor" opacity=".8" />
      <circle cx="11" cy="9" r="1.5" fill="currentColor" opacity=".8" />
      <circle cx="14" cy="11" r="1.5" fill="currentColor" opacity=".8" />
    </svg>
  ),
  CrystalGrowth: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 8 L8 2 M8 8 L3 5 M8 8 L3 11 M8 8 L8 14 M8 8 L13 11 M8 8 L13 5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".7" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="2" r="1" fill="currentColor" opacity=".8" />
      <circle cx="3" cy="5" r="0.75" fill="currentColor" opacity=".6" />
      <circle cx="13" cy="5" r="0.75" fill="currentColor" opacity=".6" />
    </svg>
  ),
  NeuralWeb: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="3" cy="4" r="1" fill="currentColor" opacity=".7" />
      <circle cx="13" cy="4" r="1" fill="currentColor" opacity=".7" />
      <circle cx="3" cy="12" r="1" fill="currentColor" opacity=".7" />
      <circle cx="13" cy="12" r="1" fill="currentColor" opacity=".7" />
      <line x1="8" y1="8" x2="3" y2="4" stroke="currentColor" strokeWidth="0.75" opacity=".4" />
      <line x1="8" y1="8" x2="13" y2="4" stroke="currentColor" strokeWidth="0.75" opacity=".4" />
      <line x1="8" y1="8" x2="3" y2="12" stroke="currentColor" strokeWidth="0.75" opacity=".4" />
      <line x1="8" y1="8" x2="13" y2="12" stroke="currentColor" strokeWidth="0.75" opacity=".4" />
      <line x1="3" y1="4" x2="13" y2="4" stroke="currentColor" strokeWidth="0.5" opacity=".2" />
      <line x1="3" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="0.5" opacity=".2" />
    </svg>
  ),
  ParticleText: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="2" height="8" rx="0.5" fill="currentColor" opacity=".8" />
      <rect x="2" y="4" width="6" height="2" rx="0.5" fill="currentColor" opacity=".8" />
      <rect x="2" y="7.5" width="5" height="2" rx="0.5" fill="currentColor" opacity=".6" />
      <circle cx="11" cy="6" r="1" fill="currentColor" opacity=".5" />
      <circle cx="13" cy="8" r="0.75" fill="currentColor" opacity=".4" />
      <circle cx="12" cy="11" r="1" fill="currentColor" opacity=".5" />
      <circle cx="10" cy="13" r="0.75" fill="currentColor" opacity=".3" />
    </svg>
  ),
  Metaballs: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="8" r="3.5" fill="currentColor" opacity=".6" />
      <circle cx="10.5" cy="8" r="3" fill="currentColor" opacity=".6" />
      <circle cx="8" cy="5.5" r="2" fill="currentColor" opacity=".5" />
    </svg>
  ),
  AntColony: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="10" r="2" fill="currentColor" opacity=".7" />
      <ellipse cx="8" cy="6.5" rx="1.5" ry="2" fill="currentColor" opacity=".8" />
      <circle cx="8" cy="3.5" r="1.5" fill="currentColor" opacity=".9" />
      <line x1="6" y1="8" x2="3" y2="10" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".6" />
      <line x1="6" y1="8" x2="2" y2="7" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".6" />
      <line x1="10" y1="8" x2="13" y2="10" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".6" />
      <line x1="10" y1="8" x2="14" y2="7" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" opacity=".6" />
    </svg>
  ),
  MagneticField: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="5" cy="8" r="2" fill="currentColor" opacity=".9" />
      <circle cx="11" cy="8" r="2" fill="currentColor" opacity=".9" />
      <path d="M7 8 C7 5, 9 5, 9 8" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <path d="M7 8 C7 11, 9 11, 9 8" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <path d="M5 6 C3 3, 13 3, 11 6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity=".3" />
      <path d="M5 10 C3 13, 13 13, 11 10" stroke="currentColor" strokeWidth="0.5" fill="none" opacity=".3" />
    </svg>
  ),
  TerrainMesh: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <polyline points="1,12 4,7 7,9 10,5 13,8 15,6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".8" />
      <polyline points="1,14 4,10 7,12 10,8 13,11 15,9" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".4" />
      <line x1="4" y1="7" x2="4" y2="10" stroke="currentColor" strokeWidth="0.5" opacity=".3" />
      <line x1="10" y1="5" x2="10" y2="8" stroke="currentColor" strokeWidth="0.5" opacity=".3" />
    </svg>
  ),
  BlackHole: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" fill="currentColor" />
      <ellipse cx="8" cy="8" rx="6" ry="2" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <ellipse cx="8" cy="8" rx="7" ry="2.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity=".3" />
    </svg>
  ),
  GalaxySpiral: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 8 C8 5, 11 4, 13 6 C15 8, 13 11, 10 12 C7 13, 4 11, 3 8 C2 5, 4 3, 7 3 C9 3, 10 5, 9 7 C8 9, 6 9, 6 8" stroke="currentColor" strokeWidth="1" fill="none" opacity=".8" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity=".9" />
    </svg>
  ),
  TornadoVortex: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="3" rx="5" ry="1.5" stroke="currentColor" strokeWidth="1" fill="none" opacity=".8" />
      <ellipse cx="8" cy="7" rx="3" ry="1" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".6" />
      <ellipse cx="8" cy="10" rx="1.5" ry="0.75" stroke="currentColor" strokeWidth="0.75" fill="none" opacity=".4" />
      <line x1="3" y1="3" x2="6.5" y2="10" stroke="currentColor" strokeWidth="0.75" opacity=".5" />
      <line x1="13" y1="3" x2="9.5" y2="10" stroke="currentColor" strokeWidth="0.75" opacity=".5" />
      <line x1="8" y1="10" x2="8" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".7" />
    </svg>
  ),
  SolarFlare: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3.5" fill="currentColor" opacity=".9" />
      <path d="M8 4.5 C9 3, 11 2, 12 4 C13 6, 12 8, 10 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity=".7" />
      <path d="M8 4 C7 2, 5 1.5, 4 3 C3 5, 4 7, 6 7" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" fill="none" opacity=".5" />
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity=".2" />
    </svg>
  ),
};

const COMPONENT_META: Record<string, { desc: string; accent: string }> = {
  MatrixRain: { desc: "Falling character rain — Katakana, Latin, or binary", accent: "#00ff41" },
  ParticleField: { desc: "Particles with connections, repulsion, drag-to-move, twinkling, and glow", accent: "#8888ff" },
  Starfield: { desc: "2D twinkle or 3D warp-speed star tunnel", accent: "#b8bfff" },
  FireEffect: { desc: "Pixel-level fire simulation with 4 palettes", accent: "#ff6b35" },
  AudioVisualizer: { desc: "Real-time Web Audio API visualizer, 4 modes", accent: "#9ca3af" },
  Confetti: { desc: "Physics-based celebration burst or continuous rain", accent: "#ffd700" },
  NoiseGradient: { desc: "Animated Perlin noise color gradient", accent: "#38ef7d" },
  PixelDissolve: { desc: "Pixelated dissolve transition overlay for any content", accent: "#bf5fff" },
  FlowField: { desc: "Perlin noise vector field with particle streams", accent: "#9ca3af" },
  Spotlight: { desc: "Mouse-following light reveal over dark overlay", accent: "#e0b0ff" },
  Shockwave: { desc: "Click-triggered radial ring blast with glow", accent: "#9ca3af" },
  Fireworks: { desc: "Physics shells, burst particles, and gravity trails", accent: "#f59e0b" },
  GlitchOverlay: { desc: "CRT scanlines, RGB shift, and block glitch", accent: "#00ffff" },
  LiveChart: { desc: "Real-time animated line and area chart", accent: "#4ade80" },
  Mandala: { desc: "N-fold rotational symmetry with organic petal layers", accent: "#f43f5e" },
  MagneticBlob: { desc: "Metaballs that merge and follow the cursor", accent: "#a78bfa" },
  ClothSimulation: { desc: "Verlet spring-mass fabric with wind and tearing", accent: "#67e8f9" },
  FluidSimulation: { desc: "Navier-Stokes ink fluid reacting to mouse movement", accent: "#06b6d4" },
  Rain: { desc: "Rainfall with wind drift, drop streaks, and splash particles", accent: "#9ca3af" },
  Lightning: { desc: "Recursive fractal bolts with glow, flicker, and branches", accent: "#c084fc" },
  GameOfLife: { desc: "Conway's cellular automata — emergent life from simple rules", accent: "#00ff41" },
  Wormhole: { desc: "3D perspective tunnel with twisting rings and star field", accent: "#9ca3af" },
  Boids: { desc: "Craig Reynolds' flocking — separation, alignment, cohesion", accent: "#f59e0b" },
  DragonCursor: { desc: "Segmented dragon that follows the cursor with fire breath", accent: "#ff4500" },
  KoiPond: { desc: "Koi fish pond with ripples, lily pads, and caustic lighting", accent: "#67e8f9" },
  BubbleUniverse: { desc: "Iridescent bubbles that float, merge, and pop on click", accent: "#a5f3fc" },
  SakuraBlossom: { desc: "Cherry blossom petals drifting with wind and accumulation", accent: "#fda4af" },
  ReactionDiffusion: { desc: "Gray-Scott reaction-diffusion pattern formation", accent: "#d1d5db" },
  AuroraBorealis: { desc: "Animated northern lights with star background", accent: "#6ee7b7" },
  Spirograph: { desc: "Animated hypotrochoid curves with multi-layer support", accent: "#c4b5fd" },
  SandSimulation: { desc: "Falling-sand physics with sand, water, fire, and walls", accent: "#fbbf24" },
  WaveInterference: { desc: "Click to add wave sources and watch interference patterns", accent: "#7dd3fc" },
  DiffusionAggregation: { desc: "Diffusion-limited aggregation grows fractal crystal trees", accent: "#e2e8f0" },
  Lissajous: { desc: "Animated Lissajous figures with trail fade and color cycling", accent: "#a78bfa" },
  LSystem: { desc: "Lindenmayer system turtle-graphics fractals with presets", accent: "#86efac" },
  Kaleidoscope: { desc: "Perlin noise kaleidoscope with N-fold mirror symmetry", accent: "#f9a8d4" },
  VoronoiCells: { desc: "Animated Voronoi tessellation — click to add seeds", accent: "#fde68a" },
  SlimeMold: { desc: "Physarum polycephalum slime mold trail simulation", accent: "#d9f99d" },
  InkBleed: { desc: "Ink drop diffusion on paper — click to drop", accent: "#94a3b8" },
  WatercolorBloom: { desc: "Organic watercolor blooms with wet-edge and layering", accent: "#93c5fd" },
  PendulaWave: { desc: "Coupled harmonic pendula drawing Lissajous-like traces", accent: "#f0abfc" },
  CrystalGrowth: { desc: "Snowflake-like crystal growth with rotational symmetry", accent: "#bae6fd" },
  NeuralWeb: { desc: "Neural network graph with traveling signal pulses", accent: "#a3e635" },
  ParticleText: { desc: "Text sampled into particles that scatter from the cursor", accent: "#fb923c" },
  Metaballs: { desc: "Organic metaballs that merge and flow — drag to move", accent: "#34d399" },
  AntColony: { desc: "Ant colony optimization with pheromone trails", accent: "#fbbf24" },
  MagneticField: { desc: "Interactive magnetic dipoles with live field line rendering", accent: "#f87171" },
  TerrainMesh: { desc: "3D Perlin noise terrain wireframe with orbit control", accent: "#9ca3af" },
  BlackHole: { desc: "Accretion disk simulation with jets and gravitational lensing", accent: "#6b7280" },
  GalaxySpiral: { desc: "Spiral galaxy particle system with core glow", accent: "#c4b5fd" },
  TornadoVortex: { desc: "Tornado funnel with debris, lightning, and dust cloud", accent: "#d1d5db" },
  SolarFlare: { desc: "Animated sun with convection cells and CME flares", accent: "#fbbf24" },
};

type ComponentId =
  | "MatrixRain" | "FluidSimulation" | "FlowField" | "Boids"
  | "GlitchOverlay" | "PixelDissolve" | "Confetti" | "AudioVisualizer" | "Mandala"
  | "Spotlight" | "Starfield" | "NoiseGradient" | "Shockwave"
  | "Fireworks" | "Wormhole" | "ClothSimulation" | "MagneticBlob" | "GameOfLife"
  | "Rain" | "Lightning" | "FireEffect" | "LiveChart" | "ParticleField"
  | "DragonCursor" | "KoiPond" | "BubbleUniverse" | "SakuraBlossom"
  | "ReactionDiffusion" | "AuroraBorealis" | "Spirograph" | "SandSimulation"
  | "WaveInterference" | "DiffusionAggregation" | "Lissajous" | "LSystem"
  | "Kaleidoscope" | "VoronoiCells" | "SlimeMold" | "InkBleed"
  | "WatercolorBloom" | "PendulaWave" | "CrystalGrowth" | "NeuralWeb"
  | "ParticleText" | "Metaballs" | "AntColony" | "MagneticField"
  | "TerrainMesh" | "BlackHole" | "GalaxySpiral" | "TornadoVortex" | "SolarFlare";

const ALL_COMPONENTS: ComponentId[] = [
  "DragonCursor", "KoiPond", "MatrixRain", "FluidSimulation", "FlowField", "Boids",
  "GlitchOverlay", "PixelDissolve", "Confetti", "AudioVisualizer", "Mandala",
  "Spotlight", "Starfield", "NoiseGradient", "Shockwave",
  "Fireworks", "Wormhole", "BubbleUniverse", "SakuraBlossom",
  "ClothSimulation", "MagneticBlob", "GameOfLife",
  "Rain", "Lightning", "FireEffect", "LiveChart", "ParticleField",
  "ReactionDiffusion", "AuroraBorealis", "Spirograph", "SandSimulation",
  "WaveInterference", "DiffusionAggregation", "Lissajous", "LSystem",
  "Kaleidoscope", "VoronoiCells", "SlimeMold", "InkBleed",
  "WatercolorBloom", "PendulaWave", "CrystalGrowth", "NeuralWeb",
  "ParticleText", "Metaballs", "AntColony", "MagneticField",
  "TerrainMesh", "BlackHole", "GalaxySpiral", "TornadoVortex", "SolarFlare",
];

// ─── Control Widgets ─────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  const display = Number.isInteger(step) ? value.toFixed(0) : value.toFixed(2).replace(/\.?0+$/, "");
  return (
    <div className="ctl-row">
      <div className="ctl-label">
        <span>{label}</span>
        <span className="ctl-value">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="ctl-row">
      <div className="ctl-label"><span>{label}</span></div>
      <div className="ctl-color-wrap">
        <div className="ctl-color-btn" style={{ backgroundColor: value + "22" }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} title={label} />
        </div>
        <div className="ctl-color-hex">{value.toUpperCase()}</div>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="ctl-toggle-row">
      <span className="ctl-toggle-label">{label}</span>
      <button
        className={`toggle-track ${value ? "on" : "off"}`}
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        aria-label={label}
      >
        <div className="toggle-thumb" />
      </button>
    </div>
  );
}

function Sel<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: T[]; onChange: (v: T) => void;
}) {
  return (
    <div className="ctl-row">
      <div className="ctl-label"><span>{label}</span></div>
      <select className="ctl-select" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Divider() { return <div className="ctl-divider" />; }

// ─── Code context ─────────────────────────────────────────────────────────────
interface CodeContextValue { code: string; setCode: (c: string) => void; showCode: boolean; setShowCode: (v: boolean) => void; }
const CodeContext = React.createContext<CodeContextValue>({ code: "", setCode: () => {}, showCode: false, setShowCode: () => {} });

// ─── Code snippet ─────────────────────────────────────────────────────────────
function CodeSnippet({ code }: { code: string }) {
  const { setCode } = React.useContext(CodeContext);
  React.useEffect(() => { setCode(code); }, [code, setCode]);
  return null;
}

function ColoredLine({ line }: { line: string }) {
  if (line.startsWith("import")) {
    const parts = line.split(/(\{[^}]+\}|'[^']+'|from)/g);
    return (
      <div>
        {parts.map((p, i) => {
          if (p === "from") return <span key={i} className="tok-kw">from</span>;
          if (p.startsWith("'")) return <span key={i} className="tok-str">{p}</span>;
          if (p.startsWith("{")) return <span key={i} className="tok-fn">{p}</span>;
          return <span key={i} className="tok-dim">{p}</span>;
        })}
      </div>
    );
  }
  if (line.trim() === "") return <div>&nbsp;</div>;
  if (line.includes("//")) {
    const [before, ...rest] = line.split("//");
    return (
      <div>
        <span className="tok-dim">{before}</span>
        <span className="tok-cmt">//{rest.join("//")}</span>
      </div>
    );
  }
  // JSX lines
  const jsxParts = line.split(/(<\/?[\w]+|\/?>|[\w]+=\{|[\w]+="[^"]*"|\{[^}]+\}|"[^"]*")/g);
  return (
    <div>
      {jsxParts.map((p, i) => {
        if (p.startsWith("</") || p.startsWith("<")) return <span key={i} className="tok-tag">{p}</span>;
        if (p === "/>" || p === ">") return <span key={i} className="tok-tag">{p}</span>;
        if (p.endsWith("={")) {
          const attr = p.slice(0, -2);
          return <span key={i}><span className="tok-attr">{attr}</span><span className="tok-dim">{"={"}</span></span>;
        }
        if (p.includes('="')) {
          const [a, ...v] = p.split('="');
          return <span key={i}><span className="tok-attr">{a}</span><span className="tok-dim">="</span><span className="tok-val">{v.join('="')}</span></span>;
        }
        if (p.startsWith("{") && p.endsWith("}")) return <span key={i} className="tok-val">{p}</span>;
        if (p.startsWith('"')) return <span key={i} className="tok-str">{p}</span>;
        return <span key={i} className="tok-dim">{p}</span>;
      })}
    </div>
  );
}

// ─── Code modal ──────────────────────────────────────────────────────────────
function CodeModal({ code, onClose }: { code: string; onClose: () => void }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  function copy() {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="code-modal-backdrop" onClick={onClose}>
      <div className="code-modal-card" onClick={e => e.stopPropagation()}>
        <div className="code-modal-header">
          <span className="code-block-title">Usage</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className={`code-copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
              {copied ? "Copied!" : "Copy"}
            </button>
            <button className="code-modal-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </div>
        <pre className="code-pre" style={{ maxHeight: "75vh", overflowY: "auto" }}>
          {code.split("\n").map((line, i) => <ColoredLine key={i} line={line} />)}
        </pre>
      </div>
    </div>
  );
}

// ─── Component Control Panels ─────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function MatrixRainPanel() {
  const [color, setColor] = useState("#fff");
  const [bgColor, setBgColor] = useState("#111111");
  const [trailOpacity, setTrailOpacity] = useState(0.1);
  const [fontSize, setFontSize] = useState(14);
  const [speed, setSpeed] = useState(33);
  const [charset, setCharset] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  const [resetThreshold, setResetThreshold] = useState(0.95);

  const code = `import { MatrixRain } from 'own-the-canvas';

<MatrixRain
  color="${color}"
  fontSize={${fontSize}}
  speed={${speed}}
  charset="${charset}"
  resetThreshold={${resetThreshold}}
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <MatrixRain color={color} fontSize={fontSize} speed={speed}
            charset={charset} resetThreshold={resetThreshold}
            backgroundColor={hexToRgba(bgColor, trailOpacity)} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="MatrixRain" />
        <div className="ctrl-body">
          <div className="ctl-section">
            <ColorPicker label="Color" value={color} onChange={setColor} />
            <ColorPicker label="Background" value={bgColor} onChange={setBgColor} />
            <Slider label="Trail opacity" value={trailOpacity} min={0.02} max={0.5} step={0.01} onChange={setTrailOpacity} />
            <Slider label="Font size" value={fontSize} min={8} max={36} step={1} onChange={setFontSize} />
            <Slider label="Speed (ms/frame)" value={speed} min={10} max={200} step={1} onChange={setSpeed} />
            <Slider label="Reset threshold" value={resetThreshold} min={0.5} max={0.99} step={0.01} onChange={setResetThreshold} />
          </div>
          <Divider />
          <div className="ctrl-row">
            <label className="ctrl-label">Characters</label>
            <input
              className="ctrl-text-input"
              value={charset}
              onChange={e => e.target.value.length > 0 && setCharset(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function ParticleFieldPanel() {
  const [pc, setPc] = useState("#ffffff");
  const [lc, setLc] = useState("#6b7280");
  const [bg, setBg] = useState("transparent");
  const [count, setCount] = useState(120);
  const [dist, setDist] = useState(120);
  const [size, setSize] = useState(2.5);
  const [speed, setSpeed] = useState(0.8);
  const [connect, setConnect] = useState(true);
  const [interact, setInteract] = useState(true);
  const [wrapEdges, setWrapEdges] = useState(false);
  const [twinkle, setTwinkle] = useState(false);
  const [glowParticles, setGlowParticles] = useState(false);
  const [lineStyle, setLineStyle] = useState<ParticleLineStyle>("solid");
  const [dragParticles, setDragParticles] = useState(false);
  const [lineOpacity, setLineOpacity] = useState(0.5);
  const [velocityMultiplier, setVelocityMultiplier] = useState(1);
  const [preset, setPreset] = useState("default");

  const code = `import { ParticleField } from 'own-the-canvas';

<ParticleField
  preset="${preset}"
  particleCount={${count}}
  particleColor="${pc}"
  lineDistance={${dist}}
  lineOpacity={${lineOpacity}}
  connectParticles={${connect}}
  interactive={${interact}}${wrapEdges ? `\n  wrapEdges={true}` : ""}${twinkle ? `\n  twinkle={true}` : ""}${glowParticles ? `\n  glowParticles={true}` : ""}${lineStyle !== "solid" ? `\n  lineStyle="${lineStyle}"` : ""}${dragParticles ? `\n  dragParticles={true}` : ""}
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <ParticleField preset={preset} particleColor={pc} lineColor={lc}
            particleCount={count} lineDistance={dist} particleSize={size}
            speed={speed} connectParticles={connect} interactive={interact}
            backgroundColor={bg} wrapEdges={wrapEdges} twinkle={twinkle}
            glowParticles={glowParticles} lineStyle={lineStyle}
            dragParticles={dragParticles} lineOpacity={lineOpacity}
            velocityMultiplier={velocityMultiplier} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>{dragParticles ? "Drag particles to reposition" : "Move cursor to repel"}</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="ParticleField" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "network", "stars", "fireflies", "minimal"]} onChange={setPreset} />
          <Divider />
          <div className="ctl-section">
            <ColorPicker label="Particle color" value={pc} onChange={setPc} />
            <ColorPicker label="Line color" value={lc} onChange={setLc} />
            <ColorPicker label="Background" value={bg} onChange={setBg} />
            <Slider label="Count" value={count} min={20} max={400} step={10} onChange={setCount} />
            <Slider label="Line distance" value={dist} min={40} max={250} step={5} onChange={setDist} />
            <Slider label="Line opacity" value={lineOpacity} min={0} max={1} step={0.05} onChange={setLineOpacity} />
            <Slider label="Particle size" value={size} min={0.5} max={8} step={0.5} onChange={setSize} />
            <Slider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
            <Slider label="Velocity multiplier" value={velocityMultiplier} min={0.1} max={3} step={0.1} onChange={setVelocityMultiplier} />
          </div>
          <Divider />
          <Toggle label="Connect particles" value={connect} onChange={setConnect} />
          <Toggle label="Mouse repulsion" value={interact} onChange={setInteract} />
          <Toggle label="Drag to move" value={dragParticles} onChange={setDragParticles} />
          <Divider />
          <Toggle label="Wrap edges" value={wrapEdges} onChange={setWrapEdges} />
          <Toggle label="Twinkle" value={twinkle} onChange={setTwinkle} />
          <Toggle label="Particle glow" value={glowParticles} onChange={setGlowParticles} />
          <Sel label="Line style" value={lineStyle} options={["solid", "dashed"]} onChange={setLineStyle} />
        </div>
      </div>
    </>
  );
}

function StarfieldPanel() {
  const [count, setCount] = useState(200);
  const [speed, setSpeed] = useState(0.5);
  const [bg, setBg] = useState("#111111");
  const [twinkle, setTwinkle] = useState(true);
  const [shooting, setShooting] = useState(true);
  const [persp, setPersp] = useState<StarfieldPerspective>("2D");
  const [preset, setPreset] = useState("default");
  const [starColor, setStarColor] = useState("#ffffff");
  const [shootingStarColor, setShootingStarColor] = useState("#ffffff");
  const [shootingStarInterval, setShootingStarInterval] = useState(3000);
  const [starSizeMin, setStarSizeMin] = useState(0.3);
  const [starSizeMax, setStarSizeMax] = useState(2.8);
  const [starOpacityMin, setStarOpacityMin] = useState(0.3);
  const [starOpacityMax, setStarOpacityMax] = useState(1);
  const [twinkleSpeed, setTwinkleSpeed] = useState(0.03);
  const [shootingStarLength, setShootingStarLength] = useState(80);

  const code = `import { Starfield } from 'own-the-canvas';

<Starfield
  preset="${preset}"
  starCount={${count}}
  speed={${speed}}
  perspective="${persp}"
  twinkle={${twinkle}}
  shootingStars={${shooting}}
  starColor="${starColor}"
  shootingStarColor="${shootingStarColor}"
  shootingStarInterval={${shootingStarInterval}}
  starSizeMin={${starSizeMin}}
  starSizeMax={${starSizeMax}}
  starOpacityMin={${starOpacityMin}}
  starOpacityMax={${starOpacityMax}}
  twinkleSpeed={${twinkleSpeed}}
  shootingStarLength={${shootingStarLength}}
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Starfield preset={preset} starCount={count} backgroundColor={bg} speed={speed}
            twinkle={twinkle} shootingStars={shooting} perspective={persp}
            starColor={starColor} shootingStarColor={shootingStarColor}
            shootingStarInterval={shootingStarInterval}
            starSizeMin={starSizeMin} starSizeMax={starSizeMax}
            starOpacityMin={starOpacityMin} starOpacityMax={starOpacityMax}
            twinkleSpeed={twinkleSpeed} shootingStarLength={shootingStarLength}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Starfield" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "warp", "peaceful", "minimal", "nebula"]} onChange={setPreset} />
          <Sel label="Perspective" value={persp} options={["2D", "3D"]} onChange={setPersp} />
          <Divider />
          <div className="ctl-section">
            <ColorPicker label="Background" value={bg} onChange={setBg} />
            <ColorPicker label="Star color" value={starColor} onChange={setStarColor} />
            <ColorPicker label="Shooting star color" value={shootingStarColor} onChange={setShootingStarColor} />
            <Slider label="Star count" value={count} min={50} max={800} step={50} onChange={setCount} />
            <Slider label="Speed" value={speed} min={0.1} max={8} step={0.1} onChange={setSpeed} />
            <Slider label="Shooting star interval (ms)" value={shootingStarInterval} min={500} max={8000} step={500} onChange={setShootingStarInterval} />
            <Slider label="Star size min" value={starSizeMin} min={0.1} max={3} step={0.1} onChange={setStarSizeMin} />
            <Slider label="Star size max" value={starSizeMax} min={0.5} max={8} step={0.1} onChange={setStarSizeMax} />
            <Slider label="Star opacity min" value={starOpacityMin} min={0} max={1} step={0.05} onChange={setStarOpacityMin} />
            <Slider label="Star opacity max" value={starOpacityMax} min={0} max={1} step={0.05} onChange={setStarOpacityMax} />
            <Slider label="Twinkle speed" value={twinkleSpeed} min={0.01} max={0.1} step={0.005} onChange={setTwinkleSpeed} />
            <Slider label="Shooting star length" value={shootingStarLength} min={50} max={300} step={10} onChange={setShootingStarLength} />
          </div>
          <Divider />
          <Toggle label="Twinkle" value={twinkle} onChange={setTwinkle} />
          <Toggle label="Shooting stars" value={shooting} onChange={setShooting} />
        </div>
      </div>
    </>
  );
}

function FireEffectPanel() {
  const [palette, setPalette] = useState<FirePalette>("smoke");
  const [intensity, setIntensity] = useState(0.95);
  const [wind, setWind] = useState(0.3);
  const [spread, setSpread] = useState(0.7);
  const [cooling, setCooling] = useState(0.3);
  const [preset, setPreset] = useState("default");
  const [windDirection, setWindDirection] = useState(1);
  const [noiseStrength, setNoiseStrength] = useState(60);
  const [coolingScale, setCoolingScale] = useState(5);
  const [resolution, setResolution] = useState(1);

  const code = `import { FireEffect } from 'own-the-canvas';

<FireEffect
  preset="${preset}"
  palette="${palette}"
  intensity={${intensity}}
  windStrength={${wind}}
  spread={${spread}}
  cooling={${cooling}}
  windDirection={${windDirection}}
  noiseStrength={${noiseStrength}}
  coolingScale={${coolingScale}}
  resolution={${resolution}}
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <FireEffect preset={preset} palette={palette} intensity={intensity}
            windStrength={wind} spread={spread} cooling={cooling}
            windDirection={windDirection} noiseStrength={noiseStrength}
            coolingScale={coolingScale} resolution={resolution}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Pixel simulation</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="FireEffect" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "inferno", "toxic", "ice", "plasma"]} onChange={setPreset} />
          <Sel label="Palette" value={palette} options={["smoke", "inferno", "toxic", "ice", "plasma"]} onChange={setPalette} />
          <Divider />
          <div className="ctl-section">
            <Slider label="Intensity" value={intensity} min={0.1} max={1} step={0.05} onChange={setIntensity} />
            <Slider label="Wind strength" value={wind} min={0} max={1} step={0.05} onChange={setWind} />
            <Slider label="Wind direction" value={windDirection} min={-1} max={1} step={0.1} onChange={setWindDirection} />
            <Slider label="Spread" value={spread} min={0} max={1} step={0.05} onChange={setSpread} />
            <Slider label="Cooling" value={cooling} min={0.05} max={0.8} step={0.05} onChange={setCooling} />
            <Slider label="Noise strength" value={noiseStrength} min={0} max={100} step={5} onChange={setNoiseStrength} />
            <Slider label="Cooling scale" value={coolingScale} min={0.1} max={10} step={0.5} onChange={setCoolingScale} />
            <Slider label="Resolution" value={resolution} min={0.25} max={1} step={0.05} onChange={setResolution} />
          </div>
        </div>
      </div>
    </>
  );
}

function AudioVisualizerPanel() {
  const [mode, setMode] = useState<VisualizerMode>("bars");
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#050010");
  const [barCount, setBarCount] = useState(64);
  const [sensitivity, setSensitivity] = useState(1);
  const [gap, setGap] = useState(2);
  const [rounded, setRounded] = useState(true);
  const [gradient, setGradient] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [preset, setPreset] = useState("default");
  const [gradientEndColor, setGradientEndColor] = useState("#6366f1");
  const [glowEffect, setGlowEffect] = useState(false);
  const [glowColor, setGlowColor] = useState("#ffffff");
  const [glowBlur, setGlowBlur] = useState(20);
  const [fftSizeStr, setFftSizeStr] = useState("1024");
  const [idleAmplitude, setIdleAmplitude] = useState(0.15);
  const [idleAnimationSpeed, setIdleAnimationSpeed] = useState(1);

  async function toggleMic() {
    if (micActive) {
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null); setMicActive(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(s); setMicActive(true);
      } catch { alert("Mic access denied"); }
    }
  }

  const code = `import { AudioVisualizer } from 'own-the-canvas';
// const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

<AudioVisualizer
  preset="${preset}"
  audioSource={stream}
  mode="${mode}"
  barCount={${barCount}}
  barColor="${color}"
  sensitivity={${sensitivity}}
  gradient={${gradient}}
  gradientEndColor="${gradientEndColor}"
  glowEffect={${glowEffect}}
  glowColor="${glowColor}"
  glowBlur={${glowBlur}}
  fftSize={${fftSizeStr}}
  idleAmplitude={${idleAmplitude}}
  idleAnimationSpeed={${idleAnimationSpeed}}
/>`;

  return (
    <>
      <div className="canvas-wrap" style={{ background: "#030305" }}>
        <div className="canvas-wrap-inner">
          <AudioVisualizer preset={preset} audioSource={stream} mode={mode}
            barColor={color} waveColor={color} barCount={barCount}
            sensitivity={sensitivity} gapBetweenBars={gap}
            rounded={rounded} gradient={gradient}
            gradientEndColor={gradientEndColor}
            glowEffect={glowEffect} glowColor={glowColor} glowBlur={glowBlur}
            fftSize={Number(fftSizeStr)}
            idleAmplitude={idleAmplitude} idleAnimationSpeed={idleAnimationSpeed}
            backgroundColor={bg}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label">
          {micActive
            ? <span className="mic-badge"><span className="mic-dot" />Microphone active</span>
            : <><div className="canvas-dot" /><span>Idle animation — start mic to visualize</span></>
          }
        </div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="AudioVisualizer" />
        <div className="ctrl-body">
          <button
            className={`ctl-action-btn ${micActive ? "secondary" : "primary"}`}
            onClick={toggleMic}
          >
            {micActive ? "Stop microphone" : "Start microphone"}
          </button>
          <Sel label="Preset" value={preset} options={["default", "neon", "minimal", "fire", "ocean"]} onChange={setPreset} />
          <Sel label="Mode" value={mode} options={["bars", "wave", "circular", "mirror"]} onChange={setMode} />
          <Sel label="FFT size" value={fftSizeStr} options={["256", "512", "1024", "2048"]} onChange={setFftSizeStr} />
          <Divider />
          <div className="ctl-section">
            <ColorPicker label="Color" value={color} onChange={setColor} />
            <ColorPicker label="Gradient end color" value={gradientEndColor} onChange={setGradientEndColor} />
            <ColorPicker label="Glow color" value={glowColor} onChange={setGlowColor} />
            <ColorPicker label="Background" value={bg} onChange={setBg} />
            <Slider label="Bar count" value={barCount} min={16} max={256} step={8} onChange={setBarCount} />
            <Slider label="Sensitivity" value={sensitivity} min={0.2} max={3} step={0.1} onChange={setSensitivity} />
            <Slider label="Bar gap" value={gap} min={0} max={8} step={1} onChange={setGap} />
            <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={2} onChange={setGlowBlur} />
            <Slider label="Idle amplitude" value={idleAmplitude} min={0} max={0.5} step={0.02} onChange={setIdleAmplitude} />
            <Slider label="Idle animation speed" value={idleAnimationSpeed} min={0.1} max={3} step={0.1} onChange={setIdleAnimationSpeed} />
          </div>
          <Divider />
          <Toggle label="Rounded bars" value={rounded} onChange={setRounded} />
          <Toggle label="Gradient fill" value={gradient} onChange={setGradient} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
        </div>
      </div>
    </>
  );
}

function ConfettiPanel() {
  const [trigger, setTrigger] = useState(false);
  const [palette, setPalette] = useState<ConfettiPalette>("monochrome");
  const [count, setCount] = useState(150);
  const [spread, setSpread] = useState(0.8);
  const [gravity, setGravity] = useState(0.5);
  const [continuous, setContinuous] = useState(false);
  const [wind, setWind] = useState(0.5);
  const [preset, setPreset] = useState("default");
  const [duration, setDuration] = useState(3000);
  const [speedMin, setSpeedMin] = useState(2);
  const [speedMax, setSpeedMax] = useState(10);
  const [sizeMin, setSizeMin] = useState(4);
  const [sizeMax, setSizeMax] = useState(12);

  function fire() { setTrigger(false); setTimeout(() => setTrigger(true), 50); }

  const code = `import { Confetti } from 'own-the-canvas';
const [show, setShow] = useState(false);

// rising edge fires a burst
<Confetti
  preset="${preset}"
  trigger={show}
  palette="${palette}"
  particleCount={${count}}
  spread={${spread}}
  continuous={${continuous}}
  duration={${duration}}
  speedMin={${speedMin}}
  speedMax={${speedMax}}
  sizeMin={${sizeMin}}
  sizeMax={${sizeMax}}
/>`;

  return (
    <>
      <div className="canvas-wrap" style={{ position: "relative" }}>
        <div className="canvas-wrap-inner">
          <Confetti preset={preset} trigger={trigger} palette={palette} particleCount={count} spread={spread}
            gravity={gravity} continuous={continuous} wind={wind}
            duration={duration} speedMin={speedMin} speedMax={speedMax}
            sizeMin={sizeMin} sizeMax={sizeMax}
            width="100%" height="100%" />
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 3 }}>
          <button
            className="ctl-action-btn primary"
            style={{ pointerEvents: "all", fontSize: 15, padding: "12px 28px" }}
            onClick={fire}
          >
            Launch confetti
          </button>
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click button to burst</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Confetti" />
        <div className="ctrl-body">
          <button className="ctl-action-btn primary" onClick={fire}>Fire burst</button>
          <Divider />
          <Sel label="Preset" value={preset} options={["default", "celebration", "pastel", "gold"]} onChange={setPreset} />
          <Sel label="Palette" value={palette} options={["monochrome", "colorful"]} onChange={setPalette} />
          <Divider />
          <div className="ctl-section">
            <Slider label="Particle count" value={count} min={10} max={500} step={10} onChange={setCount} />
            <Slider label="Spread" value={spread} min={0.1} max={1} step={0.05} onChange={setSpread} />
            <Slider label="Gravity" value={gravity} min={0.1} max={2} step={0.1} onChange={setGravity} />
            <Slider label="Wind" value={wind} min={-3} max={3} step={0.1} onChange={setWind} />
            <Slider label="Duration (ms)" value={duration} min={1000} max={10000} step={500} onChange={setDuration} />
            <Slider label="Speed min" value={speedMin} min={1} max={10} step={0.5} onChange={setSpeedMin} />
            <Slider label="Speed max" value={speedMax} min={5} max={30} step={1} onChange={setSpeedMax} />
            <Slider label="Size min" value={sizeMin} min={2} max={15} step={1} onChange={setSizeMin} />
            <Slider label="Size max" value={sizeMax} min={5} max={30} step={1} onChange={setSizeMax} />
          </div>
          <Divider />
          <Toggle label="Continuous rain" value={continuous} onChange={setContinuous} />
        </div>
      </div>
    </>
  );
}


const NOISE_PRESETS: Record<string, string[]> = {
  "Monochrome": ["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"],
  "Deep Space": ["#0d0221", "#2d1b69", "#11998e", "#38ef7d"],
  "Sunset": ["#0f0c29", "#ff6b6b", "#ffd89b"],
  "Ocean": ["#0052d4", "#4364f7", "#6fb1fc"],
  "Plasma": ["#12002f", "#7b00d4", "#ff00ff", "#ff9900"],
  "Forest": ["#0a1628", "#1a5276", "#27ae60", "#f9e51b"],
};

function NoiseGradientPanel() {
  const [preset, setPreset] = useState("Monochrome");
  const [speed, setSpeed] = useState(0.3);
  const [scale, setScale] = useState(1);
  const [octaves, setOctaves] = useState(3);
  const [animated, setAnimated] = useState(true);
  const [persistence, setPersistence] = useState(0.5);
  const [resolution, setResolution] = useState(1);
  const colors = NOISE_PRESETS[preset];

  const code = `import { NoiseGradient } from 'own-the-canvas';

<NoiseGradient
  colors={${JSON.stringify(colors)}}
  speed={${speed}}
  scale={${scale}}
  octaves={${octaves}}
  animated={${animated}}
  persistence={${persistence}}
  resolution={${resolution}}
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <NoiseGradient colors={colors} speed={speed} scale={scale}
            persistence={persistence} resolution={resolution}
            octaves={octaves} animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Perlin noise — pure JS</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="NoiseGradient" />
        <div className="ctrl-body">
          <Sel label="Preset palette" value={preset}
            options={Object.keys(NOISE_PRESETS) as (keyof typeof NOISE_PRESETS)[]}
            onChange={setPreset} />
          <Divider />
          <div className="ctl-section">
            <Slider label="Speed" value={speed} min={0} max={2} step={0.05} onChange={setSpeed} />
            <Slider label="Scale" value={scale} min={0.2} max={5} step={0.1} onChange={setScale} />
            <Slider label="Octaves" value={octaves} min={1} max={6} step={1} onChange={setOctaves} />
            <Slider label="Persistence" value={persistence} min={0.1} max={1} step={0.05} onChange={setPersistence} />
            <Slider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setResolution} />
          </div>
          <Divider />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function PixelDissolvePanel() {
  const [pixelSize, setPixelSize] = useState(8);
  const [speed, setSpeed] = useState(0.5);
  const [dir, setDir] = useState<DissolveDirection>("out");
  const [trigger, setTrigger] = useState(false);
  const [color, setColor] = useState("#060608");
  const [progressMultiplier, setProgressMultiplier] = useState(1);
  const [dissolvePattern, setDissolvePattern] = useState<DissolvePattern>("random");

  function fire() { setTrigger(false); setTimeout(() => setTrigger(true), 50); }

  const code = `import { PixelDissolve } from 'own-the-canvas';

<PixelDissolve
  pixelSize={${pixelSize}}
  speed={${speed}}
  direction="${dir}"
  dissolvePattern="${dissolvePattern}"
  progressMultiplier={${progressMultiplier}}
  trigger={show}
>
  <YourContent />
</PixelDissolve>`;

  return (
    <>
      <div className="canvas-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#030308" }}>
        <PixelDissolve pixelSize={pixelSize} speed={speed}
          direction={dir} trigger={trigger} color={color}
          progressMultiplier={progressMultiplier} dissolvePattern={dissolvePattern}
          width={440} height={280}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#374151 0%,#6b7280 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" fill="white" fillOpacity=".15" stroke="white" strokeOpacity=".3" strokeWidth="1.5" />
              <rect x="8" y="12" width="4" height="8" rx="1" fill="white" />
              <rect x="14" y="8" width="4" height="12" rx="1" fill="white" fillOpacity=".7" />
              <rect x="20" y="15" width="4" height="5" rx="1" fill="white" fillOpacity=".5" />
            </svg>
            <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: 3, fontFamily: "inherit" }}>DISSOLVE</span>
            <span style={{ fontSize: 12, opacity: 0.5, fontFamily: "inherit" }}>own-the-canvas</span>
          </div>
        </PixelDissolve>
        <div className="canvas-label" style={{ zIndex: 4 }}><div className="canvas-dot" /><span>Click "Trigger" in controls</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="PixelDissolve" />
        <div className="ctrl-body">
          <button className="ctl-action-btn primary" onClick={fire}>Trigger dissolve</button>
          <Divider />
          <Sel label="Direction" value={dir} options={["out", "in", "both"]} onChange={setDir} />
          <Sel label="Dissolve pattern" value={dissolvePattern} options={["random", "center", "edges", "horizontal"]} onChange={(v) => setDissolvePattern(v as DissolvePattern)} />
          <div className="ctl-section">
            <ColorPicker label="Pixel color" value={color} onChange={setColor} />
            <Slider label="Pixel size" value={pixelSize} min={2} max={32} step={1} onChange={setPixelSize} />
            <Slider label="Speed" value={speed} min={0.1} max={2} step={0.1} onChange={setSpeed} />
            <Slider label="Progress multiplier" value={progressMultiplier} min={0.5} max={3} step={0.1} onChange={setProgressMultiplier} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── New component panels ─────────────────────────────────────────────────────
function FlowFieldPanel() {
  const [preset, setPreset] = useState("default");
  const [count, setCount] = useState(800);
  const [speed, setSpeed] = useState(1);
  const [curl, setCurl] = useState(false);
  const [lineWidth, setLineWidth] = useState(1);
  const [bg, setBg] = useState("#111111");
  const [noiseScale, setNoiseScale] = useState(2);
  const [trailLength, setTrailLength] = useState(40);
  const [fadeStrength, setFadeStrength] = useState(0.05);
  const [animated, setAnimated] = useState(true);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const code = `import { FlowField } from 'own-the-canvas';

<FlowField
  preset="${preset}"
  particleCount={${count}}
  speed={${speed}}
  curl={${curl}}
  lineWidth={${lineWidth}}
  noiseScale={${noiseScale}}
  trailLength={${trailLength}}
  fadeStrength={${fadeStrength}}
  animated={${animated}}
  timeSpeed={${timeSpeed}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <FlowField preset={preset} particleCount={count} speed={speed} curl={curl} lineWidth={lineWidth}
            noiseScale={noiseScale} trailLength={trailLength} fadeStrength={fadeStrength}
            animated={animated} timeSpeed={timeSpeed}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="FlowField" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "ocean", "lava", "forest", "monochrome"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Particle count" value={count} min={100} max={2000} step={100} onChange={setCount} />
          <Slider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.5} onChange={setLineWidth} />
          <Slider label="Noise scale" value={noiseScale} min={0.5} max={5} step={0.1} onChange={setNoiseScale} />
          <Slider label="Trail length" value={trailLength} min={10} max={100} step={5} onChange={setTrailLength} />
          <Slider label="Fade strength" value={fadeStrength} min={0.01} max={0.2} step={0.01} onChange={setFadeStrength} />
          <Slider label="Time speed" value={timeSpeed} min={0.1} max={3} step={0.1} onChange={setTimeSpeed} />
          <Toggle label="Curl noise" value={curl} onChange={setCurl} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function SpotlightPanel() {
  const [preset, setPreset] = useState("default");
  const [radius, setRadius] = useState(120);
  const [opacity, setOpacity] = useState(0.75);
  const [softness, setSoftness] = useState(0.4);
  const [glow, setGlow] = useState(true);
  const [glowColor, setGlowColor] = useState("#6b7280");
  const [overlayColor, setOverlayColor] = useState("#000000");
  const [color, setColor] = useState("#ffffff");
  const [followSpeed, setFollowSpeed] = useState(0.1);
  const [shape, setShape] = useState<"circle" | "ellipse">("circle");
  const [ellipseRatio, setEllipseRatio] = useState(0.6);
  const [interactive, setInteractive] = useState(true);
  const [glowSize, setGlowSize] = useState(40);
  const code = `import { Spotlight } from 'own-the-canvas';

<div style={{ position: "relative" }}>
  <YourContent />
  <Spotlight
    preset="${preset}"
    radius={${radius}}
    overlayOpacity={${opacity}}
    shape="${shape}"
    showGlow={${glow}}
    interactive={${interactive}}
    style={{ position: "absolute", inset: 0 }}
  />
</div>`;
  return (
    <>
      <div className="canvas-wrap" style={{ position: "relative" }}>
        <div className="canvas-wrap-inner" style={{ background: "linear-gradient(135deg,#0a0015 0%,#050020 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#fff", padding: 40, pointerEvents: "none", userSelect: "none" }}>
            <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: -2, marginBottom: 12 }}>Move cursor</div>
            <div style={{ fontSize: 18, opacity: 0.4 }}>The spotlight follows your mouse</div>
          </div>
          <Spotlight preset={preset} radius={radius} overlayColor={overlayColor} overlayOpacity={opacity} edgeSoftness={softness} showGlow={glow} glowColor={glowColor} color={color} followSpeed={followSpeed} shape={shape} ellipseRatio={ellipseRatio} interactive={interactive} glowSize={glowSize} style={{ position: "absolute", inset: 0 }} />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor over canvas</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Spotlight" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "soft", "dramatic", "neon", "ellipse"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Overlay color" value={overlayColor} onChange={setOverlayColor} />
          <ColorPicker label="Glow color" value={glowColor} onChange={setGlowColor} />
          <ColorPicker label="Spotlight tint" value={color} onChange={setColor} />
          <Slider label="Radius" value={radius} min={40} max={300} step={10} onChange={setRadius} />
          <Slider label="Overlay opacity" value={opacity} min={0.1} max={0.98} step={0.02} onChange={setOpacity} />
          <Slider label="Edge softness" value={softness} min={0} max={1} step={0.05} onChange={setSoftness} />
          <Slider label="Follow speed" value={followSpeed} min={0.01} max={1} step={0.01} onChange={setFollowSpeed} />
          {shape === "ellipse" && <Slider label="Ellipse ratio" value={ellipseRatio} min={0.2} max={1} step={0.05} onChange={setEllipseRatio} />}
          <Sel label="Shape" value={shape} options={["circle", "ellipse"]} onChange={(v) => setShape(v as "circle" | "ellipse")} />
          <Slider label="Glow size" value={glowSize} min={0} max={100} step={5} onChange={setGlowSize} />
          <Toggle label="Show glow ring" value={glow} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function ShockwavePanel() {
  const [preset, setPreset] = useState("default");
  const [ringCount, setRingCount] = useState(3);
  const [speed, setSpeed] = useState(4);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [glow, setGlow] = useState(true);
  const [autoFire, setAutoFire] = useState(false);
  const [secondaryColor, setSecondaryColor] = useState("#6366f1");
  const [ringSpacing, setRingSpacing] = useState(20);
  const [maxRadius, setMaxRadius] = useState(200);
  const [lineWidth, setLineWidth] = useState(2);
  const [fadeSpeed, setFadeSpeed] = useState(0.03);
  const [glowBlur, setGlowBlur] = useState(10);
  const code = `import { Shockwave } from 'own-the-canvas';

<Shockwave
  preset="${preset}"
  ringCount={${ringCount}}
  speed={${speed}}
  color="${color}"
  secondaryColor="${secondaryColor}"
  ringSpacing={${ringSpacing}}
  maxRadius={${maxRadius}}
  lineWidth={${lineWidth}}
  fadeSpeed={${fadeSpeed}}
  glowEffect={${glow}}
  glowBlur={${glowBlur}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Shockwave preset={preset} ringCount={ringCount} speed={speed} color={color}
            secondaryColor={secondaryColor} ringSpacing={ringSpacing} maxRadius={maxRadius}
            lineWidth={lineWidth} fadeSpeed={fadeSpeed}
            backgroundColor={bg} glowEffect={glow} glowBlur={glowBlur}
            autoFire={autoFire} autoInterval={1500} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click anywhere to fire</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Shockwave" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "explosion", "ripple", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Ring color" value={color} onChange={setColor} />
          <ColorPicker label="Secondary color" value={secondaryColor} onChange={setSecondaryColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Ring count" value={ringCount} min={1} max={8} step={1} onChange={setRingCount} />
          <Slider label="Speed" value={speed} min={1} max={12} step={0.5} onChange={setSpeed} />
          <Slider label="Ring spacing" value={ringSpacing} min={5} max={50} step={5} onChange={setRingSpacing} />
          <Slider label="Max radius" value={maxRadius} min={50} max={500} step={25} onChange={setMaxRadius} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={5} step={0.25} onChange={setLineWidth} />
          <Slider label="Fade speed" value={fadeSpeed} min={0.01} max={0.1} step={0.005} onChange={setFadeSpeed} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={2} onChange={setGlowBlur} />
          <Toggle label="Glow effect" value={glow} onChange={setGlow} />
          <Toggle label="Auto-fire" value={autoFire} onChange={setAutoFire} />
        </div>
      </div>
    </>
  );
}

function FireworksPanel() {
  const [preset, setPreset] = useState("default");
  const [count, setCount] = useState(80);
  const [gravity, setGravity] = useState(0.08);
  const [spread, setSpread] = useState(5);
  const [bg, setBg] = useState("#111111");
  const [autoLaunch, setAutoLaunch] = useState(true);
  const [glow, setGlow] = useState(true);
  const [friction, setFriction] = useState(0.98);
  const [fadeSpeed, setFadeSpeed] = useState(0.008);
  const [particleSize, setParticleSize] = useState(2.5);
  const [trailLength, setTrailLength] = useState(15);
  const [autoInterval, setAutoInterval] = useState(1500);
  const [glowBlur, setGlowBlur] = useState(8);
  const [shellSpeed, setShellSpeed] = useState(10);
  const code = `import { Fireworks } from 'own-the-canvas';

<Fireworks
  preset="${preset}"
  particleCount={${count}}
  gravity={${gravity}}
  autoLaunch={${autoLaunch}}
  friction={${friction}}
  fadeSpeed={${fadeSpeed}}
  particleSize={${particleSize}}
  trailLength={${trailLength}}
  autoInterval={${autoInterval}}
  glowBlur={${glowBlur}}
  shellSpeed={${shellSpeed}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Fireworks preset={preset} particleCount={count} gravity={gravity} spread={spread}
            friction={friction} fadeSpeed={fadeSpeed} particleSize={particleSize}
            trailLength={trailLength} autoInterval={autoInterval} glowBlur={glowBlur}
            shellSpeed={shellSpeed}
            backgroundColor={bg} autoLaunch={autoLaunch} glowEffect={glow} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to launch a shell</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Fireworks" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "celebration", "subtle", "neon", "golden"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Particle count" value={count} min={20} max={200} step={10} onChange={setCount} />
          <Slider label="Gravity" value={gravity} min={0.01} max={0.3} step={0.01} onChange={setGravity} />
          <Slider label="Spread" value={spread} min={2} max={10} step={0.5} onChange={setSpread} />
          <Slider label="Friction" value={friction} min={0.95} max={1.0} step={0.005} onChange={setFriction} />
          <Slider label="Fade speed" value={fadeSpeed} min={0.001} max={0.02} step={0.001} onChange={setFadeSpeed} />
          <Slider label="Particle size" value={particleSize} min={1} max={6} step={0.5} onChange={setParticleSize} />
          <Slider label="Trail length" value={trailLength} min={5} max={30} step={1} onChange={setTrailLength} />
          <Slider label="Auto interval (ms)" value={autoInterval} min={500} max={5000} step={250} onChange={setAutoInterval} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={2} onChange={setGlowBlur} />
          <Slider label="Shell speed" value={shellSpeed} min={5} max={20} step={1} onChange={setShellSpeed} />
          <Toggle label="Auto-launch" value={autoLaunch} onChange={setAutoLaunch} />
          <Toggle label="Glow effect" value={glow} onChange={setGlow} />
        </div>
      </div>
    </>
  );
}

function GlitchOverlayPanel() {
  const [preset, setPreset] = useState("default");
  const [intensity, setIntensity] = useState(0.6);
  const [speed, setSpeed] = useState(1);
  const [rgbShift, setRgbShift] = useState(8);
  const [bg, setBg] = useState("#111111");
  const [color, setColor] = useState("#ffffff");
  const [scanlines, setScanlines] = useState(true);
  const [blockGlitch, setBlockGlitch] = useState(true);
  const [noiseOpacity, setNoiseOpacity] = useState(0.02);
  const [flickerRate, setFlickerRate] = useState(0.02);
  const [animated, setAnimated] = useState(true);
  const [scanlineOpacity, setScanlineOpacity] = useState(0.1);
  const [scanlineSpacing, setScanlineSpacing] = useState(3);
  const [blockCount, setBlockCount] = useState(6);
  const [rgbShiftColor, setRgbShiftColor] = useState("#ff0000");
  const code = `import { GlitchOverlay } from 'own-the-canvas';

<div style={{ position: "relative" }}>
  <YourContent />
  <GlitchOverlay
    preset="${preset}"
    intensity={${intensity}}
    speed={${speed}}
    rgbShift={${rgbShift}}
    animated={${animated}}
    style={{ position: "absolute", inset: 0 }}
  />
</div>`;
  return (
    <>
      <div className="canvas-wrap" style={{ position: "relative" }}>
        <div className="canvas-wrap-inner" style={{ background: "#111111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#fff", fontFamily: "monospace", userSelect: "none" }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>GLITCH</div>
            <div style={{ fontSize: 14, opacity: 0.4, letterSpacing: 6 }}>OVERLAY EFFECT</div>
          </div>
          <GlitchOverlay preset={preset} intensity={intensity} speed={speed} rgbShift={rgbShift} color={color} scanlines={scanlines} scanlineOpacity={scanlineOpacity} scanlineSpacing={scanlineSpacing} blockGlitch={blockGlitch} blockCount={blockCount} noiseOpacity={noiseOpacity} flickerRate={flickerRate} rgbShiftColor={rgbShiftColor} animated={animated} backgroundColor={bg} style={{ position: "absolute", inset: 0 }} />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Overlay composited on content</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="GlitchOverlay" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "crt", "cyberpunk", "subtle", "corrupt"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <ColorPicker label="Glitch color" value={color} onChange={setColor} />
          <Slider label="Intensity" value={intensity} min={0} max={1} step={0.05} onChange={setIntensity} />
          <Slider label="Speed" value={speed} min={0.1} max={3} step={0.1} onChange={setSpeed} />
          <Slider label="RGB shift" value={rgbShift} min={0} max={40} step={1} onChange={setRgbShift} />
          <Slider label="Noise opacity" value={noiseOpacity} min={0} max={0.1} step={0.005} onChange={setNoiseOpacity} />
          <Slider label="Flicker rate" value={flickerRate} min={0} max={0.1} step={0.005} onChange={setFlickerRate} />
          <Slider label="Scanline opacity" value={scanlineOpacity} min={0} max={0.5} step={0.02} onChange={setScanlineOpacity} />
          <Slider label="Scanline spacing" value={scanlineSpacing} min={1} max={8} step={1} onChange={setScanlineSpacing} />
          <Slider label="Block count" value={blockCount} min={1} max={20} step={1} onChange={setBlockCount} />
          <ColorPicker label="RGB shift color" value={rgbShiftColor} onChange={setRgbShiftColor} />
          <Toggle label="Scanlines" value={scanlines} onChange={setScanlines} />
          <Toggle label="Block glitch" value={blockGlitch} onChange={setBlockGlitch} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function LiveChartPanel() {
  const [preset, setPreset] = useState("default");
  const [smooth, setSmooth] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showDots, setShowDots] = useState(false);
  const [glow, setGlow] = useState(true);
  const [bg, setBg] = useState("#111111");
  const [animated, setAnimated] = useState(true);
  const [lineWidth, setLineWidth] = useState(2);
  const [gridColor, setGridColor] = useState("#374151");
  const [gridOpacity, setGridOpacity] = useState(0.2);
  const [dotRadius, setDotRadius] = useState(4);
  const [fillOpacity, setFillOpacity] = useState(0.15);
  const [glowBlur, setGlowBlur] = useState(8);

  const series: LiveChartSeries[] = React.useMemo(() => [
    { data: Array.from({ length: 40 }, (_, i) => 50 + Math.sin(i * 0.4) * 30 + Math.random() * 10), color: "#ffffff", filled: true },
    { data: Array.from({ length: 40 }, (_, i) => 50 + Math.cos(i * 0.3) * 20 + Math.random() * 8), color: "#6b7280", filled: true },
  ], []);

  const code = `import { LiveChart } from 'own-the-canvas';

<LiveChart
  preset="${preset}"
  series={[
    { data: myData1, color: "#ffffff", filled: true },
    { data: myData2, color: "#6b7280", filled: true },
  ]}
  smooth={${smooth}}
  showGrid={${showGrid}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <LiveChart preset={preset} series={series} smooth={smooth} showGrid={showGrid} showDots={showDots}
            glowEffect={glow} backgroundColor={bg}
            animated={animated} lineWidth={lineWidth} gridColor={gridColor} gridOpacity={gridOpacity}
            dotRadius={dotRadius} fillOpacity={fillOpacity} glowBlur={glowBlur}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Static dataset — push data dynamically</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="LiveChart" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "minimal", "ocean", "fire"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <ColorPicker label="Grid color" value={gridColor} onChange={setGridColor} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.25} onChange={setLineWidth} />
          <Slider label="Grid opacity" value={gridOpacity} min={0} max={0.5} step={0.05} onChange={setGridOpacity} />
          <Slider label="Dot radius" value={dotRadius} min={1} max={8} step={0.5} onChange={setDotRadius} />
          <Slider label="Fill opacity" value={fillOpacity} min={0} max={0.5} step={0.05} onChange={setFillOpacity} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={30} step={2} onChange={setGlowBlur} />
          <Toggle label="Smooth curves" value={smooth} onChange={setSmooth} />
          <Toggle label="Grid lines" value={showGrid} onChange={setShowGrid} />
          <Toggle label="Data dots" value={showDots} onChange={setShowDots} />
          <Toggle label="Glow effect" value={glow} onChange={setGlow} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function MandalaPanel() {
  const [preset, setPreset] = useState("default");
  const [symmetry, setSymmetry] = useState(8);
  const [layers, setLayers] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [bg, setBg] = useState("#111111");
  const [mirror, setMirror] = useState(true);
  const [glow, setGlow] = useState(true);
  const [lineWidth, setLineWidth] = useState(1);
  const [radius, setRadius] = useState(150);
  const [glowBlur, setGlowBlur] = useState(0);
  const [strokeOpacity, setStrokeOpacity] = useState(0.8);
  const [noiseAmount, setNoiseAmount] = useState(0);
  const code = `import { Mandala } from 'own-the-canvas';

<Mandala
  preset="${preset}"
  symmetry={${symmetry}}
  layers={${layers}}
  speed={${speed}}
  mirror={${mirror}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Mandala preset={preset} symmetry={symmetry} layers={layers} speed={speed} mirror={mirror}
            glowEffect={glow} backgroundColor={bg}
            lineWidth={lineWidth} radius={radius} glowBlur={glowBlur}
            strokeOpacity={strokeOpacity} noiseAmount={noiseAmount}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Mandala" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "lotus", "cosmic", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Symmetry arms" value={symmetry} min={3} max={24} step={1} onChange={setSymmetry} />
          <Slider label="Layers" value={layers} min={1} max={8} step={1} onChange={setLayers} />
          <Slider label="Speed" value={speed} min={0} max={3} step={0.1} onChange={setSpeed} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.25} onChange={setLineWidth} />
          <Slider label="Radius" value={radius} min={50} max={300} step={10} onChange={setRadius} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={2} onChange={setGlowBlur} />
          <Slider label="Stroke opacity" value={strokeOpacity} min={0.1} max={1} step={0.05} onChange={setStrokeOpacity} />
          <Slider label="Noise amount" value={noiseAmount} min={0} max={1} step={0.05} onChange={setNoiseAmount} />
          <Toggle label="Bilateral mirror" value={mirror} onChange={setMirror} />
          <Toggle label="Glow effect" value={glow} onChange={setGlow} />
        </div>
      </div>
    </>
  );
}

function MagneticBlobPanel() {
  const [preset, setPreset] = useState("default");
  const [count, setCount] = useState(5);
  const [radius, setRadius] = useState(80);
  const [threshold, setThreshold] = useState(1.8);
  const [bg, setBg] = useState("#111111");
  const [followMouse, setFollowMouse] = useState(true);
  const [glow, setGlow] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [magnetStrength, setMagnetStrength] = useState(0.5);
  const [magnetRadius, setMagnetRadius] = useState(150);
  const [glowBlur, setGlowBlur] = useState(20);
  const [animated, setAnimated] = useState(true);
  const [wanderStrength, setWanderStrength] = useState(0.3);
  const code = `import { MagneticBlob } from 'own-the-canvas';

<MagneticBlob
  preset="${preset}"
  count={${count}}
  radius={${radius}}
  threshold={${threshold}}
  followMouse={${followMouse}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <MagneticBlob preset={preset} count={count} radius={radius} threshold={threshold} followMouse={followMouse}
            glowEffect={glow} backgroundColor={bg}
            speed={speed} magnetStrength={magnetStrength} magnetRadius={magnetRadius}
            glowBlur={glowBlur} animated={animated} wanderStrength={wanderStrength}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to attract blobs</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="MagneticBlob" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "plasma", "ocean", "lava", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Blob count" value={count} min={2} max={10} step={1} onChange={setCount} />
          <Slider label="Radius" value={radius} min={30} max={150} step={5} onChange={setRadius} />
          <Slider label="Merge threshold" value={threshold} min={1} max={3} step={0.1} onChange={setThreshold} />
          <Slider label="Speed" value={speed} min={0.1} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Magnet strength" value={magnetStrength} min={0.1} max={2} step={0.1} onChange={setMagnetStrength} />
          <Slider label="Magnet radius" value={magnetRadius} min={50} max={300} step={10} onChange={setMagnetRadius} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={2} onChange={setGlowBlur} />
          <Slider label="Wander strength" value={wanderStrength} min={0} max={1} step={0.05} onChange={setWanderStrength} />
          <Toggle label="Follow mouse" value={followMouse} onChange={setFollowMouse} />
          <Toggle label="Glow effect" value={glow} onChange={setGlow} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function ClothSimulationPanel() {
  const [preset, setPreset] = useState("default");
  const [cols, setCols] = useState(25);
  const [gravity, setGravity] = useState(0.4);
  const [wind, setWind] = useState(0.3);
  const [tearable, setTearable] = useState(false);
  const [lineColor, setLineColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [rows, setRows] = useState(20);
  const [spacing, setSpacing] = useState(18);
  const [friction, setFriction] = useState(0.95);
  const [stiffness, setStiffness] = useState(8);
  const [iterations, setIterations] = useState(10);
  const [lineWidth, setLineWidth] = useState(1);
  const [windSpeed, setWindSpeed] = useState(1);
  const [tearDistance, setTearDistance] = useState(100);
  const code = `import { ClothSimulation } from 'own-the-canvas';

<ClothSimulation
  preset="${preset}"
  cols={${cols}}
  gravity={${gravity}}
  wind={${wind}}
  tearable={${tearable}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <ClothSimulation preset={preset} cols={cols} gravity={gravity} wind={wind} tearable={tearable}
            lineColor={lineColor} backgroundColor={bg}
            rows={rows} spacing={spacing} friction={friction} stiffness={stiffness}
            iterations={iterations} lineWidth={lineWidth} windSpeed={windSpeed} tearDistance={tearDistance}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>{tearable ? "Click to tear cloth" : "Hover to push cloth"}</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="ClothSimulation" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "silk", "net", "heavy", "spider"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Cloth color" value={lineColor} onChange={setLineColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Columns" value={cols} min={10} max={40} step={1} onChange={setCols} />
          <Slider label="Rows" value={rows} min={10} max={40} step={1} onChange={setRows} />
          <Slider label="Spacing" value={spacing} min={10} max={30} step={1} onChange={setSpacing} />
          <Slider label="Gravity" value={gravity} min={0.05} max={1.5} step={0.05} onChange={setGravity} />
          <Slider label="Wind" value={wind} min={0} max={1} step={0.05} onChange={setWind} />
          <Slider label="Friction" value={friction} min={0.8} max={0.99} step={0.01} onChange={setFriction} />
          <Slider label="Stiffness" value={stiffness} min={1} max={20} step={1} onChange={setStiffness} />
          <Slider label="Iterations" value={iterations} min={1} max={20} step={1} onChange={setIterations} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={3} step={0.25} onChange={setLineWidth} />
          <Slider label="Wind speed" value={windSpeed} min={0} max={5} step={0.25} onChange={setWindSpeed} />
          <Slider label="Tear distance" value={tearDistance} min={50} max={200} step={10} onChange={setTearDistance} />
          <Toggle label="Tearable" value={tearable} onChange={setTearable} />
        </div>
      </div>
    </>
  );
}

function FluidSimulationPanel() {
  const [preset, setPreset] = useState("default");
  const [resolution, setResolution] = useState(80);
  const [dissipation, setDissipation] = useState(0.995);
  const [autoInk, setAutoInk] = useState(true);
  const [mouseForce, setMouseForce] = useState(5);
  const [bg, setBg] = useState("#111111");
  const [viscosity, setViscosity] = useState(0);
  const [diffusion, setDiffusion] = useState(0);
  const [glowEffect, setGlowEffect] = useState(false);
  const [glowBlur, setGlowBlur] = useState(20);
  const [autoInkInterval, setAutoInkInterval] = useState(2000);
  const [inkRadius, setInkRadius] = useState(20);
  const code = `import { FluidSimulation } from 'own-the-canvas';

<FluidSimulation
  preset="${preset}"
  resolution={${resolution}}
  dissipation={${dissipation}}
  autoInk={${autoInk}}
  mouseForce={${mouseForce}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <FluidSimulation preset={preset} resolution={resolution} dissipation={dissipation} autoInk={autoInk}
            mouseForce={mouseForce} backgroundColor={bg}
            viscosity={viscosity} diffusion={diffusion}
            glowEffect={glowEffect} glowBlur={glowBlur}
            autoInkInterval={autoInkInterval} inkRadius={inkRadius}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to paint fluid</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="FluidSimulation" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "ink", "neon", "lava", "ocean", "smoke"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Resolution" value={resolution} min={32} max={128} step={8} onChange={setResolution} />
          <Slider label="Dissipation" value={dissipation} min={0.97} max={0.999} step={0.001} onChange={setDissipation} />
          <Slider label="Mouse force" value={mouseForce} min={1} max={15} step={1} onChange={setMouseForce} />
          <Slider label="Viscosity" value={viscosity} min={0} max={0.01} step={0.001} onChange={setViscosity} />
          <Slider label="Diffusion" value={diffusion} min={0} max={0.001} step={0.0001} onChange={setDiffusion} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={2} onChange={setGlowBlur} />
          <Slider label="Auto ink interval (ms)" value={autoInkInterval} min={500} max={5000} step={250} onChange={setAutoInkInterval} />
          <Slider label="Ink radius" value={inkRadius} min={5} max={50} step={5} onChange={setInkRadius} />
          <Toggle label="Auto-ink bursts" value={autoInk} onChange={setAutoInk} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
        </div>
      </div>
    </>
  );
}

function RainPanel() {
  const [preset, setPreset] = useState("default");
  const [dropCount, setDropCount] = useState(200);
  const [speed, setSpeed] = useState(15);
  const [wind, setWind] = useState(0.3);
  const [dropColor, setDropColor] = useState("#ffffff");
  const [splashColor, setSplashColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [showSplashes, setShowSplashes] = useState(true);
  const [dropLength, setDropLength] = useState(15);
  const [dropWidth, setDropWidth] = useState(1);
  const [dropOpacity, setDropOpacity] = useState(0.6);
  const code = `import { Rain } from 'own-the-canvas';

<Rain
  preset="${preset}"
  dropCount={${dropCount}}
  speed={${speed}}
  wind={${wind}}
  dropColor="${dropColor}"
  showSplashes={${showSplashes}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Rain preset={preset} dropCount={dropCount} speed={speed} wind={wind}
            dropColor={dropColor} splashColor={splashColor} showSplashes={showSplashes}
            dropLength={dropLength} dropWidth={dropWidth} dropOpacity={dropOpacity}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Rain with wind drift</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Rain" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "storm", "drizzle", "neon", "golden"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Drop color" value={dropColor} onChange={setDropColor} />
          <ColorPicker label="Splash color" value={splashColor} onChange={setSplashColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Drop count" value={dropCount} min={20} max={800} step={10} onChange={setDropCount} />
          <Slider label="Speed" value={speed} min={2} max={40} step={1} onChange={setSpeed} />
          <Slider label="Wind" value={wind} min={0} max={3} step={0.05} onChange={setWind} />
          <Slider label="Drop length" value={dropLength} min={5} max={30} step={1} onChange={setDropLength} />
          <Slider label="Drop width" value={dropWidth} min={0.5} max={3} step={0.25} onChange={setDropWidth} />
          <Slider label="Drop opacity" value={dropOpacity} min={0.1} max={1} step={0.05} onChange={setDropOpacity} />
          <Toggle label="Show splashes" value={showSplashes} onChange={setShowSplashes} />
        </div>
      </div>
    </>
  );
}

function LightningPanel() {
  const [preset, setPreset] = useState("default");
  const [color, setColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [branchChance, setBranchChance] = useState(0.3);
  const [glowBlur, setGlowBlur] = useState(20);
  const [autoInterval, setAutoInterval] = useState(2000);
  const [segments, setSegments] = useState(12);
  const [roughness, setRoughness] = useState(0.5);
  const [branchDecay, setBranchDecay] = useState(0.8);
  const [flickerCount, setFlickerCount] = useState(3);
  const [coreColor, setCoreColor] = useState("#ffffff");
  const [interactive, setInteractive] = useState(true);
  const code = `import { Lightning } from 'own-the-canvas';

<Lightning
  preset="${preset}"
  color="${color}"
  branchChance={${branchChance}}
  glowBlur={${glowBlur}}
  autoInterval={${autoInterval}}
  interactive
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Lightning preset={preset} color={color} branchChance={branchChance}
            glowBlur={glowBlur} autoInterval={autoInterval}
            segments={segments} roughness={roughness} branchDecay={branchDecay}
            flickerCount={flickerCount} coreColor={coreColor} interactive={interactive}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to strike</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Lightning" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "storm", "plasma", "subtle"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Bolt color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Branch chance" value={branchChance} min={0} max={0.8} step={0.05} onChange={setBranchChance} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={60} step={2} onChange={setGlowBlur} />
          <Slider label="Auto interval (ms)" value={autoInterval} min={500} max={6000} step={100} onChange={setAutoInterval} />
          <Slider label="Segments" value={segments} min={5} max={30} step={1} onChange={setSegments} />
          <Slider label="Roughness" value={roughness} min={0.1} max={1} step={0.05} onChange={setRoughness} />
          <Slider label="Branch decay" value={branchDecay} min={0.5} max={0.99} step={0.01} onChange={setBranchDecay} />
          <Slider label="Flicker count" value={flickerCount} min={1} max={10} step={1} onChange={setFlickerCount} />
          <ColorPicker label="Core color" value={coreColor} onChange={setCoreColor} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function GameOfLifePanel() {
  const [preset, setPreset] = useState("default");
  const [cellSize, setCellSize] = useState(8);
  const [speed, setSpeed] = useState(10);
  const [aliveColor, setAliveColor] = useState("#ffffff");
  const [oldColor, setOldColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [showAge, setShowAge] = useState(true);
  const [initialDensity, setInitialDensity] = useState(0.3);
  const [deadColor, setDeadColor] = useState("#111111");
  const [wrapEdges, setWrapEdges] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const code = `import { GameOfLife } from 'own-the-canvas';

<GameOfLife
  preset="${preset}"
  cellSize={${cellSize}}
  speed={${speed}}
  aliveColor="${aliveColor}"
  showAge={${showAge}}
  interactive
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <GameOfLife preset={preset} cellSize={cellSize} speed={speed}
            aliveColor={aliveColor} oldColor={oldColor} showAge={showAge}
            initialDensity={initialDensity} deadColor={deadColor}
            wrapEdges={wrapEdges} interactive={interactive}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click cells to draw • Conway's Game of Life</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="GameOfLife" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "matrix", "minimal", "fire"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Alive color" value={aliveColor} onChange={setAliveColor} />
          <ColorPicker label="Old cell color" value={oldColor} onChange={setOldColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Cell size" value={cellSize} min={4} max={24} step={2} onChange={setCellSize} />
          <Slider label="Speed (updates/s)" value={speed} min={1} max={30} step={1} onChange={setSpeed} />
          <Slider label="Initial density" value={initialDensity} min={0.1} max={0.8} step={0.05} onChange={setInitialDensity} />
          <ColorPicker label="Dead cell color" value={deadColor} onChange={setDeadColor} />
          <Toggle label="Show age gradient" value={showAge} onChange={setShowAge} />
          <Toggle label="Wrap edges" value={wrapEdges} onChange={setWrapEdges} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function WormholePanel() {
  const [preset, setPreset] = useState("default");
  const [speed, setSpeed] = useState(1);
  const [twist, setTwist] = useState(0.3);
  const [ringCount, setRingCount] = useState(30);
  const [starCount, setStarCount] = useState(100);
  const [bg, setBg] = useState("#111111");
  const [fov, setFov] = useState(600);
  const [depth, setDepth] = useState(25);
  const [lineWidth, setLineWidth] = useState(1);
  const [opacity, setOpacity] = useState(0.8);
  const [starColor, setStarColor] = useState("#ffffff");
  const [interactive, setInteractive] = useState(true);
  const code = `import { Wormhole } from 'own-the-canvas';

<Wormhole
  preset="${preset}"
  speed={${speed}}
  twist={${twist}}
  ringCount={${ringCount}}
  interactive
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Wormhole preset={preset} speed={speed} twist={twist}
            ringCount={ringCount} starCount={starCount}
            fov={fov} depth={depth} lineWidth={lineWidth} opacity={opacity}
            starColor={starColor} interactive={interactive}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Mouse X controls speed</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Wormhole" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "hyperspace", "neon", "vortex", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <ColorPicker label="Star color" value={starColor} onChange={setStarColor} />
          <Slider label="Speed" value={speed} min={0.2} max={5} step={0.1} onChange={setSpeed} />
          <Slider label="Twist" value={twist} min={0} max={2} step={0.05} onChange={setTwist} />
          <Slider label="Ring count" value={ringCount} min={10} max={60} step={5} onChange={setRingCount} />
          <Slider label="Star count" value={starCount} min={0} max={300} step={10} onChange={setStarCount} />
          <Slider label="FOV" value={fov} min={200} max={1200} step={50} onChange={setFov} />
          <Slider label="Depth" value={depth} min={10} max={50} step={2} onChange={setDepth} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.25} onChange={setLineWidth} />
          <Slider label="Opacity" value={opacity} min={0.1} max={1} step={0.05} onChange={setOpacity} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function BoidsPanel() {
  const [preset, setPreset] = useState("default");
  const [count, setCount] = useState(80);
  const [maxSpeed, setMaxSpeed] = useState(3);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [trailLength, setTrailLength] = useState(8);
  const [sepForce, setSepForce] = useState(0.05);
  const [separationRadius, setSeparationRadius] = useState(25);
  const [alignmentRadius, setAlignmentRadius] = useState(50);
  const [cohesionRadius, setCohesionRadius] = useState(60);
  const [alignmentForce, setAlignmentForce] = useState(0.08);
  const [cohesionForce, setCohesionForce] = useState(0.05);
  const [trailOpacity, setTrailOpacity] = useState(0.5);
  const [boidSize, setBoidSize] = useState(6);
  const [interactive, setInteractive] = useState(true);
  const [mouseRadius, setMouseRadius] = useState(80);
  const [mouseForce, setMouseForce] = useState(2);
  const [wrapEdges, setWrapEdges] = useState(true);
  const code = `import { Boids } from 'own-the-canvas';

<Boids
  preset="${preset}"
  count={${count}}
  maxSpeed={${maxSpeed}}
  color="${color}"
  trailLength={${trailLength}}
  interactive
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Boids preset={preset} count={count} maxSpeed={maxSpeed}
            color={color} trailLength={trailLength} separationForce={sepForce}
            separationRadius={separationRadius} alignmentRadius={alignmentRadius}
            cohesionRadius={cohesionRadius} alignmentForce={alignmentForce}
            cohesionForce={cohesionForce} trailOpacity={trailOpacity}
            boidSize={boidSize} interactive={interactive}
            mouseRadius={mouseRadius} mouseForce={mouseForce} wrapEdges={wrapEdges}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to scatter the flock</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Boids" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "birds", "fish", "swarm", "neon"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Count" value={count} min={10} max={300} step={10} onChange={setCount} />
          <Slider label="Max speed" value={maxSpeed} min={0.5} max={8} step={0.5} onChange={setMaxSpeed} />
          <Slider label="Trail length" value={trailLength} min={0} max={30} step={1} onChange={setTrailLength} />
          <Slider label="Separation force" value={sepForce} min={0} max={0.2} step={0.005} onChange={setSepForce} />
          <Slider label="Separation radius" value={separationRadius} min={5} max={60} step={5} onChange={setSeparationRadius} />
          <Slider label="Alignment radius" value={alignmentRadius} min={20} max={100} step={5} onChange={setAlignmentRadius} />
          <Slider label="Cohesion radius" value={cohesionRadius} min={20} max={120} step={5} onChange={setCohesionRadius} />
          <Slider label="Alignment force" value={alignmentForce} min={0.01} max={0.2} step={0.01} onChange={setAlignmentForce} />
          <Slider label="Cohesion force" value={cohesionForce} min={0.01} max={0.2} step={0.01} onChange={setCohesionForce} />
          <Slider label="Trail opacity" value={trailOpacity} min={0.1} max={1} step={0.05} onChange={setTrailOpacity} />
          <Slider label="Boid size" value={boidSize} min={3} max={15} step={1} onChange={setBoidSize} />
          <Slider label="Mouse radius" value={mouseRadius} min={20} max={200} step={10} onChange={setMouseRadius} />
          <Slider label="Mouse force" value={mouseForce} min={-5} max={5} step={0.5} onChange={setMouseForce} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
          <Toggle label="Wrap edges" value={wrapEdges} onChange={setWrapEdges} />
        </div>
      </div>
    </>
  );
}

function DragonCursorPanel() {
  const [preset, setPreset] = useState("default");
  const [segmentCount, setSegmentCount] = useState(20);
  const [segmentSize, setSegmentSize] = useState(18);
  const [bodyColor, setBodyColor] = useState("#ffffff");
  const [fireColor, setFireColor] = useState("#ffffff");
  const [followSpeed, setFollowSpeed] = useState(0.15);
  const [wingSpan, setWingSpan] = useState(60);
  const [showFire, setShowFire] = useState(true);
  const [bg, setBg] = useState("#111111");
  const [eyeColor, setEyeColor] = useState("#ff0000");
  const [interactive, setInteractive] = useState(true);
  const code = `import { DragonCursor } from 'own-the-canvas';

<DragonCursor
  preset="${preset}"
  segmentCount={${segmentCount}}
  bodyColor="${bodyColor}"
  followSpeed={${followSpeed}}
  showFire={${showFire}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <DragonCursor preset={preset} segmentCount={segmentCount} segmentSize={segmentSize}
            bodyColor={bodyColor} fireColor={fireColor} followSpeed={followSpeed}
            wingSpan={wingSpan} showFire={showFire} backgroundColor={bg}
            eyeColor={eyeColor} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to guide the dragon</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="DragonCursor" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "fire", "ice", "shadow", "neon"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Body color" value={bodyColor} onChange={setBodyColor} />
          <ColorPicker label="Fire color" value={fireColor} onChange={setFireColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Segments" value={segmentCount} min={5} max={40} step={1} onChange={setSegmentCount} />
          <Slider label="Segment size" value={segmentSize} min={8} max={36} step={1} onChange={setSegmentSize} />
          <Slider label="Follow speed" value={followSpeed} min={0.02} max={0.5} step={0.01} onChange={setFollowSpeed} />
          <Slider label="Wing span" value={wingSpan} min={20} max={120} step={5} onChange={setWingSpan} />
          <ColorPicker label="Eye color" value={eyeColor} onChange={setEyeColor} />
          <Toggle label="Fire breath" value={showFire} onChange={setShowFire} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function KoiPondPanel() {
  const [preset, setPreset] = useState("default");
  const [fishCount, setFishCount] = useState(6);
  const [speed, setSpeed] = useState(1);
  const [fishColor, setFishColor] = useState("#ffffff");
  const [waterColor, setWaterColor] = useState("#111111");
  const [showLilies, setShowLilies] = useState(true);
  const [caustics, setCaustics] = useState(true);
  const [scaleColor, setScaleColor] = useState("#ff6b35");
  const [rippleColor, setRippleColor] = useState("#ffffff");
  const [lilyColor, setLilyColor] = useState("#22c55e");
  const [interactive, setInteractive] = useState(true);
  const code = `import { KoiPond } from 'own-the-canvas';

<KoiPond
  preset="${preset}"
  fishCount={${fishCount}}
  speed={${speed}}
  showLilies={${showLilies}}
  caustics={${caustics}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <KoiPond preset={preset} fishCount={fishCount} speed={speed}
            fishColor={fishColor} waterColor={waterColor}
            showLilies={showLilies} caustics={caustics}
            scaleColor={scaleColor} rippleColor={rippleColor}
            lilyColor={lilyColor} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to create ripples</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="KoiPond" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "golden", "night", "sakura", "zen"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Fish color" value={fishColor} onChange={setFishColor} />
          <ColorPicker label="Water color" value={waterColor} onChange={setWaterColor} />
          <Slider label="Fish count" value={fishCount} min={1} max={20} step={1} onChange={setFishCount} />
          <Slider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
          <ColorPicker label="Scale color" value={scaleColor} onChange={setScaleColor} />
          <ColorPicker label="Ripple color" value={rippleColor} onChange={setRippleColor} />
          <ColorPicker label="Lily color" value={lilyColor} onChange={setLilyColor} />
          <Toggle label="Lily pads" value={showLilies} onChange={setShowLilies} />
          <Toggle label="Caustic lighting" value={caustics} onChange={setCaustics} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function BubbleUniversePanel() {
  const [preset, setPreset] = useState("default");
  const [bubbleCount, setBubbleCount] = useState(15);
  const [minRadius, setMinRadius] = useState(20);
  const [maxRadius, setMaxRadius] = useState(50);
  const [gravity, setGravity] = useState(0.02);
  const [bg, setBg] = useState("#111111");
  const [popEffect, setPopEffect] = useState(true);
  const [mergeOnCollide, setMergeOnCollide] = useState(true);
  const [glow, setGlow] = useState(true);
  const [shimmerColor, setShimmerColor] = useState("#ffffff");
  const [friction, setFriction] = useState(0.99);
  const [interactive, setInteractive] = useState(true);
  const code = `import { BubbleUniverse } from 'own-the-canvas';

<BubbleUniverse
  preset="${preset}"
  bubbleCount={${bubbleCount}}
  gravity={${gravity}}
  popEffect={${popEffect}}
  mergeOnCollide={${mergeOnCollide}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <BubbleUniverse preset={preset} bubbleCount={bubbleCount} minRadius={minRadius}
            maxRadius={maxRadius} gravity={gravity} backgroundColor={bg}
            popEffect={popEffect} mergeOnCollide={mergeOnCollide} glowEffect={glow}
            shimmerColor={shimmerColor} friction={friction} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Hover to push · click to pop</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="BubbleUniverse" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "soap", "neon", "golden", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Bubble count" value={bubbleCount} min={3} max={40} step={1} onChange={setBubbleCount} />
          <Slider label="Min radius" value={minRadius} min={10} max={60} step={5} onChange={setMinRadius} />
          <Slider label="Max radius" value={maxRadius} min={20} max={100} step={5} onChange={setMaxRadius} />
          <Slider label="Gravity" value={gravity} min={0} max={0.1} step={0.005} onChange={setGravity} />
          <ColorPicker label="Shimmer color" value={shimmerColor} onChange={setShimmerColor} />
          <Slider label="Friction" value={friction} min={0.98} max={1.0} step={0.002} onChange={setFriction} />
          <Toggle label="Pop effect" value={popEffect} onChange={setPopEffect} />
          <Toggle label="Merge on collide" value={mergeOnCollide} onChange={setMergeOnCollide} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function SakuraBlossomPanel() {
  const [preset, setPreset] = useState("default");
  const [petalCount, setPetalCount] = useState(80);
  const [petalColor, setPetalColor] = useState("#ffffff");
  const [petalSize, setPetalSize] = useState(8);
  const [gravity, setGravity] = useState(0.06);
  const [windStrength, setWindStrength] = useState(0.8);
  const [bg, setBg] = useState("#111111");
  const [windGusts, setWindGusts] = useState(true);
  const [showAccumulation, setShowAccumulation] = useState(true);
  const [maxAccumulation, setMaxAccumulation] = useState(50);
  const code = `import { SakuraBlossom } from 'own-the-canvas';

<SakuraBlossom
  preset="${preset}"
  petalCount={${petalCount}}
  petalColor="${petalColor}"
  windStrength={${windStrength}}
  showAccumulation={${showAccumulation}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <SakuraBlossom preset={preset} petalCount={petalCount} petalColor={petalColor}
            petalSize={petalSize} gravity={gravity} windStrength={windStrength}
            windGusts={windGusts} showAccumulation={showAccumulation}
            maxAccumulation={maxAccumulation}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="SakuraBlossom" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "pink", "night", "golden", "storm"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Petal color" value={petalColor} onChange={setPetalColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Petal count" value={petalCount} min={10} max={300} step={10} onChange={setPetalCount} />
          <Slider label="Petal size" value={petalSize} min={3} max={20} step={1} onChange={setPetalSize} />
          <Slider label="Gravity" value={gravity} min={0.01} max={0.3} step={0.01} onChange={setGravity} />
          <Slider label="Wind strength" value={windStrength} min={0} max={3} step={0.1} onChange={setWindStrength} />
          <Slider label="Max accumulation" value={maxAccumulation} min={10} max={100} step={5} onChange={setMaxAccumulation} />
          <Toggle label="Wind gusts" value={windGusts} onChange={setWindGusts} />
          <Toggle label="Accumulation" value={showAccumulation} onChange={setShowAccumulation} />
        </div>
      </div>
    </>
  );
}

function ReactionDiffusionPanel() {
  const [preset, setPreset] = useState("default");
  const [feedRate, setFeedRate] = useState(0.055);
  const [killRate, setKillRate] = useState(0.062);
  const [speed, setSpeed] = useState(8);
  const [colorA, setColorA] = useState("#111111");
  const [colorB, setColorB] = useState("#ffffff");
  const [interactive, setInteractive] = useState(true);
  const [diffusionU, setDiffusionU] = useState(0.21);
  const [diffusionV, setDiffusionV] = useState(0.105);
  const [resolution, setResolution] = useState(0.5);
  const code = `import { ReactionDiffusion } from 'own-the-canvas';

<ReactionDiffusion
  preset="${preset}"
  feedRate={${feedRate}}
  killRate={${killRate}}
  speed={${speed}}
  interactive={${interactive}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <ReactionDiffusion preset={preset} feedRate={feedRate} killRate={killRate}
            speed={speed} colorA={colorA} colorB={colorB} interactive={interactive}
            diffusionU={diffusionU} diffusionV={diffusionV} resolution={resolution}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Mouse disturbs the chemical field</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="ReactionDiffusion" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "spots", "stripes", "coral", "maze", "worms"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Low conc. color" value={colorA} onChange={setColorA} />
          <ColorPicker label="High conc. color" value={colorB} onChange={setColorB} />
          <Slider label="Feed rate" value={feedRate} min={0.01} max={0.1} step={0.001} onChange={setFeedRate} />
          <Slider label="Kill rate" value={killRate} min={0.03} max={0.09} step={0.001} onChange={setKillRate} />
          <Slider label="Steps/frame" value={speed} min={1} max={20} step={1} onChange={setSpeed} />
          <Slider label="Diffusion U" value={diffusionU} min={0.1} max={0.3} step={0.01} onChange={setDiffusionU} />
          <Slider label="Diffusion V" value={diffusionV} min={0.05} max={0.15} step={0.005} onChange={setDiffusionV} />
          <Slider label="Resolution" value={resolution} min={0.2} max={1} step={0.1} onChange={setResolution} />
          <Toggle label="Mouse interaction" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function AuroraBorealisPanel() {
  const [preset, setPreset] = useState("default");
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(0.8);
  const [layers, setLayers] = useState(5);
  const [waveAmplitude, setWaveAmplitude] = useState(0.15);
  const [waveFrequency, setWaveFrequency] = useState(2);
  const [starCount, setStarCount] = useState(80);
  const [bg, setBg] = useState("#111111");
  const [animated, setAnimated] = useState(true);
  const code = `import { AuroraBorealis } from 'own-the-canvas';

<AuroraBorealis
  preset="${preset}"
  speed={${speed}}
  intensity={${intensity}}
  layers={${layers}}
  starCount={${starCount}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <AuroraBorealis preset={preset} speed={speed} intensity={intensity}
            layers={layers} waveAmplitude={waveAmplitude} waveFrequency={waveFrequency}
            starCount={starCount} backgroundColor={bg} animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="AuroraBorealis" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "green", "purple", "blue", "rainbow", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Speed" value={speed} min={0.1} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Intensity" value={intensity} min={0.1} max={1} step={0.05} onChange={setIntensity} />
          <Slider label="Layers" value={layers} min={1} max={10} step={1} onChange={setLayers} />
          <Slider label="Wave amplitude" value={waveAmplitude} min={0.05} max={0.4} step={0.01} onChange={setWaveAmplitude} />
          <Slider label="Wave frequency" value={waveFrequency} min={1} max={6} step={0.5} onChange={setWaveFrequency} />
          <Slider label="Star count" value={starCount} min={0} max={300} step={10} onChange={setStarCount} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function SpirographPanel() {
  const [preset, setPreset] = useState("default");
  const [outerRadius, setOuterRadius] = useState(0.85);
  const [innerRadius, setInnerRadius] = useState(0.4);
  const [penDistance, setPenDistance] = useState(0.9);
  const [speed, setSpeed] = useState(2);
  const [lineWidth, setLineWidth] = useState(1);
  const [bg, setBg] = useState("#111111");
  const [glow, setGlow] = useState(false);
  const [autoReset, setAutoReset] = useState(true);
  const [trailFade, setTrailFade] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [layerCount, setLayerCount] = useState(1);
  const [symmetry, setSymmetry] = useState(1);
  const [glowBlur, setGlowBlur] = useState(0);
  const code = `import { Spirograph } from 'own-the-canvas';

<Spirograph
  preset="${preset}"
  outerRadius={${outerRadius}}
  innerRadius={${innerRadius}}
  penDistance={${penDistance}}
  speed={${speed}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Spirograph preset={preset} outerRadius={outerRadius} innerRadius={innerRadius}
            penDistance={penDistance} speed={speed} lineWidth={lineWidth}
            backgroundColor={bg} glowEffect={glow} autoReset={autoReset}
            trailFade={trailFade} animated={animated} layerCount={layerCount}
            symmetry={symmetry} glowBlur={glowBlur}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Spirograph" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "rose", "star", "web", "celtic", "lotus"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Outer radius" value={outerRadius} min={0.4} max={0.95} step={0.01} onChange={setOuterRadius} />
          <Slider label="Inner radius" value={innerRadius} min={0.1} max={0.9} step={0.01} onChange={setInnerRadius} />
          <Slider label="Pen distance" value={penDistance} min={0.1} max={1.5} step={0.05} onChange={setPenDistance} />
          <Slider label="Speed (deg/frame)" value={speed} min={0.5} max={8} step={0.5} onChange={setSpeed} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.5} onChange={setLineWidth} />
          <Slider label="Trail fade" value={trailFade} min={0} max={0.02} step={0.001} onChange={setTrailFade} />
          <Slider label="Layer count" value={layerCount} min={1} max={5} step={1} onChange={setLayerCount} />
          <Slider label="Symmetry" value={symmetry} min={1} max={8} step={1} onChange={setSymmetry} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={30} step={2} onChange={setGlowBlur} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Auto reset" value={autoReset} onChange={setAutoReset} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function SandSimulationPanel() {
  const [material, setMaterial] = useState<SandMaterial>("sand");
  const [cellSize, setCellSize] = useState(4);
  const [brushSize, setBrushSize] = useState(3);
  const [sandColor, setSandColor] = useState("#ffffff");
  const [waterColor, setWaterColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [preset, setPreset] = useState("default");
  const [fireColor, setFireColor] = useState("#ff4500");
  const [wallColor, setWallColor] = useState("#6b7280");
  const [interactive, setInteractive] = useState(true);
  const [gravity, setGravity] = useState(1);
  const code = `import { SandSimulation } from 'own-the-canvas';

<SandSimulation
  material="${material}"
  cellSize={${cellSize}}
  brushSize={${brushSize}}
  sandColor="${sandColor}"
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <SandSimulation preset={preset} material={material} cellSize={cellSize} brushSize={brushSize}
            sandColor={sandColor} waterColor={waterColor} backgroundColor={bg}
            fireColor={fireColor} wallColor={wallColor} interactive={interactive} gravity={gravity}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click/drag to paint material</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="SandSimulation" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "desert", "ocean", "inferno", "neon"]} onChange={setPreset} />
          <Sel label="Material" value={material} options={["sand", "water", "fire", "wall", "empty"]} onChange={(v) => setMaterial(v as SandMaterial)} />
          <Divider />
          <ColorPicker label="Sand color" value={sandColor} onChange={setSandColor} />
          <ColorPicker label="Water color" value={waterColor} onChange={setWaterColor} />
          <ColorPicker label="Fire color" value={fireColor} onChange={setFireColor} />
          <ColorPicker label="Wall color" value={wallColor} onChange={setWallColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Cell size" value={cellSize} min={2} max={10} step={1} onChange={setCellSize} />
          <Slider label="Brush size" value={brushSize} min={1} max={10} step={1} onChange={setBrushSize} />
          <Slider label="Gravity" value={gravity} min={0.5} max={2} step={0.1} onChange={setGravity} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function WaveInterferencePanel() {
  const [preset, setPreset] = useState("default");
  const [wavelength, setWavelength] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [colorHigh, setColorHigh] = useState("#ffffff");
  const [colorLow, setColorLow] = useState("#111111");
  const [decay, setDecay] = useState(0.003);
  const [showSources, setShowSources] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [maxSources, setMaxSources] = useState(4);
  const [resolution, setResolution] = useState(0.5);
  const code = `import { WaveInterference } from 'own-the-canvas';

<WaveInterference
  preset="${preset}"
  wavelength={${wavelength}}
  speed={${speed}}
  showSources={${showSources}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <WaveInterference preset={preset} wavelength={wavelength} speed={speed}
            colorHigh={colorHigh} colorLow={colorLow} decay={decay}
            showSources={showSources} animated={animated}
            maxSources={maxSources} resolution={resolution}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to add wave sources</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="WaveInterference" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "ripple", "neon", "ocean", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="High amplitude" value={colorHigh} onChange={setColorHigh} />
          <ColorPicker label="Low amplitude" value={colorLow} onChange={setColorLow} />
          <Slider label="Wavelength" value={wavelength} min={20} max={200} step={5} onChange={setWavelength} />
          <Slider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Decay" value={decay} min={0} max={0.01} step={0.0005} onChange={setDecay} />
          <Slider label="Max sources" value={maxSources} min={1} max={12} step={1} onChange={setMaxSources} />
          <Slider label="Resolution" value={resolution} min={0.2} max={1} step={0.1} onChange={setResolution} />
          <Toggle label="Show sources" value={showSources} onChange={setShowSources} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function DiffusionAggregationPanel() {
  const [preset, setPreset] = useState("default");
  const [walkerCount, setWalkerCount] = useState(60);
  const [stepsPerFrame, setStepsPerFrame] = useState(20);
  const [particleSize, setParticleSize] = useState(3);
  const [particleColor, setParticleColor] = useState("#ffffff");
  const [seedMode, setSeedMode] = useState<DLASeedMode>("center");
  const [glow, setGlow] = useState(true);
  const [showWalkers, setShowWalkers] = useState(false);
  const [bg, setBg] = useState("#111111");
  const [walkerColor, setWalkerColor] = useState("#ffffff");
  const [glowBlur, setGlowBlur] = useState(0);
  const [interactiveDLA, setInteractiveDLA] = useState(true);
  const code = `import { DiffusionAggregation } from 'own-the-canvas';

<DiffusionAggregation
  preset="${preset}"
  walkerCount={${walkerCount}}
  seedMode="${seedMode}"
  glowEffect={${glow}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <DiffusionAggregation preset={preset} walkerCount={walkerCount}
            stepsPerFrame={stepsPerFrame} particleSize={particleSize}
            particleColor={particleColor} seedMode={seedMode}
            glowEffect={glow} showWalkers={showWalkers} backgroundColor={bg}
            walkerColor={walkerColor} glowBlur={glowBlur} interactive={interactiveDLA}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to add seed points</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="DiffusionAggregation" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "coral", "frost", "minimal"]} onChange={setPreset} />
          <Sel label="Seed mode" value={seedMode} options={["center", "bottom", "edges", "random"]} onChange={(v) => setSeedMode(v as DLASeedMode)} />
          <Divider />
          <ColorPicker label="Crystal color" value={particleColor} onChange={setParticleColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Walker count" value={walkerCount} min={10} max={200} step={10} onChange={setWalkerCount} />
          <Slider label="Steps/frame" value={stepsPerFrame} min={5} max={60} step={5} onChange={setStepsPerFrame} />
          <Slider label="Particle size" value={particleSize} min={1} max={8} step={1} onChange={setParticleSize} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={30} step={2} onChange={setGlowBlur} />
          <ColorPicker label="Walker color" value={walkerColor} onChange={setWalkerColor} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Show walkers" value={showWalkers} onChange={setShowWalkers} />
          <Toggle label="Interactive" value={interactiveDLA} onChange={setInteractiveDLA} />
        </div>
      </div>
    </>
  );
}

function LissajousPanel() {
  const [freqX, setFreqX] = useState(3);
  const [freqY, setFreqY] = useState(2);
  const [phaseSpeed, setPhaseSpeed] = useState(0.5);
  const [lineWidth, setLineWidth] = useState(1.5);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [trailFade, setTrailFade] = useState(0.04);
  const [colorMode, setColorMode] = useState<LissajousColorMode>("solid");
  const [glow, setGlow] = useState(false);
  const [phaseShift, setPhaseShift] = useState(90);
  const [amplitude, setAmplitude] = useState(0.9);
  const [glowBlur, setGlowBlur] = useState(0);
  const [curvePoints, setCurvePoints] = useState(600);
  const [animated, setAnimated] = useState(true);
  const code = `import { Lissajous } from 'own-the-canvas';

<Lissajous
  freqX={${freqX}}
  freqY={${freqY}}
  phaseSpeed={${phaseSpeed}}
  colorMode="${colorMode}"
  lineWidth={${lineWidth}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Lissajous freqX={freqX} freqY={freqY} phaseSpeed={phaseSpeed}
            lineWidth={lineWidth} color={color} backgroundColor={bg}
            trailFade={trailFade} colorMode={colorMode} glowEffect={glow}
            phaseShift={phaseShift} amplitude={amplitude} glowBlur={glowBlur}
            curvePoints={curvePoints} animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Lissajous" />
        <div className="ctrl-body">
          <Sel label="Color mode" value={colorMode} options={["solid", "cycle"]} onChange={(v) => setColorMode(v as LissajousColorMode)} />
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Freq X" value={freqX} min={1} max={8} step={1} onChange={setFreqX} />
          <Slider label="Freq Y" value={freqY} min={1} max={8} step={1} onChange={setFreqY} />
          <Slider label="Phase speed" value={phaseSpeed} min={0} max={3} step={0.1} onChange={setPhaseSpeed} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={5} step={0.5} onChange={setLineWidth} />
          <Slider label="Trail fade" value={trailFade} min={0.005} max={0.3} step={0.005} onChange={setTrailFade} />
          <Slider label="Phase shift" value={phaseShift} min={0} max={360} step={5} onChange={setPhaseShift} />
          <Slider label="Amplitude" value={amplitude} min={0.3} max={1} step={0.05} onChange={setAmplitude} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={30} step={2} onChange={setGlowBlur} />
          <Slider label="Curve points" value={curvePoints} min={100} max={1200} step={100} onChange={setCurvePoints} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function LSystemPanel() {
  const [preset, setPreset] = useState("default");
  const [iterations, setIterations] = useState(4);
  const [angle, setAngle] = useState(25);
  const [speed, setSpeed] = useState(5);
  const [lineWidth, setLineWidth] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [glow, setGlow] = useState(false);
  const [autoReset, setAutoReset] = useState(true);
  const [trailFade, setTrailFade] = useState(0);
  const [glowBlur, setGlowBlur] = useState(0);
  const code = `import { LSystem } from 'own-the-canvas';

<LSystem
  preset="${preset}"
  iterations={${iterations}}
  angle={${angle}}
  speed={${speed}}
  color="${color}"
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <LSystem preset={preset} iterations={iterations} angle={angle}
            speed={speed} lineWidth={lineWidth} color={color}
            backgroundColor={bg} glowEffect={glow}
            autoReset={autoReset} trailFade={trailFade} glowBlur={glowBlur}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="LSystem" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "fern", "dragon", "sierpinski", "bush", "snowflake"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Iterations" value={iterations} min={1} max={7} step={1} onChange={setIterations} />
          <Slider label="Angle" value={angle} min={5} max={90} step={1} onChange={setAngle} />
          <Slider label="Draw speed" value={speed} min={1} max={50} step={1} onChange={setSpeed} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.5} onChange={setLineWidth} />
          <Slider label="Trail fade" value={trailFade} min={0} max={0.1} step={0.005} onChange={setTrailFade} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={30} step={2} onChange={setGlowBlur} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Auto reset" value={autoReset} onChange={setAutoReset} />
        </div>
      </div>
    </>
  );
}

function KaleidoscopePanel() {
  const [preset, setPreset] = useState("default");
  const [segments, setSegments] = useState(6);
  const [speed, setSpeed] = useState(1);
  const [noiseScale, setNoiseScale] = useState(3);
  const [rotation, setRotation] = useState(0.2);
  const [colorA, setColorA] = useState("#ffffff");
  const [colorB, setColorB] = useState("#333333");
  const [bg, setBg] = useState("#111111");
  const [animated, setAnimated] = useState(true);
  const [zoomSpeed, setZoomSpeed] = useState(0.2);
  const [resolution, setResolution] = useState(0.5);
  const code = `import { Kaleidoscope } from 'own-the-canvas';

<Kaleidoscope
  preset="${preset}"
  segments={${segments}}
  speed={${speed}}
  noiseScale={${noiseScale}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Kaleidoscope preset={preset} segments={segments} speed={speed}
            noiseScale={noiseScale} rotation={rotation}
            colorA={colorA} colorB={colorB} backgroundColor={bg} animated={animated}
            zoomSpeed={zoomSpeed} resolution={resolution}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Kaleidoscope" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "ice", "fire", "nature", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Color A" value={colorA} onChange={setColorA} />
          <ColorPicker label="Color B" value={colorB} onChange={setColorB} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Segments" value={segments} min={3} max={24} step={1} onChange={setSegments} />
          <Slider label="Speed" value={speed} min={0.1} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Noise scale" value={noiseScale} min={0.5} max={10} step={0.5} onChange={setNoiseScale} />
          <Slider label="Rotation speed" value={rotation} min={0} max={2} step={0.05} onChange={setRotation} />
          <Slider label="Zoom speed" value={zoomSpeed} min={0} max={1} step={0.05} onChange={setZoomSpeed} />
          <Slider label="Resolution" value={resolution} min={0.2} max={1} step={0.1} onChange={setResolution} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function VoronoiCellsPanel() {
  const [preset, setPreset] = useState("default");
  const [cellCount, setCellCount] = useState(20);
  const [speed, setSpeed] = useState(1);
  const [colorMode, setColorMode] = useState<VoronoiColorMode>("solid");
  const [cellColor, setCellColor] = useState("#ffffff");
  const [edgeColor, setEdgeColor] = useState("#333333");
  const [bg, setBg] = useState("#111111");
  const [showEdges, setShowEdges] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [resolution, setResolution] = useState(0.3);
  const [relaxation, setRelaxation] = useState(0.05);
  const [interactive, setInteractive] = useState(true);
  const code = `import { VoronoiCells } from 'own-the-canvas';

<VoronoiCells
  preset="${preset}"
  cellCount={${cellCount}}
  colorMode="${colorMode}"
  speed={${speed}}
  showEdges={${showEdges}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <VoronoiCells preset={preset} cellCount={cellCount} speed={speed}
            colorMode={colorMode} cellColor={cellColor} edgeColor={edgeColor}
            backgroundColor={bg} showEdges={showEdges} animated={animated}
            resolution={resolution} relaxation={relaxation} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to add seeds · drag to move</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="VoronoiCells" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "pastel", "monochrome", "fire"]} onChange={setPreset} />
          <Sel label="Color mode" value={colorMode} options={["solid", "gradient", "cycle"]} onChange={(v) => setColorMode(v as VoronoiColorMode)} />
          <Divider />
          <ColorPicker label="Cell color" value={cellColor} onChange={setCellColor} />
          <ColorPicker label="Edge color" value={edgeColor} onChange={setEdgeColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Cell count" value={cellCount} min={5} max={80} step={5} onChange={setCellCount} />
          <Slider label="Drift speed" value={speed} min={0} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Resolution" value={resolution} min={0.1} max={0.5} step={0.05} onChange={setResolution} />
          <Slider label="Relaxation" value={relaxation} min={0} max={0.2} step={0.01} onChange={setRelaxation} />
          <Toggle label="Show edges" value={showEdges} onChange={setShowEdges} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function SlimeMoldPanel() {
  const [preset, setPreset] = useState("default");
  const [agentCount, setAgentCount] = useState(1800);
  const [sensorAngle, setSensorAngle] = useState(45);
  const [stepSize, setStepSize] = useState(1.5);
  const [trailDecay, setTrailDecay] = useState(0.92);
  const [trailColor, setTrailColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [interactive, setInteractive] = useState(true);
  const [sensorDistance, setSensorDistance] = useState(9);
  const [rotateSpeed, setRotateSpeed] = useState(45);
  const [diffuseStrength, setDiffuseStrength] = useState(0.2);
  const [resolution, setResolution] = useState(0.4);
  const [mouseRadius, setMouseRadius] = useState(20);
  const [mouseStrength, setMouseStrength] = useState(5);
  const [animated, setAnimated] = useState(true);
  const code = `import { SlimeMold } from 'own-the-canvas';

<SlimeMold
  preset="${preset}"
  agentCount={${agentCount}}
  trailDecay={${trailDecay}}
  sensorDistance={${sensorDistance}}
  rotateSpeed={${rotateSpeed}}
  diffuseStrength={${diffuseStrength}}
  resolution={${resolution}}
  mouseRadius={${mouseRadius}}
  mouseStrength={${mouseStrength}}
  interactive={${interactive}}
  animated={${animated}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <SlimeMold preset={preset} agentCount={agentCount} sensorAngle={sensorAngle}
            stepSize={stepSize} trailDecay={trailDecay} trailColor={trailColor}
            backgroundColor={bg} interactive={interactive}
            sensorDistance={sensorDistance} rotateSpeed={rotateSpeed}
            diffuseStrength={diffuseStrength} resolution={resolution}
            mouseRadius={mouseRadius} mouseStrength={mouseStrength}
            animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to attract the slime</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="SlimeMold" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "toxic", "minimal", "web"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Trail color" value={trailColor} onChange={setTrailColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Agent count" value={agentCount} min={200} max={5000} step={200} onChange={setAgentCount} />
          <Slider label="Sensor angle" value={sensorAngle} min={10} max={90} step={5} onChange={setSensorAngle} />
          <Slider label="Sensor distance" value={sensorDistance} min={3} max={20} step={1} onChange={setSensorDistance} />
          <Slider label="Rotate speed" value={rotateSpeed} min={10} max={90} step={5} onChange={setRotateSpeed} />
          <Slider label="Step size" value={stepSize} min={0.5} max={4} step={0.25} onChange={setStepSize} />
          <Slider label="Trail decay" value={trailDecay} min={0.8} max={0.99} step={0.01} onChange={setTrailDecay} />
          <Slider label="Diffuse strength" value={diffuseStrength} min={0.05} max={0.5} step={0.05} onChange={setDiffuseStrength} />
          <Slider label="Resolution" value={resolution} min={0.2} max={0.6} step={0.1} onChange={setResolution} />
          <Slider label="Mouse radius" value={mouseRadius} min={5} max={50} step={5} onChange={setMouseRadius} />
          <Slider label="Mouse strength" value={mouseStrength} min={1} max={10} step={1} onChange={setMouseStrength} />
          <Toggle label="Mouse attraction" value={interactive} onChange={setInteractive} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function InkBleedPanel() {
  const [preset, setPreset] = useState("default");
  const [inkColor, setInkColor] = useState("#ffffff");
  const [paperColor, setPaperColor] = useState("#111111");
  const [diffusionRate, setDiffusionRate] = useState(0.3);
  const [viscosity, setViscosity] = useState(0.8);
  const [inkRadius, setInkRadius] = useState(8);
  const [autoInk, setAutoInk] = useState(true);
  const [glow, setGlow] = useState(false);
  const [evaporationRate, setEvaporationRate] = useState(0.002);
  const [inkStrength, setInkStrength] = useState(1);
  const [interactive, setInteractive] = useState(true);
  const [autoInkInterval, setAutoInkInterval] = useState(2000);
  const [resolution, setResolution] = useState(0.5);
  const [glowBlur, setGlowBlur] = useState(8);
  const [animated, setAnimated] = useState(true);
  const code = `import { InkBleed } from 'own-the-canvas';

<InkBleed
  preset="${preset}"
  inkColor="${inkColor}"
  diffusionRate={${diffusionRate}}
  viscosity={${viscosity}}
  evaporationRate={${evaporationRate}}
  inkStrength={${inkStrength}}
  autoInk={${autoInk}}
  autoInkInterval={${autoInkInterval}}
  resolution={${resolution}}
  glowBlur={${glowBlur}}
  interactive={${interactive}}
  animated={${animated}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <InkBleed preset={preset} inkColor={inkColor} paperColor={paperColor}
            diffusionRate={diffusionRate} viscosity={viscosity}
            inkRadius={inkRadius} autoInk={autoInk} glowEffect={glow}
            evaporationRate={evaporationRate} inkStrength={inkStrength}
            interactive={interactive} autoInkInterval={autoInkInterval}
            resolution={resolution} glowBlur={glowBlur} animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click/drag to drop ink</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="InkBleed" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "sumi", "neon", "rust", "midnight"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Ink color" value={inkColor} onChange={setInkColor} />
          <ColorPicker label="Paper color" value={paperColor} onChange={setPaperColor} />
          <Slider label="Diffusion rate" value={diffusionRate} min={0.05} max={0.9} step={0.05} onChange={setDiffusionRate} />
          <Slider label="Viscosity" value={viscosity} min={0.1} max={1} step={0.05} onChange={setViscosity} />
          <Slider label="Evaporation rate" value={evaporationRate} min={0.0005} max={0.01} step={0.0005} onChange={setEvaporationRate} />
          <Slider label="Ink strength" value={inkStrength} min={0.1} max={1} step={0.1} onChange={setInkStrength} />
          <Slider label="Drop radius" value={inkRadius} min={2} max={30} step={1} onChange={setInkRadius} />
          <Slider label="Auto ink interval (ms)" value={autoInkInterval} min={500} max={5000} step={500} onChange={setAutoInkInterval} />
          <Slider label="Resolution" value={resolution} min={0.2} max={1} step={0.1} onChange={setResolution} />
          <Slider label="Glow blur" value={glowBlur} min={2} max={30} step={1} onChange={setGlowBlur} />
          <Toggle label="Auto ink drops" value={autoInk} onChange={setAutoInk} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function WatercolorBloomPanel() {
  const [preset, setPreset] = useState("default");
  const [bg, setBg] = useState("#111111");
  const [bloomRadius, setBloomRadius] = useState(80);
  const [bloomSpeed, setBloomSpeed] = useState(0.5);
  const [opacity, setOpacity] = useState(0.15);
  const [wetEdge, setWetEdge] = useState(0.4);
  const [layerCount, setLayerCount] = useState(6);
  const [noiseAmount, setNoiseAmount] = useState(0.5);
  const [autoBloom, setAutoBloom] = useState(true);
  const [fadeSpeed, setFadeSpeed] = useState(0.001);
  const [interactive, setInteractive] = useState(true);
  const [autoBloomInterval, setAutoBloomInterval] = useState(1500);
  const [resolution, setResolution] = useState(0.5);
  const [animated, setAnimated] = useState(true);
  const [maxBlooms, setMaxBlooms] = useState(12);
  const code = `import { WatercolorBloom } from 'own-the-canvas';

<WatercolorBloom
  preset="${preset}"
  bloomRadius={${bloomRadius}}
  opacity={${opacity}}
  wetEdge={${wetEdge}}
  layerCount={${layerCount}}
  fadeSpeed={${fadeSpeed}}
  autoBloom={${autoBloom}}
  autoBloomInterval={${autoBloomInterval}}
  resolution={${resolution}}
  maxBlooms={${maxBlooms}}
  interactive={${interactive}}
  animated={${animated}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <WatercolorBloom preset={preset} bloomRadius={bloomRadius} bloomSpeed={bloomSpeed}
            opacity={opacity} wetEdge={wetEdge} layerCount={layerCount}
            noiseAmount={noiseAmount} autoBloom={autoBloom} backgroundColor={bg}
            fadeSpeed={fadeSpeed} interactive={interactive}
            autoBloomInterval={autoBloomInterval} resolution={resolution}
            animated={animated} maxBlooms={maxBlooms}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to spawn blooms</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="WatercolorBloom" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "sunset", "ocean", "spring", "monochrome", "neon"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Bloom radius" value={bloomRadius} min={20} max={200} step={5} onChange={setBloomRadius} />
          <Slider label="Bloom speed" value={bloomSpeed} min={0.1} max={2} step={0.1} onChange={setBloomSpeed} />
          <Slider label="Opacity" value={opacity} min={0.02} max={0.5} step={0.01} onChange={setOpacity} />
          <Slider label="Wet edge" value={wetEdge} min={0} max={1} step={0.05} onChange={setWetEdge} />
          <Slider label="Layers" value={layerCount} min={1} max={12} step={1} onChange={setLayerCount} />
          <Slider label="Edge noise" value={noiseAmount} min={0} max={1} step={0.05} onChange={setNoiseAmount} />
          <Slider label="Fade speed" value={fadeSpeed} min={0.0002} max={0.005} step={0.0002} onChange={setFadeSpeed} />
          <Slider label="Auto bloom interval (ms)" value={autoBloomInterval} min={500} max={5000} step={500} onChange={setAutoBloomInterval} />
          <Slider label="Resolution" value={resolution} min={0.2} max={1} step={0.1} onChange={setResolution} />
          <Slider label="Max blooms" value={maxBlooms} min={1} max={30} step={1} onChange={setMaxBlooms} />
          <Toggle label="Auto bloom" value={autoBloom} onChange={setAutoBloom} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function PendulaWavePanel() {
  const [preset, setPreset] = useState("default");
  const [freq1, setFreq1] = useState(2);
  const [freq2, setFreq2] = useState(3);
  const [freq3, setFreq3] = useState(0.01);
  const [amplitude, setAmplitude] = useState(0.9);
  const [speed, setSpeed] = useState(1);
  const [damping, setDamping] = useState(0.9995);
  const [lineWidth, setLineWidth] = useState(1);
  const [trailFade, setTrailFade] = useState(0.01);
  const [color, setColor] = useState("#ffffff");
  const [color2, setColor2] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [colorMode, setColorMode] = useState<PendulaWaveColorMode>("solid");
  const [glow, setGlow] = useState(false);
  const [glowBlur, setGlowBlur] = useState(10);
  const code = `import { PendulaWave } from 'own-the-canvas';

<PendulaWave
  preset="${preset}"
  freq1={${freq1}}
  freq2={${freq2}}
  freq3={${freq3}}
  amplitude={${amplitude}}
  speed={${speed}}
  colorMode="${colorMode}"
  damping={${damping}}
  color2="${color2}"
  glowBlur={${glowBlur}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <PendulaWave preset={preset} freq1={freq1} freq2={freq2} freq3={freq3}
            amplitude={amplitude} speed={speed} damping={damping}
            lineWidth={lineWidth} trailFade={trailFade} color={color} color2={color2}
            backgroundColor={bg} colorMode={colorMode} glowEffect={glow} glowBlur={glowBlur}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="PendulaWave" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "crystal", "sand", "minimal", "cosmic"]} onChange={setPreset} />
          <Sel label="Color mode" value={colorMode} options={["solid", "cycle", "gradient"]} onChange={(v) => setColorMode(v as PendulaWaveColorMode)} />
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Color 2" value={color2} onChange={setColor2} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Freq X" value={freq1} min={1} max={12} step={0.5} onChange={setFreq1} />
          <Slider label="Freq Y" value={freq2} min={1} max={12} step={0.5} onChange={setFreq2} />
          <Slider label="Freq 3" value={freq3} min={0.001} max={0.1} step={0.001} onChange={setFreq3} />
          <Slider label="Amplitude" value={amplitude} min={0.1} max={1} step={0.05} onChange={setAmplitude} />
          <Slider label="Speed" value={speed} min={0.1} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Damping" value={damping} min={0.99} max={1} step={0.0001} onChange={setDamping} />
          <Slider label="Trail fade" value={trailFade} min={0.001} max={0.1} step={0.001} onChange={setTrailFade} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={5} step={0.5} onChange={setLineWidth} />
          <Slider label="Glow blur" value={glowBlur} min={2} max={30} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
        </div>
      </div>
    </>
  );
}

function CrystalGrowthPanel() {
  const [preset, setPreset] = useState("default");
  const [symmetry, setSymmetry] = useState(6);
  const [growthSpeed, setGrowthSpeed] = useState(3);
  const [branchProbability, setBranchProbability] = useState(0.3);
  const [cellSize, setCellSize] = useState(3);
  const [crystalColor, setCrystalColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [colorMode, setColorMode] = useState<CrystalGrowthColorMode>("solid");
  const [glow, setGlow] = useState(true);
  const [activeColor, setActiveColor] = useState("#6b7280");
  const [glowBlur, setGlowBlur] = useState(12);
  const [interactive, setInteractive] = useState(true);
  const [autoReset, setAutoReset] = useState(true);
  const [noiseAmount, setNoiseAmount] = useState(0.2);
  const code = `import { CrystalGrowth } from 'own-the-canvas';

<CrystalGrowth
  preset="${preset}"
  symmetry={${symmetry}}
  growthSpeed={${growthSpeed}}
  branchProbability={${branchProbability}}
  activeColor="${activeColor}"
  glowBlur={${glowBlur}}
  noiseAmount={${noiseAmount}}
  interactive={${interactive}}
  autoReset={${autoReset}}
  glowEffect={${glow}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <CrystalGrowth preset={preset} symmetry={symmetry} growthSpeed={growthSpeed}
            branchProbability={branchProbability} cellSize={cellSize}
            crystalColor={crystalColor} activeColor={activeColor} backgroundColor={bg}
            colorMode={colorMode} glowEffect={glow} glowBlur={glowBlur}
            interactive={interactive} autoReset={autoReset} noiseAmount={noiseAmount}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to seed new growth</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="CrystalGrowth" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "snowflake", "gem", "neon", "frost", "gold"]} onChange={setPreset} />
          <Sel label="Color mode" value={colorMode} options={["solid", "age", "cycle"]} onChange={(v) => setColorMode(v as CrystalGrowthColorMode)} />
          <Divider />
          <ColorPicker label="Crystal color" value={crystalColor} onChange={setCrystalColor} />
          <ColorPicker label="Active color" value={activeColor} onChange={setActiveColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Symmetry arms" value={symmetry} min={2} max={12} step={1} onChange={setSymmetry} />
          <Slider label="Growth speed" value={growthSpeed} min={1} max={15} step={1} onChange={setGrowthSpeed} />
          <Slider label="Branch probability" value={branchProbability} min={0} max={0.8} step={0.05} onChange={setBranchProbability} />
          <Slider label="Noise amount" value={noiseAmount} min={0} max={1} step={0.05} onChange={setNoiseAmount} />
          <Slider label="Cell size" value={cellSize} min={1} max={8} step={1} onChange={setCellSize} />
          <Slider label="Glow blur" value={glowBlur} min={2} max={30} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
          <Toggle label="Auto reset" value={autoReset} onChange={setAutoReset} />
        </div>
      </div>
    </>
  );
}

function NeuralWebPanel() {
  const [preset, setPreset] = useState("default");
  const [nodeCount, setNodeCount] = useState(40);
  const [connectionRadius, setConnectionRadius] = useState(150);
  const [speed, setSpeed] = useState(1);
  const [pulseInterval, setPulseInterval] = useState(2000);
  const [nodeColor, setNodeColor] = useState("#ffffff");
  const [edgeColor, setEdgeColor] = useState("#6b7280");
  const [signalColor, setSignalColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [glow, setGlow] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [nodeRadius, setNodeRadius] = useState(4);
  const [lineWidth, setLineWidth] = useState(1);
  const [pulseDecay, setPulseDecay] = useState(0.85);
  const [glowBlur, setGlowBlur] = useState(15);
  const [wanderSpeed, setWanderSpeed] = useState(0.3);
  const [animated, setAnimated] = useState(true);
  const code = `import { NeuralWeb } from 'own-the-canvas';

<NeuralWeb
  preset="${preset}"
  nodeCount={${nodeCount}}
  connectionRadius={${connectionRadius}}
  speed={${speed}}
  signalColor="${signalColor}"
  nodeRadius={${nodeRadius}}
  lineWidth={${lineWidth}}
  pulseDecay={${pulseDecay}}
  glowBlur={${glowBlur}}
  wanderSpeed={${wanderSpeed}}
  interactive={${interactive}}
  animated={${animated}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <NeuralWeb preset={preset} nodeCount={nodeCount} connectionRadius={connectionRadius}
            speed={speed} pulseInterval={pulseInterval} nodeColor={nodeColor}
            edgeColor={edgeColor} signalColor={signalColor} backgroundColor={bg}
            glowEffect={glow} interactive={interactive}
            nodeRadius={nodeRadius} lineWidth={lineWidth} pulseDecay={pulseDecay}
            glowBlur={glowBlur} wanderSpeed={wanderSpeed} animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to fire a signal pulse</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="NeuralWeb" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "brain", "minimal", "plasma", "circuit"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Node color" value={nodeColor} onChange={setNodeColor} />
          <ColorPicker label="Edge color" value={edgeColor} onChange={setEdgeColor} />
          <ColorPicker label="Signal color" value={signalColor} onChange={setSignalColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Node count" value={nodeCount} min={10} max={100} step={5} onChange={setNodeCount} />
          <Slider label="Node radius" value={nodeRadius} min={1} max={10} step={0.5} onChange={setNodeRadius} />
          <Slider label="Connection radius" value={connectionRadius} min={50} max={300} step={10} onChange={setConnectionRadius} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.5} onChange={setLineWidth} />
          <Slider label="Signal speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Pulse interval (ms)" value={pulseInterval} min={500} max={5000} step={100} onChange={setPulseInterval} />
          <Slider label="Pulse decay" value={pulseDecay} min={0.5} max={1} step={0.01} onChange={setPulseDecay} />
          <Slider label="Glow blur" value={glowBlur} min={2} max={30} step={1} onChange={setGlowBlur} />
          <Slider label="Wander speed" value={wanderSpeed} min={0} max={2} step={0.1} onChange={setWanderSpeed} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function ParticleTextPanel() {
  const [preset, setPreset] = useState("default");
  const [text, setText] = useState("hello");
  const [fontSize, setFontSize] = useState(120);
  const [particleSize, setParticleSize] = useState(2);
  const [particleGap, setParticleGap] = useState(4);
  const [repelRadius, setRepelRadius] = useState(80);
  const [repelForce, setRepelForce] = useState(5);
  const [snapSpeed, setSnapSpeed] = useState(0.12);
  const [friction, setFriction] = useState(0.85);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [glow, setGlow] = useState(false);
  const [glowBlur, setGlowBlur] = useState(6);
  const [animated, setAnimated] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const code = `import { ParticleText } from 'own-the-canvas';

<ParticleText
  preset="${preset}"
  text="${text}"
  fontSize={${fontSize}}
  particleSize={${particleSize}}
  repelRadius={${repelRadius}}
  snapSpeed={${snapSpeed}}
  friction={${friction}}
  glowBlur={${glowBlur}}
  color="${color}"
  interactive={${interactive}}
  animated={${animated}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <ParticleText preset={preset} text={text} fontSize={fontSize} particleSize={particleSize}
            particleGap={particleGap} repelRadius={repelRadius} repelForce={repelForce}
            snapSpeed={snapSpeed} friction={friction}
            color={color} backgroundColor={bg} glowEffect={glow} glowBlur={glowBlur}
            animated={animated} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to scatter particles</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="ParticleText" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "fire", "frost", "gold", "minimal"]} onChange={setPreset} />
          <div className="ctrl-row">
            <label className="ctrl-label">Text</label>
            <input className="ctrl-text-input" value={text}
              onChange={e => e.target.value && setText(e.target.value)}
              spellCheck={false} />
          </div>
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Font size" value={fontSize} min={40} max={200} step={10} onChange={setFontSize} />
          <Slider label="Particle size" value={particleSize} min={1} max={6} step={0.5} onChange={setParticleSize} />
          <Slider label="Particle gap" value={particleGap} min={2} max={12} step={1} onChange={setParticleGap} />
          <Slider label="Repel radius" value={repelRadius} min={20} max={200} step={10} onChange={setRepelRadius} />
          <Slider label="Repel force" value={repelForce} min={1} max={15} step={0.5} onChange={setRepelForce} />
          <Slider label="Snap speed" value={snapSpeed} min={0.01} max={0.5} step={0.01} onChange={setSnapSpeed} />
          <Slider label="Friction" value={friction} min={0.5} max={0.99} step={0.01} onChange={setFriction} />
          <Slider label="Glow blur" value={glowBlur} min={2} max={30} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function MetaballsPanel() {
  const [preset, setPreset] = useState("default");
  const [blobCount, setBlobCount] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [minRadius, setMinRadius] = useState(40);
  const [maxRadius, setMaxRadius] = useState(80);
  const [threshold, setThreshold] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [glow, setGlow] = useState(true);
  const code = `import { Metaballs } from 'own-the-canvas';

<Metaballs
  preset="${preset}"
  blobCount={${blobCount}}
  speed={${speed}}
  threshold={${threshold}}
  glowEffect={${glow}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Metaballs preset={preset} blobCount={blobCount} speed={speed}
            minRadius={minRadius} maxRadius={maxRadius} threshold={threshold}
            color={color} backgroundColor={bg} glowEffect={glow}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Drag to move · click to add</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Metaballs" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "lava", "ocean", "plasma"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Blob count" value={blobCount} min={2} max={12} step={1} onChange={setBlobCount} />
          <Slider label="Speed" value={speed} min={0.1} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Min radius" value={minRadius} min={15} max={80} step={5} onChange={setMinRadius} />
          <Slider label="Max radius" value={maxRadius} min={30} max={150} step={5} onChange={setMaxRadius} />
          <Slider label="Threshold" value={threshold} min={0.5} max={2} step={0.05} onChange={setThreshold} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
        </div>
      </div>
    </>
  );
}

function AntColonyPanel() {
  const [preset, setPreset] = useState("default");
  const [antCount, setAntCount] = useState(150);
  const [antSpeed, setAntSpeed] = useState(1.5);
  const [evaporationRate, setEvaporationRate] = useState(0.003);
  const [pheromoneStrength, setPheromoneStrength] = useState(5);
  const [antColor, setAntColor] = useState("#ffffff");
  const [pheromoneColor, setPheromoneColor] = useState("#6b7280");
  const [foodColor, setFoodColor] = useState("#4ade80");
  const [nestColor, setNestColor] = useState("#f59e0b");
  const [bg, setBg] = useState("#111111");
  const [animated, setAnimated] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [diffusionRate, setDiffusionRate] = useState(0.1);
  const [sensorAngle, setSensorAngle] = useState(0.4);
  const [sensorDistance, setSensorDistance] = useState(6);
  const [turnSpeed, setTurnSpeed] = useState(0.3);
  const [resolution, setResolution] = useState(0.5);
  const code = `import { AntColony } from 'own-the-canvas';

<AntColony
  preset="${preset}"
  antCount={${antCount}}
  antSpeed={${antSpeed}}
  evaporationRate={${evaporationRate}}
  diffusionRate={${diffusionRate}}
  sensorAngle={${sensorAngle}}
  sensorDistance={${sensorDistance}}
  turnSpeed={${turnSpeed}}
  resolution={${resolution}}
  interactive={${interactive}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <AntColony preset={preset} antCount={antCount} antSpeed={antSpeed}
            evaporationRate={evaporationRate} pheromoneStrength={pheromoneStrength}
            antColor={antColor} pheromoneColor={pheromoneColor}
            foodColor={foodColor} nestColor={nestColor}
            backgroundColor={bg} animated={animated} interactive={interactive}
            diffusionRate={diffusionRate} sensorAngle={sensorAngle}
            sensorDistance={sensorDistance} turnSpeed={turnSpeed}
            resolution={resolution}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live simulation</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="AntColony" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "minimal", "dense"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Ant color" value={antColor} onChange={setAntColor} />
          <ColorPicker label="Pheromone color" value={pheromoneColor} onChange={setPheromoneColor} />
          <ColorPicker label="Food color" value={foodColor} onChange={setFoodColor} />
          <ColorPicker label="Nest color" value={nestColor} onChange={setNestColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Ant count" value={antCount} min={20} max={500} step={10} onChange={setAntCount} />
          <Slider label="Ant speed" value={antSpeed} min={0.5} max={4} step={0.25} onChange={setAntSpeed} />
          <Slider label="Evaporation" value={evaporationRate} min={0.001} max={0.02} step={0.001} onChange={setEvaporationRate} />
          <Slider label="Pheromone strength" value={pheromoneStrength} min={1} max={20} step={1} onChange={setPheromoneStrength} />
          <Slider label="Diffusion rate" value={diffusionRate} min={0.01} max={0.3} step={0.01} onChange={setDiffusionRate} />
          <Slider label="Sensor angle" value={sensorAngle} min={0.1} max={1} step={0.05} onChange={setSensorAngle} />
          <Slider label="Sensor distance" value={sensorDistance} min={3} max={15} step={1} onChange={setSensorDistance} />
          <Slider label="Turn speed" value={turnSpeed} min={0.1} max={0.8} step={0.05} onChange={setTurnSpeed} />
          <Slider label="Resolution" value={resolution} min={0.2} max={0.8} step={0.1} onChange={setResolution} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function MagneticFieldPanel() {
  const [fieldLineCount, setFieldLineCount] = useState(16);
  const [stepSize, setStepSize] = useState(4);
  const [lineColor, setLineColor] = useState("#6b7280");
  const [positiveColor, setPositiveColor] = useState("#ef4444");
  const [negativeColor, setNegativeColor] = useState("#3b82f6");
  const [bg, setBg] = useState("#111111");
  const [lineWidth, setLineWidth] = useState(1);
  const [lineOpacity, setLineOpacity] = useState(0.6);
  const [glow, setGlow] = useState(true);
  const [glowBlur, setGlowBlur] = useState(20);
  const [maxSteps, setMaxSteps] = useState(400);
  const [poleRadius, setPoleRadius] = useState(12);
  const [maxPoles, setMaxPoles] = useState(6);
  const [animated, setAnimated] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const code = `import { MagneticField } from 'own-the-canvas';

<MagneticField
  fieldLineCount={${fieldLineCount}}
  stepSize={${stepSize}}
  lineColor="${lineColor}"
  maxSteps={${maxSteps}}
  poleRadius={${poleRadius}}
  maxPoles={${maxPoles}}
  glowEffect={${glow}}
  glowBlur={${glowBlur}}
  animated={${animated}}
  interactive={${interactive}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <MagneticField fieldLineCount={fieldLineCount} stepSize={stepSize}
            lineColor={lineColor} positiveColor={positiveColor} negativeColor={negativeColor}
            backgroundColor={bg} lineWidth={lineWidth} lineOpacity={lineOpacity}
            glowEffect={glow} glowBlur={glowBlur} maxSteps={maxSteps}
            poleRadius={poleRadius} maxPoles={maxPoles}
            animated={animated} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Drag poles · click to add · right-click to remove</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="MagneticField" />
        <div className="ctrl-body">
          <ColorPicker label="N-pole color" value={positiveColor} onChange={setPositiveColor} />
          <ColorPicker label="S-pole color" value={negativeColor} onChange={setNegativeColor} />
          <ColorPicker label="Field line color" value={lineColor} onChange={setLineColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Field lines" value={fieldLineCount} min={4} max={32} step={4} onChange={setFieldLineCount} />
          <Slider label="Step size" value={stepSize} min={1} max={10} step={1} onChange={setStepSize} />
          <Slider label="Max steps" value={maxSteps} min={100} max={800} step={50} onChange={setMaxSteps} />
          <Slider label="Pole radius" value={poleRadius} min={5} max={25} step={1} onChange={setPoleRadius} />
          <Slider label="Max poles" value={maxPoles} min={2} max={10} step={1} onChange={setMaxPoles} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.25} onChange={setLineWidth} />
          <Slider label="Line opacity" value={lineOpacity} min={0.1} max={1} step={0.05} onChange={setLineOpacity} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={2} onChange={setGlowBlur} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function TerrainMeshPanel() {
  const [preset, setPreset] = useState("default");
  const [gridCols, setGridCols] = useState(40);
  const [gridRows, setGridRows] = useState(30);
  const [noiseScale, setNoiseScale] = useState(0.12);
  const [heightScale, setHeightScale] = useState(120);
  const [wireColor, setWireColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [autoRotate, setAutoRotate] = useState(true);
  const [glow, setGlow] = useState(false);
  const [glowBlur, setGlowBlur] = useState(10);
  const [fov, setFov] = useState(500);
  const [rotateX, setRotateX] = useState(0.4);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(0.003);
  const [lineWidth, setLineWidth] = useState(0.5);
  const [animated, setAnimated] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const code = `import { TerrainMesh } from 'own-the-canvas';

<TerrainMesh
  preset="${preset}"
  gridCols={${gridCols}}
  noiseScale={${noiseScale}}
  heightScale={${heightScale}}
  fov={${fov}}
  rotateX={${rotateX}}
  autoRotateSpeed={${autoRotateSpeed}}
  lineWidth={${lineWidth}}
  autoRotate={${autoRotate}}
  animated={${animated}}
  interactive={${interactive}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <TerrainMesh preset={preset} gridCols={gridCols} gridRows={gridRows}
            noiseScale={noiseScale} heightScale={heightScale} wireColor={wireColor}
            backgroundColor={bg} autoRotate={autoRotate} glowEffect={glow}
            glowBlur={glowBlur} fov={fov} rotateX={rotateX}
            autoRotateSpeed={autoRotateSpeed} lineWidth={lineWidth}
            animated={animated} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Drag to orbit</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="TerrainMesh" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "mountain", "ocean", "desert", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Wire color" value={wireColor} onChange={setWireColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Grid cols" value={gridCols} min={10} max={80} step={5} onChange={setGridCols} />
          <Slider label="Grid rows" value={gridRows} min={10} max={60} step={5} onChange={setGridRows} />
          <Slider label="Noise scale" value={noiseScale} min={0.02} max={0.5} step={0.01} onChange={setNoiseScale} />
          <Slider label="Height scale" value={heightScale} min={20} max={300} step={10} onChange={setHeightScale} />
          <Slider label="FOV" value={fov} min={200} max={1000} step={50} onChange={setFov} />
          <Slider label="Rotate X" value={rotateX} min={0} max={1.5} step={0.05} onChange={setRotateX} />
          <Slider label="Auto-rotate speed" value={autoRotateSpeed} min={0.001} max={0.01} step={0.001} onChange={setAutoRotateSpeed} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={3} step={0.25} onChange={setLineWidth} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={20} step={2} onChange={setGlowBlur} />
          <Toggle label="Auto rotate" value={autoRotate} onChange={setAutoRotate} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function BlackHolePanel() {
  const [preset, setPreset] = useState("default");
  const [particleCount, setParticleCount] = useState(300);
  const [gravity, setGravity] = useState(200);
  const [eventHorizonRadius, setEventHorizonRadius] = useState(30);
  const [diskWidth, setDiskWidth] = useState(120);
  const [speed, setSpeed] = useState(1);
  const [diskColor, setDiskColor] = useState("#ffffff");
  const [jetColor, setJetColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [showJets, setShowJets] = useState(true);
  const [lensing, setLensing] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const code = `import { BlackHole } from 'own-the-canvas';

<BlackHole
  preset="${preset}"
  particleCount={${particleCount}}
  gravity={${gravity}}
  eventHorizonRadius={${eventHorizonRadius}}
  jetColor="${jetColor}"
  showJets={${showJets}}
  lensing={${lensing}}
  interactive={${interactive}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <BlackHole preset={preset} particleCount={particleCount} gravity={gravity}
            eventHorizonRadius={eventHorizonRadius} diskWidth={diskWidth}
            speed={speed} diskColor={diskColor} jetColor={jetColor} backgroundColor={bg}
            showJets={showJets} lensing={lensing} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to shift the singularity</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="BlackHole" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neutron", "quasar", "minimal", "neon"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Disk color" value={diskColor} onChange={setDiskColor} />
          <ColorPicker label="Jet color" value={jetColor} onChange={setJetColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Particle count" value={particleCount} min={50} max={800} step={50} onChange={setParticleCount} />
          <Slider label="Gravity" value={gravity} min={50} max={600} step={25} onChange={setGravity} />
          <Slider label="Event horizon" value={eventHorizonRadius} min={10} max={80} step={5} onChange={setEventHorizonRadius} />
          <Slider label="Disk width" value={diskWidth} min={40} max={250} step={10} onChange={setDiskWidth} />
          <Slider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
          <Toggle label="Polar jets" value={showJets} onChange={setShowJets} />
          <Toggle label="Lensing grid" value={lensing} onChange={setLensing} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function GalaxySpiralPanel() {
  const [preset, setPreset] = useState("default");
  const [starCount, setStarCount] = useState(3000);
  const [armCount, setArmCount] = useState(2);
  const [armTightness, setArmTightness] = useState(0.5);
  const [rotationSpeed, setRotationSpeed] = useState(0.0003);
  const [coreColor, setCoreColor] = useState("#ffffff");
  const [diskColor, setDiskColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [coreGlow, setCoreGlow] = useState(true);
  const [tiltX, setTiltX] = useState(0.3);
  const [glowBlur, setGlowBlur] = useState(30);
  const [interactive, setInteractive] = useState(true);
  const code = `import { GalaxySpiral } from 'own-the-canvas';

<GalaxySpiral
  preset="${preset}"
  starCount={${starCount}}
  armCount={${armCount}}
  armTightness={${armTightness}}
  rotationSpeed={${rotationSpeed}}
  tiltX={${tiltX}}
  glowBlur={${glowBlur}}
  interactive={${interactive}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <GalaxySpiral preset={preset} starCount={starCount} armCount={armCount}
            armTightness={armTightness} rotationSpeed={rotationSpeed}
            coreColor={coreColor} diskColor={diskColor} backgroundColor={bg}
            coreGlow={coreGlow} tiltX={tiltX} glowBlur={glowBlur}
            interactive={interactive} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to tilt the galaxy</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="GalaxySpiral" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "milkyway", "andromeda", "barred", "neon"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Core color" value={coreColor} onChange={setCoreColor} />
          <ColorPicker label="Disk color" value={diskColor} onChange={setDiskColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Star count" value={starCount} min={500} max={8000} step={500} onChange={setStarCount} />
          <Slider label="Arm count" value={armCount} min={1} max={6} step={1} onChange={setArmCount} />
          <Slider label="Arm tightness" value={armTightness} min={0.1} max={1.5} step={0.05} onChange={setArmTightness} />
          <Slider label="Rotation speed" value={rotationSpeed} min={0.00005} max={0.002} step={0.00005} onChange={setRotationSpeed} />
          <Slider label="Tilt X" value={tiltX} min={0} max={1} step={0.05} onChange={setTiltX} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={50} step={5} onChange={setGlowBlur} />
          <Toggle label="Core glow" value={coreGlow} onChange={setCoreGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

function TornadoVortexPanel() {
  const [preset, setPreset] = useState("default");
  const [particleCount, setParticleCount] = useState(600);
  const [rotationSpeed, setRotationSpeed] = useState(3);
  const [funnelHeight, setFunnelHeight] = useState(0.8);
  const [vortexStrength, setVortexStrength] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [funnelColor, setFunnelColor] = useState("#ffffff");
  const [debrisColor, setDebrisColor] = useState("#92400e");
  const [lightningColor, setLightningColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [showLightning, setShowLightning] = useState(true);
  const [showGroundDust, setShowGroundDust] = useState(true);
  const code = `import { TornadoVortex } from 'own-the-canvas';

<TornadoVortex
  preset="${preset}"
  particleCount={${particleCount}}
  rotationSpeed={${rotationSpeed}}
  debrisColor="${debrisColor}"
  lightningColor="${lightningColor}"
  showLightning={${showLightning}}
  showGroundDust={${showGroundDust}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <TornadoVortex preset={preset} particleCount={particleCount}
            rotationSpeed={rotationSpeed} funnelHeight={funnelHeight}
            vortexStrength={vortexStrength} speed={speed} funnelColor={funnelColor}
            debrisColor={debrisColor} lightningColor={lightningColor}
            backgroundColor={bg} showLightning={showLightning}
            showGroundDust={showGroundDust} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to move the tornado</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="TornadoVortex" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "fire", "electric", "dust", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Funnel color" value={funnelColor} onChange={setFunnelColor} />
          <ColorPicker label="Debris color" value={debrisColor} onChange={setDebrisColor} />
          <ColorPicker label="Lightning color" value={lightningColor} onChange={setLightningColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Particle count" value={particleCount} min={100} max={1200} step={100} onChange={setParticleCount} />
          <Slider label="Rotation speed" value={rotationSpeed} min={0.5} max={8} step={0.5} onChange={setRotationSpeed} />
          <Slider label="Funnel height" value={funnelHeight} min={0.3} max={1} step={0.05} onChange={setFunnelHeight} />
          <Slider label="Vortex strength" value={vortexStrength} min={0.2} max={3} step={0.1} onChange={setVortexStrength} />
          <Slider label="Speed" value={speed} min={0.2} max={3} step={0.1} onChange={setSpeed} />
          <Toggle label="Internal lightning" value={showLightning} onChange={setShowLightning} />
          <Toggle label="Ground dust" value={showGroundDust} onChange={setShowGroundDust} />
        </div>
      </div>
    </>
  );
}

function SolarFlarePanel() {
  const [preset, setPreset] = useState("default");
  const [sunRadius, setSunRadius] = useState(0.35);
  const [convectionCells, setConvectionCells] = useState(20);
  const [flareCount, setFlareCount] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [sunColor, setSunColor] = useState("#ffffff");
  const [coronaColor, setCoronaColor] = useState("#6b7280");
  const [flareColor, setFlareColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [autoFlare, setAutoFlare] = useState(true);
  const [autoFlareInterval, setAutoFlareInterval] = useState(3000);
  const [glow, setGlow] = useState(true);
  const [glowBlur, setGlowBlur] = useState(40);
  const [interactive, setInteractive] = useState(true);
  const code = `import { SolarFlare } from 'own-the-canvas';

<SolarFlare
  preset="${preset}"
  sunRadius={${sunRadius}}
  flareCount={${flareCount}}
  flareColor="${flareColor}"
  autoFlare={${autoFlare}}
  autoFlareInterval={${autoFlareInterval}}
  glowBlur={${glowBlur}}
  interactive={${interactive}}
  speed={${speed}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <SolarFlare preset={preset} sunRadius={sunRadius} convectionCells={convectionCells}
            flareCount={flareCount} speed={speed} sunColor={sunColor}
            coronaColor={coronaColor} flareColor={flareColor} backgroundColor={bg}
            autoFlare={autoFlare} autoFlareInterval={autoFlareInterval}
            glowEffect={glow} glowBlur={glowBlur} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to trigger a flare</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="SolarFlare" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "intense", "calm", "neon", "minimal"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Sun color" value={sunColor} onChange={setSunColor} />
          <ColorPicker label="Corona color" value={coronaColor} onChange={setCoronaColor} />
          <ColorPicker label="Flare color" value={flareColor} onChange={setFlareColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Sun radius" value={sunRadius} min={0.1} max={0.6} step={0.01} onChange={setSunRadius} />
          <Slider label="Convection cells" value={convectionCells} min={5} max={50} step={5} onChange={setConvectionCells} />
          <Slider label="Flare count" value={flareCount} min={1} max={8} step={1} onChange={setFlareCount} />
          <Slider label="Auto-flare interval (ms)" value={autoFlareInterval} min={500} max={8000} step={500} onChange={setAutoFlareInterval} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={60} step={5} onChange={setGlowBlur} />
          <Slider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
          <Toggle label="Auto flare" value={autoFlare} onChange={setAutoFlare} />
          <Toggle label="Glow" value={glow} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

// ─── Controls header ──────────────────────────────────────────────────────────
function CtrlHeader({ id }: { id: ComponentId }) {
  const meta = COMPONENT_META[id];
  const icon = icons[id];
  const { setShowCode } = React.useContext(CodeContext);
  return (
    <div className="ctrl-head">
      <div className="ctrl-head-top">
        <div className="ctrl-component-icon" style={{ background: meta.accent + "22", color: meta.accent }}>
          {icon}
        </div>
        <span className="ctrl-name">{id}</span>
        <button className="code-view-btn" onClick={() => setShowCode(true)}>{"</>"}</button>
      </div>
      <p className="ctrl-desc">{meta.desc}</p>
    </div>
  );
}

// ─── Panel map ────────────────────────────────────────────────────────────────
const PANELS: Record<ComponentId, React.FC> = {
  DragonCursor: DragonCursorPanel,
  KoiPond: KoiPondPanel,
  MatrixRain: MatrixRainPanel,
  ParticleField: ParticleFieldPanel,
  Starfield: StarfieldPanel,
  FireEffect: FireEffectPanel,
  AudioVisualizer: AudioVisualizerPanel,
  Confetti: ConfettiPanel,
  NoiseGradient: NoiseGradientPanel,
  PixelDissolve: PixelDissolvePanel,
  FlowField: FlowFieldPanel,
  Spotlight: SpotlightPanel,
  Shockwave: ShockwavePanel,
  Fireworks: FireworksPanel,
  GlitchOverlay: GlitchOverlayPanel,
  LiveChart: LiveChartPanel,
  Mandala: MandalaPanel,
  MagneticBlob: MagneticBlobPanel,
  ClothSimulation: ClothSimulationPanel,
  FluidSimulation: FluidSimulationPanel,
  Rain: RainPanel,
  Lightning: LightningPanel,
  GameOfLife: GameOfLifePanel,
  Wormhole: WormholePanel,
  Boids: BoidsPanel,
  BubbleUniverse: BubbleUniversePanel,
  SakuraBlossom: SakuraBlossomPanel,
  ReactionDiffusion: ReactionDiffusionPanel,
  AuroraBorealis: AuroraBorealisPanel,
  Spirograph: SpirographPanel,
  SandSimulation: SandSimulationPanel,
  WaveInterference: WaveInterferencePanel,
  DiffusionAggregation: DiffusionAggregationPanel,
  Lissajous: LissajousPanel,
  LSystem: LSystemPanel,
  Kaleidoscope: KaleidoscopePanel,
  VoronoiCells: VoronoiCellsPanel,
  SlimeMold: SlimeMoldPanel,
  InkBleed: InkBleedPanel,
  WatercolorBloom: WatercolorBloomPanel,
  PendulaWave: PendulaWavePanel,
  CrystalGrowth: CrystalGrowthPanel,
  NeuralWeb: NeuralWebPanel,
  ParticleText: ParticleTextPanel,
  Metaballs: MetaballsPanel,
  AntColony: AntColonyPanel,
  MagneticField: MagneticFieldPanel,
  TerrainMesh: TerrainMeshPanel,
  BlackHole: BlackHolePanel,
  GalaxySpiral: GalaxySpiralPanel,
  TornadoVortex: TornadoVortexPanel,
  SolarFlare: SolarFlarePanel,
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get("component") as ComponentId | null;
  const initial: ComponentId = (paramId && ALL_COMPONENTS.includes(paramId)) ? paramId : "MatrixRain";
  const [active, setActive] = useState<ComponentId>(initial);
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const Panel = PANELS[active];

  function selectComponent(id: ComponentId) {
    setActive(id);
    setShowCode(false);
    setSearchParams({ component: id }, { replace: true });
  }

  return (
    <CodeContext.Provider value={{ code, setCode, showCode, setShowCode }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div className="app">

        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <div className="header-logo-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white" fillOpacity=".9" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity=".5" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity=".5" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" fillOpacity=".9" />
              </svg>
            </div>
            own-the-canvas
          </div>
          <div className="header-divider" aria-hidden="true" />
          <span className="header-tag">52 components</span>
          <div className="header-spacer" />
          <span className="header-badge">5</span>
        </header>

        {/* Component tabs */}
        <nav className="tab-row" role="tablist" aria-label="Components">
          {ALL_COMPONENTS.map((id) => (
            <button
              key={id}
              className={`tab-btn ${active === id ? "active" : ""}`}
              role="tab"
              aria-selected={active === id}
              onClick={() => selectComponent(id)}
            >
              <span style={{ color: active === id ? COMPONENT_META[id].accent : "currentColor", transition: "color 200ms" }}>
                {icons[id]}
              </span>
              {id}
            </button>
          ))}
        </nav>

        {/* Workspace */}
        <main className="workspace" role="main">
          <Panel />
        </main>

      </div>
      {showCode && <CodeModal code={code} onClose={() => setShowCode(false)} />}
    </CodeContext.Provider>
  );
}
