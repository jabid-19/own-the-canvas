import { BaseCanvasProps } from "../../types";
type WatercolorBloomPreset = "default" | "sunset" | "ocean" | "spring" | "monochrome" | "neon";
export interface WatercolorBloomProps extends BaseCanvasProps {
    /** Bloom color palette (default: ["#ffffff","#6b7280","#9ca3af"]) */
    colors?: string[];
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Max bloom radius in px (default: 80) */
    bloomRadius?: number;
    /** Bloom expansion speed 0–2 (default: 0.5) */
    bloomSpeed?: number;
    /** Per-layer opacity 0–1 (default: 0.15) */
    opacity?: number;
    /** Wet-edge darkening strength 0–1 (default: 0.4) */
    wetEdge?: number;
    /** Concentric layers per bloom (default: 6) */
    layerCount?: number;
    /** Edge noise/organic distortion 0–1 (default: 0.5) */
    noiseAmount?: number;
    /** Bloom fade rate per frame (default: 0.001) */
    fadeSpeed?: number;
    /** Click to spawn blooms (default: true) */
    interactive?: boolean;
    /** Auto-spawn blooms at intervals (default: true) */
    autoBloom?: boolean;
    /** Ms between auto blooms (default: 1500) */
    autoBloomInterval?: number;
    /** Render resolution fraction (default: 0.5) */
    resolution?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Max concurrent blooms (default: 12) */
    maxBlooms?: number;
    preset?: WatercolorBloomPreset | string;
}
export declare const WatercolorBloom: import("react").ForwardRefExoticComponent<WatercolorBloomProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
