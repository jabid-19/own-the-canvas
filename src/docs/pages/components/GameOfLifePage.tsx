import React from "react";
import { PageShell, PreviewBox } from "../../components/PageShell";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { GameOfLife } from "../../../components/GameOfLife";

const PROPS = [
  { name: "cellSize",       type: "number",  default: "8",         description: "Cell size in px." },
  { name: "speed",          type: "number",  default: "10",        description: "Simulation updates per second." },
  { name: "initialDensity", type: "number",  default: "0.3",       description: "Initial alive cell density 0–1." },
  { name: "aliveColor",     type: "string",  default: '"#ffffff"', description: "Color of newly born cells." },
  { name: "oldColor",       type: "string",  default: '"#6b7280"', description: "Color of aged cells." },
  { name: "deadColor",      type: "string",  default: '"#111111"', description: "Color of dead cells." },
  { name: "showAge",        type: "boolean", default: "true",      description: "Color cells by generation age." },
  { name: "wrapEdges",      type: "boolean", default: "true",      description: "Wrap cells at canvas edges (toroidal)." },
  { name: "interactive",    type: "boolean", default: "true",      description: "Click to toggle cells alive/dead." },
  { name: "backgroundColor",type: "string",  default: '"#111111"', description: "Canvas background color." },
  { name: "preset",         type: "string",  default: "—",         description: '"default" | "neon" | "matrix" | "minimal" | "fire"' },
];

export function GameOfLifePage() {
  return (
    <PageShell
      eyebrow="Component"
      title="GameOfLife"
      lead="Conway's Game of Life — emergent cellular automata where simple rules produce complex living patterns. Click cells to draw. Age-based color gradients reveal generation history."
    >
      <PreviewBox playgroundId="GameOfLife">
        <GameOfLife width="100%" height="100%" />
      </PreviewBox>

      <section className="page-section" aria-labelledby="usage-h">
        <h2 className="page-h2" id="usage-h">Usage</h2>
        <CodeBlock code={`import { GameOfLife, GameOfLifeHandle } from 'own-the-canvas';
import { useRef } from 'react';

const ref = useRef<GameOfLifeHandle>(null);

<GameOfLife
  ref={ref}
  cellSize={8}
  speed={10}
  showAge
  interactive
  preset="neon"
  width="100%"
  height="100%"
/>

// Imperative controls
ref.current?.randomize();
ref.current?.clear();
ref.current?.pause();
ref.current?.resume();`} language="tsx" />
      </section>

      <section aria-labelledby="props-h">
        <h2 className="page-h2" id="props-h">Props</h2>
        <PropsTable props={PROPS} />
      </section>
    </PageShell>
  );
}
