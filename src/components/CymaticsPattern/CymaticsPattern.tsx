import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useCymaticsPattern, UseCymaticsPatternOptions } from "./useCymaticsPattern";

type CymaticsPatternPreset = "default" | "neon" | "sand" | "vibrant" | "cosmic" | "minimal";

const PRESETS: Record<CymaticsPatternPreset, Partial<UseCymaticsPatternOptions>> = {
  default: {},
  neon: {
    particleColor: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: true,
    glowBlur: 8,
  },
  sand: {
    particleColor: "#d4a06a",
    backgroundColor: "#1a1005",
    particleSize: 2.5,
    showPlate: true,
    plateColor: "#4a3010",
  },
  vibrant: {
    particleColor: "#ff6b6b",
    backgroundColor: "#0a0505",
    glowEffect: true,
  },
  cosmic: {
    particleColor: "#c084fc",
    backgroundColor: "#030014",
    glowEffect: true,
    glowBlur: 10,
  },
  minimal: {
    particleColor: "#6b7280",
    backgroundColor: "#111111",
    particleSize: 1.5,
  },
};

export interface CymaticsPatternProps extends BaseCanvasProps {
  particleCount?: number;
  particleColor?: string;
  backgroundColor?: string;
  particleSize?: number;
  forceStrength?: number;
  friction?: number;
  jitterAmount?: number;
  modeDuration?: number;
  speed?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  showPlate?: boolean;
  plateColor?: string;
  animated?: boolean;
  preset?: CymaticsPatternPreset | string;
}

export const CymaticsPattern = forwardRef<HTMLCanvasElement, CymaticsPatternProps>((props, ref) => {
  const {
    preset,
    particleCount,
    particleColor,
    backgroundColor,
    particleSize,
    forceStrength,
    friction,
    jitterAmount,
    modeDuration,
    speed,
    glowEffect,
    glowBlur,
    showPlate,
    plateColor,
    animated,
    width,
    height,
    className,
    style,
  } = props;

  const p = (preset && PRESETS[preset as CymaticsPatternPreset]) || {};
  const internalRef = useRef<HTMLCanvasElement | null>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

  useCymaticsPattern(internalRef, {
    particleCount: particleCount ?? p.particleCount ?? 800,
    particleColor: particleColor ?? p.particleColor ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    particleSize: particleSize ?? p.particleSize ?? 2,
    forceStrength: forceStrength ?? p.forceStrength ?? 3,
    friction: friction ?? p.friction ?? 0.88,
    jitterAmount: jitterAmount ?? p.jitterAmount ?? 0.3,
    modeDuration: modeDuration ?? p.modeDuration ?? 4000,
    speed: speed ?? p.speed ?? 1,
    glowEffect: glowEffect ?? p.glowEffect ?? false,
    glowBlur: glowBlur ?? p.glowBlur ?? 6,
    showPlate: showPlate ?? p.showPlate ?? false,
    plateColor: plateColor ?? p.plateColor ?? "#333333",
    animated: animated ?? p.animated ?? true,
  });

  return (
    <div
      className={className}
      style={{
        width: width ?? "100%",
        height: height ?? "100%",
        display: "block",
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
    </div>
  );
});

CymaticsPattern.displayName = "CymaticsPattern";
