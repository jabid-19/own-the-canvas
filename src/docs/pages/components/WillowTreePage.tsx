import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { WillowTree } from "../../../components/WillowTree";

const PROPS = [
  { name: "trunkColor",       type: "string",  default: '"#4a3728"', description: "Trunk and branch color." },
  { name: "leafColor",        type: "string",  default: '"#4a7c59"', description: "Leaf strand and leaf color." },
  { name: "skyColor",         type: "string",  default: '"#111111"', description: "Background gradient top." },
  { name: "groundColor",      type: "string",  default: '"#1a1a1a"', description: "Background gradient bottom." },
  { name: "branchCount",      type: "number",  default: "8",         description: "Number of major branches." },
  { name: "strandCount",      type: "number",  default: "6",         description: "Hanging strand groups per branch." },
  { name: "interactive",      type: "boolean", default: "true",      description: "Mouse X position controls wind direction." },
  { name: "showFallingLeaves",type: "boolean", default: "true",      description: "Enable detaching falling leaf particles." },
  { name: "preset",           type: "string",  default: "—",         description: '"default" | "spring" | "autumn" | "night" | "winter"' },
];

const PRESET_VALUES: Record<string, { trunkColor: string; leafColor: string; skyColor: string; groundColor: string }> = {
  default: { trunkColor: "#4a3728", leafColor: "#4a7c59", skyColor: "#111111",  groundColor: "#1a1a1a" },
  spring:  { trunkColor: "#5a3a20", leafColor: "#66cc44", skyColor: "#1a2a3a",  groundColor: "#0a1a08" },
  autumn:  { trunkColor: "#4a2a10", leafColor: "#cc6620", skyColor: "#1a0e08",  groundColor: "#120800" },
  night:   { trunkColor: "#3a3040", leafColor: "#8898a8", skyColor: "#020412",  groundColor: "#060412" },
  winter:  { trunkColor: "#5a5060", leafColor: "#c0c8d0", skyColor: "#080c14",  groundColor: "#0a0c10" },
};

function WillowTreePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]               = useState("default");
  const [trunkColor, setTrunkColor]       = useState("#4a3728");
  const [leafColor, setLeafColor]         = useState("#4a7c59");
  const [skyColor, setSkyColor]           = useState("#111111");
  const [groundColor, setGroundColor]     = useState("#1a1a1a");
  const [branchCount, setBranchCount]     = useState(8);
  const [strandCount, setStrandCount]     = useState(6);
  const [interactive, setInteractive]     = useState(true);
  const [showFallingLeaves, setShowFallingLeaves] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setTrunkColor(v.trunkColor);
    setLeafColor(v.leafColor);
    setSkyColor(v.skyColor);
    setGroundColor(v.groundColor);
  }

  const code = [
    `import { WillowTree } from 'own-the-canvas';`,
    ``,
    `<WillowTree`,
    `  preset="${preset}"`,
    `  trunkColor="${trunkColor}"`,
    `  leafColor="${leafColor}"`,
    `  skyColor="${skyColor}"`,
    `  groundColor="${groundColor}"`,
    `  branchCount={${branchCount}}`,
    `  strandCount={${strandCount}}`,
    `  interactive={${interactive}}`,
    `  showFallingLeaves={${showFallingLeaves}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: skyColor }}>
      <WillowTree
        preset={preset}
        trunkColor={trunkColor}
        leafColor={leafColor}
        skyColor={skyColor}
        groundColor={groundColor}
        branchCount={branchCount}
        strandCount={strandCount}
        interactive={interactive}
        showFallingLeaves={showFallingLeaves}
        width="100%"
        height="100%"
      />
      <PLiveLabel text={interactive ? "Move cursor left/right to control wind" : "Gentle ambient breeze"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "spring", "autumn", "night", "winter"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Trunk color" value={trunkColor} onChange={setTrunkColor} />
        <PColor label="Leaf color" value={leafColor} onChange={setLeafColor} />
        <PColor label="Sky color" value={skyColor} onChange={setSkyColor} />
        <PColor label="Ground color" value={groundColor} onChange={setGroundColor} />
        <PToggle label="Interactive wind" value={interactive} onChange={setInteractive} />
        <PToggle label="Falling leaves" value={showFallingLeaves} onChange={setShowFallingLeaves} />
      </div>
      <div>
        <PSlider label="Branch count" value={branchCount} min={2} max={16} step={1} onChange={setBranchCount} />
        <PSlider label="Strands per branch" value={strandCount} min={2} max={12} step={1} onChange={setStrandCount} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function WillowTreePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="WillowTree"
      lead="A generative weeping willow with spring-physics strand simulation. Move your cursor left and right to control wind direction and watch the leaves cascade."
    >
      <WillowTreePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
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
