import { BaseCanvasProps } from '../../types';

type GlitchPreset = "default" | "crt" | "cyberpunk" | "subtle" | "corrupt";
interface GlitchPresetValues {
    intensity?: number;
    speed?: number;
    rgbShift?: number;
    scanlines?: boolean;
    scanlineOpacity?: number;
    scanlineSpacing?: number;
    blockGlitch?: boolean;
    blockCount?: number;
    noiseOpacity?: number;
    flickerRate?: number;
    color?: string;
    rgbShiftColor?: string;
    backgroundColor?: string;
}
export declare const PRESETS: Record<GlitchPreset, GlitchPresetValues>;
export interface GlitchOverlayProps extends BaseCanvasProps {
    /** Glitch probability 0–1 (default: 0.6) */
    intensity?: number;
    /** Animation speed multiplier (default: 1) */
    speed?: number;
    /** RGB color shift amount in px (default: 8) */
    rgbShift?: number;
    /** Show CRT scanlines (default: true) */
    scanlines?: boolean;
    /** Scanline opacity (default: 0.08) */
    scanlineOpacity?: number;
    /** Px between scanlines (default: 2) */
    scanlineSpacing?: number;
    /** Enable block-slice glitch (default: true) */
    blockGlitch?: boolean;
    /** Number of glitch blocks (default: 4) */
    blockCount?: number;
    /** Film noise opacity (default: 0.02) */
    noiseOpacity?: number;
    /** Screen flicker rate 0–1 (default: 0.02) */
    flickerRate?: number;
    /** Glitch bar color (default: "#ffffff") */
    color?: string;
    /** RGB channel split color — complement is used for the opposing channel (default: "#ff0000") */
    rgbShiftColor?: string;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Canvas background (default: "transparent") */
    backgroundColor?: string;
    /** Named preset */
    preset?: GlitchPreset | string;
}
export declare const GlitchOverlay: import('react').ForwardRefExoticComponent<GlitchOverlayProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
