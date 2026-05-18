import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useKaleidoscope } from "./useKaleidoscope";

type KaleidoscopePreset = "default" | "neon" | "crystal" | "void" | "fire" | "ice";

interface KaleidoscopePresetValues {
  segments?: number;
  colorA?: string;
  colorB?: string;
  backgroundColor?: string;
  noiseScale?: number;
  zoomSpeed?: number;
  rotation?: number;
  speed?: number;
}

const PRESETS: Record<KaleidoscopePreset, KaleidoscopePresetValues> = {
  default: {},
  neon:    { colorA: "#00ffff", colorB: "#ff00ff", backgroundColor: "#000000", segments: 8, speed: 1.5 },
  crystal: { colorA: "#88ccff", colorB: "#002244", backgroundColor: "#000510", segments: 12, noiseScale: 4 },
  void:    { colorA: "#cc00ff", colorB: "#000000", backgroundColor: "#000000", segments: 6, rotation: 0.4 },
  fire:    { colorA: "#ff8800", colorB: "#ff0000", backgroundColor: "#0a0000", segments: 6, speed: 2 },
  ice:     { colorA: "#ffffff", colorB: "#002255", backgroundColor: "#000510", segments: 10, noiseScale: 2, zoomSpeed: 0.5 },
};

export interface KaleidoscopeProps extends BaseCanvasProps {
  /** Number of mirror segments / symmetry (default: 6) */
  segments?: number;
  /** Animation speed (default: 1) */
  speed?: number;
  /** Color at noise peak (default: "#ffffff") */
  colorA?: string;
  /** Color at noise trough (default: "#333333") */
  colorB?: string;
  /** Background color outside the pattern radius (default: "#111111") */
  backgroundColor?: string;
  /** Noise spatial frequency (default: 3) */
  noiseScale?: number;
  /** Radial zoom/pulse animation speed (default: 0.3) */
  zoomSpeed?: number;
  /** Whole-pattern rotation speed in degrees per frame (default: 0.2) */
  rotation?: number;
  /** Render resolution fraction — lower is faster (default: 0.5) */
  resolution?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Named preset */
  preset?: KaleidoscopePreset | string;
}

export const Kaleidoscope = forwardRef<HTMLCanvasElement, KaleidoscopeProps>(
  (props, ref) => {
    const {
      preset, segments, speed, colorA, colorB, backgroundColor,
      noiseScale, zoomSpeed, rotation, resolution, animated,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as KaleidoscopePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useKaleidoscope(internalRef, {
      segments:        segments        ?? p.segments        ?? 6,
      speed:           speed           ?? p.speed           ?? 1,
      colorA:          colorA          ?? p.colorA          ?? "#ffffff",
      colorB:          colorB          ?? p.colorB          ?? "#333333",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      noiseScale:      noiseScale      ?? p.noiseScale      ?? 3,
      zoomSpeed:       zoomSpeed       ?? p.zoomSpeed       ?? 0.3,
      rotation:        rotation        ?? p.rotation        ?? 0.2,
      resolution:      resolution      ?? 0.5,
      animated:        animated        ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
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

Kaleidoscope.displayName = "Kaleidoscope";
