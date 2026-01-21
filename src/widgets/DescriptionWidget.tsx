import React, { useMemo } from "react";
import DOMPurify from "dompurify";

// Local type definition until API types are available
type DescriptionWidgetType = {
  type: "description";
  data: {
    html: string;
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

  // Sanitize HTML
  const sanitizedHtml = useMemo(() => {
    return DOMPurify.sanitize(data.html, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "strong",
        "b",
        "em",
        "i",
        "ul",
        "ol",
        "li",
        "a",
        "br",
      ],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });
  }, [data.html]);

  // Don't render if no content
  if (!sanitizedHtml.trim()) {
    return null;
  }

  const spacing = SPACING_VALUES[config.verticalSpacing ?? "medium"];
  const fontColor = config.fontColor ?? "#000000";

  return (
    <div
      style={{
        color: fontColor,
        paddingTop: spacing,
        paddingBottom: spacing,
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
