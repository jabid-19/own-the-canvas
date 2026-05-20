import { RefObject } from 'react';

export interface UseKaleidoscopeOptions {
    segments: number;
    speed: number;
    colorA: string;
    colorB: string;
    backgroundColor: string;
    noiseScale: number;
    zoomSpeed: number;
    rotation: number;
    resolution: number;
    animated: boolean;
}
export declare function useKaleidoscope(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseKaleidoscopeOptions): void;
