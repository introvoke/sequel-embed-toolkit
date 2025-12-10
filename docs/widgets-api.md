# Widgets API Documentation

## Overview

The Widgets API provides a flexible way to render Sequel events with customizable widget components. Widgets are fetched from the Sequel tRPC API and rendered in a shadow DOM for style isolation.

## Features

- **Dynamic Widget Loading**: Widgets are fetched from the API based on event configuration
- **Shadow DOM Isolation**: All widgets render inside a shadow root for CSS encapsulation
- **Opt-in Feature**: Use the `enableWidgets: true` flag to enable this feature
- **Fallback Support**: Automatically falls back to legacy rendering if the API fails

## Usage

### Basic Usage

```javascript
window.Sequel.renderEvent({
  eventId: "your-event-id",
  joinCode: "optional-join-code",
  enableWidgets: true, // Enable widgets-based rendering
});
```

### With embedSequelRegistration

```javascript
window.Sequel.embedSequelRegistration({
  sequelEventId: "your-event-id",
  isPopup: false,
  enableWidgets: true, // Enable widgets-based rendering
});
```

## Supported Widget Types

### 1. Event Embed (`eventEmbed`)

Renders the main event player/iframe.

```typescript
{
  type: "eventEmbed",
  config: {
    id: string;
  }
}
```

### 2. Description (`description`)

Displays event description with HTML support.

```typescript
{
  type: "description",
  config: {
    description?: string;
  }
}
```

### 3. Event Agenda (`eventAgenda`)

Shows the event agenda with sections, images, and subheadings.

```typescript
{
  type: "eventAgenda",
  config: {
    sections: Array<{
      title: string;
      subheading?: string;
      image?: string;
    }>;
  }
}
```

### 4. Events Grid (`eventsGrid`)

Displays a grid of related events with thumbnails and details.

```typescript
{
  type: "eventsGrid",
  config: {
    events: Array<{
      name: string;
      id: string;
      startDate: string | Date;
      endDate: string | Date;
      description?: string;
      picture?: string;
      thumbnail?: string;
    }>;
  }
}
```

## API Endpoint

The widgets are fetched from the Sequel tRPC API:

```typescript
trpcSequelApi.widgets.getWidgets.query({ eventId });
```

## Storybook Examples

View the Storybook stories to see the widgets in action:

- **Basic Example**: `Integrations/RenderEventWithWidgets/WithWidgetsEnabled`
- **With Join Code**: `Integrations/RenderEventWithWidgets/WithWidgetsAndJoinCode`
- **Legacy Comparison**: `Integrations/RenderEventWithWidgets/LegacyRenderingComparison`

To run Storybook:

```bash
npm run storybook
```

## Implementation Details

### Shadow DOM

All widgets render inside a shadow root attached to the `#sequel_root` element. This provides:

- Style isolation from the host page
- Prevents CSS conflicts
- Clean encapsulation of widget styles

### Fallback Behavior

If `enableWidgets` is `false` or not provided, the system falls back to the legacy rendering method:

```javascript
// Legacy rendering (default)
window.Sequel.renderEvent({
  eventId: "your-event-id",
  joinCode: "optional-join-code",
  // enableWidgets defaults to false
});
```

If the widgets API call fails, the system automatically falls back to legacy rendering with a console warning.

## Testing

### Current Test Coverage

⚠️ **Note**: There are currently no automated tests for the widgets feature. Testing is currently done through:

1. **Storybook Stories**: Interactive testing in Storybook
2. **Manual Testing**: Testing in development/staging environments

### Recommended Testing Approach

For comprehensive testing, consider:

1. **Unit Tests**: Test individual widget rendering logic
2. **Integration Tests**: Test API communication and widget loading
3. **E2E Tests**: Test complete user flows with widgets enabled
4. **Visual Regression Tests**: Ensure widgets render consistently

## Migration Guide

### From Legacy to Widgets

1. **Add the flag**: Set `enableWidgets: true` in your `renderEvent` call
2. **Test thoroughly**: Use the Storybook stories to verify behavior
3. **Deploy gradually**: Roll out to a subset of events first
4. **Monitor**: Watch for API errors or rendering issues

### Backwards Compatibility

The widgets feature is fully backwards compatible. Existing implementations will continue to work without any changes, as `enableWidgets` defaults to `false`.

## Troubleshooting

### Widgets Not Showing

- Check browser console for API errors
- Verify the event ID is correct
- Ensure the widgets API endpoint is accessible
- Confirm `enableWidgets: true` is set

### Shadow DOM Issues

- Check if shadow root is properly created
- Verify styles are being applied inside the shadow DOM
- Use browser DevTools to inspect shadow DOM contents

### API Errors

If the widgets API fails:

- System automatically falls back to legacy rendering
- Check network tab for failed requests
- Verify the tRPC endpoint is configured correctly

## Future Enhancements

Potential future improvements:

- [ ] Add automated tests for widgets
- [ ] Support for custom widget types
- [ ] Widget-level configuration options
- [ ] Better error handling and retry logic
- [ ] CSS injection into shadow DOM for Tailwind support
- [ ] Widget analytics and performance monitoring
