import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { FluidSimulation } from "../../../components/FluidSimulation";

const PROPS = [
  { name: "resolution",      type: "number",  default: "80",        description: "Grid resolution 32–128. Lower = faster, coarser." },
  { name: "viscosity",       type: "number",  default: "0.0001",    description: "Fluid viscosity — resistance to flow." },
  { name: "diffusion",       type: "number",  default: "0.0001",    description: "Ink diffusion rate." },
  { name: "dissipation",     type: "number",  default: "0.995",     description: "Density fade per frame 0–1." },
  { name: "inkColors",       type: "string[]",default: "multi",     description: "Ink colors painted by mouse and auto-ink." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "autoInk",         type: "boolean", default: "true",      description: "Auto-inject ink bursts without mouse." },
  { name: "autoInkInterval", type: "number",  default: "1500",      description: "Interval between auto-ink bursts in ms." },
  { name: "mouseForce",      type: "number",  default: "5",         description: "Mouse velocity → force multiplier." },
  { name: "inkRadius",       type: "number",  default: "4",         description: "Ink splat radius in grid cells." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "ink" | "neon" | "lava" | "ocean" | "smoke"' },
];

export function FluidSimulationPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="FluidSimulation"
      lead="Grid-based Navier-Stokes fluid simulation with per-channel RGB ink. Move the cursor to paint — velocity carries ink through the fluid field, diffusing and advecting each frame."
    >
      <PreviewBox playgroundId="FluidSimulation">
        <FluidSimulation width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { FluidSimulation } from 'own-the-canvas';

// Move cursor to paint fluid
<FluidSimulation
  resolution={80}
  dissipation={0.995}
  autoInk
  preset="ocean"
  width="100%"
  height="100%"
/>

// High-detail smoke effect
<FluidSimulation preset="smoke" resolution={72} />`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}