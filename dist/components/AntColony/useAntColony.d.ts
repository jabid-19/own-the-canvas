import { RefObject } from "react";
export interface UseAntColonyOptions {
    antCount: number;
    evaporationRate: number;
    diffusionRate: number;
    pheromoneStrength: number;
    antSpeed: number;
    sensorAngle: number;
    sensorDistance: number;
    turnSpeed: number;
    antColor: string;
    pheromoneColor: string;
    foodColor: string;
    nestColor: string;
    backgroundColor: string;
    resolution: number;
    animated: boolean;
    interactive: boolean;
    maxFood: number;
}
export declare function useAntColony(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseAntColonyOptions): void;
