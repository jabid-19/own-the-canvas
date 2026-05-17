import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { LiveChart } from "../../../components/LiveChart";
import type { LiveChartSeries } from "../../../components/LiveChart";

const series: LiveChartSeries[] = [
  { data: Array.from({ length: 40 }, (_, i) => 50 + Math.sin(i * 0.4) * 30), color: "#ffffff", filled: true },
  { data: Array.from({ length: 40 }, (_, i) => 50 + Math.cos(i * 0.3) * 20), color: "#6b7280", filled: true },
];

const PROPS = [
  { name: "series",          type: "LiveChartSeries[]", default: "demo data", description: "Array of { data, color, label?, filled? } series objects." },
  { name: "maxPoints",       type: "number",  default: "100",      description: "Max data points kept per series before scrolling." },
  { name: "lineWidth",       type: "number",  default: "2",        description: "Line stroke width." },
  { name: "showGrid",        type: "boolean", default: "true",     description: "Show horizontal grid lines." },
  { name: "gridColor",       type: "string",  default: '"#ffffff"',description: "Grid line color." },
  { name: "gridOpacity",     type: "number",  default: "0.08",     description: "Grid line opacity." },
  { name: "showDots",        type: "boolean", default: "false",    description: "Show data point dots." },
  { name: "dotRadius",       type: "number",  default: "3",        description: "Dot radius when shown." },
  { name: "fillOpacity",     type: "number",  default: "1",        description: "Fill area opacity multiplier." },
  { name: "backgroundColor", type: "string",  default: '"#111111"',description: "Canvas background color." },
  { name: "padding",         type: "number",  default: "20",       description: "Inner padding in px." },
  { name: "yMin",            type: "number",  default: "auto",     description: "Fixed y-axis minimum." },
  { name: "yMax",            type: "number",  default: "auto",     description: "Fixed y-axis maximum." },
  { name: "smooth",          type: "boolean", default: "true",     description: "Smooth curves with quadratic bezier." },
  { name: "glowEffect",      type: "boolean", default: "true",     description: "Glow on lines." },
  { name: "glowBlur",        type: "number",  default: "8",        description: "Shadow blur for glow." },
  { name: "preset",          type: "string",  default: "—",        description: '"default" | "neon" | "minimal" | "ocean" | "fire"' },
];

export function LiveChartPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="LiveChart"
      lead="Real-time animated line and area chart. Push data points dynamically and the chart scrolls automatically. Supports multiple series, smooth bezier curves, and glow."
    >
      <PreviewBox playgroundId="LiveChart">
        <LiveChart series={series} width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { LiveChart } from 'own-the-canvas';
import type { LiveChartSeries } from 'own-the-canvas';

const series: LiveChartSeries[] = [
  { data: [10, 45, 30, 80, 55], color: "#ffffff", filled: true },
  { data: [20, 35, 60, 40, 70], color: "#6b7280", filled: true },
];

<LiveChart
  series={series}
  smooth
  showGrid
  glowEffect
  preset="default"
  width="100%"
  height="100%"
/>`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}