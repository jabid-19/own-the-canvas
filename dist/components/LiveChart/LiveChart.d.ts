import { BaseCanvasProps } from '../../types';
import { LiveChartSeries } from './useLiveChart';

export type { LiveChartSeries } from './useLiveChart';
type LiveChartPreset = "default" | "neon" | "minimal" | "ocean" | "fire";
export interface LiveChartProps extends BaseCanvasProps {
    /** Data series to render */
    series?: LiveChartSeries[];
    /** Max data points kept per series (default: 100) */
    maxPoints?: number;
    /** Enable animation loop (default: true) */
    animated?: boolean;
    /** Line stroke width (default: 2) */
    lineWidth?: number;
    /** Show horizontal grid lines (default: true) */
    showGrid?: boolean;
    /** Grid line color (default: "#ffffff") */
    gridColor?: string;
    /** Grid opacity (default: 0.08) */
    gridOpacity?: number;
    /** Show data point dots (default: false) */
    showDots?: boolean;
    /** Dot radius when shown (default: 3) */
    dotRadius?: number;
    /** Fill area opacity multiplier (default: 1) */
    fillOpacity?: number;
    /** Canvas background color (default: "#050010") */
    backgroundColor?: string;
    /** Inner padding px (default: 20) */
    padding?: number;
    /** Fixed y minimum */
    yMin?: number;
    /** Fixed y maximum */
    yMax?: number;
    /** Smooth curves with quadratic bezier (default: true) */
    smooth?: boolean;
    /** Line glow effect (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 8) */
    glowBlur?: number;
    /** Scroll animation speed (default: 1) */
    scrollSpeed?: number;
    /** Named preset */
    preset?: LiveChartPreset | string;
}
export declare const LiveChart: import('react').ForwardRefExoticComponent<LiveChartProps & import('react').RefAttributes<HTMLCanvasElement>>;
