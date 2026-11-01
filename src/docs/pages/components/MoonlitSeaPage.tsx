import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { MoonlitSea } from "../../../components/MoonlitSea";

const PROPS = [
  { name: "seaColor", type: "string", default: '"#0b2236"', description: "Water color." },
  { name: "skyColor", type: "string", default: '"#030712"', description: "Night sky color, ignored in overlay mode." },
  { name: "moonColor", type: "string", default: '"#f8fafc"', description: "Moon, glitter, and star color." },
  { name: "horizon", type: "number", default: "0.42", description: "Horizon height, 0..1 of canvas." },
  { name: "moonX", type: "number", default: "0.62", description: "Moon position, 0..1 of width." },
  { name: "waveHeight", type: "number", default: "1", description: "Swell height multiplier." },
  { name: "speed", type: "number", default: "1", description: "Wave speed multiplier." },
  { name: "stars", type: "number", default: "120", description: "Number of stars." },
  { name: "interactive", type: "boolean", default: "true", description: "Cursor leaves ripples on the water." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"midnight\" | \"harvest\" | \"arctic\" | \"rose\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"seaColor": "#0b2236", "skyColor": "#030712", "moonColor": "#f8fafc"},
  monochrome: {"seaColor": "#1f2937", "skyColor": "#111111", "moonColor": "#ffffff"},
  "midnight": {"seaColor": "#0b2236", "skyColor": "#030712", "moonColor": "#f8fafc"},
  "harvest": {"seaColor": "#1c1410", "skyColor": "#0a0604", "moonColor": "#fbbf24"},
  "arctic": {"seaColor": "#0f2a33", "skyColor": "#04121a", "moonColor": "#e0f2fe"},
  "rose": {"seaColor": "#2a1324", "skyColor": "#0d0510", "moonColor": "#fecdd3"},
};

function MoonlitSeaPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("midnight");
  const [seaColor, setSeaColor] = useState<string>("#0b2236");
  const [skyColor, setSkyColor] = useState<string>("#030712");
  const [moonColor, setMoonColor] = useState<string>("#f8fafc");
  const [horizon, setHorizon] = useState<number>(0.42);
  const [moonX, setMoonX] = useState<number>(0.62);
  const [waveHeight, setWaveHeight] = useState<number>(1);
  const [speed, setSpeed] = useState<number>(1);
  const [stars, setStars] = useState<number>(120);
  const [interactive, setInteractive] = useState<boolean>(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setSeaColor(v.seaColor as string);
    setSkyColor(v.skyColor as string);
    setMoonColor(v.moonColor as string);
  }

  const code = [
    `import { MoonlitSea } from 'own-the-canvas';`,
    ``,
    `<MoonlitSea`,
    `  preset="${preset}"`,
    `  seaColor="${seaColor}"`,
    `  skyColor="${skyColor}"`,
    `  moonColor="${moonColor}"`,
    `  horizon={${horizon}}`,
    `  moonX={${moonX}}`,
    `  waveHeight={${waveHeight}}`,
    `  speed={${speed}}`,
    `  stars={${stars}}`,
    `  interactive={${interactive}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: skyColor }}>
      <MoonlitSea
        preset={preset}
        seaColor={seaColor}
        skyColor={skyColor}
        moonColor={moonColor}
        horizon={horizon}
        moonX={moonX}
        waveHeight={waveHeight}
        speed={speed}
        stars={stars}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Glide over the water to make ripples" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Sea" value={seaColor} onChange={setSeaColor} />
        <PColor label="Sky" value={skyColor} onChange={setSkyColor} />
        <PColor label="Moon" value={moonColor} onChange={setMoonColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Horizon" value={horizon} min={0.15} max={0.75} step={0.01} onChange={setHorizon} />
        <PSlider label="Moon position" value={moonX} min={0.1} max={0.9} step={0.01} onChange={setMoonX} />
        <PSlider label="Wave height" value={waveHeight} min={0} max={3} step={0.05} onChange={setWaveHeight} />
        <PSlider label="Speed" value={speed} min={0} max={3} step={0.05} onChange={setSpeed} />
        <PSlider label="Stars" value={stars} min={0} max={400} step={10} onChange={setStars} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function MoonlitSeaPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="MoonlitSea"
      lead="The open sea at night: swells roll toward you in perspective, and the moon lays a path of glitter across the water where wave facets tilt its reflection into your eye. Glide the cursor over the water to leave ripples."
    >
      <MoonlitSeaPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">Where the glitter comes from</h2>
        <p className="page-p">{"The moon path isn't painted on. Each wave row is a sum of travelling swells; at every point the slope is checked against the angle that would reflect the moon toward the viewer, and only matching facets flash. That's why the path is narrow near the horizon, widens toward you, and shimmers as the waves move. Ripples are expanding wave rings in world space, so they flatten with distance."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
