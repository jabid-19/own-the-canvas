import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
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

export function AudioVisualizerPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="AudioVisualizer"
      lead="Real-time Web Audio API visualizer with four distinct modes. Connect a MediaStream from the user's microphone or any audio source."
    >
      <PreviewBox playgroundId="AudioVisualizer">
        <div style={{ background: "#111111", width: "100%", height: "100%" }}>
          <AudioVisualizer mode="bars" barCount={64} rounded gradient width="100%" height="100%" />
        </div>
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock
          code={`import { AudioVisualizer } from 'own-the-canvas';
import { useState } from 'react';

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  async function startMic() {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(s);
  }

  return (
    <>
      <button onClick={startMic}>Start microphone</button>
      <AudioVisualizer
        audioSource={stream}
        mode="bars"
        barColor="#ffffff"
        barCount={64}
        sensitivity={1}
        gradient
        width="100%"
        height="300px"
      />
    </>
  );
}`}
          language="tsx"
        />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
