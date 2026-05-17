import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { Mandala } from "../../../components/Mandala";

const PROPS = [
  { name: "symmetry",        type: "number",  default: "8",        description: "Number of rotational symmetry arms." },
  { name: "colors",          type: "string[]",default: "multi",    description: "Stroke colors cycled per layer." },
  { name: "lineWidth",       type: "number",  default: "1.5",      description: "Stroke line width." },
  { name: "speed",           type: "number",  default: "1",        description: "Rotation animation speed." },
  { name: "layers",          type: "number",  default: "5",        description: "Number of concentric petal layers." },
  { name: "radius",          type: "number",  default: "1",        description: "Outer radius as fraction of canvas min dimension." },
  { name: "backgroundColor", type: "string",  default: '"#111111"',description: "Canvas background color." },
  { name: "animated",        type: "boolean", default: "true",     description: "Enable rotation animation." },
  { name: "glowEffect",      type: "boolean", default: "true",     description: "Glow effect on strokes." },
  { name: "glowBlur",        type: "number",  default: "10",       description: "Shadow blur for glow." },
  { name: "strokeOpacity",   type: "number",  default: "0.8",      description: "Layer stroke opacity 0–1." },
  { name: "mirror",          type: "boolean", default: "true",     description: "Mirror each arm for bilateral symmetry." },
  { name: "noiseAmount",     type: "number",  default: "0.3",      description: "Organic noise distortion 0–1." },
  { name: "preset",          type: "string",  default: "—",        description: '"default" | "neon" | "lotus" | "cosmic" | "minimal"' },
];

export function MandalaPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Mandala"
      lead="Animated N-fold rotational symmetry with layered organic petal shapes. Controllable symmetry arms, bilateral mirroring, and noise distortion for natural-looking geometry."
    >
      <PreviewBox playgroundId="Mandala">
        <Mandala width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { Mandala } from 'own-the-canvas';

<Mandala
  symmetry={8}
  layers={5}
  speed={1}
  mirror
  glowEffect
  preset="cosmic"
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