import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ComponentIcon } from "./ComponentIcon";

const CSS = `
/* Each card is a stack of three sheets. The two under it take the component's colour. */
.cc-wrap {
  position: relative;
  --cut: var(--cut-a);
  filter: drop-shadow(0 2px 1px rgba(var(--shadow-ink), .26)) drop-shadow(0 8px 9px rgba(var(--shadow-ink), .2));
}
.cc-wrap:nth-of-type(4n+2) { --cut: var(--cut-b); }
.cc-wrap:nth-of-type(4n+3) { --cut: var(--cut-c); }
.cc-wrap:nth-of-type(4n+4) { --cut: var(--cut-d); }

.cc-wrap::before,
.cc-wrap::after {
  content: "";
  position: absolute;
  inset: 0;
  clip-path: var(--cut);
  transition: transform 340ms var(--ease);
}
.cc-wrap::before {
  background: var(--grain), color-mix(in srgb, var(--card-accent, #f2b134) 55%, #fbf5e8);
  transform: translate(6px, 7px) rotate(1deg);
}
.cc-wrap::after {
  background: var(--grain), var(--card-accent, #f2b134);
  transform: translate(-5px, 11px) rotate(-1.2deg);
  z-index: -1;
}
.cc-wrap:hover::before { transform: translate(14px, 9px) rotate(3.2deg); }
.cc-wrap:hover::after  { transform: translate(-13px, 14px) rotate(-3.6deg); }

.component-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  clip-path: var(--cut);
  text-decoration: none;
  color: inherit;
  transition: transform 340ms var(--ease);
  background: var(--grain), var(--bg);
}
.cc-wrap:hover .component-card { transform: translate(-3px, -5px); }
.component-card:focus-visible {
  outline: 3px solid var(--navy);
  outline-offset: -6px;
}

.component-card-preview {
  height: 176px;
  overflow: hidden;
  background: #17110c;
  position: relative;
  flex-shrink: 0;
  border-radius: 2px;
  margin: 18px 18px 0;
  box-shadow: 0 0 0 4px #f4ecd8, 0 0 0 5px rgba(43,33,24,.45), 0 0 0 7px #d8a959, 0 0 0 8px #8a5a1d, 0 0 0 12px #8c5a2e, 0 0 0 13px #4b2d14;
}
/* punched-window edge shadow over the canvas */
.component-card-preview::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  box-shadow: inset 0 4px 8px rgba(0,0,0,.5), inset 3px 0 6px -2px rgba(0,0,0,.35);
}

.component-card-preview canvas {
  width: 100% !important;
  height: 100% !important;
}

.component-card-canvas {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 200ms var(--ease);
}
.component-card-canvas.visible {
  opacity: 1;
}

/* Placeholder: a tinted sheet with the component's glyph cut into it */
.component-card-placeholder {
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--grain), color-mix(in srgb, var(--card-accent, #f2b134) 38%, #fbf5e8);
  transition: opacity 200ms var(--ease);
}
.component-card-placeholder.hidden {
  opacity: 0;
  pointer-events: none;
}

.component-card-placeholder-icon {
  width: 84px;
  height: 84px;
  color: color-mix(in srgb, var(--card-accent, #2b2118) 70%, #2b2118);
  opacity: .9;
  position: relative;
  z-index: 1;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(2px 3px 0 rgba(255,255,255,.55));
}

.component-card-placeholder-hint {
  font-size: 10px;
  font-weight: 600;
  font-family: var(--mono);
  color: var(--text-1);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  pointer-events: none;
  user-select: none;
  position: relative;
  z-index: 1;
  opacity: 0.75;
}

.component-card-play {
  position: absolute;
  inset: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(43,33,24,.35);
  color: #fff;
  font-size: 24px;
  opacity: 0;
  transition: opacity 200ms var(--ease);
  cursor: pointer;
}
.component-card-preview:hover .component-card-play {
  opacity: 1;
}
@media (hover: none) {
  .component-card-placeholder-hint { display: none; }
}
@media (max-width: 600px) {
  .component-card-preview { height: 150px; }
  .component-card-preview:hover .component-card-play {
    opacity: 0;
  }
  .component-card-play {
    opacity: 1;
    background: transparent;
    color: var(--text-1);
    align-items: flex-start;
    justify-content: flex-end;
    padding: 8px 12px;
    font-size: 18px;
  }
}
.component-card-body {
  padding: 14px 20px 20px;
  flex: 1;
}

.component-card-name {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 9px;
}

/* the colour chip is a little punched-out confetti dot */
.component-card-accent {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px var(--bg), 0 0 0 3px rgba(var(--shadow-ink), .25), 1px 2px 0 3px rgba(var(--shadow-ink), .12);
}

.component-card-desc {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.55;
}

.component-card-footer-play {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 12px;
  padding: 6px 12px;
  min-height: 32px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-1);
  background: var(--bg-subtle);
  border: none;
  border-radius: 3px;
  box-shadow: 0 2px 0 var(--border-mid), 0 4px 5px -1px rgba(var(--shadow-ink), .2);
  cursor: pointer;
  transition: transform 150ms var(--ease), box-shadow 150ms var(--ease), background 150ms var(--ease);
  font-family: var(--mono);
}
.component-card-footer-play:hover { background: var(--mustard); }
.component-card-footer-play:active { transform: translateY(2px); box-shadow: none; }
`;

interface ComponentCardProps {
  name: string;
  description: string;
  path: string;
  accent: string;
  preview: React.ReactNode;
}

export function ComponentCard({ name, description, path, accent, preview }: ComponentCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cc-wrap" style={{ "--card-accent": accent } as React.CSSProperties}>
      <Link
          to={path}
          className="component-card"
          data-testid="component-card"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
        <div className="component-card-preview" aria-hidden="true">
          <div className="component-card-play" onClick={() => setHovered(true)} aria-label="Play preview">▶</div>
          <div className={`component-card-placeholder${hovered ? " hidden" : ""}`}>
            <ComponentIcon name={name} className="component-card-placeholder-icon" />
            <span className="component-card-placeholder-hint">hover to preview</span>
          </div>
          <div className={`component-card-canvas${hovered ? " visible" : ""}`}>
            {hovered ? preview : null}
          </div>
        </div>
        <div className="component-card-body">
          <div className="component-card-name">
            <div className="component-card-accent" style={{ background: accent }} />
            {name}
          </div>
          <div className="component-card-desc">{description}</div>
          <button
            className="component-card-footer-play"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setHovered(v => !v);
            }}
            aria-label={hovered ? "Stop preview" : "Play preview"}
          >
            {hovered ? "✕ Stop" : "▶ Preview"}
          </button>
        </div>
      </Link>
      </div>
    </>
  );
}
