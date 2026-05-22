import { BaseCanvasProps } from "../../types";
type ParticleTextPreset = "default" | "neon" | "fire" | "frost" | "gold" | "minimal";
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
export declare const ParticleText: import("react").ForwardRefExoticComponent<ParticleTextProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
