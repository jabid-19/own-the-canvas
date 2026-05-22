import { BaseCanvasProps } from "../../types";
type BoidsPreset = "default" | "birds" | "fish" | "swarm" | "neon";
export interface BoidsProps extends BaseCanvasProps {
    /** Number of boids. (default: 80) */
    count?: number;
    /** Maximum speed in px/frame. (default: 3) */
    maxSpeed?: number;
    /** Radius for separation rule in px. (default: 25) */
    separationRadius?: number;
    /** Radius for alignment rule in px. (default: 50) */
    alignmentRadius?: number;
    /** Radius for cohesion rule in px. (default: 60) */
    cohesionRadius?: number;
    /** Separation steering force. (default: 0.05) */
    separationForce?: number;
    /** Alignment steering force. (default: 0.05) */
    alignmentForce?: number;
    /** Cohesion steering force. (default: 0.03) */
    cohesionForce?: number;
    /** Boid and trail color. (default: "#7C3AED") */
    color?: string;
    /** Trail history length in frames. (default: 8) */
    trailLength?: number;
    /** Trail line opacity 0–1. (default: 0.4) */
    trailOpacity?: number;
    /** Boid triangle size in px. (default: 6) */
    boidSize?: number;
    /** Canvas background color. (default: "#050010") */
    backgroundColor?: string;
    /** Boids flee from mouse cursor. (default: true) */
    interactive?: boolean;
    /** Mouse avoidance radius in px. (default: 80) */
    mouseRadius?: number;
    /** Mouse avoidance force. (default: 0.2) */
    mouseForce?: number;
    /** Wrap boids at canvas edges. (default: true) */
    wrapEdges?: boolean;
    /** Named preset. */
    preset?: BoidsPreset | string;
}
export declare const Boids: import("react").ForwardRefExoticComponent<BoidsProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
