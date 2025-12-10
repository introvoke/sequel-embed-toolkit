import React from "react";

interface DescriptionWidgetProps {
  config: {
    description?: string;
  };
}

export const DescriptionWidget: React.FC<DescriptionWidgetProps> = ({
  config,
}) => {
  return (
    <div className="description-widget border-2 border-dashed border-gray-400 p-8 rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-2">Description Widget</h3>
      <div className="text-sm text-gray-700">
        {config.description ? (
          <div
            dangerouslySetInnerHTML={{
              __html: config.description,
            }}
          />
        ) : (
          <p className="text-gray-500">No description available</p>
        )}
      </div>
    </div>
  );
};
