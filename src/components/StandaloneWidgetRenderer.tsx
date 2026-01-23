import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadFont } from "@introvoke/react/utils/font";
import { trpcSequelApi } from "@src/api/apiConfig";
import { WidgetContainer } from "@src/widgets/WidgetContainer";
import { useShadowRoot } from "@src/components/Providers";

interface StandaloneWidgetRendererProps {
  companyId: string;
  widgetSetId: string;
}

const INTER_FONT = {
  name: "Inter",
  url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
};

export const StandaloneWidgetRenderer = ({
  companyId,
  widgetSetId,
}: StandaloneWidgetRendererProps) => {
  const shadowRoot = useShadowRoot();
  const { data, isLoading, error } = useQuery({
    queryKey: ["standaloneWidgets", companyId, widgetSetId],
    queryFn: () =>
      trpcSequelApi.widgets.getStandaloneWidgets.query({
        companyId,
        widgetSetId,
      }),
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
    .standalone-widgets * {
      font-family: ${font.name}, Inter, Arial, sans-serif !important;
    }
  `;

  // Error handling - fail silently (per requirements)
  if (error) {
    console.error("Error loading standalone widgets:", error);
    return null;
  }

  // Loading state - render nothing
  if (isLoading) {
    return null;
  }

  // No widgets - render nothing
  if (!hasWidgets) {
    return null;
  }

  return (
    <div
      className="standalone-widgets flex flex-col gap-6"
      style={{ fontFamily: font.name }}
    >
      <style>{fontOverrideStyles}</style>
      <WidgetContainer widgets={widgets as any[]} joinCode="" />
    </div>
  );
};
