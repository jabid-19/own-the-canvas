import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { AntColony } from "../../../components/AntColony";

const PROPS = [
  { name: "antCount",          type: "number",  default: "150",     description: "Number of ants in the colony." },
  { name: "evaporationRate",   type: "number",  default: "0.003",   description: "Pheromone decay per frame." },
  { name: "diffusionRate",     type: "number",  default: "0.1",     description: "Pheromone spread to neighboring cells." },
  { name: "pheromoneStrength", type: "number",  default: "5",       description: "Amount of pheromone deposited per step." },
  { name: "antSpeed",          type: "number",  default: "1.5",     description: "Pixels per frame per ant." },
  { name: "sensorAngle",       type: "number",  default: "0.4",     description: "Ant sensor angle offset in radians." },
  { name: "sensorDistance",    type: "number",  default: "6",       description: "Pheromone sensor lookahead in px." },
  { name: "turnSpeed",         type: "number",  default: "0.3",     description: "Max turn per frame in radians." },
  { name: "antColor",          type: "string",  default: '"#ffffff"', description: "Ant dot color." },
  { name: "pheromoneColor",    type: "string",  default: '"#6b7280"', description: "Pheromone trail color." },
  { name: "foodColor",         type: "string",  default: '"#4ade80"', description: "Food source color." },
  { name: "nestColor",         type: "string",  default: '"#f59e0b"', description: "Nest color." },
  { name: "backgroundColor",   type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "resolution",        type: "number",  default: "0.5",     description: "Pheromone grid resolution fraction." },
  { name: "animated",          type: "boolean", default: "true",    description: "Enable animation." },
  { name: "interactive",       type: "boolean", default: "true",    description: "Click to place food sources." },
  { name: "maxFood",           type: "number",  default: "5",       description: "Max simultaneous food sources." },
  { name: "preset",            type: "string",  default: "—",       description: '"default" | "neon" | "desert" | "jungle" | "minimal" | "swarm"' },
];

const PRESET_PARAMS = {
  default: { antColor: "#ffffff", pheromoneColor: "#6b7280", foodColor: "#4ade80", nestColor: "#f59e0b", bg: "#111111", antCount: 150, antSpeed: 1.5, evaporationRate: 0.003, pheromoneStrength: 5 },
  neon:    { antColor: "#ffffff", pheromoneColor: "#00ffcc", foodColor: "#f0abfc", nestColor: "#fbbf24", bg: "#000000", antCount: 150, antSpeed: 1.5, evaporationRate: 0.003, pheromoneStrength: 8 },
  desert:  { antColor: "#451a03", pheromoneColor: "#d97706", foodColor: "#84cc16", nestColor: "#b45309", bg: "#fef3c7", antCount: 150, antSpeed: 2,   evaporationRate: 0.005, pheromoneStrength: 5 },
  jungle:  { antColor: "#1a0a00", pheromoneColor: "#4ade80", foodColor: "#fbbf24", nestColor: "#7c3aed", bg: "#052e16", antCount: 200, antSpeed: 1,   evaporationRate: 0.003, pheromoneStrength: 5 },
  minimal: { antColor: "#9ca3af", pheromoneColor: "#374151", foodColor: "#6b7280", nestColor: "#6b7280", bg: "#111111", antCount: 80,  antSpeed: 1.5, evaporationRate: 0.003, pheromoneStrength: 3 },
  swarm:   { antColor: "#ffffff", pheromoneColor: "#6b7280", foodColor: "#4ade80", nestColor: "#f59e0b", bg: "#111111", antCount: 400, antSpeed: 2,   evaporationRate: 0.002, pheromoneStrength: 10 },
};

function AntColonyPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]           = useState("default");
  const [antCount, setAntCount]       = useState(150);
  const [evapRate, setEvapRate]       = useState(0.003);
  const [diffRate, setDiffRate]       = useState(0.1);
  const [phStrength, setPhStrength]   = useState(5);
  const [antSpeed, setAntSpeed]       = useState(1.5);
  const [sensorAngle, setSensorAng]   = useState(0.4);
  const [sensorDist, setSensorDist]   = useState(6);
  const [turnSpeed, setTurnSpeed]     = useState(0.3);
  const [antColor, setAntColor]       = useState("#ffffff");
  const [phColor, setPhColor]         = useState("#6b7280");
  const [foodColor, setFoodColor]     = useState("#4ade80");
  const [nestColor, setNestColor]     = useState("#f59e0b");
  const [bg, setBg]                   = useState("#111111");
  const [maxFood, setMaxFood]         = useState(5);
  const [animated, setAnimated]       = useState(true);
  const [interactive, setInteract]    = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setAntColor(pp.antColor);
    setPhColor(pp.pheromoneColor);
    setFoodColor(pp.foodColor);
    setNestColor(pp.nestColor);
    setBg(pp.bg);
    setAntCount(pp.antCount);
    setAntSpeed(pp.antSpeed);
    setEvapRate(pp.evaporationRate);
    setPhStrength(pp.pheromoneStrength);
  }

  const code = [
    `import { AntColony } from 'own-the-canvas';`,
    ``,
    `<AntColony`,
    `  preset="${preset}"`,
    `  antCount={${antCount}}`,
    `  evaporationRate={${evapRate}}`,
    `  diffusionRate={${diffRate}}`,
    `  pheromoneStrength={${phStrength}}`,
    `  antSpeed={${antSpeed}}`,
    `  sensorAngle={${sensorAngle}}`,
    `  sensorDistance={${sensorDist}}`,
    `  turnSpeed={${turnSpeed}}`,
    `  antColor="${antColor}"`,
    `  pheromoneColor="${phColor}"`,
    `  foodColor="${foodColor}"`,
    `  nestColor="${nestColor}"`,
    `  backgroundColor="${bg}"`,
    `  maxFood={${maxFood}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <AntColony
        preset={preset}
        antCount={antCount}
        evaporationRate={evapRate}
        diffusionRate={diffRate}
        pheromoneStrength={phStrength}
        antSpeed={antSpeed}
        sensorAngle={sensorAngle}
        sensorDistance={sensorDist}
        turnSpeed={turnSpeed}
        antColor={antColor}
        pheromoneColor={phColor}
        foodColor={foodColor}
        nestColor={nestColor}
        backgroundColor={bg}
        maxFood={maxFood}
        interactive={interactive}
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
        <PSel label="Preset" value={preset} options={["default", "neon", "desert", "jungle", "minimal", "swarm"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Ant color"       value={antColor}  onChange={setAntColor} />
        <PColor label="Pheromone color" value={phColor}   onChange={setPhColor} />
        <PColor label="Food color"      value={foodColor} onChange={setFoodColor} />
        <PColor label="Nest color"      value={nestColor} onChange={setNestColor} />
        <PColor label="Background"      value={bg}        onChange={setBg} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteract} />
        <PToggle label="Animated"    value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Ant count"          value={antCount}    min={20}   max={500}  step={10}    onChange={setAntCount} />
        <PSlider label="Ant speed"          value={antSpeed}    min={0.5}  max={5}    step={0.1}   onChange={setAntSpeed} />
        <PSlider label="Evaporation rate"   value={evapRate}    min={0}    max={0.02} step={0.001} onChange={setEvapRate} />
        <PSlider label="Diffusion rate"     value={diffRate}    min={0}    max={0.5}  step={0.01}  onChange={setDiffRate} />
        <PSlider label="Pheromone strength" value={phStrength}  min={1}    max={30}   step={1}     onChange={setPhStrength} />
        <PSlider label="Sensor angle"       value={sensorAngle} min={0.1}  max={1.5}  step={0.05}  onChange={setSensorAng} />
        <PSlider label="Sensor distance"    value={sensorDist}  min={2}    max={30}   step={1}     onChange={setSensorDist} />
        <PSlider label="Turn speed"         value={turnSpeed}   min={0.05} max={1}    step={0.05}  onChange={setTurnSpeed} />
        <PSlider label="Max food sources"   value={maxFood}     min={1}    max={10}   step={1}     onChange={setMaxFood} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function AntColonyPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="AntColony"
      lead="A stigmergy simulation where ants leave pheromone trails to coordinate foraging. Watch emergent pathways form as the colony discovers food. Click anywhere to drop food sources and observe how the colony adapts its trail network."
    >
      <AntColonyPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Click on the canvas to place food sources — the amber circle at center is the nest. Ants without food follow the food pheromone trail (seeking); ants carrying food follow the home pheromone (returning). Try <strong>swarm</strong> for 400 ants or <strong>desert</strong> for a warm sandy palette. Lower <strong>evaporation rate</strong> to preserve trails longer.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
