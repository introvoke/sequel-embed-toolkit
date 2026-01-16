import type { Meta, StoryObj } from "@storybook/react";
import { AdminDashboard } from "@src/components/admin/AdminDashboard";

const meta = {
  title: "Admin/Dashboard",
  component: AdminDashboard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Admin Dashboard for AI Personalization

Configure dynamic content widgets and funnel-based layouts for your events.

## Features

### Widgets
- Create content widgets (polls, NPS, surveys, blogs, videos, demos)
- Assign to funnel stages (top, mid, bottom)
- Use pre-built templates or create custom
- Manage all widgets in one place

### Layouts
- Define engagement thresholds for each funnel stage
- Select which widgets appear at each stage
- Use layout templates (Aggressive, Nurture-focused)
- Customize engagement ranges

### Preview
- Simulate user engagement with slider (0-100%)
- See which widgets appear at each level
- Test funnel progression visually
- Validate layout configuration

## Workflow

1. **Create Widgets** - Build content for each funnel stage
2. **Build Layout** - Define when widgets appear based on engagement
3. **Preview** - Test with engagement slider
4. **Deploy** - Apply to your live events
        `,
      },
    },
  },
} satisfies Meta<typeof AdminDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Main admin dashboard view with widgets and layouts management.',
      },
    },
  },
};



