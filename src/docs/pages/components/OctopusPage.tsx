import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { Octopus } from "../../../components/Octopus";

const PROPS = [
  { name: "skinColor",       type: "string",  default: '"#c4553a"', description: "Skin; deepens when excited, blanches when startled." },
  { name: "spotColor",       type: "string",  default: '"#7a2a1c"', description: "Chromatophore rings; they flare when excited." },
  { name: "suckerColor",     type: "string",  default: '"#f2c4a8"', description: "Sucker color." },
  { name: "eyeColor",        type: "string",  default: '"#e8c25a"', description: "Eye color." },
  { name: "inkColor",        type: "string",  default: '"#140b12"', description: "Ink cloud color." },
  { name: "backgroundColor", type: "string",  default: '"#04131c"', description: 'Water color. Use "transparent" to drop the scene.' },
  { name: "size",            type: "number",  default: "1",         description: "Octopus scale." },
  { name: "tentacleLength",  type: "number",  default: "1",         description: "Arm length multiplier." },
  { name: "followCursor",    type: "boolean", default: "true",      description: "Swim toward the cursor and coil the nearest arms around it." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Tap to make it squirt ink and jet away." },
  { name: "collide",         type: "boolean", default: "false",     description: "Arms grab the edges of elements marked data-otc-solid." },
  { name: "overlay",         type: "boolean", default: "false",     description: "Fixed full-viewport, click-through layer over the page." },
  { name: "zIndex",          type: "number",  default: "10",        description: "Overlay stacking order." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "blue-ringed" | "ghost" | "abyss" | "sand" | "monochrome"' },
];

type PV = { skin: string; spot: string; sucker: string; eye: string; ink: string; bg: string };
const PRESET_VALUES: Record<string, PV> = {
  default:       { skin: "#c4553a", spot: "#7a2a1c", sucker: "#f2c4a8", eye: "#e8c25a", ink: "#140b12", bg: "#04131c" },
  "blue-ringed": { skin: "#d9b44a", spot: "#2fb8ff", sucker: "#f3e2b0", eye: "#f0d070", ink: "#0d0a12", bg: "#03121a" },
  ghost:         { skin: "#d8dde6", spot: "#9fb4d8", sucker: "#ffffff", eye: "#b8e6ff", ink: "#1a1f2e", bg: "#020812" },
  abyss:         { skin: "#5b2f7a", spot: "#e05cff", sucker: "#d7b6f0", eye: "#ffcf5a", ink: "#05030a", bg: "#02030a" },
  sand:          { skin: "#b89a72", spot: "#5e4630", sucker: "#efe0c8", eye: "#e2c27a", ink: "#120d08", bg: "#0b0f12" },
  monochrome:    { skin: "#9ca3af", spot: "#4b5563", sucker: "#e5e7eb", eye: "#d1d5db", ink: "#0a0a0a", bg: "#111111" },
};

function OctopusPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [skin, setSkin] = useState(d.skin);
  const [spot, setSpot] = useState(d.spot);
  const [sucker, setSucker] = useState(d.sucker);
  const [eye, setEye] = useState(d.eye);
  const [ink, setInk] = useState(d.ink);
  const [bg, setBg] = useState(d.bg);
  const [size, setSize] = useState(1);
  const [tentacleLength, setTentacleLength] = useState(1);
  const [followCursor, setFollowCursor] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [collide, setCollide] = useState(false);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? d;
    setSkin(v.skin); setSpot(v.spot); setSucker(v.sucker); setEye(v.eye); setInk(v.ink); setBg(v.bg);
  }

  const code = [
    `import { Octopus } from 'own-the-canvas';`,
    ``,
    `<Octopus`,
    `  preset="${preset}"`,
    `  skinColor="${skin}"`,
    `  spotColor="${spot}"`,
    `  suckerColor="${sucker}"`,
    `  eyeColor="${eye}"`,
    `  inkColor="${ink}"`,
    `  backgroundColor="${bg}"`,
    size !== 1 ? `  size={${size}}` : null,
    tentacleLength !== 1 ? `  tentacleLength={${tentacleLength}}` : null,
    followCursor ? null : `  followCursor={false}`,
    interactive ? null : `  interactive={false}`,
    collide ? `  collide` : null,
    `/>`,
    collide ? `\n{/* arms grab the edges of marked elements: */}\n<div data-otc-solid>Deep dive</div>` : null,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Octopus preset={preset} skinColor={skin} spotColor={spot} suckerColor={sucker} eyeColor={eye} inkColor={ink}
        backgroundColor={bg} size={size} tentacleLength={tentacleLength} followCursor={followCursor}
        interactive={interactive} collide={collide} width="100%" height="100%" />
      {collide && <DemoSolid top="68%">Deep dive</DemoSolid>}
      <PLiveLabel text={interactive ? "Bring the cursor close · tap for ink" : "Live preview"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Skin" value={skin} onChange={setSkin} />
        <PColor label="Spots" value={spot} onChange={setSpot} />
        <PColor label="Suckers" value={sucker} onChange={setSucker} />
        <PColor label="Eyes" value={eye} onChange={setEye} />
        <PColor label="Ink" value={ink} onChange={setInk} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Size" value={size} min={0.4} max={1.8} step={0.05} onChange={setSize} />
        <PSlider label="Arm length" value={tentacleLength} min={0.4} max={1.8} step={0.05} onChange={setTentacleLength} />
        <PDivider />
        <PToggle label="Follow cursor" value={followCursor} onChange={setFollowCursor} />
        <PToggle label="Ink on tap" value={interactive} onChange={setInteractive} />
        <PToggle label="Grab elements (collide)" value={collide} onChange={setCollide} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function OctopusPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Octopus"
      lead="An octopus drifting in deep water. Eight arms ripple and curl; the nearest reach out and coil around your cursor, and with collide they latch onto your page elements and pull the body along. It swims in jet pulses, its pupils stay level however it turns, and a tap makes it blanch, squirt ink and dart away."
    >
      <OctopusPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The code block above updates live as you adjust the controls. With <code>collide</code>, arms grip any element marked{" "}
          <code>data-otc-solid</code>; combine with <code>overlay</code> to let it crawl over the whole page.
        </p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
