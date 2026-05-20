import { BaseCanvasProps } from '../../types';

type AuroraBorealisPreset = "default" | "arctic" | "solar" | "tropical" | "neon" | "midnight";
export interface AuroraBorealisProps extends BaseCanvasProps {
    /** Aurora band colors (default: monochrome whites/grays) */
    colors?: string[];
    /** Animation speed multiplier (default: 1) */
    speed?: number;
    /** Band brightness/opacity 0–1 (default: 0.8) */
    intensity?: number;
    /** Number of aurora layers (default: 5) */
    layers?: number;
    /** Sky background color (default: "#111111") */
    backgroundColor?: string;
    /** Wave height as fraction of canvas height (default: 0.15) */
    waveAmplitude?: number;
    /** Wave oscillations across canvas width (default: 2) */
    waveFrequency?: number;
    /** Background star count (default: 80) */
    starCount?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Named preset */
    preset?: AuroraBorealisPreset | string;
}
export declare const AuroraBorealis: import('react').ForwardRefExoticComponent<AuroraBorealisProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
