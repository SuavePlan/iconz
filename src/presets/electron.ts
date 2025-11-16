/**
 * Electron Presets
 *
 * Icon configurations for Electron desktop applications.
 * Supports Windows, macOS, and Linux icon requirements.
 *
 * References:
 * - https://www.electron.build/icons
 * - https://www.electronjs.org/docs/latest/tutorial/icon-creation
 */

import type { Preset } from '../types/types';

/**
 * Electron Application Icons
 *
 * Complete icon set for cross-platform Electron apps.
 * Includes ICO (Windows), ICNS (macOS), and PNG (Linux).
 *
 * Sizes:
 * - Windows: ICO with 16, 24, 32, 48, 64, 128, 256
 * - macOS: ICNS with 16, 32, 64, 128, 256, 512, 1024
 * - Linux: PNG 512x512
 */
export const electronPreset: Preset = {
	name: 'electron',
	description: 'Electron desktop application icons (Windows, macOS, Linux)',
	icons: {
		windowsIco: {
			type: 'ico',
			name: 'icon',
			sizes: [16, 24, 32, 48, 64, 128, 256],
			folder: 'build',
			enabled: true,
		},
		macosIcns: {
			type: 'icns',
			name: 'icon',
			sizes: [16, 32, 64, 128, 256, 512, 1024],
			folder: 'build',
			enabled: true,
			options: {
				retina: true,
			},
		},
		linuxPng: {
			type: 'png',
			name: 'icon',
			sizes: [512],
			folder: 'build',
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
 * Electron Builder Icons
 *
 * Optimized for electron-builder packaging.
 * Generates all platform-specific icons in correct structure.
 *
 * Output structure:
 * ```
 * build/
 *   ├── icon.ico          (Windows)
 *   ├── icon.icns         (macOS)
 *   └── icon.png          (Linux - 512x512)
 * ```
 */
export const electronBuilderPreset: Preset = {
	name: 'electronBuilder',
	description: 'Electron Builder optimized icons',
	icons: {
		windows: {
			type: 'ico',
			name: 'icon',
			sizes: [16, 24, 32, 48, 64, 128, 256],
			folder: 'build',
			enabled: true,
		},
		macos: {
			type: 'icns',
			name: 'icon',
			sizes: [16, 32, 64, 128, 256, 512, 1024],
			folder: 'build',
			enabled: true,
			options: {
				retina: true,
			},
		},
		linux512: {
			type: 'png',
			name: '512x512',
			sizes: [512],
			folder: 'build/icons',
			enabled: true,
		},
		linux256: {
			type: 'png',
			name: '256x256',
			sizes: [256],
			folder: 'build/icons',
			enabled: true,
		},
		linux128: {
			type: 'png',
			name: '128x128',
			sizes: [128],
			folder: 'build/icons',
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
 * Electron Forge Icons
 *
 * Optimized for Electron Forge packaging.
 *
 * Output structure:
 * ```
 * assets/
 *   ├── icon.ico          (Windows)
 *   ├── icon.icns         (macOS)
 *   └── icon.png          (Linux)
 * ```
 */
export const electronForgePreset: Preset = {
	name: 'electronForge',
	description: 'Electron Forge optimized icons',
	icons: {
		windowsIco: {
			type: 'ico',
			name: 'icon',
			sizes: [16, 24, 32, 48, 64, 128, 256],
			folder: 'assets',
			enabled: true,
		},
		macosIcns: {
			type: 'icns',
			name: 'icon',
			sizes: [16, 32, 64, 128, 256, 512, 1024],
			folder: 'assets',
			enabled: true,
			options: {
				retina: true,
			},
		},
		linuxPng: {
			type: 'png',
			name: 'icon',
			sizes: [512],
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
