import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useFrameHarness } from "../docs/test-frame-harness";
import type { ComponentType } from "react";
import { IvyGrowth } from "./IvyGrowth";
import { Fireflies } from "./Fireflies";
import { Dandelion } from "./Dandelion";
import { GrassField } from "./GrassField";
import { Moths } from "./Moths";
import { SunbeamDust } from "./SunbeamDust";
import { PaperLanterns } from "./PaperLanterns";
import { KelpForest } from "./KelpForest";
import { SnowDrift } from "./SnowDrift";
import { FrostGlass } from "./FrostGlass";
import { OrigamiCranes } from "./OrigamiCranes";
import { SeasonsTree } from "./SeasonsTree";
import { InkMountains } from "./InkMountains";
import { WindowRain } from "./WindowRain";
import { IncenseSmoke } from "./IncenseSmoke";
import { MoonlitSea } from "./MoonlitSea";
import { CloudSea } from "./CloudSea";
import { Ferrofluid } from "./Ferrofluid";

// Runs every new effect through real frames (pointer moves, taps, DOM solids)
// against a permissive fake 2D context, so draw-path crashes surface in CI.

const h = useFrameHarness();
const flush = h.flush;
const fire = h.fire;

const EFFECTS: [string, ComponentType<Record<string, unknown>>, Record<string, unknown>][] = [
  ["IvyGrowth", IvyGrowth as never, { collide: true, growthSpeed: 4 }],
  ["IvyGrowth (canvas, loop)", IvyGrowth as never, { loop: true, growthSpeed: 4 }],
  ["Fireflies", Fireflies as never, { collide: true }],
  ["Dandelion", Dandelion as never, { collide: true }],
  ["GrassField", GrassField as never, { flowers: 0.1 }],
  ["Moths", Moths as never, {}],
  ["SunbeamDust", SunbeamDust as never, {}],
  ["PaperLanterns", PaperLanterns as never, { collide: true }],
  ["KelpForest", KelpForest as never, {}],
  ["SnowDrift", SnowDrift as never, { collide: true, count: 400 }],
  ["FrostGlass", FrostGlass as never, { collide: true, growthSpeed: 4 }],
  ["OrigamiCranes", OrigamiCranes as never, { collide: true }],
  ["SeasonsTree", SeasonsTree as never, { collide: true, cycleSeconds: 8 }],
  ["InkMountains", InkMountains as never, {}],
  ["WindowRain", WindowRain as never, { rain: 4 }],
  ["IncenseSmoke", IncenseSmoke as never, { sticks: 3 }],
  ["MoonlitSea", MoonlitSea as never, {}],
  ["CloudSea", CloudSea as never, {}],
  ["Ferrofluid", Ferrofluid as never, {}],
];

describe("nature effects: frame smoke test", () => {
  it.each(EFFECTS)("%s runs 300 frames with pointer input without throwing", (_name, Effect, props) => {
    const { unmount } = render(
      <div>
        <Effect width="100%" height="100%" {...props} />
        <h1 data-otc-solid>Headline</h1>
      </div>,
    );
    flush(60);
    // Sweep the cursor fast across the canvas (blows dandelions, parts grass, steers moths)
    for (let x = 50; x <= 750; x += 35) {
      fire("pointermove", x, 300 + Math.sin(x) * 60);
      flush(1);
    }
    fire("pointerdown", 400, 240); // tap on the solid
    fire("pointerup", 400, 240);
    fire("pointerdown", 120, 120); // tap on empty canvas
    flush(200, 16);
    flush(20, 64); // slow frames: dt clamp + governor path
    expect(h.stats.drawCalls).toBeGreaterThan(100);
    unmount();
    expect(h.pendingFrames()).toBe(0);
  }, 30000); // per-pixel effects (CloudSea) are slow under jsdom; real browsers hold 120fps

  it("overlay mode portals to body and clears instead of painting a background", () => {
    const { unmount } = render(<Fireflies overlay />);
    flush(5);
    const canvas = document.body.querySelector("canvas")!;
    expect(canvas.style.position).toBe("fixed");
    expect(canvas.style.pointerEvents).toBe("none");
    unmount();
    expect(document.body.querySelector("canvas")).toBeNull();
  });
});
