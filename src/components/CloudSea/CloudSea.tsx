import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useCloudSea } from "./useCloudSea";
import { resolvePreset } from "../../utils/props";

type CloudSeaPreset = "default" | "sunset" | "dawn" | "golden" | "stormy" | "monochrome";

interface CloudSeaPresetValues {
  skyColor?: string;
  sunColor?: string;
  cloudColor?: string;
  shadowColor?: string;
  coverage?: number;
}

const PRESETS: Record<CloudSeaPreset, CloudSeaPresetValues> = {
  default: { skyColor: "#1e1b4b", sunColor: "#fb923c", cloudColor: "#fde2cf", shadowColor: "#8a6f8e" },
  monochrome: {},
  sunset: { skyColor: "#1e1b4b", sunColor: "#fb923c", cloudColor: "#fde2cf", shadowColor: "#8a6f8e" },
  dawn: { skyColor: "#0c4a6e", sunColor: "#fde68a", cloudColor: "#fef3c7", shadowColor: "#7c8fa6" },
  golden: { skyColor: "#422006", sunColor: "#fbbf24", cloudColor: "#fff1c1", shadowColor: "#8a5a2b" },
  stormy: { skyColor: "#0f172a", sunColor: "#cbd5e1", cloudColor: "#94a3b8", shadowColor: "#1e293b", coverage: 0.8 },
};

export interface CloudSeaProps extends BaseCanvasProps {
  /** Upper sky color, ignored in overlay mode (default: "#1e1b4b") */
  skyColor?: string;
  /** Sun and rim-light color (default: "#fb923c") */
  sunColor?: string;
  /** Lit cloud color (default: "#fde2cf") */
  cloudColor?: string;
  /** Cloud shadow color (default: "#8a6f8e") */
  shadowColor?: string;
  /** Horizon height, 0..1 of canvas (default: 0.36) */
  horizon?: number;
  /** Cloud coverage, 0 = clear, 1 = overcast (default: 0.55) */
  coverage?: number;
  /** Drift speed multiplier (default: 1) */
  speed?: number;
  /** Cursor parts the clouds (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: CloudSeaPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const CloudSea = forwardRef<HTMLCanvasElement, CloudSeaProps>((props, ref) => {
  const {
    preset, skyColor, sunColor, cloudColor, shadowColor, horizon, coverage, speed, interactive,
    overlay, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("CloudSea", PRESETS, props);

  const { canvasRef, canvas } = useCloudSea({
    skyColor:    skyColor ?? p.skyColor ?? "#111111",
    sunColor:    sunColor ?? p.sunColor ?? "#ffffff",
    cloudColor:  cloudColor ?? p.cloudColor ?? "#d1d5db",
    shadowColor: shadowColor ?? p.shadowColor ?? "#4b5563",
    horizon:     horizon ?? 0.36,
    coverage:    coverage ?? p.coverage ?? 0.55,
    speed:       speed ?? 1,
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

CloudSea.displayName = "CloudSea";
