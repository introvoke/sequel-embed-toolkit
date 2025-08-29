# Related Events Widget Documentation

The Related Events Widget displays a curated selection of other events from your company that users can explore. It's designed to be embedded on event pages to promote engagement with additional content while automatically excluding the current event.

## Table of Contents
- [Quick Start](#quick-start)
- [Configuration Options](#configuration-options)
- [Smart Event Selection](#smart-event-selection)
- [Examples](#examples)
- [Styling](#styling)
- [URL Validation](#url-validation)
- [Troubleshooting](#troubleshooting)

## Quick Start

1. Add the Sequel script to your event page
2. Add a container div with the correct ID
3. Call the `renderRelatedEvents` function with your company ID

```html
<!DOCTYPE html>
<html>
<head>
    <title>Event Page</title>
</head>
<body>
    <!-- Your event content -->
    <h1>Current Event Details</h1>
    <p>Event description and content...</p>
    
    <!-- Related Events Section -->
    <h2>Explore More Events</h2>
    <div id="sequel_root"></div>

    <script type="module" src="https://prod-assets.sequelvideo.com/uploads/toolkit/sequel.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', (event) => {
            Sequel.renderRelatedEvents({
                companyId: 'your-company-id-here'
            });
        });
    </script>
</body>
</html>
```

## Configuration Options

The `renderRelatedEvents` function accepts the following options:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `companyId` | `string` | **Required** | Your Sequel company ID |
| `darkMode` | `boolean` | `false` | Enable dark mode styling |
| `excludeText` | `string` | `""` | Exclude events whose names start with this text |
| `showDescription` | `boolean` | `false` | Show event descriptions below titles |
| `maxEvents` | `number` | `6` | Maximum number of events to display |

### Example with All Options
```javascript
Sequel.renderRelatedEvents({
    companyId: 'your-company-id-here',
    darkMode: false,
    excludeText: 'internal',
    showDescription: true,
    maxEvents: 9
});
```

## Smart Event Selection

The Related Events Widget uses intelligent logic to select the most relevant events:

### 1. **Current Event Exclusion**
- Automatically detects the current page URL
- Compares against each event's `customUrl`
- Excludes events that match the current page
- Handles both full URLs and relative paths

### 2. **Event Prioritization**
```
1. Upcoming Events (prioritized)
   ↓
2. Past Events (if needed to fill slots)
   ↓
3. Filter out current event
   ↓
4. Limit to maxEvents count
```

### 3. **Example Selection Logic**
```javascript
// If maxEvents = 6:
// - 4 upcoming events available (after filtering current)
// - 8 past events available
// Result: 4 upcoming + 2 past = 6 total events
```

## Examples

### Basic Implementation
```html
<div id="sequel_root"></div>
<script type="module" src="https://prod-assets.sequelvideo.com/uploads/toolkit/sequel.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', (event) => {
        Sequel.renderRelatedEvents({
            companyId: 'abc123-def456-ghi789'
        });
    });
</script>
```

### Dark Mode with Descriptions
```html
<div id="sequel_root"></div>
<script type="module" src="https://prod-assets.sequelvideo.com/uploads/toolkit/sequel.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', (event) => {
        Sequel.renderRelatedEvents({
            companyId: 'abc123-def456-ghi789',
            darkMode: true,
            showDescription: true
        });
    });
</script>
```

### Custom Event Count
```html
<div id="sequel_root"></div>
<script type="module" src="https://prod-assets.sequelvideo.com/uploads/toolkit/sequel.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', (event) => {
        Sequel.renderRelatedEvents({
            companyId: 'abc123-def456-ghi789',
            maxEvents: 9
        });
    });
</script>
```

### Complete Example for Event Page
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event: Product Launch Webinar</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .event-content {
            background: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .related-events {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        h2 {
            color: #333;
            margin-bottom: 20px;
            border-bottom: 2px solid #007AE6;
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Main Event Content -->
        <div class="event-content">
            <h1>Product Launch Webinar</h1>
            <p>Join us for an exciting reveal of our latest innovations...</p>
            <!-- Your event details, video player, registration form, etc. -->
        </div>

        <!-- Related Events Section -->
        <div class="related-events">
            <h2>More Events You Might Like</h2>
            <div id="sequel_root"></div>
        </div>
    </div>

    <script type="module" src="https://prod-assets.sequelvideo.com/uploads/toolkit/sequel.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', (event) => {
            Sequel.renderRelatedEvents({
                companyId: 'your-company-id-here',
                showDescription: true,
                maxEvents: 6
            });
        });
    </script>
</body>
</html>
```

## Styling

### Built-in Responsive Grid
- **Desktop**: 3-column grid
- **Tablet**: 2-column grid  
- **Mobile**: 1-column grid

### Card Design
- **16:9 aspect ratio images**
- **Consistent card heights**
- **Hover effects**
- **Dark/light mode support**

### Color Schemes

#### Light Mode
- White card backgrounds
- Black text
- Subtle gray borders
- Black call-to-action buttons

#### Dark Mode
- Dark gray card backgrounds
- White text
- Light gray borders
- White call-to-action buttons

## URL Validation

The widget automatically prevents showing the current event using multiple validation methods:

### 1. **Full URL Comparison**
```javascript
// Current page: https://example.com/events/webinar-2024
// Event URL: https://example.com/events/webinar-2024
// Result: EXCLUDED (exact match)
```

### 2. **Path Comparison**
```javascript
// Current page: https://example.com/events/webinar-2024
// Event URL: https://example.com/events/webinar-2024?utm=social
// Result: EXCLUDED (same path, different query)
```

### 3. **Substring Matching**
```javascript
// Current page: https://example.com/events/webinar-2024
// Event URL: /events/webinar-2024
// Result: EXCLUDED (URL contains event path)
```

### 4. **Cross-Domain Safety**
```javascript
// Current page: https://yoursite.com/event-page
// Event URL: https://sequel.io/register/event-123
// Result: INCLUDED (different domains, different paths)
```

## Event Types & Button Behavior

| Event Type | Button Text | Description |
|------------|-------------|-------------|
| **Upcoming Events** | "View now" | Directs to registration/event page |
| **Past Events** | "Watch now" | Directs to replay/recorded content |
| **Live Events** | "View now" | Shows "• Live now" indicator |
| **Event Series** | Varies | Shows "• Event Series" indicator |

## Troubleshooting

### Common Issues

**"Company ID is required" Error**
```javascript
// ❌ Missing company ID
Sequel.renderRelatedEvents({});

// ✅ Correct usage
Sequel.renderRelatedEvents({
    companyId: 'your-company-id-here'
});
```

**"Element with id 'sequel_root' not found" Error**
```html
<!-- ❌ Missing container -->
<script>
    Sequel.renderRelatedEvents({ companyId: 'abc123' });
</script>

<!-- ✅ Add container first -->
<div id="sequel_root"></div>
<script type="module" src="https://prod-assets.sequelvideo.com/uploads/toolkit/sequel.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', (event) => {
        Sequel.renderRelatedEvents({ companyId: 'abc123' });
    });
</script>
```

**"No related events available" Message**
1. Verify your company has other events
2. Check if all events are being filtered out
3. Ensure events have `registration.customUrl` set
4. Try reducing `excludeText` filter

**Current Event Still Showing**
1. Verify the event's `customUrl` matches the current page URL
2. Check browser console for URL validation logs
3. Ensure the current page URL is accessible via `window.location.href`

### Debug Mode

Enable browser developer tools to see URL validation:
```javascript
// The widget logs URL comparisons in the console
console.log('Current URL:', window.location.href);
console.log('Event URL:', event.customUrl);
console.log('Excluded:', isExcluded);
```

## Use Cases

### 1. **Event Landing Pages**
- Show related webinars at the bottom of event pages
- Encourage registration for additional events

### 2. **Thank You Pages**
- Display upcoming events after registration
- Keep users engaged with more content

### 3. **Event Replays**
- Show other recorded sessions while watching replays
- Promote similar past events

### 4. **Email Campaigns**
- Embed in HTML emails (where supported)
- Direct traffic to related events

## Performance

- **Initial Load**: ~30-50ms after main grid endpoint
- **Smart Caching**: Reuses grid data when possible
- **Responsive Images**: Optimized loading
- **Minimal Bundle**: Shared code with EventGrid widget

## Browser Support

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

---

## Changelog

### v1.0.0
- Initial release
- Smart current event exclusion
- Responsive grid layout
- Configurable event count
- Dark/light mode support
- URL validation system
