import React from "react";

interface EventAgendaWidgetProps {
  config: {
    sections: {
      title: string;
      subheading?: string;
      image?: string;
    }[];
  };
}

export const EventAgendaWidget: React.FC<EventAgendaWidgetProps> = ({
  config,
}) => {
  return (
    <div className="agenda-widget border-2 border-dashed border-gray-400 p-8 rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Event Agenda</h3>
      <div className="space-y-4">
        {config.sections.map((section, idx) => (
          <div key={idx} className="agenda-section">
            {section.image && (
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <h4 className="font-bold text-base">{section.title}</h4>
            {section.subheading && (
              <p className="text-sm text-gray-600">{section.subheading}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
