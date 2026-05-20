import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Lissajous } from "../../../components/Lissajous";
import type { LissajousColorMode } from "../../../components/Lissajous/useLissajous";

const PROPS = [
  { name: "freqX",          type: "number",             default: "3",          description: "Horizontal frequency a." },
  { name: "freqY",          type: "number",             default: "2",          description: "Vertical frequency b." },
  { name: "phaseShift",     type: "number",             default: "0",          description: "Initial phase delta δ in degrees." },
  { name: "phaseSpeed",     type: "number",             default: "0.5",        description: "Phase advance per frame in degrees." },
  { name: "amplitude",      type: "number",             default: "0.9",        description: "Curve amplitude as fraction of canvas half-size." },
  { name: "color",          type: "string",             default: '"#ffffff"',  description: "Curve stroke color." },
  { name: "backgroundColor",type: "string",             default: '"#111111"',  description: "Canvas background fill color." },
  { name: "lineWidth",      type: "number",             default: "1.5",        description: "Stroke line width." },
  { name: "trailFade",      type: "number",             default: "0.04",       description: "Background fade opacity per frame — lower = longer trails." },
  { name: "glowEffect",     type: "boolean",            default: "false",      description: "Enable glow shadow on stroke." },
  { name: "glowBlur",       type: "number",             default: "12",         description: "Shadow blur radius when glowEffect is enabled." },
  { name: "colorMode",      type: "LissajousColorMode", default: '"solid"',    description: '"solid" | "cycle" — hue cycles with phase.' },
  { name: "curvePoints",    type: "number",             default: "600",        description: "Parametric curve sample count." },
  { name: "animated",       type: "boolean",            default: "true",       description: "Enable animation." },
  { name: "speed",          type: "number",             default: "1",          description: "Animation speed multiplier." },
  { name: "preset",         type: "string",             default: "—",          description: '"default" | "butterfly" | "star" | "web" | "neon" | "crystal"' },
];

const PRESET_PARAMS = {
  default:   { freqX: 3, freqY: 2, phaseSpeed: 0.5, lineWidth: 1.5, glowEffect: false, colorMode: "solid" as LissajousColorMode, bg: "#111111" },
  butterfly: { freqX: 3, freqY: 2, phaseSpeed: 0.5, lineWidth: 1.5, glowEffect: false, colorMode: "solid" as LissajousColorMode, bg: "#111111" },
  star:      { freqX: 5, freqY: 4, phaseSpeed: 0.5, lineWidth: 1.5, glowEffect: false, colorMode: "solid" as LissajousColorMode, bg: "#111111" },
  web:       { freqX: 7, freqY: 6, phaseSpeed: 0.5, lineWidth: 1.5, glowEffect: false, colorMode: "cycle" as LissajousColorMode, bg: "#111111" },
  neon:      { freqX: 3, freqY: 2, phaseSpeed: 0.5, lineWidth: 2,   glowEffect: true,  colorMode: "cycle" as LissajousColorMode, bg: "#000000" },
  crystal:   { freqX: 5, freqY: 3, phaseSpeed: 0.5, lineWidth: 2,   glowEffect: true,  colorMode: "cycle" as LissajousColorMode, bg: "#000510" },
};

function LissajousPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]         = useState("default");
  const [freqX, setFreqX]           = useState(3);
  const [freqY, setFreqY]           = useState(2);
  const [phaseSpeed, setPhaseSpeed] = useState(0.5);
  const [amplitude, setAmplitude]   = useState(0.9);
  const [color, setColor]           = useState("#ffffff");
  const [bg, setBg]                 = useState("#111111");
  const [lineWidth, setLineWidth]   = useState(1.5);
  const [trailFade, setTrailFade]   = useState(0.04);
  const [glowEffect, setGlowEffect] = useState(false);
  const [glowBlur, setGlowBlur]     = useState(12);
  const [colorMode, setColorMode]   = useState<LissajousColorMode>("solid");
  const [animated, setAnimated]     = useState(true);
  const [speed, setSpeed]           = useState(1);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setFreqX(pp.freqX);
    setFreqY(pp.freqY);
    setPhaseSpeed(pp.phaseSpeed);
    setLineWidth(pp.lineWidth);
    setGlowEffect(pp.glowEffect);
    setColorMode(pp.colorMode);
    setBg(pp.bg);
  }

  const code = [
    `import { Lissajous } from 'own-the-canvas';`,
    ``,
    `<Lissajous`,
    `  preset="${preset}"`,
    `  freqX={${freqX}}`,
    `  freqY={${freqY}}`,
    `  phaseSpeed={${phaseSpeed}}`,
    `  amplitude={${amplitude}}`,
    `  color="${color}"`,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  trailFade={${trailFade}}`,
    colorMode !== "solid" ? `  colorMode="${colorMode}"` : null,
    glowEffect ? `  glowEffect` : null,
    glowEffect && glowBlur !== 12 ? `  glowBlur={${glowBlur}}` : null,
    speed !== 1 ? `  speed={${speed}}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Lissajous
        preset={preset}
        freqX={freqX}
        freqY={freqY}
        phaseSpeed={phaseSpeed}
        amplitude={amplitude}
        color={color}
        backgroundColor={bg}
        lineWidth={lineWidth}
        trailFade={trailFade}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        colorMode={colorMode}
        animated={animated}
        speed={speed}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "butterfly", "star", "web", "neon", "crystal"]} onChange={handlePreset} />
        <PDivider />
        <PSel label="Color mode" value={colorMode} options={["solid", "cycle"]} onChange={(v) => setColorMode(v as LissajousColorMode)} />
        <PDivider />
        <PColor label="Color"      value={color} onChange={setColor} />
        <PColor label="Background" value={bg}    onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
        <PToggle label="Animated"    value={animated}   onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Freq X"      value={freqX}      min={1}   max={12}   step={1}     onChange={setFreqX} />
        <PSlider label="Freq Y"      value={freqY}      min={1}   max={12}   step={1}     onChange={setFreqY} />
        <PSlider label="Phase speed" value={phaseSpeed} min={0}   max={3}    step={0.05}  onChange={setPhaseSpeed} />
        <PSlider label="Amplitude"   value={amplitude}  min={0.3} max={1}    step={0.01}  onChange={setAmplitude} />
        <PSlider label="Line width"  value={lineWidth}  min={0.5} max={6}    step={0.1}   onChange={setLineWidth} />
        <PSlider label="Trail fade"  value={trailFade}  min={0}   max={0.2}  step={0.005} onChange={setTrailFade} />
        <PSlider label="Speed"       value={speed}      min={0.1} max={5}    step={0.1}   onChange={setSpeed} />
        {glowEffect && <PSlider label="Glow blur" value={glowBlur} min={2} max={40} step={1} onChange={setGlowBlur} />}
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function LissajousPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Lissajous"
      lead="Parametric Lissajous curves that morph continuously as their phase difference advances. Adjust frequency ratios to reveal entirely different curve topologies — from simple ellipses to intricate 12-petaled flowers."
    >
      <LissajousPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Drag <strong>Freq X</strong> and <strong>Freq Y</strong> sliders to change curve topology. Enable <strong>cycle</strong> color mode for a shifting hue that follows the phase, then lower trail fade to watch ghost layers accumulate. The <strong>neon</strong> preset combines all three effects for a glowing oscilloscope look.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
