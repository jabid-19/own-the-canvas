import { describe, it, expect } from "vitest";
import {
  createGovernor, stepGovernor, collide, anchorTo, followAnchor,
  type Solid, type Body,
} from "./physics";

function feed(g: ReturnType<typeof createGovernor>, dt: number, totalMs: number) {
  for (let t = 0; t < totalMs; t += dt) stepGovernor(g, dt);
}

describe("governor", () => {
  it("starts at full quality", () => {
    expect(createGovernor().quality).toBe(1);
  });

  it("steps down under sustained slow frames", () => {
    const g = createGovernor();
    feed(g, 40, 5000);
    expect(g.quality).toBeLessThan(1);
  });

  it("never drops below 0.25", () => {
    const g = createGovernor();
    feed(g, 50, 60_000);
    expect(g.quality).toBe(0.25);
  });

  it("recovers to 1 under sustained fast frames, never above", () => {
    const g = createGovernor();
    feed(g, 50, 60_000);
    feed(g, 10, 120_000);
    expect(g.quality).toBe(1);
  });

  it("holds steady in the 17-22ms band", () => {
    const g = createGovernor();
    feed(g, 19.5, 60_000);
    expect(g.quality).toBe(1);
  });

  it("ignores a single long frame", () => {
    const g = createGovernor();
    stepGovernor(g, 64);
    feed(g, 16, 3000);
    expect(g.quality).toBe(1);
  });
});

const box: Solid = { id: 1, x: 100, y: 200, w: 100, h: 40 };
const body = (o: Partial<Body>): Body => ({ x: 150, y: 0, vx: 0, vy: 2, ...o });

describe("collide", () => {
  it("lands on a top edge crossed this step, snaps, stops", () => {
    const p = body({ y: 203 });
    expect(collide(p, 150, 198, [box], 0)).toBe(box);
    expect(p.y).toBe(200);
    expect(p.vy).toBe(0);
  });

  it("bounces with restitution", () => {
    const p = body({ y: 203, vy: 4 });
    expect(collide(p, 150, 198, [box], 0.5)).toBe(box);
    expect(p.vy).toBe(-2);
  });

  it("catches a fast body that crossed the edge in one step (no tunneling)", () => {
    const p = body({ y: 260, vy: 80 }); // jumped from above to below the solid
    expect(collide(p, 150, 180, [box], 0)).toBe(box);
    expect(p.y).toBe(200);
  });

  it("passes through when moving up", () => {
    const p = body({ y: 198, vy: -2 });
    expect(collide(p, 150, 203, [box], 0)).toBeNull();
    expect(p.y).toBe(198);
  });

  it("misses when outside the horizontal span", () => {
    const p = body({ x: 99, y: 203 });
    expect(collide(p, 99, 198, [box], 0)).toBeNull();
  });

  it("reflects vx on a side hit", () => {
    const p = body({ x: 103, y: 220, vx: 3, vy: 0.1 });
    expect(collide(p, 98, 219.9, [box], 0)).toBeNull();
    expect(p.x).toBe(100);
    expect(p.vx).toBe(-3);
  });

  it("picks the highest solid when crossing two top edges", () => {
    const lower: Solid = { id: 2, x: 100, y: 230, w: 100, h: 10 };
    const p = body({ y: 240, vy: 50 });
    expect(collide(p, 150, 190, [lower, box], 0)).toBe(box);
    expect(p.y).toBe(200);
  });

  it("does nothing with no solids", () => {
    const p = body({ y: 203 });
    expect(collide(p, 150, 198, [], 0)).toBeNull();
    expect(p).toEqual(body({ y: 203 }));
  });
});

describe("anchored rest", () => {
  it("follows its solid when the solid moves (scroll)", () => {
    const p = { x: 130, y: 197 };
    const a = anchorTo(p, box, -3);
    const scrolled = new Map([[1, { ...box, y: 50 }]]);
    expect(followAnchor(p, a, scrolled)).toBe(true);
    expect(p).toEqual({ x: 130, y: 47 });
  });

  it("releases when pushed past an edge", () => {
    const p = { x: 130, y: 197 };
    const a = anchorTo(p, box, -3);
    a.offsetX = 101;
    expect(followAnchor(p, a, new Map([[1, box]]))).toBe(false);
  });

  it("releases when its solid is gone", () => {
    const p = { x: 130, y: 197 };
    const a = anchorTo(p, box, -3);
    expect(followAnchor(p, a, new Map())).toBe(false);
  });
});
