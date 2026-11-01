import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { SunbeamDust } from "../../../components/SunbeamDust";

const PROPS = [
  { name: "color",           type: "string",  default: '"#ffcf87"',  description: "Light and dust color." },
  { name: "backgroundColor", type: "string",  default: '"#140d07"',  description: "Background color (ignored in overlay mode)." },
  { name: "beams",           type: "number",  default: "4",          description: "Window panes, one light shaft each." },
  { name: "angle",           type: "number",  default: "24",         description: "Light angle from vertical in degrees; positive slants right." },
  { name: "intensity",       type: "number",  default: "1",          description: "Shaft brightness multiplier." },
  { name: "dustCount",       type: "number",  default: "320",        description: "Number of dust motes." },
  { name: "dustSize",        type: "number",  default: "1",          description: "Dust mote size multiplier." },
  { name: "speed",           type: "number",  default: "1",          description: "Air drift speed multiplier." },
  { name: "windowX",         type: "number",  default: "0.35",       description: "Window center along the top edge, 0..1." },
  { name: "windowWidth",     type: "number",  default: "0.42",       description: "Window width as a fraction of canvas width." },
  { name: "interactive",     type: "boolean", default: "true",       description: "Cursor stirs the dust into swirls." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "golden-hour" | "chapel" | "morning" | "dusk" | "monochrome"' },
  { name: "overlay",         type: "boolean", default: "false",      description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex",          type: "number",  default: "10",         description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, { color: string; bg: string; angle: number; intensity: number; beams: number }> = {
  default:       { color: "#ffcf87", bg: "#140d07", angle: 24, intensity: 1,   beams: 4 },
  monochrome: { color: "#ffffff", bg: "#111111", angle: 24, intensity: 1,   beams: 4 },
  "golden-hour": { color: "#ffcf87", bg: "#140d07", angle: 32, intensity: 1.1, beams: 4 },
  chapel:        { color: "#fff1d6", bg: "#0b0a0c", angle: 12, intensity: 1.2, beams: 3 },
  morning:       { color: "#e0f2fe", bg: "#0a1016", angle: 22, intensity: 1,   beams: 4 },
  dusk:          { color: "#fda4af", bg: "#120a12", angle: 38, intensity: 0.9, beams: 4 },
};

function SunbeamDustPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("golden-hour");
  const v0 = PRESET_VALUES["golden-hour"];
  const [color, setColor] = useState(v0.color);
  const [bg, setBg] = useState(v0.bg);
  const [angle, setAngle] = useState(v0.angle);
  const [intensity, setIntensity] = useState(v0.intensity);
  const [beams, setBeams] = useState(v0.beams);
  const [dust, setDust] = useState(320);
  const [interactive, setInteractive] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setColor(v.color); setBg(v.bg); setAngle(v.angle); setIntensity(v.intensity); setBeams(v.beams);
  }

  const code = [
    `import { SunbeamDust } from 'own-the-canvas';`,
    ``,
    `<SunbeamDust`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  beams={${beams}}`,
    `  angle={${angle}}`,
    `  intensity={${intensity}}`,
    `  dustCount={${dust}}`,
    `  interactive={${interactive}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <SunbeamDust
        preset={preset}
        color={color}
        backgroundColor={bg}
        beams={beams}
        angle={angle}
        intensity={intensity}
        dustCount={dust}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Move through the light to stir the dust" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Light color" value={color} onChange={setColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Panes" value={beams} min={1} max={8} step={1} onChange={setBeams} />
        <PSlider label="Angle (°)" value={angle} min={-45} max={45} step={1} onChange={setAngle} />
        <PSlider label="Intensity" value={intensity} min={0.2} max={2} step={0.05} onChange={setIntensity} />
        <PSlider label="Dust" value={dust} min={0} max={1000} step={20} onChange={setDust} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SunbeamDustPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="SunbeamDust"
      lead="Shafts of light through a window with dust drifting in the air. Motes only sparkle where the light catches them, and moving the cursor through a beam stirs them into slow swirls."
    >
      <SunbeamDustPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How it works</h2>
        <p className="page-p">
          Dust drifts on a slow, divergence-free air current. Each frame every mote is tested against the light shafts;
          its brightness is how much light reaches it (the Tyndall effect), so the same dust is invisible in shadow and
          glitters in the beam. Clouds passing the sun make the shafts breathe.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
