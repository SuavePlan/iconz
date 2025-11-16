/**
 * Image Processor Module
 *
 * Core image processing using Sharp with generic support for plugins and transforms.
 * Handles loading, resizing, format conversion, and optimization.
 */

import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import type {
	Dimensions,
	IconFormat,
	IconSize,
	Plugin,
	PluginContext,
	ProcessingOptions,
} from '../types/types';
import { parseDimensions } from '../types/types';
import './builtin-formats'; // Auto-register built-in formats
import { getFormatConverter, getFormatProcessingOptions } from './format-registry';

export class ImageProcessor<TPluginConfig = unknown> {
	private sharp: sharp.Sharp;
	private buffer: Buffer | null = null;
	private plugins: Plugin<TPluginConfig>[] = [];
	private options: ProcessingOptions;

	constructor(options: ProcessingOptions = {}) {
		this.options = options;
		this.sharp = sharp(undefined, options.input);
	}

	/**
	 * Load image from file path or buffer
	 */
	async load(input: string | Buffer): Promise<this> {
		if (Buffer.isBuffer(input)) {
			this.buffer = input;
		} else {
			this.buffer = await readFile(input);
		}

		this.sharp = sharp(this.buffer, this.options.input);
		return this;
	}

	/**
	 * Add a plugin to the processing pipeline
	 */
	use(plugin: Plugin<TPluginConfig>): this {
		this.plugins.push(plugin);
		return this;
	}

	/**
	 * Get image metadata
	 */
	async metadata(): Promise<sharp.Metadata> {
		return await this.sharp.metadata();
	}

	/**
	 * Resize image to specific dimensions
	 */
	async resize(size: IconSize, options?: sharp.ResizeOptions): Promise<Buffer> {
		if (!this.buffer) {
			throw new Error('No image loaded. Call load() first.');
		}

		const dimensions = parseDimensions(size);
		const resizeOptions: sharp.ResizeOptions = {
			...this.options.resize,
			...options,
			width: dimensions.width,
			height: dimensions.height,
		};

		// Create a clone for this resize operation
		let instance = sharp(this.buffer, this.options.input);

		// Apply plugins
		if (this.plugins.length > 0) {
			const context: PluginContext<TPluginConfig> = {
				config: {} as TPluginConfig,
				buffer: this.buffer,
				image: instance,
			};

			for (const plugin of this.plugins) {
				await plugin.execute(context);
				instance = context.image;
			}
		}

		// Resize
		instance = instance.resize(resizeOptions);

		return await instance.toBuffer();
	}

	/**
	 * Convert buffer to specific format using registered format converters
	 */
	async toFormat(buffer: Buffer, format: IconFormat, dimensions: Dimensions): Promise<Buffer> {
		let instance = sharp(buffer);

		// Get registered format converter and options
		const converter = getFormatConverter(format);
		const formatOptions = getFormatProcessingOptions(format);

		// Apply format conversion using registered converter
		if (converter && formatOptions) {
			instance = converter(instance, formatOptions, this.options.quality);
		} else {
			// Fallback to PNG for formats without registered converters
			instance = instance.png({ compressionLevel: 9 });
		}

		// Ensure dimensions are correct
		instance = instance.resize(dimensions.width, dimensions.height, {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		});

		return await instance.toBuffer();
	}

	/**
	 * Generate multiple sizes from source image
	 */
	async generateSizes(
		sizes: IconSize[],
		format: IconFormat = 'png',
	): Promise<Map<IconSize, Buffer>> {
		const results = new Map<IconSize, Buffer>();

		for (const size of sizes) {
			const resized = await this.resize(size);
			const dimensions = parseDimensions(size);
			const formatted = await this.toFormat(resized, format, dimensions);
			results.set(size, formatted);
		}

		return results;
	}

	/**
	 * Clone the processor with current settings
	 */
	clone(): ImageProcessor<TPluginConfig> {
		const processor = new ImageProcessor<TPluginConfig>(this.options);
		processor.buffer = this.buffer;
		processor.plugins = [...this.plugins];
		return processor;
	}

	/**
	 * Clean up resources
	 */
	async cleanup(): Promise<void> {
		for (const plugin of this.plugins) {
			if (plugin.teardown) {
				await plugin.teardown();
			}
		}
	}
}

/**
 * Create a new image processor instance
 */
export function createProcessor<TPluginConfig = unknown>(
	options?: ProcessingOptions,
): ImageProcessor<TPluginConfig> {
	return new ImageProcessor<TPluginConfig>(options);
}
