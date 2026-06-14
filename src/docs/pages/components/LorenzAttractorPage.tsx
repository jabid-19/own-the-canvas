import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import {
  PlaygroundShell,
  PSel,
  PSlider,
  PColor,
  PToggle,
  PDivider,
  PLiveLabel,
} from "../../components/PlaygroundControls";
import { LorenzAttractor } from "../../../components/LorenzAttractor";

const PROPS = [
  { name: "sigma",           type: "number",  default: "10",       description: "Lorenz σ — rate of convection. Higher values speed up the system." },
  { name: "rho",             type: "number",  default: "28",       description: "Lorenz ρ — temperature gradient. Classic chaos threshold is ~24.74." },
  { name: "beta",            type: "number",  default: "2.667",    description: "Lorenz β — geometric factor. Classic value is 8/3 ≈ 2.667." },
  { name: "traceColor",      type: "string",  default: '"#ffffff"', description: "Trail stroke color. In cycle mode this acts as a hue seed." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background fill color." },
  { name: "trailLength",     type: "number",  default: "3000",     description: "Maximum ring-buffer size. Larger values show more trail history." },
  { name: "speed",           type: "number",  default: "1",        description: "Integration speed multiplier. Controls steps per animation frame." },
  { name: "rotationSpeed",   type: "number",  default: "0.003",    description: "Auto-rotation speed in radians per frame around the Y axis." },
  { name: "lineWidth",       type: "number",  default: "1",        description: "Trail stroke width in CSS pixels." },
  { name: "glowEffect",      type: "boolean", default: "false",    description: "Enable canvas shadow-blur glow on the trail." },
  { name: "glowBlur",        type: "number",  default: "10",       description: "Glow blur radius when glowEffect is true." },
  { name: "interactive",     type: "boolean", default: "true",     description: "Enable mouse-drag orbit. Drag to rotate; auto-resumes after 2s." },
  { name: "scale",           type: "number",  default: "1",        description: "Zoom scale multiplier on top of the auto-fitting base scale." },
  { name: "colorMode",       type: "string",  default: '"age"',    description: '"solid" | "age" | "cycle" — solid uses one color, age fades old points, cycle rotates hue along the trail.' },
  { name: "animated",        type: "boolean", default: "true",     description: "Enable the animation loop. Set false to freeze." },
  { name: "preset",          type: "string",  default: "—",        description: '"default" | "neon" | "cosmic" | "ghost" | "chaos" | "minimal"' },
];

const LORENZ_PRESETS: Record<string, { sigma: number; rho: number; beta: number; traceColor: string; bg: string; trailLength: number; rotationSpeed: number; lineWidth: number; glowEffect: boolean; colorMode: string }> = {
  default: { sigma: 10, rho: 28, beta: 2.667, traceColor: "#ffffff", bg: "#111111", trailLength: 3000, rotationSpeed: 0.003, lineWidth: 1, glowEffect: false, colorMode: "age" },
  neon:    { sigma: 10, rho: 28, beta: 2.667, traceColor: "#00ffcc", bg: "#000000", trailLength: 3000, rotationSpeed: 0.003, lineWidth: 1, glowEffect: true,  colorMode: "cycle" },
  cosmic:  { sigma: 10, rho: 28, beta: 2.667, traceColor: "#c084fc", bg: "#030014", trailLength: 3000, rotationSpeed: 0.003, lineWidth: 1, glowEffect: true,  colorMode: "age" },
  ghost:   { sigma: 10, rho: 28, beta: 2.667, traceColor: "#ffffff", bg: "#111111", trailLength: 5000, rotationSpeed: 0.003, lineWidth: 0.5, glowEffect: false, colorMode: "age" },
  chaos:   { sigma: 14, rho: 35, beta: 2.2,   traceColor: "#ff4444", bg: "#0a0000", trailLength: 3000, rotationSpeed: 0.003, lineWidth: 1, glowEffect: false, colorMode: "age" },
  minimal: { sigma: 10, rho: 28, beta: 2.667, traceColor: "#6b7280", bg: "#111111", trailLength: 3000, rotationSpeed: 0.003, lineWidth: 1, glowEffect: false, colorMode: "solid" },
};

function LorenzAttractorPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]               = useState("default");
  const [sigma, setSigma]                 = useState(10);
  const [rho, setRho]                     = useState(28);
  const [beta, setBeta]                   = useState(2.667);
  const [trailLength, setTrailLength]     = useState(3000);
  const [rotationSpeed, setRotationSpeed] = useState(0.003);
  const [lineWidth, setLineWidth]         = useState(1);
  const [traceColor, setTraceColor]       = useState("#ffffff");
  const [bg, setBg]                       = useState("#111111");
  const [glowEffect, setGlowEffect]       = useState(false);
  const [colorMode, setColorMode]         = useState("age");

  function onPresetChange(p: string) {
    setPreset(p);
    const v = LORENZ_PRESETS[p] ?? LORENZ_PRESETS.default;
    setSigma(v.sigma);
    setRho(v.rho);
    setBeta(v.beta);
    setTraceColor(v.traceColor);
    setBg(v.bg);
    setTrailLength(v.trailLength);
    setRotationSpeed(v.rotationSpeed);
    setLineWidth(v.lineWidth);
    setGlowEffect(v.glowEffect);
    setColorMode(v.colorMode);
  }

  const code = [
    `import { LorenzAttractor } from 'own-the-canvas';`,
    ``,
    `<LorenzAttractor`,
    `  preset="${preset}"`,
    `  sigma={${sigma}}`,
    `  rho={${rho}}`,
    `  beta={${beta}}`,
    `  trailLength={${trailLength}}`,
    `  rotationSpeed={${rotationSpeed}}`,
    `  lineWidth={${lineWidth}}`,
    `  traceColor="${traceColor}"`,
    `  backgroundColor="${bg}"`,
    glowEffect ? `  glowEffect` : null,
    `  colorMode="${colorMode}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ]
    .filter(Boolean)
    .join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LorenzAttractor
        preset={preset}
        sigma={sigma}
        rho={rho}
        beta={beta}
        trailLength={trailLength}
        rotationSpeed={rotationSpeed}
        lineWidth={lineWidth}
        traceColor={traceColor}
        backgroundColor={bg}
        glowEffect={glowEffect}
        colorMode={colorMode as "solid" | "age" | "cycle"}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Drag to rotate · Auto-resumes after 2s" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel
          label="Preset"
          value={preset}
          options={["default", "neon", "cosmic", "ghost", "chaos", "minimal"]}
          onChange={onPresetChange}
        />
        <PDivider />
        <PSel
          label="Color mode"
          value={colorMode}
          options={["solid", "age", "cycle"]}
          onChange={setColorMode}
        />
        <PDivider />
        <PColor label="Trace color"  value={traceColor} onChange={setTraceColor} />
        <PColor label="Background"   value={bg}         onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
      </div>
      <div>
        <PSlider label="Sigma"          value={sigma}         min={5}    max={20}   step={0.5}    onChange={setSigma} />
        <PSlider label="Rho"            value={rho}           min={10}   max={50}   step={0.5}    onChange={setRho} />
        <PSlider label="Beta"           value={beta}          min={1}    max={4}    step={0.1}    onChange={setBeta} />
        <PSlider label="Trail length"   value={trailLength}   min={500}  max={8000} step={100}    onChange={setTrailLength} />
        <PSlider label="Rotation speed" value={rotationSpeed} min={0}    max={0.02} step={0.0005} onChange={setRotationSpeed} />
        <PSlider label="Line width"     value={lineWidth}     min={0.25} max={4}    step={0.25}   onChange={setLineWidth} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function LorenzAttractorPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="LorenzAttractor"
      lead="Chaos made visible — Edward Lorenz's strange attractor integrated in real time and projected into 3D space. The butterfly never repeats itself. Drag to orbit; release to let it spin."
    >
      <LorenzAttractorPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The attractor grows one frame at a time using a 4th-order Runge–Kutta integrator with dt&nbsp;=&nbsp;0.005.
          Each frame adds up to 10 &times; <em>speed</em> points to a fixed-size ring buffer, then redraws the entire
          trail from oldest to newest. Opacity is mapped by age so recent segments glow brightest while ancient
          points fade into the background.
        </p>
        <p className="page-p">
          Try the <strong>neon</strong> preset for a cycle-hue rainbow butterfly, <strong>chaos</strong> for a
          wider, more erratic orbit with σ&nbsp;=&nbsp;14 and ρ&nbsp;=&nbsp;35, or <strong>ghost</strong> for a
          hairline monochrome trace that shows off the attractor's fine structure.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
