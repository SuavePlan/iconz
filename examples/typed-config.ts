/**
 * Example: Using typed platform-specific configs
 *
 * This example shows how to use IconzConfig.PWA, IconzConfig.iOS, etc.
 * for full TypeScript IntelliSense and validation.
 */

import { createIconz, type IconzConfig } from '../src/iconz';

// PWA Configuration with full type safety
const pwaConfig: IconzConfig.PWA = {
	input: './logo.svg',
	output: './public',
	icons: {
		// TypeScript will show you valid icon names: standard, maskable, favicon, appleTouchIcon
		standard: {
			type: 'png',
			name: 'icon-{{dims}}',
			sizes: [192, 512],
		},
		maskable: {
			type: 'png',
			name: 'maskable-icon-{{dims}}',
			sizes: [192, 512],
		},
		favicon: {
			type: 'ico',
			name: 'favicon',
			sizes: [16, 32, 48],
		},
	},
};

// iOS Configuration with full type safety
const iosConfig: IconzConfig.iOS = {
	input: './logo.svg',
	output: './ios/Assets.xcassets',
	icons: {
		// TypeScript will show you valid icon names: appStore, iphone, ipad, marketing
		appStore: {
			type: 'png',
			name: 'AppStore',
			sizes: [1024],
		},
		iphone: {
			type: 'png',
			name: 'iPhone-{{dims}}',
			sizes: [180, 120, 87],
		},
	},
};

// Android Configuration with full type safety
const androidConfig: IconzConfig.Android = {
	input: './logo.svg',
	output: './android/app/src/main/res',
	icons: {
		// TypeScript will show you valid icon names: playStore, launcher, adaptiveForeground, etc.
		playStore: {
			type: 'png',
			name: 'ic_launcher',
			sizes: [512],
		},
		launcher: {
			type: 'png',
			name: 'mipmap-{{dims}}/ic_launcher',
			sizes: [48, 72, 96, 144, 192],
		},
	},
};

// Windows Configuration with full type safety
const windowsConfig: IconzConfig.Windows = {
	input: './logo.svg',
	output: './windows',
	icons: {
		// TypeScript will show you valid icon names: ico, square, wide, storeLogo
		ico: {
			type: 'ico',
			name: 'app',
			sizes: [16, 32, 48, 256],
		},
		square: {
			type: 'png',
			name: 'Square{{dims}}Logo',
			sizes: [44, 71, 150, 310],
		},
	},
};

// macOS Configuration with full type safety
const macosConfig: IconzConfig.MacOS = {
	input: './logo.svg',
	output: './macos/Assets.xcassets',
	icons: {
		// TypeScript will show you valid icon names: icns, assetCatalog, document
		icns: {
			type: 'icns',
			name: 'AppIcon',
			sizes: [16, 32, 64, 128, 256, 512, 1024],
		},
	},
};

// Generate icons
async function generateAll() {
	console.log('Generating PWA icons...');
	await createIconz(pwaConfig).generate();

	console.log('Generating iOS icons...');
	await createIconz(iosConfig).generate();

	console.log('Generating Android icons...');
	await createIconz(androidConfig).generate();

	console.log('Generating Windows icons...');
	await createIconz(windowsConfig).generate();

	console.log('Generating macOS icons...');
	await createIconz(macosConfig).generate();

	console.log('All done!');
}

// Run if executed directly
if (import.meta.main) {
	generateAll().catch(console.error);
}
