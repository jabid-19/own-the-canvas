import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Confetti } from "./Confetti";

const meta: Meta<typeof Confetti> = {
  title: "Components/Confetti",
  component: Confetti,
  parameters: { layout: "fullscreen", backgrounds: { default: "dark" } },
  argTypes: {
    palette:       { control: "select", options: ["monochrome", "colorful"] },
    preset:        { control: "select", options: ["default", "celebration", "pastel", "gold"] },
    particleCount: { control: { type: "range", min: 10, max: 500, step: 10 } },
    spread:        { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
    gravity:       { control: { type: "range", min: 0.1, max: 2, step: 0.1 } },
    wind:          { control: { type: "range", min: -2, max: 2, step: 0.1 } },
    duration:      { control: { type: "range", min: 500, max: 10000, step: 500 } },
    continuous:    { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Confetti>;

function TriggerDemo(args: React.ComponentProps<typeof Confetti>) {
  const [fired, setFired] = useState(false);
  return (
    <div style={{ position: "relative", height: "100vh", background: "#0a0a0a" }}>
      <Confetti {...args} trigger={fired} height="100vh" />
      <button
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", padding: "12px 24px", cursor: "pointer", fontSize: 18 }}
        onClick={() => { setFired(false); setTimeout(() => setFired(true), 50); }}
      >
        🎉 Launch
      </button>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <TriggerDemo {...args} />,
  args: { palette: "monochrome", particleCount: 150, spread: 0.8, gravity: 0.5, wind: 0.5, duration: 4000 },
};

export const Colorful: Story = {
  render: (args) => <TriggerDemo {...args} />,
  args: { ...Default.args, palette: "colorful" },
};

export const Celebration: Story = {
  render: (args) => <TriggerDemo {...args} />,
  args: { ...Default.args, preset: "celebration", particleCount: 200 },
};

export const Continuous: Story = {
  render: (args) => <TriggerDemo {...args} />,
  args: { palette: "colorful", particleCount: 30, continuous: true, trigger: true },
};
