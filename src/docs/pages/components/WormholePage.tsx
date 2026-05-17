import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { Wormhole } from "../../../components/Wormhole";

const PROPS = [
  { name: "ringCount",      type: "number",   default: "30",                   description: "Number of tunnel rings." },
  { name: "speed",          type: "number",   default: "1",                    description: "Forward travel speed." },
  { name: "colors",         type: "string[]", default: '["#ffffff","#6b7280"]',description: "Ring stroke colors — cycles through array." },
  { name: "backgroundColor",type: "string",   default: '"#111111"',            description: "Canvas background color." },
  { name: "twist",          type: "number",   default: "0.3",                  description: "Ring rotation twist per unit depth." },
  { name: "fov",            type: "number",   default: "300",                  description: "Perspective field of view." },
  { name: "depth",          type: "number",   default: "400",                  description: "Perspective depth scale." },
  { name: "lineWidth",      type: "number",   default: "1.5",                  description: "Ring stroke width." },
  { name: "opacity",        type: "number",   default: "0.8",                  description: "Ring opacity 0–1." },
  { name: "starCount",      type: "number",   default: "100",                  description: "Tunnel wall star count." },
  { name: "starColor",      type: "string",   default: '"#ffffff"',            description: "Star dot color." },
  { name: "interactive",    type: "boolean",  default: "true",                 description: "Mouse X controls tunnel speed." },
  { name: "preset",         type: "string",   default: "—",                    description: '"default" | "hyperspace" | "neon" | "vortex" | "minimal"' },
];

export function WormholePage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Wormhole"
      lead="3D perspective tunnel rushing toward the camera with twisting rings and star particles. Move the mouse to control speed. A classic hyperspace hero section effect."
    >
      <PreviewBox playgroundId="Wormhole">
        <Wormhole width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { Wormhole } from 'own-the-canvas';

<Wormhole
  ringCount={30}
  speed={1}
  twist={0.3}
  interactive
  preset="hyperspace"
  width="100%"
  height="100%"
/>

// Neon vortex
<Wormhole preset="vortex" twist={1.2} speed={1.5} />

// Custom colors
<Wormhole colors={["#ff00ff","#00ffff","#00ff41"]} />`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
