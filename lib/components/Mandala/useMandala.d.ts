import { RefObject } from 'react';

export interface UseMandalaOptions {
    symmetry: number;
    colors: string[];
    lineWidth: number;
    speed: number;
    layers: number;
    radius: number;
    backgroundColor: string;
    animated: boolean;
    glowEffect: boolean;
    glowBlur: number;
    strokeOpacity: number;
    mirror: boolean;
    noiseAmount: number;
}
export declare function useMandala(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseMandalaOptions): void;
