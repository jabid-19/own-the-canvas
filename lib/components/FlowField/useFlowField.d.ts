import { RefObject } from 'react';

export interface UseFlowFieldOptions {
    particleCount: number;
    colors: string[];
    speed: number;
    noiseScale: number;
    trailLength: number;
    fadeStrength: number;
    lineWidth: number;
    backgroundColor: string;
    animated: boolean;
    timeSpeed: number;
    curl: boolean;
}
export declare function useFlowField(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseFlowFieldOptions): void;
