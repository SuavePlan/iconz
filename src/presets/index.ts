/**
 * Presets Module
 *
 * Export all modern icon presets for various platforms (2024-2025 specs)
 */

export * from './android';
export * from './chrome-extension';
export * from './electron';
export * from './ios';
export * from './macos';
export * from './pwa';
export * from './windows';

import type { PresetName, PresetRegistry } from '../types/registry.types';
import { androidAdaptivePreset, androidPreset } from './android';
import {
	chromeExtensionCompletePreset,
	chromeExtensionPreset,
	edgeExtensionPreset,
	firefoxExtensionPreset,
	universalExtensionPreset,
} from './chrome-extension';
import { electronBuilderPreset, electronForgePreset, electronPreset } from './electron';
import { iosMarketingPreset, iosPreset } from './ios';
import { macosAssetCatalogPreset, macosDocumentPreset, macosPreset } from './macos';
import { pwaCompletePreset, pwaMaskablePreset, pwaPreset } from './pwa';
import { windows11Preset, windowsLegacyPreset, windowsUniversalPreset } from './windows';

/**
 * Registry of all available presets.
 * Typed using PresetRegistry for extensibility.
 */
export const allPresets: PresetRegistry = {
	// Mobile
	ios: iosPreset,
	iosMarketing: iosMarketingPreset,
	android: androidPreset,
	androidAdaptive: androidAdaptivePreset,

	// Web
	pwa: pwaPreset,
	pwaMaskable: pwaMaskablePreset,
	pwaComplete: pwaCompletePreset,

	// Desktop
	windows11: windows11Preset,
	windowsLegacy: windowsLegacyPreset,
	windowsUniversal: windowsUniversalPreset,
	macos: macosPreset,
	macosDocument: macosDocumentPreset,
	macosAssetCatalog: macosAssetCatalogPreset,

	// Electron
	electron: electronPreset,
	electronBuilder: electronBuilderPreset,
	electronForge: electronForgePreset,

	// Browser Extensions
	chromeExtension: chromeExtensionPreset,
	chromeExtensionComplete: chromeExtensionCompletePreset,
	edgeExtension: edgeExtensionPreset,
	firefoxExtension: firefoxExtensionPreset,
	universalExtension: universalExtensionPreset,
};

/**
 * Get preset by name (type-safe)
 */
export function getPreset<K extends PresetName>(name: K): PresetRegistry[K] | undefined {
	return allPresets[name];
}

/**
 * List all available preset names
 */
export function listPresets(): PresetName[] {
	return Object.keys(allPresets) as PresetName[];
}

/**
 * Register a custom preset
 *
 * @example
 * ```typescript
 * const myPreset = {
 *   name: 'custom',
 *   description: 'My custom preset',
 *   icons: { ... }
 * };
 *
 * registerPreset('myCustom', myPreset);
 * ```
 */
export function registerPreset<K extends string>(
	name: K,
	preset: PresetRegistry[K & PresetName] extends never
		? PresetRegistry[PresetName]
		: PresetRegistry[K & PresetName],
): void {
	(allPresets as unknown as Record<string, PresetRegistry[PresetName]>)[name] = preset;
}
