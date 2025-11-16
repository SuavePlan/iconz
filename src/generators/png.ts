/**
 * PNG Generator Module
 *
 * Generates PNG icons in various sizes with optimized compression.
 * Supports transparency, custom backgrounds, and modern formats (WebP, AVIF).
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { GeneratedIcon, IconConfig, IconSize } from '../types/types';
import { parseDimensions } from '../types/types';
import { ensureDir } from '../utils/paths';
import { createTemplateVariables, parseTemplate } from '../utils/template';

export interface PngGeneratorOptions {
	outputDir: string;
	counter?: number;
}

/**
 * Generate PNG icons from processed buffers
 */
export async function generatePngIcons(
	buffers: Map<IconSize, Buffer>,
	config: IconConfig,
	options: PngGeneratorOptions,
): Promise<GeneratedIcon[]> {
	const icons: GeneratedIcon[] = [];
	const outputDir = config.folder ? join(options.outputDir, config.folder) : options.outputDir;

	await ensureDir(outputDir);

	let counter = options.counter ?? 1;

	for (const [size, buffer] of buffers) {
		const dimensions = parseDimensions(size);
		const vars = createTemplateVariables(size, counter++);
		const filename = `${parseTemplate(config.name, vars)}.png`;
		const path = join(outputDir, filename);

		await writeFile(path, buffer as Uint8Array);

		icons.push({
			path,
			format: 'png',
			dimensions,
			size: buffer.length,
		});
	}

	return icons;
}

/**
 * Generate WebP icons (modern format)
 */
export async function generateWebpIcons(
	buffers: Map<IconSize, Buffer>,
	config: IconConfig,
	options: PngGeneratorOptions,
): Promise<GeneratedIcon[]> {
	const icons: GeneratedIcon[] = [];
	const outputDir = config.folder ? join(options.outputDir, config.folder) : options.outputDir;

	await ensureDir(outputDir);

	let counter = options.counter ?? 1;

	for (const [size, buffer] of buffers) {
		const dimensions = parseDimensions(size);
		const vars = createTemplateVariables(size, counter++);
		const filename = `${parseTemplate(config.name, vars)}.webp`;
		const path = join(outputDir, filename);

		await writeFile(path, buffer as Uint8Array);

		icons.push({
			path,
			format: 'webp',
			dimensions,
			size: buffer.length,
		});
	}

	return icons;
}

/**
 * Generate AVIF icons (newest format, best compression)
 */
export async function generateAvifIcons(
	buffers: Map<IconSize, Buffer>,
	config: IconConfig,
	options: PngGeneratorOptions,
): Promise<GeneratedIcon[]> {
	const icons: GeneratedIcon[] = [];
	const outputDir = config.folder ? join(options.outputDir, config.folder) : options.outputDir;

	await ensureDir(outputDir);

	let counter = options.counter ?? 1;

	for (const [size, buffer] of buffers) {
		const dimensions = parseDimensions(size);
		const vars = createTemplateVariables(size, counter++);
		const filename = `${parseTemplate(config.name, vars)}.avif`;
		const path = join(outputDir, filename);

		await writeFile(path, buffer as Uint8Array);

		icons.push({
			path,
			format: 'avif',
			dimensions,
			size: buffer.length,
		});
	}

	return icons;
}
