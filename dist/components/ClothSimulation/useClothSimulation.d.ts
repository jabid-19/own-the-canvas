import { RefObject } from "react";
export interface UseClothSimulationOptions {
    cols: number;
    rows: number;
    spacing: number;
    gravity: number;
    friction: number;
    stiffness: number;
    iterations: number;
    lineColor: string;
    pinColor: string;
    lineWidth: number;
    backgroundColor: string;
    wind: number;
    windSpeed: number;
    tearable: boolean;
    tearDistance: number;
    interactive: boolean;
    mouseRadius: number;
    mouseForce: number;
    showPins: boolean;
}
export declare function useClothSimulation(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseClothSimulationOptions): void;
