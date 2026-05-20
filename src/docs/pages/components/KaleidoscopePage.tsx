import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Kaleidoscope } from "../../../components/Kaleidoscope";

const PROPS = [
  { name: "segments",       type: "number",  default: "8",          description: "Number of mirror segments / symmetry (2–16)." },
  { name: "speed",          type: "number",  default: "1",          description: "Animation speed multiplier." },
  { name: "colorA",         type: "string",  default: '"#e0e0ff"',  description: "Color at noise peak." },
  { name: "colorB",         type: "string",  default: '"#1a0a2e"',  description: "Color at noise trough." },
  { name: "backgroundColor",type: "string",  default: '"#111111"',  description: "Background color outside the pattern radius." },
  { name: "noiseScale",     type: "number",  default: "2.5",        description: "Noise spatial frequency — higher = finer detail." },
  { name: "zoomSpeed",      type: "number",  default: "0.3",        description: "Radial zoom/pulse animation speed." },
  { name: "rotation",       type: "number",  default: "0.2",        description: "Whole-pattern rotation speed in degrees per frame." },
  { name: "resolution",     type: "number",  default: "0.5",        description: "Render resolution fraction — lower is faster." },
  { name: "animated",       type: "boolean", default: "true",       description: "Enable animation." },
  { name: "preset",         type: "string",  default: "—",          description: '"default" | "neon" | "crystal" | "void" | "fire" | "ice"' },
];

const PRESET_PARAMS = {
  default: { segments: 8,  colorA: "#e0e0ff", colorB: "#1a0a2e", bg: "#111111", noiseScale: 2.5, zoomSpeed: 0.3, rotation: 0.2, speed: 1   },
  neon:    { segments: 8,  colorA: "#00ffff", colorB: "#ff00ff", bg: "#000000", noiseScale: 3, zoomSpeed: 0.3, rotation: 0.2, speed: 1.5 },
  crystal: { segments: 12, colorA: "#88ccff", colorB: "#002244", bg: "#000510", noiseScale: 4, zoomSpeed: 0.3, rotation: 0.2, speed: 1   },
  void:    { segments: 6,  colorA: "#cc00ff", colorB: "#000000", bg: "#000000", noiseScale: 3, zoomSpeed: 0.3, rotation: 0.4, speed: 1   },
  fire:    { segments: 6,  colorA: "#ff8800", colorB: "#ff0000", bg: "#0a0000", noiseScale: 3, zoomSpeed: 0.3, rotation: 0.2, speed: 2   },
  ice:     { segments: 10, colorA: "#ffffff", colorB: "#002255", bg: "#000510", noiseScale: 2, zoomSpeed: 0.5, rotation: 0.2, speed: 1   },
};

function KaleidoscopePlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]       = useState("default");
  const [segments, setSegments]   = useState(8);
  const [speed, setSpeed]         = useState(1);
  const [colorA, setColorA]       = useState("#e0e0ff");
  const [colorB, setColorB]       = useState("#1a0a2e");
  const [bg, setBg]               = useState("#111111");
  const [noiseScale, setNoise]    = useState(2.5);
  const [zoomSpeed, setZoom]      = useState(0.3);
  const [rotation, setRotation]   = useState(0.2);
  const [resolution, setRes]      = useState(0.5);
  const [animated, setAnimated]   = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setSegments(pp.segments);
    setColorA(pp.colorA);
    setColorB(pp.colorB);
    setBg(pp.bg);
    setNoise(pp.noiseScale);
    setZoom(pp.zoomSpeed);
    setRotation(pp.rotation);
    setSpeed(pp.speed);
  }

  const code = [
    `import { Kaleidoscope } from 'own-the-canvas';`,
    ``,
    `<Kaleidoscope`,
    `  preset="${preset}"`,
    `  segments={${segments}}`,
    `  colorA="${colorA}"`,
    `  colorB="${colorB}"`,
    `  backgroundColor="${bg}"`,
    noiseScale !== 3 ? `  noiseScale={${noiseScale}}` : null,
    zoomSpeed !== 0.3 ? `  zoomSpeed={${zoomSpeed}}` : null,
    rotation !== 0.2 ? `  rotation={${rotation}}` : null,
    speed !== 1 ? `  speed={${speed}}` : null,
    resolution !== 0.5 ? `  resolution={${resolution}}` : null,
    !animated ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Kaleidoscope
        preset={preset}
        segments={segments}
        speed={speed}
        colorA={colorA}
        colorB={colorB}
        backgroundColor={bg}
        noiseScale={noiseScale}
        zoomSpeed={zoomSpeed}
        rotation={rotation}
        resolution={resolution}
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
        <PSel label="Preset" value={preset} options={["default", "neon", "crystal", "void", "fire", "ice"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Color A (peak)"   value={colorA} onChange={setColorA} />
        <PColor label="Color B (trough)" value={colorB} onChange={setColorB} />
        <PColor label="Background"       value={bg}     onChange={setBg} />
        <PDivider />
        <PToggle label="Animated" value={animated} onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Segments"    value={segments}   min={2}    max={16}  step={1}    onChange={setSegments} />
        <PSlider label="Speed"       value={speed}      min={0.1}  max={5}   step={0.1}  onChange={setSpeed} />
        <PSlider label="Noise scale" value={noiseScale} min={1}    max={8}   step={0.5}  onChange={setNoise} />
        <PSlider label="Zoom speed"  value={zoomSpeed}  min={0}    max={2}   step={0.05} onChange={setZoom} />
        <PSlider label="Rotation"    value={rotation}   min={-2}   max={2}   step={0.05} onChange={setRotation} />
        <PSlider label="Resolution"  value={resolution} min={0.15} max={1}   step={0.05} onChange={setRes} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function KaleidoscopePage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Kaleidoscope"
      lead="Animated fractal noise folded into rotationally symmetric kaleidoscope patterns. Segments, rotation speed, and color pairing transform the same underlying noise into infinite visual variations."
    >
      <KaleidoscopePlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Try the <strong>neon</strong> preset for a cyan/magenta psychedelic look, or <strong>crystal</strong> at 12 segments for a snowflake-like structure. Drag <strong>segments</strong> from 2 to 16 to see how the symmetry changes the visual character entirely. Lower <strong>resolution</strong> for better performance on large canvases.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
