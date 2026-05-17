import { RefObject } from 'react';

export type FirePalette = "inferno" | "toxic" | "ice" | "plasma" | "smoke";
export interface UseFireEffectOptions {
    palette: FirePalette;
    intensity: number;
    windStrength: number;
    windDirection: number;
    spread: number;
    cooling: number;
    noiseStrength: number;
    coolingScale: number;
    resolution: number;
}
export declare function useFireEffect(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseFireEffectOptions): void;
