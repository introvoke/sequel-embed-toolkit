import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const RenderEventWithWidgets: React.FC<{
  eventId: string;
  joinCode?: string;
  enableWidgets?: boolean;
}> = ({ eventId, joinCode, enableWidgets = true }) => {
  useEffect(() => {
    // Clear previous content
    const root = document.getElementById("sequel_root");
    if (root) {
      root.innerHTML = "";
      // Remove any existing shadow roots
      if (root.shadowRoot) {
        root.shadowRoot.innerHTML = "";
      }
    }

    // Render Sequel event with widgets
    window.Sequel.renderEvent({
      eventId,
      joinCode: joinCode || "",
      enableWidgets,
    });
  }, [eventId, joinCode, enableWidgets]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">
          Render Event with Widgets Example
        </h2>
        <p className="text-gray-600">
          This example demonstrates the <code>renderEvent</code> function with{" "}
          <code>enableWidgets: true</code>. The widgets are fetched from the
          Sequel API and rendered in a shadow DOM for style isolation.
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Event ID: <code>{eventId}</code>
          {joinCode && (
            <>
              <br />
              Join Code: <code>{joinCode}</code>
            </>
          )}
          <br />
          Widgets Enabled: <code>{String(enableWidgets)}</code>
        </div>
      </div>
      <div id="sequel_root" className="bg-white rounded-lg shadow-lg p-4"></div>
    </div>
  );
};

const meta = {
  title: "Integrations/RenderEventWithWidgets",
  component: RenderEventWithWidgets,
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
    enableWidgets: {
      control: { type: "boolean" },
      description:
        "Enable the new widgets-based rendering (requires API support)",
    },
  },
} satisfies Meta<typeof RenderEventWithWidgets>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithWidgetsEnabled: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    joinCode: undefined,
    enableWidgets: true,
  },
};

export const WithWidgetsAndJoinCode: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    joinCode: "exampleJoinCode123",
    enableWidgets: true,
  },
};

export const LegacyRenderingComparison: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    joinCode: undefined,
    enableWidgets: false,
  },
};
