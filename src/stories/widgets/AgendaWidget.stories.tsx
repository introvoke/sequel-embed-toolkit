import type { Meta, StoryObj } from "@storybook/react";
import "@src/index.css";
import { AgendaWidget } from "@src/widgets/AgendaWidget";

const widget = {
  type: "agenda" as const,
  data: {
    items: [
      {
        // Live session
        startDate: new Date(Date.now() - 10 * 60 * 1000), // Started 10 mins ago
        endDate: new Date(Date.now() + 50 * 60 * 1000), // Ends in 50 mins
        sessions: [
          {
            title: "Marketing Reimagined",
            description:
              "Join industry leaders and marketing innovators for a dynamic keynote exploring the latest trends, strategies, and technologies shaping the future of marketing. Discover how to connect with audiences in more meaningful ways and...",
            speakers: [
              {
                name: "Jacob Walker",
                title: "Product Marketing",
              },
              {
                name: "Ethan Brooks",
                title: "Data Analyst",
              },
              {
                name: "Logan Carter",
                title: "Product Marketing",
              },
            ],
          },
        ],
      },
      {
        // Upcoming session - ~4 hours 24 minutes from now
        startDate: new Date(Date.now() + 4 * 60 * 60 * 1000 + 24 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 60 * 60 * 1000 + 24 * 60 * 1000),
        sessions: [
          {
            title: "Data-Driven Impact",
            description:
              "Explore how cutting-edge analytics and real-time insights are transforming marketing strategies. Learn how to harness data to drive smarter decisions, personalize customer experiences, and boost ROI.",
            speakers: [
              {
                name: "Jacob Walker",
                title: "Product Marketing",
              },
              {
                name: "Logan Carter",
                title: "Product Marketing",
              },
            ],
          },
        ],
      },
      {
        // Upcoming session - ~4 hours 24 minutes from now
        startDate: new Date(Date.now() + 4 * 60 * 60 * 1000 + 24 * 60 * 1000),
        endDate: new Date(Date.now() + 5 * 60 * 60 * 1000 + 24 * 60 * 1000),
        sessions: [
          {
            title: "Futureproof Brands",
            description:
              "Discover the strategies top brands use to stay relevant in a rapidly evolving marketplace. From emerging tech to shifting consumer values, learn how to build a brand that thrives in tomorrow's world.",
            speakers: [
              {
                name: "Jacob Walker",
                title: "Product Marketing",
              },
              {
                name: "Ethan Brooks",
                title: "Data Analyst",
              },
              {
                name: "Logan Carter",
                title: "Product Marketing",
              },
            ],
          },
        ],
      },
    ],
  },
  config: {
    displaySpeakerPhoto: true,
    displayLiveCountdowns: true,
    textColor: "#111827",
    secondaryColor: "#fcd34d", // Yellow/amber card background
    buttonColor: "#18181b", // Dark button
    buttonTextColor: "#ffffff",
    cardTextColor: "#111827",
    subtitleColor: "#6b7280",
  },
};

const meta = {
  title: "Widgets/Agenda",
  component: AgendaWidget,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof AgendaWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    widget,
  },
};

export const Themed: Story = {
  args: {
    widget: {
      ...widget,
      config: {
        ...widget.config,
        textColor: "#0f172a",
        primaryColor: "#8b5cf6",
        secondaryColor: "#ede9fe", // Light purple card background
        buttonColor: "#8b5cf6",
        buttonTextColor: "#ffffff",
        cardTextColor: "#1e1b4b",
        subtitleColor: "#6b7280",
      },
    },
  },
};
