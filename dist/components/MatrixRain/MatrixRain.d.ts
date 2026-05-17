import { BaseCanvasProps } from '../../types';
import { MatrixCharset } from './useMatrixRain';

type MatrixRainPreset = "default" | "cyberpunk" | "binary" | "minimal" | "blood";
export interface MatrixRainProps extends BaseCanvasProps {
    /** Character color (default: "#fff") */
    color?: string;
    /** Per-frame overlay color — lower opacity = longer trails (default: "rgba(0,0,0,0.1)") */
    backgroundColor?: string;
    /** Font size in px; controls column count (default: 14) */
    fontSize?: number;
    /** Ms per frame — lower = faster (default: 33) */
    speed?: number;
    /** Characters to rain: "latin" | "binary" | "katakana" | custom string (default: "latin") */
    charset?: MatrixCharset;
    /** Probability a drop resets after leaving the bottom (default: 0.95) */
    resetThreshold?: number;
    /** Named preset: "default" | "cyberpunk" | "binary" | "minimal" | "blood" */
    preset?: MatrixRainPreset | string;
}
export declare const MatrixRain: import('react').ForwardRefExoticComponent<MatrixRainProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
