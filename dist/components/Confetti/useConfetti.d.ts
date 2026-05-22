import { RefObject } from "react";
export type ConfettiShape = "square" | "circle" | "triangle" | "strip";
export interface UseConfettiOptions {
    trigger: boolean;
    particleCount: number;
    spread: number;
    gravity: number;
    colors: string[];
    shapes: ConfettiShape[];
    duration: number;
    continuous: boolean;
    wind: number;
    spawnX: number;
    spawnY: number;
    spawnSpread: number;
    speedMin: number;
    speedMax: number;
    sizeMin: number;
    sizeMax: number;
    angularVelocity: number;
    emissionRate: number;
    onComplete?: () => void;
}
export declare function useConfetti(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseConfettiOptions): void;
