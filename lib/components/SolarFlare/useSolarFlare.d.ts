import { RefObject } from 'react';

export interface UseSolarFlareOptions {
    sunColor: string;
    coronaColor: string;
    flareColor: string;
    backgroundColor: string;
    sunRadius: number;
    convectionCells: number;
    flareCount: number;
    autoFlare: boolean;
    autoFlareInterval: number;
    interactive: boolean;
    glowEffect: boolean;
    glowBlur: number;
    speed: number;
}
export declare function useSolarFlare(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseSolarFlareOptions): void;
