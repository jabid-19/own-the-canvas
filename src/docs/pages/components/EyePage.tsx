import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Eye } from "../../../components/Eye";

const PROPS = [
  { name: "irisColor",       type: "string",  default: '"#4a7c59"', description: "Outer iris color." },
  { name: "irisInnerColor",  type: "string",  default: '"#c8963e"', description: "Color of the ring around the pupil." },
  { name: "scleraColor",     type: "string",  default: '"#f1ebe4"', description: "White of the eye." },
  { name: "skinColor",       type: "string",  default: '"#c99a7e"', description: "Eyelid and face skin color." },
  { name: "lashColor",       type: "string",  default: '"#1a1210"', description: "Lash and lash-line color." },
  { name: "backgroundColor", type: "string",  default: '"#0c0807"', description: 'Canvas background. Use "transparent" to let the face fade into the page.' },
  { name: "pupilShape",      type: "string",  default: '"round"',   description: '"round" | "slit"' },
  { name: "pupilSize",       type: "number",  default: "0.38",      description: "Resting pupil size as a fraction of the iris (0.08–0.85)." },
  { name: "eyeSize",         type: "number",  default: "1",         description: "Eye scale relative to the canvas (0.2–1.5)." },
  { name: "followCursor",    type: "boolean", default: "true",      description: "Gaze follows the cursor anywhere on the page and the pupil narrows as it nears. Off: the eye looks around on its own." },
  { name: "blinkInterval",   type: "number",  default: "4000",      description: "Average ms between blinks. 0 = only blink when clicked." },
  { name: "showLashes",      type: "boolean", default: "true",      description: "Draw eyelashes." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "ocean" | "amber" | "violet" | "serpent" | "monochrome"' },
];

type PV = { iris: string; inner: string; sclera: string; skin: string; lash: string; bg: string; shape: "round" | "slit"; pupil: number; lashes: boolean };
const PRESET_VALUES: Record<string, PV> = {
  default:    { iris: "#4a7c59", inner: "#c8963e", sclera: "#f1ebe4", skin: "#c99a7e", lash: "#1a1210", bg: "#0c0807", shape: "round", pupil: 0.38, lashes: true },
  ocean:      { iris: "#3a78b5", inner: "#a7c8d8", sclera: "#f3eee9", skin: "#e0b598", lash: "#2a1c14", bg: "#05090f", shape: "round", pupil: 0.38, lashes: true },
  amber:      { iris: "#a8661c", inner: "#f2c14e", sclera: "#efe6dc", skin: "#8a5a3f", lash: "#120a06", bg: "#0a0604", shape: "round", pupil: 0.38, lashes: true },
  violet:     { iris: "#6f52ad", inner: "#e2bdf2", sclera: "#f3edf0", skin: "#d8a891", lash: "#1c1018", bg: "#0b0710", shape: "round", pupil: 0.38, lashes: true },
  serpent:    { iris: "#8fae2a", inner: "#f0e06a", sclera: "#d6cf9a", skin: "#3e5a36", lash: "#0f1a0f", bg: "#040703", shape: "slit", pupil: 0.5, lashes: false },
  monochrome: { iris: "#6b7280", inner: "#d1d5db", sclera: "#f3f4f6", skin: "#9ca3af", lash: "#111111", bg: "#111111", shape: "round", pupil: 0.38, lashes: true },
};

function EyePlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [iris, setIris] = useState(d.iris);
  const [inner, setInner] = useState(d.inner);
  const [sclera, setSclera] = useState(d.sclera);
  const [skin, setSkin] = useState(d.skin);
  const [lash, setLash] = useState(d.lash);
  const [bg, setBg] = useState(d.bg);
  const [shape, setShape] = useState<"round" | "slit">(d.shape);
  const [pupil, setPupil] = useState(d.pupil);
  const [eyeSize, setEyeSize] = useState(1);
  const [blinkInterval, setBlinkInterval] = useState(4000);
  const [followCursor, setFollowCursor] = useState(true);
  const [lashes, setLashes] = useState(d.lashes);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? d;
    setIris(v.iris); setInner(v.inner); setSclera(v.sclera); setSkin(v.skin);
    setLash(v.lash); setBg(v.bg); setShape(v.shape); setPupil(v.pupil); setLashes(v.lashes);
  }

  const code = [
    `import { Eye } from 'own-the-canvas';`,
    ``,
    `<Eye`,
    `  preset="${preset}"`,
    `  irisColor="${iris}"`,
    `  irisInnerColor="${inner}"`,
    `  scleraColor="${sclera}"`,
    `  skinColor="${skin}"`,
    `  lashColor="${lash}"`,
    `  backgroundColor="${bg}"`,
    `  pupilShape="${shape}"`,
    `  pupilSize={${pupil}}`,
    eyeSize !== 1 ? `  eyeSize={${eyeSize}}` : null,
    blinkInterval !== 4000 ? `  blinkInterval={${blinkInterval}}` : null,
    followCursor ? null : `  followCursor={false}`,
    lashes ? null : `  showLashes={false}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Eye preset={preset} irisColor={iris} irisInnerColor={inner} scleraColor={sclera}
        skinColor={skin} lashColor={lash} backgroundColor={bg} pupilShape={shape}
        pupilSize={pupil} eyeSize={eyeSize} blinkInterval={blinkInterval}
        followCursor={followCursor} showLashes={lashes} width="100%" height="100%" />
      <PLiveLabel text={followCursor ? "Move the cursor · click to blink" : "Click to blink"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Iris" value={iris} onChange={setIris} />
        <PColor label="Iris inner" value={inner} onChange={setInner} />
        <PColor label="Sclera" value={sclera} onChange={setSclera} />
        <PColor label="Skin" value={skin} onChange={setSkin} />
        <PColor label="Lashes" value={lash} onChange={setLash} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSel label="Pupil shape" value={shape} options={["round", "slit"]} onChange={(v) => setShape(v as "round" | "slit")} />
        <PSlider label="Pupil size" value={pupil} min={0.1} max={0.8} step={0.02} onChange={setPupil} />
        <PSlider label="Eye size" value={eyeSize} min={0.3} max={1.4} step={0.05} onChange={setEyeSize} />
        <PSlider label="Blink interval" value={blinkInterval} min={0} max={10000} step={250} onChange={setBlinkInterval} />
        <PDivider />
        <PToggle label="Follow cursor" value={followCursor} onChange={setFollowCursor} />
        <PToggle label="Lashes" value={lashes} onChange={setLashes} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function EyePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Eye"
      lead="A single living eye, painted like a chiaroscuro portrait. Fibrous iris, a pupil that breathes and narrows as your cursor comes near, saccadic glances, lids that ride with the gaze, lashes that sweep through every blink, and a wet window reflection on the cornea. Click to make it blink."
    >
      <EyePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
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
