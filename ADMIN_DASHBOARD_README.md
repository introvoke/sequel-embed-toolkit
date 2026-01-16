# 🎯 Admin Dashboard for AI Personalization

## Overview

The Admin Dashboard provides a visual interface for marketing teams to configure dynamic content widgets and funnel-based layouts without writing code. Admins can create personalized event experiences that adapt in real-time based on user engagement.

---

## 🚀 Quick Start

### View Admin Demo
```bash
npm run demo:admin
```
Opens a standalone HTML demo of the admin interface.

### Full Interactive Dashboard (Recommended)
```bash
npm run storybook
```
Then navigate to: **Admin → Dashboard**

This provides the complete interactive experience with all features.

---

## 📊 Dashboard Components

### 1. **Widget Builder** 🧩

Create individual content pieces that appear during events.

**Features:**
- Pre-built templates (Poll, NPS, Demo, Newsletter)
- Widget type selection (Interactive, Content, Conversion)
- Funnel stage assignment (Top, Mid, Bottom)
- Custom content configuration
- Thumbnail support

**Widget Types:**

| Type | Icon | Funnel | Purpose |
|------|------|--------|---------|
| Poll | 📊 | Top | Gather quick feedback |
| Blog | ✍️ | Top | Share thought leadership |
| Video | 🎥 | Top | Product demos, explainers |
| Doc | 📚 | Top | Whitepapers, guides |
| NPS | ⭐ | Mid | Measure satisfaction |
| Survey | 📝 | Mid | Detailed feedback |
| Newsletter | 📮 | Mid | Build email list |
| Webinar | 📹 | Mid | Promote events |
| Demo | 🎯 | Bottom | Schedule sales calls |

### 2. **Layout Builder** 📐

Control WHEN widgets appear based on user engagement.

**Features:**
- Define engagement thresholds (0-100%)
- Map widgets to funnel stages
- Layout templates (Aggressive, Nurture-focused)
- Visual rule configuration
- Multi-widget selection per stage

**Default Thresholds:**
- **Top Funnel (Explore)**: 0-49% engagement
- **Mid Funnel (Engage)**: 50-79% engagement
- **Bottom Funnel (Convert)**: 80-100% engagement

### 3. **Preview Mode** 👁️

Test layouts before deploying to live events.

**Features:**
- Interactive engagement slider (0-100%)
- Real-time widget updates
- Visual funnel stage indicators
- Widget count per stage
- Thumbnail previews

---

## 🎨 User Interface

### Dashboard View

```
┌─────────────────────────────────────────────────┐
│  🎯 AI Personalization Admin                    │
│  Configure dynamic content widgets and layouts  │
└─────────────────────────────────────────────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐
│    12    │  │     3    │  │     5    │
│ Widgets  │  │ Layouts  │  │Interactive│
└──────────┘  └──────────┘  └──────────┘

┌─────────────────────────────────────────────────┐
│ Widgets                    [+ Create Widget]    │
├─────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐                  │
│  │ 📊   │  │ ✍️   │  │ 🎯   │                  │
│  │ Poll │  │ Blog │  │ Demo │                  │
│  │ 🔵   │  │ 🔵   │  │ 🟢   │                  │
│  └──────┘  └──────┘  └──────┘                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Layouts                    [+ Create Layout]    │
├─────────────────────────────────────────────────┤
│  Marketing Event Layout                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │🔵 Top   │ │🟣 Mid   │ │🟢 Bottom│          │
│  │ 0-49%   │ │ 50-79%  │ │ 80-100% │          │
│  │2 widgets│ │1 widget │ │1 widget │          │
│  └─────────┘ └─────────┘ └─────────┘          │
│  [Preview] [Edit] [Delete]                      │
└─────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Workflow

### Step 1: Create Widgets

1. Click **"+ Create Widget"**
2. Choose from templates or start fresh:
   - **Quick Poll** - Instant engagement
   - **NPS Survey** - Satisfaction measurement
   - **Demo Booking** - Conversion action
   - **Newsletter Signup** - List building
3. Configure widget:
   - Select type (Poll, Blog, Video, etc.)
   - Assign funnel stage (Top/Mid/Bottom)
   - Enter title and description
   - Add URL and thumbnail
4. Click **"Create Widget"**

**Pro Tips:**
- Create 2-3 widgets per funnel stage
- Use action-oriented titles
- Add high-quality thumbnails
- Test URLs before saving

### Step 2: Build Layout

1. Click **"+ Create Layout"**
2. Name your layout (e.g., "Q1 Product Launch")
3. Choose a template or customize:
   - **Aggressive**: Fast conversion (30/60/100)
   - **Nurture**: Longer engagement (40/80/100)
   - **Balanced**: Default (50/80/100)
4. For each funnel stage:
   - Adjust engagement range
   - Select widgets to display
5. Click **"Create Layout"**

**Engagement Strategies:**

| Strategy | Top | Mid | Bottom | Use Case |
|----------|-----|-----|--------|----------|
| Aggressive | 0-29% | 30-59% | 60-100% | High-intent events, demos |
| Balanced | 0-49% | 50-79% | 80-100% | General webinars |
| Nurture | 0-39% | 40-84% | 85-100% | Thought leadership |

### Step 3: Preview & Test

1. Select a layout
2. Click **"Preview"**
3. Use engagement slider to simulate user journey:
   - **0-49%**: See top-funnel widgets (polls, blogs)
   - **50-79%**: See mid-funnel widgets (NPS, newsletters)
   - **80-100%**: See bottom-funnel widgets (demos)
4. Verify correct widgets appear at each stage
5. Return to edit if needed

### Step 4: Deploy

1. Copy layout ID from dashboard
2. Attach to Sequel event configuration
3. Go live! 🚀

---

## 🎯 Engagement Scoring

Users progress through funnels based on engagement score:

| Action | Points | Example |
|--------|--------|---------|
| Watch video | +5 per 2 min | 10 min = +25 pts |
| Click content | +10 | Click blog tile |
| Answer poll | +15 | Submit poll response |
| Fill survey | +15 | Complete NPS |
| Click CTA | +15 | Click "Learn More" |
| Download | +20 | Download whitepaper |
| Book demo | +20 | Schedule sales call |

**Engagement Progression:**

```
User Journey Example:
─────────────────────────────────────────────────

0%  │ Joins event
    │ Sees: Poll, Blog, Video (Top Funnel)
    ↓
15% │ Answers poll (+15)
    │ Sees: Poll, Blog, Video (still Top)
    ↓
25% │ Clicks blog (+10)
    │ Sees: Poll, Blog, Video (still Top)
    ↓
35% │ Watches 4 min (+10)
    │ Sees: Poll, Blog, Video (still Top)
    ↓
55% │ Clicks video (+10)
    │ 🎉 Enters Mid Funnel!
    │ Sees: NPS, Survey, Newsletter
    ↓
70% │ Submits NPS (+15)
    │ Sees: NPS, Survey, Newsletter (still Mid)
    ↓
85% │ Subscribes to newsletter (+15)
    │ 🚀 Enters Bottom Funnel!
    │ Sees: Book Demo, Start Trial
```

---

## 💡 Best Practices

### Widget Creation

✅ **DO:**
- Create variety within each funnel stage
- Use clear, benefit-driven titles
- Add engaging thumbnails
- Keep descriptions concise (1-2 lines)
- Test all URLs before deploying
- Target specific roles when relevant

❌ **DON'T:**
- Overload one stage with 10+ widgets
- Use generic titles like "Click Here"
- Skip thumbnails (reduces engagement)
- Use broken or placeholder URLs
- Make descriptions too long

### Layout Configuration

✅ **DO:**
- Start with default thresholds
- Test with preview before going live
- Consider your audience's behavior
- A/B test different layouts
- Monitor engagement distribution
- Adjust thresholds based on data

❌ **DON'T:**
- Make ranges too narrow (causes jarring changes)
- Skip mid-funnel (loses nurture opportunity)
- Show demos at 10% engagement
- Overlap engagement ranges
- Deploy without testing

### Funnel Strategy

**Choose based on event goals:**

**Product Launch (Aggressive)**
- Goal: High conversion rate
- Thresholds: 30/60/100
- Focus: Move quickly to demos

**Thought Leadership (Nurture)**
- Goal: Build relationships
- Thresholds: 40/80/100
- Focus: Extended engagement

**Customer Training (Balanced)**
- Goal: Education + upsell
- Thresholds: 50/80/100
- Focus: Value first, conversion second

---

## 📈 Use Cases & Examples

### Use Case 1: SaaS Product Launch

**Goal:** Generate qualified demo bookings

**Widgets:**
- Top: Product announcement blog, feature video, poll
- Mid: Customer testimonials, ROI calculator, NPS
- Bottom: Book demo, start free trial

**Layout:** Aggressive (30/60/100)

**Expected Flow:**
1. Users watch product video (+25 pts from 10 min)
2. Answer poll about challenges (+15 pts) → 40% → Mid Funnel
3. View customer testimonials (+10 pts) → 50%
4. Submit NPS (+15 pts) → 65% → Bottom Funnel
5. Book demo (+20 pts) → 85% ✅

### Use Case 2: Marketing Trends Webinar

**Goal:** Grow newsletter subscribers

**Widgets:**
- Top: Trend polls, related research, industry stats
- Mid: Newsletter signup, upcoming events, resource hub
- Bottom: Consultation booking, community join

**Layout:** Nurture (40/80/100)

**Expected Flow:**
1. Users answer trend polls (+15 pts)
2. Click research links (+10 pts each)
3. Watch 6 min (+15 pts) → 50% → Mid Funnel
4. Subscribe to newsletter (+15 pts) → 65%
5. Register for next event (+15 pts) → 80% → Bottom Funnel

### Use Case 3: Customer Onboarding Event

**Goal:** Drive product adoption

**Widgets:**
- Top: Quick polls, getting started guide, video tutorials
- Mid: Certification survey, community join, advanced docs
- Bottom: 1-on-1 training booking, premium upgrade

**Layout:** Balanced (50/80/100)

**Expected Flow:**
1. Users watch tutorials (+30 pts from 12 min)
2. Answer setup polls (+15 pts) → 45%
3. Click getting started guide (+10 pts) → 55% → Mid Funnel
4. Join community (+15 pts) → 70%
5. Complete certification survey (+15 pts) → 85% → Bottom Funnel

---

## 🔧 Technical Integration

### Embedding Admin Dashboard

```typescript
// Initialize admin dashboard
window.Sequel.renderAdminDashboard({
  eventId: 'event_123',
  containerId: 'admin-root',
  apiKey: 'your-api-key',
  onSave: (config) => {
    console.log('Configuration saved:', config);
    // Sync to backend
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});
```

### Widget Configuration Schema

```typescript
interface Widget {
  id: string;
  type: 'poll' | 'nps' | 'survey' | 'newsletter' | 
        'blog' | 'video' | 'doc' | 'webinar' | 'demo';
  title: string;
  description: string;
  url: string;
  funnelStage: 'top' | 'mid' | 'bottom';
  thumbnail?: string;
  targetRoles?: string[];
  customContent?: any;
}
```

### Layout Configuration Schema

```typescript
interface Layout {
  id: string;
  name: string;
  description: string;
  rules: Array<{
    engagementMin: number;
    engagementMax: number;
    funnelStage: 'top' | 'mid' | 'bottom';
    widgetIds: string[];
  }>;
}
```

### Example JSON Export

```json
{
  "layout": {
    "id": "layout_marketing_2024",
    "name": "Marketing Event Layout",
    "description": "Standard funnel for marketing webinars",
    "rules": [
      {
        "engagementMin": 0,
        "engagementMax": 49,
        "funnelStage": "top",
        "widgetIds": ["widget_poll_1", "widget_blog_1", "widget_video_1"]
      },
      {
        "engagementMin": 50,
        "engagementMax": 79,
        "funnelStage": "mid",
        "widgetIds": ["widget_nps_1", "widget_newsletter_1"]
      },
      {
        "engagementMin": 80,
        "engagementMax": 100,
        "funnelStage": "bottom",
        "widgetIds": ["widget_demo_1"]
      }
    ]
  },
  "widgets": [
    {
      "id": "widget_poll_1",
      "type": "poll",
      "title": "What's Your Biggest Marketing Challenge?",
      "description": "Help us understand your priorities",
      "url": "https://example.com/poll",
      "funnelStage": "top",
      "thumbnail": "https://images.unsplash.com/photo-1.jpg"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Widgets Not Appearing

**Problem:** Widgets don't show in preview or live event

**Solutions:**
1. Check widget is assigned to a layout
2. Verify engagement thresholds are correct
3. Ensure layout is active on the event
4. Check browser console for errors
5. Verify widget IDs match in layout rules

### Preview Not Updating

**Problem:** Slider moves but widgets don't change

**Solutions:**
1. Hard refresh (Cmd/Ctrl + Shift + R)
2. Clear browser cache
3. Check that widgets exist for each stage
4. Verify engagement ranges don't have gaps
5. Check browser console for JavaScript errors

### Layout Conflicts

**Problem:** Wrong widgets showing at wrong times

**Solutions:**
1. Ensure engagement ranges don't overlap
2. Check all three funnel stages are configured
3. Verify widget IDs are valid
4. Test in preview mode before deploying
5. Check that funnelStage matches in widget and layout

### Build Errors

**Problem:** TypeScript compilation fails

**Solutions:**
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build

# Check for type errors
npm run lint
```

---

## 📊 Analytics & Optimization

### Key Metrics to Track

1. **Engagement Distribution**
   - What % of users reach each funnel stage?
   - Where do users spend most time?

2. **Conversion Rate by Stage**
   - Which funnel stage drives most conversions?
   - Are bottom-funnel widgets effective?

3. **Widget Performance**
   - Click-through rate per widget
   - Which widgets get most engagement?
   - Time spent on each widget type

4. **Funnel Progression**
   - Average time to reach mid-funnel
   - Average time to reach bottom-funnel
   - Drop-off points

### Optimization Strategies

**If users aren't reaching mid-funnel:**
- Lower mid-funnel threshold (e.g., 40% instead of 50%)
- Add more engaging top-funnel content
- Increase points for top-funnel actions

**If conversion rate is low:**
- Review bottom-funnel widget quality
- Ensure clear CTAs
- Test different demo booking flows
- Consider lowering bottom-funnel threshold

**If engagement drops quickly:**
- Add more variety to top-funnel
- Make interactive elements more prominent
- Reduce time between widget changes
- Test more aggressive layout

---

## 🎓 Training Resources

### For Admins
- **Setup Guide**: `/ADMIN_SETUP_GUIDE.md`
- **Video Tutorial**: Coming soon
- **Best Practices**: This document, section above

### For Developers
- **API Documentation**: `/docs/api.md`
- **Integration Guide**: `/docs/integration.md`
- **TypeScript Types**: `/src/types/personalization.ts`

### Interactive Demos
- **Admin Dashboard**: `npm run demo:admin`
- **User Experience**: `npm run demo:ai`
- **Storybook**: `npm run storybook`

---

## 🚀 Next Steps

1. **Explore the Demo**
   ```bash
   npm run demo:admin
   ```

2. **Try Storybook**
   ```bash
   npm run storybook
   # Navigate to: Admin → Dashboard
   ```

3. **Create Your First Widget**
   - Use a template to start
   - Assign to top funnel
   - Add engaging title and thumbnail

4. **Build Your First Layout**
   - Use "Balanced" template
   - Select your widgets
   - Preview with slider

5. **Deploy to Event**
   - Test thoroughly in preview
   - Copy configuration
   - Attach to live event

---

## 📞 Support

- **Documentation**: `/docs/`
- **Examples**: `/examples/`
- **Issues**: GitHub Issues
- **Community**: Slack Channel

---

**Built with ❤️ for marketing teams who want to deliver personalized event experiences at scale.**

