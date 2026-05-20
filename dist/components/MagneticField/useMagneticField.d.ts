import { RefObject } from 'react';

export interface UseMagneticFieldOptions {
    fieldLineCount: number;
    stepSize: number;
    maxSteps: number;
    positiveColor: string;
    negativeColor: string;
    lineColor: string;
    backgroundColor: string;
    lineWidth: number;
    lineOpacity: number;
    poleRadius: number;
    glowEffect: boolean;
    glowBlur: number;
    animated: boolean;
    interactive: boolean;
    maxPoles: number;
}
export declare function useMagneticField(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseMagneticFieldOptions): void;
