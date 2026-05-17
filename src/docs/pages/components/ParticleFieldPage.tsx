import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { ParticleField } from "../../../components/ParticleField";

const PROPS = [
  { name: "particleCount",    type: "number",  default: "120",           description: "Number of particles." },
  { name: "particleColor",    type: "string",  default: '"#ffffff"',     description: "Particle fill color." },
  { name: "lineColor",        type: "string",  default: '"#6b7280"',     description: "Connection line color." },
  { name: "lineDistance",     type: "number",  default: "120",           description: "Max distance between connected particles." },
  { name: "particleSize",     type: "number",  default: "2.5",           description: "Particle radius in pixels." },
  { name: "speed",            type: "number",  default: "0.8",           description: "Particle movement speed." },
  { name: "connectParticles", type: "boolean", default: "true",          description: "Draw lines between nearby particles." },
  { name: "interactive",      type: "boolean", default: "true",          description: "Enable mouse repulsion effect." },
  { name: "backgroundColor",  type: "string",  default: '"transparent"', description: "Canvas background color." },
];

function ParticleFieldPlayground() {
  const [pc, setPc] = useState("#ffffff");
  const [lc, setLc] = useState("#6b7280");
  const [bg, setBg] = useState("#111111");
  const [count, setCount] = useState(120);
  const [dist, setDist] = useState(120);
  const [size, setSize] = useState(2.5);
  const [speed, setSpeed] = useState(0.8);
  const [connect, setConnect] = useState(true);
  const [interact, setInteract] = useState(true);

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
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <ParticleField particleColor={pc} lineColor={lc} particleCount={count}
        lineDistance={dist} particleSize={size} speed={speed}
        connectParticles={connect} interactive={interact}
        backgroundColor="transparent" width="100%" height="100%" />
      <PLiveLabel text="Move cursor to repel particles" />
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
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function ParticleFieldPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="ParticleField"
      lead="Floating particles with optional connection lines. Move your cursor over the canvas to activate the mouse repulsion interaction."
    >
      <ParticleFieldPlayground />

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
