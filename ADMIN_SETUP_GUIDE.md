# Admin Dashboard Setup Guide

## Overview

The AI Personalization Admin Dashboard allows marketing teams to configure dynamic content widgets and funnel-based layouts without code. Admins can create personalized experiences that adapt based on user engagement during live events.

## Quick Start

### View Admin Demo
```bash
npm run demo:admin
```

### View Full Admin Dashboard in Storybook
```bash
npm run storybook
```
Then navigate to: **Admin → Dashboard**

## Core Concepts

### 1. Widgets 🧩

Widgets are individual pieces of content shown to users during an event. Each widget has:

- **Type**: Poll, NPS, Survey, Newsletter, Blog, Video, Doc, Webinar, or Demo
- **Funnel Stage**: Top (Explore), Mid (Engage), or Bottom (Convert)
- **Content**: Title, description, URL, thumbnail
- **Targeting**: (Optional) Target specific roles or company sizes

#### Widget Types by Funnel Stage

**Top Funnel (Explore) - 0-49% Engagement**
- 📊 Polls - "What's Your Biggest Challenge?"
- ✍️ Blogs - "7 Trends Shaping 2024"
- 🎥 Videos - Product demos, explainer videos
- 📚 Docs - Whitepapers, guides

**Mid Funnel (Engage) - 50-79% Engagement**
- ⭐ NPS - "How likely are you to recommend?"
- 📝 Surveys - Detailed feedback forms
- 📮 Newsletter - Subscribe for weekly insights
- 📹 Webinars - Register for upcoming events

**Bottom Funnel (Convert) - 80%+ Engagement**
- 🎯 Demo Booking - Schedule personalized demo
- 🚀 Free Trial - Start using the product
- 💬 Sales Chat - Connect with sales team

### 2. Layouts 📐

Layouts control WHEN widgets appear based on user engagement. A layout consists of:

- **Name** - e.g., "Marketing Event Layout"
- **Rules** - Define engagement ranges for each funnel stage
- **Widget Selection** - Which widgets to show at each stage

#### Example Layout

```
Top Funnel (0-49%)
├── Poll: Biggest Challenge
├── Blog: Marketing Trends 2024
└── Video: Product Overview

Mid Funnel (50-79%)
├── NPS Survey
├── Newsletter Signup
└── Related Webinar

Bottom Funnel (80-100%)
└── Book a Demo
```

### 3. Engagement Scoring 📊

User engagement increases through:

- **Watching** - +5 points per 2 minutes of watch time
- **Clicking Content** - +10 points per tile clicked
- **Interactive Elements** - +15 points for polls, NPS, surveys
- **High Intent Actions** - +20 points for demo bookings, trials

## Admin Workflow

### Step 1: Create Widgets

1. Click **"+ Create Widget"**
2. Choose a template or start from scratch
3. Select widget type (Poll, Blog, Demo, etc.)
4. Assign to funnel stage (Top, Mid, Bottom)
5. Fill in title, description, and URL
6. Add thumbnail (optional)
7. Save widget

**Pro Tip**: Use templates to get started quickly! Pre-built templates include:
- Quick Poll
- NPS Survey
- Demo Booking
- Newsletter Signup

### Step 2: Build Layout

1. Click **"+ Create Layout"**
2. Name your layout (e.g., "Q1 2024 Marketing Events")
3. Define engagement thresholds:
   - **Top**: 0-49% (default) - First-time/passive viewers
   - **Mid**: 50-79% (default) - Engaged attendees
   - **Bottom**: 80-100% (default) - High-intent prospects
4. For each funnel stage, select which widgets to show
5. Save layout

**Layout Templates**:
- **Aggressive Conversion**: Shorter top funnel (0-29%), faster progression
- **Nurture Focused**: Longer mid funnel (40-84%), more relationship building

### Step 3: Preview & Test

1. Select a layout
2. Click **"Preview"**
3. Use the engagement slider (0-100%)
4. Watch widgets change as you adjust engagement
5. Verify correct widgets appear at each stage

### Step 4: Deploy to Event

Once configured:
1. Copy the layout ID
2. Attach to your Sequel event configuration
3. Go live!

## Best Practices

### Widget Creation

✅ **Do:**
- Create 2-3 widgets per funnel stage
- Use clear, action-oriented titles
- Add engaging thumbnails
- Test links before deploying

❌ **Don't:**
- Overload one funnel stage with too many widgets
- Use generic titles like "Click Here"
- Skip thumbnails (lower engagement)

### Layout Configuration

✅ **Do:**
- Start with default thresholds (0-49, 50-79, 80-100)
- Test with preview before deploying
- Consider your audience's typical engagement patterns
- A/B test different layouts

❌ **Don't:**
- Make thresholds too narrow (causes frequent changes)
- Skip mid-funnel entirely (loses nurture opportunity)
- Show bottom-funnel content too early

### Funnel Progression Strategy

**Conservative (Nurture Focus)**
- Top: 0-39% (longer exploration)
- Mid: 40-84% (extensive engagement)
- Bottom: 85-100% (only highly qualified)

**Balanced (Default)**
- Top: 0-49%
- Mid: 50-79%
- Bottom: 80-100%

**Aggressive (Conversion Focus)**
- Top: 0-29% (quick qualification)
- Mid: 30-59% (shorter nurture)
- Bottom: 60-100% (earlier conversion push)

## Example Use Cases

### Product Launch Event
**Goal**: High conversion, qualified demos

**Widgets:**
- Top: Product announcement blog, feature video
- Mid: Customer testimonials, ROI calculator
- Bottom: Book demo, start trial

**Layout**: Aggressive (30/60/100)

### Thought Leadership Webinar
**Goal**: Build audience, grow newsletter

**Widgets:**
- Top: Poll on challenges, related research
- Mid: Newsletter signup, upcoming events
- Bottom: Consultation booking

**Layout**: Nurture (40/80/100)

### Customer Training
**Goal**: Education, resource discovery

**Widgets:**
- Top: Quick polls, documentation links
- Mid: Certification survey, community join
- Bottom: Advanced training booking

**Layout**: Balanced (50/80/100)

## Technical Integration

### Embedding Admin Dashboard

```typescript
// Initialize admin dashboard for an event
window.Sequel.renderAdminDashboard({
  eventId: 'your-event-id',
  containerId: 'admin-root',
  onSave: (config) => {
    console.log('Configuration saved:', config);
  }
});
```

### Widget Configuration Format

```json
{
  "id": "widget_123",
  "type": "poll",
  "title": "What's Your Biggest Marketing Challenge?",
  "description": "Help us understand your priorities",
  "url": "https://example.com/poll",
  "funnelStage": "top",
  "thumbnail": "https://example.com/image.jpg"
}
```

### Layout Configuration Format

```json
{
  "id": "layout_456",
  "name": "Marketing Event Layout",
  "rules": [
    {
      "engagementMin": 0,
      "engagementMax": 49,
      "funnelStage": "top",
      "widgetIds": ["widget_123", "widget_124"]
    },
    {
      "engagementMin": 50,
      "engagementMax": 79,
      "funnelStage": "mid",
      "widgetIds": ["widget_125"]
    },
    {
      "engagementMin": 80,
      "engagementMax": 100,
      "funnelStage": "bottom",
      "widgetIds": ["widget_126"]
    }
  ]
}
```

## Troubleshooting

### Widgets not appearing
- Check widget is assigned to a layout
- Verify engagement thresholds are correct
- Ensure layout is active on the event

### Preview not updating
- Hard refresh the page (Cmd/Ctrl + Shift + R)
- Check browser console for errors
- Verify widgets exist and are saved

### Layout conflicts
- Ensure engagement ranges don't overlap
- Check all three funnel stages are configured
- Verify widget IDs are valid

## Analytics & Optimization

Track these metrics to optimize your layouts:

1. **Engagement Distribution** - Where do most users land?
2. **Conversion Rate by Stage** - Which funnel stage converts best?
3. **Widget Click-Through Rate** - Which widgets get the most clicks?
4. **Time to Conversion** - How long until bottom funnel?

Use these insights to:
- Adjust engagement thresholds
- Swap underperforming widgets
- Test different funnel progressions

## Support

- **Documentation**: `/docs/admin-setup-guide.md`
- **Storybook**: `npm run storybook`
- **User Demo**: `npm run demo:ai`
- **Admin Demo**: `npm run demo:admin`

---

**Next Steps**: 
1. Run `npm run demo:admin` to see the interface
2. Create your first widget
3. Build a layout
4. Preview with engagement slider
5. Deploy to your event! 🚀



