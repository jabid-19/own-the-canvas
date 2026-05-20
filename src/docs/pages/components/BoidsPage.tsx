import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Boids } from "../../../components/Boids";

const PROPS = [
  { name: "count",            type: "number",  default: "80",        description: "Number of boids." },
  { name: "maxSpeed",         type: "number",  default: "3",         description: "Maximum speed in px/frame." },
  { name: "separationRadius", type: "number",  default: "25",        description: "Radius for separation rule in px." },
  { name: "alignmentRadius",  type: "number",  default: "50",        description: "Radius for alignment rule in px." },
  { name: "cohesionRadius",   type: "number",  default: "60",        description: "Radius for cohesion rule in px." },
  { name: "separationForce",  type: "number",  default: "0.05",      description: "Separation steering force." },
  { name: "alignmentForce",   type: "number",  default: "0.05",      description: "Alignment steering force." },
  { name: "cohesionForce",    type: "number",  default: "0.03",      description: "Cohesion steering force." },
  { name: "color",            type: "string",  default: '"#ffffff"', description: "Boid and trail color." },
  { name: "trailLength",      type: "number",  default: "8",         description: "Trail history length in frames." },
  { name: "trailOpacity",     type: "number",  default: "0.4",       description: "Trail line opacity 0–1." },
  { name: "boidSize",         type: "number",  default: "6",         description: "Boid triangle size in px." },
  { name: "backgroundColor",  type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "interactive",      type: "boolean", default: "true",      description: "Boids flee from mouse cursor." },
  { name: "mouseRadius",      type: "number",  default: "80",        description: "Mouse avoidance radius in px." },
  { name: "mouseForce",       type: "number",  default: "0.2",       description: "Mouse avoidance force." },
  { name: "wrapEdges",        type: "boolean", default: "true",      description: "Wrap boids at canvas edges." },
  { name: "preset",           type: "string",  default: "—",         description: '"default" | "birds" | "fish" | "swarm" | "neon"' },
];

function BoidsPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [count, setCount] = useState(80);
  const [maxSpeed, setMaxSpeed] = useState(3);
  const [color, setColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [trailLength, setTrailLength] = useState(8);
  const [sepForce, setSepForce] = useState(0.05);

  const code = [
    `import { Boids } from 'own-the-canvas';`,
    ``,
    `<Boids`,
    `  preset="${preset}"`,
    `  count={${count}}`,
    `  maxSpeed={${maxSpeed}}`,
    `  color="${color}"`,
    `  trailLength={${trailLength}}`,
    `  separationForce={${sepForce}}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Boids preset={preset} count={count} maxSpeed={maxSpeed} color={color}
        trailLength={trailLength} separationForce={sepForce}
        backgroundColor={bg} width="100%" height="100%" />
      <PLiveLabel text="Move cursor to scatter flock" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "birds", "fish", "swarm", "neon"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Color" value={color} onChange={setColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSlider label="Count" value={count} min={10} max={300} step={10} onChange={setCount} />
      </div>
      <div>
        <PSlider label="Max speed" value={maxSpeed} min={0.5} max={8} step={0.5} onChange={setMaxSpeed} />
        <PSlider label="Trail length" value={trailLength} min={0} max={30} step={1} onChange={setTrailLength} />
        <PSlider label="Separation force" value={sepForce} min={0} max={0.2} step={0.01} onChange={setSepForce} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function BoidsPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Boids"
      lead="Craig Reynolds' emergent flocking algorithm — separation, alignment, and cohesion produce lifelike murmuration. Move your cursor to scatter the flock."
    >
      <BoidsPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
