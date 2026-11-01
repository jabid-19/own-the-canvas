import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useFerrofluid } from "./useFerrofluid";

type FerrofluidPreset = "default" | "studio" | "noir" | "gold" | "oil-slick" | "monochrome";

interface FerrofluidPresetValues {
  fluidColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
}

const PRESETS: Record<FerrofluidPreset, FerrofluidPresetValues> = {
  default: { backgroundColor: "#ececec", fluidColor: "#050505", highlightColor: "#ffffff" },
  monochrome: {},
  studio: { backgroundColor: "#ececec", fluidColor: "#050505", highlightColor: "#ffffff" },
  noir: { backgroundColor: "#0a0a0a", fluidColor: "#000000", highlightColor: "#9ca3af" },
  gold: { backgroundColor: "#120d05", fluidColor: "#1a1206", highlightColor: "#f5c96a" },
  "oil-slick": { backgroundColor: "#0b0b12", fluidColor: "#05050a", highlightColor: "#a78bfa" },
};

export interface FerrofluidProps extends BaseCanvasProps {
  /** Fluid color (default: "#050505") */
  fluidColor?: string;
  /** Specular highlight color (default: "#ffffff") */
  highlightColor?: string;
  /** Background color, ignored in overlay mode (default: "#ececec") */
  backgroundColor?: string;
  /** Spikes per row (default: 9) */
  spikes?: number;
  /** Spike height multiplier (default: 1) */
  spikeHeight?: number;
  /** Pool width as a fraction of canvas width (default: 0.5) */
  poolWidth?: number;
  /** Magnet strength (default: 1) */
  strength?: number;
  /** Mirror reflection on the table (default: true) */
  reflection?: boolean;
  /** Cursor acts as the magnet; click pulses (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: FerrofluidPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const Ferrofluid = forwardRef<HTMLCanvasElement, FerrofluidProps>((props, ref) => {
  const {
    preset, fluidColor, highlightColor, backgroundColor, spikes, spikeHeight, poolWidth, strength, reflection, interactive,
    overlay, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as FerrofluidPreset] || {};

  const { canvasRef, canvas } = useFerrofluid({
    fluidColor:      fluidColor ?? p.fluidColor ?? "#050505",
    highlightColor:  highlightColor ?? p.highlightColor ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#e5e5e5",
    spikes:          Math.max(3, Math.min(24, Math.round((spikes ?? 9)))),
    spikeHeight:     spikeHeight ?? 1,
    poolWidth:       poolWidth ?? 0.5,
    strength:        strength ?? 1,
    reflection:      reflection ?? true,
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

Ferrofluid.displayName = "Ferrofluid";
