/**
 * Chrome Extension Presets
 *
 * Icon configurations for Chrome/Edge extensions.
 * Supports Manifest V3 specifications.
 *
 * References:
 * - https://developer.chrome.com/docs/extensions/mv3/manifest/icons/
 * - https://developer.chrome.com/docs/webstore/images/
 */

import type { Preset } from '../types/types';

/**
 * Chrome Extension Icons (Manifest V3)
 *
 * Complete icon set for Chrome extensions following Manifest V3.
 *
 * Required sizes:
 * - 16x16: Favicon on extension pages
 * - 32x32: Windows computers often require this size
 * - 48x48: Extension management page
 * - 128x128: Chrome Web Store and installation
 *
 * Output structure:
 * ```
 * icons/
 *   ├── icon-16.png
 *   ├── icon-32.png
 *   ├── icon-48.png
 *   └── icon-128.png
 * ```
 *
 * manifest.json example:
 * ```json
 * {
 *   "icons": {
 *     "16": "icons/icon-16.png",
 *     "32": "icons/icon-32.png",
 *     "48": "icons/icon-48.png",
 *     "128": "icons/icon-128.png"
 *   }
 * }
 * ```
 */
export const chromeExtensionPreset: Preset = {
	name: 'chromeExtension',
	description: 'Chrome Extension icons (Manifest V3)',
	icons: {
		extensionIcons: {
			type: 'png',
			name: 'icon-{{width}}',
			sizes: [16, 32, 48, 128],
			folder: 'icons',
			enabled: true,
		},
	},
	options: {
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		},
	},
};

/**
 * Chrome Extension Complete Icons
 *
 * Extended icon set including Chrome Web Store assets.
 *
 * Includes:
 * - Extension icons (16, 32, 48, 128)
 * - Action icons (16, 24, 32)
 * - Chrome Web Store images (128, 440x280 promo)
 *
 * Output structure:
 * ```
 * icons/
 *   ├── icon-16.png
 *   ├── icon-32.png
 *   ├── icon-48.png
 *   ├── icon-128.png
 *   ├── action-16.png
 *   ├── action-24.png
 *   ├── action-32.png
 *   └── store-128.png
 * ```
 */
export const chromeExtensionCompletePreset: Preset = {
	name: 'chromeExtensionComplete',
	description: 'Chrome Extension icons with Web Store assets',
	icons: {
		extensionIcons: {
			type: 'png',
			name: 'icon-{{width}}',
			sizes: [16, 32, 48, 128],
			folder: 'icons',
			enabled: true,
		},
		actionIcons: {
			type: 'png',
			name: 'action-{{width}}',
			sizes: [16, 24, 32],
			folder: 'icons',
			enabled: true,
		},
		storeIcon: {
			type: 'png',
			name: 'store-128',
			sizes: [128],
			folder: 'icons',
			enabled: true,
		},
	},
	options: {
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		},
	},
};

/**
 * Edge Extension Icons
 *
 * Microsoft Edge Add-on icons (same as Chrome but with Edge branding).
 *
 * Output structure:
 * ```
 * assets/
 *   ├── icon-16.png
 *   ├── icon-32.png
 *   ├── icon-48.png
 *   └── icon-128.png
 * ```
 */
export const edgeExtensionPreset: Preset = {
	name: 'edgeExtension',
	description: 'Microsoft Edge Extension icons',
	icons: {
		extensionIcons: {
			type: 'png',
			name: 'icon-{{width}}',
			sizes: [16, 32, 48, 128],
			folder: 'assets',
			enabled: true,
		},
	},
	options: {
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		},
	},
};

/**
 * Firefox Extension Icons
 *
 * Firefox Add-on icons following Mozilla specifications.
 *
 * Required sizes:
 * - 48x48: Add-on manager
 * - 96x96: Add-on manager @2x
 * - 128x128: Firefox Add-ons store
 *
 * Output structure:
 * ```
 * icons/
 *   ├── icon-48.png
 *   ├── icon-96.png
 *   └── icon-128.png
 * ```
 *
 * manifest.json example:
 * ```json
 * {
 *   "icons": {
 *     "48": "icons/icon-48.png",
 *     "96": "icons/icon-96.png"
 *   }
 * }
 * ```
 */
export const firefoxExtensionPreset: Preset = {
	name: 'firefoxExtension',
	description: 'Firefox Extension icons',
	icons: {
		extensionIcons: {
			type: 'png',
			name: 'icon-{{width}}',
			sizes: [48, 96, 128],
			folder: 'icons',
			enabled: true,
		},
	},
	options: {
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		},
	},
};

/**
 * Universal Browser Extension Icons
 *
 * Cross-browser compatible icon set for Chrome, Edge, Firefox, and Safari.
 * Includes all required sizes for all major browsers.
 *
 * Output structure:
 * ```
 * icons/
 *   ├── icon-16.png   (Chrome/Edge favicon)
 *   ├── icon-24.png   (Action icons)
 *   ├── icon-32.png   (Chrome/Edge, Action icons)
 *   ├── icon-48.png   (Chrome/Edge/Firefox)
 *   ├── icon-96.png   (Firefox @2x)
 *   └── icon-128.png  (All stores)
 * ```
 */
export const universalExtensionPreset: Preset = {
	name: 'universalExtension',
	description: 'Universal browser extension icons (Chrome, Edge, Firefox, Safari)',
	icons: {
		extensionIcons: {
			type: 'png',
			name: 'icon-{{width}}',
			sizes: [16, 24, 32, 48, 96, 128],
			folder: 'icons',
			enabled: true,
		},
	},
	options: {
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		},
	},
};
