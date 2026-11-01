import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useMoonlitSea } from "./useMoonlitSea";

type MoonlitSeaPreset = "default" | "midnight" | "harvest" | "arctic" | "rose" | "monochrome";

interface MoonlitSeaPresetValues {
  seaColor?: string;
  skyColor?: string;
  moonColor?: string;
}

const PRESETS: Record<MoonlitSeaPreset, MoonlitSeaPresetValues> = {
  default: { seaColor: "#0b2236", skyColor: "#030712", moonColor: "#f8fafc" },
  monochrome: {},
  midnight: { seaColor: "#0b2236", skyColor: "#030712", moonColor: "#f8fafc" },
  harvest: { seaColor: "#1c1410", skyColor: "#0a0604", moonColor: "#fbbf24" },
  arctic: { seaColor: "#0f2a33", skyColor: "#04121a", moonColor: "#e0f2fe" },
  rose: { seaColor: "#2a1324", skyColor: "#0d0510", moonColor: "#fecdd3" },
};

export interface MoonlitSeaProps extends BaseCanvasProps {
  /** Water color (default: "#0b2236") */
  seaColor?: string;
  /** Night sky color, ignored in overlay mode (default: "#030712") */
  skyColor?: string;
  /** Moon, glitter, and star color (default: "#f8fafc") */
  moonColor?: string;
  /** Horizon height, 0..1 of canvas (default: 0.42) */
  horizon?: number;
  /** Moon position, 0..1 of width (default: 0.62) */
  moonX?: number;
  /** Swell height multiplier (default: 1) */
  waveHeight?: number;
  /** Wave speed multiplier (default: 1) */
  speed?: number;
  /** Number of stars (default: 120) */
  stars?: number;
  /** Cursor leaves ripples on the water (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: MoonlitSeaPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const MoonlitSea = forwardRef<HTMLCanvasElement, MoonlitSeaProps>((props, ref) => {
  const {
    preset, seaColor, skyColor, moonColor, horizon, moonX, waveHeight, speed, stars, interactive,
    overlay, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as MoonlitSeaPreset] || {};

  const { canvasRef, canvas } = useMoonlitSea({
    seaColor:    seaColor ?? p.seaColor ?? "#1f2937",
    skyColor:    skyColor ?? p.skyColor ?? "#111111",
    moonColor:   moonColor ?? p.moonColor ?? "#ffffff",
    horizon:     horizon ?? 0.42,
    moonX:       moonX ?? 0.62,
    waveHeight:  waveHeight ?? 1,
    speed:       speed ?? 1,
    stars:       Math.max(0, Math.round((stars ?? 120))),
    interactive: interactive ?? true,
    overlay:     overlay ?? false,
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

MoonlitSea.displayName = "MoonlitSea";
