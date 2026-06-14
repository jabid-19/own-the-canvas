import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import {
  PlaygroundShell,
  PSel,
  PSlider,
  PColor,
  PToggle,
  PDivider,
  PLiveLabel,
} from "../../components/PlaygroundControls";
import { TopographicContours } from "../../../components/TopographicContours";

const PROPS = [
  { name: "resolution",       type: "number",   default: "8",         description: "Grid cell size in px — lower = more detail, slower." },
  { name: "contourLevels",    type: "number",   default: "12",        description: "Number of contour lines drawn." },
  { name: "speed",            type: "number",   default: "0.3",       description: "Noise evolution speed — 0 freezes the landscape." },
  { name: "noiseScale",       type: "number",   default: "3",         description: "Spatial scale of the noise — higher = more zoomed in." },
  { name: "octaves",          type: "number",   default: "4",         description: "Fractal noise octaves — higher = more detail." },
  { name: "lineColor",        type: "string",   default: '"#ffffff"', description: "Contour line stroke color." },
  { name: "lineWidth",        type: "number",   default: "1",         description: "Base contour stroke width in px." },
  { name: "lineOpacity",      type: "number",   default: "0.6",       description: "Contour line opacity (0–1)." },
  { name: "backgroundColor",  type: "string",   default: '"#111111"', description: "Canvas background color." },
  { name: "filled",           type: "boolean",  default: "false",     description: "Fill elevation bands between contour lines." },
  { name: "fillColors",       type: "string[]", default: "[]",        description: "Color ramp for filled elevation bands (low → high)." },
  { name: "animated",         type: "boolean",  default: "true",      description: "Enable continuous noise animation." },
  { name: "glowEffect",       type: "boolean",  default: "false",     description: "Apply a glow/bloom effect to contour lines." },
  { name: "preset",           type: "string",   default: "—",         description: '"default" | "terrain" | "ocean" | "heat" | "neon" | "minimal"' },
];

function TopographicContoursPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]             = useState("default");
  const [contourLevels, setContourLevels] = useState(12);
  const [resolution, setResolution]     = useState(8);
  const [speed, setSpeed]               = useState(0.3);
  const [noiseScale, setNoiseScale]     = useState(3);
  const [lineOpacity, setLineOpacity]   = useState(0.6);
  const [lineColor, setLineColor]       = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#111111");
  const [glowEffect, setGlowEffect]     = useState(false);
  const [filled, setFilled]             = useState(false);

  const isPresetControlled = preset !== "default" && preset !== "neon" && preset !== "minimal";

  // Derive fill colors from preset for the live preview
  const presetFillMap: Record<string, string[]> = {
    terrain: ["#0d2136","#1a3a5c","#2d6a4f","#52b788","#d4a96a","#a8836e","#e8e8e8","#ffffff"],
    ocean:   ["#03045e","#0077b6","#00b4d8","#48cae4","#90e0ef","#ade8f4","#caf0f8","#ffffff"],
    heat:    ["#03071e","#6a040f","#d00000","#e85d04","#f48c06","#faa307","#ffba08","#ffffff"],
  };

  const fillColors: string[] = presetFillMap[preset] ?? [];
  const showFilledNote = filled && fillColors.length === 0 && !isPresetControlled;

  const code = [
    `import { TopographicContours } from 'own-the-canvas';`,
    ``,
    `<TopographicContours`,
    `  preset="${preset}"`,
    preset === "default" || preset === "neon" || preset === "minimal"
      ? `  lineColor="${lineColor}"`
      : null,
    preset === "default" || preset === "neon" || preset === "minimal"
      ? `  backgroundColor="${backgroundColor}"`
      : null,
    `  contourLevels={${contourLevels}}`,
    `  resolution={${resolution}}`,
    `  speed={${speed}}`,
    `  noiseScale={${noiseScale}}`,
    `  lineOpacity={${lineOpacity}}`,
    glowEffect ? `  glowEffect={true}` : null,
    filled && !isPresetControlled ? `  filled={true}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <TopographicContours
        preset={preset}
        contourLevels={contourLevels}
        resolution={resolution}
        speed={speed}
        noiseScale={noiseScale}
        lineOpacity={lineOpacity}
        lineColor={preset === "default" || preset === "neon" || preset === "minimal" ? lineColor : undefined}
        backgroundColor={preset === "default" || preset === "neon" || preset === "minimal" ? backgroundColor : undefined}
        glowEffect={glowEffect}
        filled={filled || isPresetControlled}
        fillColors={fillColors.length > 0 ? fillColors : undefined}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Noise evolves continuously · Contours flow in real time" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel
          label="Preset"
          value={preset}
          options={["default", "terrain", "ocean", "heat", "neon", "minimal"]}
          onChange={(v) => {
            setPreset(v);
            // Reset per-preset defaults when switching
            if (v === "terrain")      { setLineColor("#000000"); setBackgroundColor("#1a2040"); setLineOpacity(0.3); setContourLevels(10); setFilled(true); }
            else if (v === "ocean")   { setLineColor("#ffffff"); setBackgroundColor("#020818"); setLineOpacity(0.2); setContourLevels(8);  setFilled(true); }
            else if (v === "heat")    { setLineColor("#000000"); setBackgroundColor("#03071e"); setLineOpacity(0.4); setContourLevels(12); setFilled(true); }
            else if (v === "neon")    { setLineColor("#00ffcc"); setBackgroundColor("#000000"); setLineOpacity(0.8); setGlowEffect(true);  setFilled(false); }
            else if (v === "minimal") { setLineColor("#6b7280"); setBackgroundColor("#111111"); setLineOpacity(0.4); setContourLevels(8);  setFilled(false); setGlowEffect(false); }
            else                      { setLineColor("#ffffff"); setBackgroundColor("#111111"); setLineOpacity(0.6); setContourLevels(12); setFilled(false); setGlowEffect(false); }
          }}
        />
        <PDivider />
        <PSlider label="Contour levels" value={contourLevels} min={4}  max={20} step={1}    onChange={setContourLevels} />
        <PSlider label="Resolution"     value={resolution}    min={4}  max={16} step={2}    onChange={setResolution} />
        <PSlider label="Speed"          value={speed}         min={0}  max={1}  step={0.05} onChange={setSpeed} />
        <PSlider label="Noise scale"    value={noiseScale}    min={1}  max={8}  step={0.5}  onChange={setNoiseScale} />
      </div>
      <div>
        <PSlider label="Line opacity" value={lineOpacity} min={0} max={1} step={0.05} onChange={setLineOpacity} />
        <PColor  label="Line color"   value={lineColor}   onChange={setLineColor} />
        <PColor  label="Background"   value={backgroundColor} onChange={setBackgroundColor} />
        <PDivider />
        <PToggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
        <PToggle label="Filled bands" value={filled || isPresetControlled} onChange={(v) => { if (!isPresetControlled) setFilled(v); }} />
        {showFilledNote && (
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: "4px 0 0", lineHeight: 1.4 }}>
            Fill colors are defined per preset — select terrain, ocean, or heat to see them.
          </p>
        )}
        {isPresetControlled && (
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: "4px 0 0", lineHeight: 1.4 }}>
            Fill colors are controlled by the <strong>{preset}</strong> preset.
          </p>
        )}
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function TopographicContoursPage() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <PageShell
      eyebrow="Component"
      title="TopographicContours"
      lead="Evolving Perlin noise turned into a living topographic map. Contour lines trace elevation across a shifting landscape. Switch presets to explore terrain, ocean depths, heat maps, and more."
    >
      <TopographicContoursPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
