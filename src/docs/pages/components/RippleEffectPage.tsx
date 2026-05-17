import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { RippleEffect } from "../../../components/RippleEffect";

const PROPS = [
  { name: "color",       type: "string",  default: '"#ffffff"', description: "Ring color." },
  { name: "maxRadius",   type: "number",  default: "150",       description: "Maximum ring expansion radius." },
  { name: "speed",       type: "number",  default: "2",         description: "Ring expansion speed." },
  { name: "lineWidth",   type: "number",  default: "1.5",       description: "Ring stroke width." },
  { name: "decay",       type: "number",  default: "0.8",       description: "Opacity decay rate per frame." },
  { name: "multiRipple", type: "boolean", default: "true",      description: "Allow multiple simultaneous rings." },
  { name: "interactive", type: "boolean", default: "true",      description: "Click to spawn ripples. False = auto mode." },
  { name: "backgroundColor", type: "string", default: '"transparent"', description: "Canvas background color." },
];

export function RippleEffectPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="RippleEffect"
      lead="Expanding concentric ring animations. Click the canvas to spawn ripples, or set interactive={false} for autonomous auto-ripple mode."
    >
      <PreviewBox playgroundId="RippleEffect">
        <div style={{ background: "#111111", width: "100%", height: "100%" }}>
          <RippleEffect maxRadius={150} speed={2} interactive={false} width="100%" height="100%" />
        </div>
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { RippleEffect } from 'own-the-canvas';

// Click to create ripples
<RippleEffect interactive />

// Auto-ripple mode
<RippleEffect interactive={false} />`}
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
