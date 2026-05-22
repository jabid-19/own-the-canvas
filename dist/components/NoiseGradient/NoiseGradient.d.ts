import { BaseCanvasProps } from "../../types";
type NoiseGradientPreset = "default" | "aurora" | "sunset" | "ocean" | "forest" | "neon";
export interface NoiseGradientProps extends BaseCanvasProps {
    /** 2–5 hex color stops for the gradient (default: monochrome) */
    colors?: string[];
    /** Animation speed multiplier (default: 0.3) */
    speed?: number;
    /** Noise zoom scale — higher = more zoomed in (default: 1) */
    scale?: number;
    /** Fractal octaves 1–6 — more = more detail (default: 3) */
    octaves?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Canvas composite blend mode (default: "source-over") */
    blendMode?: GlobalCompositeOperation | string;
    /** Y-axis time offset ratio — changes animation direction (default: 0.5) */
    timeOffsetY?: number;
    /** Octave amplitude persistence 0–1 (default: 0.5) */
    persistence?: number;
    /** Render resolution relative to canvas 0.05–1 — lower = faster, smooth upscale applied (default: 0.25) */
    resolution?: number;
    /** Named preset: "default" | "aurora" | "sunset" | "ocean" | "forest" | "neon" */
    preset?: NoiseGradientPreset | string;
}
export declare const NoiseGradient: import("react").ForwardRefExoticComponent<NoiseGradientProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
