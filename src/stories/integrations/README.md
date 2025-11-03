# Sequel Embed Toolkit - Integration Examples

This directory contains Storybook examples demonstrating how to use the Sequel Embed Toolkit for various integration scenarios.

## Available Stories

### 1. RenderEvent
Demonstrates the basic `renderEvent` function that renders a Sequel event with an optional join code.

**Key Features:**
- Render event without join code (public event)
- Render event with join code (registered user)

### 2. CheckAndRenderIfRegistered
Demonstrates automatic registration checking and rendering.

**Key Features:**
- Checks URL parameters for joinCode
- Checks cookies for cached join codes
- Validates join codes against Sequel API
- Automatically renders event if registered
- Shows form if not registered

### 3. RegisterUser
Demonstrates programmatic user registration.

**Key Features:**
- Register user with name and email
- Returns join code, auth token, and join URL
- Automatically saves join code to cookies
- Renders event after registration

### 4. HubspotIntegration
Demonstrates integration with HubSpot forms.

**Key Features:**
- Load HubSpot forms dynamically
- Listen for form submissions
- Auto-register users after form submission
- Render countdown timer before registration
- Support for add-to-calendar functionality

### 5. ListenHubspotFormSubmissions
Demonstrates listening for HubSpot form submissions on existing forms.

**Key Features:**
- Listen for any HubSpot form on the page
- Extract user information from submissions
- Automatically register users with Sequel
- No form loading required (works with existing forms)

## Usage

To view these examples:

```bash
npm run dev
```

Then open Storybook in your browser (typically at `http://localhost:6006`).

Navigate to the "Integrations" section in the sidebar to see all examples.

## Common Patterns

### Pattern 1: Check if user is registered, show form if not

```typescript
window.Sequel.checkAndRenderIfRegistered({
  sequelEventId: 'your-event-id',
  onAlreadyRegistered: (joinCode) => {
    // User is registered - event is already rendered
  },
  onNotRegistered: () => {
    // Show your custom registration form
  }
});
```

### Pattern 2: Register user and render event

```typescript
// Register user
const result = await window.Sequel.registerUserForEvent(
  eventId,
  name,
  email
);

// Save to cookies
window.Sequel.setSequelJoinCodeCookie(eventId, result.joinCode);

// Render event
window.Sequel.renderEvent({
  eventId,
  joinCode: result.joinCode
});
```

### Pattern 3: Listen for HubSpot form submissions

```typescript
// Set up listener for any HubSpot form
window.Sequel.listenHubspotFormSubmissions({
  sequelEventId: 'your-event-id'
});

// Users will be automatically registered when they submit any HubSpot form
```

## Next Steps

After exploring these examples, check out:
- `src/stories/widgets/` - Widget examples (Event Grid, Related Events, Agenda)
- `src/stories/events/` - Event rendering examples
- `examples/nextjs-contentful-example/` - Full Next.js integration example

