# Iconz CLI

Command-line interface for generating icons. Built with Bun for maximum performance.

## Installation

```bash
# Global installation
npm install -g iconz

# Or with Bun
bun install -g iconz
```

## Usage

### Basic Usage

```bash
# Generate PWA icons
iconz -i logo.svg -o ./public -p pwa

# Generate iOS icons
iconz -i logo.png -o ./icons -p ios

# Generate multiple platform icons
iconz -i logo.svg -p ios,android,pwa
```

### Using Config File

Create `.iconz.js`:

```javascript
export default {
  input: './logo.svg',
  output: './icons',
  icons: {
    favicon: {
      type: 'ico',
      name: 'favicon',
      sizes: [16, 32, 48]
    },
    appIcon: {
      type: 'png',
      name: 'icon-{{dims}}',
      sizes: [192, 512]
    }
  }
};
```

Then run:

```bash
iconz  # Auto-detects .iconz.js
```

### From Stdin

```bash
cat logo.svg | iconz --stdin -o ./icons -p pwa
```

## Options

- `-i, --input <path>` - Input image path (required unless using --stdin)
- `-o, --output <path>` - Output directory (default: current directory)
- `-p, --preset <name>` - Use a preset (comma-separated for multiple)
- `-c, --config <path>` - Load configuration from file
- `--list-presets` - List all available presets
- `--stdin` - Read image from stdin
- `-h, --help` - Show help message

## Available Presets

Run `iconz --list-presets` to see all available presets:

- **ios** - iOS app icons
- **android** - Android app icons
- **pwa** - Progressive Web App icons
- **windows11** - Windows 11 icons
- **macos** - macOS icons
- And more...

## Examples

### PWA Complete Setup

```bash
iconz -i logo.svg -o ./public -p pwaComplete
```

Generates:
- Standard icons (48, 72, 96, 144, 192, 256, 384, 512)
- Maskable icons (192, 256, 384, 512)
- Favicon.ico
- Apple touch icons

### iOS + Android

```bash
iconz -i logo.svg -o ./assets -p ios,android
```

### Custom Config

```javascript
// .iconz.js
import { pwaPreset } from 'iconz/presets';

export default {
  input: './logo.svg',
  output: './public',
  ...pwaPreset,
  icons: {
    ...pwaPreset.icons,
    custom: {
      type: 'png',
      name: 'custom-{{dims}}',
      sizes: [64, 128, 256]
    }
  }
};
```

## Output

The CLI provides detailed output:

```
Generating icons...

Generation complete!

Total:    15
Success:  15
Failed:   0
Duration: 1234ms

Generated icons:
  standard:
    - ./public/icon-512.png (512x512)
    - ./public/icon-192.png (192x192)
  favicon:
    - ./public/favicon.ico (48x48)
```

## Exit Codes

- `0` - Success
- `1` - Error or some icons failed to generate

## Performance

Thanks to Bun, the CLI is extremely fast:
- Instant startup time
- Parallel processing
- Efficient memory usage

## Troubleshooting

### Input file not found

Make sure the input path is correct:

```bash
iconz -i ./path/to/logo.svg -o ./icons
```

### Unknown preset

List available presets:

```bash
iconz --list-presets
```

### Permission denied

Ensure output directory is writable:

```bash
chmod +w ./icons
iconz -i logo.svg -o ./icons
```
