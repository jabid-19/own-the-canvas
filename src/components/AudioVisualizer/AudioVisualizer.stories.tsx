import type { Meta, StoryObj } from "@storybook/react";
import { AudioVisualizer } from "./AudioVisualizer";

const meta: Meta<typeof AudioVisualizer> = {
  title: "Components/AudioVisualizer",
  component: AudioVisualizer,
  parameters: { layout: "fullscreen", backgrounds: { default: "dark" } },
  argTypes: {
    barColor: { control: "color" },
    waveColor: { control: "color" },
    barCount: { control: { type: "range", min: 16, max: 256, step: 8 } },
    sensitivity: { control: { type: "range", min: 0.2, max: 3, step: 0.1 } },
    gapBetweenBars: { control: { type: "range", min: 0, max: 10, step: 1 } },
    mode: { control: "select", options: ["bars", "wave", "circular", "mirror"] },
    rounded: { control: "boolean" },
    gradient: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof AudioVisualizer>;

export const Bars: Story = {
  args: {
    barCount: 64,
    barColor: "#00cfff",
    waveColor: "#00cfff",
    mode: "bars",
    sensitivity: 1,
    gapBetweenBars: 2,
    rounded: true,
    gradient: true,
    height: "300px",
  },
};

export const Wave: Story = { args: { ...Bars.args, mode: "wave" } };
export const Circular: Story = { args: { ...Bars.args, mode: "circular", height: "400px" } };
export const Mirror: Story = { args: { ...Bars.args, mode: "mirror" } };
