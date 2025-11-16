/**
 * Config Builder Module
 *
 * Simplifies configuration with smart defaults and auto-detection.
 * Provides a fluent API for building icon configurations.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { allPresets } from '../presets';
import type { PresetName } from '../types/registry.types';
import type { IconzConfig } from '../types/types';

export class ConfigBuilder {
	private config: Partial<IconzConfig> = {};

	constructor(input?: string | Buffer) {
		if (input) {
			this.config.input = input;
		}
	}

	/**
	 * Set input image
	 */
	from(input: string | Buffer): this {
		this.config.input = input;
		return this;
	}

	/**
	 * Set output directory
	 */
	to(output: string): this {
		this.config.output = output;
		return this;
	}

	/**
	 * Use a preset (type-safe)
	 */
	use(...presetNames: PresetName[]): this {
		for (const name of presetNames) {
			const preset = allPresets[name];
			if (preset) {
				this.config.icons = { ...this.config.icons, ...preset.icons };
				this.config.options = { ...this.config.options, ...preset.options };
			}
		}
		return this;
	}

	/**
	 * Add custom icons
	 */
	addIcons(icons: IconzConfig['icons']): this {
		this.config.icons = { ...this.config.icons, ...icons };
		return this;
	}

	/**
	 * Set quality (1-100)
	 */
	quality(value: number): this {
		if (!this.config.options) this.config.options = {};
		this.config.options.quality = Math.max(1, Math.min(100, value));
		return this;
	}

	/**
	 * Enable high quality mode
	 */
	highQuality(): this {
		return this.quality(100);
	}

	/**
	 * Enable balanced mode (good quality, smaller files)
	 */
	balanced(): this {
		return this.quality(90);
	}

	/**
	 * Enable fast mode (lower quality, fastest generation)
	 */
	fast(): this {
		return this.quality(75);
	}

	/**
	 * Auto-detect presets based on project structure
	 */
	autoDetect(): this {
		const cwd = process.cwd();

		// Detect package.json for web projects
		if (existsSync(join(cwd, 'package.json'))) {
			const pkg = require(join(cwd, 'package.json'));

			// PWA detection
			if (pkg.dependencies?.['workbox-webpack-plugin'] || existsSync(join(cwd, 'manifest.json'))) {
				this.use('pwa');
			}

			// React Native detection
			if (pkg.dependencies?.['react-native']) {
				this.use('ios', 'android');
			}

			// Electron detection
			if (pkg.dependencies?.electron) {
				this.use('windows11', 'macos');
			}
		}

		// Detect iOS project
		if (existsSync(join(cwd, 'ios'))) {
			this.use('ios');
		}

		// Detect Android project
		if (existsSync(join(cwd, 'android'))) {
			this.use('android');
		}

		// Default to PWA if nothing detected
		if (!this.config.icons || Object.keys(this.config.icons).length === 0) {
			this.use('pwa');
		}

		return this;
	}

	/**
	 * Build the configuration
	 */
	build(): IconzConfig {
		if (!this.config.input) {
			throw new Error('Input image is required. Use .from(path)');
		}
		if (!this.config.output) {
			this.config.output = './icons';
		}
		return this.config as IconzConfig;
	}
}

/**
 * Create a new config builder
 */
export function createConfig(input?: string | Buffer): ConfigBuilder {
	return new ConfigBuilder(input);
}

/**
 * Quick setup helpers
 */
export const quick = {
	/**
	 * PWA setup
	 */
	pwa: (input: string | Buffer, output = './public'): IconzConfig => {
		return createConfig(input).to(output).use('pwaComplete').balanced().build();
	},

	/**
	 * iOS setup
	 */
	ios: (input: string | Buffer, output = './ios/Assets.xcassets'): IconzConfig => {
		return createConfig(input).to(output).use('ios').highQuality().build();
	},

	/**
	 * Android setup
	 */
	android: (input: string | Buffer, output = './android/app/src/main/res'): IconzConfig => {
		return createConfig(input).to(output).use('android', 'androidAdaptive').highQuality().build();
	},

	/**
	 * All platforms
	 */
	all: (input: string | Buffer, output = './icons'): IconzConfig => {
		return createConfig(input)
			.to(output)
			.use('ios', 'android', 'pwaComplete', 'windows11', 'macos')
			.balanced()
			.build();
	},

	/**
	 * Auto-detect project type and configure
	 */
	auto: (input: string | Buffer, output?: string): IconzConfig => {
		const builder = createConfig(input);
		if (output) builder.to(output);
		return builder.autoDetect().balanced().build();
	},
};
