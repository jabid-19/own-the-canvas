import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { OrigamiCranes } from "../../../components/OrigamiCranes";

const PROPS = [
  { name: "count", type: "number", default: "14", description: "Number of cranes." },
  { name: "colors", type: "string[]", default: '["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]', description: "Paper colors, assigned per crane." },
  { name: "backgroundColor", type: "string", default: '"#0f0f14"', description: "Background color, ignored in overlay mode." },
  { name: "size", type: "number", default: "1.6", description: "Crane size multiplier." },
  { name: "speed", type: "number", default: "1", description: "Flight speed multiplier." },
  { name: "interactive", type: "boolean", default: "true", description: "Cranes circle the cursor." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"senbazuru\" | \"washi\" | \"white-paper\" | \"gold\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "collide", type: "boolean", default: "false", description: "Cranes land on elements marked data-otc-solid, rest with wings folded, then take off." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"backgroundColor": "#0f0f14"},
  monochrome: {"backgroundColor": "#111111"},
  "senbazuru": {"backgroundColor": "#0f0f14"},
  "washi": {"backgroundColor": "#1b1814"},
  "white-paper": {"backgroundColor": "#0b1220"},
  "gold": {"backgroundColor": "#0e0b06"},
};

function OrigamiCranesPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("senbazuru");
  const [count, setCount] = useState<number>(14);
  const [backgroundColor, setBackgroundColor] = useState<string>("#0f0f14");
  const [size, setSize] = useState<number>(1.6);
  const [speed, setSpeed] = useState<number>(1);
  const [interactive, setInteractive] = useState<boolean>(true);
  const [collide, setCollide] = useState(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setBackgroundColor(v.backgroundColor as string);
  }

  const code = [
    `import { OrigamiCranes } from 'own-the-canvas';`,
    ``,
    `<OrigamiCranes`,
    `  preset="${preset}"`,
    `  count={${count}}`,
    `  backgroundColor="${backgroundColor}"`,
    `  size={${size}}`,
    `  speed={${speed}}`,
    `  interactive={${interactive}}`,
    ...(collide ? [`  collide`] : []),
    `/>`,
    ...(collide ? [``, `{/* cranes land on any element marked: */}`, `<h1 data-otc-solid>Your headline here</h1>`] : []),
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: backgroundColor }}>
      <OrigamiCranes
        preset={preset}
        count={count}
        backgroundColor={backgroundColor}
        size={size}
        speed={speed}
        interactive={interactive}
        collide={collide}
        width="100%"
        height="100%"
      />
      {collide && <DemoSolid top="58%">Your headline here</DemoSolid>}
      <PLiveLabel text="Cranes circle the cursor" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Background" value={backgroundColor} onChange={setBackgroundColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Land on element (collide)" value={collide} onChange={setCollide} />
      </div>
      <div>
        <PSlider label="Cranes" value={count} min={1} max={50} step={1} onChange={setCount} />
        <PSlider label="Size" value={size} min={0.4} max={2.5} step={0.05} onChange={setSize} />
        <PSlider label="Speed" value={speed} min={0.3} max={2.5} step={0.05} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function OrigamiCranesPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="OrigamiCranes"
      lead="A flock of folded-paper cranes, rendered as real 3D facets with flat paper shading, so every crease catches the light as they bank and flap. They circle your cursor and land on your page's elements."
    >
      <OrigamiCranesPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How they're drawn</h2>
        <p className="page-p">{"Each crane is a handful of flat triangles (body, neck, head, tail, and wings folded along a crease) placed in 3D, oriented along its flight path, banked into turns, and projected with perspective. Every facet is shaded two-sided like paper, and all facets of all cranes are depth-sorted together, so cranes pass in front of and behind each other."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
