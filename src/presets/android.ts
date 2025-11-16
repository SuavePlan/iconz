/**
 * Android Preset
 *
 * Modern Android app icon specifications (2024-2025)
 * Supports adaptive icons, legacy icons, and Play Store requirements.
 */

import type { Preset } from '../types/types';

/**
 * Android App Icon Preset
 *
 * Based on Android's latest requirements:
 * - 512x512 for Play Store
 * - 192x192 for adaptive icons
 * - Various densities (mdpi through xxxhdpi)
 */
export const androidPreset: Preset = {
	name: 'Android',
	description: 'Android app icons for all densities and Play Store (2024-2025)',
	icons: {
		playStore: {
			type: 'png',
			name: 'ic_launcher-playstore',
			sizes: [512],
			folder: 'android',
		},
		adaptive: {
			type: 'png',
			name: 'ic_launcher-{{dims}}',
			sizes: [192, 144, 96, 72, 48],
			folder: 'android/adaptive',
		},
		legacy: {
			type: 'png',
			name: 'ic_launcher_legacy-{{dims}}',
			sizes: [512, 192, 144, 96, 72, 48, 36],
			folder: 'android/legacy',
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
 * Android Adaptive Icon Preset
 *
 * For modern Android apps with adaptive icons.
 * Requires separate foreground and background layers.
 */
export const androidAdaptivePreset: Preset = {
	name: 'Android Adaptive',
	description: 'Android adaptive icons with safe zone (40% radius)',
	icons: {
		foreground: {
			type: 'png',
			name: 'ic_launcher_foreground-{{dims}}',
			sizes: [432, 324, 216, 162, 108],
			folder: 'android/adaptive/foreground',
		},
		monochrome: {
			type: 'png',
			name: 'ic_launcher_monochrome-{{dims}}',
			sizes: [432, 324, 216, 162, 108],
			folder: 'android/adaptive/monochrome',
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
