import { RefObject } from "react";
export interface CanvasSetupOptions {
    onFrame?: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void;
    noLoop?: boolean;
}
export interface CanvasSetupResult {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    width: number;
    height: number;
}
export declare function useCanvasSetup(options?: CanvasSetupOptions): CanvasSetupResult;
