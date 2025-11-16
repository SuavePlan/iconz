# ICO Generator Module

Generates Windows ICO files containing multiple icon sizes for Windows applications and favicons.

## Features

- **Multi-size support** - Single ICO file with multiple resolutions
- **Windows 11 ready** - Supports high-DPI displays
- **Favicon generation** - Perfect for website favicons
- **Legacy compatibility** - Works with all Windows versions

## Functions

### `generateIcoIcon(buffers, config, options)`
Generate a single ICO file containing multiple PNG images at different sizes.

```typescript
const icon = await generateIcoIcon(buffers, {
  type: 'ico',
  name: 'favicon',
  sizes: [16, 24, 32, 48, 64, 128, 256]
}, {
  outputDir: './public'
});
```

### `validateIcoSizes(sizes)`
Validate that all sizes are square (required for ICO format).

```typescript
const isValid = validateIcoSizes([16, 32, 64]); // true
const invalid = validateIcoSizes(['16x24', 32]); // false - 16x24 not square
```

## ICO Format Requirements

- **Square dimensions required** - All sizes must have width === height
- **Recommended sizes** - 16, 24, 32, 48, 64, 128, 256
- **Windows 11 support** - Include 256px for high-DPI displays
- **Legacy support** - Include 16, 24, 32, 48 for older systems

## Common Use Cases

### Website Favicon
```typescript
{
  type: 'ico',
  name: 'favicon',
  sizes: [16, 24, 32, 48, 64]
}
```

### Windows Application Icon
```typescript
{
  type: 'ico',
  name: 'app',
  sizes: [16, 24, 32, 48, 64, 128, 256]
}
```

### High-DPI Only
```typescript
{
  type: 'ico',
  name: 'icon',
  sizes: [128, 256]
}
```

## Browser Support

ICO format is universally supported across all browsers and Windows versions. It's the standard format for favicons and Windows application icons.
