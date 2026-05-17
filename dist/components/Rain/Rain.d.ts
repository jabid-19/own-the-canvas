import { BaseCanvasProps } from '../../types';

type RainPreset = "default" | "storm" | "drizzle" | "neon" | "golden";
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
    /** Drop color. (default: "#7C3AED") */
    dropColor?: string;
    /** Splash particle color. (default: "#0891B2") */
    splashColor?: string;
    /** Show splash particles when drops hit bottom. (default: true) */
    showSplashes?: boolean;
    /** Canvas background color. (default: "#111111") */
    backgroundColor?: string;
    /** Named preset. */
    preset?: RainPreset | string;
}
export declare const Rain: import('react').ForwardRefExoticComponent<RainProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
