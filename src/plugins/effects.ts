/**
 * Effects Plugin
 *
 * Visual effects and image enhancements.
 * Includes watermarks, shadows, borders, and more.
 */

import { readFile } from 'node:fs/promises';
import type sharp from 'sharp';
import type { Plugin } from '../types/types';
import type {
	BorderConfig,
	EnhancementConfig,
	ShadowConfig,
	WatermarkConfig,
} from './effects.types';

/**
 * Watermark plugin
 */
export function createWatermarkPlugin(
	config: WatermarkConfig,
): Plugin<WatermarkConfig, sharp.Sharp> {
	return {
		name: 'watermark',
		version: '1.0.0',

		setup: async () => {
			// Validate watermark image exists
			try {
				await readFile(config.image);
			} catch {
				throw new Error(`Watermark image not found: ${config.image}`);
			}
		},

		execute: async ({ image }) => {
			const watermarkBuffer = await readFile(config.image);
			const opacity = config.opacity ?? 0.3;
			const position = config.position ?? 'southeast';

			// Apply watermark
			image.composite([
				{
					input: watermarkBuffer,
					gravity: position,
					blend: 'over',
				},
			]);

			// Apply opacity by modulating the watermark
			if (opacity < 1) {
				image.modulate({
					brightness: 1,
					saturation: 1,
					lightness: opacity,
				});
			}

			return image;
		},
	};
}

/**
 * Drop shadow plugin
 */
export function createShadowPlugin(config: ShadowConfig = {}): Plugin<ShadowConfig, sharp.Sharp> {
	return {
		name: 'shadow',
		version: '1.0.0',

		execute: async ({ image }) => {
			const blur = config.blur ?? 10;

			// Add padding for shadow
			const padding = blur * 2;

			image.extend({
				top: padding,
				bottom: padding,
				left: padding,
				right: padding,
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			});

			// Apply blur for shadow effect
			image.blur(blur / 2);

			return image;
		},
	};
}

/**
 * Border plugin
 */
export function createBorderPlugin(config: BorderConfig = {}): Plugin<BorderConfig, sharp.Sharp> {
	return {
		name: 'border',
		version: '1.0.0',

		execute: async ({ image }) => {
			const width = config.width ?? 2;
			const color = config.color ?? { r: 0, g: 0, b: 0, alpha: 1 };
			const radius = config.radius ?? 0;

			// Add border by extending the image
			image.extend({
				top: width,
				bottom: width,
				left: width,
				right: width,
				background: color,
			});

			// Apply rounded corners if specified
			if (radius > 0) {
				const metadata = await image.metadata();
				const w = metadata.width ?? 0;
				const h = metadata.height ?? 0;

				// Create rounded corner mask
				const roundedCorners = Buffer.from(
					`<svg><rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" ry="${radius}"/></svg>`,
				);

				image.composite([
					{
						input: roundedCorners,
						blend: 'dest-in',
					},
				]);
			}

			return image;
		},
	};
}

/**
 * Enhancement plugin
 */
export function createEnhancementPlugin(
	config: EnhancementConfig = {},
): Plugin<EnhancementConfig, sharp.Sharp> {
	return {
		name: 'enhancement',
		version: '1.0.0',

		execute: async ({ image }) => {
			const brightness = config.brightness ?? 0;
			const saturation = config.saturation ?? 0;
			const sharpness = config.sharpness ?? 0;

			// Apply color adjustments
			if (brightness !== 0 || saturation !== 0) {
				image.modulate({
					brightness: 1 + brightness / 100,
					saturation: 1 + saturation / 100,
				});
			}

			// Apply contrast
			if (config.contrast && config.contrast !== 0) {
				image.linear(1 + config.contrast / 100, 0);
			}

			// Apply sharpening
			if (sharpness > 0) {
				image.sharpen({
					sigma: sharpness / 2,
					m1: 1.0,
					m2: 0.5,
				});
			}

			return image;
		},
	};
}
