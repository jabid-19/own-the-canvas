import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface RuntimeCanvasProps {
  canvasRef: (el: HTMLCanvasElement | null) => void;
  /** Portal a fixed, full-viewport, click-through canvas to document.body */
  overlay?: boolean;
  zIndex?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Canvas host shared by runtime-based effects.
 * Normal: wrapper div filling its parent. Overlay: portaled to document.body
 * after mount (SSR-safe, and immune to transformed ancestors that would break
 * position: fixed).
 */
export function RuntimeCanvas({
  canvasRef,
  overlay = false,
  zIndex = 10,
  width,
  height,
  className,
  style,
}: RuntimeCanvasProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (overlay) {
    if (!mounted) return null;
    return createPortal(
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        role="presentation"
        className={className}
        style={{
          position: "fixed",
          inset: 0,
          display: "block",
          pointerEvents: "none",
          zIndex,
          ...style,
        }}
      />,
      document.body,
    );
  }

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
      <canvas ref={canvasRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
    </div>
  );
}
