/**
 * iOS Preset
 *
 * Modern iOS app icon specifications (2024-2025)
 * Supports iPhone, iPad, and App Store requirements.
 */

import type { Preset } from '../types/types';

/**
 * iOS App Icon Preset
 *
 * Based on Apple's latest requirements:
 * - 1024x1024 for App Store
 * - 180x180 for iPhone
 * - 167x167 for iPad Pro
 * - 152x152 for iPad/iPad Mini
 */
export const iosPreset: Preset = {
	name: 'iOS',
	description: 'iOS app icons for iPhone, iPad, and App Store (2024-2025)',
	icons: {
		appStore: {
			type: 'png',
			name: 'AppIcon-AppStore',
			sizes: [1024],
			folder: 'ios',
		},
		iphone: {
			type: 'png',
			name: 'AppIcon-iPhone-{{dims}}',
			sizes: [180, 120, 87, 80, 60, 58, 40, 29],
			folder: 'ios/iPhone',
		},
		ipad: {
			type: 'png',
			name: 'AppIcon-iPad-{{dims}}',
			sizes: [167, 152, 76, 40, 29],
			folder: 'ios/iPad',
		},
		unified: {
			type: 'png',
			name: 'AppIcon-{{dims}}',
			sizes: [1024, 180, 167, 152],
			folder: 'ios',
		},
	},
	options: {
		format: 'png',
		quality: 100,
		resize: {
			fit: 'contain',
			background: { r: 255, g: 255, b: 255, alpha: 1 },
			kernel: 'lanczos3',
		},
	},
};

/**
 * iOS Marketing Assets Preset
 * Additional sizes for marketing and promotional materials
 */
export const iosMarketingPreset: Preset = {
	name: 'iOS Marketing',
	description: 'iOS marketing and promotional icon sizes',
	icons: {
		marketing: {
			type: 'png',
			name: 'AppIcon-Marketing-{{dims}}',
			sizes: [1024, 512, 256],
			folder: 'ios/marketing',
		},
	},
	options: {
		format: 'png',
		quality: 100,
	},
};
