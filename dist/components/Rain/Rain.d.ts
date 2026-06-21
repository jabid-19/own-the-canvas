import { BaseCanvasProps } from "../../types";
type RainPreset = "default" | "storm" | "drizzle" | "neon" | "golden";
interface RainPresetValues {
    dropCount?: number;
    speed?: number;
    wind?: number;
    windSpeed?: number;
    dropLength?: number;
    dropWidth?: number;
    dropOpacity?: number;
    dropColor?: string;
    splashColor?: string;
    showSplashes?: boolean;
    backgroundColor?: string;
}
export declare const PRESETS: Record<RainPreset, RainPresetValues>;
export interface RainProps extends BaseCanvasProps {
    /** Number of rain drops. (default: 200) */
    dropCount?: number;
    /** Drop fall speed in px/frame. (default: 15) */
    speed?: number;
    /** Horizontal wind drift strength. (default: 0.3) */
    wind?: number;
    /** Wind oscillation frequency. (default: 0.5) */
    windSpeed?: number;
    /** Drop streak length in px. (default: 20) */
    dropLength?: number;
    /** Drop stroke width in px. (default: 1) */
    dropWidth?: number;
    /** Drop opacity 0–1. (default: 0.6) */
    dropOpacity?: number;
    /** Drop color. (default: "#2563eb") */
    dropColor?: string;
    /** Splash particle color. (default: "#1e40af") */
    splashColor?: string;
    /** Show splash particles when drops hit bottom. (default: true) */
    showSplashes?: boolean;
    /** Canvas background color. (default: "#ffffff") */
    backgroundColor?: string;
    /** Number of background stars (default: 0) */
    starCount?: number;
    /** Star color (default: "#ffffff") */
    starColor?: string;
    /** Enable glow on some stars (default: false) */
    glowingStars?: boolean;
    /** Glow blur radius for glowing stars (default: 8) */
    starGlowBlur?: number;
    /** Named preset. */
    preset?: RainPreset | string;
}
export declare const Rain: import("react").ForwardRefExoticComponent<RainProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
