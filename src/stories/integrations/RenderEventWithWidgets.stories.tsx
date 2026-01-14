import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import "@src/index.css";
import { WidgetContainer } from "@src/widgets/WidgetContainer";
import { trpcSequelApi } from "@src/api/apiConfig";
import type { AppRouter } from "@introvoke/sequel-trpc";

type PreviewLayout =
  AppRouter["widgets"]["previewWidgets"]["_def"]["_input_in"]["layout"];

const layoutEmbedCountdownDescriptionAgenda: PreviewLayout = {
  title: "Embed + Countdown + Description + Agenda (preview-safe)",
  rows: [
    {
      type: "countdown",
      config: {
        valueTextColor: "#111827",
        unitTextColor: "#6b7280",
        cardBackgroundColor: "#f3f4f6",
        cardBorderColor: "#e5e7eb",
      },
    },
    {
      type: "agenda",
      config: {
        sessionCardTextColor: "#111827",
        timelineDotColor: "#ef4444",
        buttonBackgroundColor: "#ef4444",
        buttonTextColor: "#ffffff",
      },
    },
    { type: "speaker" as const, config: { showSpeakerPhoto: true } },
    // place event grid at the bottom
    { type: "eventGrid" as const, config: { cardsToDisplay: 3 } },
  ],
};

const layoutEmbedDescriptionCountdownSpeakers: PreviewLayout = {
  title: "Embed + Description + Countdown + Speakers (preview-safe)",
  rows: [
    {
      type: "countdown",
      config: {
        valueTextColor: "#111827",
        unitTextColor: "#6b7280",
        cardBackgroundColor: "#f3f4f6",
        cardBorderColor: "#e5e7eb",
      },
    },
    {
      type: "speaker",
      config: {
        showSpeakerPhoto: true,
        showSpeakerTitle: true,
        showSpeakerLinkedIn: true,
      },
    },
    // place event grid at the bottom
    { type: "eventGrid" as const, config: { cardsToDisplay: 3 } },
  ],
};

const RenderEventWithWidgets: React.FC<{
  layout?: typeof layoutEmbedCountdownDescriptionAgenda;
  joinCode?: string;
}> = ({ layout = layoutEmbedCountdownDescriptionAgenda, joinCode }) => {
  const [widgets, setWidgets] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    trpcSequelApi.widgets.previewWidgets
      .query({ layout })
      .then((res) => {
        if (!mounted) return;
        setWidgets(res.widgets);
      })
      .catch((err) => {
        console.error("Failed to fetch preview widgets", err);
        if (mounted) setError("Failed to load preview widgets");
      });
    return () => {
      mounted = false;
    };
  }, [layout]);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">
          Render Event with Widgets (Preview)
        </h2>
        <p className="text-gray-600">
          Uses the widgets preview endpoint with dummy data; no live event is
          required.
        </p>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {!error && !widgets && (
        <div className="text-gray-500">Loading widgets…</div>
      )}
      {widgets && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <WidgetContainer widgets={widgets} joinCode={joinCode || ""} />
        </div>
      )}
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
    joinCode: {
      control: { type: "text" },
      description: "Optional join code for registered users",
    },
  },
} satisfies Meta<typeof RenderEventWithWidgets>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmbedCountdownDescriptionAgenda: Story = {
  args: {
    layout: layoutEmbedCountdownDescriptionAgenda,
    joinCode: "",
  },
};

export const EmbedDescriptionCountdownSpeakers: Story = {
  args: {
    layout: layoutEmbedDescriptionCountdownSpeakers,
    joinCode: "",
  },
};
