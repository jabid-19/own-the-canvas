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
  const display = Number.isInteger(step) ? value.toFixed(0) : value.toFixed(2).replace(/\.?0+$/, "");
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
          style={{ width: 32, height: 26, border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", padding: 2, background: "var(--bg-subtle)", flexShrink: 0 }} />
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
          width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
          background: value ? "var(--accent)" : "var(--border)",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: value ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
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
        width: "100%", padding: "8px 16px", borderRadius: 8,
        cursor: "pointer", fontSize: 13, fontWeight: 600,
        background: variant === "primary" ? "var(--accent)" : "var(--bg-subtle)",
        color: variant === "primary" ? "#fff" : "var(--text-1)",
        border: variant === "secondary" ? "1px solid var(--border)" : "none",
        marginBottom: 8,
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
      position: "absolute", bottom: 10, left: 14, fontSize: 11,
      color: "rgba(255,255,255,0.45)", fontFamily: "var(--mono)",
      display: "flex", alignItems: "center", gap: 6, pointerEvents: "none", zIndex: 10,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
      {text}
    </div>
  );
}

const PLAYGROUND_CSS = `
.playground-controls {
  padding: 14px 18px;
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 32px;
}
@media (max-width: 640px) {
  .playground-controls { grid-template-columns: 1fr; }
}
.playground-controls-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}
.playground-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.playground-reset-btn:hover {
  color: var(--text-1);
  border-color: var(--text-3);
}
`;

// ─── Playground shell ─────────────────────────────────────────────────────────
interface PlaygroundShellProps {
  preview: React.ReactNode;
  controls: React.ReactNode;
  code: string;
  onReset?: () => void;
}

export function PlaygroundShell({ preview, controls, code, onReset }: PlaygroundShellProps) {
  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: "var(--r-lg)",
      overflow: "hidden", marginBottom: 20,
    }}>
      <style dangerouslySetInnerHTML={{ __html: PLAYGROUND_CSS }} />
      {/* Preview */}
      <div style={{ height: 300, position: "relative", overflow: "hidden" }}>
        {preview}
      </div>

      {/* Controls — two-column grid, single on mobile */}
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
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <CodeBlock code={code} language="tsx" />
      </div>
    </div>
  );
}
