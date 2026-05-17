import type { Meta, StoryObj } from "@storybook/react";
import { FireEffect } from "./FireEffect";

const meta: Meta<typeof FireEffect> = {
  title: "Components/FireEffect",
  component: FireEffect,
  parameters: { layout: "fullscreen" },
  argTypes: {
    palette: { control: "select", options: ["smoke", "inferno", "toxic", "ice", "plasma"] },
    intensity: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
    windStrength: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    windDirection: { control: "radio", options: [1, -1] },
    spread: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    cooling: { control: { type: "range", min: 0.05, max: 1, step: 0.05 } },
  },
};

export default meta;
type Story = StoryObj<typeof FireEffect>;

export const Inferno: Story = {
  args: { palette: "inferno", intensity: 0.95, windStrength: 0.3, spread: 0.7, cooling: 0.3, height: "100vh" },
};

export const Toxic: Story = { args: { ...Inferno.args, palette: "toxic" } };
export const Ice: Story = { args: { ...Inferno.args, palette: "ice" } };
export const Plasma: Story = { args: { ...Inferno.args, palette: "plasma" } };
