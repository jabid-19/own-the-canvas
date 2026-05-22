import { BaseCanvasProps } from "../../types";
import { DLASeedMode } from "./useDiffusionAggregation";
type DiffusionAggregationPreset = "default" | "coral" | "snowflake" | "lightning" | "neon" | "frost";
interface DiffusionAggregationPresetValues {
    particleColor?: string;
    walkerColor?: string;
    backgroundColor?: string;
    seedMode?: DLASeedMode;
    particleSize?: number;
    glowEffect?: boolean;
    glowBlur?: number;
}
export declare const PRESETS: Record<DiffusionAggregationPreset, DiffusionAggregationPresetValues>;
export interface DiffusionAggregationProps extends BaseCanvasProps {
    /** Aggregated cluster color (default: "#ffffff") */
    particleColor?: string;
    /** Active walker color (default: "#6b7280") */
    walkerColor?: string;
    /** Canvas background color (default: "#111111") */
    backgroundColor?: string;
    /** Particle/cell size in pixels (default: 3) */
    particleSize?: number;
    /** Number of simultaneous random walkers (default: 60) */
    walkerCount?: number;
    /** Walker steps computed per animation frame (default: 20) */
    stepsPerFrame?: number;
    /** Where the initial seed is placed (default: "center") */
    seedMode?: DLASeedMode;
    /** Render active walkers (default: false) */
    showWalkers?: boolean;
    /** Glow effect on cluster particles (default: true) */
    glowEffect?: boolean;
    /** Shadow blur radius for glow (default: 8) */
    glowBlur?: number;
    /** Click to add extra seed points (default: true) */
    interactive?: boolean;
    /** Named preset */
    preset?: DiffusionAggregationPreset | string;
}
export declare const DiffusionAggregation: import("react").ForwardRefExoticComponent<DiffusionAggregationProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
