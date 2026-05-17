import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useNoiseGradient } from "./useNoiseGradient";

type NoiseGradientPreset = "default" | "aurora" | "sunset" | "ocean" | "forest" | "neon";

interface NoiseGradientPresetValues {
  colors?: string[];
  speed?: number;
  scale?: number;
  octaves?: number;
}

const PRESETS: Record<NoiseGradientPreset, NoiseGradientPresetValues> = {
  default: {},
  aurora: {
    colors: ["#0d1117", "#0d4f3c", "#00ff87", "#00cfff", "#7C3AED"],
    speed: 0.2,
    scale: 0.8,
    octaves: 3,
  },
  sunset: {
    colors: ["#0a0010", "#7C3AED", "#dc2626", "#f97316", "#fbbf24"],
    speed: 0.15,
    scale: 1.2,
    octaves: 2,
  },
  ocean: {
    colors: ["#020f1a", "#0891B2", "#06b6d4", "#67e8f9", "#e0f2fe"],
    speed: 0.25,
    scale: 0.9,
    octaves: 4,
  },
  forest: {
    colors: ["#0a1a0a", "#166534", "#15803d", "#4ade80", "#d1fae5"],
    speed: 0.2,
    scale: 1.1,
    octaves: 3,
  },
  neon: {
    colors: ["#050010", "#7C3AED", "#0891B2", "#00ff87", "#7C3AED"],
    speed: 0.4,
    scale: 0.7,
    octaves: 3,
  },
};

export interface NoiseGradientProps extends BaseCanvasProps {
  /** 2–5 hex color stops for the gradient (default: monochrome) */
  colors?: string[];
  /** Animation speed multiplier (default: 0.3) */
  speed?: number;
  /** Noise zoom scale — higher = more zoomed in (default: 1) */
  scale?: number;
  /** Fractal octaves 1–6 — more = more detail (default: 3) */
  octaves?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Canvas composite blend mode (default: "source-over") */
  blendMode?: GlobalCompositeOperation | string;
  /** Y-axis time offset ratio — changes animation direction (default: 0.5) */
  timeOffsetY?: number;
  /** Octave amplitude persistence 0–1 (default: 0.5) */
  persistence?: number;
  /** Render resolution relative to canvas 0.05–1 — lower = faster, smooth upscale applied (default: 0.25) */
  resolution?: number;
  /** Named preset: "default" | "aurora" | "sunset" | "ocean" | "forest" | "neon" */
  preset?: NoiseGradientPreset | string;
}

export const NoiseGradient = forwardRef<HTMLCanvasElement, NoiseGradientProps>(
  (props, ref) => {
    const {
      preset,
      colors,
      speed,
      scale,
      octaves,
      animated,
      blendMode,
      timeOffsetY,
      persistence,
      resolution,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as NoiseGradientPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useNoiseGradient(internalRef, {
      colors: colors ?? p.colors ?? ["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"],
      speed: speed ?? p.speed ?? 0.25,
      scale: scale ?? p.scale ?? 1,
      octaves: octaves ?? p.octaves ?? 3,
      animated: animated ?? true,
      blendMode: blendMode ?? "source-over",
      timeOffsetY: timeOffsetY ?? 0.5,
      persistence: persistence ?? 0.5,
      resolution: resolution ?? 0.25,
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

NoiseGradient.displayName = "NoiseGradient";
