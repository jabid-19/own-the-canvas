import { BaseCanvasProps } from "../../types";
import { LissajousColorMode } from "./useLissajous";
type LissajousPreset = "default" | "butterfly" | "star" | "web" | "neon" | "crystal";
export interface LissajousProps extends BaseCanvasProps {
    /** Horizontal frequency a (default: 3) */
    freqX?: number;
    /** Vertical frequency b (default: 2) */
    freqY?: number;
    /** Initial phase delta δ in degrees (default: 0) */
    phaseShift?: number;
    /** Phase advance per frame in degrees (default: 0.5) */
    phaseSpeed?: number;
    /** Curve amplitude as fraction of canvas half-size (default: 0.9) */
    amplitude?: number;
    /** Curve stroke color (default: "#ffffff") */
    color?: string;
    /** Background fill color (default: "#111111") */
    backgroundColor?: string;
    /** Stroke line width (default: 1.5) */
    lineWidth?: number;
    /** Background fade opacity per frame (default: 0.04) */
    trailFade?: number;
    /** Enable glow shadow on stroke (default: false) */
    glowEffect?: boolean;
    /** Shadow blur radius when glowEffect is enabled (default: 12) */
    glowBlur?: number;
    /** "solid" | "cycle" — hue cycles with phase (default: "solid") */
    colorMode?: LissajousColorMode;
    /** Parametric curve sample count (default: 600) */
    curvePoints?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Animation speed multiplier (default: 1) */
    speed?: number;
    /** Named preset */
    preset?: LissajousPreset | string;
}
export declare const Lissajous: import("react").ForwardRefExoticComponent<LissajousProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
