/**
 * Windows Preset
 *
 * Modern Windows icon specifications (2024-2025)
 * Supports Windows 11, Windows 10, and legacy Windows applications.
 */

import type { Preset } from '../types/types';

/**
 * Windows 11 App Icon Preset
 *
 * Based on Windows 11 specifications:
 * - 256x256 for high-DPI displays
 * - Multiple sizes for scaling
 * - Fluent Design System compatible
 */
export const windows11Preset: Preset = {
	name: 'Windows 11',
	description: 'Windows 11 app icons with Fluent Design support (2024-2025)',
	icons: {
		app: {
			type: 'ico',
			name: 'app',
			sizes: [256, 128, 96, 64, 48, 32, 24, 16],
			folder: 'windows',
		},
		tile: {
			type: 'png',
			name: 'tile-{{dims}}',
			sizes: [310, 150, 70],
			folder: 'windows/tiles',
		},
		storeLogo: {
			type: 'png',
			name: 'store-logo-{{dims}}',
			sizes: [300, 150, 50],
			folder: 'windows/store',
		},
	},
	options: {
		format: 'png',
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	},
};

/**
 * Windows Legacy Preset
 *
 * For Windows 7/8/10 compatibility
 */
export const windowsLegacyPreset: Preset = {
	name: 'Windows Legacy',
	description: 'Windows 7/8/10 app icons',
	icons: {
		app: {
			type: 'ico',
			name: 'app',
			sizes: [256, 128, 64, 48, 32, 24, 16],
			folder: 'windows',
		},
		msTile: {
			type: 'png',
			name: 'mstile-{{dims}}',
			sizes: ['310x150', 310, 270, 150, 144, 70],
			folder: 'windows/tiles',
		},
	},
	options: {
		format: 'png',
		quality: 100,
	},
};

/**
 * Windows Universal Preset
 *
 * Compatible with all Windows versions
 */
export const windowsUniversalPreset: Preset = {
	name: 'Windows Universal',
	description: 'Universal Windows icons (Windows 7 through 11)',
	icons: {
		app: {
			type: 'ico',
			name: 'app',
			sizes: [256, 128, 96, 64, 48, 32, 24, 16],
			folder: '.',
		},
	},
	options: {
		format: 'png',
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		},
	},
};
