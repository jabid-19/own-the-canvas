import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useAntColony } from "./useAntColony";

type AntColonyPreset = "default" | "neon" | "desert" | "jungle" | "minimal" | "swarm";

interface AntColonyPresetValues {
  antColor?: string;
  pheromoneColor?: string;
  foodColor?: string;
  nestColor?: string;
  backgroundColor?: string;
  antCount?: number;
  antSpeed?: number;
  evaporationRate?: number;
  pheromoneStrength?: number;
}

const PRESETS: Record<AntColonyPreset, AntColonyPresetValues> = {
  default: {},
  neon: {
    antColor: "#ffffff",
    pheromoneColor: "#00ffcc",
    foodColor: "#f0abfc",
    nestColor: "#fbbf24",
    backgroundColor: "#000000",
    pheromoneStrength: 8,
  },
  desert: {
    antColor: "#451a03",
    pheromoneColor: "#d97706",
    foodColor: "#84cc16",
    nestColor: "#b45309",
    backgroundColor: "#fef3c7",
    antSpeed: 2,
    evaporationRate: 0.005,
  },
  jungle: {
    antColor: "#1a0a00",
    pheromoneColor: "#4ade80",
    foodColor: "#fbbf24",
    nestColor: "#7c3aed",
    backgroundColor: "#052e16",
    antCount: 200,
    antSpeed: 1,
  },
  minimal: {
    antColor: "#9ca3af",
    pheromoneColor: "#374151",
    foodColor: "#6b7280",
    nestColor: "#6b7280",
    backgroundColor: "#111111",
    antCount: 80,
    pheromoneStrength: 3,
  },
  swarm: {
    antColor: "#ffffff",
    pheromoneColor: "#6b7280",
    foodColor: "#4ade80",
    nestColor: "#f59e0b",
    backgroundColor: "#111111",
    antCount: 400,
    antSpeed: 2,
    pheromoneStrength: 10,
    evaporationRate: 0.002,
  },
};

export interface AntColonyProps extends BaseCanvasProps {
  /** Number of ants (default: 150) */
  antCount?: number;
  /** Pheromone decay per frame (default: 0.003) */
  evaporationRate?: number;
  /** Pheromone spread to neighbors (default: 0.1) */
  diffusionRate?: number;
  /** Pheromone deposited per step (default: 5) */
  pheromoneStrength?: number;
  /** Pixels per frame per ant (default: 1.5) */
  antSpeed?: number;
  /** Ant sensor angle offset in radians (default: 0.4) */
  sensorAngle?: number;
  /** Pheromone sensor lookahead in px (default: 6) */
  sensorDistance?: number;
  /** Max turn per frame in radians (default: 0.3) */
  turnSpeed?: number;
  /** Ant dot color (default: "#ffffff") */
  antColor?: string;
  /** Pheromone trail color (default: "#6b7280") */
  pheromoneColor?: string;
  /** Food source color (default: "#4ade80") */
  foodColor?: string;
  /** Nest color (default: "#f59e0b") */
  nestColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Pheromone grid resolution (default: 0.5) */
  resolution?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Click to place food (default: true) */
  interactive?: boolean;
  /** Max simultaneous food sources (default: 5) */
  maxFood?: number;
  preset?: AntColonyPreset | string;
}

export const AntColony = forwardRef<HTMLCanvasElement, AntColonyProps>(
  (props, ref) => {
    const {
      preset, antCount, evaporationRate, diffusionRate, pheromoneStrength,
      antSpeed, sensorAngle, sensorDistance, turnSpeed,
      antColor, pheromoneColor, foodColor, nestColor, backgroundColor,
      resolution, animated, interactive, maxFood,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as AntColonyPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useAntColony(internalRef, {
      antCount:          antCount          ?? p.antCount          ?? 150,
      evaporationRate:   evaporationRate   ?? p.evaporationRate   ?? 0.003,
      diffusionRate:     diffusionRate     ?? 0.1,
      pheromoneStrength: pheromoneStrength ?? p.pheromoneStrength ?? 5,
      antSpeed:          antSpeed          ?? p.antSpeed          ?? 1.5,
      sensorAngle:       sensorAngle       ?? 0.4,
      sensorDistance:    sensorDistance    ?? 6,
      turnSpeed:         turnSpeed         ?? 0.3,
      antColor:          antColor          ?? p.antColor          ?? "#ffffff",
      pheromoneColor:    pheromoneColor    ?? p.pheromoneColor    ?? "#6b7280",
      foodColor:         foodColor         ?? p.foodColor         ?? "#4ade80",
      nestColor:         nestColor         ?? p.nestColor         ?? "#f59e0b",
      backgroundColor:   backgroundColor   ?? p.backgroundColor   ?? "#111111",
      resolution:        resolution        ?? 0.5,
      animated:          animated          ?? true,
      interactive:       interactive       ?? true,
      maxFood:           maxFood           ?? 5,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "crosshair" : "default",
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

AntColony.displayName = "AntColony";
