import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { CloudSea } from "../../../components/CloudSea";

const PROPS = [
  { name: "skyColor", type: "string", default: '"#1e1b4b"', description: "Upper sky color, ignored in overlay mode." },
  { name: "sunColor", type: "string", default: '"#fb923c"', description: "Sun and rim-light color." },
  { name: "cloudColor", type: "string", default: '"#fde2cf"', description: "Lit cloud color." },
  { name: "shadowColor", type: "string", default: '"#8a6f8e"', description: "Cloud shadow color." },
  { name: "horizon", type: "number", default: "0.36", description: "Horizon height, 0..1 of canvas." },
  { name: "coverage", type: "number", default: "0.55", description: "Cloud coverage, 0 = clear, 1 = overcast." },
  { name: "speed", type: "number", default: "1", description: "Drift speed multiplier." },
  { name: "interactive", type: "boolean", default: "true", description: "Cursor parts the clouds." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"sunset\" | \"dawn\" | \"golden\" | \"stormy\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"skyColor": "#1e1b4b", "sunColor": "#fb923c", "cloudColor": "#fde2cf", "shadowColor": "#8a6f8e", "coverage": 0.55},
  monochrome: {"skyColor": "#111111", "sunColor": "#ffffff", "cloudColor": "#d1d5db", "shadowColor": "#4b5563", "coverage": 0.55},
  "sunset": {"skyColor": "#1e1b4b", "sunColor": "#fb923c", "cloudColor": "#fde2cf", "shadowColor": "#8a6f8e", "coverage": 0.55},
  "dawn": {"skyColor": "#0c4a6e", "sunColor": "#fde68a", "cloudColor": "#fef3c7", "shadowColor": "#7c8fa6", "coverage": 0.55},
  "golden": {"skyColor": "#422006", "sunColor": "#fbbf24", "cloudColor": "#fff1c1", "shadowColor": "#8a5a2b", "coverage": 0.55},
  "stormy": {"skyColor": "#0f172a", "sunColor": "#cbd5e1", "cloudColor": "#94a3b8", "shadowColor": "#1e293b", "coverage": 0.8},
};

function CloudSeaPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("sunset");
  const [skyColor, setSkyColor] = useState<string>("#1e1b4b");
  const [sunColor, setSunColor] = useState<string>("#fb923c");
  const [cloudColor, setCloudColor] = useState<string>("#fde2cf");
  const [shadowColor, setShadowColor] = useState<string>("#8a6f8e");
  const [horizon, setHorizon] = useState<number>(0.36);
  const [coverage, setCoverage] = useState<number>(0.55);
  const [speed, setSpeed] = useState<number>(1);
  const [interactive, setInteractive] = useState<boolean>(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setSkyColor(v.skyColor as string);
    setSunColor(v.sunColor as string);
    setCloudColor(v.cloudColor as string);
    setShadowColor(v.shadowColor as string);
    setCoverage(v.coverage as number);
  }

  const code = [
    `import { CloudSea } from 'own-the-canvas';`,
    ``,
    `<CloudSea`,
    `  preset="${preset}"`,
    `  skyColor="${skyColor}"`,
    `  sunColor="${sunColor}"`,
    `  cloudColor="${cloudColor}"`,
    `  shadowColor="${shadowColor}"`,
    `  horizon={${horizon}}`,
    `  coverage={${coverage}}`,
    `  speed={${speed}}`,
    `  interactive={${interactive}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: skyColor }}>
      <CloudSea
        preset={preset}
        skyColor={skyColor}
        sunColor={sunColor}
        cloudColor={cloudColor}
        shadowColor={shadowColor}
        horizon={horizon}
        coverage={coverage}
        speed={speed}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Move over the clouds to part them" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Sky" value={skyColor} onChange={setSkyColor} />
        <PColor label="Sun" value={sunColor} onChange={setSunColor} />
        <PColor label="Cloud" value={cloudColor} onChange={setCloudColor} />
        <PColor label="Shadow" value={shadowColor} onChange={setShadowColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Horizon" value={horizon} min={0.1} max={0.7} step={0.01} onChange={setHorizon} />
        <PSlider label="Coverage" value={coverage} min={0} max={1} step={0.01} onChange={setCoverage} />
        <PSlider label="Speed" value={speed} min={0} max={4} step={0.05} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function CloudSeaPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="CloudSea"
      lead="Above the clouds at sunset: a deck of cloud stretches to the horizon in perspective, rims lit by a low sun, drifting slowly beneath you. Move the cursor over the clouds and they part as if you were flying through."
    >
      <CloudSeaPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How the clouds are lit</h2>
        <p className="page-p">{"Every pixel of the deck is projected into world space and sampled from fractal noise, thresholded by coverage. Lighting compares density with a sample a little further toward the sun: edges where the cloud thins toward the light glow, giving the back-lit silver lining. Distance haze melts the far deck into the sunset. The cursor carves a clearing that heals as you move on."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
