import { BaseCanvasProps } from '../../types';

type ShockwavePreset = "default" | "neon" | "explosion" | "ripple" | "minimal";
interface ShockwavePresetValues {
    color?: string;
    secondaryColor?: string;
    ringCount?: number;
    ringSpacing?: number;
    speed?: number;
    maxRadius?: number;
    lineWidth?: number;
    fadeSpeed?: number;
    glowEffect?: boolean;
    glowBlur?: number;
    backgroundColor?: string;
}
export declare const PRESETS: Record<ShockwavePreset, ShockwavePresetValues>;
export interface ShockwaveProps extends BaseCanvasProps {
    /** Primary ring color (default: "#7C3AED") */
    color?: string;
    /** Alternating ring color (default: "#0891B2") */
    secondaryColor?: string;
    /** Number of rings per shockwave (default: 3) */
    ringCount?: number;
    /** Pixel gap between rings at spawn (default: 20) */
    ringSpacing?: number;
    /** Expansion speed px/frame (default: 4) */
    speed?: number;
    /** Max radius before ring fades (default: 200) */
    maxRadius?: number;
    /** Stroke line width (default: 2) */
    lineWidth?: number;
    /** Opacity decrease per frame (default: 0.02) */
    fadeSpeed?: number;
    /** Auto-fire shockwaves without clicks (default: true) */
    autoFire?: boolean;
    /** Interval between auto-fires in ms (default: 2000) */
    autoInterval?: number;
    /** Glow effect on rings (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 15) */
    glowBlur?: number;
    /** Canvas background (default: "transparent") */
    backgroundColor?: string;
    /** Named preset */
    preset?: ShockwavePreset | string;
}
export declare const Shockwave: import('react').ForwardRefExoticComponent<ShockwaveProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
