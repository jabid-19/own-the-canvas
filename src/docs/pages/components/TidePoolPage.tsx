import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { TidePool } from "../../../components/TidePool";

const PROPS = [
  { name: "waterColor",       type: "string",  default: '"#2a8a8f"', description: "Water tint." },
  { name: "rockColor",        type: "string",  default: '"#6e6457"', description: "Rocks and sand on the pool floor." },
  { name: "anemoneColor",     type: "string",  default: '"#5fbf7a"', description: "Sea anemones." },
  { name: "starfishColor",    type: "string",  default: '"#e0702e"', description: "Starfish." },
  { name: "fishCount",        type: "number",  default: "7",         description: "Number of small fish." },
  { name: "anemoneCount",     type: "number",  default: "5",         description: "Number of sea anemones." },
  { name: "causticIntensity", type: "number",  default: "1",         description: "Sunlight caustics strength, 0..2." },
  { name: "interactive",      type: "boolean", default: "true",      description: "Anemones close and fish flee from the cursor; moving it ripples the water, taps splash." },
  { name: "preset",           type: "string",  default: "—",         description: '"default" | "tropical" | "kelp-coast" | "sunset" | "night" | "monochrome"' },
];

type PV = { water: string; rock: string; anemone: string; star: string };
const PRESET_VALUES: Record<string, PV> = {
  default:      { water: "#2a8a8f", rock: "#6e6457", anemone: "#5fbf7a", star: "#e0702e" },
  tropical:     { water: "#22b5c4", rock: "#c8b48a", anemone: "#b05fd0", star: "#3a6ad8" },
  "kelp-coast": { water: "#1f5a48", rock: "#4a4a40", anemone: "#e07aa0", star: "#8a3aa0" },
  sunset:       { water: "#c0704a", rock: "#5a4a40", anemone: "#f0c050", star: "#d8402e" },
  night:        { water: "#0e2a4a", rock: "#2a2c34", anemone: "#4ae0d0", star: "#c06a3a" },
  monochrome:   { water: "#6b7280", rock: "#4b5563", anemone: "#d1d5db", star: "#9ca3af" },
};

function TidePoolPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [water, setWater] = useState(d.water);
  const [rock, setRock] = useState(d.rock);
  const [anemone, setAnemone] = useState(d.anemone);
  const [star, setStar] = useState(d.star);
  const [fishCount, setFishCount] = useState(7);
  const [anemoneCount, setAnemoneCount] = useState(5);
  const [caustics, setCaustics] = useState(1);
  const [interactive, setInteractive] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const n = PRESET_VALUES[p] ?? d;
    setWater(n.water); setRock(n.rock); setAnemone(n.anemone); setStar(n.star);
  }

  const code = [
    `import { TidePool } from 'own-the-canvas';`,
    ``,
    `<TidePool`,
    `  preset="${preset}"`,
    `  waterColor="${water}"`,
    `  rockColor="${rock}"`,
    `  anemoneColor="${anemone}"`,
    `  starfishColor="${star}"`,
    `  fishCount={${fishCount}}`,
    `  anemoneCount={${anemoneCount}}`,
    caustics !== 1 ? `  causticIntensity={${caustics}}` : null,
    interactive ? null : `  interactive={false}`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <TidePool preset={preset} waterColor={water} rockColor={rock} anemoneColor={anemone} starfishColor={star}
        fishCount={fishCount} anemoneCount={anemoneCount} causticIntensity={caustics} interactive={interactive} width="100%" height="100%" />
      <PLiveLabel text={interactive ? "Reach into the pool · tap to splash" : undefined} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Water" value={water} onChange={setWater} />
        <PColor label="Rocks" value={rock} onChange={setRock} />
        <PColor label="Anemones" value={anemone} onChange={setAnemone} />
        <PColor label="Starfish" value={star} onChange={setStar} />
      </div>
      <div>
        <PSlider label="Fish" value={fishCount} min={0} max={20} step={1} onChange={setFishCount} />
        <PSlider label="Anemones" value={anemoneCount} min={0} max={12} step={1} onChange={setAnemoneCount} />
        <PSlider label="Caustics" value={caustics} min={0} max={2} step={0.1} onChange={setCaustics} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function TidePoolPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="TidePool"
      lead="A rock pool seen from above. Sunlight caustics ripple over pebbles and shells, sea anemones sway their tentacles and snap shut when your cursor comes close, starfish slowly curl their arms, and little fish dart away from your hand. Moving the cursor stirs ripples; tapping splashes."
    >
      <TidePoolPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
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
