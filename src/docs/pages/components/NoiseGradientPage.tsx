import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { NoiseGradient } from "../../../components/NoiseGradient";

const PROPS = [
  { name: "colors",   type: "string[]", default: "—",     description: "Array of 2–6 hex colors to blend between.", required: true },
  { name: "speed",    type: "number",   default: "0.3",   description: "Animation speed (0 = static)." },
  { name: "scale",    type: "number",   default: "1",     description: "Noise zoom level." },
  { name: "octaves",  type: "number",   default: "3",     description: "Perlin noise octaves (detail level)." },
  { name: "animated", type: "boolean",  default: "true",  description: "Enable animation. False renders a static image." },
];

const NOISE_PRESETS: Record<string, string[]> = {
  "Monochrome": ["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"],
  "Deep Space":  ["#0d0221", "#2d1b69", "#11998e", "#38ef7d"],
  "Sunset":      ["#0f0c29", "#ff6b6b", "#ffd89b"],
  "Ocean":       ["#0052d4", "#4364f7", "#6fb1fc"],
  "Plasma":      ["#12002f", "#7b00d4", "#ff00ff", "#ff9900"],
  "Forest":      ["#0a1628", "#1a5276", "#27ae60", "#f9e51b"],
};

function NoiseGradientPlayground() {
  const [preset, setPreset] = useState("Monochrome");
  const [speed, setSpeed] = useState(0.3);
  const [scale, setScale] = useState(1);
  const [octaves, setOctaves] = useState(3);
  const [animated, setAnimated] = useState(true);

  const colors = NOISE_PRESETS[preset];

  const code = [
    `import { NoiseGradient } from 'own-the-canvas';`,
    ``,
    `<NoiseGradient`,
    `  colors={${JSON.stringify(colors)}}`,
    `  speed={${speed}}`,
    `  scale={${scale}}`,
    `  octaves={${octaves}}`,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <NoiseGradient colors={colors} speed={speed} scale={scale} octaves={octaves} animated={animated} width="100%" height="100%" />
      <PLiveLabel text="Perlin noise gradient" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Palette" value={preset} options={Object.keys(NOISE_PRESETS)} onChange={setPreset} />
        <PDivider />
        <PSlider label="Speed" value={speed} min={0} max={2} step={0.05} onChange={setSpeed} />
        <PSlider label="Scale" value={scale} min={0.2} max={5} step={0.1} onChange={setScale} />
      </div>
      <div>
        <PSlider label="Octaves" value={octaves} min={1} max={6} step={1} onChange={setOctaves} />
        <PDivider />
        <PToggle label="Animated" value={animated} onChange={setAnimated} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function NoiseGradientPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="NoiseGradient"
      lead="Animated Perlin noise-driven color gradient. Pass any set of hex colors and they'll blend fluidly across the canvas."
    >
      <NoiseGradientPlayground />

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
