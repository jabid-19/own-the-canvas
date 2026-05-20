import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ComponentIcon } from "./ComponentIcon";

const CSS = `
.component-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 200ms var(--ease), box-shadow 200ms var(--ease), transform 200ms var(--ease);
  background: var(--bg);
}
.component-card:hover {
  border-color: var(--accent-mid);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.component-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.component-card-preview {
  height: 180px;
  overflow: hidden;
  background: var(--bg-subtle);
  position: relative;
  flex-shrink: 0;
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

/* Placeholder */
.component-card-placeholder {
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--bg-subtle);
  transition: opacity 200ms var(--ease);
}
.component-card-placeholder.hidden {
  opacity: 0;
  pointer-events: none;
}

/* Animated diagonal stripe layer */
.component-card-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    -45deg,
    transparent 0px,
    transparent 16px,
    rgba(128, 128, 128, 0.055) 16px,
    rgba(128, 128, 128, 0.055) 17px
  );
  background-size: 24px 24px;
  animation: card-stripe-drift 10s linear infinite;
}

@keyframes card-stripe-drift {
  from { background-position: 0 0; }
  to   { background-position: 24px 24px; }
}

/* Faint centre vignette to frame the initial letter */
.component-card-placeholder::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.18) 100%);
  pointer-events: none;
}

.component-card-placeholder-icon {
  width: 80px;
  height: 80px;
  color: var(--text-1);
  opacity: 0.06;
  position: relative;
  z-index: 1;
  user-select: none;
  pointer-events: none;
}

.component-card-placeholder-hint {
  font-size: 10px;
  font-family: var(--mono);
  color: var(--text-3);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  pointer-events: none;
  user-select: none;
  position: relative;
  z-index: 1;
  opacity: 0.7;
}

.component-card-preview-badge {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 10px;
  font-weight: 500;
  color: var(--text-3);
  font-family: var(--mono);
  letter-spacing: 0.04em;
  pointer-events: none;
  z-index: 2;
}

.component-card-body {
  padding: 16px 18px 18px;
  border-top: 1px solid var(--border);
}

.component-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.component-card-accent {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.component-card-desc {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.5;
}
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
      <Link
        to={path}
        className="component-card"
        data-testid="component-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="component-card-preview" aria-hidden="true">
          <div className={`component-card-placeholder${hovered ? " hidden" : ""}`}>
            <ComponentIcon name={name} className="component-card-placeholder-icon" />
            <span className="component-card-placeholder-hint">hover to preview</span>
          </div>
          <div className={`component-card-canvas${hovered ? " visible" : ""}`}>
            {hovered ? preview : null}
          </div>
          <div className="component-card-preview-badge">live</div>
        </div>
        <div className="component-card-body">
          <div className="component-card-name">
            <div className="component-card-accent" style={{ background: accent }} />
            {name}
          </div>
          <div className="component-card-desc">{description}</div>
        </div>
      </Link>
    </>
  );
}
