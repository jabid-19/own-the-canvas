import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { InkBleed } from "../../../components/InkBleed";

const PROPS = [
  { name: "inkColor",        type: "string",  default: '"#ffffff"', description: "Primary ink color." },
  { name: "paperColor",      type: "string",  default: '"#111111"', description: "Background paper color." },
  { name: "diffusionRate",   type: "number",  default: "0.3",       description: "Speed ink spreads outward 0–1." },
  { name: "viscosity",       type: "number",  default: "0.8",       description: "Ink thickness — higher = slower bleed." },
  { name: "evaporationRate", type: "number",  default: "0.002",     description: "How fast ink fades per frame." },
  { name: "inkRadius",       type: "number",  default: "8",         description: "Drop radius on click in px." },
  { name: "inkStrength",     type: "number",  default: "1",         description: "Initial ink concentration 0–1." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Click/drag to drop ink." },
  { name: "autoInk",         type: "boolean", default: "true",      description: "Auto-drop ink at intervals." },
  { name: "autoInkInterval", type: "number",  default: "2000",      description: "Ms between auto drops." },
  { name: "resolution",      type: "number",  default: "0.5",       description: "Render resolution fraction — lower is faster." },
  { name: "glowEffect",      type: "boolean", default: "false",     description: "Glow on ink." },
  { name: "glowBlur",        type: "number",  default: "8",         description: "Shadow blur radius for glow." },
  { name: "animated",        type: "boolean", default: "true",      description: "Enable animation." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "midnight" | "sepia" | "toxic" | "neon" | "frost"' },
];

const PRESET_PARAMS = {
  default:  { inkColor: "#ffffff", paperColor: "#111111", diffusionRate: 0.3,  viscosity: 0.8,  evaporationRate: 0.002, glowEffect: false, glowBlur: 8 },
  midnight: { inkColor: "#3b82f6", paperColor: "#020817", diffusionRate: 0.4,  viscosity: 0.8,  evaporationRate: 0.002, glowEffect: true,  glowBlur: 12 },
  sepia:    { inkColor: "#92400e", paperColor: "#fef3c7", diffusionRate: 0.2,  viscosity: 0.9,  evaporationRate: 0.002, glowEffect: false, glowBlur: 8 },
  toxic:    { inkColor: "#84cc16", paperColor: "#0a0f00", diffusionRate: 0.5,  viscosity: 0.8,  evaporationRate: 0.002, glowEffect: true,  glowBlur: 12 },
  neon:     { inkColor: "#f0abfc", paperColor: "#0a000f", diffusionRate: 0.35, viscosity: 0.8,  evaporationRate: 0.002, glowEffect: true,  glowBlur: 15 },
  frost:    { inkColor: "#bae6fd", paperColor: "#0c1428", diffusionRate: 0.25, viscosity: 0.85, evaporationRate: 0.001, glowEffect: false, glowBlur: 8 },
};

function InkBleedPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]       = useState("default");
  const [inkColor, setInkColor]   = useState("#ffffff");
  const [paperColor, setPaper]    = useState("#111111");
  const [diffusion, setDiffusion] = useState(0.3);
  const [viscosity, setViscosity] = useState(0.8);
  const [evapRate, setEvapRate]   = useState(0.002);
  const [inkRadius, setInkRadius] = useState(8);
  const [inkStrength, setInkStr]  = useState(1);
  const [interactive, setInteract]= useState(true);
  const [autoInk, setAutoInk]     = useState(true);
  const [autoInterval, setAutoInterval] = useState(2000);
  const [resolution, setRes]      = useState(0.5);
  const [glowEffect, setGlow]     = useState(false);
  const [glowBlur, setGlowBlur]   = useState(8);
  const [animated, setAnimated]   = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setInkColor(pp.inkColor);
    setPaper(pp.paperColor);
    setDiffusion(pp.diffusionRate);
    setViscosity(pp.viscosity);
    setEvapRate(pp.evaporationRate);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
  }

  const code = [
    `import { InkBleed } from 'own-the-canvas';`,
    ``,
    `<InkBleed`,
    `  preset="${preset}"`,
    `  inkColor="${inkColor}"`,
    `  paperColor="${paperColor}"`,
    `  diffusionRate={${diffusion}}`,
    `  viscosity={${viscosity}}`,
    `  evaporationRate={${evapRate}}`,
    `  inkRadius={${inkRadius}}`,
    `  inkStrength={${inkStrength}}`,
    `  interactive={${interactive}}`,
    `  autoInk={${autoInk}}`,
    `  autoInkInterval={${autoInterval}}`,
    `  resolution={${resolution}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <InkBleed
        preset={preset}
        inkColor={inkColor}
        paperColor={paperColor}
        diffusionRate={diffusion}
        viscosity={viscosity}
        evaporationRate={evapRate}
        inkRadius={inkRadius}
        inkStrength={inkStrength}
        interactive={interactive}
        autoInk={autoInk}
        autoInkInterval={autoInterval}
        resolution={resolution}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
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
        <PSel label="Preset" value={preset} options={["default", "midnight", "sepia", "toxic", "neon", "frost"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Ink color"   value={inkColor}   onChange={setInkColor} />
        <PColor label="Paper color" value={paperColor} onChange={setPaper} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteract} />
        <PToggle label="Auto ink"    value={autoInk}     onChange={setAutoInk} />
        <PToggle label="Glow effect" value={glowEffect}  onChange={setGlow} />
        <PToggle label="Animated"    value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Diffusion rate"   value={diffusion}    min={0.01} max={0.9}  step={0.01} onChange={setDiffusion} />
        <PSlider label="Viscosity"        value={viscosity}    min={0}    max={0.99} step={0.01} onChange={setViscosity} />
        <PSlider label="Evaporation rate" value={evapRate}     min={0}    max={0.02} step={0.0005} onChange={setEvapRate} />
        <PSlider label="Ink radius"       value={inkRadius}    min={2}    max={40}   step={1}    onChange={setInkRadius} />
        <PSlider label="Ink strength"     value={inkStrength}  min={0.1}  max={2}    step={0.05} onChange={setInkStr} />
        <PSlider label="Auto interval ms" value={autoInterval} min={500}  max={5000} step={100}  onChange={setAutoInterval} />
        <PSlider label="Resolution"       value={resolution}   min={0.1}  max={1}    step={0.05} onChange={setRes} />
        <PSlider label="Glow blur"        value={glowBlur}     min={0}    max={40}   step={1}    onChange={setGlowBlur} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function InkBleedPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="InkBleed"
      lead="Ink drops that diffuse and bleed organically on wet paper. Click or drag the canvas to drop ink and watch it spread. Auto-drops keep the canvas alive without interaction."
    >
      <InkBleedPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Try <strong>sepia</strong> for a warm parchment look, or <strong>neon</strong> for a glowing bleed. Lower <strong>viscosity</strong> for fast-spreading pools; raise <strong>evaporation rate</strong> for ephemeral splashes that vanish quickly. Click and drag to paint directly.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
