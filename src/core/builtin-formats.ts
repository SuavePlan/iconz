/**
 * Built-in Format Registration
 *
 * Registers all built-in icon formats with their generators and validators.
 * This file is imported by the main iconz module to set up default formats.
 */

import type sharp from 'sharp';
import { generateIcnsIcon, validateIcnsSizes } from '../generators/icns';
import { generateIcoIcon, validateIcoSizes } from '../generators/ico';
import { generateAvifIcons, generatePngIcons, generateWebpIcons } from '../generators/png';
import { generateSvgIcons, validateSvgSizes } from '../generators/svg';
import {
	registerCompositeFormat,
	registerFormatConverter,
	registerFormatGenerator,
	registerFormatProcessingOptions,
	registerFormatValidator,
} from './format-registry';

/**
 * Register all built-in formats
 * Called automatically when the module is imported
 */
export function registerBuiltinFormats(): void {
	// PNG format
	registerFormatGenerator('png', generatePngIcons);
	registerFormatProcessingOptions('png', {
		compressionLevel: 9,
	});
	registerFormatConverter('png', (instance, options) => instance.png(options as sharp.PngOptions));

	// WebP format
	registerFormatGenerator('webp', generateWebpIcons);
	registerFormatProcessingOptions('webp', {
		lossless: false,
	});
	registerFormatConverter('webp', (instance, options, quality) =>
		instance.webp({ ...(options as sharp.WebpOptions), quality: quality ?? 90 }),
	);

	// AVIF format
	registerFormatGenerator('avif', generateAvifIcons);
	registerFormatProcessingOptions('avif', {});
	registerFormatConverter('avif', (instance, options, quality) =>
		instance.avif({ ...(options as sharp.AvifOptions), quality: quality ?? 80 }),
	);

	// JPEG format (uses PNG generator with JPEG output)
	registerFormatGenerator('jpeg', generatePngIcons);
	registerFormatProcessingOptions('jpeg', {
		chromaSubsampling: '4:4:4',
	});
	registerFormatConverter('jpeg', (instance, options, quality) =>
		instance.jpeg({ ...(options as sharp.JpegOptions), quality: quality ?? 90 }),
	);

	// ICO format (composite - generated from PNG)
	registerFormatGenerator('ico', generateIcoIcon);
	registerFormatValidator('ico', validateIcoSizes);
	registerCompositeFormat('ico', 'png');
	registerFormatProcessingOptions('ico', {
		compressionLevel: 9,
	});
	registerFormatConverter('ico', (instance, options) => instance.png(options as sharp.PngOptions));

	// ICNS format (composite - generated from PNG)
	registerFormatGenerator('icns', generateIcnsIcon);
	registerFormatValidator('icns', validateIcnsSizes);
	registerCompositeFormat('icns', 'png');
	registerFormatProcessingOptions('icns', {
		compressionLevel: 9,
	});
	registerFormatConverter('icns', (instance, options) => instance.png(options as sharp.PngOptions));

	// SVG format (vector graphics)
	registerFormatGenerator('svg', generateSvgIcons);
	registerFormatValidator('svg', validateSvgSizes);
	registerCompositeFormat('svg', 'png'); // Generate from PNG for processing
	registerFormatProcessingOptions('svg', {
		pretty: false,
		removeXmlDeclaration: false,
		addDimensions: true,
	});
	registerFormatConverter('svg', (instance, options) => instance.png(options as sharp.PngOptions)); // Convert through PNG
}

// Auto-register built-in formats when this module is imported
registerBuiltinFormats();
