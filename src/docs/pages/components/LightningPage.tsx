import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { Lightning } from "../../../components/Lightning";

const PROPS = [
  { name: "segments",       type: "number",  default: "8",         description: "Recursion depth — more segments = finer bolt detail." },
  { name: "roughness",      type: "number",  default: "0.5",       description: "Midpoint displacement roughness 0–1." },
  { name: "branchChance",   type: "number",  default: "0.3",       description: "Probability of a branch at each segment." },
  { name: "branchDecay",    type: "number",  default: "0.6",       description: "Energy multiplier for sub-branches." },
  { name: "flickerCount",   type: "number",  default: "3",         description: "Rapid flicker strikes per event." },
  { name: "glowBlur",       type: "number",  default: "20",        description: "Glow shadow blur radius." },
  { name: "color",          type: "string",  default: '"#6b7280"', description: "Bolt glow color." },
  { name: "coreColor",      type: "string",  default: '"#ffffff"', description: "Inner bright core color." },
  { name: "backgroundColor",type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "autoInterval",   type: "number",  default: "2000",      description: "Ms between automatic strikes." },
  { name: "interactive",    type: "boolean", default: "true",      description: "Click to trigger a strike at cursor." },
  { name: "startX",         type: "number",  default: "0.5",       description: "Strike origin X as fraction of width." },
  { name: "startY",         type: "number",  default: "0",         description: "Strike origin Y as fraction of height." },
  { name: "endY",           type: "number",  default: "1",         description: "Strike end Y as fraction of height." },
  { name: "preset",         type: "string",  default: "—",         description: '"default" | "neon" | "storm" | "plasma" | "subtle"' },
];

export function LightningPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Lightning"
      lead="Recursive fractal branching lightning bolts with glow, flicker, and auto-strike. Click anywhere to trigger a strike — or let it fire automatically."
    >
      <PreviewBox playgroundId="Lightning">
        <Lightning width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { Lightning } from 'own-the-canvas';

// Click to strike, auto-fires every 2s
<Lightning
  segments={8}
  branchChance={0.3}
  glowBlur={20}
  interactive
  preset="neon"
  width="100%"
  height="100%"
/>

// Stormy fast strikes
<Lightning preset="storm" autoInterval={800} />

// Plasma discharge
<Lightning preset="plasma" startX={0.2} />`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
