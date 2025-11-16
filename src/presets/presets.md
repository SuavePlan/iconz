# Presets Module

Modern icon presets for all major platforms based on 2024-2025 specifications.

## Available Presets

### Mobile Platforms

#### iOS
- **`iosPreset`** - Complete iOS app icons (iPhone, iPad, App Store)
- **`iosMarketingPreset`** - Marketing and promotional sizes

#### Android
- **`androidPreset`** - Complete Android app icons (all densities)
- **`androidAdaptivePreset`** - Adaptive icons with safe zone

### Web

#### PWA (Progressive Web Apps)
- **`pwaPreset`** - Standard PWA icons
- **`pwaMaskablePreset`** - Maskable icons for Android
- **`pwaCompletePreset`** - Complete set (any + maskable + favicons)

### Desktop

#### Windows
- **`windows11Preset`** - Windows 11 with Fluent Design
- **`windowsLegacyPreset`** - Windows 7/8/10 compatibility
- **`windowsUniversalPreset`** - All Windows versions

#### macOS
- **`macosPreset`** - macOS 11+ with Retina support
- **`macosDocumentPreset`** - Document type icons
- **`macosAssetCatalogPreset`** - Xcode asset catalog format

#### Electron
- **`electronPreset`** - Cross-platform Electron icons (Windows, macOS, Linux)
- **`electronBuilderPreset`** - Optimized for electron-builder packaging
- **`electronForgePreset`** - Optimized for Electron Forge packaging

See [Electron Presets Documentation](./electron.md) for detailed usage and configuration.

### Browser Extensions

#### Chrome / Edge / Firefox
- **`chromeExtensionPreset`** - Basic Chrome/Edge extension icons (Manifest V3)
- **`chromeExtensionCompletePreset`** - Complete Chrome extension icon set with actions
- **`edgeExtensionPreset`** - Microsoft Edge Add-on icons
- **`firefoxExtensionPreset`** - Firefox Add-on icons
- **`universalExtensionPreset`** - Cross-browser compatible icon set

See [Browser Extension Presets Documentation](./chrome-extension.md) for detailed usage and platform requirements.

## Usage

### Using a Preset

```typescript
import { iosPreset } from 'iconz/presets';
import { Iconz } from 'iconz';

const iconz = new Iconz({
  input: './logo.svg',
  output: './icons',
  ...iosPreset
});

await iconz.generate();
```

### Get Preset by Name

```typescript
import { getPreset } from 'iconz/presets';

const preset = getPreset('ios');
if (preset) {
  console.log(preset.description);
}
```

### List All Presets

```typescript
import { listPresets } from 'iconz/presets';

const names = listPresets();
console.log('Available presets:', names);
```

### Combine Multiple Presets

```typescript
import { iosPreset, androidPreset } from 'iconz/presets';

const iconz = new Iconz({
  input: './logo.svg',
  output: './icons',
  icons: {
    ...iosPreset.icons,
    ...androidPreset.icons
  }
});
```

### Customize a Preset

```typescript
import { pwaPreset } from 'iconz/presets';

const customPreset = {
  ...pwaPreset,
  icons: {
    ...pwaPreset.icons,
    standard: {
      ...pwaPreset.icons.standard,
      sizes: [512, 192] // Only generate essential sizes
    }
  }
};
```

## Platform-Specific Notes

### iOS (2024-2025)
- Apple unified 1024px template for all platforms
- New "liquid glass" effect encouraged
- Supports depth, translucency, and materials
- Single asset catalog for iOS, iPadOS, macOS

### Android (2024-2025)
- Adaptive icons required for modern apps
- 40% safe zone radius from center
- Monochrome icon support for themed icons
- Play Store requires 512x512 PNG

### PWA (2024-2025)
- 192x192 and 512x512 minimum for installability
- Maskable icons for better Android integration
- Separate "any" and "maskable" purposes recommended
- macOS Sonoma+ uses maskable icons

### Windows 11 (2024-2025)
- Fluent Design System compatibility
- 256x256 for high-DPI displays
- Rounded corners and depth encouraged
- Segoe Fluent Icons font system

### macOS 11+ (2024-2025)
- "Liquid glass" effect with depth
- Asset catalogs preferred format
- Retina (@2x) support required
- 1024x1024 source recommended

## Related Documentation

### Platform-Specific Presets
- [Electron Presets](./electron.md) - Desktop application icons for Electron
- [Browser Extension Presets](./chrome-extension.md) - Chrome, Edge, Firefox extension icons

### Core Modules
- [Iconz Core](../core/iconz.md) - Main icon generation API
- [Batch Processing](../utils/batch.md) - Generate icons from multiple sources
- [Format Registry](../core/format-registry.md) - Extensible format system

### Generators
- [PNG Generator](../generators/png.md) - PNG, WebP, AVIF icons
- [ICO Generator](../generators/ico.md) - Windows ICO format
- [ICNS Generator](../generators/icns.md) - macOS ICNS format
- [SVG Generator](../generators/svg.md) - Scalable vector graphics

### Plugins
- [Plugins Overview](../plugins/plugins.md) - All available plugins
- [Optimization Plugins](../plugins/optimization.md) - File size optimization
- [Compression Plugins](../plugins/compression.md) - Format-specific compression
- [Effects Plugins](../plugins/effects.md) - Visual effects and enhancements
