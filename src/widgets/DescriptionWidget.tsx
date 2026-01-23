import React from "react";
import { Description } from "@introvoke/react/components/widgets/Description";

// Local type definition until API types are available
type DescriptionWidgetType = {
  type: "description";
  data: {
    title?: string;
    content?: string;
    html: string; // legacy field
  };
  config: {
    verticalSpacing?: "none" | "small" | "medium" | "large";
    fontColor?: string;
  };
};

interface DescriptionWidgetProps {
  widget: DescriptionWidgetType;
}

const SPACING_VALUES = {
  none: "0px",
  small: "16px",
  medium: "32px",
  large: "64px",
} as const;

export const DescriptionWidget: React.FC<DescriptionWidgetProps> = ({
  widget,
}) => {
  const { data, config } = widget;

  const spacing = SPACING_VALUES[config.verticalSpacing ?? "medium"];
  const fontColor = config.fontColor ?? "#000000";

  // Use content if available, fall back to html for backward compatibility
  const content = data.content || data.html || "";

  // Don't render if no content and no title
  if (!content && !data.title) {
    return null;
  }

  return (
    <div style={{ marginTop: spacing, marginBottom: spacing }}>
      <Description
        title={data.title}
        content={content}
        style={{
          "--sequel-description-widget-fontColor": fontColor,
        } as React.CSSProperties}
      />
    </div>
  );
};
