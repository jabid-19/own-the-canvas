import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { AuroraBorealis } from "../../../components/AuroraBorealis";

const PROPS = [
  { name: "colors",          type: "string[]", default: '["#ffffff","#6b7280","#9ca3af"]', description: "Aurora band colors — each layer cycles through the array." },
  { name: "speed",           type: "number",   default: "1",        description: "Animation speed multiplier." },
  { name: "intensity",       type: "number",   default: "0.8",      description: "Band brightness and opacity 0–1." },
  { name: "layers",          type: "number",   default: "5",        description: "Number of aurora layers." },
  { name: "backgroundColor", type: "string",   default: '"#111111"', description: "Sky background color." },
  { name: "waveAmplitude",   type: "number",   default: "0.15",     description: "Wave height as fraction of canvas height." },
  { name: "waveFrequency",   type: "number",   default: "2",        description: "Wave oscillations across canvas width." },
  { name: "starCount",       type: "number",   default: "80",       description: "Number of background stars." },
  { name: "animated",        type: "boolean",  default: "true",     description: "Enable animation loop." },
  { name: "preset",          type: "string",   default: "—",        description: '"default" | "arctic" | "solar" | "tropical" | "neon" | "midnight"' },
];

function AuroraBorealisPlayground() {
  const [preset, setPreset] = useState("default");
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(0.8);
  const [layers, setLayers] = useState(5);
  const [waveAmplitude, setWaveAmplitude] = useState(0.15);
  const [waveFrequency, setWaveFrequency] = useState(2);
  const [starCount, setStarCount] = useState(80);
  const [bg, setBg] = useState("#111111");
  const [animated, setAnimated] = useState(true);

  const code = [
    `import { AuroraBorealis } from 'own-the-canvas';`,
    ``,
    `<AuroraBorealis`,
    `  preset="${preset}"`,
    `  speed={${speed}}`,
    `  intensity={${intensity}}`,
    `  layers={${layers}}`,
    `  waveAmplitude={${waveAmplitude}}`,
    `  waveFrequency={${waveFrequency}}`,
    `  starCount={${starCount}}`,
    `  backgroundColor="${bg}"`,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <AuroraBorealis
        preset={preset}
        speed={speed}
        intensity={intensity}
        layers={layers}
        waveAmplitude={waveAmplitude}
        waveFrequency={waveFrequency}
        starCount={starCount}
        backgroundColor={bg}
        animated={animated}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "arctic", "solar", "tropical", "neon", "midnight"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PDivider />
        <PToggle label="Animated" value={animated} onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
        <PSlider label="Intensity" value={intensity} min={0.1} max={1} step={0.05} onChange={setIntensity} />
        <PSlider label="Layers" value={layers} min={1} max={10} step={1} onChange={setLayers} />
        <PSlider label="Wave amplitude" value={waveAmplitude} min={0.02} max={0.4} step={0.01} onChange={setWaveAmplitude} />
        <PSlider label="Wave frequency" value={waveFrequency} min={0.5} max={6} step={0.5} onChange={setWaveFrequency} />
        <PSlider label="Stars" value={starCount} min={0} max={300} step={10} onChange={setStarCount} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function AuroraBorealisPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="AuroraBorealis"
      lead="Animated northern lights with layered sine-wave curtains, vertical streaks, and a star field. Uses additive screen blending to build luminous, overlapping color bands."
    >
      <AuroraBorealisPlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls. Switch presets to jump between color palettes — arctic gives classic green/teal, solar gives warm reds and purples.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
