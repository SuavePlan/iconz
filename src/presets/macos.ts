/**
 * macOS Preset
 *
 * Modern macOS icon specifications (2024-2025)
 * Supports macOS 11+ with "liquid glass" effect and Retina displays.
 */

import type { Preset } from '../types/types';

/**
 * macOS App Icon Preset
 *
 * Based on macOS 11+ specifications:
 * - 1024x1024 source for asset catalog
 * - Multiple sizes with @2x Retina support
 * - Optimized for "liquid glass" effect
 */
export const macosPreset: Preset = {
	name: 'macOS',
	description: 'macOS app icons with Retina support (macOS 11+)',
	icons: {
		appIcon: {
			type: 'icns',
			name: 'AppIcon',
			sizes: [1024, 512, 256, 128, 64, 32, 16],
			folder: 'macos',
		},
	},
	options: {
		format: 'png',
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		},
	},
};

/**
 * macOS Document Icon Preset
 *
 * For document type icons
 */
export const macosDocumentPreset: Preset = {
	name: 'macOS Document',
	description: 'macOS document type icons',
	icons: {
		document: {
			type: 'icns',
			name: 'DocIcon',
			sizes: [512, 256, 128, 32, 16],
			folder: 'macos/documents',
		},
	},
	options: {
		format: 'png',
		quality: 100,
	},
};

/**
 * macOS Asset Catalog Preset
 *
 * Individual PNG sizes for Xcode asset catalogs
 */
export const macosAssetCatalogPreset: Preset = {
	name: 'macOS Asset Catalog',
	description: 'Individual PNG files for Xcode asset catalog',
	icons: {
		iconset: {
			type: 'png',
			name: 'icon_{{dims}}',
			sizes: [1024, 512, 256, 128, 64, 32, 16],
			folder: 'macos/AppIcon.iconset',
		},
		iconset2x: {
			type: 'png',
			name: 'icon_{{width}}x{{height}}@2x',
			sizes: [512, 256, 128, 64, 32, 16],
			folder: 'macos/AppIcon.iconset',
		},
	},
	options: {
		format: 'png',
		quality: 100,
	},
};
