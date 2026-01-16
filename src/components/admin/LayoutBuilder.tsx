import React, { useState } from 'react';
import { Widget } from './WidgetBuilder';

export interface Layout {
  id: string;
  name: string;
  description: string;
  rules: {
    engagementMin: number;
    engagementMax: number;
    funnelStage: 'top' | 'mid' | 'bottom';
    widgetIds: string[];
  }[];
}

interface LayoutBuilderProps {
  widgets: Widget[];
  onSave: (layout: Layout) => void;
  onCancel: () => void;
  existingLayout?: Layout;
}

export const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ widgets, onSave, onCancel, existingLayout }) => {
  const [layout, setLayout] = useState<Layout>(existingLayout || {
    id: 'layout_' + Date.now(),
    name: '',
    description: '',
    rules: [
      { engagementMin: 0, engagementMax: 49, funnelStage: 'top', widgetIds: [] },
      { engagementMin: 50, engagementMax: 79, funnelStage: 'mid', widgetIds: [] },
      { engagementMin: 80, engagementMax: 100, funnelStage: 'bottom', widgetIds: [] },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (layout.name) {
      onSave(layout);
    }
  };

  const toggleWidget = (ruleIndex: number, widgetId: string) => {
    setLayout(prev => {
      const newRules = [...prev.rules];
      const rule = newRules[ruleIndex];
      
      if (rule.widgetIds.includes(widgetId)) {
        rule.widgetIds = rule.widgetIds.filter(id => id !== widgetId);
      } else {
        rule.widgetIds.push(widgetId);
      }
      
      return { ...prev, rules: newRules };
    });
  };

  const getFunnelColor = (stage: 'top' | 'mid' | 'bottom') => {
    return stage === 'top' ? 'blue' : stage === 'mid' ? 'purple' : 'green';
  };

  const layoutTemplates = [
    {
      name: 'Aggressive Conversion',
      description: 'Move users quickly to bottom funnel',
      rules: [
        { engagementMin: 0, engagementMax: 29, funnelStage: 'top' as const, widgetIds: [] },
        { engagementMin: 30, engagementMax: 59, funnelStage: 'mid' as const, widgetIds: [] },
        { engagementMin: 60, engagementMax: 100, funnelStage: 'bottom' as const, widgetIds: [] },
      ],
    },
    {
      name: 'Nurture Focused',
      description: 'Longer mid-funnel engagement',
      rules: [
        { engagementMin: 0, engagementMax: 39, funnelStage: 'top' as const, widgetIds: [] },
        { engagementMin: 40, engagementMax: 84, funnelStage: 'mid' as const, widgetIds: [] },
        { engagementMin: 85, engagementMax: 100, funnelStage: 'bottom' as const, widgetIds: [] },
      ],
    },
  ];

  const applyTemplate = (template: typeof layoutTemplates[0]) => {
    setLayout(prev => ({
      ...prev,
      rules: template.rules,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {existingLayout ? 'Edit Layout' : 'Create New Layout'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout Name *
            </label>
            <input
              type="text"
              value={layout.name}
              onChange={(e) => setLayout({ ...layout, name: e.target.value })}
              placeholder="e.g., Marketing Event Layout"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={layout.description}
              onChange={(e) => setLayout({ ...layout, description: e.target.value })}
              placeholder="Brief description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Start Templates
          </label>
          <div className="grid grid-cols-2 gap-3">
            {layoutTemplates.map((template) => (
              <button
                key={template.name}
                type="button"
                onClick={() => applyTemplate(template)}
                className="text-left p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="font-semibold text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-500 mt-1">{template.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Funnel Stage Rules */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Configure Funnel Stages
          </label>
          <div className="space-y-4">
            {layout.rules.map((rule, ruleIndex) => {
              const color = getFunnelColor(rule.funnelStage);
              return (
                <div
                  key={ruleIndex}
                  className={`border-2 border-${color}-200 bg-${color}-50 rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className={`font-bold text-${color}-900`}>
                        {rule.funnelStage === 'top' ? '🔵 Top Funnel (Explore)' :
                         rule.funnelStage === 'mid' ? '🟣 Mid Funnel (Engage)' :
                         '🟢 Bottom Funnel (Convert)'}
                      </h3>
                      <p className="text-xs text-gray-600">
                        Shows when engagement is {rule.engagementMin}-{rule.engagementMax}%
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rule.engagementMin}
                        onChange={(e) => {
                          const newRules = [...layout.rules];
                          newRules[ruleIndex].engagementMin = parseInt(e.target.value);
                          setLayout({ ...layout, rules: newRules });
                        }}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rule.engagementMax}
                        onChange={(e) => {
                          const newRules = [...layout.rules];
                          newRules[ruleIndex].engagementMax = parseInt(e.target.value);
                          setLayout({ ...layout, rules: newRules });
                        }}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>

                  {/* Widget Selection */}
                  <div className="bg-white rounded p-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Select Widgets to Show ({rule.widgetIds.length} selected)
                    </p>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {widgets
                        .filter(w => w.funnelStage === rule.funnelStage)
                        .map((widget) => (
                          <label
                            key={widget.id}
                            className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={rule.widgetIds.includes(widget.id)}
                              onChange={() => toggleWidget(ruleIndex, widget.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {widget.type === 'poll' && '📊'} 
                                {widget.type === 'nps' && '⭐'}
                                {widget.type === 'survey' && '📝'}
                                {widget.type === 'newsletter' && '📮'}
                                {widget.type === 'blog' && '✍️'}
                                {widget.type === 'video' && '🎥'}
                                {widget.type === 'doc' && '📚'}
                                {widget.type === 'webinar' && '📹'}
                                {widget.type === 'demo' && '🎯'}
                                {' '}{widget.title}
                              </div>
                              <div className="text-xs text-gray-500 truncate">{widget.type}</div>
                            </div>
                          </label>
                        ))}
                    </div>
                    {widgets.filter(w => w.funnelStage === rule.funnelStage).length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        No widgets available for {rule.funnelStage} funnel. Create widgets first.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {existingLayout ? 'Update Layout' : 'Create Layout'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

