# Iconz 2.0 - Modern Icon Generator

> 🎨 Generate icons for iOS, Android, PWA, Windows, and macOS from a single source image

[![npm version](https://img.shields.io/npm/v/iconz.svg)](https://www.npmjs.com/package/iconz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Modern Stack** - Built with Bun, TypeScript, and Sharp
- 📱 **All Platforms** - iOS, Android, PWA, Windows, macOS, Electron, Browser Extensions
- 🎯 **2024-2025 Specs** - Latest icon requirements for all platforms
- 🔄 **Batch Processing** - Generate icons from multiple sources in parallel
- 🎨 **SVG Support** - Enhanced SVG generation with optimization options
- 🔧 **Fully Modular** - Clean architecture with <250 lines per file
- 🎨 **Fully Extensible** - Add custom formats, presets, plugins with TypeScript declaration merging
- ⚡ **Blazing Fast** - Powered by Bun and Sharp
- 🔌 **Plugin System** - Built-in optimization/compression plugins
- 📦 **Zero Config** - Auto-detect config files and project type
- 🎁 **Simplified API** - `quick` helpers and fluent config builder
- 🗜️ **Image Optimization** - Built-in compression plugins (30-50% smaller files)

## 📦 Installation

```bash
# With npm
npm install iconz

# With Bun (recommended)
bun add iconz

# Global CLI
npm install -g iconz
```

## 🚀 Quick Start

### Automatic Configuration

Just run `iconz` to auto-detect your config file:

```bash
# Create .iconz.ts
echo 'import { quick } from "iconz"; export default quick.pwa("./logo.svg");' > .iconz.ts

# Generate icons automatically
iconz
```

### CLI

```bash
# Auto-detect config file (.iconz.{ts,js,json})
iconz

# Generate PWA icons
iconz -i logo.svg -o ./public -p pwa

# Generate icons for all platforms
iconz -i logo.svg -p ios,android,pwa,windows,macos

# Use specific config file
iconz -c ./.iconz.js
```

### Simplified API (Recommended)

```typescript
import { quick } from 'iconz';

// One-liner for PWA
const config = quick.pwa('./logo.svg', './public');

// Auto-detect project type
const config = quick.auto('./logo.svg');

// All platforms
const config = quick.all('./logo.svg');

// Generate
import { createIconz } from 'iconz';
const iconz = createIconz(config);
await iconz.generate();
```

### Config Builder API

```typescript
import { createConfig } from 'iconz';

const config = createConfig('./logo.svg')
  .to('./public')
  .use('pwa', 'ios')
  .highQuality()
  .build();

// With auto-detection
const config = createConfig('./logo.svg')
  .autoDetect()
  .balanced()
  .build();
```

### Typed Platform Configs

Get full TypeScript IntelliSense and validation for platform-specific configs:

```typescript
import { createIconz, type IconzConfig } from 'iconz';

// PWA config with type safety
const config: IconzConfig.PWA = {
  input: './logo.svg',
  output: './public',
  icons: {
    standard: { type: 'png', name: 'icon-{{dims}}', sizes: [192, 512] },
    maskable: { type: 'png', name: 'maskable-{{dims}}', sizes: [192, 512] },
    favicon: { type: 'ico', name: 'favicon', sizes: [16, 32, 48] }
    // TypeScript will show you valid icon names!
  }
};

// Other platform types:
// IconzConfig.iOS, IconzConfig.Android,
// IconzConfig.Windows, IconzConfig.MacOS
```

### Traditional API

```typescript
import { createIconz } from 'iconz';
import { pwaPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './logo.svg',
  output: './public',
  ...pwaPreset
});

const report = await iconz.generate();
console.log(`Generated ${report.stats.success} icons!`);
```

## 🎯 Platform Support

### 📱 Mobile

#### iOS (2024-2025)
- App Store (1024x1024)
- iPhone icons (180x180, 120x120, etc.)
- iPad icons (167x167, 152x152, etc.)
- Supports new "liquid glass" effect

```typescript
import { iosPreset } from 'iconz/presets';
```

#### Android (2024-2025)
- Play Store (512x512)
- Adaptive icons with safe zone
- All density buckets (mdpi through xxxhdpi)
- Monochrome icon support

```typescript
import { androidPreset } from 'iconz/presets';
```

### 🌐 Web

#### PWA (Progressive Web Apps)
- Manifest icons (192x192, 512x512)
- Maskable icons with 40% safe zone
- Favicons (ICO format)
- Apple touch icons

```typescript
import { pwaCompletePreset } from 'iconz/presets';
```

### 💻 Desktop

#### Windows 11
- ICO files with multiple sizes
- Fluent Design compatible
- High-DPI support (256x256)
- Tile icons

```typescript
import { windows11Preset } from 'iconz/presets';
```

#### macOS
- ICNS files with Retina support
- macOS 11+ optimized
- Asset catalog format
- Document icons

```typescript
import { macosPreset } from 'iconz/presets';
```

#### Electron
- Complete cross-platform desktop app icons
- Windows ICO, macOS ICNS, Linux PNG
- Electron Builder and Electron Forge support
- All required sizes for packaging

```typescript
import { electronPreset, electronBuilderPreset, electronForgePreset } from 'iconz/presets';
```

### 🔌 Browser Extensions

#### Chrome/Edge Extensions
- Manifest V3 compliant
- All required icon sizes (16, 32, 48, 128)
- Action icons and Web Store assets
- Universal browser extension support

```typescript
import {
  chromeExtensionPreset,
  edgeExtensionPreset,
  firefoxExtensionPreset,
  universalExtensionPreset
} from 'iconz/presets';
```

## 📝 Configuration

### Using Presets

```typescript
import { createIconz } from 'iconz';
import { pwaCompletePreset, iosPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    ...pwaCompletePreset.icons,
    ...iosPreset.icons
  }
});
```

### Custom Configuration

```typescript
const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    pwaIcons: {
      type: 'png',
      name: 'icon-{{dims}}',
      sizes: [192, 512],
      folder: 'pwa'
    },
    favicon: {
      type: 'ico',
      name: 'favicon',
      sizes: [16, 32, 48]
    },
    appIcon: {
      type: 'icns',
      name: 'AppIcon',
      sizes: [16, 32, 64, 128, 256, 512, 1024]
    }
  },
  options: {
    quality: 95,
    resize: {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'lanczos3'
    }
  }
});
```

### Config Files

Iconz automatically detects config files in your project root:

**Supported files (in order of precedence):**
- `.iconz.ts` (TypeScript, recommended)
- `.iconz.js` (JavaScript)
- `.iconz.mjs` (ESM)
- `.iconz.json` (JSON)
- `.iconzrc.json` (JSON, legacy)
- `.iconzrc` (JSON, legacy)

#### TypeScript Config (Recommended)

Create `.iconz.ts`:

```typescript
import { quick } from 'iconz';

// Simple one-liner
export default quick.pwa('./logo.svg', './public');
```

Or with the config builder:

```typescript
import { createConfig, aggressiveOptimization } from 'iconz';

export default createConfig('./logo.svg')
  .to('./public')
  .use('pwa', 'ios')
  .highQuality()
  .build();
```

#### JavaScript Config

Create `.iconz.js`:

```javascript
import { quick, aggressiveOptimization } from 'iconz';

export default {
  ...quick.pwa('./logo.svg', './public'),
  plugins: [aggressiveOptimization]
};
```

#### JSON Config

Create `.iconz.json`:

```json
{
  "input": "./logo.svg",
  "output": "./public",
  "icons": {
    "pwaIcons": {
      "type": "png",
      "name": "icon-{{dims}}",
      "sizes": [192, 512]
    },
    "favicon": {
      "type": "ico",
      "name": "favicon",
      "sizes": [16, 32, 48]
    }
  }
}
```

#### Auto-Generation

Once you have a config file, just run:

```bash
# Auto-detects and uses your config
iconz

# Or specify a config file
iconz -c ./.iconz.js
```

## 🚀 Batch Processing

Process multiple icon sources in parallel for maximum performance:

```typescript
import { processBatch, quick } from 'iconz';

// Process multiple sources at once
const result = await processBatch({
  sources: [
    quick.pwa('./logo-light.svg', './public/light'),
    quick.pwa('./logo-dark.svg', './public/dark'),
    quick.ios('./app-icon.svg', './assets'),
  ],
  parallel: true,      // Run in parallel (default)
  concurrency: 4       // Max concurrent operations
});

console.log(`Generated ${result.stats.totalIcons} icons from ${result.stats.totalSources} sources`);
```

### Batch Same Config

Process multiple inputs with the same configuration:

```typescript
import { processSameSources } from 'iconz';

const result = await processSameSources({
  inputs: ['./logo-light.svg', './logo-dark.svg', './logo-color.svg'],
  output: './public',
  icons: {
    pwa: { type: 'png', name: 'icon-{{dims}}', sizes: [192, 512] }
  }
});
```

### Batch Builder

Create batches with a fluent API:

```typescript
import { createBatch, processBatch, quick } from 'iconz';

const batch = createBatch(
  quick.pwa('./logo.svg'),
  quick.ios('./logo.svg'),
  quick.android('./logo.svg')
);

const result = await processBatch(batch);
```

## 🔌 Plugins

### Built-in Plugins

#### Optimization Plugins

Reduce file sizes while maintaining quality:

```typescript
import { createIconz, aggressiveOptimization, fastOptimization } from 'iconz';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [aggressiveOptimization], // ~40% smaller files
  icons: { /* ... */ }
});
```

**Available optimization plugins:**
- `optimizationPlugin` - Balanced optimization (default: 90% quality)
- `aggressiveOptimization` - Maximum optimization (~40% reduction, slower)
- `fastOptimization` - Quick optimization (~20% reduction, fast)

#### Compression Plugins

Format-specific compression strategies:

```typescript
import { adaptiveCompression, pngCompression, webpCompression } from 'iconz';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [adaptiveCompression], // Auto-chooses best compression
  icons: { /* ... */ }
});
```

**Available compression plugins:**
- `adaptiveCompression` - Auto-selects best settings based on image
- `pngCompression` - PNG-specific with palette optimization
- `webpCompression` - Better compression than PNG
- `avifCompression` - Best compression (newest format)
- `ultraCompression` - Maximum file size reduction (~50% smaller, lower quality)

#### Effects Plugins

Add visual effects to your icons:

```typescript
import {
  createWatermarkPlugin,
  createShadowPlugin,
  createBorderPlugin,
  createEnhancementPlugin
} from 'iconz';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    createEnhancementPlugin({ sharpness: 1, contrast: 5 }),
    createWatermarkPlugin({ image: './wm.png', opacity: 0.3 }),
    createBorderPlugin({ width: 2, radius: 10 })
  ],
  icons: { /* ... */ }
});
```

**Available effects plugins:**
- `createWatermarkPlugin(config)` - Add watermarks
- `createShadowPlugin(config)` - Drop shadows
- `createBorderPlugin(config)` - Borders and rounded corners
- `createEnhancementPlugin(config)` - Adjust brightness, contrast, saturation, sharpness

#### Plugin Combinations

Combine multiple plugins for optimal results:

```typescript
import {
  createEnhancementPlugin,
  adaptiveCompression,
  aggressiveOptimization
} from 'iconz';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    createEnhancementPlugin({ sharpness: 1 }), // Enhance first
    aggressiveOptimization,                     // Then optimize
    adaptiveCompression                          // Then compress
  ],
  icons: { /* ... */ }
});
```

**Pro tip:** Apply enhancements before compression for best results.

### Custom Plugins

Create your own plugins:

```typescript
import type { Plugin } from 'iconz/types/types';

const customPlugin: Plugin = {
  name: 'custom-plugin',
  version: '1.0.0',

  setup: async () => {
    // Initialize resources
  },

  execute: async ({ image, config, buffer }) => {
    // Modify the image
    image.modulate({ brightness: 1.1 });
    return image;
  },

  teardown: async () => {
    // Cleanup resources
  }
};

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [customPlugin],
  icons: { /* ... */ }
});
```

## 📖 API Reference

### `createIconz(config)`

Create a new Iconz instance.

```typescript
const iconz = createIconz({
  input: string | Buffer,      // Input image
  output: string,              // Output directory
  icons?: IconConfig[],        // Icon configurations
  options?: ProcessingOptions, // Sharp options
  plugins?: Plugin[],          // Custom plugins
  cleanTemp?: boolean          // Clean temp files (default: true)
});
```

### `iconz.generate()`

Generate all configured icons.

```typescript
const report = await iconz.generate();

// Returns:
{
  icons: Record<string, GeneratedIcon[]>,
  failed: Array<{ config: string, error: string }>,
  temp: string[],
  stats: {
    total: number,
    success: number,
    failed: number,
    duration: number
  }
}
```

## 🎨 Supported Formats

### Raster Formats
- **PNG** - Lossless compression, transparency support
- **JPEG** - Lossy compression for photos
- **WebP** - Modern format, better compression than PNG
- **AVIF** - Newest format, best compression

### Icon Formats
- **ICO** - Windows icons (multiple sizes in one file)
- **ICNS** - macOS icons with Retina support

### Vector Format
- **SVG** - Scalable vector graphics with optimization options

```typescript
const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    svg: {
      type: 'svg',
      name: 'icon-{{dims}}',
      sizes: [24, 48, 64],
      options: {
        pretty: true,              // Pretty print with indentation
        removeXmlDeclaration: false, // Keep XML declaration
        addDimensions: true,       // Add width/height attributes
        viewBox: '0 0 100 100'     // Custom viewBox
      }
    }
  }
});
```

## 🎨 Template Variables

Use template variables in icon names:

- `{{width}}` - Icon width
- `{{height}}` - Icon height
- `{{dims}}` - Dimensions (e.g., "192x192")
- `{{size}}` - Original size spec
- `{{counter}}` - Incremental counter
- `{{date.year}}`, `{{date.month}}`, etc.
- `{{env.*}}` - Environment variables

Example:

```typescript
{
  name: 'icon-{{dims}}-{{date.year}}{{date.month}}{{date.day}}',
  // Produces: icon-192x192-20241013.png
}
```

## 🏗️ Architecture

Iconz 2.0 is built with modern best practices:

- **Modular Design** - Each file <250 lines
- **TypeScript Generics** - Type-safe configurations
- **Plugin System** - Extensible architecture
- **Bun-First** - Optimized for Bun runtime
- **Zero Dependencies** - Only Sharp for image processing

### Project Structure

```
src/
├── types/          # TypeScript types and interfaces
├── core/           # Core engine, processor, and format registry
├── generators/     # Format-specific generators (PNG, ICO, ICNS, SVG)
├── presets/        # Platform presets (iOS, Android, PWA, Electron, Chrome, etc.)
├── plugins/        # Built-in plugins (optimization, compression, effects)
├── utils/          # Utilities (paths, templates, batch processing, config loader)
└── cli/            # Command-line interface
```

## 🔧 Extensibility

Iconz 2.0 is fully extensible via TypeScript declaration merging:

### Add Custom Formats

```typescript
// 1. Define your format options
interface PdfOptions {
  pageSize: 'A4' | 'letter';
  dpi?: number;
}

// 2. Extend the registry
declare module 'iconz/types' {
  interface IconFormatRegistry {
    pdf: PdfOptions;
  }
}

// 3. Register runtime handlers
import {  registerFormatGenerator, registerFormatConverter } from 'iconz';

registerFormatGenerator('pdf', async (buffers, config, options) => {
  // Your PDF generation logic
  return generatedIcons;
});

// 4. Use with full type safety!
const config: IconConfig<'pdf'> = {
  type: 'pdf', // ✓ TypeScript knows this is valid
  name: 'icon',
  sizes: [512],
  options: { pageSize: 'A4', dpi: 300 } // ✓ Autocomplete works!
};
```

### Add Custom Presets

```typescript
// 1. Define your preset
const gamingPreset: Preset = {
  name: 'gaming',
  description: 'Gaming platform icons',
  icons: {
    steam: { type: 'png', name: 'steam-{{dims}}', sizes: [32, 64, 128] },
    discord: { type: 'png', name: 'discord-{{dims}}', sizes: [48, 96] }
  }
};

// 2. Extend the registry
declare module 'iconz/types' {
  interface PresetRegistry {
    gaming: typeof gamingPreset;
  }
}

// 3. Register it
import { registerPreset } from 'iconz';
registerPreset('gaming', gamingPreset);

// 4. Use with autocomplete!
createConfig('./logo.svg').use('gaming').build(); // ✓ TypeScript knows 'gaming' exists
```

## 🧪 Testing

```bash
# Run tests
bun test

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📄 License

MIT © [SuavePlan](https://github.com/SuavePlan)

## 🔗 Links

- [Documentation](https://github.com/SuavePlan/iconz#readme)
- [Changelog](CHANGELOG.md)
- [Issues](https://github.com/SuavePlan/iconz/issues)

## 🙏 Credits

Built with:
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Biome](https://biomejs.dev/) - Fast formatter and linter

---

Made with ❤️ by [SuavePlan](https://github.com/SuavePlan)
