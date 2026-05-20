import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { DragonCursor } from "../../../components/DragonCursor";

const PROPS = [
  { name: "segmentCount",   type: "number",  default: "20",           description: "Number of body joint segments." },
  { name: "segmentSize",    type: "number",  default: "18",           description: "Head radius in px — body tapers from this." },
  { name: "bodyColor",      type: "string",  default: '"#ffffff"',    description: "Dragon body and wing color." },
  { name: "eyeColor",       type: "string",  default: '"#111111"',    description: "Eye pupil color." },
  { name: "fireColor",      type: "string",  default: '"#ffffff"',    description: "Fire breath particle color." },
  { name: "backgroundColor",type: "string",  default: '"transparent"',description: "Canvas background." },
  { name: "followSpeed",    type: "number",  default: "0.15",         description: "Cursor follow lerp factor 0–1." },
  { name: "wingSpan",       type: "number",  default: "60",           description: "Wing length in px." },
  { name: "showFire",       type: "boolean", default: "true",         description: "Show fire breath particles." },
  { name: "interactive",    type: "boolean", default: "true",         description: "Dragon follows cursor; false = autonomous wander." },
  { name: "preset",         type: "string",  default: "—",            description: '"default" | "emerald" | "inferno" | "void" | "ice"' },
];

const PRESET_VALUES: Record<string, { bodyColor: string; eyeColor: string; fireColor: string; bg: string }> = {
  default:  { bodyColor: "#ffffff", eyeColor: "#111111", fireColor: "#ffffff", bg: "#111111" },
  emerald:  { bodyColor: "#00ff88", eyeColor: "#00ff00", fireColor: "#00ffaa", bg: "#0a1a0f" },
  inferno:  { bodyColor: "#ff6600", eyeColor: "#ff0000", fireColor: "#ffaa00", bg: "#1a0500" },
  void:     { bodyColor: "#9900ff", eyeColor: "#cc00ff", fireColor: "#6600cc", bg: "#050010" },
  ice:      { bodyColor: "#88ddff", eyeColor: "#ffffff", fireColor: "#aaeeff", bg: "#050a14" },
};

function DragonCursorPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [bodyColor, setBodyColor] = useState("#ffffff");
  const [eyeColor, setEyeColor] = useState("#111111");
  const [fireColor, setFireColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [segments, setSegments] = useState(20);
  const [segSize, setSegSize] = useState(18);
  const [followSpeed, setFollowSpeed] = useState(0.15);
  const [wingSpan, setWingSpan] = useState(60);
  const [showFire, setShowFire] = useState(false);
  const [interactive, setInteractive] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setBodyColor(v.bodyColor);
    setEyeColor(v.eyeColor);
    setFireColor(v.fireColor);
    setBg(v.bg);
  }

  const code = [
    `import { DragonCursor } from 'own-the-canvas';`,
    ``,
    `<DragonCursor`,
    `  preset="${preset}"`,
    `  bodyColor="${bodyColor}"`,
    `  fireColor="${fireColor}"`,
    `  backgroundColor="${bg}"`,
    `  segmentCount={${segments}}`,
    `  wingSpan={${wingSpan}}`,
    `  followSpeed={${followSpeed}}`,
    `  showFire={${showFire}}`,
    `  interactive={${interactive}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <DragonCursor
        preset={preset}
        bodyColor={bodyColor}
        eyeColor={eyeColor}
        fireColor={fireColor}
        backgroundColor={bg}
        segmentCount={segments}
        segmentSize={segSize}
        followSpeed={followSpeed}
        wingSpan={wingSpan}
        showFire={showFire}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel text={interactive ? "Move cursor to guide the dragon" : "Dragon wanders autonomously"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "emerald", "inferno", "void", "ice"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Body color" value={bodyColor} onChange={setBodyColor} />
        <PColor label="Fire color" value={fireColor} onChange={setFireColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Show fire" value={showFire} onChange={setShowFire} />
        <PToggle label="Follow cursor" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Segments" value={segments} min={8} max={40} step={1} onChange={setSegments} />
        <PSlider label="Head size" value={segSize} min={8} max={36} step={1} onChange={setSegSize} />
        <PSlider label="Follow speed" value={followSpeed} min={0.02} max={0.5} step={0.01} onChange={setFollowSpeed} />
        <PSlider label="Wing span" value={wingSpan} min={20} max={150} step={5} onChange={setWingSpan} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function DragonCursorPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="DragonCursor"
      lead="A sinuous dragon with horns, dorsal spines, a forked tongue, and fire breath — it follows your cursor or wanders autonomously."
    >
      <DragonCursorPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
