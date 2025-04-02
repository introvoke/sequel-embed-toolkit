import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const EventEmbed: React.FC<{ eventId: string }> = ({ eventId }) => {
  useEffect(() => {
    window.Sequel.embedSequel({
      sequelEventId: eventId,
    });
  }, []);

  return <div id="sequel_root"></div>;
};

const meta = {
  title: "Events/Event",
  component: EventEmbed,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof EventEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EventWithoutAgenda: Story = {
  args: {
    eventId: "723b6d9d-238c-48e5-84f7-17bb2d97fe02",
  },
};

export const EventWithAgenda: Story = {
  args: {
    eventId: "55ff41fa-55ff-4bf5-8012-1190dac93cb9",
  },
};
