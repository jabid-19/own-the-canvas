import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { SandSimulation } from "../../../components/SandSimulation";
import type { SandMaterial } from "../../../components/SandSimulation";

const PROPS = [
  { name: "cellSize",        type: "number",  default: "4",        description: "Cell size in pixels — smaller = higher resolution grid." },
  { name: "brushSize",       type: "number",  default: "3",        description: "Paint brush radius in cells." },
  { name: "material",        type: "string",  default: '"sand"',   description: '"sand" | "water" | "fire" | "wall" | "erase" — active material.' },
  { name: "sandColor",       type: "string",  default: '"#c8a85a"', description: "Sand cell color." },
  { name: "waterColor",      type: "string",  default: '"#0088cc"', description: "Water cell color." },
  { name: "fireColor",       type: "string",  default: '"#ff4400"', description: "Fire cell hot color." },
  { name: "wallColor",       type: "string",  default: '"#6b4c1a"', description: "Wall cell color." },
  { name: "backgroundColor", type: "string",  default: '"#1a1200"', description: "Empty cell background color." },
  { name: "interactive",     type: "boolean", default: "true",     description: "Enable mouse painting." },
  { name: "gravity",         type: "number",  default: "1",        description: "Gravity strength multiplier." },
  { name: "autoPour",        type: "boolean", default: "true",       description: "Pour sand on its own in drifting colour bands; the floor drains when the pile gets high." },
  { name: "preset",          type: "string",  default: "—",        description: '"default" | "desert" | "ocean" | "inferno" | "neon" | "monochrome"' },
];

function SandSimulationPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [cellSize, setCellSize] = useState(4);
  const [brushSize, setBrushSize] = useState(3);
  const [material, setMaterial] = useState<SandMaterial>("sand");
  const [sandColor, setSandColor] = useState("#c8a85a");
  const [waterColor, setWaterColor] = useState("#0088cc");
  const [fireColor, setFireColor] = useState("#ff4400");
  const [wallColor, setWallColor] = useState("#6b4c1a");
  const [bg, setBg] = useState("#1a1200");
  const [interactive, setInteractive] = useState(true);

  const code = [
    `import { SandSimulation } from 'own-the-canvas';`,
    ``,
    `<SandSimulation`,
    `  preset="${preset}"`,
    `  cellSize={${cellSize}}`,
    `  brushSize={${brushSize}}`,
    `  material="${material}"`,
    `  sandColor="${sandColor}"`,
    `  waterColor="${waterColor}"`,
    `  fireColor="${fireColor}"`,
    `  wallColor="${wallColor}"`,
    `  backgroundColor="${bg}"`,
    !interactive ? `  interactive={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <SandSimulation
        preset={preset}
        cellSize={cellSize}
        brushSize={brushSize}
        material={material}
        sandColor={sandColor}
        waterColor={waterColor}
        fireColor={fireColor}
        wallColor={wallColor}
        backgroundColor={bg}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "desert", "ocean", "inferno", "neon", "monochrome"]} onChange={setPreset} />
        <PDivider />
        <PSel label="Material" value={material} options={["sand", "water", "fire", "wall", "erase"]} onChange={(v) => setMaterial(v as SandMaterial)} />
        <PDivider />
        <PColor label="Sand color" value={sandColor} onChange={setSandColor} />
        <PColor label="Water color" value={waterColor} onChange={setWaterColor} />
        <PColor label="Fire color" value={fireColor} onChange={setFireColor} />
        <PColor label="Wall color" value={wallColor} onChange={setWallColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Cell size" value={cellSize} min={2} max={12} step={1} onChange={setCellSize} />
        <PSlider label="Brush size" value={brushSize} min={1} max={10} step={1} onChange={setBrushSize} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SandSimulationPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="SandSimulation"
      lead="Falling-sand cellular automaton that pours itself: drifting streams build banded dunes of ochre, rust and cream, and the floor drains when the pile gets high. Paint sand, water, fire, and walls with your mouse."
    >
      <SandSimulationPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Click and drag on the canvas to paint the selected material. Switch materials from the controls panel. Fire extinguishes when it contacts water. Sand sinks through water.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
