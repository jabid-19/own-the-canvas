import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import type { ComponentType } from "react";
import { useFrameHarness } from "../docs/test-frame-harness";
import { pointerInCanvas } from "../runtime/fx";
import { DragonCursor } from "./DragonCursor";
import { KoiPond } from "./KoiPond";
import { ButterflySwarm } from "./ButterflySwarm";
import { DeepSeaBioluminescence } from "./DeepSeaBioluminescence";
import { Boids } from "./Boids";
import { BlackHole } from "./BlackHole";
import { BubbleUniverse } from "./BubbleUniverse";
import { FlowField } from "./FlowField";
import { FluidSimulation } from "./FluidSimulation";
import { GalaxySpiral } from "./GalaxySpiral";
import { NeuralWeb } from "./NeuralWeb";
import { SpiderWeb } from "./SpiderWeb";
import { TornadoVortex } from "./TornadoVortex";
import { ParticleField } from "./ParticleField";
import { SlimeMold } from "./SlimeMold";

// Regression: cursor-following effects listen on window (so they see the
// cursor through foreground content) but must ignore it outside the canvas.

describe("pointerInCanvas", () => {
  const canvas = { getBoundingClientRect: () => ({ left: 100, top: 50, width: 400, height: 300 }) } as HTMLElement;

  it("returns canvas-local coords inside, null outside", () => {
    expect(pointerInCanvas({ clientX: 150, clientY: 80 }, canvas)).toEqual({ x: 50, y: 30 });
    expect(pointerInCanvas({ clientX: 100, clientY: 50 }, canvas)).toEqual({ x: 0, y: 0 });
    expect(pointerInCanvas({ clientX: 500, clientY: 350 }, canvas)).toEqual({ x: 400, y: 300 });
    expect(pointerInCanvas({ clientX: 99, clientY: 80 }, canvas)).toBeNull();
    expect(pointerInCanvas({ clientX: 501, clientY: 80 }, canvas)).toBeNull();
    expect(pointerInCanvas({ clientX: 150, clientY: 49 }, canvas)).toBeNull();
    expect(pointerInCanvas({ clientX: 150, clientY: 351 }, canvas)).toBeNull();
  });
});

describe("cursor-following effects ignore the cursor outside the canvas", () => {
  const h = useFrameHarness();

  it("DragonCursor wanders on the canvas instead of chasing a cursor in the sidebar", () => {
    render(<DragonCursor width="100%" height="100%" />);
    h.flush(10);
    h.fire("mousemove", 600, 250); // inside: it follows
    h.flush(200);
    const followed = Math.max(...h.stats.arcs.map((a) => a.x));
    expect(followed).toBeGreaterThan(450);

    h.fire("mousemove", -300, 250); // over a sidebar left of the canvas
    h.flush(400);
    const xs = h.stats.arcs.map((a) => a.x);
    expect(xs.length).toBeGreaterThan(0);
    expect(Math.min(...xs)).toBeGreaterThan(-30); // never dragged off toward x = -300
  });

  const EFFECTS: [string, ComponentType<Record<string, unknown>>][] = [
    ["DragonCursor", DragonCursor as never],
    ["KoiPond", KoiPond as never],
    ["ButterflySwarm", ButterflySwarm as never],
    ["DeepSeaBioluminescence", DeepSeaBioluminescence as never],
    ["Boids", Boids as never],
    ["BlackHole", BlackHole as never],
    ["BubbleUniverse", BubbleUniverse as never],
    ["FlowField", FlowField as never],
    ["FluidSimulation", FluidSimulation as never],
    ["GalaxySpiral", GalaxySpiral as never],
    ["NeuralWeb", NeuralWeb as never],
    ["SpiderWeb", SpiderWeb as never],
    ["TornadoVortex", TornadoVortex as never],
    ["ParticleField", ParticleField as never],
    ["SlimeMold", SlimeMold as never],
  ];

  it.each(EFFECTS)("%s keeps running through inside → outside → back-inside cursor moves", (_n, Effect) => {
    const { unmount } = render(<Effect width="100%" height="100%" />);
    h.flush(20);
    for (let x = 100; x <= 700; x += 60) { h.fire("mousemove", x, 250); h.flush(1); }
    h.fire("mousedown", 400, 250, document.querySelector("canvas")!); // start a drag where supported
    for (let x = 700; x >= -400; x -= 100) { h.fire("mousemove", x, 250); h.flush(1); } // drag out to the left
    h.flush(60);
    h.fire("mouseleave", 0, 0, document);
    h.flush(30);
    for (let x = 50; x <= 400; x += 50) { h.fire("mousemove", x, 300); h.flush(1); } // re-enter: no jump artifacts
    h.flush(60);
    expect(h.stats.drawCalls).toBeGreaterThan(50);
    unmount();
    expect(h.pendingFrames()).toBe(0);
  }, 30000);
});
