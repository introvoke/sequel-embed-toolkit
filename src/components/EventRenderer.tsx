import { useQuery } from "@tanstack/react-query";
import { trpcSequelApi } from "@src/api/apiConfig";
import { EmbedIframe } from "@src/routes/EmbedIframe";
import { WidgetContainer } from "@src/widgets/WidgetContainer";

interface EventRendererProps {
  eventId: string;
  joinCode: string;
  hybrid?: boolean;
  isPopup?: boolean;
}

export const EventRenderer = ({
  eventId,
  joinCode,
  hybrid,
  isPopup,
}: EventRendererProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["widgets", eventId],
    queryFn: () => trpcSequelApi.widgets.getWidgets.query({ eventId }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const widgets = data?.widgets ?? [];
  const hasWidgets = widgets.length > 0;

  return (
    <div className="flex flex-col gap-6">
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
