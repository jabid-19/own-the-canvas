// Generates AI-readable docs from the docs-site component pages:
//   public/llms.txt, public/llms-full.txt, public/components/<slug>.md  (served by the docs site)
//   skills/own-the-canvas/SKILL.md + components.md                     (shipped in the npm package)
// Source of truth = each src/docs/pages/components/*Page.tsx (title, lead, PROPS) + routes in DocsApp.tsx.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://own-the-canvas.vercel.app";

export function extractComponents(root = ROOT) {
  const pagesDir = join(root, "src/docs/pages/components");
  const app = readFileSync(join(root, "src/docs/DocsApp.tsx"), "utf8");
  const routes = Object.fromEntries(
    [...app.matchAll(/path="(\/components\/[^"]+)"\s+element=\{<(\w+)\s*\/>\}/g)].map((m) => [m[2], m[1]]),
  );

  return readdirSync(pagesDir)
    .filter((f) => f.endsWith("Page.tsx"))
    .map((file) => {
      const src = readFileSync(join(pagesDir, file), "utf8");
      const page = file.replace(/\.tsx$/, "");
      const name = src.match(/title="([^"]+)"/)?.[1];
      const lead = src.match(/lead="([^"]+)"/)?.[1];
      const propsSrc = src.match(/const PROPS = (\[[\s\S]*?\n\]);/)?.[1];
      if (!name || !lead || !propsSrc || !routes[page]) throw new Error(`${file}: missing title, lead, PROPS or route`);
      // ponytail: PROPS is a plain object literal in our own source files, so evaluating it is safe and
      // cheaper than a TS parser. Switch to the TypeScript compiler API if pages ever compute PROPS.
      const props = new Function(`return ${propsSrc}`)();
      return { name, lead, path: routes[page], props };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

const esc = (s) => String(s).replace(/\|/g, "\\|");

export function componentMarkdown(c) {
  const presetProp = c.props.find((p) => p.name === "preset");
  const preset = presetProp && `${presetProp.type} ${presetProp.description}`.match(/"([\w-]+)"/)?.[1];
  return [
    `# ${c.name}`,
    "",
    c.lead,
    "",
    `Docs and live playground: ${SITE}${c.path}`,
    "",
    "```tsx",
    `import { ${c.name} } from "own-the-canvas";`,
    "",
    `<div style={{ width: "100%", height: 400 }}>`,
    `  <${c.name}${preset ? ` preset="${preset}"` : ""} />`,
    `</div>`,
    "```",
    "",
    "## Props",
    "",
    "| Prop | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    ...c.props.map((p) => `| \`${p.name}\` | \`${esc(p.type)}\` | \`${esc(p.default)}\` | ${esc(p.description)} |`),
    "",
  ].join("\n");
}

const USAGE = `## Usage rules

- Install: \`npm install own-the-canvas\`. Peer deps: React 18 or 19. Zero other dependencies.
- Every component fills its parent. Give the parent a size (e.g. \`width: 100%; height: 400px\`, or \`100vw\`/\`100vh\` for a full-screen background).
- \`preset\` gives a themed palette; any individual prop overrides it. \`preset="monochrome"\` is the grayscale look.
- Components pause offscreen and in background tabs, respect \`prefers-reduced-motion\`, and are SSR-safe. In Next.js App Router, render them from a \`"use client"\` component.
- Components that list \`overlay\` in their props can run as a fixed, click-through, full-viewport layer over the page: \`<SnowDrift overlay />\`.
- DOM-aware effects (props include \`collide\`): mark elements with \`data-otc-solid\` and particles land on them, e.g. \`<SakuraBlossom overlay collide />\` + \`<h1 data-otc-solid>\`. Use \`data-otc-solid="live"\` for sticky or animated elements. Collisions use the element's box, so use \`display: inline-block\` to catch particles only over text.
- On light pages, overlay particles are light by default; pass a darker \`color\`.
- Only use props listed for a component. Do not invent props or preset names.
`;

const HEADER = `# own-the-canvas

> Canvas-based, animated React visual components (nature scenes, creatures, particles, simulations). TypeScript, zero dependencies, React 18/19.
`;

export function generate(root = ROOT) {
  const components = extractComponents(root);
  const index = components.map((c) => `- [${c.name}](${SITE}${c.path}.md): ${c.lead}`).join("\n");
  const full = components.map(componentMarkdown).join("\n---\n\n");

  const out = {
    "public/llms.txt": `${HEADER}\n${USAGE}\n## Components\n\n${index}\n\n## Optional\n\n- [All components, full props](${SITE}/llms-full.txt)\n`,
    "public/llms-full.txt": `${HEADER}\n${USAGE}\n---\n\n${full}`,
    "skills/own-the-canvas/SKILL.md": `---
name: own-the-canvas
description: Add animated canvas backgrounds and effects to a React app with the own-the-canvas library (nature scenes, creatures, particles, cursor effects, snow or petals that land on page elements). Use when the user wants an animated background, hero effect, cursor effect, or visual flourish in React.
---

${HEADER}
${USAGE}
## Picking a component

Choose from the list below by mood. Then read the component's section in [components.md](components.md) for its exact props and presets before writing code.

${components.map((c) => `- **${c.name}**: ${c.lead}`).join("\n")}
`,
    "skills/own-the-canvas/components.md": full,
  };
  for (const c of components) out[`public${c.path}.md`] = componentMarkdown(c);

  for (const [rel, text] of Object.entries(out)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), text);
  }
  return components;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`gen-ai-docs: ${generate().length} components`);
}
