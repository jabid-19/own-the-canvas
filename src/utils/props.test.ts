import { describe, it, expect, vi, afterEach } from "vitest";
import { resolvePreset } from "./props";

const PRESETS = { default: { a: 1 }, neon: { a: 2 } };

describe("resolvePreset", () => {
  afterEach(() => vi.restoreAllMocks());

  it("missing preset resolves to default, known preset to itself", () => {
    expect(resolvePreset("T1", PRESETS, {})).toEqual({ a: 1 });
    expect(resolvePreset("T1", PRESETS, { preset: "neon" })).toEqual({ a: 2 });
  });

  it("unknown preset falls back to {} and warns once naming component, prop and value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolvePreset("T2", PRESETS, { preset: "nope" })).toEqual({});
    resolvePreset("T2", PRESETS, { preset: "nope" });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/T2.*preset.*"nope".*default, neon/);
  });

  it("warns on non-finite numbers and (where CSS.supports exists) bad colors", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const supports = vi.fn((_p: string, v: string) => v !== "notacolor");
    vi.stubGlobal("CSS", { supports });
    const props = { speed: NaN, color: "notacolor", colors: ["#fff", "notacolor"], fontSize: 0 };
    resolvePreset("T3", PRESETS, props);
    vi.unstubAllGlobals();
    const msgs = warn.mock.calls.map((c) => c[0]);
    expect(msgs).toHaveLength(3);
    expect(msgs.join("\n")).toMatch(/speed NaN[\s\S]*color "notacolor"[\s\S]*colors "notacolor"/);
  });
});
