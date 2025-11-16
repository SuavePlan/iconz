/**
 * Compression Plugin
 *
 * Advanced compression strategies for different formats.
 * Uses Sharp's powerful compression features.
 */

import type sharp from 'sharp';
import type { Plugin } from '../types/types';
import type { CompressionConfig } from './compression.types';

/**
 * PNG compression plugin
 */
export const pngCompression: Plugin<CompressionConfig, sharp.Sharp> = {
	name: 'png-compression',
	version: '1.0.0',

	execute: async ({ image, config }) => {
		const options = config?.format?.png || {};

		image.png({
			compressionLevel: options.compressionLevel ?? 9,
			palette: options.palette ?? true,
			quality: 90,
			effort: options.effort ?? 10, // Max effort for best compression
			adaptiveFiltering: true, // Better compression
			progressive: false, // PNG doesn't support progressive
		});

		return image;
	},
};

/**
 * WebP compression plugin (better than PNG)
 */
export const webpCompression: Plugin<CompressionConfig, sharp.Sharp> = {
	name: 'webp-compression',
	version: '1.0.0',

	execute: async ({ image, config }) => {
		const options = config?.format?.webp || {};

		image.webp({
			quality: options.quality ?? 90,
			lossless: options.lossless ?? false,
			effort: options.effort ?? 6, // 0-6, higher = better compression
			smartSubsample: true,
		});

		return image;
	},
};

/**
 * AVIF compression plugin (best compression)
 */
export const avifCompression: Plugin<CompressionConfig, sharp.Sharp> = {
	name: 'avif-compression',
	version: '1.0.0',

	execute: async ({ image, config }) => {
		const quality = config?.format?.webp?.quality ?? 80;

		image.avif({
			quality: quality,
			effort: 9, // 0-9, higher = better compression
			chromaSubsampling: '4:4:4', // Better quality
		});

		return image;
	},
};

/**
 * Adaptive compression - chooses best settings based on image
 */
export const adaptiveCompression: Plugin<CompressionConfig, sharp.Sharp> = {
	name: 'adaptive-compression',
	version: '1.0.0',

	execute: async ({ image }) => {
		const metadata = await image.metadata();
		const hasAlpha = metadata.hasAlpha ?? false;
		const channels = metadata.channels ?? 3;

		// For images with alpha, use PNG with max compression
		if (hasAlpha) {
			image.png({
				compressionLevel: 9,
				quality: 90,
				effort: 10,
				palette: true,
			});
		}
		// For photos/complex images, use moderate quality
		else if (channels >= 3) {
			image.png({
				compressionLevel: 9,
				quality: 85,
				effort: 8,
				palette: false,
			});
		}
		// For simple images (icons), use palette
		else {
			image.png({
				compressionLevel: 9,
				quality: 90,
				effort: 10,
				palette: true,
			});
		}

		return image;
	},
};

/**
 * Ultra compression - maximum file size reduction
 */
export const ultraCompression: Plugin<CompressionConfig, sharp.Sharp> = {
	name: 'ultra-compression',
	version: '1.0.0',

	execute: async ({ image }) => {
		image.png({
			compressionLevel: 9,
			quality: 75, // Lower quality for smaller files
			effort: 10,
			palette: true,
			adaptiveFiltering: true,
			progressive: false,
		});

		// Apply additional processing for smaller files
		image.sharpen({ sigma: 0.3 }); // Sharpen to compensate for quality loss

		return image;
	},
};
