import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { PaperLanterns } from "../../../components/PaperLanterns";

const PROPS = [
  { name: "count",           type: "number",  default: "22",         description: "Max lanterns aloft." },
  { name: "color",           type: "string",  default: '"#ff8a3d"',  description: "Paper color." },
  { name: "glowColor",       type: "string",  default: '"#ffd27a"',  description: "Flame and halo color." },
  { name: "backgroundColor", type: "string",  default: '"#0b0612"',  description: "Background color (ignored in overlay mode)." },
  { name: "size",            type: "number",  default: "34",         description: "Size of the nearest lanterns in px." },
  { name: "riseSpeed",       type: "number",  default: "1",          description: "Rise speed multiplier." },
  { name: "wind",            type: "number",  default: "0.3",        description: "Horizontal drift; negative drifts left." },
  { name: "autoRelease",     type: "boolean", default: "true",       description: "Keep releasing lanterns from below." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Tap to release a lantern." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "festival" | "lotus" | "moon" | "jade" | "monochrome"' },
  { name: "overlay",         type: "boolean", default: "false",      description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "collide",         type: "boolean", default: "false",      description: "Tapping an element marked data-otc-solid releases a lantern from its top edge." },
  { name: "zIndex",          type: "number",  default: "10",         description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, { color: string; glow: string; bg: string }> = {
  default:  { color: "#ff8a3d", glow: "#ffd27a", bg: "#0b0612" },
  monochrome: { color: "#d1d5db", glow: "#ffffff", bg: "#111111" },
  festival: { color: "#ff8a3d", glow: "#ffd27a", bg: "#0b0612" },
  lotus:    { color: "#ff9eb5", glow: "#ffe1a8", bg: "#0a0710" },
  moon:     { color: "#f3e8d0", glow: "#fff3c4", bg: "#070b16" },
  jade:     { color: "#7ee0b0", glow: "#e6ffb3", bg: "#04110c" },
};

function PaperLanternsPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("festival");
  const v0 = PRESET_VALUES.festival;
  const [color, setColor] = useState(v0.color);
  const [glow, setGlow] = useState(v0.glow);
  const [bg, setBg] = useState(v0.bg);
  const [count, setCount] = useState(22);
  const [rise, setRise] = useState(1);
  const [wind, setWind] = useState(0.3);
  const [collide, setCollide] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setColor(v.color); setGlow(v.glow); setBg(v.bg);
  }

  const code = [
    `import { PaperLanterns } from 'own-the-canvas';`,
    ``,
    `<PaperLanterns`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  glowColor="${glow}"`,
    `  backgroundColor="${bg}"`,
    `  count={${count}}`,
    `  riseSpeed={${rise}}`,
    `  wind={${wind}}`,
    ...(collide ? [`  collide`] : []),
    `/>`,
    ...(collide ? [``, `{/* tapping a marked element releases a lantern from it: */}`, `<button data-otc-solid>Make a wish</button>`] : []),
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <PaperLanterns
        preset={preset}
        color={color}
        glowColor={glow}
        backgroundColor={bg}
        count={count}
        riseSpeed={rise}
        wind={wind}
        collide={collide}
        width="100%"
        height="100%"
      />
      {collide && <DemoSolid top="72%">Tap me: make a wish</DemoSolid>}
      <PLiveLabel text="Tap anywhere to release a lantern" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Paper color" value={color} onChange={setColor} />
        <PColor label="Glow color" value={glow} onChange={setGlow} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Release from element (collide)" value={collide} onChange={setCollide} />
      </div>
      <div>
        <PSlider label="Count" value={count} min={0} max={60} step={1} onChange={setCount} />
        <PSlider label="Rise speed" value={rise} min={0.3} max={3} step={0.1} onChange={setRise} />
        <PSlider label="Wind" value={wind} min={-1.5} max={1.5} step={0.05} onChange={setWind} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function PaperLanternsPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="PaperLanterns"
      lead="Glowing sky lanterns rising into the night with depth, sway, and a warm flicker. Tap to release your own; with collide on, tapping a button sends a lantern up from it."
    >
      <PaperLanternsPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          Lanterns rise against drag to a terminal speed that depends on their depth: near ones are large, bright, and
          quick; far ones small, dim, and slow, and they shrink as they climb away. Pair <code>overlay</code> with{" "}
          <code>collide</code> and mark a call-to-action with <code>data-otc-solid</code>: each click lifts a lantern off it.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
