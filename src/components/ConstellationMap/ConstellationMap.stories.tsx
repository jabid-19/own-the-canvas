import type { Meta, StoryObj } from "@storybook/react";
import { ConstellationMap } from "./ConstellationMap";

const meta: Meta<typeof ConstellationMap> = {
  title: "Components/ConstellationMap",
  component: ConstellationMap,
  parameters: { layout: "fullscreen" },
  argTypes: {
    starColor: { control: "color" },
    lineColor: { control: "color" },
    backgroundColor: { control: "color" },
    starCount: { control: { type: "range", min: 20, max: 300, step: 10 } },
    connectionDistance: { control: { type: "range", min: 40, max: 300, step: 10 } },
    speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    interactive: { control: "boolean" },
    glowStars: { control: "boolean" },
    lineStyle: { control: "radio", options: ["solid", "dashed"] },
  },
};

export default meta;
type Story = StoryObj<typeof ConstellationMap>;

export const Default: Story = {
  args: {
    starCount: 80,
    starColor: "#ffffff",
    lineColor: "#8888ff",
    backgroundColor: "#050510",
    speed: 0.3,
    interactive: true,
    glowStars: true,
    lineStyle: "solid",
    connectionDistance: 100,
    height: "100vh",
  },
};

export const Dashed: Story = { args: { ...Default.args, lineStyle: "dashed", lineColor: "#44ffaa" } };
export const Dense: Story = { args: { ...Default.args, starCount: 200, connectionDistance: 80 } };
