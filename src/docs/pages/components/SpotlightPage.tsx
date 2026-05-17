import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { Spotlight } from "../../../components/Spotlight";

const PROPS = [
  { name: "radius",        type: "number",            default: "120",       description: "Spotlight radius in px." },
  { name: "overlayColor",  type: "string",            default: '"#000000"', description: "Dark overlay fill color." },
  { name: "overlayOpacity",type: "number",            default: "0.75",      description: "Overlay opacity 0–1." },
  { name: "edgeSoftness",  type: "number",            default: "0.4",       description: "Edge softness 0–1: 0=hard, 1=very soft." },
  { name: "followSpeed",   type: "number",            default: "0.1",       description: "Mouse follow lerp speed 0–1." },
  { name: "glowColor",     type: "string",            default: '"#6b7280"', description: "Glow ring color." },
  { name: "glowSize",      type: "number",            default: "30",        description: "Glow ring size in px." },
  { name: "showGlow",      type: "boolean",           default: "true",      description: "Show glow ring around spotlight." },
  { name: "shape",         type: '"circle" | "ellipse"', default: '"circle"', description: "Spotlight shape." },
  { name: "ellipseRatio",  type: "number",            default: "0.6",       description: "Y/X ratio when shape is ellipse." },
  { name: "interactive",   type: "boolean",           default: "true",      description: "React to mouse movement." },
  { name: "defaultX",      type: "number",            default: "0.5",       description: "Default X position as fraction of width." },
  { name: "defaultY",      type: "number",            default: "0.5",       description: "Default Y position as fraction of height." },
  { name: "preset",        type: "string",            default: "—",         description: '"default" | "soft" | "dramatic" | "neon" | "ellipse"' },
];

export function SpotlightPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Spotlight"
      lead="A mouse-following spotlight that cuts through a dark overlay to reveal content beneath. Perfect for hero sections, interactive reveals, and theater-style presentations."
    >
      <PreviewBox playgroundId="Spotlight">
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", userSelect: "none" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Move your cursor</div>
              <div style={{ opacity: 0.4 }}>The spotlight follows you</div>
            </div>
          </div>
          <Spotlight style={{ position: "absolute", inset: 0 }} />
        </div>
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { Spotlight } from 'own-the-canvas';

// Place over any content with position: relative on the parent
<div style={{ position: "relative" }}>
  <YourContent />
  <Spotlight
    radius={120}
    overlayOpacity={0.75}
    showGlow
    glowColor="#6b7280"
    style={{ position: "absolute", inset: 0 }}
  />
</div>`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}