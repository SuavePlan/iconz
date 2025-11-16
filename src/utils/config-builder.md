# Config Builder Module

Simplifies icon generation configuration with smart defaults, auto-detection, and fluent API.

## Features

- **Fluent API** - Chainable configuration methods
- **Smart defaults** - Sensible defaults for common use cases
- **Auto-detection** - Detect project type and configure automatically
- **Quick setup** - One-liners for common scenarios

## Usage

### Fluent API

```typescript
import { createConfig } from 'iconz';

const config = createConfig('./logo.svg')
  .to('./public')
  .use('pwa', 'ios')
  .balanced()
  .build();

const iconz = createIconz(config);
await iconz.generate();
```

### Quick Setup

```typescript
import { quick, createIconz } from 'iconz';

// PWA icons (fastest way)
await createIconz(quick.pwa('./logo.svg')).generate();

// iOS icons
await createIconz(quick.ios('./logo.svg')).generate();

// Android icons
await createIconz(quick.android('./logo.svg')).generate();

// All platforms
await createIconz(quick.all('./logo.svg')).generate();

// Auto-detect and configure
await createIconz(quick.auto('./logo.svg')).generate();
```

### Auto-Detection

```typescript
import { createConfig, createIconz } from 'iconz';

// Automatically detect project type and configure
const config = createConfig('./logo.svg')
  .autoDetect()
  .build();

await createIconz(config).generate();
```

Auto-detection looks for:
- **PWA** - `manifest.json`, workbox-webpack-plugin
- **React Native** - react-native dependency, ios/android folders
- **Electron** - electron dependency
- **Native iOS** - ios/ folder
- **Native Android** - android/ folder

### Quality Presets

```typescript
// High quality (100%)
createConfig('./logo.svg')
  .use('pwa')
  .highQuality()
  .build();

// Balanced (90%) - recommended
createConfig('./logo.svg')
  .use('pwa')
  .balanced()
  .build();

// Fast (75%)
createConfig('./logo.svg')
  .use('pwa')
  .fast()
  .build();

// Custom quality
createConfig('./logo.svg')
  .use('pwa')
  .quality(85)
  .build();
```

## API

### ConfigBuilder

#### Methods

- `from(input)` - Set input image (path or buffer)
- `to(output)` - Set output directory
- `use(...presets)` - Use one or more presets
- `addIcons(icons)` - Add custom icon configurations
- `quality(value)` - Set quality (1-100)
- `highQuality()` - Set quality to 100%
- `balanced()` - Set quality to 90% (recommended)
- `fast()` - Set quality to 75%
- `autoDetect()` - Auto-detect project type
- `build()` - Build and return configuration

### Quick Helpers

- `quick.pwa(input, output?)` - Quick PWA setup
- `quick.ios(input, output?)` - Quick iOS setup
- `quick.android(input, output?)` - Quick Android setup
- `quick.all(input, output?)` - All platforms
- `quick.auto(input, output?)` - Auto-detect and configure

## Examples

### One-Liner Setups

```typescript
import { quick, createIconz } from 'iconz';

// PWA
await createIconz(quick.pwa('./logo.svg')).generate();

// iOS + Android
const config = createConfig('./logo.svg')
  .use('ios', 'android')
  .balanced()
  .build();
await createIconz(config).generate();
```

### Custom Configuration

```typescript
import { createConfig } from 'iconz';

const config = createConfig('./logo.svg')
  .to('./assets')
  .use('pwa')
  .addIcons({
    custom: {
      type: 'png',
      name: 'custom-{{dims}}',
      sizes: [64, 128, 256]
    }
  })
  .highQuality()
  .build();
```

### CLI Integration

The CLI automatically uses the config builder for simplified usage:

```bash
# Auto-detect project type
iconz -i logo.svg --auto

# Quick PWA setup
iconz -i logo.svg -p pwa --balanced

# High quality all platforms
iconz -i logo.svg -p ios,android,pwa --high-quality
```

## Best Practices

1. **Use balanced quality** - Best compromise between size and quality
2. **Auto-detect for quick starts** - Let the tool figure out your setup
3. **Use quick helpers** - Fastest way to get started
4. **Chain methods** - More readable and maintainable
