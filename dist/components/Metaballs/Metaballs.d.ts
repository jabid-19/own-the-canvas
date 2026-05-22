import { BaseCanvasProps } from "../../types";
type MetaballsPreset = "default" | "plasma" | "lava" | "ocean" | "neon" | "ghost";
export interface MetaballsProps extends BaseCanvasProps {
    /** Number of initial metaballs (default: 5) */
    blobCount?: number;
    /** Blob fill color (default: "#ffffff") */
    color?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Field threshold for inside/outside (default: 1) */
    threshold?: number;
    /** Blob wander speed (default: 1) */
    speed?: number;
    /** Min blob radius in px (default: 40) */
    minRadius?: number;
    /** Max blob radius in px (default: 80) */
    maxRadius?: number;
    /** Glow effect (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 20) */
    glowBlur?: number;
    /** Render resolution fraction (default: 0.4) */
    resolution?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Drag to move; click to add (default: true) */
    interactive?: boolean;
    preset?: MetaballsPreset | string;
}
export declare const Metaballs: import("react").ForwardRefExoticComponent<MetaballsProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
