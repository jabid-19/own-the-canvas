import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MatrixRain, PRESETS as MATRIX_PRESETS } from "../components/MatrixRain";
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
import { GameOfLife, PRESETS as GOL_PRESETS } from "../components/GameOfLife";
import { Wormhole } from "../components/Wormhole";
import { Boids } from "../components/Boids";
import type { FirePalette } from "../components/FireEffect";
import type { ConfettiPalette } from "../components/Confetti";
import type { VisualizerMode } from "../components/AudioVisualizer";
import type { StarfieldPerspective } from "../components/Starfield";
import type { ParticleLineStyle } from "../components/ParticleField";
import type { DissolveDirection } from "../components/PixelDissolve";
import { DragonCursor } from "../components/DragonCursor";
import { KoiPond } from "../components/KoiPond";
import { BubbleUniverse } from "../components/BubbleUniverse";
import { SakuraBlossom } from "../components/SakuraBlossom";
import { ReactionDiffusion } from "../components/ReactionDiffusion";
import { AuroraBorealis } from "../components/AuroraBorealis";
import { Spirograph } from "../components/Spirograph";
import { SandSimulation } from "../components/SandSimulation";
import type { SandMaterial } from "../components/SandSimulation";
import { WaveInterference, PRESETS as WAVE_PRESETS } from "../components/WaveInterference";
import { DiffusionAggregation, PRESETS as DLA_PRESETS } from "../components/DiffusionAggregation";
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
  const [preset, setPreset] = useState("default");
  const [color, setColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#111111");
  const [trailOpacity, setTrailOpacity] = useState(0.1);
  const [fontSize, setFontSize] = useState(14);
  const [speed, setSpeed] = useState(33);
  const [charset, setCharset] = useState<"latin" | "binary" | "katakana">("latin");
  const [resetThreshold, setResetThreshold] = useState(0.95);

  function handlePreset(p: string) {
    setPreset(p);
    const v = MATRIX_PRESETS[p as keyof typeof MATRIX_PRESETS] ?? {};
    if (v.color) setColor(v.color);
    if (v.charset) setCharset(v.charset as "latin" | "binary" | "katakana");
    if (v.fontSize) setFontSize(v.fontSize);
    if (v.speed) setSpeed(v.speed);
  }

  const bg = `rgba(${parseInt(bgColor.slice(1,3),16)},${parseInt(bgColor.slice(3,5),16)},${parseInt(bgColor.slice(5,7),16)},${trailOpacity})`;

  const code = `import { MatrixRain } from 'own-the-canvas';

<MatrixRain
  preset="${preset}"
  color="${color}"
  charset="${charset}"
  fontSize={${fontSize}}
  speed={${speed}}
  backgroundColor="${bg}"
  width="100%"
  height="100%"
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <MatrixRain preset={preset} color={color} fontSize={fontSize} speed={speed}
            charset={charset} resetThreshold={resetThreshold}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="MatrixRain" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "cyberpunk", "binary", "minimal", "blood"]} onChange={handlePreset} />
          <Divider />
          <div className="ctl-section">
            <ColorPicker label="Color" value={color} onChange={setColor} />
            <ColorPicker label="Background" value={bgColor} onChange={setBgColor} />
            <Sel label="Charset" value={charset} options={["latin", "binary", "katakana"]} onChange={(v) => setCharset(v as "latin" | "binary" | "katakana")} />
            <Slider label="Font size" value={fontSize} min={8} max={36} step={1} onChange={setFontSize} />
            <Slider label="Trail opacity" value={trailOpacity} min={0.02} max={0.5} step={0.01} onChange={setTrailOpacity} />
            <Slider label="Speed (ms/frame)" value={speed} min={10} max={200} step={5} onChange={setSpeed} />
            <Slider label="Reset threshold" value={resetThreshold} min={0.5} max={0.99} step={0.01} onChange={setResetThreshold} />
          </div>
        </div>
      </div>
    </>
  );
}

function ParticleFieldPanel() {
  const [pc, setPc] = useState("#ffffff");
  const [lc, setLc] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
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

  const code = [
    `import { ParticleField } from 'own-the-canvas';`,
    ``,
    `<ParticleField`,
    `  particleCount={${count}}`,
    `  particleColor="${pc}"`,
    `  lineColor="${lc}"`,
    `  lineDistance={${dist}}`,
    `  particleSize={${size}}`,
    `  speed={${speed}}`,
    connect ? null : `  connectParticles={false}`,
    !interact ? `  interactive={false}` : null,
    `  backgroundColor="${bg}"`,
    wrapEdges ? `  wrapEdges={true}` : null,
    twinkle ? `  twinkle={true}` : null,
    glowParticles ? `  glowParticles={true}` : null,
    lineStyle !== "solid" ? `  lineStyle="${lineStyle}"` : null,
    dragParticles ? `  dragParticles={true}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <ParticleField particleColor={pc} lineColor={lc}
            particleCount={count} lineDistance={dist} particleSize={size}
            speed={speed} connectParticles={connect} interactive={interact}
            backgroundColor={bg} wrapEdges={wrapEdges} twinkle={twinkle}
            glowParticles={glowParticles} lineStyle={lineStyle}
            dragParticles={dragParticles} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>{dragParticles ? "Drag particles to reposition" : "Move cursor to repel"}</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="ParticleField" />
        <div className="ctrl-body">
          <div className="ctl-section">
            <ColorPicker label="Particle color" value={pc} onChange={setPc} />
            <ColorPicker label="Line color" value={lc} onChange={setLc} />
            <ColorPicker label="Background" value={bg} onChange={setBg} />
            <Slider label="Count" value={count} min={20} max={400} step={10} onChange={setCount} />
            <Slider label="Line distance" value={dist} min={40} max={250} step={5} onChange={setDist} />
            <Slider label="Particle size" value={size} min={0.5} max={8} step={0.5} onChange={setSize} />
            <Slider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
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
  const [starColor, setStarColor] = useState("#ffffff");
  const [shootingStarColor, setShootingStarColor] = useState("#ffffff");

  const code = [
    `import { Starfield } from 'own-the-canvas';`,
    ``,
    `<Starfield`,
    `  perspective="${persp}"`,
    `  starCount={${count}}`,
    `  speed={${speed}}`,
    `  starColor="${starColor}"`,
    `  shootingStarColor="${shootingStarColor}"`,
    `  backgroundColor="${bg}"`,
    twinkle ? null : `  twinkle={false}`,
    shooting ? `  shootingStars` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Starfield starCount={count} backgroundColor={bg} speed={speed}
            twinkle={twinkle} shootingStars={shooting} perspective={persp}
            starColor={starColor} shootingStarColor={shootingStarColor}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Starfield" />
        <div className="ctrl-body">
          <Sel label="Perspective" value={persp} options={["2D", "3D"]} onChange={setPersp} />
          <Divider />
          <div className="ctl-section">
            <ColorPicker label="Background" value={bg} onChange={setBg} />
            <ColorPicker label="Star color" value={starColor} onChange={setStarColor} />
            <ColorPicker label="Shooting star color" value={shootingStarColor} onChange={setShootingStarColor} />
            <Slider label="Star count" value={count} min={50} max={800} step={10} onChange={setCount} />
            <Slider label="Speed" value={speed} min={0.1} max={8} step={0.1} onChange={setSpeed} />
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
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(0.95);
  const [wind, setWind] = useState(0.3);
  const [spread, setSpread] = useState(0);
  const [cooling, setCooling] = useState(0.3);

  const hasCustom = customColors.length >= 2;
  const code = [
    `import { FireEffect } from 'own-the-canvas';`,
    ``,
    `<FireEffect`,
    `  palette="${palette}"`,
    hasCustom ? `  customColors={${JSON.stringify(customColors)}}` : null,
    `  intensity={${intensity}}`,
    `  windStrength={${wind}}`,
    `  spread={${spread}}`,
    `  cooling={${cooling}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <FireEffect palette={palette} customColors={hasCustom ? customColors : undefined}
            intensity={intensity} windStrength={wind}
            spread={spread} cooling={cooling}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Pixel simulation</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="FireEffect" />
        <div className="ctrl-body">
          <Sel label="Palette" value={palette} options={["smoke", "inferno", "toxic", "ice", "plasma"]} onChange={setPalette} />
          <Divider />
          <div className="ctl-section">
            <Slider label="Intensity" value={intensity} min={0.1} max={1} step={0.05} onChange={setIntensity} />
            <Slider label="Wind strength" value={wind} min={0} max={1} step={0.05} onChange={setWind} />
            <Slider label="Spread" value={spread} min={0} max={1} step={0.05} onChange={setSpread} />
            <Slider label="Cooling" value={cooling} min={0.05} max={0.8} step={0.05} onChange={setCooling} />
          </div>
        </div>
      </div>
    </>
  );
}

function AudioVisualizerPanel() {
  const [mode, setMode] = useState<VisualizerMode>("bars");
  const [barColor, setBarColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [barCount, setBarCount] = useState(64);
  const [sensitivity, setSensitivity] = useState(1);
  const [rounded, setRounded] = useState(true);
  const [gradient, setGradient] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micActive, setMicActive] = useState(false);

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

  const code = [
    `import { AudioVisualizer } from 'own-the-canvas';`,
    `import { useState } from 'react';`,
    ``,
    `function App() {`,
    `  const [stream, setStream] = useState<MediaStream | null>(null);`,
    ``,
    `  async function startMic() {`,
    `    const s = await navigator.mediaDevices.getUserMedia({ audio: true });`,
    `    setStream(s);`,
    `  }`,
    ``,
    `  return (`,
    `    <>`,
    `      <button onClick={startMic}>Start microphone</button>`,
    `      <AudioVisualizer`,
    `        audioSource={stream}`,
    `        mode="${mode}"`,
    `        barColor="${barColor}"`,
    `        barCount={${barCount}}`,
    `        sensitivity={${sensitivity}}`,
    rounded ? null : `        rounded={false}`,
    gradient ? `        gradient` : null,
    `        width="100%"`,
    `        height="100%"`,
    `      />`,
    `    </>`,
    `  );`,
    `}`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap" style={{ background: "#030305" }}>
        <div className="canvas-wrap-inner">
          <AudioVisualizer audioSource={stream} mode={mode}
            barColor={barColor} waveColor={barColor} barCount={barCount}
            sensitivity={sensitivity}
            rounded={rounded} gradient={gradient}
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
          <Sel label="Mode" value={mode} options={["bars", "wave", "circular", "mirror"]} onChange={setMode} />
          <Divider />
          <div className="ctl-section">
            <ColorPicker label="Bar color" value={barColor} onChange={setBarColor} />
            <ColorPicker label="Background" value={bg} onChange={setBg} />
            <Slider label="Bar count" value={barCount} min={8} max={128} step={8} onChange={setBarCount} />
            <Slider label="Sensitivity" value={sensitivity} min={0.2} max={5} step={0.1} onChange={setSensitivity} />
          </div>
          <Divider />
          <Toggle label="Rounded caps" value={rounded} onChange={setRounded} />
          <Toggle label="Gradient fill" value={gradient} onChange={setGradient} />
        </div>
      </div>
    </>
  );
}

function ConfettiPanel() {
  const [trigger, setTrigger] = useState(false);
  const [palette, setPalette] = useState<ConfettiPalette>("monochrome");
  const [particleCount, setParticleCount] = useState(150);
  const [spread, setSpread] = useState(0.8);
  const [gravity, setGravity] = useState(0.5);
  const [continuous, setContinuous] = useState(false);
  const [wind, setWind] = useState(0.5);

  function fire() { setTrigger(false); setTimeout(() => setTrigger(true), 50); }

  const code = [
    `import { Confetti } from 'own-the-canvas';`,
    `import { useState } from 'react';`,
    ``,
    `function App() {`,
    `  const [trigger, setTrigger] = useState(false);`,
    ``,
    `  function fire() {`,
    `    setTrigger(false);`,
    `    setTimeout(() => setTrigger(true), 50);`,
    `  }`,
    ``,
    `  return (`,
    `    <>`,
    `      <button onClick={fire}>Celebrate!</button>`,
    `      <Confetti`,
    `        trigger={trigger}`,
    `        palette="${palette}"`,
    `        particleCount={${particleCount}}`,
    `        spread={${spread}}`,
    `        gravity={${gravity}}`,
    `        wind={${wind}}`,
    continuous ? `        continuous` : null,
    `        width="100%"`,
    `        height="100%"`,
    `      />`,
    `    </>`,
    `  );`,
    `}`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap" style={{ position: "relative" }}>
        <div className="canvas-wrap-inner">
          <Confetti trigger={trigger} palette={palette} particleCount={particleCount} spread={spread}
            gravity={gravity} continuous={continuous} wind={wind}
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
          <Sel label="Palette" value={palette} options={["monochrome", "colorful"]} onChange={setPalette} />
          <Divider />
          <div className="ctl-section">
            <Slider label="Particle count" value={particleCount} min={20} max={400} step={10} onChange={setParticleCount} />
            <Slider label="Spread" value={spread} min={0} max={1} step={0.05} onChange={setSpread} />
            <Slider label="Gravity" value={gravity} min={0.1} max={2} step={0.1} onChange={setGravity} />
            <Slider label="Wind" value={wind} min={0} max={3} step={0.1} onChange={setWind} />
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
  const colors = NOISE_PRESETS[preset];

  const code = `import { NoiseGradient } from 'own-the-canvas';

<NoiseGradient
  colors={${JSON.stringify(colors)}}
  speed={${speed}}
  scale={${scale}}
  octaves={${octaves}}
  animated={${animated}}
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <NoiseGradient colors={colors} speed={speed} scale={scale}
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
  const [color, setColor] = useState("#ffffff");

  function fire() { setTrigger(false); setTimeout(() => setTrigger(true), 50); }

  const code = [
    `import { PixelDissolve } from 'own-the-canvas';`,
    `import { useState } from 'react';`,
    ``,
    `function App() {`,
    `  const [show, setShow] = useState(false);`,
    ``,
    `  return (`,
    `    <PixelDissolve`,
    `      trigger={show}`,
    `      direction="${dir}"`,
    `      pixelSize={${pixelSize}}`,
    `      speed={${speed}}`,
    color !== "#ffffff" ? `      color="${color}"` : null,
    `      width={400}`,
    `      height={300}`,
    `    >`,
    `      <YourContent />`,
    `    </PixelDissolve>`,
    `  );`,
    `}`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#030308" }}>
        <PixelDissolve pixelSize={pixelSize} speed={speed}
          direction={dir} trigger={trigger} color={color}
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
          <div className="ctl-section">
            <ColorPicker label="Pixel color" value={color} onChange={setColor} />
            <Slider label="Pixel size" value={pixelSize} min={2} max={32} step={2} onChange={setPixelSize} />
            <Slider label="Speed" value={speed} min={0.1} max={2} step={0.05} onChange={setSpeed} />
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
  const [colors, setColors] = useState(["#ffffff"]);

  const code = [
    `import { FlowField } from 'own-the-canvas';`,
    ``,
    `<FlowField`,
    `  preset="${preset}"`,
    `  particleCount={${count}}`,
    `  speed={${speed}}`,
    `  lineWidth={${lineWidth}}`,
    curl ? `  curl` : null,
    `  colors={${JSON.stringify(colors)}}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <FlowField preset={preset} particleCount={count} speed={speed} curl={curl} lineWidth={lineWidth}
            colors={colors}
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
          <Slider label="Particle count" value={count} min={100} max={2000} step={50} onChange={setCount} />
          <Slider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.5} onChange={setLineWidth} />
          <Toggle label="Curl noise" value={curl} onChange={setCurl} />
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
          <Spotlight preset={preset} radius={radius} overlayColor={overlayColor} overlayOpacity={opacity} edgeSoftness={softness} showGlow={glow} glowColor={glowColor} color={color} followSpeed={followSpeed} shape={shape} ellipseRatio={ellipseRatio} interactive={interactive} style={{ position: "absolute", inset: 0 }} />
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
  const [autoFire, setAutoFire] = useState(true);

  const code = [
    `import { Shockwave } from 'own-the-canvas';`,
    ``,
    `<Shockwave`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  ringCount={${ringCount}}`,
    `  speed={${speed}}`,
    glow ? null : `  glowEffect={false}`,
    autoFire ? `  autoFire` : null,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Shockwave preset={preset} ringCount={ringCount} speed={speed} color={color}
            backgroundColor={bg} glowEffect={glow}
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
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Ring count" value={ringCount} min={1} max={8} step={1} onChange={setRingCount} />
          <Slider label="Speed" value={speed} min={1} max={12} step={0.5} onChange={setSpeed} />
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

  const code = [
    `import { Fireworks } from 'own-the-canvas';`,
    ``,
    `<Fireworks`,
    `  preset="${preset}"`,
    `  particleCount={${count}}`,
    `  gravity={${gravity}}`,
    `  spread={${spread}}`,
    autoLaunch ? null : `  autoLaunch={false}`,
    glow ? null : `  glowEffect={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Fireworks preset={preset} particleCount={count} gravity={gravity} spread={spread}
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
  const [color, setColor] = useState("#ffffff");
  const [rgbShiftColor, setRgbShiftColor] = useState("#ff0000");
  const [scanlines, setScanlines] = useState(true);
  const [blockGlitch, setBlockGlitch] = useState(true);
  const [animated, setAnimated] = useState(true);

  const code = [
    `import { GlitchOverlay } from 'own-the-canvas';`,
    ``,
    `// Overlay over any content`,
    `<div style={{ position: "relative" }}>`,
    `  <YourContent />`,
    `  <GlitchOverlay`,
    `    preset="${preset}"`,
    `    intensity={${intensity}}`,
    `    speed={${speed}}`,
    `    rgbShift={${rgbShift}}`,
    `    color="${color}"`,
    `    rgbShiftColor="${rgbShiftColor}"`,
    !scanlines ? `    scanlines={false}` : null,
    !blockGlitch ? `    blockGlitch={false}` : null,
    !animated ? `    animated={false}` : null,
    `    style={{ position: "absolute", inset: 0 }}`,
    `  />`,
    `</div>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap" style={{ position: "relative" }}>
        <div className="canvas-wrap-inner" style={{ background: "#111111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#fff", fontFamily: "monospace", userSelect: "none" }}>
            <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2, marginBottom: 8 }}>GLITCH</div>
            <div style={{ fontSize: 14, opacity: 0.4, letterSpacing: 6 }}>OVERLAY EFFECT</div>
          </div>
          <GlitchOverlay preset={preset} intensity={intensity} speed={speed} rgbShift={rgbShift} color={color} scanlines={scanlines} blockGlitch={blockGlitch} rgbShiftColor={rgbShiftColor} animated={animated} style={{ position: "absolute", inset: 0 }} />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Overlay composited on content</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="GlitchOverlay" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "crt", "cyberpunk", "subtle", "corrupt"]} onChange={setPreset} />
          <Divider />
          <ColorPicker label="Accent color" value={color} onChange={setColor} />
          <ColorPicker label="RGB Shift Color" value={rgbShiftColor} onChange={setRgbShiftColor} />
          <Slider label="Intensity" value={intensity} min={0} max={1} step={0.05} onChange={setIntensity} />
          <Slider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
          <Slider label="RGB shift" value={rgbShift} min={0} max={30} step={1} onChange={setRgbShift} />
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
          <Toggle label="Smooth curves" value={smooth} onChange={setSmooth} />
          <Toggle label="Grid lines" value={showGrid} onChange={setShowGrid} />
          <Toggle label="Data dots" value={showDots} onChange={setShowDots} />
          <Toggle label="Glow effect" value={glow} onChange={setGlow} />
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
  const [colors, setColors] = useState(["#ffffff"]);
  const [mirror, setMirror] = useState(true);
  const [glow, setGlow] = useState(true);

  const code = [
    `import { Mandala } from 'own-the-canvas';`,
    ``,
    `<Mandala`,
    `  preset="${preset}"`,
    `  symmetry={${symmetry}}`,
    `  layers={${layers}}`,
    `  speed={${speed}}`,
    `  colors={${JSON.stringify(colors)}}`,
    mirror ? null : `  mirror={false}`,
    glow ? null : `  glowEffect={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Mandala preset={preset} symmetry={symmetry} layers={layers} speed={speed}
            colors={colors} mirror={mirror} glowEffect={glow} backgroundColor={bg}
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
  const [colors, setColors] = useState(["#ffffff"]);
  const [followMouse, setFollowMouse] = useState(true);
  const [glow, setGlow] = useState(true);

  const code = [
    `import { MagneticBlob } from 'own-the-canvas';`,
    ``,
    `<MagneticBlob`,
    `  preset="${preset}"`,
    `  count={${count}}`,
    `  radius={${radius}}`,
    `  threshold={${threshold}}`,
    `  colors={${JSON.stringify(colors)}}`,
    followMouse ? null : `  followMouse={false}`,
    glow ? null : `  glowEffect={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <MagneticBlob preset={preset} count={count} radius={radius}
            threshold={threshold} colors={colors} followMouse={followMouse} glowEffect={glow}
            backgroundColor={bg} width="100%" height="100%" />
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
          <Slider label="Merge threshold" value={threshold} min={1} max={3} step={0.05} onChange={setThreshold} />
          <Toggle label="Follow mouse" value={followMouse} onChange={setFollowMouse} />
          <Toggle label="Glow effect" value={glow} onChange={setGlow} />
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

  const code = [
    `import { ClothSimulation } from 'own-the-canvas';`,
    ``,
    `<ClothSimulation`,
    `  preset="${preset}"`,
    `  cols={${cols}}`,
    `  gravity={${gravity}}`,
    `  wind={${wind}}`,
    tearable ? `  tearable` : null,
    `  lineColor="${lineColor}"`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <ClothSimulation preset={preset} cols={cols} gravity={gravity} wind={wind} tearable={tearable}
            lineColor={lineColor} backgroundColor={bg}
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
          <Slider label="Gravity" value={gravity} min={0.05} max={1.5} step={0.05} onChange={setGravity} />
          <Slider label="Wind" value={wind} min={0} max={1} step={0.05} onChange={setWind} />
          <Toggle label="Tearable" value={tearable} onChange={setTearable} />
        </div>
      </div>
    </>
  );
}

function FluidSimulationPanel() {
  const [preset, setPreset] = useState("default");
  const [resolution, setResolution] = useState(128);
  const [dissipation, setDissipation] = useState(0.995);
  const [autoInk, setAutoInk] = useState(true);
  const [mouseForce, setMouseForce] = useState(5);
  const [bg, setBg] = useState("#111111");
  const [inkColors, setInkColors] = useState(["#ffffff", "#6b7280"]);

  const code = `import { FluidSimulation } from 'own-the-canvas';

<FluidSimulation
  preset="${preset}"
  resolution={${resolution}}
  dissipation={${dissipation}}
  mouseForce={${mouseForce}}${autoInk ? "" : "\n  autoInk={false}"}
  inkColors={${JSON.stringify(inkColors)}}
  backgroundColor="${bg}"
  width="100%"
  height="100%"
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <FluidSimulation preset={preset} resolution={resolution} dissipation={dissipation} autoInk={autoInk}
            mouseForce={mouseForce} backgroundColor={bg}
            inkColors={inkColors}
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
          <Toggle label="Auto-ink bursts" value={autoInk} onChange={setAutoInk} />
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
  const [dropColor, setDropColor] = useState("#000000");
  const [splashColor, setSplashColor] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [showSplashes, setShowSplashes] = useState(true);

  const code = [
    `import { Rain } from 'own-the-canvas';`,
    ``,
    `<Rain`,
    `  preset="${preset}"`,
    `  dropCount={${dropCount}}`,
    `  speed={${speed}}`,
    `  wind={${wind}}`,
    `  dropColor="${dropColor}"`,
    `  splashColor="${splashColor}"`,
    showSplashes ? null : `  showSplashes={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Rain preset={preset} dropCount={dropCount} speed={speed} wind={wind}
            dropColor={dropColor} splashColor={splashColor} showSplashes={showSplashes}
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
          <Slider label="Drop count" value={dropCount} min={20} max={800} step={20} onChange={setDropCount} />
          <Slider label="Speed" value={speed} min={2} max={40} step={1} onChange={setSpeed} />
          <Slider label="Wind" value={wind} min={0} max={3} step={0.1} onChange={setWind} />
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
  const [branchChance, setBranchChance] = useState(0.1);
  const [glowBlur, setGlowBlur] = useState(20);
  const [autoInterval, setAutoInterval] = useState(2000);

  const code = [
    `import { Lightning } from 'own-the-canvas';`,
    ``,
    `<Lightning`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  branchChance={${branchChance}}`,
    `  glowBlur={${glowBlur}}`,
    `  autoInterval={${autoInterval}}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Lightning preset={preset} color={color} branchChance={branchChance}
            glowBlur={glowBlur} autoInterval={autoInterval}
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

  function handlePreset(p: string) {
    setPreset(p);
    const v = GOL_PRESETS[p as keyof typeof GOL_PRESETS] ?? {};
    if (v.aliveColor) setAliveColor(v.aliveColor);
    if (v.oldColor) setOldColor(v.oldColor);
    if (v.backgroundColor) setBg(v.backgroundColor);
    if (v.cellSize) setCellSize(v.cellSize);
    if (v.speed) setSpeed(v.speed);
    if (v.showAge !== undefined) setShowAge(v.showAge);
  }

  const code = [
    `import { GameOfLife } from 'own-the-canvas';`,
    ``,
    `<GameOfLife`,
    `  preset="${preset}"`,
    `  cellSize={${cellSize}}`,
    `  speed={${speed}}`,
    `  aliveColor="${aliveColor}"`,
    `  oldColor="${oldColor}"`,
    showAge ? null : `  showAge={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <GameOfLife preset={preset} cellSize={cellSize} speed={speed}
            aliveColor={aliveColor} oldColor={oldColor} showAge={showAge}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click cells to draw • Conway's Game of Life</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="GameOfLife" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "matrix", "minimal", "fire"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Alive color" value={aliveColor} onChange={setAliveColor} />
          <ColorPicker label="Old cell color" value={oldColor} onChange={setOldColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Cell size" value={cellSize} min={4} max={24} step={2} onChange={setCellSize} />
          <Slider label="Speed (fps)" value={speed} min={1} max={30} step={1} onChange={setSpeed} />
          <Toggle label="Show age gradient" value={showAge} onChange={setShowAge} />
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
  const [colors, setColors] = useState(["#ffffff", "#6b7280"]);
  const [starColor, setStarColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");

  const code = [
    `import { Wormhole } from 'own-the-canvas';`,
    ``,
    `<Wormhole`,
    `  preset="${preset}"`,
    `  speed={${speed}}`,
    `  twist={${twist}}`,
    `  ringCount={${ringCount}}`,
    `  starCount={${starCount}}`,
    `  colors={${JSON.stringify(colors)}}`,
    `  starColor="${starColor}"`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Wormhole preset={preset} speed={speed} twist={twist}
            ringCount={ringCount} starCount={starCount}
            colors={colors} starColor={starColor}
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

  const code = [
    `import { Boids } from 'own-the-canvas';`,
    ``,
    `<Boids`,
    `  preset="${preset}"`,
    `  count={${count}}`,
    `  maxSpeed={${maxSpeed}}`,
    `  color="${color}"`,
    `  trailLength={${trailLength}}`,
    `  separationForce={${sepForce}}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Boids preset={preset} count={count} maxSpeed={maxSpeed} color={color}
            trailLength={trailLength} separationForce={sepForce}
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
          <Slider label="Separation force" value={sepForce} min={0} max={0.2} step={0.01} onChange={setSepForce} />
        </div>
      </div>
    </>
  );
}

const DRAGON_PRESET_VALUES: Record<string, { bodyColor: string; eyeColor: string; fireColor: string; bg: string }> = {
  default:  { bodyColor: "#ffffff", eyeColor: "#111111", fireColor: "#ffffff", bg: "#111111" },
  emerald:  { bodyColor: "#00ff88", eyeColor: "#00ff00", fireColor: "#00ffaa", bg: "#0a1a0f" },
  inferno:  { bodyColor: "#ff6600", eyeColor: "#ff0000", fireColor: "#ffaa00", bg: "#1a0500" },
  void:     { bodyColor: "#9900ff", eyeColor: "#cc00ff", fireColor: "#6600cc", bg: "#050010" },
  ice:      { bodyColor: "#88ddff", eyeColor: "#ffffff", fireColor: "#aaeeff", bg: "#050a14" },
};

function DragonCursorPanel() {
  const [preset, setPreset] = useState("default");
  const [bodyColor, setBodyColor] = useState("#ffffff");
  const [eyeColor, setEyeColor] = useState("#111111");
  const [fireColor, setFireColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [segments, setSegments] = useState(20);
  const [segSize, setSegSize] = useState(18);
  const [followSpeed, setFollowSpeed] = useState(0.15);
  const [wingSpan, setWingSpan] = useState(60);
  const [showFire, setShowFire] = useState(false);
  const [interactive, setInteractive] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = DRAGON_PRESET_VALUES[p] ?? DRAGON_PRESET_VALUES.default;
    setBodyColor(v.bodyColor);
    setEyeColor(v.eyeColor);
    setFireColor(v.fireColor);
    setBg(v.bg);
  }

  const code = [
    `import { DragonCursor } from 'own-the-canvas';`,
    ``,
    `<DragonCursor`,
    `  preset="${preset}"`,
    `  bodyColor="${bodyColor}"`,
    `  fireColor="${fireColor}"`,
    `  backgroundColor="${bg}"`,
    `  segmentCount={${segments}}`,
    `  wingSpan={${wingSpan}}`,
    `  followSpeed={${followSpeed}}`,
    `  showFire={${showFire}}`,
    `  interactive={${interactive}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <DragonCursor preset={preset} segmentCount={segments} segmentSize={segSize}
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
          <Sel label="Preset" value={preset} options={["default", "emerald", "inferno", "void", "ice"]} onChange={onPresetChange} />
          <Divider />
          <ColorPicker label="Body color" value={bodyColor} onChange={setBodyColor} />
          <ColorPicker label="Fire color" value={fireColor} onChange={setFireColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Segments" value={segments} min={8} max={40} step={1} onChange={setSegments} />
          <Slider label="Head size" value={segSize} min={8} max={36} step={1} onChange={setSegSize} />
          <Slider label="Follow speed" value={followSpeed} min={0.02} max={0.5} step={0.01} onChange={setFollowSpeed} />
          <Slider label="Wing span" value={wingSpan} min={20} max={150} step={5} onChange={setWingSpan} />
          <Toggle label="Show fire" value={showFire} onChange={setShowFire} />
          <Toggle label="Follow cursor" value={interactive} onChange={setInteractive} />
        </div>
      </div>
    </>
  );
}

const KOIPOND_PRESET_VALUES: Record<string, {
  fishColor: string; scaleColor: string; waterColor: string; lilyColor: string;
}> = {
  default: { fishColor: "#ffffff", scaleColor: "#6b7280", waterColor: "#111111", lilyColor: "#ffffff" },
  koi:     { fishColor: "#ff6633", scaleColor: "#ffffff", waterColor: "#0a1a14", lilyColor: "#50aa50" },
  night:   { fishColor: "#88aaff", scaleColor: "#4466aa", waterColor: "#050810", lilyColor: "#304030" },
  lotus:   { fishColor: "#ffccdd", scaleColor: "#ff80a0", waterColor: "#0a0a14", lilyColor: "#ff80a0" },
  neon:    { fishColor: "#00ffcc", scaleColor: "#ff00aa", waterColor: "#000a08", lilyColor: "#00ff44" },
};

function KoiPondPanel() {
  const [preset, setPreset] = useState("default");
  const [fishColor, setFishColor] = useState("#ffffff");
  const [scaleColor, setScaleColor] = useState("#6b7280");
  const [waterColor, setWaterColor] = useState("#111111");
  const [lilyColor, setLilyColor] = useState("#ffffff");
  const [fishCount, setFishCount] = useState(6);
  const [speed, setSpeed] = useState(1);
  const [showLilies, setShowLilies] = useState(true);
  const [caustics, setCaustics] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = KOIPOND_PRESET_VALUES[p] ?? KOIPOND_PRESET_VALUES.default;
    setFishColor(v.fishColor);
    setScaleColor(v.scaleColor);
    setWaterColor(v.waterColor);
    setLilyColor(v.lilyColor);
  }

  const code = [
    `import { KoiPond } from 'own-the-canvas';`,
    ``,
    `<KoiPond`,
    `  preset="${preset}"`,
    `  fishColor="${fishColor}"`,
    `  waterColor="${waterColor}"`,
    `  lilyColor="${lilyColor}"`,
    `  fishCount={${fishCount}}`,
    `  speed={${speed}}`,
    `  showLilies={${showLilies}}`,
    `  caustics={${caustics}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <KoiPond preset={preset} fishCount={fishCount} speed={speed}
            fishColor={fishColor} waterColor={waterColor}
            showLilies={showLilies} caustics={caustics}
            scaleColor={scaleColor} lilyColor={lilyColor}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to create ripples</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="KoiPond" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "koi", "night", "lotus", "neon"]} onChange={onPresetChange} />
          <Divider />
          <ColorPicker label="Fish color" value={fishColor} onChange={setFishColor} />
          <ColorPicker label="Scale color" value={scaleColor} onChange={setScaleColor} />
          <ColorPicker label="Water color" value={waterColor} onChange={setWaterColor} />
          <ColorPicker label="Lily color" value={lilyColor} onChange={setLilyColor} />
          <Slider label="Fish count" value={fishCount} min={1} max={20} step={1} onChange={setFishCount} />
          <Slider label="Speed" value={speed} min={0.2} max={3} step={0.1} onChange={setSpeed} />
          <Toggle label="Show lilies" value={showLilies} onChange={setShowLilies} />
          <Toggle label="Caustics" value={caustics} onChange={setCaustics} />
        </div>
      </div>
    </>
  );
}

const BUBBLE_PRESET_VALUES: Record<string, {
  bg: string; shimmerColor: string; gravity: number; bubbleCount: number; minRadius: number; maxRadius: number;
}> = {
  default: { bg: "#111111", shimmerColor: "#ffffff", gravity: 0.02,  bubbleCount: 15, minRadius: 20, maxRadius: 50  },
  soap:    { bg: "#050a12", shimmerColor: "#ffffff", gravity: 0.01,  bubbleCount: 15, minRadius: 25, maxRadius: 90  },
  neon:    { bg: "#000008", shimmerColor: "#00ffff", gravity: 0.015, bubbleCount: 12, minRadius: 20, maxRadius: 80  },
  deep:    { bg: "#010510", shimmerColor: "#88aaff", gravity: 0.008, bubbleCount: 20, minRadius: 15, maxRadius: 60  },
  minimal: { bg: "#111111", shimmerColor: "#ffffff", gravity: 0.025, bubbleCount: 8,  minRadius: 30, maxRadius: 100 },
};

function BubbleUniversePanel() {
  const [preset, setPreset] = useState("default");
  const [bg, setBg] = useState("#111111");
  const [shimmerColor, setShimmerColor] = useState("#ffffff");
  const [bubbleCount, setBubbleCount] = useState(15);
  const [minRadius, setMinRadius] = useState(20);
  const [maxRadius, setMaxRadius] = useState(50);
  const [gravity, setGravity] = useState(0.02);
  const [popEffect, setPopEffect] = useState(true);
  const [mergeOnCollide, setMergeOnCollide] = useState(true);
  const [glowEffect, setGlowEffect] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = BUBBLE_PRESET_VALUES[p] ?? BUBBLE_PRESET_VALUES.default;
    setBg(v.bg);
    setShimmerColor(v.shimmerColor);
    setGravity(v.gravity);
    setBubbleCount(v.bubbleCount);
    setMinRadius(v.minRadius);
    setMaxRadius(v.maxRadius);
  }

  const code = [
    `import { BubbleUniverse } from 'own-the-canvas';`,
    ``,
    `<BubbleUniverse`,
    `  preset="${preset}"`,
    `  backgroundColor="${bg}"`,
    `  shimmerColor="${shimmerColor}"`,
    `  bubbleCount={${bubbleCount}}`,
    `  minRadius={${minRadius}}`,
    `  maxRadius={${maxRadius}}`,
    `  gravity={${gravity}}`,
    `  popEffect={${popEffect}}`,
    `  mergeOnCollide={${mergeOnCollide}}`,
    `  glowEffect={${glowEffect}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <BubbleUniverse preset={preset} bubbleCount={bubbleCount} minRadius={minRadius}
            maxRadius={maxRadius} gravity={gravity} backgroundColor={bg}
            popEffect={popEffect} mergeOnCollide={mergeOnCollide} glowEffect={glowEffect}
            shimmerColor={shimmerColor}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click bubbles to pop · Hover to push</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="BubbleUniverse" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "soap", "neon", "deep", "minimal"]} onChange={onPresetChange} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <ColorPicker label="Shimmer color" value={shimmerColor} onChange={setShimmerColor} />
          <Slider label="Bubble count" value={bubbleCount} min={3} max={40} step={1} onChange={setBubbleCount} />
          <Slider label="Min radius" value={minRadius} min={10} max={50} step={5} onChange={setMinRadius} />
          <Slider label="Max radius" value={maxRadius} min={40} max={150} step={5} onChange={setMaxRadius} />
          <Slider label="Gravity" value={gravity} min={0} max={0.08} step={0.002} onChange={setGravity} />
          <Toggle label="Pop effect" value={popEffect} onChange={setPopEffect} />
          <Toggle label="Merge on collide" value={mergeOnCollide} onChange={setMergeOnCollide} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
        </div>
      </div>
    </>
  );
}

const SAKURA_PRESET_VALUES: Record<string, { petalColor: string; bg: string; gravity: number; petalSize: number; windStrength: number }> = {
  default: { petalColor: "#ffffff", bg: "#111111", gravity: 0.06, petalSize: 8,  windStrength: 0.8 },
  sakura:  { petalColor: "#ffb7c5", bg: "#0a0005", gravity: 0.04, petalSize: 10, windStrength: 0.8 },
  autumn:  { petalColor: "#ff6633", bg: "#111111", gravity: 0.08, petalSize: 8,  windStrength: 1.2 },
  snow:    { petalColor: "#e8f0ff", bg: "#0a0a0a", gravity: 0.035,petalSize: 5,  windStrength: 0.8 },
  neon:    { petalColor: "#00ffcc", bg: "#000a05", gravity: 0.06, petalSize: 8,  windStrength: 0.8 },
};

function SakuraBlossomPanel() {
  const [preset, setPreset] = useState("default");
  const [petalColor, setPetalColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [petalCount, setPetalCount] = useState(80);
  const [petalSize, setPetalSize] = useState(8);
  const [gravity, setGravity] = useState(0.06);
  const [wind, setWind] = useState(0.8);
  const [gusts, setGusts] = useState(true);
  const [accumulation, setAccumulation] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = SAKURA_PRESET_VALUES[p] ?? SAKURA_PRESET_VALUES.default;
    setPetalColor(v.petalColor);
    setBg(v.bg);
    setGravity(v.gravity);
    setPetalSize(v.petalSize);
    setWind(v.windStrength);
  }

  const code = [
    `import { SakuraBlossom } from 'own-the-canvas';`,
    ``,
    `<SakuraBlossom`,
    `  preset="${preset}"`,
    `  petalColor="${petalColor}"`,
    `  backgroundColor="${bg}"`,
    `  petalCount={${petalCount}}`,
    `  petalSize={${petalSize}}`,
    `  gravity={${gravity}}`,
    `  windStrength={${wind}}`,
    `  windGusts={${gusts}}`,
    `  showAccumulation={${accumulation}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <SakuraBlossom preset={preset} petalCount={petalCount} petalColor={petalColor}
            petalSize={petalSize} gravity={gravity} windStrength={wind}
            windGusts={gusts} showAccumulation={accumulation}
            backgroundColor={bg} width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Petals drift on the wind</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="SakuraBlossom" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "sakura", "autumn", "snow", "neon"]} onChange={onPresetChange} />
          <Divider />
          <ColorPicker label="Petal color" value={petalColor} onChange={setPetalColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Petal count" value={petalCount} min={10} max={200} step={10} onChange={setPetalCount} />
          <Slider label="Petal size" value={petalSize} min={3} max={20} step={1} onChange={setPetalSize} />
          <Slider label="Gravity" value={gravity} min={0.01} max={0.3} step={0.01} onChange={setGravity} />
          <Slider label="Wind strength" value={wind} min={0} max={4} step={0.1} onChange={setWind} />
          <Toggle label="Wind gusts" value={gusts} onChange={setGusts} />
          <Toggle label="Accumulation" value={accumulation} onChange={setAccumulation} />
        </div>
      </div>
    </>
  );
}

const RD_PRESET_PARAMS: Record<string, { feedRate: number; killRate: number; colorA?: string; colorB?: string; backgroundColor?: string }> = {
  default: { feedRate: 0.055, killRate: 0.062 },
  coral:   { feedRate: 0.055, killRate: 0.062 },
  spots:   { feedRate: 0.035, killRate: 0.065 },
  maze:    { feedRate: 0.029, killRate: 0.057 },
  waves:   { feedRate: 0.014, killRate: 0.053 },
  neon:    { feedRate: 0.055, killRate: 0.062, colorA: "#0a0a0a", colorB: "#00ffff", backgroundColor: "#0a0a0a" },
};

function ReactionDiffusionPanel() {
  const [preset, setPreset] = useState("default");
  const [feedRate, setFeedRate] = useState(0.055);
  const [killRate, setKillRate] = useState(0.062);
  const [speed, setSpeed] = useState(8);
  const [resolution, setResolution] = useState(0.5);
  const [colorA, setColorA] = useState("#111111");
  const [colorB, setColorB] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [interactive, setInteractive] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = RD_PRESET_PARAMS[p];
    if (!pp) return;
    setFeedRate(pp.feedRate);
    setKillRate(pp.killRate);
    if (pp.colorA) setColorA(pp.colorA);
    if (pp.colorB) setColorB(pp.colorB);
    if (pp.backgroundColor) setBg(pp.backgroundColor);
  }

  const code = [
    `import { ReactionDiffusion } from 'own-the-canvas';`,
    ``,
    `<ReactionDiffusion`,
    `  preset="${preset}"`,
    `  feedRate={${feedRate}}`,
    `  killRate={${killRate}}`,
    `  speed={${speed}}`,
    `  resolution={${resolution}}`,
    `  colorA="${colorA}"`,
    `  colorB="${colorB}"`,
    `  backgroundColor="${bg}"`,
    !interactive ? `  interactive={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <ReactionDiffusion preset={preset} feedRate={feedRate} killRate={killRate}
            speed={speed} colorA={colorA} colorB={colorB} interactive={interactive}
            resolution={resolution} backgroundColor={bg}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Mouse disturbs the chemical field</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="ReactionDiffusion" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "coral", "spots", "maze", "waves", "neon"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Color A (low)" value={colorA} onChange={setColorA} />
          <ColorPicker label="Color B (high)" value={colorB} onChange={setColorB} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Feed rate" value={feedRate} min={0.01} max={0.1} step={0.001} onChange={setFeedRate} />
          <Slider label="Kill rate" value={killRate} min={0.04} max={0.08} step={0.001} onChange={setKillRate} />
          <Slider label="Speed" value={speed} min={1} max={20} step={1} onChange={setSpeed} />
          <Slider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setResolution} />
          <Toggle label="Interactive" value={interactive} onChange={setInteractive} />
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

const SPIROGRAPH_PRESET_PARAMS = {
  default:   { colors: ["#ffffff"],                              bg: "#111111", lineWidth: 1,   layerCount: 2, symmetry: 1, glowEffect: false, glowBlur: 10, trailFade: 0.003, speed: 2   },
  neon:      { colors: ["#00ffff", "#ff00ff"],                   bg: "#000000", lineWidth: 1.5, layerCount: 1, symmetry: 1, glowEffect: true,  glowBlur: 15, trailFade: 0.005, speed: 2   },
  prismatic: { colors: ["#ff2244", "#22aaff", "#44ff88"],        bg: "#050005", lineWidth: 1,   layerCount: 3, symmetry: 2, glowEffect: false, glowBlur: 10, trailFade: 0.004, speed: 2   },
  mandala:   { colors: ["#ff00ff", "#00ffff"],                   bg: "#000000", lineWidth: 1,   layerCount: 2, symmetry: 6, glowEffect: true,  glowBlur: 12, trailFade: 0.002, speed: 2   },
  cosmic:    { colors: ["#ff4488", "#44ffff", "#ffff44", "#44ff88"], bg: "#020008", lineWidth: 1, layerCount: 4, symmetry: 1, glowEffect: true, glowBlur: 10, trailFade: 0.002, speed: 2 },
  minimal:   { colors: ["#ffffff"],                              bg: "#111111", lineWidth: 0.5, layerCount: 1, symmetry: 1, glowEffect: false, glowBlur: 10, trailFade: 0.001, speed: 0.5 },
};

function SpirographPanel() {
  const [preset, setPreset]           = useState("default");
  const [innerRadius, setInnerRadius] = useState(0.4);
  const [penDistance, setPenDistance] = useState(0.9);
  const [speed, setSpeed]             = useState(2);
  const [colors, setColors]           = useState(["#ffffff"]);
  const [bg, setBg]                   = useState("#111111");
  const [lineWidth, setLineWidth]     = useState(1);
  const [trailFade, setTrailFade]     = useState(0.003);
  const [animated, setAnimated]       = useState(true);
  const [autoReset, setAutoReset]     = useState(true);
  const [layerCount, setLayerCount]   = useState(2);
  const [symmetry, setSymmetry]       = useState(1);
  const [glowEffect, setGlowEffect]   = useState(false);
  const [glowBlur, setGlowBlur]       = useState(10);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = SPIROGRAPH_PRESET_PARAMS[p as keyof typeof SPIROGRAPH_PRESET_PARAMS];
    if (!pp) return;
    setColors(pp.colors);
    setBg(pp.bg);
    setLineWidth(pp.lineWidth);
    setLayerCount(pp.layerCount);
    setSymmetry(pp.symmetry);
    setGlowEffect(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setTrailFade(pp.trailFade);
    setSpeed(pp.speed);
  }

  const code = [
    `import { Spirograph } from 'own-the-canvas';`,
    ``,
    `<Spirograph`,
    `  preset="${preset}"`,
    `  innerRadius={${innerRadius}}`,
    `  penDistance={${penDistance}}`,
    `  speed={${speed}}`,
    `  colors={${JSON.stringify(colors)}}`,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  trailFade={${trailFade}}`,
    layerCount !== 2 ? `  layerCount={${layerCount}}` : null,
    symmetry !== 1 ? `  symmetry={${symmetry}}` : null,
    glowEffect ? `  glowEffect` : null,
    glowEffect && glowBlur !== 10 ? `  glowBlur={${glowBlur}}` : null,
    !animated ? `  animated={false}` : null,
    !autoReset ? `  autoReset={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Spirograph preset={preset} innerRadius={innerRadius}
            penDistance={penDistance} speed={speed} colors={colors} lineWidth={lineWidth}
            backgroundColor={bg} glowEffect={glowEffect} autoReset={autoReset}
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
          <Sel label="Preset" value={preset} options={["default", "neon", "prismatic", "mandala", "cosmic", "minimal"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Inner radius" value={innerRadius} min={0.1} max={0.9} step={0.01} onChange={setInnerRadius} />
          <Slider label="Pen distance" value={penDistance} min={0.1} max={1.5} step={0.05} onChange={setPenDistance} />
          <Slider label="Speed (deg/frame)" value={speed} min={0.1} max={8} step={0.1} onChange={setSpeed} />
          <Slider label="Line width" value={lineWidth} min={0.2} max={4} step={0.1} onChange={setLineWidth} />
          <Slider label="Trail fade" value={trailFade} min={0} max={0.02} step={0.001} onChange={setTrailFade} />
          <Slider label="Layer count" value={layerCount} min={1} max={6} step={1} onChange={setLayerCount} />
          <Slider label="Symmetry" value={symmetry} min={1} max={8} step={1} onChange={setSymmetry} />
          <Slider label="Glow blur" value={glowBlur} min={2} max={40} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
          <Toggle label="Auto reset" value={autoReset} onChange={setAutoReset} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function SandSimulationPanel() {
  const [preset, setPreset] = useState("default");
  const [cellSize, setCellSize] = useState(4);
  const [brushSize, setBrushSize] = useState(3);
  const [material, setMaterial] = useState<SandMaterial>("sand");
  const [sandColor, setSandColor] = useState("#ffffff");
  const [waterColor, setWaterColor] = useState("#6b7280");
  const [fireColor, setFireColor] = useState("#ffffff");
  const [wallColor, setWallColor] = useState("#4b5563");
  const [bg, setBg] = useState("#111111");
  const [interactive, setInteractive] = useState(true);

  const code = [
    `import { SandSimulation } from 'own-the-canvas';`,
    ``,
    `<SandSimulation`,
    `  preset="${preset}"`,
    `  cellSize={${cellSize}}`,
    `  brushSize={${brushSize}}`,
    `  material="${material}"`,
    `  sandColor="${sandColor}"`,
    `  waterColor="${waterColor}"`,
    `  fireColor="${fireColor}"`,
    `  wallColor="${wallColor}"`,
    `  backgroundColor="${bg}"`,
    !interactive ? `  interactive={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <SandSimulation preset={preset} material={material} cellSize={cellSize} brushSize={brushSize}
            sandColor={sandColor} waterColor={waterColor} backgroundColor={bg}
            fireColor={fireColor} wallColor={wallColor} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click/drag to paint material</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="SandSimulation" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "desert", "ocean", "inferno", "neon"]} onChange={setPreset} />
          <Sel label="Material" value={material} options={["sand", "water", "fire", "wall", "erase"]} onChange={(v) => setMaterial(v as SandMaterial)} />
          <Divider />
          <ColorPicker label="Sand color" value={sandColor} onChange={setSandColor} />
          <ColorPicker label="Water color" value={waterColor} onChange={setWaterColor} />
          <ColorPicker label="Fire color" value={fireColor} onChange={setFireColor} />
          <ColorPicker label="Wall color" value={wallColor} onChange={setWallColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Cell size" value={cellSize} min={2} max={12} step={1} onChange={setCellSize} />
          <Slider label="Brush size" value={brushSize} min={1} max={10} step={1} onChange={setBrushSize} />
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
  const [decay, setDecay] = useState(0.003);
  const [resolution, setResolution] = useState(0.4);
  const [colorHigh, setColorHigh] = useState("#ffffff");
  const [colorLow, setColorLow] = useState("#111111");
  const [showSources, setShowSources] = useState(false);
  const [animated, setAnimated] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const v = WAVE_PRESETS[p as keyof typeof WAVE_PRESETS] ?? {};
    if (v.colorHigh) setColorHigh(v.colorHigh);
    if (v.colorLow) setColorLow(v.colorLow);
    if (v.wavelength) setWavelength(v.wavelength);
    if (v.decay !== undefined) setDecay(v.decay);
  }

  const code = [
    `import { WaveInterference } from 'own-the-canvas';`,
    ``,
    `<WaveInterference`,
    `  preset="${preset}"`,
    `  wavelength={${wavelength}}`,
    `  speed={${speed}}`,
    `  decay={${decay}}`,
    `  resolution={${resolution}}`,
    `  colorHigh="${colorHigh}"`,
    `  colorLow="${colorLow}"`,
    showSources ? `  showSources` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <WaveInterference preset={preset} wavelength={wavelength} speed={speed}
            colorHigh={colorHigh} colorLow={colorLow} decay={decay}
            showSources={showSources} animated={animated}
            resolution={resolution}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to add wave sources</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="WaveInterference" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "ripple", "plasma", "neon", "cosmic"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="High color" value={colorHigh} onChange={setColorHigh} />
          <ColorPicker label="Low color" value={colorLow} onChange={setColorLow} />
          <Slider label="Wavelength" value={wavelength} min={20} max={200} step={5} onChange={setWavelength} />
          <Slider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
          <Slider label="Decay" value={decay} min={0} max={0.01} step={0.0005} onChange={setDecay} />
          <Slider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setResolution} />
          <Toggle label="Show sources" value={showSources} onChange={setShowSources} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

function DiffusionAggregationPanel() {
  const [preset, setPreset] = useState("default");
  const [particleColor, setParticleColor] = useState("#ffffff");
  const [walkerColor, setWalkerColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [particleSize, setParticleSize] = useState(3);
  const [walkerCount, setWalkerCount] = useState(60);
  const [stepsPerFrame, setStepsPerFrame] = useState(20);
  const [seedMode, setSeedMode] = useState<DLASeedMode>("center");
  const [showWalkers, setShowWalkers] = useState(false);
  const [glowEffect, setGlowEffect] = useState(true);
  const [glowBlur, setGlowBlur] = useState(8);

  function handlePreset(p: string) {
    setPreset(p);
    const v = DLA_PRESETS[p as keyof typeof DLA_PRESETS] ?? {};
    if (v.particleColor) setParticleColor(v.particleColor);
    if (v.walkerColor) setWalkerColor(v.walkerColor);
    if (v.backgroundColor) setBg(v.backgroundColor);
    if (v.seedMode) setSeedMode(v.seedMode);
    if (v.particleSize) setParticleSize(v.particleSize);
    if (v.glowEffect !== undefined) setGlowEffect(v.glowEffect);
    if (v.glowBlur !== undefined) setGlowBlur(v.glowBlur);
  }

  const code = [
    `import { DiffusionAggregation } from 'own-the-canvas';`,
    ``,
    `<DiffusionAggregation`,
    `  preset="${preset}"`,
    `  particleColor="${particleColor}"`,
    `  backgroundColor="${bg}"`,
    `  particleSize={${particleSize}}`,
    `  walkerCount={${walkerCount}}`,
    `  stepsPerFrame={${stepsPerFrame}}`,
    `  seedMode="${seedMode}"`,
    showWalkers ? `  showWalkers` : null,
    !glowEffect ? `  glowEffect={false}` : null,
    glowBlur !== 8 ? `  glowBlur={${glowBlur}}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <DiffusionAggregation preset={preset} walkerCount={walkerCount}
            stepsPerFrame={stepsPerFrame} particleSize={particleSize}
            particleColor={particleColor} seedMode={seedMode}
            glowEffect={glowEffect} showWalkers={showWalkers} backgroundColor={bg}
            walkerColor={walkerColor} glowBlur={glowBlur}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to add seed points</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="DiffusionAggregation" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "coral", "snowflake", "lightning", "neon", "frost"]} onChange={handlePreset} />
          <Sel label="Seed mode" value={seedMode} options={["center", "ring", "bottom"]} onChange={(v) => setSeedMode(v as DLASeedMode)} />
          <Divider />
          <ColorPicker label="Particle color" value={particleColor} onChange={setParticleColor} />
          <ColorPicker label="Walker color" value={walkerColor} onChange={setWalkerColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Particle size" value={particleSize} min={1} max={8} step={1} onChange={setParticleSize} />
          <Slider label="Walker count" value={walkerCount} min={10} max={200} step={10} onChange={setWalkerCount} />
          <Slider label="Steps per frame" value={stepsPerFrame} min={1} max={60} step={1} onChange={setStepsPerFrame} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={30} step={1} onChange={setGlowBlur} />
          <Toggle label="Show walkers" value={showWalkers} onChange={setShowWalkers} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
        </div>
      </div>
    </>
  );
}

const LISSAJOUS_PRESET_PARAMS = {
  default:   { freqX: 3, freqY: 2, phaseSpeed: 0.5, lineWidth: 1.5, glowEffect: false, colorMode: "solid" as LissajousColorMode, bg: "#111111" },
  butterfly: { freqX: 3, freqY: 2, phaseSpeed: 0.5, lineWidth: 1.5, glowEffect: false, colorMode: "solid" as LissajousColorMode, bg: "#111111" },
  star:      { freqX: 5, freqY: 4, phaseSpeed: 0.5, lineWidth: 1.5, glowEffect: false, colorMode: "solid" as LissajousColorMode, bg: "#111111" },
  web:       { freqX: 7, freqY: 6, phaseSpeed: 0.5, lineWidth: 1.5, glowEffect: false, colorMode: "cycle" as LissajousColorMode, bg: "#111111" },
  neon:      { freqX: 3, freqY: 2, phaseSpeed: 0.5, lineWidth: 2,   glowEffect: true,  colorMode: "cycle" as LissajousColorMode, bg: "#000000" },
  crystal:   { freqX: 5, freqY: 3, phaseSpeed: 0.5, lineWidth: 2,   glowEffect: true,  colorMode: "cycle" as LissajousColorMode, bg: "#000510" },
};

function LissajousPanel() {
  const [preset, setPreset] = useState("default");
  const [freqX, setFreqX] = useState(3);
  const [freqY, setFreqY] = useState(2);
  const [phaseSpeed, setPhaseSpeed] = useState(0.5);
  const [amplitude, setAmplitude] = useState(0.9);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [lineWidth, setLineWidth] = useState(1.5);
  const [trailFade, setTrailFade] = useState(0.04);
  const [glowEffect, setGlowEffect] = useState(false);
  const [glowBlur, setGlowBlur] = useState(12);
  const [colorMode, setColorMode] = useState<LissajousColorMode>("solid");
  const [animated, setAnimated] = useState(true);
  const [speed, setSpeed] = useState(1);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = LISSAJOUS_PRESET_PARAMS[p as keyof typeof LISSAJOUS_PRESET_PARAMS];
    if (!pp) return;
    setFreqX(pp.freqX);
    setFreqY(pp.freqY);
    setPhaseSpeed(pp.phaseSpeed);
    setLineWidth(pp.lineWidth);
    setGlowEffect(pp.glowEffect);
    setColorMode(pp.colorMode);
    setBg(pp.bg);
  }

  const code = [
    `import { Lissajous } from 'own-the-canvas';`,
    ``,
    `<Lissajous`,
    `  preset="${preset}"`,
    `  freqX={${freqX}}`,
    `  freqY={${freqY}}`,
    `  phaseSpeed={${phaseSpeed}}`,
    `  amplitude={${amplitude}}`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  trailFade={${trailFade}}`,
    colorMode !== "solid" ? `  colorMode="${colorMode}"` : null,
    glowEffect ? `  glowEffect` : null,
    glowEffect && glowBlur !== 12 ? `  glowBlur={${glowBlur}}` : null,
    speed !== 1 ? `  speed={${speed}}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Lissajous preset={preset} freqX={freqX} freqY={freqY} phaseSpeed={phaseSpeed}
            amplitude={amplitude} color={color} backgroundColor={bg}
            lineWidth={lineWidth} trailFade={trailFade} glowEffect={glowEffect}
            glowBlur={glowBlur} colorMode={colorMode} animated={animated} speed={speed}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Lissajous" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "butterfly", "star", "web", "neon", "crystal"]} onChange={handlePreset} />
          <Sel label="Color mode" value={colorMode} options={["solid", "cycle"]} onChange={(v) => setColorMode(v as LissajousColorMode)} />
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Freq X" value={freqX} min={1} max={12} step={1} onChange={setFreqX} />
          <Slider label="Freq Y" value={freqY} min={1} max={12} step={1} onChange={setFreqY} />
          <Slider label="Phase speed" value={phaseSpeed} min={0} max={3} step={0.05} onChange={setPhaseSpeed} />
          <Slider label="Amplitude" value={amplitude} min={0.3} max={1} step={0.01} onChange={setAmplitude} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={6} step={0.1} onChange={setLineWidth} />
          <Slider label="Trail fade" value={trailFade} min={0} max={0.2} step={0.005} onChange={setTrailFade} />
          <Slider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
          {glowEffect && <Slider label="Glow blur" value={glowBlur} min={2} max={40} step={1} onChange={setGlowBlur} />}
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const LSYSTEM_PRESET_PARAMS = {
  default:    { angle: 25 },
  fern:       { angle: 22 },
  dragon:     { angle: 90 },
  sierpinski: { angle: 120 },
  bush:       { angle: 25 },
  snowflake:  { angle: 60 },
};

function LSystemPanel() {
  const [preset, setPreset] = useState("default");
  const [angle, setAngle] = useState(25);
  const [lineWidth, setLineWidth] = useState(1);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [speed, setSpeed] = useState(5);
  const [autoReset, setAutoReset] = useState(true);
  const [trailFade, setTrailFade] = useState(0);
  const [glowEffect, setGlowEffect] = useState(false);
  const [glowBlur, setGlowBlur] = useState(8);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = LSYSTEM_PRESET_PARAMS[p as keyof typeof LSYSTEM_PRESET_PARAMS];
    if (pp) setAngle(pp.angle);
  }

  const code = [
    `import { LSystem } from 'own-the-canvas';`,
    ``,
    `<LSystem`,
    `  preset="${preset}"`,
    angle !== 25 ? `  angle={${angle}}` : null,
    lineWidth !== 1 ? `  lineWidth={${lineWidth}}` : null,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    speed !== 5 ? `  speed={${speed}}` : null,
    trailFade > 0 ? `  trailFade={${trailFade}}` : null,
    glowEffect ? `  glowEffect` : null,
    glowEffect && glowBlur !== 8 ? `  glowBlur={${glowBlur}}` : null,
    !autoReset ? `  autoReset={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <LSystem preset={preset} angle={angle} lineWidth={lineWidth} color={color}
            backgroundColor={bg} speed={speed} autoReset={autoReset}
            trailFade={trailFade} glowEffect={glowEffect} glowBlur={glowBlur}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="LSystem" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "fern", "dragon", "sierpinski", "bush", "snowflake"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Angle" value={angle} min={10} max={90} step={1} onChange={setAngle} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.1} onChange={setLineWidth} />
          <Slider label="Speed" value={speed} min={1} max={10} step={1} onChange={setSpeed} />
          <Slider label="Trail fade" value={trailFade} min={0} max={0.3} step={0.01} onChange={setTrailFade} />
          {glowEffect && <Slider label="Glow blur" value={glowBlur} min={2} max={30} step={1} onChange={setGlowBlur} />}
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
          <Toggle label="Auto reset" value={autoReset} onChange={setAutoReset} />
        </div>
      </div>
    </>
  );
}

const KALEIDOSCOPE_PRESET_PARAMS = {
  default: { segments: 8,  colorA: "#e0e0ff", colorB: "#1a0a2e", bg: "#111111", noiseScale: 2.5, zoomSpeed: 0.3, rotation: 0.2, speed: 1   },
  neon:    { segments: 8,  colorA: "#00ffff", colorB: "#ff00ff", bg: "#000000", noiseScale: 3,   zoomSpeed: 0.3, rotation: 0.2, speed: 1.5 },
  crystal: { segments: 12, colorA: "#88ccff", colorB: "#002244", bg: "#000510", noiseScale: 4,   zoomSpeed: 0.3, rotation: 0.2, speed: 1   },
  void:    { segments: 6,  colorA: "#cc00ff", colorB: "#000000", bg: "#000000", noiseScale: 3,   zoomSpeed: 0.3, rotation: 0.4, speed: 1   },
  fire:    { segments: 6,  colorA: "#ff8800", colorB: "#ff0000", bg: "#0a0000", noiseScale: 3,   zoomSpeed: 0.3, rotation: 0.2, speed: 2   },
  ice:     { segments: 10, colorA: "#ffffff", colorB: "#002255", bg: "#000510", noiseScale: 2,   zoomSpeed: 0.5, rotation: 0.2, speed: 1   },
};

function KaleidoscopePanel() {
  const [preset, setPreset] = useState("default");
  const [segments, setSegments] = useState(8);
  const [speed, setSpeed] = useState(1);
  const [colorA, setColorA] = useState("#e0e0ff");
  const [colorB, setColorB] = useState("#1a0a2e");
  const [bg, setBg] = useState("#111111");
  const [noiseScale, setNoise] = useState(2.5);
  const [zoomSpeed, setZoom] = useState(0.3);
  const [rotation, setRotation] = useState(0.2);
  const [resolution, setRes] = useState(0.5);
  const [animated, setAnimated] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = KALEIDOSCOPE_PRESET_PARAMS[p as keyof typeof KALEIDOSCOPE_PRESET_PARAMS];
    if (!pp) return;
    setSegments(pp.segments);
    setColorA(pp.colorA);
    setColorB(pp.colorB);
    setBg(pp.bg);
    setNoise(pp.noiseScale);
    setZoom(pp.zoomSpeed);
    setRotation(pp.rotation);
    setSpeed(pp.speed);
  }

  const code = [
    `import { Kaleidoscope } from 'own-the-canvas';`,
    ``,
    `<Kaleidoscope`,
    `  preset="${preset}"`,
    `  segments={${segments}}`,
    `  colorA="${colorA}"`,
    `  colorB="${colorB}"`,
    `  backgroundColor="${bg}"`,
    noiseScale !== 3 ? `  noiseScale={${noiseScale}}` : null,
    zoomSpeed !== 0.3 ? `  zoomSpeed={${zoomSpeed}}` : null,
    rotation !== 0.2 ? `  rotation={${rotation}}` : null,
    speed !== 1 ? `  speed={${speed}}` : null,
    resolution !== 0.5 ? `  resolution={${resolution}}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Kaleidoscope preset={preset} segments={segments} speed={speed}
            colorA={colorA} colorB={colorB} backgroundColor={bg}
            noiseScale={noiseScale} zoomSpeed={zoomSpeed} rotation={rotation}
            resolution={resolution} animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Kaleidoscope" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "crystal", "void", "fire", "ice"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Color A (peak)" value={colorA} onChange={setColorA} />
          <ColorPicker label="Color B (trough)" value={colorB} onChange={setColorB} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Segments" value={segments} min={2} max={16} step={1} onChange={setSegments} />
          <Slider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
          <Slider label="Noise scale" value={noiseScale} min={1} max={8} step={0.5} onChange={setNoise} />
          <Slider label="Zoom speed" value={zoomSpeed} min={0} max={2} step={0.05} onChange={setZoom} />
          <Slider label="Rotation" value={rotation} min={-2} max={2} step={0.05} onChange={setRotation} />
          <Slider label="Resolution" value={resolution} min={0.15} max={1} step={0.05} onChange={setRes} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const VORONOI_PRESET_PARAMS = {
  "default":       { colorMode: "solid"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#111111", edgeColor: "#333333", showEdges: true,  cellCount: 20 },
  "stained-glass": { colorMode: "cycle"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#111111", edgeColor: "#111111", showEdges: true,  cellCount: 25 },
  "neon":          { colorMode: "cycle"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#000000", edgeColor: "#000000", showEdges: false, cellCount: 20 },
  "frost":         { colorMode: "gradient" as VoronoiColorMode, cellColor: "#88ccff", bg: "#001833", edgeColor: "#ffffff", showEdges: true,  cellCount: 20 },
  "ember":         { colorMode: "cycle"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#0a0200", edgeColor: "#0a0200", showEdges: false, cellCount: 20 },
  "void":          { colorMode: "solid"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#000000", edgeColor: "#333333", showEdges: false, cellCount: 20 },
};

function VoronoiCellsPanel() {
  const [preset, setPreset] = useState("default");
  const [cellCount, setCellCount] = useState(20);
  const [speed, setSpeed] = useState(1);
  const [colorMode, setColorMode] = useState<VoronoiColorMode>("solid");
  const [cellColor, setCellColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [showEdges, setShowEdges] = useState(true);
  const [edgeColor, setEdgeColor] = useState("#333333");
  const [resolution, setRes] = useState(1.0);
  const [relaxation, setRelax] = useState(0.05);
  const [interactive, setInteract] = useState(true);
  const [animated, setAnimated] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = VORONOI_PRESET_PARAMS[p as keyof typeof VORONOI_PRESET_PARAMS];
    if (!pp) return;
    setColorMode(pp.colorMode);
    setCellColor(pp.cellColor);
    setBg(pp.bg);
    setEdgeColor(pp.edgeColor);
    setShowEdges(pp.showEdges);
    setCellCount(pp.cellCount);
  }

  const code = [
    `import { VoronoiCells } from 'own-the-canvas';`,
    ``,
    `<VoronoiCells`,
    `  preset="${preset}"`,
    `  cellCount={${cellCount}}`,
    colorMode !== "solid" ? `  colorMode="${colorMode}"` : null,
    `  cellColor="${cellColor}"`,
    `  backgroundColor="${bg}"`,
    !showEdges ? `  showEdges={false}` : null,
    showEdges && edgeColor !== "#333333" ? `  edgeColor="${edgeColor}"` : null,
    speed !== 1 ? `  speed={${speed}}` : null,
    relaxation !== 0.05 ? `  relaxation={${relaxation}}` : null,
    resolution !== 0.25 ? `  resolution={${resolution}}` : null,
    !interactive ? `  interactive={false}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

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
          <Sel label="Preset" value={preset} options={["default", "stained-glass", "neon", "frost", "ember", "void"]} onChange={handlePreset} />
          <Sel label="Color mode" value={colorMode} options={["solid", "gradient", "cycle"]} onChange={(v) => setColorMode(v as VoronoiColorMode)} />
          <Divider />
          <ColorPicker label="Cell color" value={cellColor} onChange={setCellColor} />
          <ColorPicker label="Edge color" value={edgeColor} onChange={setEdgeColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Cell count" value={cellCount} min={3} max={60} step={1} onChange={setCellCount} />
          <Slider label="Speed" value={speed} min={0} max={5} step={0.1} onChange={setSpeed} />
          <Slider label="Relaxation" value={relaxation} min={0} max={0.3} step={0.01} onChange={setRelax} />
          <Slider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setRes} />
          <Toggle label="Show edges" value={showEdges} onChange={setShowEdges} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const SLIMEMOLD_PRESET_PARAMS = {
  default: { trailColor: "#ffffff", bg: "#111111", trailDecay: 0.92, agentCount: 1800 },
  neon:    { trailColor: "#00ffff", bg: "#000000", trailDecay: 0.92, agentCount: 1800 },
  coral:   { trailColor: "#ff8844", bg: "#0a0200", trailDecay: 0.92, agentCount: 1800 },
  vein:    { trailColor: "#ff2244", bg: "#080000", trailDecay: 0.92, agentCount: 3000 },
  frost:   { trailColor: "#88ddff", bg: "#000a10", trailDecay: 0.92, agentCount: 1800 },
  gold:    { trailColor: "#ffcc44", bg: "#0a0800", trailDecay: 0.92, agentCount: 1800 },
};

function SlimeMoldPanel() {
  const [preset, setPreset] = useState("default");
  const [agentCount, setAgentCount] = useState(1800);
  const [sensorAngle, setSensorAngle] = useState(45);
  const [sensorDist, setSensorDist] = useState(9);
  const [stepSize, setStepSize] = useState(1.5);
  const [rotateSpeed, setRotate] = useState(45);
  const [trailDecay, setDecay] = useState(0.92);
  const [diffuse, setDiffuse] = useState(0.2);
  const [trailColor, setTrailColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [resolution, setRes] = useState(0.35);
  const [interactive, setInteract] = useState(true);
  const [mouseRadius, setMouseRadius] = useState(20);
  const [mouseStrength, setMouseStr] = useState(3);
  const [animated, setAnimated] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = SLIMEMOLD_PRESET_PARAMS[p as keyof typeof SLIMEMOLD_PRESET_PARAMS];
    if (!pp) return;
    setTrailColor(pp.trailColor);
    setBg(pp.bg);
    setDecay(pp.trailDecay);
    setAgentCount(pp.agentCount);
  }

  const code = [
    `import { SlimeMold } from 'own-the-canvas';`,
    ``,
    `<SlimeMold`,
    `  preset="${preset}"`,
    `  agentCount={${agentCount}}`,
    `  trailColor="${trailColor}"`,
    `  backgroundColor="${bg}"`,
    sensorAngle !== 45 ? `  sensorAngle={${sensorAngle}}` : null,
    sensorDist !== 9 ? `  sensorDistance={${sensorDist}}` : null,
    stepSize !== 1.5 ? `  stepSize={${stepSize}}` : null,
    rotateSpeed !== 45 ? `  rotateSpeed={${rotateSpeed}}` : null,
    trailDecay !== 0.92 ? `  trailDecay={${trailDecay}}` : null,
    diffuse !== 0.2 ? `  diffuseStrength={${diffuse}}` : null,
    resolution !== 0.35 ? `  resolution={${resolution}}` : null,
    !interactive ? `  interactive={false}` : null,
    mouseRadius !== 20 ? `  mouseRadius={${mouseRadius}}` : null,
    mouseStrength !== 3 ? `  mouseStrength={${mouseStrength}}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <SlimeMold preset={preset} agentCount={agentCount} sensorAngle={sensorAngle}
            sensorDistance={sensorDist} stepSize={stepSize} rotateSpeed={rotateSpeed}
            trailDecay={trailDecay} diffuseStrength={diffuse}
            trailColor={trailColor} backgroundColor={bg}
            resolution={resolution} interactive={interactive}
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
          <Sel label="Preset" value={preset} options={["default", "neon", "coral", "vein", "frost", "gold"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Trail color" value={trailColor} onChange={setTrailColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Agent count" value={agentCount} min={200} max={8000} step={200} onChange={setAgentCount} />
          <Slider label="Sensor angle" value={sensorAngle} min={10} max={90} step={1} onChange={setSensorAngle} />
          <Slider label="Sensor distance" value={sensorDist} min={3} max={25} step={1} onChange={setSensorDist} />
          <Slider label="Step size" value={stepSize} min={0.5} max={4} step={0.1} onChange={setStepSize} />
          <Slider label="Trail decay" value={trailDecay} min={0.7} max={0.99} step={0.01} onChange={setDecay} />
          <Slider label="Diffuse" value={diffuse} min={0} max={0.8} step={0.05} onChange={setDiffuse} />
          <Slider label="Resolution" value={resolution} min={0.15} max={0.8} step={0.05} onChange={setRes} />
          {interactive && <Slider label="Mouse radius" value={mouseRadius} min={20} max={200} step={10} onChange={setMouseRadius} />}
          {interactive && <Slider label="Mouse strength" value={mouseStrength} min={1} max={10} step={1} onChange={setMouseStr} />}
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const INKBLEED_PRESET_PARAMS = {
  default:  { inkColor: "#ffffff", paperColor: "#111111", diffusionRate: 0.3,  viscosity: 0.8,  evaporationRate: 0.002, glowEffect: false, glowBlur: 8 },
  midnight: { inkColor: "#3b82f6", paperColor: "#020817", diffusionRate: 0.4,  viscosity: 0.8,  evaporationRate: 0.002, glowEffect: true,  glowBlur: 12 },
  sepia:    { inkColor: "#92400e", paperColor: "#fef3c7", diffusionRate: 0.2,  viscosity: 0.9,  evaporationRate: 0.002, glowEffect: false, glowBlur: 8 },
  toxic:    { inkColor: "#84cc16", paperColor: "#0a0f00", diffusionRate: 0.5,  viscosity: 0.8,  evaporationRate: 0.002, glowEffect: true,  glowBlur: 12 },
  neon:     { inkColor: "#f0abfc", paperColor: "#0a000f", diffusionRate: 0.35, viscosity: 0.8,  evaporationRate: 0.002, glowEffect: true,  glowBlur: 15 },
  frost:    { inkColor: "#bae6fd", paperColor: "#0c1428", diffusionRate: 0.25, viscosity: 0.85, evaporationRate: 0.001, glowEffect: false, glowBlur: 8 },
};

function InkBleedPanel() {
  const [preset, setPreset] = useState("default");
  const [inkColor, setInkColor] = useState("#ffffff");
  const [paperColor, setPaper] = useState("#111111");
  const [diffusion, setDiffusion] = useState(0.3);
  const [viscosity, setViscosity] = useState(0.8);
  const [evapRate, setEvapRate] = useState(0.002);
  const [inkRadius, setInkRadius] = useState(8);
  const [inkStrength, setInkStr] = useState(1);
  const [interactive, setInteract] = useState(true);
  const [autoInk, setAutoInk] = useState(true);
  const [autoInterval, setAutoInterval] = useState(2000);
  const [resolution, setRes] = useState(0.5);
  const [glowEffect, setGlow] = useState(false);
  const [glowBlur, setGlowBlur] = useState(8);
  const [animated, setAnimated] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = INKBLEED_PRESET_PARAMS[p as keyof typeof INKBLEED_PRESET_PARAMS];
    if (!pp) return;
    setInkColor(pp.inkColor);
    setPaper(pp.paperColor);
    setDiffusion(pp.diffusionRate);
    setViscosity(pp.viscosity);
    setEvapRate(pp.evaporationRate);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
  }

  const code = [
    `import { InkBleed } from 'own-the-canvas';`,
    ``,
    `<InkBleed`,
    `  preset="${preset}"`,
    `  inkColor="${inkColor}"`,
    `  paperColor="${paperColor}"`,
    `  diffusionRate={${diffusion}}`,
    `  viscosity={${viscosity}}`,
    `  evaporationRate={${evapRate}}`,
    `  inkRadius={${inkRadius}}`,
    `  inkStrength={${inkStrength}}`,
    `  interactive={${interactive}}`,
    `  autoInk={${autoInk}}`,
    `  autoInkInterval={${autoInterval}}`,
    `  resolution={${resolution}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <InkBleed preset={preset} inkColor={inkColor} paperColor={paperColor}
            diffusionRate={diffusion} viscosity={viscosity}
            evaporationRate={evapRate} inkRadius={inkRadius} inkStrength={inkStrength}
            interactive={interactive} autoInk={autoInk} autoInkInterval={autoInterval}
            resolution={resolution} glowEffect={glowEffect} glowBlur={glowBlur}
            animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click/drag to drop ink</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="InkBleed" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "midnight", "sepia", "toxic", "neon", "frost"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Ink color" value={inkColor} onChange={setInkColor} />
          <ColorPicker label="Paper color" value={paperColor} onChange={setPaper} />
          <Slider label="Diffusion rate" value={diffusion} min={0.01} max={0.9} step={0.01} onChange={setDiffusion} />
          <Slider label="Viscosity" value={viscosity} min={0} max={0.99} step={0.01} onChange={setViscosity} />
          <Slider label="Evaporation rate" value={evapRate} min={0} max={0.02} step={0.0005} onChange={setEvapRate} />
          <Slider label="Ink radius" value={inkRadius} min={2} max={40} step={1} onChange={setInkRadius} />
          <Slider label="Ink strength" value={inkStrength} min={0.1} max={2} step={0.05} onChange={setInkStr} />
          <Slider label="Auto interval ms" value={autoInterval} min={500} max={5000} step={100} onChange={setAutoInterval} />
          <Slider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setRes} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={1} onChange={setGlowBlur} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Auto ink" value={autoInk} onChange={setAutoInk} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlow} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const WATERCOLOR_PRESET_PARAMS = {
  default:    { color1: "#ffffff", color2: "#6b7280", color3: "#9ca3af", bg: "#111111", bloomRadius: 80,  opacity: 0.15, wetEdge: 0.4, layerCount: 6, noiseAmount: 0.5 },
  sunset:     { color1: "#f97316", color2: "#ec4899", color3: "#8b5cf6", bg: "#0a0005", bloomRadius: 100, opacity: 0.18, wetEdge: 0.5, layerCount: 6, noiseAmount: 0.5 },
  ocean:      { color1: "#0ea5e9", color2: "#06b6d4", color3: "#6366f1", bg: "#020b18", bloomRadius: 90,  opacity: 0.15, wetEdge: 0.35,layerCount: 6, noiseAmount: 0.5 },
  spring:     { color1: "#86efac", color2: "#fde68a", color3: "#fbcfe8", bg: "#0a0f05", bloomRadius: 80,  opacity: 0.2,  wetEdge: 0.4, layerCount: 8, noiseAmount: 0.5 },
  monochrome: { color1: "#ffffff", color2: "#d1d5db", color3: "#9ca3af", bg: "#111111", bloomRadius: 100, opacity: 0.12, wetEdge: 0.6, layerCount: 6, noiseAmount: 0.5 },
  neon:       { color1: "#f0abfc", color2: "#67e8f9", color3: "#c084fc", bg: "#050010", bloomRadius: 110, opacity: 0.2,  wetEdge: 0.7, layerCount: 6, noiseAmount: 0.6 },
};

function WatercolorBloomPanel() {
  const [preset, setPreset] = useState("default");
  const [color1, setColor1] = useState("#ffffff");
  const [color2, setColor2] = useState("#6b7280");
  const [color3, setColor3] = useState("#9ca3af");
  const [bg, setBg] = useState("#111111");
  const [bloomRadius, setBloomRadius] = useState(80);
  const [bloomSpeed, setBloomSpeed] = useState(0.5);
  const [opacity, setOpacity] = useState(0.15);
  const [wetEdge, setWetEdge] = useState(0.4);
  const [layerCount, setLayers] = useState(6);
  const [noiseAmount, setNoise] = useState(0.5);
  const [fadeSpeed, setFadeSpeed] = useState(0.001);
  const [interactive, setInteract] = useState(true);
  const [autoBloom, setAutoBloom] = useState(true);
  const [autoInterval, setAutoInt] = useState(1500);
  const [resolution, setRes] = useState(0.5);
  const [animated, setAnimated] = useState(true);
  const [maxBlooms, setMaxBlooms] = useState(12);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = WATERCOLOR_PRESET_PARAMS[p as keyof typeof WATERCOLOR_PRESET_PARAMS];
    if (!pp) return;
    setColor1(pp.color1);
    setColor2(pp.color2);
    setColor3(pp.color3);
    setBg(pp.bg);
    setBloomRadius(pp.bloomRadius);
    setOpacity(pp.opacity);
    setWetEdge(pp.wetEdge);
    setLayers(pp.layerCount);
    setNoise(pp.noiseAmount);
  }

  const colors = [color1, color2, color3];

  const code = [
    `import { WatercolorBloom } from 'own-the-canvas';`,
    ``,
    `<WatercolorBloom`,
    `  preset="${preset}"`,
    `  colors={${JSON.stringify(colors)}}`,
    `  backgroundColor="${bg}"`,
    `  bloomRadius={${bloomRadius}}`,
    `  bloomSpeed={${bloomSpeed}}`,
    `  opacity={${opacity}}`,
    `  wetEdge={${wetEdge}}`,
    `  layerCount={${layerCount}}`,
    `  noiseAmount={${noiseAmount}}`,
    `  fadeSpeed={${fadeSpeed}}`,
    `  interactive={${interactive}}`,
    `  autoBloom={${autoBloom}}`,
    `  autoBloomInterval={${autoInterval}}`,
    `  resolution={${resolution}}`,
    `  animated={${animated}}`,
    `  maxBlooms={${maxBlooms}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <WatercolorBloom preset={preset} colors={colors} backgroundColor={bg}
            bloomRadius={bloomRadius} bloomSpeed={bloomSpeed}
            opacity={opacity} wetEdge={wetEdge} layerCount={layerCount}
            noiseAmount={noiseAmount} autoBloom={autoBloom}
            fadeSpeed={fadeSpeed} interactive={interactive}
            autoBloomInterval={autoInterval} resolution={resolution}
            animated={animated} maxBlooms={maxBlooms}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to spawn blooms</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="WatercolorBloom" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "sunset", "ocean", "spring", "monochrome", "neon"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Color 1" value={color1} onChange={setColor1} />
          <ColorPicker label="Color 2" value={color2} onChange={setColor2} />
          <ColorPicker label="Color 3" value={color3} onChange={setColor3} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Bloom radius" value={bloomRadius} min={20} max={300} step={5} onChange={setBloomRadius} />
          <Slider label="Bloom speed" value={bloomSpeed} min={0.1} max={3} step={0.05} onChange={setBloomSpeed} />
          <Slider label="Opacity" value={opacity} min={0.01} max={0.5} step={0.01} onChange={setOpacity} />
          <Slider label="Wet edge" value={wetEdge} min={0} max={1} step={0.05} onChange={setWetEdge} />
          <Slider label="Layers" value={layerCount} min={2} max={16} step={1} onChange={setLayers} />
          <Slider label="Noise amount" value={noiseAmount} min={0} max={1} step={0.05} onChange={setNoise} />
          <Slider label="Fade speed" value={fadeSpeed} min={0} max={0.01} step={0.0005} onChange={setFadeSpeed} />
          <Slider label="Auto interval ms" value={autoInterval} min={200} max={5000} step={100} onChange={setAutoInt} />
          <Slider label="Max blooms" value={maxBlooms} min={1} max={30} step={1} onChange={setMaxBlooms} />
          <Slider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setRes} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Auto bloom" value={autoBloom} onChange={setAutoBloom} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const PENDULA_PRESET_PARAMS = {
  default: { color: "#ffffff", color2: "#6b7280", bg: "#111111", lineWidth: 1,   trailFade: 0.01,  damping: 0.9995, freq1: 2, freq2: 3, freq3: 0.01, colorMode: "solid"    as PendulaWaveColorMode, glowEffect: false, glowBlur: 10 },
  neon:    { color: "#00ffcc", color2: "#ff00aa", bg: "#000000", lineWidth: 1,   trailFade: 0.015, damping: 0.9995, freq1: 2, freq2: 3, freq3: 0.01, colorMode: "cycle"    as PendulaWaveColorMode, glowEffect: true,  glowBlur: 12 },
  crystal: { color: "#88ccff", color2: "#ffffff", bg: "#000510", lineWidth: 1,   trailFade: 0.01,  damping: 0.9995, freq1: 3, freq2: 5, freq3: 0.01, colorMode: "gradient" as PendulaWaveColorMode, glowEffect: true,  glowBlur: 8 },
  sand:    { color: "#d4a76a", color2: "#7c5c2e", bg: "#1a1005", lineWidth: 1.5, trailFade: 0.005, damping: 0.9998, freq1: 2, freq2: 3, freq3: 0.01, colorMode: "gradient" as PendulaWaveColorMode, glowEffect: false, glowBlur: 10 },
  minimal: { color: "#6b7280", color2: "#6b7280", bg: "#111111", lineWidth: 0.8, trailFade: 0.03,  damping: 0.9995, freq1: 2, freq2: 3, freq3: 0.01, colorMode: "solid"    as PendulaWaveColorMode, glowEffect: false, glowBlur: 10 },
  cosmic:  { color: "#c084fc", color2: "#38bdf8", bg: "#020010", lineWidth: 1,   trailFade: 0.01,  damping: 0.9995, freq1: 5, freq2: 7, freq3: 0.02, colorMode: "cycle"    as PendulaWaveColorMode, glowEffect: true,  glowBlur: 15 },
};

function PendulaWavePanel() {
  const [preset, setPreset] = useState("default");
  const [color, setColor] = useState("#ffffff");
  const [color2, setColor2] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [lineWidth, setLineWidth] = useState(1);
  const [trailFade, setTrailFade] = useState(0.01);
  const [speed, setSpeed] = useState(1);
  const [damping, setDamping] = useState(0.9995);
  const [freq1, setFreq1] = useState(2);
  const [freq2, setFreq2] = useState(3);
  const [freq3, setFreq3] = useState(0.01);
  const [amplitude, setAmplitude] = useState(0.9);
  const [colorMode, setColorMode] = useState<PendulaWaveColorMode>("solid");
  const [glowEffect, setGlow] = useState(false);
  const [glowBlur, setGlowBlur] = useState(10);
  const [animated, setAnimated] = useState(true);
  const [autoReset, setAutoReset] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PENDULA_PRESET_PARAMS[p as keyof typeof PENDULA_PRESET_PARAMS];
    if (!pp) return;
    setColor(pp.color);
    setColor2(pp.color2);
    setBg(pp.bg);
    setLineWidth(pp.lineWidth);
    setTrailFade(pp.trailFade);
    setDamping(pp.damping);
    setFreq1(pp.freq1);
    setFreq2(pp.freq2);
    setFreq3(pp.freq3);
    setColorMode(pp.colorMode);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
  }

  const code = [
    `import { PendulaWave } from 'own-the-canvas';`,
    ``,
    `<PendulaWave`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  color2="${color2}"`,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  trailFade={${trailFade}}`,
    `  speed={${speed}}`,
    `  damping={${damping}}`,
    `  freq1={${freq1}}`,
    `  freq2={${freq2}}`,
    `  freq3={${freq3}}`,
    `  amplitude={${amplitude}}`,
    `  colorMode="${colorMode}"`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  animated={${animated}}`,
    `  autoReset={${autoReset}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <PendulaWave preset={preset} color={color} color2={color2}
            backgroundColor={bg} lineWidth={lineWidth} trailFade={trailFade}
            speed={speed} damping={damping} freq1={freq1} freq2={freq2} freq3={freq3}
            amplitude={amplitude} colorMode={colorMode} glowEffect={glowEffect}
            glowBlur={glowBlur} animated={animated} autoReset={autoReset}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live preview</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="PendulaWave" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "crystal", "sand", "minimal", "cosmic"]} onChange={handlePreset} />
          <Sel label="Color mode" value={colorMode} options={["solid", "cycle", "gradient"]} onChange={(v) => setColorMode(v as PendulaWaveColorMode)} />
          <Divider />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <ColorPicker label="Color 2" value={color2} onChange={setColor2} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
          <Slider label="Freq 1 (x)" value={freq1} min={1} max={10} step={0.5} onChange={setFreq1} />
          <Slider label="Freq 2 (y)" value={freq2} min={1} max={10} step={0.5} onChange={setFreq2} />
          <Slider label="Freq 3 (φ)" value={freq3} min={0} max={0.1} step={0.005} onChange={setFreq3} />
          <Slider label="Damping" value={damping} min={0.998} max={1} step={0.0001} onChange={setDamping} />
          <Slider label="Amplitude" value={amplitude} min={0.1} max={1} step={0.05} onChange={setAmplitude} />
          <Slider label="Trail fade" value={trailFade} min={0.001} max={0.1} step={0.001} onChange={setTrailFade} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={5} step={0.25} onChange={setLineWidth} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlow} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
          <Toggle label="Auto reset" value={autoReset} onChange={setAutoReset} />
        </div>
      </div>
    </>
  );
}

const CRYSTALGROWTH_PRESET_PARAMS = {
  default:   { crystalColor: "#ffffff", activeColor: "#6b7280", bg: "#111111", symmetry: 6,  branchProb: 0.3,  noise: 0.2,  cellSize: 3, glowEffect: true,  glowBlur: 12, colorMode: "solid" as CrystalGrowthColorMode },
  snowflake: { crystalColor: "#e0f2fe", activeColor: "#7dd3fc", bg: "#0c1a2e", symmetry: 6,  branchProb: 0.4,  noise: 0.15, cellSize: 3, glowEffect: true,  glowBlur: 10, colorMode: "solid" as CrystalGrowthColorMode },
  gem:       { crystalColor: "#c084fc", activeColor: "#e879f9", bg: "#09000f", symmetry: 8,  branchProb: 0.2,  noise: 0.1,  cellSize: 3, glowEffect: true,  glowBlur: 15, colorMode: "age"   as CrystalGrowthColorMode },
  neon:      { crystalColor: "#00ffcc", activeColor: "#ff00aa", bg: "#000000", symmetry: 4,  branchProb: 0.35, noise: 0.3,  cellSize: 3, glowEffect: true,  glowBlur: 18, colorMode: "cycle" as CrystalGrowthColorMode },
  frost:     { crystalColor: "#bae6fd", activeColor: "#ffffff", bg: "#0a1628", symmetry: 6,  branchProb: 0.5,  noise: 0.25, cellSize: 2, glowEffect: true,  glowBlur: 8,  colorMode: "solid" as CrystalGrowthColorMode },
  gold:      { crystalColor: "#fbbf24", activeColor: "#f59e0b", bg: "#0a0500", symmetry: 12, branchProb: 0.15, noise: 0.05, cellSize: 3, glowEffect: true,  glowBlur: 12, colorMode: "age"   as CrystalGrowthColorMode },
};

function CrystalGrowthPanel() {
  const [preset, setPreset] = useState("default");
  const [crystalColor, setCrystal] = useState("#ffffff");
  const [activeColor, setActive] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [growthSpeed, setSpeed] = useState(3);
  const [symmetry, setSymmetry] = useState(6);
  const [branchProb, setBranchProb] = useState(0.3);
  const [noiseAmount, setNoise] = useState(0.2);
  const [cellSize, setCellSize] = useState(3);
  const [glowEffect, setGlow] = useState(true);
  const [glowBlur, setGlowBlur] = useState(12);
  const [interactive, setInteract] = useState(true);
  const [autoReset, setAutoReset] = useState(true);
  const [colorMode, setColorMode] = useState<CrystalGrowthColorMode>("solid");
  const [animated, setAnimated] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = CRYSTALGROWTH_PRESET_PARAMS[p as keyof typeof CRYSTALGROWTH_PRESET_PARAMS];
    if (!pp) return;
    setCrystal(pp.crystalColor);
    setActive(pp.activeColor);
    setBg(pp.bg);
    setSymmetry(pp.symmetry);
    setBranchProb(pp.branchProb);
    setNoise(pp.noise);
    setCellSize(pp.cellSize);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setColorMode(pp.colorMode);
  }

  const code = [
    `import { CrystalGrowth } from 'own-the-canvas';`,
    ``,
    `<CrystalGrowth`,
    `  preset="${preset}"`,
    `  crystalColor="${crystalColor}"`,
    `  activeColor="${activeColor}"`,
    `  backgroundColor="${bg}"`,
    `  growthSpeed={${growthSpeed}}`,
    `  symmetry={${symmetry}}`,
    `  branchProbability={${branchProb}}`,
    `  noiseAmount={${noiseAmount}}`,
    `  cellSize={${cellSize}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  interactive={${interactive}}`,
    `  autoReset={${autoReset}}`,
    `  colorMode="${colorMode}"`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <CrystalGrowth preset={preset} crystalColor={crystalColor} activeColor={activeColor}
            backgroundColor={bg} growthSpeed={growthSpeed} symmetry={symmetry}
            branchProbability={branchProb} noiseAmount={noiseAmount} cellSize={cellSize}
            glowEffect={glowEffect} glowBlur={glowBlur} interactive={interactive}
            autoReset={autoReset} colorMode={colorMode} animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to seed new growth</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="CrystalGrowth" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "snowflake", "gem", "neon", "frost", "gold"]} onChange={handlePreset} />
          <Sel label="Color mode" value={colorMode} options={["solid", "age", "cycle"]} onChange={(v) => setColorMode(v as CrystalGrowthColorMode)} />
          <Divider />
          <ColorPicker label="Crystal color" value={crystalColor} onChange={setCrystal} />
          <ColorPicker label="Active color" value={activeColor} onChange={setActive} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Growth speed" value={growthSpeed} min={1} max={20} step={1} onChange={setSpeed} />
          <Slider label="Symmetry arms" value={symmetry} min={2} max={12} step={1} onChange={setSymmetry} />
          <Slider label="Branch probability" value={branchProb} min={0} max={1} step={0.05} onChange={setBranchProb} />
          <Slider label="Noise amount" value={noiseAmount} min={0} max={1} step={0.05} onChange={setNoise} />
          <Slider label="Cell size" value={cellSize} min={1} max={8} step={1} onChange={setCellSize} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Auto reset" value={autoReset} onChange={setAutoReset} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const NEURALWEB_PRESET_PARAMS = {
  default: { nodeColor: "#ffffff", edgeColor: "#6b7280", signalColor: "#ffffff", bg: "#111111", connRadius: 150, nodeRadius: 4, pulseInterval: 2000, pulseDecay: 0.85, glowEffect: true,  glowBlur: 15, wanderSpeed: 0.3 },
  neon:    { nodeColor: "#00ffcc", edgeColor: "#00ffcc", signalColor: "#ffffff", bg: "#000000", connRadius: 150, nodeRadius: 4, pulseInterval: 1500, pulseDecay: 0.9,  glowEffect: true,  glowBlur: 20, wanderSpeed: 0.3 },
  brain:   { nodeColor: "#f472b6", edgeColor: "#ec4899", signalColor: "#fbbf24", bg: "#0f0005", connRadius: 130, nodeRadius: 4, pulseInterval: 2000, pulseDecay: 0.88, glowEffect: true,  glowBlur: 18, wanderSpeed: 0.4 },
  minimal: { nodeColor: "#6b7280", edgeColor: "#374151", signalColor: "#9ca3af", bg: "#111111", connRadius: 150, nodeRadius: 3, pulseInterval: 3000, pulseDecay: 0.85, glowEffect: false, glowBlur: 15, wanderSpeed: 0.3 },
  plasma:  { nodeColor: "#c084fc", edgeColor: "#7c3aed", signalColor: "#f0abfc", bg: "#050010", connRadius: 170, nodeRadius: 4, pulseInterval: 2000, pulseDecay: 0.92, glowEffect: true,  glowBlur: 25, wanderSpeed: 0.2 },
  circuit: { nodeColor: "#22c55e", edgeColor: "#166534", signalColor: "#86efac", bg: "#020a02", connRadius: 100, nodeRadius: 3, pulseInterval: 1000, pulseDecay: 0.8,  glowEffect: true,  glowBlur: 12, wanderSpeed: 0.1 },
};

function NeuralWebPanel() {
  const [preset, setPreset] = useState("default");
  const [nodeCount, setNodeCount] = useState(40);
  const [nodeColor, setNodeColor] = useState("#ffffff");
  const [edgeColor, setEdgeColor] = useState("#6b7280");
  const [signalColor, setSignalColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [connRadius, setConnRadius] = useState(150);
  const [nodeRadius, setNodeRadius] = useState(4);
  const [lineWidth, setLineWidth] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [pulseInterval, setPulseInt] = useState(2000);
  const [pulseDecay, setPulseDecay] = useState(0.85);
  const [glowEffect, setGlow] = useState(true);
  const [glowBlur, setGlowBlur] = useState(15);
  const [interactive, setInteract] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [wander, setWander] = useState(true);
  const [wanderSpeed, setWanderSpeed] = useState(0.3);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = NEURALWEB_PRESET_PARAMS[p as keyof typeof NEURALWEB_PRESET_PARAMS];
    if (!pp) return;
    setNodeColor(pp.nodeColor);
    setEdgeColor(pp.edgeColor);
    setSignalColor(pp.signalColor);
    setBg(pp.bg);
    setConnRadius(pp.connRadius);
    setNodeRadius(pp.nodeRadius);
    setPulseInt(pp.pulseInterval);
    setPulseDecay(pp.pulseDecay);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setWanderSpeed(pp.wanderSpeed);
  }

  const code = [
    `import { NeuralWeb } from 'own-the-canvas';`,
    ``,
    `<NeuralWeb`,
    `  preset="${preset}"`,
    `  nodeCount={${nodeCount}}`,
    `  nodeColor="${nodeColor}"`,
    `  edgeColor="${edgeColor}"`,
    `  signalColor="${signalColor}"`,
    `  backgroundColor="${bg}"`,
    `  connectionRadius={${connRadius}}`,
    `  nodeRadius={${nodeRadius}}`,
    `  lineWidth={${lineWidth}}`,
    `  speed={${speed}}`,
    `  pulseInterval={${pulseInterval}}`,
    `  pulseDecay={${pulseDecay}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  wander={${wander}}`,
    `  wanderSpeed={${wanderSpeed}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <NeuralWeb preset={preset} nodeCount={nodeCount} nodeColor={nodeColor}
            edgeColor={edgeColor} signalColor={signalColor} backgroundColor={bg}
            connectionRadius={connRadius} nodeRadius={nodeRadius} lineWidth={lineWidth}
            speed={speed} pulseInterval={pulseInterval} pulseDecay={pulseDecay}
            glowEffect={glowEffect} glowBlur={glowBlur} interactive={interactive}
            animated={animated} wander={wander} wanderSpeed={wanderSpeed}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Click to fire a signal pulse</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="NeuralWeb" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "brain", "minimal", "plasma", "circuit"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Node color" value={nodeColor} onChange={setNodeColor} />
          <ColorPicker label="Edge color" value={edgeColor} onChange={setEdgeColor} />
          <ColorPicker label="Signal color" value={signalColor} onChange={setSignalColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Node count" value={nodeCount} min={5} max={100} step={5} onChange={setNodeCount} />
          <Slider label="Connection radius" value={connRadius} min={50} max={400} step={10} onChange={setConnRadius} />
          <Slider label="Node radius" value={nodeRadius} min={1} max={12} step={0.5} onChange={setNodeRadius} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.25} onChange={setLineWidth} />
          <Slider label="Signal speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
          <Slider label="Pulse interval ms" value={pulseInterval} min={200} max={5000} step={100} onChange={setPulseInt} />
          <Slider label="Pulse decay" value={pulseDecay} min={0.5} max={1} step={0.01} onChange={setPulseDecay} />
          <Slider label="Wander speed" value={wanderSpeed} min={0} max={2} step={0.05} onChange={setWanderSpeed} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={40} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Wander" value={wander} onChange={setWander} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const PARTICLETEXT_PRESET_PARAMS = {
  default: { color: "#ffffff", bg: "#111111", particleSize: 2,   repelRadius: 80,  repelForce: 5, snapSpeed: 0.12, glowEffect: false, glowBlur: 6 },
  neon:    { color: "#00ffcc", bg: "#000000", particleSize: 2,   repelRadius: 80,  repelForce: 7, snapSpeed: 0.12, glowEffect: true,  glowBlur: 10 },
  fire:    { color: "#f97316", bg: "#0a0200", particleSize: 2,   repelRadius: 80,  repelForce: 8, snapSpeed: 0.12, glowEffect: true,  glowBlur: 12 },
  frost:   { color: "#93c5fd", bg: "#030712", particleSize: 2,   repelRadius: 100, repelForce: 5, snapSpeed: 0.08, glowEffect: true,  glowBlur: 8 },
  gold:    { color: "#fbbf24", bg: "#0a0800", particleSize: 2,   repelRadius: 80,  repelForce: 5, snapSpeed: 0.12, glowEffect: true,  glowBlur: 14 },
  minimal: { color: "#6b7280", bg: "#111111", particleSize: 1.5, repelRadius: 80,  repelForce: 3, snapSpeed: 0.12, glowEffect: false, glowBlur: 6 },
};

function ParticleTextPanel() {
  const [preset, setPreset] = useState("default");
  const [text, setText] = useState("hello");
  const [fontSize, setFontSize] = useState(120);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [particleSize, setPSize] = useState(2);
  const [particleGap, setPGap] = useState(4);
  const [repelRadius, setRepRad] = useState(80);
  const [repelForce, setRepForce] = useState(5);
  const [snapSpeed, setSnap] = useState(0.12);
  const [friction, setFriction] = useState(0.85);
  const [glowEffect, setGlow] = useState(false);
  const [glowBlur, setGlowBlur] = useState(6);
  const [animated, setAnimated] = useState(true);
  const [interactive, setInteract] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PARTICLETEXT_PRESET_PARAMS[p as keyof typeof PARTICLETEXT_PRESET_PARAMS];
    if (!pp) return;
    setColor(pp.color);
    setBg(pp.bg);
    setPSize(pp.particleSize);
    setRepRad(pp.repelRadius);
    setRepForce(pp.repelForce);
    setSnap(pp.snapSpeed);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
  }

  const code = [
    `import { ParticleText } from 'own-the-canvas';`,
    ``,
    `<ParticleText`,
    `  preset="${preset}"`,
    `  text="${text}"`,
    `  fontSize={${fontSize}}`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  particleSize={${particleSize}}`,
    `  particleGap={${particleGap}}`,
    `  repelRadius={${repelRadius}}`,
    `  repelForce={${repelForce}}`,
    `  snapSpeed={${snapSpeed}}`,
    `  friction={${friction}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <ParticleText preset={preset} text={text} fontSize={fontSize}
            color={color} backgroundColor={bg}
            particleSize={particleSize} particleGap={particleGap}
            repelRadius={repelRadius} repelForce={repelForce}
            snapSpeed={snapSpeed} friction={friction}
            glowEffect={glowEffect} glowBlur={glowBlur}
            animated={animated} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Move cursor to scatter particles</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="ParticleText" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "fire", "frost", "gold", "minimal"]} onChange={handlePreset} />
          <div className="ctrl-row">
            <label className="ctrl-label">Text</label>
            <input className="ctrl-text-input" value={text}
              onChange={e => e.target.value && setText(e.target.value)}
              spellCheck={false} />
          </div>
          <Divider />
          <ColorPicker label="Particle color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Font size" value={fontSize} min={40} max={200} step={10} onChange={setFontSize} />
          <Slider label="Particle size" value={particleSize} min={0.5} max={5} step={0.5} onChange={setPSize} />
          <Slider label="Particle gap" value={particleGap} min={2} max={12} step={1} onChange={setPGap} />
          <Slider label="Repel radius" value={repelRadius} min={20} max={200} step={10} onChange={setRepRad} />
          <Slider label="Repel force" value={repelForce} min={1} max={20} step={0.5} onChange={setRepForce} />
          <Slider label="Snap speed" value={snapSpeed} min={0.01} max={0.5} step={0.01} onChange={setSnap} />
          <Slider label="Friction" value={friction} min={0.5} max={0.99} step={0.01} onChange={setFriction} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={30} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const METABALLS_PRESET_PARAMS = {
  default: { color: "#ffffff", bg: "#111111", threshold: 1,   speed: 1,   minRadius: 40, maxRadius: 80,  glowEffect: true,  glowBlur: 20 },
  plasma:  { color: "#c084fc", bg: "#050010", threshold: 1,   speed: 1.5, minRadius: 40, maxRadius: 80,  glowEffect: true,  glowBlur: 30 },
  lava:    { color: "#f97316", bg: "#1a0000", threshold: 1,   speed: 0.5, minRadius: 50, maxRadius: 100, glowEffect: true,  glowBlur: 20 },
  ocean:   { color: "#38bdf8", bg: "#020c17", threshold: 0.8, speed: 0.8, minRadius: 40, maxRadius: 80,  glowEffect: true,  glowBlur: 15 },
  neon:    { color: "#00ffcc", bg: "#000000", threshold: 1.1, speed: 2,   minRadius: 40, maxRadius: 80,  glowEffect: true,  glowBlur: 25 },
  ghost:   { color: "#e2e8f0", bg: "#111111", threshold: 0.9, speed: 0.3, minRadius: 60, maxRadius: 110, glowEffect: false, glowBlur: 20 },
};

function MetaballsPanel() {
  const [preset, setPreset] = useState("default");
  const [blobCount, setBlobCount] = useState(5);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [threshold, setThresh] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [minRadius, setMinR] = useState(40);
  const [maxRadius, setMaxR] = useState(80);
  const [glowEffect, setGlow] = useState(true);
  const [glowBlur, setGlowBlur] = useState(20);
  const [resolution, setRes] = useState(0.4);
  const [animated, setAnimated] = useState(true);
  const [interactive, setInteract] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = METABALLS_PRESET_PARAMS[p as keyof typeof METABALLS_PRESET_PARAMS];
    if (!pp) return;
    setColor(pp.color);
    setBg(pp.bg);
    setThresh(pp.threshold);
    setSpeed(pp.speed);
    setMinR(pp.minRadius);
    setMaxR(pp.maxRadius);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
  }

  const code = [
    `import { Metaballs } from 'own-the-canvas';`,
    ``,
    `<Metaballs`,
    `  preset="${preset}"`,
    `  blobCount={${blobCount}}`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  threshold={${threshold}}`,
    `  speed={${speed}}`,
    `  minRadius={${minRadius}}`,
    `  maxRadius={${maxRadius}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  resolution={${resolution}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Metaballs preset={preset} blobCount={blobCount} color={color}
            backgroundColor={bg} threshold={threshold} speed={speed}
            minRadius={minRadius} maxRadius={maxRadius}
            glowEffect={glowEffect} glowBlur={glowBlur}
            resolution={resolution} interactive={interactive} animated={animated}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Drag to move · click to add</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="Metaballs" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "plasma", "lava", "ocean", "neon", "ghost"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Blob color" value={color} onChange={setColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Blob count" value={blobCount} min={1} max={12} step={1} onChange={setBlobCount} />
          <Slider label="Threshold" value={threshold} min={0.3} max={2} step={0.05} onChange={setThresh} />
          <Slider label="Speed" value={speed} min={0} max={5} step={0.1} onChange={setSpeed} />
          <Slider label="Min radius" value={minRadius} min={10} max={150} step={5} onChange={setMinR} />
          <Slider label="Max radius" value={maxRadius} min={10} max={200} step={5} onChange={setMaxR} />
          <Slider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setRes} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={50} step={1} onChange={setGlowBlur} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const ANTCOLONY_PRESET_PARAMS = {
  default: { antColor: "#ffffff", pheromoneColor: "#6b7280", foodColor: "#4ade80", nestColor: "#f59e0b", bg: "#111111", antCount: 150, antSpeed: 1.5, evaporationRate: 0.003, pheromoneStrength: 5 },
  neon:    { antColor: "#ffffff", pheromoneColor: "#00ffcc", foodColor: "#f0abfc", nestColor: "#fbbf24", bg: "#000000", antCount: 150, antSpeed: 1.5, evaporationRate: 0.003, pheromoneStrength: 8 },
  desert:  { antColor: "#451a03", pheromoneColor: "#d97706", foodColor: "#84cc16", nestColor: "#b45309", bg: "#fef3c7", antCount: 150, antSpeed: 2,   evaporationRate: 0.005, pheromoneStrength: 5 },
  jungle:  { antColor: "#1a0a00", pheromoneColor: "#4ade80", foodColor: "#fbbf24", nestColor: "#7c3aed", bg: "#052e16", antCount: 200, antSpeed: 1,   evaporationRate: 0.003, pheromoneStrength: 5 },
  minimal: { antColor: "#9ca3af", pheromoneColor: "#374151", foodColor: "#6b7280", nestColor: "#6b7280", bg: "#111111", antCount: 80,  antSpeed: 1.5, evaporationRate: 0.003, pheromoneStrength: 3 },
  swarm:   { antColor: "#ffffff", pheromoneColor: "#6b7280", foodColor: "#4ade80", nestColor: "#f59e0b", bg: "#111111", antCount: 400, antSpeed: 2,   evaporationRate: 0.002, pheromoneStrength: 10 },
};

function AntColonyPanel() {
  const [preset, setPreset] = useState("default");
  const [antCount, setAntCount] = useState(150);
  const [evapRate, setEvapRate] = useState(0.003);
  const [diffRate, setDiffRate] = useState(0.1);
  const [phStrength, setPhStrength] = useState(5);
  const [antSpeed, setAntSpeed] = useState(1.5);
  const [sensorAngle, setSensorAng] = useState(0.4);
  const [sensorDist, setSensorDist] = useState(6);
  const [turnSpeed, setTurnSpeed] = useState(0.3);
  const [antColor, setAntColor] = useState("#ffffff");
  const [phColor, setPhColor] = useState("#6b7280");
  const [foodColor, setFoodColor] = useState("#4ade80");
  const [nestColor, setNestColor] = useState("#f59e0b");
  const [bg, setBg] = useState("#111111");
  const [maxFood, setMaxFood] = useState(5);
  const [animated, setAnimated] = useState(true);
  const [interactive, setInteract] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = ANTCOLONY_PRESET_PARAMS[p as keyof typeof ANTCOLONY_PRESET_PARAMS];
    if (!pp) return;
    setAntColor(pp.antColor);
    setPhColor(pp.pheromoneColor);
    setFoodColor(pp.foodColor);
    setNestColor(pp.nestColor);
    setBg(pp.bg);
    setAntCount(pp.antCount);
    setAntSpeed(pp.antSpeed);
    setEvapRate(pp.evaporationRate);
    setPhStrength(pp.pheromoneStrength);
  }

  const code = [
    `import { AntColony } from 'own-the-canvas';`,
    ``,
    `<AntColony`,
    `  preset="${preset}"`,
    `  antCount={${antCount}}`,
    `  evaporationRate={${evapRate}}`,
    `  diffusionRate={${diffRate}}`,
    `  pheromoneStrength={${phStrength}}`,
    `  antSpeed={${antSpeed}}`,
    `  sensorAngle={${sensorAngle}}`,
    `  sensorDistance={${sensorDist}}`,
    `  turnSpeed={${turnSpeed}}`,
    `  antColor="${antColor}"`,
    `  pheromoneColor="${phColor}"`,
    `  foodColor="${foodColor}"`,
    `  nestColor="${nestColor}"`,
    `  backgroundColor="${bg}"`,
    `  maxFood={${maxFood}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <AntColony preset={preset} antCount={antCount} antSpeed={antSpeed}
            evaporationRate={evapRate} pheromoneStrength={phStrength}
            antColor={antColor} pheromoneColor={phColor}
            foodColor={foodColor} nestColor={nestColor}
            backgroundColor={bg} animated={animated} interactive={interactive}
            diffusionRate={diffRate} sensorAngle={sensorAngle}
            sensorDistance={sensorDist} turnSpeed={turnSpeed}
            maxFood={maxFood}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Live simulation</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="AntColony" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "desert", "jungle", "minimal", "swarm"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Ant color" value={antColor} onChange={setAntColor} />
          <ColorPicker label="Pheromone color" value={phColor} onChange={setPhColor} />
          <ColorPicker label="Food color" value={foodColor} onChange={setFoodColor} />
          <ColorPicker label="Nest color" value={nestColor} onChange={setNestColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Ant count" value={antCount} min={20} max={500} step={10} onChange={setAntCount} />
          <Slider label="Ant speed" value={antSpeed} min={0.5} max={5} step={0.1} onChange={setAntSpeed} />
          <Slider label="Evaporation rate" value={evapRate} min={0} max={0.02} step={0.001} onChange={setEvapRate} />
          <Slider label="Diffusion rate" value={diffRate} min={0} max={0.5} step={0.01} onChange={setDiffRate} />
          <Slider label="Pheromone strength" value={phStrength} min={1} max={30} step={1} onChange={setPhStrength} />
          <Slider label="Sensor angle" value={sensorAngle} min={0.1} max={1.5} step={0.05} onChange={setSensorAng} />
          <Slider label="Sensor distance" value={sensorDist} min={2} max={30} step={1} onChange={setSensorDist} />
          <Slider label="Turn speed" value={turnSpeed} min={0.05} max={1} step={0.05} onChange={setTurnSpeed} />
          <Slider label="Max food sources" value={maxFood} min={1} max={10} step={1} onChange={setMaxFood} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const MAGNETICFIELD_PRESET_PARAMS = {
  default:  { positiveColor: "#ef4444", negativeColor: "#3b82f6", lineColor: "#6b7280", bg: "#111111", lineOpacity: 0.6, glowEffect: true,  glowBlur: 20, fieldLineCount: 16 },
  neon:     { positiveColor: "#f43f5e", negativeColor: "#3b82f6", lineColor: "#00ffcc", bg: "#000000", lineOpacity: 0.8, glowEffect: true,  glowBlur: 25, fieldLineCount: 16 },
  warm:     { positiveColor: "#f97316", negativeColor: "#fbbf24", lineColor: "#fed7aa", bg: "#0c0500", lineOpacity: 0.6, glowEffect: true,  glowBlur: 18, fieldLineCount: 16 },
  mono:     { positiveColor: "#ffffff", negativeColor: "#6b7280", lineColor: "#9ca3af", bg: "#111111", lineOpacity: 0.5, glowEffect: false, glowBlur: 20, fieldLineCount: 16 },
  electric: { positiveColor: "#38bdf8", negativeColor: "#a78bfa", lineColor: "#e0f2fe", bg: "#020c14", lineOpacity: 0.6, glowEffect: true,  glowBlur: 30, fieldLineCount: 24 },
  minimal:  { positiveColor: "#ef4444", negativeColor: "#3b82f6", lineColor: "#4b5563", bg: "#111111", lineOpacity: 0.4, glowEffect: false, glowBlur: 20, fieldLineCount: 10 },
};

function MagneticFieldPanel() {
  const [preset, setPreset] = useState("default");
  const [fieldLines, setFieldLines] = useState(16);
  const [stepSize, setStepSize] = useState(4);
  const [maxSteps, setMaxSteps] = useState(400);
  const [posColor, setPosColor] = useState("#ef4444");
  const [negColor, setNegColor] = useState("#3b82f6");
  const [lineColor, setLineColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [lineWidth, setLineWidth] = useState(1);
  const [lineOpacity, setOpacity] = useState(0.6);
  const [poleRadius, setPoleRadius] = useState(12);
  const [glowEffect, setGlow] = useState(true);
  const [glowBlur, setGlowBlur] = useState(20);
  const [animated, setAnimated] = useState(false);
  const [interactive, setInteract] = useState(true);
  const [maxPoles, setMaxPoles] = useState(6);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = MAGNETICFIELD_PRESET_PARAMS[p as keyof typeof MAGNETICFIELD_PRESET_PARAMS];
    if (!pp) return;
    setPosColor(pp.positiveColor);
    setNegColor(pp.negativeColor);
    setLineColor(pp.lineColor);
    setBg(pp.bg);
    setOpacity(pp.lineOpacity);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setFieldLines(pp.fieldLineCount);
  }

  const code = [
    `import { MagneticField } from 'own-the-canvas';`,
    ``,
    `<MagneticField`,
    `  preset="${preset}"`,
    `  fieldLineCount={${fieldLines}}`,
    `  stepSize={${stepSize}}`,
    `  maxSteps={${maxSteps}}`,
    `  positiveColor="${posColor}"`,
    `  negativeColor="${negColor}"`,
    `  lineColor="${lineColor}"`,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  lineOpacity={${lineOpacity}}`,
    `  poleRadius={${poleRadius}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  animated={${animated}}`,
    `  interactive={${interactive}}`,
    `  maxPoles={${maxPoles}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <MagneticField preset={preset} fieldLineCount={fieldLines} stepSize={stepSize}
            maxSteps={maxSteps} positiveColor={posColor} negativeColor={negColor}
            lineColor={lineColor} backgroundColor={bg} lineWidth={lineWidth}
            lineOpacity={lineOpacity} poleRadius={poleRadius}
            glowEffect={glowEffect} glowBlur={glowBlur}
            animated={animated} interactive={interactive} maxPoles={maxPoles}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Drag poles · click to add · right-click to remove</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="MagneticField" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "neon", "warm", "mono", "electric", "minimal"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="N-pole color" value={posColor} onChange={setPosColor} />
          <ColorPicker label="S-pole color" value={negColor} onChange={setNegColor} />
          <ColorPicker label="Line color" value={lineColor} onChange={setLineColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Field lines" value={fieldLines} min={4} max={36} step={2} onChange={setFieldLines} />
          <Slider label="Step size" value={stepSize} min={1} max={10} step={0.5} onChange={setStepSize} />
          <Slider label="Max steps" value={maxSteps} min={50} max={800} step={50} onChange={setMaxSteps} />
          <Slider label="Line width" value={lineWidth} min={0.5} max={4} step={0.25} onChange={setLineWidth} />
          <Slider label="Line opacity" value={lineOpacity} min={0.1} max={1} step={0.05} onChange={setOpacity} />
          <Slider label="Pole radius" value={poleRadius} min={6} max={30} step={1} onChange={setPoleRadius} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={50} step={1} onChange={setGlowBlur} />
          <Slider label="Max poles" value={maxPoles} min={2} max={8} step={1} onChange={setMaxPoles} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
        </div>
      </div>
    </>
  );
}

const TERRAINMESH_PRESET_PARAMS = {
  default:  { wireColor: "#ffffff", bg: "#111111", heightScale: 120, noiseScale: 0.12, glowEffect: false, glowBlur: 8, colorByHeight: true,  lineWidth: 0.5 },
  volcanic: { wireColor: "#ef4444", bg: "#0a0000", heightScale: 160, noiseScale: 0.12, glowEffect: true,  glowBlur: 10, colorByHeight: true, lineWidth: 0.5 },
  arctic:   { wireColor: "#bae6fd", bg: "#020c17", heightScale: 80,  noiseScale: 0.08, glowEffect: true,  glowBlur: 8,  colorByHeight: true, lineWidth: 0.5 },
  neon:     { wireColor: "#00ffcc", bg: "#000000", heightScale: 140, noiseScale: 0.12, glowEffect: true,  glowBlur: 12, colorByHeight: false, lineWidth: 0.75 },
  golden:   { wireColor: "#fbbf24", bg: "#0a0800", heightScale: 100, noiseScale: 0.12, glowEffect: true,  glowBlur: 8,  colorByHeight: true, lineWidth: 0.5 },
  minimal:  { wireColor: "#4b5563", bg: "#111111", heightScale: 60,  noiseScale: 0.12, glowEffect: false, glowBlur: 8,  colorByHeight: false, lineWidth: 0.5 },
};

function TerrainMeshPanel() {
  const [preset, setPreset] = useState("default");
  const [gridCols, setGridCols] = useState(40);
  const [gridRows, setGridRows] = useState(30);
  const [noiseScale, setNoiseScale] = useState(0.12);
  const [heightScale, setHeightScale] = useState(120);
  const [wireColor, setWireColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [fov, setFov] = useState(500);
  const [autoRotate, setAutoRotate] = useState(true);
  const [autoRotSpeed, setAutoRotSpd] = useState(0.003);
  const [glowEffect, setGlow] = useState(false);
  const [glowBlur, setGlowBlur] = useState(8);
  const [interactive, setInteract] = useState(true);
  const [animated, setAnimated] = useState(true);
  const [lineWidth, setLineWidth] = useState(0.5);
  const [colorByH, setColorByH] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = TERRAINMESH_PRESET_PARAMS[p as keyof typeof TERRAINMESH_PRESET_PARAMS];
    if (!pp) return;
    setWireColor(pp.wireColor);
    setBg(pp.bg);
    setHeightScale(pp.heightScale);
    setNoiseScale(pp.noiseScale);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setColorByH(pp.colorByHeight);
    setLineWidth(pp.lineWidth);
  }

  const code = [
    `import { TerrainMesh } from 'own-the-canvas';`,
    ``,
    `<TerrainMesh`,
    `  preset="${preset}"`,
    `  gridCols={${gridCols}}`,
    `  gridRows={${gridRows}}`,
    `  noiseScale={${noiseScale}}`,
    `  heightScale={${heightScale}}`,
    `  wireColor="${wireColor}"`,
    `  backgroundColor="${bg}"`,
    `  fov={${fov}}`,
    `  autoRotate={${autoRotate}}`,
    `  autoRotateSpeed={${autoRotSpeed}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  lineWidth={${lineWidth}}`,
    `  colorByHeight={${colorByH}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <TerrainMesh preset={preset} gridCols={gridCols} gridRows={gridRows}
            noiseScale={noiseScale} heightScale={heightScale} wireColor={wireColor}
            backgroundColor={bg} fov={fov} autoRotate={autoRotate}
            autoRotateSpeed={autoRotSpeed} glowEffect={glowEffect} glowBlur={glowBlur}
            lineWidth={lineWidth} colorByHeight={colorByH}
            animated={animated} interactive={interactive}
            width="100%" height="100%" />
        </div>
        <div className="canvas-label"><div className="canvas-dot" /><span>Drag to orbit</span></div>
        <CodeSnippet code={code} />
      </div>
      <div className="controls">
        <CtrlHeader id="TerrainMesh" />
        <div className="ctrl-body">
          <Sel label="Preset" value={preset} options={["default", "volcanic", "arctic", "neon", "golden", "minimal"]} onChange={handlePreset} />
          <Divider />
          <ColorPicker label="Wire color" value={wireColor} onChange={setWireColor} />
          <ColorPicker label="Background" value={bg} onChange={setBg} />
          <Slider label="Grid columns" value={gridCols} min={5} max={80} step={5} onChange={setGridCols} />
          <Slider label="Grid rows" value={gridRows} min={5} max={60} step={5} onChange={setGridRows} />
          <Slider label="Noise scale" value={noiseScale} min={0.02} max={0.5} step={0.01} onChange={setNoiseScale} />
          <Slider label="Height scale" value={heightScale} min={10} max={300} step={10} onChange={setHeightScale} />
          <Slider label="FOV" value={fov} min={100} max={1000} step={50} onChange={setFov} />
          <Slider label="Rotate speed" value={autoRotSpeed} min={0} max={0.02} step={0.001} onChange={setAutoRotSpd} />
          <Slider label="Line width" value={lineWidth} min={0.25} max={3} step={0.25} onChange={setLineWidth} />
          <Slider label="Glow blur" value={glowBlur} min={0} max={30} step={1} onChange={setGlowBlur} />
          <Toggle label="Auto-rotate" value={autoRotate} onChange={setAutoRotate} />
          <Toggle label="Color by height" value={colorByH} onChange={setColorByH} />
          <Toggle label="Glow effect" value={glowEffect} onChange={setGlow} />
          <Toggle label="Interactive" value={interactive} onChange={setInteract} />
          <Toggle label="Animated" value={animated} onChange={setAnimated} />
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
  const initial: ComponentId = (paramId && ALL_COMPONENTS.includes(paramId)) ? paramId : ALL_COMPONENTS[0];
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
