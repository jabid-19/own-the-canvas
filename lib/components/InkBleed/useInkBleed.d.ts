import { RefObject } from 'react';

export interface UseInkBleedOptions {
    inkColor: string;
    paperColor: string;
    diffusionRate: number;
    viscosity: number;
    evaporationRate: number;
    inkRadius: number;
    inkStrength: number;
    interactive: boolean;
    autoInk: boolean;
    autoInkInterval: number;
    resolution: number;
    glowEffect: boolean;
    glowBlur: number;
    animated: boolean;
}
export declare function useInkBleed(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseInkBleedOptions): void;
