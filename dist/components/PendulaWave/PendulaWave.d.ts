import { BaseCanvasProps } from "../../types";
import { PendulaWaveColorMode } from "./usePendulaWave";
type PendulaWavePreset = "default" | "neon" | "crystal" | "sand" | "minimal" | "cosmic";
export interface PendulaWaveProps extends BaseCanvasProps {
    /** Stroke color (default: "#ffffff") */
    color?: string;
    /** Secondary color used in gradient colorMode (default: "#6b7280") */
    color2?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Stroke line width (default: 1) */
    lineWidth?: number;
    /** Background fade per frame — lower = longer trails (default: 0.01) */
    trailFade?: number;
    /** Animation speed multiplier (default: 1) */
    speed?: number;
    /** Energy decay per step 0.999–1 (default: 0.9995) */
    damping?: number;
    /** Frequency of pendulum 1 (x-axis) (default: 2) */
    freq1?: number;
    /** Frequency of pendulum 2 (y-axis) (default: 3) */
    freq2?: number;
    /** Frequency of phase-shift pendulum (default: 0.01) */
    freq3?: number;
    /** Max swing as fraction of canvas half-size (default: 0.9) */
    amplitude?: number;
    /** Color mode: "solid" | "cycle" | "gradient" (default: "solid") */
    colorMode?: PendulaWaveColorMode;
    /** Enable glow (default: false) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 10) */
    glowBlur?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Restart after damping decays to near-zero (default: true) */
    autoReset?: boolean;
    preset?: PendulaWavePreset | string;
}
export declare const PendulaWave: import("react").ForwardRefExoticComponent<PendulaWaveProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
