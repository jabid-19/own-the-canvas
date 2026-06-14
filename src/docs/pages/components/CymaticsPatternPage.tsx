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
import { CymaticsPattern } from "../../../components/CymaticsPattern";

const PROPS = [
  { name: "particleCount",  type: "number",  default: "800",       description: "Number of sand particles." },
  { name: "particleColor",  type: "string",  default: '"#ffffff"', description: "Sand particle fill color." },
  { name: "backgroundColor",type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "particleSize",   type: "number",  default: "2",         description: "Particle radius in px." },
  { name: "forceStrength",  type: "number",  default: "3",         description: "Restoring force pushing particles toward nodal lines." },
  { name: "friction",       type: "number",  default: "0.88",      description: "Velocity damping per frame (0–1). Lower = faster settling." },
  { name: "jitterAmount",   type: "number",  default: "0.3",       description: "Brownian jitter applied once particles are near nodal lines." },
  { name: "modeDuration",   type: "number",  default: "4000",      description: "Milliseconds before the standing wave mode shifts." },
  { name: "speed",          type: "number",  default: "1",         description: "Simulation speed multiplier." },
  { name: "glowEffect",     type: "boolean", default: "false",     description: "Enable canvas shadow glow on particles." },
  { name: "glowBlur",       type: "number",  default: "6",         description: "Blur radius for glow (px)." },
  { name: "showPlate",      type: "boolean", default: "false",     description: "Draw a subtle border around the virtual plate." },
  { name: "plateColor",     type: "string",  default: '"#333333"', description: "Plate border stroke color." },
  { name: "animated",       type: "boolean", default: "true",      description: "Enable the animation loop." },
  { name: "preset",         type: "string",  default: "—",         description: '"default" | "neon" | "sand" | "vibrant" | "cosmic" | "minimal"' },
];

const CYMATICS_PRESETS: Record<string, { particleColor: string; bg: string; particleSize: number; glowEffect: boolean; showPlate: boolean }> = {
  default: { particleColor: "#ffffff", bg: "#111111", particleSize: 2,   glowEffect: false, showPlate: false },
  neon:    { particleColor: "#00ffcc", bg: "#000000", particleSize: 2,   glowEffect: true,  showPlate: false },
  sand:    { particleColor: "#d4a06a", bg: "#1a1005", particleSize: 2.5, glowEffect: false, showPlate: true  },
  vibrant: { particleColor: "#ff6b6b", bg: "#0a0505", particleSize: 2,   glowEffect: true,  showPlate: false },
  cosmic:  { particleColor: "#c084fc", bg: "#030014", particleSize: 2,   glowEffect: true,  showPlate: false },
  minimal: { particleColor: "#6b7280", bg: "#111111", particleSize: 1.5, glowEffect: false, showPlate: false },
};

function CymaticsPatternPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]               = useState("default");
  const [particleCount, setParticleCount] = useState(800);
  const [particleSize, setParticleSize]   = useState(2);
  const [forceStrength, setForceStrength] = useState(3);
  const [friction, setFriction]           = useState(0.88);
  const [jitterAmount, setJitterAmount]   = useState(0.3);
  const [modeDuration, setModeDuration]   = useState(4000);
  const [particleColor, setParticleColor] = useState("#ffffff");
  const [bg, setBg]                       = useState("#111111");
  const [glowEffect, setGlowEffect]       = useState(false);
  const [showPlate, setShowPlate]         = useState(false);
  const [animated, setAnimated]           = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = CYMATICS_PRESETS[p] ?? CYMATICS_PRESETS.default;
    setParticleColor(v.particleColor);
    setBg(v.bg);
    setParticleSize(v.particleSize);
    setGlowEffect(v.glowEffect);
    setShowPlate(v.showPlate);
  }

  const code = [
    `import { CymaticsPattern } from 'own-the-canvas';`,
    ``,
    `<CymaticsPattern`,
    `  preset="${preset}"`,
    `  particleCount={${particleCount}}`,
    `  particleSize={${particleSize}}`,
    `  forceStrength={${forceStrength}}`,
    `  friction={${friction}}`,
    `  jitterAmount={${jitterAmount}}`,
    `  modeDuration={${modeDuration}}`,
    `  particleColor="${particleColor}"`,
    `  backgroundColor="${bg}"`,
    glowEffect ? `  glowEffect` : null,
    showPlate  ? `  showPlate`  : null,
    !animated  ? `  animated={false}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <CymaticsPattern
        preset={preset}
        particleCount={particleCount}
        particleSize={particleSize}
        forceStrength={forceStrength}
        friction={friction}
        jitterAmount={jitterAmount}
        modeDuration={modeDuration}
        particleColor={particleColor}
        backgroundColor={bg}
        glowEffect={glowEffect}
        showPlate={showPlate}
        animated={animated}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Sand settles at nodal lines · Patterns shift every few seconds" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel
          label="Preset"
          value={preset}
          options={["default", "neon", "sand", "vibrant", "cosmic", "minimal"]}
          onChange={onPresetChange}
        />
        <PDivider />
        <PColor label="Particle color" value={particleColor} onChange={setParticleColor} />
        <PColor label="Background"     value={bg}            onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect" value={glowEffect} onChange={setGlowEffect} />
        <PToggle label="Show plate"  value={showPlate}  onChange={setShowPlate} />
        <PToggle label="Animated"    value={animated}   onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Particle count"  value={particleCount}  min={100}  max={2000} step={100}  onChange={setParticleCount} />
        <PSlider label="Particle size"   value={particleSize}   min={1}    max={4}    step={0.5}  onChange={setParticleSize} />
        <PSlider label="Force strength"  value={forceStrength}  min={0.5}  max={8}    step={0.5}  onChange={setForceStrength} />
        <PSlider label="Friction"        value={friction}       min={0.7}  max={0.99} step={0.01} onChange={setFriction} />
        <PSlider label="Jitter"          value={jitterAmount}   min={0}    max={1}    step={0.05} onChange={setJitterAmount} />
        <PSlider label="Mode duration"   value={modeDuration}   min={1000} max={8000} step={500}  onChange={setModeDuration} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function CymaticsPatternPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="CymaticsPattern"
      lead="Sand particles self-organize into the standing wave patterns of a vibrating plate — real Chladni figures brought to life. Watch geometry emerge from physics as the frequency drifts."
    >
      <CymaticsPatternPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">
          Adjust the controls live to explore different standing wave modes. The <strong>preset</strong> selector
          jumps to curated combinations — try <em>neon</em> for a glowing teal pattern or <em>sand</em> for a
          realistic Chladni plate aesthetic. Increasing <strong>force strength</strong> makes particles snap to
          nodal lines faster; reducing <strong>friction</strong> keeps them in perpetual motion.
        </p>
      </section>

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">How it works</h2>
        <p className="page-p">
          A square plate is excited by a standing wave defined by two integer mode numbers <em>m</em> and <em>n</em>.
          The wave amplitude at any point follows the Chladni formula:
        </p>
        <pre className="page-pre">
          f(x, y) = cos(m·π·x) · cos(n·π·y) + cos(n·π·x) · cos(m·π·y)
        </pre>
        <p className="page-p">
          Nodal lines are where <em>f(x, y) = 0</em>. Sand on a real plate accumulates at nodal lines because
          those are the only stationary regions. Here each particle experiences a gradient-descent force pulling
          it toward the nearest nodal line, with Brownian jitter keeping settled particles alive.
          The mode pair shifts every few seconds via a smooth crossfade, causing the geometry to morph
          continuously between canonical Chladni figures.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
