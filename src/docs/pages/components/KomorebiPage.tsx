import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Komorebi } from "../../../components/Komorebi";

const PROPS = [
  { name: "lightColor",      type: "string",  default: '"#ffd9a0"', description: "Sunlight." },
  { name: "shadowColor",     type: "string",  default: '"#3a4a3a"', description: "Leaf shade tint." },
  { name: "backgroundColor", type: "string",  default: '"#c9b49a"', description: 'The wall the light falls on. Use "transparent" to drop it.' },
  { name: "density",         type: "number",  default: "1",         description: "Light spot density multiplier." },
  { name: "wind",            type: "number",  default: "1",         description: "Canopy sway strength." },
  { name: "sunHeight",       type: "number",  default: "0.7",       description: "0..1. Lower suns stretch the spots into ovals." },
  { name: "interactive",     type: "boolean", default: "true",      description: "The cursor is a breeze that stirs the leaves; a tap sends a gust rippling out." },
  { name: "overlay",         type: "boolean", default: "false",     description: "Fixed full-viewport, click-through layer that dapples the whole page." },
  { name: "zIndex",          type: "number",  default: "10",        description: "Overlay stacking order." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "morning" | "forest" | "golden-hour" | "moonlight" | "monochrome"' },
];

type PV = { light: string; shadow: string; bg: string; sun: number };
const PRESET_VALUES: Record<string, PV> = {
  default:       { light: "#ffd9a0", shadow: "#3a4a3a", bg: "#c9b49a", sun: 0.7 },
  morning:       { light: "#fff2d6", shadow: "#5a6a78", bg: "#d8d4cc", sun: 0.5 },
  forest:        { light: "#e6f5a8", shadow: "#1e3a22", bg: "#4a5e40", sun: 0.85 },
  "golden-hour": { light: "#ffb060", shadow: "#4a2a2a", bg: "#b88a6a", sun: 0.3 },
  moonlight:     { light: "#c8d8ff", shadow: "#0a1020", bg: "#28324a", sun: 0.6 },
  monochrome:    { light: "#ffffff", shadow: "#374151", bg: "#111111", sun: 0.7 },
};

function KomorebiPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [light, setLight] = useState(d.light);
  const [shadow, setShadow] = useState(d.shadow);
  const [bg, setBg] = useState(d.bg);
  const [sun, setSun] = useState(d.sun);
  const [density, setDensity] = useState(1);
  const [wind, setWind] = useState(1);
  const [interactive, setInteractive] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const n = PRESET_VALUES[p] ?? d;
    setLight(n.light); setShadow(n.shadow); setBg(n.bg); setSun(n.sun);
  }

  const code = [
    `import { Komorebi } from 'own-the-canvas';`,
    ``,
    `<Komorebi`,
    `  preset="${preset}"`,
    `  lightColor="${light}"`,
    `  shadowColor="${shadow}"`,
    `  backgroundColor="${bg}"`,
    `  sunHeight={${sun}}`,
    density !== 1 ? `  density={${density}}` : null,
    wind !== 1 ? `  wind={${wind}}` : null,
    interactive ? null : `  interactive={false}`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Komorebi preset={preset} lightColor={light} shadowColor={shadow} backgroundColor={bg} sunHeight={sun}
        density={density} wind={wind} interactive={interactive} width="100%" height="100%" />
      <PLiveLabel text={interactive ? "Move to stir the leaves · tap for a gust" : undefined} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Light" value={light} onChange={setLight} />
        <PColor label="Shade" value={shadow} onChange={setShadow} />
        <PColor label="Wall" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Sun height" value={sun} min={0.1} max={1} step={0.05} onChange={setSun} />
        <PSlider label="Density" value={density} min={0.2} max={3} step={0.1} onChange={setDensity} />
        <PSlider label="Wind" value={wind} min={0} max={3} step={0.1} onChange={setWind} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function KomorebiPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Komorebi"
      lead="木漏れ日: sunlight filtering through leaves onto a wall. Every gap in the canopy is a pinhole camera, so the light spots are little images of the sun, stretched into ovals as it gets lower. They open, close and drift as the unseen branches sway, under the soft shadows of nearer leaves. Your cursor is a breeze; a tap sends a gust rippling outward."
    >
      <KomorebiPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The code block above updates live as you adjust the controls. Add <code>overlay</code> and the dappled light
          falls across your whole page, click-through, like sitting under a tree.
        </p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
