import { RefObject } from 'react';

export type MatrixCharset = "katakana" | "latin" | "binary" | string;
export interface UseMatrixRainOptions {
    color: string;
    backgroundColor: string;
    fontSize: number;
    speed: number;
    charset: string;
    resetThreshold: number;
}
export declare function resolveCharset(charset: MatrixCharset): string;
export declare function useMatrixRain(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseMatrixRainOptions): void;
