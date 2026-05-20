import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { BlackHole } from "../../../components/BlackHole";

const PROPS = [
  { name: "diskColor",          type: "string",  default: '"#ffffff"', description: "Accretion disk particle color." },
  { name: "backgroundColor",    type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "particleCount",      type: "number",  default: "300",       description: "Number of disk particles." },
  { name: "gravity",            type: "number",  default: "200",       description: "Gravitational pull strength." },
  { name: "eventHorizonRadius", type: "number",  default: "30",        description: "Event horizon radius in px." },
  { name: "diskWidth",          type: "number",  default: "120",       description: "Accretion disk radial extent in px." },
  { name: "jetColor",           type: "string",  default: '"#6b7280"', description: "Polar jet stream color." },
  { name: "showJets",           type: "boolean", default: "true",      description: "Show polar particle jets." },
  { name: "lensing",            type: "boolean", default: "true",      description: "Background grid gravitational lensing." },
  { name: "speed",              type: "number",  default: "1",         description: "Animation speed multiplier." },
  { name: "interactive",        type: "boolean", default: "true",      description: "Cursor shifts the singularity position." },
  { name: "preset",             type: "string",  default: "—",         description: '"default" | "cosmic" | "inferno" | "neon" | "void"' },
];

const PRESET_VALUES: Record<string, {
  diskColor: string; bg: string; jetColor: string; diskWidth: number; particleCount: number;
}> = {
  default: { diskColor: "#ffffff", bg: "#111111", jetColor: "#6b7280", diskWidth: 120, particleCount: 300 },
  cosmic:  { diskColor: "#aaccff", bg: "#020510", jetColor: "#88aaff", diskWidth: 140, particleCount: 300 },
  inferno: { diskColor: "#ff6600", bg: "#0d0200", jetColor: "#ff3300", diskWidth: 100, particleCount: 300 },
  neon:    { diskColor: "#00ffcc", bg: "#000510", jetColor: "#ff00aa", diskWidth: 120, particleCount: 300 },
  void:    { diskColor: "#6b7280", bg: "#050505", jetColor: "#4b5563", diskWidth: 80,  particleCount: 200 },
};

function BlackHolePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [diskColor, setDiskColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [jetColor, setJetColor] = useState("#6b7280");
  const [particleCount, setParticleCount] = useState(300);
  const [ehRadius, setEhRadius] = useState(30);
  const [diskWidth, setDiskWidth] = useState(120);
  const [speed, setSpeed] = useState(1);
  const [showJets, setShowJets] = useState(true);
  const [lensing, setLensing] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setDiskColor(v.diskColor);
    setBg(v.bg);
    setJetColor(v.jetColor);
    setDiskWidth(v.diskWidth);
    setParticleCount(v.particleCount);
  }

  const code = [
    `import { BlackHole } from 'own-the-canvas';`,
    ``,
    `<BlackHole`,
    `  preset="${preset}"`,
    `  diskColor="${diskColor}"`,
    `  backgroundColor="${bg}"`,
    `  particleCount={${particleCount}}`,
    `  eventHorizonRadius={${ehRadius}}`,
    `  diskWidth={${diskWidth}}`,
    `  speed={${speed}}`,
    `  showJets={${showJets}}`,
    `  lensing={${lensing}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <BlackHole
        preset={preset}
        diskColor={diskColor}
        backgroundColor={bg}
        jetColor={jetColor}
        particleCount={particleCount}
        eventHorizonRadius={ehRadius}
        diskWidth={diskWidth}
        speed={speed}
        showJets={showJets}
        lensing={lensing}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Move cursor to shift the singularity" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "cosmic", "inferno", "neon", "void"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Disk color" value={diskColor} onChange={setDiskColor} />
        <PColor label="Jet color" value={jetColor} onChange={setJetColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Show jets" value={showJets} onChange={setShowJets} />
        <PToggle label="Lensing" value={lensing} onChange={setLensing} />
      </div>
      <div>
        <PSlider label="Particle count" value={particleCount} min={50} max={600} step={25} onChange={setParticleCount} />
        <PSlider label="Event horizon" value={ehRadius} min={10} max={80} step={5} onChange={setEhRadius} />
        <PSlider label="Disk width" value={diskWidth} min={40} max={250} step={10} onChange={setDiskWidth} />
        <PSlider label="Speed" value={speed} min={0.1} max={3} step={0.1} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function BlackHolePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="BlackHole"
      lead="A gravitational singularity with a spiraling accretion disk, polar particle jets, and background grid lensing. Move your cursor to shift the black hole's position."
    >
      <BlackHolePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
