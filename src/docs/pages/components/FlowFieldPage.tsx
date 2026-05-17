import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { FlowField } from "../../../components/FlowField";

const PROPS = [
  { name: "particleCount",  type: "number",   default: "800",       description: "Number of flow particles." },
  { name: "colors",         type: "string[]", default: "multi",     description: "Particle stroke colors — one picked per particle." },
  { name: "speed",          type: "number",   default: "1",         description: "Flow speed multiplier." },
  { name: "noiseScale",     type: "number",   default: "0.004",     description: "Noise sampling scale — lower = larger flow structures." },
  { name: "trailLength",    type: "number",   default: "0.04",      description: "Trail fade length — lower = longer trails." },
  { name: "fadeStrength",   type: "number",   default: "0.04",      description: "Background fade opacity per frame." },
  { name: "lineWidth",      type: "number",   default: "1",         description: "Stroke line width in px." },
  { name: "backgroundColor",type: "string",   default: '"#111111"', description: "Canvas background color." },
  { name: "animated",       type: "boolean",  default: "true",      description: "Enable animation loop." },
  { name: "timeSpeed",      type: "number",   default: "1",         description: "How fast the noise field evolves." },
  { name: "curl",           type: "boolean",  default: "false",     description: "Add curl noise for more swirling flow." },
  { name: "preset",         type: "string",   default: "—",         description: '"default" | "neon" | "ocean" | "lava" | "forest" | "monochrome"' },
];

export function FlowFieldPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="FlowField"
      lead="Perlin noise vector field that guides particle streams. Particles follow smooth, evolving flow directions — add curl noise for extra swirling character."
    >
      <PreviewBox playgroundId="FlowField">
        <FlowField width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { FlowField } from 'own-the-canvas';

<FlowField
  particleCount={800}
  speed={1}
  curl={false}
  preset="neon"
  width="100%"
  height="100%"
/>`} language="tsx" />
      </section>

      <section className="page-section" aria-labelledby="variants-h">
        <h2 className="page-h2" id="variants-h">Presets</h2>
        <CodeBlock code={`<FlowField preset="ocean" />   // calm blues
<FlowField preset="lava" />    // slow reds/oranges
<FlowField preset="forest" curl />  // swirling greens`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}