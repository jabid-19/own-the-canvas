import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { VoronoiCells } from "../../../components/VoronoiCells";
import type { VoronoiColorMode } from "../../../components/VoronoiCells/useVoronoiCells";

const PROPS = [
  { name: "cellCount",      type: "number",          default: "20",         description: "Number of Voronoi seed points." },
  { name: "speed",          type: "number",          default: "1",          description: "Seed drift/animation speed." },
  { name: "colorMode",      type: "VoronoiColorMode",default: '"solid"',    description: '"solid" | "gradient" | "cycle" — per-cell coloring.' },
  { name: "cellColor",      type: "string",          default: '"#ffffff"',  description: "Base cell color in solid/gradient mode." },
  { name: "backgroundColor",type: "string",          default: '"#111111"',  description: "Background / empty space color." },
  { name: "showEdges",      type: "boolean",         default: "true",       description: "Draw 1px cell boundary lines." },
  { name: "edgeColor",      type: "string",          default: '"#333333"',  description: "Edge line color." },
  { name: "resolution",     type: "number",          default: "0.25",       description: "Render resolution fraction — lower is faster." },
  { name: "relaxation",     type: "number",          default: "0.05",       description: "Lloyd centroid pull strength per frame." },
  { name: "interactive",    type: "boolean",         default: "true",       description: "Click to add seed; drag to move nearest seed." },
  { name: "animated",       type: "boolean",         default: "true",       description: "Enable continuous drift animation." },
  { name: "preset",         type: "string",          default: "—",          description: '"default" | "stained-glass" | "neon" | "frost" | "ember" | "void"' },
];

const PRESET_PARAMS = {
  "default":       { colorMode: "solid"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#111111", edgeColor: "#333333", showEdges: true,  cellCount: 20 },
  "stained-glass": { colorMode: "cycle"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#111111", edgeColor: "#111111", showEdges: true,  cellCount: 25 },
  "neon":          { colorMode: "cycle"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#000000", edgeColor: "#000000", showEdges: false, cellCount: 20 },
  "frost":         { colorMode: "gradient" as VoronoiColorMode, cellColor: "#88ccff", bg: "#001833", edgeColor: "#ffffff", showEdges: true,  cellCount: 20 },
  "ember":         { colorMode: "cycle"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#0a0200", edgeColor: "#0a0200", showEdges: false, cellCount: 20 },
  "void":          { colorMode: "solid"    as VoronoiColorMode, cellColor: "#ffffff", bg: "#000000", edgeColor: "#333333", showEdges: false, cellCount: 20 },
};

function VoronoiCellsPlayground() {
  const [preset, setPreset]         = useState("default");
  const [cellCount, setCellCount]   = useState(20);
  const [speed, setSpeed]           = useState(1);
  const [colorMode, setColorMode]   = useState<VoronoiColorMode>("solid");
  const [cellColor, setCellColor]   = useState("#ffffff");
  const [bg, setBg]                 = useState("#111111");
  const [showEdges, setShowEdges]   = useState(true);
  const [edgeColor, setEdgeColor]   = useState("#333333");
  const [resolution, setRes]        = useState(0.25);
  const [relaxation, setRelax]      = useState(0.05);
  const [interactive, setInteract]  = useState(true);
  const [animated, setAnimated]     = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setColorMode(pp.colorMode);
    setCellColor(pp.cellColor);
    setBg(pp.bg);
    setEdgeColor(pp.edgeColor);
    setShowEdges(pp.showEdges);
    setCellCount(pp.cellCount);
  }

  const code = [
    `import { VoronoiCells } from 'own-the-canvas';`,
    ``,
    `<VoronoiCells`,
    `  preset="${preset}"`,
    `  cellCount={${cellCount}}`,
    colorMode !== "solid" ? `  colorMode="${colorMode}"` : null,
    `  cellColor="${cellColor}"`,
    `  backgroundColor="${bg}"`,
    !showEdges ? `  showEdges={false}` : null,
    showEdges && edgeColor !== "#333333" ? `  edgeColor="${edgeColor}"` : null,
    speed !== 1 ? `  speed={${speed}}` : null,
    relaxation !== 0.05 ? `  relaxation={${relaxation}}` : null,
    resolution !== 0.25 ? `  resolution={${resolution}}` : null,
    !interactive ? `  interactive={false}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <VoronoiCells
        preset={preset}
        cellCount={cellCount}
        speed={speed}
        colorMode={colorMode}
        cellColor={cellColor}
        backgroundColor={bg}
        showEdges={showEdges}
        edgeColor={edgeColor}
        resolution={resolution}
        relaxation={relaxation}
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
        <PSel label="Preset"     value={preset}    options={["default", "stained-glass", "neon", "frost", "ember", "void"]} onChange={handlePreset} />
        <PDivider />
        <PSel label="Color mode" value={colorMode} options={["solid", "gradient", "cycle"]} onChange={(v) => setColorMode(v as VoronoiColorMode)} />
        <PDivider />
        <PColor label="Cell color"   value={cellColor} onChange={setCellColor} />
        <PColor label="Edge color"   value={edgeColor} onChange={setEdgeColor} />
        <PColor label="Background"   value={bg}        onChange={setBg} />
        <PDivider />
        <PToggle label="Show edges"  value={showEdges}   onChange={setShowEdges} />
        <PToggle label="Interactive" value={interactive} onChange={setInteract} />
        <PToggle label="Animated"    value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Cell count"  value={cellCount}  min={3}    max={60}  step={1}    onChange={setCellCount} />
        <PSlider label="Speed"       value={speed}      min={0}    max={5}   step={0.1}  onChange={setSpeed} />
        <PSlider label="Relaxation"  value={relaxation} min={0}    max={0.3} step={0.01} onChange={setRelax} />
        <PSlider label="Resolution"  value={resolution} min={0.1}  max={1}   step={0.05} onChange={setRes} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function VoronoiCellsPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="VoronoiCells"
      lead="Animated Voronoi diagram where seed points drift and self-organize via Lloyd relaxation. Click to add seeds, drag to reposition them — each cell continuously reshapes to fill its territory."
    >
      <VoronoiCellsPlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Click anywhere on the canvas to plant a new seed — cells immediately reorganize. Drag existing seeds (shown as small dots) to reshape the diagram. Try the <strong>stained-glass</strong> preset with cycle color mode for a vivid mosaic, or <strong>neon</strong> for glowing borderless cells on black. Lower <strong>resolution</strong> for smoother performance with high cell counts.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
