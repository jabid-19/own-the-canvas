import React from "react";
import { PageShell } from "../components/PageShell";
import { CodeBlock, InlineCode } from "../components/CodeBlock";
import { PropsTable } from "../components/PropsTable";

const BASE_PROPS = [
  { name: "width", type: "number | string", default: '"100%"', description: "Canvas width. Accepts px number or CSS string." },
  { name: "height", type: "number | string", default: '"100%"', description: "Canvas height. Accepts px number or CSS string." },
  { name: "className", type: "string", default: "—", description: "CSS class applied to the wrapper div." },
  { name: "style", type: "CSSProperties", default: "—", description: "Inline styles applied to the wrapper div." },
];

const LINK: React.CSSProperties = {
  color: "var(--accent)",
  fontWeight: 700,
  textDecoration: "underline dashed",
  textUnderlineOffset: 4,
  whiteSpace: "nowrap",
};

export function Overview() {
  return (
    <PageShell
      eyebrow="Getting Started"
      title="Installation"
      lead="Get own-the-canvas up and running in your React project in under a minute."
    >
      {/* Installation */}
      <section className="page-section" aria-labelledby="install-h">
        <h2 className="page-h2" id="install-h">Install</h2>
        <CodeBlock code="npm install own-the-canvas" language="bash" />
        <p className="page-p" style={{ marginTop: 12 }}>
          Or with yarn / pnpm:
        </p>
        <CodeBlock code={`yarn add own-the-canvas\npnpm add own-the-canvas`} language="bash" />
      </section>

      <div className="page-divider" />

      {/* Peer deps */}
      <section className="page-section" aria-labelledby="peers-h">
        <h2 className="page-h2" id="peers-h">Peer dependencies</h2>
        <p className="page-p">
          These must already be installed in your project — they are not bundled.
        </p>
        <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--r)" }}>
          <table className="page-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>react</code></td>
                <td>≥ 18.0.0</td>
              </tr>
              <tr>
                <td><code>react-dom</code></td>
                <td>≥ 18.0.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="page-divider" />

      {/* Quick start */}
      <section className="page-section" aria-labelledby="quickstart-h">
        <h2 className="page-h2" id="quickstart-h">Quick start</h2>
        <p className="page-p">
          Import any component by name and drop it into your JSX. All components
          expand to fill their container by default.
        </p>
        <CodeBlock
          code={`import { MatrixRain } from 'own-the-canvas';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MatrixRain
        color="#00ff41"
        fontSize={16}
        speed={1}
        charset="katakana"
        glowEffect
      />
    </div>
  );
}`}
          language="tsx"
        />
        <div className="page-note">
          <strong>Container sizing:</strong> Components default to{" "}
          <InlineCode>width="100%"</InlineCode> and{" "}
          <InlineCode>height="100%"</InlineCode>. Make sure the parent element has
          explicit dimensions.
        </div>
      </section>

      <div className="page-divider" />

      {/* AI assistants */}
      <section className="page-section" id="ai" aria-labelledby="ai-h">
        <h2 className="page-h2" id="ai-h">Use with AI</h2>
        <p className="page-p">
          Connect your coding assistant and it can pick components by mood ("something cozy for the
          footer") and write code with the real props instead of guessing. Everything runs on your
          machine: no account, no API key.
        </p>

        <h3 className="page-h3">Claude Code</h3>
        <p className="page-p">Add the MCP server once, then run <InlineCode>/mcp</InlineCode> in Claude Code to check it's connected.</p>
        <CodeBlock code="claude mcp add own-the-canvas -- npx -y own-the-canvas" language="bash" />

        <h3 className="page-h3" style={{ marginTop: 28 }}>Cursor, Windsurf, other MCP clients</h3>
        <p className="page-p">
          Add this to your MCP settings (in Cursor: <InlineCode>.cursor/mcp.json</InlineCode> or Settings → MCP).
        </p>
        <CodeBlock
          code={`{
  "mcpServers": {
    "own-the-canvas": { "command": "npx", "args": ["-y", "own-the-canvas"] }
  }
}`}
          language="json"
        />

        <h3 className="page-h3" style={{ marginTop: 28 }}>No MCP? Use llms.txt</h3>
        <p className="page-p">
          Point any assistant (ChatGPT, Copilot, Gemini) at{" "}
          <a style={LINK} href="/llms.txt">llms.txt</a> for the component index, or{" "}
          <a style={LINK} href="/llms-full.txt">llms-full.txt</a> for every component and prop.
          Each component page also has <strong>Copy prompt</strong> and <strong>Open in Claude</strong> buttons.
        </p>

        <h3 className="page-h3" style={{ marginTop: 28 }}>Claude Code skill</h3>
        <p className="page-p">The package also ships a skill. Copy it into your project to use it without MCP:</p>
        <CodeBlock
          code="mkdir -p .claude/skills && cp -r node_modules/own-the-canvas/skills/own-the-canvas .claude/skills/"
          language="bash"
        />
      </section>

      <div className="page-divider" />

      {/* Tree shaking */}
      <section className="page-section" aria-labelledby="treeshake-h">
        <h2 className="page-h2" id="treeshake-h">Tree shaking</h2>
        <p className="page-p">
          The library is fully tree-shakeable. Only the components you import are
          included in your bundle.
        </p>
        <CodeBlock
          code={`// Only MatrixRain is bundled — other components are excluded
import { MatrixRain } from 'own-the-canvas';`}
          language="tsx"
        />
      </section>

      <div className="page-divider" />

      {/* TypeScript */}
      <section className="page-section" aria-labelledby="ts-h">
        <h2 className="page-h2" id="ts-h">TypeScript</h2>
        <p className="page-p">
          TypeScript types are included out of the box — no{" "}
          <InlineCode>@types</InlineCode> package needed. All props, event types,
          and union types are exported.
        </p>
        <CodeBlock
          code={`import type { MatrixRainProps, MatrixCharset } from 'own-the-canvas';

const charset: MatrixCharset = 'katakana';`}
          language="tsx"
        />
      </section>

      <div className="page-divider" />

      {/* Base props */}
      <section className="page-section" aria-labelledby="baseprops-h">
        <h2 className="page-h2" id="baseprops-h">Shared props</h2>
        <p className="page-p">
          Every component extends <InlineCode>BaseCanvasProps</InlineCode>.
          These props are available on all 30+ components.
        </p>
        <PropsTable props={BASE_PROPS} />
      </section>
    </PageShell>
  );
}
