import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useWindowRain } from "./useWindowRain";

type WindowRainPreset = "default" | "city-night" | "neon" | "cafe" | "storm" | "monochrome";

interface WindowRainPresetValues {
  lightColors?: string[];
  backgroundColor?: string;
  fogColor?: string;
  fog?: number;
}

const PRESETS: Record<WindowRainPreset, WindowRainPresetValues> = {
  default: { lightColors: ["#fbbf24", "#f97316", "#ef4444", "#38bdf8", "#a78bfa", "#fde68a"], backgroundColor: "#07090f", fogColor: "#94a3b8" },
  monochrome: {},
  "city-night": { lightColors: ["#fbbf24", "#f97316", "#ef4444", "#38bdf8", "#a78bfa", "#fde68a"], backgroundColor: "#07090f", fogColor: "#94a3b8" },
  neon: { lightColors: ["#f0abfc", "#22d3ee", "#f472b6", "#a78bfa", "#34d399"], backgroundColor: "#05030a", fogColor: "#a78bfa" },
  cafe: { lightColors: ["#fcd34d", "#fb923c", "#fde68a"], backgroundColor: "#120b06", fogColor: "#d6b98c", fog: 0.3 },
  storm: { lightColors: ["#e2e8f0", "#94a3b8", "#64748b"], backgroundColor: "#0b0f14", fogColor: "#cbd5e1", fog: 0.35 },
};

export interface WindowRainProps extends BaseCanvasProps {
  /** Colors of the out-of-focus lights behind the glass (default: ["#fbbf24", "#f97316", "#ef4444", "#38bdf8", "#a78bfa", "#fde68a"]) */
  lightColors?: string[];
  /** Night behind the glass, ignored in overlay mode (default: "#07090f") */
  backgroundColor?: string;
  /** Condensation color (default: "#94a3b8") */
  fogColor?: string;
  /** Rain intensity (default: 1) */
  rain?: number;
  /** Drop size multiplier (default: 1) */
  dropSize?: number;
  /** Condensation opacity, 0..1 (default: 0.25) */
  fog?: number;
  /** Number of blurred lights (default: 34) */
  lights?: number;
  /** Cursor wipes the glass (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: WindowRainPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const WindowRain = forwardRef<HTMLCanvasElement, WindowRainProps>((props, ref) => {
  const {
    preset, lightColors, backgroundColor, fogColor, rain, dropSize, fog, lights, interactive,
    overlay, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as WindowRainPreset] || {};

  const { canvasRef, canvas } = useWindowRain({
    lightColors:     lightColors ?? p.lightColors ?? ["#ffffff", "#9ca3af", "#6b7280"],
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    fogColor:        fogColor ?? p.fogColor ?? "#9ca3af",
    rain:            rain ?? 1,
    dropSize:        dropSize ?? 1,
    fog:             fog ?? p.fog ?? 0.25,
    lights:          Math.max(0, Math.round((lights ?? 34))),
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

WindowRain.displayName = "WindowRain";
