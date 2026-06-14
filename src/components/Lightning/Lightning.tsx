import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useLightning } from "./useLightning";

type LightningPreset = "default" | "neon" | "storm" | "plasma" | "subtle";

interface LightningPresetValues {
  segments?: number;
  roughness?: number;
  branchChance?: number;
  branchDecay?: number;
  flickerCount?: number;
  glowBlur?: number;
  color?: string;
  coreColor?: string;
  backgroundColor?: string;
  autoInterval?: number;
  interactive?: boolean;
  startX?: number;
  startY?: number;
  endY?: number;
}

export const PRESETS: Record<LightningPreset, LightningPresetValues> = {
  default: {
    color: "#6b7280",
    coreColor: "#ffffff",
    glowBlur: 20,
    backgroundColor: "#111111",
  },
  neon: {
    color: "#00ffff",
    coreColor: "#ffffff",
    glowBlur: 40,
    branchChance: 0.5,
    backgroundColor: "#000000",
    flickerCount: 4,
  },
  storm: {
    color: "#c0c0ff",
    coreColor: "#ffffff",
    branchChance: 0.4,
    roughness: 0.7,
    autoInterval: 1000,
    backgroundColor: "#050010",
    glowBlur: 15,
  },
  plasma: {
    color: "#ff00ff",
    coreColor: "#ffaaff",
    glowBlur: 30,
    segments: 10,
    backgroundColor: "#0a0010",
    branchChance: 0.35,
  },
  subtle: {
    glowBlur: 8,
    branchChance: 0.1,
    color: "#94a3b8",
    coreColor: "#e2e8f0",
    autoInterval: 4000,
    backgroundColor: "#0f172a",
    flickerCount: 2,
  },
};

export interface LightningProps extends BaseCanvasProps {
  /** Recursion depth for bolt segments. (default: 8) */
  segments?: number;
  /** Midpoint displacement roughness 0–1. (default: 0.5) */
  roughness?: number;
  /** Probability of spawning a branch at each segment. (default: 0.3) */
  branchChance?: number;
  /** Energy multiplier for sub-branches. (default: 0.6) */
  branchDecay?: number;
  /** Number of rapid flicker strikes per event. (default: 3) */
  flickerCount?: number;
  /** Glow shadow blur radius. (default: 20) */
  glowBlur?: number;
  /** Bolt glow color. (default: "#7C3AED") */
  color?: string;
  /** Inner core color. (default: "#ffffff") */
  coreColor?: string;
  /** Canvas background color. (default: "#050010") */
  backgroundColor?: string;
  /** Ms between auto strikes. (default: 2000) */
  autoInterval?: number;
  /** Click to trigger strike at cursor. (default: true) */
  interactive?: boolean;
  /** Strike origin X as fraction of width. (default: 0.5) */
  startX?: number;
  /** Strike origin Y as fraction of height. (default: 0) */
  startY?: number;
  /** Strike end Y as fraction of height. (default: 1) */
  endY?: number;
  /** Named preset. */
  preset?: LightningPreset | string;
}

export const Lightning = forwardRef<HTMLCanvasElement, LightningProps>((props, ref) => {
  const {
    preset,
    segments, roughness, branchChance, branchDecay, flickerCount,
    glowBlur, color, coreColor, backgroundColor, autoInterval,
    interactive, startX, startY, endY,
    width, height, className, style,
  } = props;

  const p = (preset && PRESETS[preset as LightningPreset]) || {};

  const internalRef = useRef<HTMLCanvasElement | null>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

  useLightning(internalRef, {
    segments:      segments      ?? p.segments      ?? 8,
    roughness:     roughness     ?? p.roughness     ?? 0.5,
    branchChance:  branchChance  ?? p.branchChance  ?? 0.1,
    branchDecay:   branchDecay   ?? p.branchDecay   ?? 0.6,
    flickerCount:  flickerCount  ?? p.flickerCount  ?? 3,
    glowBlur:      glowBlur      ?? p.glowBlur      ?? 20,
    color:         color         ?? p.color         ?? "#6b7280",
    coreColor:     coreColor     ?? p.coreColor     ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    autoInterval:  autoInterval  ?? p.autoInterval  ?? 2000,
    interactive:   interactive   ?? p.interactive   ?? true,
    startX:        startX        ?? p.startX        ?? 0.5,
    startY:        startY        ?? p.startY        ?? 0,
    endY:          endY          ?? p.endY          ?? 1,
  });

  return (
    <div
      className={className}
      style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
    >
      <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
    </div>
  );
});

Lightning.displayName = "Lightning";
