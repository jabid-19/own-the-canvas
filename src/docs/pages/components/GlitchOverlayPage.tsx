import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
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

function GlitchOverlayPlayground() {
  const [preset, setPreset] = useState("default");
  const [intensity, setIntensity] = useState(0.6);
  const [speed, setSpeed] = useState(1);
  const [rgbShift, setRgbShift] = useState(8);
  const [color, setColor] = useState("#ffffff");
  const [scanlines, setScanlines] = useState(true);
  const [blockGlitch, setBlockGlitch] = useState(true);
  const [animated, setAnimated] = useState(true);

  const code = [
    `import { GlitchOverlay } from 'own-the-canvas';`,
    ``,
    `// Overlay over any content`,
    `<div style={{ position: "relative" }}>`,
    `  <YourContent />`,
    `  <GlitchOverlay`,
    `    preset="${preset}"`,
    `    intensity={${intensity}}`,
    `    speed={${speed}}`,
    `    rgbShift={${rgbShift}}`,
    `    color="${color}"`,
    !scanlines ? `    scanlines={false}` : null,
    !blockGlitch ? `    blockGlitch={false}` : null,
    !animated ? `    animated={false}` : null,
    `    style={{ position: "absolute", inset: 0 }}`,
    `  />`,
    `</div>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "#111111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "monospace", userSelect: "none" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2 }}>GLITCH</div>
          <div style={{ fontSize: 12, opacity: 0.4, letterSpacing: 6, marginTop: 8 }}>OVERLAY EFFECT</div>
        </div>
      </div>
      <GlitchOverlay
        preset={preset}
        intensity={intensity}
        speed={speed}
        rgbShift={rgbShift}
        color={color}
        scanlines={scanlines}
        blockGlitch={blockGlitch}
        animated={animated}
        style={{ position: "absolute", inset: 0 }}
      />
      <PLiveLabel text="CRT glitch overlay" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "crt", "cyberpunk", "subtle", "corrupt"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Accent color" value={color} onChange={setColor} />
        <PSlider label="Intensity" value={intensity} min={0} max={1} step={0.05} onChange={setIntensity} />
        <PSlider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
      </div>
      <div>
        <PSlider label="RGB shift" value={rgbShift} min={0} max={30} step={1} onChange={setRgbShift} />
        <PDivider />
        <PToggle label="Scanlines" value={scanlines} onChange={setScanlines} />
        <PToggle label="Block glitch" value={blockGlitch} onChange={setBlockGlitch} />
        <PToggle label="Animated" value={animated} onChange={setAnimated} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function GlitchOverlayPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="GlitchOverlay"
      lead="CRT-style overlay with scanlines, RGB channel shift, block glitch, and film noise. Composited as an absolute overlay over any content beneath it."
    >
      <GlitchOverlayPlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
