import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useDeepSeaBioluminescence } from "./useDeepSeaBioluminescence";

type DeepSeaBioluminescencePreset = "default" | "abyssal" | "coral" | "aurora" | "crimson";

interface DeepSeaBioluminescencePresetValues {
  jellyfishColor?: string;
  glowColor?: string;
  waterColor?: string;
}

export const PRESETS: Record<DeepSeaBioluminescencePreset, DeepSeaBioluminescencePresetValues> = {
  default:  {},
  abyssal:  { jellyfishColor: "#8855cc", glowColor: "#aa55ff", waterColor: "#020008" },
  coral:    { jellyfishColor: "#ff8855", glowColor: "#ffaa44", waterColor: "#040a0c" },
  aurora:   { jellyfishColor: "#44ffaa", glowColor: "#00ff88", waterColor: "#020c08" },
  crimson:  { jellyfishColor: "#ff3344", glowColor: "#ff2244", waterColor: "#080002" },
};

export interface DeepSeaBioluminescenceProps extends BaseCanvasProps {
  /** Number of jellyfish (default: 5) */
  jellyfishCount?: number;
  /** Number of plankton particles (default: 200) */
  planktonCount?: number;
  /** Jellyfish bell color (default: "#88ccff") */
  jellyfishColor?: string;
  /** Bioluminescent glow color (default: "#00ffcc") */
  glowColor?: string;
  /** Background water color (default: "#020c14") */
  waterColor?: string;
  /** Cursor movement spawns bioluminescent ripples (default: true) */
  interactive?: boolean;
  /** Overall animation speed multiplier (default: 1) */
  speed?: number;
  /** Named preset */
  preset?: DeepSeaBioluminescencePreset | string;
}

export const DeepSeaBioluminescence = forwardRef<HTMLCanvasElement, DeepSeaBioluminescenceProps>(
  (props, ref) => {
    const {
      preset, jellyfishCount, planktonCount, jellyfishColor, glowColor,
      waterColor, interactive, speed,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as DeepSeaBioluminescencePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useDeepSeaBioluminescence(internalRef, {
      jellyfishCount:  jellyfishCount  ?? 5,
      planktonCount:   planktonCount   ?? 200,
      jellyfishColor:  jellyfishColor  ?? p.jellyfishColor ?? "#99bbcc",
      glowColor:       glowColor       ?? p.glowColor      ?? "#aaccdd",
      waterColor:      waterColor      ?? p.waterColor      ?? "#060c10",
      interactive:     interactive     ?? true,
      speed:           speed           ?? 1,
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

DeepSeaBioluminescence.displayName = "DeepSeaBioluminescence";
