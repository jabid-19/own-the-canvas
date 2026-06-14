import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useLiveChart, LiveChartSeries } from "./useLiveChart";
export type { LiveChartSeries } from "./useLiveChart";

type LiveChartPreset = "default" | "neon" | "minimal" | "ocean" | "fire";

interface LiveChartPresetValues {
  lineWidth?: number;
  showGrid?: boolean;
  gridColor?: string;
  gridOpacity?: number;
  showDots?: boolean;
  fillOpacity?: number;
  backgroundColor?: string;
  smooth?: boolean;
  glowEffect?: boolean;
  glowBlur?: number;
}

export const PRESETS: Record<LiveChartPreset, LiveChartPresetValues> = {
  default: {
    lineWidth: 2,
    showGrid: true,
    gridColor: "#ffffff",
    gridOpacity: 0.08,
    showDots: false,
    fillOpacity: 1,
    smooth: true,
    glowEffect: true,
    glowBlur: 8,
    backgroundColor: "#111111",
  },
  neon: {
    lineWidth: 2.5,
    showGrid: true,
    gridColor: "#7C3AED",
    gridOpacity: 0.15,
    showDots: true,
    fillOpacity: 0.8,
    smooth: true,
    glowEffect: true,
    glowBlur: 20,
    backgroundColor: "#000000",
  },
  minimal: {
    lineWidth: 1.5,
    showGrid: false,
    showDots: false,
    fillOpacity: 0.6,
    smooth: true,
    glowEffect: false,
    backgroundColor: "transparent",
  },
  ocean: {
    lineWidth: 2,
    showGrid: true,
    gridColor: "#0891B2",
    gridOpacity: 0.1,
    fillOpacity: 0.9,
    smooth: true,
    glowEffect: true,
    glowBlur: 10,
    backgroundColor: "#020f1a",
  },
  fire: {
    lineWidth: 2.5,
    showGrid: true,
    gridColor: "#f97316",
    gridOpacity: 0.08,
    fillOpacity: 0.85,
    smooth: false,
    glowEffect: true,
    glowBlur: 15,
    backgroundColor: "#0c0000",
  },
};

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

export const LiveChart = forwardRef<HTMLCanvasElement, LiveChartProps>(
  (props, ref) => {
    const {
      preset, series, maxPoints, animated, lineWidth, showGrid, gridColor,
      gridOpacity, showDots, dotRadius, fillOpacity, backgroundColor, padding,
      yMin, yMax, smooth, glowEffect, glowBlur, scrollSpeed,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as LiveChartPreset]) || {};

    const defaultSeries: LiveChartSeries[] = [
      { data: Array.from({ length: 30 }, (_, i) => Math.sin(i * 0.3) * 50 + 50), color: "#ffffff", filled: true },
      { data: Array.from({ length: 30 }, (_, i) => Math.cos(i * 0.4) * 30 + 50), color: "#6b7280", filled: true },
    ];

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useLiveChart(internalRef, {
      series: series ?? defaultSeries,
      maxPoints: maxPoints ?? 100,
      animated: animated ?? true,
      lineWidth: lineWidth ?? p.lineWidth ?? 2,
      showGrid: showGrid ?? p.showGrid ?? true,
      gridColor: gridColor ?? p.gridColor ?? "#ffffff",
      gridOpacity: gridOpacity ?? p.gridOpacity ?? 0.08,
      showDots: showDots ?? p.showDots ?? false,
      dotRadius: dotRadius ?? 3,
      fillOpacity: fillOpacity ?? p.fillOpacity ?? 1,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      padding: padding ?? 20,
      yMin,
      yMax,
      smooth: smooth ?? p.smooth ?? true,
      glowEffect: glowEffect ?? p.glowEffect ?? true,
      glowBlur: glowBlur ?? p.glowBlur ?? 8,
      scrollSpeed: scrollSpeed ?? 1,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

LiveChart.displayName = "LiveChart";
