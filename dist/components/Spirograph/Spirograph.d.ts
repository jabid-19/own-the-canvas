import { BaseCanvasProps } from '../../types';
import { SpirographColorMode } from './useSpirograph';

type SpirographPreset = "default" | "neon" | "prismatic" | "mandala" | "cosmic" | "minimal";
export interface SpirographProps extends BaseCanvasProps {
    /** Outer circle R as fraction of min(w,h)/2 (default: 0.85) */
    outerRadius?: number;
    /** Inner circle r as fraction of outerRadius (default: 0.4) */
    innerRadius?: number;
    /** Pen arm d as fraction of innerRadius (default: 0.9) */
    penDistance?: number;
    /** Degrees drawn per frame (default: 2) */
    speed?: number;
    /** Primary curve color (default: "#ffffff") */
    color?: string;
    /** Secondary color for gradient colorMode (default: "#6b7280") */
    color2?: string;
    /** Background fill color (default: "#111111") */
    backgroundColor?: string;
    /** Stroke line width (default: 1) */
    lineWidth?: number;
    /** Background fade opacity per frame — lower = longer trails (default: 0.003) */
    trailFade?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Randomize and restart after each full cycle (default: true) */
    autoReset?: boolean;
    /** Number of overlapping curve layers with slight radius offsets (default: 1) */
    layerCount?: number;
    /** Color mode: "solid" | "cycle" | "gradient" (default: "solid") */
    colorMode?: SpirographColorMode;
    /** Rotational symmetry — draw N copies around center (default: 1) */
    symmetry?: number;
    /** Enable glow/shadow effect (default: false) */
    glowEffect?: boolean;
    /** Shadow blur radius for glow (default: 10) */
    glowBlur?: number;
    /** Named preset */
    preset?: SpirographPreset | string;
}
export declare const Spirograph: import('react').ForwardRefExoticComponent<SpirographProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
