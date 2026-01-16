import React, { useState } from 'react';
import { Widget, WidgetBuilder } from './WidgetBuilder';
import { Layout, LayoutBuilder } from './LayoutBuilder';

type View = 'dashboard' | 'widget-builder' | 'layout-builder' | 'preview';

export const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [widgets, setWidgets] = useState<Widget[]>([
    // Pre-populated with some examples
    {
      id: 'widget_1',
      type: 'poll',
      title: 'What\'s Your Biggest Marketing Challenge?',
      description: 'Help us understand your priorities',
      url: 'https://example.com/poll',
      funnelStage: 'top',
      thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
    },
    {
      id: 'widget_2',
      type: 'blog',
      title: '7 Event Marketing Trends Shaping 2024',
      description: 'Latest insights from analyzing 10,000+ webinars',
      url: 'https://example.com/blog',
      funnelStage: 'top',
      thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
    },
    {
      id: 'widget_3',
      type: 'nps',
      title: 'How Likely Are You to Recommend This Event?',
      description: 'Share your feedback and help us improve',
      url: 'https://example.com/nps',
      funnelStage: 'mid',
      thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
    },
    {
      id: 'widget_4',
      type: 'demo',
      title: 'Book a Personalized Demo',
      description: 'See the platform in action',
      url: 'https://example.com/demo',
      funnelStage: 'bottom',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    },
  ]);
  
  const [layouts, setLayouts] = useState<Layout[]>([
    {
      id: 'layout_1',
      name: 'Default Marketing Layout',
      description: 'Standard funnel progression for marketing events',
      rules: [
        { engagementMin: 0, engagementMax: 49, funnelStage: 'top', widgetIds: ['widget_1', 'widget_2'] },
        { engagementMin: 50, engagementMax: 79, funnelStage: 'mid', widgetIds: ['widget_3'] },
        { engagementMin: 80, engagementMax: 100, funnelStage: 'bottom', widgetIds: ['widget_4'] },
      ],
    },
  ]);
  
  const [editingWidget, setEditingWidget] = useState<Widget | undefined>();
  const [editingLayout, setEditingLayout] = useState<Layout | undefined>();
  const [previewEngagement, setPreviewEngagement] = useState(25);
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(layouts[0]);

  const handleSaveWidget = (widget: Widget) => {
    if (editingWidget) {
      setWidgets(widgets.map(w => w.id === widget.id ? widget : w));
    } else {
      setWidgets([...widgets, widget]);
    }
    setEditingWidget(undefined);
    setCurrentView('dashboard');
  };

  const handleSaveLayout = (layout: Layout) => {
    if (editingLayout) {
      setLayouts(layouts.map(l => l.id === layout.id ? layout : l));
    } else {
      setLayouts([...layouts, layout]);
    }
    setEditingLayout(undefined);
    setCurrentView('dashboard');
  };

  const handleDeleteWidget = (id: string) => {
    if (confirm('Delete this widget?')) {
      setWidgets(widgets.filter(w => w.id !== id));
    }
  };

  const handleDeleteLayout = (id: string) => {
    if (confirm('Delete this layout?')) {
      setLayouts(layouts.filter(l => l.id !== id));
    }
  };

  const getActiveWidgets = (layout: Layout, engagement: number) => {
    const rule = layout.rules.find(r => engagement >= r.engagementMin && engagement <= r.engagementMax);
    if (!rule) return [];
    return rule.widgetIds.map(id => widgets.find(w => w.id === id)).filter(Boolean) as Widget[];
  };

  if (currentView === 'widget-builder') {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <WidgetBuilder
          existingWidget={editingWidget}
          onSave={handleSaveWidget}
          onCancel={() => {
            setEditingWidget(undefined);
            setCurrentView('dashboard');
          }}
        />
      </div>
    );
  }

  if (currentView === 'layout-builder') {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <LayoutBuilder
          widgets={widgets}
          existingLayout={editingLayout}
          onSave={handleSaveLayout}
          onCancel={() => {
            setEditingLayout(undefined);
            setCurrentView('dashboard');
          }}
        />
      </div>
    );
  }

  if (currentView === 'preview') {
    const activeWidgets = selectedLayout ? getActiveWidgets(selectedLayout, previewEngagement) : [];
    const currentFunnel = 
      previewEngagement < 50 ? 'top' : 
      previewEngagement < 80 ? 'mid' : 
      'bottom';

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Preview Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Layout Preview</h2>
                <p className="text-gray-600">{selectedLayout?.name}</p>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Engagement Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Simulate User Engagement
                </label>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    currentFunnel === 'top' ? 'bg-blue-100 text-blue-700' :
                    currentFunnel === 'mid' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {currentFunnel === 'top' ? '🔵 Explore' :
                     currentFunnel === 'mid' ? '🟣 Engage' :
                     '🟢 Convert'}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">{previewEngagement}%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={previewEngagement}
                onChange={(e) => setPreviewEngagement(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0% (Top)</span>
                <span>50% (Mid)</span>
                <span>100% (Bottom)</span>
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Widgets Shown at {previewEngagement}% Engagement
            </h3>
            {activeWidgets.length === 0 ? (
              <p className="text-gray-500 italic">No widgets configured for this engagement level</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="border-2 border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="h-32 bg-gray-200 relative">
                      {widget.thumbnail && (
                        <img src={widget.thumbnail} alt={widget.title} className="w-full h-full object-cover" />
                      )}
                      <div className={`absolute top-2 left-2 rounded-full px-2 py-1 text-xs font-bold ${
                        widget.funnelStage === 'top' ? 'bg-blue-100 text-blue-700' :
                        widget.funnelStage === 'mid' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {widget.funnelStage === 'top' ? '🔵 Explore' :
                         widget.funnelStage === 'mid' ? '🟣 Engage' :
                         '🟢 Convert'}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                        {widget.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {widget.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🎯 AI Personalization Admin</h1>
          <p className="text-blue-100">Configure dynamic content widgets and funnel-based layouts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{widgets.length}</div>
            <div className="text-gray-600">Total Widgets</div>
            <div className="text-sm text-gray-500 mt-1">
              {widgets.filter(w => w.funnelStage === 'top').length} top • 
              {widgets.filter(w => w.funnelStage === 'mid').length} mid • 
              {widgets.filter(w => w.funnelStage === 'bottom').length} bottom
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">{layouts.length}</div>
            <div className="text-gray-600">Active Layouts</div>
            <div className="text-sm text-gray-500 mt-1">Funnel-based configurations</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {widgets.filter(w => w.type === 'poll' || w.type === 'nps' || w.type === 'survey').length}
            </div>
            <div className="text-gray-600">Interactive Widgets</div>
            <div className="text-sm text-gray-500 mt-1">Polls, NPS, Surveys</div>
          </div>
        </div>

        {/* Widgets Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Widgets</h2>
              <p className="text-sm text-gray-600">Create and manage content widgets</p>
            </div>
            <button
              onClick={() => {
                setEditingWidget(undefined);
                setCurrentView('widget-builder');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              + Create Widget
            </button>
          </div>
          <div className="p-6">
            {widgets.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">No widgets yet. Create your first widget!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all"
                  >
                    <div className="h-32 bg-gray-200 relative">
                      {widget.thumbnail && (
                        <img src={widget.thumbnail} alt={widget.title} className="w-full h-full object-cover" />
                      )}
                      <div className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-bold ${
                        widget.funnelStage === 'top' ? 'bg-blue-500 text-white' :
                        widget.funnelStage === 'mid' ? 'bg-purple-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {widget.funnelStage === 'top' ? '🔵' :
                         widget.funnelStage === 'mid' ? '🟣' :
                         '🟢'}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                        {widget.title}
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        {widget.type} • {widget.funnelStage} funnel
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingWidget(widget);
                            setCurrentView('widget-builder');
                          }}
                          className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWidget(widget.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Layouts Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Layouts</h2>
              <p className="text-sm text-gray-600">Configure funnel-based widget display rules</p>
            </div>
            <button
              onClick={() => {
                setEditingLayout(undefined);
                setCurrentView('layout-builder');
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              + Create Layout
            </button>
          </div>
          <div className="p-6">
            {layouts.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">No layouts yet. Create your first layout!</p>
            ) : (
              <div className="space-y-4">
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{layout.name}</h3>
                        <p className="text-sm text-gray-600">{layout.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedLayout(layout);
                            setCurrentView('preview');
                          }}
                          className="px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 text-sm font-medium"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            setEditingLayout(layout);
                            setCurrentView('layout-builder');
                          }}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLayout(layout.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Funnel Rules Preview */}
                    <div className="grid grid-cols-3 gap-3">
                      {layout.rules.map((rule, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            rule.funnelStage === 'top' ? 'bg-blue-50' :
                            rule.funnelStage === 'mid' ? 'bg-purple-50' :
                            'bg-green-50'
                          }`}
                        >
                          <div className="font-semibold text-sm text-gray-900 mb-1">
                            {rule.funnelStage === 'top' ? '🔵 Top' :
                             rule.funnelStage === 'mid' ? '🟣 Mid' :
                             '🟢 Bottom'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {rule.engagementMin}-{rule.engagementMax}%
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {rule.widgetIds.length} widgets
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-bold mb-2">🚀 Next Steps</h3>
          <p className="text-blue-100 mb-4">
            Create widgets for each funnel stage, then build layouts to control when they appear based on user engagement.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 rounded p-3 backdrop-blur">
              <div className="font-semibold">1. Create Widgets</div>
              <div className="text-sm opacity-90">Build content for each funnel stage</div>
            </div>
            <div className="bg-white/20 rounded p-3 backdrop-blur">
              <div className="font-semibold">2. Build Layouts</div>
              <div className="text-sm opacity-90">Define engagement thresholds</div>
            </div>
            <div className="bg-white/20 rounded p-3 backdrop-blur">
              <div className="font-semibold">3. Preview & Test</div>
              <div className="text-sm opacity-90">See how content adapts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



