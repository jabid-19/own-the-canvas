import { test, expect } from "vitest";
import { readdirSync } from "node:fs";
import MOODS from "./moods.json";
import { searchComponents } from "./search";

const items = Object.keys(MOODS).map((name) => ({ name }));
const names = (q: string) => searchComponents(items, q).map((i) => i.name);

test("every docs page has mood tags", () => {
  const pages = readdirSync("src/docs/pages/components").map((f) => f.replace(/Page\.tsx$/, ""));
  expect(Object.keys(MOODS).sort()).toEqual(pages.sort());
});

test("vibe query ranks components that match the most words first", () => {
  const top = names("calm night by the water").slice(0, 3);
  expect(top).toContain("MoonlitSea");
  expect(names("calm night by the water")).toContain("Fireflies");
});

test("matches names, prefixes and one typo", () => {
  expect(names("koi")[0]).toBe("KoiPond");
  expect(names("moonlit")).toContain("MoonlitSea");
  expect(names("nigth")).toContain("MoonlitSea");
  expect(names("waves")).toContain("MoonlitSea");
});

test("empty query returns everything, nonsense returns nothing", () => {
  expect(names("")).toHaveLength(items.length);
  expect(names("xyzzyq")).toEqual([]);
});
