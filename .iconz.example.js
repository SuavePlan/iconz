/**
 * Example Iconz Configuration
 *
 * Copy this file to iconz.config.js and customize for your project.
 */

import { pwaCompletePreset } from 'iconz/presets';

export default {
	// Input source image
	input: './logo.svg',

	// Output directory
	output: './public',

	// Temporary directory (optional)
	// temp: './temp',

	// Use a preset as base
	...pwaCompletePreset,

	// Customize or add icon configurations
	icons: {
		// Include all PWA preset icons
		...pwaCompletePreset.icons,

		// Add custom icons
		customIcons: {
			type: 'png',
			name: 'custom-{{dims}}',
			sizes: [64, 128, 256, 512],
			folder: 'custom',
		},
	},

	// Processing options
	options: {
		quality: 95,
		format: 'png',
		resize: {
			fit: 'contain',
			background: { r: 0, g: 0, b: 0, alpha: 0 },
			kernel: 'lanczos3',
		},
	},

	// Add plugins (optional)
	// plugins: [watermarkPlugin, optimizePlugin],

	// Clean temporary files after generation
	cleanTemp: true,
};
