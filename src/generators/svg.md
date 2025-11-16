# SVG Generator

Generate and optimize SVG (Scalable Vector Graphics) icons with enhanced control over output formatting.

## Features

- **Vector Graphics** - Resolution-independent icons
- **Format Control** - Pretty printing, XML declarations, dimensions
- **ViewBox Management** - Custom or automatic viewBox generation
- **Size Flexibility** - Any size works (vector format)
- **Basic Optimization** - Simple formatting improvements

## API

### `generateSvgIcons(buffers, config, options)`

Generate SVG files from processed buffers.

**Parameters:**
- `buffers: Map<IconSize, Buffer>` - Processed image buffers
- `config: IconConfig<'svg'>` - SVG icon configuration
- `options: SvgGeneratorOptions` - Generation options

**Returns:** `Promise<GeneratedIcon[]>`

**Example:**
```typescript
import { generateSvgIcons } from 'iconz/generators';

const icons = await generateSvgIcons(
  buffers,
  {
    type: 'svg',
    name: 'icon-{{dims}}',
    sizes: [24, 48, 64],
    options: {
      pretty: true,
      addDimensions: true
    }
  },
  { outputDir: './icons' }
);
```

## Configuration Options

### SVG Options

```typescript
interface SvgOptions {
  /** Pretty print SVG with indentation (default: false) */
  pretty?: boolean;

  /** Remove XML declaration (default: false) */
  removeXmlDeclaration?: boolean;

  /** Add width/height attributes (default: true) */
  addDimensions?: boolean;

  /** Custom viewBox (overrides size-based viewBox) */
  viewBox?: string;
}
```

### Option Details

#### `pretty: boolean`
Format SVG with indentation for readability.

```typescript
// Compact (default)
<svg><path d="..."/></svg>

// Pretty printed
<svg>
  <path d="..."/>
</svg>
```

#### `removeXmlDeclaration: boolean`
Remove the XML declaration from the output.

```typescript
// With declaration (default)
<?xml version="1.0" encoding="UTF-8"?>
<svg>...</svg>

// Without declaration
<svg>...</svg>
```

#### `addDimensions: boolean`
Add or update width/height attributes.

```typescript
// With dimensions (default)
<svg width="64" height="64">...</svg>

// Without dimensions
<svg>...</svg>
```

#### `viewBox: string`
Specify a custom viewBox or let it auto-generate.

```typescript
// Auto-generated (default)
<svg viewBox="0 0 64 64">...</svg>

// Custom viewBox
<svg viewBox="0 0 100 100">...</svg>
```

## Usage Examples

### Basic SVG Generation

Generate simple SVG icons:

```typescript
import { createIconz } from 'iconz';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    svg: {
      type: 'svg',
      name: 'icon-{{width}}',
      sizes: [24, 48, 64, 128]
    }
  }
});

await iconz.generate();
```

### Pretty Printed SVG

Generate human-readable SVG files:

```typescript
const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    svg: {
      type: 'svg',
      name: 'icon-{{dims}}',
      sizes: [24, 48],
      options: {
        pretty: true,              // Format with indentation
        removeXmlDeclaration: true // Clean output for web
      }
    }
  }
});
```

### Custom ViewBox

Control the coordinate system:

```typescript
const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    svg: {
      type: 'svg',
      name: 'icon',
      sizes: [64],
      options: {
        viewBox: '0 0 100 100',    // Normalized coordinate system
        addDimensions: true
      }
    }
  }
});
```

### Web-Optimized SVG

Generate SVG optimized for web use:

```typescript
const iconz = createIconz({
  input: './logo.svg',
  output: './public',
  icons: {
    webIcons: {
      type: 'svg',
      name: 'icon-{{width}}',
      sizes: [16, 24, 32, 48],
      options: {
        pretty: false,              // Compact for smaller file size
        removeXmlDeclaration: true, // Not needed in HTML
        addDimensions: true,        // Better browser compatibility
        viewBox: '0 0 24 24'       // Consistent coordinate system
      }
    }
  }
});
```

## Helper Functions

### `validateSvgSizes(sizes)`

Validate SVG icon sizes (always returns true since SVG is scalable).

```typescript
import { validateSvgSizes } from 'iconz/generators';

const isValid = validateSvgSizes([24, 48, 64]);
// Returns: true (all sizes are valid for SVG)
```

### `getRecommendedSvgSizes(useCase)`

Get recommended sizes for different use cases.

```typescript
import { getRecommendedSvgSizes } from 'iconz/generators';

// Web icons
const webSizes = getRecommendedSvgSizes('web');
// Returns: [24, 32, 48, 64]

// Print icons
const printSizes = getRecommendedSvgSizes('print');
// Returns: [512, 1024, 2048]

// Standard icons
const iconSizes = getRecommendedSvgSizes('icon');
// Returns: [16, 24, 32, 48, 64, 128, 256]
```

### `isSvgBuffer(buffer)`

Check if a buffer contains SVG content.

```typescript
import { isSvgBuffer } from 'iconz/generators';

const buffer = await readFile('./icon.svg');
if (isSvgBuffer(buffer)) {
  console.log('This is an SVG file');
}
```

## Limitations

### Current Implementation

The SVG generator provides **basic formatting** with these limitations:

1. **Simple Parsing** - Uses regex-based manipulation (not a full SVG parser)
2. **No Optimization** - Doesn't remove unnecessary elements or optimize paths
3. **No Minification** - Doesn't compress the SVG structure
4. **Format Assumption** - Expects well-formed SVG input

### For Advanced Optimization

For production use with advanced optimization, consider external tools:

- **[SVGO](https://github.com/svg/svgo)** - Full-featured SVG optimizer
- **[svgcleaner](https://github.com/RazrFalcon/svgcleaner)** - Clean and optimize SVG
- **[Prettier](https://prettier.io/)** - Professional pretty-printing

### Integration Example

Use SVGO with Iconz for optimal results:

```typescript
import { SVGO } from 'svgo';
import { createIconz } from 'iconz';

// 1. Generate SVG with Iconz
const iconz = createIconz({
  input: './logo.svg',
  output: './temp',
  icons: {
    svg: { type: 'svg', name: 'icon', sizes: [64] }
  }
});

await iconz.generate();

// 2. Optimize with SVGO
const svgo = new SVGO({
  plugins: ['removeDoctype', 'removeComments', 'cleanupIds']
});

const result = await svgo.optimize(svg);
await writeFile('./icons/icon.svg', result.data);
```

## Use Cases

### ✅ Good For
- Icon libraries with consistent sizes
- Web icon sets
- Simple formatting needs
- Batch SVG processing
- Maintaining vector format through pipeline

### ❌ Not Ideal For
- Heavy SVG optimization (use SVGO)
- Complex SVG manipulation (use dedicated libraries)
- SVG-to-raster conversion (use PNG generator)
- Path optimization (use SVGO or svgcleaner)

## Performance

SVG generation is **very fast** because:
- String-based operations
- No image encoding required
- Minimal processing overhead
- Direct file writes

Typical performance:
- 100 SVG icons: ~50-100ms
- 1000 SVG icons: ~500ms-1s

## Related Documentation

- [PNG Generator](./png.md) - Raster format generation
- [ICO Generator](./ico.md) - Windows icon format
- [ICNS Generator](./icns.md) - macOS icon format
- [Format Registry](../core/format-registry.md) - Extensible format system
