import React, { useId } from "react";

/** Back-to-front paper colours: far mountains, mid hills, near hills, front hills. */
const PALETTES: string[][] = [
  ["#3f7f86", "#8fbf9f", "#f2b134", "#e8795a"],
  ["#27406b", "#4f86a3", "#8fbf9f", "#f2b5a6"],
  ["#c4442a", "#e8795a", "#f2b134", "#8fbf9f"],
  ["#3b5b8c", "#7fb0c2", "#8fbf9f", "#f2b134"],
  ["#8a6a4a", "#d3a45f", "#f2b134", "#8fbf9f"],
  ["#2f6f73", "#e8795a", "#f2b5a6", "#f2b134"],
];
const TREE = "#22403a";

export function scenePalette(seed: string): string[] {
  return PALETTES[sceneIndex(seed)];
}

export function sceneIndex(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % PALETTES.length;
}

/** A pine: three stacked paper triangles. (x, y) is the base centre. */
function pine(x: number, y: number, s: number) {
  const w = 17 * s;
  const tier = (top: number, half: number, bottom: number) =>
    `M${x} ${y - top} L${x + half} ${y - bottom} L${x - half} ${y - bottom}Z`;
  return (
    tier(58 * s, w * 0.55, 40 * s) + tier(46 * s, w * 0.8, 22 * s) + tier(30 * s, w, 0) +
    `M${x - 2 * s} ${y} h${4 * s} v${8 * s} h${-4 * s}Z`
  );
}

const MOUNTAINS =
  "M0 178 L90 128 C130 106 160 108 200 138 L300 184 L420 112 C450 92 480 95 510 115 L640 192 L760 138 C790 120 820 120 850 138 L980 198 L1090 148 C1130 126 1160 128 1200 148 L1200 300 L0 300Z";
const HILLS_MID =
  "M0 214 C120 180 260 224 420 204 C580 184 700 234 880 209 C1020 191 1120 214 1200 201 L1200 300 L0 300Z";
const HILLS_NEAR =
  "M0 246 C160 223 300 258 480 240 C660 222 820 260 1010 236 C1100 225 1160 234 1200 230 L1200 300 L0 300Z";
const HILLS_FRONT =
  "M0 274 C200 256 380 288 600 272 C820 256 1000 290 1200 268 L1200 300 L0 300Z";

/** Pine positions sit behind the near hills; only their tips poke above the ridge. */
const PINES: [number, number, number][] = [
  [96, 262, 1.1], [128, 258, 0.85], [168, 266, 1.0], [352, 270, 0.9], [388, 272, 1.15],
  [690, 270, 1.0], [724, 266, 0.8], [940, 268, 1.1], [972, 262, 0.9], [1120, 258, 1.0],
];

/**
 * Layered paper-cut landscape. Every hill is its own sheet; a soft upward shadow on each one
 * falls on the sheet behind it. `cream` adds a flat cream sheet at the bottom.
 */
export function PaperScene({ seed = "", className, cream = false }: { seed?: string; className?: string; cream?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const i = sceneIndex(seed);
  const [far, mid, near, front] = PALETTES[i];
  const sunX = 820 + (i % 3) * 110;

  return (
    <svg
      className={className}
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Oil-paint look: horizontal brush streaks lit from the upper left give the paint a
            ridged surface, a small displacement wobbles the edges like a hand-painted line,
            and the upward shadow still separates each layer from the one behind. */}
        <filter id={`ao-${uid}`} x="-5%" y="-40%" width="110%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.07" numOctaves="3" seed="7" result="streaks" />
          <feDisplacementMap in="SourceGraphic" in2="streaks" scale="4" xChannelSelector="R" yChannelSelector="G" result="wobbly" />
          <feDiffuseLighting in="streaks" lightingColor="#ffffff" surfaceScale="0.9" diffuseConstant="1" result="light">
            <feDistantLight azimuth="235" elevation="58" />
          </feDiffuseLighting>
          <feComposite in="wobbly" in2="light" operator="arithmetic" k1="1.17" k2="0" k3="0" k4="0" result="painted" />
          <feDropShadow in="painted" dx="0" dy="-3" stdDeviation="3.2" floodColor="#2b1a08" floodOpacity="0.38" />
        </filter>
        <filter id={`fl-${uid}`} x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#2b1a08" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* sun: three stacked paper discs */}
      <circle cx={sunX} cy="112" r="62" fill="#f8d9b5" opacity="0.75" />
      <circle cx={sunX} cy="112" r="46" fill="#f6c9a0" />
      <circle cx={sunX} cy="112" r="30" fill="#fff4d9" />

      {/* clouds */}
      <g fill="#fffaf0" filter={`url(#fl-${uid})`}>
        <g>
          <circle cx="210" cy="108" r="17" />
          <circle cx="236" cy="98" r="23" />
          <circle cx="266" cy="108" r="15" />
          <rect x="196" y="108" width="84" height="16" rx="8" />
        </g>
        <g transform="translate(470 34) scale(.7)">
          <circle cx="210" cy="108" r="17" />
          <circle cx="236" cy="98" r="23" />
          <circle cx="266" cy="108" r="15" />
          <rect x="196" y="108" width="84" height="16" rx="8" />
        </g>
      </g>

      {/* birds, cut from dark paper */}
      <g fill="none" stroke={TREE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
        <path d="M600 120 q11 -13 22 0 q11 -13 22 0" />
        <path d="M652 96 q8 -9 16 0 q8 -9 16 0" />
      </g>

      <path d={MOUNTAINS} fill={far} filter={`url(#ao-${uid})`} />
      <path d={HILLS_MID} fill={mid} filter={`url(#ao-${uid})`} />
      <path d={PINES.map(([x, y, s]) => pine(x, y, s)).join("")} fill={TREE} />
      <path d={HILLS_NEAR} fill={near} filter={`url(#ao-${uid})`} />
      <path d={HILLS_FRONT} fill={front} filter={`url(#ao-${uid})`} />
      {cream && <path d="M0 292 C240 280 420 298 640 288 C860 278 1020 300 1200 286 L1200 300 L0 300Z" fill="var(--bg)" filter={`url(#ao-${uid})`} />}
    </svg>
  );
}
