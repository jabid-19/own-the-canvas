import { RefObject } from "react";
export interface UseSlimeMoldOptions {
    agentCount: number;
    sensorAngle: number;
    sensorDistance: number;
    stepSize: number;
    rotateSpeed: number;
    trailDecay: number;
    diffuseStrength: number;
    trailColor: string;
    backgroundColor: string;
    resolution: number;
    interactive: boolean;
    mouseRadius: number;
    mouseStrength: number;
    animated: boolean;
}
export declare function useSlimeMold(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseSlimeMoldOptions): void;
