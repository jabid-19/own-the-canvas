import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PColorArray, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { MagneticBlob, PRESETS as BLOB_PRESETS } from "../../../components/MagneticBlob";

const PROPS = [
  { name: "count",           type: "number",  default: "5",         description: "Number of blobs." },
  { name: "colors",          type: "string[]",default: "multi",     description: "Blob colors." },
  { name: "radius",          type: "number",  default: "80",        description: "Base blob radius in px." },
  { name: "speed",           type: "number",  default: "1",         description: "Wander animation speed." },
  { name: "magnetStrength",  type: "number",  default: "0.08",      description: "Mouse attraction force." },
  { name: "magnetRadius",    type: "number",  default: "150",       description: "Mouse influence radius in px." },
  { name: "threshold",       type: "number",  default: "1.8",       description: "Metaball merge threshold — higher merges earlier." },
  { name: "glowEffect",      type: "boolean", default: "true",      description: "Glow on blobs." },
  { name: "glowBlur",        type: "number",  default: "20",        description: "Shadow blur for glow." },
  { name: "backgroundColor", type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "animated",        type: "boolean", default: "true",      description: "Enable wander animation." },
  { name: "followMouse",     type: "boolean", default: "true",      description: "Blobs are attracted to cursor." },
  { name: "wanderStrength",  type: "number",  default: "0.4",       description: "Organic wander amplitude 0–1." },
  { name: "preset",          type: "string",  default: "—",         description: '"default" | "neon" | "plasma" | "ocean" | "lava" | "minimal"' },
];

function MagneticBlobPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [count, setCount] = useState(5);
  const [radius, setRadius] = useState(80);
  const [threshold, setThreshold] = useState(1.8);
  const [bg, setBg] = useState("#111111");
  const [colors, setColors] = useState(["#ffffff"]);
  const [followMouse, setFollowMouse] = useState(true);
  const [glow, setGlow] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const v = BLOB_PRESETS[p as keyof typeof BLOB_PRESETS] ?? {};
    if (v.count !== undefined)       setCount(v.count);
    if (v.radius !== undefined)      setRadius(v.radius);
    if (v.threshold !== undefined)   setThreshold(v.threshold);
    if (v.backgroundColor)           setBg(v.backgroundColor);
    if (v.colors)                    setColors(v.colors);
    if (v.followMouse !== undefined) setFollowMouse(v.followMouse);
    if (v.glowEffect !== undefined)  setGlow(v.glowEffect);
  }

  const code = [
    `import { MagneticBlob } from 'own-the-canvas';`,
    ``,
    `<MagneticBlob`,
    `  preset="${preset}"`,
    `  count={${count}}`,
    `  radius={${radius}}`,
    `  threshold={${threshold}}`,
    `  colors={${JSON.stringify(colors)}}`,
    followMouse ? null : `  followMouse={false}`,
    glow ? null : `  glowEffect={false}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MagneticBlob preset={preset} count={count} radius={radius}
        threshold={threshold} colors={colors} followMouse={followMouse} glowEffect={glow}
        backgroundColor={bg} width="100%" height="100%" />
      <PLiveLabel text="Move cursor to attract blobs" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "plasma", "ocean", "lava", "minimal"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PDivider />
        <PColorArray label="Blob Colors" value={colors} onChange={setColors} />
        <PDivider />
        <PSlider label="Blob count" value={count} min={2} max={10} step={1} onChange={setCount} />
      </div>
      <div>
        <PSlider label="Radius" value={radius} min={30} max={150} step={5} onChange={setRadius} />
        <PSlider label="Merge threshold" value={threshold} min={1} max={3} step={0.05} onChange={setThreshold} />
        <PDivider />
        <PToggle label="Follow mouse" value={followMouse} onChange={setFollowMouse} />
        <PToggle label="Glow effect" value={glow} onChange={setGlow} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function MagneticBlobPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="MagneticBlob"
      lead="Metaballs that organically wander and merge. Blobs are attracted to the cursor and naturally merge into each other using additive screen-blend radial gradients."
    >
      <MagneticBlobPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
