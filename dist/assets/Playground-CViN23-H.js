import{u as G,r as t,j as e,B as R,W as D,G as A,L as E,R as O,F as T,C as I,M as V,a as _,b as W,c as H,d as U,e as Y,S as J,f as K,g as X,h as Q,P as Z,N as q,i as ee,k as te,A as se,l as ae,m as ne,n as oe,o as re}from"./index-B9SmDpOO.js";const ie=`
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
    padding: 14px; overflow-x: auto;
    font-family: var(--mono); font-size: 12px; line-height: 1.7;
    scrollbar-width: thin;
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
`,L={MatrixRain:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"2",y:"2",width:"2",height:"2",rx:"0.5",fill:"currentColor",opacity:".8"}),e.jsx("rect",{x:"7",y:"2",width:"2",height:"2",rx:"0.5",fill:"currentColor",opacity:".5"}),e.jsx("rect",{x:"12",y:"2",width:"2",height:"2",rx:"0.5",fill:"currentColor"}),e.jsx("rect",{x:"2",y:"7",width:"2",height:"2",rx:"0.5",fill:"currentColor",opacity:".4"}),e.jsx("rect",{x:"7",y:"7",width:"2",height:"2",rx:"0.5",fill:"currentColor"}),e.jsx("rect",{x:"12",y:"7",width:"2",height:"2",rx:"0.5",fill:"currentColor",opacity:".6"}),e.jsx("rect",{x:"2",y:"12",width:"2",height:"2",rx:"0.5",fill:"currentColor",opacity:".9"}),e.jsx("rect",{x:"7",y:"12",width:"2",height:"2",rx:"0.5",fill:"currentColor",opacity:".3"}),e.jsx("rect",{x:"12",y:"12",width:"2",height:"2",rx:"0.5",fill:"currentColor",opacity:".7"})]}),ParticleField:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"3",cy:"4",r:"1.5",fill:"currentColor"}),e.jsx("circle",{cx:"13",cy:"3",r:"1",fill:"currentColor",opacity:".7"}),e.jsx("circle",{cx:"8",cy:"8",r:"1.5",fill:"currentColor"}),e.jsx("circle",{cx:"13",cy:"12",r:"1.5",fill:"currentColor",opacity:".8"}),e.jsx("circle",{cx:"3",cy:"12",r:"1",fill:"currentColor",opacity:".6"}),e.jsx("line",{x1:"3",y1:"4",x2:"8",y2:"8",stroke:"currentColor",strokeWidth:"0.8",opacity:".4"}),e.jsx("line",{x1:"13",y1:"3",x2:"8",y2:"8",stroke:"currentColor",strokeWidth:"0.8",opacity:".4"}),e.jsx("line",{x1:"8",y1:"8",x2:"13",y2:"12",stroke:"currentColor",strokeWidth:"0.8",opacity:".4"})]}),Starfield:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M8 1l1.5 4.5H14l-3.8 2.8 1.5 4.7L8 10.3 4.3 13l1.5-4.7L2 5.5h4.5z",fill:"currentColor"})}),FireEffect:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("path",{d:"M8 2c0 2-3 3-3 6a3 3 0 006 0c0-1-.5-1.5-1-2 0 1-.5 1.5-1 1.5C8.5 6 10 4.5 8 2z",fill:"currentColor"}),e.jsx("path",{d:"M6 9c0 1.1.9 2 2 2s2-.9 2-2c0-.5-.2-1-.5-1.3C9.3 8.7 9 9.3 9 10c-.3-.3-.5-.9-.5-1.5C7.5 8.7 7 8 7 8c-.6.2-1 .6-1 1z",fill:"currentColor",opacity:".6"})]}),AudioVisualizer:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"1",y:"8",width:"2",height:"6",rx:"1",fill:"currentColor",opacity:".5"}),e.jsx("rect",{x:"4.5",y:"5",width:"2",height:"9",rx:"1",fill:"currentColor",opacity:".7"}),e.jsx("rect",{x:"8",y:"2",width:"2",height:"12",rx:"1",fill:"currentColor"}),e.jsx("rect",{x:"11.5",y:"5",width:"2",height:"9",rx:"1",fill:"currentColor",opacity:".7"})]}),Confetti:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"2",y:"6",width:"3",height:"2",rx:"0.5",fill:"currentColor",transform:"rotate(-30 2 6)"}),e.jsx("rect",{x:"7",y:"2",width:"2",height:"3",rx:"0.5",fill:"currentColor",opacity:".8"}),e.jsx("rect",{x:"11",y:"4",width:"3",height:"2",rx:"0.5",fill:"currentColor",opacity:".6",transform:"rotate(20 11 4)"}),e.jsx("circle",{cx:"5",cy:"12",r:"1.5",fill:"currentColor",opacity:".7"}),e.jsx("circle",{cx:"13",cy:"10",r:"1",fill:"currentColor",opacity:".5"}),e.jsx("rect",{x:"8",y:"10",width:"2",height:"3",rx:"0.5",fill:"currentColor",opacity:".6",transform:"rotate(15 8 10)"})]}),RippleEffect:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"8",cy:"8",r:"2",stroke:"currentColor",strokeWidth:"1.5"}),e.jsx("circle",{cx:"8",cy:"8",r:"4.5",stroke:"currentColor",strokeWidth:"1",opacity:".5"}),e.jsx("circle",{cx:"8",cy:"8",r:"7",stroke:"currentColor",strokeWidth:"0.75",opacity:".25"})]}),NoiseGradient:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"1",y:"1",width:"14",height:"14",rx:"3",fill:"url(#ng-grad)"}),e.jsx("defs",{children:e.jsxs("linearGradient",{id:"ng-grad",x1:"0",y1:"0",x2:"1",y2:"1",gradientUnits:"objectBoundingBox",children:[e.jsx("stop",{stopColor:"#374151"}),e.jsx("stop",{offset:".5",stopColor:"#6b7280"}),e.jsx("stop",{offset:"1",stopColor:"#9ca3af"})]})})]}),PixelDissolve:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"1",y:"1",width:"3",height:"3",rx:"0.5",fill:"currentColor"}),e.jsx("rect",{x:"5.5",y:"1",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".6"}),e.jsx("rect",{x:"10",y:"1",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".2"}),e.jsx("rect",{x:"1",y:"5.5",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".8"}),e.jsx("rect",{x:"5.5",y:"5.5",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".4"}),e.jsx("rect",{x:"1",y:"10",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".3"}),e.jsx("rect",{x:"10",y:"10",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".1"})]}),ConstellationMap:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"3",cy:"3",r:"1.5",fill:"currentColor"}),e.jsx("circle",{cx:"13",cy:"4",r:"1.5",fill:"currentColor"}),e.jsx("circle",{cx:"8",cy:"9",r:"1.5",fill:"currentColor"}),e.jsx("circle",{cx:"4",cy:"13",r:"1.5",fill:"currentColor",opacity:".7"}),e.jsx("circle",{cx:"13",cy:"13",r:"1",fill:"currentColor",opacity:".6"}),e.jsx("line",{x1:"3",y1:"3",x2:"13",y2:"4",stroke:"currentColor",strokeWidth:"0.75",opacity:".35"}),e.jsx("line",{x1:"13",y1:"4",x2:"8",y2:"9",stroke:"currentColor",strokeWidth:"0.75",opacity:".35"}),e.jsx("line",{x1:"3",y1:"3",x2:"8",y2:"9",stroke:"currentColor",strokeWidth:"0.75",opacity:".35"}),e.jsx("line",{x1:"8",y1:"9",x2:"4",y2:"13",stroke:"currentColor",strokeWidth:"0.75",opacity:".35"}),e.jsx("line",{x1:"8",y1:"9",x2:"13",y2:"13",stroke:"currentColor",strokeWidth:"0.75",opacity:".35"})]}),FlowField:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("path",{d:"M2 8c2-3 4-3 6 0s4 3 6 0",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",fill:"none"}),e.jsx("path",{d:"M2 11c2-3 4-3 6 0s4 3 6 0",stroke:"currentColor",strokeWidth:"0.8",strokeLinecap:"round",fill:"none",opacity:".5"}),e.jsx("path",{d:"M2 5c2-3 4-3 6 0s4 3 6 0",stroke:"currentColor",strokeWidth:"0.8",strokeLinecap:"round",fill:"none",opacity:".5"})]}),Spotlight:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"8",cy:"8",r:"3",fill:"currentColor",opacity:".9"}),e.jsx("circle",{cx:"8",cy:"8",r:"5.5",stroke:"currentColor",strokeWidth:"1",opacity:".3"}),e.jsx("circle",{cx:"8",cy:"8",r:"7.5",stroke:"currentColor",strokeWidth:"0.5",opacity:".1"})]}),Shockwave:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"8",cy:"8",r:"2",stroke:"currentColor",strokeWidth:"1.5"}),e.jsx("circle",{cx:"8",cy:"8",r:"4.5",stroke:"currentColor",strokeWidth:"1",opacity:".6"}),e.jsx("circle",{cx:"8",cy:"8",r:"7",stroke:"currentColor",strokeWidth:"0.75",opacity:".3"})]}),Fireworks:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"8",cy:"5",r:"1.5",fill:"currentColor"}),e.jsx("line",{x1:"8",y1:"3",x2:"8",y2:"1",stroke:"currentColor",strokeWidth:"1",opacity:".8"}),e.jsx("line",{x1:"8",y1:"3",x2:"10.5",y2:"1",stroke:"currentColor",strokeWidth:"1",opacity:".6"}),e.jsx("line",{x1:"8",y1:"3",x2:"5.5",y2:"1",stroke:"currentColor",strokeWidth:"1",opacity:".6"}),e.jsx("line",{x1:"8",y1:"3",x2:"11",y2:"3.5",stroke:"currentColor",strokeWidth:"1",opacity:".5"}),e.jsx("line",{x1:"8",y1:"3",x2:"5",y2:"3.5",stroke:"currentColor",strokeWidth:"1",opacity:".5"}),e.jsx("line",{x1:"8",y1:"3",x2:"10",y2:"5.5",stroke:"currentColor",strokeWidth:"1",opacity:".4"}),e.jsx("line",{x1:"8",y1:"3",x2:"6",y2:"5.5",stroke:"currentColor",strokeWidth:"1",opacity:".4"}),e.jsx("circle",{cx:"4",cy:"12",r:"1",fill:"currentColor",opacity:".6"}),e.jsx("circle",{cx:"12",cy:"11",r:"1",fill:"currentColor",opacity:".5"})]}),GlitchOverlay:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"1",y:"3",width:"14",height:"2",rx:"0.5",fill:"currentColor",opacity:".8"}),e.jsx("rect",{x:"1",y:"7",width:"10",height:"2",rx:"0.5",fill:"currentColor",opacity:".5",transform:"translate(2 0)"}),e.jsx("rect",{x:"1",y:"11",width:"14",height:"2",rx:"0.5",fill:"currentColor",opacity:".7"}),e.jsx("rect",{x:"3",y:"5",width:"6",height:"1",fill:"currentColor",opacity:".3"}),e.jsx("rect",{x:"8",y:"9",width:"5",height:"1",fill:"currentColor",opacity:".3"})]}),LiveChart:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("polyline",{points:"1,13 4,8 7,10 10,5 13,7 15,3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",fill:"none"}),e.jsx("line",{x1:"1",y1:"14",x2:"15",y2:"14",stroke:"currentColor",strokeWidth:"0.75",opacity:".3"})]}),Mandala:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"8",cy:"8",r:"6",stroke:"currentColor",strokeWidth:"0.75",opacity:".4"}),e.jsx("circle",{cx:"8",cy:"8",r:"3.5",stroke:"currentColor",strokeWidth:"1",opacity:".7"}),e.jsx("circle",{cx:"8",cy:"8",r:"1.5",fill:"currentColor",opacity:".9"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"14",stroke:"currentColor",strokeWidth:"0.5",opacity:".3"}),e.jsx("line",{x1:"2",y1:"8",x2:"14",y2:"8",stroke:"currentColor",strokeWidth:"0.5",opacity:".3"}),e.jsx("line",{x1:"3.5",y1:"3.5",x2:"12.5",y2:"12.5",stroke:"currentColor",strokeWidth:"0.5",opacity:".3"}),e.jsx("line",{x1:"12.5",y1:"3.5",x2:"3.5",y2:"12.5",stroke:"currentColor",strokeWidth:"0.5",opacity:".3"})]}),MagneticBlob:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("circle",{cx:"6",cy:"7",r:"3.5",fill:"currentColor",opacity:".7"}),e.jsx("circle",{cx:"10.5",cy:"9",r:"3",fill:"currentColor",opacity:".6"}),e.jsx("circle",{cx:"8",cy:"6",r:"2",fill:"currentColor",opacity:".5"})]}),ClothSimulation:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("line",{x1:"2",y1:"3",x2:"7",y2:"3",stroke:"currentColor",strokeWidth:"1",opacity:".8"}),e.jsx("line",{x1:"9",y1:"3",x2:"14",y2:"3",stroke:"currentColor",strokeWidth:"1",opacity:".8"}),e.jsx("path",{d:"M2 3 C3 7, 4 9, 4 13",stroke:"currentColor",strokeWidth:"0.75",fill:"none",opacity:".6"}),e.jsx("path",{d:"M7 3 C7.5 7, 8 9, 8 13",stroke:"currentColor",strokeWidth:"0.75",fill:"none",opacity:".6"}),e.jsx("path",{d:"M14 3 C13 7, 12 9, 12 13",stroke:"currentColor",strokeWidth:"0.75",fill:"none",opacity:".6"}),e.jsx("path",{d:"M2 7 C5 7.5, 11 7.5, 14 7",stroke:"currentColor",strokeWidth:"0.75",fill:"none",opacity:".4"})]}),FluidSimulation:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("path",{d:"M2 10 C4 6, 6 12, 8 8 S12 4, 14 8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none",opacity:".8"}),e.jsx("path",{d:"M2 13 C5 9, 7 14, 10 11 S13 8, 14 11",stroke:"currentColor",strokeWidth:"1",strokeLinecap:"round",fill:"none",opacity:".4"})]}),Rain:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("line",{x1:"4",y1:"2",x2:"3",y2:"8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",opacity:".9"}),e.jsx("line",{x1:"8",y1:"1",x2:"7",y2:"9",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",opacity:".6"}),e.jsx("line",{x1:"12",y1:"2",x2:"11",y2:"8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",opacity:".8"}),e.jsx("line",{x1:"6",y1:"5",x2:"5",y2:"13",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",opacity:".4"}),e.jsx("line",{x1:"10",y1:"4",x2:"9",y2:"14",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",opacity:".7"})]}),Lightning:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M10 2L5 9h5l-4 5 9-8H9z",fill:"currentColor",opacity:".9"})}),GameOfLife:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"2",y:"2",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".9"}),e.jsx("rect",{x:"6",y:"2",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".4"}),e.jsx("rect",{x:"11",y:"2",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".8"}),e.jsx("rect",{x:"2",y:"6",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".3"}),e.jsx("rect",{x:"6",y:"6",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".9"}),e.jsx("rect",{x:"11",y:"6",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".5"}),e.jsx("rect",{x:"2",y:"11",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".7"}),e.jsx("rect",{x:"6",y:"11",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".2"}),e.jsx("rect",{x:"11",y:"11",width:"3",height:"3",rx:"0.5",fill:"currentColor",opacity:".9"})]}),Wormhole:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("ellipse",{cx:"8",cy:"8",rx:"6",ry:"6",stroke:"currentColor",strokeWidth:"1",opacity:".8",fill:"none"}),e.jsx("ellipse",{cx:"8",cy:"8",rx:"4",ry:"3.5",stroke:"currentColor",strokeWidth:"0.9",opacity:".6",fill:"none"}),e.jsx("ellipse",{cx:"8",cy:"8",rx:"2",ry:"1.8",stroke:"currentColor",strokeWidth:"0.8",opacity:".4",fill:"none"}),e.jsx("circle",{cx:"8",cy:"8",r:"0.8",fill:"currentColor",opacity:".9"})]}),Boids:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("polygon",{points:"4,3 7,7 4,6",fill:"currentColor",opacity:".9"}),e.jsx("polygon",{points:"9,5 12,9 9,8",fill:"currentColor",opacity:".7"}),e.jsx("polygon",{points:"6,9 9,13 6,12",fill:"currentColor",opacity:".8"}),e.jsx("polygon",{points:"11,2 14,5 11,4.5",fill:"currentColor",opacity:".5"})]})},B={MatrixRain:{desc:"Falling character rain — Katakana, Latin, or binary",accent:"#00ff41"},ParticleField:{desc:"Floating particles with interactive connections",accent:"#9ca3af"},Starfield:{desc:"2D twinkle or 3D warp-speed star tunnel",accent:"#b8bfff"},FireEffect:{desc:"Pixel-level fire simulation with 4 palettes",accent:"#ff6b35"},AudioVisualizer:{desc:"Real-time Web Audio API visualizer, 4 modes",accent:"#9ca3af"},Confetti:{desc:"Physics-based celebration burst or continuous rain",accent:"#ffd700"},RippleEffect:{desc:"Expanding ring animations from click or auto",accent:"#9ca3af"},NoiseGradient:{desc:"Animated Perlin noise color gradient",accent:"#38ef7d"},PixelDissolve:{desc:"Pixelated dissolve transition overlay for any content",accent:"#bf5fff"},ConstellationMap:{desc:"Draggable star map with dynamic constellation lines",accent:"#8888ff"},FlowField:{desc:"Perlin noise vector field with particle streams",accent:"#9ca3af"},Spotlight:{desc:"Mouse-following light reveal over dark overlay",accent:"#e0b0ff"},Shockwave:{desc:"Click-triggered radial ring blast with glow",accent:"#9ca3af"},Fireworks:{desc:"Physics shells, burst particles, and gravity trails",accent:"#f59e0b"},GlitchOverlay:{desc:"CRT scanlines, RGB shift, and block glitch",accent:"#00ffff"},LiveChart:{desc:"Real-time animated line and area chart",accent:"#4ade80"},Mandala:{desc:"N-fold rotational symmetry with organic petal layers",accent:"#f43f5e"},MagneticBlob:{desc:"Metaballs that merge and follow the cursor",accent:"#a78bfa"},ClothSimulation:{desc:"Verlet spring-mass fabric with wind and tearing",accent:"#67e8f9"},FluidSimulation:{desc:"Navier-Stokes ink fluid reacting to mouse movement",accent:"#06b6d4"},Rain:{desc:"Rainfall with wind drift, drop streaks, and splash particles",accent:"#9ca3af"},Lightning:{desc:"Recursive fractal bolts with glow, flicker, and branches",accent:"#c084fc"},GameOfLife:{desc:"Conway's cellular automata — emergent life from simple rules",accent:"#00ff41"},Wormhole:{desc:"3D perspective tunnel with twisting rings and star field",accent:"#9ca3af"},Boids:{desc:"Craig Reynolds' flocking — separation, alignment, cohesion",accent:"#f59e0b"}},F=["MatrixRain","ConstellationMap","FluidSimulation","FlowField","Boids","GlitchOverlay","PixelDissolve","Confetti","AudioVisualizer","Mandala","Spotlight","Starfield","NoiseGradient","RippleEffect","Shockwave","Fireworks","Wormhole","ClothSimulation","MagneticBlob","GameOfLife","Rain","Lightning","FireEffect","LiveChart","ParticleField"];function c({label:n,value:l,min:s,max:i,step:a,onChange:x}){const r=Number.isInteger(a)?l.toFixed(0):l.toFixed(2).replace(/\.?0+$/,"");return e.jsxs("div",{className:"ctl-row",children:[e.jsxs("div",{className:"ctl-label",children:[e.jsx("span",{children:n}),e.jsx("span",{className:"ctl-value",children:r})]}),e.jsx("input",{type:"range",min:s,max:i,step:a,value:l,onChange:p=>x(+p.target.value)})]})}function w({label:n,value:l,onChange:s}){return e.jsxs("div",{className:"ctl-row",children:[e.jsx("div",{className:"ctl-label",children:e.jsx("span",{children:n})}),e.jsxs("div",{className:"ctl-color-wrap",children:[e.jsx("div",{className:"ctl-color-btn",style:{backgroundColor:l+"22"},children:e.jsx("input",{type:"color",value:l,onChange:i=>s(i.target.value),title:n})}),e.jsx("div",{className:"ctl-color-hex",children:l.toUpperCase()})]})]})}function m({label:n,value:l,onChange:s}){return e.jsxs("div",{className:"ctl-toggle-row",children:[e.jsx("span",{className:"ctl-toggle-label",children:n}),e.jsx("button",{className:`toggle-track ${l?"on":"off"}`,onClick:()=>s(!l),role:"switch","aria-checked":l,"aria-label":n,children:e.jsx("div",{className:"toggle-thumb"})})]})}function b({label:n,value:l,options:s,onChange:i}){return e.jsxs("div",{className:"ctl-row",children:[e.jsx("div",{className:"ctl-label",children:e.jsx("span",{children:n})}),e.jsx("select",{className:"ctl-select",value:l,onChange:a=>i(a.target.value),children:s.map(a=>e.jsx("option",{value:a,children:a},a))})]})}function h(){return e.jsx("div",{className:"ctl-divider"})}function f({code:n}){const[l,s]=W.useState(!1);function i(){navigator.clipboard.writeText(n).catch(()=>{}),s(!0),setTimeout(()=>s(!1),2e3)}const a=n.split(`
`);return e.jsxs("div",{className:"code-block",children:[e.jsxs("div",{className:"code-block-header",children:[e.jsx("span",{className:"code-block-title",children:"Usage"}),e.jsx("button",{className:`code-copy-btn ${l?"copied":""}`,onClick:i,children:l?"Copied!":"Copy"})]}),e.jsx("pre",{className:"code-pre",children:a.map((x,r)=>e.jsx(le,{line:x},r))})]})}function le({line:n}){if(n.startsWith("import")){const s=n.split(/(\{[^}]+\}|'[^']+'|from)/g);return e.jsx("div",{children:s.map((i,a)=>i==="from"?e.jsx("span",{className:"tok-kw",children:"from"},a):i.startsWith("'")?e.jsx("span",{className:"tok-str",children:i},a):i.startsWith("{")?e.jsx("span",{className:"tok-fn",children:i},a):e.jsx("span",{className:"tok-dim",children:i},a))})}if(n.trim()==="")return e.jsx("div",{children:" "});if(n.includes("//")){const[s,...i]=n.split("//");return e.jsxs("div",{children:[e.jsx("span",{className:"tok-dim",children:s}),e.jsxs("span",{className:"tok-cmt",children:["//",i.join("//")]})]})}const l=n.split(/(<\/?[\w]+|\/?>|[\w]+=\{|[\w]+="[^"]*"|\{[^}]+\}|"[^"]*")/g);return e.jsx("div",{children:l.map((s,i)=>{if(s.startsWith("</")||s.startsWith("<"))return e.jsx("span",{className:"tok-tag",children:s},i);if(s==="/>"||s===">")return e.jsx("span",{className:"tok-tag",children:s},i);if(s.endsWith("={")){const a=s.slice(0,-2);return e.jsxs("span",{children:[e.jsx("span",{className:"tok-attr",children:a}),e.jsx("span",{className:"tok-dim",children:"={"})]},i)}if(s.includes('="')){const[a,...x]=s.split('="');return e.jsxs("span",{children:[e.jsx("span",{className:"tok-attr",children:a}),e.jsx("span",{className:"tok-dim",children:'="'}),e.jsx("span",{className:"tok-val",children:x.join('="')})]},i)}return s.startsWith("{")&&s.endsWith("}")?e.jsx("span",{className:"tok-val",children:s},i):s.startsWith('"')?e.jsx("span",{className:"tok-str",children:s},i):e.jsx("span",{className:"tok-dim",children:s},i)})})}function ce(){const[n,l]=t.useState("#fff"),[s,i]=t.useState(14),[a,x]=t.useState(33),[r,p]=t.useState("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),[o,u]=t.useState(.95),d=`import { MatrixRain } from 'own-the-canvas';

<MatrixRain
  color="${n}"
  fontSize={${s}}
  speed={${a}}
  charset="${r}"
  resetThreshold={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(re,{color:n,fontSize:s,speed:a,charset:r,resetThreshold:o,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Live preview"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"MatrixRain"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsxs("div",{className:"ctl-section",children:[e.jsx(w,{label:"Color",value:n,onChange:l}),e.jsx(c,{label:"Font size",value:s,min:8,max:36,step:1,onChange:i}),e.jsx(c,{label:"Speed (ms/frame)",value:a,min:10,max:200,step:1,onChange:x}),e.jsx(c,{label:"Reset threshold",value:o,min:.5,max:.99,step:.01,onChange:u})]}),e.jsx(h,{}),e.jsxs("div",{className:"ctrl-row",children:[e.jsx("label",{className:"ctrl-label",children:"Characters"}),e.jsx("input",{className:"ctrl-text-input",value:r,onChange:v=>v.target.value.length>0&&p(v.target.value),spellCheck:!1})]}),e.jsx(h,{}),e.jsx(f,{code:d})]})]})]})}function de(){const[n,l]=t.useState("#ffffff"),[s,i]=t.useState("#6b7280"),[a,x]=t.useState(120),[r,p]=t.useState(120),[o,u]=t.useState(2.5),[d,v]=t.useState(.8),[g,C]=t.useState(!0),[y,k]=t.useState(!0),S=`import { ParticleField } from 'own-the-canvas';

<ParticleField
  particleCount={${a}}
  particleColor="${n}"
  lineDistance={${r}}
  connectParticles={${g}}
  interactive={${y}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(oe,{particleColor:n,lineColor:s,particleCount:a,lineDistance:r,particleSize:o,speed:d,connectParticles:g,interactive:y,backgroundColor:"transparent",width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Move cursor to repel"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"ParticleField"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsxs("div",{className:"ctl-section",children:[e.jsx(w,{label:"Particle color",value:n,onChange:l}),e.jsx(w,{label:"Line color",value:s,onChange:i}),e.jsx(c,{label:"Count",value:a,min:20,max:400,step:10,onChange:x}),e.jsx(c,{label:"Line distance",value:r,min:40,max:250,step:5,onChange:p}),e.jsx(c,{label:"Particle size",value:o,min:.5,max:8,step:.5,onChange:u}),e.jsx(c,{label:"Speed",value:d,min:.1,max:5,step:.1,onChange:v})]}),e.jsx(h,{}),e.jsx(m,{label:"Connect particles",value:g,onChange:C}),e.jsx(m,{label:"Mouse repulsion",value:y,onChange:k}),e.jsx(h,{}),e.jsx(f,{code:S})]})]})]})}function xe(){const[n,l]=t.useState(200),[s,i]=t.useState(.5),[a,x]=t.useState("#111111"),[r,p]=t.useState(!0),[o,u]=t.useState(!0),[d,v]=t.useState("2D"),g=`import { Starfield } from 'own-the-canvas';

<Starfield
  starCount={${n}}
  speed={${s}}
  perspective="${d}"
  twinkle={${r}}
  shootingStars={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(ne,{starCount:n,backgroundColor:a,speed:s,twinkle:r,shootingStars:o,perspective:d,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Live preview"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Starfield"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Perspective",value:d,options:["2D","3D"],onChange:v}),e.jsx(h,{}),e.jsxs("div",{className:"ctl-section",children:[e.jsx(w,{label:"Background",value:a,onChange:x}),e.jsx(c,{label:"Star count",value:n,min:50,max:800,step:50,onChange:l}),e.jsx(c,{label:"Speed",value:s,min:.1,max:8,step:.1,onChange:i})]}),e.jsx(h,{}),e.jsx(m,{label:"Twinkle",value:r,onChange:p}),e.jsx(m,{label:"Shooting stars",value:o,onChange:u}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function he(){const[n,l]=t.useState("smoke"),[s,i]=t.useState(.95),[a,x]=t.useState(.3),[r,p]=t.useState(.7),[o,u]=t.useState(.3),d=`import { FireEffect } from 'own-the-canvas';

<FireEffect
  palette="${n}"
  intensity={${s}}
  windStrength={${a}}
  spread={${r}}
  cooling={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(ae,{palette:n,intensity:s,windStrength:a,spread:r,cooling:o,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Pixel simulation"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"FireEffect"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Palette",value:n,options:["smoke","inferno","toxic","ice","plasma"],onChange:l}),e.jsx(h,{}),e.jsxs("div",{className:"ctl-section",children:[e.jsx(c,{label:"Intensity",value:s,min:.1,max:1,step:.05,onChange:i}),e.jsx(c,{label:"Wind strength",value:a,min:0,max:1,step:.05,onChange:x}),e.jsx(c,{label:"Spread",value:r,min:0,max:1,step:.05,onChange:p}),e.jsx(c,{label:"Cooling",value:o,min:.05,max:.8,step:.05,onChange:u})]}),e.jsx(h,{}),e.jsx(f,{code:d})]})]})]})}function pe(){const[n,l]=t.useState("bars"),[s,i]=t.useState("#ffffff"),[a,x]=t.useState(64),[r,p]=t.useState(1),[o,u]=t.useState(2),[d,v]=t.useState(!0),[g,C]=t.useState(!0),[y,k]=t.useState(null),[S,N]=t.useState(!1);async function $(){if(S)y==null||y.getTracks().forEach(P=>P.stop()),k(null),N(!1);else try{const P=await navigator.mediaDevices.getUserMedia({audio:!0});k(P),N(!0)}catch{alert("Mic access denied")}}const z=`import { AudioVisualizer } from 'own-the-canvas';
// const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

<AudioVisualizer
  audioSource={stream}
  mode="${n}"
  barCount={${a}}
  barColor="${s}"
  sensitivity={${r}}
  gradient={${g}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",style:{background:"#030305"},children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(se,{audioSource:y,mode:n,barColor:s,waveColor:s,barCount:a,sensitivity:r,gapBetweenBars:o,rounded:d,gradient:g,width:"100%",height:"100%"})}),e.jsx("div",{className:"canvas-label",children:S?e.jsxs("span",{className:"mic-badge",children:[e.jsx("span",{className:"mic-dot"}),"Microphone active"]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Idle animation — start mic to visualize"})]})})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"AudioVisualizer"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx("button",{className:`ctl-action-btn ${S?"secondary":"primary"}`,onClick:$,children:S?"Stop microphone":"Start microphone"}),e.jsx(b,{label:"Mode",value:n,options:["bars","wave","circular","mirror"],onChange:l}),e.jsx(h,{}),e.jsxs("div",{className:"ctl-section",children:[e.jsx(w,{label:"Color",value:s,onChange:i}),e.jsx(c,{label:"Bar count",value:a,min:16,max:256,step:8,onChange:x}),e.jsx(c,{label:"Sensitivity",value:r,min:.2,max:3,step:.1,onChange:p}),e.jsx(c,{label:"Bar gap",value:o,min:0,max:8,step:1,onChange:u})]}),e.jsx(h,{}),e.jsx(m,{label:"Rounded bars",value:d,onChange:v}),e.jsx(m,{label:"Gradient fill",value:g,onChange:C}),e.jsx(h,{}),e.jsx(f,{code:z})]})]})]})}function ue(){const[n,l]=t.useState(!1),[s,i]=t.useState("monochrome"),[a,x]=t.useState(150),[r,p]=t.useState(.8),[o,u]=t.useState(.5),[d,v]=t.useState(!1),[g,C]=t.useState(.5);function y(){l(!1),setTimeout(()=>l(!0),50)}const k=`import { Confetti } from 'own-the-canvas';
const [show, setShow] = useState(false);

// rising edge fires a burst
<Confetti
  trigger={show}
  palette="${s}"
  particleCount={${a}}
  spread={${r}}
  continuous={${d}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",style:{position:"relative"},children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(te,{trigger:n,palette:s,particleCount:a,spread:r,gravity:o,continuous:d,wind:g,width:"100%",height:"100%"})}),e.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:3},children:e.jsx("button",{className:"ctl-action-btn primary",style:{pointerEvents:"all",fontSize:15,padding:"12px 28px"},onClick:y,children:"Launch confetti"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Click button to burst"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Confetti"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx("button",{className:"ctl-action-btn primary",onClick:y,children:"Fire burst"}),e.jsx(h,{}),e.jsx(b,{label:"Palette",value:s,options:["monochrome","colorful"],onChange:i}),e.jsx(h,{}),e.jsxs("div",{className:"ctl-section",children:[e.jsx(c,{label:"Particle count",value:a,min:10,max:500,step:10,onChange:x}),e.jsx(c,{label:"Spread",value:r,min:.1,max:1,step:.05,onChange:p}),e.jsx(c,{label:"Gravity",value:o,min:.1,max:2,step:.1,onChange:u}),e.jsx(c,{label:"Wind",value:g,min:-3,max:3,step:.1,onChange:C})]}),e.jsx(h,{}),e.jsx(m,{label:"Continuous rain",value:d,onChange:v}),e.jsx(h,{}),e.jsx(f,{code:k})]})]})]})}function ge(){const[n,l]=t.useState("#ffffff"),[s,i]=t.useState(150),[a,x]=t.useState(2),[r,p]=t.useState(1.5),[o,u]=t.useState(.8),[d,v]=t.useState(!0),[g,C]=t.useState(!0),y=`import { RippleEffect } from 'own-the-canvas';

<RippleEffect
  color="${n}"
  maxRadius={${s}}
  speed={${a}}
  interactive={${g}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",style:{background:"#04040a"},children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(ee,{color:n,maxRadius:s,speed:a,lineWidth:r,decay:o,multiRipple:d,backgroundColor:"transparent",interactive:g,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:g?"Click canvas to ripple":"Auto-ripple mode"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"RippleEffect"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsxs("div",{className:"ctl-section",children:[e.jsx(w,{label:"Color",value:n,onChange:l}),e.jsx(c,{label:"Max radius",value:s,min:30,max:400,step:10,onChange:i}),e.jsx(c,{label:"Speed",value:a,min:.5,max:10,step:.5,onChange:x}),e.jsx(c,{label:"Line width",value:r,min:.5,max:5,step:.5,onChange:p}),e.jsx(c,{label:"Decay rate",value:o,min:.1,max:2,step:.1,onChange:u})]}),e.jsx(h,{}),e.jsx(m,{label:"Multi ripple",value:d,onChange:v}),e.jsx(m,{label:"Click to ripple",value:g,onChange:C}),e.jsx(h,{}),e.jsx(f,{code:y})]})]})]})}const M={Monochrome:["#0a0a0a","#2d2d2d","#6b7280","#d1d5db","#f5f5f5"],"Deep Space":["#0d0221","#2d1b69","#11998e","#38ef7d"],Sunset:["#0f0c29","#ff6b6b","#ffd89b"],Ocean:["#0052d4","#4364f7","#6fb1fc"],Plasma:["#12002f","#7b00d4","#ff00ff","#ff9900"],Forest:["#0a1628","#1a5276","#27ae60","#f9e51b"]};function ve(){const[n,l]=t.useState("Monochrome"),[s,i]=t.useState(.3),[a,x]=t.useState(1),[r,p]=t.useState(3),[o,u]=t.useState(!0),d=M[n],v=`import { NoiseGradient } from 'own-the-canvas';

<NoiseGradient
  colors={${JSON.stringify(d)}}
  speed={${s}}
  scale={${a}}
  octaves={${r}}
  animated={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(q,{colors:d,speed:s,scale:a,octaves:r,animated:o,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Perlin noise — pure JS"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"NoiseGradient"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset palette",value:n,options:Object.keys(M),onChange:l}),e.jsx(h,{}),e.jsxs("div",{className:"ctl-section",children:[e.jsx(c,{label:"Speed",value:s,min:0,max:2,step:.05,onChange:i}),e.jsx(c,{label:"Scale",value:a,min:.2,max:5,step:.1,onChange:x}),e.jsx(c,{label:"Octaves",value:r,min:1,max:6,step:1,onChange:p})]}),e.jsx(h,{}),e.jsx(m,{label:"Animated",value:o,onChange:u}),e.jsx(h,{}),e.jsx(f,{code:v})]})]})]})}function me(){const[n,l]=t.useState(8),[s,i]=t.useState(.5),[a,x]=t.useState("out"),[r,p]=t.useState(!1),[o,u]=t.useState("#060608");function d(){p(!1),setTimeout(()=>p(!0),50)}const v=`import { PixelDissolve } from 'own-the-canvas';

<PixelDissolve
  pixelSize={${n}}
  speed={${s}}
  direction="${a}"
  trigger={show}
>
  <YourContent />
</PixelDissolve>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",style:{display:"flex",alignItems:"center",justifyContent:"center",background:"#030308"},children:[e.jsx(Z,{pixelSize:n,speed:s,direction:a,trigger:r,color:o,width:440,height:280,children:e.jsxs("div",{style:{width:"100%",height:"100%",background:"linear-gradient(135deg,#374151 0%,#6b7280 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#fff",gap:10},children:[e.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 32 32",fill:"none",children:[e.jsx("rect",{x:"2",y:"2",width:"28",height:"28",rx:"6",fill:"white",fillOpacity:".15",stroke:"white",strokeOpacity:".3",strokeWidth:"1.5"}),e.jsx("rect",{x:"8",y:"12",width:"4",height:"8",rx:"1",fill:"white"}),e.jsx("rect",{x:"14",y:"8",width:"4",height:"12",rx:"1",fill:"white",fillOpacity:".7"}),e.jsx("rect",{x:"20",y:"15",width:"4",height:"5",rx:"1",fill:"white",fillOpacity:".5"})]}),e.jsx("span",{style:{fontSize:20,fontWeight:600,letterSpacing:3,fontFamily:"inherit"},children:"DISSOLVE"}),e.jsx("span",{style:{fontSize:12,opacity:.5,fontFamily:"inherit"},children:"own-the-canvas"})]})}),e.jsxs("div",{className:"canvas-label",style:{zIndex:4},children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:'Click "Trigger" in controls'})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"PixelDissolve"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx("button",{className:"ctl-action-btn primary",onClick:d,children:"Trigger dissolve"}),e.jsx(h,{}),e.jsx(b,{label:"Direction",value:a,options:["out","in","both"],onChange:x}),e.jsxs("div",{className:"ctl-section",children:[e.jsx(w,{label:"Pixel color",value:o,onChange:u}),e.jsx(c,{label:"Pixel size",value:n,min:2,max:32,step:1,onChange:l}),e.jsx(c,{label:"Speed",value:s,min:.1,max:2,step:.1,onChange:i})]}),e.jsx(h,{}),e.jsx(f,{code:v})]})]})]})}function fe(){const[n,l]=t.useState(80),[s,i]=t.useState("#ffffff"),[a,x]=t.useState("#8888ff"),[r,p]=t.useState("#050510"),[o,u]=t.useState(.3),[d,v]=t.useState(!0),[g,C]=t.useState("solid"),[y,k]=t.useState(!0),[S,N]=t.useState(100),$=`import { ConstellationMap } from 'own-the-canvas';

<ConstellationMap
  starCount={${n}}
  lineColor="${a}"
  connectionDistance={${S}}
  interactive={${d}}
  glowStars={${y}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(Q,{starCount:n,starColor:s,lineColor:a,backgroundColor:r,speed:o,interactive:d,lineStyle:g,glowStars:y,connectionDistance:S,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:d?"Drag stars to reposition":"Auto-drift mode"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"ConstellationMap"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsxs("div",{className:"ctl-section",children:[e.jsx(w,{label:"Star color",value:s,onChange:i}),e.jsx(w,{label:"Line color",value:a,onChange:x}),e.jsx(w,{label:"Background",value:r,onChange:p}),e.jsx(c,{label:"Star count",value:n,min:20,max:300,step:10,onChange:l}),e.jsx(c,{label:"Connection distance",value:S,min:40,max:300,step:10,onChange:N}),e.jsx(c,{label:"Drift speed",value:o,min:0,max:3,step:.1,onChange:u})]}),e.jsx(h,{}),e.jsx(b,{label:"Line style",value:g,options:["solid","dashed"],onChange:C}),e.jsx(m,{label:"Drag to move stars",value:d,onChange:v}),e.jsx(m,{label:"Star glow",value:y,onChange:k}),e.jsx(h,{}),e.jsx(f,{code:$})]})]})]})}function je(){const[n,l]=t.useState("default"),[s,i]=t.useState(800),[a,x]=t.useState(1),[r,p]=t.useState(!1),[o,u]=t.useState(1),d=`import { FlowField } from 'own-the-canvas';

<FlowField
  preset="${n}"
  particleCount={${s}}
  speed={${a}}
  curl={${r}}
  lineWidth={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(X,{preset:n,particleCount:s,speed:a,curl:r,lineWidth:o,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Live preview"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"FlowField"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","neon","ocean","lava","forest","monochrome"],onChange:l}),e.jsx(h,{}),e.jsx(c,{label:"Particle count",value:s,min:100,max:2e3,step:100,onChange:i}),e.jsx(c,{label:"Speed",value:a,min:.2,max:4,step:.1,onChange:x}),e.jsx(c,{label:"Line width",value:o,min:.5,max:4,step:.5,onChange:u}),e.jsx(m,{label:"Curl noise",value:r,onChange:p}),e.jsx(h,{}),e.jsx(f,{code:d})]})]})]})}function be(){const[n,l]=t.useState("default"),[s,i]=t.useState(120),[a,x]=t.useState(.75),[r,p]=t.useState(.4),[o,u]=t.useState(!0),[d,v]=t.useState("#6b7280"),g=`import { Spotlight } from 'own-the-canvas';

<div style={{ position: "relative" }}>
  <YourContent />
  <Spotlight
    preset="${n}"
    radius={${s}}
    overlayOpacity={${a}}
    showGlow={${o}}
    style={{ position: "absolute", inset: 0 }}
  />
</div>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",style:{position:"relative"},children:[e.jsxs("div",{className:"canvas-wrap-inner",style:{background:"linear-gradient(135deg,#0a0015 0%,#050020 100%)",display:"flex",alignItems:"center",justifyContent:"center"},children:[e.jsxs("div",{style:{textAlign:"center",color:"#fff",padding:40,pointerEvents:"none",userSelect:"none"},children:[e.jsx("div",{style:{fontSize:48,fontWeight:700,letterSpacing:-2,marginBottom:12},children:"Move cursor"}),e.jsx("div",{style:{fontSize:18,opacity:.4},children:"The spotlight follows your mouse"})]}),e.jsx(K,{preset:n,radius:s,overlayOpacity:a,edgeSoftness:r,showGlow:o,glowColor:d,style:{position:"absolute",inset:0}})]}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Move cursor over canvas"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Spotlight"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","soft","dramatic","neon","ellipse"],onChange:l}),e.jsx(h,{}),e.jsx(c,{label:"Radius",value:s,min:40,max:300,step:10,onChange:i}),e.jsx(c,{label:"Overlay opacity",value:a,min:.1,max:.98,step:.02,onChange:x}),e.jsx(c,{label:"Edge softness",value:r,min:0,max:1,step:.05,onChange:p}),e.jsx(w,{label:"Glow color",value:d,onChange:v}),e.jsx(m,{label:"Show glow ring",value:o,onChange:u}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function ye(){const[n,l]=t.useState("default"),[s,i]=t.useState(3),[a,x]=t.useState(4),[r,p]=t.useState("#ffffff"),[o,u]=t.useState(!0),[d,v]=t.useState(!1),g=`import { Shockwave } from 'own-the-canvas';

<Shockwave
  preset="${n}"
  ringCount={${s}}
  speed={${a}}
  color="${r}"
  glowEffect={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(J,{preset:n,ringCount:s,speed:a,color:r,glowEffect:o,autoFire:d,autoInterval:1500,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Click anywhere to fire"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Shockwave"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","neon","explosion","ripple","minimal"],onChange:l}),e.jsx(h,{}),e.jsx(w,{label:"Ring color",value:r,onChange:p}),e.jsx(c,{label:"Ring count",value:s,min:1,max:8,step:1,onChange:i}),e.jsx(c,{label:"Speed",value:a,min:1,max:12,step:.5,onChange:x}),e.jsx(m,{label:"Glow effect",value:o,onChange:u}),e.jsx(m,{label:"Auto-fire",value:d,onChange:v}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function we(){const[n,l]=t.useState("default"),[s,i]=t.useState(80),[a,x]=t.useState(.08),[r,p]=t.useState(5),[o,u]=t.useState(!0),[d,v]=t.useState(!0),g=`import { Fireworks } from 'own-the-canvas';

<Fireworks
  preset="${n}"
  particleCount={${s}}
  gravity={${a}}
  autoLaunch={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(Y,{preset:n,particleCount:s,gravity:a,spread:r,autoLaunch:o,glowEffect:d,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Click to launch a shell"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Fireworks"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","celebration","subtle","neon","golden"],onChange:l}),e.jsx(h,{}),e.jsx(c,{label:"Particle count",value:s,min:20,max:200,step:10,onChange:i}),e.jsx(c,{label:"Gravity",value:a,min:.01,max:.3,step:.01,onChange:x}),e.jsx(c,{label:"Spread",value:r,min:2,max:10,step:.5,onChange:p}),e.jsx(m,{label:"Auto-launch",value:o,onChange:u}),e.jsx(m,{label:"Glow effect",value:d,onChange:v}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function Ce(){const[n,l]=t.useState("default"),[s,i]=t.useState(.6),[a,x]=t.useState(8),[r,p]=t.useState(!0),[o,u]=t.useState(!0),d=`import { GlitchOverlay } from 'own-the-canvas';

<div style={{ position: "relative" }}>
  <YourContent />
  <GlitchOverlay
    preset="${n}"
    intensity={${s}}
    rgbShift={${a}}
    style={{ position: "absolute", inset: 0 }}
  />
</div>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",style:{position:"relative"},children:[e.jsxs("div",{className:"canvas-wrap-inner",style:{background:"#111111",display:"flex",alignItems:"center",justifyContent:"center"},children:[e.jsxs("div",{style:{textAlign:"center",color:"#fff",fontFamily:"monospace",userSelect:"none"},children:[e.jsx("div",{style:{fontSize:52,fontWeight:900,letterSpacing:-2,marginBottom:8},children:"GLITCH"}),e.jsx("div",{style:{fontSize:14,opacity:.4,letterSpacing:6},children:"OVERLAY EFFECT"})]}),e.jsx(U,{preset:n,intensity:s,rgbShift:a,scanlines:r,blockGlitch:o,style:{position:"absolute",inset:0}})]}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Overlay composited on content"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"GlitchOverlay"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","crt","cyberpunk","subtle","corrupt"],onChange:l}),e.jsx(h,{}),e.jsx(c,{label:"Intensity",value:s,min:0,max:1,step:.05,onChange:i}),e.jsx(c,{label:"RGB shift",value:a,min:0,max:40,step:1,onChange:x}),e.jsx(m,{label:"Scanlines",value:r,onChange:p}),e.jsx(m,{label:"Block glitch",value:o,onChange:u}),e.jsx(h,{}),e.jsx(f,{code:d})]})]})]})}function Se(){const[n,l]=t.useState("default"),[s,i]=t.useState(!0),[a,x]=t.useState(!0),[r,p]=t.useState(!1),[o,u]=t.useState(!0),d=W.useMemo(()=>[{data:Array.from({length:40},(g,C)=>50+Math.sin(C*.4)*30+Math.random()*10),color:"#ffffff",filled:!0},{data:Array.from({length:40},(g,C)=>50+Math.cos(C*.3)*20+Math.random()*8),color:"#6b7280",filled:!0}],[]),v=`import { LiveChart } from 'own-the-canvas';

<LiveChart
  preset="${n}"
  series={[
    { data: myData1, color: "#ffffff", filled: true },
    { data: myData2, color: "#6b7280", filled: true },
  ]}
  smooth={${s}}
  showGrid={${a}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(H,{preset:n,series:d,smooth:s,showGrid:a,showDots:r,glowEffect:o,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Static dataset — push data dynamically"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"LiveChart"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","neon","minimal","ocean","fire"],onChange:l}),e.jsx(h,{}),e.jsx(m,{label:"Smooth curves",value:s,onChange:i}),e.jsx(m,{label:"Grid lines",value:a,onChange:x}),e.jsx(m,{label:"Data dots",value:r,onChange:p}),e.jsx(m,{label:"Glow effect",value:o,onChange:u}),e.jsx(h,{}),e.jsx(f,{code:v})]})]})]})}function ke(){const[n,l]=t.useState("default"),[s,i]=t.useState(8),[a,x]=t.useState(5),[r,p]=t.useState(1),[o,u]=t.useState(!0),[d,v]=t.useState(!0),g=`import { Mandala } from 'own-the-canvas';

<Mandala
  preset="${n}"
  symmetry={${s}}
  layers={${a}}
  speed={${r}}
  mirror={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(_,{preset:n,symmetry:s,layers:a,speed:r,mirror:o,glowEffect:d,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Live preview"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Mandala"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","neon","lotus","cosmic","minimal"],onChange:l}),e.jsx(h,{}),e.jsx(c,{label:"Symmetry arms",value:s,min:3,max:24,step:1,onChange:i}),e.jsx(c,{label:"Layers",value:a,min:1,max:8,step:1,onChange:x}),e.jsx(c,{label:"Speed",value:r,min:0,max:3,step:.1,onChange:p}),e.jsx(m,{label:"Bilateral mirror",value:o,onChange:u}),e.jsx(m,{label:"Glow effect",value:d,onChange:v}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function Ne(){const[n,l]=t.useState("default"),[s,i]=t.useState(5),[a,x]=t.useState(80),[r,p]=t.useState(1.8),[o,u]=t.useState(!0),[d,v]=t.useState(!0),g=`import { MagneticBlob } from 'own-the-canvas';

<MagneticBlob
  preset="${n}"
  count={${s}}
  radius={${a}}
  threshold={${r}}
  followMouse={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(V,{preset:n,count:s,radius:a,threshold:r,followMouse:o,glowEffect:d,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Move cursor to attract blobs"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"MagneticBlob"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","neon","plasma","ocean","lava","minimal"],onChange:l}),e.jsx(h,{}),e.jsx(c,{label:"Blob count",value:s,min:2,max:10,step:1,onChange:i}),e.jsx(c,{label:"Radius",value:a,min:30,max:150,step:5,onChange:x}),e.jsx(c,{label:"Merge threshold",value:r,min:1,max:3,step:.1,onChange:p}),e.jsx(m,{label:"Follow mouse",value:o,onChange:u}),e.jsx(m,{label:"Glow effect",value:d,onChange:v}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function $e(){const[n,l]=t.useState("default"),[s,i]=t.useState(25),[a,x]=t.useState(.4),[r,p]=t.useState(.3),[o,u]=t.useState(!1),[d,v]=t.useState("#6b7280"),g=`import { ClothSimulation } from 'own-the-canvas';

<ClothSimulation
  preset="${n}"
  cols={${s}}
  gravity={${a}}
  wind={${r}}
  tearable={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(I,{preset:n,cols:s,gravity:a,wind:r,tearable:o,lineColor:d,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:o?"Click to tear cloth":"Hover to push cloth"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"ClothSimulation"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","silk","net","heavy","spider"],onChange:l}),e.jsx(h,{}),e.jsx(w,{label:"Cloth color",value:d,onChange:v}),e.jsx(c,{label:"Columns",value:s,min:10,max:40,step:1,onChange:i}),e.jsx(c,{label:"Gravity",value:a,min:.05,max:1.5,step:.05,onChange:x}),e.jsx(c,{label:"Wind",value:r,min:0,max:1,step:.05,onChange:p}),e.jsx(m,{label:"Tearable",value:o,onChange:u}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function Pe(){const[n,l]=t.useState("default"),[s,i]=t.useState(80),[a,x]=t.useState(.995),[r,p]=t.useState(!0),[o,u]=t.useState(5),d=`import { FluidSimulation } from 'own-the-canvas';

<FluidSimulation
  preset="${n}"
  resolution={${s}}
  dissipation={${a}}
  autoInk={${r}}
  mouseForce={${o}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(T,{preset:n,resolution:s,dissipation:a,autoInk:r,mouseForce:o,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Move cursor to paint fluid"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"FluidSimulation"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","ink","neon","lava","ocean","smoke"],onChange:l}),e.jsx(h,{}),e.jsx(c,{label:"Resolution",value:s,min:32,max:128,step:8,onChange:i}),e.jsx(c,{label:"Dissipation",value:a,min:.97,max:.999,step:.001,onChange:x}),e.jsx(c,{label:"Mouse force",value:o,min:1,max:15,step:1,onChange:u}),e.jsx(m,{label:"Auto-ink bursts",value:r,onChange:p}),e.jsx(h,{}),e.jsx(f,{code:d})]})]})]})}function Fe(){const[n,l]=t.useState("default"),[s,i]=t.useState(200),[a,x]=t.useState(15),[r,p]=t.useState(.3),[o,u]=t.useState("#ffffff"),[d,v]=t.useState("#6b7280"),[g,C]=t.useState(!0),y=`import { Rain } from 'own-the-canvas';

<Rain
  preset="${n}"
  dropCount={${s}}
  speed={${a}}
  wind={${r}}
  dropColor="${o}"
  showSplashes={${g}}
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(O,{preset:n,dropCount:s,speed:a,wind:r,dropColor:o,splashColor:d,showSplashes:g,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Rain with wind drift"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Rain"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","storm","drizzle","neon","golden"],onChange:l}),e.jsx(h,{}),e.jsx(w,{label:"Drop color",value:o,onChange:u}),e.jsx(w,{label:"Splash color",value:d,onChange:v}),e.jsx(c,{label:"Drop count",value:s,min:20,max:800,step:10,onChange:i}),e.jsx(c,{label:"Speed",value:a,min:2,max:40,step:1,onChange:x}),e.jsx(c,{label:"Wind",value:r,min:0,max:3,step:.05,onChange:p}),e.jsx(m,{label:"Show splashes",value:g,onChange:C}),e.jsx(h,{}),e.jsx(f,{code:y})]})]})]})}function Me(){const[n,l]=t.useState("default"),[s,i]=t.useState("#6b7280"),[a,x]=t.useState(.3),[r,p]=t.useState(20),[o,u]=t.useState(2e3),d=`import { Lightning } from 'own-the-canvas';

<Lightning
  preset="${n}"
  color="${s}"
  branchChance={${a}}
  glowBlur={${r}}
  autoInterval={${o}}
  interactive
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(E,{preset:n,color:s,branchChance:a,glowBlur:r,autoInterval:o,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Click to strike"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Lightning"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","neon","storm","plasma","subtle"],onChange:l}),e.jsx(h,{}),e.jsx(w,{label:"Bolt color",value:s,onChange:i}),e.jsx(c,{label:"Branch chance",value:a,min:0,max:.8,step:.05,onChange:x}),e.jsx(c,{label:"Glow blur",value:r,min:0,max:60,step:2,onChange:p}),e.jsx(c,{label:"Auto interval (ms)",value:o,min:500,max:6e3,step:100,onChange:u}),e.jsx(h,{}),e.jsx(f,{code:d})]})]})]})}function We(){const[n,l]=t.useState("default"),[s,i]=t.useState(8),[a,x]=t.useState(10),[r,p]=t.useState("#ffffff"),[o,u]=t.useState("#6b7280"),[d,v]=t.useState(!0),g=`import { GameOfLife } from 'own-the-canvas';

<GameOfLife
  preset="${n}"
  cellSize={${s}}
  speed={${a}}
  aliveColor="${r}"
  showAge={${d}}
  interactive
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(A,{preset:n,cellSize:s,speed:a,aliveColor:r,oldColor:o,showAge:d,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Click cells to draw • Conway's Game of Life"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"GameOfLife"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","neon","matrix","minimal","fire"],onChange:l}),e.jsx(h,{}),e.jsx(w,{label:"Alive color",value:r,onChange:p}),e.jsx(w,{label:"Old cell color",value:o,onChange:u}),e.jsx(c,{label:"Cell size",value:s,min:4,max:24,step:2,onChange:i}),e.jsx(c,{label:"Speed (updates/s)",value:a,min:1,max:30,step:1,onChange:x}),e.jsx(m,{label:"Show age gradient",value:d,onChange:v}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function Le(){const[n,l]=t.useState("default"),[s,i]=t.useState(1),[a,x]=t.useState(.3),[r,p]=t.useState(30),[o,u]=t.useState(100),d=`import { Wormhole } from 'own-the-canvas';

<Wormhole
  preset="${n}"
  speed={${s}}
  twist={${a}}
  ringCount={${r}}
  interactive
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(D,{preset:n,speed:s,twist:a,ringCount:r,starCount:o,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Mouse X controls speed"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Wormhole"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","hyperspace","neon","vortex","minimal"],onChange:l}),e.jsx(h,{}),e.jsx(c,{label:"Speed",value:s,min:.2,max:5,step:.1,onChange:i}),e.jsx(c,{label:"Twist",value:a,min:0,max:2,step:.05,onChange:x}),e.jsx(c,{label:"Ring count",value:r,min:10,max:60,step:5,onChange:p}),e.jsx(c,{label:"Star count",value:o,min:0,max:300,step:10,onChange:u}),e.jsx(h,{}),e.jsx(f,{code:d})]})]})]})}function Be(){const[n,l]=t.useState("default"),[s,i]=t.useState(80),[a,x]=t.useState(3),[r,p]=t.useState("#ffffff"),[o,u]=t.useState(8),[d,v]=t.useState(.05),g=`import { Boids } from 'own-the-canvas';

<Boids
  preset="${n}"
  count={${s}}
  maxSpeed={${a}}
  color="${r}"
  trailLength={${o}}
  interactive
/>`;return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"canvas-wrap",children:[e.jsx("div",{className:"canvas-wrap-inner",children:e.jsx(R,{preset:n,count:s,maxSpeed:a,color:r,trailLength:o,separationForce:d,width:"100%",height:"100%"})}),e.jsxs("div",{className:"canvas-label",children:[e.jsx("div",{className:"canvas-dot"}),e.jsx("span",{children:"Move cursor to scatter the flock"})]})]}),e.jsxs("div",{className:"controls",children:[e.jsx(j,{id:"Boids"}),e.jsxs("div",{className:"ctrl-body",children:[e.jsx(b,{label:"Preset",value:n,options:["default","birds","fish","swarm","neon"],onChange:l}),e.jsx(h,{}),e.jsx(w,{label:"Color",value:r,onChange:p}),e.jsx(c,{label:"Count",value:s,min:10,max:300,step:10,onChange:i}),e.jsx(c,{label:"Max speed",value:a,min:.5,max:8,step:.5,onChange:x}),e.jsx(c,{label:"Trail length",value:o,min:0,max:30,step:1,onChange:u}),e.jsx(c,{label:"Separation force",value:d,min:0,max:.2,step:.005,onChange:v}),e.jsx(h,{}),e.jsx(f,{code:g})]})]})]})}function j({id:n}){const l=B[n],s=L[n];return e.jsxs("div",{className:"ctrl-head",children:[e.jsxs("div",{className:"ctrl-head-top",children:[e.jsx("div",{className:"ctrl-component-icon",style:{background:l.accent+"22",color:l.accent},children:s}),e.jsx("span",{className:"ctrl-name",children:n})]}),e.jsx("p",{className:"ctrl-desc",children:l.desc})]})}const ze={MatrixRain:ce,ParticleField:de,Starfield:xe,FireEffect:he,AudioVisualizer:pe,Confetti:ue,RippleEffect:ge,NoiseGradient:ve,PixelDissolve:me,ConstellationMap:fe,FlowField:je,Spotlight:be,Shockwave:ye,Fireworks:we,GlitchOverlay:Ce,LiveChart:Se,Mandala:ke,MagneticBlob:Ne,ClothSimulation:$e,FluidSimulation:Pe,Rain:Fe,Lightning:Me,GameOfLife:We,Wormhole:Le,Boids:Be};function Ge(){const[n,l]=G(),s=n.get("component"),i=s&&F.includes(s)?s:"MatrixRain",[a,x]=t.useState(i),r=ze[a];function p(o){x(o),l({component:o},{replace:!0})}return e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:ie}}),e.jsxs("div",{className:"app",children:[e.jsxs("header",{className:"header",children:[e.jsxs("div",{className:"header-logo",children:[e.jsx("div",{className:"header-logo-icon","aria-hidden":"true",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[e.jsx("rect",{x:"2",y:"2",width:"5",height:"5",rx:"1",fill:"white",fillOpacity:".9"}),e.jsx("rect",{x:"9",y:"2",width:"5",height:"5",rx:"1",fill:"white",fillOpacity:".5"}),e.jsx("rect",{x:"2",y:"9",width:"5",height:"5",rx:"1",fill:"white",fillOpacity:".5"}),e.jsx("rect",{x:"9",y:"9",width:"5",height:"5",rx:"1",fill:"white",fillOpacity:".9"})]})}),"own-the-canvas"]}),e.jsx("div",{className:"header-divider","aria-hidden":"true"}),e.jsx("span",{className:"header-tag",children:"25 components"}),e.jsx("div",{className:"header-spacer"}),e.jsx("span",{className:"header-badge",children:"v1.0.0"})]}),e.jsx("nav",{className:"tab-row",role:"tablist","aria-label":"Components",children:F.map(o=>e.jsxs("button",{className:`tab-btn ${a===o?"active":""}`,role:"tab","aria-selected":a===o,onClick:()=>p(o),children:[e.jsx("span",{style:{color:a===o?B[o].accent:"currentColor",transition:"color 200ms"},children:L[o]}),o]},o))}),e.jsx("main",{className:"workspace",role:"main",children:e.jsx(r,{})})]})]})}const Re=`
.playground-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.playground-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: var(--topbar-h);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--bg);
}

.playground-topbar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.playground-topbar-badge {
  font-size: 11px;
  font-weight: 500;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
  padding: 2px 8px;
  border-radius: 20px;
  font-family: var(--mono);
}

.playground-topbar-note {
  font-size: 12px;
  color: var(--text-3);
}

.playground-frame {
  flex: 1;
  overflow: hidden;
}
`;function Ae(){return e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:Re}}),e.jsxs("div",{className:"playground-shell",children:[e.jsxs("div",{className:"playground-topbar",children:[e.jsxs("div",{className:"playground-topbar-title",children:["Interactive Playground",e.jsx("span",{className:"playground-topbar-badge",children:"live"})]}),e.jsx("span",{className:"playground-topbar-note",children:"All 20+ components · real-time props"})]}),e.jsx("div",{className:"playground-frame",children:e.jsx(Ge,{})})]})]})}export{Ae as Playground};
