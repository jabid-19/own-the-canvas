import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { NeuralWeb } from "../../../components/NeuralWeb";

const PROPS = [
  { name: "nodeCount",        type: "number",  default: "40",     description: "Number of network nodes." },
  { name: "nodeColor",        type: "string",  default: '"#ffffff"', description: "Resting node color." },
  { name: "edgeColor",        type: "string",  default: '"#6b7280"', description: "Edge line color." },
  { name: "signalColor",      type: "string",  default: '"#ffffff"', description: "Traveling signal color." },
  { name: "backgroundColor",  type: "string",  default: '"#111111"', description: "Canvas background." },
  { name: "connectionRadius", type: "number",  default: "150",    description: "Max px distance to draw edges." },
  { name: "nodeRadius",       type: "number",  default: "4",      description: "Node circle radius in px." },
  { name: "lineWidth",        type: "number",  default: "1",      description: "Edge stroke width." },
  { name: "speed",            type: "number",  default: "1",      description: "Signal travel speed multiplier." },
  { name: "pulseInterval",    type: "number",  default: "2000",   description: "Ms between auto-pulses." },
  { name: "pulseDecay",       type: "number",  default: "0.85",   description: "Signal strength multiplier per hop." },
  { name: "glowEffect",       type: "boolean", default: "true",   description: "Glow on active nodes/signals." },
  { name: "glowBlur",         type: "number",  default: "15",     description: "Shadow blur for glow." },
  { name: "interactive",      type: "boolean", default: "true",   description: "Hover to highlight; click to fire signal." },
  { name: "animated",         type: "boolean", default: "true",   description: "Enable animation." },
  { name: "wander",           type: "boolean", default: "true",   description: "Nodes drift slowly." },
  { name: "wanderSpeed",      type: "number",  default: "0.3",    description: "Node drift speed." },
  { name: "preset",           type: "string",  default: "—",      description: '"default" | "neon" | "brain" | "minimal" | "plasma" | "circuit"' },
];

const PRESET_PARAMS = {
  default: { nodeColor: "#ffffff", edgeColor: "#6b7280", signalColor: "#ffffff", bg: "#111111", connRadius: 150, nodeRadius: 4, pulseInterval: 2000, pulseDecay: 0.85, glowEffect: true,  glowBlur: 15, wanderSpeed: 0.3 },
  neon:    { nodeColor: "#00ffcc", edgeColor: "#00ffcc", signalColor: "#ffffff", bg: "#000000", connRadius: 150, nodeRadius: 4, pulseInterval: 1500, pulseDecay: 0.9,  glowEffect: true,  glowBlur: 20, wanderSpeed: 0.3 },
  brain:   { nodeColor: "#f472b6", edgeColor: "#ec4899", signalColor: "#fbbf24", bg: "#0f0005", connRadius: 130, nodeRadius: 4, pulseInterval: 2000, pulseDecay: 0.88, glowEffect: true,  glowBlur: 18, wanderSpeed: 0.4 },
  minimal: { nodeColor: "#6b7280", edgeColor: "#374151", signalColor: "#9ca3af", bg: "#111111", connRadius: 150, nodeRadius: 3, pulseInterval: 3000, pulseDecay: 0.85, glowEffect: false, glowBlur: 15, wanderSpeed: 0.3 },
  plasma:  { nodeColor: "#c084fc", edgeColor: "#7c3aed", signalColor: "#f0abfc", bg: "#050010", connRadius: 170, nodeRadius: 4, pulseInterval: 2000, pulseDecay: 0.92, glowEffect: true,  glowBlur: 25, wanderSpeed: 0.2 },
  circuit: { nodeColor: "#22c55e", edgeColor: "#166534", signalColor: "#86efac", bg: "#020a02", connRadius: 100, nodeRadius: 3, pulseInterval: 1000, pulseDecay: 0.8,  glowEffect: true,  glowBlur: 12, wanderSpeed: 0.1 },
};

function NeuralWebPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset]             = useState("default");
  const [nodeCount, setNodeCount]       = useState(40);
  const [nodeColor, setNodeColor]       = useState("#ffffff");
  const [edgeColor, setEdgeColor]       = useState("#6b7280");
  const [signalColor, setSignalColor]   = useState("#ffffff");
  const [bg, setBg]                     = useState("#111111");
  const [connRadius, setConnRadius]     = useState(150);
  const [nodeRadius, setNodeRadius]     = useState(4);
  const [lineWidth, setLineWidth]       = useState(1);
  const [speed, setSpeed]               = useState(1);
  const [pulseInterval, setPulseInt]    = useState(2000);
  const [pulseDecay, setPulseDecay]     = useState(0.85);
  const [glowEffect, setGlow]           = useState(true);
  const [glowBlur, setGlowBlur]         = useState(15);
  const [interactive, setInteract]      = useState(true);
  const [animated, setAnimated]         = useState(true);
  const [wander, setWander]             = useState(true);
  const [wanderSpeed, setWanderSpeed]   = useState(0.3);

  function handlePreset(p: string) {
    setPreset(p);
    const pp = PRESET_PARAMS[p as keyof typeof PRESET_PARAMS];
    if (!pp) return;
    setNodeColor(pp.nodeColor);
    setEdgeColor(pp.edgeColor);
    setSignalColor(pp.signalColor);
    setBg(pp.bg);
    setConnRadius(pp.connRadius);
    setNodeRadius(pp.nodeRadius);
    setPulseInt(pp.pulseInterval);
    setPulseDecay(pp.pulseDecay);
    setGlow(pp.glowEffect);
    setGlowBlur(pp.glowBlur);
    setWanderSpeed(pp.wanderSpeed);
  }

  const code = [
    `import { NeuralWeb } from 'own-the-canvas';`,
    ``,
    `<NeuralWeb`,
    `  preset="${preset}"`,
    `  nodeCount={${nodeCount}}`,
    `  nodeColor="${nodeColor}"`,
    `  edgeColor="${edgeColor}"`,
    `  signalColor="${signalColor}"`,
    `  backgroundColor="${bg}"`,
    `  connectionRadius={${connRadius}}`,
    `  nodeRadius={${nodeRadius}}`,
    `  lineWidth={${lineWidth}}`,
    `  speed={${speed}}`,
    `  pulseInterval={${pulseInterval}}`,
    `  pulseDecay={${pulseDecay}}`,
    `  glowEffect={${glowEffect}}`,
    `  glowBlur={${glowBlur}}`,
    `  interactive={${interactive}}`,
    `  animated={${animated}}`,
    `  wander={${wander}}`,
    `  wanderSpeed={${wanderSpeed}}`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <NeuralWeb
        preset={preset}
        nodeCount={nodeCount}
        nodeColor={nodeColor}
        edgeColor={edgeColor}
        signalColor={signalColor}
        backgroundColor={bg}
        connectionRadius={connRadius}
        nodeRadius={nodeRadius}
        lineWidth={lineWidth}
        speed={speed}
        pulseInterval={pulseInterval}
        pulseDecay={pulseDecay}
        glowEffect={glowEffect}
        glowBlur={glowBlur}
        interactive={interactive}
        animated={animated}
        wander={wander}
        wanderSpeed={wanderSpeed}
        width="100%"
        height="100%"
      />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "neon", "brain", "minimal", "plasma", "circuit"]} onChange={handlePreset} />
        <PDivider />
        <PColor label="Node color"   value={nodeColor}   onChange={setNodeColor} />
        <PColor label="Edge color"   value={edgeColor}   onChange={setEdgeColor} />
        <PColor label="Signal color" value={signalColor} onChange={setSignalColor} />
        <PColor label="Background"   value={bg}          onChange={setBg} />
        <PDivider />
        <PToggle label="Glow effect"  value={glowEffect}  onChange={setGlow} />
        <PToggle label="Interactive"  value={interactive} onChange={setInteract} />
        <PToggle label="Wander"       value={wander}      onChange={setWander} />
        <PToggle label="Animated"     value={animated}    onChange={setAnimated} />
      </div>
      <div>
        <PSlider label="Node count"        value={nodeCount}    min={5}    max={100}  step={5}     onChange={setNodeCount} />
        <PSlider label="Connection radius" value={connRadius}   min={50}   max={400}  step={10}    onChange={setConnRadius} />
        <PSlider label="Node radius"       value={nodeRadius}   min={1}    max={12}   step={0.5}   onChange={setNodeRadius} />
        <PSlider label="Line width"        value={lineWidth}    min={0.5}  max={4}    step={0.25}  onChange={setLineWidth} />
        <PSlider label="Signal speed"      value={speed}        min={0.1}  max={5}    step={0.1}   onChange={setSpeed} />
        <PSlider label="Pulse interval ms" value={pulseInterval}min={200}  max={5000} step={100}   onChange={setPulseInt} />
        <PSlider label="Pulse decay"       value={pulseDecay}   min={0.5}  max={1}    step={0.01}  onChange={setPulseDecay} />
        <PSlider label="Wander speed"      value={wanderSpeed}  min={0}    max={2}    step={0.05}  onChange={setWanderSpeed} />
        <PSlider label="Glow blur"         value={glowBlur}     min={0}    max={40}   step={1}     onChange={setGlowBlur} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function NeuralWebPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="NeuralWeb"
      lead="A pulsing network graph where signals travel between connected nodes, decaying with each hop. Hover to highlight nodes, click to fire a pulse. Watch signals cascade through the network like synaptic firing."
    >
      <NeuralWebPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <p className="page-p">Try <strong>brain</strong> for a pink synaptic look, or <strong>circuit</strong> for a green PCB aesthetic. Raise <strong>pulse decay</strong> toward 1 to let signals propagate further through the network. Lower <strong>pulse interval</strong> for a constantly active network. Click any node to trigger a burst.</p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
