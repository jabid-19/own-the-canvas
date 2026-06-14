// src/components/ButterflySwarm/ButterflySwarm.tsx
import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useButterflySwarm } from "./useButterflySwarm";

type ButterflySwarmPreset = "default" | "monarch" | "morpho" | "meadow" | "night";

interface ButterflySwarmPresetValues {
  wingColor?: string;
  patternColor?: string;
  backgroundColor?: string;
}

const PRESETS: Record<ButterflySwarmPreset, ButterflySwarmPresetValues> = {
  default:  {},
  monarch:  { wingColor: "#e06010", patternColor: "#111111", backgroundColor: "#0a0800" },
  morpho:   { wingColor: "#1060ff", patternColor: "#0030aa", backgroundColor: "#000508" },
  meadow:   { wingColor: "#f0c030", patternColor: "#804000", backgroundColor: "#0a1405" },
  night:    { wingColor: "#c0d0e0", patternColor: "#304050", backgroundColor: "#020408" },
};

export interface ButterflySwarmProps extends BaseCanvasProps {
  /** Number of butterflies (default: 12) */
  butterflyCount?: number;
  /** Primary wing color (default: "#f97316") */
  wingColor?: string;
  /** Wing pattern and body color (default: "#111111") */
  patternColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Wing flap speed multiplier (default: 1) */
  flapSpeed?: number;
  /** Movement speed multiplier (default: 1) */
  speed?: number;
  /** Cursor attraction/scatter radius in px (default: 120) */
  attractRadius?: number;
  /** Enable cursor interaction (default: true) */
  interactive?: boolean;
  /** Show faint motion trails (default: false) */
  showTrails?: boolean;
  /** Named preset */
  preset?: ButterflySwarmPreset | string;
}

export const ButterflySwarm = forwardRef<HTMLCanvasElement, ButterflySwarmProps>(
  (props, ref) => {
    const {
      preset, butterflyCount, wingColor, patternColor, backgroundColor,
      flapSpeed, speed, attractRadius, interactive, showTrails,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as ButterflySwarmPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useButterflySwarm(internalRef, {
      butterflyCount: butterflyCount ?? 12,
      wingColor:      wingColor      ?? p.wingColor      ?? "#f97316",
      patternColor:   patternColor   ?? p.patternColor   ?? "#111111",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      flapSpeed:      flapSpeed      ?? 1,
      speed:          speed          ?? 1,
      attractRadius:  attractRadius  ?? 120,
      interactive:    interactive    ?? true,
      showTrails:     showTrails     ?? false,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

ButterflySwarm.displayName = "ButterflySwarm";
