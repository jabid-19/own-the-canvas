import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useFireflies } from "./useFireflies";
import { resolvePreset } from "../../utils/props";

type FirefliesPreset = "default" | "summer" | "riverbank" | "blue-ghost" | "ember" | "monochrome";

interface FirefliesPresetValues {
  color?: string;
  backgroundColor?: string;
  sync?: number;
  period?: number;
  glow?: number;
}

const PRESETS: Record<FirefliesPreset, FirefliesPresetValues> = {
  default: { color: "#d9f99d", backgroundColor: "#06100a" },
  monochrome: {},
  summer:       { color: "#d9f99d", backgroundColor: "#06100a", glow: 22 },
  riverbank:    { color: "#facc15", backgroundColor: "#050806", sync: 0.14, period: 1.2 },
  "blue-ghost": { color: "#7dd3fc", backgroundColor: "#03070d", sync: 0.04, period: 2.2, glow: 26 },
  ember:        { color: "#fb923c", backgroundColor: "#0c0503", sync: 0.1 },
};

export interface FirefliesProps extends BaseCanvasProps {
  /** Number of fireflies (default: 60) */
  count?: number;
  /** Glow color (default: "#d9f99d") */
  color?: string;
  /** Background color, ignored in overlay mode (default: "#06100a") */
  backgroundColor?: string;
  /** Core dot radius in px (default: 2.2) */
  size?: number;
  /** Halo radius in px (default: 18) */
  glow?: number;
  /** Seconds between flashes (default: 1.6) */
  period?: number;
  /** Coupling strength: how fast flashing falls into sync, 0 = never (default: 0.08) */
  sync?: number;
  /** Fireflies only see flashes within this distance in px (default: 160) */
  syncRadius?: number;
  /** Flight speed multiplier (default: 1) */
  speed?: number;
  /** Gather around the cursor; tap to trigger a flash wave (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: FirefliesPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Fireflies perch on elements marked `data-otc-solid` (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const Fireflies = forwardRef<HTMLCanvasElement, FirefliesProps>((props, ref) => {
  const {
    preset, count, color, backgroundColor, size, glow, period, sync, syncRadius, speed,
    interactive, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("Fireflies", PRESETS, props);

  const { canvasRef, canvas } = useFireflies({
    count:           count           ?? 60,
    color:           color           ?? p.color           ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    size:            Math.max(0, size            ?? 2.2),
    glow:            glow            ?? p.glow            ?? 18,
    period:          period          ?? p.period          ?? 1.6,
    sync:            sync            ?? p.sync            ?? 0.08,
    syncRadius:      syncRadius      ?? 160,
    speed:           speed           ?? 1,
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

Fireflies.displayName = "Fireflies";
