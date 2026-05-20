import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { MagneticField } from "../../../components/MagneticField";

const PROPS = [
  { name: "fieldLineCount",  type: "number",  default: "16",      description: "Field lines seeded per positive pole." },
  { name: "stepSize",        type: "number",  default: "4",       description: "Euler integration step in px." },
  { name: "maxSteps",        type: "number",  default: "400",     description: "Max steps per field line." },
  { name: "positiveColor",   type: "string",  default: '"#ef4444"', description: "N-pole color." },
  { name: "negativeColor",   type: "string",  default: '"#3b82f6"', description: "S-pole color." },
  { name: "lineColor",       type: "string",  default: '"#6b7280"', description: "Field line stroke color." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "lineWidth",       type: "number",  default: "1",       description: "Field line stroke width." },
  { name: "lineOpacity",     type: "number",  default: "0.6",     description: "Field line alpha." },
  { name: "poleRadius",      type: "number",  default: "12",      description: "Magnet circle radius in px." },
  { name: "glowEffect",      type: "boolean", default: "true",    description: "Glow on poles." },
  { name: "glowBlur",        type: "number",  default: "20",      description: "Shadow blur for glow." },
  { name: "animated",        type: "boolean", default: "false",   description: "Continuously redraw vs. only on change." },
  { name: "interactive",     type: "boolean", default: "true",    description: "Drag poles; click to add; right-click to remove." },
  { name: "maxPoles",        type: "number",  default: "6",       description: "Max total poles." },
  { name: "preset",          type: "string",  default: "—",       description: '"default" | "neon" | "warm" | "mono" | "electric" | "minimal"' },
];

const PRESET_PARAMS = {
  default:  { positiveColor: "#ef4444", negativeColor: "#3b82f6", lineColor: "#6b7280", bg: "#111111", lineOpacity: 0.6, glowEffect: true,  glowBlur: 20, fieldLineCount: 16 },
  neon:     { positiveColor: "#f43f5e", negativeColor: "#3b82f6", lineColor: "#00ffcc", bg: "#000000", lineOpacity: 0.8, glowEffect: true,  glowBlur: 25, fieldLineCount: 16 },
  warm:     { positiveColor: "#f97316", negativeColor: "#fbbf24", lineColor: "#fed7aa", bg: "#0c0500", lineOpacity: 0.6, glowEffect: true,  glowBlur: 18, fieldLineCount: 16 },
  mono:     { positiveColor: "#ffffff", negativeColor: "#6b7280", lineColor: "#9ca3af", bg: "#111111", lineOpacity: 0.5, glowEffect: false, glowBlur: 20, fieldLineCount: 16 },
  electric: { positiveColor: "#38bdf8", negativeColor: "#a78bfa", lineColor: "#e0f2fe", bg: "#020c14", lineOpacity: 0.6, glowEffect: true,  glowBlur: 30, fieldLineCount: 24 },
  minimal:  { positiveColor: "#ef4444", negativeColor: "#3b82f6", lineColor: "#4b5563", bg: "#111111", lineOpacity: 0.4, glowEffect: false, glowBlur: 20, fieldLineCount: 10 },
};

function MagneticFieldPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]         = useState("default");
  const [fieldLines, setFieldLines] = useState(16);
  const [stepSize, setStepSize]     = useState(4);
  const [maxSteps, setMaxSteps]     = useState(400);
  const [posColor, setPosColor]     = useState("#ef4444");
  const [negColor, setNegColor]     = useState("#3b82f6");
  const [lineColor, setLineColor]   = useState("#6b7280");
  const [bg, setBg]                 = useState("#111111");
  const [lineWidth, setLineWidth]   = useState(1);
  const [lineOpacity, setOpacity]   = useState(0.6);
  const [poleRadius, setPoleRadius] = useState(12);
  const [glowEffect, setGlow]       = useState(true);
  const [glowBlur, setGlowBlur]     = useState(20);
  const [animated, setAnimated]     = useState(false);
  const [interactive, setInteract]  = useState(true);
  const [maxPoles, setMaxPoles]     = useState(6);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setPosColor(pp.positiveColor);
    setNegColor(pp.negativeColor);
    setLineColor(pp.lineColor);
    setBg(pp.bg);
    setOpacity(pp.lineOpacity);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setFieldLines(pp.fieldLineCount);
  }

  const code = [
    `import { MagneticField } from 'own-the-canvas';`,
    ``,
    `<MagneticField`,
    `  preset="${preset}"`,
    `  fieldLineCount={${fieldLines}}`,
    `  stepSize={${stepSize}}`,
    `  maxSteps={${maxSteps}}`,
    `  positiveColor="${posColor}"`,
    `  negativeColor="${negColor}"`,
    `  lineColor="${lineColor}"`,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  lineOpacity={${lineOpacity}}`,
    `  poleRadius={${poleRadius}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  animated={${animated}}`,
    `  interactive={${interactive}}`,
    `  maxPoles={${maxPoles}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MagneticField
        preset={preset}
        fieldLineCount={fieldLines}
        stepSize={stepSize}
        maxSteps={maxSteps}
        positiveColor={posColor}
        negativeColor={negColor}
        lineColor={lineColor}
        backgroundColor={bg}
        lineWidth={lineWidth}
        lineOpacity={lineOpacity}
        poleRadius={poleRadius}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        animated={animated}
        interactive={interactive}
        maxPoles={maxPoles}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "warm", "mono", "electric", "minimal"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="N-pole color"  value={posColor}  onChange={setPosColor} />
        <PColor label="S-pole color"  value={negColor}  onChange={setNegColor} />
        <PColor label="Line color"    value={lineColor} onChange={setLineColor} />
        <PColor label="Background"    value={bg}        onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect"  value={glowEffect}  onChange={setGlow} />
        <PToggle label="Interactive"  value={interactive} onChange={setInteract} />
        <PToggle label="Animated"     value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Field lines"   value={fieldLines}  min={4}   max={36}  step={2}    onChange={setFieldLines} />
        <PSlider label="Step size"     value={stepSize}    min={1}   max={10}  step={0.5}  onChange={setStepSize} />
        <PSlider label="Max steps"     value={maxSteps}    min={50}  max={800} step={50}   onChange={setMaxSteps} />
        <PSlider label="Line width"    value={lineWidth}   min={0.5} max={4}   step={0.25} onChange={setLineWidth} />
        <PSlider label="Line opacity"  value={lineOpacity} min={0.1} max={1}   step={0.05} onChange={setOpacity} />
        <PSlider label="Pole radius"   value={poleRadius}  min={6}   max={30}  step={1}    onChange={setPoleRadius} />
        <PSlider label="Glow blur"     value={glowBlur}    min={0}   max={50}  step={1}    onChange={setGlowBlur} />
        <PSlider label="Max poles"     value={maxPoles}    min={2}   max={8}   step={1}    onChange={setMaxPoles} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function MagneticFieldPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="MagneticField"
      lead="Visualize the invisible: field lines trace the path a charged particle would follow through a magnetic field. Drag the red N-pole and blue S-pole to reshape the field in real time. Click to add more poles; right-click to remove."
    >
      <MagneticFieldPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Field lines are seeded from each positive (N) pole and traced until they exit the canvas or enter a pole. Drag the poles to see the field reshape instantly. Try <strong>electric</strong> for a high-contrast look with 24 field lines, or <strong>mono</strong> for a clean physics-textbook style. Increase <strong>field lines</strong> for a denser, more detailed visualization.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
