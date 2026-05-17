import type { Meta, StoryObj } from "@storybook/react";
import { NoiseGradient } from "./NoiseGradient";

const meta: Meta<typeof NoiseGradient> = {
  title: "Components/NoiseGradient",
  component: NoiseGradient,
  parameters: { layout: "fullscreen" },
  argTypes: {
    speed: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
    scale: { control: { type: "range", min: 0.2, max: 5, step: 0.1 } },
    octaves: { control: { type: "range", min: 1, max: 6, step: 1 } },
    animated: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof NoiseGradient>;

export const DeepSpace: Story = {
  args: { colors: ["#0d0221", "#2d1b69", "#11998e", "#38ef7d"], speed: 0.3, scale: 1, octaves: 3, animated: true, height: "100vh" },
};

export const Sunset: Story = {
  args: { colors: ["#0f0c29", "#ff6b6b", "#ffd89b"], speed: 0.2, scale: 1.5, octaves: 4, animated: true, height: "100vh" },
};

export const Ocean: Story = {
  args: { colors: ["#0052d4", "#4364f7", "#6fb1fc"], speed: 0.15, scale: 0.8, octaves: 5, animated: true, height: "100vh" },
};
