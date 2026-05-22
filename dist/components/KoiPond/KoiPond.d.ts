import { BaseCanvasProps } from "../../types";
type KoiPondPreset = "default" | "koi" | "night" | "lotus" | "neon";
export interface KoiPondProps extends BaseCanvasProps {
    /** Number of koi fish (default: 6) */
    fishCount?: number;
    /** Primary fish body color (default: "#ffffff") */
    fishColor?: string;
    /** Scale accent color (default: "#6b7280") */
    scaleColor?: string;
    /** Water background color (default: "#111111") */
    waterColor?: string;
    /** Ripple ring color (default: "#6b7280") */
    rippleColor?: string;
    /** Lily pad color (default: "#ffffff") */
    lilyColor?: string;
    /** Fish movement speed multiplier (default: 1) */
    speed?: number;
    /** Cursor causes ripples (default: true) */
    interactive?: boolean;
    /** Show lily pads (default: true) */
    showLilies?: boolean;
    /** Animated caustic light patterns (default: true) */
    caustics?: boolean;
    /** Named preset */
    preset?: KoiPondPreset | string;
}
export declare const KoiPond: import("react").ForwardRefExoticComponent<KoiPondProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
