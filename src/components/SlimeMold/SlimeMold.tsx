import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSlimeMold } from "./useSlimeMold";

type SlimeMoldPreset = "default" | "neon" | "coral" | "vein" | "frost" | "gold";

interface SlimeMoldPresetValues {
  trailColor?: string;
  backgroundColor?: string;
  trailDecay?: number;
  agentCount?: number;
}

const PRESETS: Record<SlimeMoldPreset, SlimeMoldPresetValues> = {
  default: {},
  neon:    { trailColor: "#00ffff", backgroundColor: "#000000" },
  coral:   { trailColor: "#ff8844", backgroundColor: "#0a0200" },
  vein:    { trailColor: "#ff2244", backgroundColor: "#080000", agentCount: 3000 },
  frost:   { trailColor: "#88ddff", backgroundColor: "#000a10" },
  gold:    { trailColor: "#ffcc44", backgroundColor: "#0a0800" },
};

export interface SlimeMoldProps extends BaseCanvasProps {
  /** Number of physarum agents (default: 1800) */
  agentCount?: number;
  /** Degrees between left/center/right sensors (default: 45) */
  sensorAngle?: number;
  /** Grid pixels ahead sensor samples (default: 9) */
  sensorDistance?: number;
  /** Agent movement per frame in grid coords (default: 1.5) */
  stepSize?: number;
  /** Max rotation toward strongest sensor in degrees (default: 45) */
  rotateSpeed?: number;
  /** Trail evaporation multiplier per frame (default: 0.92) */
  trailDecay?: number;
  /** 3×3 blur weight for trail diffusion (default: 0.2) */
  diffuseStrength?: number;
  /** Color at max trail concentration (default: "#ffffff") */
  trailColor?: string;
  /** Color at zero trail (default: "#111111") */
  backgroundColor?: string;
  /** Trail grid resolution fraction (default: 0.35) */
  resolution?: number;
  /** Mouse deposits pheromone attracting agents (default: true) */
  interactive?: boolean;
  /** Mouse pheromone deposit radius in px (default: 20) */
  mouseRadius?: number;
  /** Pheromone deposit amount per frame (default: 3) */
  mouseStrength?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Named preset */
  preset?: SlimeMoldPreset | string;
}

export const SlimeMold = forwardRef<HTMLCanvasElement, SlimeMoldProps>(
  (props, ref) => {
    const {
      preset, agentCount, sensorAngle, sensorDistance, stepSize,
      rotateSpeed, trailDecay, diffuseStrength, trailColor,
      backgroundColor, resolution, interactive, mouseRadius,
      mouseStrength, animated,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as SlimeMoldPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useSlimeMold(internalRef, {
      agentCount:      agentCount      ?? p.agentCount      ?? 1800,
      sensorAngle:     sensorAngle     ?? 45,
      sensorDistance:  sensorDistance  ?? 9,
      stepSize:        stepSize        ?? 1.5,
      rotateSpeed:     rotateSpeed     ?? 45,
      trailDecay:      trailDecay      ?? p.trailDecay      ?? 0.92,
      diffuseStrength: diffuseStrength ?? 0.2,
      trailColor:      trailColor      ?? p.trailColor      ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      resolution:      resolution      ?? 0.35,
      interactive:     interactive     ?? true,
      mouseRadius:     mouseRadius     ?? 20,
      mouseStrength:   mouseStrength   ?? 3,
      animated:        animated        ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
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

SlimeMold.displayName = "SlimeMold";
