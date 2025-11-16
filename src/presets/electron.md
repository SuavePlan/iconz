# Electron Presets

Icon configurations for Electron desktop applications supporting Windows, macOS, and Linux.

## Overview

Electron applications require platform-specific icon formats:
- **Windows**: ICO format with multiple sizes
- **macOS**: ICNS format with Retina support
- **Linux**: PNG format (typically 512x512)

## Available Presets

### 1. `electronPreset`

Basic cross-platform Electron application icons.

```typescript
import { electronPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './app-icon.svg',
  output: './build',
  ...electronPreset
});
```

**Output Structure:**
```
build/
├── icon.ico          (Windows: 16, 24, 32, 48, 64, 128, 256)
├── icon.icns         (macOS: 16-1024 with Retina)
└── icon.png          (Linux: 512x512)
```

**Sizes:**
- Windows ICO: 16, 24, 32, 48, 64, 128, 256
- macOS ICNS: 16, 32, 64, 128, 256, 512, 1024
- Linux PNG: 512

---

### 2. `electronBuilderPreset`

Optimized for [electron-builder](https://www.electron.build/) packaging.

```typescript
import { electronBuilderPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './app-icon.svg',
  output: '.',  // Project root
  ...electronBuilderPreset
});
```

**Output Structure:**
```
build/
├── icon.ico                 (Windows)
├── icon.icns                (macOS)
└── icons/
    ├── 512x512.png         (Linux)
    ├── 256x256.png         (Linux)
    └── 128x128.png         (Linux)
```

**Features:**
- Multiple Linux PNG sizes (512, 256, 128)
- Matches electron-builder expectations
- Proper folder structure

**electron-builder Configuration:**
```json
{
  "build": {
    "appId": "com.example.app",
    "mac": {
      "icon": "build/icon.icns"
    },
    "win": {
      "icon": "build/icon.ico"
    },
    "linux": {
      "icon": "build/icons"
    }
  }
}
```

---

### 3. `electronForgePreset`

Optimized for [Electron Forge](https://www.electronforge.io/) packaging.

```typescript
import { electronForgePreset } from 'iconz/presets';

const iconz = createIconz({
  input: './app-icon.svg',
  output: './assets',
  ...electronForgePreset
});
```

**Output Structure:**
```
assets/
├── icon.ico          (Windows)
├── icon.icns         (macOS)
└── icon.png          (Linux: 512x512)
```

**Electron Forge Configuration:**
```json
{
  "config": {
    "forge": {
      "packagerConfig": {
        "icon": "assets/icon"
      }
    }
  }
}
```

**Note:** Electron Forge automatically picks the right extension (.ico/.icns/.png) based on platform.

---

## Usage Examples

### Basic Electron App

```typescript
import { createIconz, electronPreset } from 'iconz';

const iconz = createIconz({
  input: './src/assets/app-icon.svg',
  output: './build',
  ...electronPreset,
  options: {
    quality: 100  // Maximum quality for desktop apps
  }
});

await iconz.generate();
```

### Electron Builder Integration

```typescript
import { createIconz, electronBuilderPreset } from 'iconz';
import { aggressiveOptimization } from 'iconz/plugins';

const iconz = createIconz({
  input: './assets/logo.svg',
  output: '.',  // Project root
  ...electronBuilderPreset,
  plugins: [aggressiveOptimization],  // Smaller file sizes
  options: {
    quality: 95
  }
});

await iconz.generate();
```

### Electron Forge Integration

```typescript
import { createIconz, electronForgePreset } from 'iconz';

const iconz = createIconz({
  input: './public/icon.svg',
  output: './assets',
  ...electronForgePreset
});

await iconz.generate();
```

### Custom Sizes

Add custom sizes to existing presets:

```typescript
import { electronPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './icon.svg',
  output: './build',
  icons: {
    ...electronPreset.icons,
    // Add high-res Linux icon
    linuxHiDpi: {
      type: 'png',
      name: '1024x1024',
      sizes: [1024],
      folder: 'build/icons'
    }
  }
});
```

### Multiple Themes

Generate icons for light and dark themes:

```typescript
import { processBatch, electronPreset } from 'iconz';

const result = await processBatch({
  sources: [
    {
      input: './icon-light.svg',
      output: './build/light',
      ...electronPreset
    },
    {
      input: './icon-dark.svg',
      output: './build/dark',
      ...electronPreset
    }
  ]
});
```

## Platform Requirements

### Windows (ICO)
- **Required sizes**: 16, 32, 48, 256
- **Recommended**: 16, 24, 32, 48, 64, 128, 256
- **Format**: ICO (multiple PNGs in one file)
- **Transparency**: Supported

### macOS (ICNS)
- **Required sizes**: 16, 32, 128, 256, 512
- **Recommended**: Include Retina (@2x) sizes
- **Format**: ICNS (Apple icon format)
- **Transparency**: Supported

### Linux (PNG)
- **Required size**: 512x512
- **Alternative sizes**: 256, 128, 64, 48, 32, 16
- **Format**: PNG
- **Transparency**: Supported

## Icon Design Guidelines

### General Guidelines
- Use simple, recognizable designs
- Ensure visibility at small sizes (16x16)
- Test on both light and dark backgrounds
- Avoid fine details that don't scale well

### Windows Guidelines
- Design for 256x256, scale down
- Ensure 16x16 is readable
- Use consistent edge treatment
- Consider taskbar appearance

### macOS Guidelines
- Follow Apple's [icon design guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- Use "liquid glass" effect for modern look
- Ensure Retina quality
- Consider dock appearance

### Linux Guidelines
- Follow [freedesktop.org icon theme spec](https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html)
- Provide multiple sizes
- Use standard Linux icon style
- Consider panel/dock appearance

## Troubleshooting

### Icon Not Showing in App

**Problem:** Generated icons don't appear in packaged app.

**Solution:**
1. Verify icon paths in package.json/forge.config.js
2. Rebuild the app
3. Check build output directory
4. Verify icon format is correct for platform

### Low Quality Icons

**Problem:** Icons look blurry or pixelated.

**Solution:**
```typescript
const iconz = createIconz({
  input: './icon.svg',  // Use SVG source, not PNG
  output: './build',
  ...electronPreset,
  options: {
    quality: 100,  // Maximum quality
    resize: {
      kernel: 'lanczos3'  // Best scaling algorithm
    }
  }
});
```

### Icon Too Large

**Problem:** Icon files are very large.

**Solution:**
```typescript
import { aggressiveOptimization } from 'iconz/plugins';

const iconz = createIconz({
  input: './icon.svg',
  output: './build',
  ...electronPreset,
  plugins: [aggressiveOptimization]  // Reduce file size
});
```

### Missing Platform Icons

**Problem:** Missing icons for specific platforms.

**Solution:**
```typescript
// Ensure all platform icons are enabled
const iconz = createIconz({
  input: './icon.svg',
  output: './build',
  icons: {
    windowsIco: { ...electronPreset.icons.windowsIco, enabled: true },
    macosIcns: { ...electronPreset.icons.macosIcns, enabled: true },
    linuxPng: { ...electronPreset.icons.linuxPng, enabled: true }
  }
});
```

## Performance

Icon generation is very fast:
- 3 platform icons: ~100-200ms
- electron-builder (6 icons): ~200-300ms
- With optimization plugins: ~300-500ms

## Package Integration

### package.json Scripts

```json
{
  "scripts": {
    "icons": "iconz",
    "build": "npm run icons && electron-builder",
    "dev": "electron ."
  }
}
```

### Pre-build Hook

Generate icons automatically before building:

```json
{
  "scripts": {
    "prebuild": "iconz",
    "build": "electron-builder"
  }
}
```

## Related Documentation

- [Electron Builder Documentation](https://www.electron.build/icons)
- [Electron Forge Documentation](https://www.electronforge.io/config/makers)
- [ICO Generator](../generators/ico.md) - Windows icon format
- [ICNS Generator](../generators/icns.md) - macOS icon format
- [PNG Generator](../generators/png.md) - Linux icon format
- [Batch Processing](../utils/batch.md) - Generate multiple variants
