import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { Confetti } from "../../../components/Confetti";

const PROPS = [
  { name: "palette",       type: '"monochrome" | "colorful"', default: '"monochrome"', description: 'Color variant. "monochrome" uses white/gray shades; "colorful" uses vibrant multi-color.' },
  { name: "trigger",       type: "boolean", default: "false", description: "Rising edge fires a burst." },
  { name: "particleCount", type: "number",  default: "150",   description: "Number of confetti pieces per burst." },
  { name: "spread",        type: "number",  default: "0.8",   description: "Horizontal spread (0–1)." },
  { name: "gravity",       type: "number",  default: "0.5",   description: "Gravity strength." },
  { name: "wind",          type: "number",  default: "0.5",   description: "Horizontal wind force." },
  { name: "continuous",    type: "boolean", default: "false",  description: "Continuous rain instead of burst." },
];

export function ConfettiPage() {
  const [trigger, setTrigger] = useState(false);

  function fire() {
    setTrigger(false);
    setTimeout(() => setTrigger(true), 50);
  }

  return (
    <PageShell
      eyebrow="Component"
      title="Confetti"
      lead="Physics-based celebration confetti. Fire a burst on a rising trigger edge, or run as continuous particle rain."
    >
      <div className="page-preview" style={{ position: "relative" }}>
        <Confetti trigger={trigger} particleCount={150} spread={0.8} width="100%" height="100%" />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button
            onClick={fire}
            style={{
              padding: "10px 22px",
              borderRadius: "var(--r)",
              background: "var(--accent)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font)",
            }}
          >
            Launch confetti
          </button>
        </div>
      </div>
      <Link to="/playground?component=Confetti" className="page-preview-playground-link">↗ Try in Playground</Link>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { Confetti } from 'own-the-canvas';
import { useState } from 'react';

function App() {
  const [trigger, setTrigger] = useState(false);

  function fire() {
    setTrigger(false);
    setTimeout(() => setTrigger(true), 50);
  }

  return (
    <>
      <button onClick={fire}>Celebrate!</button>
      <Confetti
        trigger={trigger}
        particleCount={150}
        spread={0.8}
        width="100%"
        height="100%"
      />
    </>
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
