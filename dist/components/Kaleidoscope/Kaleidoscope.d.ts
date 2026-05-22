import { BaseCanvasProps } from "../../types";
type KaleidoscopePreset = "default" | "neon" | "crystal" | "void" | "fire" | "ice";
export interface KaleidoscopeProps extends BaseCanvasProps {
    /** Number of mirror segments / symmetry (default: 6) */
    segments?: number;
    /** Animation speed (default: 1) */
    speed?: number;
    /** Color at noise peak (default: "#ffffff") */
    colorA?: string;
    /** Color at noise trough (default: "#333333") */
    colorB?: string;
    /** Background color outside the pattern radius (default: "#111111") */
    backgroundColor?: string;
    /** Noise spatial frequency (default: 3) */
    noiseScale?: number;
    /** Radial zoom/pulse animation speed (default: 0.3) */
    zoomSpeed?: number;
    /** Whole-pattern rotation speed in degrees per frame (default: 0.2) */
    rotation?: number;
    /** Render resolution fraction — lower is faster (default: 0.5) */
    resolution?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Named preset */
    preset?: KaleidoscopePreset | string;
}
export declare const Kaleidoscope: import("react").ForwardRefExoticComponent<KaleidoscopeProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
