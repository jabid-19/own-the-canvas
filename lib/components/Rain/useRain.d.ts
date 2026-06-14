import { RefObject } from 'react';

export interface UseRainOptions {
    dropCount: number;
    speed: number;
    wind: number;
    windSpeed: number;
    dropLength: number;
    dropWidth: number;
    dropOpacity: number;
    dropColor: string;
    splashColor: string;
    showSplashes: boolean;
    backgroundColor: string;
    starCount: number;
    starColor: string;
    glowingStars: boolean;
    starGlowBlur: number;
}
export declare function useRain(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseRainOptions): void;
