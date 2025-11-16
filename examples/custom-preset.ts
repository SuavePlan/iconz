/**
 * Example: Creating and registering a custom preset
 *
 * This example shows how to extend Iconz with your own presets
 * using TypeScript declaration merging for full type safety.
 */

import { createIconz, type IconConfig, type Preset, registerPreset } from '../src/iconz';

// Step 1: Define your custom preset
const gamingPreset: Preset<{
	steam: IconConfig<'png'>;
	discord: IconConfig<'png'>;
	twitch: IconConfig<'png'>;
}> = {
	name: 'gaming',
	description: 'Gaming platform icons (Steam, Discord, Twitch)',
	icons: {
		steam: {
			type: 'png',
			name: 'steam-{{dims}}',
			sizes: [32, 64, 128, 256],
			folder: 'steam',
		},
		discord: {
			type: 'png',
			name: 'discord-{{dims}}',
			sizes: [16, 32, 64, 128, 256, 512],
			folder: 'discord',
		},
		twitch: {
			type: 'png',
			name: 'twitch-{{dims}}',
			sizes: [28, 50, 70, 150, 300],
			folder: 'twitch',
		},
	},
	options: {
		quality: 95,
	},
};

// Step 2: Extend the PresetRegistry interface
// This gives you full type safety when using your preset!
declare module '../src/types/registry.types' {
	interface PresetRegistry {
		gaming: typeof gamingPreset;
	}
}

// Step 3: Register your preset
registerPreset('gaming', gamingPreset);

// Step 4: Use your preset with full type safety!
const config = createIconz({
	input: './logo.svg',
	output: './icons',
	// TypeScript now knows 'gaming' is a valid preset!
	...gamingPreset,
});

// Or use it with the config builder
import { createConfig } from '../src/iconz';

const _config2 = createConfig('./logo.svg')
	.to('./icons')
	.use('gaming') // ✓ TypeScript autocomplete shows 'gaming'!
	.highQuality()
	.build();

// Generate icons
async function generate() {
	const report = await config.generate();
	console.log(`Generated ${report.stats.success} gaming platform icons!`);
}

if (import.meta.main) {
	generate().catch(console.error);
}
