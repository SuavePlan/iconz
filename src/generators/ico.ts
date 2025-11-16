/**
 * ICO Generator Module
 *
 * Generates Windows ICO files containing multiple icon sizes.
 * Supports Windows 11 high-DPI displays and legacy compatibility.
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import pngToIco from 'png-to-ico';
import type { GeneratedIcon, IconConfig, IconSize } from '../types/types';
import { parseDimensions } from '../types/types';
import { ensureDir } from '../utils/paths';
import { createTemplateVariables, parseTemplate } from '../utils/template';

export interface IcoGeneratorOptions {
	outputDir: string;
	counter?: number;
}

/**
 * Generate ICO file from PNG buffers
 */
export async function generateIcoIcon(
	buffers: Map<IconSize, Buffer>,
	config: IconConfig,
	options: IcoGeneratorOptions,
): Promise<GeneratedIcon> {
	const outputDir = config.folder ? join(options.outputDir, config.folder) : options.outputDir;

	await ensureDir(outputDir);

	// Get largest size for template variables
	const sizes = Array.from(buffers.keys());
	const largestSize = sizes.reduce((max, size) => {
		const maxDims = parseDimensions(max);
		const sizeDims = parseDimensions(size);
		const maxArea = maxDims.width * maxDims.height;
		const sizeArea = sizeDims.width * sizeDims.height;
		return sizeArea > maxArea ? size : max;
	});

	const counter = options.counter ?? 1;
	const vars = createTemplateVariables(largestSize, counter);
	const filename = `${parseTemplate(config.name, vars)}.ico`;
	const path = join(outputDir, filename);

	// Convert PNG buffers to ICO
	// png-to-ico expects an array of buffers or file paths
	const pngBuffers = Array.from(buffers.values());
	const icoBuffer = await pngToIco(pngBuffers);

	await writeFile(path, icoBuffer as Uint8Array);

	const dimensions = parseDimensions(largestSize);

	return {
		path,
		format: 'ico',
		dimensions,
		size: icoBuffer.length,
	};
}

/**
 * Validate ICO icon sizes (must be square)
 */
export function validateIcoSizes(sizes: IconSize[]): boolean {
	for (const size of sizes) {
		const { width, height } = parseDimensions(size);
		if (width !== height) {
			return false;
		}
	}
	return true;
}
