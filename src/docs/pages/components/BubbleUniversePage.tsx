import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { BubbleUniverse } from "../../../components/BubbleUniverse";

const PROPS = [
  { name: "bubbleCount",    type: "number",  default: "15",        description: "Number of simultaneous bubbles." },
  { name: "minRadius",      type: "number",  default: "20",        description: "Minimum bubble radius in px." },
  { name: "maxRadius",      type: "number",  default: "80",        description: "Maximum bubble radius in px." },
  { name: "backgroundColor",type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "shimmerColor",   type: "string",  default: '"#ffffff"', description: "Specular highlight color." },
  { name: "popEffect",      type: "boolean", default: "true",      description: "Click bubbles to pop them." },
  { name: "gravity",        type: "number",  default: "0.02",      description: "Downward gravity force." },
  { name: "friction",       type: "number",  default: "0.995",     description: "Velocity friction per frame." },
  { name: "interactive",    type: "boolean", default: "true",      description: "Hover pushes bubbles; click to pop." },
  { name: "mergeOnCollide", type: "boolean", default: "true",      description: "Bubbles merge when overlapping significantly." },
  { name: "glowEffect",     type: "boolean", default: "true",      description: "Iridescent glow on bubbles." },
  { name: "preset",         type: "string",  default: "—",         description: '"default" | "soap" | "neon" | "deep" | "minimal"' },
];

const PRESET_VALUES: Record<string, {
  bg: string; shimmerColor: string; gravity: number; bubbleCount: number; minRadius: number; maxRadius: number;
}> = {
  default: { bg: "#111111", shimmerColor: "#ffffff", gravity: 0.02,  bubbleCount: 15, minRadius: 20, maxRadius: 50  },
  soap:    { bg: "#050a12", shimmerColor: "#ffffff", gravity: 0.01,  bubbleCount: 15, minRadius: 25, maxRadius: 90  },
  neon:    { bg: "#000008", shimmerColor: "#00ffff", gravity: 0.015, bubbleCount: 12, minRadius: 20, maxRadius: 80  },
  deep:    { bg: "#010510", shimmerColor: "#88aaff", gravity: 0.008, bubbleCount: 20, minRadius: 15, maxRadius: 60  },
  minimal: { bg: "#111111", shimmerColor: "#ffffff", gravity: 0.025, bubbleCount: 8,  minRadius: 30, maxRadius: 100 },
};

function BubbleUniversePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [bg, setBg] = useState("#111111");
  const [shimmerColor, setShimmerColor] = useState("#ffffff");
  const [bubbleCount, setBubbleCount] = useState(15);
  const [minRadius, setMinRadius] = useState(20);
  const [maxRadius, setMaxRadius] = useState(50);
  const [gravity, setGravity] = useState(0.02);
  const [popEffect, setPopEffect] = useState(true);
  const [mergeOnCollide, setMergeOnCollide] = useState(true);
  const [glowEffect, setGlowEffect] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setBg(v.bg);
    setShimmerColor(v.shimmerColor);
    setGravity(v.gravity);
    setBubbleCount(v.bubbleCount);
    setMinRadius(v.minRadius);
    setMaxRadius(v.maxRadius);
  }

  const code = [
    `import { BubbleUniverse } from 'own-the-canvas';`,
    ``,
    `<BubbleUniverse`,
    `  preset="${preset}"`,
    `  backgroundColor="${bg}"`,
    `  shimmerColor="${shimmerColor}"`,
    `  bubbleCount={${bubbleCount}}`,
    `  minRadius={${minRadius}}`,
    `  maxRadius={${maxRadius}}`,
    `  gravity={${gravity}}`,
    `  popEffect={${popEffect}}`,
    `  mergeOnCollide={${mergeOnCollide}}`,
    `  glowEffect={${glowEffect}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <BubbleUniverse
        preset={preset}
        backgroundColor={bg}
        shimmerColor={shimmerColor}
        bubbleCount={bubbleCount}
        minRadius={minRadius}
        maxRadius={maxRadius}
        gravity={gravity}
        popEffect={popEffect}
        mergeOnCollide={mergeOnCollide}
        glowEffect={glowEffect}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Click bubbles to pop · Hover to push" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "soap", "neon", "deep", "minimal"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PColor label="Shimmer color" value={shimmerColor} onChange={setShimmerColor} />
        <PToggle label="Pop effect" value={popEffect} onChange={setPopEffect} />
        <PToggle label="Merge on collide" value={mergeOnCollide} onChange={setMergeOnCollide} />
        <PToggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
      </div>
      <div>
        <PSlider label="Bubble count" value={bubbleCount} min={3} max={40} step={1} onChange={setBubbleCount} />
        <PSlider label="Min radius" value={minRadius} min={10} max={50} step={5} onChange={setMinRadius} />
        <PSlider label="Max radius" value={maxRadius} min={40} max={150} step={5} onChange={setMaxRadius} />
        <PSlider label="Gravity" value={gravity} min={0} max={0.08} step={0.002} onChange={setGravity} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function BubbleUniversePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="BubbleUniverse"
      lead="Iridescent soap bubbles with elastic collision physics, merge mechanics, and satisfying pop animations. Click to pop, hover to push."
    >
      <BubbleUniversePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
