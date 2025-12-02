# Multi-Registration Widget

The Multi-Registration widget allows users to register for multiple Sequel events at once through a single registration form. Users can select up to 3 events from a list, view detailed information about each event, and submit one registration form to register for all selected events simultaneously.

## Features

- **Multi-Select Interface**: Users can select up to 3 events from a checkbox list
- **Event Details Preview**: Click on any event to view its details including title, description, date, time, speaker information, and banner image
- **Single Registration Form**: One form to register for all selected events
- **Dark Mode Support**: Built-in dark mode styling
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Success Feedback**: Clear confirmation message after successful registration

## Usage

### Basic Implementation

Add the following HTML to your page:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Multi-Event Registration</title>
</head>
<body>
    <!-- Container for the widget -->
    <div id="sequel_root"></div>

    <!-- Include the Sequel toolkit script -->
    <script src="https://cdn.sequel.io/embed-toolkit/latest.js"></script>
    
    <script>
        // Initialize the multi-registration widget
        Sequel.renderMultiRegistration({
            eventIds: [
                'event-id-1',
                'event-id-2',
                'event-id-3'
            ],
            darkMode: false,
            onRegistrationComplete: (joinCodes) => {
                console.log('Registration completed for:', joinCodes);
                // joinCodes is an array of { eventId, joinCode } objects
            }
        });
    </script>
</body>
</html>
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `eventIds` | `string[]` | Yes | - | Array of Sequel event IDs (up to 3 events) |
| `darkMode` | `boolean` | No | `false` | Enable dark mode styling |
| `onRegistrationComplete` | `function` | No | - | Callback function called when registration is complete. Receives an array of `{ eventId: string, joinCode: string }` objects |

### Dark Mode Example

```html
<div id="sequel_root"></div>

<script src="https://cdn.sequel.io/embed-toolkit/latest.js"></script>

<script>
    Sequel.renderMultiRegistration({
        eventIds: [
            'event-id-1',
            'event-id-2'
        ],
        darkMode: true
    });
</script>
```

### With Registration Callback

```html
<div id="sequel_root"></div>

<script src="https://cdn.sequel.io/embed-toolkit/latest.js"></script>

<script>
    Sequel.renderMultiRegistration({
        eventIds: [
            'event-id-1',
            'event-id-2',
            'event-id-3'
        ],
        onRegistrationComplete: (joinCodes) => {
            // Redirect to a custom thank you page with all join codes
            const params = new URLSearchParams();
            joinCodes.forEach((item, index) => {
                params.append(`event${index}`, item.eventId);
                params.append(`joinCode${index}`, item.joinCode);
            });
            window.location.href = `/thank-you?${params.toString()}`;
        }
    });
</script>
```

## How It Works

### Layout

The widget is split into two main sections:

**Left Side:**
- Multi-select checkboxes for up to 3 events
- Registration form with first name, last name, and email fields
- Register button that shows the number of selected events

**Right Side:**
- Event details preview that updates when you click on an event
- Shows event banner image, title, description, date/time, key points, and speaker information
- Placeholder message when no event is selected

### User Flow

1. User sees a list of events with checkboxes
2. User selects one or more events they want to register for
3. User clicks on an event to preview its details on the right side
4. User fills in their first name, last name, and email
5. User clicks the "Register for X Events" button
6. Registration is processed for all selected events simultaneously
7. Success message is displayed

### Registration Process

When the user submits the form:
1. The widget validates that at least one event is selected
2. The widget validates that all form fields are filled
3. The widget calls the Sequel registration API for each selected event in parallel
4. Each event registration returns a unique `joinCode` for that event
5. The `onRegistrationComplete` callback is triggered with all the join codes
6. A success message is displayed to the user

## Styling

The widget uses Tailwind CSS for styling and follows the same design system as other Sequel widgets. It automatically adapts to:

- Light and dark modes
- Different screen sizes (responsive)
- Touch and mouse interactions

## Error Handling

The widget handles various error scenarios:

- **No event IDs provided**: Shows error message
- **Failed to load events**: Shows error message with retry option
- **No events selected**: Shows validation message when user tries to submit
- **Missing form fields**: Shows validation message for required fields
- **Registration API failure**: Shows error message with option to retry

## Browser Support

The widget supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Best Practices

1. **Limit to 3 events**: The widget automatically limits to 3 events for optimal UX
2. **Use meaningful event names**: Event names appear in the checkbox list, so make them clear and concise
3. **Provide event details**: Ensure your events have complete information (description, dates, speakers) for the best preview experience
4. **Handle the callback**: Use the `onRegistrationComplete` callback to provide next steps or redirect users
5. **Test dark mode**: If your site uses dark mode, test the widget in both modes

## Common Use Cases

- **Event Series**: Register users for multiple sessions in a webinar series
- **Conference Registration**: Let attendees select which conference sessions they want to attend
- **Workshop Bundles**: Allow users to register for multiple workshops at once
- **Training Programs**: Register for multiple training sessions in a program

## Example: Full Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register for Our Webinar Series</title>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
        }
        .header {
            background: #1e40af;
            color: white;
            padding: 2rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Register for Our Spring Webinar Series</h1>
        <p>Select the sessions you'd like to attend</p>
    </div>

    <div id="sequel_root"></div>

    <script src="https://cdn.sequel.io/embed-toolkit/latest.js"></script>
    
    <script>
        // Initialize tracking
        Sequel.init('your-company-id');
        
        // Render multi-registration widget
        Sequel.renderMultiRegistration({
            eventIds: [
                'spring-webinar-1-id',
                'spring-webinar-2-id',
                'spring-webinar-3-id'
            ],
            darkMode: false,
            onRegistrationComplete: (joinCodes) => {
                // Track registration in your analytics
                if (window.gtag) {
                    gtag('event', 'multi_registration', {
                        'event_count': joinCodes.length
                    });
                }
                
                // Show all event links
                console.log('Registered for events:', joinCodes);
                
                // Could redirect to a custom page
                // window.location.href = '/thank-you';
            }
        });
    </script>
</body>
</html>
```

## Support

For questions or issues with the Multi-Registration widget, please contact Sequel support or refer to the main [README](../README.md) documentation.

