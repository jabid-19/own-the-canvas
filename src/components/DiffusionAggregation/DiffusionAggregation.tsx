import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useDiffusionAggregation, DLASeedMode } from "./useDiffusionAggregation";

type DiffusionAggregationPreset = "default" | "coral" | "snowflake" | "lightning" | "neon" | "frost";

interface DiffusionAggregationPresetValues {
  particleColor?: string;
  walkerColor?: string;
  backgroundColor?: string;
  seedMode?: DLASeedMode;
  particleSize?: number;
  glowEffect?: boolean;
  glowBlur?: number;
}

export const PRESETS: Record<DiffusionAggregationPreset, DiffusionAggregationPresetValues> = {
  default: {},
  coral: {
    particleColor: "#ff7043",
    walkerColor: "#ff7043",
    backgroundColor: "#0a0500",
    glowEffect: true,
    glowBlur: 6,
  },
  snowflake: {
    particleColor: "#a8d8ff",
    walkerColor: "#a8d8ff",
    backgroundColor: "#020510",
    seedMode: "center",
    glowEffect: true,
    glowBlur: 8,
  },
  lightning: {
    particleColor: "#fffde7",
    walkerColor: "#fff59d",
    backgroundColor: "#050510",
    seedMode: "bottom",
    glowEffect: true,
    glowBlur: 10,
  },
  neon: {
    particleColor: "#00ffcc",
    walkerColor: "#ff00ff",
    backgroundColor: "#000000",
    glowEffect: true,
    glowBlur: 12,
  },
  frost: {
    particleColor: "#e0f7fa",
    walkerColor: "#80deea",
    backgroundColor: "#011820",
    seedMode: "ring",
    glowEffect: true,
    glowBlur: 6,
  },
};

export interface DiffusionAggregationProps extends BaseCanvasProps {
  /** Aggregated cluster color (default: "#ffffff") */
  particleColor?: string;
  /** Active walker color (default: "#6b7280") */
  walkerColor?: string;
  /** Canvas background color (default: "#111111") */
  backgroundColor?: string;
  /** Particle/cell size in pixels (default: 3) */
  particleSize?: number;
  /** Number of simultaneous random walkers (default: 60) */
  walkerCount?: number;
  /** Walker steps computed per animation frame (default: 20) */
  stepsPerFrame?: number;
  /** Where the initial seed is placed (default: "center") */
  seedMode?: DLASeedMode;
  /** Render active walkers (default: false) */
  showWalkers?: boolean;
  /** Glow effect on cluster particles (default: true) */
  glowEffect?: boolean;
  /** Shadow blur radius for glow (default: 8) */
  glowBlur?: number;
  /** Click to add extra seed points (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: DiffusionAggregationPreset | string;
}

export const DiffusionAggregation = forwardRef<HTMLCanvasElement, DiffusionAggregationProps>(
  (props, ref) => {
    const {
      preset,
      particleColor,
      walkerColor,
      backgroundColor,
      particleSize,
      walkerCount,
      stepsPerFrame,
      seedMode,
      showWalkers,
      glowEffect,
      glowBlur,
      interactive,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as DiffusionAggregationPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useDiffusionAggregation(internalRef, {
      particleColor:   particleColor   ?? p.particleColor   ?? "#ffffff",
      walkerColor:     walkerColor     ?? p.walkerColor     ?? "#6b7280",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      particleSize:    particleSize    ?? p.particleSize    ?? 3,
      walkerCount:     walkerCount     ?? 60,
      stepsPerFrame:   stepsPerFrame   ?? 20,
      seedMode:        seedMode        ?? p.seedMode        ?? "center",
      showWalkers:     showWalkers     ?? false,
      glowEffect:      glowEffect      ?? p.glowEffect      ?? true,
      glowBlur:        glowBlur        ?? p.glowBlur        ?? 8,
      interactive:     interactive     ?? true,
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

DiffusionAggregation.displayName = "DiffusionAggregation";
