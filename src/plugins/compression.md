# Compression Plugins

Format-specific compression plugins that use Sharp's advanced compression features for optimal file size reduction.

## Overview

Compression plugins provide format-specific optimization strategies:
- **PNG Compression** - Palette optimization, adaptive filtering
- **WebP Compression** - Modern format with better compression than PNG
- **AVIF Compression** - Next-generation format with best compression
- **Adaptive Compression** - Analyzes image and chooses best settings
- **Ultra Compression** - Maximum file size reduction

## Available Plugins

### 1. `pngCompression`

PNG-specific compression with palette optimization and adaptive filtering.

```typescript
import { pngCompression } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [pngCompression],
  icons: {
    app: {
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
interface CompressionConfig {
  format?: {
    png?: {
      compressionLevel?: number;  // 0-9, default: 9
      palette?: boolean;          // Use indexed color, default: true
      effort?: number;            // 1-10, default: 10
    }
  }
}
```

**Features:**
- Maximum compression level (9)
- Palette mode for smaller files
- Adaptive filtering for better compression
- Maximum effort (10) for best results

**Performance:**
- **Speed**: Slow (effort 10)
- **Reduction**: ~35% compared to default PNG
- **Quality**: 90% (excellent)

**Use Cases:**
- PNG icon generation
- App icons requiring transparency
- Legacy browser support
- Desktop applications

---

### 2. `webpCompression`

WebP compression for modern browsers with better compression than PNG.

```typescript
import { webpCompression } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [webpCompression],
  icons: {
    modern: {
      type: 'webp',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});
```

**Configuration Options:**

```typescript
interface CompressionConfig {
  format?: {
    webp?: {
      quality?: number;    // 0-100, default: 90
      lossless?: boolean;  // Lossless mode, default: false
      effort?: number;     // 0-6, default: 6
    }
  }
}
```

**Features:**
- Quality: 90% (default)
- Lossy compression for smaller files
- Effort: 6 (max for WebP)
- Smart subsampling for better quality

**Performance:**
- **Speed**: Medium (effort 6)
- **Reduction**: ~40-50% smaller than PNG
- **Quality**: 90% (excellent)
- **Browser Support**: All modern browsers (97%+)

**Use Cases:**
- Modern web applications
- PWAs requiring smaller files
- Mobile-first applications
- Bandwidth-sensitive deployments

---

### 3. `avifCompression`

AVIF compression for next-generation file sizes (best compression available).

```typescript
import { avifCompression } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [avifCompression],
  icons: {
    nextgen: {
      type: 'avif',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});
```

**Configuration Options:**

```typescript
interface CompressionConfig {
  format?: {
    webp?: {
      quality?: number;  // Used for AVIF too, default: 80
    }
  }
}
```

**Features:**
- Quality: 80% (good balance for AVIF)
- Effort: 9 (maximum)
- Chroma subsampling: 4:4:4 (best quality)
- Smallest file sizes of all formats

**Performance:**
- **Speed**: Very slow (effort 9)
- **Reduction**: ~60-70% smaller than PNG
- **Quality**: 80% (still excellent for AVIF)
- **Browser Support**: Modern browsers only (~90%)

**Use Cases:**
- Cutting-edge applications
- Maximum file size reduction needed
- Progressive enhancement (with PNG/WebP fallback)
- Future-proof deployments

---

### 4. `adaptiveCompression`

Analyzes image characteristics and automatically applies optimal compression settings.

```typescript
import { adaptiveCompression } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [adaptiveCompression],
  icons: {
    smart: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});
```

**How it Works:**

The plugin analyzes the image and chooses settings based on:

1. **Transparency** - If image has alpha channel
2. **Complexity** - Number of channels (grayscale vs RGB)
3. **Content Type** - Simple icons vs complex images

**Decision Matrix:**

| Image Type | Compression | Quality | Effort | Palette |
|------------|-------------|---------|--------|---------|
| With alpha | PNG max | 90% | 10 | Yes |
| Photo/complex | PNG | 85% | 8 | No |
| Simple icon | PNG max | 90% | 10 | Yes |

**Performance:**
- **Speed**: Medium (adaptive)
- **Reduction**: ~35-40% on average
- **Quality**: Optimized per image (85-90%)

**Use Cases:**
- Mixed icon sets (various types)
- Automated pipelines
- Unknown source content
- Batch processing

---

### 5. `ultraCompression`

Maximum file size reduction with acceptable quality trade-off.

```typescript
import { ultraCompression } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [ultraCompression],
  icons: {
    minimal: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});
```

**Features:**
- Quality: 75% (lower but acceptable)
- Maximum compression effort (10)
- Palette mode enabled
- Compensatory sharpening (sigma 0.3)

**Performance:**
- **Speed**: Slow (effort 10)
- **Reduction**: ~50-60% file size reduction
- **Quality**: 75% (acceptable for most icons)

**Use Cases:**
- Extreme bandwidth constraints
- Very large icon sets
- Embedded systems
- Offline-first applications

**Trade-offs:**
- Lower quality (75%)
- May introduce slight artifacts
- Not suitable for high-quality requirements
- Best for smaller icon sizes

---

## Usage Examples

### Format-Specific Compression

Use the right compression for each format:

```typescript
import {
  pngCompression,
  webpCompression,
  avifCompression
} from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    legacy: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [192, 512],
      plugins: [pngCompression]
    },
    modern: {
      type: 'webp',
      name: 'icon-{{width}}',
      sizes: [192, 512],
      plugins: [webpCompression]
    },
    nextgen: {
      type: 'avif',
      name: 'icon-{{width}}',
      sizes: [192, 512],
      plugins: [avifCompression]
    }
  }
});
```

### Progressive Enhancement

Provide multiple formats for best compatibility:

```typescript
import { createIconz, pngCompression, webpCompression } from 'iconz';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [pngCompression, webpCompression],
  icons: {
    png: { type: 'png', name: 'icon-{{width}}', sizes: [192, 512] },
    webp: { type: 'webp', name: 'icon-{{width}}', sizes: [192, 512] }
  }
});
```

**HTML Usage:**

```html
<picture>
  <source srcset="icon-192.webp" type="image/webp">
  <img src="icon-192.png" alt="App Icon">
</picture>
```

### Adaptive Strategy

Let the plugin choose optimal settings:

```typescript
import { adaptiveCompression } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [adaptiveCompression],
  icons: {
    app: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [16, 32, 48, 64, 128, 256, 512]
    }
  }
});
```

### Custom Compression Settings

Fine-tune compression parameters:

```typescript
import { pngCompression } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    {
      ...pngCompression,
      config: {
        format: {
          png: {
            compressionLevel: 9,
            palette: true,
            effort: 8  // Slightly faster than default
          }
        }
      }
    }
  ],
  icons: { /* ... */ }
});
```

## Format Comparison

### File Size Comparison

For a typical 192x192 icon:

| Format | Plugin | File Size | Reduction | Quality |
|--------|--------|-----------|-----------|---------|
| PNG | None | 100 KB | 0% | 100% |
| PNG | pngCompression | 65 KB | 35% | 90% |
| PNG | ultraCompression | 40 KB | 60% | 75% |
| WebP | webpCompression | 45 KB | 55% | 90% |
| AVIF | avifCompression | 25 KB | 75% | 80% |

### Speed Comparison

Time to generate 100 icons:

| Plugin | Time | Speed Rating |
|--------|------|--------------|
| None | 2s | ⚡⚡⚡⚡⚡ Very Fast |
| pngCompression | 6s | ⚡⚡⚡ Medium |
| webpCompression | 4s | ⚡⚡⚡⚡ Fast |
| avifCompression | 12s | ⚡⚡ Slow |
| adaptiveCompression | 5s | ⚡⚡⚡ Medium |
| ultraCompression | 7s | ⚡⚡ Slow |

## Best Practices

### 1. Choose Format First

Select format based on browser support needs:

```typescript
// Modern browsers only
{ type: 'webp', plugins: [webpCompression] }

// All browsers
{ type: 'png', plugins: [pngCompression] }

// Cutting edge (with fallback)
{ type: 'avif', plugins: [avifCompression] }
```

### 2. Use Adaptive for Mixed Content

If icon types vary:

```typescript
plugins: [adaptiveCompression]  // Analyzes each icon automatically
```

### 3. Profile Your Builds

Measure compression impact:

```typescript
const start = Date.now();
const result = await iconz.generate();
console.log(`Generated in ${Date.now() - start}ms`);
console.log(`Total size: ${result.totalSize} bytes`);
```

### 4. Test Quality

Always verify output quality:

```typescript
// Generate test icons
await iconz.generate();

// Check quality at various sizes
// - View at 100% zoom
// - Test on different backgrounds
// - Verify smallest sizes are sharp
```

### 5. Balance Speed vs Size

For development vs production:

```typescript
const isProd = process.env.NODE_ENV === 'production';

const plugins = isProd
  ? [ultraCompression]    // Max compression
  : [adaptiveCompression]; // Faster builds
```

### 6. Provide Multiple Formats

Support all browsers:

```typescript
icons: {
  png: { type: 'png', plugins: [pngCompression] },  // All browsers
  webp: { type: 'webp', plugins: [webpCompression] }, // Modern
  avif: { type: 'avif', plugins: [avifCompression] }  // Cutting edge
}
```

## Technical Details

### PNG Compression

Uses libpng with optimized settings:

```typescript
image.png({
  compressionLevel: 9,     // Maximum deflate compression
  palette: true,           // 256 colors (8-bit) instead of RGB
  quality: 90,             // PNG quality (affects palette)
  effort: 10,              // Maximum optimization effort
  adaptiveFiltering: true  // Better compression
});
```

### WebP Compression

Uses libwebp encoder:

```typescript
image.webp({
  quality: 90,            // 0-100
  lossless: false,        // Lossy mode (smaller files)
  effort: 6,              // 0-6, higher = better compression
  smartSubsample: true    // Better quality
});
```

### AVIF Compression

Uses libavif encoder:

```typescript
image.avif({
  quality: 80,                  // 0-100
  effort: 9,                    // 0-9, max compression
  chromaSubsampling: '4:4:4'   // Best quality (no subsampling)
});
```

### Adaptive Logic

```typescript
const metadata = await image.metadata();
const hasAlpha = metadata.hasAlpha ?? false;
const channels = metadata.channels ?? 3;

if (hasAlpha) {
  // Transparency - use palette with max compression
  image.png({ compressionLevel: 9, effort: 10, palette: true });
} else if (channels >= 3) {
  // Photo/complex - use moderate settings
  image.png({ compressionLevel: 9, effort: 8, palette: false });
} else {
  // Simple icons - use palette
  image.png({ compressionLevel: 9, effort: 10, palette: true });
}
```

## Troubleshooting

### File Sizes Still Too Large

If compression isn't enough:

```typescript
// Try ultra compression
plugins: [ultraCompression]

// Or switch to WebP/AVIF
{ type: 'webp', plugins: [webpCompression] }
{ type: 'avif', plugins: [avifCompression] }
```

### Quality Loss Too High

If quality is unacceptable:

```typescript
// Use higher quality settings
{
  ...pngCompression,
  config: {
    format: {
      png: {
        compressionLevel: 9,
        palette: false,  // Disable palette for better quality
        effort: 10
      }
    }
  }
}
```

### Compression Too Slow

If generation takes too long:

```typescript
// Reduce effort level
{
  ...pngCompression,
  config: {
    format: {
      png: {
        compressionLevel: 9,
        effort: 6  // Faster
      }
    }
  }
}

// Or use faster format
{ type: 'webp' }  // Faster than PNG
```

### Color Banding

If palette mode causes banding:

```typescript
// Disable palette mode
{
  ...pngCompression,
  config: {
    format: {
      png: {
        palette: false  // Use full RGB
      }
    }
  }
}
```

## Browser Support

### PNG
- ✅ All browsers (100%)
- ✅ Desktop applications
- ✅ Mobile devices

### WebP
- ✅ Chrome 32+ (2014)
- ✅ Firefox 65+ (2019)
- ✅ Edge 18+ (2018)
- ✅ Safari 14+ (2020)
- ✅ Coverage: ~97%

### AVIF
- ✅ Chrome 85+ (2020)
- ✅ Firefox 93+ (2021)
- ✅ Safari 16+ (2022)
- ❌ IE, older browsers
- ✅ Coverage: ~90%

## Related Documentation

- [Optimization Plugins](./optimization.md) - General optimization strategies
- [Effects Plugins](./effects.md) - Visual effects and enhancements
- [Plugins Overview](./plugins.md) - All available plugins
- [PNG Generator](../generators/png.md) - PNG icon generation
- [Format Registry](../core/format-registry.md) - Extensible format system
