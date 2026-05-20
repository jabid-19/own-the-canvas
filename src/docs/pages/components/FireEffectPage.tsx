import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { FireEffect } from "../../../components/FireEffect";

const PROPS = [
  { name: "palette",     type: '"smoke" | "inferno" | "toxic" | "ice" | "plasma"', default: '"smoke"', description: "Color palette for the fire simulation." },
  { name: "intensity",   type: "number", default: "0.95", description: "Fire intensity (0–1). Higher = taller flames." },
  { name: "windStrength",type: "number", default: "0.3",  description: "Horizontal wind drift strength." },
  { name: "spread",      type: "number", default: "0",    description: "Horizontal spread of the flame base." },
  { name: "cooling",     type: "number", default: "0.3",  description: "Cooling rate. Higher = shorter flames." },
];

type FirePalette = "smoke" | "inferno" | "toxic" | "ice" | "plasma";

function FireEffectPlayground({ onReset }: { onReset?: () => void }) {
  const [palette, setPalette] = useState<FirePalette>("smoke");
  const [intensity, setIntensity] = useState(0.95);
  const [wind, setWind] = useState(0.3);
  const [spread, setSpread] = useState(0);
  const [cooling, setCooling] = useState(0.3);

  const code = [
    `import { FireEffect } from 'own-the-canvas';`,
    ``,
    `<FireEffect`,
    `  palette="${palette}"`,
    `  intensity={${intensity}}`,
    `  windStrength={${wind}}`,
    `  spread={${spread}}`,
    `  cooling={${cooling}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <FireEffect palette={palette} intensity={intensity} windStrength={wind}
        spread={spread} cooling={cooling} width="100%" height="100%" />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Palette" value={palette} options={["smoke", "inferno", "toxic", "ice", "plasma"]} onChange={setPalette} />
        <PDivider />
        <PSlider label="Intensity" value={intensity} min={0.1} max={1} step={0.05} onChange={setIntensity} />
        <PSlider label="Wind strength" value={wind} min={0} max={1} step={0.05} onChange={setWind} />
      </div>
      <div>
        <PSlider label="Spread" value={spread} min={0} max={1} step={0.05} onChange={setSpread} />
        <PSlider label="Cooling" value={cooling} min={0.05} max={0.8} step={0.05} onChange={setCooling} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function FireEffectPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="FireEffect"
      lead="Pixel-level fire simulation using a cellular automaton approach. Choose from four distinct color palettes."
    >
      <FireEffectPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
