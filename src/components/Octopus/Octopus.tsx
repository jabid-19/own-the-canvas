import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useOctopus } from "./useOctopus";
import { resolvePreset } from "../../utils/props";

type OctopusPreset = "default" | "blue-ringed" | "ghost" | "abyss" | "sand" | "monochrome";

interface OctopusPresetValues {
  skinColor?: string;
  spotColor?: string;
  suckerColor?: string;
  eyeColor?: string;
  inkColor?: string;
  backgroundColor?: string;
}

export const PRESETS: Record<OctopusPreset, OctopusPresetValues> = {
  default:       { skinColor: "#c4553a", spotColor: "#7a2a1c", suckerColor: "#f2c4a8", eyeColor: "#e8c25a", inkColor: "#140b12", backgroundColor: "#04131c" },
  monochrome:    {},
  "blue-ringed": { skinColor: "#d9b44a", spotColor: "#2fb8ff", suckerColor: "#f3e2b0", eyeColor: "#f0d070", inkColor: "#0d0a12", backgroundColor: "#03121a" },
  ghost:         { skinColor: "#d8dde6", spotColor: "#9fb4d8", suckerColor: "#ffffff", eyeColor: "#b8e6ff", inkColor: "#1a1f2e", backgroundColor: "#020812" },
  abyss:         { skinColor: "#5b2f7a", spotColor: "#e05cff", suckerColor: "#d7b6f0", eyeColor: "#ffcf5a", inkColor: "#05030a", backgroundColor: "#02030a" },
  sand:          { skinColor: "#b89a72", spotColor: "#5e4630", suckerColor: "#efe0c8", eyeColor: "#e2c27a", inkColor: "#120d08", backgroundColor: "#0b0f12" },
};

export interface OctopusProps extends BaseCanvasProps {
  /** Skin color; it deepens when excited and blanches when startled (default: "#c4553a") */
  skinColor?: string;
  /** Chromatophore ring color; rings flare when excited (default: "#7a2a1c") */
  spotColor?: string;
  /** Sucker color (default: "#f2c4a8") */
  suckerColor?: string;
  /** Eye color (default: "#e8c25a") */
  eyeColor?: string;
  /** Ink cloud color (default: "#140b12") */
  inkColor?: string;
  /** Water color; "transparent" drops the scene (default: "#04131c") */
  backgroundColor?: string;
  /** Octopus scale (default: 1) */
  size?: number;
  /** Arm length multiplier (default: 1) */
  tentacleLength?: number;
  /** Swim toward the cursor and coil the nearest arms around it (default: true) */
  followCursor?: boolean;
  /** Tap to make it squirt ink and jet away (default: true) */
  interactive?: boolean;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Arms grab the edges of elements marked `data-otc-solid` (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
  /** Named preset: "default" | "blue-ringed" | "ghost" | "abyss" | "sand" | "monochrome" */
  preset?: OctopusPreset | string;
}

export const Octopus = forwardRef<HTMLCanvasElement, OctopusProps>((props, ref) => {
  const {
    preset, skinColor, spotColor, suckerColor, eyeColor, inkColor, backgroundColor, size, tentacleLength,
    followCursor, interactive, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("Octopus", PRESETS, props);

  const { canvasRef, canvas } = useOctopus({
    skinColor:       skinColor       ?? p.skinColor       ?? "#9ca3af",
    spotColor:       spotColor       ?? p.spotColor       ?? "#4b5563",
    suckerColor:     suckerColor     ?? p.suckerColor     ?? "#e5e7eb",
    eyeColor:        eyeColor        ?? p.eyeColor        ?? "#d1d5db",
    inkColor:        inkColor        ?? p.inkColor        ?? "#0a0a0a",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    size:            size            ?? 1,
    tentacleLength:  tentacleLength  ?? 1,
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

Octopus.displayName = "Octopus";
