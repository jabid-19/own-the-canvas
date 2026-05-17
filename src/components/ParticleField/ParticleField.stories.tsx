import type { Meta, StoryObj } from "@storybook/react";
import { ParticleField } from "./ParticleField";

const meta: Meta<typeof ParticleField> = {
  title: "Components/ParticleField",
  component: ParticleField,
  parameters: { layout: "fullscreen", backgrounds: { default: "dark" } },
  argTypes: {
    particleColor: { control: "color" },
    lineColor: { control: "color" },
    backgroundColor: { control: "color" },
    particleCount: { control: { type: "range", min: 20, max: 400, step: 10 } },
    lineDistance: { control: { type: "range", min: 40, max: 300, step: 10 } },
    particleSize: { control: { type: "range", min: 0.5, max: 8, step: 0.5 } },
    speed: { control: { type: "range", min: 0.1, max: 5, step: 0.1 } },
    connectParticles: { control: "boolean" },
    interactive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ParticleField>;

export const Default: Story = {
  args: {
    particleCount: 120,
    particleColor: "#7eb8f7",
    lineColor: "#7eb8f7",
    lineDistance: 120,
    particleSize: 2.5,
    speed: 0.8,
    connectParticles: true,
    interactive: true,
    backgroundColor: "#0a0a0a",
    height: "100vh",
  },
};

export const NeonPurple: Story = {
  args: {
    ...Default.args,
    particleColor: "#bf5fff",
    lineColor: "#bf5fff",
    particleCount: 200,
  },
};

export const NoConnections: Story = {
  args: { ...Default.args, connectParticles: false, particleCount: 300 },
};
