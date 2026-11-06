import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { Owl } from "../../../components/Owl";

const PROPS = [
  { name: "featherColor",    type: "string",  default: '"#6b4a33"', description: "Back, wings and head." },
  { name: "bellyColor",      type: "string",  default: '"#d9bf9a"', description: "Barred chest feathers." },
  { name: "faceColor",       type: "string",  default: '"#c48a52"', description: "Facial disc." },
  { name: "eyeColor",        type: "string",  default: '"#f2a516"', description: "Iris color." },
  { name: "beakColor",       type: "string",  default: '"#3a3330"', description: "Beak; the talons are a tint of it." },
  { name: "branchColor",     type: "string",  default: '"#3b2a1e"', description: "Branch color." },
  { name: "backgroundColor", type: "string",  default: '"#070a12"', description: 'Night sky. Use "transparent" to drop the scene.' },
  { name: "earTufts",        type: "boolean", default: "true",      description: "Feather “horns” on the head." },
  { name: "size",            type: "number",  default: "1",         description: "Owl scale." },
  { name: "followCursor",    type: "boolean", default: "true",      description: "The head turns to follow the cursor and cocks when it goes still. Off: it looks around by itself." },
  { name: "blinkInterval",   type: "number",  default: "5000",      description: "Average ms between blinks. 0 = never." },
  { name: "collide",         type: "boolean", default: "false",     description: "Perch on top of an element marked data-otc-solid instead of a branch." },
  { name: "overlay",         type: "boolean", default: "false",     description: "Fixed full-viewport, click-through layer over the page." },
  { name: "zIndex",          type: "number",  default: "10",        description: "Overlay stacking order." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "tawny" | "snowy" | "barn" | "spirit" | "monochrome"' },
];

type PV = { feather: string; belly: string; face: string; eye: string; beak: string; branch: string; bg: string; tufts: boolean };
const PRESET_VALUES: Record<string, PV> = {
  default:    { feather: "#6b4a33", belly: "#d9bf9a", face: "#c48a52", eye: "#f2a516", beak: "#3a3330", branch: "#3b2a1e", bg: "#070a12", tufts: true },
  tawny:      { feather: "#7f5539", belly: "#cfae86", face: "#b08660", eye: "#3a2416", beak: "#d8c7a8", branch: "#3b2a1e", bg: "#080a0c", tufts: false },
  snowy:      { feather: "#e6e8ec", belly: "#f7f8fa", face: "#f3f4f6", eye: "#f5c518", beak: "#2b2b2b", branch: "#4a4540", bg: "#0a1220", tufts: false },
  barn:       { feather: "#c99a5b", belly: "#f3e9da", face: "#f7f1e8", eye: "#1a120c", beak: "#e8d2b5", branch: "#3d2b1c", bg: "#0b0a10", tufts: false },
  spirit:     { feather: "#3a3f6b", belly: "#8a9ad8", face: "#6c7bc4", eye: "#7af0ff", beak: "#c9d2ff", branch: "#1b1d33", bg: "#03040c", tufts: true },
  monochrome: { feather: "#6b7280", belly: "#d1d5db", face: "#9ca3af", eye: "#e5e7eb", beak: "#374151", branch: "#4b5563", bg: "#111111", tufts: true },
};

function OwlPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [feather, setFeather] = useState(d.feather);
  const [belly, setBelly] = useState(d.belly);
  const [face, setFace] = useState(d.face);
  const [eye, setEye] = useState(d.eye);
  const [bg, setBg] = useState(d.bg);
  const [tufts, setTufts] = useState(d.tufts);
  const [size, setSize] = useState(1);
  const [blinkInterval, setBlinkInterval] = useState(5000);
  const [followCursor, setFollowCursor] = useState(true);
  const [collide, setCollide] = useState(false);
  const v = PRESET_VALUES[preset] ?? d;

  function onPresetChange(p: string) {
    setPreset(p);
    const n = PRESET_VALUES[p] ?? d;
    setFeather(n.feather); setBelly(n.belly); setFace(n.face); setEye(n.eye); setBg(n.bg); setTufts(n.tufts);
  }

  const code = [
    `import { Owl } from 'own-the-canvas';`,
    ``,
    `<Owl`,
    `  preset="${preset}"`,
    `  featherColor="${feather}"`,
    `  bellyColor="${belly}"`,
    `  faceColor="${face}"`,
    `  eyeColor="${eye}"`,
    `  backgroundColor="${bg}"`,
    `  earTufts={${tufts}}`,
    size !== 1 ? `  size={${size}}` : null,
    blinkInterval !== 5000 ? `  blinkInterval={${blinkInterval}}` : null,
    followCursor ? null : `  followCursor={false}`,
    collide ? `  collide` : null,
    `/>`,
    collide ? `\n{/* the owl perches on top of a marked element: */}\n<h2 data-otc-solid>Night shift</h2>` : null,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Owl preset={preset} featherColor={feather} bellyColor={belly} faceColor={face} eyeColor={eye}
        beakColor={v.beak} branchColor={v.branch} backgroundColor={bg} earTufts={tufts} size={size}
        blinkInterval={blinkInterval} followCursor={followCursor} collide={collide} width="100%" height="100%" />
      {collide && <DemoSolid top="78%">Night shift</DemoSolid>}
      <PLiveLabel text={followCursor ? "Move the cursor, then hold still · tap to startle" : "Tap to startle"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Feathers" value={feather} onChange={setFeather} />
        <PColor label="Belly" value={belly} onChange={setBelly} />
        <PColor label="Face" value={face} onChange={setFace} />
        <PColor label="Eyes" value={eye} onChange={setEye} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Size" value={size} min={0.4} max={1.6} step={0.05} onChange={setSize} />
        <PSlider label="Blink interval" value={blinkInterval} min={0} max={12000} step={250} onChange={setBlinkInterval} />
        <PDivider />
        <PToggle label="Ear tufts" value={tufts} onChange={setTufts} />
        <PToggle label="Follow cursor" value={followCursor} onChange={setFollowCursor} />
        <PToggle label="Perch on element (collide)" value={collide} onChange={setCollide} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function OwlPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Owl"
      lead="An owl on its perch. Owls can't move their eyes, so the whole head snaps to follow your cursor; it cocks its head when you hold still, bobs to judge distance when something moves fast, blinks slowly, gets drowsy when ignored and fluffs up when tapped. Turn on collide and it perches on your headline instead."
    >
      <OwlPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The code block above updates live as you adjust the controls. With <code>collide</code>, mark an element with{" "}
          <code>data-otc-solid</code> and the owl sits on its top edge; add <code>overlay</code> to let it perch anywhere on the page.
        </p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
