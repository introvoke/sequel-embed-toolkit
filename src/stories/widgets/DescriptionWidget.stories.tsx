import type { Meta, StoryObj } from "@storybook/react";
import "@src/index.css";
import { DescriptionWidget } from "@src/widgets/DescriptionWidget";

const mockWidget = {
  type: "description" as const,
  data: {
    html: `
      <h2>About This Event</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. <a href="#">Learn more</a></p>
    `,
  },
  config: {
    verticalSpacing: "medium" as const,
    fontColor: "#ffffff",
  },
};

const meta = {
  title: "Widgets/DescriptionWidget",
  component: DescriptionWidget,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DescriptionWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { widget: mockWidget },
};

export const LightMode: Story = {
  args: {
    widget: {
      ...mockWidget,
      config: { verticalSpacing: "medium", fontColor: "#000000" },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-white p-4">
        <Story />
      </div>
    ),
  ],
};

export const NoSpacing: Story = {
  args: {
    widget: {
      ...mockWidget,
      config: { verticalSpacing: "none", fontColor: "#ffffff" },
    },
  },
};

export const LargeSpacing: Story = {
  args: {
    widget: {
      ...mockWidget,
      config: { verticalSpacing: "large", fontColor: "#ffffff" },
    },
  },
};

export const Empty: Story = {
  args: {
    widget: {
      ...mockWidget,
      data: { html: "" },
    },
  },
};
