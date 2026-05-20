import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { TerrainMesh } from "../../../components/TerrainMesh";

const PROPS = [
  { name: "gridCols",        type: "number",  default: "40",      description: "Columns in the wireframe grid." },
  { name: "gridRows",        type: "number",  default: "30",      description: "Rows in the wireframe grid." },
  { name: "noiseScale",      type: "number",  default: "0.12",    description: "Perlin noise frequency — higher = more jagged terrain." },
  { name: "heightScale",     type: "number",  default: "120",     description: "Max terrain height in px." },
  { name: "wireColor",       type: "string",  default: '"#ffffff"', description: "Wireframe line color." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "fov",             type: "number",  default: "500",     description: "Perspective focal length." },
  { name: "rotateX",         type: "number",  default: "0.4",     description: "Initial X rotation in radians." },
  { name: "rotateY",         type: "number",  default: "0",       description: "Initial Y rotation in radians." },
  { name: "autoRotate",      type: "boolean", default: "true",    description: "Slowly auto-rotate Y axis." },
  { name: "autoRotateSpeed", type: "number",  default: "0.003",   description: "Radians per frame for auto-rotate." },
  { name: "glowEffect",      type: "boolean", default: "false",   description: "Glow on wireframe lines." },
  { name: "glowBlur",        type: "number",  default: "8",       description: "Shadow blur for glow." },
  { name: "interactive",     type: "boolean", default: "true",    description: "Mouse drag to orbit." },
  { name: "animated",        type: "boolean", default: "true",    description: "Enable animation." },
  { name: "lineWidth",       type: "number",  default: "0.5",     description: "Wireframe line width." },
  { name: "colorByHeight",   type: "boolean", default: "true",    description: "Dim low vertices, brighten high peaks." },
  { name: "preset",          type: "string",  default: "—",       description: '"default" | "volcanic" | "arctic" | "neon" | "golden" | "minimal"' },
];

const PRESET_PARAMS = {
  default:  { wireColor: "#ffffff", bg: "#111111", heightScale: 120, noiseScale: 0.12, glowEffect: false, glowBlur: 8, colorByHeight: true,  lineWidth: 0.5 },
  volcanic: { wireColor: "#ef4444", bg: "#0a0000", heightScale: 160, noiseScale: 0.12, glowEffect: true,  glowBlur: 10, colorByHeight: true, lineWidth: 0.5 },
  arctic:   { wireColor: "#bae6fd", bg: "#020c17", heightScale: 80,  noiseScale: 0.08, glowEffect: true,  glowBlur: 8,  colorByHeight: true, lineWidth: 0.5 },
  neon:     { wireColor: "#00ffcc", bg: "#000000", heightScale: 140, noiseScale: 0.12, glowEffect: true,  glowBlur: 12, colorByHeight: false, lineWidth: 0.75 },
  golden:   { wireColor: "#fbbf24", bg: "#0a0800", heightScale: 100, noiseScale: 0.12, glowEffect: true,  glowBlur: 8,  colorByHeight: true, lineWidth: 0.5 },
  minimal:  { wireColor: "#4b5563", bg: "#111111", heightScale: 60,  noiseScale: 0.12, glowEffect: false, glowBlur: 8,  colorByHeight: false, lineWidth: 0.5 },
};

function TerrainMeshPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]           = useState("default");
  const [gridCols, setGridCols]       = useState(40);
  const [gridRows, setGridRows]       = useState(30);
  const [noiseScale, setNoiseScale]   = useState(0.12);
  const [heightScale, setHeightScale] = useState(120);
  const [wireColor, setWireColor]     = useState("#ffffff");
  const [bg, setBg]                   = useState("#111111");
  const [fov, setFov]                 = useState(500);
  const [autoRotate, setAutoRotate]   = useState(true);
  const [autoRotSpeed, setAutoRotSpd] = useState(0.003);
  const [glowEffect, setGlow]         = useState(false);
  const [glowBlur, setGlowBlur]       = useState(8);
  const [interactive, setInteract]    = useState(true);
  const [animated, setAnimated]       = useState(true);
  const [lineWidth, setLineWidth]     = useState(0.5);
  const [colorByH, setColorByH]       = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setWireColor(pp.wireColor);
    setBg(pp.bg);
    setHeightScale(pp.heightScale);
    setNoiseScale(pp.noiseScale);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setColorByH(pp.colorByHeight);
    setLineWidth(pp.lineWidth);
  }

  const code = [
    `import { TerrainMesh } from 'own-the-canvas';`,
    ``,
    `<TerrainMesh`,
    `  preset="${preset}"`,
    `  gridCols={${gridCols}}`,
    `  gridRows={${gridRows}}`,
    `  noiseScale={${noiseScale}}`,
    `  heightScale={${heightScale}}`,
    `  wireColor="${wireColor}"`,
    `  backgroundColor="${bg}"`,
    `  fov={${fov}}`,
    `  autoRotate={${autoRotate}}`,
    `  autoRotateSpeed={${autoRotSpeed}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  lineWidth={${lineWidth}}`,
    `  colorByHeight={${colorByH}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <TerrainMesh
        preset={preset}
        gridCols={gridCols}
        gridRows={gridRows}
        noiseScale={noiseScale}
        heightScale={heightScale}
        wireColor={wireColor}
        backgroundColor={bg}
        fov={fov}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotSpeed}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        lineWidth={lineWidth}
        colorByHeight={colorByH}
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
        <PSel label="Preset" value={preset} options={["default", "volcanic", "arctic", "neon", "golden", "minimal"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Wire color"  value={wireColor} onChange={setWireColor} />
        <PColor label="Background"  value={bg}        onChange={setBg} />
        <PDivider />
        <PToggle label="Auto-rotate"    value={autoRotate}  onChange={setAutoRotate} />
        <PToggle label="Color by height" value={colorByH}   onChange={setColorByH} />
        <PToggle label="Glow effect"    value={glowEffect}  onChange={setGlow} />
        <PToggle label="Interactive"    value={interactive} onChange={setInteract} />
        <PToggle label="Animated"       value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Grid columns"    value={gridCols}    min={5}    max={80}   step={5}     onChange={setGridCols} />
        <PSlider label="Grid rows"       value={gridRows}    min={5}    max={60}   step={5}     onChange={setGridRows} />
        <PSlider label="Noise scale"     value={noiseScale}  min={0.02} max={0.5}  step={0.01}  onChange={setNoiseScale} />
        <PSlider label="Height scale"    value={heightScale} min={10}   max={300}  step={10}    onChange={setHeightScale} />
        <PSlider label="FOV"             value={fov}         min={100}  max={1000} step={50}    onChange={setFov} />
        <PSlider label="Rotate speed"    value={autoRotSpeed}min={0}    max={0.02} step={0.001} onChange={setAutoRotSpd} />
        <PSlider label="Line width"      value={lineWidth}   min={0.25} max={3}    step={0.25}  onChange={setLineWidth} />
        <PSlider label="Glow blur"       value={glowBlur}    min={0}    max={30}   step={1}     onChange={setGlowBlur} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function TerrainMeshPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="TerrainMesh"
      lead="A procedural 3D landscape rendered as a perspective wireframe mesh on a 2D canvas. Perlin noise shapes the terrain; drag to orbit around it. Height-based coloring makes peaks pop and valleys recede."
    >
      <TerrainMeshPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Drag on the canvas to orbit around the terrain. Try <strong>volcanic</strong> for a red lava landscape or <strong>arctic</strong> for a smoother, icy surface. Increase <strong>noise scale</strong> for more jagged mountains; lower it for gentle rolling hills. Higher <strong>grid density</strong> gives more detail at the cost of performance. Toggle <strong>color by height</strong> for flat wireframe vs. depth-shaded mesh.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
