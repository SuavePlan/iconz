/**
 * Config Loader Module
 *
 * Automatically detects and loads iconz configuration files.
 * Supports: .iconz.{ts,js,mjs,json}, .iconzrc.json, .iconzrc
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { IconzConfig } from '../types/types';

const CONFIG_FILES = [
	'.iconz.ts',
	'.iconz.js',
	'.iconz.mjs',
	'.iconz.json',
	'.iconzrc.json',
	'.iconzrc',
];

/**
 * Find config file in the specified directory
 */
export function findConfigFile(cwd = process.cwd()): string | null {
	for (const file of CONFIG_FILES) {
		const path = join(cwd, file);
		if (existsSync(path)) {
			return path;
		}
	}
	return null;
}

/**
 * Load config from file
 */
export async function loadConfig(path: string): Promise<IconzConfig> {
	// For TypeScript/JavaScript files, use dynamic import
	if (path.endsWith('.ts') || path.endsWith('.js') || path.endsWith('.mjs')) {
		const module = await import(path);
		return module.default || module;
	}

	// For JSON files, parse directly
	if (path.endsWith('.json') || path.endsWith('.iconzrc')) {
		const content = await readFile(path, 'utf-8');
		return JSON.parse(content) as IconzConfig;
	}

	throw new Error(`Unsupported config file type: ${path}`);
}

/**
 * Auto-detect and load config from current directory
 */
export async function loadConfigAuto(cwd = process.cwd()): Promise<IconzConfig | null> {
	const configPath = findConfigFile(cwd);
	if (!configPath) {
		return null;
	}
	return loadConfig(configPath);
}
