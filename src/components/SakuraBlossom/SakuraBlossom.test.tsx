import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SakuraBlossom } from "./SakuraBlossom";
import { stepPetal, type Petal } from "./useSakuraBlossom";

/** The per-frame physics exactly as it was before the runtime migration (v1.0.12). */
function legacyStep(p: Petal, t: number, effectiveWind: number, gravity: number) {
  const windOsc = Math.sin(t * 1.5 + p.phase) * effectiveWind * 0.5;
  p.vx += windOsc * 0.01;
  p.vy += gravity * 0.016;
  p.x += p.vx + effectiveWind * 0.02;
  p.y += p.vy;
  p.angle += p.angularVel + Math.sin(t * 2 + p.phase) * 0.002;
  p.scaleY = 0.6 + Math.abs(Math.sin(p.angle * 1.5)) * 0.4;
}

function petal(seed: number): Petal {
  return {
    x: 10 * seed, y: 5 * seed, vx: 0.1 * seed, vy: 0.3, angle: seed, angularVel: 0.01 * seed,
    size: 8, alpha: 1, settled: false, settleY: 0, phase: seed * 0.7, scaleY: 1, rest: null,
  };
}

describe("stepPetal", () => {
  it("REGRESSION: at k=1 matches the pre-migration per-frame math exactly", () => {
    for (let seed = 1; seed <= 5; seed++) {
      const a = petal(seed);
      const b = petal(seed);
      for (let i = 0; i < 200; i++) {
        const t = i * 0.016;
        const wind = 0.8 + Math.sin(i) * 2;
        stepPetal(a, { t, wind, gravity: 0.06 }, 1);
        legacyStep(b, t, wind, 0.06);
      }
      expect(a).toEqual(b);
    }
  });

  it("scales motion by k (120Hz runs as fast as 60Hz)", () => {
    const a = petal(2);
    const b = petal(2);
    const env = { t: 0, wind: 0, gravity: 0 };
    stepPetal(a, env, 1);
    stepPetal(a, env, 1);
    stepPetal(b, env, 2);
    expect(b.x).toBeCloseTo(a.x);
    expect(b.y).toBeCloseTo(a.y);
  });
});

describe("SakuraBlossom", () => {
  it("renders an inline canvas by default", () => {
    const { container } = render(<SakuraBlossom preset="sakura" />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("overlay portals a fixed, click-through canvas to document.body", () => {
    const { container, unmount } = render(<SakuraBlossom overlay collide />);
    expect(container.querySelector("canvas")).toBeNull();
    const canvas = document.body.querySelector(":scope > canvas") as HTMLCanvasElement;
    expect(canvas).not.toBeNull();
    expect(canvas.style.position).toBe("fixed");
    expect(canvas.style.pointerEvents).toBe("none");
    unmount();
    expect(document.body.querySelector(":scope > canvas")).toBeNull();
  });
});
