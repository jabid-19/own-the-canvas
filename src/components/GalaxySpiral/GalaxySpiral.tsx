import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useGalaxySpiral } from "./useGalaxySpiral";
import { resolvePreset } from "../../utils/props";

type GalaxySpiralPreset = "default" | "andromeda" | "neon" | "void" | "golden" | "monochrome";

interface GalaxySpiralPresetValues {
  coreColor?: string;
  diskColor?: string;
  backgroundColor?: string;
  armCount?: number;
  armTightness?: number;
  rotationSpeed?: number;
}

export const PRESETS: Record<GalaxySpiralPreset, GalaxySpiralPresetValues> = {
  default: { coreColor: "#ffd8a8", diskColor: "#a8c4ff", backgroundColor: "#020408" },
  monochrome: {},
  andromeda: {
    coreColor: "#ffd8a8",
    diskColor: "#a8c4ff",
    backgroundColor: "#020408",
    armTightness: 0.6,
  },
  neon: {
    coreColor: "#ff00ff",
    diskColor: "#00ffff",
    backgroundColor: "#000008",
    rotationSpeed: 0.0006,
  },
  void: {
    coreColor: "#8866ff",
    diskColor: "#4433aa",
    backgroundColor: "#020005",
    armCount: 3,
    armTightness: 0.4,
  },
  golden: {
    coreColor: "#ffe066",
    diskColor: "#ffaa33",
    backgroundColor: "#060400",
    rotationSpeed: 0.0002,
  },
};

export interface GalaxySpiralProps extends BaseCanvasProps {
  /** Total star particle count (default: 3000) */
  starCount?: number;
  /** Number of spiral arms (default: 2) */
  armCount?: number;
  /** Arm winding tightness (default: 0.5) */
  armTightness?: number;
  /** Galactic core color (default: "#ffd8a8") */
  coreColor?: string;
  /** Outer disk star color (default: "#a8c4ff") */
  diskColor?: string;
  /** Canvas background (default: "#020408") */
  backgroundColor?: string;
  /** Rotation speed in radians/frame (default: 0.0003) */
  rotationSpeed?: number;
  /** Initial viewing tilt in radians (default: 0.3) */
  tiltX?: number;
  /** Cursor tilts viewing angle (default: true) */
  interactive?: boolean;
  /** Core radial glow overlay (default: true) */
  coreGlow?: boolean;
  /** Core glow shadow blur (default: 30) */
  glowBlur?: number;
  /** Named preset */
  preset?: GalaxySpiralPreset | string;
}

export const GalaxySpiral = forwardRef<HTMLCanvasElement, GalaxySpiralProps>(
  (props, ref) => {
    const {
      preset, starCount, armCount, armTightness, coreColor, diskColor,
      backgroundColor, rotationSpeed, tiltX, interactive, coreGlow, glowBlur,
      width, height, className, style,
    } = props;

    const p = resolvePreset("GalaxySpiral", PRESETS, props);
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useGalaxySpiral(internalRef, {
      starCount:     starCount     ?? 3000,
      armCount:      armCount      ?? p.armCount      ?? 2,
      armTightness:  armTightness  ?? p.armTightness  ?? 0.5,
      coreColor:     coreColor     ?? p.coreColor     ?? "#ffffff",
      diskColor:     diskColor     ?? p.diskColor     ?? "#6b7280",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      rotationSpeed: rotationSpeed ?? p.rotationSpeed ?? 0.0003,
      tiltX:         tiltX         ?? 0.3,
      interactive:   interactive   ?? true,
      coreGlow:      coreGlow      ?? true,
      glowBlur:      glowBlur      ?? 30,
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

GalaxySpiral.displayName = "GalaxySpiral";
