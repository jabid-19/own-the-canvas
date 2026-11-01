import { useState } from "react";
import { PageShell } from "../../components/PageShell";
import { PropsTable } from "../../components/PropsTable";
import { PlaygroundShell, PSel, PSlider, PColor, PToggle, PDivider, PLiveLabel } from "../../components/PlaygroundControls";
import { Moths } from "../../../components/Moths";

const PROPS = [
  { name: "count",           type: "number",  default: "26",         description: "Number of moths." },
  { name: "color",           type: "string",  default: '"#c8b28f"',  description: "Wing color." },
  { name: "lightColor",      type: "string",  default: '"#ffd27a"',  description: "Light and halo color; moths near it are lit in this tint." },
  { name: "backgroundColor", type: "string",  default: '"#0b0805"',  description: "Background color (ignored in overlay mode)." },
  { name: "angle",           type: "number",  default: "80",         description: "Degrees each moth keeps between its heading and the light. < 90 spirals in, 90 orbits, > 90 spirals out." },
  { name: "speed",           type: "number",  default: "1",          description: "Flight speed multiplier." },
  { name: "size",            type: "number",  default: "8",          description: "Moth size in px." },
  { name: "glowRadius",      type: "number",  default: "120",        description: "Light halo radius in px." },
  { name: "lightX",          type: "number",  default: "0.5",        description: "Lamp position (0..1 of width) while the cursor is away." },
  { name: "lightY",          type: "number",  default: "0.42",       description: "Lamp position (0..1 of height) while the cursor is away." },
  { name: "showLight",       type: "boolean", default: "true",       description: "Draw the light itself." },
  { name: "followCursor",    type: "boolean", default: "true",       description: "The cursor becomes the light; tap to scatter the moths." },
  { name: "preset",          type: "string",  default: "—",          description: '"default" | "porch-lamp" | "moonlight" | "candle" | "neon" | "monochrome"' },
  { name: "overlay",         type: "boolean", default: "false",      description: "Fixed full-viewport, click-through layer over the page; transparent background." },
  { name: "zIndex",          type: "number",  default: "10",         description: "Overlay stacking order." },
];

const PRESET_VALUES: Record<string, { color: string; light: string; bg: string; angle: number }> = {
  default:      { color: "#c8b28f", light: "#ffd27a", bg: "#0b0805", angle: 80 },
  monochrome: { color: "#9ca3af", light: "#ffffff", bg: "#111111", angle: 80 },
  "porch-lamp": { color: "#c8b28f", light: "#ffd27a", bg: "#0b0805", angle: 80 },
  moonlight:    { color: "#cbd5e1", light: "#dbeafe", bg: "#04070f", angle: 86 },
  candle:       { color: "#d6a77a", light: "#ff9a3c", bg: "#0a0503", angle: 76 },
  neon:         { color: "#a78bfa", light: "#f0abfc", bg: "#07020c", angle: 80 },
};

function MothsPlayground({ onReset }: { onReset?: () => void }) {
  const [preset, setPreset] = useState("porch-lamp");
  const [color, setColor] = useState(PRESET_VALUES["porch-lamp"].color);
  const [light, setLight] = useState(PRESET_VALUES["porch-lamp"].light);
  const [bg, setBg] = useState(PRESET_VALUES["porch-lamp"].bg);
  const [count, setCount] = useState(26);
  const [angle, setAngle] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [followCursor, setFollowCursor] = useState(true);

  function onPresetChange(p: string) {
    setPreset(p);
    const v = PRESET_VALUES[p] ?? PRESET_VALUES.default;
    setColor(v.color);
    setLight(v.light);
    setBg(v.bg);
    setAngle(v.angle);
  }

  const code = [
    `import { Moths } from 'own-the-canvas';`,
    ``,
    `<Moths`,
    `  preset="${preset}"`,
    `  color="${color}"`,
    `  lightColor="${light}"`,
    `  backgroundColor="${bg}"`,
    `  count={${count}}`,
    `  angle={${angle}}`,
    `  speed={${speed}}`,
    `  followCursor={${followCursor}}`,
    `/>`,
  ].join("\n");

  const preview = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: bg }}>
      <Moths
        preset={preset}
        color={color}
        lightColor={light}
        backgroundColor={bg}
        count={count}
        angle={angle}
        speed={speed}
        followCursor={followCursor}
        width="100%"
        height="100%"
      />
      <PLiveLabel text="Your cursor is the lamp · tap to scatter" />
    </div>
  );

  const controls = (
    <>
      <div>
        <PSel label="Preset" value={preset} options={Object.keys(PRESET_VALUES)} onChange={onPresetChange} />
        <PDivider />
        <PColor label="Moth color" value={color} onChange={setColor} />
        <PColor label="Light color" value={light} onChange={setLight} />
        <PColor label="Background" value={bg} onChange={setBg} />
        <PToggle label="Follow cursor" value={followCursor} onChange={setFollowCursor} />
      </div>
      <div>
        <PSlider label="Count" value={count} min={4} max={80} step={1} onChange={setCount} />
        <PSlider label="Angle to light (°)" value={angle} min={60} max={110} step={1} onChange={setAngle} />
        <PSlider label="Speed" value={speed} min={0.3} max={2.5} step={0.1} onChange={setSpeed} />
      </div>
    </>
  );

  return <PlaygroundShell preview={preview} controls={controls} code={code} onReset={onReset} />;
}

export function MothsPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <PageShell
      eyebrow="Component"
      title="Moths"
      lead="Moths spiraling around a lamp, steering by transverse orientation: each one holds the light at a fixed angle, which bends its path into a spiral. Your cursor becomes the lamp."
    >
      <MothsPlayground key={resetKey} onReset={() => setResetKey((k) => k + 1)} />

      <section className="page-section" aria-labelledby="how-h">
        <h2 className="page-h2" id="how-h">Why they spiral</h2>
        <p className="page-p">
          Moths navigate by keeping a bright light at a constant angle. With the moon, effectively at infinity, that
          gives a straight line. With a nearby lamp the same rule traces a logarithmic spiral. Drag the{" "}
          <code>angle</code> slider: below 90° they spiral in, at 90° they orbit, above 90° they spiral away.
        </p>
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
