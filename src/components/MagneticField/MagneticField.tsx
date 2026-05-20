import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useMagneticField } from "./useMagneticField";

type MagneticFieldPreset = "default" | "neon" | "warm" | "mono" | "electric" | "minimal";

interface MagneticFieldPresetValues {
  positiveColor?: string;
  negativeColor?: string;
  lineColor?: string;
  backgroundColor?: string;
  lineOpacity?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  fieldLineCount?: number;
}

const PRESETS: Record<MagneticFieldPreset, MagneticFieldPresetValues> = {
  default: {},
  neon: {
    positiveColor: "#f43f5e",
    negativeColor: "#3b82f6",
    lineColor: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: true,
    glowBlur: 25,
    lineOpacity: 0.8,
  },
  warm: {
    positiveColor: "#f97316",
    negativeColor: "#fbbf24",
    lineColor: "#fed7aa",
    backgroundColor: "#0c0500",
    glowEffect: true,
    glowBlur: 18,
  },
  mono: {
    positiveColor: "#ffffff",
    negativeColor: "#6b7280",
    lineColor: "#9ca3af",
    backgroundColor: "#111111",
    glowEffect: false,
    lineOpacity: 0.5,
  },
  electric: {
    positiveColor: "#38bdf8",
    negativeColor: "#a78bfa",
    lineColor: "#e0f2fe",
    backgroundColor: "#020c14",
    glowEffect: true,
    glowBlur: 30,
    fieldLineCount: 24,
  },
  minimal: {
    positiveColor: "#ef4444",
    negativeColor: "#3b82f6",
    lineColor: "#4b5563",
    backgroundColor: "#111111",
    glowEffect: false,
    lineOpacity: 0.4,
    fieldLineCount: 10,
  },
};

export interface MagneticFieldProps extends BaseCanvasProps {
  /** Field lines seeded per positive pole (default: 16) */
  fieldLineCount?: number;
  /** Euler integration step in px (default: 4) */
  stepSize?: number;
  /** Max steps per field line (default: 400) */
  maxSteps?: number;
  /** N-pole color (default: "#ef4444") */
  positiveColor?: string;
  /** S-pole color (default: "#3b82f6") */
  negativeColor?: string;
  /** Field line stroke color (default: "#6b7280") */
  lineColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Field line stroke width (default: 1) */
  lineWidth?: number;
  /** Field line alpha (default: 0.6) */
  lineOpacity?: number;
  /** Magnet circle radius in px (default: 12) */
  poleRadius?: number;
  /** Glow on poles (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 20) */
  glowBlur?: number;
  /** Redraw every frame vs only on change (default: false) */
  animated?: boolean;
  /** Drag poles; click to add; right-click to remove (default: true) */
  interactive?: boolean;
  /** Max total poles (default: 6) */
  maxPoles?: number;
  preset?: MagneticFieldPreset | string;
}

export const MagneticField = forwardRef<HTMLCanvasElement, MagneticFieldProps>(
  (props, ref) => {
    const {
      preset, fieldLineCount, stepSize, maxSteps,
      positiveColor, negativeColor, lineColor, backgroundColor,
      lineWidth, lineOpacity, poleRadius, glowEffect, glowBlur,
      animated, interactive, maxPoles,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as MagneticFieldPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useMagneticField(internalRef, {
      fieldLineCount: fieldLineCount ?? p.fieldLineCount ?? 16,
      stepSize:       stepSize       ?? 4,
      maxSteps:       maxSteps       ?? 400,
      positiveColor:  positiveColor  ?? p.positiveColor  ?? "#ef4444",
      negativeColor:  negativeColor  ?? p.negativeColor  ?? "#3b82f6",
      lineColor:      lineColor      ?? p.lineColor      ?? "#6b7280",
      backgroundColor:backgroundColor?? p.backgroundColor?? "#111111",
      lineWidth:      lineWidth      ?? 1,
      lineOpacity:    lineOpacity    ?? p.lineOpacity    ?? 0.6,
      poleRadius:     poleRadius     ?? 12,
      glowEffect:     glowEffect     ?? p.glowEffect     ?? true,
      glowBlur:       glowBlur       ?? p.glowBlur       ?? 20,
      animated:       animated       ?? false,
      interactive:    interactive    ?? true,
      maxPoles:       maxPoles       ?? 6,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "pointer" : "default",
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

MagneticField.displayName = "MagneticField";
