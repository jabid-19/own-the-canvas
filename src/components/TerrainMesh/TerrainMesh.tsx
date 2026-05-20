import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useTerrainMesh } from "./useTerrainMesh";

type TerrainMeshPreset = "default" | "volcanic" | "arctic" | "neon" | "golden" | "minimal";

interface TerrainMeshPresetValues {
  wireColor?: string;
  backgroundColor?: string;
  heightScale?: number;
  noiseScale?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  colorByHeight?: boolean;
  lineWidth?: number;
}

const PRESETS: Record<TerrainMeshPreset, TerrainMeshPresetValues> = {
  default: {},
  volcanic: {
    wireColor: "#ef4444",
    backgroundColor: "#0a0000",
    heightScale: 160,
    glowEffect: true,
    glowBlur: 10,
    colorByHeight: true,
  },
  arctic: {
    wireColor: "#bae6fd",
    backgroundColor: "#020c17",
    heightScale: 80,
    noiseScale: 0.08,
    glowEffect: true,
    glowBlur: 8,
    colorByHeight: true,
  },
  neon: {
    wireColor: "#00ffcc",
    backgroundColor: "#000000",
    heightScale: 140,
    glowEffect: true,
    glowBlur: 12,
    colorByHeight: false,
    lineWidth: 0.75,
  },
  golden: {
    wireColor: "#fbbf24",
    backgroundColor: "#0a0800",
    heightScale: 100,
    glowEffect: true,
    glowBlur: 8,
    colorByHeight: true,
  },
  minimal: {
    wireColor: "#4b5563",
    backgroundColor: "#111111",
    heightScale: 60,
    glowEffect: false,
    colorByHeight: false,
    lineWidth: 0.5,
  },
};

export interface TerrainMeshProps extends BaseCanvasProps {
  /** Columns in the wireframe grid (default: 40) */
  gridCols?: number;
  /** Rows in the wireframe grid (default: 30) */
  gridRows?: number;
  /** Perlin noise frequency (default: 0.12) */
  noiseScale?: number;
  /** Max terrain height in px (default: 120) */
  heightScale?: number;
  /** Wireframe line color (default: "#ffffff") */
  wireColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Perspective focal length (default: 500) */
  fov?: number;
  /** Initial X rotation in radians (default: 0.4) */
  rotateX?: number;
  /** Initial Y rotation in radians (default: 0) */
  rotateY?: number;
  /** Slowly auto-rotate Y axis (default: true) */
  autoRotate?: boolean;
  /** Radians per frame for auto-rotate (default: 0.003) */
  autoRotateSpeed?: number;
  /** Glow on wireframe (default: false) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 8) */
  glowBlur?: number;
  /** Mouse drag to orbit (default: true) */
  interactive?: boolean;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Wireframe line width (default: 0.5) */
  lineWidth?: number;
  /** Color vertices by height (default: true) */
  colorByHeight?: boolean;
  preset?: TerrainMeshPreset | string;
}

export const TerrainMesh = forwardRef<HTMLCanvasElement, TerrainMeshProps>(
  (props, ref) => {
    const {
      preset, gridCols, gridRows, noiseScale, heightScale, wireColor, backgroundColor,
      fov, rotateX, rotateY, autoRotate, autoRotateSpeed,
      glowEffect, glowBlur, interactive, animated, lineWidth, colorByHeight,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as TerrainMeshPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useTerrainMesh(internalRef, {
      gridCols:        gridCols        ?? 40,
      gridRows:        gridRows        ?? 30,
      noiseScale:      noiseScale      ?? p.noiseScale      ?? 0.12,
      heightScale:     heightScale     ?? p.heightScale     ?? 120,
      wireColor:       wireColor       ?? p.wireColor       ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      fov:             fov             ?? 500,
      rotateX:         rotateX         ?? 0.4,
      rotateY:         rotateY         ?? 0,
      autoRotate:      autoRotate      ?? true,
      autoRotateSpeed: autoRotateSpeed ?? 0.003,
      glowEffect:      glowEffect      ?? p.glowEffect      ?? false,
      glowBlur:        glowBlur        ?? p.glowBlur        ?? 8,
      interactive:     interactive     ?? true,
      animated:        animated        ?? true,
      lineWidth:       lineWidth       ?? p.lineWidth       ?? 0.5,
      colorByHeight:   colorByHeight   ?? p.colorByHeight   ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "grab" : "default",
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

TerrainMesh.displayName = "TerrainMesh";
