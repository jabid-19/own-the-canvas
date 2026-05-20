import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PToggle, PDivider, PButton, PLiveLabel } from "../../components/PlaygroundControls";
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

function ConfettiPlayground({ onReset }: { onReset?: () => void }) {
  const [trigger, setTrigger] = useState(false);
  const [palette, setPalette] = useState<"monochrome" | "colorful">("monochrome");
  const [particleCount, setParticleCount] = useState(150);
  const [spread, setSpread] = useState(0.8);
  const [gravity, setGravity] = useState(0.5);
  const [wind, setWind] = useState(0.5);
  const [continuous, setContinuous] = useState(false);

  function fire() {
    setTrigger(false);
    setTimeout(() => setTrigger(true), 50);
  }

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

  const preview = (
    <div style={{ width: "100%", height: "100%", background: "#111111", position: "relative" }}>
      <Confetti trigger={trigger} palette={palette} particleCount={particleCount} spread={spread} gravity={gravity} wind={wind} continuous={continuous} width="100%" height="100%" />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ textAlign: "center", color: "#fff", fontFamily: "var(--mono)", opacity: 0.3 }}>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 4 }}>CELEBRATE</div>
        </div>
      </div>
      <PLiveLabel text="Click Launch to fire burst" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Palette" value={palette} options={["monochrome", "colorful"]} onChange={(v) => setPalette(v as "monochrome" | "colorful")} />
        <PDivider />
        <PButton label="Launch confetti" onClick={fire} />
        <PDivider />
        <PSlider label="Particle count" value={particleCount} min={20} max={400} step={10} onChange={setParticleCount} />
      </div>
      <div>
        <PSlider label="Spread" value={spread} min={0} max={1} step={0.05} onChange={setSpread} />
        <PSlider label="Gravity" value={gravity} min={0.1} max={2} step={0.1} onChange={setGravity} />
        <PSlider label="Wind" value={wind} min={0} max={3} step={0.1} onChange={setWind} />
        <PDivider />
        <PToggle label="Continuous" value={continuous} onChange={setContinuous} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function ConfettiPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Confetti"
      lead="Physics-based celebration confetti. Fire a burst on a rising trigger edge, or run as continuous particle rain."
    >
      <ConfettiPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
