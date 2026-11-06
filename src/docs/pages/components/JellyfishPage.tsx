import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { Jellyfish } from "../../../components/Jellyfish";

const PROPS = [
  { name: "count",           type: "number",  default: "4",         description: "Number of jellyfish." },
  { name: "bellColor",       type: "string",  default: '"#c9a7e8"', description: "Bell and oral-arm tint." },
  { name: "glowColor",       type: "string",  default: '"#8fd8ff"', description: "Rim light, tentacles and flash." },
  { name: "backgroundColor", type: "string",  default: '"#04122a"', description: 'Water. Use "transparent" to drop the scene.' },
  { name: "tentacleLength",  type: "number",  default: "1",         description: "Tentacle length multiplier." },
  { name: "pulseRate",       type: "number",  default: "1",         description: "Bell pulse speed multiplier." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Jellies turn away from the cursor, which stirs the water; taps make nearby bells flash." },
  { name: "collide",         type: "boolean", default: "false",     description: "Nudge off elements marked data-otc-solid." },
  { name: "overlay",         type: "boolean", default: "false",     description: "Fixed full-viewport, click-through layer over the page." },
  { name: "zIndex",          type: "number",  default: "10",        description: "Overlay stacking order." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "sea-nettle" | "crystal" | "lions-mane" | "ghost" | "monochrome"' },
];

type PV = { bell: string; glow: string; bg: string; len: number; count: number };
const PRESET_VALUES: Record<string, PV> = {
  default:      { bell: "#c9a7e8", glow: "#8fd8ff", bg: "#04122a", len: 1, count: 4 },
  "sea-nettle": { bell: "#f0a050", glow: "#ffcf7a", bg: "#031722", len: 1.6, count: 4 },
  crystal:      { bell: "#b9f3ff", glow: "#5ef0e0", bg: "#010c18", len: 0.8, count: 4 },
  "lions-mane": { bell: "#e2564a", glow: "#ff9a6a", bg: "#0a0714", len: 2, count: 3 },
  ghost:        { bell: "#e8ecf4", glow: "#c6d4ff", bg: "#06070d", len: 1, count: 6 },
  monochrome:   { bell: "#d1d5db", glow: "#ffffff", bg: "#111111", len: 1, count: 4 },
};

function JellyfishPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [bell, setBell] = useState(d.bell);
  const [glow, setGlow] = useState(d.glow);
  const [bg, setBg] = useState(d.bg);
  const [len, setLen] = useState(d.len);
  const [count, setCount] = useState(d.count);
  const [pulseRate, setPulseRate] = useState(1);
  const [interactive, setInteractive] = useState(true);
  const [collide, setCollide] = useState(false);

  function onPresetChange(p: string) {
    setPreset(p);
    const n = PRESET_VALUES[p] ?? d;
    setBell(n.bell); setGlow(n.glow); setBg(n.bg); setLen(n.len); setCount(n.count);
  }

  const code = [
    `import { Jellyfish } from 'own-the-canvas';`,
    ``,
    `<Jellyfish`,
    `  preset="${preset}"`,
    `  count={${count}}`,
    `  bellColor="${bell}"`,
    `  glowColor="${glow}"`,
    `  backgroundColor="${bg}"`,
    `  tentacleLength={${len}}`,
    pulseRate !== 1 ? `  pulseRate={${pulseRate}}` : null,
    interactive ? null : `  interactive={false}`,
    collide ? `  collide` : null,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Jellyfish preset={preset} count={count} bellColor={bell} glowColor={glow} backgroundColor={bg} tentacleLength={len}
        pulseRate={pulseRate} interactive={interactive} collide={collide} width="100%" height="100%" />
      {collide && <DemoSolid>Drift around me</DemoSolid>}
      <PLiveLabel text={interactive ? "Stir the water · tap to make them flash" : undefined} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Bell" value={bell} onChange={setBell} />
        <PColor label="Glow" value={glow} onChange={setGlow} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Count" value={count} min={1} max={12} step={1} onChange={setCount} />
        <PSlider label="Tentacle length" value={len} min={0.3} max={2.5} step={0.1} onChange={setLen} />
        <PSlider label="Pulse rate" value={pulseRate} min={0.3} max={3} step={0.1} onChange={setPulseRate} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Avoid element (collide)" value={collide} onChange={setCollide} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function JellyfishPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Jellyfish"
      lead="Moon jellies in open water. Each bell swims by jet propulsion, a quick squeeze that drives it forward and a slow relax, while verlet tentacles and frilled oral arms trail and swirl in the wake. Your cursor stirs the water and they turn away from it; tap and nearby bells flash."
    >
      <JellyfishPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The code block above updates live as you adjust the controls. With <code>collide</code>, jellies nudge away from
          elements marked <code>data-otc-solid</code>; add <code>overlay</code> to let them drift across the whole page.
        </p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
