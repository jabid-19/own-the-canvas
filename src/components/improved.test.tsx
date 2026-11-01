import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import type { ComponentType } from "react";
import { useFrameHarness } from "../docs/test-frame-harness";
import { funnelRadius, spinAt } from "./TornadoVortex/useTornadoVortex";
import { limb, loopPoint } from "./SolarFlare/useSolarFlare";
import { doppler, lensOffset } from "./BlackHole/useBlackHole";
import { warpedField } from "./NoiseGradient/useNoiseGradient";
import { canSee, steer, type Boid, type UseBoidsOptions } from "./Boids/useBoids";
import { deform } from "./WatercolorBloom/useWatercolorBloom";
import { SolarFlare } from "./SolarFlare";
import { NoiseGradient } from "./NoiseGradient";
import { WatercolorBloom } from "./WatercolorBloom";

describe("TornadoVortex", () => {
  it("is a rope at the ground flaring into the cloud, spinning fastest at the base", () => {
    expect(funnelRadius(0, 100, 6)).toBe(6);
    expect(funnelRadius(1, 100, 6)).toBe(100);
    expect(funnelRadius(0.3, 100, 6)).toBeLessThan(funnelRadius(0.7, 100, 6));
    expect(spinAt(0, 3)).toBeGreaterThan(spinAt(1, 3));
  });
});

describe("SolarFlare", () => {
  it("limb darkening: brightest at the center, dimmer at the edge", () => {
    expect(limb(0)).toBeCloseTo(1);
    expect(limb(0.9)).toBeLessThan(limb(0.5));
    expect(limb(1)).toBeCloseTo(0.4);
  });

  it("magnetic loops are anchored on the limb and arch outward", () => {
    const l = { angle: 0, span: 0.4, height: 0.3, phase: 0, flow: [] };
    const foot = loopPoint(0, 0, 100, l, 0, 1);
    const top = loopPoint(0, 0, 100, l, 0.5, 1);
    expect(Math.hypot(...foot)).toBeCloseTo(100);
    expect(Math.hypot(...top)).toBeCloseTo(130);
  });
});

describe("BlackHole", () => {
  it("beams the approaching side brighter than the receding side", () => {
    expect(doppler(0)).toBeGreaterThan(doppler(Math.PI));
    expect(doppler(Math.PI)).toBeGreaterThan(0);
  });

  it("lenses background points outward, more strongly near the hole, and hides the shadow", () => {
    expect(lensOffset(20, 50, 30)).toBeNull();
    const near = lensOffset(60, 50, 30)! - 60;
    const far = lensOffset(600, 50, 30)! - 600;
    expect(near).toBeGreaterThan(far);
    expect(far).toBeGreaterThan(0);
  });
});

describe("NoiseGradient", () => {
  it("warped field stays in [0,1] and changes over time", () => {
    let changed = 0;
    for (let i = 0; i < 50; i++) {
      const [v, sheen] = warpedField(i * 0.13, i * 0.07, 0, 3, 0.5, 0.5);
      const [v2] = warpedField(i * 0.13, i * 0.07, 2, 3, 0.5, 0.5);
      expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1);
      expect(sheen).toBeGreaterThanOrEqual(0); expect(sheen).toBeLessThanOrEqual(1);
      if (Math.abs(v - v2) > 1e-3) changed++;
    }
    expect(changed).toBeGreaterThan(40);
  });
});

describe("Boids", () => {
  const bird = (x: number, y: number, vx: number, vy = 0): Boid => ({ x, y, vx, vy, z: 1, flap: 0, bank: 0, fear: 0, wander: 0, trail: [] });
  const opts = {
    separationRadius: 25, alignmentRadius: 50, cohesionRadius: 60,
    separationForce: 0.05, alignmentForce: 0.05, cohesionForce: 0.03,
  } as UseBoidsOptions;

  it("has a blind spot directly behind", () => {
    const b = bird(0, 0, 1);
    expect(canSee(b, 10, 0)).toBe(true);
    expect(canSee(b, 0, 10)).toBe(true);
    expect(canSee(b, -10, 0)).toBe(false);
  });

  it("separates from crowding, aligns with neighbours, and inherits their panic", () => {
    const b = bird(0, 0, 1);
    const close = bird(5, 0, 1);
    const [sx] = steer(b, [b, close], opts);
    expect(sx).toBeLessThan(0); // pushed away from the bird just ahead

    const mate = bird(30, 0, 0, 2);
    mate.fear = 1;
    const [, ay, fear] = steer(b, [b, mate], opts);
    expect(ay).toBeGreaterThan(0); // turning to match its heading
    expect(fear).toBeGreaterThan(0.8);
  });
});

describe("WatercolorBloom", () => {
  it("each deformation pass doubles the vertices and keeps the shape roughly round", () => {
    const pts: number[] = [], vari: number[] = [];
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; pts.push(Math.cos(a), Math.sin(a)); vari.push(1); }
    const out = deform(pts, vari, 0.3, 3);
    expect(out.pts.length).toBe(pts.length * 8);
    let mean = 0;
    for (let i = 0; i < out.pts.length; i += 2) mean += Math.hypot(out.pts[i], out.pts[i + 1]);
    mean /= out.pts.length / 2;
    expect(mean).toBeGreaterThan(0.6);
    expect(mean).toBeLessThan(1.6);
  });
});

describe("improved effects: frame smoke test", () => {
  const h = useFrameHarness();
  const EFFECTS: [string, ComponentType<Record<string, unknown>>, Record<string, unknown>][] = [
    ["SolarFlare", SolarFlare as never, { autoFlareInterval: 200 }],
    ["NoiseGradient", NoiseGradient as never, {}],
    ["NoiseGradient (static)", NoiseGradient as never, { animated: false }],
    ["WatercolorBloom", WatercolorBloom as never, { autoBloomInterval: 100 }],
  ];

  it.each(EFFECTS)("%s runs 300 frames with clicks without throwing", (_n, Effect, props) => {
    const { unmount } = render(<Effect width="100%" height="100%" {...props} />);
    h.flush(30);
    for (const [x, y] of [[400, 250], [120, 80], [700, 400]]) {
      h.fire("pointerdown", x, y);
      h.fire("pointerup", x, y);
      h.flush(5);
    }
    h.flush(250);
    h.flush(15, 64);
    expect(h.stats.drawCalls).toBeGreaterThan(50);
    unmount();
    expect(h.pendingFrames()).toBe(0);
  }, 30000);
});
