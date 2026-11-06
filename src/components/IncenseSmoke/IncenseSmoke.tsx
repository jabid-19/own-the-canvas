import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useIncenseSmoke } from "./useIncenseSmoke";
import { resolvePreset } from "../../utils/props";

type IncenseSmokePreset = "default" | "temple" | "sandalwood" | "moonlight" | "noir" | "monochrome";

interface IncenseSmokePresetValues {
  color?: string;
  emberColor?: string;
  stickColor?: string;
  backgroundColor?: string;
}

const PRESETS: Record<IncenseSmokePreset, IncenseSmokePresetValues> = {
  default: { color: "#e7e5e4", emberColor: "#ff6a2b", stickColor: "#5b4636", backgroundColor: "#0c0a09" },
  monochrome: {},
  temple: { color: "#e7e5e4", emberColor: "#ff6a2b", stickColor: "#5b4636", backgroundColor: "#0c0a09" },
  sandalwood: { color: "#f5e6d3", emberColor: "#ffb15c", stickColor: "#7a5230", backgroundColor: "#140d08" },
  moonlight: { color: "#cbd5e1", emberColor: "#fde68a", stickColor: "#475569", backgroundColor: "#05070d" },
  noir: { color: "#ffffff", emberColor: "#ffffff", stickColor: "#3f3f46", backgroundColor: "#000000" },
};

export interface IncenseSmokeProps extends BaseCanvasProps {
  /** Incense sticks (default: 1) */
  sticks?: number;
  /** Smoke color (default: "#e7e5e4") */
  color?: string;
  /** Glowing ember color (default: "#ff6a2b") */
  emberColor?: string;
  /** Stick color (default: "#5b4636") */
  stickColor?: string;
  /** Background color, ignored in overlay mode (default: "#0c0a09") */
  backgroundColor?: string;
  /** How strongly the plume curls once it breaks up (default: 1) */
  turbulence?: number;
  /** Rise speed multiplier (default: 1) */
  rise?: number;
  /** Smoke thickness multiplier (default: 1) */
  thickness?: number;
  /** Cursor stirs the smoke (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: IncenseSmokePreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const IncenseSmoke = forwardRef<HTMLCanvasElement, IncenseSmokeProps>((props, ref) => {
  const {
    preset, sticks, color, emberColor, stickColor, backgroundColor, turbulence, rise, thickness, interactive,
    overlay, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("IncenseSmoke", PRESETS, props);

  const { canvasRef, canvas } = useIncenseSmoke({
    sticks:          Math.max(1, Math.min(5, Math.round((sticks ?? 1)))),
    color:           color ?? p.color ?? "#ffffff",
    emberColor:      emberColor ?? p.emberColor ?? "#ffffff",
    stickColor:      stickColor ?? p.stickColor ?? "#6b7280",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    turbulence:      turbulence ?? 1,
    rise:            rise ?? 1,
    thickness:       thickness ?? 1,
    interactive:     interactive ?? true,
    overlay:         overlay ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas
      canvasRef={canvasRef}
      overlay={overlay}
      zIndex={zIndex}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
});

IncenseSmoke.displayName = "IncenseSmoke";
