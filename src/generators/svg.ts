/**
 * SVG Generator Module
 *
 * Enhanced SVG support with optimization and format conversion.
 * Note: SVG optimization requires external tools (svgo) for best results.
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { GeneratedIcon, IconConfig, IconSize } from '../types/types';
import { parseDimensions } from '../types/types';
import { ensureDir } from '../utils/paths';
import { createTemplateVariables, parseTemplate } from '../utils/template';

export interface SvgGeneratorOptions {
	outputDir: string;
	counter?: number;
}

/**
 * SVG options for output configuration
 */
export interface SvgOptions {
	/** Pretty print SVG with indentation (default: false) */
	pretty?: boolean;
	/** Remove XML declaration (default: false) */
	removeXmlDeclaration?: boolean;
	/** Add width/height attributes (default: true) */
	addDimensions?: boolean;
	/** Custom viewBox (overrides size-based viewBox) */
	viewBox?: string;
}

/**
 * Generate SVG files from buffers
 *
 * Note: This generator assumes the input is already SVG format.
 * For PNG/JPEG to SVG conversion, consider using external tools.
 */
export async function generateSvgIcons(
	buffers: Map<IconSize, Buffer>,
	config: IconConfig,
	options: SvgGeneratorOptions,
): Promise<GeneratedIcon[]> {
	const icons: GeneratedIcon[] = [];
	const outputDir = config.folder ? join(options.outputDir, config.folder) : options.outputDir;

	await ensureDir(outputDir);

	let counter = options.counter ?? 1;

	for (const [size, buffer] of buffers) {
		const dimensions = parseDimensions(size);
		const vars = createTemplateVariables(size, counter++);
		const filename = `${parseTemplate(config.name, vars)}.svg`;
		const path = join(outputDir, filename);

		// Process SVG buffer with options
		let svgContent = buffer.toString('utf-8');

		if (config.options) {
			const svgOptions = config.options as SvgOptions;

			// Add or update dimensions
			if (svgOptions.addDimensions !== false) {
				// Simple regex-based dimension setting
				// Note: This is basic and may not work for all SVG formats
				if (!svgContent.includes('width=')) {
					svgContent = svgContent.replace(
						/<svg/,
						`<svg width="${dimensions.width}" height="${dimensions.height}"`,
					);
				}
			}

			// Update viewBox
			if (svgOptions.viewBox) {
				if (svgContent.includes('viewBox=')) {
					svgContent = svgContent.replace(/viewBox="[^"]*"/, `viewBox="${svgOptions.viewBox}"`);
				} else {
					svgContent = svgContent.replace(/<svg/, `<svg viewBox="${svgOptions.viewBox}"`);
				}
			} else if (svgOptions.addDimensions !== false && !svgContent.includes('viewBox=')) {
				// Add default viewBox based on dimensions
				svgContent = svgContent.replace(
					/<svg/,
					`<svg viewBox="0 0 ${dimensions.width} ${dimensions.height}"`,
				);
			}

			// Remove XML declaration
			if (svgOptions.removeXmlDeclaration) {
				svgContent = svgContent.replace(/<\?xml[^>]*\?>\s*/g, '');
			}

			// Pretty print (basic formatting)
			if (svgOptions.pretty) {
				// This is very basic - for production use, consider svgo or prettier
				svgContent = svgContent
					.replace(/></g, '>\n<')
					.split('\n')
					.map((line, i) => {
						const depth = (line.match(/<[^/]/g) || []).length;
						return i === 0 ? line : '\t'.repeat(Math.max(0, depth - 1)) + line;
					})
					.join('\n');
			}
		}

		await writeFile(path, svgContent, 'utf-8');

		icons.push({
			path,
			format: 'svg',
			dimensions,
			size: Buffer.byteLength(svgContent, 'utf-8'),
		});
	}

	return icons;
}

/**
 * Validate SVG sizes (SVG can be any size, always returns true)
 */
export function validateSvgSizes(_sizes: IconSize[]): boolean {
	return true; // SVG is scalable, all sizes are valid
}

/**
 * Get recommended SVG sizes for different use cases
 */
export function getRecommendedSvgSizes(useCase: 'web' | 'print' | 'icon'): number[] {
	switch (useCase) {
		case 'web':
			// Common web icon sizes
			return [24, 32, 48, 64];
		case 'print':
			// High resolution for print
			return [512, 1024, 2048];
		case 'icon':
			// Standard icon sizes
			return [16, 24, 32, 48, 64, 128, 256];
		default:
			return [24, 48, 64, 128];
	}
}

/**
 * Check if a buffer contains SVG content
 */
export function isSvgBuffer(buffer: Buffer): boolean {
	const content = buffer.toString('utf-8', 0, Math.min(buffer.length, 1000));
	return content.includes('<svg') || content.includes('<?xml');
}
