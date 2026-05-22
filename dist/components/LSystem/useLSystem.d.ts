import { RefObject } from "react";
export interface UseLSystemOptions {
    axiom: string;
    rules: Record<string, string>;
    iterations: number;
    angle: number;
    lineWidth: number;
    color: string;
    backgroundColor: string;
    speed: number;
    autoReset: boolean;
    trailFade: number;
    glowEffect: boolean;
    glowBlur: number;
}
export declare function useLSystem(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseLSystemOptions): void;
