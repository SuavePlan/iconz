# Iconz Core Module

Main icon generation engine that coordinates all components and provides a clean API.

## Features

- **Unified API** - Single entry point for all icon generation
- **Type-safe** - Generic configuration with TypeScript support
- **Plugin system** - Extend functionality with custom plugins
- **Progress tracking** - Detailed generation reports
- **Error handling** - Graceful error handling with detailed messages
- **Automatic cleanup** - Temporary files cleaned up automatically

## Usage

### Basic Usage

```typescript
import { createIconz } from 'iconz';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    favicon: {
      type: 'ico',
      name: 'favicon',
      sizes: [16, 32, 48]
    }
  }
});

const report = await iconz.generate();
console.log(`Generated ${report.stats.success} icons`);
```

### Using Presets

```typescript
import { createIconz } from 'iconz';
import { pwaPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './logo.svg',
  output: './public',
  ...pwaPreset
});

await iconz.generate();
```

### With Plugins

```typescript
const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [watermarkPlugin, optimizePlugin],
  icons: {
    // ... icon configs
  }
});
```

### With Buffer Input

```typescript
const imageBuffer = await readFile('./logo.png');

const iconz = createIconz({
  input: imageBuffer,
  output: './icons',
  icons: {
    // ... icon configs
  }
});
```

## Configuration

### IconzConfig

```typescript
interface IconzConfig {
  input: string | Buffer;        // Input image path or buffer
  output: string;                // Output directory
  temp?: string;                 // Temporary directory (optional)
  icons?: Record<string, IconConfig>; // Icon configurations
  options?: ProcessingOptions;   // Processing options
  plugins?: Plugin[];            // Plugins to apply
  cleanTemp?: boolean;           // Clean temp files (default: true)
}
```

### Processing Options

```typescript
{
  options: {
    format: 'png',
    quality: 95,
    resize: {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'lanczos3'
    }
  }
}
```

## Generation Report

The `generate()` method returns a detailed report:

```typescript
interface GenerationReport {
  icons: Record<string, GeneratedIcon[]>;  // Generated icons by config name
  failed: Array<{
    config: string;
    error: string;
    size?: IconSize;
  }>;
  temp: string[];                          // Temporary directories
  stats: {
    total: number;                         // Total icons to generate
    success: number;                       // Successfully generated
    failed: number;                        // Failed to generate
    duration: number;                      // Generation time (ms)
  };
}
```

### Example Report

```typescript
const report = await iconz.generate();

console.log(`
  Total: ${report.stats.total}
  Success: ${report.stats.success}
  Failed: ${report.stats.failed}
  Duration: ${report.stats.duration}ms
`);

// List all generated icons
for (const [name, icons] of Object.entries(report.icons)) {
  console.log(`${name}:`);
  for (const icon of icons) {
    console.log(`  - ${icon.path} (${icon.dimensions.width}x${icon.dimensions.height})`);
  }
}

// List failures
for (const failure of report.failed) {
  console.error(`Failed ${failure.config}: ${failure.error}`);
}
```

## Error Handling

```typescript
try {
  const report = await iconz.generate();

  if (report.stats.failed > 0) {
    console.warn('Some icons failed to generate');
    for (const failure of report.failed) {
      console.error(`- ${failure.config}: ${failure.error}`);
    }
  }
} catch (error) {
  console.error('Generation failed:', error.message);
}
```

## Advanced Usage

### Multiple Platforms

```typescript
import { iosPreset, androidPreset, pwaPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    ...iosPreset.icons,
    ...androidPreset.icons,
    ...pwaPreset.icons
  }
});
```

### Custom Configuration

```typescript
const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    customIcon: {
      type: 'png',
      name: 'custom-{{width}}x{{height}}-{{counter}}',
      sizes: [64, 128, 256],
      folder: 'custom',
      options: {
        compressionLevel: 9,
        quality: 100
      }
    }
  },
  options: {
    quality: 95,
    resize: {
      kernel: 'lanczos3',
      fit: 'cover'
    }
  }
});
```

## Related Documentation

### Core Modules
- [Processor](./processor.md) - Image processing pipeline
- [Format Registry](./format-registry.md) - Extensible format system
- [Built-in Formats](./builtin-formats.md) - All registered formats

### Utilities
- [Batch Processing](../utils/batch.md) - Generate icons from multiple sources
- [Config Loader](../utils/config-loader.md) - Load configuration from files
- [Template System](../utils/template.md) - Filename templating

### Presets
- [Presets Overview](../presets/presets.md) - All platform presets
- [Electron Presets](../presets/electron.md) - Desktop application icons
- [Browser Extension Presets](../presets/chrome-extension.md) - Extension icons

### Plugins
- [Plugins Overview](../plugins/plugins.md) - All available plugins
- [Optimization Plugins](../plugins/optimization.md) - File size optimization
- [Compression Plugins](../plugins/compression.md) - Format-specific compression
- [Effects Plugins](../plugins/effects.md) - Visual effects and enhancements
