import { describe, it, expect } from "vitest";
import { stepPhases, syncOrder } from "./Fireflies/useFireflies";
import { steerMoth, type Moth } from "./Moths/useMoths";
import { stepBlade, type Blade } from "./GrassField/useGrassField";
import { stepSeed, type Seed } from "./Dandelion/useDandelion";
import { createPlant, growStep } from "./IvyGrowth/useIvyGrowth";
import { makeBeams, beamIntensity } from "./SunbeamDust/useSunbeamDust";
import { stepLantern, type Lantern } from "./PaperLanterns/usePaperLanterns";
import { makeChain, stepChain } from "./KelpForest/useKelpForest";

describe("Fireflies: pulse-coupled sync", () => {
  const swarm = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ x: 0, y: 0, phase: i / n, flash: 0 }));

  it("coupled fireflies converge to flashing in unison", () => {
    const flies = swarm(30);
    expect(syncOrder(flies)).toBeLessThan(0.01);
    for (let i = 0; i < 60 * 60; i++) stepPhases(flies, 1 / 60, 1, 0.1, Infinity);
    expect(syncOrder(flies)).toBeGreaterThan(0.99);
  });

  it("uncoupled fireflies stay scattered", () => {
    const flies = swarm(30);
    for (let i = 0; i < 60 * 60; i++) stepPhases(flies, 1 / 60, 1, 0, Infinity);
    expect(syncOrder(flies)).toBeLessThan(0.05);
  });

  it("only neighbours within radius are nudged", () => {
    const flies = [
      { x: 0, y: 0, phase: 0.999, flash: 0 },
      { x: 10, y: 0, phase: 0.5, flash: 0 },
      { x: 1000, y: 0, phase: 0.5, flash: 0 },
    ];
    stepPhases(flies, 0.01, 1, 0.1, 50);
    expect(flies[0].flash).toBe(1);
    expect(flies[1].phase).toBeGreaterThan(flies[2].phase);
  });
});

describe("Moths: transverse orientation", () => {
  // Starts on a circle of radius 200 heading exactly at the desired angle.
  function flight(angleDeg: number, steps: number) {
    const alpha = (angleDeg * Math.PI) / 180;
    const m: Moth = { x: 200, y: 0, heading: Math.PI - alpha, speed: 2, alpha, side: 1, flap: 0, size: 1, escape: 0, seed: 0 };
    for (let i = 0; i < steps; i++) steerMoth(m, 0, 0, 1);
    return Math.hypot(m.x, m.y);
  }

  it("spirals in below 90°, holds orbit near 90°, spirals out above", () => {
    expect(flight(75, 600)).toBeLessThan(100);
    const orbit = flight(90, 600);
    expect(orbit).toBeGreaterThan(170);
    expect(orbit).toBeLessThan(240);
    expect(flight(100, 600)).toBeGreaterThan(300);
  });
});

describe("GrassField: blade spring", () => {
  const blade = (): Blade => ({ x: 0, row: 0, h: 50, w: 3, angle: 0, vel: 0, lean: 0, stiffness: 0.1, shade: 0, flower: false });

  it.each([1, 2, 3.84])("settles on the wind target and never blows up (k=%s)", (k) => {
    const b = blade();
    let peak = 0;
    for (let i = 0; i < 2000 / k; i++) {
      stepBlade(b, 0.4, k);
      peak = Math.max(peak, Math.abs(b.angle));
    }
    expect(b.angle).toBeCloseTo(0.4, 2);
    expect(peak).toBeLessThan(1);
  });
});

describe("Dandelion: pappus drag", () => {
  const seed = (): Seed => ({ x: 100, y: 100, vx: 0, vy: -6, phase: 0, life: 0, alpha: 1, rest: null, landed: false });

  it("thrown seeds lose momentum and drift down near terminal speed", () => {
    const s = seed();
    let maxVy = -Infinity;
    for (let i = 0; i < 600; i++) {
      stepSeed(s, { t: i / 60, wind: 0 }, 1);
      if (i > 300) maxVy = Math.max(maxVy, s.vy);
    }
    expect(maxVy).toBeLessThan(0.7); // sink 0.32 + lift ≤ 0.28: floats, never plummets
    expect(s.vy).toBeGreaterThan(-0.4);
  });

  it("is frame-rate independent", () => {
    const a = seed(), b = seed();
    for (let i = 0; i < 120; i++) stepSeed(a, { t: 0, wind: 0.5 }, 1);
    for (let i = 0; i < 60; i++) stepSeed(b, { t: 0, wind: 0.5 }, 2);
    expect(Math.abs(a.x - b.x)).toBeLessThan(6);
    expect(Math.abs(a.y - b.y)).toBeLessThan(6);
  });
});

describe("IvyGrowth: space colonization", () => {
  it("grows from the root to consume every attractor, as a valid tree", () => {
    const ax: number[] = [], ay: number[] = [];
    for (let y = 180; y >= 0; y -= 12) { ax.push(20 + Math.sin(y) * 10); ay.push(y); }
    for (let x = 30; x <= 150; x += 12) { ax.push(x); ay.push(40); }
    const pl = createPlant([{ x: 20, y: 220, dx: 0, dy: -1 }], ax, ay, 40);
    const gp = { influence: 40, kill: 8, segLen: 4, maxNodes: 5000 };
    for (let i = 0; i < 2000 && !pl.done; i++) growStep(pl, gp);

    expect(pl.done).toBe(true);
    expect(pl.live).toBe(0);
    pl.nodes.forEach((n, i) => {
      if (i > 0) expect(n.parent).toBeGreaterThanOrEqual(0);
      expect(n.parent).toBeLessThan(i);
    });
    expect(pl.nodes[0].weight).toBe(pl.nodes.length - 1); // pipe model: root carries everything
  });

  it("leans toward the sun", () => {
    const pl = createPlant([{ x: 0, y: 0, dx: 0, dy: -1 }], [0], [-200], 40);
    growStep(pl, { influence: 40, kill: 4, segLen: 4, maxNodes: 100, sunX: 300, sunY: 0, sun: 1 });
    expect(pl.nodes[1].x).toBeGreaterThan(0);
  });
});

describe("SunbeamDust: light shafts", () => {
  const beams = makeBeams(800, 600, 3, 20, 0.4, 0.45);

  it("lights points inside a shaft and leaves shadow dark", () => {
    const b = beams[1];
    const along = b.length * 0.3;
    const lat = b.width * (1 + b.spread * 0.3) * 0.5;
    const x = b.ax + b.dx * along + b.nx * lat;
    const y = b.ay + b.dy * along + b.ny * lat;
    expect(beamIntensity(x, y, beams)).toBeGreaterThan(0.5);
    expect(beamIntensity(5, 590, beams)).toBe(0);
  });

  it("leaves dark mullion gaps between panes", () => {
    const [a, b] = beams;
    const gapX = (a.ax + a.width / Math.cos((20 * Math.PI) / 180) + b.ax) / 2;
    expect(beamIntensity(gapX, 1, beams)).toBe(0);
  });
});

describe("PaperLanterns: buoyancy", () => {
  it("accelerates to a depth-scaled terminal rise and holds it", () => {
    const l: Lantern = { x: 0, y: 500, z: 1, vx: 0, vy: 0, sway: 0, swayVel: 0, phase: 0, seed: 0, born: 1 };
    let fastest = 0;
    for (let i = 0; i < 900; i++) {
      stepLantern(l, { t: i / 60, wind: 0, rise: 1 }, 1);
      fastest = Math.min(fastest, l.vy);
    }
    const terminal = -(0.35 + 0.65 * l.z);
    expect(l.vy).toBeCloseTo(terminal, 1);
    expect(fastest).toBeGreaterThanOrEqual(-1.0001);
    expect(l.y).toBeLessThan(0);
  });
});

describe("KelpForest: anchored rope", () => {
  it("keeps segment lengths and the root pinned under buoyancy and current", () => {
    const c = makeChain(100, 400, 16, 20);
    for (let i = 0; i < 400; i++) stepChain(c, (j) => [0.02 * Math.sin(i * 0.05) * (j / 15), -0.045], i % 3 ? 1 : 2.5);
    expect(c.x[0]).toBe(100);
    expect(c.y[0]).toBe(400);
    for (let i = 1; i < 16; i++) {
      const d = Math.hypot(c.x[i] - c.x[i - 1], c.y[i] - c.y[i - 1]);
      expect(Math.abs(d - 20) / 20).toBeLessThan(0.05);
    }
    expect(c.y[15]).toBeLessThan(c.y[0] - 200); // buoyant: stands up
  });
});

describe("Eye: blink curve", () => {
  it("closes fast, holds shut, opens slower, then rests open", async () => {
    const { blinkClosure } = await import("./Eye/useEye");
    expect(blinkClosure(-1)).toBe(0);
    expect(blinkClosure(0.035)).toBeCloseTo(0.5, 5);
    expect(blinkClosure(0.085)).toBe(1);
    expect(blinkClosure(0.185)).toBeCloseTo(0.5, 5); // half open takes longer than half closed
    expect(blinkClosure(0.5)).toBe(0);
  });
});

describe("Octopus: arm IK and grip points", () => {
  it("fabrik keeps link lengths and reaches a target in range", async () => {
    const { fabrik } = await import("./Octopus/useOctopus");
    const P = Array.from({ length: 11 }, (_, i) => ({ x: i * 10, y: 0 }));
    fabrik(P, { x: 0, y: 0 }, { x: 40, y: 60 }, 10, 8);
    expect(P[0]).toEqual({ x: 0, y: 0 });
    for (let i = 1; i < P.length; i++) expect(Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y)).toBeCloseTo(10, 5);
    expect(Math.hypot(P[10].x - 40, P[10].y - 60)).toBeLessThan(1);
  });
  it("edgePoint lands on the rect outline, from outside and inside", async () => {
    const { edgePoint } = await import("./Octopus/useOctopus");
    const s = { id: 1, x: 100, y: 100, w: 50, h: 20 };
    expect(edgePoint(s, { x: 80, y: 110 })).toEqual({ x: 100, y: 110 });
    expect(edgePoint(s, { x: 120, y: 103 })).toEqual({ x: 120, y: 100 }); // inside, nearest the top edge
  });
});

describe("Owl and Hummingbird: page perches and flowers", () => {
  it("pickPerch takes the solid nearest the middle that has headroom", async () => {
    const { pickPerch, owlBlink } = await import("./Owl/useOwl");
    const a = { id: 1, x: 0, y: 150, w: 40, h: 20 }, b = { id: 2, x: 130, y: 150, w: 40, h: 20 }, low = { id: 3, x: 140, y: 10, w: 20, h: 10 };
    expect(pickPerch([a, b, low], 300, 200, 100)?.id).toBe(2);
    expect(pickPerch([low], 300, 200, 100)).toBeNull();
    expect(owlBlink(0.15)).toBe(1);
    expect(owlBlink(1)).toBe(0);
  });
  it("solidNectar offers both side edges, facing inward", async () => {
    const { solidNectar } = await import("./Hummingbird/useHummingbird");
    const [l, r] = solidNectar([{ id: 7, x: 10, y: 20, w: 100, h: 40 }]);
    expect(l).toMatchObject({ x: 8, y: 40, face: 1 });
    expect(r).toMatchObject({ x: 112, y: 40, face: -1 });
  });
});

describe("Cat, Jellyfish, Snail, Sunflowers, Komorebi, TidePool: pure helpers", () => {
  it("onCat hits the curled body and head, misses the air above", async () => {
    const { onCat } = await import("./Cat/useCat");
    expect(onCat(0, -0.25)).toBe(true);
    expect(onCat(-0.4, -0.36)).toBe(true);
    expect(onCat(0, -1)).toBe(false);
  });
  it("jelly pulse squeezes fast and relaxes slowly", async () => {
    const { pulse } = await import("./Jellyfish/useJellyfish");
    expect(pulse(0)).toBeCloseTo(0);
    expect(pulse(0.22)).toBeCloseTo(1);
    expect(pulse(0.4)).toBeGreaterThan(pulse(0.8));
    expect(pulse(1.22)).toBeCloseTo(1); // periodic
  });
  it("snail turns around only at the ends", async () => {
    const { turnAt } = await import("./Snail/useSnail");
    expect(turnAt(1, 1, 0, 1)).toBe(-1);
    expect(turnAt(0, -1, 0, 1)).toBe(1);
    expect(turnAt(0.5, 1, 0, 1)).toBe(1);
    expect(turnAt(1, -1, 0, 1)).toBe(-1);
  });
  it("sunflower heads face the sun", async () => {
    const { faceToward } = await import("./Sunflowers/useSunflowers");
    expect(faceToward(100, 100, 300, 100, 400, 300).yaw).toBeGreaterThan(0.5);
    expect(faceToward(300, 100, 100, 100, 400, 300).yaw).toBeLessThan(-0.5);
    expect(faceToward(100, 200, 100, 0, 400, 300).pitch).toBeLessThan(0); // sun above: face tips up
  });
  it("komorebi spots stretch as the sun gets lower", async () => {
    const { spotStretch } = await import("./Komorebi/useKomorebi");
    expect(spotStretch(1)).toBeCloseTo(1);
    expect(spotStretch(0.3)).toBeGreaterThan(spotStretch(0.7));
    expect(spotStretch(0)).toBeLessThanOrEqual(4);
  });
  it("anemones shut close in and reopen only once clear (hysteresis)", async () => {
    const { anemoneShut } = await import("./TidePool/useTidePool");
    expect(anemoneShut(10, 10, false)).toBe(true);
    expect(anemoneShut(18, 10, false)).toBe(false);
    expect(anemoneShut(18, 10, true)).toBe(true);
    expect(anemoneShut(25, 10, true)).toBe(false);
  });
});
