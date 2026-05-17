import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { GameOfLife } from "../../../components/GameOfLife";

const PROPS = [
  { name: "cellSize",        type: "number",  default: "8",         description: "Cell size in px." },
  { name: "speed",           type: "number",  default: "10",        description: "Simulation updates per second." },
  { name: "initialDensity",  type: "number",  default: "0.3",       description: "Initial alive cell density 0–1." },
  { name: "aliveColor",      type: "string",  default: '"#ffffff"', description: "Color of newly born cells." },
  { name: "oldColor",        type: "string",  default: '"#6b7280"', description: "Color of aged cells." },
  { name: "deadColor",       type: "string",  default: '"#111111"', description: "Color of dead cells." },
  { name: "showAge",         type: "boolean", default: "true",      description: "Color cells by generation age." },
  { name: "wrapEdges",       type: "boolean", default: "true",      description: "Wrap cells at canvas edges (toroidal)." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Click to toggle cells alive/dead." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "neon" | "matrix" | "minimal" | "fire"' },
];

function GameOfLifePlayground() {
  const [preset, setPreset] = useState("default");
  const [cellSize, setCellSize] = useState(8);
  const [speed, setSpeed] = useState(10);
  const [aliveColor, setAliveColor] = useState("#ffffff");
  const [oldColor, setOldColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [showAge, setShowAge] = useState(true);

  const code = [
    `import { GameOfLife } from 'own-the-canvas';`,
    ``,
    `<GameOfLife`,
    `  preset="${preset}"`,
    `  cellSize={${cellSize}}`,
    `  speed={${speed}}`,
    `  aliveColor="${aliveColor}"`,
    `  oldColor="${oldColor}"`,
    showAge ? null : `  showAge={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <GameOfLife preset={preset} cellSize={cellSize} speed={speed}
        aliveColor={aliveColor} oldColor={oldColor} showAge={showAge}
        backgroundColor={bg} width="100%" height="100%" />
      <PLiveLabel text="Click cells to toggle alive/dead" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "matrix", "minimal", "fire"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Alive color" value={aliveColor} onChange={setAliveColor} />
        <PColor label="Old cell color" value={oldColor} onChange={setOldColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Cell size" value={cellSize} min={4} max={24} step={2} onChange={setCellSize} />
        <PSlider label="Speed (fps)" value={speed} min={1} max={30} step={1} onChange={setSpeed} />
        <PDivider />
        <PToggle label="Show age gradient" value={showAge} onChange={setShowAge} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function GameOfLifePage() {
  return (
    <PageShell
      eyebrow="Component"
      title="GameOfLife"
      lead="Conway's Game of Life — emergent cellular automata where simple rules produce complex living patterns. Click cells to draw. Age-based color gradients reveal generation history."
    >
      <GameOfLifePlayground />

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
