import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useReactionDiffusion } from "./useReactionDiffusion";

type ReactionDiffusionPreset = "default" | "coral" | "spots" | "maze" | "waves" | "neon";

interface ReactionDiffusionPresetValues {
  feedRate?: number;
  killRate?: number;
  diffusionU?: number;
  diffusionV?: number;
  colorA?: string;
  colorB?: string;
  backgroundColor?: string;
  speed?: number;
  resolution?: number;
}

const PRESETS: Record<ReactionDiffusionPreset, ReactionDiffusionPresetValues> = {
  default: {},
  coral: { feedRate: 0.055, killRate: 0.062 },
  spots: { feedRate: 0.035, killRate: 0.065 },
  maze: { feedRate: 0.029, killRate: 0.057 },
  waves: { feedRate: 0.014, killRate: 0.053, speed: 6 },
  neon: { feedRate: 0.055, killRate: 0.062, colorA: "#0a0a0a", colorB: "#00ffff", backgroundColor: "#0a0a0a" },
};

export interface ReactionDiffusionProps extends BaseCanvasProps {
  /** Feed rate f — controls pattern type (default: 0.055) */
  feedRate?: number;
  /** Kill rate k — controls pattern density (default: 0.062) */
  killRate?: number;
  /** Diffusion rate for U chemical — keep dU/dV ratio at 2 (default: 0.2) */
  diffusionU?: number;
  /** Diffusion rate for V chemical — keep dU/dV ratio at 2 (default: 0.1) */
  diffusionV?: number;
  /** Render resolution fraction — lower = faster (default: 0.5) */
  resolution?: number;
  /** Simulation steps per frame (default: 8) */
  speed?: number;
  /** Color at low V concentration (default: "#111111") */
  colorA?: string;
  /** Color at high V concentration (default: "#ffffff") */
  colorB?: string;
  /** Canvas background color (default: "#111111") */
  backgroundColor?: string;
  /** Mouse disturbs the field (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: ReactionDiffusionPreset | string;
}

export const ReactionDiffusion = forwardRef<HTMLCanvasElement, ReactionDiffusionProps>(
  (props, ref) => {
    const {
      preset,
      feedRate,
      killRate,
      diffusionU,
      diffusionV,
      resolution,
      speed,
      colorA,
      colorB,
      backgroundColor,
      interactive,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as ReactionDiffusionPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useReactionDiffusion(internalRef, {
      feedRate:       feedRate       ?? p.feedRate       ?? 0.055,
      killRate:       killRate       ?? p.killRate       ?? 0.062,
      diffusionU:     diffusionU     ?? p.diffusionU     ?? 0.2,
      diffusionV:     diffusionV     ?? p.diffusionV     ?? 0.1,
      resolution:     resolution     ?? p.resolution     ?? 0.5,
      speed:          speed          ?? p.speed          ?? 8,
      colorA:         colorA         ?? p.colorA         ?? "#111111",
      colorB:         colorB         ?? p.colorB         ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      interactive:    interactive    ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...style,
        }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block" }}
        />
      </div>
    );
  }
);

ReactionDiffusion.displayName = "ReactionDiffusion";
