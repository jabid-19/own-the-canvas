import { RefObject } from "react";
export interface GameOfLifeHandle {
    randomize: () => void;
    clear: () => void;
    pause: () => void;
    resume: () => void;
}
export interface UseGameOfLifeOptions {
    cellSize: number;
    speed: number;
    initialDensity: number;
    aliveColor: string;
    oldColor: string;
    deadColor: string;
    showAge: boolean;
    wrapEdges: boolean;
    interactive: boolean;
    backgroundColor: string;
}
export declare function useGameOfLife(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseGameOfLifeOptions, handleRef: RefObject<GameOfLifeHandle | null>): void;
