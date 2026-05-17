import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useConfetti, ConfettiShape } from "./useConfetti";

export type ConfettiPalette = "monochrome" | "colorful";

const PALETTES: Record<ConfettiPalette, string[]> = {
  monochrome: ["#ffffff", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563"],
  colorful:   ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fc8", "#ff9a3c", "#c77dff"],
};

type ConfettiPreset = "default" | "celebration" | "pastel" | "gold";

interface ConfettiPresetValues {
  palette?: ConfettiPalette;
  colors?: string[];
  shapes?: ConfettiShape[];
  gravity?: number;
  wind?: number;
  speedMax?: number;
}

const PRESETS: Record<ConfettiPreset, ConfettiPresetValues> = {
  default: {},
  celebration: {
    palette: "colorful",
    shapes: ["square", "circle", "triangle", "strip"],
    speedMax: 20,
  },
  pastel: {
    colors: ["#fbb6ce", "#fed7aa", "#fef08a", "#bbf7d0", "#bae6fd", "#ddd6fe", "#fbcfe8"],
    shapes: ["circle", "square"],
    gravity: 0.3,
    wind: 0.2,
  },
  gold: {
    colors: ["#ffd700", "#ffa500", "#ffec47", "#fff3b0", "#e6ac00"],
    shapes: ["square", "circle", "strip"],
    speedMax: 18,
    gravity: 0.4,
  },
};

const DEFAULT_SHAPES: ConfettiShape[] = ["square", "circle", "triangle", "strip"];

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

export const Confetti = forwardRef<HTMLCanvasElement, ConfettiProps>(
  (props, ref) => {
    const {
      preset,
      palette,
      trigger = false,
      particleCount,
      spread,
      gravity,
      colors,
      shapes,
      duration,
      continuous,
      wind,
      spawnX,
      spawnY,
      spawnSpread,
      speedMin,
      speedMax,
      sizeMin,
      sizeMax,
      angularVelocity,
      emissionRate,
      onComplete,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as ConfettiPreset]) || {};

    // palette prop > preset palette > default "monochrome"
    const resolvedPalette: ConfettiPalette = palette ?? p.palette ?? "monochrome";
    // colors prop > preset colors > palette colors
    const resolvedColors = colors ?? p.colors ?? PALETTES[resolvedPalette];

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useConfetti(internalRef, {
      trigger,
      particleCount: particleCount ?? 150,
      spread: spread ?? 0.8,
      gravity: gravity ?? p.gravity ?? 0.5,
      colors: resolvedColors,
      shapes: shapes ?? p.shapes ?? DEFAULT_SHAPES,
      duration: duration ?? 4000,
      continuous: continuous ?? false,
      wind: wind ?? p.wind ?? 0.5,
      spawnX: spawnX ?? 0.5,
      spawnY: spawnY ?? 0.4,
      spawnSpread: spawnSpread ?? 60,
      speedMin: speedMin ?? 4,
      speedMax: speedMax ?? p.speedMax ?? 16,
      sizeMin: sizeMin ?? 6,
      sizeMax: sizeMax ?? 14,
      angularVelocity: angularVelocity ?? 0.3,
      emissionRate: emissionRate ?? 10,
      onComplete,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          pointerEvents: "none",
          ...style,
        }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

Confetti.displayName = "Confetti";
