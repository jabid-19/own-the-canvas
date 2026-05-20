import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { usePendulaWave, PendulaWaveColorMode } from "./usePendulaWave";

type PendulaWavePreset = "default" | "neon" | "crystal" | "sand" | "minimal" | "cosmic";

interface PendulaWavePresetValues {
  color?: string;
  color2?: string;
  backgroundColor?: string;
  lineWidth?: number;
  trailFade?: number;
  damping?: number;
  freq1?: number;
  freq2?: number;
  freq3?: number;
  colorMode?: PendulaWaveColorMode;
  glowEffect?: boolean;
  glowBlur?: number;
}

const PRESETS: Record<PendulaWavePreset, PendulaWavePresetValues> = {
  default: {},
  neon: {
    color: "#00ffcc",
    color2: "#ff00aa",
    backgroundColor: "#000000",
    colorMode: "cycle",
    glowEffect: true,
    glowBlur: 12,
    trailFade: 0.015,
  },
  crystal: {
    color: "#88ccff",
    color2: "#ffffff",
    backgroundColor: "#000510",
    colorMode: "gradient",
    glowEffect: true,
    glowBlur: 8,
    freq1: 3,
    freq2: 5,
  },
  sand: {
    color: "#d4a76a",
    color2: "#7c5c2e",
    backgroundColor: "#1a1005",
    colorMode: "gradient",
    trailFade: 0.005,
    damping: 0.9998,
  },
  minimal: {
    color: "#6b7280",
    backgroundColor: "#111111",
    lineWidth: 0.8,
    trailFade: 0.03,
    colorMode: "solid",
    glowEffect: false,
  },
  cosmic: {
    color: "#c084fc",
    color2: "#38bdf8",
    backgroundColor: "#020010",
    colorMode: "cycle",
    glowEffect: true,
    glowBlur: 15,
    freq1: 5,
    freq2: 7,
    freq3: 0.02,
  },
};

export interface PendulaWaveProps extends BaseCanvasProps {
  /** Stroke color (default: "#ffffff") */
  color?: string;
  /** Secondary color used in gradient colorMode (default: "#6b7280") */
  color2?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Stroke line width (default: 1) */
  lineWidth?: number;
  /** Background fade per frame — lower = longer trails (default: 0.01) */
  trailFade?: number;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Energy decay per step 0.999–1 (default: 0.9995) */
  damping?: number;
  /** Frequency of pendulum 1 (x-axis) (default: 2) */
  freq1?: number;
  /** Frequency of pendulum 2 (y-axis) (default: 3) */
  freq2?: number;
  /** Frequency of phase-shift pendulum (default: 0.01) */
  freq3?: number;
  /** Max swing as fraction of canvas half-size (default: 0.9) */
  amplitude?: number;
  /** Color mode: "solid" | "cycle" | "gradient" (default: "solid") */
  colorMode?: PendulaWaveColorMode;
  /** Enable glow (default: false) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 10) */
  glowBlur?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Restart after damping decays to near-zero (default: true) */
  autoReset?: boolean;
  preset?: PendulaWavePreset | string;
}

export const PendulaWave = forwardRef<HTMLCanvasElement, PendulaWaveProps>(
  (props, ref) => {
    const {
      preset, color, color2, backgroundColor, lineWidth, trailFade, speed,
      damping, freq1, freq2, freq3, amplitude, colorMode, glowEffect, glowBlur,
      animated, autoReset, width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as PendulaWavePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    usePendulaWave(internalRef, {
      color:           color           ?? p.color           ?? "#ffffff",
      color2:          color2          ?? p.color2          ?? "#6b7280",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      lineWidth:       lineWidth       ?? p.lineWidth       ?? 1,
      trailFade:       trailFade       ?? p.trailFade       ?? 0.01,
      speed:           speed           ?? 1,
      damping:         damping         ?? p.damping         ?? 0.9995,
      freq1:           freq1           ?? p.freq1           ?? 2,
      freq2:           freq2           ?? p.freq2           ?? 3,
      freq3:           freq3           ?? p.freq3           ?? 0.01,
      amplitude:       amplitude       ?? 0.9,
      colorMode:       colorMode       ?? p.colorMode       ?? "solid",
      glowEffect:      glowEffect      ?? p.glowEffect      ?? false,
      glowBlur:        glowBlur        ?? p.glowBlur        ?? 10,
      animated:        animated        ?? true,
      autoReset:       autoReset       ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
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

PendulaWave.displayName = "PendulaWave";
