# Template Parser Module

This module provides template variable parsing for dynamic filename generation using Handlebars-style `{{variable}}` syntax.

## Features

- **Nested object access** - Access nested properties using dot notation (`{{date.year}}`)
- **Type-safe** - Works with typed `TemplateVariables` interface
- **Date variables** - Automatically generate date/time variables
- **Environment variables** - Access process.env variables

## Usage

```typescript
import { parseTemplate, createTemplateVariables } from './utils/template';

// Create variables for a specific icon size
const vars = createTemplateVariables(192, 1);

// Parse template with variables
const filename = parseTemplate('icon-{{dims}}-{{counter}}', vars);
// Result: "icon-192x192-1"

// Use nested values
const timestamped = parseTemplate('icon-{{date.year}}{{date.month}}{{date.day}}', vars);
// Result: "icon-20241013"
```

## Available Template Variables

- `{{width}}` - Icon width in pixels
- `{{height}}` - Icon height in pixels
- `{{dims}}` - Dimensions as WxH (e.g., "192x192")
- `{{size}}` - Original size specification
- `{{counter}}` - Incremental counter
- `{{date.year}}` - Full year (e.g., "2024")
- `{{date.month}}` - Month (01-12)
- `{{date.day}}` - Day of month (01-31)
- `{{date.hour}}` - Hour (00-23)
- `{{date.minute}}` - Minute (00-59)
- `{{date.second}}` - Second (00-59)
- `{{date.millisecond}}` - Millisecond (000-999)
- `{{date.iso}}` - ISO 8601 timestamp
- `{{date.timestamp}}` - Unix timestamp
- `{{meta.*}}` - Image metadata (if available)
- `{{env.*}}` - Environment variables

## Functions

### `parseTemplate(template, variables)`
Parse a template string by replacing all `{{variable}}` placeholders with their values.

### `createTemplateVariables(size, counter, meta?)`
Create a complete set of template variables for an icon size.

### `createDateVariables(date?)`
Create date-related template variables from a Date object.
