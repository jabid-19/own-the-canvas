import { vi, beforeEach, afterEach } from "vitest";
import { act } from "@testing-library/react";

/**
 * Runs real animation frames in jsdom: queued rAF you flush by hand, a
 * permissive fake 2D context that records draw calls and arc centers, Path2D,
 * and a fixed 800×500 layout (elements marked data-otc-solid get a centered
 * 300×80 card). Call once at describe level.
 */
export function useFrameHarness() {
  let rafQueue = new Map<number, FrameRequestCallback>();
  let rafId = 0;
  let now = 1000;
  const stats = { drawCalls: 0, arcs: [] as { x: number; y: number }[] };

  function fakeContext(): CanvasRenderingContext2D {
    const gradient = { addColorStop: () => {} };
    const state: Record<string | symbol, unknown> = {};
    return new Proxy(state, {
      get(target, prop) {
        if (prop in target) return target[prop];
        if (prop === "createLinearGradient" || prop === "createRadialGradient") return () => gradient;
        if (prop === "measureText") return () => ({ width: 10 });
        if (prop === "createImageData" || prop === "getImageData") {
          return (w: number, h: number) => ({ data: new Uint8ClampedArray(Math.max(1, (w | 0) * (h | 0)) * 4), width: w, height: h });
        }
        if (prop === "arc") return (x: number, y: number) => { stats.arcs.push({ x, y }); };
        return () => {
          if (prop === "fill" || prop === "stroke" || prop === "drawImage" || prop === "fillRect") stats.drawCalls++;
        };
      },
      set(target, prop, value) {
        target[prop] = value;
        return true;
      },
    }) as unknown as CanvasRenderingContext2D;
  }

  class FakePath2D {
    moveTo() {}
    lineTo() {}
    quadraticCurveTo() {}
    bezierCurveTo() {}
    arc() {}
    ellipse() {}
    rect() {}
    closePath() {}
  }

  beforeEach(() => {
    rafQueue = new Map();
    stats.drawCalls = 0;
    stats.arcs = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafQueue.set(++rafId, cb);
      return rafId;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => rafQueue.delete(id));
    vi.stubGlobal("Path2D", FakePath2D);
    vi.stubGlobal("OffscreenCanvas", class {
      constructor(public width: number, public height: number) {}
      getContext() { return fakeContext(); }
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => fakeContext() as never);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      if (this.hasAttribute("data-otc-solid")) return { left: 250, top: 200, width: 300, height: 80, right: 550, bottom: 280, x: 250, y: 200 } as DOMRect;
      return { left: 0, top: 0, width: 800, height: 500, right: 800, bottom: 500, x: 0, y: 0 } as DOMRect;
    });
    Object.defineProperty(window, "devicePixelRatio", { value: 2, configurable: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  return {
    stats,
    pendingFrames: () => rafQueue.size,
    /** Runs `frames` frames, `stepMs` apart. `stats.arcs` holds only the last frame's arcs. */
    flush(frames: number, stepMs = 16) {
      for (let i = 0; i < frames; i++) {
        now += stepMs;
        stats.arcs = [];
        const q = Array.from(rafQueue.values());
        rafQueue = new Map();
        act(() => q.forEach((cb) => cb(now)));
      }
    },
    fire(type: string, x: number, y: number, target: EventTarget = window) {
      act(() => { target.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y })); });
    },
  };
}
