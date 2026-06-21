import { BaseCanvasProps } from '../../types';

type MandalaPreset = "default" | "neon" | "lotus" | "cosmic" | "minimal";
interface MandalaPresetValues {
    symmetry?: number;
    colors?: string[];
    lineWidth?: number;
    speed?: number;
    layers?: number;
    glowEffect?: boolean;
    glowBlur?: number;
    strokeOpacity?: number;
    mirror?: boolean;
    noiseAmount?: number;
    backgroundColor?: string;
}
export declare const PRESETS: Record<MandalaPreset, MandalaPresetValues>;
export interface MandalaProps extends BaseCanvasProps {
    /** Number of rotational symmetry arms (default: 8) */
    symmetry?: number;
    /** Stroke colors cycled per layer (default: multi-color) */
    colors?: string[];
    /** Stroke line width (default: 1.5) */
    lineWidth?: number;
    /** Rotation animation speed (default: 1) */
    speed?: number;
    /** Number of concentric petal layers (default: 5) */
    layers?: number;
    /** Outer radius as fraction of canvas min dimension (default: 1) */
    radius?: number;
    /** Canvas background color (default: "#050010") */
    backgroundColor?: string;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Glow effect (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 10) */
    glowBlur?: number;
    /** Layer stroke opacity 0–1 (default: 0.8) */
    strokeOpacity?: number;
    /** Mirror each arm for bilateral symmetry (default: true) */
    mirror?: boolean;
    /** Organic noise distortion 0–1 (default: 0.3) */
    noiseAmount?: number;
    /** Named preset */
    preset?: MandalaPreset | string;
}
export declare const Mandala: import('react').ForwardRefExoticComponent<MandalaProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
