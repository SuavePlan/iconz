/**
 * Format Registry Module
 *
 * Runtime registries for format-specific functionality.
 * Allows users to register custom format generators and validators.
 */

import type sharp from 'sharp';
import type { GeneratedIcon, IconConfig, IconFormat, IconSize } from '../types/types';

/**
 * Generator function type for icon formats
 * Uses IconConfig without type parameter to accept any format
 */
export type FormatGeneratorFn = (
	buffers: Map<IconSize, Buffer>,
	config: IconConfig,
	options: { outputDir: string; counter: number },
) => Promise<GeneratedIcon | GeneratedIcon[]>;

/**
 * Validator function type for icon formats
 */
export type FormatValidatorFn = (sizes: IconSize[]) => boolean;

/**
 * Runtime registry for format generators
 * Maps format names to their generator functions
 */
const formatGenerators = new Map<IconFormat, FormatGeneratorFn>();

/**
 * Runtime registry for format validators
 * Maps format names to their validator functions
 */
const formatValidators = new Map<IconFormat, FormatValidatorFn>();

/**
 * Runtime registry for composite formats
 * Maps composite formats to their intermediate formats
 */
const compositeFormats = new Map<IconFormat, IconFormat>();

/**
 * Register a format generator function
 *
 * @example
 * ```typescript
 * registerFormatGenerator('svg', async (buffers, config, options) => {
 *   // Generate SVG icons
 *   return generatedIcons;
 * });
 * ```
 */
export function registerFormatGenerator(format: IconFormat, generator: FormatGeneratorFn): void {
	formatGenerators.set(format, generator);
}

/**
 * Get format generator function
 */
export function getFormatGenerator(format: IconFormat): FormatGeneratorFn | undefined {
	return formatGenerators.get(format);
}

/**
 * Register a format validator function
 *
 * @example
 * ```typescript
 * registerFormatValidator('svg', (sizes) => {
 *   // Validate SVG icon sizes
 *   return true;
 * });
 * ```
 */
export function registerFormatValidator(format: IconFormat, validator: FormatValidatorFn): void {
	formatValidators.set(format, validator);
}

/**
 * Get format validator function
 */
export function getFormatValidator(format: IconFormat): FormatValidatorFn | undefined {
	return formatValidators.get(format);
}

/**
 * Register a composite format mapping
 * Composite formats are generated from intermediate formats (e.g., ICO from PNG)
 *
 * @example
 * ```typescript
 * registerCompositeFormat('icns', 'png');
 * ```
 */
export function registerCompositeFormat(format: IconFormat, intermediateFormat: IconFormat): void {
	compositeFormats.set(format, intermediateFormat);
}

/**
 * Get intermediate format for a composite format
 */
export function getIntermediateFormat(format: IconFormat): IconFormat | undefined {
	return compositeFormats.get(format);
}

/**
 * Check if a format is composite
 */
export function isCompositeFormat(format: IconFormat): boolean {
	return compositeFormats.has(format);
}

/**
 * List all registered format generators
 */
export function listFormatGenerators(): IconFormat[] {
	return Array.from(formatGenerators.keys());
}

/**
 * List all registered format validators
 */
export function listFormatValidators(): IconFormat[] {
	return Array.from(formatValidators.keys());
}

/**
 * List all registered composite formats
 */
export function listCompositeFormats(): IconFormat[] {
	return Array.from(compositeFormats.keys());
}

/**
 * Runtime registry for format processing options
 * Maps format names to their Sharp processing options
 */
const formatProcessingOptions = new Map<IconFormat, unknown>();

/**
 * Register format processing options
 * Defines how Sharp should process a specific format
 *
 * @example
 * ```typescript
 * registerFormatProcessingOptions('png', {
 *   compressionLevel: 9,
 *   quality: 100
 * });
 * ```
 */
export function registerFormatProcessingOptions<T = unknown>(format: IconFormat, options: T): void {
	formatProcessingOptions.set(format, options);
}

/**
 * Get format processing options
 */
export function getFormatProcessingOptions<T = unknown>(format: IconFormat): T | undefined {
	return formatProcessingOptions.get(format) as T | undefined;
}

/**
 * List all registered format processing options
 */
export function listFormatProcessingOptions(): IconFormat[] {
	return Array.from(formatProcessingOptions.keys());
}

/**
 * Format converter function type
 * Converts a Sharp instance to a specific format
 */
export type FormatConverterFn = (
	instance: sharp.Sharp,
	options: unknown,
	quality?: number,
) => sharp.Sharp;

/**
 * Runtime registry for format converters
 * Maps format names to their Sharp converter functions
 */
const formatConverters = new Map<IconFormat, FormatConverterFn>();

/**
 * Register a format converter function
 * Defines how to convert Sharp instance to a specific format
 *
 * @example
 * ```typescript
 * registerFormatConverter('png', (instance, options) => {
 *   return instance.png(options);
 * });
 * ```
 */
export function registerFormatConverter(format: IconFormat, converter: FormatConverterFn): void {
	formatConverters.set(format, converter);
}

/**
 * Get format converter function
 */
export function getFormatConverter(format: IconFormat): FormatConverterFn | undefined {
	return formatConverters.get(format);
}

/**
 * List all registered format converters
 */
export function listFormatConverters(): IconFormat[] {
	return Array.from(formatConverters.keys());
}
