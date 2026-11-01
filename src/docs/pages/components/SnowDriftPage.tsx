import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { SnowDrift } from "../../../components/SnowDrift";

const PROPS = [
  { name: "count", type: "number", default: "220", description: "Number of falling flakes." },
  { name: "color", type: "string", default: '"#f8fafc"', description: "Snow color." },
  { name: "backgroundColor", type: "string", default: '"#0b1220"', description: "Background color, ignored in overlay mode." },
  { name: "flakeSize", type: "number", default: "2.2", description: "Flake radius in px." },
  { name: "wind", type: "number", default: "0.4", description: "Horizontal wind; negative blows left." },
  { name: "fallSpeed", type: "number", default: "1", description: "Fall speed multiplier." },
  { name: "maxDepth", type: "number", default: "26", description: "Deepest snow on an element, px." },
  { name: "floorDepth", type: "number", default: "60", description: "Deepest snow on the ground, px." },
  { name: "slope", type: "number", default: "0.7", description: "Angle of repose as rise over run; lower = flatter drifts." },
  { name: "interactive", type: "boolean", default: "true", description: "Cursor brushes snow off drifts." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"winter-night\" | \"blizzard\" | \"nordic\" | \"dusk\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "collide", type: "boolean", default: "false", description: "Snow piles up on elements marked data-otc-solid and slides off their edges." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"color": "#f8fafc", "backgroundColor": "#0b1220", "wind": 0.4, "maxDepth": 26},
  monochrome: {"color": "#ffffff", "backgroundColor": "#111111", "wind": 0.4, "maxDepth": 26},
  "winter-night": {"color": "#f8fafc", "backgroundColor": "#0b1220", "wind": 0.4, "maxDepth": 26},
  "blizzard": {"color": "#e2e8f0", "backgroundColor": "#1e293b", "wind": 1.8, "maxDepth": 26},
  "nordic": {"color": "#ffffff", "backgroundColor": "#10141c", "wind": 0.4, "maxDepth": 34},
  "dusk": {"color": "#fde2e4", "backgroundColor": "#1a1020", "wind": -0.3, "maxDepth": 26},
};

function SnowDriftPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("winter-night");
  const [count, setCount] = useState<number>(220);
  const [color, setColor] = useState<string>("#f8fafc");
  const [backgroundColor, setBackgroundColor] = useState<string>("#0b1220");
  const [flakeSize, setFlakeSize] = useState<number>(2.2);
  const [wind, setWind] = useState<number>(0.4);
  const [fallSpeed, setFallSpeed] = useState<number>(1);
  const [maxDepth, setMaxDepth] = useState<number>(26);
  const [floorDepth, setFloorDepth] = useState<number>(60);
  const [slope, setSlope] = useState<number>(0.7);
  const [interactive, setInteractive] = useState<boolean>(true);
  const [collide, setCollide] = useState(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setColor(v.color as string);
    setBackgroundColor(v.backgroundColor as string);
    setWind(v.wind as number);
    setMaxDepth(v.maxDepth as number);
  }

  const code = [
    `import { SnowDrift } from 'own-the-canvas';`,
    ``,
    `<SnowDrift`,
    `  preset="${preset}"`,
    `  count={${count}}`,
    `  color="${color}"`,
    `  backgroundColor="${backgroundColor}"`,
    `  flakeSize={${flakeSize}}`,
    `  wind={${wind}}`,
    `  fallSpeed={${fallSpeed}}`,
    `  maxDepth={${maxDepth}}`,
    `  floorDepth={${floorDepth}}`,
    `  slope={${slope}}`,
    `  interactive={${interactive}}`,
    ...(collide ? [`  collide`] : []),
    `/>`,
    ...(collide ? [``, `{/* snow piles up on any element marked: */}`, `<h1 data-otc-solid>Your headline here</h1>`] : []),
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: backgroundColor }}>
      <SnowDrift
        preset={preset}
        count={count}
        color={color}
        backgroundColor={backgroundColor}
        flakeSize={flakeSize}
        wind={wind}
        fallSpeed={fallSpeed}
        maxDepth={maxDepth}
        floorDepth={floorDepth}
        slope={slope}
        interactive={interactive}
        collide={collide}
        width="100%"
        height="100%"
      />
      {collide && <DemoSolid top="42%">Your headline here</DemoSolid>}
      <PLiveLabel text="Sweep the cursor across a drift to brush it off" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Snow color" value={color} onChange={setColor} />
        <PColor label="Background" value={backgroundColor} onChange={setBackgroundColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Pile on element (collide)" value={collide} onChange={setCollide} />
      </div>
      <div>
        <PSlider label="Flakes" value={count} min={0} max={800} step={10} onChange={setCount} />
        <PSlider label="Flake size" value={flakeSize} min={0.8} max={5} step={0.1} onChange={setFlakeSize} />
        <PSlider label="Wind" value={wind} min={-3} max={3} step={0.1} onChange={setWind} />
        <PSlider label="Fall speed" value={fallSpeed} min={0.3} max={3} step={0.1} onChange={setFallSpeed} />
        <PSlider label="Max depth on elements" value={maxDepth} min={4} max={60} step={1} onChange={setMaxDepth} />
        <PSlider label="Max depth on ground" value={floorDepth} min={0} max={160} step={2} onChange={setFloorDepth} />
        <PSlider label="Angle of repose" value={slope} min={0.2} max={1.5} step={0.05} onChange={setSlope} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SnowDriftPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="SnowDrift"
      lead="Snowfall that actually piles up: on the ground and on top of your page's headline and buttons. Piles obey the angle of repose, so drifts slump and spill off the edges as clumps, and a cursor sweep brushes the snow away."
    >
      <SnowDriftPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How the drifts form</h2>
        <p className="page-p">{"Every surface keeps a heightfield of snow. Landing flakes add to it, and each frame the pile relaxes like real granular material: wherever neighbouring columns are steeper than the angle of repose, snow slides downhill. On a ledge, snow that would hang past the edge spills off as a falling clump, which can land on another element below."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
