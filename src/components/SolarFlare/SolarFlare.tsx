import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSolarFlare } from "./useSolarFlare";

type SolarFlarePreset = "default" | "inferno" | "plasma" | "neon" | "white-dwarf";

interface SolarFlarePresetValues {
  sunColor?: string;
  coronaColor?: string;
  flareColor?: string;
  backgroundColor?: string;
  sunRadius?: number;
  glowBlur?: number;
}

const PRESETS: Record<SolarFlarePreset, SolarFlarePresetValues> = {
  default: {},
  inferno: {
    sunColor: "#ff6600",
    coronaColor: "#ff3300",
    flareColor: "#ffaa00",
    backgroundColor: "#0a0200",
    glowBlur: 60,
  },
  plasma: {
    sunColor: "#cc44ff",
    coronaColor: "#8800cc",
    flareColor: "#ff88ff",
    backgroundColor: "#050008",
    glowBlur: 50,
  },
  neon: {
    sunColor: "#00ffcc",
    coronaColor: "#00aaff",
    flareColor: "#ffffff",
    backgroundColor: "#000810",
    glowBlur: 45,
  },
  "white-dwarf": {
    sunColor: "#eef4ff",
    coronaColor: "#aac4ff",
    flareColor: "#ffffff",
    backgroundColor: "#000008",
    sunRadius: 0.15,
    glowBlur: 80,
  },
};

export interface SolarFlareProps extends BaseCanvasProps {
  /** Photosphere color (default: "#ffffff") */
  sunColor?: string;
  /** Corona glow color (default: "#6b7280") */
  coronaColor?: string;
  /** Eruption/flare color (default: "#ffffff") */
  flareColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Sun radius as fraction of min(w,h)/2 (default: 0.35) */
  sunRadius?: number;
  /** Number of convection cells on surface (default: 20) */
  convectionCells?: number;
  /** Simultaneous active flares (default: 3) */
  flareCount?: number;
  /** Auto-spawn flares (default: true) */
  autoFlare?: boolean;
  /** Interval between auto-flares in ms (default: 3000) */
  autoFlareInterval?: number;
  /** Click to trigger flare at cursor angle (default: true) */
  interactive?: boolean;
  /** Iridescent glow (default: true) */
  glowEffect?: boolean;
  /** Glow blur radius in px (default: 40) */
  glowBlur?: number;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Named preset */
  preset?: SolarFlarePreset | string;
}

export const SolarFlare = forwardRef<HTMLCanvasElement, SolarFlareProps>(
  (props, ref) => {
    const {
      preset, sunColor, coronaColor, flareColor, backgroundColor,
      sunRadius, convectionCells, flareCount, autoFlare, autoFlareInterval,
      interactive, glowEffect, glowBlur, speed,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as SolarFlarePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useSolarFlare(internalRef, {
      sunColor:           sunColor           ?? p.sunColor           ?? "#ffffff",
      coronaColor:        coronaColor        ?? p.coronaColor        ?? "#6b7280",
      flareColor:         flareColor         ?? p.flareColor         ?? "#ffffff",
      backgroundColor:    backgroundColor    ?? p.backgroundColor    ?? "#111111",
      sunRadius:          sunRadius          ?? p.sunRadius          ?? 0.35,
      convectionCells:    convectionCells    ?? 20,
      flareCount:         flareCount         ?? 3,
      autoFlare:          autoFlare          ?? true,
      autoFlareInterval:  autoFlareInterval  ?? 3000,
      interactive:        interactive        ?? true,
      glowEffect:         glowEffect         ?? true,
      glowBlur:           glowBlur           ?? p.glowBlur           ?? 40,
      speed:              speed              ?? 1,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
          cursor:   "crosshair",
          ...style,
        }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block" }}
        />
      </div>
    );
  }
);

SolarFlare.displayName = "SolarFlare";
