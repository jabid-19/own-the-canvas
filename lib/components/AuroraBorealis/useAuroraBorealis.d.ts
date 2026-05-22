import { RefObject } from 'react';

export interface UseAuroraBorealisOptions {
    colors: string[];
    speed: number;
    intensity: number;
    layers: number;
    backgroundColor: string;
    waveAmplitude: number;
    waveFrequency: number;
    starCount: number;
    animated: boolean;
}
export declare function useAuroraBorealis(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseAuroraBorealisOptions): void;
