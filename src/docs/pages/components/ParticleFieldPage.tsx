import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { ParticleField } from "../../../components/ParticleField";

const PROPS = [
  { name: "particleCount",   type: "number",  default: "120",       description: "Number of particles." },
  { name: "particleColor",   type: "string",  default: '"#ffffff"', description: "Particle fill color." },
  { name: "lineColor",       type: "string",  default: '"#6b7280"', description: "Connection line color." },
  { name: "lineDistance",    type: "number",  default: "120",       description: "Max distance between connected particles." },
  { name: "particleSize",    type: "number",  default: "2.5",       description: "Particle radius in pixels." },
  { name: "speed",           type: "number",  default: "0.8",       description: "Particle movement speed." },
  { name: "connectParticles",type: "boolean", default: "true",      description: "Draw lines between nearby particles." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Enable mouse repulsion effect." },
  { name: "backgroundColor", type: "string",  default: '"transparent"', description: "Canvas background color." },
];

export function ParticleFieldPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="ParticleField"
      lead="Floating particles with optional connection lines. Move your cursor over the canvas to activate the mouse repulsion interaction."
    >
      <PreviewBox playgroundId="ParticleField">
        <ParticleField particleCount={100} connectParticles interactive width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { ParticleField } from 'own-the-canvas';

<ParticleField
  particleCount={120}
  lineDistance={120}
  connectParticles
  interactive
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
