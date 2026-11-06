import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { AuroraBorealis } from "../../../components/AuroraBorealis";

const PROPS = [
  { name: "colors",          type: "string[]", default: '["#00ff88", "#00ccff", "#88ff00"]', description: "Aurora band colors — each layer cycles through the array." },
  { name: "speed",           type: "number",   default: "1",        description: "Animation speed multiplier." },
  { name: "intensity",       type: "number",   default: "0.8",      description: "Band brightness and opacity 0–1." },
  { name: "layers",          type: "number",   default: "5",        description: "Number of aurora layers." },
  { name: "backgroundColor", type: "string",   default: '"#050a0f"', description: "Sky background color." },
  { name: "waveAmplitude",   type: "number",   default: "0.15",     description: "Wave height as fraction of canvas height." },
  { name: "waveFrequency",   type: "number",   default: "2",        description: "Wave oscillations across canvas width." },
  { name: "starCount",       type: "number",   default: "80",       description: "Number of background stars." },
  { name: "animated",        type: "boolean",  default: "true",     description: "Enable animation loop." },
  { name: "interactive",     type: "boolean",  default: "true",     description: "The cursor brightens the curtains near it; a tap sets off a substorm surge." },
  { name: "preset",          type: "string",   default: "—",        description: '"default" | "arctic" | "solar" | "tropical" | "neon" | "midnight" | "monochrome"' },
];

function AuroraBorealisPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(0.8);
  const [layers, setLayers] = useState(5);
  const [waveAmplitude, setWaveAmplitude] = useState(0.15);
  const [waveFrequency, setWaveFrequency] = useState(2);
  const [starCount, setStarCount] = useState(80);
  const [bg, setBg] = useState("#050a0f");
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
      <PLiveLabel text="Sweep the sky · tap for a substorm" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "arctic", "solar", "tropical", "neon", "midnight", "monochrome"]} onChange={setPreset} />
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

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function AuroraBorealisPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="AuroraBorealis"
      lead="Northern lights over a mountain lake. Each layer is a folding curtain of vertical rays with a sharp bright hem that fades upward into a second color, brightest where it folds back on itself, mirrored in the still water below. Sweep the cursor across the sky to brighten the curtains; tap to set off a substorm."
    >
      <AuroraBorealisPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
