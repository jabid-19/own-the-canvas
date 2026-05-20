import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useInkBleed } from "./useInkBleed";

type InkBleedPreset = "default" | "midnight" | "sepia" | "toxic" | "neon" | "frost";

interface InkBleedPresetValues {
  inkColor?: string;
  paperColor?: string;
  diffusionRate?: number;
  viscosity?: number;
  evaporationRate?: number;
  glowEffect?: boolean;
  glowBlur?: number;
}

const PRESETS: Record<InkBleedPreset, InkBleedPresetValues> = {
  default: {},
  midnight: {
    inkColor: "#3b82f6",
    paperColor: "#020817",
    diffusionRate: 0.4,
    glowEffect: true,
    glowBlur: 12,
  },
  sepia: {
    inkColor: "#92400e",
    paperColor: "#fef3c7",
    diffusionRate: 0.2,
    viscosity: 0.9,
  },
  toxic: {
    inkColor: "#84cc16",
    paperColor: "#0a0f00",
    diffusionRate: 0.5,
    glowEffect: true,
    glowBlur: 12,
  },
  neon: {
    inkColor: "#f0abfc",
    paperColor: "#0a000f",
    diffusionRate: 0.35,
    glowEffect: true,
    glowBlur: 15,
  },
  frost: {
    inkColor: "#bae6fd",
    paperColor: "#0c1428",
    diffusionRate: 0.25,
    viscosity: 0.85,
    evaporationRate: 0.001,
  },
};

export interface InkBleedProps extends BaseCanvasProps {
  /** Primary ink color (default: "#ffffff") */
  inkColor?: string;
  /** Background paper color (default: "#111111") */
  paperColor?: string;
  /** Speed ink spreads outward 0–1 (default: 0.3) */
  diffusionRate?: number;
  /** Ink thickness — higher = slower bleed (default: 0.8) */
  viscosity?: number;
  /** How fast ink fades per frame (default: 0.002) */
  evaporationRate?: number;
  /** Drop radius on click in px (default: 8) */
  inkRadius?: number;
  /** Initial ink concentration 0–1 (default: 1) */
  inkStrength?: number;
  /** Click/drag to drop ink (default: true) */
  interactive?: boolean;
  /** Auto-drop ink at intervals (default: true) */
  autoInk?: boolean;
  /** Ms between auto drops (default: 2000) */
  autoInkInterval?: number;
  /** Render resolution fraction (default: 0.5) */
  resolution?: number;
  /** Glow on ink (default: false) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 8) */
  glowBlur?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  preset?: InkBleedPreset | string;
}

export const InkBleed = forwardRef<HTMLCanvasElement, InkBleedProps>(
  (props, ref) => {
    const {
      preset, inkColor, paperColor, diffusionRate, viscosity, evaporationRate,
      inkRadius, inkStrength, interactive, autoInk, autoInkInterval,
      resolution, glowEffect, glowBlur, animated, width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as InkBleedPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useInkBleed(internalRef, {
      inkColor:        inkColor        ?? p.inkColor        ?? "#ffffff",
      paperColor:      paperColor      ?? p.paperColor      ?? "#111111",
      diffusionRate:   diffusionRate   ?? p.diffusionRate   ?? 0.3,
      viscosity:       viscosity       ?? p.viscosity       ?? 0.8,
      evaporationRate: evaporationRate ?? p.evaporationRate ?? 0.002,
      inkRadius:       inkRadius       ?? 8,
      inkStrength:     inkStrength     ?? 1,
      interactive:     interactive     ?? true,
      autoInk:         autoInk         ?? true,
      autoInkInterval: autoInkInterval ?? 2000,
      resolution:      resolution      ?? 0.5,
      glowEffect:      glowEffect      ?? p.glowEffect      ?? false,
      glowBlur:        glowBlur        ?? p.glowBlur        ?? 8,
      animated:        animated        ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "crosshair" : "default",
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

InkBleed.displayName = "InkBleed";
