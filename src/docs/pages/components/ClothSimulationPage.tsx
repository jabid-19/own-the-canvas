import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { ClothSimulation } from "../../../components/ClothSimulation";

const PROPS = [
  { name: "cols",            type: "number",  default: "25",        description: "Grid columns." },
  { name: "rows",            type: "number",  default: "20",        description: "Grid rows." },
  { name: "spacing",         type: "number",  default: "18",        description: "Point spacing in px." },
  { name: "gravity",         type: "number",  default: "0.4",       description: "Gravity per frame." },
  { name: "friction",        type: "number",  default: "0.99",      description: "Velocity friction 0–1." },
  { name: "stiffness",       type: "number",  default: "1",         description: "Constraint stiffness 0–1." },
  { name: "iterations",      type: "number",  default: "3",         description: "Constraint relaxation iterations per frame." },
  { name: "lineColor",       type: "string",  default: '"#6b7280"', description: "Cloth mesh stroke color." },
  { name: "pinColor",        type: "string",  default: '"#ffffff"', description: "Pin point color." },
  { name: "lineWidth",       type: "number",  default: "1",         description: "Mesh stroke width." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "wind",            type: "number",  default: "0.3",       description: "Wind oscillation amplitude." },
  { name: "windSpeed",       type: "number",  default: "0.5",       description: "Wind oscillation frequency." },
  { name: "tearable",        type: "boolean", default: "false",     description: "Enable cloth tearing on mouse click." },
  { name: "tearDistance",    type: "number",  default: "3",         description: "Tear multiplier — ratio above rest length." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Enable mouse interaction." },
  { name: "mouseRadius",     type: "number",  default: "30",        description: "Mouse influence radius in px." },
  { name: "mouseForce",      type: "number",  default: "5",         description: "Mouse push force." },
  { name: "showPins",        type: "boolean", default: "true",      description: "Show pin points at top edge." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "silk" | "net" | "heavy" | "spider"' },
];

function ClothSimulationPlayground() {
  const [preset, setPreset] = useState("default");
  const [cols, setCols] = useState(25);
  const [gravity, setGravity] = useState(0.4);
  const [wind, setWind] = useState(0.3);
  const [tearable, setTearable] = useState(false);
  const [lineColor, setLineColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");

  const code = [
    `import { ClothSimulation } from 'own-the-canvas';`,
    ``,
    `<ClothSimulation`,
    `  preset="${preset}"`,
    `  cols={${cols}}`,
    `  gravity={${gravity}}`,
    `  wind={${wind}}`,
    tearable ? `  tearable` : null,
    `  lineColor="${lineColor}"`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ClothSimulation preset={preset} cols={cols} gravity={gravity}
        wind={wind} tearable={tearable} lineColor={lineColor}
        backgroundColor={bg} width="100%" height="100%" />
      <PLiveLabel text="Drag cloth to interact" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "silk", "net", "heavy", "spider"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Cloth color" value={lineColor} onChange={setLineColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSlider label="Columns" value={cols} min={10} max={40} step={1} onChange={setCols} />
      </div>
      <div>
        <PSlider label="Gravity" value={gravity} min={0.05} max={1.5} step={0.05} onChange={setGravity} />
        <PSlider label="Wind" value={wind} min={0} max={1} step={0.05} onChange={setWind} />
        <PDivider />
        <PToggle label="Tearable" value={tearable} onChange={setTearable} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function ClothSimulationPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="ClothSimulation"
      lead="Verlet integration spring-mass fabric simulation. Wind, gravity, mouse interaction, and optional tearing. Pinned at the top edge, fully interactive."
    >
      <ClothSimulationPlayground />

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
