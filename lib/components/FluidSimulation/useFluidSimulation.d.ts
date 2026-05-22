import { RefObject } from 'react';

export interface UseFluidSimulationOptions {
    resolution: number;
    viscosity: number;
    diffusion: number;
    dissipation: number;
    inkColors: string[];
    glowEffect: boolean;
    glowBlur: number;
    backgroundColor: string;
    autoInk: boolean;
    autoInkInterval: number;
    mouseForce: number;
    inkRadius: number;
}
export declare function useFluidSimulation(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseFluidSimulationOptions): void;
