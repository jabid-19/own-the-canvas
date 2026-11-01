import React from "react";
import { CodeBlock } from "./CodeBlock";

// ─── Shared style tokens ──────────────────────────────────────────────────────
const row: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "7px 0", gap: 12,
};
const labelStyle: React.CSSProperties = {
  fontSize: 13, color: "var(--text-2)", flex: 1, whiteSpace: "nowrap",
};
const valueStyle: React.CSSProperties = {
  fontSize: 12, color: "var(--text-3)", fontFamily: "var(--mono)", marginLeft: 8,
};

// ─── Control primitives ───────────────────────────────────────────────────────

export function PSlider({ label, value, min, max, step, onChange }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  const display = Number.isInteger(step) ? value.toFixed(0) : String(+value.toPrecision(3));
  return (
    <div style={row}>
      <span style={labelStyle}>{label}<span style={valueStyle}>{display}</span></span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ width: "100%", maxWidth: 130, accentColor: "var(--accent)", flexShrink: 0 }} />
    </div>
  );
}

export function PColor({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={row}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          style={{ width: 32, height: 26, border: "none", boxShadow: "0 0 0 2px var(--bg), 0 0 0 3px var(--border-mid)", borderRadius: 3, cursor: "pointer", padding: 2, background: "var(--bg-subtle)", flexShrink: 0 }} />
        <span style={{ ...valueStyle, marginLeft: 0 }}>{value.toUpperCase()}</span>
      </div>
    </div>
  );
}

export function PToggle({ label, value, onChange }: {
  label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={row}>
      <span style={labelStyle}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        style={{
          width: 44, height: 24, borderRadius: 3, border: "none", cursor: "pointer",
          background: value ? "var(--teal)" : "var(--border-mid)",
          boxShadow: "inset 0 2px 3px rgba(43,33,24,.35)",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 2, left: value ? 22 : 2,
          width: 20, height: 20, borderRadius: 2, background: "var(--bg)",
          transition: "left 0.2s var(--ease)", boxShadow: "0 1px 0 #fff inset, 0 2px 0 rgba(43,33,24,.3), 0 3px 4px rgba(43,33,24,.25)",
        }} />
      </button>
    </div>
  );
}

export function PSel<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: T[]; onChange: (v: T) => void;
}) {
  return (
    <div style={row}>
      <span style={labelStyle}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}
        style={{
          background: "var(--bg-subtle)", color: "var(--text-1)",
          border: "1px solid var(--border)", borderRadius: 6,
          padding: "4px 8px", fontSize: 13, fontFamily: "var(--mono)",
          cursor: "pointer", flexShrink: 0,
        }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function PColorArray({ label, value, onChange }: {
  label: string; value: string[]; onChange: (v: string[]) => void;
}) {
  const add = () => onChange([...value, "#ffffff"]);
  const remove = () => { if (value.length > 1) onChange(value.slice(0, -1)); };
  const update = (i: number, c: string) => {
    const next = [...value];
    next[i] = c;
    onChange(next);
  };
  const btnBase: React.CSSProperties = {
    width: 18, height: 18, borderRadius: 4, border: "1px solid var(--border)",
    background: "var(--bg)", color: "var(--text-2)", cursor: "pointer",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, padding: 0,
  };
  return (
    <div style={{ padding: "7px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ ...labelStyle, flex: "none" }}>{label}</span>
        <button onClick={remove} disabled={value.length <= 1} aria-label="Remove color"
          style={{ ...btnBase, opacity: value.length <= 1 ? 0.35 : 1, cursor: value.length <= 1 ? "not-allowed" : "pointer" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button onClick={add} aria-label="Add color" style={btnBase}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <line x1="5" y1="2" x2="5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {value.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input type="color" value={c} onChange={(e) => update(i, e.target.value)}
              style={{ width: 28, height: 24, border: "1px solid var(--border)", borderRadius: 5, cursor: "pointer", padding: 2, background: "var(--bg-subtle)" }} />
            <span style={{ ...valueStyle, marginLeft: 0, fontSize: 11 }}>{c.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PDivider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />;
}

export function PButton({ label, onClick, variant = "primary" }: {
  label: string; onClick: () => void; variant?: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", padding: "9px 16px", borderRadius: 4, minHeight: 40,
        cursor: "pointer", fontSize: 13, fontWeight: 700,
        background: variant === "primary" ? "var(--accent)" : "var(--bg)",
        color: variant === "primary" ? "#fff" : "var(--text-1)",
        border: "none",
        boxShadow: variant === "primary"
          ? "0 3px 0 var(--accent-deep), 0 6px 8px -2px rgba(43,33,24,.3)"
          : "0 3px 0 var(--border-mid), 0 6px 8px -2px rgba(43,33,24,.2)",
        marginBottom: 10,
      } as React.CSSProperties}
    >
      {label}
    </button>
  );
}

// ─── Preview label ────────────────────────────────────────────────────────────
export function PLiveLabel({ text = "Live preview" }: { text?: string }) {
  return (
    <div style={{
      position: "absolute", bottom: 12, left: 14, fontSize: 11, fontWeight: 600,
      color: "var(--text-1)", fontFamily: "var(--mono)", background: "var(--bg)",
      padding: "3px 10px 3px 8px", boxShadow: "var(--lift-1)",
      clipPath: "polygon(0 0, 100% 0, calc(100% - 5px) 50%, 100% 100%, 0 100%)",
      display: "flex", alignItems: "center", gap: 6, pointerEvents: "none", zIndex: 10,
    }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2f9e5f" }} />
      {text}
    </div>
  );
}

const PLAYGROUND_CSS = `
.pg-card {
  position: relative;
  margin: 8px 0 34px;
  background: var(--grain), var(--bg-subtle);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--border-mid), 0 3px 0 var(--border-mid), 0 7px 0 rgba(var(--shadow-ink), .1), 0 18px 26px -10px rgba(var(--shadow-ink), .32);
}
.pg-window {
  position: relative;
  height: 320px;
  margin: 40px 40px 14px;
  overflow: hidden;
  border-radius: 2px;
  background: #17110c;
  box-shadow:
    0 0 0 10px #f4ecd8,
    0 0 0 11px rgba(43,33,24,.5),
    0 0 0 13px #d8a959,
    0 0 0 14px #8a5a1d,
    0 0 0 24px #8c5a2e,
    0 0 0 25px #4b2d14,
    0 18px 26px 22px rgba(var(--shadow-ink), .26);
}
.pg-window::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 9;
  box-shadow: inset 0 6px 10px rgba(0,0,0,.5), inset 5px 0 8px -3px rgba(0,0,0,.35);
}
.playground-controls {
  padding: 14px 22px 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 36px;
}
@media (max-width: 640px) {
  .playground-controls { grid-template-columns: 1fr; padding: 12px 16px 16px; }
  .pg-window { height: 240px; margin: 30px 26px 10px; box-shadow: 0 0 0 7px #f4ecd8, 0 0 0 8px rgba(43,33,24,.5), 0 0 0 9px #d8a959, 0 0 0 16px #8c5a2e, 0 0 0 17px #4b2d14, 0 12px 18px 14px rgba(var(--shadow-ink), .26); }
}
.playground-controls-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
  background: repeating-linear-gradient(90deg, var(--border-mid) 0 8px, transparent 8px 14px) bottom / 100% 3px no-repeat;
  margin-bottom: 6px;
}
.playground-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 14px;
  min-height: 34px;
  border-radius: 3px;
  border: none;
  background: var(--bg);
  color: var(--text-1);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 0 var(--border-mid), 0 4px 5px -1px rgba(var(--shadow-ink), .22);
  transition: transform 150ms var(--ease), box-shadow 150ms var(--ease), background 150ms var(--ease);
}
.playground-reset-btn:hover { background: var(--mustard); }
.playground-reset-btn:active { transform: translateY(2px); box-shadow: none; }
.playground-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 14px 18px 4px;
}
.pg-code .codeblock { border-radius: 0; box-shadow: none; }
`;

// ─── Playground shell ─────────────────────────────────────────────────────────
interface PlaygroundShellProps {
  preview: React.ReactNode;
  controls: React.ReactNode;
  code: string;
  onReset?: () => void;
  previewActions?: React.ReactNode;
}

export function PlaygroundShell({ preview, controls, code, onReset, previewActions }: PlaygroundShellProps) {
  return (
    <div className="pg-card">
      <style dangerouslySetInnerHTML={{ __html: PLAYGROUND_CSS }} />
      {/* Preview: a window cut through the card */}
      <div className="pg-window">
        {preview}
      </div>

      {previewActions && <div className="playground-actions">{previewActions}</div>}

      {/* Controls: two-column grid, single on mobile */}
      <div className="playground-controls">
        {onReset && (
          <div className="playground-controls-header">
            <button className="playground-reset-btn" onClick={onReset}>
              ↺ Reset
            </button>
          </div>
        )}
        {controls}
      </div>

      {/* Live code block */}
      <div className="pg-code">
        <CodeBlock code={code} language="tsx" />
      </div>
    </div>
  );
}
