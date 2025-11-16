/**
 * Registry Types
 *
 * Extensible type definitions using TypeScript declaration merging.
 * Users can augment these interfaces to add custom presets, formats, etc.
 */

import type sharp from 'sharp';
import type { IcnsOptions, IcoOptions, Preset } from './types';

/**
 * Icon Format Registry
 *
 * Extend this interface to add custom icon formats.
 * This is the source of truth for all icon formats.
 *
 * @example
 * ```typescript
 * declare module 'iconz/types' {
 *   interface IconFormatRegistry {
 *     pdf: PdfOptions;
 *   }
 * }
 * ```
 */
export interface IconFormatRegistry {
	// Built-in formats with their Sharp option types
	png: sharp.PngOptions;
	ico: IcoOptions;
	icns: IcnsOptions;
	jpeg: sharp.JpegOptions;
	webp: sharp.WebpOptions;
	avif: sharp.AvifOptions;
	svg: {
		pretty?: boolean;
		removeXmlDeclaration?: boolean;
		addDimensions?: boolean;
		viewBox?: string;
	};
}

/**
 * Preset Registry
 *
 * Extend this interface to add custom presets with full type safety.
 *
 * @example
 * ```typescript
 * declare module 'iconz/types' {
 *   interface PresetRegistry {
 *     myCustomPreset: Preset<{
 *       icon1: IconConfig<'png'>;
 *       icon2: IconConfig<'svg'>;
 *     }>;
 *   }
 * }
 * ```
 */
export interface PresetRegistry {
	// Mobile
	ios: Preset;
	iosMarketing: Preset;
	android: Preset;
	androidAdaptive: Preset;

	// Web
	pwa: Preset;
	pwaMaskable: Preset;
	pwaComplete: Preset;

	// Desktop
	windows11: Preset;
	windowsLegacy: Preset;
	windowsUniversal: Preset;
	macos: Preset;
	macosDocument: Preset;
	macosAssetCatalog: Preset;

	// Electron
	electron: Preset;
	electronBuilder: Preset;
	electronForge: Preset;

	// Browser Extensions
	chromeExtension: Preset;
	chromeExtensionComplete: Preset;
	edgeExtension: Preset;
	firefoxExtension: Preset;
	universalExtension: Preset;
}

/**
 * Plugin Registry
 *
 * Extend this interface to register custom plugins for better autocomplete.
 *
 * @example
 * ```typescript
 * declare module 'iconz/types' {
 *   interface PluginRegistry {
 *     myPlugin: Plugin<MyPluginConfig, sharp.Sharp>;
 *   }
 * }
 * ```
 */
// biome-ignore lint/suspicious/noEmptyInterface: Empty interface is intentional for TypeScript declaration merging
export interface PluginRegistry {
	// Users can augment this interface to register custom plugins
}

/**
 * Helper type to get preset names from registry
 */
export type PresetName = keyof PresetRegistry;

/**
 * Helper type to get icon format names from registry
 */
export type IconFormatName = keyof IconFormatRegistry;

/**
 * Helper type to get plugin names from registry
 */
export type PluginName = keyof PluginRegistry;

/**
 * Watermark Position Registry
 *
 * Extend this interface to add custom watermark positions.
 *
 * @example
 * ```typescript
 * declare module 'iconz/types' {
 *   interface WatermarkPositionRegistry {
 *     'top-left': true;
 *     'top-right': true;
 *   }
 * }
 * ```
 */
export interface WatermarkPositionRegistry {
	center: true;
	north: true;
	northeast: true;
	east: true;
	southeast: true;
	south: true;
	southwest: true;
	west: true;
	northwest: true;
}

/**
 * Composite Format Registry
 *
 * Maps formats that require intermediate formats for generation.
 * For example, ICO and ICNS are generated from PNG buffers.
 *
 * @example
 * ```typescript
 * declare module 'iconz/types' {
 *   interface CompositeFormatRegistry {
 *     svg: 'png';  // SVG generated from PNG
 *   }
 * }
 * ```
 */
export interface CompositeFormatRegistry {
	ico: 'png';
	icns: 'png';
}

/**
 * Helper type to get watermark position names from registry
 */
export type WatermarkPosition = keyof WatermarkPositionRegistry;

/**
 * Helper type to check if a format is composite
 */
export type CompositeFormat = keyof CompositeFormatRegistry;

/**
 * Helper type to get the intermediate format for a composite format
 */
export type IntermediateFormat<T extends CompositeFormat> = CompositeFormatRegistry[T];

/**
 * Format Processing Options Registry
 *
 * Maps formats to their Sharp processing options.
 * Users can extend this to define custom format processing.
 *
 * @example
 * ```typescript
 * declare module 'iconz/types' {
 *   interface FormatProcessingRegistry {
 *     svg: { pretty?: boolean };
 *   }
 * }
 * ```
 */
export interface FormatProcessingRegistry {
	png: sharp.PngOptions;
	jpeg: sharp.JpegOptions;
	webp: sharp.WebpOptions;
	avif: sharp.AvifOptions;
	ico: sharp.PngOptions; // ICO uses PNG internally
	icns: sharp.PngOptions; // ICNS uses PNG internally
}
