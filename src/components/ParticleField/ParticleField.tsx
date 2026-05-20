import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useParticleField } from "./useParticleField";

export type ParticleLineStyle = "solid" | "dashed";

type ParticlePreset = "default" | "galaxy" | "snow" | "minimal" | "ocean" | "cosmos" | "aurora" | "gold";

interface ParticlePresetValues {
  particleColor?: string;
  lineColor?: string;
  backgroundColor?: string;
  particleCount?: number;
  speed?: number;
  connectParticles?: boolean;
  lineDistance?: number;
  lineOpacity?: number;
  wrapEdges?: boolean;
  twinkle?: boolean;
  glowParticles?: boolean;
  lineStyle?: ParticleLineStyle;
  velocityMultiplier?: number;
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
  cosmos: {
    particleColor: "#e0e7ff",
    lineColor: "#6366f1",
    backgroundColor: "#030014",
    particleCount: 80,
    lineDistance: 120,
    speed: 0.3,
    wrapEdges: true,
    twinkle: true,
    glowParticles: true,
    velocityMultiplier: 0.3,
  },
  aurora: {
    particleColor: "#67e8f9",
    lineColor: "#0891B2",
    backgroundColor: "#020f1a",
    particleCount: 80,
    lineDistance: 110,
    speed: 0.3,
    wrapEdges: true,
    twinkle: true,
    glowParticles: true,
    lineStyle: "dashed",
    velocityMultiplier: 0.3,
  },
  gold: {
    particleColor: "#fbbf24",
    lineColor: "#d97706",
    backgroundColor: "#0c0800",
    particleCount: 80,
    speed: 0.3,
    wrapEdges: true,
    twinkle: true,
    glowParticles: true,
    lineOpacity: 0.4,
    velocityMultiplier: 0.3,
  },
};

export interface ParticleFieldProps extends BaseCanvasProps {
  /** Number of particles (default: 120) */
  particleCount?: number;
  /** Particle fill color (default: "#ffffff") */
  particleColor?: string;
  /** Connection line color (default: "#6b7280") */
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
  /** Wrap particles around edges instead of bouncing (default: false) */
  wrapEdges?: boolean;
  /** Enable twinkling opacity animation (default: false) */
  twinkle?: boolean;
  /** Twinkling animation speed (default: 0.03) */
  twinkleSpeed?: number;
  /** Twinkling opacity amplitude 0–1 (default: 0.4) */
  twinkleAmplitude?: number;
  /** Enable glow shadow on particles (default: false) */
  glowParticles?: boolean;
  /** Glow shadow blur in px (default: 15) */
  glowBlur?: number;
  /** Connection line stroke style (default: "solid") */
  lineStyle?: ParticleLineStyle;
  /** Enable drag-to-reposition individual particles (default: false) */
  dragParticles?: boolean;
  /** Drag detection radius in px (default: 20) */
  dragRadius?: number;
  /** Initial velocity multiplier — scales vx/vy at spawn (default: 2) */
  velocityMultiplier?: number;
  /** Named preset: "default" | "galaxy" | "snow" | "minimal" | "ocean" | "cosmos" | "aurora" | "gold" */
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
      wrapEdges,
      twinkle,
      twinkleSpeed,
      twinkleAmplitude,
      glowParticles,
      glowBlur,
      lineStyle,
      dragParticles,
      dragRadius,
      velocityMultiplier,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as ParticlePreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useParticleField(internalRef, {
      particleCount: particleCount ?? p.particleCount ?? 120,
      particleColor: particleColor ?? p.particleColor ?? "#ffffff",
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
      lineOpacity: lineOpacity ?? p.lineOpacity ?? 0.6,
      wrapEdges: wrapEdges ?? p.wrapEdges ?? false,
      twinkle: twinkle ?? p.twinkle ?? false,
      twinkleSpeed: twinkleSpeed ?? 0.03,
      twinkleAmplitude: twinkleAmplitude ?? 0.4,
      glowParticles: glowParticles ?? p.glowParticles ?? false,
      glowBlur: glowBlur ?? 15,
      lineStyle: lineStyle ?? p.lineStyle ?? "solid",
      dragParticles: dragParticles ?? false,
      dragRadius: dragRadius ?? 20,
      velocityMultiplier: velocityMultiplier ?? p.velocityMultiplier ?? 2,
    });

    const isDraggable = dragParticles ?? false;

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: isDraggable ? "grab" : "default",
          ...style,
        }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

ParticleField.displayName = "ParticleField";
