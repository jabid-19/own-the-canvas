import { RefObject } from 'react';

export interface UseSpotlightOptions {
    radius: number;
    color: string;
    overlayColor: string;
    overlayOpacity: number;
    edgeSoftness: number;
    followSpeed: number;
    glowColor: string;
    glowSize: number;
    showGlow: boolean;
    shape: "circle" | "ellipse";
    ellipseRatio: number;
    interactive: boolean;
    defaultX: number;
    defaultY: number;
}
export declare function useSpotlight(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseSpotlightOptions): void;
