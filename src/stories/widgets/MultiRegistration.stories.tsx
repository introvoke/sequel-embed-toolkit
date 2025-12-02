import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const MultiRegistrationWidget: React.FC<{ 
  eventIds: string[];
  darkMode?: boolean;
}> = ({ eventIds, darkMode = false }) => {
  useEffect(() => {
    window.Sequel.renderMultiRegistration({
      eventIds,
      darkMode,
      onRegistrationComplete: (joinCodes: { eventId: string; joinCode: string }[]) => {
        console.log('Registration completed for events:', joinCodes);
      },
    });
  }, [eventIds, darkMode]);

  return (
    <div 
      className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}
      style={{ backgroundColor: darkMode ? '#000000' : '#ffffff' }}
    >
      <div id="sequel_root"></div>
    </div>
  );
};

const meta = {
  title: "Widgets/MultiRegistration",
  component: MultiRegistrationWidget,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    eventIds: {
      control: { type: "object" },
      description: "Array of Sequel event IDs (up to 3 events)",
    },
    darkMode: {
      control: { type: "boolean" },
      description: "Enable dark mode styling",
    },
  },
} satisfies Meta<typeof MultiRegistrationWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample event IDs - replace with actual event IDs for testing
const SAMPLE_EVENT_IDS = [
  "723b6d9d-238c-48e5-84f7-17bb2d97fe02", // Example event ID
  "723b6d9d-238c-48e5-84f7-17bb2d97fe02", // Example event ID
  "723b6d9d-238c-48e5-84f7-17bb2d97fe02", // Example event ID
];

export const LightMode: Story = {
  args: {
    eventIds: SAMPLE_EVENT_IDS,
    darkMode: false,
  },
};

export const DarkMode: Story = {
  args: {
    eventIds: SAMPLE_EVENT_IDS,
    darkMode: true,
  },
};

export const SingleEvent: Story = {
  args: {
    eventIds: [SAMPLE_EVENT_IDS[0]],
    darkMode: false,
  },
};

export const TwoEvents: Story = {
  args: {
    eventIds: [SAMPLE_EVENT_IDS[0], SAMPLE_EVENT_IDS[1]],
    darkMode: false,
  },
};

export const DarkModeTwoEvents: Story = {
  args: {
    eventIds: [SAMPLE_EVENT_IDS[0], SAMPLE_EVENT_IDS[1]],
    darkMode: true,
  },
};

