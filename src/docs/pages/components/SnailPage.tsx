import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { Snail } from "../../../components/Snail";

const PROPS = [
  { name: "shellColor",      type: "string",  default: '"#b5773f"', description: "Shell." },
  { name: "bodyColor",       type: "string",  default: '"#a8988a"', description: "Foot, head and eye stalks." },
  { name: "trailColor",      type: "string",  default: '"#cfe6ff"', description: "Slime trail glint." },
  { name: "backgroundColor", type: "string",  default: '"#0f1a12"', description: 'Garden. Use "transparent" to drop the scene.' },
  { name: "size",            type: "number",  default: "1",         description: "Snail scale." },
  { name: "speed",           type: "number",  default: "1",         description: "Crawl speed multiplier." },
  { name: "trail",           type: "boolean", default: "true",      description: "Leave a slime trail that slowly dries." },
  { name: "interactive",     type: "boolean", default: "true",      description: "Eye stalks lean toward the cursor; poke them, move fast or tap and it hides in its shell." },
  { name: "collide",         type: "boolean", default: "false",     description: "Crawl along the top of an element marked data-otc-solid." },
  { name: "overlay",         type: "boolean", default: "false",     description: "Fixed full-viewport, click-through layer over the page." },
  { name: "zIndex",          type: "number",  default: "10",        description: "Overlay stacking order." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "amber" | "forest" | "candy" | "nocturne" | "monochrome"' },
];

type PV = { shell: string; body: string; trail: string; bg: string };
const PRESET_VALUES: Record<string, PV> = {
  default:    { shell: "#b5773f", body: "#a8988a", trail: "#cfe6ff", bg: "#0f1a12" },
  amber:      { shell: "#e0a03a", body: "#c9b49a", trail: "#fff1c9", bg: "#1a1208" },
  forest:     { shell: "#6f5a33", body: "#7d7466", trail: "#d6f5c8", bg: "#07140b" },
  candy:      { shell: "#e47aa8", body: "#e8cfc4", trail: "#ffd6f0", bg: "#170b18" },
  nocturne:   { shell: "#4f6aa8", body: "#8a93a6", trail: "#9fe8ff", bg: "#050811" },
  monochrome: { shell: "#9ca3af", body: "#6b7280", trail: "#e5e7eb", bg: "#111111" },
};

function SnailPlayground({ onReset }: { onReset?: () => void }) {
  const d = PRESET_VALUES.default;
  const [preset, setPreset] = useState("default");
  const [shell, setShell] = useState(d.shell);
  const [body, setBody] = useState(d.body);
  const [trailColor, setTrailColor] = useState(d.trail);
  const [bg, setBg] = useState(d.bg);
  const [size, setSize] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [trail, setTrail] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [collide, setCollide] = useState(false);

  function onPresetChange(p: string) {
    setPreset(p);
    const n = PRESET_VALUES[p] ?? d;
    setShell(n.shell); setBody(n.body); setTrailColor(n.trail); setBg(n.bg);
  }

  const code = [
    `import { Snail } from 'own-the-canvas';`,
    ``,
    `<Snail`,
    `  preset="${preset}"`,
    `  shellColor="${shell}"`,
    `  bodyColor="${body}"`,
    `  trailColor="${trailColor}"`,
    `  backgroundColor="${bg}"`,
    size !== 1 ? `  size={${size}}` : null,
    speed !== 1 ? `  speed={${speed}}` : null,
    trail ? null : `  trail={false}`,
    interactive ? null : `  interactive={false}`,
    collide ? `  collide` : null,
    `/>`,
    collide ? `\n{/* the snail crawls along the top of a marked element: */}\n<h2 data-otc-solid>Slow and steady</h2>` : null,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Snail preset={preset} shellColor={shell} bodyColor={body} trailColor={trailColor} backgroundColor={bg}
        size={size} speed={speed} trail={trail} interactive={interactive} collide={collide} width="100%" height="100%" />
      {collide && <DemoSolid top="70%">Slow and steady wins the race</DemoSolid>}
      <PLiveLabel text={interactive ? "Hover in front of it · poke an eye or tap to make it hide" : undefined} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Shell" value={shell} onChange={setShell} />
        <PColor label="Body" value={body} onChange={setBody} />
        <PColor label="Trail" value={trailColor} onChange={setTrailColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Size" value={size} min={0.4} max={1.8} step={0.05} onChange={setSize} />
        <PSlider label="Speed" value={speed} min={0.2} max={6} step={0.1} onChange={setSpeed} />
        <PDivider />
        <PToggle label="Slime trail" value={trail} onChange={setTrail} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
        <PToggle label="Crawl on element (collide)" value={collide} onChange={setCollide} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SnailPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Snail"
      lead="A garden snail gliding on rippling pedal waves, leaving a glistening slime trail that slowly dries. Its eye stalks lean toward your cursor out of curiosity; poke an eye and that stalk shrinks back, and move fast or tap it and the whole snail pulls into its shell, then cautiously comes back out. Turn on collide and it crawls along your headline."
    >
      <SnailPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          The code block above updates live as you adjust the controls. With <code>collide</code>, mark an element with{" "}
          <code>data-otc-solid</code> and the snail crawls back and forth along its top edge.
        </p>
      </section>
      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
