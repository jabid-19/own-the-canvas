import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { useCanvasSetup, type CanvasSetupOptions } from "./useCanvasSetup";

// ── Controllable browser mocks ───────────────────────────────────────────────
// test-setup.ts stubs rAF to never fire; here we queue frames and flush them.

let rafQueue = new Map<number, FrameRequestCallback>();
let rafId = 0;
let now = 0;
function flush(frames: number, stepMs = 16) {
  for (let i = 0; i < frames; i++) {
    now += stepMs;
    const q = Array.from(rafQueue.values());
    rafQueue = new Map();
    act(() => q.forEach((cb) => cb(now)));
  }
}

class MockIO {
  static last: MockIO | null = null;
  disconnect = vi.fn();
  constructor(private cb: IntersectionObserverCallback) {
    MockIO.last = this;
  }
  observe() {}
  unobserve() {}
  trigger(isIntersecting: boolean) {
    act(() => this.cb([{ isIntersecting } as IntersectionObserverEntry], this as never));
  }
}

let mqMatches = false;
let mqListener: (() => void) | null = null;
function setReducedMotion(v: boolean) {
  mqMatches = v;
  act(() => mqListener?.());
}

const ctx = HTMLCanvasElement.prototype.getContext("2d") as unknown as {
  clearRect: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  rafQueue = new Map();
  now = 1000;
  mqMatches = false;
  mqListener = null;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    rafQueue.set(++rafId, cb);
    return rafId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => rafQueue.delete(id));
  vi.stubGlobal("IntersectionObserver", MockIO);
  vi.stubGlobal("matchMedia", () => ({
    get matches() { return mqMatches; },
    addEventListener: (_: string, l: () => void) => { mqListener = l; },
    removeEventListener: () => { mqListener = null; },
  }));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    left: 0, top: 0, width: 300, height: 150,
  } as DOMRect);
  Object.defineProperty(window, "devicePixelRatio", { value: 1, configurable: true });
  Object.defineProperty(document, "hidden", { value: false, configurable: true });
  ctx.clearRect.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

function setup(opts: CanvasSetupOptions = {}) {
  const onFrame = vi.fn();
  const onResize = vi.fn();
  function Harness() {
    const { canvasRef } = useCanvasSetup({ onFrame, onResize, ...opts });
    return <div><canvas ref={canvasRef} /></div>;
  }
  const r = render(<Harness />);
  const canvas = r.container.querySelector("canvas")!;
  return { onFrame, onResize, canvas, ...r };
}

const dts = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls.map((c) => c[3]);

describe("useCanvasSetup", () => {
  it("sizes from the parent, calls onResize, then runs frames", () => {
    const { onFrame, onResize } = setup();
    expect(onResize).toHaveBeenCalledWith(300, 150);
    flush(3, 20);
    expect(onFrame).toHaveBeenCalledTimes(3);
    expect(dts(onFrame)).toEqual([16, 20, 20]);
    expect(onFrame.mock.calls[0][4]).toMatchObject({ quality: 1, overlay: false, solids: [] });
  });

  it("clamps dt so a long stall doesn't teleport particles", () => {
    const { onFrame } = setup();
    flush(1);
    flush(1, 5000);
    expect(dts(onFrame)[1]).toBe(64);
  });

  it("caps devicePixelRatio at maxDpr", () => {
    Object.defineProperty(window, "devicePixelRatio", { value: 3, configurable: true });
    const { canvas } = setup({ maxDpr: 2 });
    expect(canvas.width).toBe(600);
    expect(canvas.style.width).toBe("300px");
  });

  it("pauses offscreen and resumes with a fresh clock", () => {
    const { onFrame } = setup();
    flush(2);
    MockIO.last!.trigger(false);
    flush(5);
    expect(onFrame).toHaveBeenCalledTimes(2);

    MockIO.last!.trigger(true);
    flush(1, 3000);
    expect(onFrame).toHaveBeenCalledTimes(3);
    expect(dts(onFrame)[2]).toBe(16);
  });

  it("pauses while the tab is hidden", () => {
    const { onFrame } = setup();
    flush(1);
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    act(() => { document.dispatchEvent(new Event("visibilitychange")); });
    flush(5);
    expect(onFrame).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "hidden", { value: false, configurable: true });
    act(() => { document.dispatchEvent(new Event("visibilitychange")); });
    flush(1);
    expect(onFrame).toHaveBeenCalledTimes(2);
  });

  it("reduced motion: one static frame, no loop, follows live changes", () => {
    mqMatches = true;
    const { onFrame } = setup();
    flush(5);
    expect(onFrame).toHaveBeenCalledTimes(1);

    setReducedMotion(false);
    flush(2);
    expect(onFrame).toHaveBeenCalledTimes(3);

    setReducedMotion(true); // renders one static frame, then stops
    flush(5);
    expect(onFrame).toHaveBeenCalledTimes(4);
  });

  it("reducedMotion='ignore' keeps animating", () => {
    mqMatches = true;
    const { onFrame } = setup({ reducedMotion: "ignore" });
    flush(3);
    expect(onFrame).toHaveBeenCalledTimes(3);
  });

  it("noLoop never schedules frames", () => {
    const { onFrame } = setup({ noLoop: true });
    flush(3);
    expect(onFrame).not.toHaveBeenCalled();
  });

  it("overlay sizes from the window and clears before each frame", () => {
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 600, configurable: true });
    const { onFrame, onResize } = setup({ overlay: true });
    expect(onResize).toHaveBeenCalledWith(800, 600);
    flush(1);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(onFrame.mock.calls[0][4].overlay).toBe(true);
  });

  it("collide passes DOM solids to onFrame", () => {
    const el = document.createElement("div");
    el.setAttribute("data-otc-solid", "");
    document.body.appendChild(el);
    const { onFrame } = setup({ collide: true });
    flush(1);
    expect(onFrame.mock.calls[0][4].solids).toHaveLength(1);
  });

  it("unmount releases the loop, observers, and listeners", () => {
    const removeDoc = vi.spyOn(document, "removeEventListener");
    const { onFrame, unmount } = setup();
    flush(1);
    const io = MockIO.last!;
    unmount();
    flush(3);
    expect(onFrame).toHaveBeenCalledTimes(1);
    expect(io.disconnect).toHaveBeenCalled();
    expect(removeDoc).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(mqListener).toBeNull();
  });
});
