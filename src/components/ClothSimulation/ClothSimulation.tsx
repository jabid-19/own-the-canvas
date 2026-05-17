import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useClothSimulation } from "./useClothSimulation";

type ClothPreset = "default" | "silk" | "net" | "heavy" | "spider";

interface ClothPresetValues {
  cols?: number;
  rows?: number;
  spacing?: number;
  gravity?: number;
  friction?: number;
  stiffness?: number;
  iterations?: number;
  lineColor?: string;
  pinColor?: string;
  lineWidth?: number;
  backgroundColor?: string;
  wind?: number;
  windSpeed?: number;
  tearable?: boolean;
  tearDistance?: number;
}

const PRESETS: Record<ClothPreset, ClothPresetValues> = {
  default: {
    cols: 25,
    rows: 20,
    spacing: 18,
    gravity: 0.4,
    friction: 0.99,
    stiffness: 1,
    iterations: 3,
    lineColor: "#6b7280",
    pinColor: "#ffffff",
    lineWidth: 1,
    backgroundColor: "#111111",
    wind: 0.3,
    windSpeed: 0.5,
    tearable: false,
    tearDistance: 3,
  },
  silk: {
    cols: 30,
    rows: 22,
    spacing: 15,
    gravity: 0.2,
    friction: 0.995,
    stiffness: 0.8,
    iterations: 5,
    lineColor: "#e0b0ff",
    pinColor: "#ffffff",
    lineWidth: 0.8,
    backgroundColor: "#050010",
    wind: 0.5,
    windSpeed: 0.3,
    tearable: false,
  },
  net: {
    cols: 20,
    rows: 15,
    spacing: 22,
    gravity: 0.5,
    friction: 0.98,
    stiffness: 1,
    iterations: 5,
    lineColor: "#0891B2",
    pinColor: "#67e8f9",
    lineWidth: 1.5,
    backgroundColor: "#020f1a",
    wind: 0.2,
    tearable: true,
    tearDistance: 2.5,
  },
  heavy: {
    cols: 20,
    rows: 18,
    spacing: 20,
    gravity: 0.8,
    friction: 0.97,
    stiffness: 1,
    iterations: 8,
    lineColor: "#94a3b8",
    pinColor: "#e2e8f0",
    lineWidth: 1.5,
    backgroundColor: "#0f172a",
    wind: 0.1,
    tearable: false,
  },
  spider: {
    cols: 15,
    rows: 12,
    spacing: 28,
    gravity: 0.3,
    friction: 0.99,
    stiffness: 0.9,
    iterations: 4,
    lineColor: "#e2e8f0",
    pinColor: "#f8fafc",
    lineWidth: 0.6,
    backgroundColor: "#000000",
    wind: 0.15,
    tearable: true,
    tearDistance: 4,
  },
};

export interface ClothSimulationProps extends BaseCanvasProps {
  /** Grid columns (default: 25) */
  cols?: number;
  /** Grid rows (default: 20) */
  rows?: number;
  /** Point spacing in px (default: 18) */
  spacing?: number;
  /** Gravity per frame (default: 0.4) */
  gravity?: number;
  /** Velocity friction 0–1 (default: 0.99) */
  friction?: number;
  /** Constraint stiffness 0–1 (default: 1) */
  stiffness?: number;
  /** Relaxation iterations per frame (default: 3) */
  iterations?: number;
  /** Cloth mesh color (default: "#7C3AED") */
  lineColor?: string;
  /** Pin point color (default: "#ffffff") */
  pinColor?: string;
  /** Mesh stroke width (default: 1) */
  lineWidth?: number;
  /** Canvas background (default: "#050010") */
  backgroundColor?: string;
  /** Wind oscillation amplitude (default: 0.3) */
  wind?: number;
  /** Wind oscillation frequency (default: 0.5) */
  windSpeed?: number;
  /** Enable cloth tearing on drag (default: false) */
  tearable?: boolean;
  /** Tear multiplier — ratio above rest length that tears constraint (default: 3) */
  tearDistance?: number;
  /** Enable mouse interaction (default: true) */
  interactive?: boolean;
  /** Mouse influence radius in px (default: 30) */
  mouseRadius?: number;
  /** Mouse push force (default: 5) */
  mouseForce?: number;
  /** Show pin points at top (default: true) */
  showPins?: boolean;
  /** Named preset */
  preset?: ClothPreset | string;
}

export const ClothSimulation = forwardRef<HTMLCanvasElement, ClothSimulationProps>(
  (props, ref) => {
    const {
      preset, cols, rows, spacing, gravity, friction, stiffness, iterations,
      lineColor, pinColor, lineWidth, backgroundColor, wind, windSpeed,
      tearable, tearDistance, interactive, mouseRadius, mouseForce, showPins,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as ClothPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useClothSimulation(internalRef, {
      cols: cols ?? p.cols ?? 25,
      rows: rows ?? p.rows ?? 20,
      spacing: spacing ?? p.spacing ?? 18,
      gravity: gravity ?? p.gravity ?? 0.4,
      friction: friction ?? p.friction ?? 0.99,
      stiffness: stiffness ?? p.stiffness ?? 1,
      iterations: iterations ?? p.iterations ?? 3,
      lineColor: lineColor ?? p.lineColor ?? "#6b7280",
      pinColor: pinColor ?? p.pinColor ?? "#ffffff",
      lineWidth: lineWidth ?? p.lineWidth ?? 1,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      wind: wind ?? p.wind ?? 0.3,
      windSpeed: windSpeed ?? p.windSpeed ?? 0.5,
      tearable: tearable ?? p.tearable ?? false,
      tearDistance: tearDistance ?? p.tearDistance ?? 3,
      interactive: interactive ?? true,
      mouseRadius: mouseRadius ?? 30,
      mouseForce: mouseForce ?? 5,
      showPins: showPins ?? true,
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

ClothSimulation.displayName = "ClothSimulation";
