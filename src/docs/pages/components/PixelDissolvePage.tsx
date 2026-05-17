import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { PixelDissolve } from "../../../components/PixelDissolve";

const PROPS = [
  { name: "trigger",    type: "boolean",                    default: "false",      description: "Rising edge starts the dissolve animation." },
  { name: "direction",  type: '"in" | "out" | "both"',     default: '"out"',      description: "Dissolve direction." },
  { name: "pixelSize",  type: "number",                    default: "8",          description: "Pixel block size in pixels." },
  { name: "speed",      type: "number",                    default: "0.5",        description: "Dissolve animation speed." },
  { name: "color",      type: "string",                    default: '"#ffffff"',  description: "Pixel color used during dissolve." },
  { name: "children",   type: "React.ReactNode",           default: "—",          description: "Content to wrap with the dissolve effect.", required: true },
];

export function PixelDissolvePage() {
  const [trigger, setTrigger] = useState(false);

  function fire() {
    setTrigger(false);
    setTimeout(() => setTrigger(true), 50);
  }

  return (
    <PageShell
      eyebrow="Component"
      title="PixelDissolve"
      lead="A wrapper component that applies a pixelated dissolve transition to any content. Trigger it with a boolean prop."
    >
      <div className="page-preview" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PixelDissolve trigger={trigger} pixelSize={8} speed={0.5} direction="out" width={300} height={180}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#111111 0%,#555555 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", gap: 8, fontFamily: "var(--mono)" }}>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>DISSOLVE</span>
            <span style={{ fontSize: 12, opacity: 0.5 }}>own-the-canvas</span>
          </div>
        </PixelDissolve>
        <div style={{ position: "absolute", bottom: 16, left: 16 }}>
          <button
            onClick={fire}
            style={{ padding: "7px 16px", borderRadius: "var(--r-sm)", background: "rgba(0,0,0,0.07)", color: "var(--text-1)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, fontFamily: "var(--font)" }}
          >
            Trigger dissolve
          </button>
        </div>
      </div>
      <Link to="/playground?component=PixelDissolve" className="page-preview-playground-link">↗ Try in Playground</Link>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { PixelDissolve } from 'own-the-canvas';
import { useState } from 'react';

function App() {
  const [show, setShow] = useState(false);

  return (
    <PixelDissolve
      trigger={show}
      direction="out"
      pixelSize={8}
      speed={0.5}
      width={400}
      height={300}
    >
      <YourContent />
    </PixelDissolve>
  );
}`}
          language="tsx"
        />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
