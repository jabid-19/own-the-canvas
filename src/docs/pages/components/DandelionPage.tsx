import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { Dandelion } from "../../../components/Dandelion";

const PROPS = [
  { name: "headCount",       type: "number",  default: "3",          description: "Number of dandelion heads." },
  { name: "seedsPerHead",    type: "number",  default: "110",        description: "Seeds per head." },
  { name: "color",           type: "string",  default: '"#dbeafe"',  description: "Seed and pappus color." },
  { name: "stemColor",       type: "string",  default: '"#3b4a63"',  description: "Stem and seed-body color." },
  { name: "backgroundColor", type: "string",  default: '"#05080f"',  description: "Background color (ignored in overlay mode)." },
  { name: "wind",            type: "number",  default: "0.9",        description: "Horizontal wind; negative blows left." },
  { name: "blowStrength",    type: "number",  default: "1",          description: "How easily a cursor sweep strips seeds." },
  { name: "autoBlow",        type: "boolean", default: "true",       description: "Occasional gusts release a few seeds on their own." },
  { name: "regrow",          type: "boolean", default: "true",       description: "Bald heads regrow their seeds after a few seconds." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Sweep the cursor across a head to blow it." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "meadow" | "sunset" | "moonlit" | "ink" | "monochrome"' },
  { name: "overlay",         type: "boolean", default: "false",      description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "collide",         type: "boolean", default: "false",      description: "Seeds land on elements marked data-otc-solid and ride them on scroll." },
  { name: "zIndex",          type: "number",  default: "10",         description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, { color: string; stem: string; bg: string; wind: number }> = {
  default: { color: "#dbeafe", stem: "#3b4a63", bg: "#05080f", wind: 0.9 },
  monochrome: { color: "#ffffff", stem: "#6b7280", bg: "#111111", wind: 0.9 },
  meadow:  { color: "#f8fafc", stem: "#5f8f3e", bg: "#0b1a14", wind: 0.9 },
  sunset:  { color: "#ffe8cc", stem: "#8a5a2b", bg: "#1a0c08", wind: 1.2 },
  moonlit: { color: "#dbeafe", stem: "#3b4a63", bg: "#05080f", wind: 0.6 },
  ink:     { color: "#1f2937", stem: "#4b5563", bg: "#f5f1e8", wind: 0.9 },
};

function DandelionPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("moonlit");
  const v0 = PRESET_VALUES.moonlit;
  const [color, setColor] = useState(v0.color);
  const [stem, setStem] = useState(v0.stem);
  const [bg, setBg] = useState(v0.bg);
  const [wind, setWind] = useState(v0.wind);
  const [heads, setHeads] = useState(3);
  const [seeds, setSeeds] = useState(110);
  const [autoBlow, setAutoBlow] = useState(true);
  const [collide, setCollide] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setColor(v.color); setStem(v.stem); setBg(v.bg); setWind(v.wind);
  }

  const code = [
    `import { Dandelion } from 'own-the-canvas';`,
    ``,
    `<Dandelion`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  stemColor="${stem}"`,
    `  backgroundColor="${bg}"`,
    `  headCount={${heads}}`,
    `  seedsPerHead={${seeds}}`,
    `  wind={${wind}}`,
    `  autoBlow={${autoBlow}}`,
    ...(collide ? [`  collide`] : []),
    `/>`,
    ...(collide ? [``, `{/* seeds land on any element marked: */}`, `<h1 data-otc-solid>Your headline here</h1>`] : []),
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <Dandelion
        preset={preset}
        color={color}
        stemColor={stem}
        backgroundColor={bg}
        headCount={heads}
        seedsPerHead={seeds}
        wind={wind}
        autoBlow={autoBlow}
        collide={collide}
        width="100%"
        height="100%"
      />
      {collide && <DemoSolid top="28%" />}
      <PLiveLabel text="Sweep the cursor across a head to blow it" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Seed color" value={color} onChange={setColor} />
        <PColor label="Stem color" value={stem} onChange={setStem} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Auto gusts" value={autoBlow} onChange={setAutoBlow} />
        <PToggle label="Land on element (collide)" value={collide} onChange={setCollide} />
      </div>
      <div>
        <PSlider label="Heads" value={heads} min={1} max={8} step={1} onChange={setHeads} />
        <PSlider label="Seeds per head" value={seeds} min={20} max={240} step={10} onChange={setSeeds} />
        <PSlider label="Wind" value={wind} min={-2} max={3} step={0.1} onChange={setWind} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function DandelionPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Dandelion"
      lead="Dandelion clocks you can blow apart with the cursor. Each seed rides its own parachute, drag-dominated, so it hangs and drifts on the wind, then settles on the ground or on your page's elements."
    >
      <DandelionPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How the seeds fly</h2>
        <p className="page-p">
          A dandelion seed's pappus is so draggy that its velocity relaxes toward the local wind within a few frames.
          The simulation models exactly that: velocity eases toward wind plus a small sink speed, with gentle lift
          turbulence, so seeds float instead of falling. A fast sweep strips seeds near the cursor and throws them along
          your motion.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
