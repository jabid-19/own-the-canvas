import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PColorArray, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { FluidSimulation } from "../../../components/FluidSimulation";

const PROPS = [
  { name: "resolution",      type: "number",  default: "80",        description: "Grid resolution 32–128. Lower = faster, coarser." },
  { name: "viscosity",       type: "number",  default: "0.0001",    description: "Fluid viscosity — resistance to flow." },
  { name: "diffusion",       type: "number",  default: "0.0001",    description: "Ink diffusion rate." },
  { name: "dissipation",     type: "number",  default: "0.995",     description: "Density fade per frame 0–1." },
  { name: "inkColors",       type: "string[]",default: "multi",     description: "Ink colors painted by mouse and auto-ink." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "autoInk",         type: "boolean", default: "true",      description: "Auto-inject ink bursts without mouse." },
  { name: "autoInkInterval", type: "number",  default: "1500",      description: "Interval between auto-ink bursts in ms." },
  { name: "mouseForce",      type: "number",  default: "5",         description: "Mouse velocity → force multiplier." },
  { name: "inkRadius",       type: "number",  default: "4",         description: "Ink splat radius in grid cells." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "ink" | "neon" | "lava" | "ocean" | "smoke"' },
];

function FluidSimulationPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [resolution, setResolution] = useState(128);
  const [dissipation, setDissipation] = useState(0.995);
  const [autoInk, setAutoInk] = useState(true);
  const [mouseForce, setMouseForce] = useState(5);
  const [bg, setBg] = useState("#111111");
  const [inkColors, setInkColors] = useState(["#ffffff", "#6b7280"]);

  const code = [
    `import { FluidSimulation } from 'own-the-canvas';`,
    ``,
    `<FluidSimulation`,
    `  preset="${preset}"`,
    `  resolution={${resolution}}`,
    `  dissipation={${dissipation}}`,
    `  mouseForce={${mouseForce}}`,
    autoInk ? null : `  autoInk={false}`,
    `  inkColors={${JSON.stringify(inkColors)}}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <FluidSimulation preset={preset} resolution={resolution}
        dissipation={dissipation} autoInk={autoInk} mouseForce={mouseForce}
        inkColors={inkColors} backgroundColor={bg} width="100%" height="100%" />
      <PLiveLabel text="Move cursor to paint fluid" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "ink", "neon", "lava", "ocean", "smoke"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PDivider />
        <PColorArray label="Ink Colors" value={inkColors} onChange={setInkColors} />
        <PSlider label="Resolution" value={resolution} min={32} max={128} step={8} onChange={setResolution} />
      </div>
      <div>
        <PSlider label="Dissipation" value={dissipation} min={0.97} max={0.999} step={0.001} onChange={setDissipation} />
        <PSlider label="Mouse force" value={mouseForce} min={1} max={15} step={1} onChange={setMouseForce} />
        <PDivider />
        <PToggle label="Auto-ink bursts" value={autoInk} onChange={setAutoInk} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function FluidSimulationPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="FluidSimulation"
      lead="Grid-based Navier-Stokes fluid simulation with per-channel RGB ink. Move the cursor to paint — velocity carries ink through the fluid field, diffusing and advecting each frame."
    >
      <FluidSimulationPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
