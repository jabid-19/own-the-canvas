import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Rain } from "../../../components/Rain";

const PROPS = [
  { name: "dropCount",       type: "number",  default: "200",       description: "Number of rain drops." },
  { name: "speed",           type: "number",  default: "15",        description: "Drop fall speed in px/frame." },
  { name: "wind",            type: "number",  default: "0.3",       description: "Horizontal wind drift strength." },
  { name: "windSpeed",       type: "number",  default: "0.5",       description: "Wind oscillation frequency." },
  { name: "dropLength",      type: "number",  default: "20",        description: "Drop streak length in px." },
  { name: "dropWidth",       type: "number",  default: "1",         description: "Drop stroke width in px." },
  { name: "dropOpacity",     type: "number",  default: "0.6",       description: "Drop opacity 0–1." },
  { name: "dropColor",       type: "string",  default: '"#000000"', description: "Drop streak color." },
  { name: "splashColor",     type: "string",  default: '"#000000"', description: "Splash particle color." },
  { name: "showSplashes",    type: "boolean", default: "true",      description: "Show splash particles when drops hit bottom." },
  { name: "backgroundColor", type: "string",  default: '"#ffffff"', description: 'Canvas background color. Use "transparent" to overlay on another element.' },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "storm" | "drizzle" | "neon" | "golden"' },
];

function RainPlayground() {
  const [preset, setPreset] = useState("default");
  const [dropCount, setDropCount] = useState(200);
  const [speed, setSpeed] = useState(15);
  const [wind, setWind] = useState(0.3);
  const [dropColor, setDropColor] = useState("#000000");
  const [splashColor, setSplashColor] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [showSplashes, setShowSplashes] = useState(true);

  const code = [
    `import { Rain } from 'own-the-canvas';`,
    ``,
    `<Rain`,
    `  preset="${preset}"`,
    `  dropCount={${dropCount}}`,
    `  speed={${speed}}`,
    `  wind={${wind}}`,
    `  dropColor="${dropColor}"`,
    `  splashColor="${splashColor}"`,
    showSplashes ? null : `  showSplashes={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Rain preset={preset} dropCount={dropCount} speed={speed} wind={wind}
        dropColor={dropColor} splashColor={splashColor} showSplashes={showSplashes}
        backgroundColor={bg} width="100%" height="100%" />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "storm", "drizzle", "neon", "golden"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Drop color" value={dropColor} onChange={setDropColor} />
        <PColor label="Splash color" value={splashColor} onChange={setSplashColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Drop count" value={dropCount} min={20} max={800} step={20} onChange={setDropCount} />
        <PSlider label="Speed" value={speed} min={2} max={40} step={1} onChange={setSpeed} />
        <PSlider label="Wind" value={wind} min={0} max={3} step={0.1} onChange={setWind} />
        <PDivider />
        <PToggle label="Show splashes" value={showSplashes} onChange={setShowSplashes} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function RainPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Rain"
      lead="Animated rainfall with wind drift, variable drop length, and splash particles. Perfect for atmospheric hero sections and mood-setting backgrounds."
    >
      <RainPlayground />

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
