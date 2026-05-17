import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { MatrixRain } from "../../../components/MatrixRain";

const PROPS = [
  { name: "color", type: "string", default: '"#ffffff"', description: "Color of the falling characters." },
  { name: "backgroundColor", type: "string", default: '"rgba(17,17,17,0.1)"', description: "Per-frame overlay — lower opacity = longer trails." },
  { name: "fontSize", type: "number", default: "14", description: "Character size in px; controls column count." },
  { name: "speed", type: "number", default: "33", description: "Ms per frame — lower = faster animation." },
  { name: "charset", type: '"latin" | "binary" | "katakana" | string', default: '"latin"', description: "Characters to rain. Pass a custom string for your own set." },
  { name: "resetThreshold", type: "number", default: "0.95", description: "Probability a drop resets after leaving the bottom (0–1)." },
  { name: "preset", type: '"default" | "cyberpunk" | "binary" | "minimal" | "blood"', default: '"default"', description: "Named preset shorthand." },
];

export function MatrixRainPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="MatrixRain"
      lead="Classic falling-character rain effect. Faithful to the original Matrix algorithm — optimized with requestAnimationFrame and DPR-aware canvas rendering."
    >
      <PreviewBox playgroundId="MatrixRain">
        <MatrixRain fontSize={14} speed={33} charset="latin" width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { MatrixRain } from 'own-the-canvas';

<MatrixRain
  fontSize={14}
  speed={33}
  charset="latin"
  width="100%"
  height="100%"
/>`}
          language="tsx"
        />
      </section>

      <section className="page-section" aria-labelledby="variants-h">
        <h2 className="page-h2" id="variants-h">Variants</h2>
        <h3 className="page-h3">Binary</h3>
        <CodeBlock code={`<MatrixRain charset="binary" color="#00cfff" speed={50} />`} language="tsx" />
        <h3 className="page-h3">Katakana</h3>
        <CodeBlock code={`<MatrixRain charset="katakana" color="#fff" fontSize={16} />`} language="tsx" />
        <h3 className="page-h3">Custom charset</h3>
        <CodeBlock code={`<MatrixRain charset="01アイウ" color="#bf5fff" />`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
