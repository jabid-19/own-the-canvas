/**
 * World: tracks page elements marked `data-otc-solid` so effects can collide
 * with real DOM. One module-level instance per page, shared by all canvases,
 * refcounted: observers run only while at least one canvas subscribes.
 *
 *   [data-otc-solid] ── MutationObserver (solids added/removed/attr) ──┐
 *   body ResizeObserver, solid ResizeObserver, window resize ──────────┼─> dirty
 *                                                                      v
 *   solidsFor(canvas) ── dirty? remeasure all (page coords) ── page - origin ─> Solid[]
 *
 * Rects are cached in PAGE space (rect + scroll). Scrolling is arithmetic only,
 * no getBoundingClientRect during scroll, so no layout thrash next to libraries
 * that write styles in rAF (Framer Motion, GSAP). Sticky/animated elements opt
 * in to per-frame reads with `data-otc-solid="live"`.
 *
 * Window scroll is arithmetic. An ELEMENT scrolling (overflow:auto app shells,
 * Lenis wrappers, modals) marks the cache dirty instead, caught by one
 * capture-phase listener.
 * ponytail: inner-scroller pages re-measure at most once per frame while the
 * scroller moves. Upgrade path if that shows up in profiles: cache rects
 * relative to each solid's scroll ancestor and add its scrollTop.
 */
import type { Solid } from "./physics";

const SELECTOR = "[data-otc-solid]";

interface Entry {
  id: number;
  el: Element;
  live: boolean;
  px: number;
  py: number;
  w: number;
  h: number;
}

const entries = new Map<Element, Entry>();
let canvasOrigins = new WeakMap<Element, { px: number; py: number }>();
let subscribers = 0;
let nextId = 1;
let dirty = true;
let mo: MutationObserver | null = null;
let ro: ResizeObserver | null = null;

function markDirty() {
  dirty = true;
}

function onAnyScroll(e: Event) {
  if (e.target !== document && e.target !== window) dirty = true;
}

function touchesSolid(n: Node): boolean {
  return n instanceof Element && (n.matches(SELECTOR) || n.querySelector(SELECTOR) !== null);
}

function onMutations(list: MutationRecord[]) {
  for (const m of list) {
    if (m.type === "attributes") return markDirty();
    for (const n of Array.from(m.addedNodes)) if (touchesSolid(n)) return markDirty();
    for (const n of Array.from(m.removedNodes)) if (touchesSolid(n)) return markDirty();
  }
}

function measure(e: Entry) {
  const r = e.el.getBoundingClientRect();
  e.px = r.left + window.scrollX;
  e.py = r.top + window.scrollY;
  e.w = r.width;
  e.h = r.height;
}

function refresh() {
  const found = new Set(Array.from(document.querySelectorAll(SELECTOR)));
  for (const el of Array.from(entries.keys())) {
    if (!found.has(el)) {
      entries.delete(el);
      ro?.unobserve(el);
    }
  }
  for (const el of found) {
    let e = entries.get(el);
    if (!e) {
      e = { id: nextId++, el, live: false, px: 0, py: 0, w: 0, h: 0 };
      entries.set(el, e);
      ro?.observe(el);
    }
    e.live = el.getAttribute("data-otc-solid") === "live";
    measure(e);
  }
  canvasOrigins = new WeakMap();
  dirty = false;
}

function start() {
  dirty = true;
  mo = new MutationObserver(onMutations);
  mo.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-otc-solid"],
  });
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(markDirty);
    ro.observe(document.body); // content above a solid grew => solid moved
  }
  window.addEventListener("resize", markDirty);
  document.addEventListener("scroll", onAnyScroll, { capture: true, passive: true });
}

function stop() {
  mo?.disconnect();
  ro?.disconnect();
  mo = null;
  ro = null;
  window.removeEventListener("resize", markDirty);
  document.removeEventListener("scroll", onAnyScroll, { capture: true });
  entries.clear();
  canvasOrigins = new WeakMap();
}

/** Start tracking solids. Returns an idempotent unsubscribe. */
export function subscribe(): () => void {
  if (subscribers++ === 0) start();
  let done = false;
  return () => {
    if (done) return;
    done = true;
    if (--subscribers === 0) stop();
  };
}

/**
 * All solids, in a canvas's local CSS pixels.
 * `overlay` canvases are fixed to the viewport, so their origin is the scroll position.
 * Not filtered to the canvas bounds on purpose: a solid scrolled out of view
 * keeps its resting particles, instead of releasing them onto the page.
 */
export function solidsFor(canvas: Element, overlay: boolean): Solid[] {
  if (dirty) refresh();

  let ox: number;
  let oy: number;
  if (overlay) {
    ox = window.scrollX;
    oy = window.scrollY;
  } else {
    let o = canvasOrigins.get(canvas);
    if (!o) {
      const r = canvas.getBoundingClientRect();
      o = { px: r.left + window.scrollX, py: r.top + window.scrollY };
      canvasOrigins.set(canvas, o);
    }
    ox = o.px;
    oy = o.py;
  }

  const out: Solid[] = [];
  for (const e of entries.values()) {
    if (e.live) measure(e);
    if (e.w === 0 || e.h === 0) continue;
    out.push({ id: e.id, x: e.px - ox, y: e.py - oy, w: e.w, h: e.h });
  }
  return out;
}
