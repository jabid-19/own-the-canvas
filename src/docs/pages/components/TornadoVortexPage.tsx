import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { TornadoVortex } from "../../../components/TornadoVortex";

const PROPS = [
  { name: "particleCount",  type: "number",  default: "600",       description: "Number of funnel wall particles." },
  { name: "funnelColor",    type: "string",  default: '"#ffffff"', description: "Funnel wall particle color." },
  { name: "debrisColor",    type: "string",  default: '"#6b7280"', description: "Flying debris and ground dust color." },
  { name: "lightningColor", type: "string",  default: '"#ffffff"', description: "Internal lightning bolt color." },
  { name: "backgroundColor",type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "rotationSpeed",  type: "number",  default: "3",         description: "Angular rotation speed." },
  { name: "funnelHeight",   type: "number",  default: "0.8",       description: "Funnel height as fraction of canvas height." },
  { name: "showLightning",  type: "boolean", default: "true",      description: "Show internal lightning bolts." },
  { name: "showGroundDust", type: "boolean", default: "true",      description: "Show ground dust cloud at base." },
  { name: "interactive",    type: "boolean", default: "true",      description: "Cursor moves the tornado." },
  { name: "speed",          type: "number",  default: "1",         description: "Animation speed multiplier." },
  { name: "preset",         type: "string",  default: "—",         description: '"default" | "storm" | "fire" | "neon" | "void"' },
];

const PRESET_VALUES: Record<string, {
  funnelColor: string; debrisColor: string; bg: string; rotSpeed: number; funnelHeight: number;
}> = {
  default: { funnelColor: "#ffffff", debrisColor: "#6b7280", bg: "#111111", rotSpeed: 3,   funnelHeight: 0.8  },
  storm:   { funnelColor: "#c8d8e8", debrisColor: "#8898a8", bg: "#0a1018", rotSpeed: 3,   funnelHeight: 0.85 },
  fire:    { funnelColor: "#ff6600", debrisColor: "#cc3300", bg: "#0d0200", rotSpeed: 4,   funnelHeight: 0.8  },
  neon:    { funnelColor: "#00ffcc", debrisColor: "#ff00aa", bg: "#000810", rotSpeed: 5,   funnelHeight: 0.8  },
  void:    { funnelColor: "#8866ff", debrisColor: "#4433aa", bg: "#020008", rotSpeed: 2,   funnelHeight: 0.8  },
};

function TornadoVortexPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [funnelColor, setFunnelColor] = useState("#ffffff");
  const [debrisColor, setDebrisColor] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [particleCount, setParticleCount] = useState(600);
  const [rotSpeed, setRotSpeed] = useState(3);
  const [funnelHeight, setFunnelHeight] = useState(0.8);
  const [showLightning, setShowLightning] = useState(true);
  const [showDust, setShowDust] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [speed, setSpeed] = useState(1);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setFunnelColor(v.funnelColor);
    setDebrisColor(v.debrisColor);
    setBg(v.bg);
    setRotSpeed(v.rotSpeed);
    setFunnelHeight(v.funnelHeight);
  }

  const code = [
    `import { TornadoVortex } from 'own-the-canvas';`,
    ``,
    `<TornadoVortex`,
    `  preset="${preset}"`,
    `  funnelColor="${funnelColor}"`,
    `  debrisColor="${debrisColor}"`,
    `  backgroundColor="${bg}"`,
    `  particleCount={${particleCount}}`,
    `  rotationSpeed={${rotSpeed}}`,
    `  funnelHeight={${funnelHeight}}`,
    `  showLightning={${showLightning}}`,
    `  showGroundDust={${showDust}}`,
    !interactive ? `  interactive={false}` : null,
    `  speed={${speed}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <TornadoVortex
        preset={preset}
        funnelColor={funnelColor}
        debrisColor={debrisColor}
        backgroundColor={bg}
        particleCount={particleCount}
        rotationSpeed={rotSpeed}
        funnelHeight={funnelHeight}
        showLightning={showLightning}
        showGroundDust={showDust}
        interactive={interactive}
        speed={speed}
        width="100%"
        height="100%"
      />
      {interactive && <PLiveLabel text="Move cursor to steer the tornado" />}
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "storm", "fire", "neon", "void"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Funnel color" value={funnelColor} onChange={setFunnelColor} />
        <PColor label="Debris color" value={debrisColor} onChange={setDebrisColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Lightning" value={showLightning} onChange={setShowLightning} />
        <PToggle label="Ground dust" value={showDust} onChange={setShowDust} />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Particles" value={particleCount} min={100} max={1200} step={50} onChange={setParticleCount} />
        <PSlider label="Rotation speed" value={rotSpeed} min={0.5} max={10} step={0.5} onChange={setRotSpeed} />
        <PSlider label="Funnel height" value={funnelHeight} min={0.3} max={1} step={0.05} onChange={setFunnelHeight} />
        <PSlider label="Speed" value={speed} min={0.2} max={3} step={0.1} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function TornadoVortexPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="TornadoVortex"
      lead="A violent rotating funnel with 3D particle walls, internal lightning, flying debris, and a swirling ground dust cloud. Move your cursor to steer it."
    >
      <TornadoVortexPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
