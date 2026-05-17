import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PixelDissolve } from "./PixelDissolve";

const meta: Meta<typeof PixelDissolve> = {
  title: "Components/PixelDissolve",
  component: PixelDissolve,
  parameters: { layout: "fullscreen", backgrounds: { default: "dark" } },
  argTypes: {
    color: { control: "color" },
    pixelSize: { control: { type: "range", min: 2, max: 32, step: 1 } },
    speed: { control: { type: "range", min: 0.1, max: 2, step: 0.1 } },
    direction: { control: "select", options: ["in", "out", "both"] },
  },
};

export default meta;
type Story = StoryObj<typeof PixelDissolve>;

function Demo(args: React.ComponentProps<typeof PixelDissolve>) {
  const [t, setT] = useState(false);
  return (
    <div style={{ height: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PixelDissolve {...args} trigger={t} width={400} height={300}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#667eea,#764ba2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24 }}>
          Dissolve Me
        </div>
      </PixelDissolve>
      <button style={{ position: "absolute", bottom: 40, padding: "10px 20px", cursor: "pointer" }} onClick={() => { setT(false); setTimeout(() => setT(true), 50); }}>
        Trigger
      </button>
    </div>
  );
}

export const Default: Story = { render: (args) => <Demo {...args} />, args: { pixelSize: 8, speed: 0.5, direction: "out", color: "#0a0a0a" } };
export const PixelIn: Story = { render: (args) => <Demo {...args} />, args: { pixelSize: 12, speed: 0.8, direction: "in", color: "#0a0a0a" } };
