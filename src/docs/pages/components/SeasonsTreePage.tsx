import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { SeasonsTree } from "../../../components/SeasonsTree";
import type { Season } from "../../../components/SeasonsTree/useSeasonsTree";

const PROPS = [
  { name: "season", type: "Season", default: "\"cycle\"", description: "Season to show, or cycle through all four." },
  { name: "cycleSeconds", type: "number", default: "48", description: "Seconds for a full year when cycling." },
  { name: "trunkColor", type: "string", default: '"#4a362a"', description: "Trunk and branch color." },
  { name: "leafColor", type: "string", default: '"#5b8c3e"', description: "Summer leaf color." },
  { name: "blossomColor", type: "string", default: '"#ffb7c5"', description: "Spring blossom color." },
  { name: "autumnColor", type: "string", default: '"#d9622b"', description: "Autumn leaf color." },
  { name: "backgroundColor", type: "string", default: '"#0e0c0a"', description: "Background color, ignored in overlay mode." },
  { name: "treeX", type: "number", default: "0.5", description: "Trunk position, 0..1 of width." },
  { name: "treeSize", type: "number", default: "1", description: "Tree size multiplier." },
  { name: "wind", type: "number", default: "0.6", description: "Base wind; negative blows left." },
  { name: "interactive", type: "boolean", default: "true", description: "Cursor movement blows wind through the branches." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"japanese\" | \"maple\" | \"moonlight\" | \"ink\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "collide", type: "boolean", default: "false", description: "Falling leaves and petals land on elements marked data-otc-solid." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"trunkColor": "#4a362a", "leafColor": "#5b8c3e", "blossomColor": "#ffb7c5", "autumnColor": "#d9622b", "backgroundColor": "#0e0c0a"},
  monochrome: {"trunkColor": "#6b7280", "leafColor": "#d1d5db", "blossomColor": "#ffffff", "autumnColor": "#9ca3af", "backgroundColor": "#111111"},
  "japanese": {"trunkColor": "#4a362a", "leafColor": "#5b8c3e", "blossomColor": "#ffb7c5", "autumnColor": "#d9622b", "backgroundColor": "#0e0c0a"},
  "maple": {"trunkColor": "#4a3020", "leafColor": "#3f7d3a", "blossomColor": "#fde68a", "autumnColor": "#c2410c", "backgroundColor": "#120a06"},
  "moonlight": {"trunkColor": "#64748b", "leafColor": "#94a3b8", "blossomColor": "#e2e8f0", "autumnColor": "#cbd5e1", "backgroundColor": "#050810"},
  "ink": {"trunkColor": "#1f2937", "leafColor": "#374151", "blossomColor": "#9ca3af", "autumnColor": "#4b5563", "backgroundColor": "#f5f1e8"},
};

function SeasonsTreePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("japanese");
  const [season, setSeason] = useState<Season>("cycle");
  const [cycleSeconds, setCycleSeconds] = useState<number>(48);
  const [trunkColor, setTrunkColor] = useState<string>("#4a362a");
  const [leafColor, setLeafColor] = useState<string>("#5b8c3e");
  const [blossomColor, setBlossomColor] = useState<string>("#ffb7c5");
  const [autumnColor, setAutumnColor] = useState<string>("#d9622b");
  const [backgroundColor, setBackgroundColor] = useState<string>("#0e0c0a");
  const [treeX, setTreeX] = useState<number>(0.5);
  const [treeSize, setTreeSize] = useState<number>(1);
  const [wind, setWind] = useState<number>(0.6);
  const [interactive, setInteractive] = useState<boolean>(true);
  const [collide, setCollide] = useState(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setTrunkColor(v.trunkColor as string);
    setLeafColor(v.leafColor as string);
    setBlossomColor(v.blossomColor as string);
    setAutumnColor(v.autumnColor as string);
    setBackgroundColor(v.backgroundColor as string);
  }

  const code = [
    `import { SeasonsTree } from 'own-the-canvas';`,
    ``,
    `<SeasonsTree`,
    `  preset="${preset}"`,
    `  season="${season}"`,
    `  cycleSeconds={${cycleSeconds}}`,
    `  trunkColor="${trunkColor}"`,
    `  leafColor="${leafColor}"`,
    `  blossomColor="${blossomColor}"`,
    `  autumnColor="${autumnColor}"`,
    `  backgroundColor="${backgroundColor}"`,
    `  treeX={${treeX}}`,
    `  treeSize={${treeSize}}`,
    `  wind={${wind}}`,
    `  interactive={${interactive}}`,
    ...(collide ? [`  collide`] : []),
    `/>`,
    ...(collide ? [``, `{/* falling leaves land on any element marked: */}`, `<h1 data-otc-solid>Your headline here</h1>`] : []),
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: backgroundColor }}>
      <SeasonsTree
        preset={preset}
        season={season}
        cycleSeconds={cycleSeconds}
        trunkColor={trunkColor}
        leafColor={leafColor}
        blossomColor={blossomColor}
        autumnColor={autumnColor}
        backgroundColor={backgroundColor}
        treeX={treeX}
        treeSize={treeSize}
        wind={wind}
        interactive={interactive}
        collide={collide}
        width="100%"
        height="100%"
      />
      {collide && <DemoSolid top="84%">Your headline here</DemoSolid>}
      <PLiveLabel text="Move the cursor across the tree to blow wind" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PSel label="Season" value={season} options={["cycle", "spring", "summer", "autumn", "winter"] as Season[]} onChange={setSeason} />
        <PColor label="Trunk" value={trunkColor} onChange={setTrunkColor} />
        <PColor label="Summer leaves" value={leafColor} onChange={setLeafColor} />
        <PColor label="Blossoms" value={blossomColor} onChange={setBlossomColor} />
        <PColor label="Autumn leaves" value={autumnColor} onChange={setAutumnColor} />
        <PColor label="Background" value={backgroundColor} onChange={setBackgroundColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Leaves land on element (collide)" value={collide} onChange={setCollide} />
      </div>
      <div>
        <PSlider label="Year length (s)" value={cycleSeconds} min={8} max={180} step={2} onChange={setCycleSeconds} />
        <PSlider label="Position" value={treeX} min={0.1} max={0.9} step={0.01} onChange={setTreeX} />
        <PSlider label="Size" value={treeSize} min={0.5} max={1.8} step={0.05} onChange={setTreeSize} />
        <PSlider label="Wind" value={wind} min={-2} max={2} step={0.05} onChange={setWind} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SeasonsTreePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="SeasonsTree"
      lead="A tree that lives through the year: spring blossoms, full summer canopy, autumn leaves that let go and flutter down, bare winter branches capped with snow. Every branch sways on its own, and the cursor blows through like wind."
    >
      <SeasonsTreePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How the tree moves</h2>
        <p className="page-p">{"The tree is a recursive branching structure, generated once and deterministically. Each frame, forward kinematics walks it from trunk to twigs, bending every branch by wind with flexibility that grows toward the tips, so twigs whip while the trunk barely moves. Each leaf has its own threshold on a season curve: it appears in spring, turns color, and detaches in autumn as a falling leaf with its own physics."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
