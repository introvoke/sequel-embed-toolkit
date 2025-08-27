import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const EventGridWidget: React.FC<{ 
  companyId: string; 
  darkMode?: boolean; 
  excludeText?: string; 
  showDescription?: boolean;
}> = ({ companyId, darkMode = false, excludeText = "", showDescription = false }) => {
  useEffect(() => {
    window.Sequel.renderEventGrid({
      companyId,
      darkMode,
      excludeText,
      showDescription,
    });
  }, [companyId, darkMode, excludeText, showDescription]);

  return <div id="sequel_root"></div>;
};

const meta = {
  title: "Widgets/EventGrid",
  component: EventGridWidget,
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
  },
} satisfies Meta<typeof EventGridWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: false,
    excludeText: "",
    showDescription: false,
  },
};

export const DarkMode: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: true,
    excludeText: "",
    showDescription: false,
  },
};

export const WithDescription: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: false,
    excludeText: "",
    showDescription: true,
  },
};

export const DarkModeWithDescription: Story = {
  args: {
    companyId: "8f956eae-f2ee-4095-b00f-58edbbaeaa23", // Replace with a real company ID that has events
    darkMode: true,
    excludeText: "",
    showDescription: true,
  },
};
