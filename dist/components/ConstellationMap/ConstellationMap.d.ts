import { BaseCanvasProps } from '../../types';
import { ConstellationLineStyle } from './useConstellationMap';

type ConstellationPreset = "default" | "cosmos" | "minimal" | "aurora" | "gold";
export interface ConstellationMapProps extends BaseCanvasProps {
    /** Number of stars (default: 80) */
    starCount?: number;
    /** Star color (default: "#ffffff") */
    starColor?: string;
    /** Connection line color (default: "#8888ff") */
    lineColor?: string;
    /** Background color (default: "#050510") */
    backgroundColor?: string;
    /** Star drift speed (default: 0.3) */
    speed?: number;
    /** Enable drag-to-move stars (default: true) */
    interactive?: boolean;
    /** Line style (default: "solid") */
    lineStyle?: ConstellationLineStyle;
    /** Glow effect on stars (default: true) */
    glowStars?: boolean;
    /** Max distance for drawing lines (default: 100) */
    connectionDistance?: number;
    /** Velocity multiplier for initial star speed (default: 0.3) */
    velocityMultiplier?: number;
    /** Drag detection radius in px (default: 20) */
    dragRadius?: number;
    /** Twinkle animation speed (default: 0.03) */
    twinkleSpeed?: number;
    /** Max line opacity (default: 0.5) */
    lineAlpha?: number;
    /** Connection line width (default: 0.8) */
    lineWidth?: number;
    /** Glow blur as multiple of star size (default: 4) */
    glowMultiplier?: number;
    /** Twinkle opacity amplitude 0–1 (default: 0.4) */
    twinkleAmplitude?: number;
    /** Named preset: "default" | "cosmos" | "minimal" | "aurora" | "gold" */
    preset?: ConstellationPreset | string;
}
export declare const ConstellationMap: import('react').ForwardRefExoticComponent<ConstellationMapProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
