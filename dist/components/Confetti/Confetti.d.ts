import { BaseCanvasProps } from "../../types";
import { ConfettiShape } from "./useConfetti";
export type ConfettiPalette = "monochrome" | "colorful";
type ConfettiPreset = "default" | "celebration" | "pastel" | "gold";
export interface ConfettiProps extends BaseCanvasProps {
    /** Color variant: "monochrome" (default) or "colorful" */
    palette?: ConfettiPalette;
    /** Rising edge fires a burst (default: false) */
    trigger?: boolean;
    /** Number of pieces per burst (default: 150) */
    particleCount?: number;
    /** Spread angle 0–1 where 1 = full hemisphere (default: 0.8) */
    spread?: number;
    /** Gravity strength (default: 0.5) */
    gravity?: number;
    /** Override confetti colors directly (overrides palette) */
    colors?: string[];
    /** Shapes to include (default: all) */
    shapes?: ConfettiShape[];
    /** Duration of each piece in ms (default: 4000) */
    duration?: number;
    /** Emit continuously while trigger is true (default: false) */
    continuous?: boolean;
    /** Horizontal wind force (default: 0.5) */
    wind?: number;
    /** Spawn X position as fraction of canvas width (default: 0.5) */
    spawnX?: number;
    /** Spawn Y position as fraction of canvas height (default: 0.4) */
    spawnY?: number;
    /** Spawn position random spread in px (default: 60) */
    spawnSpread?: number;
    /** Minimum piece launch speed (default: 4) */
    speedMin?: number;
    /** Maximum piece launch speed (default: 16) */
    speedMax?: number;
    /** Minimum piece size in px (default: 6) */
    sizeMin?: number;
    /** Maximum piece size in px (default: 14) */
    sizeMax?: number;
    /** Max angular velocity per frame (default: 0.3) */
    angularVelocity?: number;
    /** Pieces per second in continuous mode (default: 10) */
    emissionRate?: number;
    /** Called when animation finishes */
    onComplete?: () => void;
    /** Named preset: "default" | "celebration" | "pastel" | "gold" */
    preset?: ConfettiPreset | string;
}
export declare const Confetti: import("react").ForwardRefExoticComponent<ConfettiProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
