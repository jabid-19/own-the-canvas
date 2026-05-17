import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PButton, PLiveLabel } from "../../components/PlaygroundControls";
import { AudioVisualizer } from "../../../components/AudioVisualizer";

const PROPS = [
  { name: "audioSource",  type: "MediaStream | null", default: "null",      description: "Web Audio MediaStream from getUserMedia." },
  { name: "mode",         type: '"bars" | "wave" | "circular" | "mirror"', default: '"bars"', description: "Visualization shape." },
  { name: "barColor",     type: "string",             default: '"#ffffff"', description: "Primary bar/wave color." },
  { name: "waveColor",    type: "string",             default: '"#ffffff"', description: "Wave line color." },
  { name: "barCount",     type: "number",             default: "64",        description: "Number of frequency bars." },
  { name: "sensitivity",  type: "number",             default: "1",         description: "Audio sensitivity multiplier." },
  { name: "rounded",      type: "boolean",            default: "true",      description: "Rounded bar caps." },
  { name: "gradient",     type: "boolean",            default: "false",     description: "Gradient fill on bars." },
  { name: "gapBetweenBars", type: "number",           default: "2",         description: "Gap between bars in pixels." },
];

function AudioVisualizerPlayground() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [mode, setMode] = useState<"bars" | "wave" | "circular" | "mirror">("bars");
  const [barColor, setBarColor] = useState("#ffffff");
  const [barCount, setBarCount] = useState(64);
  const [sensitivity, setSensitivity] = useState(1);
  const [rounded, setRounded] = useState(true);
  const [gradient, setGradient] = useState(false);
  const [bg, setBg] = useState("#111111");

  async function toggleMic() {
    if (micActive && stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
      setMicActive(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(s);
        setMicActive(true);
      } catch {
        // user denied
      }
    }
  }

  const code = [
    `import { AudioVisualizer } from 'own-the-canvas';`,
    `import { useState } from 'react';`,
    ``,
    `function App() {`,
    `  const [stream, setStream] = useState<MediaStream | null>(null);`,
    ``,
    `  async function startMic() {`,
    `    const s = await navigator.mediaDevices.getUserMedia({ audio: true });`,
    `    setStream(s);`,
    `  }`,
    ``,
    `  return (`,
    `    <>`,
    `      <button onClick={startMic}>Start microphone</button>`,
    `      <AudioVisualizer`,
    `        audioSource={stream}`,
    `        mode="${mode}"`,
    `        barColor="${barColor}"`,
    `        barCount={${barCount}}`,
    `        sensitivity={${sensitivity}}`,
    rounded ? null : `        rounded={false}`,
    gradient ? `        gradient` : null,
    `        width="100%"`,
    `        height="100%"`,
    `      />`,
    `    </>`,
    `  );`,
    `}`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", background: bg, position: "relative" }}>
      <AudioVisualizer
        audioSource={stream}
        mode={mode}
        barColor={barColor}
        barCount={barCount}
        sensitivity={sensitivity}
        rounded={rounded}
        gradient={gradient}
        width="100%"
        height="100%"
      />
      <PLiveLabel text={micActive ? "Mic active — speak to see bars" : "Click Enable mic to start"} />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Mode" value={mode} options={["bars", "wave", "circular", "mirror"]} onChange={(v) => setMode(v as typeof mode)} />
        <PDivider />
        <PButton label={micActive ? "Disable mic" : "Enable mic"} onClick={toggleMic} variant={micActive ? "secondary" : "primary"} />
        <PDivider />
        <PColor label="Bar color" value={barColor} onChange={setBarColor} />
        <PColor label="Background" value={bg} onChange={setBg} />
      </div>
      <div>
        <PSlider label="Bar count" value={barCount} min={8} max={128} step={8} onChange={setBarCount} />
        <PSlider label="Sensitivity" value={sensitivity} min={0.2} max={5} step={0.1} onChange={setSensitivity} />
        <PDivider />
        <PToggle label="Rounded caps" value={rounded} onChange={setRounded} />
        <PToggle label="Gradient fill" value={gradient} onChange={setGradient} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function AudioVisualizerPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="AudioVisualizer"
      lead="Real-time Web Audio API visualizer with four distinct modes. Connect a MediaStream from the user's microphone or any audio source."
    >
      <AudioVisualizerPlayground />

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
