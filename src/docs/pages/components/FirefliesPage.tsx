import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { Fireflies } from "../../../components/Fireflies";

const PROPS = [
  { name: "count",           type: "number",  default: "60",         description: "Number of fireflies." },
  { name: "color",           type: "string",  default: '"#d9f99d"',  description: "Glow color." },
  { name: "backgroundColor", type: "string",  default: '"#06100a"',  description: "Background color (ignored in overlay mode)." },
  { name: "size",            type: "number",  default: "2.2",        description: "Core dot radius in px." },
  { name: "glow",            type: "number",  default: "18",         description: "Halo radius in px." },
  { name: "period",          type: "number",  default: "1.6",        description: "Seconds between flashes." },
  { name: "sync",            type: "number",  default: "0.08",       description: "Coupling strength. How fast the flashing falls into unison; 0 = never." },
  { name: "syncRadius",      type: "number",  default: "160",        description: "Fireflies only react to flashes within this distance (px), so sync spreads in waves." },
  { name: "speed",           type: "number",  default: "1",          description: "Flight speed multiplier." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Gather around the cursor; tap to trigger a flash wave." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "summer" | "riverbank" | "blue-ghost" | "ember" | "monochrome"' },
  { name: "overlay",         type: "boolean", default: "false",      description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "collide",         type: "boolean", default: "false",      description: "Fireflies land on elements marked data-otc-solid, blink there, and fly off." },
  { name: "zIndex",          type: "number",  default: "10",         description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, { color: string; bg: string; sync: number; period: number }> = {
  default:      { color: "#d9f99d", bg: "#06100a", sync: 0.08, period: 1.6 },
  monochrome: { color: "#ffffff", bg: "#111111", sync: 0.08, period: 1.6 },
  summer:       { color: "#d9f99d", bg: "#06100a", sync: 0.08, period: 1.6 },
  riverbank:    { color: "#facc15", bg: "#050806", sync: 0.14, period: 1.2 },
  "blue-ghost": { color: "#7dd3fc", bg: "#03070d", sync: 0.04, period: 2.2 },
  ember:        { color: "#fb923c", bg: "#0c0503", sync: 0.1,  period: 1.6 },
};

function FirefliesPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("summer");
  const [color, setColor] = useState(PRESET_VALUES.summer.color);
  const [bg, setBg] = useState(PRESET_VALUES.summer.bg);
  const [count, setCount] = useState(60);
  const [sync, setSync] = useState(0.08);
  const [period, setPeriod] = useState(1.6);
  const [glow, setGlow] = useState(18);
  const [collide, setCollide] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setColor(v.color);
    setBg(v.bg);
    setSync(v.sync);
    setPeriod(v.period);
  }

  const code = [
    `import { Fireflies } from 'own-the-canvas';`,
    ``,
    `<Fireflies`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  count={${count}}`,
    `  sync={${sync}}`,
    `  period={${period}}`,
    `  glow={${glow}}`,
    ...(collide ? [`  collide`] : []),
    `/>`,
    ...(collide ? [``, `{/* fireflies perch on any element marked: */}`, `<h1 data-otc-solid>Your headline here</h1>`] : []),
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <Fireflies
        preset={preset}
        color={color}
        backgroundColor={bg}
        count={count}
        sync={sync}
        period={period}
        glow={glow}
        collide={collide}
        width="100%"
        height="100%"
      />
      {collide && <DemoSolid />}
      <PLiveLabel text="Watch the flashing sync up · tap for a wave" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Glow color" value={color} onChange={setColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Perch on element (collide)" value={collide} onChange={setCollide} />
      </div>
      <div>
        <PSlider label="Count" value={count} min={5} max={200} step={5} onChange={setCount} />
        <PSlider label="Sync strength" value={sync} min={0} max={0.3} step={0.01} onChange={setSync} />
        <PSlider label="Flash period (s)" value={period} min={0.5} max={4} step={0.1} onChange={setPeriod} />
        <PSlider label="Glow" value={glow} min={6} max={40} step={1} onChange={setGlow} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function FirefliesPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Fireflies"
      lead="Glowing fireflies that drift at dusk and slowly fall into synchronized flashing, using the same pulse-coupled oscillator model that explains real firefly swarms. They gather near the cursor and perch on your page's elements."
    >
      <FirefliesPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How the sync works</h2>
        <p className="page-p">
          Each firefly is an oscillator that flashes when its phase reaches 1. A flash nudges nearby fireflies
          forward (Mirollo–Strogatz pulse coupling). Because the nudge is applied on a concave curve, the swarm
          always drifts toward flashing together. Raise <code>sync</code> to converge faster, lower <code>syncRadius</code> for
          rolling waves instead of one big blink.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
