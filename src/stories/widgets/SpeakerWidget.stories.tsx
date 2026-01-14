import type { Meta, StoryObj } from "@storybook/react";
import "@src/index.css";
import { SpeakerWidget } from "@src/widgets/SpeakerWidget";

const widgetBase = {
  type: "speaker" as const,
  data: {
    speakers: [
      {
        name: "Jacob Walker",
        title: "Product Marketing",
        image: "https://i.pravatar.cc/150?img=12",
        linkedInProfileLink: "https://www.linkedin.com/in/jacobwalker",
      },
      {
        name: "Sarah Johnson",
        title: "Senior Engineer",
        image: "https://i.pravatar.cc/150?img=47",
        linkedInProfileLink: "https://www.linkedin.com/in/sarahjohnson",
      },
      {
        name: "Michael Chen",
        title: "Head of Design",
        image: "https://i.pravatar.cc/150?img=33",
        linkedInProfileLink: "https://www.linkedin.com/in/michaelchen",
      },
    ],
  },
};

const meta = {
  title: "Widgets/SpeakerWidget",
  component: SpeakerWidget,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SpeakerWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    widget: {
      ...widgetBase,
      config: {},
    },
  },
};

export const WithoutAvatars: Story = {
  args: {
    widget: {
      type: "speaker",
      data: {
        speakers: [
          {
            name: "Jacob Walker",
            title: "Product Marketing",
            linkedInProfileLink: "https://www.linkedin.com/in/jacobwalker",
          },
          {
            name: "Sarah Johnson",
            title: "Senior Engineer",
            linkedInProfileLink: "https://www.linkedin.com/in/sarahjohnson",
          },
        ],
      },
      config: { showSpeakerPhoto: false },
    },
  },
};

export const HideLinkedIn: Story = {
  args: {
    widget: {
      ...widgetBase,
      config: { showSpeakerLinkedIn: false },
    },
  },
};

export const SingleSpeaker: Story = {
  args: {
    widget: {
      type: "speaker",
      data: {
        speakers: [
          {
            name: "Jacob Walker",
            title: "Product Marketing",
            image: "https://i.pravatar.cc/150?img=12",
            linkedInProfileLink: "https://www.linkedin.com/in/jacobwalker",
          },
        ],
      },
      config: {},
    },
  },
};

export const NoSpeakers: Story = {
  args: {
    widget: {
      type: "speaker",
      data: { speakers: [] },
      config: {},
    },
  },
};

export const CustomColors: Story = {
  args: {
    widget: {
      ...widgetBase,
      config: {
        speakerNameColor: "#0f172a",
        speakerTitleColor: "#64748b",
        linkedInLinkColor: "#2563eb",
        cardBackgroundColor: "#ff00ff",
        cardBorderColor: "#e2e8f0",
      },
    },
  },
};
