/**
 * Template Parser Module
 *
 * Provides template variable parsing for dynamic filename generation.
 * Supports Handlebars-style {{variable}} syntax with nested object access.
 */

import type sharp from 'sharp';
import type { TemplateVariables } from '../types/types';

/**
 * Parse a template string with variables
 */
export function parseTemplate(template: string, variables: Partial<TemplateVariables>): string {
	let result = template;
	const regex = /\{\{([^}]+)\}\}/g;

	let match: RegExpExecArray | null;
	// biome-ignore lint: We need to use exec in a loop
	while ((match = regex.exec(template)) !== null) {
		const path = match[1]?.trim();
		if (!path) continue;

		const value = getNestedValue(variables, path);
		if (value !== undefined) {
			result = result.replace(match[0] ?? '', String(value));
		}
	}

	return result;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
	const parts = path.split('.');
	let current: unknown = obj;

	for (const part of parts) {
		if (current === null || current === undefined) return undefined;
		if (typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}

	return current;
}

/**
 * Create date variables from a Date object
 */
export function createDateVariables(date: Date = new Date()): TemplateVariables['date'] {
	const pad = (num: number, size = 2): string => String(num).padStart(size, '0');

	return {
		year: String(date.getFullYear()),
		month: pad(date.getMonth() + 1),
		day: pad(date.getDate()),
		hour: pad(date.getHours()),
		minute: pad(date.getMinutes()),
		second: pad(date.getSeconds()),
		millisecond: pad(date.getMilliseconds(), 3),
		iso: date.toISOString(),
		timestamp: date.getTime(),
	};
}

/**
 * Create template variables for an icon size
 */
export function createTemplateVariables(
	size: string | number,
	counter: number,
	meta?: sharp.Metadata,
): TemplateVariables {
	const [width, height] = typeof size === 'number' ? [size, size] : size.split('x').map(Number);

	return {
		width: width ?? 0,
		height: height ?? 0,
		dims: `${width}x${height}`,
		size,
		counter,
		date: createDateVariables(),
		meta,
		env: process.env as Record<string, string>,
	};
}
