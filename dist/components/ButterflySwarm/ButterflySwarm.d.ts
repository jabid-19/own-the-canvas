import { BaseCanvasProps } from "../../types";
type ButterflySwarmPreset = "default" | "monarch" | "morpho" | "meadow" | "night";
interface ButterflySwarmPresetValues {
    wingColor?: string;
    patternColor?: string;
    backgroundColor?: string;
}
export declare const PRESETS: Record<ButterflySwarmPreset, ButterflySwarmPresetValues>;
export interface ButterflySwarmProps extends BaseCanvasProps {
    /** Number of butterflies (default: 12) */
    butterflyCount?: number;
    /** Primary wing color (default: "#f97316") */
    wingColor?: string;
    /** Wing pattern and body color (default: "#111111") */
    patternColor?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Wing flap speed multiplier (default: 1) */
    flapSpeed?: number;
    /** Movement speed multiplier (default: 1) */
    speed?: number;
    /** Cursor attraction/scatter radius in px (default: 120) */
    attractRadius?: number;
    /** Enable cursor interaction (default: true) */
    interactive?: boolean;
    /** Show faint motion trails (default: false) */
    showTrails?: boolean;
    /** Named preset */
    preset?: ButterflySwarmPreset | string;
}
export declare const ButterflySwarm: import("react").ForwardRefExoticComponent<ButterflySwarmProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
