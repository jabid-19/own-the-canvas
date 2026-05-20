import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { PendulaWave } from "../../../components/PendulaWave";
import type { PendulaWaveColorMode } from "../../../components/PendulaWave";

const PROPS = [
  { name: "color",           type: "string",                          default: '"#ffffff"',  description: "Stroke color." },
  { name: "color2",          type: "string",                          default: '"#6b7280"',  description: "Secondary color used in gradient colorMode." },
  { name: "backgroundColor", type: "string",                          default: '"#111111"',  description: "Canvas background." },
  { name: "lineWidth",       type: "number",                          default: "1",          description: "Stroke line width." },
  { name: "trailFade",       type: "number",                          default: "0.01",       description: "Background fade per frame — lower = longer trails." },
  { name: "speed",           type: "number",                          default: "1",          description: "Animation speed multiplier." },
  { name: "damping",         type: "number",                          default: "0.9995",     description: "Energy decay per step (0.999–1)." },
  { name: "freq1",           type: "number",                          default: "2",          description: "Frequency of pendulum 1 (x-axis)." },
  { name: "freq2",           type: "number",                          default: "3",          description: "Frequency of pendulum 2 (y-axis)." },
  { name: "freq3",           type: "number",                          default: "0.01",       description: "Frequency of phase-shift pendulum." },
  { name: "amplitude",       type: "number",                          default: "0.9",        description: "Max swing as fraction of canvas half-size." },
  { name: "colorMode",       type: '"solid" | "cycle" | "gradient"', default: '"solid"',    description: "How stroke color is computed." },
  { name: "glowEffect",      type: "boolean",                         default: "false",      description: "Enable glow." },
  { name: "glowBlur",        type: "number",                          default: "10",         description: "Shadow blur for glow." },
  { name: "animated",        type: "boolean",                         default: "true",       description: "Enable animation." },
  { name: "autoReset",       type: "boolean",                         default: "true",       description: "Restart after damping decays to near-zero." },
  { name: "preset",          type: "string",                          default: "—",          description: '"default" | "neon" | "crystal" | "sand" | "minimal" | "cosmic"' },
];

const PRESET_PARAMS = {
  default: { color: "#ffffff", color2: "#6b7280", bg: "#111111", lineWidth: 1,   trailFade: 0.01,  damping: 0.9995, freq1: 2, freq2: 3, freq3: 0.01, colorMode: "solid",    glowEffect: false, glowBlur: 10 },
  neon:    { color: "#00ffcc", color2: "#ff00aa", bg: "#000000", lineWidth: 1,   trailFade: 0.015, damping: 0.9995, freq1: 2, freq2: 3, freq3: 0.01, colorMode: "cycle",    glowEffect: true,  glowBlur: 12 },
  crystal: { color: "#88ccff", color2: "#ffffff", bg: "#000510", lineWidth: 1,   trailFade: 0.01,  damping: 0.9995, freq1: 3, freq2: 5, freq3: 0.01, colorMode: "gradient", glowEffect: true,  glowBlur: 8 },
  sand:    { color: "#d4a76a", color2: "#7c5c2e", bg: "#1a1005", lineWidth: 1.5, trailFade: 0.005, damping: 0.9998, freq1: 2, freq2: 3, freq3: 0.01, colorMode: "gradient", glowEffect: false, glowBlur: 10 },
  minimal: { color: "#6b7280", color2: "#6b7280", bg: "#111111", lineWidth: 0.8, trailFade: 0.03,  damping: 0.9995, freq1: 2, freq2: 3, freq3: 0.01, colorMode: "solid",    glowEffect: false, glowBlur: 10 },
  cosmic:  { color: "#c084fc", color2: "#38bdf8", bg: "#020010", lineWidth: 1,   trailFade: 0.01,  damping: 0.9995, freq1: 5, freq2: 7, freq3: 0.02, colorMode: "cycle",    glowEffect: true,  glowBlur: 15 },
};

function PendulaWavePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]       = useState("default");
  const [color, setColor]         = useState("#ffffff");
  const [color2, setColor2]       = useState("#6b7280");
  const [bg, setBg]               = useState("#111111");
  const [lineWidth, setLineWidth] = useState(1);
  const [trailFade, setTrailFade] = useState(0.01);
  const [speed, setSpeed]         = useState(1);
  const [damping, setDamping]     = useState(0.9995);
  const [freq1, setFreq1]         = useState(2);
  const [freq2, setFreq2]         = useState(3);
  const [freq3, setFreq3]         = useState(0.01);
  const [amplitude, setAmplitude] = useState(0.9);
  const [colorMode, setColorMode] = useState<PendulaWaveColorMode>("solid");
  const [glowEffect, setGlow]     = useState(false);
  const [glowBlur, setGlowBlur]   = useState(10);
  const [animated, setAnimated]   = useState(true);
  const [autoReset, setAutoReset] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setColor(pp.color);
    setColor2(pp.color2);
    setBg(pp.bg);
    setLineWidth(pp.lineWidth);
    setTrailFade(pp.trailFade);
    setDamping(pp.damping);
    setFreq1(pp.freq1);
    setFreq2(pp.freq2);
    setFreq3(pp.freq3);
    setColorMode(pp.colorMode as PendulaWaveColorMode);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
  }

  const code = [
    `import { PendulaWave } from 'own-the-canvas';`,
    ``,
    `<PendulaWave`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  color2="${color2}"`,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  trailFade={${trailFade}}`,
    `  speed={${speed}}`,
    `  damping={${damping}}`,
    `  freq1={${freq1}}`,
    `  freq2={${freq2}}`,
    `  freq3={${freq3}}`,
    `  amplitude={${amplitude}}`,
    `  colorMode="${colorMode}"`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  animated={${animated}}`,
    `  autoReset={${autoReset}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <PendulaWave
        preset={preset}
        color={color}
        color2={color2}
        backgroundColor={bg}
        lineWidth={lineWidth}
        trailFade={trailFade}
        speed={speed}
        damping={damping}
        freq1={freq1}
        freq2={freq2}
        freq3={freq3}
        amplitude={amplitude}
        colorMode={colorMode}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        animated={animated}
        autoReset={autoReset}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset"     value={preset}    options={["default", "neon", "crystal", "sand", "minimal", "cosmic"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Color"      value={color}  onChange={setColor} />
        <PColor label="Color 2"    value={color2} onChange={setColor2} />
        <PColor label="Background" value={bg}     onChange={setBg} />
        <PDivider />
        <PSel label="Color mode" value={colorMode} options={["solid", "cycle", "gradient"]} onChange={(v) => setColorMode(v as PendulaWaveColorMode)} />
        <PDivider />
        <PToggle label="Glow effect" value={glowEffect} onChange={setGlow} />
        <PToggle label="Animated"    value={animated}   onChange={setAnimated} />
        <PToggle label="Auto reset"  value={autoReset}  onChange={setAutoReset} />
      </div>
      <div>
        <PSlider label="Speed"      value={speed}     min={0.1}   max={5}      step={0.1}    onChange={setSpeed} />
        <PSlider label="Freq 1 (x)" value={freq1}     min={1}     max={10}     step={0.5}    onChange={setFreq1} />
        <PSlider label="Freq 2 (y)" value={freq2}     min={1}     max={10}     step={0.5}    onChange={setFreq2} />
        <PSlider label="Freq 3 (φ)" value={freq3}     min={0}     max={0.1}    step={0.005}  onChange={setFreq3} />
        <PSlider label="Damping"    value={damping}   min={0.998} max={1}      step={0.0001} onChange={setDamping} />
        <PSlider label="Amplitude"  value={amplitude} min={0.1}   max={1}      step={0.05}   onChange={setAmplitude} />
        <PSlider label="Trail fade" value={trailFade} min={0.001} max={0.1}    step={0.001}  onChange={setTrailFade} />
        <PSlider label="Line width" value={lineWidth} min={0.5}   max={5}      step={0.25}   onChange={setLineWidth} />
        <PSlider label="Glow blur"  value={glowBlur}  min={0}     max={40}     step={1}      onChange={setGlowBlur} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function PendulaWavePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="PendulaWave"
      lead="A harmonograph — three coupled pendulums whose combined motion traces intricate Lissajous-like curves. Damping slowly decays the energy, collapsing the pattern to its center before the cycle resets."
    >
      <PendulaWavePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Adjust <strong>freq1</strong> and <strong>freq2</strong> ratios to discover different curve topologies. Try <strong>3:5</strong> for a star, <strong>5:7</strong> for complex rosettes. Lower <strong>trail fade</strong> for a dense drawing. Switch <strong>color mode</strong> to <em>cycle</em> for a rainbow harmonograph.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
