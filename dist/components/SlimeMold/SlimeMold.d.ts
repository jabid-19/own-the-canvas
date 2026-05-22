import { BaseCanvasProps } from "../../types";
type SlimeMoldPreset = "default" | "neon" | "coral" | "vein" | "frost" | "gold";
export interface SlimeMoldProps extends BaseCanvasProps {
    /** Number of physarum agents (default: 1800) */
    agentCount?: number;
    /** Degrees between left/center/right sensors (default: 45) */
    sensorAngle?: number;
    /** Grid pixels ahead sensor samples (default: 9) */
    sensorDistance?: number;
    /** Agent movement per frame in grid coords (default: 1.5) */
    stepSize?: number;
    /** Max rotation toward strongest sensor in degrees (default: 45) */
    rotateSpeed?: number;
    /** Trail evaporation multiplier per frame (default: 0.92) */
    trailDecay?: number;
    /** 3×3 blur weight for trail diffusion (default: 0.2) */
    diffuseStrength?: number;
    /** Color at max trail concentration (default: "#ffffff") */
    trailColor?: string;
    /** Color at zero trail (default: "#111111") */
    backgroundColor?: string;
    /** Trail grid resolution fraction (default: 0.35) */
    resolution?: number;
    /** Mouse deposits pheromone attracting agents (default: true) */
    interactive?: boolean;
    /** Mouse pheromone deposit radius in px (default: 20) */
    mouseRadius?: number;
    /** Pheromone deposit amount per frame (default: 3) */
    mouseStrength?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Named preset */
    preset?: SlimeMoldPreset | string;
}
export declare const SlimeMold: import("react").ForwardRefExoticComponent<SlimeMoldProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
