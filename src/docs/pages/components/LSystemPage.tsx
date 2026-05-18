import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { LSystem } from "../../../components/LSystem";

const PROPS = [
  { name: "axiom",          type: "string",            default: '"X"',        description: "Starting L-system axiom string." },
  { name: "rules",          type: "Record<string,string>", default: '—',      description: "Production rules map — e.g. { F: \"F+F-F\" }." },
  { name: "iterations",     type: "number",            default: "4",          description: "Number of string rewriting iterations." },
  { name: "angle",          type: "number",            default: "25",         description: "Turtle turning angle in degrees." },
  { name: "lineWidth",      type: "number",            default: "1",          description: "Stroke line width." },
  { name: "color",          type: "string",            default: '"#ffffff"',  description: "Branch stroke color." },
  { name: "backgroundColor",type: "string",            default: '"#111111"',  description: "Canvas background color." },
  { name: "speed",          type: "number",            default: "5",          description: "Segments drawn per frame — 1 for slow stroke-by-stroke reveal, 10 for fast draw." },
  { name: "autoReset",      type: "boolean",           default: "true",       description: "Restart animation after full draw." },
  { name: "trailFade",      type: "number",            default: "0",          description: "Background fade opacity between cycles — 0 = hard clear." },
  { name: "glowEffect",     type: "boolean",           default: "false",      description: "Enable glow shadow on branches." },
  { name: "glowBlur",       type: "number",            default: "8",          description: "Shadow blur radius when glowEffect is enabled." },
  { name: "preset",         type: "string",            default: "—",          description: '"default" | "fern" | "dragon" | "sierpinski" | "bush" | "snowflake"' },
];

const PRESET_PARAMS = {
  default:    { angle: 25 },
  fern:       { angle: 22 },
  dragon:     { angle: 90 },
  sierpinski: { angle: 120 },
  bush:       { angle: 25 },
  snowflake:  { angle: 60 },
};

function LSystemPlayground() {
  const [preset, setPreset]         = useState("default");
  const [angle, setAngle]           = useState(25);
  const [lineWidth, setLineWidth]   = useState(1);
  const [color, setColor]           = useState("#ffffff");
  const [bg, setBg]                 = useState("#111111");
  const [speed, setSpeed]           = useState(5);
  const [autoReset, setAutoReset]   = useState(true);
  const [trailFade, setTrailFade]   = useState(0);
  const [glowEffect, setGlowEffect] = useState(false);
  const [glowBlur, setGlowBlur]     = useState(8);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (pp) setAngle(pp.angle);
  }

  const code = [
    `import { LSystem } from 'own-the-canvas';`,
    ``,
    `<LSystem`,
    `  preset="${preset}"`,
    angle !== 25 ? `  angle={${angle}}` : null,
    lineWidth !== 1 ? `  lineWidth={${lineWidth}}` : null,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    speed !== 5 ? `  speed={${speed}}` : null,
    trailFade > 0 ? `  trailFade={${trailFade}}` : null,
    glowEffect ? `  glowEffect` : null,
    glowEffect && glowBlur !== 8 ? `  glowBlur={${glowBlur}}` : null,
    !autoReset ? `  autoReset={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LSystem
        preset={preset}
        angle={angle}
        lineWidth={lineWidth}
        color={color}
        backgroundColor={bg}
        speed={speed}
        autoReset={autoReset}
        trailFade={trailFade}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "fern", "dragon", "sierpinski", "bush", "snowflake"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Color"      value={color} onChange={setColor} />
        <PColor label="Background" value={bg}    onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
        <PToggle label="Auto reset"  value={autoReset}  onChange={setAutoReset} />
      </div>
      <div>
        <PSlider label="Angle"      value={angle}     min={10}  max={90}   step={1}   onChange={setAngle} />
        <PSlider label="Line width" value={lineWidth} min={0.5} max={4}    step={0.1} onChange={setLineWidth} />
        <PSlider label="Speed"      value={speed}     min={1}   max={10}   step={1}   onChange={setSpeed} />
        <PSlider label="Trail fade" value={trailFade} min={0}   max={0.05} step={0.002} onChange={setTrailFade} />
        {glowEffect && <PSlider label="Glow blur" value={glowBlur} min={2} max={30} step={1} onChange={setGlowBlur} />}
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function LSystemPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="LSystem"
      lead="Lindenmayer system fractals drawn incrementally — watch fractal trees, ferns, snowflakes, and dragon curves grow stroke by stroke. Each preset is a different grammar producing a completely different visual species."
    >
      <LSystemPlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Switch presets to explore different L-system grammars. The <strong>angle</strong> slider dramatically changes the shape of any preset — try dragging it slowly on the <strong>default</strong> plant. Use the <strong>speed</strong> slider (1–10) to control how fast branches grow: 1 is a slow stroke-by-stroke reveal, 10 draws quickly. Enable <strong>trail fade</strong> for a ghosting effect where new growth blends over old cycles. For custom L-systems, pass <code>axiom</code> and <code>rules</code> props directly.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
