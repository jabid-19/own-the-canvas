import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useEye, EyePupilShape } from "./useEye";
import { resolvePreset } from "../../utils/props";

type EyePreset = "default" | "ocean" | "amber" | "violet" | "serpent" | "monochrome";

interface EyePresetValues {
  irisColor?: string;
  irisInnerColor?: string;
  scleraColor?: string;
  skinColor?: string;
  lashColor?: string;
  backgroundColor?: string;
  pupilShape?: EyePupilShape;
  pupilSize?: number;
  showLashes?: boolean;
}

export const PRESETS: Record<EyePreset, EyePresetValues> = {
  default: { irisColor: "#4a7c59", irisInnerColor: "#c8963e", scleraColor: "#f1ebe4", skinColor: "#c99a7e", lashColor: "#1a1210", backgroundColor: "#0c0807" },
  monochrome: {},
  ocean:   { irisColor: "#3a78b5", irisInnerColor: "#a7c8d8", scleraColor: "#f3eee9", skinColor: "#e0b598", lashColor: "#2a1c14", backgroundColor: "#05090f" },
  amber:   { irisColor: "#a8661c", irisInnerColor: "#f2c14e", scleraColor: "#efe6dc", skinColor: "#8a5a3f", lashColor: "#120a06", backgroundColor: "#0a0604" },
  violet:  { irisColor: "#6f52ad", irisInnerColor: "#e2bdf2", scleraColor: "#f3edf0", skinColor: "#d8a891", lashColor: "#1c1018", backgroundColor: "#0b0710" },
  serpent: { irisColor: "#8fae2a", irisInnerColor: "#f0e06a", scleraColor: "#d6cf9a", skinColor: "#3e5a36", lashColor: "#0f1a0f", backgroundColor: "#040703", pupilShape: "slit", pupilSize: 0.5, showLashes: false },
};

export interface EyeProps extends BaseCanvasProps {
  /** Outer iris color (default: "#4a7c59") */
  irisColor?: string;
  /** Color of the ring around the pupil (default: "#c8963e") */
  irisInnerColor?: string;
  /** Color of the white of the eye (default: "#f1ebe4") */
  scleraColor?: string;
  /** Eyelid and face skin color (default: "#c99a7e") */
  skinColor?: string;
  /** Lash and lash-line color (default: "#1a1210") */
  lashColor?: string;
  /** Canvas background; "transparent" lets the face fade into the page (default: "#0c0807") */
  backgroundColor?: string;
  /** "round" or a reptile-like "slit" pupil (default: "round") */
  pupilShape?: EyePupilShape;
  /** Resting pupil size as a fraction of the iris, 0.08–0.85 (default: 0.38) */
  pupilSize?: number;
  /** Eye scale relative to the canvas, 0.2–1.5 (default: 1) */
  eyeSize?: number;
  /** Gaze follows the cursor anywhere on the page and the pupil narrows as it nears; off = the eye looks around on its own (default: true) */
  followCursor?: boolean;
  /** Average ms between blinks; 0 = only blink when clicked (default: 4000) */
  blinkInterval?: number;
  /** Draw eyelashes (default: true) */
  showLashes?: boolean;
  /** Named preset: "default" | "ocean" | "amber" | "violet" | "serpent" | "monochrome" */
  preset?: EyePreset | string;
}

export const Eye = forwardRef<HTMLCanvasElement, EyeProps>((props, ref) => {
  const {
    preset, irisColor, irisInnerColor, scleraColor, skinColor, lashColor, backgroundColor,
    pupilShape, pupilSize, eyeSize, followCursor, blinkInterval, showLashes,
    width, height, className, style,
  } = props;

  const p = resolvePreset("Eye", PRESETS, props);
  const internalRef = useRef<HTMLCanvasElement | null>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

  useEye(internalRef, {
    irisColor:       irisColor       ?? p.irisColor       ?? "#6b7280",
    irisInnerColor:  irisInnerColor  ?? p.irisInnerColor  ?? "#d1d5db",
    scleraColor:     scleraColor     ?? p.scleraColor     ?? "#f3f4f6",
    skinColor:       skinColor       ?? p.skinColor       ?? "#9ca3af",
    lashColor:       lashColor       ?? p.lashColor       ?? "#111111",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    pupilShape:      pupilShape      ?? p.pupilShape      ?? "round",
    pupilSize:       pupilSize       ?? p.pupilSize       ?? 0.38,
    eyeSize:         eyeSize         ?? 1,
    followCursor:    followCursor    ?? true,
    blinkInterval:   blinkInterval   ?? 4000,
    showLashes:      showLashes      ?? p.showLashes      ?? true,
  });

  return (
    <div
      className={className}
      style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", ...style }}
    >
      <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
    </div>
  );
});

Eye.displayName = "Eye";
