import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { KelpForest } from "../../../components/KelpForest";

const PROPS = [
  { name: "kelpCount",       type: "number",  default: "9",          description: "Number of kelp stalks." },
  { name: "fishCount",       type: "number",  default: "16",         description: "Number of fish, in two loose schools." },
  { name: "kelpColor",       type: "string",  default: '"#8a7a2c"',  description: "Kelp color; far stalks fade toward the water." },
  { name: "fishColor",       type: "string",  default: '"#e2e8f0"',  description: "Fish and bubble color." },
  { name: "backgroundColor", type: "string",  default: '"#052637"',  description: "Water color (ignored in overlay mode)." },
  { name: "current",         type: "number",  default: "1",          description: "Ocean current strength; negative flows left." },
  { name: "bubbles",         type: "boolean", default: "true",       description: "Rising bubbles." },
  { name: "lightRays",       type: "boolean", default: "true",       description: "Light rays from the surface." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Cursor pushes the water: kelp bends, fish dart away." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "pacific" | "tropical" | "midnight" | "golden" | "monochrome"' },
  { name: "overlay",         type: "boolean", default: "false",      description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex",          type: "number",  default: "10",         description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, { kelp: string; fish: string; bg: string; current: number }> = {
  default:  { kelp: "#8a7a2c", fish: "#e2e8f0", bg: "#052637", current: 1 },
  monochrome: { kelp: "#6b7280", fish: "#ffffff", bg: "#111111", current: 1 },
  pacific:  { kelp: "#8a7a2c", fish: "#e2e8f0", bg: "#052637", current: 1 },
  tropical: { kelp: "#2fa36b", fish: "#ffb36b", bg: "#04354a", current: 1 },
  midnight: { kelp: "#2b5a6b", fish: "#9be7ff", bg: "#020a14", current: 0.7 },
  golden:   { kelp: "#b8902e", fish: "#fff1c1", bg: "#141006", current: 1 },
};

function KelpForestPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("pacific");
  const v0 = PRESET_VALUES.pacific;
  const [kelp, setKelp] = useState(v0.kelp);
  const [fish, setFish] = useState(v0.fish);
  const [bg, setBg] = useState(v0.bg);
  const [current, setCurrent] = useState(v0.current);
  const [kelpCount, setKelpCount] = useState(9);
  const [fishCount, setFishCount] = useState(16);
  const [bubbles, setBubbles] = useState(true);
  const [rays, setRays] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setKelp(v.kelp); setFish(v.fish); setBg(v.bg); setCurrent(v.current);
  }

  const code = [
    `import { KelpForest } from 'own-the-canvas';`,
    ``,
    `<KelpForest`,
    `  preset="${preset}"`,
    `  kelpColor="${kelp}"`,
    `  fishColor="${fish}"`,
    `  backgroundColor="${bg}"`,
    `  kelpCount={${kelpCount}}`,
    `  fishCount={${fishCount}}`,
    `  current={${current}}`,
    `  bubbles={${bubbles}}`,
    `  lightRays={${rays}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <KelpForest
        preset={preset}
        kelpColor={kelp}
        fishColor={fish}
        backgroundColor={bg}
        kelpCount={kelpCount}
        fishCount={fishCount}
        current={current}
        bubbles={bubbles}
        lightRays={rays}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Sweep the cursor to push the water" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Kelp color" value={kelp} onChange={setKelp} />
        <PColor label="Fish color" value={fish} onChange={setFish} />
        <PColor label="Water" value={bg} onChange={setBg} />
        <PToggle label="Bubbles" value={bubbles} onChange={setBubbles} />
        <PToggle label="Light rays" value={rays} onChange={setRays} />
      </div>
      <div>
        <PSlider label="Kelp" value={kelpCount} min={1} max={24} step={1} onChange={setKelpCount} />
        <PSlider label="Fish" value={fishCount} min={0} max={50} step={1} onChange={setFishCount} />
        <PSlider label="Current" value={current} min={-2} max={3} step={0.1} onChange={setCurrent} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function KelpForestPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="KelpForest"
      lead="An underwater kelp forest: buoyant stalks sway in the current, two schools of fish wander between them, bubbles rise, and light filters down from the surface. Sweep the cursor to push the water."
    >
      <KelpForestPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How it moves</h2>
        <p className="page-p">
          Each stalk is a rope anchored to the seabed, simulated with position-based dynamics: buoyancy lifts every
          node, the current pushes harder near the top, and segment lengths are re-enforced each step. Your cursor's
          velocity becomes a local water push that bends kelp and sends fish darting.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
