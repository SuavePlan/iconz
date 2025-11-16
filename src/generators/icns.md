# ICNS Generator Module

Generates Apple ICNS files for macOS applications with Retina display support.

## Features

- **Retina support** - @2x variants for high-resolution displays
- **macOS 11+ compatible** - Modern icon format support
- **Multiple resolutions** - Single file with all required sizes
- **OSType mapping** - Automatic mapping to Apple icon types

## Functions

### `generateIcnsIcon(buffers, config, options)`
Generate a single ICNS file containing multiple PNG images at different sizes.

```typescript
const icon = await generateIcnsIcon(buffers, {
  type: 'icns',
  name: 'AppIcon',
  sizes: [16, 32, 64, 128, 256, 512, 1024]
}, {
  outputDir: './Resources'
});
```

### `validateIcnsSizes(sizes)`
Validate that all sizes are square (required for ICNS format).

### `getRecommendedIcnsSizes(retina?)`
Get recommended icon sizes for macOS applications.

```typescript
const sizes = getRecommendedIcnsSizes(true);  // [16, 32, 64, 128, 256, 512, 1024]
const basic = getRecommendedIcnsSizes(false); // [16, 32, 128, 256, 512]
```

## ICNS Format Requirements

- **Square dimensions required** - All sizes must have width === height
- **Recommended sizes** - 16, 32, 64, 128, 256, 512, 1024 (with Retina)
- **macOS 11+** - Supports new icon design with depth and materials
- **Minimum requirement** - At least 128, 256, 512 for modern macOS

## OSType Mapping

The generator automatically maps sizes to Apple's OSType codes:

| Size | OSType | Description |
|------|--------|-------------|
| 16x16 | ic04 | Small toolbar icons |
| 32x32 | ic05 | Retina 16x16 |
| 64x64 | ic11 | Retina 32x32 |
| 128x128 | ic07 | Medium icons |
| 256x256 | ic08 | Retina 128x128 |
| 512x512 | ic09 | Large icons |
| 1024x1024 | ic10 | Retina 512x512 |

## Common Use Cases

### macOS Application Icon
```typescript
{
  type: 'icns',
  name: 'AppIcon',
  sizes: [16, 32, 64, 128, 256, 512, 1024]
}
```

### Document Type Icon
```typescript
{
  type: 'icns',
  name: 'DocIcon',
  sizes: [16, 32, 128, 256, 512]
}
```

### macOS 11+ with Liquid Glass Effect
For best results with macOS 11+ "liquid glass" effect, ensure your source image:
- Has a 1024x1024px canvas
- Uses depth, translucency, and subtle materials
- Follows Apple's Human Interface Guidelines
