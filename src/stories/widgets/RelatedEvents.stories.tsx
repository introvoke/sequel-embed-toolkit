import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const RelatedEventsWidget: React.FC<{ 
  companyId: string; 
  darkMode?: boolean; 
  excludeText?: string; 
  showDescription?: boolean;
  maxEvents?: number;
}> = ({ companyId, darkMode = false, excludeText = "", showDescription = false, maxEvents = 6 }) => {
  useEffect(() => {
    window.Sequel.renderRelatedEvents({
      companyId,
      darkMode,
      excludeText,
      showDescription,
      maxEvents,
    });
  }, [companyId, darkMode, excludeText, showDescription, maxEvents]);

  return (
    <div 
      className={`p-8 min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}
      style={{ backgroundColor: darkMode ? '#000000' : '#ffffff' }}
    >
      <div id="sequel_root"></div>
    </div>
  );
};

const meta = {
  title: "Widgets/RelatedEvents",
  component: RelatedEventsWidget,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    companyId: {
      control: { type: "text" },
      description: "The company ID to fetch events for",
    },
    darkMode: {
      control: { type: "boolean" },
      description: "Enable dark mode styling",
    },
    excludeText: {
      control: { type: "text" },
      description: "Text to exclude events starting with (e.g., 'test')",
    },
    showDescription: {
      control: { type: "boolean" },
      description: "Show event descriptions below the title",
    },
    maxEvents: {
      control: { type: "number", min: 1, max: 12, step: 1 },
      description: "Maximum number of events to show",
    },
  },
} satisfies Meta<typeof RelatedEventsWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: false,
    excludeText: "",
    showDescription: false,
    maxEvents: 6,
  },
};

export const DarkMode: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: true,
    excludeText: "",
    showDescription: false,
    maxEvents: 6,
  },
};

export const WithDescriptions: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: false,
    excludeText: "",
    showDescription: true,
    maxEvents: 6,
  },
};

export const CustomCount: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: false,
    excludeText: "",
    showDescription: false,
    maxEvents: 9,
  },
};

export const Minimal: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: false,
    excludeText: "",
    showDescription: false,
    maxEvents: 3,
  },
};
