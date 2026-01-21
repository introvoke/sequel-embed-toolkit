import type { Meta, StoryObj } from "@storybook/react";
import "@src/index.css";
import { WidgetContainer } from "@src/widgets/WidgetContainer";

// Mock widget data that would come from the API
const mockWidgets = [
  {
    type: "eventGrid" as const,
    data: {
      events: [
        {
          id: "evt-1",
          name: "Product Launch Webinar",
          description: "Join us for an exciting product launch event",
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          picture: "https://placekitten.com/400/240",
        },
        {
          id: "evt-2",
          name: "Customer Success Workshop",
          description: "Learn best practices from our experts",
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
          picture: "https://placekitten.com/401/240",
        },
        {
          id: "evt-3",
          name: "Quarterly Business Review",
          description: "Review our progress and upcoming roadmap",
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000),
          picture: "https://placekitten.com/402/240",
        },
      ],
    },
    config: {
      cardsToDisplay: 3,
    },
  },
];

const meta = {
  title: "Widgets/StandaloneWidgets",
  component: WidgetContainer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Demonstrates standalone widget rendering as it would appear when using Sequel.embedWidgets()",
      },
    },
  },
} satisfies Meta<typeof WidgetContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    widgets: mockWidgets,
    joinCode: "",
  },
};

export const EmptyState: Story = {
  args: {
    widgets: [],
    joinCode: "",
  },
};

export const SingleEvent: Story = {
  args: {
    widgets: [
      {
        type: "eventGrid" as const,
        data: {
          events: [mockWidgets[0].data.events[0]],
        },
        config: {
          cardsToDisplay: 1,
        },
      },
    ],
    joinCode: "",
  },
};
