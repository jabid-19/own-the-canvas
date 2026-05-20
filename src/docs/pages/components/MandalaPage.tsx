import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Mandala } from "../../../components/Mandala";

const PROPS = [
  { name: "symmetry",        type: "number",  default: "8",         description: "Number of rotational symmetry arms." },
  { name: "colors",          type: "string[]",default: "multi",     description: "Stroke colors cycled per layer." },
  { name: "lineWidth",       type: "number",  default: "1.5",       description: "Stroke line width." },
  { name: "speed",           type: "number",  default: "1",         description: "Rotation animation speed." },
  { name: "layers",          type: "number",  default: "5",         description: "Number of concentric petal layers." },
  { name: "radius",          type: "number",  default: "1",         description: "Outer radius as fraction of canvas min dimension." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "animated",        type: "boolean", default: "true",      description: "Enable rotation animation." },
  { name: "glowEffect",      type: "boolean", default: "true",      description: "Glow effect on strokes." },
  { name: "glowBlur",        type: "number",  default: "10",        description: "Shadow blur for glow." },
  { name: "strokeOpacity",   type: "number",  default: "0.8",       description: "Layer stroke opacity 0–1." },
  { name: "mirror",          type: "boolean", default: "true",      description: "Mirror each arm for bilateral symmetry." },
  { name: "noiseAmount",     type: "number",  default: "0.3",       description: "Organic noise distortion 0–1." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "neon" | "lotus" | "cosmic" | "minimal"' },
];

function MandalaPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [symmetry, setSymmetry] = useState(8);
  const [layers, setLayers] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [bg, setBg] = useState("#111111");
  const [mirror, setMirror] = useState(true);
  const [glow, setGlow] = useState(true);

  const code = [
    `import { Mandala } from 'own-the-canvas';`,
    ``,
    `<Mandala`,
    `  preset="${preset}"`,
    `  symmetry={${symmetry}}`,
    `  layers={${layers}}`,
    `  speed={${speed}}`,
    mirror ? null : `  mirror={false}`,
    glow ? null : `  glowEffect={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Mandala preset={preset} symmetry={symmetry} layers={layers} speed={speed}
        mirror={mirror} glowEffect={glow} backgroundColor={bg}
        width="100%" height="100%" />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "lotus", "cosmic", "minimal"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSlider label="Symmetry arms" value={symmetry} min={3} max={24} step={1} onChange={setSymmetry} />
      </div>
      <div>
        <PSlider label="Layers" value={layers} min={1} max={8} step={1} onChange={setLayers} />
        <PSlider label="Speed" value={speed} min={0} max={3} step={0.1} onChange={setSpeed} />
        <PDivider />
        <PToggle label="Bilateral mirror" value={mirror} onChange={setMirror} />
        <PToggle label="Glow effect" value={glow} onChange={setGlow} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function MandalaPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Mandala"
      lead="Animated N-fold rotational symmetry with layered organic petal shapes. Controllable symmetry arms, bilateral mirroring, and noise distortion for natural-looking geometry."
    >
      <MandalaPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
