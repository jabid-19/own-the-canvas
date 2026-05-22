import { BaseCanvasProps } from "../../types";
type AntColonyPreset = "default" | "neon" | "desert" | "jungle" | "minimal" | "swarm";
export interface AntColonyProps extends BaseCanvasProps {
    /** Number of ants (default: 150) */
    antCount?: number;
    /** Pheromone decay per frame (default: 0.003) */
    evaporationRate?: number;
    /** Pheromone spread to neighbors (default: 0.1) */
    diffusionRate?: number;
    /** Pheromone deposited per step (default: 5) */
    pheromoneStrength?: number;
    /** Pixels per frame per ant (default: 1.5) */
    antSpeed?: number;
    /** Ant sensor angle offset in radians (default: 0.4) */
    sensorAngle?: number;
    /** Pheromone sensor lookahead in px (default: 6) */
    sensorDistance?: number;
    /** Max turn per frame in radians (default: 0.3) */
    turnSpeed?: number;
    /** Ant dot color (default: "#ffffff") */
    antColor?: string;
    /** Pheromone trail color (default: "#6b7280") */
    pheromoneColor?: string;
    /** Food source color (default: "#4ade80") */
    foodColor?: string;
    /** Nest color (default: "#f59e0b") */
    nestColor?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Pheromone grid resolution (default: 0.5) */
    resolution?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Click to place food (default: true) */
    interactive?: boolean;
    /** Max simultaneous food sources (default: 5) */
    maxFood?: number;
    preset?: AntColonyPreset | string;
}
export declare const AntColony: import("react").ForwardRefExoticComponent<AntColonyProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
