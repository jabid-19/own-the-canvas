import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { GrassField } from "../../../components/GrassField";

const PROPS = [
  { name: "density",         type: "number",  default: "45",         description: "Blades per 100px of width, per row." },
  { name: "bladeHeight",     type: "number",  default: "0.38",       description: "Tallest blade as a fraction of canvas height." },
  { name: "baseColor",       type: "string",  default: '"#14301a"',  description: "Color at the blade root." },
  { name: "tipColor",        type: "string",  default: '"#8fd16a"',  description: "Color at the blade tip." },
  { name: "backgroundColor", type: "string",  default: '"#0a1420"',  description: "Background color; back rows fade toward it (ignored in overlay mode)." },
  { name: "flowerColor",     type: "string",  default: '"#fef3c7"',  description: "Flower head color." },
  { name: "flowers",         type: "number",  default: "0",          description: "Fraction of blades topped with a flower, 0..1." },
  { name: "wind",            type: "number",  default: "1",          description: "Wind strength." },
  { name: "gusts",           type: "number",  default: "1",          description: "Strength of the gust bands rolling across the field." },
  { name: "rows",            type: "number",  default: "3",          description: "Depth rows, back to front." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Moving the cursor through the grass parts it; blades spring back." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "meadow" | "dusk" | "wheat" | "frost" | "monochrome"' },
  { name: "overlay",         type: "boolean", default: "false",      description: "Fixed full-viewport, click-through layer: grass along the bottom of the screen." },
  { name: "zIndex",          type: "number",  default: "10",         description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, { base: string; tip: string; bg: string; flower: string; flowers: number; height: number }> = {
  default: { base: "#14301a", tip: "#8fd16a", bg: "#0a1420", flower: "#fef3c7", flowers: 0,    height: 0.38 },
  monochrome: { base: "#374151", tip: "#ffffff", bg: "#111111", flower: "#ffffff", flowers: 0,    height: 0.38 },
  meadow:  { base: "#14301a", tip: "#8fd16a", bg: "#0a1420", flower: "#fef3c7", flowers: 0.04, height: 0.38 },
  dusk:    { base: "#1b1433", tip: "#a78bfa", bg: "#0d0a1a", flower: "#fda4af", flowers: 0.03, height: 0.38 },
  wheat:   { base: "#4a3512", tip: "#f0cf7a", bg: "#140e06", flower: "#ffffff", flowers: 0,    height: 0.5 },
  frost:   { base: "#1e2a38", tip: "#e2ecf7", bg: "#070b10", flower: "#ffffff", flowers: 0,    height: 0.38 },
};

function GrassFieldPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("meadow");
  const v0 = PRESET_VALUES.meadow;
  const [base, setBase] = useState(v0.base);
  const [tip, setTip] = useState(v0.tip);
  const [bg, setBg] = useState(v0.bg);
  const [flower, setFlower] = useState(v0.flower);
  const [flowers, setFlowers] = useState(v0.flowers);
  const [height, setHeight] = useState(v0.height);
  const [density, setDensity] = useState(45);
  const [wind, setWind] = useState(1);
  const [gusts, setGusts] = useState(1);
  const [interactive, setInteractive] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setBase(v.base); setTip(v.tip); setBg(v.bg); setFlower(v.flower); setFlowers(v.flowers); setHeight(v.height);
  }

  const code = [
    `import { GrassField } from 'own-the-canvas';`,
    ``,
    `<GrassField`,
    `  preset="${preset}"`,
    `  baseColor="${base}"`,
    `  tipColor="${tip}"`,
    `  backgroundColor="${bg}"`,
    `  density={${density}}`,
    `  bladeHeight={${height}}`,
    `  wind={${wind}}`,
    `  gusts={${gusts}}`,
    `  flowers={${flowers}}`,
    `  flowerColor="${flower}"`,
    `  interactive={${interactive}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <GrassField
        preset={preset}
        baseColor={base}
        tipColor={tip}
        backgroundColor={bg}
        density={density}
        bladeHeight={height}
        wind={wind}
        gusts={gusts}
        flowers={flowers}
        flowerColor={flower}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Sweep the cursor through the grass" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Base color" value={base} onChange={setBase} />
        <PColor label="Tip color" value={tip} onChange={setTip} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PColor label="Flower color" value={flower} onChange={setFlower} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Density" value={density} min={10} max={120} step={5} onChange={setDensity} />
        <PSlider label="Height" value={height} min={0.15} max={0.8} step={0.01} onChange={setHeight} />
        <PSlider label="Wind" value={wind} min={-2} max={3} step={0.1} onChange={setWind} />
        <PSlider label="Gusts" value={gusts} min={0} max={3} step={0.1} onChange={setGusts} />
        <PSlider label="Flowers" value={flowers} min={0} max={0.2} step={0.01} onChange={setFlowers} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function GrassFieldPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="GrassField"
      lead="Thousands of grass blades on damped springs, swaying in a breeze while gust bands roll across the field. Walk the cursor through and the grass parts around it, then springs back."
    >
      <GrassFieldPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          Use <code>overlay</code> to run a strip of grass along the bottom of the viewport over any page. Blades are
          batched into a handful of fills per row, so dense fields stay smooth; the runtime thins them automatically
          on slow devices.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
