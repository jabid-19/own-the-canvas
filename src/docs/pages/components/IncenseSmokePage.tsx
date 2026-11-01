import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { IncenseSmoke } from "../../../components/IncenseSmoke";

const PROPS = [
  { name: "sticks", type: "number", default: "1", description: "Incense sticks." },
  { name: "color", type: "string", default: '"#e7e5e4"', description: "Smoke color." },
  { name: "emberColor", type: "string", default: '"#ff6a2b"', description: "Glowing ember color." },
  { name: "stickColor", type: "string", default: '"#5b4636"', description: "Stick color." },
  { name: "backgroundColor", type: "string", default: '"#0c0a09"', description: "Background color, ignored in overlay mode." },
  { name: "turbulence", type: "number", default: "1", description: "How strongly the plume curls once it breaks up." },
  { name: "rise", type: "number", default: "1", description: "Rise speed multiplier." },
  { name: "thickness", type: "number", default: "1", description: "Smoke thickness multiplier." },
  { name: "interactive", type: "boolean", default: "true", description: "Cursor stirs the smoke." },
  { name: "preset", type: "string", default: "\u2014", description: "\"default\" | \"temple\" | \"sandalwood\" | \"moonlight\" | \"noir\"" },
  { name: "overlay", type: "boolean", default: "false", description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex", type: "number", default: "10", description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, Record<string, unknown>> = {
  "default": {"color": "#e7e5e4", "emberColor": "#ff6a2b", "stickColor": "#5b4636", "backgroundColor": "#0c0a09"},
  monochrome: {"color": "#ffffff", "emberColor": "#ffffff", "stickColor": "#6b7280", "backgroundColor": "#111111"},
  "temple": {"color": "#e7e5e4", "emberColor": "#ff6a2b", "stickColor": "#5b4636", "backgroundColor": "#0c0a09"},
  "sandalwood": {"color": "#f5e6d3", "emberColor": "#ffb15c", "stickColor": "#7a5230", "backgroundColor": "#140d08"},
  "moonlight": {"color": "#cbd5e1", "emberColor": "#fde68a", "stickColor": "#475569", "backgroundColor": "#05070d"},
  "noir": {"color": "#ffffff", "emberColor": "#ffffff", "stickColor": "#3f3f46", "backgroundColor": "#000000"},
};

function IncenseSmokePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("temple");
  const [sticks, setSticks] = useState<number>(1);
  const [color, setColor] = useState<string>("#e7e5e4");
  const [emberColor, setEmberColor] = useState<string>("#ff6a2b");
  const [stickColor, setStickColor] = useState<string>("#5b4636");
  const [backgroundColor, setBackgroundColor] = useState<string>("#0c0a09");
  const [turbulence, setTurbulence] = useState<number>(1);
  const [rise, setRise] = useState<number>(1);
  const [thickness, setThickness] = useState<number>(1);
  const [interactive, setInteractive] = useState<boolean>(true);

  function onPresetChange(next: string) {
    setPreset(next);
    const v = PRESET_VALUES[next] ?? PRESET_VALUES.default;
    setColor(v.color as string);
    setEmberColor(v.emberColor as string);
    setStickColor(v.stickColor as string);
    setBackgroundColor(v.backgroundColor as string);
  }

  const code = [
    `import { IncenseSmoke } from 'own-the-canvas';`,
    ``,
    `<IncenseSmoke`,
    `  preset="${preset}"`,
    `  sticks={${sticks}}`,
    `  color="${color}"`,
    `  emberColor="${emberColor}"`,
    `  stickColor="${stickColor}"`,
    `  backgroundColor="${backgroundColor}"`,
    `  turbulence={${turbulence}}`,
    `  rise={${rise}}`,
    `  thickness={${thickness}}`,
    `  interactive={${interactive}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: backgroundColor }}>
      <IncenseSmoke
        preset={preset}
        sticks={sticks}
        color={color}
        emberColor={emberColor}
        stickColor={stickColor}
        backgroundColor={backgroundColor}
        turbulence={turbulence}
        rise={rise}
        thickness={thickness}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Move through the smoke to stir it" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Smoke color" value={color} onChange={setColor} />
        <PColor label="Ember color" value={emberColor} onChange={setEmberColor} />
        <PColor label="Stick color" value={stickColor} onChange={setStickColor} />
        <PColor label="Background" value={backgroundColor} onChange={setBackgroundColor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Sticks" value={sticks} min={1} max={5} step={1} onChange={setSticks} />
        <PSlider label="Turbulence" value={turbulence} min={0} max={3} step={0.05} onChange={setTurbulence} />
        <PSlider label="Rise" value={rise} min={0.3} max={2.5} step={0.05} onChange={setRise} />
        <PSlider label="Thickness" value={thickness} min={0.3} max={3} step={0.05} onChange={setThickness} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function IncenseSmokePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="IncenseSmoke"
      lead="Smoke rising from incense: a single smooth thread near the ember that breaks into curls and wisps as it climbs, the laminar-to-turbulent transition of a real plume. Move the cursor through it and the air swirls."
    >
      <IncenseSmokePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How the smoke flows</h2>
        <p className="page-p">{"Each filament is a chain of puffs emitted in order and drawn as one continuous line, so it stays a thread instead of a cloud of dots. Puffs ride buoyancy plus a divergence-free swirl field (incompressible, like real air), with turbulence that ramps up with height. Older smoke is drawn wider and fainter as it diffuses. Cursor motion injects swirling velocity that the smoke carries away."}</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
