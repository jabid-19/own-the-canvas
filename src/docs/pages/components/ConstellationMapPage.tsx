import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { ConstellationMap } from "../../../components/ConstellationMap";

const PROPS = [
  { name: "starCount",          type: "number",                    default: "80",         description: "Number of stars in the constellation." },
  { name: "starColor",          type: "string",                    default: '"#ffffff"',  description: "Star fill color." },
  { name: "lineColor",          type: "string",                    default: '"#6b7280"',  description: "Connection line color." },
  { name: "backgroundColor",    type: "string",                    default: '"#111111"',  description: "Canvas background color." },
  { name: "connectionDistance", type: "number",                    default: "100",        description: "Max distance to draw connection lines." },
  { name: "speed",              type: "number",                    default: "0.3",        description: "Star drift speed." },
  { name: "interactive",        type: "boolean",                   default: "true",       description: "Drag stars to reposition them." },
  { name: "lineStyle",          type: '"solid" | "dashed"',        default: '"solid"',    description: "Line stroke style." },
  { name: "glowStars",          type: "boolean",                   default: "false",      description: "Enable glow effect on stars." },
];

export function ConstellationMapPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="ConstellationMap"
      lead="An interactive star map with dynamic constellation lines. Drag stars to reposition them and watch the connection lines update in real time."
    >
      <PreviewBox playgroundId="ConstellationMap">
        <ConstellationMap starCount={80} interactive glowStars width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { ConstellationMap } from 'own-the-canvas';

<ConstellationMap
  starCount={80}
  starColor="#ffffff"
  lineColor="#6b7280"
  connectionDistance={100}
  interactive
  glowStars
  width="100%"
  height="100%"
/>`}
          language="tsx"
        />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
