import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { FrostGlass } from "../../../components/FrostGlass";

const PROPS = [
  { name: "color", type: "string", default: '"#e0f2fe"', description: "Frost crystal color." },
  { name: "fogColor", type: "string", default: '"#cbd5e1"', description: "Condensation haze color." },
  { name: "backgroundColor", type: "string", default: '"#0b1220"', description: "What's behind the glass; ignored in overlay mode." },
  { name: "coverage", type: "number", default: "0.32", description: "Fraction of the glass the frost grows to cover." },
  { name: "growthSpeed", type: "number", default: "1", description: "Growth speed multiplier." },
  { name: "branching", type: "number", default: "0.05", description: "Chance per step that a crystal splits off a side branch." },
  { name: "breathRadius", type: "number", default: "46", description: "Radius of the patch your cursor melts, px." },
  { name: "fog", type: "number", default: "0.12", description: "Condensation haze opacity, 0..1." },
  { name: "interactive", type: "boolean", default: "true", description: "Cursor melts frost and clears fog." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"winter-window\" | \"ice-blue\" | \"silver\" | \"rose\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "collide", type: "boolean", default: "false", description: "Frost also nucleates on the edges of elements marked data-otc-solid and grows outward." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"color": "#e0f2fe", "fogColor": "#cbd5e1", "backgroundColor": "#0b1220", "fog": 0.12},
  monochrome: {"color": "#ffffff", "fogColor": "#ffffff", "backgroundColor": "#111111", "fog": 0.12},
  "winter-window": {"color": "#e0f2fe", "fogColor": "#cbd5e1", "backgroundColor": "#0b1220", "fog": 0.12},
  "ice-blue": {"color": "#a5f3fc", "fogColor": "#bae6fd", "backgroundColor": "#031018", "fog": 0.1},
  "silver": {"color": "#f1f5f9", "fogColor": "#e2e8f0", "backgroundColor": "#18181b", "fog": 0.12},
  "rose": {"color": "#ffe4e6", "fogColor": "#fecdd3", "backgroundColor": "#1a0b10", "fog": 0.12},
};

function FrostGlassPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("winter-window");
  const [color, setColor] = useState<string>("#e0f2fe");
  const [fogColor, setFogColor] = useState<string>("#cbd5e1");
  const [backgroundColor, setBackgroundColor] = useState<string>("#0b1220");
  const [coverage, setCoverage] = useState<number>(0.32);
  const [growthSpeed, setGrowthSpeed] = useState<number>(1);
  const [branching, setBranching] = useState<number>(0.05);
  const [breathRadius, setBreathRadius] = useState<number>(46);
  const [fog, setFog] = useState<number>(0.12);
  const [interactive, setInteractive] = useState<boolean>(true);
  const [collide, setCollide] = useState(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setColor(v.color as string);
    setFogColor(v.fogColor as string);
    setBackgroundColor(v.backgroundColor as string);
    setFog(v.fog as number);
  }

  const code = [
    `import { FrostGlass } from 'own-the-canvas';`,
    ``,
    `<FrostGlass`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  fogColor="${fogColor}"`,
    `  backgroundColor="${backgroundColor}"`,
    `  coverage={${coverage}}`,
    `  growthSpeed={${growthSpeed}}`,
    `  branching={${branching}}`,
    `  breathRadius={${breathRadius}}`,
    `  fog={${fog}}`,
    `  interactive={${interactive}}`,
    ...(collide ? [`  collide`] : []),
    `/>`,
    ...(collide ? [``, `{/* frost grows out from any element marked: */}`, `<h1 data-otc-solid>Your headline here</h1>`] : []),
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: backgroundColor }}>
      <FrostGlass
        preset={preset}
        color={color}
        fogColor={fogColor}
        backgroundColor={backgroundColor}
        coverage={coverage}
        growthSpeed={growthSpeed}
        branching={branching}
        breathRadius={breathRadius}
        fog={fog}
        interactive={interactive}
        collide={collide}
        width="100%"
        height="100%"
      />
      {collide && <DemoSolid top="50%">Breathe on the glass</DemoSolid>}
      <PLiveLabel text="Move the cursor to breathe on the glass" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Frost color" value={color} onChange={setColor} />
        <PColor label="Fog color" value={fogColor} onChange={setFogColor} />
        <PColor label="Background" value={backgroundColor} onChange={setBackgroundColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Grow from element (collide)" value={collide} onChange={setCollide} />
      </div>
      <div>
        <PSlider label="Coverage" value={coverage} min={0.05} max={0.9} step={0.01} onChange={setCoverage} />
        <PSlider label="Growth speed" value={growthSpeed} min={0.2} max={4} step={0.1} onChange={setGrowthSpeed} />
        <PSlider label="Branching" value={branching} min={0.01} max={0.2} step={0.01} onChange={setBranching} />
        <PSlider label="Breath radius" value={breathRadius} min={15} max={120} step={1} onChange={setBreathRadius} />
        <PSlider label="Fog" value={fog} min={0} max={0.6} step={0.01} onChange={setFog} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function FrostGlassPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="FrostGlass"
      lead="A frozen window: fern-like ice crystals creep in from the edges, branching at the 60\u00b0 angles of real ice, over a fogged pane. Your cursor is warm breath. It melts a clear patch, and the frost slowly grows back into it."
    >
      <FrostGlassPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How the frost grows</h2>
        <p className="page-p">{"Each crystal tip advances in small steps and splits off side branches at \u00b160\u00b0, shorter each generation, the hexagonal habit of ice. An occupancy grid keeps crystals from crossing, so they tile the glass the way real window frost does. Melted patches are re-frozen from their edges inward, and the condensation haze relaxes back on its own."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
