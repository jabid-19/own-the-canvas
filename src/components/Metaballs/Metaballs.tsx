import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useMetaballs } from "./useMetaballs";

type MetaballsPreset = "default" | "plasma" | "lava" | "ocean" | "neon" | "ghost";

interface MetaballsPresetValues {
  color?: string;
  backgroundColor?: string;
  threshold?: number;
  speed?: number;
  minRadius?: number;
  maxRadius?: number;
  glowEffect?: boolean;
  glowBlur?: number;
}

const PRESETS: Record<MetaballsPreset, MetaballsPresetValues> = {
  default: {},
  plasma: {
    color: "#c084fc",
    backgroundColor: "#050010",
    glowEffect: true,
    glowBlur: 30,
    speed: 1.5,
  },
  lava: {
    color: "#f97316",
    backgroundColor: "#1a0000",
    glowEffect: true,
    glowBlur: 20,
    speed: 0.5,
    minRadius: 50,
    maxRadius: 100,
  },
  ocean: {
    color: "#38bdf8",
    backgroundColor: "#020c17",
    glowEffect: true,
    glowBlur: 15,
    speed: 0.8,
    threshold: 0.8,
  },
  neon: {
    color: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: true,
    glowBlur: 25,
    speed: 2,
    threshold: 1.1,
  },
  ghost: {
    color: "#e2e8f0",
    backgroundColor: "#111111",
    glowEffect: false,
    speed: 0.3,
    threshold: 0.9,
    minRadius: 60,
    maxRadius: 110,
  },
};

export interface MetaballsProps extends BaseCanvasProps {
  /** Number of initial metaballs (default: 5) */
  blobCount?: number;
  /** Blob fill color (default: "#ffffff") */
  color?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Field threshold for inside/outside (default: 1) */
  threshold?: number;
  /** Blob wander speed (default: 1) */
  speed?: number;
  /** Min blob radius in px (default: 40) */
  minRadius?: number;
  /** Max blob radius in px (default: 80) */
  maxRadius?: number;
  /** Glow effect (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 20) */
  glowBlur?: number;
  /** Render resolution fraction (default: 0.4) */
  resolution?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Drag to move; click to add (default: true) */
  interactive?: boolean;
  preset?: MetaballsPreset | string;
}

export const Metaballs = forwardRef<HTMLCanvasElement, MetaballsProps>(
  (props, ref) => {
    const {
      preset, blobCount, color, backgroundColor, threshold, speed,
      minRadius, maxRadius, glowEffect, glowBlur, resolution, animated, interactive,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as MetaballsPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useMetaballs(internalRef, {
      blobCount:       blobCount       ?? 5,
      color:           color           ?? p.color           ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      threshold:       threshold       ?? p.threshold       ?? 1,
      speed:           speed           ?? p.speed           ?? 1,
      minRadius:       minRadius       ?? p.minRadius       ?? 40,
      maxRadius:       maxRadius       ?? p.maxRadius       ?? 80,
      glowEffect:      glowEffect      ?? p.glowEffect      ?? true,
      glowBlur:        glowBlur        ?? p.glowBlur        ?? 20,
      resolution:      resolution      ?? 0.4,
      animated:        animated        ?? true,
      interactive:     interactive     ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "grab" : "default",
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

Metaballs.displayName = "Metaballs";
