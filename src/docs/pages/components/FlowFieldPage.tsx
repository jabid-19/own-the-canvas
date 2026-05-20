import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { FlowField } from "../../../components/FlowField";

const PROPS = [
  { name: "particleCount",   type: "number",   default: "800",       description: "Number of flow particles." },
  { name: "colors",          type: "string[]", default: "multi",     description: "Particle stroke colors — one picked per particle." },
  { name: "speed",           type: "number",   default: "1",         description: "Flow speed multiplier." },
  { name: "noiseScale",      type: "number",   default: "0.004",     description: "Noise sampling scale — lower = larger flow structures." },
  { name: "trailLength",     type: "number",   default: "0.04",      description: "Trail fade length — lower = longer trails." },
  { name: "fadeStrength",    type: "number",   default: "0.04",      description: "Background fade opacity per frame." },
  { name: "lineWidth",       type: "number",   default: "1",         description: "Stroke line width in px." },
  { name: "backgroundColor", type: "string",   default: '"#111111"', description: "Canvas background color." },
  { name: "animated",        type: "boolean",  default: "true",      description: "Enable animation loop." },
  { name: "timeSpeed",       type: "number",   default: "1",         description: "How fast the noise field evolves." },
  { name: "curl",            type: "boolean",  default: "false",     description: "Add curl noise for more swirling flow." },
  { name: "preset",          type: "string",   default: "—",         description: '"default" | "neon" | "ocean" | "lava" | "forest" | "monochrome"' },
];

function FlowFieldPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [count, setCount] = useState(800);
  const [speed, setSpeed] = useState(1);
  const [curl, setCurl] = useState(false);
  const [lineWidth, setLineWidth] = useState(1);
  const [bg, setBg] = useState("#111111");

  const code = [
    `import { FlowField } from 'own-the-canvas';`,
    ``,
    `<FlowField`,
    `  preset="${preset}"`,
    `  particleCount={${count}}`,
    `  speed={${speed}}`,
    `  lineWidth={${lineWidth}}`,
    curl ? `  curl` : null,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <FlowField preset={preset} particleCount={count} speed={speed}
        curl={curl} lineWidth={lineWidth} backgroundColor={bg}
        width="100%" height="100%" />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "ocean", "lava", "forest", "monochrome"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSlider label="Particle count" value={count} min={100} max={2000} step={50} onChange={setCount} />
      </div>
      <div>
        <PSlider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
        <PSlider label="Line width" value={lineWidth} min={0.5} max={4} step={0.5} onChange={setLineWidth} />
        <PDivider />
        <PToggle label="Curl noise" value={curl} onChange={setCurl} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function FlowFieldPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="FlowField"
      lead="Perlin noise vector field that guides particle streams. Particles follow smooth, evolving flow directions — add curl noise for extra swirling character."
    >
      <FlowFieldPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
