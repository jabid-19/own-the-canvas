import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Starfield } from "../../../components/Starfield";

const PROPS = [
  { name: "starCount",      type: "number",       default: "200",       description: "Number of stars to render." },
  { name: "speed",          type: "number",       default: "0.5",       description: "Star movement speed." },
  { name: "backgroundColor",type: "string",       default: '"#111111"', description: "Sky background color." },
  { name: "perspective",    type: '"2D" | "3D"',  default: '"2D"',      description: "2D twinkle field or 3D warp tunnel." },
  { name: "twinkle",        type: "boolean",      default: "true",      description: "Enable star twinkle animation." },
  { name: "shootingStars",  type: "boolean",      default: "false",     description: "Enable random shooting star events." },
];

function StarfieldPlayground() {
  const [persp, setPersp] = useState<"2D" | "3D">("2D");
  const [count, setCount] = useState(200);
  const [speed, setSpeed] = useState(0.5);
  const [bg, setBg] = useState("#111111");
  const [twinkle, setTwinkle] = useState(true);
  const [shooting, setShooting] = useState(true);

  const code = [
    `import { Starfield } from 'own-the-canvas';`,
    ``,
    `<Starfield`,
    `  perspective="${persp}"`,
    `  starCount={${count}}`,
    `  speed={${speed}}`,
    `  backgroundColor="${bg}"`,
    twinkle ? null : `  twinkle={false}`,
    shooting ? `  shootingStars` : null,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].filter(Boolean).join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Starfield perspective={persp} starCount={count} speed={speed}
        backgroundColor={bg} twinkle={twinkle} shootingStars={shooting}
        width="100%" height="100%" />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Perspective" value={persp} options={["2D", "3D"]} onChange={setPersp} />
        <PDivider />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PSlider label="Star count" value={count} min={50} max={800} step={10} onChange={setCount} />
      </div>
      <div>
        <PSlider label="Speed" value={speed} min={0.1} max={8} step={0.1} onChange={setSpeed} />
        <PDivider />
        <PToggle label="Twinkle" value={twinkle} onChange={setTwinkle} />
        <PToggle label="Shooting stars" value={shooting} onChange={setShooting} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function StarfieldPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="Starfield"
      lead="2D twinkle field or 3D warp-speed star tunnel. Switch perspectives with the perspective prop."
    >
      <StarfieldPlayground />

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
