import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useCat } from "./useCat";

type CatPreset = "default" | "tuxedo" | "siamese" | "grey" | "midnight" | "monochrome";

interface CatPresetValues {
  furColor?: string;
  stripeColor?: string;
  bellyColor?: string;
  eyeColor?: string;
  cushionColor?: string;
  backgroundColor?: string;
}

export const PRESETS: Record<CatPreset, CatPresetValues> = {
  default:  { furColor: "#d9822b", stripeColor: "#8f4a16", bellyColor: "#f4dcc0", eyeColor: "#9cc23a", cushionColor: "#7a2f3d", backgroundColor: "#140f16" },
  monochrome: {},
  tuxedo:   { furColor: "#24232a", stripeColor: "#1a191f", bellyColor: "#f1efea", eyeColor: "#e3b23c", cushionColor: "#2f5d62", backgroundColor: "#0e1013" },
  siamese:  { furColor: "#eadcc6", stripeColor: "#6b4a37", bellyColor: "#f7efe2", eyeColor: "#4aa3e0", cushionColor: "#5a3f6b", backgroundColor: "#100d14" },
  grey:     { furColor: "#8a8f99", stripeColor: "#555a64", bellyColor: "#cfd2d8", eyeColor: "#d9a73a", cushionColor: "#8a5a3c", backgroundColor: "#0f1115" },
  midnight: { furColor: "#18171c", stripeColor: "#0d0c10", bellyColor: "#2c2a33", eyeColor: "#f1c232", cushionColor: "#2d4a63", backgroundColor: "#06070c" },
};

export interface CatProps extends BaseCanvasProps {
  /** Main coat color (default: "#d9822b") */
  furColor?: string;
  /** Tabby stripes, tail bands and tail tip (default: "#8f4a16") */
  stripeColor?: string;
  /** Chest, muzzle and paws (default: "#f4dcc0") */
  bellyColor?: string;
  /** Iris color, seen when it opens an eye (default: "#9cc23a") */
  eyeColor?: string;
  /** Cushion color (default: "#7a2f3d") */
  cushionColor?: string;
  /** Room color; "transparent" drops the scene (default: "#140f16") */
  backgroundColor?: string;
  /** Cat scale (default: 1) */
  size?: number;
  /** Ears flick at nearby movement and an eye cracks open to watch the cursor (default: true) */
  followCursor?: boolean;
  /** Hover slowly to pet (it purrs and kneads); tap to startle it awake (default: true) */
  interactive?: boolean;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Nap on top of an element marked `data-otc-solid` instead of a cushion (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
  /** Named preset: "default" | "tuxedo" | "siamese" | "grey" | "midnight" | "monochrome" */
  preset?: CatPreset | string;
}

export const Cat = forwardRef<HTMLCanvasElement, CatProps>((props, ref) => {
  const {
    preset, furColor, stripeColor, bellyColor, eyeColor, cushionColor, backgroundColor,
    size, followCursor, interactive, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as CatPreset] || {};

  const { canvasRef, canvas } = useCat({
    furColor:        furColor        ?? p.furColor        ?? "#9ca3af",
    stripeColor:     stripeColor     ?? p.stripeColor     ?? "#6b7280",
    bellyColor:      bellyColor      ?? p.bellyColor      ?? "#e5e7eb",
    eyeColor:        eyeColor        ?? p.eyeColor        ?? "#e5e7eb",
    cushionColor:    cushionColor    ?? p.cushionColor    ?? "#4b5563",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    size:            size            ?? 1,
    followCursor:    followCursor    ?? true,
    interactive:     interactive     ?? true,
    overlay:         overlay         ?? false,
    collide:         collide         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas canvasRef={canvasRef} overlay={overlay} zIndex={zIndex} width={width} height={height} className={className} style={style} />
  );
});

Cat.displayName = "Cat";
