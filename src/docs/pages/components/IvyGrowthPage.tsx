import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DemoSolid } from "../../components/DemoSolid";
import { IvyGrowth } from "../../../components/IvyGrowth";

const PROPS = [
  { name: "color",           type: "string",  default: '"#3f5a2a"',  description: "Stem and tendril color." },
  { name: "leafColor",       type: "string",  default: '"#5f9e3a"',  description: "Leaf color." },
  { name: "backgroundColor", type: "string",  default: '"#0c120b"',  description: "Background color (ignored in overlay mode)." },
  { name: "vines",           type: "number",  default: "4",          description: "Root count when growing over the whole canvas." },
  { name: "growthSpeed",     type: "number",  default: "1",          description: "Growth speed multiplier." },
  { name: "density",         type: "number",  default: "1",          description: "How much space the vines fill, 0.3..2." },
  { name: "leafSize",        type: "number",  default: "9",          description: "Leaf length in px." },
  { name: "leafDensity",     type: "number",  default: "0.35",       description: "Leaves per stem segment, 0..1." },
  { name: "followCursor",    type: "boolean", default: "true",       description: "Vines lean toward the cursor like it's sunlight." },
  { name: "hug",             type: "number",  default: "20",         description: "With collide: how far vines spread from each element's edges, px." },
  { name: "loop",            type: "boolean", default: "false",      description: "When fully grown, hold, fade, and regrow." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "english-ivy" | "autumn" | "jungle" | "gilded" | "monochrome"' },
  { name: "overlay",         type: "boolean", default: "false",      description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "collide",         type: "boolean", default: "false",      description: "Vines climb the edges of elements marked data-otc-solid instead of the canvas." },
  { name: "zIndex",          type: "number",  default: "10",         description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, { stem: string; leaf: string; bg: string }> = {
  default:       { stem: "#3f5a2a", leaf: "#5f9e3a", bg: "#0c120b" },
  monochrome: { stem: "#6b7280", leaf: "#ffffff", bg: "#111111" },
  "english-ivy": { stem: "#3f5a2a", leaf: "#5f9e3a", bg: "#0c120b" },
  autumn:        { stem: "#5a3a22", leaf: "#d9622b", bg: "#140b07" },
  jungle:        { stem: "#245c3a", leaf: "#34d399", bg: "#04110b" },
  gilded:        { stem: "#8a6a2a", leaf: "#f5c96a", bg: "#0e0b06" },
};

function IvyGrowthPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("english-ivy");
  const v0 = PRESET_VALUES["english-ivy"];
  const [stem, setStem] = useState(v0.stem);
  const [leaf, setLeaf] = useState(v0.leaf);
  const [bg, setBg] = useState(v0.bg);
  const [speed, setSpeed] = useState(1);
  const [density, setDensity] = useState(1);
  const [leafDensity, setLeafDensity] = useState(0.35);
  const [collide, setCollide] = useState(false);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setStem(v.stem); setLeaf(v.leaf); setBg(v.bg);
  }

  const code = [
    `import { IvyGrowth } from 'own-the-canvas';`,
    ``,
    `<IvyGrowth`,
    `  preset="${preset}"`,
    `  color="${stem}"`,
    `  leafColor="${leaf}"`,
    `  backgroundColor="${bg}"`,
    `  growthSpeed={${speed}}`,
    `  density={${density}}`,
    `  leafDensity={${leafDensity}}`,
    collide ? `  collide` : `  loop`,
    `/>`,
    ...(collide ? [``, `{/* vines climb any element marked: */}`, `<h1 data-otc-solid>Your headline here</h1>`] : []),
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <IvyGrowth
        preset={preset}
        color={stem}
        leafColor={leaf}
        backgroundColor={bg}
        growthSpeed={speed}
        density={density}
        leafDensity={leafDensity}
        collide={collide}
        loop={!collide}
        width="100%"
        height="100%"
      />
      {collide && <DemoSolid top="50%">Vines climb this card</DemoSolid>}
      <PLiveLabel text="Vines lean toward your cursor" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Stem color" value={stem} onChange={setStem} />
        <PColor label="Leaf color" value={leaf} onChange={setLeaf} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Climb element (collide)" value={collide} onChange={setCollide} />
      </div>
      <div>
        <PSlider label="Growth speed" value={speed} min={0.2} max={4} step={0.1} onChange={setSpeed} />
        <PSlider label="Density" value={density} min={0.3} max={2} step={0.1} onChange={setDensity} />
        <PSlider label="Leaf density" value={leafDensity} min={0} max={1} step={0.05} onChange={setLeafDensity} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function IvyGrowthPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="IvyGrowth"
      lead="Ivy that grows across your page in real time: vines branch, thicken, curl tendrils, and unfold leaves. With collide on, they climb the edges of your actual headline and cards, and lean toward the cursor like it's sunlight."
    >
      <IvyGrowthPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How it grows</h2>
        <p className="page-p">
          Vines use the space colonization algorithm from botanical modeling. The space to fill is scattered with
          attraction points; each pulls on its nearest vine tip, tips grow one segment toward the average pull, and
          points that get reached are consumed. Stem thickness follows the pipe model (more descendants, thicker
          stem). Over the whole canvas, points cluster near the edges so the middle stays clear for your content.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
