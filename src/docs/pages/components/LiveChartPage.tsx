import { useState, useMemo } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { LiveChart } from "../../../components/LiveChart";
import type { LiveChartSeries } from "../../../components/LiveChart";

const PROPS = [
  { name: "series",           type: "LiveChartSeries[]", default: "demo data", description: "Array of { data, color, label?, filled? } series objects." },
  { name: "maxPoints",        type: "number",  default: "100",       description: "Max data points kept per series before scrolling." },
  { name: "lineWidth",        type: "number",  default: "2",         description: "Line stroke width." },
  { name: "showGrid",         type: "boolean", default: "true",      description: "Show horizontal grid lines." },
  { name: "gridColor",        type: "string",  default: '"#ffffff"', description: "Grid line color." },
  { name: "gridOpacity",      type: "number",  default: "0.08",      description: "Grid line opacity." },
  { name: "showDots",         type: "boolean", default: "false",     description: "Show data point dots." },
  { name: "dotRadius",        type: "number",  default: "3",         description: "Dot radius when shown." },
  { name: "fillOpacity",      type: "number",  default: "1",         description: "Fill area opacity multiplier." },
  { name: "backgroundColor",  type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "padding",          type: "number",  default: "20",        description: "Inner padding in px." },
  { name: "yMin",             type: "number",  default: "auto",      description: "Fixed y-axis minimum." },
  { name: "yMax",             type: "number",  default: "auto",      description: "Fixed y-axis maximum." },
  { name: "smooth",           type: "boolean", default: "true",      description: "Smooth curves with quadratic bezier." },
  { name: "glowEffect",       type: "boolean", default: "true",      description: "Glow on lines." },
  { name: "glowBlur",         type: "number",  default: "8",         description: "Shadow blur for glow." },
  { name: "preset",           type: "string",  default: "—",         description: '"default" | "neon" | "minimal" | "ocean" | "fire"' },
];

function LiveChartPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [smooth, setSmooth] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showDots, setShowDots] = useState(false);
  const [glow, setGlow] = useState(true);
  const [bg, setBg] = useState("#111111");

  const series: LiveChartSeries[] = useMemo(() => [
    { data: Array.from({ length: 40 }, (_, i) => 50 + Math.sin(i * 0.4) * 30 + Math.random() * 10), color: "#ffffff", filled: true },
    { data: Array.from({ length: 40 }, (_, i) => 50 + Math.cos(i * 0.3) * 20 + Math.random() * 8), color: "#6b7280", filled: true },
  ], []);

  const code = [
    `import { LiveChart } from 'own-the-canvas';`,
    `import type { LiveChartSeries } from 'own-the-canvas';`,
    ``,
    `const series: LiveChartSeries[] = [`,
    `  { data: myData1, color: "#ffffff", filled: true },`,
    `  { data: myData2, color: "#6b7280", filled: true },`,
    `];`,
    ``,
    `<LiveChart`,
    `  preset="${preset}"`,
    `  series={series}`,
    smooth ? null : `  smooth={false}`,
    !showGrid ? `  showGrid={false}` : null,
    showDots ? `  showDots` : null,
    glow ? null : `  glowEffect={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <LiveChart preset={preset} series={series} smooth={smooth} showGrid={showGrid}
        showDots={showDots} glowEffect={glow} backgroundColor={bg}
        width="100%" height="100%" />
      <PLiveLabel text="Static dataset — push data dynamically" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "minimal", "ocean", "fire"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PToggle label="Smooth curves" value={smooth} onChange={setSmooth} />
        <PToggle label="Grid lines" value={showGrid} onChange={setShowGrid} />
        <PToggle label="Data dots" value={showDots} onChange={setShowDots} />
        <PToggle label="Glow effect" value={glow} onChange={setGlow} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function LiveChartPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="LiveChart"
      lead="Real-time animated line and area chart. Push data points dynamically and the chart scrolls automatically. Supports multiple series, smooth bezier curves, and glow."
    >
      <LiveChartPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
