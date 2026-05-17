import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { Boids } from "../../../components/Boids";

const PROPS = [
  { name: "count",            type: "number",  default: "80",        description: "Number of boids." },
  { name: "maxSpeed",         type: "number",  default: "3",         description: "Maximum speed in px/frame." },
  { name: "separationRadius", type: "number",  default: "25",        description: "Radius for separation rule in px." },
  { name: "alignmentRadius",  type: "number",  default: "50",        description: "Radius for alignment rule in px." },
  { name: "cohesionRadius",   type: "number",  default: "60",        description: "Radius for cohesion rule in px." },
  { name: "separationForce",  type: "number",  default: "0.05",      description: "Separation steering force." },
  { name: "alignmentForce",   type: "number",  default: "0.05",      description: "Alignment steering force." },
  { name: "cohesionForce",    type: "number",  default: "0.03",      description: "Cohesion steering force." },
  { name: "color",            type: "string",  default: '"#ffffff"', description: "Boid and trail color." },
  { name: "trailLength",      type: "number",  default: "8",         description: "Trail history length in frames." },
  { name: "trailOpacity",     type: "number",  default: "0.4",       description: "Trail line opacity 0–1." },
  { name: "boidSize",         type: "number",  default: "6",         description: "Boid triangle size in px." },
  { name: "backgroundColor",  type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "interactive",      type: "boolean", default: "true",      description: "Boids flee from mouse cursor." },
  { name: "mouseRadius",      type: "number",  default: "80",        description: "Mouse avoidance radius in px." },
  { name: "mouseForce",       type: "number",  default: "0.2",       description: "Mouse avoidance force." },
  { name: "wrapEdges",        type: "boolean", default: "true",      description: "Wrap boids at canvas edges." },
  { name: "preset",           type: "string",  default: "—",         description: '"default" | "birds" | "fish" | "swarm" | "neon"' },
];

export function BoidsPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Boids"
      lead="Craig Reynolds' emergent flocking algorithm — separation, alignment, and cohesion produce lifelike murmuration. Move your cursor to scatter the flock."
    >
      <PreviewBox playgroundId="Boids">
        <Boids width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { Boids } from 'own-the-canvas';

<Boids
  count={80}
  maxSpeed={3}
  interactive
  preset="birds"
  width="100%"
  height="100%"
/>

// Fish school
<Boids preset="fish" cohesionForce={0.05} />

// Dense insect swarm
<Boids preset="swarm" count={200} boidSize={4} />`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
