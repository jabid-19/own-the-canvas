import React from "react";

/** A card marked `data-otc-solid`, centered in a playground preview, for DOM-aware effects. */
export function DemoSolid({ children = "Your headline here", top = "55%" }: { children?: React.ReactNode; top?: string }) {
  return (
    <div
      data-otc-solid
      style={{
        position: "absolute",
        left: "50%",
        top,
        transform: "translate(-50%, -50%)",
        padding: "16px 28px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.16)",
        color: "#fff",
        font: "600 18px/1.2 system-ui, sans-serif",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
}
