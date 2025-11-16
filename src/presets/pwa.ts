/**
 * PWA (Progressive Web App) Preset
 *
 * Modern PWA icon specifications (2024-2025)
 * Supports maskable icons, any-purpose icons, and all platforms.
 */

import type { Preset } from '../types/types';

/**
 * PWA Standard Icons Preset
 *
 * Based on web.dev requirements:
 * - 192x192 minimum for installability
 * - 512x512 for splash screens
 * - Multiple sizes for different contexts
 */
export const pwaPreset: Preset = {
	name: 'PWA',
	description: 'Progressive Web App icons for all platforms (2024-2025)',
	icons: {
		standard: {
			type: 'png',
			name: 'icon-{{dims}}',
			sizes: [512, 384, 256, 192, 144, 96, 72, 48],
			folder: 'pwa',
		},
		favicon: {
			type: 'ico',
			name: 'favicon',
			sizes: [48, 32, 16],
			folder: 'pwa',
		},
		appleTouchIcon: {
			type: 'png',
			name: 'apple-touch-icon',
			sizes: [180],
			folder: 'pwa',
		},
	},
	options: {
		format: 'png',
		quality: 95,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	},
};

/**
 * PWA Maskable Icons Preset
 *
 * For adaptive icons on Android with safe zone.
 * Important: Icon content must be within 40% radius from center.
 */
export const pwaMaskablePreset: Preset = {
	name: 'PWA Maskable',
	description: 'PWA maskable icons with 40% safe zone for Android adaptive icons',
	icons: {
		maskable: {
			type: 'png',
			name: 'icon-maskable-{{dims}}',
			sizes: [512, 384, 256, 192],
			folder: 'pwa/maskable',
		},
	},
	options: {
		format: 'png',
		quality: 95,
		resize: {
			fit: 'contain',
			background: { r: 255, g: 255, b: 255, alpha: 1 }, // Maskable icons need opaque background
		},
	},
};

/**
 * PWA Complete Preset
 *
 * Comprehensive PWA icon set including:
 * - Standard icons (any purpose)
 * - Maskable icons (adaptive)
 * - Favicons
 * - Apple touch icons
 */
export const pwaCompletePreset: Preset = {
	name: 'PWA Complete',
	description: 'Complete PWA icon set with all formats and purposes',
	icons: {
		any: {
			type: 'png',
			name: 'icon-{{dims}}',
			sizes: [512, 384, 256, 192, 144, 96, 72, 48],
			folder: 'pwa/any',
		},
		maskable: {
			type: 'png',
			name: 'icon-maskable-{{dims}}',
			sizes: [512, 384, 256, 192],
			folder: 'pwa/maskable',
		},
		favicon: {
			type: 'ico',
			name: 'favicon',
			sizes: [48, 32, 16],
			folder: '.',
		},
		faviconPng: {
			type: 'png',
			name: 'favicon-{{dims}}',
			sizes: [32, 16],
			folder: '.',
		},
		appleTouchIcon: {
			type: 'png',
			name: 'apple-touch-icon',
			sizes: [180, 167, 152, 120],
			folder: '.',
		},
	},
	options: {
		format: 'png',
		quality: 95,
	},
};
