import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useMatrixRain, MatrixCharset, resolveCharset } from "./useMatrixRain";

type MatrixRainPreset = "default" | "cyberpunk" | "binary" | "minimal" | "blood";

interface MatrixRainPresetValues {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  speed?: number;
  charset?: MatrixCharset;
  resetThreshold?: number;
}

const PRESETS: Record<MatrixRainPreset, MatrixRainPresetValues> = {
  default: {},
  cyberpunk: {
    color: "#bf5fff",
    backgroundColor: "rgba(5,0,20,0.12)",
  },
  binary: {
    charset: "binary",
    color: "#00cfff",
    fontSize: 12,
    speed: 50,
  },
  minimal: {
    color: "#4ade80",
    backgroundColor: "rgba(0,0,0,0.08)",
    speed: 40,
  },
  blood: {
    color: "#dc2626",
    backgroundColor: "rgba(10,0,0,0.1)",
    charset: "latin",
  },
};

export interface MatrixRainProps extends BaseCanvasProps {
  /** Character color (default: "#fff") */
  color?: string;
  /** Per-frame overlay color — lower opacity = longer trails (default: "rgba(0,0,0,0.1)") */
  backgroundColor?: string;
  /** Font size in px; controls column count (default: 14) */
  fontSize?: number;
  /** Ms per frame — lower = faster (default: 33) */
  speed?: number;
  /** Characters to rain: "latin" | "binary" | "katakana" | custom string (default: "latin") */
  charset?: MatrixCharset;
  /** Probability a drop resets after leaving the bottom (default: 0.95) */
  resetThreshold?: number;
  /** Named preset: "default" | "cyberpunk" | "binary" | "minimal" | "blood" */
  preset?: MatrixRainPreset | string;
}

export const MatrixRain = forwardRef<HTMLCanvasElement, MatrixRainProps>(
  (props, ref) => {
    const {
      preset,
      color,
      backgroundColor,
      fontSize,
      speed,
      charset,
      resetThreshold,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as MatrixRainPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    const resolvedCharset = resolveCharset(charset ?? p.charset ?? "latin");

    useMatrixRain(internalRef, {
      color: color ?? p.color ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "rgba(17,17,17,0.1)",
      fontSize: fontSize ?? p.fontSize ?? 14,
      speed: speed ?? p.speed ?? 33,
      charset: resolvedCharset,
      resetThreshold: resetThreshold ?? p.resetThreshold ?? 0.95,
    });

    const wrapperStyle: React.CSSProperties = {
      width: width ?? "100%",
      height: height ?? "100%",
      display: "block",
      overflow: "hidden",
      ...style,
    };

    return (
      <div style={wrapperStyle} className={className}>
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

MatrixRain.displayName = "MatrixRain";
