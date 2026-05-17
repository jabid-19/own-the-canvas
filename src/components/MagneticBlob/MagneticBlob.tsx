import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useMagneticBlob } from "./useMagneticBlob";

type MagneticBlobPreset = "default" | "neon" | "plasma" | "ocean" | "lava" | "minimal";

interface MagneticBlobPresetValues {
  count?: number;
  colors?: string[];
  radius?: number;
  speed?: number;
  magnetStrength?: number;
  threshold?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  backgroundColor?: string;
  wanderStrength?: number;
}

const PRESETS: Record<MagneticBlobPreset, MagneticBlobPresetValues> = {
  default: {
    count: 5,
    colors: ["#ffffff", "#6b7280"],
    radius: 80,
    speed: 1,
    magnetStrength: 0.08,
    threshold: 1.8,
    glowEffect: true,
    glowBlur: 20,
    backgroundColor: "#111111",
    wanderStrength: 0.4,
  },
  neon: {
    count: 4,
    colors: ["#00ffff", "#ff00ff", "#7C3AED"],
    radius: 90,
    glowEffect: true,
    glowBlur: 35,
    backgroundColor: "#000000",
    wanderStrength: 0.5,
  },
  plasma: {
    count: 6,
    colors: ["#f43f5e", "#f59e0b", "#7C3AED", "#0891B2"],
    radius: 70,
    threshold: 2,
    glowEffect: true,
    glowBlur: 25,
    backgroundColor: "#050010",
    wanderStrength: 0.6,
  },
  ocean: {
    count: 4,
    colors: ["#0891B2", "#06b6d4", "#0e7490"],
    radius: 100,
    speed: 0.6,
    glowEffect: true,
    glowBlur: 15,
    backgroundColor: "#020f1a",
    wanderStrength: 0.3,
  },
  lava: {
    count: 5,
    colors: ["#dc2626", "#f97316", "#fbbf24"],
    radius: 80,
    speed: 0.5,
    glowEffect: true,
    glowBlur: 20,
    backgroundColor: "#0c0000",
    wanderStrength: 0.2,
  },
  minimal: {
    count: 3,
    colors: ["#e2e8f0", "#94a3b8"],
    radius: 70,
    glowEffect: false,
    backgroundColor: "#0f172a",
    wanderStrength: 0.3,
  },
};

export interface MagneticBlobProps extends BaseCanvasProps {
  /** Number of blobs (default: 5) */
  count?: number;
  /** Blob colors (default: purple/cyan/green) */
  colors?: string[];
  /** Base blob radius in px (default: 80) */
  radius?: number;
  /** Wander animation speed (default: 1) */
  speed?: number;
  /** Mouse attraction force (default: 0.08) */
  magnetStrength?: number;
  /** Mouse influence radius in px (default: 150) */
  magnetRadius?: number;
  /** Metaball merge threshold — higher = earlier merge (default: 1.8) */
  threshold?: number;
  /** Glow effect (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 20) */
  glowBlur?: number;
  /** Canvas background (default: "#050010") */
  backgroundColor?: string;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Blobs follow cursor (default: true) */
  followMouse?: boolean;
  /** Organic wander amplitude 0–1 (default: 0.4) */
  wanderStrength?: number;
  /** Named preset */
  preset?: MagneticBlobPreset | string;
}

export const MagneticBlob = forwardRef<HTMLCanvasElement, MagneticBlobProps>(
  (props, ref) => {
    const {
      preset, count, colors, radius, speed, magnetStrength, magnetRadius,
      threshold, glowEffect, glowBlur, backgroundColor, animated,
      followMouse, wanderStrength,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as MagneticBlobPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useMagneticBlob(internalRef, {
      count: count ?? p.count ?? 5,
      colors: colors ?? p.colors ?? ["#ffffff", "#6b7280"],
      radius: radius ?? p.radius ?? 80,
      speed: speed ?? p.speed ?? 1,
      magnetStrength: magnetStrength ?? p.magnetStrength ?? 0.08,
      magnetRadius: magnetRadius ?? 150,
      threshold: threshold ?? p.threshold ?? 1.8,
      glowEffect: glowEffect ?? p.glowEffect ?? true,
      glowBlur: glowBlur ?? p.glowBlur ?? 20,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      animated: animated ?? true,
      followMouse: followMouse ?? true,
      wanderStrength: wanderStrength ?? p.wanderStrength ?? 0.4,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

MagneticBlob.displayName = "MagneticBlob";
