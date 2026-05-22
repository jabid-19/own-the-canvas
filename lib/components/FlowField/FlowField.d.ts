import { BaseCanvasProps } from '../../types';

type FlowFieldPreset = "default" | "neon" | "ocean" | "lava" | "forest" | "monochrome";
export interface FlowFieldProps extends BaseCanvasProps {
    /** Number of flow particles (default: 800) */
    particleCount?: number;
    /** Particle stroke colors — one is picked per particle (default: multi-color) */
    colors?: string[];
    /** Flow speed multiplier (default: 1) */
    speed?: number;
    /** Noise sampling scale — lower = larger flow structures (default: 0.004) */
    noiseScale?: number;
    /** Particle trail fade length — lower = longer trails (default: 0.04) */
    trailLength?: number;
    /** Background fade opacity per frame (default: 0.04) */
    fadeStrength?: number;
    /** Stroke line width (default: 1) */
    lineWidth?: number;
    /** Canvas background color (default: "#050010") */
    backgroundColor?: string;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** How fast the noise field evolves (default: 1) */
    timeSpeed?: number;
    /** Add curl noise component for more swirling flow (default: false) */
    curl?: boolean;
    /** Named preset: "default" | "neon" | "ocean" | "lava" | "forest" | "monochrome" */
    preset?: FlowFieldPreset | string;
}
export declare const FlowField: import('react').ForwardRefExoticComponent<FlowFieldProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
