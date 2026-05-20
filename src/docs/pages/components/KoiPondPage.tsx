import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { KoiPond } from "../../../components/KoiPond";

const PROPS = [
  { name: "fishCount",   type: "number",  default: "6",        description: "Number of koi fish." },
  { name: "fishColor",   type: "string",  default: '"#ffffff"',description: "Primary fish body color." },
  { name: "scaleColor",  type: "string",  default: '"#6b7280"',description: "Scale accent color." },
  { name: "waterColor",  type: "string",  default: '"#111111"',description: "Water background color." },
  { name: "rippleColor", type: "string",  default: '"#6b7280"',description: "Ripple ring color." },
  { name: "lilyColor",   type: "string",  default: '"#ffffff"',description: "Lily pad color." },
  { name: "speed",       type: "number",  default: "1",        description: "Fish movement speed multiplier." },
  { name: "interactive", type: "boolean", default: "true",     description: "Cursor movement causes ripples." },
  { name: "showLilies",  type: "boolean", default: "true",     description: "Show lily pads." },
  { name: "caustics",    type: "boolean", default: "true",     description: "Animated caustic light patterns." },
  { name: "preset",      type: "string",  default: "—",        description: '"default" | "koi" | "night" | "lotus" | "neon"' },
];

const PRESET_VALUES: Record<string, {
  fishColor: string; scaleColor: string; waterColor: string; lilyColor: string;
}> = {
  default: { fishColor: "#ffffff", scaleColor: "#6b7280", waterColor: "#111111", lilyColor: "#ffffff" },
  koi:     { fishColor: "#ff6633", scaleColor: "#ffffff", waterColor: "#0a1a14", lilyColor: "#50aa50" },
  night:   { fishColor: "#88aaff", scaleColor: "#4466aa", waterColor: "#050810", lilyColor: "#304030" },
  lotus:   { fishColor: "#ffccdd", scaleColor: "#ff80a0", waterColor: "#0a0a14", lilyColor: "#ff80a0" },
  neon:    { fishColor: "#00ffcc", scaleColor: "#ff00aa", waterColor: "#000a08", lilyColor: "#00ff44" },
};

function KoiPondPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [fishColor, setFishColor] = useState("#ffffff");
  const [scaleColor, setScaleColor] = useState("#6b7280");
  const [waterColor, setWaterColor] = useState("#111111");
  const [lilyColor, setLilyColor] = useState("#ffffff");
  const [fishCount, setFishCount] = useState(6);
  const [speed, setSpeed] = useState(1);
  const [showLilies, setShowLilies] = useState(true);
  const [caustics, setCaustics] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setFishColor(v.fishColor);
    setScaleColor(v.scaleColor);
    setWaterColor(v.waterColor);
    setLilyColor(v.lilyColor);
  }

  const code = [
    `import { KoiPond } from 'own-the-canvas';`,
    ``,
    `<KoiPond`,
    `  preset="${preset}"`,
    `  fishColor="${fishColor}"`,
    `  waterColor="${waterColor}"`,
    `  lilyColor="${lilyColor}"`,
    `  fishCount={${fishCount}}`,
    `  speed={${speed}}`,
    `  showLilies={${showLilies}}`,
    `  caustics={${caustics}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: waterColor }}>
      <KoiPond
        preset={preset}
        fishColor={fishColor}
        scaleColor={scaleColor}
        waterColor={waterColor}
        lilyColor={lilyColor}
        fishCount={fishCount}
        speed={speed}
        showLilies={showLilies}
        caustics={caustics}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Move cursor to create ripples" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "koi", "night", "lotus", "neon"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Fish color" value={fishColor} onChange={setFishColor} />
        <PColor label="Scale color" value={scaleColor} onChange={setScaleColor} />
        <PColor label="Water color" value={waterColor} onChange={setWaterColor} />
        <PColor label="Lily color" value={lilyColor} onChange={setLilyColor} />
        <PToggle label="Show lilies" value={showLilies} onChange={setShowLilies} />
        <PToggle label="Caustics" value={caustics} onChange={setCaustics} />
      </div>
      <div>
        <PSlider label="Fish count" value={fishCount} min={1} max={20} step={1} onChange={setFishCount} />
        <PSlider label="Speed" value={speed} min={0.2} max={3} step={0.1} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function KoiPondPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="KoiPond"
      lead="A serene koi pond with flocking fish, ripple physics, lily pads, and animated caustic light on the water floor. Move your cursor to create ripples."
    >
      <KoiPondPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
