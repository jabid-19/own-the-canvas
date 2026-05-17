import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useGlitchOverlay } from "./useGlitchOverlay";

type GlitchPreset = "default" | "crt" | "cyberpunk" | "subtle" | "corrupt";

interface GlitchPresetValues {
  intensity?: number;
  speed?: number;
  rgbShift?: number;
  scanlines?: boolean;
  scanlineOpacity?: number;
  scanlineSpacing?: number;
  blockGlitch?: boolean;
  blockCount?: number;
  noiseOpacity?: number;
  flickerRate?: number;
  color?: string;
  backgroundColor?: string;
}

const PRESETS: Record<GlitchPreset, GlitchPresetValues> = {
  default: {
    intensity: 0.6,
    speed: 1,
    rgbShift: 8,
    scanlines: true,
    scanlineOpacity: 0.08,
    blockGlitch: true,
    blockCount: 4,
    noiseOpacity: 0.02,
    flickerRate: 0.02,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  crt: {
    intensity: 0.4,
    speed: 0.5,
    rgbShift: 4,
    scanlines: true,
    scanlineOpacity: 0.15,
    scanlineSpacing: 3,
    blockGlitch: false,
    noiseOpacity: 0.04,
    flickerRate: 0.03,
    color: "#00ff41",
    backgroundColor: "transparent",
  },
  cyberpunk: {
    intensity: 0.8,
    speed: 1.5,
    rgbShift: 15,
    scanlines: true,
    scanlineOpacity: 0.06,
    blockGlitch: true,
    blockCount: 6,
    noiseOpacity: 0.02,
    color: "#00ffff",
    backgroundColor: "#050010",
  },
  subtle: {
    intensity: 0.2,
    speed: 0.4,
    rgbShift: 3,
    scanlines: true,
    scanlineOpacity: 0.05,
    blockGlitch: false,
    noiseOpacity: 0.01,
    flickerRate: 0.005,
    backgroundColor: "transparent",
  },
  corrupt: {
    intensity: 1,
    speed: 2,
    rgbShift: 25,
    scanlines: false,
    blockGlitch: true,
    blockCount: 10,
    noiseOpacity: 0.06,
    flickerRate: 0.05,
    color: "#ff0000",
    backgroundColor: "#000000",
  },
};

export interface GlitchOverlayProps extends BaseCanvasProps {
  /** Glitch probability 0–1 (default: 0.6) */
  intensity?: number;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** RGB color shift amount in px (default: 8) */
  rgbShift?: number;
  /** Show CRT scanlines (default: true) */
  scanlines?: boolean;
  /** Scanline opacity (default: 0.08) */
  scanlineOpacity?: number;
  /** Px between scanlines (default: 2) */
  scanlineSpacing?: number;
  /** Enable block-slice glitch (default: true) */
  blockGlitch?: boolean;
  /** Number of glitch blocks (default: 4) */
  blockCount?: number;
  /** Film noise opacity (default: 0.02) */
  noiseOpacity?: number;
  /** Screen flicker rate 0–1 (default: 0.02) */
  flickerRate?: number;
  /** Glitch bar color (default: "#7C3AED") */
  color?: string;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Canvas background (default: "transparent") */
  backgroundColor?: string;
  /** Named preset */
  preset?: GlitchPreset | string;
}

export const GlitchOverlay = forwardRef<HTMLCanvasElement, GlitchOverlayProps>(
  (props, ref) => {
    const {
      preset, intensity, speed, rgbShift, scanlines, scanlineOpacity,
      scanlineSpacing, blockGlitch, blockCount, noiseOpacity, flickerRate,
      color, animated, backgroundColor,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as GlitchPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useGlitchOverlay(internalRef, {
      intensity: intensity ?? p.intensity ?? 0.6,
      speed: speed ?? p.speed ?? 1,
      rgbShift: rgbShift ?? p.rgbShift ?? 8,
      scanlines: scanlines ?? p.scanlines ?? true,
      scanlineOpacity: scanlineOpacity ?? p.scanlineOpacity ?? 0.08,
      scanlineSpacing: scanlineSpacing ?? p.scanlineSpacing ?? 2,
      blockGlitch: blockGlitch ?? p.blockGlitch ?? true,
      blockCount: blockCount ?? p.blockCount ?? 4,
      noiseOpacity: noiseOpacity ?? p.noiseOpacity ?? 0.02,
      flickerRate: flickerRate ?? p.flickerRate ?? 0.02,
      color: color ?? p.color ?? "#ffffff",
      animated: animated ?? true,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "transparent",
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", position: "relative", ...style }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block", position: "absolute", inset: 0, pointerEvents: "none" }}
        />
      </div>
    );
  }
);

GlitchOverlay.displayName = "GlitchOverlay";
