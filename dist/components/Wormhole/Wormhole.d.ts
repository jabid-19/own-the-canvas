import { BaseCanvasProps } from "../../types";
type WormholePreset = "default" | "hyperspace" | "neon" | "vortex" | "minimal";
export interface WormholeProps extends BaseCanvasProps {
    /** Number of tunnel rings. (default: 30) */
    ringCount?: number;
    /** Forward travel speed. (default: 1) */
    speed?: number;
    /** Ring stroke colors — cycles through array. (default: ["#7C3AED","#0891B2"]) */
    colors?: string[];
    /** Canvas background color. (default: "#000000") */
    backgroundColor?: string;
    /** Rotation twist per unit depth. (default: 0.3) */
    twist?: number;
    /** Perspective field of view. (default: 300) */
    fov?: number;
    /** Perspective depth scale. (default: 400) */
    depth?: number;
    /** Ring stroke width. (default: 1.5) */
    lineWidth?: number;
    /** Ring opacity 0–1. (default: 0.8) */
    opacity?: number;
    /** Number of tunnel wall stars. (default: 100) */
    starCount?: number;
    /** Star dot color. (default: "#ffffff") */
    starColor?: string;
    /** Mouse X controls tunnel speed. (default: true) */
    interactive?: boolean;
    /** Named preset. */
    preset?: WormholePreset | string;
}
export declare const Wormhole: import("react").ForwardRefExoticComponent<WormholeProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
