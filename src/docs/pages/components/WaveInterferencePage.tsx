import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { WaveInterference } from "../../../components/WaveInterference";

const PROPS = [
  { name: "maxSources",      type: "number",  default: "6",        description: "Maximum number of wave sources that can be placed." },
  { name: "wavelength",      type: "number",  default: "80",       description: "Wave wavelength in pixels." },
  { name: "speed",           type: "number",  default: "1",        description: "Wave propagation speed multiplier." },
  { name: "colorHigh",       type: "string",  default: '"#ffffff"', description: "Color at constructive interference peaks." },
  { name: "colorLow",        type: "string",  default: '"#111111"', description: "Color at destructive interference troughs." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "showSources",     type: "boolean", default: "true",     description: "Show circular markers at wave source positions." },
  { name: "resolution",      type: "number",  default: "0.4",      description: "Render resolution fraction — lower is faster." },
  { name: "animated",        type: "boolean", default: "true",     description: "Enable animation loop." },
  { name: "decay",           type: "number",  default: "0.003",    description: "Amplitude decay rate with distance from source." },
  { name: "preset",          type: "string",  default: "—",        description: '"default" | "ripple" | "plasma" | "neon" | "cosmic"' },
];

function WaveInterferencePlayground() {
  const [preset, setPreset] = useState("default");
  const [wavelength, setWavelength] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [decay, setDecay] = useState(0.003);
  const [resolution, setResolution] = useState(0.4);
  const [colorHigh, setColorHigh] = useState("#ffffff");
  const [colorLow, setColorLow] = useState("#111111");
  const [showSources, setShowSources] = useState(true);
  const [animated, setAnimated] = useState(true);

  const code = [
    `import { WaveInterference } from 'own-the-canvas';`,
    ``,
    `<WaveInterference`,
    `  preset="${preset}"`,
    `  wavelength={${wavelength}}`,
    `  speed={${speed}}`,
    `  decay={${decay}}`,
    `  resolution={${resolution}}`,
    `  colorHigh="${colorHigh}"`,
    `  colorLow="${colorLow}"`,
    !showSources ? `  showSources={false}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <WaveInterference
        preset={preset}
        wavelength={wavelength}
        speed={speed}
        decay={decay}
        resolution={resolution}
        colorHigh={colorHigh}
        colorLow={colorLow}
        showSources={showSources}
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
        <PSel label="Preset" value={preset} options={["default", "ripple", "plasma", "neon", "cosmic"]} onChange={setPreset} />
        <PDivider />
        <PColor label="High color" value={colorHigh} onChange={setColorHigh} />
        <PColor label="Low color" value={colorLow} onChange={setColorLow} />
        <PDivider />
        <PToggle label="Show sources" value={showSources} onChange={setShowSources} />
        <PToggle label="Animated" value={animated} onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Wavelength" value={wavelength} min={20} max={200} step={5} onChange={setWavelength} />
        <PSlider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
        <PSlider label="Decay" value={decay} min={0} max={0.01} step={0.0005} onChange={setDecay} />
        <PSlider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setResolution} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function WaveInterferencePage() {
  return (
    <PageShell
      eyebrow="Component"
      title="WaveInterference"
      lead="Real-time wave superposition from multiple point sources. Click anywhere to add a source, click an existing source to remove it. Constructive and destructive interference fringes appear instantly."
    >
      <WaveInterferencePlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Click on the canvas to place wave sources — interference patterns form automatically. Click an existing source marker to remove it. Adjust wavelength and speed to change fringe density and animation pace.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
