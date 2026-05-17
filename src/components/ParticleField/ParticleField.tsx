import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useParticleField } from "./useParticleField";

type ParticlePreset = "default" | "galaxy" | "snow" | "minimal" | "ocean";

interface ParticlePresetValues {
  particleColor?: string;
  lineColor?: string;
  backgroundColor?: string;
  particleCount?: number;
  speed?: number;
  connectParticles?: boolean;
  lineDistance?: number;
}

const PRESETS: Record<ParticlePreset, ParticlePresetValues> = {
  default: {},
  galaxy: {
    particleColor: "#8B5CF6",
    lineColor: "#8B5CF6",
    backgroundColor: "#030014",
    particleCount: 80,
    lineDistance: 130,
  },
  snow: {
    particleColor: "#dbeafe",
    lineColor: "#dbeafe",
    connectParticles: false,
    particleCount: 160,
    speed: 0.3,
    backgroundColor: "transparent",
  },
  minimal: {
    connectParticles: false,
    particleColor: "#4ade80",
    backgroundColor: "transparent",
    particleCount: 60,
  },
  ocean: {
    particleColor: "#67e8f9",
    lineColor: "#0891B2",
    backgroundColor: "#020f1a",
    particleCount: 100,
    lineDistance: 110,
    speed: 0.5,
  },
};

export interface ParticleFieldProps extends BaseCanvasProps {
  /** Number of particles (default: 120) */
  particleCount?: number;
  /** Particle fill color (default: "#7eb8f7") */
  particleColor?: string;
  /** Connection line color (default: "#7eb8f7") */
  lineColor?: string;
  /** Max distance for drawing lines (default: 120) */
  lineDistance?: number;
  /** Max particle radius in px (default: 2.5) */
  particleSize?: number;
  /** Base movement speed (default: 0.8) */
  speed?: number;
  /** Draw lines between close particles (default: true) */
  connectParticles?: boolean;
  /** Repel particles from mouse cursor (default: true) */
  interactive?: boolean;
  /** Canvas background color (default: "transparent") */
  backgroundColor?: string;
  /** Mouse repulsion radius in px (default: 80) */
  repelRadius?: number;
  /** Mouse repulsion force strength (default: 0.3) */
  repelStrength?: number;
  /** Velocity friction per frame 0–1 (default: 0.99) */
  friction?: number;
  /** Max velocity as multiple of speed (default: 3) */
  maxVelocityMultiplier?: number;
  /** Connection line width (default: 0.8) */
  lineWidth?: number;
  /** Connection line max opacity (default: 0.6) */
  lineOpacity?: number;
  /** Named preset: "default" | "galaxy" | "snow" | "minimal" | "ocean" */
  preset?: ParticlePreset | string;
}

export const ParticleField = forwardRef<HTMLCanvasElement, ParticleFieldProps>(
  (props, ref) => {
    const {
      preset,
      particleCount,
      particleColor,
      lineColor,
      lineDistance,
      particleSize,
      speed,
      connectParticles,
      interactive,
      backgroundColor,
      repelRadius,
      repelStrength,
      friction,
      maxVelocityMultiplier,
      lineWidth,
      lineOpacity,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as ParticlePreset]) || {};

    const resolvedParticleColor = particleColor ?? p.particleColor ?? "#ffffff";

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useParticleField(internalRef, {
      particleCount: particleCount ?? p.particleCount ?? 120,
      particleColor: resolvedParticleColor,
      lineColor: lineColor ?? p.lineColor ?? "#6b7280",
      lineDistance: lineDistance ?? p.lineDistance ?? 120,
      particleSize: particleSize ?? 2.5,
      speed: speed ?? p.speed ?? 0.8,
      connectParticles: connectParticles ?? p.connectParticles ?? true,
      interactive: interactive ?? true,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "transparent",
      repelRadius: repelRadius ?? 80,
      repelStrength: repelStrength ?? 0.3,
      friction: friction ?? 0.99,
      maxVelocityMultiplier: maxVelocityMultiplier ?? 3,
      lineWidth: lineWidth ?? 0.8,
      lineOpacity: lineOpacity ?? 0.6,
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

ParticleField.displayName = "ParticleField";
