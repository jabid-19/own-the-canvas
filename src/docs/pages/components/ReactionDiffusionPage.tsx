import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { ReactionDiffusion } from "../../../components/ReactionDiffusion";

const PROPS = [
  { name: "feedRate",       type: "number",  default: "0.055",    description: "Feed rate f — controls pattern type. Different values produce coral, spots, maze, or wave patterns." },
  { name: "killRate",       type: "number",  default: "0.062",    description: "Kill rate k — controls pattern density and structure." },
  { name: "diffusionU",     type: "number",  default: "0.2",      description: "Diffusion rate for chemical U (Pearson ratio: dU/dV = 2)." },
  { name: "diffusionV",     type: "number",  default: "0.1",      description: "Diffusion rate for chemical V." },
  { name: "resolution",     type: "number",  default: "0.5",      description: "Render resolution fraction — lower is faster, higher is sharper." },
  { name: "speed",          type: "number",  default: "8",        description: "Simulation steps per frame — higher = faster pattern growth." },
  { name: "colorA",         type: "string",  default: '"#111111"', description: "Color at low V concentration." },
  { name: "colorB",         type: "string",  default: '"#ffffff"', description: "Color at high V concentration." },
  { name: "backgroundColor",type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "interactive",    type: "boolean", default: "true",     description: "Mouse click+drag disturbs the chemical field." },
  { name: "preset",         type: "string",  default: "—",        description: '"default" | "coral" | "spots" | "maze" | "waves" | "neon"' },
];

const PRESET_PARAMS: Record<string, { feedRate: number; killRate: number; colorA?: string; colorB?: string; backgroundColor?: string }> = {
  default: { feedRate: 0.055, killRate: 0.062 },
  coral:   { feedRate: 0.055, killRate: 0.062 },
  spots:   { feedRate: 0.035, killRate: 0.065 },
  maze:    { feedRate: 0.029, killRate: 0.057 },
  waves:   { feedRate: 0.014, killRate: 0.053 },
  neon:    { feedRate: 0.055, killRate: 0.062, colorA: "#0a0a0a", colorB: "#00ffff", backgroundColor: "#0a0a0a" },
};

function ReactionDiffusionPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("default");
  const [feedRate, setFeedRate] = useState(0.055);
  const [killRate, setKillRate] = useState(0.062);
  const [speed, setSpeed] = useState(8);
  const [resolution, setResolution] = useState(0.5);
  const [colorA, setColorA] = useState("#111111");
  const [colorB, setColorB] = useState("#ffffff");
  const [bg, setBg] = useState("#111111");
  const [interactive, setInteractive] = useState(true);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p];
    if (!pp) return;
    setFeedRate(pp.feedRate);
    setKillRate(pp.killRate);
    if (pp.colorA) setColorA(pp.colorA);
    if (pp.colorB) setColorB(pp.colorB);
    if (pp.backgroundColor) setBg(pp.backgroundColor);
  }

  const code = [
    `import { ReactionDiffusion } from 'own-the-canvas';`,
    ``,
    `<ReactionDiffusion`,
    `  preset="${preset}"`,
    `  feedRate={${feedRate}}`,
    `  killRate={${killRate}}`,
    `  speed={${speed}}`,
    `  resolution={${resolution}}`,
    `  colorA="${colorA}"`,
    `  colorB="${colorB}"`,
    `  backgroundColor="${bg}"`,
    !interactive ? `  interactive={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ReactionDiffusion
        preset={preset}
        feedRate={feedRate}
        killRate={killRate}
        speed={speed}
        resolution={resolution}
        colorA={colorA}
        colorB={colorB}
        backgroundColor={bg}
        interactive={interactive}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "coral", "spots", "maze", "waves", "neon"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Color A (low)" value={colorA} onChange={setColorA} />
        <PColor label="Color B (high)" value={colorB} onChange={setColorB} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PDivider />
        <PToggle label="Interactive" value={interactive} onChange={setInteractive} />
      </div>
      <div>
        <PSlider label="Feed rate" value={feedRate} min={0.01} max={0.1} step={0.001} onChange={setFeedRate} />
        <PSlider label="Kill rate" value={killRate} min={0.04} max={0.08} step={0.001} onChange={setKillRate} />
        <PSlider label="Speed" value={speed} min={1} max={20} step={1} onChange={setSpeed} />
        <PSlider label="Resolution" value={resolution} min={0.1} max={1} step={0.05} onChange={setResolution} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function ReactionDiffusionPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="ReactionDiffusion"
      lead="Gray-Scott reaction-diffusion simulation. Two virtual chemicals interact to spontaneously grow coral, spots, mazes, and traveling waves from random seeds. Click and drag to disturb the field."
    >
      <ReactionDiffusionPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">The code block above updates live as you adjust the controls. Try the presets to jump between radically different pattern types — each corresponds to a specific (feedRate, killRate) parameter pair.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
