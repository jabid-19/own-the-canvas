import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { NoiseGradient } from "../../../components/NoiseGradient";

const PROPS = [
  { name: "colors",   type: "string[]", default: "—",     description: "Array of 2–6 hex colors to blend between.", required: true },
  { name: "speed",    type: "number",   default: "0.3",   description: "Animation speed (0 = static)." },
  { name: "scale",    type: "number",   default: "1",     description: "Noise zoom level." },
  { name: "octaves",  type: "number",   default: "3",     description: "Perlin noise octaves (detail level)." },
  { name: "animated", type: "boolean",  default: "true",  description: "Enable animation. False renders a static image." },
];

export function NoiseGradientPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="NoiseGradient"
      lead="Animated Perlin noise-driven color gradient. Pass any set of hex colors and they'll blend fluidly across the canvas."
    >
      <PreviewBox playgroundId="NoiseGradient">
        <NoiseGradient colors={["#111111","#6b7280","#ffffff"]} speed={0.3} scale={1} octaves={3} width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { NoiseGradient } from 'own-the-canvas';

<NoiseGradient
  colors={["#111111", "#6b7280", "#ffffff"]}
  speed={0.3}
  scale={1}
  octaves={3}
  width="100%"
  height="100%"
/>`}
          language="tsx"
        />
      </section>

      <section className="page-section" aria-labelledby="presets-h">
        <h2 className="page-h2" id="presets-h">Preset palettes</h2>
        <CodeBlock
          code={`// Sunset
colors={["#0f0c29", "#ff6b6b", "#ffd89b"]}

// Ocean
colors={["#0052d4", "#4364f7", "#6fb1fc"]}

// Plasma
colors={["#12002f", "#7b00d4", "#ff00ff", "#ff9900"]}`}
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
