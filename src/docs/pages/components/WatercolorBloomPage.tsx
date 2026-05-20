import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { WatercolorBloom } from "../../../components/WatercolorBloom";

const PROPS = [
  { name: "colors",            type: "string[]", default: '["#ffffff","#6b7280","#9ca3af"]', description: "Bloom color palette." },
  { name: "backgroundColor",   type: "string",   default: '"#111111"',                       description: "Canvas background color." },
  { name: "bloomRadius",       type: "number",   default: "80",                              description: "Max bloom radius in px." },
  { name: "bloomSpeed",        type: "number",   default: "0.5",                             description: "Bloom expansion speed 0–2." },
  { name: "opacity",           type: "number",   default: "0.15",                            description: "Per-layer opacity 0–1." },
  { name: "wetEdge",           type: "number",   default: "0.4",                             description: "Wet-edge darkening strength 0–1." },
  { name: "layerCount",        type: "number",   default: "6",                               description: "Concentric layers per bloom." },
  { name: "noiseAmount",       type: "number",   default: "0.5",                             description: "Edge noise/organic distortion 0–1." },
  { name: "fadeSpeed",         type: "number",   default: "0.001",                           description: "Bloom fade rate per frame." },
  { name: "interactive",       type: "boolean",  default: "true",                            description: "Click to spawn blooms." },
  { name: "autoBloom",         type: "boolean",  default: "true",                            description: "Auto-spawn blooms at intervals." },
  { name: "autoBloomInterval", type: "number",   default: "1500",                            description: "Ms between auto blooms." },
  { name: "resolution",        type: "number",   default: "0.5",                             description: "Render resolution fraction — lower is faster." },
  { name: "animated",          type: "boolean",  default: "true",                            description: "Enable animation." },
  { name: "maxBlooms",         type: "number",   default: "12",                              description: "Max concurrent blooms." },
  { name: "preset",            type: "string",   default: "—",                               description: '"default" | "sunset" | "ocean" | "spring" | "monochrome" | "neon"' },
];

const PRESET_PARAMS = {
  default:    { color1: "#ffffff", color2: "#6b7280", color3: "#9ca3af", bg: "#111111", bloomRadius: 80,  opacity: 0.15, wetEdge: 0.4, layerCount: 6, noiseAmount: 0.5 },
  sunset:     { color1: "#f97316", color2: "#ec4899", color3: "#8b5cf6", bg: "#0a0005", bloomRadius: 100, opacity: 0.18, wetEdge: 0.5, layerCount: 6, noiseAmount: 0.5 },
  ocean:      { color1: "#0ea5e9", color2: "#06b6d4", color3: "#6366f1", bg: "#020b18", bloomRadius: 90,  opacity: 0.15, wetEdge: 0.35,layerCount: 6, noiseAmount: 0.5 },
  spring:     { color1: "#86efac", color2: "#fde68a", color3: "#fbcfe8", bg: "#0a0f05", bloomRadius: 80,  opacity: 0.2,  wetEdge: 0.4, layerCount: 8, noiseAmount: 0.5 },
  monochrome: { color1: "#ffffff", color2: "#d1d5db", color3: "#9ca3af", bg: "#111111", bloomRadius: 100, opacity: 0.12, wetEdge: 0.6, layerCount: 6, noiseAmount: 0.5 },
  neon:       { color1: "#f0abfc", color2: "#67e8f9", color3: "#c084fc", bg: "#050010", bloomRadius: 110, opacity: 0.2,  wetEdge: 0.7, layerCount: 6, noiseAmount: 0.6 },
};

function WatercolorBloomPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]           = useState("default");
  const [color1, setColor1]           = useState("#ffffff");
  const [color2, setColor2]           = useState("#6b7280");
  const [color3, setColor3]           = useState("#9ca3af");
  const [bg, setBg]                   = useState("#111111");
  const [bloomRadius, setBloomRadius] = useState(80);
  const [bloomSpeed, setBloomSpeed]   = useState(0.5);
  const [opacity, setOpacity]         = useState(0.15);
  const [wetEdge, setWetEdge]         = useState(0.4);
  const [layerCount, setLayers]       = useState(6);
  const [noiseAmount, setNoise]       = useState(0.5);
  const [fadeSpeed, setFadeSpeed]     = useState(0.001);
  const [interactive, setInteract]    = useState(true);
  const [autoBloom, setAutoBloom]     = useState(true);
  const [autoInterval, setAutoInt]    = useState(1500);
  const [resolution, setRes]          = useState(0.5);
  const [animated, setAnimated]       = useState(true);
  const [maxBlooms, setMaxBlooms]     = useState(12);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setColor1(pp.color1);
    setColor2(pp.color2);
    setColor3(pp.color3);
    setBg(pp.bg);
    setBloomRadius(pp.bloomRadius);
    setOpacity(pp.opacity);
    setWetEdge(pp.wetEdge);
    setLayers(pp.layerCount);
    setNoise(pp.noiseAmount);
  }

  const colors = [color1, color2, color3];

  const code = [
    `import { WatercolorBloom } from 'own-the-canvas';`,
    ``,
    `<WatercolorBloom`,
    `  preset="${preset}"`,
    `  colors={${JSON.stringify(colors)}}`,
    `  backgroundColor="${bg}"`,
    `  bloomRadius={${bloomRadius}}`,
    `  bloomSpeed={${bloomSpeed}}`,
    `  opacity={${opacity}}`,
    `  wetEdge={${wetEdge}}`,
    `  layerCount={${layerCount}}`,
    `  noiseAmount={${noiseAmount}}`,
    `  fadeSpeed={${fadeSpeed}}`,
    `  interactive={${interactive}}`,
    `  autoBloom={${autoBloom}}`,
    `  autoBloomInterval={${autoInterval}}`,
    `  resolution={${resolution}}`,
    `  animated={${animated}}`,
    `  maxBlooms={${maxBlooms}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <WatercolorBloom
        preset={preset}
        colors={colors}
        backgroundColor={bg}
        bloomRadius={bloomRadius}
        bloomSpeed={bloomSpeed}
        opacity={opacity}
        wetEdge={wetEdge}
        layerCount={layerCount}
        noiseAmount={noiseAmount}
        fadeSpeed={fadeSpeed}
        interactive={interactive}
        autoBloom={autoBloom}
        autoBloomInterval={autoInterval}
        resolution={resolution}
        animated={animated}
        maxBlooms={maxBlooms}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "sunset", "ocean", "spring", "monochrome", "neon"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Color 1"    value={color1} onChange={setColor1} />
        <PColor label="Color 2"    value={color2} onChange={setColor2} />
        <PColor label="Color 3"    value={color3} onChange={setColor3} />
        <PColor label="Background" value={bg}     onChange={setBg} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteract} />
        <PToggle label="Auto bloom"  value={autoBloom}   onChange={setAutoBloom} />
        <PToggle label="Animated"    value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Bloom radius"     value={bloomRadius}  min={20}   max={300}  step={5}      onChange={setBloomRadius} />
        <PSlider label="Bloom speed"      value={bloomSpeed}   min={0.1}  max={3}    step={0.05}   onChange={setBloomSpeed} />
        <PSlider label="Opacity"          value={opacity}      min={0.01} max={0.5}  step={0.01}   onChange={setOpacity} />
        <PSlider label="Wet edge"         value={wetEdge}      min={0}    max={1}    step={0.05}   onChange={setWetEdge} />
        <PSlider label="Layers"           value={layerCount}   min={2}    max={16}   step={1}      onChange={setLayers} />
        <PSlider label="Noise amount"     value={noiseAmount}  min={0}    max={1}    step={0.05}   onChange={setNoise} />
        <PSlider label="Fade speed"       value={fadeSpeed}    min={0}    max={0.01} step={0.0005} onChange={setFadeSpeed} />
        <PSlider label="Auto interval ms" value={autoInterval} min={200}  max={5000} step={100}    onChange={setAutoInt} />
        <PSlider label="Max blooms"       value={maxBlooms}    min={1}    max={30}   step={1}      onChange={setMaxBlooms} />
        <PSlider label="Resolution"       value={resolution}   min={0.1}  max={1}    step={0.05}   onChange={setRes} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function WatercolorBloomPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="WatercolorBloom"
      lead="Soft watercolor washes that bloom and layer with wet-edge effects. Click the canvas to spawn blooms at your cursor. Each bloom grows organically with noisy edges and a characteristic wet paper ring."
    >
      <WatercolorBloomPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Try <strong>sunset</strong> or <strong>spring</strong> for vivid multi-color washes. Raise <strong>wet edge</strong> for a pronounced watercolor ring. Lower <strong>opacity</strong> and increase <strong>max blooms</strong> for a dense, layered painting. Click anywhere to add blooms on demand.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
