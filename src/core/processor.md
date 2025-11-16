# Image Processor Module

Core image processing engine using Sharp with generic support for plugins and transforms. Handles all image manipulation, resizing, and format conversion.

## Features

- **Generic plugin support** - Add custom image processing plugins
- **Multiple format support** - PNG, JPEG, WebP, AVIF, ICO, ICNS
- **Automatic optimization** - Smart compression and quality settings
- **Batch processing** - Generate multiple sizes efficiently
- **Type-safe** - Full TypeScript support with generics

## Usage

### Basic Usage

```typescript
import { createProcessor } from './core/processor';

const processor = createProcessor();

// Load image
await processor.load('./logo.svg');

// Get metadata
const meta = await processor.metadata();
console.log(`Image size: ${meta.width}x${meta.height}`);

// Resize to specific size
const buffer = await processor.resize(192);

// Generate multiple sizes
const sizes = await processor.generateSizes([16, 32, 64, 128, 256]);
```

### With Processing Options

```typescript
const processor = createProcessor({
  resize: {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    kernel: 'lanczos3'
  },
  quality: 95,
  format: 'png'
});
```

### With Plugins

```typescript
import type { Plugin } from '../types/types';

const watermarkPlugin: Plugin = {
  name: 'watermark',
  execute: async ({ image }) => {
    // Add watermark to image
    return image.composite([{
      input: await readFile('watermark.png'),
      gravity: 'southeast'
    }]);
  }
};

processor.use(watermarkPlugin);
```

### Format Conversion

```typescript
// Generate sizes in different formats
const pngSizes = await processor.generateSizes([192, 512], 'png');
const webpSizes = await processor.generateSizes([192, 512], 'webp');
const avifSizes = await processor.generateSizes([192, 512], 'avif');
```

## API

### `ImageProcessor<TPluginConfig>`

Generic image processor class with plugin configuration typing.

#### Methods

- `load(input)` - Load image from file path or buffer
- `use(plugin)` - Add a plugin to the processing pipeline
- `metadata()` - Get Sharp metadata for the loaded image
- `resize(size, options?)` - Resize image to specific size
- `toFormat(buffer, format, dimensions)` - Convert buffer to specific format
- `generateSizes(sizes, format?)` - Generate multiple sizes at once
- `clone()` - Clone processor with current settings
- `cleanup()` - Clean up plugin resources

### `createProcessor<TPluginConfig>(options?)`

Factory function to create a new processor instance.

## Format Support

- **PNG** - Best for icons, lossless, transparency support
- **JPEG** - Best for photos, smaller file size, no transparency
- **WebP** - Modern format, good compression, transparency support
- **AVIF** - Newest format, best compression, limited browser support
- **ICO/ICNS** - Converted to PNG internally, then packaged

## Performance Tips

1. Load image once, then clone processor for multiple operations
2. Use batch processing with `generateSizes()` for efficiency
3. Set appropriate quality levels (90-95 for most use cases)
4. Use `webp` or `avif` for web icons when browser support allows
5. Clean up processors when done to free resources

## Related Documentation

### Core Modules
- [Iconz Core](./iconz.md) - Main icon generation orchestrator
- [Format Registry](./format-registry.md) - Extensible format system
- [Built-in Formats](./builtin-formats.md) - All registered formats

### Plugins
- [Plugins Overview](../plugins/plugins.md) - All available plugins
- [Optimization Plugins](../plugins/optimization.md) - File size optimization
- [Compression Plugins](../plugins/compression.md) - Format-specific compression
- [Effects Plugins](../plugins/effects.md) - Visual effects and enhancements

### Generators
- [PNG Generator](../generators/png.md) - PNG, WebP, AVIF generation
- [ICO Generator](../generators/ico.md) - Windows ICO format
- [ICNS Generator](../generators/icns.md) - macOS ICNS format
- [SVG Generator](../generators/svg.md) - Scalable vector graphics
