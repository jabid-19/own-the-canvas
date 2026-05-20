import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useCrystalGrowth, CrystalGrowthColorMode } from "./useCrystalGrowth";

type CrystalGrowthPreset = "default" | "snowflake" | "gem" | "neon" | "frost" | "gold";

interface CrystalGrowthPresetValues {
  crystalColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  symmetry?: number;
  branchProbability?: number;
  noiseAmount?: number;
  cellSize?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  colorMode?: CrystalGrowthColorMode;
}

const PRESETS: Record<CrystalGrowthPreset, CrystalGrowthPresetValues> = {
  default: {},
  snowflake: {
    crystalColor: "#e0f2fe",
    activeColor: "#7dd3fc",
    backgroundColor: "#0c1a2e",
    symmetry: 6,
    branchProbability: 0.4,
    noiseAmount: 0.15,
    glowEffect: true,
    glowBlur: 10,
  },
  gem: {
    crystalColor: "#c084fc",
    activeColor: "#e879f9",
    backgroundColor: "#09000f",
    symmetry: 8,
    branchProbability: 0.2,
    noiseAmount: 0.1,
    colorMode: "age",
    glowEffect: true,
    glowBlur: 15,
  },
  neon: {
    crystalColor: "#00ffcc",
    activeColor: "#ff00aa",
    backgroundColor: "#000000",
    symmetry: 4,
    branchProbability: 0.35,
    noiseAmount: 0.3,
    colorMode: "cycle",
    glowEffect: true,
    glowBlur: 18,
  },
  frost: {
    crystalColor: "#bae6fd",
    activeColor: "#ffffff",
    backgroundColor: "#0a1628",
    symmetry: 6,
    branchProbability: 0.5,
    noiseAmount: 0.25,
    cellSize: 2,
    glowEffect: true,
    glowBlur: 8,
  },
  gold: {
    crystalColor: "#fbbf24",
    activeColor: "#f59e0b",
    backgroundColor: "#0a0500",
    symmetry: 12,
    branchProbability: 0.15,
    noiseAmount: 0.05,
    colorMode: "age",
    glowEffect: true,
    glowBlur: 12,
  },
};

export interface CrystalGrowthProps extends BaseCanvasProps {
  /** Color of crystallized cells (default: "#ffffff") */
  crystalColor?: string;
  /** Color of actively growing frontier (default: "#6b7280") */
  activeColor?: string;
  /** Background color (default: "#111111") */
  backgroundColor?: string;
  /** Cells crystallized per frame (default: 3) */
  growthSpeed?: number;
  /** Rotational symmetry arms 2–12 (default: 6) */
  symmetry?: number;
  /** Probability a frontier cell spawns a branch (default: 0.3) */
  branchProbability?: number;
  /** Random noise in growth direction 0–1 (default: 0.2) */
  noiseAmount?: number;
  /** Cell size in px (default: 3) */
  cellSize?: number;
  /** Glow on crystal (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 12) */
  glowBlur?: number;
  /** Click to seed new growth (default: true) */
  interactive?: boolean;
  /** Restart after growth completes (default: true) */
  autoReset?: boolean;
  /** Color mode: "solid" | "age" | "cycle" (default: "solid") */
  colorMode?: CrystalGrowthColorMode;
  /** Enable animation (default: true) */
  animated?: boolean;
  preset?: CrystalGrowthPreset | string;
}

export const CrystalGrowth = forwardRef<HTMLCanvasElement, CrystalGrowthProps>(
  (props, ref) => {
    const {
      preset, crystalColor, activeColor, backgroundColor, growthSpeed, symmetry,
      branchProbability, noiseAmount, cellSize, glowEffect, glowBlur,
      interactive, autoReset, colorMode, animated, width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as CrystalGrowthPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useCrystalGrowth(internalRef, {
      crystalColor:      crystalColor      ?? p.crystalColor      ?? "#ffffff",
      activeColor:       activeColor       ?? p.activeColor       ?? "#6b7280",
      backgroundColor:   backgroundColor   ?? p.backgroundColor   ?? "#111111",
      growthSpeed:       growthSpeed       ?? 3,
      symmetry:          symmetry          ?? p.symmetry          ?? 6,
      branchProbability: branchProbability ?? p.branchProbability ?? 0.3,
      noiseAmount:       noiseAmount       ?? p.noiseAmount       ?? 0.2,
      cellSize:          cellSize          ?? p.cellSize          ?? 3,
      glowEffect:        glowEffect        ?? p.glowEffect        ?? true,
      glowBlur:          glowBlur          ?? p.glowBlur          ?? 12,
      interactive:       interactive       ?? true,
      autoReset:         autoReset         ?? true,
      colorMode:         colorMode         ?? p.colorMode         ?? "solid",
      animated:          animated          ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "crosshair" : "default",
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

CrystalGrowth.displayName = "CrystalGrowth";
