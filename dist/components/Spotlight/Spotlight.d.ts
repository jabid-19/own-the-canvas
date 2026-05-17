import { BaseCanvasProps } from '../../types';

type SpotlightPreset = "default" | "soft" | "dramatic" | "neon" | "ellipse";
export interface SpotlightProps extends BaseCanvasProps {
    /** Spotlight radius in px (default: 120) */
    radius?: number;
    /** Spotlight light color — currently unused visually but reserved for future tinting */
    color?: string;
    /** Overlay fill color (default: "#000000") */
    overlayColor?: string;
    /** Overlay opacity 0–1 (default: 0.75) */
    overlayOpacity?: number;
    /** Edge softness 0–1: 0=hard edge, 1=very soft (default: 0.4) */
    edgeSoftness?: number;
    /** Mouse follow lerp speed 0–1 (default: 0.1) */
    followSpeed?: number;
    /** Glow ring color (default: "#7C3AED") */
    glowColor?: string;
    /** Glow ring size in px (default: 30) */
    glowSize?: number;
    /** Show glow ring (default: true) */
    showGlow?: boolean;
    /** Shape of spotlight (default: "circle") */
    shape?: "circle" | "ellipse";
    /** Y/X ratio when shape is "ellipse" (default: 0.6) */
    ellipseRatio?: number;
    /** React to mouse movement (default: true) */
    interactive?: boolean;
    /** Default X position as fraction of width (default: 0.5) */
    defaultX?: number;
    /** Default Y position as fraction of height (default: 0.5) */
    defaultY?: number;
    /** Named preset */
    preset?: SpotlightPreset | string;
}
export declare const Spotlight: import('react').ForwardRefExoticComponent<SpotlightProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
