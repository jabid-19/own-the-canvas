import { RefObject } from "react";
export interface UseTornadoVortexOptions {
    particleCount: number;
    funnelColor: string;
    debrisColor: string;
    lightningColor: string;
    backgroundColor: string;
    rotationSpeed: number;
    funnelHeight: number;
    vortexStrength: number;
    showLightning: boolean;
    showGroundDust: boolean;
    interactive: boolean;
    speed: number;
}
export declare function useTornadoVortex(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseTornadoVortexOptions): void;
