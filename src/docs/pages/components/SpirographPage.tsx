import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Spirograph } from "../../../components/Spirograph";

const PROPS = [
  { name: "outerRadius",     type: "number",  default: "0.85",     description: "Outer circle R as fraction of min(width,height)/2." },
  { name: "innerRadius",     type: "number",  default: "0.4",      description: "Inner circle r as fraction of outerRadius." },
  { name: "penDistance",     type: "number",  default: "0.9",      description: "Pen arm d as fraction of innerRadius." },
  { name: "speed",           type: "number",  default: "2",        description: "Degrees of angle drawn per frame." },
  { name: "color",           type: "string",  default: '"#ffffff"', description: "Curve stroke color." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background fill color." },
  { name: "lineWidth",       type: "number",  default: "1",        description: "Stroke line width." },
  { name: "trailFade",       type: "number",  default: "0.003",    description: "Background fade opacity per frame — lower = longer trails." },
  { name: "animated",        type: "boolean", default: "true",     description: "Enable animation." },
  { name: "autoReset",       type: "boolean", default: "true",     description: "Randomize and restart after each full cycle." },
  { name: "preset",          type: "string",  default: "—",        description: '"default" | "neon" | "minimal" | "cosmic" | "pastel"' },
];

function SpirographPlayground() {
  const [preset, setPreset] = useState("default");
  const [innerRadius, setInnerRadius] = useState(0.4);
  const [penDistance, setPenDistance] = useState(0.9);
  const [speed, setSpeed] = useState(2);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [lineWidth, setLineWidth] = useState(1);
  const [trailFade, setTrailFade] = useState(0.003);
  const [animated, setAnimated] = useState(true);
  const [autoReset, setAutoReset] = useState(true);

  const code = [
    `import { Spirograph } from 'own-the-canvas';`,
    ``,
    `<Spirograph`,
    `  preset="${preset}"`,
    `  innerRadius={${innerRadius}}`,
    `  penDistance={${penDistance}}`,
    `  speed={${speed}}`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  trailFade={${trailFade}}`,
    !animated ? `  animated={false}` : null,
    !autoReset ? `  autoReset={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Spirograph
        preset={preset}
        innerRadius={innerRadius}
        penDistance={penDistance}
        speed={speed}
        color={color}
        backgroundColor={bg}
        lineWidth={lineWidth}
        trailFade={trailFade}
        animated={animated}
        autoReset={autoReset}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "minimal", "cosmic", "pastel"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Color" value={color} onChange={setColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PDivider />
        <PToggle label="Animated" value={animated} onChange={setAnimated} />
        <PToggle label="Auto reset" value={autoReset} onChange={setAutoReset} />
      </div>
      <div>
        <PSlider label="Inner radius" value={innerRadius} min={0.1} max={0.9} step={0.01} onChange={setInnerRadius} />
        <PSlider label="Pen distance" value={penDistance} min={0.1} max={1.5} step={0.01} onChange={setPenDistance} />
        <PSlider label="Speed" value={speed} min={0.1} max={8} step={0.1} onChange={setSpeed} />
        <PSlider label="Line width" value={lineWidth} min={0.2} max={4} step={0.1} onChange={setLineWidth} />
        <PSlider label="Trail fade" value={trailFade} min={0} max={0.02} step={0.001} onChange={setTrailFade} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function SpirographPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Spirograph"
      lead="Hypotrochoid parametric curves drawn incrementally in real time. Adjusting inner radius and pen distance produces an infinite variety of petal, star, and loop patterns — each cycle fades into the next."
    >
      <SpirographPlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls. Try dragging inner radius slowly — each value produces a fundamentally different curve topology.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
