import type { Meta, StoryObj } from "@storybook/react";

import { RegistrationPopup } from "./RegistrationPopup";

const meta = {
  title: "Example/RegistrationPopup",
  component: RegistrationPopup,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RegistrationPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegistrationPopupStory: Story = {
  render: () => {
    return <RegistrationPopup />;
  },
};
