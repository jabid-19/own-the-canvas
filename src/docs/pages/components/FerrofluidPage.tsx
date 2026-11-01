import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Ferrofluid } from "../../../components/Ferrofluid";

const PROPS = [
  { name: "fluidColor", type: "string", default: '"#050505"', description: "Fluid color." },
  { name: "highlightColor", type: "string", default: '"#ffffff"', description: "Specular highlight color." },
  { name: "backgroundColor", type: "string", default: '"#ececec"', description: "Background color, ignored in overlay mode." },
  { name: "spikes", type: "number", default: "9", description: "Spikes per row." },
  { name: "spikeHeight", type: "number", default: "1", description: "Spike height multiplier." },
  { name: "poolWidth", type: "number", default: "0.5", description: "Pool width as a fraction of canvas width." },
  { name: "strength", type: "number", default: "1", description: "Magnet strength." },
  { name: "reflection", type: "boolean", default: "true", description: "Mirror reflection on the table." },
  { name: "interactive", type: "boolean", default: "true", description: "Cursor acts as the magnet; click pulses." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"studio\" | \"noir\" | \"gold\" | \"oil-slick\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"fluidColor": "#050505", "highlightColor": "#ffffff", "backgroundColor": "#ececec"},
  monochrome: {"fluidColor": "#050505", "highlightColor": "#ffffff", "backgroundColor": "#e5e5e5"},
  "studio": {"fluidColor": "#050505", "highlightColor": "#ffffff", "backgroundColor": "#ececec"},
  "noir": {"fluidColor": "#000000", "highlightColor": "#9ca3af", "backgroundColor": "#0a0a0a"},
  "gold": {"fluidColor": "#1a1206", "highlightColor": "#f5c96a", "backgroundColor": "#120d05"},
  "oil-slick": {"fluidColor": "#05050a", "highlightColor": "#a78bfa", "backgroundColor": "#0b0b12"},
};

function FerrofluidPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("studio");
  const [fluidColor, setFluidColor] = useState<string>("#050505");
  const [highlightColor, setHighlightColor] = useState<string>("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState<string>("#ececec");
  const [spikes, setSpikes] = useState<number>(9);
  const [spikeHeight, setSpikeHeight] = useState<number>(1);
  const [poolWidth, setPoolWidth] = useState<number>(0.5);
  const [strength, setStrength] = useState<number>(1);
  const [reflection, setReflection] = useState<boolean>(true);
  const [interactive, setInteractive] = useState<boolean>(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setFluidColor(v.fluidColor as string);
    setHighlightColor(v.highlightColor as string);
    setBackgroundColor(v.backgroundColor as string);
  }

  const code = [
    `import { Ferrofluid } from 'own-the-canvas';`,
    ``,
    `<Ferrofluid`,
    `  preset="${preset}"`,
    `  fluidColor="${fluidColor}"`,
    `  highlightColor="${highlightColor}"`,
    `  backgroundColor="${backgroundColor}"`,
    `  spikes={${spikes}}`,
    `  spikeHeight={${spikeHeight}}`,
    `  poolWidth={${poolWidth}}`,
    `  strength={${strength}}`,
    `  reflection={${reflection}}`,
    `  interactive={${interactive}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: backgroundColor }}>
      <Ferrofluid
        preset={preset}
        fluidColor={fluidColor}
        highlightColor={highlightColor}
        backgroundColor={backgroundColor}
        spikes={spikes}
        spikeHeight={spikeHeight}
        poolWidth={poolWidth}
        strength={strength}
        reflection={reflection}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Your cursor is the magnet \u00b7 click to pulse" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Fluid" value={fluidColor} onChange={setFluidColor} />
        <PColor label="Highlight" value={highlightColor} onChange={setHighlightColor} />
        <PColor label="Background" value={backgroundColor} onChange={setBackgroundColor} />
        <PToggle label="Reflection" value={reflection} onChange={setReflection} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Spikes" value={spikes} min={3} max={24} step={1} onChange={setSpikes} />
        <PSlider label="Spike height" value={spikeHeight} min={0.3} max={2} step={0.05} onChange={setSpikeHeight} />
        <PSlider label="Pool width" value={poolWidth} min={0.2} max={0.8} step={0.01} onChange={setPoolWidth} />
        <PSlider label="Magnet strength" value={strength} min={0.3} max={2.5} step={0.05} onChange={setStrength} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function FerrofluidPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Ferrofluid"
      lead="A pool of glossy black ferrofluid on a polished table. Bring the cursor near and spikes erupt in a crown, leaning toward it like a magnet; pull away and they melt back into a smooth puddle. Click to pulse the field."
    >
      <FerrofluidPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">Why it spikes</h2>
        <p className="page-p">{"Ferrofluid stays flat until the magnetic field crosses a critical strength, then the surface becomes unstable and breaks into a lattice of peaks (the Rosensweig instability). The simulation uses that threshold: each spike's target height comes from the field at its position, with springy, slightly underdamped motion so the liquid overshoots and settles. Spikes lean along the field toward the magnet, and the whole pool bulges toward it."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
