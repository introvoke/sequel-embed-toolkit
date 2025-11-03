import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const RegisterUserExample: React.FC<{
  eventId: string;
}> = ({ eventId }) => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const registrationResult = await window.Sequel.registerUserForEvent(
        eventId,
        formData.name,
        formData.email
      );
      setResult(registrationResult);

      // Optionally render the event after registration
      if (registrationResult.joinCode) {
        window.Sequel.setSequelJoinCodeCookie(eventId, registrationResult.joinCode);
        window.Sequel.renderEvent({
          eventId,
          joinCode: registrationResult.joinCode,
        });
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Register User for Event</h2>
          <p className="text-gray-600">
            This example demonstrates the <code>registerUserForEvent</code> function
            which registers a user with Sequel and returns a join code.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Registration Form</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register User"}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-900 mb-2">✅ Registration Successful!</h4>
            <pre className="text-sm text-green-800 bg-green-100 p-3 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-red-900 mb-2">❌ Registration Failed</h4>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Rendered Event</h3>
          <div id="sequel_root"></div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Event ID: <code>{eventId}</code>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "Integrations/RegisterUser",
  component: RegisterUserExample,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    eventId: {
      control: { type: "text" },
      description: "The Sequel event ID to register the user for",
    },
  },
} satisfies Meta<typeof RegisterUserExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegisterUser: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
  },
};

