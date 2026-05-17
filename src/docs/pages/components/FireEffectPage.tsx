import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { FireEffect } from "../../../components/FireEffect";

const PROPS = [
  { name: "palette",   type: '"ash" | "inferno" | "toxic" | "ice" | "plasma"', default: '"ash"', description: "Color palette for the fire simulation." },
  { name: "intensity", type: "number", default: "0.95",  description: "Fire intensity (0–1). Higher = taller flames." },
  { name: "windStrength", type: "number", default: "0.3", description: "Horizontal wind drift strength." },
  { name: "spread",    type: "number", default: "0.7",   description: "Horizontal spread of the flame base." },
  { name: "cooling",   type: "number", default: "0.3",   description: "Cooling rate. Higher = shorter flames." },
];

export function FireEffectPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="FireEffect"
      lead="Pixel-level fire simulation using a cellular automaton approach. Choose from four distinct color palettes."
    >
      <PreviewBox playgroundId="FireEffect">
        <FireEffect palette="ash" intensity={0.95} width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { FireEffect } from 'own-the-canvas';

<FireEffect
  palette="ash"
  intensity={0.95}
  windStrength={0.3}
  spread={0.7}
  cooling={0.3}
  width="100%"
  height="100%"
/>`}
          language="tsx"
        />
      </section>

      <section className="page-section" aria-labelledby="palettes-h">
        <h2 className="page-h2" id="palettes-h">Palettes</h2>
        <CodeBlock code={`<FireEffect palette="inferno" />  // classic orange-red fire
<FireEffect palette="toxic" />   // green chemical fire
<FireEffect palette="ice" />     // cool blue frost flame
<FireEffect palette="plasma" />  // purple-magenta energy`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
