import { readdirSync } from "node:fs";
import { extractComponents, componentMarkdown } from "./gen-ai-docs.mjs";

test("every docs page yields a component with a route, lead and props", () => {
  const components = extractComponents();
  const pages = readdirSync("src/docs/pages/components").filter((f) => f.endsWith("Page.tsx"));
  expect(components).toHaveLength(pages.length);
  for (const c of components) {
    expect(c.path).toMatch(/^\/components\/[a-z-]+$/);
    expect(c.lead.length).toBeGreaterThan(20);
    expect(c.props.length).toBeGreaterThan(0);
  }
});

test("component markdown has a working import and only real presets", () => {
  const moon = extractComponents().find((c) => c.name === "MoonlitSea");
  const md = componentMarkdown(moon);
  expect(md).toContain('import { MoonlitSea } from "own-the-canvas";');
  expect(md).toContain('<MoonlitSea preset="default" />');
  expect(md).toContain("| `horizon` | `number` | `0.42` |");
});
