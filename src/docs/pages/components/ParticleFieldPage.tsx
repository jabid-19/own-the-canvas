import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSlider, PColor, PToggle, PSel, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { ParticleField } from "../../../components/ParticleField";

const PROPS = [
  { name: "particleCount",        type: "number",              default: "120",           description: "Number of particles." },
  { name: "particleColor",        type: "string",              default: '"#ffffff"',     description: "Particle fill color." },
  { name: "lineColor",            type: "string",              default: '"#6b7280"',     description: "Connection line color." },
  { name: "lineDistance",         type: "number",              default: "120",           description: "Max distance between connected particles." },
  { name: "particleSize",         type: "number",              default: "2.5",           description: "Particle radius in pixels." },
  { name: "speed",                type: "number",              default: "0.8",           description: "Particle movement speed." },
  { name: "connectParticles",     type: "boolean",             default: "true",          description: "Draw lines between nearby particles." },
  { name: "interactive",          type: "boolean",             default: "true",          description: "Enable mouse repulsion effect." },
  { name: "backgroundColor",      type: "string",              default: '"transparent"', description: "Canvas background color." },
  { name: "repelRadius",          type: "number",              default: "80",            description: "Mouse repulsion radius in px." },
  { name: "repelStrength",        type: "number",              default: "0.3",           description: "Mouse repulsion force strength." },
  { name: "friction",             type: "number",              default: "0.99",          description: "Velocity friction per frame (0–1)." },
  { name: "maxVelocityMultiplier", type: "number",             default: "3",             description: "Max velocity as multiple of speed." },
  { name: "lineWidth",            type: "number",              default: "0.8",           description: "Connection line stroke width." },
  { name: "lineOpacity",          type: "number",              default: "0.6",           description: "Connection line max opacity." },
  { name: "wrapEdges",            type: "boolean",             default: "false",         description: "Wrap particles around canvas edges instead of bouncing." },
  { name: "twinkle",              type: "boolean",             default: "false",         description: "Enable twinkling opacity animation." },
  { name: "twinkleSpeed",         type: "number",              default: "0.03",          description: "Twinkling animation speed." },
  { name: "twinkleAmplitude",     type: "number",              default: "0.4",           description: "Twinkling opacity amplitude (0–1)." },
  { name: "glowParticles",        type: "boolean",             default: "false",         description: "Enable glow shadow on particles." },
  { name: "glowBlur",             type: "number",              default: "15",            description: "Glow shadow blur in px." },
  { name: "lineStyle",            type: '"solid" | "dashed"',  default: '"solid"',       description: "Connection line stroke style." },
  { name: "dragParticles",        type: "boolean",             default: "false",         description: "Enable drag-to-reposition individual particles." },
  { name: "dragRadius",           type: "number",              default: "20",            description: "Drag detection radius in px." },
  { name: "velocityMultiplier",   type: "number",              default: "2",             description: "Initial velocity multiplier (0.3 for slow constellation drift, 2 for active field)." },
  { name: "preset",               type: "string",              default: '"default"',     description: '"default" | "galaxy" | "snow" | "minimal" | "ocean" | "cosmos" | "aurora" | "gold"' },
];

function ParticleFieldPlayground({ onReset }: { onReset?: () => void }) {
  const [pc, setPc] = useState("#ffffff");
  const [lc, setLc] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [count, setCount] = useState(120);
  const [dist, setDist] = useState(120);
  const [size, setSize] = useState(2.5);
  const [speed, setSpeed] = useState(0.8);
  const [connect, setConnect] = useState(true);
  const [interact, setInteract] = useState(true);
  const [wrapEdges, setWrapEdges] = useState(false);
  const [twinkle, setTwinkle] = useState(false);
  const [glowParticles, setGlowParticles] = useState(false);
  const [lineStyle, setLineStyle] = useState<"solid" | "dashed">("solid");
  const [dragParticles, setDragParticles] = useState(false);

  const code = [
    `import { ParticleField } from 'own-the-canvas';`,
    ``,
    `<ParticleField`,
    `  particleCount={${count}}`,
    `  particleColor="${pc}"`,
    `  lineColor="${lc}"`,
    `  lineDistance={${dist}}`,
    `  particleSize={${size}}`,
    `  speed={${speed}}`,
    connect ? null : `  connectParticles={false}`,
    !interact ? `  interactive={false}` : null,
    `  backgroundColor="${bg}"`,
    wrapEdges ? `  wrapEdges={true}` : null,
    twinkle ? `  twinkle={true}` : null,
    glowParticles ? `  glowParticles={true}` : null,
    lineStyle !== "solid" ? `  lineStyle="${lineStyle}"` : null,
    dragParticles ? `  dragParticles={true}` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <ParticleField
        particleColor={pc} lineColor={lc} particleCount={count}
        lineDistance={dist} particleSize={size} speed={speed}
        connectParticles={connect} interactive={interact}
        backgroundColor="transparent"
        wrapEdges={wrapEdges} twinkle={twinkle}
        glowParticles={glowParticles} lineStyle={lineStyle}
        dragParticles={dragParticles}
        width="100%" height="100%"
      />
      <PLiveLabel text={dragParticles ? "Drag particles to reposition" : "Move cursor to repel particles"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PColor label="Particle color" value={pc} onChange={setPc} />
        <PColor label="Line color" value={lc} onChange={setLc} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSlider label="Count" value={count} min={20} max={400} step={10} onChange={setCount} />
      </div>
      <div>
        <PSlider label="Line distance" value={dist} min={40} max={250} step={5} onChange={setDist} />
        <PSlider label="Particle size" value={size} min={0.5} max={8} step={0.5} onChange={setSize} />
        <PSlider label="Speed" value={speed} min={0.1} max={5} step={0.1} onChange={setSpeed} />
        <PDivider />
        <PToggle label="Connect particles" value={connect} onChange={setConnect} />
        <PToggle label="Mouse repulsion" value={interact} onChange={setInteract} />
        <PToggle label="Drag to move" value={dragParticles} onChange={setDragParticles} />
        <PDivider />
        <PToggle label="Wrap edges" value={wrapEdges} onChange={setWrapEdges} />
        <PToggle label="Twinkle" value={twinkle} onChange={setTwinkle} />
        <PToggle label="Particle glow" value={glowParticles} onChange={setGlowParticles} />
        <PSel label="Line style" value={lineStyle} options={["solid", "dashed"]} onChange={setLineStyle} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function ParticleFieldPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="ParticleField"
      lead="Floating particles with optional connection lines, mouse repulsion, drag-to-move, twinkling, and glow. Use presets like cosmos or aurora for a constellation-style star field."
    >
      <ParticleFieldPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

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
