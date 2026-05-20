import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { CrystalGrowth } from "../../../components/CrystalGrowth";
import type { CrystalGrowthColorMode } from "../../../components/CrystalGrowth";

const PROPS = [
  { name: "crystalColor",      type: "string",                     default: '"#ffffff"', description: "Color of crystallized cells." },
  { name: "activeColor",       type: "string",                     default: '"#6b7280"', description: "Color of actively growing frontier." },
  { name: "backgroundColor",   type: "string",                     default: '"#111111"', description: "Background color." },
  { name: "growthSpeed",       type: "number",                     default: "3",         description: "Cells crystallized per frame." },
  { name: "symmetry",          type: "number",                     default: "6",         description: "Rotational symmetry arms (2–12)." },
  { name: "branchProbability", type: "number",                     default: "0.3",       description: "Probability a frontier cell spawns a branch." },
  { name: "noiseAmount",       type: "number",                     default: "0.2",       description: "Random noise in growth direction 0–1." },
  { name: "cellSize",          type: "number",                     default: "3",         description: "Cell size in px." },
  { name: "glowEffect",        type: "boolean",                    default: "true",      description: "Glow on crystal." },
  { name: "glowBlur",          type: "number",                     default: "12",        description: "Shadow blur for glow." },
  { name: "interactive",       type: "boolean",                    default: "true",      description: "Click to seed new growth." },
  { name: "autoReset",         type: "boolean",                    default: "true",      description: "Restart after growth completes." },
  { name: "colorMode",         type: '"solid" | "age" | "cycle"', default: '"solid"',   description: "How crystal cells are colored." },
  { name: "animated",          type: "boolean",                    default: "true",      description: "Enable animation." },
  { name: "preset",            type: "string",                     default: "—",         description: '"default" | "snowflake" | "gem" | "neon" | "frost" | "gold"' },
];

const PRESET_PARAMS = {
  default:   { crystalColor: "#ffffff", activeColor: "#6b7280", bg: "#111111", symmetry: 6,  branchProb: 0.3,  noise: 0.2,  cellSize: 3, glowEffect: true,  glowBlur: 12, colorMode: "solid" },
  snowflake: { crystalColor: "#e0f2fe", activeColor: "#7dd3fc", bg: "#0c1a2e", symmetry: 6,  branchProb: 0.4,  noise: 0.15, cellSize: 3, glowEffect: true,  glowBlur: 10, colorMode: "solid" },
  gem:       { crystalColor: "#c084fc", activeColor: "#e879f9", bg: "#09000f", symmetry: 8,  branchProb: 0.2,  noise: 0.1,  cellSize: 3, glowEffect: true,  glowBlur: 15, colorMode: "age" },
  neon:      { crystalColor: "#00ffcc", activeColor: "#ff00aa", bg: "#000000", symmetry: 4,  branchProb: 0.35, noise: 0.3,  cellSize: 3, glowEffect: true,  glowBlur: 18, colorMode: "cycle" },
  frost:     { crystalColor: "#bae6fd", activeColor: "#ffffff", bg: "#0a1628", symmetry: 6,  branchProb: 0.5,  noise: 0.25, cellSize: 2, glowEffect: true,  glowBlur: 8,  colorMode: "solid" },
  gold:      { crystalColor: "#fbbf24", activeColor: "#f59e0b", bg: "#0a0500", symmetry: 12, branchProb: 0.15, noise: 0.05, cellSize: 3, glowEffect: true,  glowBlur: 12, colorMode: "age" },
};

function CrystalGrowthPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]           = useState("default");
  const [crystalColor, setCrystal]    = useState("#ffffff");
  const [activeColor, setActive]      = useState("#6b7280");
  const [bg, setBg]                   = useState("#111111");
  const [growthSpeed, setSpeed]       = useState(3);
  const [symmetry, setSymmetry]       = useState(6);
  const [branchProb, setBranchProb]   = useState(0.3);
  const [noiseAmount, setNoise]       = useState(0.2);
  const [cellSize, setCellSize]       = useState(3);
  const [glowEffect, setGlow]         = useState(true);
  const [glowBlur, setGlowBlur]       = useState(12);
  const [interactive, setInteract]    = useState(true);
  const [autoReset, setAutoReset]     = useState(true);
  const [colorMode, setColorMode]     = useState<CrystalGrowthColorMode>("solid");
  const [animated, setAnimated]       = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setCrystal(pp.crystalColor);
    setActive(pp.activeColor);
    setBg(pp.bg);
    setSymmetry(pp.symmetry);
    setBranchProb(pp.branchProb);
    setNoise(pp.noise);
    setCellSize(pp.cellSize);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setColorMode(pp.colorMode as CrystalGrowthColorMode);
  }

  const code = [
    `import { CrystalGrowth } from 'own-the-canvas';`,
    ``,
    `<CrystalGrowth`,
    `  preset="${preset}"`,
    `  crystalColor="${crystalColor}"`,
    `  activeColor="${activeColor}"`,
    `  backgroundColor="${bg}"`,
    `  growthSpeed={${growthSpeed}}`,
    `  symmetry={${symmetry}}`,
    `  branchProbability={${branchProb}}`,
    `  noiseAmount={${noiseAmount}}`,
    `  cellSize={${cellSize}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  interactive={${interactive}}`,
    `  autoReset={${autoReset}}`,
    `  colorMode="${colorMode}"`,
    `  animated={${animated}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <CrystalGrowth
        preset={preset}
        crystalColor={crystalColor}
        activeColor={activeColor}
        backgroundColor={bg}
        growthSpeed={growthSpeed}
        symmetry={symmetry}
        branchProbability={branchProb}
        noiseAmount={noiseAmount}
        cellSize={cellSize}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        interactive={interactive}
        autoReset={autoReset}
        colorMode={colorMode}
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
        <PSel label="Preset" value={preset} options={["default", "snowflake", "gem", "neon", "frost", "gold"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Crystal color" value={crystalColor} onChange={setCrystal} />
        <PColor label="Active color"  value={activeColor}  onChange={setActive} />
        <PColor label="Background"    value={bg}           onChange={setBg} />
        <PDivider />
        <PSel label="Color mode" value={colorMode} options={["solid", "age", "cycle"]} onChange={(v) => setColorMode(v as CrystalGrowthColorMode)} />
        <PDivider />
        <PToggle label="Glow effect"  value={glowEffect}   onChange={setGlow} />
        <PToggle label="Interactive"  value={interactive}  onChange={setInteract} />
        <PToggle label="Auto reset"   value={autoReset}    onChange={setAutoReset} />
        <PToggle label="Animated"     value={animated}     onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Growth speed"       value={growthSpeed} min={1}   max={20}  step={1}    onChange={setSpeed} />
        <PSlider label="Symmetry arms"      value={symmetry}    min={2}   max={12}  step={1}    onChange={setSymmetry} />
        <PSlider label="Branch probability" value={branchProb}  min={0}   max={1}   step={0.05} onChange={setBranchProb} />
        <PSlider label="Noise amount"       value={noiseAmount} min={0}   max={1}   step={0.05} onChange={setNoise} />
        <PSlider label="Cell size"          value={cellSize}    min={1}   max={8}   step={1}    onChange={setCellSize} />
        <PSlider label="Glow blur"          value={glowBlur}    min={0}   max={40}  step={1}    onChange={setGlowBlur} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function CrystalGrowthPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="CrystalGrowth"
      lead="A cellular automaton that grows rotationally symmetric crystal lattices outward from a seed. Click the canvas to plant new seed points and watch fractal branches emerge. Each symmetry setting produces a completely different crystal species."
    >
      <CrystalGrowthPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Try <strong>snowflake</strong> (6-fold) for classic ice crystals, or <strong>gold</strong> (12-fold) for dense mandalas. Raise <strong>branch probability</strong> for bushy organic forms; lower <strong>noise amount</strong> for clean geometric perfection. The <em>age</em> color mode paints growth history.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
