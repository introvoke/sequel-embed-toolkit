import React, { useState } from 'react';

export interface Widget {
  id: string;
  type: 'poll' | 'nps' | 'survey' | 'newsletter' | 'blog' | 'video' | 'doc' | 'webinar' | 'demo';
  title: string;
  description: string;
  url: string;
  funnelStage: 'top' | 'mid' | 'bottom';
  thumbnail?: string;
  targetRoles?: string[];
  targetCompanySizes?: string[];
  customContent?: any;
}

interface WidgetBuilderProps {
  onSave: (widget: Widget) => void;
  onCancel: () => void;
  existingWidget?: Widget;
}

export const WidgetBuilder: React.FC<WidgetBuilderProps> = ({ onSave, onCancel, existingWidget }) => {
  const [widget, setWidget] = useState<Widget>(existingWidget || {
    id: 'widget_' + Date.now(),
    type: 'blog',
    title: '',
    description: '',
    url: '',
    funnelStage: 'top',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (widget.title && widget.description && widget.url) {
      onSave(widget);
    }
  };

  const widgetTemplates = [
    {
      name: 'Quick Poll',
      type: 'poll' as const,
      funnelStage: 'top' as const,
      title: 'What\'s Your Biggest Marketing Challenge?',
      description: 'Help us understand your priorities - takes 30 seconds',
    },
    {
      name: 'NPS Survey',
      type: 'nps' as const,
      funnelStage: 'mid' as const,
      title: 'How Likely Are You to Recommend This Event?',
      description: 'Share your feedback and help us improve',
    },
    {
      name: 'Demo Booking',
      type: 'demo' as const,
      funnelStage: 'bottom' as const,
      title: 'Book a Personalized Demo',
      description: 'See the platform in action with a solution consultant',
    },
    {
      name: 'Newsletter Signup',
      type: 'newsletter' as const,
      funnelStage: 'mid' as const,
      title: 'Subscribe to Marketing Insights Weekly',
      description: 'Get exclusive tips and trends delivered every Tuesday',
    },
  ];

  const applyTemplate = (template: typeof widgetTemplates[0]) => {
    setWidget(prev => ({
      ...prev,
      ...template,
      url: 'https://example.com/' + template.type,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {existingWidget ? 'Edit Widget' : 'Create New Widget'}
      </h2>

      {/* Quick Templates */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Start Templates
        </label>
        <div className="grid grid-cols-2 gap-3">
          {widgetTemplates.map((template) => (
            <button
              key={template.name}
              type="button"
              onClick={() => applyTemplate(template)}
              className="text-left p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="font-semibold text-gray-900">{template.name}</div>
              <div className="text-xs text-gray-500">{template.type} • {template.funnelStage} funnel</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Widget Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Widget Type *
          </label>
          <select
            value={widget.type}
            onChange={(e) => setWidget({ ...widget, type: e.target.value as Widget['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <optgroup label="Interactive">
              <option value="poll">📊 Poll</option>
              <option value="nps">⭐ NPS Survey</option>
              <option value="survey">📝 Survey</option>
              <option value="newsletter">📮 Newsletter</option>
            </optgroup>
            <optgroup label="Content">
              <option value="blog">✍️ Blog Post</option>
              <option value="video">🎥 Video</option>
              <option value="doc">📚 Document/Guide</option>
              <option value="webinar">📹 Webinar</option>
            </optgroup>
            <optgroup label="Conversion">
              <option value="demo">🎯 Demo Booking</option>
            </optgroup>
          </select>
        </div>

        {/* Funnel Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funnel Stage *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['top', 'mid', 'bottom'] as const).map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setWidget({ ...widget, funnelStage: stage })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  widget.funnelStage === stage
                    ? stage === 'top'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : stage === 'mid'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">
                  {stage === 'top' ? '🔵 Top' : stage === 'mid' ? '🟣 Mid' : '🟢 Bottom'}
                </div>
                <div className="text-xs mt-1">
                  {stage === 'top' ? 'Explore' : stage === 'mid' ? 'Engage' : 'Convert'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={widget.title}
            onChange={(e) => setWidget({ ...widget, title: e.target.value })}
            placeholder="e.g., What's Your Biggest Marketing Challenge?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={widget.description}
            onChange={(e) => setWidget({ ...widget, description: e.target.value })}
            placeholder="Brief description of this widget..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL *
          </label>
          <input
            type="url"
            value={widget.url}
            onChange={(e) => setWidget({ ...widget, url: e.target.value })}
            placeholder="https://example.com/resource"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL (optional)
          </label>
          <input
            type="url"
            value={widget.thumbnail || ''}
            onChange={(e) => setWidget({ ...widget, thumbnail: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {existingWidget ? 'Update Widget' : 'Create Widget'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};



