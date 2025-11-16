/**
 * Batch Processing Module
 *
 * Process multiple icon sources in parallel for maximum performance.
 * Leverages Bun's native parallelization capabilities.
 */

import { createIconz } from '../core/iconz';
import type { GeneratedIcon, GenerationReport, IconConfig, IconzConfig } from '../types/types';

/**
 * Batch configuration for multiple sources
 */
export interface BatchConfig<T extends Record<string, IconConfig> = Record<string, IconConfig>> {
	/** Array of icon configurations to process */
	sources: IconzConfig<T>[];
	/** Run in parallel (default: true) */
	parallel?: boolean;
	/** Maximum number of concurrent operations (default: 4) */
	concurrency?: number;
}

/**
 * Batch processing result
 */
export interface BatchResult<T extends Record<string, IconConfig> = Record<string, IconConfig>> {
	/** Results for each source */
	results: GenerationReport<T>[];
	/** Sources that failed completely */
	failed: Array<{
		index: number;
		config: IconzConfig<T>;
		error: string;
	}>;
	/** Aggregate statistics */
	stats: {
		totalSources: number;
		successfulSources: number;
		failedSources: number;
		totalIcons: number;
		totalDuration: number;
	};
}

/**
 * Process multiple icon sources in batch
 *
 * @example
 * ```typescript
 * import { processBatch, quick } from 'iconz';
 *
 * const result = await processBatch({
 *   sources: [
 *     quick.pwa('./logo-light.svg', './public/light'),
 *     quick.pwa('./logo-dark.svg', './public/dark'),
 *     quick.ios('./app-icon.svg', './assets'),
 *   ],
 *   parallel: true,
 *   concurrency: 4
 * });
 *
 * console.log(`Generated ${result.stats.totalIcons} icons from ${result.stats.totalSources} sources`);
 * ```
 */
export async function processBatch<T extends Record<string, IconConfig> = Record<string, IconConfig>>(
	config: BatchConfig<T>,
): Promise<BatchResult<T>> {
	const startTime = Date.now();
	const { sources, parallel = true, concurrency = 4 } = config;

	const results: GenerationReport<T>[] = [];
	const failed: BatchResult<T>['failed'] = [];

	if (parallel) {
		// Process in parallel with concurrency limit
		const batches: IconzConfig<T>[][] = [];
		for (let i = 0; i < sources.length; i += concurrency) {
			batches.push(sources.slice(i, i + concurrency));
		}

		for (const batch of batches) {
			const promises = batch.map(async (source, batchIndex) => {
				const globalIndex = batches.indexOf(batch) * concurrency + batchIndex;
				try {
					const iconz = createIconz(source);
					return await iconz.generate();
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					failed.push({
						index: globalIndex,
						config: source,
						error: errorMessage,
					});
					// Return empty report for failed sources
					return {
						icons: {} as Record<keyof T, GeneratedIcon[]>,
						failed: [],
						temp: [],
						stats: { total: 0, success: 0, failed: 0, duration: 0 },
					} as GenerationReport<T>;
				}
			});

			const batchResults = await Promise.all(promises);
			results.push(...batchResults);
		}
	} else {
		// Process sequentially
		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
			if (!source) continue;

			try {
				const iconz = createIconz(source);
				const result = await iconz.generate();
				results.push(result);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				failed.push({
					index: i,
					config: source,
					error: errorMessage,
				});
				// Add empty report for failed sources
				results.push({
					icons: {} as Record<keyof T, GeneratedIcon[]>,
					failed: [],
					temp: [],
					stats: { total: 0, success: 0, failed: 0, duration: 0 },
				} as GenerationReport<T>);
			}
		}
	}

	// Calculate aggregate stats
	const totalIcons = results.reduce((sum, r) => sum + r.stats.success, 0);
	const totalDuration = Date.now() - startTime;

	return {
		results,
		failed,
		stats: {
			totalSources: sources.length,
			successfulSources: sources.length - failed.length,
			failedSources: failed.length,
			totalIcons,
			totalDuration,
		},
	};
}

/**
 * Create a batch configuration from multiple sources
 *
 * @example
 * ```typescript
 * import { createBatch, quick } from 'iconz';
 *
 * const batch = createBatch(
 *   quick.pwa('./logo.svg'),
 *   quick.ios('./logo.svg'),
 *   quick.android('./logo.svg')
 * );
 *
 * const result = await processBatch(batch);
 * ```
 */
export function createBatch<T extends Record<string, IconConfig> = Record<string, IconConfig>>(
	...sources: IconzConfig<T>[]
): BatchConfig<T> {
	return {
		sources,
		parallel: true,
		concurrency: 4,
	};
}

/**
 * Process multiple sources with the same configuration
 *
 * @example
 * ```typescript
 * import { processSameSources } from 'iconz';
 *
 * const result = await processSameSources({
 *   inputs: ['./logo-light.svg', './logo-dark.svg', './logo-color.svg'],
 *   output: './public',
 *   icons: { ... },
 * });
 * ```
 */
export async function processSameSources<
	T extends Record<string, IconConfig> = Record<string, IconConfig>,
>(
	config: Omit<IconzConfig<T>, 'input'> & { inputs: Array<string | Buffer> },
): Promise<BatchResult<T>> {
	const { inputs, ...baseConfig } = config;

	const sources = inputs.map((input) => ({
		...baseConfig,
		input,
	})) as IconzConfig<T>[];

	return processBatch({ sources });
}
