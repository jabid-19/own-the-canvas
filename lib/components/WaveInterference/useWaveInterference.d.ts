import { RefObject } from 'react';

export interface UseWaveInterferenceOptions {
    maxSources: number;
    wavelength: number;
    speed: number;
    colorHigh: string;
    colorLow: string;
    backgroundColor: string;
    showSources: boolean;
    resolution: number;
    animated: boolean;
    decay: number;
}
export declare function useWaveInterference(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseWaveInterferenceOptions): void;
