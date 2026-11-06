import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useFluidSimulation } from "./useFluidSimulation";
import { resolvePreset } from "../../utils/props";

type FluidPreset = "default" | "ink" | "neon" | "lava" | "ocean" | "smoke" | "monochrome";

interface FluidPresetValues {
  resolution?: number;
  viscosity?: number;
  diffusion?: number;
  dissipation?: number;
  inkColors?: string[];
  glowEffect?: boolean;
  glowBlur?: number;
  backgroundColor?: string;
  autoInk?: boolean;
  autoInkInterval?: number;
  mouseForce?: number;
  inkRadius?: number;
}

export const PRESETS: Record<FluidPreset, FluidPresetValues> = {
  default: {
    resolution: 80,
    viscosity: 0.0001,
    diffusion: 0.0001,
    dissipation: 0.995,
    inkColors: ["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9"],
    glowEffect: true,
    glowBlur: 0,
    backgroundColor: "#020f1a",
    autoInk: true,
    autoInkInterval: 1500,
    mouseForce: 5,
    inkRadius: 4,
  },
  monochrome: {
    resolution: 80,
    viscosity: 0.0001,
    diffusion: 0.0001,
    dissipation: 0.995,
    inkColors: ["#ffffff", "#6b7280", "#9ca3af"],
    glowEffect: true,
    glowBlur: 0,
    backgroundColor: "#111111",
    autoInk: true,
    autoInkInterval: 1500,
    mouseForce: 5,
    inkRadius: 4,
  },
  ink: {
    resolution: 80,
    viscosity: 0.00005,
    diffusion: 0.00005,
    dissipation: 0.998,
    inkColors: ["#1e1b4b", "#312e81", "#4338ca", "#6366f1"],
    backgroundColor: "#f8fafc",
    autoInk: true,
    autoInkInterval: 2000,
    mouseForce: 4,
    inkRadius: 3,
  },
  neon: {
    resolution: 64,
    viscosity: 0.00001,
    diffusion: 0.00001,
    dissipation: 0.993,
    inkColors: ["#00ffff", "#ff00ff", "#00ff41", "#ff6600"],
    glowEffect: true,
    backgroundColor: "#000000",
    autoInk: true,
    mouseForce: 8,
    inkRadius: 5,
  },
  lava: {
    resolution: 64,
    viscosity: 0.001,
    diffusion: 0.0005,
    dissipation: 0.99,
    inkColors: ["#7f1d1d", "#dc2626", "#f97316", "#fbbf24"],
    backgroundColor: "#0c0000",
    autoInk: true,
    mouseForce: 6,
    inkRadius: 4,
  },
  ocean: {
    resolution: 80,
    viscosity: 0.0002,
    diffusion: 0.0001,
    dissipation: 0.997,
    inkColors: ["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9"],
    backgroundColor: "#020f1a",
    autoInk: true,
    mouseForce: 4,
    inkRadius: 5,
  },
  smoke: {
    resolution: 72,
    viscosity: 0.00005,
    diffusion: 0.0002,
    dissipation: 0.994,
    inkColors: ["#475569", "#94a3b8", "#cbd5e1", "#e2e8f0"],
    backgroundColor: "#0f172a",
    autoInk: true,
    autoInkInterval: 800,
    mouseForce: 3,
    inkRadius: 6,
  },
};

export interface FluidSimulationProps extends BaseCanvasProps {
  /** Grid resolution (32–128) — lower is faster (default: 80) */
  resolution?: number;
  /** Fluid viscosity — resistance to flow (default: 0.0001) */
  viscosity?: number;
  /** Ink diffusion rate (default: 0.0001) */
  diffusion?: number;
  /** Density fade per frame 0–1 (default: 0.995) */
  dissipation?: number;
  /** Ink colors painted by mouse and auto-ink (default: ["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9"]) */
  inkColors?: string[];
  /** Glow on ink; needs glowBlur > 0 (default: true) */
  glowEffect?: boolean;
  /** Glow blur radius in px, 0 = no glow (default: 0) */
  glowBlur?: number;
  /** Canvas background color (default: "#020f1a") */
  backgroundColor?: string;
  /** Auto-inject ink bursts without mouse (default: true) */
  autoInk?: boolean;
  /** Interval between auto-ink bursts in ms (default: 1500) */
  autoInkInterval?: number;
  /** Mouse velocity → velocity force multiplier (default: 5) */
  mouseForce?: number;
  /** Ink splat radius in grid cells (default: 4) */
  inkRadius?: number;
  /** Named preset */
  preset?: FluidPreset | string;
}

export const FluidSimulation = forwardRef<HTMLCanvasElement, FluidSimulationProps>(
  (props, ref) => {
    const {
      preset, resolution, viscosity, diffusion, dissipation,
      inkColors, glowEffect, glowBlur, backgroundColor,
      autoInk, autoInkInterval, mouseForce, inkRadius,
      width, height, className, style,
    } = props;

    const p = resolvePreset("FluidSimulation", PRESETS, props);

    const { canvasRef, canvas } = useFluidSimulation({
      resolution: resolution ?? p.resolution ?? 128,
      viscosity: viscosity ?? p.viscosity ?? 0.0001,
      diffusion: diffusion ?? p.diffusion ?? 0.0001,
      dissipation: dissipation ?? p.dissipation ?? 0.995,
      inkColors: inkColors ?? p.inkColors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      glowEffect: glowEffect ?? p.glowEffect ?? true,
      glowBlur: glowBlur ?? p.glowBlur ?? 0,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      autoInk: autoInk ?? p.autoInk ?? true,
      autoInkInterval: autoInkInterval ?? p.autoInkInterval ?? 1500,
      mouseForce: mouseForce ?? p.mouseForce ?? 5,
      inkRadius: inkRadius ?? p.inkRadius ?? 4,
    });

    useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

    return (
      <RuntimeCanvas canvasRef={canvasRef} width={width} height={height} className={className} style={style} />
    );
  }
);

FluidSimulation.displayName = "FluidSimulation";
