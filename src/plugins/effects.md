# Effects Plugins

Visual effects and image enhancement plugins for adding watermarks, shadows, borders, and color adjustments to icons.

## Overview

Effects plugins provide post-processing visual enhancements:
- **Watermarks** - Add copyright or branding overlays
- **Drop Shadows** - Add depth and dimension
- **Borders** - Add frames with optional rounded corners
- **Enhancements** - Adjust brightness, contrast, saturation, sharpness

## Available Plugins

### 1. `createWatermarkPlugin(config)`

Add watermark images to icons for branding or copyright protection.

```typescript
import { createWatermarkPlugin } from 'iconz/plugins';

const watermark = createWatermarkPlugin({
  image: './watermark.png',
  position: 'southeast',
  opacity: 0.3
});

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [watermark],
  icons: {
    branded: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});

await iconz.generate();
```

**Configuration:**

```typescript
interface WatermarkConfig {
  image: string;      // Path to watermark image
  position?: string;  // 'north' | 'northeast' | 'east' | 'southeast' |
                      // 'south' | 'southwest' | 'west' | 'northwest' | 'center'
  opacity?: number;   // 0.0-1.0, default: 0.3
}
```

**Positions:**

```
northwest    north    northeast
    ┌──────────────┐
west│              │east
    │    center    │
    │              │
    └──────────────┘
southwest    south    southeast
```

**Features:**
- Composite watermark over icon
- Configurable opacity (0.0 = invisible, 1.0 = opaque)
- 9 position options
- Supports PNG watermarks with transparency
- Validates watermark file exists during setup

**Use Cases:**
- Copyright protection
- Brand identification
- Preview/demo versions
- Source attribution

**Example Watermarks:**

```typescript
// Copyright notice
const copyright = createWatermarkPlugin({
  image: './copyright.png',
  position: 'southeast',
  opacity: 0.2
});

// Logo overlay
const logo = createWatermarkPlugin({
  image: './brand-logo.png',
  position: 'center',
  opacity: 0.5
});

// Demo badge
const demo = createWatermarkPlugin({
  image: './demo-badge.png',
  position: 'northeast',
  opacity: 0.7
});
```

---

### 2. `createShadowPlugin(config)`

Add drop shadow effects to create depth and make icons stand out.

```typescript
import { createShadowPlugin } from 'iconz/plugins';

const shadow = createShadowPlugin({
  blur: 10,
  opacity: 0.5,
  color: { r: 0, g: 0, b: 0 }
});

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [shadow],
  icons: {
    shadowed: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});
```

**Configuration:**

```typescript
interface ShadowConfig {
  blur?: number;     // Blur radius in pixels, default: 10
  opacity?: number;  // Shadow opacity 0.0-1.0, default: 0.5
  color?: {          // Shadow color, default: black
    r: number;       // Red: 0-255
    g: number;       // Green: 0-255
    b: number;       // Blue: 0-255
  };
}
```

**How it Works:**
1. Extends image with padding (blur × 2)
2. Applies blur to create soft shadow
3. Preserves transparency
4. Creates depth perception

**Features:**
- Configurable blur radius
- Adjustable opacity
- Custom shadow color
- Automatic padding calculation
- Preserves icon transparency

**Use Cases:**
- Material Design effects
- Elevated UI elements
- Product screenshots
- Marketing materials

**Shadow Styles:**

```typescript
// Subtle shadow (Material Design)
const subtle = createShadowPlugin({
  blur: 8,
  opacity: 0.3,
  color: { r: 0, g: 0, b: 0 }
});

// Strong shadow (dramatic)
const dramatic = createShadowPlugin({
  blur: 20,
  opacity: 0.7,
  color: { r: 0, g: 0, b: 0 }
});

// Colored shadow
const colored = createShadowPlugin({
  blur: 15,
  opacity: 0.5,
  color: { r: 100, g: 100, b: 255 }  // Blue shadow
});
```

---

### 3. `createBorderPlugin(config)`

Add borders and rounded corners to icons for framing or styling.

```typescript
import { createBorderPlugin } from 'iconz/plugins';

const border = createBorderPlugin({
  width: 2,
  color: { r: 255, g: 255, b: 255, alpha: 1 },
  radius: 10
});

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [border],
  icons: {
    framed: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});
```

**Configuration:**

```typescript
interface BorderConfig {
  width?: number;    // Border width in pixels, default: 2
  color?: {          // Border color, default: black
    r: number;       // Red: 0-255
    g: number;       // Green: 0-255
    b: number;       // Blue: 0-255
    alpha: number;   // Opacity: 0.0-1.0
  };
  radius?: number;   // Corner radius in pixels, default: 0 (sharp corners)
}
```

**Features:**
- Configurable border width
- Custom border colors with transparency
- Rounded corners support
- SVG-based corner masking
- Preserves aspect ratio

**Use Cases:**
- iOS-style rounded icons
- Framed designs
- Profile pictures
- Badge styles

**Border Styles:**

```typescript
// iOS rounded icon
const iosStyle = createBorderPlugin({
  width: 0,
  radius: 20  // Just rounded corners
});

// White frame
const frame = createBorderPlugin({
  width: 4,
  color: { r: 255, g: 255, b: 255, alpha: 1 },
  radius: 0
});

// Semi-transparent border
const subtle = createBorderPlugin({
  width: 2,
  color: { r: 0, g: 0, b: 0, alpha: 0.2 },
  radius: 8
});

// Colored border with corners
const styled = createBorderPlugin({
  width: 3,
  color: { r: 59, g: 130, b: 246, alpha: 1 },  // Blue
  radius: 12
});
```

---

### 4. `createEnhancementPlugin(config)`

Enhance icon appearance with brightness, contrast, saturation, and sharpness adjustments.

```typescript
import { createEnhancementPlugin } from 'iconz/plugins';

const enhance = createEnhancementPlugin({
  brightness: 10,
  contrast: 5,
  saturation: 0,
  sharpness: 2
});

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [enhance],
  icons: {
    enhanced: {
      type: 'png',
      name: 'icon-{{width}}',
      sizes: [192, 512]
    }
  }
});
```

**Configuration:**

```typescript
interface EnhancementConfig {
  brightness?: number;  // -100 to 100, default: 0 (no change)
  contrast?: number;    // -100 to 100, default: 0 (no change)
  saturation?: number;  // -100 to 100, default: 0 (no change)
  sharpness?: number;   // 0 to 10, default: 0 (no sharpening)
}
```

**Parameters:**

- **Brightness**: Lightness adjustment
  - Negative values: Darker (-100 = black)
  - Positive values: Lighter (+100 = very bright)
  - 0: No change

- **Contrast**: Difference between light and dark
  - Negative values: Lower contrast (flat)
  - Positive values: Higher contrast (dramatic)
  - 0: No change

- **Saturation**: Color intensity
  - Negative values: Less saturated (grayscale at -100)
  - Positive values: More saturated (vibrant)
  - 0: No change

- **Sharpness**: Edge definition
  - 0: No sharpening
  - 1-3: Subtle sharpening
  - 4-7: Moderate sharpening
  - 8-10: Strong sharpening (may introduce artifacts)

**Use Cases:**
- Color correction
- Icon refinement
- Mood adjustments
- Compensate for compression

**Enhancement Presets:**

```typescript
// Brighten dark icons
const brighten = createEnhancementPlugin({
  brightness: 15,
  contrast: 0,
  saturation: 0,
  sharpness: 0
});

// Increase pop/vibrancy
const vibrant = createEnhancementPlugin({
  brightness: 0,
  contrast: 10,
  saturation: 15,
  sharpness: 1
});

// Sharpen blurry icons
const sharpen = createEnhancementPlugin({
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpness: 3
});

// Professional correction
const professional = createEnhancementPlugin({
  brightness: 5,
  contrast: 8,
  saturation: 10,
  sharpness: 2
});

// Subtle refinement
const subtle = createEnhancementPlugin({
  brightness: 0,
  contrast: 3,
  saturation: 5,
  sharpness: 1
});
```

---

## Combining Effects

### Watermark + Shadow

Create branded icons with depth:

```typescript
import { createWatermarkPlugin, createShadowPlugin } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    createShadowPlugin({ blur: 12, opacity: 0.4 }),
    createWatermarkPlugin({
      image: './brand.png',
      position: 'southeast',
      opacity: 0.25
    })
  ],
  icons: { /* ... */ }
});
```

### Border + Enhancement

Styled icons with color correction:

```typescript
import { createBorderPlugin, createEnhancementPlugin } from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    createEnhancementPlugin({
      brightness: 5,
      contrast: 10,
      saturation: 5,
      sharpness: 1
    }),
    createBorderPlugin({
      width: 3,
      color: { r: 255, g: 255, b: 255, alpha: 1 },
      radius: 15
    })
  ],
  icons: { /* ... */ }
});
```

### Complete Enhancement Stack

Apply all effects:

```typescript
import {
  createEnhancementPlugin,
  createShadowPlugin,
  createBorderPlugin,
  createWatermarkPlugin,
  aggressiveOptimization
} from 'iconz/plugins';

const iconz = createIconz({
  input: './logo.svg',
  output: './icons',
  plugins: [
    // 1. Enhance base image
    createEnhancementPlugin({
      brightness: 5,
      contrast: 8,
      saturation: 10,
      sharpness: 2
    }),

    // 2. Add border
    createBorderPlugin({
      width: 2,
      color: { r: 255, g: 255, b: 255, alpha: 0.3 },
      radius: 12
    }),

    // 3. Add shadow
    createShadowPlugin({
      blur: 10,
      opacity: 0.3
    }),

    // 4. Add watermark
    createWatermarkPlugin({
      image: './watermark.png',
      position: 'southeast',
      opacity: 0.2
    }),

    // 5. Optimize
    aggressiveOptimization
  ],
  icons: { /* ... */ }
});
```

## Plugin Order Matters

Effects are applied in order, so sequencing is important:

```typescript
// ✓ Good: Enhance before effects
plugins: [
  createEnhancementPlugin({ ... }),  // 1. Color correction first
  createBorderPlugin({ ... }),       // 2. Then add border
  createShadowPlugin({ ... }),       // 3. Then shadow
  createWatermarkPlugin({ ... }),    // 4. Finally watermark
  aggressiveOptimization            // 5. Optimize last
]

// ✗ Bad: Effects before enhancement
plugins: [
  createShadowPlugin({ ... }),       // Shadow will be enhanced too
  createEnhancementPlugin({ ... }),  // May not look as intended
]
```

## Performance Impact

| Plugin | Performance | Use Case |
|--------|-------------|----------|
| `createWatermarkPlugin` | Medium | Branding |
| `createShadowPlugin` | Fast | Depth |
| `createBorderPlugin` | Fast | Framing |
| `createEnhancementPlugin` | Fast | Correction |
| All 4 combined | Medium | Marketing |

**Tips:**
- Each effect adds ~10-20% to generation time
- Watermark has setup cost (file I/O)
- Consider effects only for production builds
- Use conditionally for different outputs

## Best Practices

### 1. Use Effects Sparingly

Effects can degrade quality if overused:

```typescript
// ✓ Good: Subtle enhancements
createEnhancementPlugin({
  brightness: 5,
  contrast: 8,
  sharpness: 1
})

// ✗ Bad: Excessive adjustments
createEnhancementPlugin({
  brightness: 50,
  contrast: 50,
  saturation: 50,
  sharpness: 10
})
```

### 2. Test at Multiple Sizes

Effects may look different at various scales:

```typescript
sizes: [16, 32, 48, 64, 128, 256, 512]
// Check border width looks good at all sizes
// Verify shadow doesn't overwhelm small icons
// Ensure watermark is visible but not obtrusive
```

### 3. Consider Platform Guidelines

Different platforms have different styles:

```typescript
// iOS - Rounded corners
const iosEffects = [
  createBorderPlugin({ radius: 20 })
];

// Material Design - Shadows
const androidEffects = [
  createShadowPlugin({ blur: 8, opacity: 0.3 })
];

// Web - Minimal
const webEffects = [
  createEnhancementPlugin({ sharpness: 1 })
];
```

### 4. Use Conditional Effects

Apply effects based on environment:

```typescript
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const plugins = [
  // Always enhance
  createEnhancementPlugin({ sharpness: 1 }),

  // Production only
  ...(isProd ? [
    createWatermarkPlugin({
      image: './watermark.png',
      opacity: 0.2
    })
  ] : []),

  // Development only
  ...(isDev ? [
    createBorderPlugin({
      width: 2,
      color: { r: 255, g: 0, b: 0, alpha: 0.5 }  // Red border for dev
    })
  ] : [])
];
```

### 5. Profile Effect Impact

Measure performance:

```typescript
const start = Date.now();
await iconz.generate();
const duration = Date.now() - start;

console.log(`Generated in ${duration}ms`);
console.log(`${result.successful.length} icons created`);
console.log(`Average: ${duration / result.successful.length}ms per icon`);
```

## Technical Details

### Watermark Implementation

Uses Sharp's composite operation:

```typescript
image.composite([
  {
    input: watermarkBuffer,
    gravity: position,  // Positioning
    blend: 'over'       // Blend mode
  }
]);

// Opacity via modulation
if (opacity < 1) {
  image.modulate({
    brightness: 1,
    saturation: 1,
    lightness: opacity
  });
}
```

### Shadow Implementation

Creates soft shadow via blur and extend:

```typescript
const padding = blur * 2;  // Calculate required padding

image.extend({
  top: padding,
  bottom: padding,
  left: padding,
  right: padding,
  background: { r: 0, g: 0, b: 0, alpha: 0 }  // Transparent
});

image.blur(blur / 2);  // Apply blur for soft shadow
```

### Border Implementation

Extends image and creates rounded corner mask:

```typescript
// Add border
image.extend({
  top: width,
  bottom: width,
  left: width,
  right: width,
  background: color
});

// Apply rounded corners
if (radius > 0) {
  const roundedCorners = Buffer.from(
    `<svg><rect x="0" y="0" width="${w}" height="${h}"
         rx="${radius}" ry="${radius}"/></svg>`
  );

  image.composite([{
    input: roundedCorners,
    blend: 'dest-in'  // Mask operation
  }]);
}
```

### Enhancement Implementation

Uses Sharp's color adjustment operations:

```typescript
// Brightness and saturation
if (brightness !== 0 || saturation !== 0) {
  image.modulate({
    brightness: 1 + brightness / 100,
    saturation: 1 + saturation / 100
  });
}

// Contrast
if (contrast !== 0) {
  image.linear(1 + contrast / 100, 0);
}

// Sharpness
if (sharpness > 0) {
  image.sharpen({
    sigma: sharpness / 2,
    m1: 1.0,
    m2: 0.5
  });
}
```

## Troubleshooting

### Watermark Not Visible

If watermark doesn't appear:

```typescript
// Increase opacity
opacity: 0.5  // Was: 0.2

// Change position
position: 'center'  // Was: 'southeast'

// Verify file exists
await readFile(config.image)  // Should not throw
```

### Shadow Too Strong

If shadow overwhelms icon:

```typescript
// Reduce blur and opacity
blur: 6,      // Was: 15
opacity: 0.2  // Was: 0.7
```

### Border Too Thick

If border is too prominent:

```typescript
// Reduce width
width: 1  // Was: 4

// Make semi-transparent
color: { r: 255, g: 255, b: 255, alpha: 0.3 }
```

### Enhancement Over-Saturated

If colors look unnatural:

```typescript
// Reduce adjustment values
{
  brightness: 3,   // Was: 15
  contrast: 5,     // Was: 20
  saturation: 5,   // Was: 25
  sharpness: 1     // Was: 5
}
```

### Effects Slow Generation

If generation takes too long:

```typescript
// Remove expensive effects
plugins: [
  // Keep fast effects
  createEnhancementPlugin({ ... }),

  // Remove slow effects (conditionally)
  // createWatermarkPlugin({ ... }),  // Commented out
]
```

## Related Documentation

- [Optimization Plugins](./optimization.md) - File size optimization
- [Compression Plugins](./compression.md) - Format-specific compression
- [Plugins Overview](./plugins.md) - All available plugins
- [Processor](../core/processor.md) - Image processing pipeline
- [PNG Generator](../generators/png.md) - PNG icon generation
