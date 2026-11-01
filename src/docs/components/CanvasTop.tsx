import React, { useId } from "react";
import { scenePalette, sceneIndex } from "./PaperScene";

/**
 * The top of every page is a stretched artist's canvas: bare primed linen, a loose pencil
 * sketch, and a few loaded-brush strokes in that page's palette. Not a landscape, a work in
 * progress.
 */
export function CanvasTop({ seed = "" }: { seed?: string }) {
  const uid = useId().replace(/:/g, "");
  const [a, b, c, d] = scenePalette(seed);
  const i = sceneIndex(seed);
  const sunX = 780 + (i % 3) * 80;

  const Y = 0.62; // the strokes are squashed vertically so the strip can be short
  return (
    <svg viewBox="100 0 1000 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        {/* thick paint: bristle streaks lit from the upper left, wobbly edges, a little relief shadow */}
        <filter id={`paint-${uid}`} x="-3%" y="-30%" width="106%" height="170%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.09" numOctaves="3" seed="11" result="streaks" />
          <feDisplacementMap in="SourceGraphic" in2="streaks" scale="5" xChannelSelector="R" yChannelSelector="G" result="wobbly" />
          <feDiffuseLighting in="streaks" lightingColor="#ffffff" surfaceScale="1.6" diffuseConstant="1" result="light">
            <feDistantLight azimuth="235" elevation="55" />
          </feDiffuseLighting>
          <feComposite in="wobbly" in2="light" operator="arithmetic" k1="1.2" k2="0" k3="0" k4="0" result="painted" />
          <feDropShadow in="painted" dx="1.5" dy="2.5" stdDeviation="1.4" floodColor="#2b1a08" floodOpacity="0.42" />
        </filter>
      </defs>

      {/* pencil underdrawing */}
      <g fill="none" stroke="#5c5650" strokeOpacity="0.38" strokeWidth="1.5" strokeLinecap="round">
        <g transform={`scale(1 ${Y})`}>
          <path d="M24 118 C300 112 700 124 1176 116" strokeDasharray="2 7" />
          <path d="M120 92 L190 40 L262 100 L330 54 L408 112" />
        </g>
        <circle cx={sunX} cy="46" r="36" />
        <circle cx={sunX} cy="46" r="34" strokeOpacity="0.2" />
        <path d="M124 14 h16 M124 14 v14 M1076 14 h-16 M1076 14 v14 M124 126 h16 M124 126 v-14 M1076 126 h-16 M1076 126 v-14" strokeOpacity="0.55" />
        <path d="M600 24 l7 7 m0 -7 l-7 7 M640 36 l5 5 m0 -5 l-5 5" />
      </g>

      {/* loaded-brush strokes, back to front. Filter on the outer group so the bristles stay unsquashed. */}
      <g filter={`url(#paint-${uid})`}>
        <g transform={`scale(1 ${Y})`}>
          <path d="M40 74 C300 44 600 82 900 56 C1020 46 1110 54 1160 48 L1156 96 C1040 104 940 92 880 100 C600 124 300 94 44 116Z" fill={b} opacity="0.62" />
          <path d="M70 154 C230 104 330 174 520 132 C700 94 860 164 1130 116 L1134 164 C870 210 710 144 520 186 C330 224 220 154 74 200Z" fill={a} />
          <path d="M130 196 C370 166 560 214 820 182 C960 166 1060 182 1112 174 L1108 214 C1052 224 960 212 820 222 C560 248 370 208 134 232Z" fill={c} />
          <path d="M62 206 C150 192 260 206 360 198 L356 222 C256 230 150 224 66 226Z" fill={d} />
        </g>
        {/* the sun: one fat dab with a drip, drawn at true proportions */}
        <g transform={`translate(${sunX * 0.35} 2) scale(0.65)`} fill="#f2b134">
          <path d={`M${sunX - 34} 66 C${sunX - 30} 40 ${sunX + 8} 30 ${sunX + 32} 50 C${sunX + 46} 70 ${sunX + 30} 98 ${sunX + 6} 100 C${sunX - 22} 104 ${sunX - 38} 88 ${sunX - 34} 66Z`} />
          <path d={`M${sunX - 6} 98 C${sunX - 8} 112 ${sunX - 8} 122 ${sunX - 2} 128 C${sunX + 4} 122 ${sunX + 4} 110 ${sunX + 2} 98Z`} />
        </g>
      </g>

      {/* spatter */}
      <g fill={d}>
        <circle cx="1092" cy="112" r="4" /><circle cx="1118" cy="126" r="2.5" /><circle cx="1068" cy="130" r="2" />
      </g>
      <g fill={a}>
        <circle cx="236" cy="38" r="3.5" /><circle cx="262" cy="50" r="2" />
      </g>

      {/* signature */}
      <text x="1064" y="132" textAnchor="end" fontFamily="var(--font-display)" fontStyle="italic" fontSize="17" fill="#2b2118" opacity="0.55">
        own the canvas
      </text>
    </svg>
  );
}
