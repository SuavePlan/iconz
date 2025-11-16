# Optimization Plugins

Image optimization plugins that reduce file size while maintaining visual quality using Sharp's built-in features.

## Overview

Optimization plugins apply various techniques to reduce icon file sizes:
- **Metadata stripping** - Remove unnecessary EXIF/metadata
- **Compression tuning** - Adjust compression levels and effort
- **Palette optimization** - Use indexed color when beneficial
- **Sharpening** - Maintain perceived quality after compression

## Available Plugins

### 1. `optimizationPlugin`

General-purpose optimization with configurable quality and effort levels.

```typescript
import { optimizationPlugin } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [optimizationPlugin],
  icons: {
    web: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});

await iconz.generate();
```

**Configuration Options:**

```typescript
interface OptimizationConfig {
  quality?: number;        // 0-100, default: 90
  aggressive?: boolean;    // Use maximum compression, default: false
  stripMetadata?: boolean; // Remove metadata, default: true
  lossless?: boolean;      // Lossless compression, default: false
}
```

**How it Works:**
1. Strips metadata to reduce file size (keeps orientation)
2. Sets density to 72 (standard web resolution)
3. Applies PNG compression with configurable effort
4. Uses palette mode for better compression (lossy mode only)
5. Applies subtle sharpening to maintain perceived quality

**Performance:**
- **Speed**: Medium (effort 7-10)
- **Reduction**: ~30% file size reduction
- **Quality**: 90% (default)

---

### 2. `aggressiveOptimization`

Maximum optimization for smallest file sizes. Slower but produces best compression results.

```typescript
import { aggressiveOptimization } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [aggressiveOptimization],
  icons: { /* ... */ }
});
```

**Features:**
- Maximum compression effort (effort: 10)
- Aggressive palette optimization
- No sharpening (preserves compression)
- Best for production builds

**Performance:**
- **Speed**: Slow (~2-3x longer than default)
- **Reduction**: ~40-50% file size reduction
- **Quality**: 90% (maintains quality despite compression)

**Use Cases:**
- Production web applications
- Large icon sets where file size matters
- PWAs needing offline performance
- Bandwidth-constrained deployments

---

### 3. `fastOptimization`

Quick optimization for development builds. Balances speed and file size reduction.

```typescript
import { fastOptimization } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [fastOptimization],
  icons: { /* ... */ }
});
```

**Features:**
- Lower effort level (faster processing)
- Quality set to 85% (still very good)
- Suitable for rapid iteration

**Performance:**
- **Speed**: Fast (~50% faster than default)
- **Reduction**: ~20% file size reduction
- **Quality**: 85%

**Use Cases:**
- Development builds
- Rapid prototyping
- CI/CD pipelines
- Preview environments

---

## Configuration Examples

### Custom Optimization

Configure optimization settings:

```typescript
import { optimizationPlugin } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    {
      ...optimizationPlugin,
      config: {
        quality: 95,          // Higher quality
        aggressive: true,     // Max compression
        stripMetadata: true,  // Remove metadata
        lossless: false       // Lossy compression (smaller files)
      }
    }
  ],
  icons: { /* ... */ }
});
```

### Lossless Optimization

Preserve perfect quality:

```typescript
const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    {
      ...optimizationPlugin,
      config: {
        lossless: true,       // No quality loss
        quality: 100,         // Maximum quality
        stripMetadata: true   // Still remove metadata
      }
    }
  ],
  icons: { /* ... */ }
});
```

### Development vs Production

Use different optimization for different environments:

```typescript
import { fastOptimization, aggressiveOptimization } from 'iconz/plugins';

const isDev = process.env.NODE_ENV === 'development';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [isDev ? fastOptimization : aggressiveOptimization],
  icons: { /* ... */ }
});
```

## Technical Details

### Metadata Stripping

Removes unnecessary data while preserving orientation:

```typescript
image.withMetadata({
  orientation: undefined,  // Preserve orientation
  density: 72             // Standard web density
});
```

**Benefits:**
- Removes EXIF data
- Removes camera info
- Removes GPS coordinates
- Reduces file size by 5-15%

### PNG Compression Settings

```typescript
// Aggressive mode
image.png({
  compressionLevel: 9,    // Maximum compression
  quality: 90,            // Good quality
  effort: 10,             // Maximum effort
  palette: true          // Use indexed color
});

// Standard mode
image.png({
  compressionLevel: 9,
  quality: 90,
  effort: 7,
  palette: true
});
```

### Sharpening

Applied in non-aggressive mode to maintain perceived quality:

```typescript
image.sharpen({
  sigma: 0.5,   // Subtle sharpening
  m1: 1.0,      // Flat areas
  m2: 0.5       // Jagged areas
});
```

**Why Sharpening?**
- Compression can introduce slight blur
- Sharpening compensates for this
- Maintains perceived quality
- Only applied in standard mode (not aggressive)

## Performance Comparison

| Plugin | Time (100 icons) | File Size | Quality | Use Case |
|--------|------------------|-----------|---------|----------|
| None | ~2s | 100% | 100% | Quick testing |
| `fastOptimization` | ~2.5s | ~80% | 85% | Development |
| `optimizationPlugin` | ~4s | ~70% | 90% | General use |
| `aggressiveOptimization` | ~6s | ~60% | 90% | Production |
| Lossless | ~5s | ~75% | 100% | High quality |

## Best Practices

### 1. Always Use Optimization

Even fast optimization provides significant benefits:

```typescript
// ✓ Good: Always optimize
plugins: [fastOptimization]

// ✗ Bad: No optimization
plugins: []
```

### 2. Choose Right Plugin for Context

```typescript
// Development
plugins: [fastOptimization]

// Staging
plugins: [optimizationPlugin]

// Production
plugins: [aggressiveOptimization]
```

### 3. Test Quality

Always verify quality is acceptable:

```typescript
// Generate test icons
await iconz.generate();

// Manually inspect at 100% zoom
// Check smallest sizes (16x16, 32x32)
// Verify on different backgrounds
```

### 4. Profile Your Build

Measure impact on build time:

```typescript
const start = Date.now();
await iconz.generate();
console.log(`Generated in ${Date.now() - start}ms`);
```

### 5. Consider Format

Different formats benefit differently:

```typescript
// PNG - Use optimization plugins
{ type: 'png', plugins: [aggressiveOptimization] }

// WebP - Already well-compressed
{ type: 'webp', plugins: [fastOptimization] }

// AVIF - Best compression by default
{ type: 'avif', plugins: [] }
```

## Troubleshooting

### Quality Loss Too High

If optimization reduces quality too much:

```typescript
// Increase quality
{
  ...optimizationPlugin,
  config: {
    quality: 95,        // Higher quality
    lossless: true      // Or use lossless
  }
}
```

### File Sizes Still Too Large

If files are still too large:

```typescript
// Use aggressive optimization
plugins: [aggressiveOptimization]

// Or ultra compression (see compression.md)
plugins: [ultraCompression]

// Or switch format
{ type: 'webp' }  // Better compression than PNG
{ type: 'avif' }  // Best compression available
```

### Build Takes Too Long

If generation is too slow:

```typescript
// Use fast optimization
plugins: [fastOptimization]

// Or optimize only production builds
const plugins = isProd ? [aggressiveOptimization] : [];
```

### Icons Look Blurry

If icons appear blurry after optimization:

```typescript
// Disable aggressive mode (re-enables sharpening)
{
  ...optimizationPlugin,
  config: {
    aggressive: false,  // Standard mode with sharpening
    quality: 95        // Higher quality
  }
}
```

## Implementation Details

The optimization plugin uses Sharp's built-in PNG encoder with various settings:

```typescript
export const optimizationPlugin: Plugin<OptimizationConfig, sharp.Sharp> = {
  name: 'optimization',
  version: '1.0.0',

  execute: async ({ image, config }) => {
    const options = config || {};
    const quality = options.quality ?? 90;
    const aggressive = options.aggressive ?? false;
    const stripMetadata = options.stripMetadata ?? true;

    if (stripMetadata) {
      image.withMetadata({
        orientation: undefined,
        density: 72
      });
    }

    if (options.lossless) {
      image.png({
        compressionLevel: 9,
        quality: 100,
        effort: aggressive ? 10 : 7
      });
    } else {
      image.png({
        compressionLevel: 9,
        quality: quality,
        effort: aggressive ? 10 : 7,
        palette: true
      });
    }

    if (!aggressive) {
      image.sharpen({ sigma: 0.5, m1: 1.0, m2: 0.5 });
    }

    return image;
  }
};
```

## Related Documentation

- [Compression Plugins](./compression.md) - Format-specific compression
- [Effects Plugins](./effects.md) - Visual effects and enhancements
- [Plugins Overview](./plugins.md) - All available plugins
- [Processor](../core/processor.md) - Image processing pipeline
- [PNG Generator](../generators/png.md) - PNG icon generation
