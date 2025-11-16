/**
 * Optimization Plugin
 *
 * Advanced image optimization using Sharp's built-in features.
 * Reduces file size while maintaining visual quality.
 */

import type sharp from 'sharp';
import type { Plugin } from '../types/types';
import type { OptimizationConfig } from './optimization.types';

/**
 * Image optimization plugin
 */
export const optimizationPlugin: Plugin<OptimizationConfig, sharp.Sharp> = {
	name: 'optimization',
	version: '1.0.0',

	execute: async ({ image, config }) => {
		const options = config || {};
		const quality = options.quality ?? 90;
		const aggressive = options.aggressive ?? false;
		const stripMetadata = options.stripMetadata ?? true;

		// Strip metadata to reduce file size
		if (stripMetadata) {
			image.withMetadata({
				orientation: undefined,
				density: 72, // Standard web density
			});
		}

		if (options.lossless) {
			// Lossless optimization
			image.png({
				compressionLevel: 9,
				quality: 100,
				effort: aggressive ? 10 : 7,
			});
		} else {
			// Lossy optimization for better compression
			image.png({
				compressionLevel: 9,
				quality: quality,
				effort: aggressive ? 10 : 7,
				palette: true, // Use palette for better compression
			});
		}

		// Apply sharpening for better perceived quality
		if (!aggressive) {
			image.sharpen({
				sigma: 0.5,
				m1: 1.0,
				m2: 0.5,
			});
		}

		return image;
	},
};

/**
 * Aggressive optimization (slower, better results)
 */
export const aggressiveOptimization: Plugin<OptimizationConfig, sharp.Sharp> = {
	name: 'aggressive-optimization',
	version: '1.0.0',
	execute: async (context) => {
		return optimizationPlugin.execute({
			...context,
			config: { ...context.config, aggressive: true },
		});
	},
};

/**
 * Fast optimization (faster, good results)
 */
export const fastOptimization: Plugin<OptimizationConfig, sharp.Sharp> = {
	name: 'fast-optimization',
	version: '1.0.0',
	execute: async (context) => {
		return optimizationPlugin.execute({
			...context,
			config: { ...context.config, aggressive: false, quality: 85 },
		});
	},
};
