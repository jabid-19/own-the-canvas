import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Spirograph } from "../../../components/Spirograph";
import type { SpirographColorMode } from "../../../components/Spirograph/useSpirograph";

const PROPS = [
  { name: "outerRadius",     type: "number",             default: "0.85",      description: "Outer circle R as fraction of min(width,height)/2." },
  { name: "innerRadius",     type: "number",             default: "0.4",       description: "Inner circle r as fraction of outerRadius." },
  { name: "penDistance",     type: "number",             default: "0.9",       description: "Pen arm d as fraction of innerRadius." },
  { name: "speed",           type: "number",             default: "2",         description: "Degrees of angle drawn per frame." },
  { name: "color",           type: "string",             default: '"#ffffff"', description: "Primary curve stroke color." },
  { name: "color2",          type: "string",             default: '"#6b7280"', description: "Secondary color used in gradient colorMode." },
  { name: "backgroundColor", type: "string",             default: '"#111111"', description: "Canvas background fill color." },
  { name: "lineWidth",       type: "number",             default: "1",         description: "Stroke line width." },
  { name: "trailFade",       type: "number",             default: "0.003",     description: "Background fade opacity per frame — lower = longer trails." },
  { name: "animated",        type: "boolean",            default: "true",      description: "Enable animation." },
  { name: "autoReset",       type: "boolean",            default: "true",      description: "Randomize and restart after each full cycle." },
  { name: "layerCount",      type: "number",             default: "1",         description: "Overlapping curve layers with slight radius offsets." },
  { name: "colorMode",       type: "SpirographColorMode",default: '"solid"',   description: '"solid" | "cycle" | "gradient" — how the stroke color is computed.' },
  { name: "symmetry",        type: "number",             default: "1",         description: "Draw N rotationally symmetric copies around center." },
  { name: "glowEffect",      type: "boolean",            default: "false",     description: "Enable glow / shadow blur on strokes." },
  { name: "glowBlur",        type: "number",             default: "10",        description: "Shadow blur radius when glowEffect is enabled." },
  { name: "preset",          type: "string",             default: "—",         description: '"default" | "neon" | "prismatic" | "mandala" | "cosmic" | "minimal"' },
];

const PRESET_PARAMS = {
  default:   { colorMode: "solid" as SpirographColorMode, color: "#ffffff", color2: "#6b7280", bg: "#111111", lineWidth: 1,   layerCount: 1, symmetry: 1, glowEffect: false, glowBlur: 10, trailFade: 0.003, speed: 2   },
  neon:      { colorMode: "cycle" as SpirographColorMode, color: "#ffffff", color2: "#6b7280", bg: "#000000", lineWidth: 1.5, layerCount: 1, symmetry: 1, glowEffect: true,  glowBlur: 15, trailFade: 0.005, speed: 2   },
  prismatic: { colorMode: "cycle" as SpirographColorMode, color: "#ffffff", color2: "#6b7280", bg: "#050005", lineWidth: 1,   layerCount: 3, symmetry: 2, glowEffect: false, glowBlur: 10, trailFade: 0.004, speed: 2   },
  mandala:   { colorMode: "gradient" as SpirographColorMode, color: "#ff00ff", color2: "#00ffff", bg: "#000000", lineWidth: 1, layerCount: 2, symmetry: 6, glowEffect: true, glowBlur: 12, trailFade: 0.002, speed: 2   },
  cosmic:    { colorMode: "cycle" as SpirographColorMode, color: "#ffffff", color2: "#6b7280", bg: "#020008", lineWidth: 1,   layerCount: 4, symmetry: 1, glowEffect: true,  glowBlur: 10, trailFade: 0.002, speed: 2   },
  minimal:   { colorMode: "solid" as SpirographColorMode, color: "#ffffff", color2: "#6b7280", bg: "#111111", lineWidth: 0.5, layerCount: 1, symmetry: 1, glowEffect: false, glowBlur: 10, trailFade: 0.001, speed: 0.5 },
};

function SpirographPlayground() {
  const [preset, setPreset]           = useState("default");
  const [innerRadius, setInnerRadius] = useState(0.4);
  const [penDistance, setPenDistance] = useState(0.9);
  const [speed, setSpeed]             = useState(2);
  const [color, setColor]             = useState("#ffffff");
  const [color2, setColor2]           = useState("#6b7280");
  const [bg, setBg]                   = useState("#111111");
  const [lineWidth, setLineWidth]     = useState(1);
  const [trailFade, setTrailFade]     = useState(0.003);
  const [animated, setAnimated]       = useState(true);
  const [autoReset, setAutoReset]     = useState(true);
  const [layerCount, setLayerCount]   = useState(1);
  const [colorMode, setColorMode]     = useState<SpirographColorMode>("solid");
  const [symmetry, setSymmetry]       = useState(1);
  const [glowEffect, setGlowEffect]   = useState(false);
  const [glowBlur, setGlowBlur]       = useState(10);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setColorMode(pp.colorMode);
    setColor(pp.color);
    setColor2(pp.color2);
    setBg(pp.bg);
    setLineWidth(pp.lineWidth);
    setLayerCount(pp.layerCount);
    setSymmetry(pp.symmetry);
    setGlowEffect(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setTrailFade(pp.trailFade);
    setSpeed(pp.speed);
  }

  const code = [
    `import { Spirograph } from 'own-the-canvas';`,
    ``,
    `<Spirograph`,
    `  preset="${preset}"`,
    `  innerRadius={${innerRadius}}`,
    `  penDistance={${penDistance}}`,
    `  speed={${speed}}`,
    `  color="${color}"`,
    colorMode === "gradient" ? `  color2="${color2}"` : null,
    `  backgroundColor="${bg}"`,
    `  lineWidth={${lineWidth}}`,
    `  trailFade={${trailFade}}`,
    colorMode !== "solid" ? `  colorMode="${colorMode}"` : null,
    layerCount !== 1 ? `  layerCount={${layerCount}}` : null,
    symmetry !== 1 ? `  symmetry={${symmetry}}` : null,
    glowEffect ? `  glowEffect` : null,
    glowEffect && glowBlur !== 10 ? `  glowBlur={${glowBlur}}` : null,
    !animated ? `  animated={false}` : null,
    !autoReset ? `  autoReset={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Spirograph
        preset={preset}
        innerRadius={innerRadius}
        penDistance={penDistance}
        speed={speed}
        color={color}
        color2={color2}
        backgroundColor={bg}
        lineWidth={lineWidth}
        trailFade={trailFade}
        animated={animated}
        autoReset={autoReset}
        layerCount={layerCount}
        colorMode={colorMode}
        symmetry={symmetry}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "prismatic", "mandala", "cosmic", "minimal"]} onChange={handlePreset} />
        <PDivider />
        <PSel label="Color mode" value={colorMode} options={["solid", "cycle", "gradient"]} onChange={(v) => setColorMode(v as SpirographColorMode)} />
        <PDivider />
        <PColor label="Color" value={color} onChange={setColor} />
        {colorMode === "gradient" && <PColor label="Color 2" value={color2} onChange={setColor2} />}
        <PColor label="Background" value={bg} onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect"  value={glowEffect}  onChange={setGlowEffect} />
        <PToggle label="Animated"     value={animated}    onChange={setAnimated} />
        <PToggle label="Auto reset"   value={autoReset}   onChange={setAutoReset} />
      </div>
      <div>
        <PSlider label="Inner radius" value={innerRadius} min={0.1}  max={0.9}  step={0.01}  onChange={setInnerRadius} />
        <PSlider label="Pen distance" value={penDistance} min={0.1}  max={1.5}  step={0.01}  onChange={setPenDistance} />
        <PSlider label="Layers"       value={layerCount}  min={1}    max={6}    step={1}     onChange={setLayerCount} />
        <PSlider label="Symmetry"     value={symmetry}    min={1}    max={8}    step={1}     onChange={setSymmetry} />
        <PSlider label="Speed"        value={speed}       min={0.1}  max={8}    step={0.1}   onChange={setSpeed} />
        <PSlider label="Line width"   value={lineWidth}   min={0.2}  max={4}    step={0.1}   onChange={setLineWidth} />
        <PSlider label="Trail fade"   value={trailFade}   min={0}    max={0.02} step={0.001} onChange={setTrailFade} />
        {glowEffect && <PSlider label="Glow blur" value={glowBlur} min={2} max={40} step={1} onChange={setGlowBlur} />}
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function SpirographPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Spirograph"
      lead="Hypotrochoid parametric curves drawn incrementally in real time. Layer multiple curves, cycle hues, add rotational symmetry and glow — produces petals, mandalas, stars, and fractal-like rosettes."
    >
      <SpirographPlayground />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Try the <strong>mandala</strong> preset for 6-fold symmetry with a gradient, or <strong>prismatic</strong> for layered hue-cycling curves. Drag inner radius slowly — each rational value produces a fundamentally different closed curve. Enable <strong>glow effect</strong> on a dark background for a neon laser look.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
