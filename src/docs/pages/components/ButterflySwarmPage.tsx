// src/docs/pages/components/ButterflySwarmPage.tsx
import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { ButterflySwarm } from "../../../components/ButterflySwarm";

const PROPS = [
  { name: "butterflyCount",  type: "number",  default: "12",        description: "Number of butterflies." },
  { name: "wingColor",       type: "string",  default: '"#f97316"', description: "Primary wing fill color." },
  { name: "patternColor",    type: "string",  default: '"#111111"', description: "Wing spot and body color." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "flapSpeed",       type: "number",  default: "1",         description: "Wing flap speed multiplier." },
  { name: "speed",           type: "number",  default: "1",         description: "Movement speed multiplier." },
  { name: "attractRadius",   type: "number",  default: "120",       description: "Cursor attraction/scatter radius in px." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Cursor slowly attracts butterflies; fast movement scatters them." },
  { name: "showTrails",      type: "boolean", default: "false",     description: "Show faint motion trails." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "monarch" | "morpho" | "meadow" | "night"' },
];

const PRESET_VALUES: Record<string, { wingColor: string; patternColor: string; bg: string }> = {
  default: { wingColor: "#f97316", patternColor: "#111111", bg: "#111111" },
  monarch: { wingColor: "#e06010", patternColor: "#111111", bg: "#0a0800" },
  morpho:  { wingColor: "#1060ff", patternColor: "#0030aa", bg: "#000508" },
  meadow:  { wingColor: "#f0c030", patternColor: "#804000", bg: "#0a1405" },
  night:   { wingColor: "#c0d0e0", patternColor: "#304050", bg: "#020408" },
};

function ButterflySwarmPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]               = useState("default");
  const [wingColor, setWingColor]         = useState("#f97316");
  const [patternColor, setPatternColor]   = useState("#111111");
  const [bg, setBg]                       = useState("#111111");
  const [butterflyCount, setButterflyCount] = useState(12);
  const [flapSpeed, setFlapSpeed]         = useState(1);
  const [speed, setSpeed]                 = useState(1);
  const [attractRadius, setAttractRadius] = useState(120);
  const [interactive, setInteractive]     = useState(true);
  const [showTrails, setShowTrails]       = useState(false);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setWingColor(v.wingColor);
    setPatternColor(v.patternColor);
    setBg(v.bg);
  }

  const code = [
    `import { ButterflySwarm } from 'own-the-canvas';`,
    ``,
    `<ButterflySwarm`,
    `  preset="${preset}"`,
    `  wingColor="${wingColor}"`,
    `  patternColor="${patternColor}"`,
    `  backgroundColor="${bg}"`,
    `  butterflyCount={${butterflyCount}}`,
    `  flapSpeed={${flapSpeed}}`,
    `  speed={${speed}}`,
    `  attractRadius={${attractRadius}}`,
    `  interactive={${interactive}}`,
    `  showTrails={${showTrails}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <ButterflySwarm
        preset={preset}
        wingColor={wingColor}
        patternColor={patternColor}
        backgroundColor={bg}
        butterflyCount={butterflyCount}
        flapSpeed={flapSpeed}
        speed={speed}
        attractRadius={attractRadius}
        interactive={interactive}
        showTrails={showTrails}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Hover to attract · move fast to scatter" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "monarch", "morpho", "meadow", "night"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Wing color" value={wingColor} onChange={setWingColor} />
        <PColor label="Pattern color" value={patternColor} onChange={setPatternColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Motion trails" value={showTrails} onChange={setShowTrails} />
      </div>
      <div>
        <PSlider label="Count" value={butterflyCount} min={2} max={40} step={1} onChange={setButterflyCount} />
        <PSlider label="Flap speed" value={flapSpeed} min={0.2} max={4} step={0.1} onChange={setFlapSpeed} />
        <PSlider label="Speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
        <PSlider label="Attract radius" value={attractRadius} min={30} max={300} step={10} onChange={setAttractRadius} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function ButterflySwarmPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="ButterflySwarm"
      lead="A flock of flapping butterflies that drift autonomously. Hover to slowly attract them — move fast to scatter the swarm."
    >
      <ButterflySwarmPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
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
