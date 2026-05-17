import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Lightning } from "../../../components/Lightning";

const PROPS = [
  { name: "segments",        type: "number",  default: "8",         description: "Recursion depth — more segments = finer bolt detail." },
  { name: "roughness",       type: "number",  default: "0.5",       description: "Midpoint displacement roughness 0–1." },
  { name: "branchChance",    type: "number",  default: "0.3",       description: "Probability of a branch at each segment." },
  { name: "branchDecay",     type: "number",  default: "0.6",       description: "Energy multiplier for sub-branches." },
  { name: "flickerCount",    type: "number",  default: "3",         description: "Rapid flicker strikes per event." },
  { name: "glowBlur",        type: "number",  default: "20",        description: "Glow shadow blur radius." },
  { name: "color",           type: "string",  default: '"#6b7280"', description: "Bolt glow color." },
  { name: "coreColor",       type: "string",  default: '"#ffffff"', description: "Inner bright core color." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "autoInterval",    type: "number",  default: "2000",      description: "Ms between automatic strikes." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Click to trigger a strike at cursor." },
  { name: "startX",          type: "number",  default: "0.5",       description: "Strike origin X as fraction of width." },
  { name: "startY",          type: "number",  default: "0",         description: "Strike origin Y as fraction of height." },
  { name: "endY",            type: "number",  default: "1",         description: "Strike end Y as fraction of height." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "neon" | "storm" | "plasma" | "subtle"' },
];

function LightningPlayground() {
  const [preset, setPreset] = useState("default");
  const [color, setColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [branchChance, setBranchChance] = useState(0.3);
  const [glowBlur, setGlowBlur] = useState(20);
  const [autoInterval, setAutoInterval] = useState(2000);

  const code = [
    `import { Lightning } from 'own-the-canvas';`,
    ``,
    `<Lightning`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  branchChance={${branchChance}}`,
    `  glowBlur={${glowBlur}}`,
    `  autoInterval={${autoInterval}}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Lightning preset={preset} color={color} branchChance={branchChance}
        glowBlur={glowBlur} autoInterval={autoInterval}
        backgroundColor={bg} width="100%" height="100%" />
      <PLiveLabel text="Click to strike" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "storm", "plasma", "subtle"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Bolt color" value={color} onChange={setColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Branch chance" value={branchChance} min={0} max={0.8} step={0.05} onChange={setBranchChance} />
        <PSlider label="Glow blur" value={glowBlur} min={0} max={60} step={2} onChange={setGlowBlur} />
        <PSlider label="Auto interval (ms)" value={autoInterval} min={500} max={6000} step={100} onChange={setAutoInterval} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function LightningPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Lightning"
      lead="Recursive fractal branching lightning bolts with glow, flicker, and auto-strike. Click anywhere to trigger a strike — or let it fire automatically."
    >
      <LightningPlayground />

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
