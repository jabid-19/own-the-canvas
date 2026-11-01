import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useOrigamiCranes } from "./useOrigamiCranes";

type OrigamiCranesPreset = "default" | "senbazuru" | "washi" | "white-paper" | "gold" | "monochrome";

interface OrigamiCranesPresetValues {
  colors?: string[];
  backgroundColor?: string;
}

const PRESETS: Record<OrigamiCranesPreset, OrigamiCranesPresetValues> = {
  default: { colors: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"], backgroundColor: "#0f0f14" },
  monochrome: {},
  senbazuru: { colors: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"], backgroundColor: "#0f0f14" },
  washi: { colors: ["#f5e6c8", "#e8c39e", "#c97b63", "#7a9e7e"], backgroundColor: "#1b1814" },
  "white-paper": { colors: ["#ffffff", "#f1f5f9"], backgroundColor: "#0b1220" },
  gold: { colors: ["#f5c96a", "#e0a94a", "#fff1c1"], backgroundColor: "#0e0b06" },
};

export interface OrigamiCranesProps extends BaseCanvasProps {
  /** Number of cranes (default: 14) */
  count?: number;
  /** Paper colors, assigned per crane (default: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]) */
  colors?: string[];
  /** Background color, ignored in overlay mode (default: "#0f0f14") */
  backgroundColor?: string;
  /** Crane size multiplier (default: 1.6) */
  size?: number;
  /** Flight speed multiplier (default: 1) */
  speed?: number;
  /** Cranes circle the cursor (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: OrigamiCranesPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Cranes land on elements marked `data-otc-solid`, rest with wings folded, then take off (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const OrigamiCranes = forwardRef<HTMLCanvasElement, OrigamiCranesProps>((props, ref) => {
  const {
    preset, count, colors, backgroundColor, size, speed, interactive,
    overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as OrigamiCranesPreset] || {};

  const { canvasRef, canvas } = useOrigamiCranes({
    count:           Math.max(0, Math.round((count ?? 14))),
    colors:          colors ?? p.colors ?? ["#ffffff", "#d1d5db", "#9ca3af"],
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    size:            size ?? 1.6,
    speed:           speed ?? 1,
    interactive:     interactive ?? true,
    overlay:         overlay ?? false,
    collide:         collide ?? false,
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

OrigamiCranes.displayName = "OrigamiCranes";
