import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { SolarFlare } from "../../../components/SolarFlare";

const PROPS = [
  { name: "sunColor",          type: "string",  default: '"#ffffff"', description: "Photosphere color." },
  { name: "coronaColor",       type: "string",  default: '"#6b7280"', description: "Corona glow color." },
  { name: "flareColor",        type: "string",  default: '"#ffffff"', description: "Eruption/flare color." },
  { name: "backgroundColor",   type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "sunRadius",         type: "number",  default: "0.25",      description: "Sun radius as fraction of min(w,h)/2." },
  { name: "convectionCells",   type: "number",  default: "20",        description: "Number of surface convection cells." },
  { name: "flareCount",        type: "number",  default: "3",         description: "Simultaneous active flares." },
  { name: "autoFlare",         type: "boolean", default: "true",      description: "Auto-spawn flares." },
  { name: "autoFlareInterval", type: "number",  default: "3000",      description: "Interval between auto-flares in ms." },
  { name: "interactive",       type: "boolean", default: "true",      description: "Click to trigger a flare at cursor angle." },
  { name: "glowEffect",        type: "boolean", default: "true",      description: "Corona glow." },
  { name: "glowBlur",          type: "number",  default: "40",        description: "Glow blur radius in px." },
  { name: "speed",             type: "number",  default: "1",         description: "Animation speed multiplier." },
  { name: "preset",            type: "string",  default: "—",         description: '"default" | "inferno" | "plasma" | "neon" | "white-dwarf"' },
];

const PRESET_VALUES: Record<string, {
  sunColor: string; coronaColor: string; flareColor: string; bg: string; sunRadius: number; glowBlur: number;
}> = {
  "default":    { sunColor: "#ffffff", coronaColor: "#6b7280", flareColor: "#ffffff", bg: "#111111", sunRadius: 0.35, glowBlur: 40 },
  "inferno":    { sunColor: "#ff6600", coronaColor: "#ff3300", flareColor: "#ffaa00", bg: "#0a0200", sunRadius: 0.25, glowBlur: 60 },
  "plasma":     { sunColor: "#cc44ff", coronaColor: "#8800cc", flareColor: "#ff88ff", bg: "#050008", sunRadius: 0.25, glowBlur: 50 },
  "neon":       { sunColor: "#00ffcc", coronaColor: "#00aaff", flareColor: "#ffffff",  bg: "#000810", sunRadius: 0.25, glowBlur: 45 },
  "white-dwarf":{ sunColor: "#eef4ff", coronaColor: "#aac4ff", flareColor: "#ffffff",  bg: "#000008", sunRadius: 0.15, glowBlur: 80 },
};

function SolarFlarePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [sunColor, setSunColor] = useState("#ffffff");
  const [coronaColor, setCoronaColor] = useState("#6b7280");
  const [flareColor, setFlareColor] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [sunRadius, setSunRadius] = useState(0.35);
  const [flareCount, setFlareCount] = useState(3);
  const [autoFlareInterval, setAutoFlareInterval] = useState(3000);
  const [glowBlur, setGlowBlur] = useState(40);
  const [speed, setSpeed] = useState(1);
  const [autoFlare, setAutoFlare] = useState(true);
  const [glowEffect, setGlowEffect] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setSunColor(v.sunColor);
    setCoronaColor(v.coronaColor);
    setFlareColor(v.flareColor);
    setBg(v.bg);
    setSunRadius(v.sunRadius);
    setGlowBlur(v.glowBlur);
  }

  const code = [
    `import { SolarFlare } from 'own-the-canvas';`,
    ``,
    `<SolarFlare`,
    `  preset="${preset}"`,
    `  sunColor="${sunColor}"`,
    `  coronaColor="${coronaColor}"`,
    `  flareColor="${flareColor}"`,
    `  backgroundColor="${bg}"`,
    `  sunRadius={${sunRadius}}`,
    `  flareCount={${flareCount}}`,
    `  autoFlare={${autoFlare}}`,
    `  autoFlareInterval={${autoFlareInterval}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  speed={${speed}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <SolarFlare
        preset={preset}
        sunColor={sunColor}
        coronaColor={coronaColor}
        flareColor={flareColor}
        backgroundColor={bg}
        sunRadius={sunRadius}
        flareCount={flareCount}
        autoFlare={autoFlare}
        autoFlareInterval={autoFlareInterval}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        speed={speed}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Click anywhere to trigger a solar flare" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "inferno", "plasma", "neon", "white-dwarf"]} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Sun color" value={sunColor} onChange={setSunColor} />
        <PColor label="Corona color" value={coronaColor} onChange={setCoronaColor} />
        <PColor label="Flare color" value={flareColor} onChange={setFlareColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Auto flare" value={autoFlare} onChange={setAutoFlare} />
        <PToggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
      </div>
      <div>
        <PSlider label="Sun radius" value={sunRadius} min={0.1} max={0.45} step={0.01} onChange={setSunRadius} />
        <PSlider label="Flare count" value={flareCount} min={1} max={8} step={1} onChange={setFlareCount} />
        <PSlider label="Flare interval (ms)" value={autoFlareInterval} min={500} max={8000} step={500} onChange={setAutoFlareInterval} />
        <PSlider label="Glow blur" value={glowBlur} min={5} max={100} step={5} onChange={setGlowBlur} />
        <PSlider label="Speed" value={speed} min={0.2} max={3} step={0.1} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function SolarFlarePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="SolarFlare"
      lead="A living star with boiling convection cells, glowing corona rings, and dramatic plasma flares that arc from the surface. Click to trigger an eruption."
    >
      <SolarFlarePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
