import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Wormhole } from "../../../components/Wormhole";

const PROPS = [
  { name: "ringCount",       type: "number",   default: "30",                    description: "Number of tunnel rings." },
  { name: "speed",           type: "number",   default: "1",                     description: "Forward travel speed." },
  { name: "colors",          type: "string[]", default: '["#ffffff","#6b7280"]', description: "Ring stroke colors — cycles through array." },
  { name: "backgroundColor", type: "string",   default: '"#111111"',             description: "Canvas background color." },
  { name: "twist",           type: "number",   default: "0.3",                   description: "Ring rotation twist per unit depth." },
  { name: "fov",             type: "number",   default: "300",                   description: "Perspective field of view." },
  { name: "depth",           type: "number",   default: "400",                   description: "Perspective depth scale." },
  { name: "lineWidth",       type: "number",   default: "1.5",                   description: "Ring stroke width." },
  { name: "opacity",         type: "number",   default: "0.8",                   description: "Ring opacity 0–1." },
  { name: "starCount",       type: "number",   default: "100",                   description: "Tunnel wall star count." },
  { name: "starColor",       type: "string",   default: '"#ffffff"',             description: "Star dot color." },
  { name: "interactive",     type: "boolean",  default: "true",                  description: "Mouse X controls tunnel speed." },
  { name: "preset",          type: "string",   default: "—",                     description: '"default" | "hyperspace" | "neon" | "vortex" | "minimal"' },
];

function WormholePlayground() {
  const [preset, setPreset] = useState("default");
  const [speed, setSpeed] = useState(1);
  const [twist, setTwist] = useState(0.3);
  const [ringCount, setRingCount] = useState(30);
  const [starCount, setStarCount] = useState(100);
  const [bg, setBg] = useState("#111111");

  const code = [
    `import { Wormhole } from 'own-the-canvas';`,
    ``,
    `<Wormhole`,
    `  preset="${preset}"`,
    `  speed={${speed}}`,
    `  twist={${twist}}`,
    `  ringCount={${ringCount}}`,
    `  starCount={${starCount}}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Wormhole preset={preset} speed={speed} twist={twist}
        ringCount={ringCount} starCount={starCount}
        backgroundColor={bg} width="100%" height="100%" />
      <PLiveLabel text="Move cursor to control speed" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "hyperspace", "neon", "vortex", "minimal"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSlider label="Ring count" value={ringCount} min={10} max={60} step={5} onChange={setRingCount} />
      </div>
      <div>
        <PSlider label="Speed" value={speed} min={0.2} max={5} step={0.1} onChange={setSpeed} />
        <PSlider label="Twist" value={twist} min={0} max={2} step={0.05} onChange={setTwist} />
        <PSlider label="Star count" value={starCount} min={0} max={300} step={10} onChange={setStarCount} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function WormholePage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Wormhole"
      lead="3D perspective tunnel rushing toward the camera with twisting rings and star particles. Move the mouse to control speed. A classic hyperspace hero section effect."
    >
      <WormholePlayground />

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
