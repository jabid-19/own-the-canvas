import { BaseCanvasProps } from '../../types';

type ParticlePreset = "default" | "galaxy" | "snow" | "minimal" | "ocean";
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
export declare const ParticleField: import('react').ForwardRefExoticComponent<ParticleFieldProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
