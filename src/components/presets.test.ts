import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";

// ponytail: source-level check, cheaper than rendering 60 canvases.
// Guards the "colorful default, monochrome opt-in" rule from component-creation-guide.md.
const dir = join(__dirname);
const components = readdirSync(dir).filter((d) => existsSync(join(dir, d, `${d}.tsx`)));
const NO_PRESET_COLORS = new Set(["LSystem"]); // presets are shapes, color is a plain prop

describe("preset color defaults", () => {
  for (const name of components) {
    if (NO_PRESET_COLORS.has(name)) continue;
    const src = readFileSync(join(dir, name, `${name}.tsx`), "utf8");

    it(`${name}: no preset resolves to "default"`, () => {
      expect(src).toMatch(/PRESETS\[\(preset \?\? "default"\) as \w+\]/);
    });

    it(`${name}: default preset has colors, monochrome preset exists`, () => {
      const def = src.match(/\n\s*"?default"?\s*:\s*\{([\s\S]*?)\n?\s*\},?\n/)?.[1] ?? "";
      expect(def).toMatch(/#[0-9a-fA-F]{6}|palette:|colorMode:/);
      expect(src).toMatch(/\n\s*"?monochrome"?\s*:/);
    });
  }
});
