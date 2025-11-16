/**
 * Iconz Core Module
 *
 * Main icon generation engine that coordinates all components.
 * Provides a clean API for generating icons across all platforms.
 */

import type {
	GeneratedIcon,
	GenerationReport,
	IconConfig,
	IconFormat,
	IconSize,
	IconzConfig,
} from '../types/types';
import { cleanTempDir, createTempDir, ensureDir, resolveOutputPath } from '../utils/paths';
import './builtin-formats'; // Auto-register built-in formats
import { getFormatGenerator, getFormatValidator, getIntermediateFormat } from './format-registry';
import { createProcessor } from './processor';

export class Iconz<T extends Record<string, IconConfig> = Record<string, IconConfig>> {
	private config: IconzConfig<T>;
	private startTime = 0;

	constructor(config: IconzConfig<T>) {
		this.config = {
			cleanTemp: true,
			...config,
		};
	}

	/**
	 * Generate all icons based on configuration
	 */
	async generate(): Promise<GenerationReport<T>> {
		this.startTime = Date.now();

		const report: GenerationReport<T> = {
			icons: {} as Record<keyof T, GeneratedIcon[]>,
			failed: [],
			temp: [],
			stats: {
				total: 0,
				success: 0,
				failed: 0,
				duration: 0,
			},
		};

		try {
			// Resolve paths
			const outputDir = Buffer.isBuffer(this.config.input)
				? this.config.output
				: resolveOutputPath(this.config.output, this.config.input);

			await ensureDir(outputDir);

			// Create temporary directory
			const tempDir = this.config.temp || (await createTempDir());
			report.temp.push(tempDir);

			// Load and process image
			const processor = createProcessor(this.config.options);
			await processor.load(this.config.input);

			// Apply plugins
			if (this.config.plugins) {
				for (const plugin of this.config.plugins) {
					processor.use(plugin);
				}
			}

			// Process each icon configuration
			const icons = this.config.icons || ({} as T);
			let counter = 1;

			for (const [name, iconConfig] of Object.entries(icons)) {
				if (iconConfig.enabled === false) continue;

				report.stats.total += iconConfig.sizes.length;

				try {
					// Validate sizes based on format
					if (!this.validateSizes(iconConfig)) {
						throw new Error(
							`Invalid sizes for ${iconConfig.type} format. All sizes must be square.`,
						);
					}

					// Generate buffers for all sizes
					const buffers = await processor.generateSizes(
						iconConfig.sizes,
						this.getProcessingFormat(iconConfig.type),
					);

					// Generate icons based on type
					const generated = await this.generateByType(buffers, iconConfig, {
						outputDir,
						counter,
					});

					// Store results
					report.icons[name as keyof T] = Array.isArray(generated) ? generated : [generated];
					report.stats.success += Array.isArray(generated) ? generated.length : 1;
					counter += iconConfig.sizes.length;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					report.failed.push({
						config: name as keyof T,
						error: errorMessage,
					});
					report.stats.failed += iconConfig.sizes.length;
				}
			}

			// Cleanup
			await processor.cleanup();
			if (this.config.cleanTemp && tempDir !== this.config.temp) {
				await cleanTempDir(tempDir);
				report.temp = [];
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			throw new Error(`Icon generation failed: ${errorMessage}`);
		}

		report.stats.duration = Date.now() - this.startTime;
		return report;
	}

	/**
	 * Generate icons by type using registered format generators
	 */
	private async generateByType(
		buffers: Map<IconSize, Buffer>,
		config: IconConfig,
		options: { outputDir: string; counter: number },
	): Promise<GeneratedIcon | GeneratedIcon[]> {
		const generator = getFormatGenerator(config.type);

		if (!generator) {
			throw new Error(
				`Unsupported icon type: ${config.type}. No generator registered for this format.`,
			);
		}

		return await generator(buffers, config, options);
	}

	/**
	 * Validate sizes for specific icon type using registered validators
	 */
	private validateSizes(config: IconConfig): boolean {
		const validator = getFormatValidator(config.type);

		// If no validator is registered, assume sizes are valid
		if (!validator) {
			return true;
		}

		return validator(config.sizes);
	}

	/**
	 * Get the format to use for processing
	 * Composite formats (e.g., ICO, ICNS) use intermediate formats
	 */
	private getProcessingFormat(type: IconFormat): IconFormat {
		const intermediateFormat = getIntermediateFormat(type);
		return intermediateFormat || type;
	}

	/**
	 * Get configuration
	 */
	getConfig(): Readonly<IconzConfig<T>> {
		return this.config;
	}
}

/**
 * Create a new Iconz instance
 */
export function createIconz<T extends Record<string, IconConfig>>(
	config: IconzConfig<T>,
): Iconz<T> {
	return new Iconz<T>(config);
}
