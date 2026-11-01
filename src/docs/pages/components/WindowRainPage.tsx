import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { WindowRain } from "../../../components/WindowRain";

const PROPS = [
  { name: "lightColors", type: "string[]", default: '["#fbbf24", "#f97316", "#ef4444", "#38bdf8", "#a78bfa", "#fde68a"]', description: "Colors of the out-of-focus lights behind the glass." },
  { name: "backgroundColor", type: "string", default: '"#07090f"', description: "Night behind the glass, ignored in overlay mode." },
  { name: "fogColor", type: "string", default: '"#94a3b8"', description: "Condensation color." },
  { name: "rain", type: "number", default: "1", description: "Rain intensity." },
  { name: "dropSize", type: "number", default: "1", description: "Drop size multiplier." },
  { name: "fog", type: "number", default: "0.25", description: "Condensation opacity, 0..1." },
  { name: "lights", type: "number", default: "34", description: "Number of blurred lights." },
  { name: "interactive", type: "boolean", default: "true", description: "Cursor wipes the glass." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"city-night\" | \"neon\" | \"cafe\" | \"storm\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"backgroundColor": "#07090f", "fogColor": "#94a3b8", "fog": 0.25},
  monochrome: {"backgroundColor": "#111111", "fogColor": "#9ca3af", "fog": 0.25},
  "city-night": {"backgroundColor": "#07090f", "fogColor": "#94a3b8", "fog": 0.25},
  "neon": {"backgroundColor": "#05030a", "fogColor": "#a78bfa", "fog": 0.25},
  "cafe": {"backgroundColor": "#120b06", "fogColor": "#d6b98c", "fog": 0.3},
  "storm": {"backgroundColor": "#0b0f14", "fogColor": "#cbd5e1", "fog": 0.35},
};

function WindowRainPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("city-night");
  const [backgroundColor, setBackgroundColor] = useState<string>("#07090f");
  const [fogColor, setFogColor] = useState<string>("#94a3b8");
  const [rain, setRain] = useState<number>(1);
  const [dropSize, setDropSize] = useState<number>(1);
  const [fog, setFog] = useState<number>(0.25);
  const [lights, setLights] = useState<number>(34);
  const [interactive, setInteractive] = useState<boolean>(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setBackgroundColor(v.backgroundColor as string);
    setFogColor(v.fogColor as string);
    setFog(v.fog as number);
  }

  const code = [
    `import { WindowRain } from 'own-the-canvas';`,
    ``,
    `<WindowRain`,
    `  preset="${preset}"`,
    `  backgroundColor="${backgroundColor}"`,
    `  fogColor="${fogColor}"`,
    `  rain={${rain}}`,
    `  dropSize={${dropSize}}`,
    `  fog={${fog}}`,
    `  lights={${lights}}`,
    `  interactive={${interactive}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: backgroundColor }}>
      <WindowRain
        preset={preset}
        backgroundColor={backgroundColor}
        fogColor={fogColor}
        rain={rain}
        dropSize={dropSize}
        fog={fog}
        lights={lights}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Drag across the glass to wipe it" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Background" value={backgroundColor} onChange={setBackgroundColor} />
        <PColor label="Fog color" value={fogColor} onChange={setFogColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Rain" value={rain} min={0} max={4} step={0.1} onChange={setRain} />
        <PSlider label="Drop size" value={dropSize} min={0.5} max={2} step={0.05} onChange={setDropSize} />
        <PSlider label="Fog" value={fog} min={0} max={0.7} step={0.01} onChange={setFog} />
        <PSlider label="Lights" value={lights} min={0} max={120} step={1} onChange={setLights} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function WindowRainPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="WindowRain"
      lead="Rain on a window at night: drops bead, merge, and run down the glass, clearing trails through the condensation. Each running drop is a tiny lens showing the blurred city lights behind it, upside down. Drag the cursor to wipe a streak clear."
    >
      <WindowRainPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How the drops behave</h2>
        <p className="page-p">{"Small beads are held by surface tension; once a drop grows past a critical size it runs, faster the heavier it is, stuttering where it catches. Running drops sweep up beads in their path, merge with each other (volume conserved), shed tiny droplets behind them, and wipe a clear lane through the fog. Every running drop refracts the out-of-focus scene behind the glass, flipped like a real lens."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
