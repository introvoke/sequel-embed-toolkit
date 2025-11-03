import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

const ListenHubspotSubmissionsExample: React.FC<{
  eventId: string;
}> = ({ eventId }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("Listening for HubSpot form submissions...");

  useEffect(() => {
    // Initialize the listener
    window.Sequel.listenHubspotFormSubmissions({
      sequelEventId: eventId,
    });

    // Also listen for postMessage events to show in UI
    const messageHandler = (event: MessageEvent) => {
      if (
        event.data.type === "hsFormCallback" &&
        event.data.eventName === "onFormSubmitted"
      ) {
        const submission = {
          timestamp: new Date().toISOString(),
          formId: event.data.data.formGuid,
          submissionValues: event.data.data.submissionValues,
        };
        setSubmissions((prev) => [submission, ...prev]);
        setStatus(`✅ Form submitted! (Total: ${submissions.length + 1})`);
      }
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [eventId, submissions.length]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Listen to HubSpot Form Submissions</h2>
          <p className="text-gray-600 mb-4">
            This example demonstrates the <code>listenHubspotFormSubmissions</code> function
            which listens for HubSpot form submissions and automatically registers users with Sequel.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm font-semibold text-blue-900">Status:</p>
            <p className="text-sm text-blue-800">{status}</p>
          </div>
          <div className="text-sm text-gray-500">
            Event ID: <code>{eventId}</code>
            <br />
            Submissions detected: <code>{submissions.length}</code>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>The listener is set up when the component mounts</li>
            <li>It listens for <code>hsFormCallback</code> messages from HubSpot forms</li>
            <li>When a form is submitted, it extracts firstname, lastname, and email</li>
            <li>It automatically registers the user with Sequel</li>
            <li>You can submit any HubSpot form on this page and it will be caught</li>
          </ol>
        </div>

        {submissions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Submission History</h3>
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Submission #{submissions.length - index}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(submission.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>
                      <strong>Form ID:</strong> <code className="text-xs">{submission.formId}</code>
                    </div>
                    {submission.submissionValues && (
                      <div className="mt-2 space-y-1">
                        <div>
                          <strong>Name:</strong>{" "}
                          {submission.submissionValues.firstname || ""}{" "}
                          {submission.submissionValues.lastname || ""}
                        </div>
                        <div>
                          <strong>Email:</strong> {submission.submissionValues.email || ""}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This listener works for any HubSpot form on the page. To test,
            you would need to add a HubSpot form to the page using the HubSpot forms script.
          </p>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "Integrations/ListenHubspotFormSubmissions",
  component: ListenHubspotSubmissionsExample,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    eventId: {
      control: { type: "text" },
      description: "The Sequel event ID to register users for",
    },
  },
} satisfies Meta<typeof ListenHubspotSubmissionsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListenForSubmissions: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
  },
};

