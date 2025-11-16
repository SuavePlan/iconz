# Built-in Formats

Registration of all built-in icon formats with their generators, validators, converters, and processing options.

## Overview

This module automatically registers all built-in formats when imported. It's imported by the core Iconz module, so all formats are available by default.

## Registered Formats

### PNG Format

**Type:** Raster
**Composite:** No
**Validator:** None (all sizes valid)

```typescript
registerFormatGenerator('png', generatePngIcons);
registerFormatProcessingOptions('png', {
  compressionLevel: 9
});
registerFormatConverter('png', (instance, options) =>
  instance.png(options)
);
```

**Use Cases:**
- Web icons
- App icons
- General purpose raster graphics

**Processing Options:**
```typescript
{
  compressionLevel: 9,     // Max compression
  quality: 100             // Lossless (inherited from options.quality)
}
```

---

### JPEG Format

**Type:** Raster
**Composite:** No
**Validator:** None (all sizes valid)

```typescript
registerFormatGenerator('jpeg', generatePngIcons); // Uses PNG generator
registerFormatProcessingOptions('jpeg', {
  chromaSubsampling: '4:4:4'
});
registerFormatConverter('jpeg', (instance, options, quality) =>
  instance.jpeg({ ...options, quality: quality ?? 90 })
);
```

**Use Cases:**
- Photo-based icons
- Thumbnails
- Web images (no transparency)

**Processing Options:**
```typescript
{
  chromaSubsampling: '4:4:4', // Best quality
  quality: 90                  // Default quality
}
```

---

### WebP Format

**Type:** Raster
**Composite:** No
**Validator:** None (all sizes valid)

```typescript
registerFormatGenerator('webp', generateWebpIcons);
registerFormatProcessingOptions('webp', {
  lossless: false
});
registerFormatConverter('webp', (instance, options, quality) =>
  instance.webp({ ...options, quality: quality ?? 90 })
);
```

**Use Cases:**
- Modern web icons
- Better compression than PNG
- Supports transparency

**Processing Options:**
```typescript
{
  lossless: false,    // Lossy by default
  quality: 90         // Adjustable quality
}
```

---

### AVIF Format

**Type:** Raster
**Composite:** No
**Validator:** None (all sizes valid)

```typescript
registerFormatGenerator('avif', generateAvifIcons);
registerFormatProcessingOptions('avif', {});
registerFormatConverter('avif', (instance, options, quality) =>
  instance.avif({ ...options, quality: quality ?? 80 })
);
```

**Use Cases:**
- Next-gen web format
- Best compression available
- Supports transparency

**Processing Options:**
```typescript
{
  quality: 80  // Lower default for better compression
}
```

---

### ICO Format

**Type:** Icon Container
**Composite:** Yes (uses PNG)
**Validator:** Square sizes only

```typescript
registerFormatGenerator('ico', generateIcoIcon);
registerFormatValidator('ico', validateIcoSizes);
registerCompositeFormat('ico', 'png');
registerFormatProcessingOptions('ico', {
  compressionLevel: 9
});
registerFormatConverter('ico', (instance, options) =>
  instance.png(options)
);
```

**Use Cases:**
- Windows icons
- Favicons
- Desktop applications

**Validation:**
- All sizes must be square (e.g., 16x16, 32x32)
- Common sizes: 16, 24, 32, 48, 64, 128, 256

**Processing:**
1. Generate PNG buffers for each size
2. Combine into single ICO file using `png-to-ico`

---

### ICNS Format

**Type:** Icon Container
**Composite:** Yes (uses PNG)
**Validator:** Square sizes only

```typescript
registerFormatGenerator('icns', generateIcnsIcon);
registerFormatValidator('icns', validateIcnsSizes);
registerCompositeFormat('icns', 'png');
registerFormatProcessingOptions('icns', {
  compressionLevel: 9
});
registerFormatConverter('icns', (instance, options) =>
  instance.png(options)
);
```

**Use Cases:**
- macOS application icons
- Mac App Store
- Desktop applications

**Validation:**
- All sizes must be square
- Common sizes: 16, 32, 64, 128, 256, 512, 1024
- Retina sizes (@2x): 32, 64, 128, 256, 512, 1024

**Processing:**
1. Generate PNG buffers for each size
2. Map to OSType identifiers
3. Combine into ICNS using `@fiahfy/icns`

**OSType Mapping:**
```typescript
{
  '16x16': 'ic04',
  '32x32': 'ic05',
  '64x64': 'ic11',
  '128x128': 'ic07',
  '256x256': 'ic08',
  '512x512': 'ic09',
  '1024x1024': 'ic10'
}
```

---

### SVG Format

**Type:** Vector
**Composite:** Yes (uses PNG for processing)
**Validator:** None (all sizes valid)

```typescript
registerFormatGenerator('svg', generateSvgIcons);
registerFormatValidator('svg', validateSvgSizes);
registerCompositeFormat('svg', 'png');
registerFormatProcessingOptions('svg', {
  pretty: false,
  removeXmlDeclaration: false,
  addDimensions: true
});
registerFormatConverter('svg', (instance, options) =>
  instance.png(options)
);
```

**Use Cases:**
- Web icons
- Scalable graphics
- Icon libraries

**Processing Options:**
```typescript
{
  pretty: false,                // Compact by default
  removeXmlDeclaration: false,  // Keep XML declaration
  addDimensions: true           // Add width/height attributes
}
```

**Note:** SVG is processed through PNG for size variations, then output as SVG with formatting options applied.

---

## Format Categories

### Raster Formats
- **PNG** - Lossless, best quality
- **JPEG** - Lossy, photos
- **WebP** - Modern, good compression
- **AVIF** - Next-gen, best compression

### Icon Container Formats
- **ICO** - Windows, multiple sizes in one file
- **ICNS** - macOS, multiple sizes with Retina support

### Vector Formats
- **SVG** - Scalable, resolution-independent

### Composite Formats

Formats that generate through an intermediate format:

| Format | Intermediate | Reason |
|--------|-------------|---------|
| ICO    | PNG         | ICO is a container for multiple PNGs |
| ICNS   | PNG         | ICNS stores PNG-encoded images |
| SVG    | PNG         | Process sizes through PNG, output as SVG |

## Auto-Registration

All formats are registered automatically when the module loads:

```typescript
// In builtin-formats.ts
export function registerBuiltinFormats(): void {
  // ... registration code ...
}

// Auto-register on import
registerBuiltinFormats();
```

This happens when you import from `iconz`:

```typescript
import { createIconz } from 'iconz';
// ↑ This import triggers builtin-formats registration
```

## Format Support Matrix

| Format | Read | Write | Transparency | Animation | Compression |
|--------|------|-------|--------------|-----------|-------------|
| PNG    | ✓    | ✓     | ✓            | ✗         | Lossless    |
| JPEG   | ✓    | ✓     | ✗            | ✗         | Lossy       |
| WebP   | ✓    | ✓     | ✓            | ✓         | Both        |
| AVIF   | ✓    | ✓     | ✓            | ✓         | Lossy       |
| ICO    | ✓    | ✓     | ✓            | ✗         | PNG-based   |
| ICNS   | ✓    | ✓     | ✓            | ✗         | PNG-based   |
| SVG    | ✓    | ✓     | ✓            | ✓         | N/A         |

## Quality Defaults

Each format has sensible quality defaults:

```typescript
{
  png: 100,   // Lossless (from compressionLevel)
  jpeg: 90,   // High quality
  webp: 90,   // High quality
  avif: 80,   // Good compression/quality balance
  ico: 100,   // PNG-based, lossless
  icns: 100,  // PNG-based, lossless
  svg: N/A    // Vector format
}
```

Override via `options.quality` in IconzConfig:

```typescript
createIconz({
  input: './logo.svg',
  output: './icons',
  options: {
    quality: 95  // Override default quality
  },
  icons: { ... }
});
```

## Adding Custom Formats

To add your own format, see [Format Registry](./format-registry.md).

Example:

```typescript
import {
  registerFormatGenerator,
  registerFormatConverter,
  registerFormatProcessingOptions
} from 'iconz';

// Register your format
registerFormatGenerator('tiff', generateTiffIcons);
registerFormatConverter('tiff', (instance, options) =>
  instance.tiff(options)
);
registerFormatProcessingOptions('tiff', {
  compression: 'lzw'
});
```

## Dependencies

Built-in formats use these libraries:

- **Sharp** - Core image processing (all raster formats)
- **png-to-ico** - ICO file creation
- **@fiahfy/icns** - ICNS file creation

## Performance Notes

### Fastest Formats
1. **PNG** - Direct Sharp output
2. **JPEG** - Direct Sharp output
3. **WebP** - Direct Sharp output

### Slower Formats
1. **AVIF** - More complex encoding
2. **ICO** - Multiple PNG conversions + container creation
3. **ICNS** - Multiple PNG conversions + container creation

### Recommendations
- Use PNG for development (fastest)
- Use WebP/AVIF for production (smaller files)
- Use ICO/ICNS only when required by platform

## Related Documentation

- [Format Registry](./format-registry.md) - Extensible format system
- [PNG Generator](../generators/png.md) - PNG/WebP/AVIF generator
- [ICO Generator](../generators/ico.md) - Windows icon generator
- [ICNS Generator](../generators/icns.md) - macOS icon generator
- [SVG Generator](../generators/svg.md) - SVG generator
- [Processor](./processor.md) - Image processing pipeline
