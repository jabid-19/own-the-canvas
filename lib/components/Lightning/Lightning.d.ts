import { BaseCanvasProps } from '../../types';

type LightningPreset = "default" | "neon" | "storm" | "plasma" | "subtle";
interface LightningPresetValues {
    segments?: number;
    roughness?: number;
    branchChance?: number;
    branchDecay?: number;
    flickerCount?: number;
    glowBlur?: number;
    color?: string;
    coreColor?: string;
    backgroundColor?: string;
    autoInterval?: number;
    interactive?: boolean;
    startX?: number;
    startY?: number;
    endY?: number;
}
export declare const PRESETS: Record<LightningPreset, LightningPresetValues>;
export interface LightningProps extends BaseCanvasProps {
    /** Recursion depth for bolt segments. (default: 8) */
    segments?: number;
    /** Midpoint displacement roughness 0–1. (default: 0.5) */
    roughness?: number;
    /** Probability of spawning a branch at each segment. (default: 0.3) */
    branchChance?: number;
    /** Energy multiplier for sub-branches. (default: 0.6) */
    branchDecay?: number;
    /** Number of rapid flicker strikes per event. (default: 3) */
    flickerCount?: number;
    /** Glow shadow blur radius. (default: 20) */
    glowBlur?: number;
    /** Bolt glow color. (default: "#7C3AED") */
    color?: string;
    /** Inner core color. (default: "#ffffff") */
    coreColor?: string;
    /** Canvas background color. (default: "#050010") */
    backgroundColor?: string;
    /** Ms between auto strikes. (default: 2000) */
    autoInterval?: number;
    /** Click to trigger strike at cursor. (default: true) */
    interactive?: boolean;
    /** Strike origin X as fraction of width. (default: 0.5) */
    startX?: number;
    /** Strike origin Y as fraction of height. (default: 0) */
    startY?: number;
    /** Strike end Y as fraction of height. (default: 1) */
    endY?: number;
    /** Named preset. */
    preset?: LightningPreset | string;
}
export declare const Lightning: import('react').ForwardRefExoticComponent<LightningProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
