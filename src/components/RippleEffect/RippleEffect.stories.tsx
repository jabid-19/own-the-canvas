import type { Meta, StoryObj } from "@storybook/react";
import { RippleEffect } from "./RippleEffect";

const meta: Meta<typeof RippleEffect> = {
  title: "Components/RippleEffect",
  component: RippleEffect,
  parameters: { layout: "fullscreen", backgrounds: { default: "dark" } },
  argTypes: {
    color: { control: "color" },
    backgroundColor: { control: "color" },
    maxRadius: { control: { type: "range", min: 50, max: 400, step: 10 } },
    speed: { control: { type: "range", min: 0.5, max: 10, step: 0.5 } },
    lineWidth: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
    decay: { control: { type: "range", min: 0.1, max: 2, step: 0.1 } },
    multiRipple: { control: "boolean" },
    interactive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RippleEffect>;

export const Default: Story = {
  args: {
    color: "#00cfff",
    maxRadius: 150,
    speed: 2,
    lineWidth: 1.5,
    decay: 0.8,
    multiRipple: true,
    interactive: true,
    backgroundColor: "#0a0a0a",
    height: "100vh",
  },
};
