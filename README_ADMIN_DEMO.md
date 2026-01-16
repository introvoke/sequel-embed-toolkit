# 🎯 AI Personalization - Admin Dashboard Demo

## What You Just Built

You've created a complete **Admin Dashboard** for configuring AI-powered personalized content during live events. This allows marketing teams to set up dynamic widgets and funnel-based layouts without writing code.

---

## 🚀 Quick Start

### View Admin Interface
```bash
npm run demo:admin
```

### Full Interactive Dashboard (Recommended)
```bash
npm run storybook
```
Then navigate to: **Admin → Dashboard**

### View User-Facing Demo
```bash
npm run demo:ai
```

---

## 🎨 What's Included

### 1. **Widget Builder** (`src/components/admin/WidgetBuilder.tsx`)

Visual interface for creating content widgets:
- 📊 Polls
- ⭐ NPS Surveys
- 📝 Surveys
- 📮 Newsletters
- ✍️ Blogs
- 🎥 Videos
- 📚 Documents
- 📹 Webinars
- 🎯 Demo Bookings

**Features:**
- Pre-built templates
- Drag-and-drop funnel assignment
- Thumbnail support
- URL validation
- Role targeting

### 2. **Layout Builder** (`src/components/admin/LayoutBuilder.tsx`)

Configure when widgets appear based on engagement:
- Define engagement thresholds (0-100%)
- Map widgets to funnel stages
- Visual rule configuration
- Layout templates (Aggressive, Nurture-focused)

**Funnel Stages:**
- 🔵 **Top (Explore)**: 0-49% - First-time viewers
- 🟣 **Mid (Engage)**: 50-79% - Engaged attendees
- 🟢 **Bottom (Convert)**: 80-100% - High-intent prospects

### 3. **Admin Dashboard** (`src/components/admin/AdminDashboard.tsx`)

Complete management interface:
- Widget library management
- Layout configuration
- Live preview with engagement slider
- Quick stats dashboard
- Export/import configurations

### 4. **Preview Mode**

Test layouts before deploying:
- Interactive engagement slider (0-100%)
- Real-time widget updates
- Visual funnel indicators
- See exactly what users will see

---

## 📊 How It Works

### Admin Workflow

```
1. CREATE WIDGETS
   ↓
   Admin creates content pieces
   - Polls, blogs, videos, demos
   - Assigns to funnel stage
   - Adds title, description, URL
   
2. BUILD LAYOUT
   ↓
   Admin defines engagement rules
   - Top: 0-49% → Show polls, blogs
   - Mid: 50-79% → Show NPS, newsletters
   - Bottom: 80-100% → Show demos
   
3. PREVIEW & TEST
   ↓
   Admin uses slider to simulate
   - Move slider: 0% → 100%
   - Watch widgets change
   - Verify correct progression
   
4. DEPLOY
   ↓
   Attach layout to live event
   - Users see personalized content
   - Content adapts as they engage
   - Conversion rates increase
```

### User Experience (What Attendees See)

```
User joins event (0% engagement)
↓
Sees: Poll, Blog, Video (Top Funnel)
↓
Answers poll (+15 pts) → 15%
Clicks blog (+10 pts) → 25%
Watches 4 min (+10 pts) → 35%
Still in Top Funnel
↓
Clicks video (+10 pts) → 45%
Watches 2 more min (+5 pts) → 50%
🎉 ENTERS MID FUNNEL
↓
Sees: NPS, Newsletter, Survey
↓
Submits NPS (+15 pts) → 65%
Subscribes (+15 pts) → 80%
🚀 ENTERS BOTTOM FUNNEL
↓
Sees: Book Demo, Start Trial
↓
Books demo (+20 pts) → 100%
✅ CONVERTED!
```

---

## 🎯 Key Features

### For Admins

✅ **No-Code Configuration**
- Visual widget builder
- Drag-and-drop funnel assignment
- Pre-built templates

✅ **Flexible Layouts**
- Customize engagement thresholds
- Multiple layout strategies
- A/B testing support

✅ **Real-Time Preview**
- Test before deploying
- Simulate user journeys
- Verify widget progression

✅ **Template Library**
- Quick Poll
- NPS Survey
- Demo Booking
- Newsletter Signup

### For Users (Attendees)

✅ **Personalized Content**
- Relevant to their role
- Adapts to their actions
- Progresses through funnel

✅ **Seamless Experience**
- No page reloads
- Smooth transitions
- Contextual recommendations

✅ **Interactive Elements**
- Clickable polls
- NPS ratings
- Survey forms
- Newsletter signups

---

## 📁 File Structure

```
src/
├── components/
│   └── admin/
│       ├── AdminDashboard.tsx      # Main dashboard
│       ├── WidgetBuilder.tsx       # Widget creation
│       └── LayoutBuilder.tsx       # Layout configuration
│
├── stories/
│   └── admin/
│       └── AdminDashboard.stories.tsx  # Storybook demo
│
├── types/
│   └── personalization.ts          # TypeScript types
│
└── utils/
    └── personalizationEngine.ts    # Scoring logic

admin-demo.html                     # Standalone demo
ADMIN_DASHBOARD_README.md          # Full documentation
ADMIN_SETUP_GUIDE.md               # Setup instructions
```

---

## 🎓 Example Scenarios

### Scenario 1: Product Launch Event

**Admin Setup:**
```
Widgets Created:
- Top: Product video, announcement blog, feature poll
- Mid: Customer testimonials, ROI calculator, NPS
- Bottom: Book demo, start trial

Layout: "Aggressive" (30/60/100)
- Top: 0-29%
- Mid: 30-59%
- Bottom: 60-100%
```

**User Experience:**
1. Watches product video (10 min) → 25 pts
2. Answers feature poll → 40 pts (Mid Funnel)
3. Views testimonials → 50 pts
4. Submits NPS → 65 pts (Bottom Funnel)
5. Books demo → 85 pts ✅

### Scenario 2: Thought Leadership Webinar

**Admin Setup:**
```
Widgets Created:
- Top: Trend polls, research links, industry stats
- Mid: Newsletter signup, upcoming events
- Bottom: Consultation booking

Layout: "Nurture" (40/80/100)
- Top: 0-39%
- Mid: 40-79%
- Bottom: 80-100%
```

**User Experience:**
1. Answers trend polls → 30 pts
2. Clicks research → 40 pts (Mid Funnel)
3. Watches 8 min → 60 pts
4. Subscribes to newsletter → 75 pts
5. Registers for next event → 90 pts (Bottom Funnel)

---

## 🔧 Customization

### Adjust Engagement Thresholds

```typescript
// In LayoutBuilder
const rules = [
  { engagementMin: 0, engagementMax: 29, funnelStage: 'top' },
  { engagementMin: 30, engagementMax: 59, funnelStage: 'mid' },
  { engagementMin: 60, engagementMax: 100, funnelStage: 'bottom' }
];
```

### Modify Scoring Logic

```typescript
// In personalizationEngine.ts
switch (action.type) {
  case 'poll': score += 15;
  case 'content_click': score += 10;
  case 'watch_time': score += Math.floor(action.seconds / 120) * 5;
}
```

### Add Custom Widget Types

```typescript
// In WidgetBuilder.tsx
type: 'poll' | 'nps' | 'survey' | 'custom_type'
```

---

## 📊 Analytics Integration

Track these metrics for optimization:

```typescript
// Example analytics events
analytics.track('widget_created', {
  type: widget.type,
  funnelStage: widget.funnelStage
});

analytics.track('layout_deployed', {
  layoutId: layout.id,
  thresholds: layout.rules.map(r => r.engagementMax)
});

analytics.track('user_funnel_progression', {
  from: 'top',
  to: 'mid',
  engagementScore: 52
});
```

---

## 🎨 UI Components

### Widget Card
```tsx
<WidgetCard
  widget={widget}
  onEdit={() => setEditingWidget(widget)}
  onDelete={() => handleDeleteWidget(widget.id)}
/>
```

### Engagement Slider
```tsx
<input
  type="range"
  min="0"
  max="100"
  value={engagement}
  onChange={(e) => setEngagement(parseInt(e.target.value))}
  className="funnel-slider"
/>
```

### Funnel Badge
```tsx
<FunnelBadge stage="top" /> // 🔵 Explore
<FunnelBadge stage="mid" />  // 🟣 Engage
<FunnelBadge stage="bottom" /> // 🟢 Convert
```

---

## 🚀 Deployment

### Development
```bash
npm run demo:admin
```

### Production Build
```bash
npm run build
```

### Embed in Your App
```typescript
import { AdminDashboard } from '@sequel/embed-toolkit';

<AdminDashboard
  eventId="event_123"
  onSave={(config) => saveToBackend(config)}
/>
```

---

## 📚 Additional Resources

- **Full Documentation**: `ADMIN_DASHBOARD_README.md`
- **Setup Guide**: `ADMIN_SETUP_GUIDE.md`
- **User Demo**: `npm run demo:ai`
- **Storybook**: `npm run storybook`

---

## 🎉 What's Next?

1. ✅ Run the admin demo: `npm run demo:admin`
2. ✅ Explore Storybook: `npm run storybook`
3. ✅ Create your first widget
4. ✅ Build a layout
5. ✅ Preview with engagement slider
6. ✅ Deploy to a live event!

---

**You now have a complete admin interface for AI-powered event personalization! 🚀**



