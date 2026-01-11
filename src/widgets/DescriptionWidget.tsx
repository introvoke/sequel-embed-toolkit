import React from "react";

type DescriptionWidget = {
  type: "description";
  config: {
    description?: string;
  };
};

interface DescriptionWidgetProps {
  config: DescriptionWidget["config"];
}

export const DescriptionWidget: React.FC<DescriptionWidgetProps> = ({
  config,
}) => {
  if (!config.description) {
    return null;
  }

  return (
    <div className="text-sm text-gray-700">
      <div
        dangerouslySetInnerHTML={{
          __html: config.description,
        }}
      />
    </div>
  );
};
