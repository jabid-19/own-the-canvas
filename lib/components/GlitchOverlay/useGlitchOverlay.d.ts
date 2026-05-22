import { RefObject } from 'react';

export interface UseGlitchOverlayOptions {
    intensity: number;
    speed: number;
    rgbShift: number;
    scanlines: boolean;
    scanlineOpacity: number;
    scanlineSpacing: number;
    blockGlitch: boolean;
    blockCount: number;
    noiseOpacity: number;
    flickerRate: number;
    color: string;
    rgbShiftColor: string;
    animated: boolean;
    backgroundColor: string;
}
export declare function useGlitchOverlay(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseGlitchOverlayOptions): void;
