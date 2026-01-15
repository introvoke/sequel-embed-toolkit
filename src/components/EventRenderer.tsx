import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadFont } from "@introvoke/react/utils/font";
import { trpcSequelApi } from "@src/api/apiConfig";
import { EmbedIframe } from "@src/routes/EmbedIframe";
import { WidgetContainer } from "@src/widgets/WidgetContainer";
import { useShadowRoot } from "@src/components/Providers";

interface EventRendererProps {
  eventId: string;
  joinCode: string;
  hybrid?: boolean;
  isPopup?: boolean;
}

const INTER_FONT = {
  name: "Inter",
  url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
};

export const EventRenderer = ({
  eventId,
  joinCode,
  hybrid,
  isPopup,
}: EventRendererProps) => {
  const shadowRoot = useShadowRoot();
  const { data, isLoading } = useQuery({
    queryKey: ["widgets", eventId],
    queryFn: () => trpcSequelApi.widgets.getWidgets.query({ eventId }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const widgets = data?.widgets ?? [];
  const hasWidgets = widgets.length > 0;
  // Type assertion for font field until sequel-trpc package is updated
  const font = (data as any)?.font ?? INTER_FONT;

  // Load font into shadow DOM
  useEffect(() => {
    if (hasWidgets && shadowRoot) {
      loadFont({
        name: font.name,
        url: font.url,
        // Cast ShadowRoot to HTMLElement - both have appendChild method
        root: shadowRoot as unknown as HTMLElement,
      });
    }
  }, [hasWidgets, shadowRoot, font.name, font.url]);

  // Scoped font override styles to ensure font-family applies to all descendant elements
  const fontOverrideStyles = `
    .event-widgets * {
      font-family: ${font.name}, Inter, Arial, sans-serif !important;
    }
  `;

  return (
    <div
      className="event-widgets flex flex-col gap-6"
      style={hasWidgets ? { fontFamily: font.name } : undefined}
    >
      {hasWidgets && <style>{fontOverrideStyles}</style>}
      {/* Iframe renders immediately - no blocking */}
      <EmbedIframe
        eventId={eventId}
        joinCode={joinCode}
        hybrid={hybrid}
        isPopup={isPopup}
      />

      {/* Widgets render after loading, only if there are any */}
      {!isLoading && hasWidgets && (
        <WidgetContainer
          widgets={widgets as any[]}
          joinCode={joinCode}
          hybrid={hybrid}
          isPopup={isPopup}
        />
      )}
    </div>
  );
};
