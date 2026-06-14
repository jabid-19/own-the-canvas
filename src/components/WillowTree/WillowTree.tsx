import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useWillowTree } from "./useWillowTree";

type WillowTreePreset = "default" | "spring" | "autumn" | "night" | "winter";

interface WillowTreePresetValues {
  trunkColor?: string;
  leafColor?: string;
  skyColor?: string;
  groundColor?: string;
}

const PRESETS: Record<WillowTreePreset, WillowTreePresetValues> = {
  default: { trunkColor: "#3a3028", leafColor: "#6a8a6a", skyColor: "#0d0d0d", groundColor: "#111111" },
  spring:  { trunkColor: "#5a3a20", leafColor: "#66cc44", skyColor: "#1a2a3a", groundColor: "#0a1a08" },
  autumn:  { trunkColor: "#4a2a10", leafColor: "#cc6620", skyColor: "#1a0e08", groundColor: "#120800" },
  night:   { trunkColor: "#3a3040", leafColor: "#8898a8", skyColor: "#020412", groundColor: "#060412" },
  winter:  { trunkColor: "#5a5060", leafColor: "#c0c8d0", skyColor: "#080c14", groundColor: "#0a0c10" },
};

export interface WillowTreeProps extends BaseCanvasProps {
  /** Trunk and branch color (default: "#3a3028") */
  trunkColor?: string;
  /** Leaf and strand color (default: "#6a8a6a") */
  leafColor?: string;
  /** Background gradient top color (default: "#0d0d0d") */
  skyColor?: string;
  /** Background gradient bottom color (default: "#111111") */
  groundColor?: string;
  /** Number of major branches (default: 8) */
  branchCount?: number;
  /** Hanging strands per branch (default: 6) */
  strandCount?: number;
  /** Mouse X controls wind direction (default: true) */
  interactive?: boolean;
  /** Enable falling leaf particles (default: true) */
  showFallingLeaves?: boolean;
  /** Named preset */
  preset?: WillowTreePreset | string;
}

export const WillowTree = forwardRef<HTMLCanvasElement, WillowTreeProps>(
  (props, ref) => {
    const {
      preset, trunkColor, leafColor, skyColor, groundColor,
      branchCount, strandCount, interactive, showFallingLeaves,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as WillowTreePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useWillowTree(internalRef, {
      trunkColor:        trunkColor        ?? p.trunkColor  ?? "#3a3028",
      leafColor:         leafColor         ?? p.leafColor   ?? "#6a8a6a",
      skyColor:          skyColor          ?? p.skyColor    ?? "#0d0d0d",
      groundColor:       groundColor       ?? p.groundColor ?? "#111111",
      branchCount:       branchCount       ?? 8,
      strandCount:       strandCount       ?? 6,
      interactive:       interactive       ?? true,
      showFallingLeaves: showFallingLeaves ?? true,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

WillowTree.displayName = "WillowTree";
