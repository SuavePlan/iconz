#!/usr/bin/env bun

/**
 * Iconz CLI
 *
 * Command-line interface for icon generation.
 * Built with Bun for maximum performance.
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createIconz } from '../core/iconz';
import { allPresets, listPresets } from '../presets';
import type { PresetName } from '../types/registry.types';
import type { IconzConfig } from '../types/types';
import { findConfigFile, loadConfigAuto } from '../utils/config-loader';

const args = process.argv.slice(2);

// Help text
const HELP = `
Iconz - Modern Icon Generator v2.0.0

Usage:
  iconz [options]
  iconz                    Auto-detect config file and generate icons

Options:
  -i, --input <path>      Input image path (required if no config)
  -o, --output <path>     Output directory (default: current directory)
  -p, --preset <name>     Use a preset (ios, android, pwa, windows, macos, etc.)
  -c, --config <path>     Load configuration from file (.js, .ts, .json)
  --list-presets          List all available presets
  --stdin                 Read image from stdin
  -h, --help              Show this help message

Examples:
  # Auto-detect config file (.iconz.ts, .iconz.js, etc.)
  iconz

  # Generate PWA icons
  iconz -i logo.svg -o ./public -p pwa

  # Use specific config file
  iconz -c ./.iconz.js

  # Multiple presets
  iconz -i logo.svg -p ios,android,pwa

  # From stdin
  cat logo.svg | iconz --stdin -o ./icons -p pwa

Config Files:
  Automatically detects: .iconz.{ts,js,mjs,json}, .iconzrc{.json,}

Available presets:
  ${listPresets().join(', ')}

For more information, visit: https://github.com/SuavePlan/iconz
`;

async function main() {
	try {
		// Show help
		if (args.includes('-h') || args.includes('--help')) {
			console.log(HELP);
			process.exit(0);
		}

		// List presets
		if (args.includes('--list-presets')) {
			console.log('Available presets:\n');
			for (const [name, preset] of Object.entries(allPresets)) {
				console.log(`  ${name.padEnd(20)} ${preset.description}`);
			}
			process.exit(0);
		}

		// Auto-load config if no arguments provided
		let config: IconzConfig | null = null;
		if (args.length === 0) {
			const configPath = findConfigFile();
			if (configPath) {
				console.log(`Found config: ${configPath}`);
				config = await loadConfigAuto();
			} else {
				console.log(HELP);
				process.exit(0);
			}
		} else {
			// Parse arguments
			config = await parseArgs(args);
		}

		// Validate input
		if (!config || !config.input) {
			console.error('Error: Input image is required. Use -i or --stdin, or create a config file');
			process.exit(1);
		}

		// Create and run iconz
		console.log('Generating icons...');
		const iconz = createIconz(config);
		const report = await iconz.generate();

		// Print report
		console.log('\nGeneration complete!\n');
		console.log(`Total:    ${report.stats.total}`);
		console.log(`Success:  ${report.stats.success}`);
		console.log(`Failed:   ${report.stats.failed}`);
		console.log(`Duration: ${report.stats.duration}ms\n`);

		// Show generated icons
		if (report.stats.success > 0) {
			console.log('Generated icons:');
			for (const [name, icons] of Object.entries(report.icons)) {
				console.log(`  ${name}:`);
				for (const icon of icons) {
					const size = `${icon.dimensions.width}x${icon.dimensions.height}`;
					console.log(`    - ${icon.path} (${size})`);
				}
			}
		}

		// Show failures
		if (report.failed.length > 0) {
			console.log('\nFailed:');
			for (const failure of report.failed) {
				console.error(`  - ${failure.config}: ${failure.error}`);
			}
		}

		process.exit(report.stats.failed > 0 ? 1 : 0);
	} catch (error) {
		console.error('Error:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

async function parseArgs(args: string[]): Promise<IconzConfig> {
	let config: Partial<IconzConfig> = {};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		switch (arg) {
			case '-i':
			case '--input':
				config.input = args[++i] ?? '';
				break;

			case '-o':
			case '--output':
				config.output = args[++i] ?? '.';
				break;

			case '-p':
			case '--preset': {
				const presetNames = (args[++i] ?? '').split(',');
				for (const name of presetNames) {
					const trimmedName = name.trim() as PresetName;
					const preset = allPresets[trimmedName];
					if (preset) {
						config.icons = { ...config.icons, ...preset.icons };
						config.options = { ...config.options, ...preset.options };
					} else {
						console.warn(`Warning: Unknown preset "${name}"`);
					}
				}
				break;
			}

			case '-c':
			case '--config': {
				const configPath = resolve(args[++i] ?? '');
				if (!existsSync(configPath)) {
					throw new Error(`Config file not found: ${configPath}`);
				}
				const loadedConfig = await import(configPath);
				config = { ...config, ...(loadedConfig.default || loadedConfig) };
				break;
			}

			case '--stdin': {
				// Read from stdin
				const chunks: Uint8Array[] = [];
				for await (const chunk of process.stdin) {
					chunks.push(chunk);
				}
				config.input = Buffer.concat(chunks);
				break;
			}
		}
	}

	// Set defaults
	if (!config.output) {
		config.output = '.';
	}

	// Validate input
	if (config.input && typeof config.input === 'string' && !existsSync(config.input)) {
		throw new Error(`Input file not found: ${config.input}`);
	}

	return config as IconzConfig;
}

main();
