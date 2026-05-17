import type { Meta, StoryObj } from "@storybook/react";
import { MatrixRain } from "./MatrixRain";

const meta: Meta<typeof MatrixRain> = {
  title: "Components/MatrixRain",
  component: MatrixRain,
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: { control: "color" },
    backgroundColor: { control: "color" },
    fontSize: { control: { type: "range", min: 8, max: 40, step: 1 } },
    speed: { control: { type: "range", min: 10, max: 200, step: 1 } },
    resetThreshold: { control: { type: "range", min: 0.5, max: 0.99, step: 0.01 } },
    charset: { control: "select", options: ["latin", "binary", "katakana"] },
  },
};

export default meta;
type Story = StoryObj<typeof MatrixRain>;

export const Default: Story = {
  args: {
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.1)",
    fontSize: 14,
    speed: 33,
    charset: "latin",
    resetThreshold: 0.95,
    height: "100vh",
  },
};

export const ToxicGreen: Story = {
  args: { ...Default.args, color: "#39ff14", fontSize: 12 },
};

export const Binary: Story = {
  args: { ...Default.args, charset: "binary", color: "#00cfff", speed: 50 },
};

export const Katakana: Story = {
  args: { ...Default.args, charset: "katakana", color: "#fff", fontSize: 16 },
};

export const Blood: Story = {
  args: { ...Default.args, preset: "blood", height: "100vh" },
};
