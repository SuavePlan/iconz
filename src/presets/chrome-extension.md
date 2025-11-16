# Browser Extension Presets

Icon configurations for Chrome, Edge, Firefox, and Safari browser extensions following modern specifications (Manifest V3).

## Overview

Browser extensions require icons in multiple sizes for:
- **Extension toolbar** (16x16, 24x24, 32x32)
- **Extension management page** (48x48)
- **Chrome Web Store / Add-on stores** (128x128)
- **Action icons** (browser toolbar)

## Available Presets

### 1. `chromeExtensionPreset`

Basic Chrome/Edge extension icons (Manifest V3 compliant).

```typescript
import { chromeExtensionPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './extension-icon.svg',
  output: './dist',
  ...chromeExtensionPreset
});
```

**Output Structure:**
```
icons/
├── icon-16.png
├── icon-32.png
├── icon-48.png
└── icon-128.png
```

**manifest.json:**
```json
{
  "manifest_version": 3,
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

**Sizes:**
- 16×16 - Favicon on extension pages
- 32×32 - Windows computers
- 48×48 - Extension management page
- 128×128 - Chrome Web Store, installation

---

### 2. `chromeExtensionCompletePreset`

Complete Chrome extension icon set with action icons and store assets.

```typescript
import { chromeExtensionCompletePreset } from 'iconz/presets';

const iconz = createIconz({
  input: './extension-icon.svg',
  output: './dist',
  ...chromeExtensionCompletePreset
});
```

**Output Structure:**
```
icons/
├── icon-16.png
├── icon-32.png
├── icon-48.png
├── icon-128.png
├── action-16.png
├── action-24.png
├── action-32.png
└── store-128.png
```

**manifest.json:**
```json
{
  "manifest_version": 3,
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "action": {
    "default_icon": {
      "16": "icons/action-16.png",
      "24": "icons/action-24.png",
      "32": "icons/action-32.png"
    }
  }
}
```

**Features:**
- Extension icons (16, 32, 48, 128)
- Action/toolbar icons (16, 24, 32)
- Store icon (128) for Chrome Web Store

---

### 3. `edgeExtensionPreset`

Microsoft Edge Add-on icons (same format as Chrome).

```typescript
import { edgeExtensionPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './extension-icon.svg',
  output: './assets',
  ...edgeExtensionPreset
});
```

**Output Structure:**
```
assets/
├── icon-16.png
├── icon-32.png
├── icon-48.png
└── icon-128.png
```

**Note:** Edge uses the same format as Chrome but outputs to `assets/` folder.

---

### 4. `firefoxExtensionPreset`

Firefox Add-on icons following Mozilla specifications.

```typescript
import { firefoxExtensionPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './addon-icon.svg',
  output: './dist',
  ...firefoxExtensionPreset
});
```

**Output Structure:**
```
icons/
├── icon-48.png
├── icon-96.png
└── icon-128.png
```

**manifest.json:**
```json
{
  "manifest_version": 2,
  "icons": {
    "48": "icons/icon-48.png",
    "96": "icons/icon-96.png"
  }
}
```

**Sizes:**
- 48×48 - Add-on manager
- 96×96 - Add-on manager @2x (Retina)
- 128×128 - Firefox Add-ons store

---

### 5. `universalExtensionPreset`

Cross-browser compatible icon set for Chrome, Edge, Firefox, and Safari.

```typescript
import { universalExtensionPreset } from 'iconz/presets';

const iconz = createIconz({
  input: './extension-icon.svg',
  output: './dist',
  ...universalExtensionPreset
});
```

**Output Structure:**
```
icons/
├── icon-16.png   (Chrome/Edge favicon)
├── icon-24.png   (Action icons)
├── icon-32.png   (Chrome/Edge, Action icons)
├── icon-48.png   (All browsers)
├── icon-96.png   (Firefox @2x)
└── icon-128.png  (All stores)
```

**manifest.json (works everywhere):**
```json
{
  "manifest_version": 3,
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "96": "icons/icon-96.png",
    "128": "icons/icon-128.png"
  }
}
```

---

## Usage Examples

### Basic Chrome Extension

```typescript
import { createIconz, chromeExtensionPreset } from 'iconz';

const iconz = createIconz({
  input: './assets/icon.svg',
  output: './dist',
  ...chromeExtensionPreset,
  options: {
    quality: 100  // Sharp, crisp icons
  }
});

await iconz.generate();
```

### Chrome Extension with Actions

```typescript
import { createIconz, chromeExtensionCompletePreset } from 'iconz';

const iconz = createIconz({
  input: './src/icon.svg',
  output: './build',
  ...chromeExtensionCompletePreset
});

await iconz.generate();
```

### Cross-Browser Extension

```typescript
import { createIconz, universalExtensionPreset } from 'iconz';

const iconz = createIconz({
  input: './icon.svg',
  output: './extension',
  ...universalExtensionPreset
});

await iconz.generate();
```

### Multiple Icon Variants

Generate icons for different states:

```typescript
import { processBatch, chromeExtensionPreset } from 'iconz';

const result = await processBatch({
  sources: [
    {
      input: './icon-default.svg',
      output: './dist/icons/default',
      ...chromeExtensionPreset
    },
    {
      input: './icon-active.svg',
      output: './dist/icons/active',
      ...chromeExtensionPreset
    },
    {
      input: './icon-disabled.svg',
      output: './dist/icons/disabled',
      ...chromeExtensionPreset
    }
  ]
});
```

Then use `chrome.action.setIcon()` to switch between states.

### Light and Dark Themes

```typescript
import { processSameSources, chromeExtensionPreset } from 'iconz';

const result = await processSameSources({
  inputs: ['./icon-light.svg', './icon-dark.svg'],
  output: './dist',
  ...chromeExtensionPreset
});
```

## Platform-Specific Requirements

### Chrome / Chromium

**Required Sizes:**
- 16×16 (minimum for toolbar)
- 48×48 (minimum for extensions page)
- 128×128 (minimum for Web Store)

**Recommended Sizes:**
- 16, 32, 48, 128

**Format:** PNG with transparency

**References:**
- [Chrome Extension Icons](https://developer.chrome.com/docs/extensions/mv3/manifest/icons/)
- [Chrome Web Store](https://developer.chrome.com/docs/webstore/images/)

---

### Microsoft Edge

**Same as Chrome** - Edge uses Chromium engine

**Store:** [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/)

---

### Firefox

**Required Sizes:**
- 48×48 (extensions page)
- 96×96 (extensions page @2x)

**Recommended:**
- 48, 96, 128

**Format:** PNG, SVG (for adaptive icons)

**References:**
- [Firefox Extension Icons](https://extensionworkshop.com/documentation/develop/manifest-v2-or-manifest-v3/#icons)
- [Firefox Add-on Guidelines](https://extensionworkshop.com/documentation/develop/designing-for-firefox/)

---

### Safari (macOS)

**Uses App Extension framework** - Different from web extension icons

**Format:** Asset catalog or PNG

**Reference:** [Safari App Extensions](https://developer.apple.com/documentation/safariservices/safari_app_extensions)

---

## Icon Design Guidelines

### General Guidelines
- **Simple and recognizable** - Works at 16×16
- **Consistent style** - Matches your brand
- **High contrast** - Visible on toolbars
- **Transparent background** - Adapts to themes

### Chrome/Edge Guidelines
- Design at 128×128, scale down
- Test on light and dark toolbars
- Ensure 16×16 is legible
- Use consistent padding

### Firefox Guidelines
- Provide @2x versions for Retina
- Follow [Photon Design System](https://design.firefox.com/photon/)
- Test on different themes
- Consider add-on manager appearance

### Action Icons
- Simpler than main icon
- Clear at 16×16
- Distinguish states visually
- Test in browser toolbar

## Manifest Integration

### Manifest V3 (Chrome/Edge)

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "action": {
    "default_icon": {
      "16": "icons/action-16.png",
      "24": "icons/action-24.png",
      "32": "icons/action-32.png"
    },
    "default_title": "Click me"
  }
}
```

### Manifest V2 (Firefox)

```json
{
  "manifest_version": 2,
  "name": "My Add-on",
  "version": "1.0.0",
  "icons": {
    "48": "icons/icon-48.png",
    "96": "icons/icon-96.png"
  },
  "browser_action": {
    "default_icon": {
      "16": "icons/action-16.png",
      "32": "icons/action-32.png"
    }
  }
}
```

## Build Integration

### package.json Scripts

```json
{
  "scripts": {
    "icons": "iconz",
    "build": "npm run icons && webpack",
    "watch": "webpack --watch"
  }
}
```

### Pre-build Hook

```json
{
  "scripts": {
    "prebuild": "iconz",
    "build": "webpack --mode production"
  }
}
```

### webpack Configuration

```javascript
// webpack.config.js
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'icons', to: 'icons' },
        { from: 'manifest.json', to: 'manifest.json' }
      ]
    })
  ]
};
```

## Troubleshooting

### Icon Not Showing

**Problem:** Icons don't appear in extension.

**Solution:**
1. Check manifest.json paths match output
2. Verify icon files exist in dist/
3. Reload extension
4. Check browser console for errors

### Blurry Icons

**Problem:** Icons look blurry in toolbar.

**Solution:**
```typescript
import { aggressiveOptimization } from 'iconz/plugins';

const iconz = createIconz({
  input: './icon.svg',  // Use SVG source
  output: './dist',
  ...chromeExtensionPreset,
  options: {
    quality: 100,
    resize: {
      kernel: 'lanczos3'  // Best quality scaling
    }
  }
});
```

### Wrong Size Displayed

**Problem:** Browser uses wrong icon size.

**Solution:**
Provide all required sizes:
```json
{
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",  // Don't skip sizes
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

## Performance

Icon generation is very fast:
- 4 sizes (basic): ~50-100ms
- 7 sizes (complete): ~100-150ms
- With optimization: ~150-250ms

## Store Submission

### Chrome Web Store

**Required:**
- 128×128 icon (in manifest)
- 128×128 store icon (separate upload)
- 440×280 or 920×680 promotional images

**Generate Store Assets:**
```typescript
import { createIconz } from 'iconz';

// Extension icons
await createIconz({
  input: './icon.svg',
  output: './dist',
  ...chromeExtensionPreset
}).generate();

// Store promotional
await createIconz({
  input: './promo.svg',
  output: './store',
  icons: {
    small: { type: 'png', name: 'promo-small', sizes: [[440, 280]] },
    large: { type: 'png', name: 'promo-large', sizes: [[920, 680]] }
  }
}).generate();
```

### Firefox Add-ons

**Required:**
- 48×48 or 96×96 icon
- Extension works on Firefox

### Microsoft Edge Add-ons

**Same as Chrome Web Store**

## Related Documentation

- [Chrome Extension Icons](https://developer.chrome.com/docs/extensions/mv3/manifest/icons/)
- [Firefox Extension Icons](https://extensionworkshop.com/documentation/develop/manifest-v2-or-manifest-v3/#icons)
- [PNG Generator](../generators/png.md) - PNG generation
- [Batch Processing](../utils/batch.md) - Generate multiple variants
- [Plugins](../plugins/plugins.md) - Optimization plugins
