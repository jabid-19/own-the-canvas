import { BaseCanvasProps } from '../../types';

type SpiderWebPreset = "default" | "night" | "forest" | "neon" | "frost";
interface SpiderWebPresetValues {
    webColor?: string;
    backgroundColor?: string;
    spiderColor?: string;
    glowColor?: string;
}
export declare const PRESETS: Record<SpiderWebPreset, SpiderWebPresetValues>;
export interface SpiderWebProps extends BaseCanvasProps {
    /** Number of radial spokes (default: 12) */
    spokeCount?: number;
    /** Number of concentric rings (default: 10) */
    ringCount?: number;
    /** Strand color (default: "#d8d8d8") */
    webColor?: string;
    /** Canvas background color (default: "#0a0a0a") */
    backgroundColor?: string;
    /** Spider body color (default: "#c0c0c0") */
    spiderColor?: string;
    /** Show dew drop glow points (default: true) */
    dewDrops?: boolean;
    /** Dew drop glow color (default: "#e0e0e0") */
    glowColor?: string;
    /** Ambient sway speed multiplier (default: 1) */
    swaySpeed?: number;
    /** Cursor disturbance radius in px (default: 80) */
    disturbRadius?: number;
    /** Enable cursor disturbance (default: true) */
    interactive?: boolean;
    /** Show spider (default: true) */
    showSpider?: boolean;
    /** Named preset */
    preset?: SpiderWebPreset | string;
}
export declare const SpiderWeb: import('react').ForwardRefExoticComponent<SpiderWebProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
