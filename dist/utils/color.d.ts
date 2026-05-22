/** Convert hex color to rgba() string. Falls back to white if parsing fails. */
export declare function hexToRgba(hex: string, alpha?: number): string;
/** Convert hex color to "r,g,b" string for embedding in rgba(). Falls back to "255,255,255". */
export declare function hexToRgbString(hex: string): string;
/** Sample a multi-stop color gradient at position t (0–1). */
export declare function sampleGradient(colors: string[], t: number): [number, number, number];
