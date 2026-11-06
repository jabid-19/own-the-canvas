import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Candle } from "../../../components/Candle";

const PROPS = [
  { name: "flameColor",      type: "string",  default: '"#ff9a3c"', description: "Outer flame and the light it casts." },
  { name: "coreColor",       type: "string",  default: '"#fff3d1"', description: "White-hot inner flame." },
  { name: "waxColor",        type: "string",  default: '"#efe2cc"', description: "Wax color." },
  { name: "backgroundColor", type: "string",  default: '"#0b0705"', description: 'Room color. Use "transparent" to keep only the candle and its light.' },
  { name: "size",            type: "number",  default: "1",         description: "Candle scale." },
  { name: "candleHeight",    type: "number",  default: "0.6",       description: "Pillar height (0.1–1.2)." },
  { name: "flicker",         type: "number",  default: "1",         description: "How restless the flame is (0–3)." },
  { name: "glowIntensity",   type: "number",  default: "1",         description: "Strength of the light on the room (0–3)." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Cursor drafts bend the flame; click snuffs it (it relights by itself or on the next click)." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "ivory" | "rose" | "obsidian" | "spirit" | "monochrome"' },
];

const PRESET_VALUES: Record<string, { flame: string; core: string; wax: string; bg: string; glow: number }> = {
  default:    { flame: "#ff9a3c", core: "#fff3d1", wax: "#efe2cc", bg: "#0b0705", glow: 1 },
  ivory:      { flame: "#ffb457", core: "#fffaf0", wax: "#f7f1e3", bg: "#100c09", glow: 1 },
  rose:       { flame: "#ff8a5c", core: "#fff0e6", wax: "#e8a7a9", bg: "#0e0608", glow: 1 },
  obsidian:   { flame: "#ffa340", core: "#fff1cc", wax: "#2b2726", bg: "#060505", glow: 1.2 },
  spirit:     { flame: "#4fd1ff", core: "#e8fbff", wax: "#cfd8e6", bg: "#03060c", glow: 1.1 },
  monochrome: { flame: "#e5e7eb", core: "#ffffff", wax: "#9ca3af", bg: "#111111", glow: 1 },
};

function CandlePlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [flame, setFlame] = useState(d.flame);
  const [core, setCore] = useState(d.core);
  const [wax, setWax] = useState(d.wax);
  const [bg, setBg] = useState(d.bg);
  const [glow, setGlow] = useState(d.glow);
  const [size, setSize] = useState(1);
  const [candleHeight, setCandleHeight] = useState(0.6);
  const [flicker, setFlicker] = useState(1);
  const [interactive, setInteractive] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? d;
    setFlame(v.flame); setCore(v.core); setWax(v.wax); setBg(v.bg); setGlow(v.glow);
  }

  const code = [
    `import { Candle } from 'own-the-canvas';`,
    ``,
    `<Candle`,
    `  preset="${preset}"`,
    `  flameColor="${flame}"`,
    `  coreColor="${core}"`,
    `  waxColor="${wax}"`,
    `  backgroundColor="${bg}"`,
    size !== 1 ? `  size={${size}}` : null,
    candleHeight !== 0.6 ? `  candleHeight={${candleHeight}}` : null,
    flicker !== 1 ? `  flicker={${flicker}}` : null,
    glow !== 1 ? `  glowIntensity={${glow}}` : null,
    interactive ? null : `  interactive={false}`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Candle preset={preset} flameColor={flame} coreColor={core} waxColor={wax} backgroundColor={bg}
        size={size} candleHeight={candleHeight} flicker={flicker} glowIntensity={glow}
        interactive={interactive} width="100%" height="100%" />
      <PLiveLabel text={interactive ? "Sweep the cursor past the flame · click to snuff" : "Live preview"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Flame" value={flame} onChange={setFlame} />
        <PColor label="Core" value={core} onChange={setCore} />
        <PColor label="Wax" value={wax} onChange={setWax} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Size" value={size} min={0.4} max={1.8} step={0.05} onChange={setSize} />
        <PSlider label="Candle height" value={candleHeight} min={0.1} max={1.2} step={0.05} onChange={setCandleHeight} />
        <PSlider label="Flicker" value={flicker} min={0} max={3} step={0.1} onChange={setFlicker} />
        <PSlider label="Glow" value={glow} min={0} max={3} step={0.1} onChange={setGlow} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function CandlePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Candle"
      lead="A single pillar candle in a dark room. The flame breathes and flickers, leans into drafts from your cursor with a springy wobble, and lights the molten pool, the translucent wax and the table. Click to snuff it: the wick smoulders and a thread of smoke curls up before it relights."
    >
      <CandlePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
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
