# Format Registry

Runtime registry system for managing icon formats, generators, validators, and converters. Enables full extensibility without modifying core code.

## Overview

The format registry provides a pluggable system where:
- **Formats** can be registered with their generators
- **Validators** ensure icon sizes are appropriate for each format
- **Converters** handle Sharp image format conversion
- **Composite formats** map to intermediate formats (e.g., ICO → PNG)
- **Processing options** define format-specific Sharp settings

## Architecture

```
┌─────────────────────────────────────┐
│      Format Registry (Runtime)      │
├─────────────────────────────────────┤
│ • Format Generators                 │
│ • Format Validators                 │
│ • Format Converters                 │
│ • Composite Format Mappings         │
│ • Processing Options                │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   IconFormatRegistry (TypeScript)   │
├─────────────────────────────────────┤
│ Type-level format definitions       │
│ (declaration merging)               │
└─────────────────────────────────────┘
```

## API

### Format Generators

#### `registerFormatGenerator(format, generator)`

Register a generator function for an icon format.

```typescript
import { registerFormatGenerator } from 'iconz';

registerFormatGenerator('pdf', async (buffers, config, options) => {
  // Generate PDF icons from buffers
  const icons: GeneratedIcon[] = [];

  for (const [size, buffer] of buffers) {
    // Your PDF generation logic
    const pdfBuffer = await convertToPdf(buffer, size);
    icons.push({
      path: `${options.outputDir}/icon.pdf`,
      format: 'pdf',
      dimensions: parseDimensions(size),
      size: pdfBuffer.length
    });
  }

  return icons;
});
```

#### `getFormatGenerator(format)`

Retrieve a registered format generator.

```typescript
import { getFormatGenerator } from 'iconz';

const generator = getFormatGenerator('png');
if (generator) {
  const icons = await generator(buffers, config, options);
}
```

#### `listFormatGenerators()`

List all registered format generators.

```typescript
import { listFormatGenerators } from 'iconz';

const formats = listFormatGenerators();
// Returns: ['png', 'ico', 'icns', 'jpeg', 'webp', 'avif', 'svg', ...]
```

### Format Validators

#### `registerFormatValidator(format, validator)`

Register a validator function to check if icon sizes are valid for a format.

```typescript
import { registerFormatValidator } from 'iconz';

// Example: PDF icons must be square
registerFormatValidator('pdf', (sizes) => {
  for (const size of sizes) {
    const { width, height } = parseDimensions(size);
    if (width !== height) {
      return false; // Not square
    }
  }
  return true;
});
```

#### `getFormatValidator(format)`

Retrieve a registered format validator.

```typescript
import { getFormatValidator } from 'iconz';

const validator = getFormatValidator('ico');
if (validator) {
  const isValid = validator([16, 32, 48]);
}
```

### Format Converters

#### `registerFormatConverter(format, converter)`

Register a Sharp converter function for format conversion.

```typescript
import { registerFormatConverter } from 'iconz';

registerFormatConverter('webp', (instance, options, quality) => {
  return instance.webp({
    ...options,
    quality: quality ?? 90,
    effort: 6
  });
});
```

**Converter Function Type:**
```typescript
type FormatConverterFn = (
  instance: sharp.Sharp,
  options: unknown,
  quality?: number
) => sharp.Sharp;
```

#### `getFormatConverter(format)`

Retrieve a registered format converter.

```typescript
import { getFormatConverter } from 'iconz';

const converter = getFormatConverter('png');
if (converter) {
  const sharpInstance = converter(sharp(buffer), options, 95);
}
```

### Composite Formats

#### `registerCompositeFormat(format, intermediateFormat)`

Register a format that requires an intermediate format for generation.

```typescript
import { registerCompositeFormat } from 'iconz';

// ICO is generated from PNG buffers
registerCompositeFormat('ico', 'png');

// ICNS is generated from PNG buffers
registerCompositeFormat('icns', 'png');
```

#### `getIntermediateFormat(format)`

Get the intermediate format for a composite format.

```typescript
import { getIntermediateFormat } from 'iconz';

const intermediate = getIntermediateFormat('ico');
// Returns: 'png'
```

#### `isCompositeFormat(format)`

Check if a format is composite.

```typescript
import { isCompositeFormat } from 'iconz';

if (isCompositeFormat('ico')) {
  console.log('ICO requires PNG intermediate');
}
```

### Processing Options

#### `registerFormatProcessingOptions(format, options)`

Register Sharp processing options for a format.

```typescript
import { registerFormatProcessingOptions } from 'iconz';

registerFormatProcessingOptions('png', {
  compressionLevel: 9,
  adaptiveFiltering: true,
  palette: false
});
```

#### `getFormatProcessingOptions(format)`

Get registered processing options for a format.

```typescript
import { getFormatProcessingOptions } from 'iconz';

const options = getFormatProcessingOptions('png');
// Returns: { compressionLevel: 9, ... }
```

## Complete Example

Register a custom format with all components:

```typescript
import {
  registerFormatGenerator,
  registerFormatValidator,
  registerFormatConverter,
  registerFormatProcessingOptions
} from 'iconz';

// 1. Define TypeScript types
interface WebPOptions {
  quality?: number;
  lossless?: boolean;
  effort?: number;
}

declare module 'iconz/types' {
  interface IconFormatRegistry {
    webp: WebPOptions;
  }
}

// 2. Register generator
registerFormatGenerator('webp', async (buffers, config, options) => {
  const icons: GeneratedIcon[] = [];
  for (const [size, buffer] of buffers) {
    const filename = `${config.name}.webp`;
    const path = join(options.outputDir, filename);
    await writeFile(path, buffer);
    icons.push({
      path,
      format: 'webp',
      dimensions: parseDimensions(size),
      size: buffer.length
    });
  }
  return icons;
});

// 3. Register validator (optional)
registerFormatValidator('webp', (sizes) => {
  // WebP supports all sizes
  return true;
});

// 4. Register converter
registerFormatConverter('webp', (instance, options, quality) => {
  return instance.webp({
    ...(options as WebPOptions),
    quality: quality ?? 90
  });
});

// 5. Register processing options
registerFormatProcessingOptions('webp', {
  lossless: false,
  effort: 4
});

// 6. Use your format!
const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    web: {
      type: 'webp',  // ✓ TypeScript knows this is valid
      name: 'icon-{{dims}}',
      sizes: [192, 512],
      options: {
        quality: 85,  // ✓ Autocomplete works!
        effort: 6
      }
    }
  }
});
```

## Built-in Formats

The following formats are registered automatically:

| Format | Generator | Validator | Composite | Converter |
|--------|-----------|-----------|-----------|-----------|
| png    | ✓         | -         | -         | ✓         |
| jpeg   | ✓         | -         | -         | ✓         |
| webp   | ✓         | -         | -         | ✓         |
| avif   | ✓         | -         | -         | ✓         |
| ico    | ✓         | ✓ (square)| png       | ✓         |
| icns   | ✓         | ✓ (square)| png       | ✓         |
| svg    | ✓         | -         | png       | ✓         |

See [builtin-formats.md](./builtin-formats.md) for registration details.

## TypeScript Integration

The registry works with TypeScript's declaration merging:

```typescript
// Type-level (compile time)
declare module 'iconz/types' {
  interface IconFormatRegistry {
    myFormat: MyFormatOptions;
  }
}

// Runtime registration
registerFormatGenerator('myFormat', myGenerator);
registerFormatConverter('myFormat', myConverter);

// Now fully type-safe!
const config: IconConfig<'myFormat'> = {
  type: 'myFormat',  // ✓ Valid
  options: {
    myOption: true   // ✓ Autocomplete
  }
};
```

## Error Handling

The registry provides helpful error messages:

```typescript
// Unregistered format
const generator = getFormatGenerator('pdf');
// Returns: undefined

// In iconz.ts
if (!generator) {
  throw new Error(
    `Unsupported icon type: pdf. No generator registered for this format.`
  );
}
```

## Best Practices

### 1. Register Early

Register formats before creating Iconz instances:

```typescript
// ✓ Good: Register first
registerFormatGenerator('pdf', pdfGenerator);
const iconz = createIconz({ ... });

// ✗ Bad: Register after
const iconz = createIconz({ ... });
registerFormatGenerator('pdf', pdfGenerator);
```

### 2. Provide All Components

For best experience, register all related components:

```typescript
// ✓ Complete registration
registerFormatGenerator('myFormat', generator);
registerFormatValidator('myFormat', validator);
registerFormatConverter('myFormat', converter);
registerFormatProcessingOptions('myFormat', options);
```

### 3. Handle Errors Gracefully

Always check for undefined:

```typescript
const generator = getFormatGenerator(format);
if (!generator) {
  throw new Error(`Format ${format} not supported`);
}
```

### 4. Use TypeScript

Always extend the type registry:

```typescript
declare module 'iconz/types' {
  interface IconFormatRegistry {
    myFormat: MyOptions;
  }
}
```

## Performance

The registry uses native JavaScript Map for O(1) lookups:
- Registration: O(1)
- Lookup: O(1)
- No performance overhead at runtime

## Related Documentation

- [Builtin Formats](./builtin-formats.md) - Default format registrations
- [Type Registry](../types/types.md) - TypeScript type system
- [SVG Generator](../generators/svg.md) - Example custom format
- [Custom Formats](../../docs/EXTENSIBILITY.md) - Extensibility guide
