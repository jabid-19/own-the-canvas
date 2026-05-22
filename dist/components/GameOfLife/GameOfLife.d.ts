import { BaseCanvasProps } from "../../types";
import { GameOfLifeHandle } from "./useGameOfLife";
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
export declare const PRESETS: Record<GameOfLifePreset, GameOfLifePresetValues>;
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
export declare const GameOfLife: import("react").ForwardRefExoticComponent<GameOfLifeProps & import("react").RefAttributes<GameOfLifeHandle>>;
