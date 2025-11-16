# Types Module

This module defines all core types and interfaces for Iconz using TypeScript generics for maximum type safety and extensibility.

## Key Features

- **Generic icon configurations** - Supports any icon format with type-safe options
- **Template system** - Type-safe template variables for dynamic naming
- **Plugin system** - Extensible plugin architecture with typed contexts
- **Preset system** - Define reusable icon generation presets
- **Type guards** - Runtime type checking utilities

## Main Types

### `IconConfig<T>`
Generic icon configuration that adapts based on the icon format type.

```typescript
const pngConfig: IconConfig<'png'> = {
  type: 'png',
  name: 'icon-{{dims}}',
  sizes: [16, 32, 64],
  options: { compressionLevel: 9 } // TypeScript knows these are PNG options
};
```

### `Preset<T>`
Define reusable icon generation presets with full type safety.

```typescript
const iosPreset: Preset = {
  name: 'iOS',
  description: 'iOS app icons',
  icons: {
    appIcon: {
      type: 'png',
      name: 'AppIcon-{{dims}}',
      sizes: [180, 167, 152, 1024]
    }
  }
};
```

### `Plugin<TConfig, TResult>`
Extensible plugin system with typed configuration and results.

```typescript
const watermarkPlugin: Plugin<WatermarkConfig, void> = {
  name: 'watermark',
  execute: async ({ image, config }) => {
    // Add watermark to image
  }
};
```

## Type Utilities

- `isIconSize(value)` - Check if value is a valid icon size
- `parseDimensions(size)` - Parse size into width/height dimensions

## Usage

```typescript
import type { IconConfig, Preset, IconzConfig } from './types/types';

const config: IconzConfig = {
  input: './logo.svg',
  output: './icons',
  icons: {
    // Fully typed icon configurations
  }
};
```
