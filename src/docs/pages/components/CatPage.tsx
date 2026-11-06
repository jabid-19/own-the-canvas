import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { Cat } from "../../../components/Cat";

const PROPS = [
  { name: "furColor",        type: "string",  default: '"#d9822b"', description: "Main coat." },
  { name: "stripeColor",     type: "string",  default: '"#8f4a16"', description: "Tabby stripes, tail bands and tail tip." },
  { name: "bellyColor",      type: "string",  default: '"#f4dcc0"', description: "Chest, muzzle and paws." },
  { name: "eyeColor",        type: "string",  default: '"#9cc23a"', description: "Iris, seen when it opens an eye." },
  { name: "cushionColor",    type: "string",  default: '"#7a2f3d"', description: "Cushion." },
  { name: "backgroundColor", type: "string",  default: '"#140f16"', description: 'Room. Use "transparent" to drop the scene.' },
  { name: "size",            type: "number",  default: "1",         description: "Cat scale." },
  { name: "followCursor",    type: "boolean", default: "true",      description: "Ears flick at nearby movement and an eye cracks open to watch the cursor." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Hover slowly to pet it (purrs and kneads); tap to startle it awake." },
  { name: "collide",         type: "boolean", default: "false",     description: "Nap on top of an element marked data-otc-solid instead of a cushion." },
  { name: "overlay",         type: "boolean", default: "false",     description: "Fixed full-viewport, click-through layer over the page." },
  { name: "zIndex",          type: "number",  default: "10",        description: "Overlay stacking order." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "tuxedo" | "siamese" | "grey" | "midnight" | "monochrome"' },
];

type PV = { fur: string; stripe: string; belly: string; eye: string; cushion: string; bg: string };
const PRESET_VALUES: Record<string, PV> = {
  default:    { fur: "#d9822b", stripe: "#8f4a16", belly: "#f4dcc0", eye: "#9cc23a", cushion: "#7a2f3d", bg: "#140f16" },
  tuxedo:     { fur: "#24232a", stripe: "#1a191f", belly: "#f1efea", eye: "#e3b23c", cushion: "#2f5d62", bg: "#0e1013" },
  siamese:    { fur: "#eadcc6", stripe: "#6b4a37", belly: "#f7efe2", eye: "#4aa3e0", cushion: "#5a3f6b", bg: "#100d14" },
  grey:       { fur: "#8a8f99", stripe: "#555a64", belly: "#cfd2d8", eye: "#d9a73a", cushion: "#8a5a3c", bg: "#0f1115" },
  midnight:   { fur: "#18171c", stripe: "#0d0c10", belly: "#2c2a33", eye: "#f1c232", cushion: "#2d4a63", bg: "#06070c" },
  monochrome: { fur: "#9ca3af", stripe: "#6b7280", belly: "#e5e7eb", eye: "#e5e7eb", cushion: "#4b5563", bg: "#111111" },
};

function CatPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [fur, setFur] = useState(d.fur);
  const [stripe, setStripe] = useState(d.stripe);
  const [belly, setBelly] = useState(d.belly);
  const [eye, setEye] = useState(d.eye);
  const [cushion, setCushion] = useState(d.cushion);
  const [bg, setBg] = useState(d.bg);
  const [size, setSize] = useState(1);
  const [followCursor, setFollowCursor] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [collide, setCollide] = useState(false);

  function onPresetChange(p: string) {
    setPreset(p);
    const n = PRESET_VALUES[p] ?? d;
    setFur(n.fur); setStripe(n.stripe); setBelly(n.belly); setEye(n.eye); setCushion(n.cushion); setBg(n.bg);
  }

  const code = [
    `import { Cat } from 'own-the-canvas';`,
    ``,
    `<Cat`,
    `  preset="${preset}"`,
    `  furColor="${fur}"`,
    `  stripeColor="${stripe}"`,
    `  bellyColor="${belly}"`,
    `  eyeColor="${eye}"`,
    `  cushionColor="${cushion}"`,
    `  backgroundColor="${bg}"`,
    size !== 1 ? `  size={${size}}` : null,
    followCursor ? null : `  followCursor={false}`,
    interactive ? null : `  interactive={false}`,
    collide ? `  collide` : null,
    `/>`,
    collide ? `\n{/* the cat naps on top of a marked element: */}\n<h2 data-otc-solid>Do not disturb</h2>` : null,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Cat preset={preset} furColor={fur} stripeColor={stripe} bellyColor={belly} eyeColor={eye} cushionColor={cushion}
        backgroundColor={bg} size={size} followCursor={followCursor} interactive={interactive} collide={collide} width="100%" height="100%" />
      {collide && <DemoSolid top="80%">Do not disturb</DemoSolid>}
      <PLiveLabel text={interactive ? "Hover slowly over it to pet · tap to startle" : "Move the cursor near it"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Fur" value={fur} onChange={setFur} />
        <PColor label="Stripes" value={stripe} onChange={setStripe} />
        <PColor label="Belly" value={belly} onChange={setBelly} />
        <PColor label="Eyes" value={eye} onChange={setEye} />
        <PColor label="Cushion" value={cushion} onChange={setCushion} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Size" value={size} min={0.4} max={1.6} step={0.05} onChange={setSize} />
        <PDivider />
        <PToggle label="Watch cursor" value={followCursor} onChange={setFollowCursor} />
        <PToggle label="Pet and startle" value={interactive} onChange={setInteractive} />
        <PToggle label="Nap on element (collide)" value={collide} onChange={setCollide} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function CatPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Cat"
      lead="A cat asleep, curled nose to tail. It breathes and dreams (tail tip and whiskers twitch), flicks an ear when something moves nearby and cracks one eye open to watch your cursor. Hover slowly over it to pet it and it purrs and kneads; tap it and it startles awake, then drifts back to sleep. Turn on collide and it naps on your headline."
    >
      <CatPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The code block above updates live as you adjust the controls. With <code>collide</code>, mark an element with{" "}
          <code>data-otc-solid</code> and the cat curls up on its top edge; add <code>overlay</code> to let it nap anywhere on the page.
        </p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
