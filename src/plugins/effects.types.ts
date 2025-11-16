/**
 * Effects Plugin Types
 */

import type { WatermarkPosition } from '../types/registry.types';

export interface WatermarkConfig {
	/** Watermark image path */
	image: string;
	/** Position (default: 'southeast') */
	position?: WatermarkPosition;
	/** Opacity (0-1, default: 0.3) */
	opacity?: number;
	/** Offset from edge in pixels */
	offset?: { x: number; y: number };
}

export interface ShadowConfig {
	/** Shadow blur radius (default: 10) */
	blur?: number;
	/** Shadow opacity (0-1, default: 0.5) */
	opacity?: number;
	/** Shadow color (default: black) */
	color?: { r: number; g: number; b: number };
	/** Shadow offset */
	offset?: { x: number; y: number };
}

export interface BorderConfig {
	/** Border width in pixels (default: 2) */
	width?: number;
	/** Border color */
	color?: { r: number; g: number; b: number; alpha?: number };
	/** Border radius for rounded corners (default: 0) */
	radius?: number;
}

export interface EnhancementConfig {
	/** Brightness adjustment (-100 to 100, default: 0) */
	brightness?: number;
	/** Contrast adjustment (-100 to 100, default: 0) */
	contrast?: number;
	/** Saturation adjustment (-100 to 100, default: 0) */
	saturation?: number;
	/** Sharpness (0-10, default: 0) */
	sharpness?: number;
}
