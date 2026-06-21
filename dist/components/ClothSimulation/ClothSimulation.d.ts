import { BaseCanvasProps } from "../../types";
type ClothPreset = "default" | "silk" | "net" | "heavy" | "spider";
interface ClothPresetValues {
    cols?: number;
    rows?: number;
    spacing?: number;
    gravity?: number;
    friction?: number;
    stiffness?: number;
    iterations?: number;
    lineColor?: string;
    pinColor?: string;
    lineWidth?: number;
    backgroundColor?: string;
    wind?: number;
    windSpeed?: number;
    tearable?: boolean;
    tearDistance?: number;
}
export declare const PRESETS: Record<ClothPreset, ClothPresetValues>;
export interface ClothSimulationProps extends BaseCanvasProps {
    /** Grid columns (default: 25) */
    cols?: number;
    /** Grid rows (default: 20) */
    rows?: number;
    /** Point spacing in px (default: 18) */
    spacing?: number;
    /** Gravity per frame (default: 0.4) */
    gravity?: number;
    /** Velocity friction 0–1 (default: 0.99) */
    friction?: number;
    /** Constraint stiffness 0–1 (default: 1) */
    stiffness?: number;
    /** Relaxation iterations per frame (default: 3) */
    iterations?: number;
    /** Cloth mesh color (default: "#7C3AED") */
    lineColor?: string;
    /** Pin point color (default: "#ffffff") */
    pinColor?: string;
    /** Mesh stroke width (default: 1) */
    lineWidth?: number;
    /** Canvas background (default: "#050010") */
    backgroundColor?: string;
    /** Wind oscillation amplitude (default: 0.3) */
    wind?: number;
    /** Wind oscillation frequency (default: 0.5) */
    windSpeed?: number;
    /** Enable cloth tearing on drag (default: false) */
    tearable?: boolean;
    /** Tear multiplier — ratio above rest length that tears constraint (default: 3) */
    tearDistance?: number;
    /** Enable mouse interaction (default: true) */
    interactive?: boolean;
    /** Mouse influence radius in px (default: 30) */
    mouseRadius?: number;
    /** Mouse push force (default: 5) */
    mouseForce?: number;
    /** Show pin points at top (default: true) */
    showPins?: boolean;
    /** Named preset */
    preset?: ClothPreset | string;
}
export declare const ClothSimulation: import("react").ForwardRefExoticComponent<ClothSimulationProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
