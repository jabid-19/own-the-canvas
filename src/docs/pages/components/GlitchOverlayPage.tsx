import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { GlitchOverlay } from "../../../components/GlitchOverlay";

const PROPS = [
  { name: "intensity",       type: "number",  default: "0.6",          description: "Glitch probability 0–1." },
  { name: "speed",           type: "number",  default: "1",            description: "Animation speed multiplier." },
  { name: "rgbShift",        type: "number",  default: "8",            description: "RGB color shift amount in px." },
  { name: "scanlines",       type: "boolean", default: "true",         description: "Show CRT scanlines." },
  { name: "scanlineOpacity", type: "number",  default: "0.08",         description: "Scanline opacity." },
  { name: "scanlineSpacing", type: "number",  default: "2",            description: "Px between scanlines." },
  { name: "blockGlitch",     type: "boolean", default: "true",         description: "Enable block-slice glitch." },
  { name: "blockCount",      type: "number",  default: "4",            description: "Number of glitch blocks per burst." },
  { name: "noiseOpacity",    type: "number",  default: "0.02",         description: "Film grain noise opacity." },
  { name: "flickerRate",     type: "number",  default: "0.02",         description: "Screen flicker rate 0–1." },
  { name: "color",           type: "string",  default: '"#ffffff"',    description: "Glitch bar accent color." },
  { name: "backgroundColor", type: "string",  default: '"transparent"',description: "Canvas background." },
  { name: "preset",          type: "string",  default: "—",            description: '"default" | "crt" | "cyberpunk" | "subtle" | "corrupt"' },
];

export function GlitchOverlayPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="GlitchOverlay"
      lead="CRT-style overlay with scanlines, RGB channel shift, block glitch, and film noise. Composited as an absolute overlay over any content beneath it."
    >
      <PreviewBox playgroundId="GlitchOverlay">
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div style={{ position: "absolute", inset: 0, background: "#111111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "monospace", userSelect: "none" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2 }}>GLITCH</div>
              <div style={{ fontSize: 12, opacity: 0.4, letterSpacing: 6, marginTop: 8 }}>OVERLAY EFFECT</div>
            </div>
          </div>
          <GlitchOverlay style={{ position: "absolute", inset: 0 }} />
        </div>
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { GlitchOverlay } from 'own-the-canvas';

// Overlay over any content
<div style={{ position: "relative" }}>
  <YourContent />
  <GlitchOverlay
    intensity={0.6}
    rgbShift={8}
    scanlines
    preset="cyberpunk"
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