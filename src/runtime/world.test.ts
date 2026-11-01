import { describe, it, expect, vi, afterEach } from "vitest";
import { subscribe, solidsFor } from "./world";

type Rect = { x: number; y: number; w: number; h: number };

function stubRect(el: Element, r: Rect) {
  const fn = vi.fn(() => ({ left: r.x, top: r.y, width: r.w, height: r.h }) as DOMRect);
  el.getBoundingClientRect = fn;
  return fn;
}

function solid(r: Rect, attr = "") {
  const el = document.createElement("div");
  el.setAttribute("data-otc-solid", attr);
  const rect = stubRect(el, r);
  document.body.appendChild(el);
  return { el, rect };
}

function setScroll(x: number, y: number) {
  Object.defineProperty(window, "scrollX", { value: x, configurable: true });
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
}

const tick = () => new Promise((r) => setTimeout(r, 0));
const overlayCanvas = document.createElement("canvas");

let unsubs: Array<() => void> = [];
const sub = () => {
  const u = subscribe();
  unsubs.push(u);
  return u;
};

afterEach(() => {
  unsubs.forEach((u) => u());
  unsubs = [];
  document.body.innerHTML = "";
  setScroll(0, 0);
  vi.restoreAllMocks();
});

describe("world", () => {
  it("finds marked elements and skips zero-size ones", () => {
    solid({ x: 10, y: 20, w: 100, h: 30 });
    solid({ x: 0, y: 0, w: 0, h: 0 });
    sub();
    const s = solidsFor(overlayCanvas, true);
    expect(s).toHaveLength(1);
    expect(s[0]).toMatchObject({ x: 10, y: 20, w: 100, h: 30 });
  });

  it("scroll is arithmetic: no rect reads, positions shift", () => {
    setScroll(0, 0);
    const { rect } = solid({ x: 10, y: 500, w: 100, h: 30 });
    sub();
    solidsFor(overlayCanvas, true);
    rect.mockClear();

    setScroll(0, 120);
    const s = solidsFor(overlayCanvas, true);
    expect(rect).not.toHaveBeenCalled();
    expect(s[0].y).toBe(380);
  });

  it("re-measures when an inner scroll container scrolls", () => {
    const scroller = document.createElement("div");
    document.body.appendChild(scroller);
    const el = document.createElement("div");
    el.setAttribute("data-otc-solid", "");
    const rect = stubRect(el, { x: 0, y: 300, w: 50, h: 10 });
    scroller.appendChild(el);
    sub();
    expect(solidsFor(overlayCanvas, true)[0].y).toBe(300);

    stubRect(el, { x: 0, y: 180, w: 50, h: 10 }); // scroller moved its content up
    scroller.dispatchEvent(new Event("scroll"));   // element scroll: doesn't bubble, capture sees it
    expect(solidsFor(overlayCanvas, true)[0].y).toBe(180);
    expect(rect).toHaveBeenCalled();
  });

  it("re-reads 'live' solids every call", () => {
    const { rect } = solid({ x: 0, y: 0, w: 50, h: 10 }, "live");
    sub();
    solidsFor(overlayCanvas, true);
    solidsFor(overlayCanvas, true);
    expect(rect.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("returns in-flow canvas-local coords", () => {
    solid({ x: 150, y: 260, w: 40, h: 10 });
    const canvas = document.createElement("canvas");
    stubRect(canvas, { x: 100, y: 200, w: 400, h: 300 });
    sub();
    expect(solidsFor(canvas, false)[0]).toMatchObject({ x: 50, y: 60 });
  });

  it("drops removed solids (route change) and keeps ids stable", async () => {
    const a = solid({ x: 0, y: 0, w: 10, h: 10 });
    solid({ x: 20, y: 0, w: 10, h: 10 });
    sub();
    const before = solidsFor(overlayCanvas, true);
    expect(before).toHaveLength(2);

    a.el.remove();
    await tick();
    const after = solidsFor(overlayCanvas, true);
    expect(after).toHaveLength(1);
    expect(after[0].id).toBe(before[1].id);
  });

  it("picks up solids added after subscribing", async () => {
    sub();
    expect(solidsFor(overlayCanvas, true)).toHaveLength(0);
    solid({ x: 0, y: 0, w: 10, h: 10 });
    await tick();
    expect(solidsFor(overlayCanvas, true)).toHaveLength(1);
  });

  it("refcounts observers: stops only when the last subscriber leaves", () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, "disconnect");
    const a = sub();
    const b = sub();
    a();
    a(); // idempotent
    expect(disconnect).not.toHaveBeenCalled();
    b();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
