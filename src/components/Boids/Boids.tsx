import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useBoids } from "./useBoids";

type BoidsPreset = "default" | "birds" | "fish" | "swarm" | "neon";

interface BoidsPresetValues {
  count?: number;
  maxSpeed?: number;
  separationRadius?: number;
  alignmentRadius?: number;
  cohesionRadius?: number;
  separationForce?: number;
  alignmentForce?: number;
  cohesionForce?: number;
  color?: string;
  trailLength?: number;
  trailOpacity?: number;
  boidSize?: number;
  backgroundColor?: string;
  interactive?: boolean;
  mouseRadius?: number;
  mouseForce?: number;
  wrapEdges?: boolean;
}

const PRESETS: Record<BoidsPreset, BoidsPresetValues> = {
  default: {
    color: "#ffffff",
    backgroundColor: "#111111",
  },
  birds: {
    color: "#94a3b8",
    backgroundColor: "#0f172a",
    trailLength: 12,
    boidSize: 7,
    count: 60,
    maxSpeed: 2.5,
  },
  fish: {
    color: "#0891B2",
    backgroundColor: "#030d1a",
    alignmentRadius: 40,
    cohesionForce: 0.05,
    trailLength: 6,
    boidSize: 5,
  },
  swarm: {
    color: "#f59e0b",
    backgroundColor: "#050010",
    count: 200,
    boidSize: 4,
    trailLength: 4,
    maxSpeed: 4,
    separationRadius: 15,
    alignmentRadius: 35,
    cohesionRadius: 40,
  },
  neon: {
    color: "#00ffff",
    backgroundColor: "#000000",
    trailOpacity: 0.6,
    trailLength: 15,
    boidSize: 6,
  },
};

export interface BoidsProps extends BaseCanvasProps {
  /** Number of boids. (default: 80) */
  count?: number;
  /** Maximum speed in px/frame. (default: 3) */
  maxSpeed?: number;
  /** Radius for separation rule in px. (default: 25) */
  separationRadius?: number;
  /** Radius for alignment rule in px. (default: 50) */
  alignmentRadius?: number;
  /** Radius for cohesion rule in px. (default: 60) */
  cohesionRadius?: number;
  /** Separation steering force. (default: 0.05) */
  separationForce?: number;
  /** Alignment steering force. (default: 0.05) */
  alignmentForce?: number;
  /** Cohesion steering force. (default: 0.03) */
  cohesionForce?: number;
  /** Boid and trail color. (default: "#7C3AED") */
  color?: string;
  /** Trail history length in frames. (default: 8) */
  trailLength?: number;
  /** Trail line opacity 0–1. (default: 0.4) */
  trailOpacity?: number;
  /** Boid triangle size in px. (default: 6) */
  boidSize?: number;
  /** Canvas background color. (default: "#050010") */
  backgroundColor?: string;
  /** Boids flee from mouse cursor. (default: true) */
  interactive?: boolean;
  /** Mouse avoidance radius in px. (default: 80) */
  mouseRadius?: number;
  /** Mouse avoidance force. (default: 0.2) */
  mouseForce?: number;
  /** Wrap boids at canvas edges. (default: true) */
  wrapEdges?: boolean;
  /** Named preset. */
  preset?: BoidsPreset | string;
}

export const Boids = forwardRef<HTMLCanvasElement, BoidsProps>((props, ref) => {
  const {
    preset,
    count, maxSpeed, separationRadius, alignmentRadius, cohesionRadius,
    separationForce, alignmentForce, cohesionForce,
    color, trailLength, trailOpacity, boidSize, backgroundColor,
    interactive, mouseRadius, mouseForce, wrapEdges,
    width, height, className, style,
  } = props;

  const p = (preset && PRESETS[preset as BoidsPreset]) || {};

  const internalRef = useRef<HTMLCanvasElement | null>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

  useBoids(internalRef, {
    count:            count            ?? p.count            ?? 80,
    maxSpeed:         maxSpeed         ?? p.maxSpeed         ?? 3,
    separationRadius: separationRadius ?? p.separationRadius ?? 25,
    alignmentRadius:  alignmentRadius  ?? p.alignmentRadius  ?? 50,
    cohesionRadius:   cohesionRadius   ?? p.cohesionRadius   ?? 60,
    separationForce:  separationForce  ?? p.separationForce  ?? 0.05,
    alignmentForce:   alignmentForce   ?? p.alignmentForce   ?? 0.05,
    cohesionForce:    cohesionForce    ?? p.cohesionForce    ?? 0.03,
    color:            color            ?? p.color            ?? "#ffffff",
    trailLength:      trailLength      ?? p.trailLength      ?? 8,
    trailOpacity:     trailOpacity     ?? p.trailOpacity     ?? 0.4,
    boidSize:         boidSize         ?? p.boidSize         ?? 6,
    backgroundColor:  backgroundColor  ?? p.backgroundColor  ?? "#111111",
    interactive:      interactive      ?? p.interactive      ?? true,
    mouseRadius:      mouseRadius      ?? p.mouseRadius      ?? 80,
    mouseForce:       mouseForce       ?? p.mouseForce       ?? 0.2,
    wrapEdges:        wrapEdges        ?? p.wrapEdges        ?? true,
  });

  return (
    <div
      className={className}
      style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", ...style }}
    >
      <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
    </div>
  );
});

Boids.displayName = "Boids";
