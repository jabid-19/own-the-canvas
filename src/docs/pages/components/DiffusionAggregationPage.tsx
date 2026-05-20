import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DiffusionAggregation, PRESETS as DLA_PRESETS } from "../../../components/DiffusionAggregation";
import type { DLASeedMode } from "../../../components/DiffusionAggregation";

const PROPS = [
  { name: "particleColor",   type: "string",     default: '"#ffffff"',  description: "Color of aggregated cluster particles." },
  { name: "walkerColor",     type: "string",     default: '"#6b7280"',  description: "Color of active random walkers (only visible when showWalkers is true)." },
  { name: "backgroundColor", type: "string",     default: '"#111111"',  description: "Canvas background color." },
  { name: "particleSize",    type: "number",     default: "3",          description: "Particle cell size in pixels — smaller = finer fractal detail, slower growth." },
  { name: "walkerCount",     type: "number",     default: "60",         description: "Number of simultaneous random walkers." },
  { name: "stepsPerFrame",   type: "number",     default: "20",         description: "Walker steps computed per animation frame — higher = faster growth." },
  { name: "seedMode",        type: "DLASeedMode",default: '"center"',   description: '"center" | "ring" | "bottom" — where the initial cluster seed is placed.' },
  { name: "showWalkers",     type: "boolean",    default: "false",      description: "Render active walkers as dimmed particles." },
  { name: "glowEffect",      type: "boolean",    default: "true",       description: "Glow effect on cluster particles." },
  { name: "glowBlur",        type: "number",     default: "8",          description: "Shadow blur radius for glow." },
  { name: "interactive",     type: "boolean",    default: "true",       description: "Click to add extra seed points — new branches grow from them." },
  { name: "preset",          type: "string",     default: "—",          description: '"default" | "coral" | "snowflake" | "lightning" | "neon" | "frost"' },
];

function DiffusionAggregationPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [particleColor, setParticleColor] = useState("#ffffff");
  const [walkerColor, setWalkerColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [particleSize, setParticleSize] = useState(3);
  const [walkerCount, setWalkerCount] = useState(60);
  const [stepsPerFrame, setStepsPerFrame] = useState(20);
  const [seedMode, setSeedMode] = useState<DLASeedMode>("center");
  const [showWalkers, setShowWalkers] = useState(false);
  const [glowEffect, setGlowEffect] = useState(true);
  const [glowBlur, setGlowBlur] = useState(8);

  function handlePreset(p: string) {
    setPreset(p);
    const v = DLA_PRESETS[p as keyof typeof DLA_PRESETS] ?? {};
    if (v.particleColor) setParticleColor(v.particleColor);
    if (v.walkerColor) setWalkerColor(v.walkerColor);
    if (v.backgroundColor) setBg(v.backgroundColor);
    if (v.seedMode) setSeedMode(v.seedMode);
    if (v.particleSize) setParticleSize(v.particleSize);
    if (v.glowEffect !== undefined) setGlowEffect(v.glowEffect);
    if (v.glowBlur !== undefined) setGlowBlur(v.glowBlur);
  }

  const code = [
    `import { DiffusionAggregation } from 'own-the-canvas';`,
    ``,
    `<DiffusionAggregation`,
    `  preset="${preset}"`,
    `  particleColor="${particleColor}"`,
    `  backgroundColor="${bg}"`,
    `  particleSize={${particleSize}}`,
    `  walkerCount={${walkerCount}}`,
    `  stepsPerFrame={${stepsPerFrame}}`,
    `  seedMode="${seedMode}"`,
    showWalkers ? `  showWalkers` : null,
    !glowEffect ? `  glowEffect={false}` : null,
    glowBlur !== 8 ? `  glowBlur={${glowBlur}}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <DiffusionAggregation
        preset={preset}
        particleColor={particleColor}
        walkerColor={walkerColor}
        backgroundColor={bg}
        particleSize={particleSize}
        walkerCount={walkerCount}
        stepsPerFrame={stepsPerFrame}
        seedMode={seedMode}
        showWalkers={showWalkers}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "coral", "snowflake", "lightning", "neon", "frost"]} onChange={handlePreset} />
        <PDivider />
        <PSel label="Seed mode" value={seedMode} options={["center", "ring", "bottom"]} onChange={(v) => setSeedMode(v as DLASeedMode)} />
        <PDivider />
        <PColor label="Particle color" value={particleColor} onChange={setParticleColor} />
        <PColor label="Walker color"   value={walkerColor}   onChange={setWalkerColor} />
        <PColor label="Background"     value={bg}            onChange={setBg} />
        <PDivider />
        <PToggle label="Show walkers" value={showWalkers} onChange={setShowWalkers} />
        <PToggle label="Glow effect"  value={glowEffect}  onChange={setGlowEffect} />
      </div>
      <div>
        <PSlider label="Particle size"    value={particleSize}  min={1} max={8}   step={1}  onChange={setParticleSize} />
        <PSlider label="Walker count"     value={walkerCount}   min={10} max={200} step={10} onChange={setWalkerCount} />
        <PSlider label="Steps per frame"  value={stepsPerFrame} min={1} max={60}  step={1}  onChange={setStepsPerFrame} />
        <PSlider label="Glow blur"        value={glowBlur}      min={0} max={30}  step={1}  onChange={setGlowBlur} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function DiffusionAggregationPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="DiffusionAggregation"
      lead="Diffusion-limited aggregation — particles random-walk until they touch the growing fractal cluster and permanently stick. Produces coral branches, snowflakes, lightning trees, and frost crystals depending on seed mode and color."
    >
      <DiffusionAggregationPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The cluster grows in real time — watch fractal branches emerge organically. Click anywhere on the canvas to plant an extra seed and start a new branch growing from that point. Switch seed modes: <strong>center</strong> grows a snowflake/coral shape, <strong>ring</strong> grows inward from a ring, <strong>bottom</strong> grows upward like lightning or crystal frost.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
