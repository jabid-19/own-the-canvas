import { BaseCanvasProps } from "../../types";
export type ParticleLineStyle = "solid" | "dashed";
type ParticlePreset = "default" | "galaxy" | "snow" | "minimal" | "ocean" | "cosmos" | "aurora" | "gold";
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
export declare const ParticleField: import("react").ForwardRefExoticComponent<ParticleFieldProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
