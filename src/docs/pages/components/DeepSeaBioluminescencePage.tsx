import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DeepSeaBioluminescence } from "../../../components/DeepSeaBioluminescence";

const PROPS = [
  { name: "jellyfishCount",  type: "number",  default: "5",          description: "Number of drifting jellyfish." },
  { name: "planktonCount",   type: "number",  default: "200",        description: "Number of bioluminescent plankton particles." },
  { name: "jellyfishColor",  type: "string",  default: '"#88ccff"',  description: "Jellyfish bell and silhouette color." },
  { name: "glowColor",       type: "string",  default: '"#00ffcc"',  description: "Bioluminescent glow and ripple color." },
  { name: "waterColor",      type: "string",  default: '"#020c14"',  description: "Deep water background color." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Mouse movement spawns glowing ripples." },
  { name: "showAnglerfish",  type: "boolean", default: "true",       description: "Show anglerfish silhouette with bobbing lure." },
  { name: "speed",           type: "number",  default: "1",          description: "Overall animation speed multiplier." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "abyssal" | "coral" | "aurora" | "crimson"' },
];

const PRESET_VALUES: Record<string, { jellyfishColor: string; glowColor: string; waterColor: string }> = {
  default:  { jellyfishColor: "#88ccff", glowColor: "#00ffcc", waterColor: "#020c14" },
  abyssal:  { jellyfishColor: "#8855cc", glowColor: "#aa55ff", waterColor: "#020008" },
  coral:    { jellyfishColor: "#ff8855", glowColor: "#ffaa44", waterColor: "#040a0c" },
  aurora:   { jellyfishColor: "#44ffaa", glowColor: "#00ff88", waterColor: "#020c08" },
  crimson:  { jellyfishColor: "#ff3344", glowColor: "#ff2244", waterColor: "#080002" },
};

function DeepSeaBioluminescencePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]               = useState("default");
  const [jellyfishColor, setJellyfishColor] = useState("#88ccff");
  const [glowColor, setGlowColor]         = useState("#00ffcc");
  const [waterColor, setWaterColor]       = useState("#020c14");
  const [jellyfishCount, setJellyfishCount] = useState(5);
  const [planktonCount, setPlanktonCount] = useState(200);
  const [speed, setSpeed]                 = useState(1);
  const [interactive, setInteractive]     = useState(true);
  const [showAnglerfish, setShowAnglerfish] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setJellyfishColor(v.jellyfishColor);
    setGlowColor(v.glowColor);
    setWaterColor(v.waterColor);
  }

  const code = [
    `import { DeepSeaBioluminescence } from 'own-the-canvas';`,
    ``,
    `<DeepSeaBioluminescence`,
    `  preset="${preset}"`,
    `  jellyfishColor="${jellyfishColor}"`,
    `  glowColor="${glowColor}"`,
    `  waterColor="${waterColor}"`,
    `  jellyfishCount={${jellyfishCount}}`,
    `  planktonCount={${planktonCount}}`,
    `  speed={${speed}}`,
    `  interactive={${interactive}}`,
    `  showAnglerfish={${showAnglerfish}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: waterColor }}>
      <DeepSeaBioluminescence
        preset={preset}
        jellyfishColor={jellyfishColor}
        glowColor={glowColor}
        waterColor={waterColor}
        jellyfishCount={jellyfishCount}
        planktonCount={planktonCount}
        speed={speed}
        interactive={interactive}
        showAnglerfish={showAnglerfish}
        width="100%"
        height="100%"
      />
      <PLiveLabel text={interactive ? "Move cursor to spawn bioluminescent ripples" : "Ambient deep-sea environment"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "abyssal", "coral", "aurora", "crimson"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Jellyfish color" value={jellyfishColor} onChange={setJellyfishColor} />
        <PColor label="Glow color" value={glowColor} onChange={setGlowColor} />
        <PColor label="Water color" value={waterColor} onChange={setWaterColor} />
        <PToggle label="Interactive ripples" value={interactive} onChange={setInteractive} />
        <PToggle label="Show anglerfish" value={showAnglerfish} onChange={setShowAnglerfish} />
      </div>
      <div>
        <PSlider label="Jellyfish count" value={jellyfishCount} min={1} max={15} step={1} onChange={setJellyfishCount} />
        <PSlider label="Plankton count" value={planktonCount} min={50} max={500} step={10} onChange={setPlanktonCount} />
        <PSlider label="Speed" value={speed} min={0.2} max={3} step={0.1} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function DeepSeaBioluminescencePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="DeepSeaBioluminescence"
      lead="A dark ocean environment with pulsing jellyfish, bioluminescent plankton, a lurking anglerfish, and cursor-triggered ripples of glowing light."
    >
      <DeepSeaBioluminescencePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
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
