import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useParticleText } from "./useParticleText";

type ParticleTextPreset = "default" | "neon" | "fire" | "frost" | "gold" | "minimal";

interface ParticleTextPresetValues {
  color?: string;
  backgroundColor?: string;
  particleSize?: number;
  repelRadius?: number;
  repelForce?: number;
  snapSpeed?: number;
  glowEffect?: boolean;
  glowBlur?: number;
}

const PRESETS: Record<ParticleTextPreset, ParticleTextPresetValues> = {
  default: {},
  neon: {
    color: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: true,
    glowBlur: 10,
    repelForce: 7,
  },
  fire: {
    color: "#f97316",
    backgroundColor: "#0a0200",
    glowEffect: true,
    glowBlur: 12,
    repelForce: 8,
    particleSize: 2,
  },
  frost: {
    color: "#93c5fd",
    backgroundColor: "#030712",
    glowEffect: true,
    glowBlur: 8,
    repelRadius: 100,
    snapSpeed: 0.08,
  },
  gold: {
    color: "#fbbf24",
    backgroundColor: "#0a0800",
    glowEffect: true,
    glowBlur: 14,
    particleSize: 2,
  },
  minimal: {
    color: "#6b7280",
    backgroundColor: "#111111",
    glowEffect: false,
    particleSize: 1.5,
    repelForce: 3,
  },
};

export interface ParticleTextProps extends BaseCanvasProps {
  /** Text to display (default: "hello") */
  text?: string;
  /** Font size for sampling in px (default: 120) */
  fontSize?: number;
  /** Font family (default: "sans-serif") */
  fontFamily?: string;
  /** Particle color (default: "#ffffff") */
  color?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Particle radius in px (default: 2) */
  particleSize?: number;
  /** Sampling grid step in px (default: 4) */
  particleGap?: number;
  /** Mouse influence radius in px (default: 80) */
  repelRadius?: number;
  /** Repulsion strength (default: 5) */
  repelForce?: number;
  /** Spring constant for return (default: 0.12) */
  snapSpeed?: number;
  /** Velocity damping per frame (default: 0.85) */
  friction?: number;
  /** Glow on particles (default: false) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 6) */
  glowBlur?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Mouse repulsion (default: true) */
  interactive?: boolean;
  preset?: ParticleTextPreset | string;
}

export const ParticleText = forwardRef<HTMLCanvasElement, ParticleTextProps>(
  (props, ref) => {
    const {
      preset, text, fontSize, fontFamily, color, backgroundColor,
      particleSize, particleGap, repelRadius, repelForce, snapSpeed, friction,
      glowEffect, glowBlur, animated, interactive,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as ParticleTextPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useParticleText(internalRef, {
      text:            text            ?? "hello",
      fontSize:        fontSize        ?? 120,
      fontFamily:      fontFamily      ?? "sans-serif",
      color:           color           ?? p.color           ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      particleSize:    particleSize    ?? p.particleSize    ?? 2,
      particleGap:     particleGap     ?? 4,
      repelRadius:     repelRadius     ?? p.repelRadius     ?? 80,
      repelForce:      repelForce      ?? p.repelForce      ?? 5,
      snapSpeed:       snapSpeed       ?? p.snapSpeed       ?? 0.12,
      friction:        friction        ?? 0.85,
      glowEffect:      glowEffect      ?? p.glowEffect      ?? false,
      glowBlur:        glowBlur        ?? p.glowBlur        ?? 6,
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

ParticleText.displayName = "ParticleText";
