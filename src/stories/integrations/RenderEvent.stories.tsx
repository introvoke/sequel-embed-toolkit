import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const RenderEventExample: React.FC<{ 
  eventId: string;
  joinCode?: string;
}> = ({ eventId, joinCode }) => {
  useEffect(() => {
    // Clear previous content
    const root = document.getElementById("sequel_root");
    if (root) {
      root.innerHTML = "";
    }

    // Render Sequel event
    window.Sequel.renderEvent({
      eventId,
      joinCode: joinCode || "",
    });
  }, [eventId, joinCode]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Render Event Example</h2>
        <p className="text-gray-600">
          This example demonstrates the <code>renderEvent</code> function which
          renders a Sequel event with an optional join code.
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Event ID: <code>{eventId}</code>
          {joinCode && (
            <>
              <br />
              Join Code: <code>{joinCode}</code>
            </>
          )}
        </div>
      </div>
      <div id="sequel_root" className="bg-white rounded-lg shadow-lg p-4"></div>
    </div>
  );
};

const meta = {
  title: "Integrations/RenderEvent",
  component: RenderEventExample,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    eventId: {
      control: { type: "text" },
      description: "The Sequel event ID to render",
    },
    joinCode: {
      control: { type: "text" },
      description: "Optional join code for registered users",
    },
  },
} satisfies Meta<typeof RenderEventExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicEvent: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    joinCode: undefined,
  },
};

export const WithJoinCode: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    joinCode: "exampleJoinCode123",
  },
};

