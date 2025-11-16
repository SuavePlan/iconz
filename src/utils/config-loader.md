# Config Loader Module

Automatically detects and loads iconz configuration files from your project.

## Supported Config Files

The loader searches for these files in order:

1. `.iconz.ts` - TypeScript config
2. `.iconz.js` - JavaScript (CommonJS or ESM)
3. `.iconz.mjs` - JavaScript ESM
4. `.iconz.json` - JSON config
5. `.iconzrc.json` - JSON config (legacy)
6. `.iconzrc` - JSON config (legacy, no extension)

## Usage

### Auto-load from current directory

```typescript
import { loadConfigAuto } from 'iconz/utils/config-loader';

const config = await loadConfigAuto();
if (config) {
  console.log('Found config:', config);
} else {
  console.log('No config file found');
}
```

### Find config file

```typescript
import { findConfigFile } from 'iconz/utils/config-loader';

const configPath = findConfigFile();
if (configPath) {
  console.log('Config file:', configPath);
}
```

### Load specific config file

```typescript
import { loadConfig } from 'iconz/utils/config-loader';

const config = await loadConfig('./my-config.js');
```

## Config File Examples

### TypeScript Config (.iconz.ts)

```typescript
import type { IconzConfig } from 'iconz';
import { quick } from 'iconz';

export default quick.pwa('./logo.svg', './public');
```

### JavaScript Config (.iconz.js)

```javascript
import { quick } from 'iconz';

export default quick.auto('./logo.svg');
```

### JSON Config (.iconz.json)

```json
{
  "input": "./logo.svg",
  "output": "./public",
  "icons": {
    "favicon": {
      "type": "ico",
      "name": "favicon",
      "sizes": [16, 32, 48]
    }
  }
}
```

### Advanced Config with Plugins

```typescript
import { createConfig, aggressiveOptimization } from 'iconz';

export default createConfig('./logo.svg')
  .to('./dist/icons')
  .use('pwa', 'ios')
  .highQuality()
  .build();
```

## CLI Integration

When running the CLI without arguments, it automatically searches for a config file:

```bash
# Auto-detects config file
iconz

# Use specific config file
iconz -c ./.iconz.js
```

## Best Practices

1. **Use TypeScript configs** for type safety and IDE support
2. **Keep configs simple** with the `quick` helpers
3. **Version control your config** to ensure consistent icon generation
4. **Use relative paths** for portability across environments
