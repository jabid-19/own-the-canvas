import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { usePaperLanterns } from "./usePaperLanterns";

type PaperLanternsPreset = "default" | "festival" | "lotus" | "moon" | "jade" | "monochrome";

interface PaperLanternsPresetValues {
  color?: string;
  glowColor?: string;
  backgroundColor?: string;
}

const PRESETS: Record<PaperLanternsPreset, PaperLanternsPresetValues> = {
  default: { color: "#ff8a3d", glowColor: "#ffd27a", backgroundColor: "#0b0612" },
  monochrome: {},
  festival: { color: "#ff8a3d", glowColor: "#ffd27a", backgroundColor: "#0b0612" },
  lotus:    { color: "#ff9eb5", glowColor: "#ffe1a8", backgroundColor: "#0a0710" },
  moon:     { color: "#f3e8d0", glowColor: "#fff3c4", backgroundColor: "#070b16" },
  jade:     { color: "#7ee0b0", glowColor: "#e6ffb3", backgroundColor: "#04110c" },
};

export interface PaperLanternsProps extends BaseCanvasProps {
  /** Max lanterns aloft (default: 22) */
  count?: number;
  /** Paper color (default: "#ff8a3d") */
  color?: string;
  /** Flame and halo color (default: "#ffd27a") */
  glowColor?: string;
  /** Background color, ignored in overlay mode (default: "#0b0612") */
  backgroundColor?: string;
  /** Size of the nearest lanterns in px (default: 34) */
  size?: number;
  /** Rise speed multiplier (default: 1) */
  riseSpeed?: number;
  /** Horizontal drift; negative drifts left (default: 0.3) */
  wind?: number;
  /** Keep releasing lanterns from below (default: true) */
  autoRelease?: boolean;
  /** Tap to release a lantern (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: PaperLanternsPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Tapping an element marked `data-otc-solid` releases a lantern from its top edge (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const PaperLanterns = forwardRef<HTMLCanvasElement, PaperLanternsProps>((props, ref) => {
  const {
    preset, count, color, glowColor, backgroundColor, size, riseSpeed, wind, autoRelease,
    interactive, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as PaperLanternsPreset] || {};

  const { canvasRef, canvas } = usePaperLanterns({
    count:           Math.max(0, count ?? 22),
    color:           color           ?? p.color           ?? "#d1d5db",
    glowColor:       glowColor       ?? p.glowColor       ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    size:            size            ?? 34,
    riseSpeed:       riseSpeed       ?? 1,
    wind:            wind            ?? 0.3,
    autoRelease:     autoRelease     ?? true,
    interactive:     interactive     ?? true,
    overlay:         overlay         ?? false,
    collide:         collide         ?? false,
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

PaperLanterns.displayName = "PaperLanterns";
