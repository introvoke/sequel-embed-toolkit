import type { Meta, StoryObj } from "@storybook/react";
import { EventsGridWidget } from "@src/widgets/EventsGridWidget";

const widget = {
  type: "eventGrid" as const,
  data: {
    events: [
      {
        id: "evt-1",
        name: "Launch Day",
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60 * 1000),
        description: "Kick off and demos",
        picture: "https://placekitten.com/400/240",
      },
      {
        id: "evt-2",
        name: "Workshop",
        startDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
        thumbnail: "https://placekitten.com/401/240",
      },
      {
        id: "evt-3",
        name: "Fireside Chat",
        startDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
        picture: "https://placekitten.com/402/240",
      },
    ],
  },
  config: {
    cardsToDisplay: 3,
  },
};

const meta = {
  title: "Widgets/EventGrid",
  component: EventsGridWidget,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof EventsGridWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    widget,
  },
};
