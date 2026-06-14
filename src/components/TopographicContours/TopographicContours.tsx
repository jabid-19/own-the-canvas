import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useTopographicContours, UseTopographicContoursOptions } from "./useTopographicContours";

type TopographicContoursPreset = "default" | "terrain" | "ocean" | "heat" | "neon" | "minimal";

const PRESETS: Record<TopographicContoursPreset, Partial<UseTopographicContoursOptions>> = {
  default: {},
  terrain: {
    filled: true,
    backgroundColor: "#1a2040",
    fillColors: [
      "#0d2136",
      "#1a3a5c",
      "#2d6a4f",
      "#52b788",
      "#d4a96a",
      "#a8836e",
      "#e8e8e8",
      "#ffffff",
    ],
    contourLevels: 10,
    lineColor: "#000000",
    lineOpacity: 0.3,
  },
  ocean: {
    filled: true,
    backgroundColor: "#020818",
    fillColors: [
      "#03045e",
      "#0077b6",
      "#00b4d8",
      "#48cae4",
      "#90e0ef",
      "#ade8f4",
      "#caf0f8",
      "#ffffff",
    ],
    lineColor: "#ffffff",
    lineOpacity: 0.2,
    contourLevels: 8,
  },
  heat: {
    filled: true,
    fillColors: [
      "#03071e",
      "#6a040f",
      "#d00000",
      "#e85d04",
      "#f48c06",
      "#faa307",
      "#ffba08",
      "#ffffff",
    ],
    lineColor: "#000000",
    lineOpacity: 0.4,
    backgroundColor: "#03071e",
  },
  neon: {
    lineColor: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: true,
    lineOpacity: 0.8,
  },
  minimal: {
    lineColor: "#6b7280",
    backgroundColor: "#111111",
    lineOpacity: 0.4,
    contourLevels: 8,
  },
};

export interface TopographicContoursProps extends BaseCanvasProps {
  resolution?: number;
  contourLevels?: number;
  speed?: number;
  noiseScale?: number;
  octaves?: number;
  lineColor?: string;
  lineWidth?: number;
  lineOpacity?: number;
  backgroundColor?: string;
  filled?: boolean;
  fillColors?: string[];
  animated?: boolean;
  glowEffect?: boolean;
  preset?: TopographicContoursPreset | string;
}

export const TopographicContours = forwardRef<HTMLCanvasElement, TopographicContoursProps>(
  (props, ref) => {
    const {
      preset,
      resolution,
      contourLevels,
      speed,
      noiseScale,
      octaves,
      lineColor,
      lineWidth,
      lineOpacity,
      backgroundColor,
      filled,
      fillColors,
      animated,
      glowEffect,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as TopographicContoursPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useTopographicContours(internalRef, {
      resolution:       resolution       ?? p.resolution       ?? 8,
      contourLevels:    contourLevels    ?? p.contourLevels    ?? 12,
      speed:            speed            ?? p.speed            ?? 0.3,
      noiseScale:       noiseScale       ?? p.noiseScale       ?? 3,
      octaves:          octaves          ?? p.octaves          ?? 4,
      lineColor:        lineColor        ?? p.lineColor        ?? "#ffffff",
      lineWidth:        lineWidth        ?? p.lineWidth        ?? 1,
      lineOpacity:      lineOpacity      ?? p.lineOpacity      ?? 0.6,
      backgroundColor:  backgroundColor  ?? p.backgroundColor  ?? "#111111",
      filled:           filled           ?? p.filled           ?? false,
      fillColors:       fillColors       ?? p.fillColors       ?? [],
      animated:         animated         ?? p.animated         ?? true,
      glowEffect:       glowEffect       ?? p.glowEffect       ?? false,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          ...style,
        }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block" }}
        />
      </div>
    );
  }
);

TopographicContours.displayName = "TopographicContours";
