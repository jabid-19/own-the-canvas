import { RefObject } from 'react';

export interface UseWatercolorBloomOptions {
    colors: string[];
    backgroundColor: string;
    bloomRadius: number;
    bloomSpeed: number;
    opacity: number;
    wetEdge: number;
    layerCount: number;
    noiseAmount: number;
    fadeSpeed: number;
    interactive: boolean;
    autoBloom: boolean;
    autoBloomInterval: number;
    resolution: number;
    animated: boolean;
    maxBlooms: number;
}
export declare function useWatercolorBloom(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseWatercolorBloomOptions): void;
