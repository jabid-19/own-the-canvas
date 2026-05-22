import { RefObject } from "react";
export interface LiveChartSeries {
    data: number[];
    color: string;
    label?: string;
    filled?: boolean;
}
export interface UseLiveChartOptions {
    series: LiveChartSeries[];
    maxPoints: number;
    animated: boolean;
    lineWidth: number;
    showGrid: boolean;
    gridColor: string;
    gridOpacity: number;
    showDots: boolean;
    dotRadius: number;
    fillOpacity: number;
    backgroundColor: string;
    padding: number;
    yMin?: number;
    yMax?: number;
    smooth: boolean;
    glowEffect: boolean;
    glowBlur: number;
    scrollSpeed: number;
}
export declare function useLiveChart(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseLiveChartOptions): {
    push: (values: number | number[]) => void;
};
