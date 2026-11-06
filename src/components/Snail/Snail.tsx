import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useSnail } from "./useSnail";

type SnailPreset = "default" | "amber" | "forest" | "candy" | "nocturne" | "monochrome";

interface SnailPresetValues {
  shellColor?: string;
  bodyColor?: string;
  trailColor?: string;
  backgroundColor?: string;
}

export const PRESETS: Record<SnailPreset, SnailPresetValues> = {
  default:    { shellColor: "#b5773f", bodyColor: "#a8988a", trailColor: "#cfe6ff", backgroundColor: "#0f1a12" },
  monochrome: {},
  amber:      { shellColor: "#e0a03a", bodyColor: "#c9b49a", trailColor: "#fff1c9", backgroundColor: "#1a1208" },
  forest:     { shellColor: "#6f5a33", bodyColor: "#7d7466", trailColor: "#d6f5c8", backgroundColor: "#07140b" },
  candy:      { shellColor: "#e47aa8", bodyColor: "#e8cfc4", trailColor: "#ffd6f0", backgroundColor: "#170b18" },
  nocturne:   { shellColor: "#4f6aa8", bodyColor: "#8a93a6", trailColor: "#9fe8ff", backgroundColor: "#050811" },
};

export interface SnailProps extends BaseCanvasProps {
  /** Shell color (default: "#b5773f") */
  shellColor?: string;
  /** Body (foot, head and stalks) color (default: "#a8988a") */
  bodyColor?: string;
  /** Slime trail glint (default: "#cfe6ff") */
  trailColor?: string;
  /** Garden color; "transparent" drops the scene (default: "#0f1a12") */
  backgroundColor?: string;
  /** Snail scale (default: 1) */
  size?: number;
  /** Crawl speed multiplier (default: 1) */
  speed?: number;
  /** Leave a slime trail that slowly dries (default: true) */
  trail?: boolean;
  /** Eye stalks follow the cursor; poke them, move fast or tap and it hides in its shell (default: true) */
  interactive?: boolean;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Crawl along the top of an element marked `data-otc-solid` (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
  /** Named preset: "default" | "amber" | "forest" | "candy" | "nocturne" | "monochrome" */
  preset?: SnailPreset | string;
}

export const Snail = forwardRef<HTMLCanvasElement, SnailProps>((props, ref) => {
  const {
    preset, shellColor, bodyColor, trailColor, backgroundColor, size, speed, trail,
    interactive, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as SnailPreset] || {};

  const { canvasRef, canvas } = useSnail({
    shellColor:      shellColor      ?? p.shellColor      ?? "#9ca3af",
    bodyColor:       bodyColor       ?? p.bodyColor       ?? "#6b7280",
    trailColor:      trailColor      ?? p.trailColor      ?? "#e5e7eb",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    size:            size            ?? 1,
    speed:           speed           ?? 1,
    trail:           trail           ?? true,
    interactive:     interactive     ?? true,
    overlay:         overlay         ?? false,
    collide:         collide         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas canvasRef={canvasRef} overlay={overlay} zIndex={zIndex} width={width} height={height} className={className} style={style} />
  );
});

Snail.displayName = "Snail";
