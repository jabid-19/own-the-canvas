import { RefObject } from "react";
export type LissajousColorMode = "solid" | "cycle";
export interface UseLissajousOptions {
    freqX: number;
    freqY: number;
    phaseShift: number;
    phaseSpeed: number;
    amplitude: number;
    color: string;
    backgroundColor: string;
    lineWidth: number;
    trailFade: number;
    glowEffect: boolean;
    glowBlur: number;
    colorMode: LissajousColorMode;
    curvePoints: number;
    animated: boolean;
    speed: number;
}
export declare function useLissajous(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseLissajousOptions): void;
