import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useWormhole } from "./useWormhole";

type WormholePreset = "default" | "hyperspace" | "neon" | "vortex" | "minimal";

interface WormholePresetValues {
  ringCount?: number;
  speed?: number;
  colors?: string[];
  backgroundColor?: string;
  twist?: number;
  fov?: number;
  depth?: number;
  lineWidth?: number;
  opacity?: number;
  starCount?: number;
  starColor?: string;
  interactive?: boolean;
}

const PRESETS: Record<WormholePreset, WormholePresetValues> = {
  default: {
    colors: ["#ffffff", "#6b7280"],
    backgroundColor: "#111111",
  },
  hyperspace: {
    colors: ["#ffffff", "#88aaff", "#aaddff"],
    speed: 3,
    starCount: 200,
    twist: 0,
    lineWidth: 1,
    backgroundColor: "#000005",
  },
  neon: {
    colors: ["#00ffff", "#ff00ff", "#00ff41"],
    twist: 0.5,
    lineWidth: 2,
    backgroundColor: "#000000",
    opacity: 0.9,
  },
  vortex: {
    colors: ["#7C3AED", "#a855f7", "#c084fc"],
    twist: 1.2,
    speed: 1.5,
    backgroundColor: "#05000a",
  },
  minimal: {
    colors: ["#334155"],
    backgroundColor: "#0f172a",
    starCount: 50,
    lineWidth: 1,
    opacity: 0.5,
    speed: 0.6,
  },
};

export interface WormholeProps extends BaseCanvasProps {
  /** Number of tunnel rings. (default: 30) */
  ringCount?: number;
  /** Forward travel speed. (default: 1) */
  speed?: number;
  /** Ring stroke colors — cycles through array. (default: ["#7C3AED","#0891B2"]) */
  colors?: string[];
  /** Canvas background color. (default: "#000000") */
  backgroundColor?: string;
  /** Rotation twist per unit depth. (default: 0.3) */
  twist?: number;
  /** Perspective field of view. (default: 300) */
  fov?: number;
  /** Perspective depth scale. (default: 400) */
  depth?: number;
  /** Ring stroke width. (default: 1.5) */
  lineWidth?: number;
  /** Ring opacity 0–1. (default: 0.8) */
  opacity?: number;
  /** Number of tunnel wall stars. (default: 100) */
  starCount?: number;
  /** Star dot color. (default: "#ffffff") */
  starColor?: string;
  /** Mouse X controls tunnel speed. (default: true) */
  interactive?: boolean;
  /** Named preset. */
  preset?: WormholePreset | string;
}

export const Wormhole = forwardRef<HTMLCanvasElement, WormholeProps>((props, ref) => {
  const {
    preset,
    ringCount, speed, colors, backgroundColor, twist, fov, depth,
    lineWidth, opacity, starCount, starColor, interactive,
    width, height, className, style,
  } = props;

  const p = (preset && PRESETS[preset as WormholePreset]) || {};

  const internalRef = useRef<HTMLCanvasElement | null>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

  useWormhole(internalRef, {
    ringCount:       ringCount       ?? p.ringCount       ?? 30,
    speed:           speed           ?? p.speed           ?? 1,
    colors:          colors          ?? p.colors          ?? ["#ffffff", "#6b7280"],
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    twist:           twist           ?? p.twist           ?? 0.3,
    fov:             fov             ?? p.fov             ?? 300,
    depth:           depth           ?? p.depth           ?? 400,
    lineWidth:       lineWidth       ?? p.lineWidth       ?? 1.5,
    opacity:         opacity         ?? p.opacity         ?? 0.8,
    starCount:       starCount       ?? p.starCount       ?? 100,
    starColor:       starColor       ?? p.starColor       ?? "#ffffff",
    interactive:     interactive     ?? p.interactive     ?? true,
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

Wormhole.displayName = "Wormhole";
