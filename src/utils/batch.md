# Batch Processing Module

Process multiple icon sources in parallel for maximum performance. Leverages Bun's native parallelization capabilities.

## Features

- **Parallel Processing** - Generate icons from multiple sources simultaneously
- **Concurrency Control** - Limit concurrent operations to prevent resource exhaustion
- **Aggregate Statistics** - Get combined statistics across all sources
- **Error Handling** - Continue processing even if some sources fail
- **Flexible Input** - Process different sources with different configurations

## API

### `processBatch(config)`

Process multiple icon sources in batch with optional parallelization.

```typescript
import { processBatch, quick } from 'iconz';

const result = await processBatch({
  sources: [
    quick.pwa('./logo-light.svg', './public/light'),
    quick.pwa('./logo-dark.svg', './public/dark'),
    quick.ios('./app-icon.svg', './assets'),
  ],
  parallel: true,      // Run in parallel (default: true)
  concurrency: 4       // Max concurrent operations (default: 4)
});

console.log(`Generated ${result.stats.totalIcons} icons`);
console.log(`${result.stats.successfulSources}/${result.stats.totalSources} sources succeeded`);
```

**Parameters:**
- `sources: IconzConfig[]` - Array of icon configurations to process
- `parallel?: boolean` - Run in parallel (default: `true`)
- `concurrency?: number` - Maximum concurrent operations (default: `4`)

**Returns:** `BatchResult<T>`
```typescript
{
  results: GenerationReport<T>[],      // Results for each source
  failed: Array<{                      // Failed sources
    index: number,
    config: IconzConfig<T>,
    error: string
  }>,
  stats: {
    totalSources: number,              // Total number of sources
    successfulSources: number,         // Number of successful sources
    failedSources: number,             // Number of failed sources
    totalIcons: number,                // Total icons generated
    totalDuration: number              // Total time in milliseconds
  }
}
```

### `processSameSources(config)`

Process multiple sources with the same icon configuration.

```typescript
import { processSameSources } from 'iconz';

const result = await processSameSources({
  inputs: [
    './logo-light.svg',
    './logo-dark.svg',
    './logo-color.svg'
  ],
  output: './public',
  icons: {
    pwa: {
      type: 'png',
      name: 'icon-{{dims}}',
      sizes: [192, 512]
    }
  }
});
```

**Parameters:**
- `inputs: Array<string | Buffer>` - Array of input images
- All other `IconzConfig` properties (except `input`)

**Returns:** `BatchResult<T>`

### `createBatch(...sources)`

Create a batch configuration from multiple sources using a fluent API.

```typescript
import { createBatch, processBatch, quick } from 'iconz';

const batch = createBatch(
  quick.pwa('./logo.svg'),
  quick.ios('./logo.svg'),
  quick.android('./logo.svg')
);

// Modify batch settings
batch.parallel = true;
batch.concurrency = 8;

const result = await processBatch(batch);
```

**Parameters:**
- `...sources: IconzConfig[]` - Variable number of icon configurations

**Returns:** `BatchConfig<T>`
```typescript
{
  sources: IconzConfig[],
  parallel: true,
  concurrency: 4
}
```

## Usage Examples

### Different Sources, Different Configs

Generate icons for multiple themes with different configurations:

```typescript
import { processBatch, createConfig } from 'iconz';

const result = await processBatch({
  sources: [
    // Light theme PWA
    createConfig('./logo-light.svg')
      .to('./public/light')
      .use('pwa')
      .highQuality()
      .build(),

    // Dark theme PWA
    createConfig('./logo-dark.svg')
      .to('./public/dark')
      .use('pwa')
      .balanced()
      .build(),

    // App icons
    createConfig('./app-icon.svg')
      .to('./assets')
      .use('ios', 'android')
      .highQuality()
      .build()
  ],
  parallel: true,
  concurrency: 3  // Process 3 at a time
});
```

### Same Config, Multiple Sources

Generate icons from multiple source images:

```typescript
import { processSameSources, pwaPreset } from 'iconz';

const result = await processSameSources({
  inputs: [
    './brand/logo-v1.svg',
    './brand/logo-v2.svg',
    './brand/logo-v3.svg'
  ],
  output: './icons',
  ...pwaPreset
});
```

### Sequential Processing

Process sources one at a time (useful for memory-constrained environments):

```typescript
import { processBatch, quick } from 'iconz';

const result = await processBatch({
  sources: [
    quick.all('./logo-1.svg'),
    quick.all('./logo-2.svg'),
    quick.all('./logo-3.svg')
  ],
  parallel: false  // Process sequentially
});
```

### Error Handling

Handle errors gracefully and continue processing:

```typescript
import { processBatch, quick } from 'iconz';

const result = await processBatch({
  sources: [
    quick.pwa('./logo-1.svg'),
    quick.pwa('./invalid-path.svg'),  // This will fail
    quick.pwa('./logo-3.svg')         // But this will still process
  ]
});

// Check for failures
if (result.failed.length > 0) {
  console.error('Some sources failed:');
  for (const failure of result.failed) {
    console.error(`  Source ${failure.index}: ${failure.error}`);
  }
}

// Use successful results
console.log(`Successfully generated ${result.stats.totalIcons} icons`);
```

### Concurrency Control

Adjust concurrency based on available resources:

```typescript
import { processBatch, quick } from 'iconz';

// High concurrency for powerful machines
const result = await processBatch({
  sources: [...Array(20)].map((_, i) => quick.pwa(`./logo-${i}.svg`)),
  parallel: true,
  concurrency: 8  // Process 8 at once
});

// Low concurrency for limited resources
const result = await processBatch({
  sources: [...Array(20)].map((_, i) => quick.pwa(`./logo-${i}.svg`)),
  parallel: true,
  concurrency: 2  // Process 2 at once
});
```

## Performance Tips

1. **Optimal Concurrency**: Start with 4 and adjust based on CPU cores
2. **Memory Management**: Lower concurrency if experiencing memory issues
3. **I/O Bound**: Higher concurrency for I/O-bound operations
4. **CPU Bound**: Match concurrency to CPU core count
5. **Sequential for Debug**: Use `parallel: false` when debugging

## When to Use Batch Processing

### ✅ Good Use Cases
- Multiple logo variations (light/dark themes)
- A/B testing different designs
- Brand variations for different markets
- Multi-tenant applications
- Batch migrations

### ❌ Not Recommended For
- Single source image (use regular `createIconz` instead)
- Real-time generation (batch is for bulk operations)
- Very small number of icons (overhead not worth it)

## Integration with Bun

Batch processing leverages Bun's native capabilities:
- Fast startup time
- Efficient memory management
- Native Promise.all optimization
- Parallel file I/O

## Related Documentation

- [Config Builder](./config-builder.md) - Build configurations for batch sources
- [Quick Helpers](./config-builder.md#quick-helpers) - Simplified config creation
- [Core Iconz](../core/iconz.md) - Single icon generation
