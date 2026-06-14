import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { SpiderWeb } from "../../../components/SpiderWeb";

const PROPS = [
  { name: "spokeCount",     type: "number",  default: "12",         description: "Number of radial spokes." },
  { name: "ringCount",      type: "number",  default: "10",         description: "Number of concentric rings." },
  { name: "webColor",       type: "string",  default: '"#c8c8c8"',  description: "Silk strand color." },
  { name: "backgroundColor",type: "string",  default: '"#111111"',  description: "Canvas background color." },
  { name: "spiderColor",    type: "string",  default: '"#333333"',  description: "Spider body and leg color." },
  { name: "dewDrops",       type: "boolean", default: "true",       description: "Show glowing dew drop points on strands." },
  { name: "glowColor",      type: "string",  default: '"#aaddff"',  description: "Dew drop glow color." },
  { name: "swaySpeed",      type: "number",  default: "1",          description: "Ambient sway speed multiplier." },
  { name: "disturbRadius",  type: "number",  default: "80",         description: "Cursor disturbance radius in px." },
  { name: "interactive",    type: "boolean", default: "true",       description: "Cursor pulls web strands." },
  { name: "showSpider",     type: "boolean", default: "true",       description: "Show the spider." },
  { name: "preset",         type: "string",  default: "—",          description: '"default" | "night" | "forest" | "neon" | "frost"' },
];

const PRESET_VALUES: Record<string, { webColor: string; backgroundColor: string; spiderColor: string; glowColor: string }> = {
  default: { webColor: "#c8c8c8", backgroundColor: "#111111", spiderColor: "#333333", glowColor: "#aaddff" },
  night:   { webColor: "#c0c8e0", backgroundColor: "#04081a", spiderColor: "#404060", glowColor: "#8899cc" },
  forest:  { webColor: "#90b890", backgroundColor: "#050f05", spiderColor: "#2a4a2a", glowColor: "#66aa66" },
  neon:    { webColor: "#00ffcc", backgroundColor: "#000000", spiderColor: "#003322", glowColor: "#00ffff" },
  frost:   { webColor: "#e0f0ff", backgroundColor: "#040810", spiderColor: "#203040", glowColor: "#aaddff" },
};

function SpiderWebPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]             = useState("default");
  const [webColor, setWebColor]         = useState("#c8c8c8");
  const [bg, setBg]                     = useState("#111111");
  const [spiderColor, setSpiderColor]   = useState("#333333");
  const [glowColor, setGlowColor]       = useState("#aaddff");
  const [spokeCount, setSpokeCount]     = useState(12);
  const [ringCount, setRingCount]       = useState(10);
  const [swaySpeed, setSwaySpeed]       = useState(1);
  const [disturbRadius, setDisturbRadius] = useState(80);
  const [dewDrops, setDewDrops]         = useState(true);
  const [interactive, setInteractive]   = useState(true);
  const [showSpider, setShowSpider]     = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setWebColor(v.webColor);
    setBg(v.backgroundColor);
    setSpiderColor(v.spiderColor);
    setGlowColor(v.glowColor);
  }

  const code = [
    `import { SpiderWeb } from 'own-the-canvas';`,
    ``,
    `<SpiderWeb`,
    `  preset="${preset}"`,
    `  webColor="${webColor}"`,
    `  backgroundColor="${bg}"`,
    `  spiderColor="${spiderColor}"`,
    `  glowColor="${glowColor}"`,
    `  spokeCount={${spokeCount}}`,
    `  ringCount={${ringCount}}`,
    `  swaySpeed={${swaySpeed}}`,
    `  disturbRadius={${disturbRadius}}`,
    `  dewDrops={${dewDrops}}`,
    `  interactive={${interactive}}`,
    `  showSpider={${showSpider}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <SpiderWeb
        preset={preset}
        webColor={webColor}
        backgroundColor={bg}
        spiderColor={spiderColor}
        glowColor={glowColor}
        spokeCount={spokeCount}
        ringCount={ringCount}
        swaySpeed={swaySpeed}
        disturbRadius={disturbRadius}
        dewDrops={dewDrops}
        interactive={interactive}
        showSpider={showSpider}
        width="100%"
        height="100%"
      />
      <PLiveLabel text={interactive ? "Move cursor to disturb the web" : "Web sways in ambient breeze"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "night", "forest", "neon", "frost"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Web color" value={webColor} onChange={setWebColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PColor label="Spider color" value={spiderColor} onChange={setSpiderColor} />
        <PColor label="Glow color" value={glowColor} onChange={setGlowColor} />
        <PToggle label="Dew drops" value={dewDrops} onChange={setDewDrops} />
        <PToggle label="Show spider" value={showSpider} onChange={setShowSpider} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Spokes" value={spokeCount} min={6} max={24} step={1} onChange={setSpokeCount} />
        <PSlider label="Rings" value={ringCount} min={4} max={20} step={1} onChange={setRingCount} />
        <PSlider label="Sway speed" value={swaySpeed} min={0.1} max={4} step={0.1} onChange={setSwaySpeed} />
        <PSlider label="Disturb radius" value={disturbRadius} min={20} max={200} step={5} onChange={setDisturbRadius} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SpiderWebPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="SpiderWeb"
      lead="An orb-weaver's silk web with spring-physics strands, glowing dew drops, and a spider that stalks your cursor. Move your mouse to pull the web."
    >
      <SpiderWebPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />
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
