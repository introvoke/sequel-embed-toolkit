import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

const CheckAndRenderExample: React.FC<{
  eventId: string;
  simulatedJoinCode?: string;
}> = ({ eventId, simulatedJoinCode }) => {
  const [status, setStatus] = useState<string>("Checking...");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Simulate URL parameter or cookie for demo
    if (simulatedJoinCode) {
      // Set a cookie for demonstration
      window.Sequel.setSequelJoinCodeCookie(eventId, simulatedJoinCode);
    }

    // Check if user is already registered
    window.Sequel.checkAndRenderIfRegistered({
      sequelEventId: eventId,
      onAlreadyRegistered: (joinCode: string) => {
        setStatus(`✅ User is already registered (Join Code: ${joinCode})`);
        setShowForm(false);
      },
      onNotRegistered: () => {
        setStatus("❌ User is not registered - showing form");
        setShowForm(true);
      },
    });
  }, [eventId, simulatedJoinCode]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Check and Render If Registered</h2>
        <p className="text-gray-600 mb-2">
          This example demonstrates the <code>checkAndRenderIfRegistered</code> function
          which automatically checks for existing registration via URL parameters or cookies
          and renders the Sequel event if found.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-sm font-semibold text-blue-900">Status:</p>
          <p className="text-sm text-blue-800">{status}</p>
        </div>
        <div className="text-sm text-gray-500">
          Event ID: <code>{eventId}</code>
          {simulatedJoinCode && (
            <>
              <br />
              Simulated Join Code (in cookie): <code>{simulatedJoinCode}</code>
            </>
          )}
        </div>
      </div>
      <div id="sequel_root" className="bg-white rounded-lg shadow-lg p-4 mb-4"></div>
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Registration Form</h3>
          <p className="text-gray-600 mb-4">
            Since no valid join code was found, you would show your custom registration form here.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-gray-500">
            Custom Registration Form Placeholder
          </div>
        </div>
      )}
    </div>
  );
};

const meta = {
  title: "Integrations/CheckAndRenderIfRegistered",
  component: CheckAndRenderExample,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    eventId: {
      control: { type: "text" },
      description: "The Sequel event ID to check registration for",
    },
    simulatedJoinCode: {
      control: { type: "text" },
      description: "Simulate a join code (will be set as a cookie for demo)",
    },
  },
} satisfies Meta<typeof CheckAndRenderExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotRegistered: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    simulatedJoinCode: undefined,
  },
};

export const AlreadyRegistered: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    simulatedJoinCode: "demoJoinCode123",
  },
};

