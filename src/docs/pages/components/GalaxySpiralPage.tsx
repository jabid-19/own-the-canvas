import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { GalaxySpiral } from "../../../components/GalaxySpiral";

const PROPS = [
  { name: "starCount",     type: "number",  default: "3000",      description: "Total star particle count." },
  { name: "armCount",      type: "number",  default: "2",         description: "Number of spiral arms." },
  { name: "armTightness",  type: "number",  default: "0.5",       description: "Arm winding tightness." },
  { name: "coreColor",     type: "string",  default: '"#ffffff"', description: "Galactic core color." },
  { name: "diskColor",     type: "string",  default: '"#6b7280"', description: "Outer disk star color." },
  { name: "backgroundColor",type: "string", default: '"#111111"', description: "Canvas background." },
  { name: "rotationSpeed", type: "number",  default: "0.0003",    description: "Rotation speed in radians/frame." },
  { name: "tiltX",         type: "number",  default: "0.3",       description: "Initial disk tilt in radians." },
  { name: "interactive",   type: "boolean", default: "true",      description: "Cursor tilts the viewing angle." },
  { name: "coreGlow",      type: "boolean", default: "true",      description: "Core radial glow overlay." },
  { name: "glowBlur",      type: "number",  default: "30",        description: "Core glow shadow blur radius." },
  { name: "preset",        type: "string",  default: "—",         description: '"default" | "andromeda" | "neon" | "void" | "golden"' },
];

const PRESET_VALUES: Record<string, {
  coreColor: string; diskColor: string; bg: string; armCount: number; armTightness: number; rotSpeed: number;
}> = {
  default:  { coreColor: "#ffffff", diskColor: "#6b7280", bg: "#111111", armCount: 2, armTightness: 0.5,  rotSpeed: 0.3 },
  andromeda:{ coreColor: "#ffd8a8", diskColor: "#a8c4ff", bg: "#020408", armCount: 2, armTightness: 0.6,  rotSpeed: 0.3 },
  neon:     { coreColor: "#ff00ff", diskColor: "#00ffff", bg: "#000008", armCount: 2, armTightness: 0.5,  rotSpeed: 0.6 },
  void:     { coreColor: "#8866ff", diskColor: "#4433aa", bg: "#020005", armCount: 3, armTightness: 0.4,  rotSpeed: 0.3 },
  golden:   { coreColor: "#ffe066", diskColor: "#ffaa33", bg: "#060400", armCount: 2, armTightness: 0.5,  rotSpeed: 0.2 },
};

function GalaxySpiralPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [starCount, setStarCount] = useState(3000);
  const [armCount, setArmCount] = useState(2);
  const [armTightness, setArmTightness] = useState(0.5);
  const [coreColor, setCoreColor] = useState("#ffffff");
  const [diskColor, setDiskColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [rotSpeed, setRotSpeed] = useState(0.3);
  const [coreGlow, setCoreGlow] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setCoreColor(v.coreColor);
    setDiskColor(v.diskColor);
    setBg(v.bg);
    setArmCount(v.armCount);
    setArmTightness(v.armTightness);
    setRotSpeed(v.rotSpeed);
  }

  const code = [
    `import { GalaxySpiral } from 'own-the-canvas';`,
    ``,
    `<GalaxySpiral`,
    `  preset="${preset}"`,
    `  starCount={${starCount}}`,
    `  armCount={${armCount}}`,
    `  armTightness={${armTightness}}`,
    `  coreColor="${coreColor}"`,
    `  diskColor="${diskColor}"`,
    `  backgroundColor="${bg}"`,
    `  rotationSpeed={${rotSpeed / 1000}}`,
    `  coreGlow={${coreGlow}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <GalaxySpiral
        preset={preset}
        starCount={starCount}
        armCount={armCount}
        armTightness={armTightness}
        coreColor={coreColor}
        diskColor={diskColor}
        backgroundColor={bg}
        rotationSpeed={rotSpeed / 1000}
        coreGlow={coreGlow}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Move cursor to tilt the viewing angle" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "andromeda", "neon", "void", "golden"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Core color" value={coreColor} onChange={setCoreColor} />
        <PColor label="Disk color" value={diskColor} onChange={setDiskColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Core glow" value={coreGlow} onChange={setCoreGlow} />
      </div>
      <div>
        <PSlider label="Star count" value={starCount} min={500} max={6000} step={250} onChange={setStarCount} />
        <PSlider label="Arms" value={armCount} min={1} max={6} step={1} onChange={setArmCount} />
        <PSlider label="Arm tightness" value={armTightness} min={0.1} max={1.5} step={0.05} onChange={setArmTightness} />
        <PSlider label="Rotation speed" value={rotSpeed} min={0} max={2} step={0.1} onChange={setRotSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function GalaxySpiralPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="GalaxySpiral"
      lead="A rotating spiral galaxy with logarithmic arms, a glowing core, halo stars, and interactive tilt — move your cursor to orbit around it."
    >
      <GalaxySpiralPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
