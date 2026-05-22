import { RefObject } from "react";
export interface UseNeuralWebOptions {
    nodeCount: number;
    nodeColor: string;
    edgeColor: string;
    signalColor: string;
    backgroundColor: string;
    connectionRadius: number;
    nodeRadius: number;
    lineWidth: number;
    speed: number;
    pulseInterval: number;
    pulseDecay: number;
    glowEffect: boolean;
    glowBlur: number;
    interactive: boolean;
    animated: boolean;
    wander: boolean;
    wanderSpeed: number;
}
export declare function useNeuralWeb(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseNeuralWebOptions): void;
