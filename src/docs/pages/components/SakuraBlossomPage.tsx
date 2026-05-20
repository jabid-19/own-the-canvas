import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { SakuraBlossom } from "../../../components/SakuraBlossom";

const PROPS = [
  { name: "petalCount",      type: "number",  default: "80",      description: "Number of petals." },
  { name: "petalColor",      type: "string",  default: '"#ffffff"',description: "Petal fill color." },
  { name: "petalSize",       type: "number",  default: "8",       description: "Petal radius in px." },
  { name: "backgroundColor", type: "string",  default: '"#111111"',description: "Canvas background color." },
  { name: "gravity",         type: "number",  default: "0.06",    description: "Downward gravity force." },
  { name: "windStrength",    type: "number",  default: "0.8",     description: "Base horizontal wind strength." },
  { name: "windGusts",       type: "boolean", default: "true",    description: "Enable random wind gusts." },
  { name: "showAccumulation",type: "boolean", default: "true",    description: "Petals accumulate at bottom." },
  { name: "maxAccumulation", type: "number",  default: "40",      description: "Max accumulation height in px." },
  { name: "preset",          type: "string",  default: "—",       description: '"default" | "sakura" | "autumn" | "snow" | "neon"' },
];

const PRESET_VALUES: Record<string, { petalColor: string; bg: string; gravity: number; petalSize: number; windStrength: number }> = {
  default: { petalColor: "#ffffff", bg: "#111111", gravity: 0.06, petalSize: 8,  windStrength: 0.8 },
  sakura:  { petalColor: "#ffb7c5", bg: "#0a0005", gravity: 0.04, petalSize: 10, windStrength: 0.8 },
  autumn:  { petalColor: "#ff6633", bg: "#111111", gravity: 0.08, petalSize: 8,  windStrength: 1.2 },
  snow:    { petalColor: "#e8f0ff", bg: "#0a0a0a", gravity: 0.035,petalSize: 5,  windStrength: 0.8 },
  neon:    { petalColor: "#00ffcc", bg: "#000a05", gravity: 0.06, petalSize: 8,  windStrength: 0.8 },
};

function SakuraBlossomPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [petalColor, setPetalColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [petalCount, setPetalCount] = useState(80);
  const [petalSize, setPetalSize] = useState(8);
  const [gravity, setGravity] = useState(0.06);
  const [wind, setWind] = useState(0.8);
  const [gusts, setGusts] = useState(true);
  const [accumulation, setAccumulation] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setPetalColor(v.petalColor);
    setBg(v.bg);
    setGravity(v.gravity);
    setPetalSize(v.petalSize);
    setWind(v.windStrength);
  }

  const code = [
    `import { SakuraBlossom } from 'own-the-canvas';`,
    ``,
    `<SakuraBlossom`,
    `  preset="${preset}"`,
    `  petalColor="${petalColor}"`,
    `  backgroundColor="${bg}"`,
    `  petalCount={${petalCount}}`,
    `  petalSize={${petalSize}}`,
    `  gravity={${gravity}}`,
    `  windStrength={${wind}}`,
    `  windGusts={${gusts}}`,
    `  showAccumulation={${accumulation}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <SakuraBlossom
        preset={preset}
        petalColor={petalColor}
        backgroundColor={bg}
        petalCount={petalCount}
        petalSize={petalSize}
        gravity={gravity}
        windStrength={wind}
        windGusts={gusts}
        showAccumulation={accumulation}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Petals drift on the wind" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "sakura", "autumn", "snow", "neon"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Petal color" value={petalColor} onChange={setPetalColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Wind gusts" value={gusts} onChange={setGusts} />
        <PToggle label="Accumulation" value={accumulation} onChange={setAccumulation} />
      </div>
      <div>
        <PSlider label="Petal count" value={petalCount} min={10} max={200} step={10} onChange={setPetalCount} />
        <PSlider label="Petal size" value={petalSize} min={3} max={20} step={1} onChange={setPetalSize} />
        <PSlider label="Gravity" value={gravity} min={0.01} max={0.3} step={0.01} onChange={setGravity} />
        <PSlider label="Wind strength" value={wind} min={0} max={4} step={0.1} onChange={setWind} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SakuraBlossomPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="SakuraBlossom"
      lead="Cherry blossom petals with realistic physics — organic tumbling, wind gusts, and a gentle accumulation of petals at the ground."
    >
      <SakuraBlossomPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
