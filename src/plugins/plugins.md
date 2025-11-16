# Plugins Module

Built-in plugins for image optimization, compression, and visual effects.

## Documentation

- **[Optimization Plugins](./optimization.md)** - File size optimization with quality control
- **[Compression Plugins](./compression.md)** - Format-specific compression strategies
- **[Effects Plugins](./effects.md)** - Visual effects and image enhancements

## Optimization Plugins

### `optimizationPlugin`
General-purpose optimization with configurable quality and effort.

```typescript
import { optimizationPlugin, createIconz } from 'iconz';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [optimizationPlugin],
  icons: { /* ... */ }
});
```

### `aggressiveOptimization`
Maximum optimization (slower, best results).

```typescript
import { aggressiveOptimization } from 'iconz/plugins';

// Reduces file size by ~30-50% compared to default
plugins: [aggressiveOptimization]
```

### `fastOptimization`
Quick optimization (faster, good results).

```typescript
import { fastOptimization } from 'iconz/plugins';

// Good balance between speed and file size
plugins: [fastOptimization]
```

## Compression Plugins

### `pngCompression`
PNG-specific compression with palette optimization.

```typescript
import { pngCompression } from 'iconz/plugins';

plugins: [pngCompression]
```

### `webpCompression`
WebP compression (better than PNG).

```typescript
import { webpCompression } from 'iconz/plugins';

plugins: [webpCompression]
```

### `avifCompression`
AVIF compression (best compression, newest format).

```typescript
import { avifCompression } from 'iconz/plugins';

plugins: [avifCompression]
```

### `adaptiveCompression`
Automatically chooses best compression based on image characteristics.

```typescript
import { adaptiveCompression } from 'iconz/plugins';

// Analyzes image and applies optimal settings
plugins: [adaptiveCompression]
```

### `ultraCompression`
Maximum compression (smaller files, lower quality).

```typescript
import { ultraCompression } from 'iconz/plugins';

// Use when file size is critical
plugins: [ultraCompression]
```

## Effects Plugins

### `createWatermarkPlugin`
Add watermark to icons.

```typescript
import { createWatermarkPlugin } from 'iconz/plugins';

const watermark = createWatermarkPlugin({
  image: './watermark.png',
  position: 'southeast',
  opacity: 0.3
});

plugins: [watermark]
```

### `createShadowPlugin`
Add drop shadow effect.

```typescript
import { createShadowPlugin } from 'iconz/plugins';

const shadow = createShadowPlugin({
  blur: 10,
  opacity: 0.5,
  color: { r: 0, g: 0, b: 0 }
});

plugins: [shadow]
```

### `createBorderPlugin`
Add border and rounded corners.

```typescript
import { createBorderPlugin } from 'iconz/plugins';

const border = createBorderPlugin({
  width: 2,
  color: { r: 255, g: 255, b: 255, alpha: 1 },
  radius: 10 // Rounded corners
});

plugins: [border]
```

### `createEnhancementPlugin`
Enhance brightness, contrast, saturation, sharpness.

```typescript
import { createEnhancementPlugin } from 'iconz/plugins';

const enhancement = createEnhancementPlugin({
  brightness: 10,
  contrast: 5,
  saturation: 0,
  sharpness: 2
});

plugins: [enhancement]
```

## Combining Plugins

```typescript
import {
  adaptiveCompression,
  createEnhancementPlugin,
  createWatermarkPlugin
} from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    createEnhancementPlugin({ sharpness: 1 }),
    adaptiveCompression,
    createWatermarkPlugin({ image: './wm.png', opacity: 0.2 })
  ],
  icons: { /* ... */ }
});
```

## Performance Tips

1. **Order matters** - Apply enhancements before compression
2. **Use adaptive compression** - Best automatic results
3. **Test quality settings** - Balance between size and quality
4. **Combine wisely** - Too many plugins slow generation

## File Size Comparison

| Plugin | Reduction | Quality | Speed |
|--------|-----------|---------|-------|
| None | 0% | 100% | Fast |
| fastOptimization | ~20% | 95% | Fast |
| optimizationPlugin | ~30% | 90% | Medium |
| aggressiveOptimization | ~40% | 90% | Slow |
| adaptiveCompression | ~35% | 92% | Medium |
| ultraCompression | ~50% | 75% | Slow |

## Creating Custom Plugins

```typescript
import type { Plugin } from 'iconz';

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',

  setup: async () => {
    // Initialize resources
  },

  execute: async ({ image, config, buffer }) => {
    // Modify image
    image.modulate({ brightness: 1.1 });
    return image;
  },

  teardown: async () => {
    // Cleanup resources
  }
};
```

## Best Practices

1. **Always use some optimization** - At least `fastOptimization`
2. **Test before production** - Verify quality is acceptable
3. **Use adaptive for icons** - Works well for most icon types
4. **Combine enhancements sparingly** - Can degrade quality
5. **Profile performance** - Remove plugins if generation is too slow
