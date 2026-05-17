import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PDivider, PButton, PLiveLabel } from "../../components/PlaygroundControls";
import { PixelDissolve } from "../../../components/PixelDissolve";

const PROPS = [
  { name: "trigger",    type: "boolean",                    default: "false",      description: "Rising edge starts the dissolve animation." },
  { name: "direction",  type: '"in" | "out" | "both"',     default: '"out"',      description: "Dissolve direction." },
  { name: "pixelSize",  type: "number",                    default: "8",          description: "Pixel block size in pixels." },
  { name: "speed",      type: "number",                    default: "0.5",        description: "Dissolve animation speed." },
  { name: "color",      type: "string",                    default: '"#ffffff"',  description: "Pixel color used during dissolve." },
  { name: "children",   type: "React.ReactNode",           default: "—",          description: "Content to wrap with the dissolve effect.", required: true },
];

function PixelDissolvePlayground() {
  const [trigger, setTrigger] = useState(false);
  const [direction, setDirection] = useState<"in" | "out" | "both">("out");
  const [pixelSize, setPixelSize] = useState(8);
  const [speed, setSpeed] = useState(0.5);
  const [color, setColor] = useState("#ffffff");

  function fire() {
    setTrigger(false);
    setTimeout(() => setTrigger(true), 50);
  }

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
    `      direction="${direction}"`,
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

  const preview = (
    <div style={{ width: "100%", height: "100%", background: "#1a1a1a", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PixelDissolve trigger={trigger} direction={direction} pixelSize={pixelSize} speed={speed} color={color} width={300} height={160}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #111111 0%, #555555 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", gap: 8, fontFamily: "var(--mono)" }}>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3 }}>DISSOLVE</span>
          <span style={{ fontSize: 12, opacity: 0.5 }}>own-the-canvas</span>
        </div>
      </PixelDissolve>
      <PLiveLabel text="Click Trigger to animate" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Direction" value={direction} options={["out", "in", "both"]} onChange={(v) => setDirection(v as "in" | "out" | "both")} />
        <PDivider />
        <PButton label="Trigger dissolve" onClick={fire} />
        <PDivider />
        <PColor label="Pixel color" value={color} onChange={setColor} />
      </div>
      <div>
        <PSlider label="Pixel size" value={pixelSize} min={2} max={32} step={2} onChange={setPixelSize} />
        <PSlider label="Speed" value={speed} min={0.1} max={2} step={0.05} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function PixelDissolvePage() {
  return (
    <PageShell
      eyebrow="Component"
      title="PixelDissolve"
      lead="A wrapper component that applies a pixelated dissolve transition to any content. Trigger it with a boolean prop."
    >
      <PixelDissolvePlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
