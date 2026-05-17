const rgbCache = new Map<string, [number, number, number] | null>();

function parseHex(hex: string): [number, number, number] | null {
  if (rgbCache.has(hex)) return rgbCache.get(hex)!;
  let h = hex.trim();
  if (h.startsWith("#")) h = h.slice(1);
  let r: number, g: number, b: number;
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
  } else if (h.length === 6) {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  } else {
    rgbCache.set(hex, null);
    return null;
  }
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    rgbCache.set(hex, null);
    return null;
  }
  const result: [number, number, number] = [r, g, b];
  rgbCache.set(hex, result);
  return result;
}

/** Convert hex color to rgba() string. Falls back to white if parsing fails. */
export function hexToRgba(hex: string, alpha = 1): string {
  const rgb = parseHex(hex);
  if (!rgb) return `rgba(255,255,255,${alpha})`;
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

/** Convert hex color to "r,g,b" string for embedding in rgba(). Falls back to "255,255,255". */
export function hexToRgbString(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "255,255,255";
  return `${rgb[0]},${rgb[1]},${rgb[2]}`;
}

/** Interpolate between two [r,g,b] tuples. */
function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Sample a multi-stop color gradient at position t (0–1). */
export function sampleGradient(colors: string[], t: number): [number, number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  if (colors.length === 0) return [255, 255, 255];
  if (colors.length === 1) return parseHex(colors[0]) ?? [255, 255, 255];
  const scaled = clamped * (colors.length - 1);
  const i = Math.min(Math.floor(scaled), colors.length - 2);
  const lt = scaled - i;
  const c1 = parseHex(colors[i]) ?? [255, 255, 255];
  const c2 = parseHex(colors[i + 1]) ?? [255, 255, 255];
  return lerpRgb(c1, c2, lt);
}
