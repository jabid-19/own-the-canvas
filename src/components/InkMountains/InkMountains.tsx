import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useInkMountains } from "./useInkMountains";

type InkMountainsPreset = "default" | "sumi" | "night" | "jade" | "dusk" | "monochrome";

interface InkMountainsPresetValues {
  paperColor?: string;
  inkColor?: string;
  sunColor?: string;
}

const PRESETS: Record<InkMountainsPreset, InkMountainsPresetValues> = {
  default: { paperColor: "#efe8d8", inkColor: "#141414", sunColor: "#b91c1c" },
  monochrome: {},
  sumi: { paperColor: "#efe8d8", inkColor: "#141414", sunColor: "#b91c1c" },
  night: { paperColor: "#0d1117", inkColor: "#e5e7eb", sunColor: "#f8fafc" },
  jade: { paperColor: "#e6efe9", inkColor: "#0f3d2e", sunColor: "#c2410c" },
  dusk: { paperColor: "#f3e3d3", inkColor: "#3b1d2e", sunColor: "#e11d48" },
};

export interface InkMountainsProps extends BaseCanvasProps {
  /** Paper (background) color; distant ranges fade toward it (default: "#efe8d8") */
  paperColor?: string;
  /** Ink color of the nearest ridge (default: "#141414") */
  inkColor?: string;
  /** Sun disc color (default: "#b91c1c") */
  sunColor?: string;
  /** Mountain ranges, far to near (default: 5) */
  layers?: number;
  /** Fog density between ranges (default: 1) */
  mist?: number;
  /** Slow camera pan speed; 0 = still (default: 1) */
  drift?: number;
  /** Birds crossing the sky (default: 5) */
  birds?: number;
  /** Pines on the near ridges (default: true) */
  pines?: boolean;
  /** Cursor shifts the layers for depth (default: true) */
  parallax?: boolean;
  /** Named preset */
  preset?: InkMountainsPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const InkMountains = forwardRef<HTMLCanvasElement, InkMountainsProps>((props, ref) => {
  const {
    preset, paperColor, inkColor, sunColor, layers, mist, drift, birds, pines, parallax,
    overlay, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as InkMountainsPreset] || {};

  const { canvasRef, canvas } = useInkMountains({
    paperColor: paperColor ?? p.paperColor ?? "#f2efe6",
    inkColor:   inkColor ?? p.inkColor ?? "#111111",
    sunColor:   sunColor ?? p.sunColor ?? "#6b7280",
    layers:     Math.max(1, Math.min(9, Math.round((layers ?? 5)))),
    mist:       mist ?? 1,
    drift:      drift ?? 1,
    birds:      Math.max(0, Math.round((birds ?? 5))),
    pines:      pines ?? true,
    parallax:   parallax ?? true,
    overlay:    overlay ?? false,
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

InkMountains.displayName = "InkMountains";
