import type { Meta, StoryObj } from "@storybook/react";
import { CountdownWidget } from "@src/widgets/CountdownWidget";

const baseWidget = {
  type: "countdown" as const,
  data: {
    eventStartDate: new Date(Date.now() + 99 * 24 * 60 * 60 * 1000),
    eventEndDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
  },
  config: {
    valueTextColor: "#111827",
    unitTextColor: "#6b7280",
    cardBackgroundColor: "#f3f4f6",
    cardBorderColor: "#e5e7eb",
  },
};

const meta = {
  title: "Widgets/Countdown",
  component: CountdownWidget,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof CountdownWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    widget: baseWidget,
  },
};

export const DarkMode: Story = {
  args: {
    widget: {
      ...baseWidget,
      config: {
        valueTextColor: "#f8fafc",
        unitTextColor: "#cbd5e1",
        cardBackgroundColor: "#0f172a",
        cardBorderColor: "rgba(255,255,255,0.08)",
      },
    },
  },
};

export const CustomColors: Story = {
  args: {
    widget: {
      ...baseWidget,
      config: {
        valueTextColor: "#111827",
        unitTextColor: "#6b7280",
        cardBackgroundColor: "#f3f4f6",
        cardBorderColor: "#e5e7eb",
      },
    },
  },
};

