import { describe, it, expect } from "vitest";
import { relaxPile, makePile } from "./SnowDrift/useSnowDrift";
import { craneFaces, shadeFace } from "./OrigamiCranes/useOrigamiCranes";
import { buildTree, seasonFullness } from "./SeasonsTree/useSeasonsTree";
import { ridgeY, makeLayers } from "./InkMountains/useInkMountains";
import { mergeDrops, slideDrop, SLIDE_R, type Drop } from "./WindowRain/useWindowRain";
import { curl } from "./IncenseSmoke/useIncenseSmoke";
import { glint, rowT } from "./MoonlitSea/useMoonlitSea";
import { cloudDensity } from "./CloudSea/useCloudSea";
import { fieldAt, spikeTarget, CRITICAL } from "./Ferrofluid/useFerrofluid";

const sum = (a: Float32Array) => a.reduce((s, v) => s + v, 0);

describe("SnowDrift: angle of repose", () => {
  it("a heap on the ground slumps to the repose slope and keeps its volume", () => {
    const p = makePile(300);
    p.h[50] = 120;
    const before = sum(p.h);
    for (let i = 0; i < 2000; i++) relaxPile(p, 0.7, false);
    expect(sum(p.h)).toBeCloseTo(before, 1);
    for (let i = 0; i < p.h.length - 1; i++) {
      expect(Math.abs(p.h[i] - p.h[i + 1])).toBeLessThanOrEqual(0.7 * p.cell + 0.05);
    }
  });

  it("snow on a ledge spills off the edges, conserving what stays plus what fell", () => {
    const p = makePile(30);
    p.h.fill(20);
    const before = sum(p.h);
    let spilled = 0;
    for (let i = 0; i < 500; i++) { const [l, r] = relaxPile(p, 0.7, true); spilled += l + r; }
    expect(spilled).toBeGreaterThan(0);
    expect(sum(p.h) + spilled).toBeCloseTo(before, 1);
    expect(p.h[0]).toBeLessThanOrEqual(0.7 * p.cell + 1e-6);
  });
});

describe("OrigamiCranes: paper geometry", () => {
  it("wings are mirror images and every facet is shaded within paper range", () => {
    for (const flap of [-0.6, 0, 0.9]) {
      const f = craneFaces(flap);
      const [l1, l2, r1, r2] = f.slice(-4);
      for (let i = 0; i < 3; i++) {
        expect(l1[i][2]).toBeCloseTo(-r1[i][2]);
        expect(l2[i][2]).toBeCloseTo(-r2[i][2]);
        expect(l1[i][1]).toBeCloseTo(r1[i][1]);
      }
      for (const face of f) {
        const s = shadeFace(face[0], face[1], face[2]);
        expect(s).toBeGreaterThanOrEqual(0.42);
        expect(s).toBeLessThanOrEqual(1.0001);
      }
    }
  });
});

describe("SeasonsTree", () => {
  it("builds the same tree for the same seed, every branch shorter than its parent", () => {
    const a = buildTree(7, 200), b = buildTree(7, 200);
    expect(a.branches.length).toBe(b.branches.length);
    expect(a.leaves.length).toBeGreaterThan(100);
    for (const br of a.branches) {
      if (br.parent >= 0) expect(br.len).toBeLessThan(a.branches[br.parent].len);
    }
  });

  it("foliage follows the year: budding, full, falling, bare", () => {
    expect(seasonFullness(0.1)).toBeLessThan(0.5);
    expect(seasonFullness(1.5)).toBe(1);
    expect(seasonFullness(2.5)).toBeCloseTo(0.5);
    expect(seasonFullness(3.5)).toBe(0);
    expect(seasonFullness(4.5)).toBe(seasonFullness(0.5));
  });
});

describe("InkMountains", () => {
  it("ridges stay inside their layer's band", () => {
    for (const L of makeLayers(600, 5)) {
      for (let x = -2000; x < 4000; x += 13) {
        const y = ridgeY(x, L);
        expect(y).toBeLessThanOrEqual(L.base + 1e-9);
        expect(y).toBeGreaterThanOrEqual(L.base - L.amp - 1e-9);
      }
    }
  });
});

describe("WindowRain: drops", () => {
  const drop = (r: number, y = 0): Drop => ({ x: 0, y, r, vy: 0, pinned: 0, traveled: 0, seed: 0 });

  it("merging conserves volume and keeps the lower drop's position", () => {
    const m = mergeDrops(drop(3, 10), drop(4, 20));
    expect(m.r ** 3).toBeCloseTo(27 + 64);
    expect(m.y).toBe(20);
  });

  it("surface tension holds small beads; big drops run down", () => {
    const small = drop(SLIDE_R - 0.5);
    const big = drop(SLIDE_R + 3);
    let movedBig = 0;
    for (let i = 0; i < 300; i++) { slideDrop(small, 1, 16); movedBig += slideDrop(big, 1, 16); }
    expect(small.y).toBe(0);
    expect(movedBig).toBeGreaterThan(50);
  });
});

describe("IncenseSmoke: air flow", () => {
  it("the swirl field is divergence-free (incompressible)", () => {
    const e = 1e-3;
    for (const [x, y, t] of [[10, 20, 0], [300, 150, 2.5], [-50, 400, 9]]) {
      const div = (curl(x + e, y, t)[0] - curl(x - e, y, t)[0]) / (2 * e)
        + (curl(x, y + e, t)[1] - curl(x, y - e, t)[1]) / (2 * e);
      expect(Math.abs(div)).toBeLessThan(1e-4);
    }
  });
});

describe("MoonlitSea: moon path", () => {
  it("glitter peaks under the moon at the reflecting slope and vanishes outside the path", () => {
    expect(glint(0.1, 0.1, 0)).toBeCloseTo(1);
    expect(glint(0.1, 0.1, 0.5)).toBeLessThan(glint(0.1, 0.1, 0));
    expect(glint(0.1, 0.1, 1.2)).toBe(0);
    expect(glint(0.6, 0.1, 0)).toBeLessThan(0.01);
  });

  it("rows pack toward the horizon (perspective)", () => {
    expect(rowT(10) - rowT(9)).toBeLessThan(rowT(60) - rowT(59));
  });
});

describe("CloudSea", () => {
  it("coverage controls how much of the deck is cloud", () => {
    let clear = 0, overcast = 0;
    for (let i = 0; i < 400; i++) {
      const x = (i % 20) * 0.37, y = Math.floor(i / 20) * 0.41;
      clear += cloudDensity(x, y, 0.1);
      overcast += cloudDensity(x, y, 0.95);
      expect(cloudDensity(x, y, 0.5)).toBeGreaterThanOrEqual(0);
      expect(cloudDensity(x, y, 0.5)).toBeLessThanOrEqual(1);
    }
    expect(overcast).toBeGreaterThan(clear * 3);
  });
});

describe("Ferrofluid: Rosensweig threshold", () => {
  it("stays flat below the critical field, spikes above it, taller nearer the magnet", () => {
    expect(spikeTarget(CRITICAL * 0.9, 100)).toBe(0);
    expect(spikeTarget(0.6, 100)).toBeGreaterThan(0);
    const near = spikeTarget(fieldAt(0, 60, 200), 100);
    const far = spikeTarget(fieldAt(0, 300, 200), 100);
    expect(near).toBeGreaterThan(far);
    expect(fieldAt(0, 0, 200)).toBe(1);
  });
});
