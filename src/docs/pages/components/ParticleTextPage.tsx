import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { ParticleText } from "../../../components/ParticleText";

const PROPS = [
  { name: "text",            type: "string",  default: '"hello"',    description: "Text to display as particles." },
  { name: "fontSize",        type: "number",  default: "120",        description: "Font size used for particle sampling in px." },
  { name: "fontFamily",      type: "string",  default: '"sans-serif"', description: "Font family for text rendering." },
  { name: "color",           type: "string",  default: '"#ffffff"',  description: "Particle color." },
  { name: "backgroundColor", type: "string",  default: '"#111111"',  description: "Canvas background color." },
  { name: "particleSize",    type: "number",  default: "2",          description: "Particle radius in px." },
  { name: "particleGap",     type: "number",  default: "4",          description: "Sampling grid step — smaller = more particles." },
  { name: "repelRadius",     type: "number",  default: "80",         description: "Mouse influence radius in px." },
  { name: "repelForce",      type: "number",  default: "5",          description: "Repulsion strength." },
  { name: "snapSpeed",       type: "number",  default: "0.12",       description: "Spring constant for particle return." },
  { name: "friction",        type: "number",  default: "0.85",       description: "Velocity damping per frame." },
  { name: "glowEffect",      type: "boolean", default: "false",      description: "Glow on particles." },
  { name: "glowBlur",        type: "number",  default: "6",          description: "Shadow blur for glow." },
  { name: "animated",        type: "boolean", default: "true",       description: "Enable animation." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Mouse repulsion interaction." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "neon" | "fire" | "frost" | "gold" | "minimal"' },
];

const PRESET_PARAMS = {
  default: { color: "#ffffff", bg: "#111111", particleSize: 2, repelRadius: 80, repelForce: 5, snapSpeed: 0.12, glowEffect: false, glowBlur: 6 },
  neon:    { color: "#00ffcc", bg: "#000000", particleSize: 2, repelRadius: 80, repelForce: 7, snapSpeed: 0.12, glowEffect: true,  glowBlur: 10 },
  fire:    { color: "#f97316", bg: "#0a0200", particleSize: 2, repelRadius: 80, repelForce: 8, snapSpeed: 0.12, glowEffect: true,  glowBlur: 12 },
  frost:   { color: "#93c5fd", bg: "#030712", particleSize: 2, repelRadius: 100, repelForce: 5, snapSpeed: 0.08, glowEffect: true,  glowBlur: 8 },
  gold:    { color: "#fbbf24", bg: "#0a0800", particleSize: 2, repelRadius: 80, repelForce: 5, snapSpeed: 0.12, glowEffect: true,  glowBlur: 14 },
  minimal: { color: "#6b7280", bg: "#111111", particleSize: 1.5, repelRadius: 80, repelForce: 3, snapSpeed: 0.12, glowEffect: false, glowBlur: 6 },
};

function ParticleTextPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]         = useState("default");
  const [text, setText]             = useState("hello");
  const [fontSize, setFontSize]     = useState(120);
  const [color, setColor]           = useState("#ffffff");
  const [bg, setBg]                 = useState("#111111");
  const [particleSize, setPSize]    = useState(2);
  const [particleGap, setPGap]      = useState(4);
  const [repelRadius, setRepRad]    = useState(80);
  const [repelForce, setRepForce]   = useState(5);
  const [snapSpeed, setSnap]        = useState(0.12);
  const [friction, setFriction]     = useState(0.85);
  const [glowEffect, setGlow]       = useState(false);
  const [glowBlur, setGlowBlur]     = useState(6);
  const [animated, setAnimated]     = useState(true);
  const [interactive, setInteract]  = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setColor(pp.color);
    setBg(pp.bg);
    setPSize(pp.particleSize);
    setRepRad(pp.repelRadius);
    setRepForce(pp.repelForce);
    setSnap(pp.snapSpeed);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
  }

  const code = [
    `import { ParticleText } from 'own-the-canvas';`,
    ``,
    `<ParticleText`,
    `  preset="${preset}"`,
    `  text="${text}"`,
    `  fontSize={${fontSize}}`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  particleSize={${particleSize}}`,
    `  particleGap={${particleGap}}`,
    `  repelRadius={${repelRadius}}`,
    `  repelForce={${repelForce}}`,
    `  snapSpeed={${snapSpeed}}`,
    `  friction={${friction}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ParticleText
        preset={preset}
        text={text}
        fontSize={fontSize}
        color={color}
        backgroundColor={bg}
        particleSize={particleSize}
        particleGap={particleGap}
        repelRadius={repelRadius}
        repelForce={repelForce}
        snapSpeed={snapSpeed}
        friction={friction}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        interactive={interactive}
        animated={animated}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "fire", "frost", "gold", "minimal"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Particle color" value={color} onChange={setColor} />
        <PColor label="Background"     value={bg}    onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect"  value={glowEffect}  onChange={setGlow} />
        <PToggle label="Interactive"  value={interactive} onChange={setInteract} />
        <PToggle label="Animated"     value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Font size"      value={fontSize}     min={40}   max={200}  step={10}   onChange={setFontSize} />
        <PSlider label="Particle size"  value={particleSize} min={0.5}  max={5}    step={0.5}  onChange={setPSize} />
        <PSlider label="Particle gap"   value={particleGap}  min={2}    max={12}   step={1}    onChange={setPGap} />
        <PSlider label="Repel radius"   value={repelRadius}  min={20}   max={200}  step={10}   onChange={setRepRad} />
        <PSlider label="Repel force"    value={repelForce}   min={1}    max={20}   step={0.5}  onChange={setRepForce} />
        <PSlider label="Snap speed"     value={snapSpeed}    min={0.01} max={0.5}  step={0.01} onChange={setSnap} />
        <PSlider label="Friction"       value={friction}     min={0.5}  max={0.99} step={0.01} onChange={setFriction} />
        <PSlider label="Glow blur"      value={glowBlur}     min={0}    max={30}   step={1}    onChange={setGlowBlur} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function ParticleTextPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="ParticleText"
      lead="Text assembled from hundreds of tiny particles. Move your mouse over the canvas to scatter them — they spring back to form the text the moment you pull away. Change the text, tweak font size, and watch particles instantly reorganize."
    >
      <ParticleTextPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Try <strong>neon</strong> for a glowing cyan look or <strong>fire</strong> for an orange ember effect. Lower <strong>particle gap</strong> for denser text at the cost of performance. Raise <strong>repel force</strong> for explosive scatter. Lower <strong>snap speed</strong> for a slow, dreamy return animation.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
