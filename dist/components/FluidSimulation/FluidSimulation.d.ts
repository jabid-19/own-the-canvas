import { BaseCanvasProps } from "../../types";
type FluidPreset = "default" | "ink" | "neon" | "lava" | "ocean" | "smoke";
interface FluidPresetValues {
    resolution?: number;
    viscosity?: number;
    diffusion?: number;
    dissipation?: number;
    inkColors?: string[];
    glowEffect?: boolean;
    glowBlur?: number;
    backgroundColor?: string;
    autoInk?: boolean;
    autoInkInterval?: number;
    mouseForce?: number;
    inkRadius?: number;
}
export declare const PRESETS: Record<FluidPreset, FluidPresetValues>;
export interface FluidSimulationProps extends BaseCanvasProps {
    /** Grid resolution (32–128) — lower is faster (default: 80) */
    resolution?: number;
    /** Fluid viscosity — resistance to flow (default: 0.0001) */
    viscosity?: number;
    /** Ink diffusion rate (default: 0.0001) */
    diffusion?: number;
    /** Density fade per frame 0–1 (default: 0.995) */
    dissipation?: number;
    /** Ink colors painted by mouse and auto-ink (default: multi-color) */
    inkColors?: string[];
    /** Glow on ink (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 0 — handled by blending) */
    glowBlur?: number;
    /** Canvas background color (default: "#050010") */
    backgroundColor?: string;
    /** Auto-inject ink bursts without mouse (default: true) */
    autoInk?: boolean;
    /** Interval between auto-ink bursts in ms (default: 1500) */
    autoInkInterval?: number;
    /** Mouse velocity → velocity force multiplier (default: 5) */
    mouseForce?: number;
    /** Ink splat radius in grid cells (default: 4) */
    inkRadius?: number;
    /** Named preset */
    preset?: FluidPreset | string;
}
export declare const FluidSimulation: import("react").ForwardRefExoticComponent<FluidSimulationProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
