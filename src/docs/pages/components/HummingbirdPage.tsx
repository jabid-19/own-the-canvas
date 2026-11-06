import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { Hummingbird } from "../../../components/Hummingbird";

const PROPS = [
  { name: "bodyColor",       type: "string",  default: '"#2f9e6a"', description: "Iridescent back and head." },
  { name: "throatColor",     type: "string",  default: '"#ff2d6f"', description: "Gorget (throat patch); it flashes as the bird turns." },
  { name: "bellyColor",      type: "string",  default: '"#e9e4d4"', description: "Belly color." },
  { name: "flowerColor",     type: "string",  default: '"#e8433a"', description: "Trumpet flower color." },
  { name: "backgroundColor", type: "string",  default: '"#0c1712"', description: 'Garden color. Use "transparent" to drop the scene.' },
  { name: "birdCount",       type: "number",  default: "1",         description: "Number of birds (0–8)." },
  { name: "size",            type: "number",  default: "1",         description: "Bird scale." },
  { name: "speed",           type: "number",  default: "1",         description: "Dart speed multiplier." },
  { name: "interactive",     type: "boolean", default: "true",      description: "A slow cursor draws a bird over to look at it; a fast one scares it off." },
  { name: "showFlowers",     type: "boolean", default: "true",      description: "Draw the flowers." },
  { name: "collide",         type: "boolean", default: "false",     description: "Elements marked data-otc-solid become flowers; the hovered one is visited first." },
  { name: "overlay",         type: "boolean", default: "false",     description: "Fixed full-viewport, click-through layer over the page." },
  { name: "zIndex",          type: "number",  default: "10",        description: "Overlay stacking order." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "ruby" | "violet" | "sunset" | "frost" | "monochrome"' },
];

type PV = { body: string; throat: string; belly: string; flower: string; bg: string };
const PRESET_VALUES: Record<string, PV> = {
  default:    { body: "#2f9e6a", throat: "#ff2d6f", belly: "#e9e4d4", flower: "#e8433a", bg: "#0c1712" },
  ruby:       { body: "#3e8f4f", throat: "#ff1f3d", belly: "#f0ece2", flower: "#ff7a2f", bg: "#0e140c" },
  violet:     { body: "#2a8f8a", throat: "#a55bff", belly: "#e8eef0", flower: "#ff5fa8", bg: "#0a0e18" },
  sunset:     { body: "#c0622b", throat: "#ffb21f", belly: "#f6e2c8", flower: "#d6336c", bg: "#1a0d10" },
  frost:      { body: "#5aa6c8", throat: "#dff6ff", belly: "#f4f8fb", flower: "#9db8ff", bg: "#07101a" },
  monochrome: { body: "#6b7280", throat: "#e5e7eb", belly: "#d1d5db", flower: "#9ca3af", bg: "#111111" },
};

function HummingbirdPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [body, setBody] = useState(d.body);
  const [throat, setThroat] = useState(d.throat);
  const [belly, setBelly] = useState(d.belly);
  const [flower, setFlower] = useState(d.flower);
  const [bg, setBg] = useState(d.bg);
  const [birdCount, setBirdCount] = useState(1);
  const [size, setSize] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [interactive, setInteractive] = useState(true);
  const [showFlowers, setShowFlowers] = useState(true);
  const [collide, setCollide] = useState(false);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? d;
    setBody(v.body); setThroat(v.throat); setBelly(v.belly); setFlower(v.flower); setBg(v.bg);
  }

  const code = [
    `import { Hummingbird } from 'own-the-canvas';`,
    ``,
    `<Hummingbird`,
    `  preset="${preset}"`,
    `  bodyColor="${body}"`,
    `  throatColor="${throat}"`,
    `  bellyColor="${belly}"`,
    `  flowerColor="${flower}"`,
    `  backgroundColor="${bg}"`,
    birdCount !== 1 ? `  birdCount={${birdCount}}` : null,
    size !== 1 ? `  size={${size}}` : null,
    speed !== 1 ? `  speed={${speed}}` : null,
    interactive ? null : `  interactive={false}`,
    showFlowers ? null : `  showFlowers={false}`,
    collide ? `  collide` : null,
    `/>`,
    collide ? `\n{/* marked elements become flowers; hover one to call a bird to it: */}\n<button data-otc-solid>Get started</button>` : null,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Hummingbird preset={preset} bodyColor={body} throatColor={throat} bellyColor={belly} flowerColor={flower}
        backgroundColor={bg} birdCount={birdCount} size={size} speed={speed} interactive={interactive}
        showFlowers={showFlowers} collide={collide} width="100%" height="100%" />
      {collide && <DemoSolid top="30%">Hover me</DemoSolid>}
      <PLiveLabel text={interactive ? "Hold the cursor still nearby · move fast to scare" : "Live preview"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Body" value={body} onChange={setBody} />
        <PColor label="Throat" value={throat} onChange={setThroat} />
        <PColor label="Belly" value={belly} onChange={setBelly} />
        <PColor label="Flowers" value={flower} onChange={setFlower} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Birds" value={birdCount} min={0} max={8} step={1} onChange={setBirdCount} />
        <PSlider label="Size" value={size} min={0.4} max={2} step={0.05} onChange={setSize} />
        <PSlider label="Speed" value={speed} min={0.3} max={3} step={0.1} onChange={setSpeed} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Flowers" value={showFlowers} onChange={setShowFlowers} />
        <PToggle label="Visit elements (collide)" value={collide} onChange={setCollide} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function HummingbirdPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Hummingbird"
      lead="Hummingbirds in a dusk garden. Wings blur too fast to see; each bird darts between trumpet flowers, stops dead, hovers and sips, its gorget flashing as it turns. Hold your cursor still and one comes to inspect it. With collide, your buttons become flowers, and the one you hover is visited first."
    >
      <HummingbirdPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The code block above updates live as you adjust the controls. With <code>collide</code> and <code>overlay</code>, birds visit
          every element marked <code>data-otc-solid</code> across the page.
        </p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
