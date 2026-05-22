import { BaseCanvasProps } from "../../types";
import { CrystalGrowthColorMode } from "./useCrystalGrowth";
type CrystalGrowthPreset = "default" | "snowflake" | "gem" | "neon" | "frost" | "gold";
export interface CrystalGrowthProps extends BaseCanvasProps {
    /** Color of crystallized cells (default: "#ffffff") */
    crystalColor?: string;
    /** Color of actively growing frontier (default: "#6b7280") */
    activeColor?: string;
    /** Background color (default: "#111111") */
    backgroundColor?: string;
    /** Cells crystallized per frame (default: 3) */
    growthSpeed?: number;
    /** Rotational symmetry arms 2–12 (default: 6) */
    symmetry?: number;
    /** Probability a frontier cell spawns a branch (default: 0.3) */
    branchProbability?: number;
    /** Random noise in growth direction 0–1 (default: 0.2) */
    noiseAmount?: number;
    /** Cell size in px (default: 3) */
    cellSize?: number;
    /** Glow on crystal (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 12) */
    glowBlur?: number;
    /** Click to seed new growth (default: true) */
    interactive?: boolean;
    /** Restart after growth completes (default: true) */
    autoReset?: boolean;
    /** Color mode: "solid" | "age" | "cycle" (default: "solid") */
    colorMode?: CrystalGrowthColorMode;
    /** Enable animation (default: true) */
    animated?: boolean;
    preset?: CrystalGrowthPreset | string;
}
export declare const CrystalGrowth: import("react").ForwardRefExoticComponent<CrystalGrowthProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
