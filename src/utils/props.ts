// Bundlers replace process.env.NODE_ENV; without one, `process` is undefined and we stay in dev.
declare const process: { env: { NODE_ENV?: string } };

function isDev(): boolean {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return true;
  }
}

const warned = new Set<string>();

export function warnProp(component: string, prop: string, value: unknown, hint: string): void {
  if (!isDev()) return;
  const key = `${component}.${prop}=${String(value)}`;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[own-the-canvas] ${component}: invalid ${prop} ${typeof value === "string" ? JSON.stringify(value) : String(value)}. ${hint}`);
}

function isColor(v: string): boolean {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") return true; // SSR: can't tell
  return CSS.supports("color", v);
}

/**
 * Looks up the component's preset (missing → "default") and, in development,
 * warns once about props that would silently render wrong: an unknown preset,
 * an unparseable color, or a non-finite number.
 */
export function resolvePreset<T>(component: string, presets: Record<string, T>, props: object & { preset?: string }): T {
  const p = presets[props.preset ?? "default"];
  if (!isDev()) return p || ({} as T);

  if (!p && props.preset !== undefined) {
    warnProp(component, "preset", props.preset, `Expected one of: ${Object.keys(presets).join(", ")}. Using built-in defaults.`);
  }
  for (const [name, v] of Object.entries(props as Record<string, unknown>)) {
    if (typeof v === "number" && !Number.isFinite(v)) {
      warnProp(component, name, v, "Expected a finite number.");
    } else if (/colou?r$/i.test(name) && typeof v === "string" && !isColor(v)) {
      warnProp(component, name, v, "Expected a CSS color.");
    } else if (/colou?rs$/i.test(name) && Array.isArray(v)) {
      for (const c of v) if (typeof c === "string" && !isColor(c)) warnProp(component, name, c, "Expected CSS colors.");
    }
  }
  return p || ({} as T);
}
