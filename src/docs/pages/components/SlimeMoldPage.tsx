import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { SlimeMold } from "../../../components/SlimeMold";

const PROPS = [
  { name: "agentCount",     type: "number",  default: "1800",       description: "Number of physarum agents." },
  { name: "sensorAngle",    type: "number",  default: "45",         description: "Degrees between left/center/right sensors." },
  { name: "sensorDistance", type: "number",  default: "9",          description: "Grid pixels ahead each sensor samples." },
  { name: "stepSize",       type: "number",  default: "1.5",        description: "Agent movement per frame in grid coords." },
  { name: "rotateSpeed",    type: "number",  default: "45",         description: "Max rotation toward strongest sensor in degrees." },
  { name: "trailDecay",     type: "number",  default: "0.92",       description: "Trail evaporation multiplier per frame — lower fades faster." },
  { name: "diffuseStrength",type: "number",  default: "0.2",        description: "3×3 blur weight for trail diffusion." },
  { name: "trailColor",     type: "string",  default: '"#ffffff"',  description: "Color at max trail concentration." },
  { name: "backgroundColor",type: "string",  default: '"#111111"',  description: "Color at zero trail." },
  { name: "resolution",     type: "number",  default: "0.35",       description: "Trail grid resolution fraction — lower is faster." },
  { name: "interactive",    type: "boolean", default: "true",       description: "Mouse deposits pheromone attracting agents." },
  { name: "mouseRadius",    type: "number",  default: "20",         description: "Mouse pheromone deposit radius in px." },
  { name: "mouseStrength",  type: "number",  default: "3",          description: "Pheromone deposit amount per frame." },
  { name: "animated",       type: "boolean", default: "true",       description: "Enable animation." },
  { name: "preset",         type: "string",  default: "—",          description: '"default" | "neon" | "coral" | "vein" | "frost" | "gold"' },
];

const PRESET_PARAMS = {
  default: { trailColor: "#ffffff", bg: "#111111", trailDecay: 0.92, agentCount: 1800 },
  neon:    { trailColor: "#00ffff", bg: "#000000", trailDecay: 0.92, agentCount: 1800 },
  coral:   { trailColor: "#ff8844", bg: "#0a0200", trailDecay: 0.92, agentCount: 1800 },
  vein:    { trailColor: "#ff2244", bg: "#080000", trailDecay: 0.92, agentCount: 3000 },
  frost:   { trailColor: "#88ddff", bg: "#000a10", trailDecay: 0.92, agentCount: 1800 },
  gold:    { trailColor: "#ffcc44", bg: "#0a0800", trailDecay: 0.92, agentCount: 1800 },
};

function SlimeMoldPlayground() {
  const [preset, setPreset]           = useState("default");
  const [agentCount, setAgentCount]   = useState(1800);
  const [sensorAngle, setSensorAngle] = useState(45);
  const [sensorDist, setSensorDist]   = useState(9);
  const [stepSize, setStepSize]       = useState(1.5);
  const [rotateSpeed, setRotate]      = useState(45);
  const [trailDecay, setDecay]        = useState(0.92);
  const [diffuse, setDiffuse]         = useState(0.2);
  const [trailColor, setTrailColor]   = useState("#ffffff");
  const [bg, setBg]                   = useState("#111111");
  const [resolution, setRes]          = useState(0.35);
  const [interactive, setInteract]    = useState(true);
  const [mouseRadius, setMouseRadius] = useState(20);
  const [mouseStrength, setMouseStr]  = useState(3);
  const [animated, setAnimated]       = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setTrailColor(pp.trailColor);
    setBg(pp.bg);
    setDecay(pp.trailDecay);
    setAgentCount(pp.agentCount);
  }

  const code = [
    `import { SlimeMold } from 'own-the-canvas';`,
    ``,
    `<SlimeMold`,
    `  preset="${preset}"`,
    `  agentCount={${agentCount}}`,
    `  trailColor="${trailColor}"`,
    `  backgroundColor="${bg}"`,
    sensorAngle !== 45 ? `  sensorAngle={${sensorAngle}}` : null,
    sensorDist !== 9 ? `  sensorDistance={${sensorDist}}` : null,
    stepSize !== 1.5 ? `  stepSize={${stepSize}}` : null,
    rotateSpeed !== 45 ? `  rotateSpeed={${rotateSpeed}}` : null,
    trailDecay !== 0.92 ? `  trailDecay={${trailDecay}}` : null,
    diffuse !== 0.2 ? `  diffuseStrength={${diffuse}}` : null,
    resolution !== 0.35 ? `  resolution={${resolution}}` : null,
    !interactive ? `  interactive={false}` : null,
    mouseRadius !== 20 ? `  mouseRadius={${mouseRadius}}` : null,
    mouseStrength !== 3 ? `  mouseStrength={${mouseStrength}}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <SlimeMold
        preset={preset}
        agentCount={agentCount}
        sensorAngle={sensorAngle}
        sensorDistance={sensorDist}
        stepSize={stepSize}
        rotateSpeed={rotateSpeed}
        trailDecay={trailDecay}
        diffuseStrength={diffuse}
        trailColor={trailColor}
        backgroundColor={bg}
        resolution={resolution}
        interactive={interactive}
        mouseRadius={mouseRadius}
        mouseStrength={mouseStrength}
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
        <PSel label="Preset" value={preset} options={["default", "neon", "coral", "vein", "frost", "gold"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Trail color" value={trailColor} onChange={setTrailColor} />
        <PColor label="Background"  value={bg}         onChange={setBg} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteract} />
        <PToggle label="Animated"    value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Agent count"     value={agentCount}   min={200}  max={8000} step={200}  onChange={setAgentCount} />
        <PSlider label="Sensor angle"    value={sensorAngle}  min={10}   max={90}   step={1}    onChange={setSensorAngle} />
        <PSlider label="Sensor distance" value={sensorDist}   min={3}    max={25}   step={1}    onChange={setSensorDist} />
        <PSlider label="Step size"       value={stepSize}     min={0.5}  max={4}    step={0.1}  onChange={setStepSize} />
        <PSlider label="Trail decay"     value={trailDecay}   min={0.7}  max={0.99} step={0.01} onChange={setDecay} />
        <PSlider label="Diffuse"         value={diffuse}      min={0}    max={0.8}  step={0.05} onChange={setDiffuse} />
        <PSlider label="Resolution"      value={resolution}   min={0.15} max={0.8}  step={0.05} onChange={setRes} />
        {interactive && <PSlider label="Mouse radius"   value={mouseRadius}  min={20} max={200} step={10} onChange={setMouseRadius} />}
        {interactive && <PSlider label="Mouse strength" value={mouseStrength} min={1} max={10}  step={1}  onChange={setMouseStr} />}
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function SlimeMoldPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="SlimeMold"
      lead="Physarum polycephalum simulation — thousands of agents deposit pheromone trails, sense ahead, and turn toward stronger concentrations. The emergent result is a self-organizing network of branching veins that evolves in real time."
    >
      <SlimeMoldPlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Move the mouse over the canvas — agents detect the pheromone trail your mouse deposits and stream toward it, forming branching networks in the wake. Lower <strong>trail decay</strong> for denser, more persistent networks. Increase <strong>sensor distance</strong> for longer-range pathfinding and wider branching patterns.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
