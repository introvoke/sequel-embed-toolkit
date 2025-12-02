# Sequel Embed Toolkit

A comprehensive JavaScript toolkit for embedding Sequel events and widgets into your website. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Event Embeds**: Embed live Sequel events directly into your website
- **Event Grid Widget**: Display upcoming and past events in a responsive grid
- **Related Events Widget**: Show related events on event pages
- **Multi-Registration Widget**: Allow users to register for multiple events at once
- **Registration Integration**: Seamless integration with Marketo and HubSpot forms
- **Analytics Tracking**: Built-in tracking for page views and user interactions
- **Dark Mode Support**: All widgets support light and dark themes

## Installation

### Via CDN (Recommended)

```html
<script src="https://cdn.sequel.io/embed-toolkit/latest.js"></script>
```

### Via npm

```bash
npm install @sequel/embed-toolkit
```

## Quick Start

### Initialize the SDK

```javascript
// Initialize with your company ID for tracking
Sequel.init('your-company-id');

// Enable tracking (optional)
Sequel.initializeTracking();
```

### Embed a Single Event

```html
<div id="sequel_root"></div>

<script>
  Sequel.embedSequelRegistration({
    sequelEventId: 'your-event-id'
  });
</script>
```

## Widgets

### 1. Event Grid Widget

Display all your company's events in a responsive grid with pagination.

```html
<div id="sequel_root"></div>

<script>
  Sequel.renderEventGrid({
    companyId: 'your-company-id',
    darkMode: false,
    excludeText: 'test',
    showDescription: true
  });
</script>
```

[See full Event Grid documentation →](./docs/event-grid-widget.md)

### 2. Related Events Widget

Show related events on your event pages.

```html
<div id="sequel_root"></div>

<script>
  Sequel.renderRelatedEvents({
    companyId: 'your-company-id',
    darkMode: false,
    maxEvents: 6,
    showDescription: false
  });
</script>
```

[See full Related Events documentation →](./docs/related-events-widget.md)

### 3. Multi-Registration Widget (New!)

Allow users to register for multiple events with a single form.

```html
<div id="sequel_root"></div>

<script>
  Sequel.renderMultiRegistration({
    eventIds: [
      'event-id-1',
      'event-id-2',
      'event-id-3'
    ],
    darkMode: false,
    onRegistrationComplete: (joinCodes) => {
      console.log('Registered for:', joinCodes);
    }
  });
</script>
```

**Features:**
- Select up to 3 events from a list
- Preview event details before registering
- Single form registers user for all selected events
- Responsive two-column layout
- Full dark mode support

[See full Multi-Registration documentation →](./docs/multi-registration-widget.md)

## Integration with Marketing Automation

### HubSpot Integration

```javascript
Sequel.renderSequelWithHubspotFrame({
  sequelEventId: 'your-event-id',
  renderAddToCalendar: true,
  loadHubspotForm: true,
  renderCountdown: false
});
```

### Marketo Integration

```javascript
Sequel.renderSequelWithMarketoFrame({
  sequelEventId: 'your-event-id',
  renderAddToCalendar: true,
  loadMarketoForm: true,
  openLinksInNewTab: false
});
```

## API Methods

### Registration

```javascript
// Register a user for an event
const result = await Sequel.registerUserForEvent(
  'event-id',
  'John Doe',
  'john@example.com'
);
// Returns: { joinCode, authToken, joinUrl }
```

### Validation

```javascript
// Check if a join code is valid
const isValid = await Sequel.validateJoinCode('event-id', 'join-code');
```

### Check Registration Status

```javascript
// Check if user is already registered and auto-render event
const isRegistered = await Sequel.checkAndRenderIfRegistered({
  sequelEventId: 'your-event-id',
  onAlreadyRegistered: (joinCode) => {
    console.log('User is registered:', joinCode);
  },
  onNotRegistered: () => {
    console.log('User needs to register');
  }
});
```

## Analytics & Tracking

```javascript
// Initialize tracking
Sequel.init('your-company-id');
Sequel.initializeTracking();

// Identify a user
Sequel.identify('user@example.com', {
  name: 'John Doe',
  companyName: 'Acme Inc',
  title: 'Developer'
});

// Track page view (automatic when initialized)
Sequel.trackPageView();

// Listen for form submissions
Sequel.listenHubspotFormSubmissions({
  sequelEventId: 'your-event-id'
});
```

## Dark Mode

All widgets support dark mode. Enable it by setting `darkMode: true`:

```javascript
Sequel.renderEventGrid({
  companyId: 'your-company-id',
  darkMode: true
});
```

## Examples

See the `/examples` directory for complete implementation examples:

- [Next.js + Contentful Example](./examples/nextjs-contentful-example/)
- [Basic Event Grid](./test-event-grid.html)
- [Multi-Registration Demo](./test-multi-registration.html)

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Storybook

```bash
npm run storybook
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## TypeScript Support

This toolkit is written in TypeScript and includes full type definitions.

```typescript
import { Sequel } from '@sequel/embed-toolkit';

Sequel.renderMultiRegistration({
  eventIds: ['event-1', 'event-2'],
  darkMode: false,
  onRegistrationComplete: (joinCodes) => {
    // TypeScript knows the shape of joinCodes
    joinCodes.forEach(({ eventId, joinCode }) => {
      console.log(eventId, joinCode);
    });
  }
});
```

## Support

For questions or issues, please contact Sequel support or open an issue on GitHub.

## License

See [LICENSE](./LICENSE) file for details.
