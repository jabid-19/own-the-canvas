import { BaseCanvasProps } from '../../types';
import { FirePalette } from './useFireEffect';

type FirePreset = "default" | "inferno" | "toxic" | "ice" | "plasma";
export interface FireEffectProps extends BaseCanvasProps {
    /** Color theme (default: "smoke") */
    palette?: FirePalette;
    /** Flame intensity 0–1 (default: 0.95) */
    intensity?: number;
    /** Wind horizontal strength -1 to 1 (default: 0.3) */
    windStrength?: number;
    /** Wind direction: 1 = right, -1 = left (default: 1) */
    windDirection?: number;
    /** Flame spread 0–1 (default: 0.7) */
    spread?: number;
    /** Cooling rate 0–1 — higher = shorter flames (default: 0.3) */
    cooling?: number;
    /** Bottom-row seed noise magnitude (default: 60) */
    noiseStrength?: number;
    /** Cooling amount scaling factor (default: 5) */
    coolingScale?: number;
    /** Fire buffer resolution relative to canvas — 0.5 = half size for perf (default: 1) */
    resolution?: number;
    /** Named preset: "default" | "inferno" | "toxic" | "ice" | "plasma" */
    preset?: FirePreset | string;
}
export declare const FireEffect: import('react').ForwardRefExoticComponent<FireEffectProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
