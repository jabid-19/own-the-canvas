import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useGameOfLife, GameOfLifeHandle } from "./useGameOfLife";

export type { GameOfLifeHandle };

type GameOfLifePreset = "default" | "neon" | "matrix" | "minimal" | "fire";

interface GameOfLifePresetValues {
  cellSize?: number;
  speed?: number;
  initialDensity?: number;
  aliveColor?: string;
  oldColor?: string;
  deadColor?: string;
  showAge?: boolean;
  wrapEdges?: boolean;
  interactive?: boolean;
  backgroundColor?: string;
}

const PRESETS: Record<GameOfLifePreset, GameOfLifePresetValues> = {
  default: {
    aliveColor: "#ffffff",
    oldColor: "#6b7280",
    deadColor: "#111111",
    backgroundColor: "#111111",
  },
  neon: {
    aliveColor: "#00ff41",
    oldColor: "#00ffff",
    deadColor: "#000000",
    backgroundColor: "#000000",
    cellSize: 6,
  },
  matrix: {
    aliveColor: "#00ff41",
    oldColor: "#004d14",
    deadColor: "#000000",
    backgroundColor: "#000000",
    cellSize: 10,
  },
  minimal: {
    aliveColor: "#ffffff",
    oldColor: "#94a3b8",
    deadColor: "#0f172a",
    backgroundColor: "#0f172a",
    showAge: false,
  },
  fire: {
    aliveColor: "#ff6b00",
    oldColor: "#ffff00",
    deadColor: "#050010",
    backgroundColor: "#050010",
    cellSize: 5,
    speed: 8,
  },
};

export interface GameOfLifeProps extends BaseCanvasProps {
  /** Cell size in px. (default: 8) */
  cellSize?: number;
  /** Simulation updates per second. (default: 10) */
  speed?: number;
  /** Initial alive cell density 0–1. (default: 0.3) */
  initialDensity?: number;
  /** Color of newly born cells. (default: "#7C3AED") */
  aliveColor?: string;
  /** Color of old cells. (default: "#0891B2") */
  oldColor?: string;
  /** Color of dead cells / background. (default: "#050010") */
  deadColor?: string;
  /** Color cells by generation age. (default: true) */
  showAge?: boolean;
  /** Wrap cells at canvas edges. (default: true) */
  wrapEdges?: boolean;
  /** Click to toggle cells. (default: true) */
  interactive?: boolean;
  /** Canvas background color. (default: "#050010") */
  backgroundColor?: string;
  /** Named preset. */
  preset?: GameOfLifePreset | string;
}

export const GameOfLife = forwardRef<GameOfLifeHandle, GameOfLifeProps>((props, ref) => {
  const {
    preset,
    cellSize, speed, initialDensity, aliveColor, oldColor, deadColor,
    showAge, wrapEdges, interactive, backgroundColor,
    width, height, className, style,
  } = props;

  const p = (preset && PRESETS[preset as GameOfLifePreset]) || {};

  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const handleRef = useRef<GameOfLifeHandle | null>(null);

  useImperativeHandle(ref, () => handleRef.current as GameOfLifeHandle);

  useGameOfLife(internalCanvasRef, {
    cellSize:        cellSize        ?? p.cellSize        ?? 8,
    speed:           speed           ?? p.speed           ?? 10,
    initialDensity:  initialDensity  ?? p.initialDensity  ?? 0.3,
    aliveColor:      aliveColor      ?? p.aliveColor      ?? "#ffffff",
    oldColor:        oldColor        ?? p.oldColor        ?? "#6b7280",
    deadColor:       deadColor       ?? p.deadColor       ?? "#111111",
    showAge:         showAge         ?? p.showAge         ?? true,
    wrapEdges:       wrapEdges       ?? p.wrapEdges       ?? true,
    interactive:     interactive     ?? p.interactive     ?? true,
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
  }, handleRef);

  return (
    <div
      className={className}
      style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
    >
      <canvas ref={internalCanvasRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
    </div>
  );
});

GameOfLife.displayName = "GameOfLife";
