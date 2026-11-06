import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Sunflowers } from "../../../components/Sunflowers";

const PROPS = [
  { name: "count",           type: "number",  default: "5",         description: "Number of sunflowers." },
  { name: "petalColor",      type: "string",  default: '"#f6b51e"', description: "Petals." },
  { name: "centerColor",     type: "string",  default: '"#4a2a12"', description: "Seed disc." },
  { name: "stemColor",       type: "string",  default: '"#4f7a2a"', description: "Stems and leaves." },
  { name: "backgroundColor", type: "string",  default: '"#f0a868"', description: 'Sky at the sun\'s height. Use "transparent" to drop the scene.' },
  { name: "wind",            type: "number",  default: "1",         description: "Wind strength." },
  { name: "followCursor",    type: "boolean", default: "true",      description: "Your cursor is the sun and the heads turn to face it. Off: the sun crosses the sky by itself." },
  { name: "interactive",     type: "boolean", default: "true",      description: "The cursor's wake pushes stems; tap a head to shake petals loose." },
  { name: "overlay",         type: "boolean", default: "false",     description: "Fixed full-viewport, click-through layer over the page." },
  { name: "zIndex",          type: "number",  default: "10",        description: "Overlay stacking order." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "dawn" | "dusk" | "velvet" | "moonlight" | "monochrome"' },
];

type PV = { petal: string; center: string; stem: string; bg: string };
const PRESET_VALUES: Record<string, PV> = {
  default:    { petal: "#f6b51e", center: "#4a2a12", stem: "#4f7a2a", bg: "#f0a868" },
  dawn:       { petal: "#ffd34d", center: "#5a3a1a", stem: "#5d8a3a", bg: "#f6c2b0" },
  dusk:       { petal: "#f08a1c", center: "#2e1a0e", stem: "#3a5a26", bg: "#a8577a" },
  velvet:     { petal: "#a8323a", center: "#2a140e", stem: "#46632a", bg: "#e8a070" },
  moonlight:  { petal: "#d8d080", center: "#2a2420", stem: "#2e4a3a", bg: "#1c2a4a" },
  monochrome: { petal: "#d1d5db", center: "#374151", stem: "#6b7280", bg: "#111111" },
};

function SunflowersPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [petal, setPetal] = useState(d.petal);
  const [center, setCenter] = useState(d.center);
  const [stem, setStem] = useState(d.stem);
  const [bg, setBg] = useState(d.bg);
  const [count, setCount] = useState(5);
  const [wind, setWind] = useState(1);
  const [followCursor, setFollowCursor] = useState(true);
  const [interactive, setInteractive] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const n = PRESET_VALUES[p] ?? d;
    setPetal(n.petal); setCenter(n.center); setStem(n.stem); setBg(n.bg);
  }

  const code = [
    `import { Sunflowers } from 'own-the-canvas';`,
    ``,
    `<Sunflowers`,
    `  preset="${preset}"`,
    `  count={${count}}`,
    `  petalColor="${petal}"`,
    `  centerColor="${center}"`,
    `  stemColor="${stem}"`,
    `  backgroundColor="${bg}"`,
    wind !== 1 ? `  wind={${wind}}` : null,
    followCursor ? null : `  followCursor={false}`,
    interactive ? null : `  interactive={false}`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Sunflowers preset={preset} count={count} petalColor={petal} centerColor={center} stemColor={stem} backgroundColor={bg}
        wind={wind} followCursor={followCursor} interactive={interactive} width="100%" height="100%" />
      <PLiveLabel text={followCursor ? "You are the sun · tap a flower head" : "Tap a flower head"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Petals" value={petal} onChange={setPetal} />
        <PColor label="Seeds" value={center} onChange={setCenter} />
        <PColor label="Stems" value={stem} onChange={setStem} />
        <PColor label="Sky" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Count" value={count} min={1} max={12} step={1} onChange={setCount} />
        <PSlider label="Wind" value={wind} min={0} max={3} step={0.1} onChange={setWind} />
        <PDivider />
        <PToggle label="Cursor is the sun" value={followCursor} onChange={setFollowCursor} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SunflowersPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Sunflowers"
      lead="A row of sunflowers at golden hour. Your cursor is the sun: each heavy head turns to face it on a lagging, springy follow, foreshortened in 3D, with seeds packed in a golden-angle Fibonacci spiral. Stems sway in gusts and in your cursor's wake; tap a head to shake loose a few petals."
    >
      <SunflowersPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The code block above updates live as you adjust the controls. Add <code>overlay</code> to grow the row along the
          bottom of the viewport so the flowers follow the cursor across the whole page.
        </p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
