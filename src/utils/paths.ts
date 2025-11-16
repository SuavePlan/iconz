/**
 * Path Utilities Module
 *
 * Cross-platform path handling utilities for icon generation.
 * Handles absolute/relative paths, temporary directories, and output structure.
 */

import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join, resolve, sep } from 'node:path';

/**
 * Resolve an output path relative to input or as absolute
 */
export function resolveOutputPath(output: string, input: string, addInputDir = true): string {
	if (isAbsolute(output)) {
		return output;
	}

	const parts: string[] = [];

	if (addInputDir) {
		const inputDir = input.split(sep).slice(0, -1).join(sep);
		if (inputDir && !isAbsolute(inputDir)) {
			parts.push(process.cwd());
		}
		if (inputDir) {
			parts.push(inputDir);
		}
	} else {
		parts.push(process.cwd());
	}

	parts.push(output);
	return resolve(...parts);
}

/**
 * Create a temporary directory for icon generation
 */
export async function createTempDir(prefix = 'iconz-'): Promise<string> {
	const tempPath = join(tmpdir(), `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}`);
	await mkdir(tempPath, { recursive: true });
	return tempPath;
}

/**
 * Ensure a directory exists, creating it if needed
 */
export async function ensureDir(path: string): Promise<void> {
	if (!existsSync(path)) {
		await mkdir(path, { recursive: true });
	}
}

/**
 * Clean up temporary directory and its contents
 */
export async function cleanTempDir(path: string): Promise<void> {
	if (existsSync(path) && path.includes('iconz-')) {
		await rm(path, { recursive: true, force: true });
	}
}

/**
 * Validate input path exists
 */
export function validateInputPath(input: string): boolean {
	return existsSync(input);
}

/**
 * Get file extension from path
 */
export function getExtension(path: string): string {
	const parts = path.split('.');
	return parts[parts.length - 1]?.toLowerCase() ?? '';
}
