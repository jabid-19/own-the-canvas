import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { RippleEffect } from "../../../components/RippleEffect";

const PROPS = [
  { name: "color",       type: "string",  default: '"#ffffff"', description: "Ring color." },
  { name: "maxRadius",   type: "number",  default: "150",       description: "Maximum ring expansion radius." },
  { name: "speed",       type: "number",  default: "2",         description: "Ring expansion speed." },
  { name: "lineWidth",   type: "number",  default: "1.5",       description: "Ring stroke width." },
  { name: "decay",       type: "number",  default: "0.8",       description: "Opacity decay rate per frame." },
  { name: "multiRipple", type: "boolean", default: "true",      description: "Allow multiple simultaneous rings." },
  { name: "interactive", type: "boolean", default: "true",      description: "Click to spawn ripples. False = auto mode." },
  { name: "backgroundColor", type: "string", default: '"transparent"', description: "Canvas background color." },
];

function RippleEffectPlayground() {
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [maxRadius, setMaxRadius] = useState(150);
  const [speed, setSpeed] = useState(2);
  const [lineWidth, setLineWidth] = useState(1.5);
  const [decay, setDecay] = useState(0.8);
  const [multiRipple, setMultiRipple] = useState(true);
  const [interactive, setInteractive] = useState(true);

  const code = [
    `import { RippleEffect } from 'own-the-canvas';`,
    ``,
    `<RippleEffect`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  maxRadius={${maxRadius}}`,
    `  speed={${speed}}`,
    `  lineWidth={${lineWidth}}`,
    `  decay={${decay}}`,
    !multiRipple ? `  multiRipple={false}` : null,
    !interactive ? `  interactive={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", background: bg, position: "relative" }}>
      <RippleEffect
        color={color}
        backgroundColor="transparent"
        maxRadius={maxRadius}
        speed={speed}
        lineWidth={lineWidth}
        decay={decay}
        multiRipple={multiRipple}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text={interactive ? "Click to spawn ripples" : "Auto-ripple mode"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PColor label="Ring color" value={color} onChange={setColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PDivider />
        <PSlider label="Max radius" value={maxRadius} min={30} max={300} step={10} onChange={setMaxRadius} />
        <PSlider label="Speed" value={speed} min={0.5} max={10} step={0.5} onChange={setSpeed} />
      </div>
      <div>
        <PSlider label="Line width" value={lineWidth} min={0.5} max={6} step={0.5} onChange={setLineWidth} />
        <PSlider label="Decay" value={decay} min={0.5} max={0.99} step={0.01} onChange={setDecay} />
        <PDivider />
        <PToggle label="Multi ripple" value={multiRipple} onChange={setMultiRipple} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function RippleEffectPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="RippleEffect"
      lead="Expanding concentric ring animations. Click the canvas to spawn ripples, or set interactive={false} for autonomous auto-ripple mode."
    >
      <RippleEffectPlayground />

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
