import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import {
  PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel,
} from "../../components/PlaygroundControls";
import { NBodyGravity } from "../../../components/NBodyGravity";

const PROPS = [
  { name: "bodyCount",       type: "number",  default: "3",         description: "Initial body count for random presets." },
  { name: "G",               type: "number",  default: "0.5",       description: "Gravitational constant." },
  { name: "trailLength",     type: "number",  default: "200",       description: "Trail history length per body." },
  { name: "speed",           type: "number",  default: "1",         description: "Simulation speed multiplier." },
  { name: "bodyColor",       type: "string",  default: '"#ffffff"', description: 'Body color when colorMode is "solid".' },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "trailOpacity",    type: "number",  default: "0.6",       description: "Maximum trail opacity." },
  { name: "glowEffect",      type: "boolean", default: "true",      description: "Glow on bodies." },
  { name: "glowBlur",        type: "number",  default: "20",        description: "Shadow blur for glow." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Click to add new bodies." },
  { name: "softening",       type: "number",  default: "20",        description: "Gravitational softening in px — prevents singularities at close range." },
  { name: "mergeOnCollide",  type: "boolean", default: "true",      description: "Merge bodies on close approach, conserving momentum and mass." },
  { name: "newBodyMass",     type: "number",  default: "5",         description: "Mass of click-spawned bodies." },
  { name: "colorMode",       type: "string",  default: '"hue"',     description: '"hue" = rainbow cycling per body, "solid" = bodyColor.' },
  { name: "showTrails",      type: "boolean", default: "true",      description: "Show orbital trail history." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "solar" | "neon" | "chaos" | "binary" | "minimal"' },
];

const PRESETS = ["default", "solar", "neon", "chaos", "binary", "minimal"];

// Default values per preset for the playground controls
const PRESET_DEFAULTS: Record<string, { G: number; trailLength: number; speed: number; trailOpacity: number; bg: string; glow: boolean; trails: boolean; merge: boolean; colorMode: "hue" | "solid"; bodyColor: string }> = {
  default:  { G: 0.5, trailLength: 200, speed: 1,   trailOpacity: 0.6, bg: "#111111", glow: true,  trails: true,  merge: true,  colorMode: "hue",   bodyColor: "#ffffff" },
  solar:    { G: 0.8, trailLength: 150, speed: 1,   trailOpacity: 0.6, bg: "#111111", glow: true,  trails: true,  merge: true,  colorMode: "hue",   bodyColor: "#ffffff" },
  neon:     { G: 0.5, trailLength: 200, speed: 1,   trailOpacity: 0.7, bg: "#000000", glow: true,  trails: true,  merge: true,  colorMode: "hue",   bodyColor: "#00ffcc" },
  chaos:    { G: 0.3, trailLength: 300, speed: 1,   trailOpacity: 0.6, bg: "#111111", glow: true,  trails: true,  merge: true,  colorMode: "hue",   bodyColor: "#ffffff" },
  binary:   { G: 0.5, trailLength: 200, speed: 1,   trailOpacity: 0.6, bg: "#111111", glow: true,  trails: true,  merge: true,  colorMode: "hue",   bodyColor: "#ffffff" },
  minimal:  { G: 0.5, trailLength: 200, speed: 1,   trailOpacity: 0.3, bg: "#111111", glow: false, trails: true,  merge: true,  colorMode: "solid", bodyColor: "#ffffff" },
};

function NBodyGravityPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [resetKey, setResetKey] = useState(0);

  const defaults = PRESET_DEFAULTS[preset] ?? PRESET_DEFAULTS.default;
  const [G, setG] = useState(defaults.G);
  const [trailLength, setTrailLength] = useState(defaults.trailLength);
  const [speed, setSpeed] = useState(defaults.speed);
  const [trailOpacity, setTrailOpacity] = useState(defaults.trailOpacity);
  const [bg, setBg] = useState(defaults.bg);
  const [bodyColor, setBodyColor] = useState(defaults.bodyColor);
  const [glow, setGlow] = useState(defaults.glow);
  const [trails, setTrails] = useState(defaults.trails);
  const [merge, setMerge] = useState(defaults.merge);
  const [colorMode] = useState<"hue" | "solid">(defaults.colorMode);

  function onPresetChange(p: string) {
    setPreset(p);
    setResetKey((k) => k + 1);
    const d = PRESET_DEFAULTS[p] ?? PRESET_DEFAULTS.default;
    setG(d.G);
    setTrailLength(d.trailLength);
    setSpeed(d.speed);
    setTrailOpacity(d.trailOpacity);
    setBg(d.bg);
    setBodyColor(d.bodyColor);
    setGlow(d.glow);
    setTrails(d.trails);
    setMerge(d.merge);
  }

  const code = [
    `import { NBodyGravity } from 'own-the-canvas';`,
    ``,
    `<NBodyGravity`,
    `  preset="${preset}"`,
    `  G={${G}}`,
    `  trailLength={${trailLength}}`,
    `  speed={${speed}}`,
    `  trailOpacity={${trailOpacity}}`,
    colorMode === "solid" ? `  colorMode="solid"` : null,
    colorMode === "solid" ? `  bodyColor="${bodyColor}"` : null,
    `  backgroundColor="${bg}"`,
    glow  ? null : `  glowEffect={false}`,
    trails ? null : `  showTrails={false}`,
    merge ? null : `  mergeOnCollide={false}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <NBodyGravity
        key={`${preset}-${resetKey}`}
        preset={preset}
        G={G}
        trailLength={trailLength}
        speed={speed}
        trailOpacity={trailOpacity}
        colorMode={colorMode}
        bodyColor={bodyColor}
        backgroundColor={bg}
        glowEffect={glow}
        showTrails={trails}
        mergeOnCollide={merge}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Click anywhere to add a body" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel
          label="Preset"
          value={preset}
          options={PRESETS}
          onChange={onPresetChange}
        />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        {colorMode === "solid" && (
          <PColor label="Body color" value={bodyColor} onChange={setBodyColor} />
        )}
        <PSlider label="Gravity (G)" value={G} min={0.1} max={2.0} step={0.05} onChange={setG} />
        <PSlider label="Speed" value={speed} min={0.1} max={3} step={0.1} onChange={setSpeed} />
      </div>
      <div>
        <PSlider label="Trail length" value={trailLength} min={50} max={500} step={10} onChange={setTrailLength} />
        <PSlider label="Trail opacity" value={trailOpacity} min={0} max={1} step={0.05} onChange={setTrailOpacity} />
        <PDivider />
        <PToggle label="Glow effect" value={glow} onChange={setGlow} />
        <PToggle label="Show trails" value={trails} onChange={setTrails} />
        <PToggle label="Merge on collide" value={merge} onChange={setMerge} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function NBodyGravityPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="NBodyGravity"
      lead="Newton's law of universal gravitation in action — bodies pull, swing, spiral, and merge in patterns that range from mathematical elegance to beautiful chaos. Click to drop a new body into the system."
    >
      <NBodyGravityPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
