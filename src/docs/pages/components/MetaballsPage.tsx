import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Metaballs } from "../../../components/Metaballs";

const PROPS = [
  { name: "blobCount",       type: "number",  default: "5",       description: "Number of initial metaballs." },
  { name: "color",           type: "string",  default: '"#ffffff"', description: "Blob fill color." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "threshold",       type: "number",  default: "1",       description: "Field strength threshold for blob surface." },
  { name: "speed",           type: "number",  default: "1",       description: "Blob wander speed." },
  { name: "minRadius",       type: "number",  default: "40",      description: "Min blob radius in px." },
  { name: "maxRadius",       type: "number",  default: "80",      description: "Max blob radius in px." },
  { name: "glowEffect",      type: "boolean", default: "true",    description: "Glow on blobs." },
  { name: "glowBlur",        type: "number",  default: "20",      description: "Shadow blur for glow." },
  { name: "resolution",      type: "number",  default: "0.4",     description: "Render resolution fraction — lower is faster." },
  { name: "animated",        type: "boolean", default: "true",    description: "Enable animation." },
  { name: "interactive",     type: "boolean", default: "true",    description: "Drag to move blobs; click empty area to add." },
  { name: "preset",          type: "string",  default: "—",       description: '"default" | "plasma" | "lava" | "ocean" | "neon" | "ghost"' },
];

const PRESET_PARAMS = {
  default: { color: "#ffffff", bg: "#111111", threshold: 1,   speed: 1,   minRadius: 40, maxRadius: 80,  glowEffect: true,  glowBlur: 20 },
  plasma:  { color: "#c084fc", bg: "#050010", threshold: 1,   speed: 1.5, minRadius: 40, maxRadius: 80,  glowEffect: true,  glowBlur: 30 },
  lava:    { color: "#f97316", bg: "#1a0000", threshold: 1,   speed: 0.5, minRadius: 50, maxRadius: 100, glowEffect: true,  glowBlur: 20 },
  ocean:   { color: "#38bdf8", bg: "#020c17", threshold: 0.8, speed: 0.8, minRadius: 40, maxRadius: 80,  glowEffect: true,  glowBlur: 15 },
  neon:    { color: "#00ffcc", bg: "#000000", threshold: 1.1, speed: 2,   minRadius: 40, maxRadius: 80,  glowEffect: true,  glowBlur: 25 },
  ghost:   { color: "#e2e8f0", bg: "#111111", threshold: 0.9, speed: 0.3, minRadius: 60, maxRadius: 110, glowEffect: false, glowBlur: 20 },
};

function MetaballsPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]       = useState("default");
  const [blobCount, setBlobCount] = useState(5);
  const [color, setColor]         = useState("#ffffff");
  const [bg, setBg]               = useState("#111111");
  const [threshold, setThresh]    = useState(1);
  const [speed, setSpeed]         = useState(1);
  const [minRadius, setMinR]      = useState(40);
  const [maxRadius, setMaxR]      = useState(80);
  const [glowEffect, setGlow]     = useState(true);
  const [glowBlur, setGlowBlur]   = useState(20);
  const [resolution, setRes]      = useState(0.4);
  const [animated, setAnimated]   = useState(true);
  const [interactive, setInteract]= useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setColor(pp.color);
    setBg(pp.bg);
    setThresh(pp.threshold);
    setSpeed(pp.speed);
    setMinR(pp.minRadius);
    setMaxR(pp.maxRadius);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
  }

  const code = [
    `import { Metaballs } from 'own-the-canvas';`,
    ``,
    `<Metaballs`,
    `  preset="${preset}"`,
    `  blobCount={${blobCount}}`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  threshold={${threshold}}`,
    `  speed={${speed}}`,
    `  minRadius={${minRadius}}`,
    `  maxRadius={${maxRadius}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  resolution={${resolution}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Metaballs
        preset={preset}
        blobCount={blobCount}
        color={color}
        backgroundColor={bg}
        threshold={threshold}
        speed={speed}
        minRadius={minRadius}
        maxRadius={maxRadius}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        resolution={resolution}
        interactive={interactive}
        animated={animated}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "plasma", "lava", "ocean", "neon", "ghost"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Blob color"  value={color} onChange={setColor} />
        <PColor label="Background"  value={bg}    onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect"  value={glowEffect}  onChange={setGlow} />
        <PToggle label="Interactive"  value={interactive} onChange={setInteract} />
        <PToggle label="Animated"     value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Blob count"  value={blobCount}  min={1}   max={12}  step={1}    onChange={setBlobCount} />
        <PSlider label="Threshold"   value={threshold}  min={0.3} max={2}   step={0.05} onChange={setThresh} />
        <PSlider label="Speed"       value={speed}      min={0}   max={5}   step={0.1}  onChange={setSpeed} />
        <PSlider label="Min radius"  value={minRadius}  min={10}  max={150} step={5}    onChange={setMinR} />
        <PSlider label="Max radius"  value={maxRadius}  min={10}  max={200} step={5}    onChange={setMaxR} />
        <PSlider label="Resolution"  value={resolution} min={0.1} max={1}   step={0.05} onChange={setRes} />
        <PSlider label="Glow blur"   value={glowBlur}   min={0}   max={50}  step={1}    onChange={setGlowBlur} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function MetaballsPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Metaballs"
      lead="Organic blobs that merge and split as they wander. Built on implicit surface math — each blob emits a field that combines with neighbors, creating smooth liquid boundaries. Drag blobs around or click to add new ones."
    >
      <MetaballsPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Try <strong>plasma</strong> for purple glowing blobs or <strong>lava</strong> for slow-moving orange masses. Lower <strong>threshold</strong> to make blobs merge more easily at a distance. Raise <strong>resolution</strong> for a sharper image (costs performance). Drag any blob to position it manually.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
