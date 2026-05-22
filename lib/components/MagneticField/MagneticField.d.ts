import { BaseCanvasProps } from '../../types';

type MagneticFieldPreset = "default" | "neon" | "warm" | "mono" | "electric" | "minimal";
export interface MagneticFieldProps extends BaseCanvasProps {
    /** Field lines seeded per positive pole (default: 16) */
    fieldLineCount?: number;
    /** Euler integration step in px (default: 4) */
    stepSize?: number;
    /** Max steps per field line (default: 400) */
    maxSteps?: number;
    /** N-pole color (default: "#ef4444") */
    positiveColor?: string;
    /** S-pole color (default: "#3b82f6") */
    negativeColor?: string;
    /** Field line stroke color (default: "#6b7280") */
    lineColor?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Field line stroke width (default: 1) */
    lineWidth?: number;
    /** Field line alpha (default: 0.6) */
    lineOpacity?: number;
    /** Magnet circle radius in px (default: 12) */
    poleRadius?: number;
    /** Glow on poles (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 20) */
    glowBlur?: number;
    /** Redraw every frame vs only on change (default: false) */
    animated?: boolean;
    /** Drag poles; click to add; right-click to remove (default: true) */
    interactive?: boolean;
    /** Max total poles (default: 6) */
    maxPoles?: number;
    preset?: MagneticFieldPreset | string;
}
export declare const MagneticField: import('react').ForwardRefExoticComponent<MagneticFieldProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
