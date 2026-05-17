import type { Meta, StoryObj } from "@storybook/react";
import { Starfield } from "./Starfield";

const meta: Meta<typeof Starfield> = {
  title: "Components/Starfield",
  component: Starfield,
  parameters: { layout: "fullscreen" },
  argTypes: {
    starColor: { control: "color" },
    backgroundColor: { control: "color" },
    starCount: { control: { type: "range", min: 50, max: 1000, step: 50 } },
    speed: { control: { type: "range", min: 0.1, max: 5, step: 0.1 } },
    shootingStarInterval: { control: { type: "range", min: 500, max: 10000, step: 500 } },
    twinkle: { control: "boolean" },
    shootingStars: { control: "boolean" },
    perspective: { control: "radio", options: ["2D", "3D"] },
  },
};

export default meta;
type Story = StoryObj<typeof Starfield>;

export const Default: Story = {
  args: {
    starCount: 200,
    backgroundColor: "#000010",
    speed: 0.5,
    twinkle: true,
    shootingStars: true,
    shootingStarInterval: 3000,
    perspective: "2D",
    height: "100vh",
  },
};

export const WarpTunnel: Story = {
  args: { ...Default.args, perspective: "3D", speed: 2, starCount: 400 },
};

export const HyperSpeed: Story = {
  args: { ...Default.args, perspective: "3D", speed: 8, starCount: 600 },
};
