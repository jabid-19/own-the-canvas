import { RefObject } from "react";
export interface UseFireworksOptions {
    colors: string[];
    particleCount: number;
    gravity: number;
    friction: number;
    fadeSpeed: number;
    particleSize: number;
    trailLength: number;
    spread: number;
    autoLaunch: boolean;
    autoInterval: number;
    glowEffect: boolean;
    glowBlur: number;
    backgroundColor: string;
    shellSpeed: number;
}
export declare function useFireworks(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseFireworksOptions): {
    launch: (x?: number) => void;
};
