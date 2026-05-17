import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Shockwave } from "../../../components/Shockwave";

const PROPS = [
  { name: "color",           type: "string",  default: '"#ffffff"',     description: "Primary ring color." },
  { name: "secondaryColor",  type: "string",  default: '"#6b7280"',     description: "Alternating ring color." },
  { name: "ringCount",       type: "number",  default: "3",             description: "Number of rings per shockwave." },
  { name: "ringSpacing",     type: "number",  default: "20",            description: "Pixel gap between rings at spawn." },
  { name: "speed",           type: "number",  default: "4",             description: "Expansion speed in px/frame." },
  { name: "maxRadius",       type: "number",  default: "200",           description: "Max radius before ring fades." },
  { name: "lineWidth",       type: "number",  default: "2",             description: "Stroke line width." },
  { name: "fadeSpeed",       type: "number",  default: "0.02",          description: "Opacity decrease per frame." },
  { name: "autoFire",        type: "boolean", default: "false",         description: "Auto-fire shockwaves without clicks." },
  { name: "autoInterval",    type: "number",  default: "2000",          description: "Interval between auto-fires in ms." },
  { name: "glowEffect",      type: "boolean", default: "true",          description: "Glow effect on rings." },
  { name: "glowBlur",        type: "number",  default: "15",            description: "Shadow blur for glow." },
  { name: "backgroundColor", type: "string",  default: '"transparent"', description: "Canvas background color." },
  { name: "preset",          type: "string",  default: "—",             description: '"default" | "neon" | "explosion" | "ripple" | "minimal"' },
];

function ShockwavePlayground() {
  const [preset, setPreset] = useState("default");
  const [ringCount, setRingCount] = useState(3);
  const [speed, setSpeed] = useState(4);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [glow, setGlow] = useState(true);
  const [autoFire, setAutoFire] = useState(false);

  const code = [
    `import { Shockwave } from 'own-the-canvas';`,
    ``,
    `<Shockwave`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  ringCount={${ringCount}}`,
    `  speed={${speed}}`,
    glow ? null : `  glowEffect={false}`,
    autoFire ? `  autoFire` : null,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Shockwave preset={preset} ringCount={ringCount} speed={speed}
        color={color} backgroundColor={bg} glowEffect={glow}
        autoFire={autoFire} autoInterval={1500} width="100%" height="100%" />
      <PLiveLabel text="Click canvas to fire" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "explosion", "ripple", "minimal"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Ring color" value={color} onChange={setColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Ring count" value={ringCount} min={1} max={8} step={1} onChange={setRingCount} />
        <PSlider label="Speed" value={speed} min={1} max={12} step={0.5} onChange={setSpeed} />
        <PDivider />
        <PToggle label="Glow effect" value={glow} onChange={setGlow} />
        <PToggle label="Auto-fire" value={autoFire} onChange={setAutoFire} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function ShockwavePage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Shockwave"
      lead="Click-triggered expanding ring blast with glow. Each click spawns a set of concentric rings that expand and fade — great for click feedback and game effects."
    >
      <ShockwavePlayground />

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
