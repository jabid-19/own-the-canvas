import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { ConstellationMap } from "../../../components/ConstellationMap";

const PROPS = [
  { name: "starCount",          type: "number",             default: "80",        description: "Number of stars in the constellation." },
  { name: "starColor",          type: "string",             default: '"#ffffff"', description: "Star fill color." },
  { name: "lineColor",          type: "string",             default: '"#6b7280"', description: "Connection line color." },
  { name: "backgroundColor",    type: "string",             default: '"#111111"', description: "Canvas background color." },
  { name: "connectionDistance", type: "number",             default: "100",       description: "Max distance to draw connection lines." },
  { name: "speed",              type: "number",             default: "0.3",       description: "Star drift speed." },
  { name: "interactive",        type: "boolean",            default: "true",      description: "Drag stars to reposition them." },
  { name: "lineStyle",          type: '"solid" | "dashed"', default: '"solid"',   description: "Line stroke style." },
  { name: "glowStars",          type: "boolean",            default: "false",     description: "Enable glow effect on stars." },
];

type LineStyle = "solid" | "dashed";

function ConstellationMapPlayground() {
  const [count, setCount] = useState(80);
  const [sc, setSc] = useState("#ffffff");
  const [lc, setLc] = useState("#8888ff");
  const [bg, setBg] = useState("#050510");
  const [speed, setSpeed] = useState(0.3);
  const [interact, setInteract] = useState(true);
  const [lineStyle, setLineStyle] = useState<LineStyle>("solid");
  const [glow, setGlow] = useState(true);
  const [dist, setDist] = useState(100);

  const code = [
    `import { ConstellationMap } from 'own-the-canvas';`,
    ``,
    `<ConstellationMap`,
    `  starCount={${count}}`,
    `  starColor="${sc}"`,
    `  lineColor="${lc}"`,
    `  backgroundColor="${bg}"`,
    `  connectionDistance={${dist}}`,
    `  speed={${speed}}`,
    `  lineStyle="${lineStyle}"`,
    glow ? `  glowStars` : null,
    !interact ? `  interactive={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ConstellationMap starCount={count} starColor={sc} lineColor={lc}
        backgroundColor={bg} speed={speed} interactive={interact}
        lineStyle={lineStyle} glowStars={glow} connectionDistance={dist}
        width="100%" height="100%" />
      <PLiveLabel text="Drag stars to reposition" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PColor label="Star color" value={sc} onChange={setSc} />
        <PColor label="Line color" value={lc} onChange={setLc} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSel label="Line style" value={lineStyle} options={["solid", "dashed"]} onChange={setLineStyle} />
      </div>
      <div>
        <PSlider label="Star count" value={count} min={20} max={300} step={10} onChange={setCount} />
        <PSlider label="Connection distance" value={dist} min={40} max={300} step={10} onChange={setDist} />
        <PSlider label="Drift speed" value={speed} min={0} max={3} step={0.05} onChange={setSpeed} />
        <PDivider />
        <PToggle label="Drag to move stars" value={interact} onChange={setInteract} />
        <PToggle label="Star glow" value={glow} onChange={setGlow} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function ConstellationMapPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="ConstellationMap"
      lead="An interactive star map with dynamic constellation lines. Drag stars to reposition them and watch the connection lines update in real time."
    >
      <ConstellationMapPlayground />

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
