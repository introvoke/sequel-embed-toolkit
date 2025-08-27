# Event Grid Widget Documentation

The Event Grid Widget allows you to display a beautiful, responsive grid of your company's events on any website. It automatically shows upcoming events for registration and past events with replay functionality.

## Table of Contents
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration Options](#configuration-options)
- [Examples](#examples)
- [Styling](#styling)
- [Troubleshooting](#troubleshooting)

## Quick Start

1. Add the Sequel script to your website
2. Add a container div with the correct ID
3. Call the `renderEventGrid` function with your company ID

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Events</title>
</head>
<body>
    <!-- Container for the event grid -->
    <div id="sequel_root"></div>

    <!-- Load Sequel script -->
    <script src="https://embed.sequel.io/sequel.js"></script>
    
    <!-- Initialize the event grid -->
    <script>
        Sequel.renderEventGrid({
            companyId: 'your-company-id-here'
        });
    </script>
</body>
</html>
```

## Installation

### Option 1: Direct Script Include
```html
<script src="https://embed.sequel.io/sequel.js"></script>
```

### Option 2: Module Import (if using a bundler)
```javascript
import { Sequel } from '@sequel/embed-toolkit';
```

## Configuration Options

The `renderEventGrid` function accepts the following options:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `companyId` | `string` | **Required** | Your Sequel company ID |
| `darkMode` | `boolean` | `false` | Enable dark mode styling |
| `excludeText` | `string` | `""` | Exclude events whose names start with this text |
| `showDescription` | `boolean` | `false` | Show event descriptions below titles |

### Example with All Options
```javascript
Sequel.renderEventGrid({
    companyId: 'your-company-id-here',
    darkMode: true,
    excludeText: 'test',
    showDescription: true
});
```

## Examples

### Basic Light Mode Grid
```html
<div id="sequel_root"></div>
<script src="https://embed.sequel.io/sequel.js"></script>
<script>
    Sequel.renderEventGrid({
        companyId: 'abc123-def456-ghi789'
    });
</script>
```

### Dark Mode with Descriptions
```html
<div id="sequel_root"></div>
<script src="https://embed.sequel.io/sequel.js"></script>
<script>
    Sequel.renderEventGrid({
        companyId: 'abc123-def456-ghi789',
        darkMode: true,
        showDescription: true
    });
</script>
```

### Exclude Test Events
```html
<div id="sequel_root"></div>
<script src="https://embed.sequel.io/sequel.js"></script>
<script>
    Sequel.renderEventGrid({
        companyId: 'abc123-def456-ghi789',
        excludeText: 'test' // Hides events starting with "test"
    });
</script>
```

### Complete Example with Custom Styling
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Our Events</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .events-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="events-container">
        <h1>Upcoming & Past Events</h1>
        <div id="sequel_root"></div>
    </div>

    <script src="https://embed.sequel.io/sequel.js"></script>
    <script>
        Sequel.renderEventGrid({
            companyId: 'your-company-id-here',
            showDescription: true
        });
    </script>
</body>
</html>
```

## Event Types & Button Behavior

The widget automatically determines button text based on event type:

| Event Type | Button Text | Description |
|------------|-------------|-------------|
| **Upcoming Events** | "View now" | Directs to registration/event page |
| **Past Events** | "Watch now" | Directs to replay/recorded content |
| **Live Events** | "View now" | Shows "• Live now" indicator |
| **Event Series** | Varies | Shows "• Event Series" indicator |

## Styling

### Built-in Themes

**Light Mode (Default)**
- Clean white cards with subtle borders
- Black buttons with white text
- Optimized for light backgrounds

**Dark Mode**
- Dark gray cards with light borders
- White buttons with black text
- Optimized for dark backgrounds

### Custom CSS

The widget renders inside a Shadow DOM, so global CSS won't affect it. However, you can style the container:

```css
#sequel_root {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
```

### Responsive Design

The widget is fully responsive and will adapt to container width:
- **Desktop**: 3-column grid (1280px max-width)
- **Tablet**: 2-column grid
- **Mobile**: 1-column grid

## Features

### Automatic Pagination
- Shows 9 events per category by default
- "Load more" buttons appear when more events are available
- Smooth loading states and error handling

### Event Information Displayed
- **Event title** (max 2 lines)
- **Event description** (max 2 lines, optional)
- **Date, time, and timezone**
- **Event banner image** (16:9 aspect ratio)
- **Live/Series indicators**
- **Action button** (View now/Watch now)

### Smart Filtering
- Only shows events with valid registration URLs
- Past events only appear if replays are available
- Optional text-based exclusion filtering
- Automatic categorization (upcoming vs past)

## Troubleshooting

### Common Issues

**"Company ID is required" Error**
```javascript
// ❌ Missing company ID
Sequel.renderEventGrid({});

// ✅ Correct usage
Sequel.renderEventGrid({
    companyId: 'your-company-id-here'
});
```

**"Element with id 'sequel_root' not found" Error**
```html
<!-- ❌ Missing container -->
<script>
    Sequel.renderEventGrid({ companyId: 'abc123' });
</script>

<!-- ✅ Add container first -->
<div id="sequel_root"></div>
<script>
    Sequel.renderEventGrid({ companyId: 'abc123' });
</script>
```

**No Events Appearing**
1. Verify your company ID is correct
2. Ensure events have `registration.customUrl` set
3. For past events, verify replays are enabled
4. Check browser console for error messages

**Events Not Loading**
1. Check network connectivity
2. Verify the Sequel API is accessible
3. Check browser console for CORS or network errors

### Getting Your Company ID

1. Log into your Sequel dashboard
2. Go to Settings → Company Settings
3. Copy the Company ID from the URL or settings page
4. The ID format is typically: `12345678-1234-1234-1234-123456789abc`

### Debug Mode

Enable browser developer tools to see console logs:
- Open Developer Tools (F12)
- Check the Console tab for error messages
- Look for network requests to `api.introvoke.com`

## Browser Support

The Event Grid Widget supports:
- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

## Performance

- **Initial Load**: ~50-100ms
- **Event Images**: Lazy loaded and optimized
- **Bundle Size**: ~45KB gzipped
- **Memory Usage**: Minimal impact

## Security

- Uses HTTPS for all API requests
- Renders in isolated Shadow DOM
- No external dependencies beyond Sequel
- Content is sanitized for XSS protection

## Support

For technical support or questions:
- Email: support@sequel.io
- Documentation: https://docs.sequel.io
- Status Page: https://status.sequel.io

---

## Changelog

### v1.0.0
- Initial release
- Light/dark mode support
- Responsive grid layout
- Automatic pagination
- Event filtering options
- Rich text description support
