# PNG Generator Module

Generates PNG icons in various sizes with optimized compression. Also supports modern formats like WebP and AVIF.

## Features

- **Optimized compression** - Maximum compression while maintaining quality
- **Transparency support** - Full alpha channel support
- **Template-based naming** - Dynamic filenames using template variables
- **Modern formats** - WebP and AVIF support for better compression
- **Batch generation** - Efficiently generate multiple sizes

## Functions

### `generatePngIcons(buffers, config, options)`
Generate PNG icons from pre-processed image buffers.

```typescript
const icons = await generatePngIcons(buffers, {
  type: 'png',
  name: 'icon-{{dims}}',
  sizes: [16, 32, 64, 128, 256]
}, {
  outputDir: './icons'
});
```

### `generateWebpIcons(buffers, config, options)`
Generate WebP icons with better compression than PNG.

### `generateAvifIcons(buffers, config, options)`
Generate AVIF icons with the best compression (newest format).

## Usage Example

```typescript
import { ImageProcessor } from '../core/processor';
import { generatePngIcons } from './png';

// Process images
const processor = createProcessor();
await processor.load('./logo.svg');
const buffers = await processor.generateSizes([16, 32, 64, 128, 256]);

// Generate PNG icons
const icons = await generatePngIcons(buffers, config, { outputDir: './dist' });

console.log(`Generated ${icons.length} PNG icons`);
```

## Format Comparison

| Format | Compression | Quality | Browser Support | Use Case |
|--------|-------------|---------|-----------------|----------|
| PNG | Good | Excellent | Universal | Default choice |
| WebP | Better | Excellent | Modern browsers | Web apps (2020+) |
| AVIF | Best | Excellent | Latest browsers | Progressive enhancement |
