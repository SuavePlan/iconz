# Extensibility Guide

Iconz is designed to be fully extensible using TypeScript's declaration merging. You can add custom presets, formats, and plugins with complete type safety.

## Table of Contents

- [Custom Presets](#custom-presets)
- [Custom Icon Formats](#custom-icon-formats)
- [Custom Plugins](#custom-plugins)
- [Type Safety Benefits](#type-safety-benefits)

## Custom Presets

Add your own presets with full TypeScript support.

### Step 1: Define Your Preset

```typescript
import type { Preset, IconConfig } from 'iconz';

const gamingPreset: Preset<{
  steam: IconConfig<'png'>;
  discord: IconConfig<'png'>;
}> = {
  name: 'gaming',
  description: 'Gaming platform icons',
  icons: {
    steam: {
      type: 'png',
      name: 'steam-{{dims}}',
      sizes: [32, 64, 128, 256]
    },
    discord: {
      type: 'png',
      name: 'discord-{{dims}}',
      sizes: [16, 32, 64, 128]
    }
  }
};
```

### Step 2: Extend the Registry

```typescript
declare module 'iconz/types' {
  interface PresetRegistry {
    gaming: typeof gamingPreset;
  }
}
```

### Step 3: Register Your Preset

```typescript
import { registerPreset } from 'iconz';

registerPreset('gaming', gamingPreset);
```

### Step 4: Use with Type Safety

```typescript
import { createConfig } from 'iconz';

// TypeScript autocomplete shows 'gaming'!
const config = createConfig('./logo.svg')
  .use('gaming')  // ✓ Type-safe!
  .build();
```

### Benefits

- ✓ TypeScript autocomplete
- ✓ Compile-time validation
- ✓ No runtime errors from typos
- ✓ IDE shows preset in suggestions

## Custom Icon Formats

Extend Iconz to support new icon formats like SVG, PDF, or any custom format.

### Step 1: Define Format Options

```typescript
interface SvgOptions {
  optimize?: boolean;
  removeViewBox?: boolean;
  pretty?: boolean;
}
```

### Step 2: Extend Format Registry

```typescript
declare module 'iconz/types' {
  interface IconFormatRegistry {
    svg: SvgOptions;
  }
}
```

### Step 3: Create Generator

```typescript
import type { IconConfig, GeneratedIcon } from 'iconz';

async function generateSvgIcons(
  input: Buffer,
  config: IconConfig<'svg'>,
  outputDir: string
): Promise<GeneratedIcon[]> {
  // Your SVG generation logic
  const icons: GeneratedIcon[] = [];

  for (const size of config.sizes) {
    // Generate and save SVG
    icons.push({
      path: `${outputDir}/icon-${size}.svg`,
      format: 'svg',
      dimensions: { width: size, height: size },
      size: 1024
    });
  }

  return icons;
}
```

### Step 4: Use with Type Safety

```typescript
import type { IconConfig } from 'iconz';

const svgConfig: IconConfig<'svg'> = {
  type: 'svg',  // ✓ TypeScript knows this is valid
  name: 'icon-{{dims}}',
  sizes: [24, 48, 96],
  options: {
    // ✓ TypeScript autocomplete shows SvgOptions
    optimize: true,
    removeViewBox: false,
    pretty: true
  }
};
```

### Example: PDF Format

```typescript
interface PdfOptions {
  pageSize?: 'A4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

declare module 'iconz/types' {
  interface IconFormatRegistry {
    pdf: PdfOptions;
  }
}

// Now you can use it:
const pdfIcon: IconConfig<'pdf'> = {
  type: 'pdf',
  name: 'document',
  sizes: [512],
  options: {
    pageSize: 'A4',
    orientation: 'portrait'
  }
};
```

## Custom Plugins

Create reusable plugins with full type safety.

### Step 1: Define Plugin Config

```typescript
interface WatermarkConfig {
  image: string;
  opacity: number;
  position: 'top' | 'bottom' | 'center';
}
```

### Step 2: Create Plugin

```typescript
import type { Plugin } from 'iconz';
import sharp from 'sharp';

export const watermarkPlugin: Plugin<WatermarkConfig, sharp.Sharp> = {
  name: 'watermark',
  version: '1.0.0',

  setup: async (config) => {
    // Validate watermark exists
    const exists = await fileExists(config.image);
    if (!exists) {
      throw new Error(`Watermark not found: ${config.image}`);
    }
  },

  execute: async ({ image, config }) => {
    const watermark = await sharp(config.image)
      .resize(image.width / 4)
      .toBuffer();

    image.composite([{
      input: watermark,
      gravity: config.position === 'center' ? 'center' :
               config.position === 'top' ? 'north' : 'south',
      blend: 'over'
    }]);

    return image;
  }
};
```

### Step 3: Register in Plugin Registry (Optional)

```typescript
declare module 'iconz/types' {
  interface PluginRegistry {
    watermark: typeof watermarkPlugin;
  }
}
```

### Step 4: Use Your Plugin

```typescript
import { createIconz } from 'iconz';
import { watermarkPlugin } from './plugins/watermark';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [watermarkPlugin],
  icons: { /* ... */ }
});
```

## Type Safety Benefits

### 1. Autocomplete

```typescript
// TypeScript shows all available presets
createConfig('./logo.svg').use('|')
// Suggests: ios, android, pwa, gaming, etc.
```

### 2. Compile-Time Validation

```typescript
// ❌ TypeScript error: 'unknown' is not a valid preset
createConfig('./logo.svg').use('unknown')

// ✓ Valid preset
createConfig('./logo.svg').use('ios')
```

### 3. Type-Safe Configuration

```typescript
const config: IconzConfig.PWA = {
  input: './logo.svg',
  output: './public',
  icons: {
    standard: { /* ... */ },    // ✓ Valid
    maskable: { /* ... */ },    // ✓ Valid
    invalid: { /* ... */ }      // ❌ TypeScript error
  }
};
```

### 4. IDE Integration

- Hover over types to see documentation
- Jump to definition (Ctrl+Click)
- Find all references
- Rename refactoring

## Real-World Examples

### Example 1: E-commerce Preset

```typescript
declare module 'iconz/types' {
  interface PresetRegistry {
    ecommerce: Preset<{
      shopify: IconConfig<'png'>;
      woocommerce: IconConfig<'png'>;
      magento: IconConfig<'png'>;
    }>;
  }
}

const ecommercePreset: PresetRegistry['ecommerce'] = {
  name: 'ecommerce',
  description: 'E-commerce platform icons',
  icons: {
    shopify: { type: 'png', name: 'shopify-{{dims}}', sizes: [32, 64] },
    woocommerce: { type: 'png', name: 'woo-{{dims}}', sizes: [32, 64] },
    magento: { type: 'png', name: 'magento-{{dims}}', sizes: [32, 64] }
  }
};

registerPreset('ecommerce', ecommercePreset);
```

### Example 2: Social Media Preset

```typescript
declare module 'iconz/types' {
  interface PresetRegistry {
    social: Preset<{
      facebook: IconConfig<'png'>;
      twitter: IconConfig<'png'>;
      instagram: IconConfig<'png'>;
      linkedin: IconConfig<'png'>;
    }>;
  }
}

const socialPreset: PresetRegistry['social'] = {
  name: 'social',
  description: 'Social media icons',
  icons: {
    facebook: { type: 'png', name: 'fb-{{dims}}', sizes: [16, 32, 64] },
    twitter: { type: 'png', name: 'tw-{{dims}}', sizes: [16, 32, 64] },
    instagram: { type: 'png', name: 'ig-{{dims}}', sizes: [16, 32, 64] },
    linkedin: { type: 'png', name: 'li-{{dims}}', sizes: [16, 32, 64] }
  }
};

registerPreset('social', socialPreset);
```

## Best Practices

1. **Use Type Annotations** - Always type your presets and configs
2. **Document Your Extensions** - Add JSDoc comments
3. **Test Thoroughly** - Write tests for custom presets/formats
4. **Version Your Extensions** - Track changes to custom presets
5. **Share Useful Presets** - Create npm packages for reusable presets

## Publishing Custom Presets

You can publish your custom presets as npm packages:

```typescript
// my-iconz-preset/index.ts
import { registerPreset, type Preset } from 'iconz';

export const myPreset: Preset = { /* ... */ };

declare module 'iconz/types' {
  interface PresetRegistry {
    myCustomPreset: typeof myPreset;
  }
}

// Auto-register on import
registerPreset('myCustomPreset', myPreset);
```

Users can then:

```bash
npm install my-iconz-preset
```

```typescript
import 'my-iconz-preset'; // Auto-registers
import { createConfig } from 'iconz';

createConfig('./logo.svg').use('myCustomPreset').build();
```

## Summary

Iconz is truly extensible through:

- ✅ TypeScript declaration merging
- ✅ Registry pattern for presets/formats/plugins
- ✅ Full type safety and autocomplete
- ✅ No inline definitions required
- ✅ Easy to test and maintain
- ✅ Can be published as separate packages

The registry pattern ensures your extensions integrate seamlessly with the rest of the library while maintaining complete type safety.
