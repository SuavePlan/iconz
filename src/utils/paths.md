# Path Utilities Module

Cross-platform path handling utilities for icon generation, temporary directories, and output structure management.

## Features

- **Path resolution** - Handle absolute and relative paths correctly
- **Temporary directories** - Create and clean up temp directories safely
- **Directory management** - Ensure directories exist before writing
- **Input validation** - Validate input files exist

## Functions

### `resolveOutputPath(output, input, addInputDir?)`
Resolve an output path relative to the input file or as an absolute path.

```typescript
// Relative to input
resolveOutputPath('./icons', '/project/logo.svg');
// Result: /project/icons

// Absolute path
resolveOutputPath('/output/icons', '/project/logo.svg');
// Result: /output/icons
```

### `createTempDir(prefix?)`
Create a temporary directory for icon generation with a unique name.

```typescript
const tempPath = await createTempDir('iconz-');
// Result: /tmp/iconz-1234567890-abc123
```

### `ensureDir(path)`
Ensure a directory exists, creating it recursively if needed.

```typescript
await ensureDir('/output/icons/png');
// Creates the entire directory tree
```

### `cleanTempDir(path)`
Safely clean up a temporary directory. Only removes directories with 'iconz-' in the path.

```typescript
await cleanTempDir('/tmp/iconz-1234567890-abc123');
// Removes the directory and all contents
```

### `validateInputPath(input)`
Check if an input file exists.

```typescript
if (!validateInputPath('./logo.svg')) {
  throw new Error('Input file not found');
}
```

### `getExtension(path)`
Get the file extension from a path in lowercase.

```typescript
getExtension('logo.SVG'); // 'svg'
getExtension('icon.png'); // 'png'
```

## Usage Example

```typescript
import { resolveOutputPath, createTempDir, ensureDir, cleanTempDir } from './utils/paths';

// Set up directories
const output = resolveOutputPath('./icons', input);
const temp = await createTempDir();

await ensureDir(output);

// ... generate icons ...

// Clean up
await cleanTempDir(temp);
```
