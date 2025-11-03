import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

const HubspotIntegrationExample: React.FC<{
  eventId: string;
  loadHubspotForm?: boolean;
  renderCountdown?: boolean;
}> = ({ eventId, loadHubspotForm = true, renderCountdown = false }) => {
  const [status, setStatus] = useState<string>("Initializing...");
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    // Load HubSpot Forms script if not already loaded
    const loadHubSpotScript = () => {
      if (window.hbspt) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        // Check if script is already in the document
        const existingScript = document.querySelector('script[src="https://js.hsforms.net/forms/v2.js"]');
        if (existingScript) {
          // Wait for script to load
          const checkInterval = setInterval(() => {
            if (window.hbspt) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!window.hbspt) {
              reject(new Error("HubSpot script failed to load"));
            }
          }, 5000);
          return;
        }

        // Create and load the script
        const script = document.createElement("script");
        script.src = "https://js.hsforms.net/forms/v2.js";
        script.async = true;
        script.onload = () => {
          // Wait a bit for window.hbspt to be available
          const checkInterval = setInterval(() => {
            if (window.hbspt) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!window.hbspt) {
              reject(new Error("HubSpot script loaded but hbspt is not available"));
            }
          }, 5000);
        };
        script.onerror = () => {
          reject(new Error("Failed to load HubSpot forms script"));
        };
        document.head.appendChild(script);
      });
    };

    // Set up listener for HubSpot form submissions
    const messageHandler = (event: MessageEvent) => {
      if (
        event.data.type === "hsFormCallback" &&
        event.data.eventName === "onFormSubmitted"
      ) {
        setStatus("✅ HubSpot form submitted! Registration in progress...");
        setHasRegistered(true);
      }
    };

    window.addEventListener("message", messageHandler);

    // Load HubSpot script, then initialize
    loadHubSpotScript()
      .then(() => {
        // Wait for DOM elements to be ready before calling the function
        const initialize = () => {
          const hubspotForm = document.getElementById("hubspotForm");
          const sequelRoot = document.getElementById("sequel_root");
          
          if (!hubspotForm || !sequelRoot) {
            // Wait a bit more for elements to be rendered
            setTimeout(initialize, 100);
            return;
          }

          // Clear previous content
          sequelRoot.innerHTML = "";
          if (hubspotForm) {
            hubspotForm.innerHTML = "";
          }

          // Initialize the HubSpot integration
          window.Sequel.renderSequelWithHubspotFrame({
            sequelEventId: eventId,
            loadHubspotForm,
            renderCountdown,
          }).then(() => {
            setStatus("Ready - HubSpot form is loaded");
          }).catch((err: any) => {
            setStatus(`Error: ${err.message}`);
          });
        };

        // Use setTimeout to ensure DOM is ready after render
        setTimeout(initialize, 0);
      })
      .catch((err: any) => {
        setStatus(`Error loading HubSpot script: ${err.message}`);
      });

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [eventId, loadHubspotForm, renderCountdown]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">HubSpot Form Integration</h2>
        <p className="text-gray-600 mb-4">
          This example demonstrates the <code>renderSequelWithHubspotFrame</code> function
          which integrates Sequel events with HubSpot forms.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-sm font-semibold text-blue-900">Status:</p>
          <p className="text-sm text-blue-800">{status}</p>
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          <div>Event ID: <code>{eventId}</code></div>
          <div>Load HubSpot Form: <code>{loadHubspotForm ? "true" : "false"}</code></div>
          <div>Render Countdown: <code>{renderCountdown ? "true" : "false"}</code></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">HubSpot Form Container</h3>
          <div id="hubspotForm" className="min-h-[400px] border-2 border-dashed border-gray-300 rounded p-4"></div>
          {loadHubspotForm && (
            <p className="text-sm text-gray-500 mt-2">
              HubSpot form will be rendered here when the event has a HubSpot form ID configured.
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Sequel Event</h3>
          <div id="sequel_root" className="min-h-[400px] border-2 border-dashed border-gray-300 rounded p-4"></div>
          {hasRegistered && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm text-green-800">
                ✅ User registered! Sequel event will render here.
              </p>
            </div>
          )}
        </div>
      </div>

      {renderCountdown && (
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Countdown</h3>
          <div id="sequel_countdown" className="min-h-[200px] border-2 border-dashed border-gray-300 rounded p-4"></div>
        </div>
      )}
    </div>
  );
};

const meta = {
  title: "Integrations/HubspotIntegration",
  component: HubspotIntegrationExample,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    eventId: {
      control: { type: "text" },
      description: "The Sequel event ID",
    },
    loadHubspotForm: {
      control: { type: "boolean" },
      description: "Whether to load the HubSpot form",
    },
    renderCountdown: {
      control: { type: "boolean" },
      description: "Whether to render a countdown timer",
    },
  },
} satisfies Meta<typeof HubspotIntegrationExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithHubspotForm: Story = {
  args: {
    eventId: "f771b652-3347-4eb0-b9dc-a7d5688705ce",
    loadHubspotForm: true,
    renderCountdown: false,
  },
};

export const WithCountdown: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    loadHubspotForm: true,
    renderCountdown: true,
  },
};

export const ListenToExistingForm: Story = {
  args: {
    eventId: "f39bd025-3a7c-475c-8019-f8bb48b3d5ee",
    loadHubspotForm: false,
    renderCountdown: false,
  },
};

