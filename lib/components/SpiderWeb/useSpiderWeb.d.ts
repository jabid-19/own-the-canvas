import { RefObject } from 'react';

export interface UseSpiderWebOptions {
    spokeCount: number;
    ringCount: number;
    webColor: string;
    backgroundColor: string;
    spiderColor: string;
    dewDrops: boolean;
    glowColor: string;
    swaySpeed: number;
    disturbRadius: number;
    interactive: boolean;
    showSpider: boolean;
}
export declare function useSpiderWeb(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseSpiderWebOptions): void;
