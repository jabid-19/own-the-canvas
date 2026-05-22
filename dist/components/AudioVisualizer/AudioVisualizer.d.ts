import { BaseCanvasProps } from "../../types";
import { VisualizerMode } from "./useAudioVisualizer";
type AudioVisualizerPreset = "default" | "neon" | "minimal" | "fire" | "ocean";
export interface AudioVisualizerProps extends BaseCanvasProps {
    /** MediaStream from getUserMedia (default: null — shows idle animation) */
    audioSource?: MediaStream | null;
    /** Number of frequency bars (default: 64) */
    barCount?: number;
    /** Bar fill color (default: "#00cfff") */
    barColor?: string;
    /** Wave stroke color (default: "#00cfff") */
    waveColor?: string;
    /** Visualization mode (default: "bars") */
    mode?: VisualizerMode;
    /** Amplitude sensitivity multiplier (default: 1) */
    sensitivity?: number;
    /** Gap between bars in px (default: 2) */
    gapBetweenBars?: number;
    /** Rounded bar caps (default: true) */
    rounded?: boolean;
    /** Color gradient on bars/wave (default: true) */
    gradient?: boolean;
    /** Gradient top/end color (default: "#ffffff") */
    gradientEndColor?: string;
    /** Canvas background color (default: "transparent") */
    backgroundColor?: string;
    /** Enable glow effect (default: true) */
    glowEffect?: boolean;
    /** Glow color — defaults to barColor */
    glowColor?: string;
    /** Glow blur radius in px (default: 12) */
    glowBlur?: number;
    /** Web Audio FFT size — must be power of 2 (default: 2048) */
    fftSize?: number;
    /** Analyser smoothing time constant 0–1 (default: 0.8) */
    smoothingTimeConstant?: number;
    /** Circular mode inner radius as fraction of min(w,h) (default: 0.25) */
    circularRadiusRatio?: number;
    /** Idle animation wave amplitude in px (default: 5) */
    idleAmplitude?: number;
    /** Idle animation speed multiplier (default: 1) */
    idleAnimationSpeed?: number;
    /** Named preset: "default" | "neon" | "minimal" | "fire" | "ocean" */
    preset?: AudioVisualizerPreset | string;
}
export declare const AudioVisualizer: import("react").ForwardRefExoticComponent<AudioVisualizerProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
