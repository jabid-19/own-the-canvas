import { BaseCanvasProps } from "../../types";
type DeepSeaBioluminescencePreset = "default" | "abyssal" | "coral" | "aurora" | "crimson";
interface DeepSeaBioluminescencePresetValues {
    jellyfishColor?: string;
    glowColor?: string;
    waterColor?: string;
}
export declare const PRESETS: Record<DeepSeaBioluminescencePreset, DeepSeaBioluminescencePresetValues>;
export interface DeepSeaBioluminescenceProps extends BaseCanvasProps {
    /** Number of jellyfish (default: 5) */
    jellyfishCount?: number;
    /** Number of plankton particles (default: 200) */
    planktonCount?: number;
    /** Jellyfish bell color (default: "#88ccff") */
    jellyfishColor?: string;
    /** Bioluminescent glow color (default: "#00ffcc") */
    glowColor?: string;
    /** Background water color (default: "#020c14") */
    waterColor?: string;
    /** Cursor movement spawns bioluminescent ripples (default: true) */
    interactive?: boolean;
    /** Overall animation speed multiplier (default: 1) */
    speed?: number;
    /** Named preset */
    preset?: DeepSeaBioluminescencePreset | string;
}
export declare const DeepSeaBioluminescence: import("react").ForwardRefExoticComponent<DeepSeaBioluminescenceProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
