import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { MatrixRain } from "../../../components/MatrixRain";

const PROPS = [
  { name: "color", type: "string", default: '"#ffffff"', description: "Color of the falling characters." },
  { name: "backgroundColor", type: "string", default: '"rgba(17,17,17,0.1)"', description: "Per-frame overlay — lower opacity = longer trails." },
  { name: "fontSize", type: "number", default: "14", description: "Character size in px; controls column count." },
  { name: "speed", type: "number", default: "33", description: "Ms per frame — lower = faster animation." },
  { name: "charset", type: '"latin" | "binary" | "katakana" | string', default: '"latin"', description: "Characters to rain. Pass a custom string for your own set." },
  { name: "resetThreshold", type: "number", default: "0.95", description: "Probability a drop resets after leaving the bottom (0–1)." },
  { name: "preset", type: '"default" | "cyberpunk" | "binary" | "minimal" | "blood"', default: '"default"', description: "Named preset shorthand." },
];

function MatrixRainPlayground() {
  const [preset, setPreset] = useState("default");
  const [color, setColor] = useState("#ffffff");
  const [trailOpacity, setTrailOpacity] = useState(0.1);
  const [fontSize, setFontSize] = useState(14);
  const [speed, setSpeed] = useState(33);
  const [charset, setCharset] = useState<"latin" | "binary" | "katakana">("latin");
  const [resetThreshold, setResetThreshold] = useState(0.95);
  const [bgColor, setBgColor] = useState("#111111");

  function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `${r},${g},${b}`;
  }

  const bg = `rgba(${hexToRgb(bgColor)},${trailOpacity})`;

  const code = [
    `import { MatrixRain } from 'own-the-canvas';`,
    ``,
    `<MatrixRain`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  charset="${charset}"`,
    `  fontSize={${fontSize}}`,
    `  speed={${speed}}`,
    `  backgroundColor="${bg}"`,
    `  width="100%"`,
    `  height="100%"`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bgColor }}>
      <MatrixRain preset={preset} color={color} fontSize={fontSize} speed={speed}
        charset={charset} resetThreshold={resetThreshold} backgroundColor={bg}
        width="100%" height="100%" />
      <PLiveLabel />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={["default", "cyberpunk", "binary", "minimal", "blood"]} onChange={setPreset} />
        <PDivider />
        <PColor label="Color" value={color} onChange={setColor} />
        <PColor label="Background" value={bgColor} onChange={setBgColor} />
        <PSel label="Charset" value={charset} options={["latin", "binary", "katakana"]} onChange={setCharset} />
        <PSlider label="Font size" value={fontSize} min={8} max={36} step={1} onChange={setFontSize} />
      </div>
      <div>
        <PSlider label="Trail opacity" value={trailOpacity} min={0.02} max={0.5} step={0.01} onChange={setTrailOpacity} />
        <PSlider label="Speed (ms/frame)" value={speed} min={10} max={200} step={5} onChange={setSpeed} />
        <PSlider label="Reset threshold" value={resetThreshold} min={0.5} max={0.99} step={0.01} onChange={setResetThreshold} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} />;
}

export function MatrixRainPage() {
  return (
    <PageShell
      eyebrow="Component"
      title="MatrixRain"
      lead="Classic falling-character rain effect. Faithful to the original Matrix algorithm — optimized with requestAnimationFrame and DPR-aware canvas rendering."
    >
      <MatrixRainPlayground />

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
