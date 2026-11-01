import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { InkMountains } from "../../../components/InkMountains";

const PROPS = [
  { name: "paperColor", type: "string", default: '"#efe8d8"', description: "Paper (background) color; distant ranges fade toward it." },
  { name: "inkColor", type: "string", default: '"#141414"', description: "Ink color of the nearest ridge." },
  { name: "sunColor", type: "string", default: '"#b91c1c"', description: "Sun disc color." },
  { name: "layers", type: "number", default: "5", description: "Mountain ranges, far to near." },
  { name: "mist", type: "number", default: "1", description: "Fog density between ranges." },
  { name: "drift", type: "number", default: "1", description: "Slow camera pan speed; 0 = still." },
  { name: "birds", type: "number", default: "5", description: "Birds crossing the sky." },
  { name: "pines", type: "boolean", default: "true", description: "Pines on the near ridges." },
  { name: "parallax", type: "boolean", default: "true", description: "Cursor shifts the layers for depth." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"sumi\" | \"night\" | \"jade\" | \"dusk\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"paperColor": "#efe8d8", "inkColor": "#141414", "sunColor": "#b91c1c"},
  monochrome: {"paperColor": "#f2efe6", "inkColor": "#111111", "sunColor": "#6b7280"},
  "sumi": {"paperColor": "#efe8d8", "inkColor": "#141414", "sunColor": "#b91c1c"},
  "night": {"paperColor": "#0d1117", "inkColor": "#e5e7eb", "sunColor": "#f8fafc"},
  "jade": {"paperColor": "#e6efe9", "inkColor": "#0f3d2e", "sunColor": "#c2410c"},
  "dusk": {"paperColor": "#f3e3d3", "inkColor": "#3b1d2e", "sunColor": "#e11d48"},
};

function InkMountainsPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("sumi");
  const [paperColor, setPaperColor] = useState<string>("#efe8d8");
  const [inkColor, setInkColor] = useState<string>("#141414");
  const [sunColor, setSunColor] = useState<string>("#b91c1c");
  const [layers, setLayers] = useState<number>(5);
  const [mist, setMist] = useState<number>(1);
  const [drift, setDrift] = useState<number>(1);
  const [birds, setBirds] = useState<number>(5);
  const [pines, setPines] = useState<boolean>(true);
  const [parallax, setParallax] = useState<boolean>(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setPaperColor(v.paperColor as string);
    setInkColor(v.inkColor as string);
    setSunColor(v.sunColor as string);
  }

  const code = [
    `import { InkMountains } from 'own-the-canvas';`,
    ``,
    `<InkMountains`,
    `  preset="${preset}"`,
    `  paperColor="${paperColor}"`,
    `  inkColor="${inkColor}"`,
    `  sunColor="${sunColor}"`,
    `  layers={${layers}}`,
    `  mist={${mist}}`,
    `  drift={${drift}}`,
    `  birds={${birds}}`,
    `  pines={${pines}}`,
    `  parallax={${parallax}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: paperColor }}>
      <InkMountains
        preset={preset}
        paperColor={paperColor}
        inkColor={inkColor}
        sunColor={sunColor}
        layers={layers}
        mist={mist}
        drift={drift}
        birds={birds}
        pines={pines}
        parallax={parallax}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Move the cursor for parallax" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Paper" value={paperColor} onChange={setPaperColor} />
        <PColor label="Ink" value={inkColor} onChange={setInkColor} />
        <PColor label="Sun" value={sunColor} onChange={setSunColor} />
        <PToggle label="Pines" value={pines} onChange={setPines} />
        <PToggle label="Parallax" value={parallax} onChange={setParallax} />
      </div>
      <div>
        <PSlider label="Layers" value={layers} min={1} max={9} step={1} onChange={setLayers} />
        <PSlider label="Mist" value={mist} min={0} max={2} step={0.05} onChange={setMist} />
        <PSlider label="Drift" value={drift} min={0} max={4} step={0.1} onChange={setDrift} />
        <PSlider label="Birds" value={birds} min={0} max={20} step={1} onChange={setBirds} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function InkMountainsPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="InkMountains"
      lead="An ink-wash landscape: layered ridgelines fade from wet black ink up close to pale mist in the distance, with fog drifting through the valleys, pines on the near slopes, and birds crossing. The view slowly pans, and shifts in depth as you move the cursor."
    >
      <InkMountainsPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How it's painted</h2>
        <p className="page-p">{"Each layer is a ridgeline from sharpened fractal noise, filled with a gradient that goes from ink at the crest to paper at the base, so every range dissolves into the mist below it, the defining move of sumi-e. Nearer layers get darker ink, dry-brush texture strokes, and pines. Layers scroll at different rates for parallax."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
