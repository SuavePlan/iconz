/**
 * Example: Adding a custom icon format
 *
 * This example shows how to extend Iconz to support custom icon formats
 * like SVG or PDF with full TypeScript type safety.
 */

import type { GeneratedIcon, IconConfig, Plugin } from '../src/iconz';

// Step 1: Define your custom format options
// Note: Using 'customSvg' to avoid conflict with built-in 'svg' format
interface CustomSvgOptions {
	/** Optimize SVG output */
	optimize?: boolean;
	/** Remove viewBox attribute */
	removeViewBox?: boolean;
	/** Pretty print output */
	pretty?: boolean;
}

// Step 2: Extend the IconFormatRegistry
// This automatically adds 'customSvg' to the IconFormat union type!
declare module '../src/types/registry.types' {
	interface IconFormatRegistry {
		customSvg: CustomSvgOptions;
	}
}

// Step 3: Create a generator for your format
async function _generateCustomSvgIcons(
	_inputPath: string,
	config: IconConfig<'customSvg'>,
	outputDir: string,
): Promise<GeneratedIcon[]> {
	// Your custom SVG generation logic here
	// For this example, we'll just return a placeholder

	const icons: GeneratedIcon[] = [];

	for (const size of config.sizes) {
		const width = typeof size === 'number' ? size : Number.parseInt(size.split('x')[0], 10);
		const height =
			typeof size === 'number'
				? size
				: Number.parseInt(size.split('x')[1] || size.split('x')[0], 10);

		// Generate SVG (placeholder logic)
		const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#000"/>
</svg>`;

		// In real implementation, you'd write the file here
		// const path = join(outputDir, `${config.name.replace('{{dims}}', `${width}x${height}`)}.svg`);
		// await writeFile(path, svgContent);

		icons.push({
			path: `${outputDir}/${config.name}.svg`,
			format: 'customSvg',
			dimensions: { width, height },
			size: Buffer.from(svgContent).length,
		});
	}

	return icons;
}

// Step 4: Create a plugin to handle your format (optional)
const _customSvgPlugin: Plugin = {
	name: 'custom-svg-generator',
	version: '1.0.0',

	execute: async ({ image }) => {
		// Add custom SVG processing here
		return image;
	},
};

// Step 5: Use your custom format with full type safety!
const customSvgConfig: IconConfig<'customSvg'> = {
	type: 'customSvg', // ✓ TypeScript knows this is valid!
	name: 'icon-{{dims}}',
	sizes: [24, 48, 96],
	options: {
		// ✓ TypeScript provides autocomplete for CustomSvgOptions!
		optimize: true,
		removeViewBox: false,
		pretty: true,
	},
};

console.log('Custom SVG format configuration:', customSvgConfig);

// Example: PDF format
interface PdfOptions {
	pageSize?: 'A4' | 'letter' | 'legal';
	orientation?: 'portrait' | 'landscape';
	margin?: number;
}

// Extend the registry to add PDF support
declare module '../src/types/registry.types' {
	interface IconFormatRegistry {
		pdf: PdfOptions;
	}
}

// Now 'pdf' is a valid IconFormat! No more type errors!
const pdfConfig: IconConfig<'pdf'> = {
	type: 'pdf', // ✓ No error! TypeScript knows 'pdf' is valid
	name: 'icon-{{dims}}',
	sizes: [512],
	options: {
		// ✓ TypeScript provides autocomplete for PdfOptions!
		pageSize: 'A4',
		orientation: 'portrait',
		margin: 20,
	},
};

console.log('Custom PDF format configuration:', pdfConfig);

/**
 * Key Benefits:
 *
 * 1. Full TypeScript type safety
 * 2. IDE autocomplete for custom formats
 * 3. Compile-time validation
 * 4. No runtime errors from typos
 * 5. Easy to extend and maintain
 */
