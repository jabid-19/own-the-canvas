import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSlider, PColor, PToggle, PSel, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Spotlight } from "../../../components/Spotlight";

const PROPS = [
  { name: "radius", type: "number", default: "120", description: "Spotlight radius in px." },
  { name: "color", type: "string", default: '"#ffffff"', description: "Spotlight inner tint color drawn as a radial gradient inside the reveal area." },
  { name: "overlayColor", type: "string", default: '"#000000"', description: "Dark overlay fill color." },
  { name: "overlayOpacity", type: "number", default: "0.75", description: "Overlay opacity 0–1." },
  { name: "edgeSoftness", type: "number", default: "0.4", description: "Edge softness 0–1: 0=hard, 1=very soft." },
  { name: "followSpeed", type: "number", default: "0.1", description: "Mouse follow lerp speed 0–1." },
  { name: "glowColor", type: "string", default: '"#6b7280"', description: "Glow ring color." },
  { name: "glowSize", type: "number", default: "30", description: "Glow ring size in px." },
  { name: "showGlow", type: "boolean", default: "true", description: "Show glow ring around spotlight." },
  { name: "shape", type: '"circle" | "ellipse"', default: '"circle"', description: "Spotlight shape." },
  { name: "ellipseRatio", type: "number", default: "0.6", description: "Y/X ratio when shape is ellipse." },
  { name: "interactive", type: "boolean", default: "true", description: "React to mouse movement." },
  { name: "defaultX", type: "number", default: "0.5", description: "Default X position as fraction of width." },
  { name: "defaultY", type: "number", default: "0.5", description: "Default Y position as fraction of height." },
  { name: "preset", type: "string", default: "—", description: '"default" | "soft" | "dramatic" | "neon" | "ellipse"' },
];

function SpotlightPlayground() {
  const [preset, setPreset] = useState<"default" | "soft" | "dramatic" | "neon" | "ellipse">("default");
  const [radius, setRadius] = useState(120);
  const [opacity, setOpacity] = useState(0.75);
  const [softness, setSoftness] = useState(0.4);
  const [glow, setGlow] = useState(true);
  const [glowColor, setGlowColor] = useState("#6b7280");
  const [overlayColor, setOverlayColor] = useState("#000000");
  const [color, setColor] = useState("#ffffff");
  const [followSpeed, setFollowSpeed] = useState(0.1);
  const [shape, setShape] = useState<"circle" | "ellipse">("circle");
  const [ellipseRatio, setEllipseRatio] = useState(0.6);
  const [interactive, setInteractive] = useState(true);

  const code = [
    `import { Spotlight } from 'own-the-canvas';`,
    ``,
    `<div style={{ position: "relative" }}>`,
    `  <YourContent />`,
    `  <Spotlight`,
    `    preset="${preset}"`,
    `    radius={${radius}}`,
    `    overlayColor="${overlayColor}"`,
    `    overlayOpacity={${opacity}}`,
    `    edgeSoftness={${softness}}`,
    `    glowColor="${glowColor}"`,
    color !== "#ffffff" ? `    color="${color}"` : null,
    `    shape="${shape}"`,
    shape === "ellipse" ? `    ellipseRatio={${ellipseRatio}}` : null,
    `    showGlow={${glow}}`,
    !interactive ? `    interactive={false}` : null,
    `    style={{ position: "absolute", inset: 0 }}`,
    `  />`,
    `</div>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0a0015 0%,#050020 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#fff", padding: 40, pointerEvents: "none", userSelect: "none" }}>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -2, marginBottom: 8 }}>Move cursor</div>
        <div style={{ fontSize: 16, opacity: 0.4 }}>The spotlight follows your mouse</div>
      </div>
      <Spotlight preset={preset} radius={radius} overlayColor={overlayColor} overlayOpacity={opacity}
        edgeSoftness={softness} showGlow={glow} glowColor={glowColor} color={color}
        followSpeed={followSpeed} shape={shape} ellipseRatio={ellipseRatio} interactive={interactive}
        style={{ position: "absolute", inset: 0 }} />
      <PLiveLabel text="Move cursor over preview" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "soft", "dramatic", "neon", "ellipse"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Overlay color" value={overlayColor} onChange={setOverlayColor} />
        <PColor label="Glow color" value={glowColor} onChange={setGlowColor} />
        <PColor label="Spotlight tint" value={color} onChange={setColor} />
        <PSel label="Shape" value={shape} options={["circle", "ellipse"]} onChange={setShape} />
      </div>
      <div>
        <PSlider label="Radius" value={radius} min={40} max={300} step={10} onChange={setRadius} />
        <PSlider label="Overlay opacity" value={opacity} min={0.1} max={0.98} step={0.02} onChange={setOpacity} />
        <PSlider label="Edge softness" value={softness} min={0} max={1} step={0.05} onChange={setSoftness} />
        <PSlider label="Follow speed" value={followSpeed} min={0.01} max={1} step={0.01} onChange={setFollowSpeed} />
        {shape === "ellipse" && <PSlider label="Ellipse ratio" value={ellipseRatio} min={0.2} max={1} step={0.05} onChange={setEllipseRatio} />}
        <PToggle label="Show glow ring" value={glow} onChange={setGlow} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function SpotlightPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Spotlight"
      lead="A mouse-following spotlight that cuts through a dark overlay to reveal content beneath. Perfect for hero sections, interactive reveals, and theater-style presentations."
    >
      <SpotlightPlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls. Place <code style={{ fontFamily: "var(--mono)", fontSize: "0.875em", color: "var(--accent)" }}>Spotlight</code> as an absolute overlay inside any relatively-positioned container.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
