import { BaseCanvasProps } from "../../types";
import { SandMaterial } from "./useSandSimulation";
type SandSimulationPreset = "default" | "desert" | "ocean" | "inferno" | "neon";
export interface SandSimulationProps extends BaseCanvasProps {
    /** Cell size in pixels (default: 4) */
    cellSize?: number;
    /** Paint brush radius in cells (default: 3) */
    brushSize?: number;
    /** Active material to paint (default: "sand") */
    material?: SandMaterial;
    /** Sand cell color (default: "#ffffff") */
    sandColor?: string;
    /** Water cell color (default: "#6b7280") */
    waterColor?: string;
    /** Fire cell color (default: "#ffffff") */
    fireColor?: string;
    /** Wall cell color (default: "#4b5563") */
    wallColor?: string;
    /** Empty cell / background color (default: "#111111") */
    backgroundColor?: string;
    /** Enable mouse painting (default: true) */
    interactive?: boolean;
    /** Gravity strength multiplier (default: 1) */
    gravity?: number;
    /** Named preset */
    preset?: SandSimulationPreset | string;
}
export declare const SandSimulation: import("react").ForwardRefExoticComponent<SandSimulationProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
