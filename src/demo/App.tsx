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
import type { DissolveDirection } from "../components/PixelDissolve";

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
  /* Code block inside preview area — bottom-right overlay */
  .canvas-wrap > .code-block {
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 3;
    margin-top: 0;
    width: 340px;
    max-width: calc(100% - 32px);
    max-height: 200px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    background: rgba(255,255,255,0.98);
    border-color: rgba(255,255,255,0.35);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
  }
  .canvas-wrap > .code-block .code-block-header {
    background: rgba(0,0,0,0.04);
  }
  .canvas-wrap > .code-block .code-pre {
    background: transparent;
  }
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
      flex: none; height: calc(50vh - 51px);
    }
    .canvas-wrap { flex: none; height: calc(50vh - 51px); }
    .tab-row { gap: 1px; padding: 4px 6px; }
    .tab-btn { padding: 5px 10px; font-size: 12px; }
    .header-tag { display: none; }
    .header-badge { display: none; }
  }
  @media (max-width: 480px) {
    .controls { height: 45vh; }
    .canvas-wrap { height: 55vh; }
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
};

type ComponentId =
  | "MatrixRain" | "FluidSimulation" | "FlowField" | "Boids"
  | "GlitchOverlay" | "PixelDissolve" | "Confetti" | "AudioVisualizer" | "Mandala"
  | "Spotlight" | "Starfield" | "NoiseGradient" | "Shockwave"
  | "Fireworks" | "Wormhole" | "ClothSimulation" | "MagneticBlob" | "GameOfLife"
  | "Rain" | "Lightning" | "FireEffect" | "LiveChart" | "ParticleField";

const ALL_COMPONENTS: ComponentId[] = [
  "MatrixRain", "ParticleField", "FluidSimulation", "FlowField", "Boids",
  "GlitchOverlay", "PixelDissolve", "Confetti", "AudioVisualizer", "Mandala",
  "Spotlight", "Starfield", "NoiseGradient", "Shockwave",
  "Fireworks", "Wormhole", "ClothSimulation", "MagneticBlob", "GameOfLife",
  "Rain", "Lightning", "FireEffect", "LiveChart",
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

// ─── Code snippet with syntax highlighting ───────────────────────────────────
function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  function copy() {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  // simple token colorizer for JSX import snippets
  const lines = code.split("\n");
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-title">Usage</span>
        <button className={`code-copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="code-pre">
        {lines.map((line, i) => <ColoredLine key={i} line={line} />)}
      </pre>
    </div>
  );
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

  const code = `import { ParticleField } from 'own-the-canvas';

<ParticleField
  particleCount={${count}}
  particleColor="${pc}"
  lineDistance={${dist}}
  connectParticles={${connect}}
  interactive={${interact}}${wrapEdges ? `\n  wrapEdges={true}` : ""}${twinkle ? `\n  twinkle={true}` : ""}${glowParticles ? `\n  glowParticles={true}` : ""}${lineStyle !== "solid" ? `\n  lineStyle="${lineStyle}"` : ""}${dragParticles ? `\n  dragParticles={true}` : ""}
/>`;

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

  const code = `import { Starfield } from 'own-the-canvas';

<Starfield
  starCount={${count}}
  speed={${speed}}
  perspective="${persp}"
  twinkle={${twinkle}}
  shootingStars={${shooting}}
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Starfield starCount={count} backgroundColor={bg} speed={speed}
            twinkle={twinkle} shootingStars={shooting} perspective={persp}
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
            <Slider label="Star count" value={count} min={50} max={800} step={50} onChange={setCount} />
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
  const [intensity, setIntensity] = useState(0.95);
  const [wind, setWind] = useState(0.3);
  const [spread, setSpread] = useState(0.7);
  const [cooling, setCooling] = useState(0.3);

  const code = `import { FireEffect } from 'own-the-canvas';

<FireEffect
  palette="${palette}"
  intensity={${intensity}}
  windStrength={${wind}}
  spread={${spread}}
  cooling={${cooling}}
/>`;

  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <FireEffect palette={palette} intensity={intensity}
            windStrength={wind} spread={spread} cooling={cooling}
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
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#050010");
  const [barCount, setBarCount] = useState(64);
  const [sensitivity, setSensitivity] = useState(1);
  const [gap, setGap] = useState(2);
  const [rounded, setRounded] = useState(true);
  const [gradient, setGradient] = useState(true);
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

  const code = `import { AudioVisualizer } from 'own-the-canvas';
// const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

<AudioVisualizer
  audioSource={stream}
  mode="${mode}"
  barCount={${barCount}}
  barColor="${color}"
  sensitivity={${sensitivity}}
  gradient={${gradient}}
/>`;

  return (
    <>
      <div className="canvas-wrap" style={{ background: "#030305" }}>
        <div className="canvas-wrap-inner">
          <AudioVisualizer audioSource={stream} mode={mode}
            barColor={color} waveColor={color} barCount={barCount}
            sensitivity={sensitivity} gapBetweenBars={gap}
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
            <ColorPicker label="Color" value={color} onChange={setColor} />
            <ColorPicker label="Background" value={bg} onChange={setBg} />
            <Slider label="Bar count" value={barCount} min={16} max={256} step={8} onChange={setBarCount} />
            <Slider label="Sensitivity" value={sensitivity} min={0.2} max={3} step={0.1} onChange={setSensitivity} />
            <Slider label="Bar gap" value={gap} min={0} max={8} step={1} onChange={setGap} />
          </div>
          <Divider />
          <Toggle label="Rounded bars" value={rounded} onChange={setRounded} />
          <Toggle label="Gradient fill" value={gradient} onChange={setGradient} />
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

  function fire() { setTrigger(false); setTimeout(() => setTrigger(true), 50); }

  const code = `import { Confetti } from 'own-the-canvas';
const [show, setShow] = useState(false);

// rising edge fires a burst
<Confetti
  trigger={show}
  palette="${palette}"
  particleCount={${count}}
  spread={${spread}}
  continuous={${continuous}}
/>`;

  return (
    <>
      <div className="canvas-wrap" style={{ position: "relative" }}>
        <div className="canvas-wrap-inner">
          <Confetti trigger={trigger} palette={palette} particleCount={count} spread={spread}
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
            <Slider label="Particle count" value={count} min={10} max={500} step={10} onChange={setCount} />
            <Slider label="Spread" value={spread} min={0.1} max={1} step={0.05} onChange={setSpread} />
            <Slider label="Gravity" value={gravity} min={0.1} max={2} step={0.1} onChange={setGravity} />
            <Slider label="Wind" value={wind} min={-3} max={3} step={0.1} onChange={setWind} />
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
  const [color, setColor] = useState("#060608");

  function fire() { setTrigger(false); setTimeout(() => setTrigger(true), 50); }

  const code = `import { PixelDissolve } from 'own-the-canvas';

<PixelDissolve
  pixelSize={${pixelSize}}
  speed={${speed}}
  direction="${dir}"
  trigger={show}
>
  <YourContent />
</PixelDissolve>`;

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
            <Slider label="Pixel size" value={pixelSize} min={2} max={32} step={1} onChange={setPixelSize} />
            <Slider label="Speed" value={speed} min={0.1} max={2} step={0.1} onChange={setSpeed} />
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
  const code = `import { FlowField } from 'own-the-canvas';

<FlowField
  preset="${preset}"
  particleCount={${count}}
  speed={${speed}}
  curl={${curl}}
  lineWidth={${lineWidth}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <FlowField preset={preset} particleCount={count} speed={speed} curl={curl} lineWidth={lineWidth} backgroundColor={bg} width="100%" height="100%" />
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
  const [autoFire, setAutoFire] = useState(false);
  const code = `import { Shockwave } from 'own-the-canvas';

<Shockwave
  preset="${preset}"
  ringCount={${ringCount}}
  speed={${speed}}
  color="${color}"
  glowEffect={${glow}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Shockwave preset={preset} ringCount={ringCount} speed={speed} color={color} backgroundColor={bg} glowEffect={glow} autoFire={autoFire} autoInterval={1500} width="100%" height="100%" />
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
  const code = `import { Fireworks } from 'own-the-canvas';

<Fireworks
  preset="${preset}"
  particleCount={${count}}
  gravity={${gravity}}
  autoLaunch={${autoLaunch}}
/>`;
  return (
    <>
      <div className="canvas-wrap">
        <div className="canvas-wrap-inner">
          <Fireworks preset={preset} particleCount={count} gravity={gravity} spread={spread} backgroundColor={bg} autoLaunch={autoLaunch} glowEffect={glow} width="100%" height="100%" />
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
  const [bg, setBg] = useState("#111111");
  const [color, setColor] = useState("#ffffff");
  const [scanlines, setScanlines] = useState(true);
  const [blockGlitch, setBlockGlitch] = useState(true);
  const [noiseOpacity, setNoiseOpacity] = useState(0.02);
  const [flickerRate, setFlickerRate] = useState(0.02);
  const [animated, setAnimated] = useState(true);
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
          <GlitchOverlay preset={preset} intensity={intensity} speed={speed} rgbShift={rgbShift} color={color} scanlines={scanlines} blockGlitch={blockGlitch} noiseOpacity={noiseOpacity} flickerRate={flickerRate} animated={animated} backgroundColor={bg} style={{ position: "absolute", inset: 0 }} />
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
          <LiveChart preset={preset} series={series} smooth={smooth} showGrid={showGrid} showDots={showDots} glowEffect={glow} backgroundColor={bg} width="100%" height="100%" />
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
  const [mirror, setMirror] = useState(true);
  const [glow, setGlow] = useState(true);
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
          <Mandala preset={preset} symmetry={symmetry} layers={layers} speed={speed} mirror={mirror} glowEffect={glow} backgroundColor={bg} width="100%" height="100%" />
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
  const [followMouse, setFollowMouse] = useState(true);
  const [glow, setGlow] = useState(true);
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
          <MagneticBlob preset={preset} count={count} radius={radius} threshold={threshold} followMouse={followMouse} glowEffect={glow} backgroundColor={bg} width="100%" height="100%" />
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
          <ClothSimulation preset={preset} cols={cols} gravity={gravity} wind={wind} tearable={tearable} lineColor={lineColor} backgroundColor={bg} width="100%" height="100%" />
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
  const [resolution, setResolution] = useState(80);
  const [dissipation, setDissipation] = useState(0.995);
  const [autoInk, setAutoInk] = useState(true);
  const [mouseForce, setMouseForce] = useState(5);
  const [bg, setBg] = useState("#111111");
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
          <FluidSimulation preset={preset} resolution={resolution} dissipation={dissipation} autoInk={autoInk} mouseForce={mouseForce} backgroundColor={bg} width="100%" height="100%" />
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
  const [dropColor, setDropColor] = useState("#ffffff");
  const [splashColor, setSplashColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [showSplashes, setShowSplashes] = useState(true);
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
  const [bg, setBg] = useState("#111111");
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
        </div>
      </div>
    </>
  );
}

// ─── Controls header ──────────────────────────────────────────────────────────
function CtrlHeader({ id }: { id: ComponentId }) {
  const meta = COMPONENT_META[id];
  const icon = icons[id];
  return (
    <div className="ctrl-head">
      <div className="ctrl-head-top">
        <div className="ctrl-component-icon" style={{ background: meta.accent + "22", color: meta.accent }}>
          {icon}
        </div>
        <span className="ctrl-name">{id}</span>
      </div>
      <p className="ctrl-desc">{meta.desc}</p>
    </div>
  );
}

// ─── Panel map ────────────────────────────────────────────────────────────────
const PANELS: Record<ComponentId, React.FC> = {
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
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get("component") as ComponentId | null;
  const initial: ComponentId = (paramId && ALL_COMPONENTS.includes(paramId)) ? paramId : "MatrixRain";
  const [active, setActive] = useState<ComponentId>(initial);
  const Panel = PANELS[active];

  function selectComponent(id: ComponentId) {
    setActive(id);
    setSearchParams({ component: id }, { replace: true });
  }

  return (
    <>
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
          <span className="header-tag">25 components</span>
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
    </>
  );
}
