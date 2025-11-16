/**
 * Core Types and Interfaces for Iconz
 *
 * This module defines all core types using TypeScript generics for maximum type safety
 * and extensibility. It supports custom icon types, formats, and plugin systems.
 */

import type sharp from 'sharp';
import type { IconFormatRegistry } from './registry.types';

// Re-export IconFormatRegistry for external use
export type { IconFormatRegistry } from './registry.types';

// ============================================================================
// Base Types
// ============================================================================

/**
 * Icon format types - derived from IconFormatRegistry
 * Automatically includes custom formats when users extend the registry
 */
export type IconFormat = keyof IconFormatRegistry;

export type IconSize = number | `${number}x${number}`;

export interface Dimensions {
	width: number;
	height: number;
}

// ============================================================================
// Generic Configuration Types
// ============================================================================

/**
 * Generic icon configuration that can be extended by specific icon types
 */
export interface IconConfig<T extends IconFormat = IconFormat> {
	/** Icon format type */
	type: T;
	/** Output filename (supports template variables) */
	name: string;
	/** Icon sizes to generate */
	sizes: IconSize[];
	/** Output folder relative to base output */
	folder?: string;
	/** Enable/disable this configuration */
	enabled?: boolean;
	/** Custom options for this icon type */
	options?: IconTypeOptions<T>;
}

/**
 * Type-specific options - derived from IconFormatRegistry
 * Automatically provides correct types when users extend the registry
 */
export type IconTypeOptions<T extends IconFormat> = IconFormatRegistry[T];

export interface IcoOptions {
	/** Include sizes for Windows 11 high-DPI displays */
	highDpi?: boolean;
}

export interface IcnsOptions {
	/** Include Retina (@2x) variants */
	retina?: boolean;
}

// ============================================================================
// Processing Options
// ============================================================================

export interface ProcessingOptions {
	/** Sharp input options */
	input?: sharp.SharpOptions;
	/** Resize options */
	resize?: sharp.ResizeOptions;
	/** Default output format */
	format?: IconFormat;
	/** Quality for lossy formats (1-100) */
	quality?: number;
}

// ============================================================================
// Preset System
// ============================================================================

/**
 * Generic preset that can be extended with custom icon configurations
 */
export interface Preset<T extends Record<string, IconConfig> = Record<string, IconConfig>> {
	/** Preset name */
	name: string;
	/** Preset description */
	description: string;
	/** Icon configurations */
	icons: T;
	/** Default processing options */
	options?: ProcessingOptions;
}

// ============================================================================
// Plugin System
// ============================================================================

export interface PluginContext<TConfig = unknown> {
	/** User configuration */
	config: TConfig;
	/** Input image buffer */
	buffer: Buffer;
	/** Sharp instance */
	image: sharp.Sharp;
}

export interface Plugin<TConfig = unknown, TResult = unknown> {
	/** Plugin name */
	name: string;
	/** Plugin version */
	version?: string;
	/** Initialize plugin with configuration */
	setup?: (config: TConfig) => Promise<void> | void;
	/** Execute plugin */
	execute: (context: PluginContext<TConfig>) => Promise<TResult> | TResult;
	/** Cleanup plugin resources */
	teardown?: () => Promise<void> | void;
}

// ============================================================================
// Template Variables
// ============================================================================

export interface TemplateVariables {
	/** Width of the icon */
	width: number;
	/** Height of the icon */
	height: number;
	/** Dimensions as WxH */
	dims: string;
	/** Original size spec */
	size: string | number;
	/** Incremental counter */
	counter: number;
	/** Date variables */
	date: DateVariables;
	/** Image metadata */
	meta?: sharp.Metadata;
	/** Environment variables */
	env: Record<string, string | undefined>;
}

export interface DateVariables {
	year: string;
	month: string;
	day: string;
	hour: string;
	minute: string;
	second: string;
	millisecond: string;
	iso: string;
	timestamp: number;
}

// ============================================================================
// Generation Results
// ============================================================================

export interface GeneratedIcon {
	/** Output path */
	path: string;
	/** Icon format */
	format: IconFormat;
	/** Icon dimensions */
	dimensions: Dimensions;
	/** File size in bytes */
	size: number;
}

export interface GenerationReport<
	T extends Record<string, IconConfig> = Record<string, IconConfig>,
> {
	/** Successfully generated icons by config name */
	icons: Record<keyof T, GeneratedIcon[]>;
	/** Failed generations */
	failed: Array<{
		config: keyof T;
		error: string;
		size?: IconSize;
	}>;
	/** Temporary files created */
	temp: string[];
	/** Generation statistics */
	stats: {
		total: number;
		success: number;
		failed: number;
		duration: number;
	};
}

// ============================================================================
// Main Configuration
// ============================================================================

export interface IconzConfig<T extends Record<string, IconConfig> = Record<string, IconConfig>> {
	/** Input image path or buffer */
	input: string | Buffer;
	/** Output directory */
	output: string;
	/** Temporary directory (optional) */
	temp?: string;
	/** Icon configurations */
	icons?: T;
	/** Processing options */
	options?: ProcessingOptions;
	/** Plugins to apply */
	plugins?: Plugin[];
	/** Clean temporary files after generation */
	cleanTemp?: boolean;
}

/**
 * Preset-specific configuration types namespace
 * Provides typed configurations for each platform preset.
 *
 * @example
 * ```typescript
 * const config: IconzConfig.PWA = {
 *   input: './logo.svg',
 *   output: './public',
 *   icons: {
 *     standard: { type: 'png', name: 'icon-{{dims}}', sizes: [192, 512] }
 *   }
 * };
 * ```
 */
export namespace IconzConfig {
	export type PWA = IconzConfig<{
		standard?: IconConfig<'png'>;
		maskable?: IconConfig<'png'>;
		favicon?: IconConfig<'ico'>;
		appleTouchIcon?: IconConfig<'png'>;
	}>;

	export type iOS = IconzConfig<{
		appStore?: IconConfig<'png'>;
		iphone?: IconConfig<'png'>;
		ipad?: IconConfig<'png'>;
		marketing?: IconConfig<'png'>;
	}>;

	export type Android = IconzConfig<{
		playStore?: IconConfig<'png'>;
		launcher?: IconConfig<'png'>;
		adaptiveForeground?: IconConfig<'png'>;
		adaptiveBackground?: IconConfig<'png'>;
		monochrome?: IconConfig<'png'>;
	}>;

	export type Windows11 = IconzConfig<{
		ico?: IconConfig<'ico'>;
		square?: IconConfig<'png'>;
		wide?: IconConfig<'png'>;
		storeLogo?: IconConfig<'png'>;
	}>;

	export type Windows = Windows11;

	export type MacOS = IconzConfig<{
		icns?: IconConfig<'icns'>;
		assetCatalog?: IconConfig<'png'>;
		document?: IconConfig<'icns'>;
	}>;
}

// ============================================================================
// Type Guards and Utilities
// ============================================================================

export function isIconSize(value: unknown): value is IconSize {
	if (typeof value === 'number') return value > 0;
	if (typeof value === 'string') {
		return /^\d+x\d+$/.test(value);
	}
	return false;
}

export function parseDimensions(size: IconSize): Dimensions {
	if (typeof size === 'number') {
		return { width: size, height: size };
	}
	const [width, height] = size.split('x').map(Number);
	return { width: width ?? 0, height: height ?? 0 };
}
