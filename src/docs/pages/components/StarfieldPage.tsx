import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { Starfield } from "../../../components/Starfield";

const PROPS = [
  { name: "starCount",     type: "number",            default: "200",        description: "Number of stars to render." },
  { name: "speed",         type: "number",            default: "0.5",        description: "Star movement speed." },
  { name: "backgroundColor",type: "string",           default: '"#111111"',  description: "Sky background color." },
  { name: "perspective",   type: '"2D" | "3D"',       default: '"2D"',       description: "2D twinkle field or 3D warp tunnel." },
  { name: "twinkle",       type: "boolean",           default: "true",       description: "Enable star twinkle animation." },
  { name: "shootingStars", type: "boolean",           default: "false",      description: "Enable random shooting star events." },
];

export function StarfieldPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Starfield"
      lead="2D twinkle field or 3D warp-speed star tunnel. Switch perspectives with the perspective prop."
    >
      <PreviewBox playgroundId="Starfield">
        <Starfield starCount={200} twinkle speed={0.5} width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { Starfield } from 'own-the-canvas';

// 2D twinkle field
<Starfield starCount={200} twinkle />

// 3D warp tunnel
<Starfield perspective="3D" speed={4} />`}
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
