import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Fireworks } from "../../../components/Fireworks";

const PROPS = [
  { name: "colors",          type: "string[]", default: "multi",     description: "Particle burst colors." },
  { name: "particleCount",   type: "number",   default: "80",        description: "Particles per explosion." },
  { name: "gravity",         type: "number",   default: "0.08",      description: "Gravity pull per frame." },
  { name: "friction",        type: "number",   default: "0.97",      description: "Velocity friction 0–1." },
  { name: "fadeSpeed",       type: "number",   default: "0.015",     description: "Alpha fade per frame." },
  { name: "particleSize",    type: "number",   default: "2",         description: "Particle base size in px." },
  { name: "trailLength",     type: "number",   default: "6",         description: "Trail history length in frames." },
  { name: "spread",          type: "number",   default: "5",         description: "Explosion spread speed." },
  { name: "autoLaunch",      type: "boolean",  default: "true",      description: "Auto-launch shells periodically." },
  { name: "autoInterval",    type: "number",   default: "1800",      description: "Average ms between auto-launches." },
  { name: "glowEffect",      type: "boolean",  default: "true",      description: "Glow on particles." },
  { name: "glowBlur",        type: "number",   default: "8",         description: "Shadow blur for glow." },
  { name: "backgroundColor", type: "string",   default: '"#111111"', description: "Canvas background color." },
  { name: "shellSpeed",      type: "number",   default: "12",        description: "Shell upward speed." },
  { name: "preset",          type: "string",   default: "—",         description: '"default" | "celebration" | "subtle" | "neon" | "golden"' },
];

function FireworksPlayground() {
  const [preset, setPreset] = useState("default");
  const [count, setCount] = useState(80);
  const [gravity, setGravity] = useState(0.08);
  const [spread, setSpread] = useState(5);
  const [bg, setBg] = useState("#111111");
  const [autoLaunch, setAutoLaunch] = useState(true);
  const [glow, setGlow] = useState(true);

  const code = [
    `import { Fireworks } from 'own-the-canvas';`,
    ``,
    `<Fireworks`,
    `  preset="${preset}"`,
    `  particleCount={${count}}`,
    `  gravity={${gravity}}`,
    `  spread={${spread}}`,
    autoLaunch ? null : `  autoLaunch={false}`,
    glow ? null : `  glowEffect={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Fireworks preset={preset} particleCount={count} gravity={gravity}
        spread={spread} backgroundColor={bg} autoLaunch={autoLaunch}
        glowEffect={glow} width="100%" height="100%" />
      <PLiveLabel text="Click to launch a shell" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "celebration", "subtle", "neon", "golden"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSlider label="Particle count" value={count} min={20} max={200} step={10} onChange={setCount} />
      </div>
      <div>
        <PSlider label="Gravity" value={gravity} min={0.01} max={0.3} step={0.01} onChange={setGravity} />
        <PSlider label="Spread" value={spread} min={2} max={10} step={0.5} onChange={setSpread} />
        <PDivider />
        <PToggle label="Auto-launch" value={autoLaunch} onChange={setAutoLaunch} />
        <PToggle label="Glow effect" value={glow} onChange={setGlow} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function FireworksPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Fireworks"
      lead="Physics-based fireworks with launching shells, particle bursts, gravity trails, and glow. Click to launch a shell, or let auto-launch handle it."
    >
      <FireworksPlayground />

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
