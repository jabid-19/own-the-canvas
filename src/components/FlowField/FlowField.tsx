import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useFlowField } from "./useFlowField";

type FlowFieldPreset = "default" | "neon" | "ocean" | "lava" | "forest" | "monochrome";

interface FlowFieldPresetValues {
  particleCount?: number;
  colors?: string[];
  backgroundColor?: string;
  noiseScale?: number;
  speed?: number;
  curl?: boolean;
}

export const PRESETS: Record<FlowFieldPreset, FlowFieldPresetValues> = {
  default: {
    colors: ["#ffffff", "#6b7280", "#9ca3af"],
    backgroundColor: "#111111",
  },
  neon: {
    colors: ["#7C3AED", "#e0b0ff", "#0891B2", "#67e8f9"],
    backgroundColor: "#000000",
    speed: 1.5,
    curl: true,
  },
  ocean: {
    colors: ["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9", "#e0f2fe"],
    backgroundColor: "#020f1a",
    noiseScale: 0.003,
    speed: 0.8,
  },
  lava: {
    colors: ["#7f1d1d", "#dc2626", "#f97316", "#fbbf24"],
    backgroundColor: "#0c0000",
    noiseScale: 0.004,
    speed: 0.6,
    curl: false,
  },
  forest: {
    colors: ["#14532d", "#15803d", "#4ade80", "#d9f99d"],
    backgroundColor: "#0a1a0a",
    speed: 0.7,
    curl: true,
  },
  monochrome: {
    colors: ["#e2e8f0", "#94a3b8", "#475569"],
    backgroundColor: "#0f172a",
    speed: 0.8,
  },
};

export interface FlowFieldProps extends BaseCanvasProps {
  /** Number of flow particles (default: 800) */
  particleCount?: number;
  /** Particle stroke colors — one is picked per particle (default: multi-color) */
  colors?: string[];
  /** Flow speed multiplier (default: 1) */
  speed?: number;
  /** Noise sampling scale — lower = larger flow structures (default: 0.004) */
  noiseScale?: number;
  /** Particle trail fade length — lower = longer trails (default: 0.04) */
  trailLength?: number;
  /** Background fade opacity per frame (default: 0.04) */
  fadeStrength?: number;
  /** Stroke line width (default: 1) */
  lineWidth?: number;
  /** Canvas background color (default: "#050010") */
  backgroundColor?: string;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** How fast the noise field evolves (default: 1) */
  timeSpeed?: number;
  /** Add curl noise component for more swirling flow (default: false) */
  curl?: boolean;
  /** Named preset: "default" | "neon" | "ocean" | "lava" | "forest" | "monochrome" */
  preset?: FlowFieldPreset | string;
}

export const FlowField = forwardRef<HTMLCanvasElement, FlowFieldProps>(
  (props, ref) => {
    const {
      preset, particleCount, colors, speed, noiseScale, trailLength,
      fadeStrength, lineWidth, backgroundColor, animated, timeSpeed, curl,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as FlowFieldPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useFlowField(internalRef, {
      particleCount: particleCount ?? p.particleCount ?? 800,
      colors: colors ?? p.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: speed ?? p.speed ?? 1,
      noiseScale: noiseScale ?? p.noiseScale ?? 0.004,
      trailLength: trailLength ?? 0.04,
      fadeStrength: fadeStrength ?? 0.04,
      lineWidth: lineWidth ?? 1,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      animated: animated ?? true,
      timeSpeed: timeSpeed ?? 1,
      curl: curl ?? p.curl ?? false,
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

FlowField.displayName = "FlowField";
