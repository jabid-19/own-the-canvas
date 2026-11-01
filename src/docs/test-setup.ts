import "@testing-library/jest-dom";
import { vi } from "vitest";

// ResizeObserver polyfill for jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// matchMedia stub for jsdom (Lenis + reduced-motion checks). Never matches.
// Tests that need a match override window.matchMedia locally.
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;

// Canvas getContext mock
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  setTransform: vi.fn(),
  rotate: vi.fn(),
  quadraticCurveTo: vi.fn(),
  translate: vi.fn(),
  drawImage: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  measureText: vi.fn(() => ({ width: 10 })),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  shadowBlur: 0,
  shadowColor: "",
  fillStyle: "",
  strokeStyle: "",
  globalAlpha: 1,
  lineWidth: 1,
  lineCap: "butt",
  font: "",
  textAlign: "left",
  textBaseline: "alphabetic",
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// rAF mock — do NOT call the callback to avoid infinite draw loops
global.requestAnimationFrame = vi.fn(() => 0) as unknown as typeof requestAnimationFrame;
global.cancelAnimationFrame = vi.fn();

// Clipboard spy — assign directly so it's always a vi.fn
const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: clipboardWriteText },
  configurable: true,
  writable: true,
});
