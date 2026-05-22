import { BaseCanvasProps } from "../../types";
type BubbleUniversePreset = "default" | "soap" | "neon" | "deep" | "minimal";
export interface BubbleUniverseProps extends BaseCanvasProps {
    /** Number of simultaneous bubbles (default: 15) */
    bubbleCount?: number;
    /** Minimum bubble radius in px (default: 20) */
    minRadius?: number;
    /** Maximum bubble radius in px (default: 50) */
    maxRadius?: number;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Specular highlight color (default: "#ffffff") */
    shimmerColor?: string;
    /** Click to pop bubbles with particle burst (default: true) */
    popEffect?: boolean;
    /** Downward gravity force (default: 0.02) */
    gravity?: number;
    /** Velocity friction per frame (default: 0.995) */
    friction?: number;
    /** Hover pushes bubbles; click to pop (default: true) */
    interactive?: boolean;
    /** Bubbles merge when overlapping significantly (default: true) */
    mergeOnCollide?: boolean;
    /** Iridescent glow on bubbles (default: true) */
    glowEffect?: boolean;
    /** Named preset */
    preset?: BubbleUniversePreset | string;
}
export declare const BubbleUniverse: import("react").ForwardRefExoticComponent<BubbleUniverseProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
